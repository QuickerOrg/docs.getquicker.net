#!/usr/bin/env node
/**
 * Local review API: persist collapsed/reviewed ids + serve original screenshots.
 *
 *   node tools/screenshot-replace/review-api.mjs
 *   → http://127.0.0.1:3920
 *
 * Endpoints:
 *   GET  /api/health
 *   GET  /api/catalog          (rebuilds if ?rebuild=1)
 *   GET  /api/state
 *   PUT  /api/state            { collapsed: { [id]: { at, note? } } }
 *   PATCH /api/state/item      { id, collapsed: boolean, note?: string }
 *   GET  /api/img?path=docs/.../img/foo.png
 */
import {spawnSync} from 'node:child_process';
import {createReadStream, existsSync, mkdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dataDir = path.join(repoRoot, 'data', 'screenshot-review');
const statePath = path.join(dataDir, 'state.json');
const catalogPath = path.join(dataDir, 'catalog.json');
const PORT = Number(process.env.SCREENSHOT_REVIEW_PORT || 3920);
const HOST = process.env.SCREENSHOT_REVIEW_HOST || '127.0.0.1';

mkdirSync(dataDir, {recursive: true});

function emptyState() {
  return {updatedAt: new Date().toISOString(), collapsed: {}};
}

function readState() {
  if (!existsSync(statePath)) return emptyState();
  try {
    const raw = JSON.parse(readFileSync(statePath, 'utf8'));
    return {
      updatedAt: raw.updatedAt || new Date().toISOString(),
      collapsed: raw.collapsed && typeof raw.collapsed === 'object' ? raw.collapsed : {},
    };
  } catch {
    return emptyState();
  }
}

function writeState(state) {
  const next = {
    updatedAt: new Date().toISOString(),
    collapsed: state.collapsed || {},
  };
  writeFileSync(statePath, JSON.stringify(next, null, 2), 'utf8');
  return next;
}

function ensureCatalog(rebuild) {
  if (rebuild || !existsSync(catalogPath)) {
    const script = path.join(repoRoot, 'tools', 'screenshot-replace', 'build-review-catalog.mjs');
    const res = spawnSync(process.execPath, [script], {cwd: repoRoot, encoding: 'utf8'});
    if (res.status !== 0) {
      throw new Error(res.stderr || res.stdout || 'catalog build failed');
    }
  }
  return JSON.parse(readFileSync(catalogPath, 'utf8'));
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, body) {
  cors(res);
  res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8'});
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

function resolveSafeImage(relPath) {
  const normalized = path.normalize(relPath).replace(/^[/\\]+/, '');
  if (normalized.includes('..')) return null;
  if (!normalized.startsWith(`docs${path.sep}`) && !normalized.startsWith('docs/')) {
    // allow forward-slash form
    if (!normalized.replaceAll('\\', '/').startsWith('docs/')) return null;
  }
  const abs = path.resolve(repoRoot, normalized);
  if (!abs.startsWith(repoRoot)) return null;
  if (!/\.(png|jpe?g|webp|gif)$/i.test(abs)) return null;
  if (!existsSync(abs) || !statSync(abs).isFile()) return null;
  return abs;
}

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || '/', `http://${HOST}:${PORT}`);
    if (req.method === 'OPTIONS') {
      cors(res);
      res.writeHead(204);
      res.end();
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, {ok: true, statePath: path.relative(repoRoot, statePath)});
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/catalog') {
      const catalog = ensureCatalog(url.searchParams.get('rebuild') === '1');
      sendJson(res, 200, catalog);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/state') {
      sendJson(res, 200, readState());
      return;
    }

    if (req.method === 'PUT' && url.pathname === '/api/state') {
      const body = await readBody(req);
      const collapsed =
        body.collapsed && typeof body.collapsed === 'object' ? body.collapsed : {};
      sendJson(res, 200, writeState({collapsed}));
      return;
    }

    if (req.method === 'PATCH' && url.pathname === '/api/state/item') {
      const body = await readBody(req);
      const id = String(body.id || '');
      if (!id) {
        sendJson(res, 400, {error: 'id required'});
        return;
      }
      const state = readState();
      if (body.collapsed) {
        state.collapsed[id] = {
          at: new Date().toISOString(),
          ...(body.note ? {note: String(body.note)} : {}),
        };
      } else {
        delete state.collapsed[id];
      }
      sendJson(res, 200, writeState(state));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/img') {
      const rel = url.searchParams.get('path') || '';
      const abs = resolveSafeImage(rel);
      if (!abs) {
        sendJson(res, 404, {error: 'image not found'});
        return;
      }
      cors(res);
      const ext = path.extname(abs).toLowerCase();
      res.writeHead(200, {
        'Content-Type': MIME[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      createReadStream(abs).pipe(res);
      return;
    }

    sendJson(res, 404, {error: 'not found'});
  } catch (e) {
    sendJson(res, 500, {error: e instanceof Error ? e.message : String(e)});
  }
});

server.listen(PORT, HOST, () => {
  ensureCatalog(false);
  if (!existsSync(statePath)) writeState(emptyState());
  console.log(`screenshot review API http://${HOST}:${PORT}`);
  console.log(`state → ${path.relative(repoRoot, statePath)}`);
});
