#!/usr/bin/env node
/**
 * Persistent task ledger for screenshot -> component work.
 *
 * Current image references without a ledger entry are pending. Final decisions
 * stay addressable by the original repo-relative image path even after the MDX
 * reference has been replaced.
 *
 * Usage:
 *   node tools/screenshot-replace/task-ledger.mjs
 *   node tools/screenshot-replace/task-ledger.mjs --dir docs/v2/xaction/modules --status pending
 *   node tools/screenshot-replace/task-ledger.mjs --check
 *   node tools/screenshot-replace/task-ledger.mjs --seed-converted 4fa032b
 */
import {execFileSync} from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const defaultLedgerPath = path.join(repoRoot, 'data', 'screenshot-replace', 'decisions.json');
const reviewCatalogPath = path.join(repoRoot, 'data', 'screenshot-review', 'catalog.json');
const validStatuses = new Set(['converted', 'kept', 'deferred']);

function parseArgs(argv) {
  const args = {
    dir: 'docs/v2/xaction',
    status: 'pending',
    json: false,
    out: '',
    check: false,
    limit: 50,
    seedConverted: '',
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dir') args.dir = argv[++i] ?? args.dir;
    else if (arg === '--status') args.status = argv[++i] ?? args.status;
    else if (arg === '--json') args.json = true;
    else if (arg === '--out') args.out = argv[++i] ?? '';
    else if (arg === '--limit') args.limit = Number(argv[++i] ?? args.limit);
    else if (arg === '--check') args.check = true;
    else if (arg === '--seed-converted') args.seedConverted = argv[++i] ?? '';
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return args;
}

function toPosix(value) {
  return value.replaceAll('\\', '/');
}

function walkMarkdown(dir, files = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return files;
  }
  for (const name of entries) {
    const full = path.join(dir, name);
    let stat;
    try {
      stat = statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) {
      if (!['node_modules', 'img', '.git', 'build', '.docusaurus'].includes(name)) {
        walkMarkdown(full, files);
      }
    } else if (/\.(md|mdx)$/i.test(name)) {
      files.push(full);
    }
  }
  return files;
}

function resolveImage(page, ref) {
  if (/^https?:\/\//i.test(ref)) return '';
  const clean = ref.split(/[?#]/, 1)[0];
  if (clean.startsWith('/')) return `static/${clean.slice(1)}`;
  return toPosix(path.posix.normalize(path.posix.join(path.posix.dirname(page), clean)));
}

function scanReferences(dir) {
  const root = path.resolve(repoRoot, dir);
  const refs = [];
  for (const file of walkMarkdown(root)) {
    const page = toPosix(path.relative(repoRoot, file));
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const re = /!\[[^\]]*\]\(([^)]+\.(?:png|jpe?g|webp|gif)(?:[?#][^)]*)?)\)/gi;
      let match;
      while ((match = re.exec(line))) {
        const image = resolveImage(page, match[1]);
        if (image) refs.push({page, image, line: index + 1});
      }
    }
  }
  return refs;
}

function emptyLedger() {
  return {version: 1, updatedAt: new Date().toISOString(), items: []};
}

function readLedger() {
  if (!existsSync(defaultLedgerPath)) return emptyLedger();
  const value = JSON.parse(readFileSync(defaultLedgerPath, 'utf8'));
  return {
    version: value.version ?? 1,
    updatedAt: value.updatedAt ?? '',
    items: Array.isArray(value.items) ? value.items : [],
  };
}

function writeLedger(ledger) {
  ledger.updatedAt = new Date().toISOString();
  ledger.items.sort((a, b) => a.image.localeCompare(b.image, 'en'));
  mkdirSync(path.dirname(defaultLedgerPath), {recursive: true});
  writeFileSync(defaultLedgerPath, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
}

function validateLedger(ledger, allRefs) {
  const errors = [];
  const warnings = [];
  const seen = new Set();
  const referenced = new Set(allRefs.map((item) => item.image));
  for (const [index, item] of ledger.items.entries()) {
    const label = `items[${index}]${item.image ? ` (${item.image})` : ''}`;
    if (!item.image || typeof item.image !== 'string') errors.push(`${label}: image 必填`);
    else if (item.image.includes('\\') || path.isAbsolute(item.image)) {
      errors.push(`${label}: image 必须是仓库相对 POSIX 路径`);
    } else if (seen.has(item.image)) errors.push(`${label}: image 重复`);
    else seen.add(item.image);
    if (!item.page || typeof item.page !== 'string') errors.push(`${label}: page 必填`);
    if (!validStatuses.has(item.status)) errors.push(`${label}: status 无效`);
    if (!item.reason || typeof item.reason !== 'string') errors.push(`${label}: reason 必填`);
    if (!item.updatedAt || typeof item.updatedAt !== 'string') errors.push(`${label}: updatedAt 必填`);
    if (item.status === 'converted' && referenced.has(item.image)) {
      errors.push(`${label}: converted 图片仍被 Markdown 引用`);
    }
    if ((item.status === 'kept' || item.status === 'deferred') && !referenced.has(item.image)) {
      warnings.push(`${label}: ${item.status} 图片已不再被 Markdown 引用`);
    }
  }
  return {errors, warnings};
}

function readReviewComponents() {
  if (!existsSync(reviewCatalogPath)) return new Map();
  const catalog = JSON.parse(readFileSync(reviewCatalogPath, 'utf8'));
  return new Map(
    (catalog.items ?? [])
      .filter((item) => item.source === 'orphan' && item.image && item.component)
      .map((item) => [item.image, item.component]),
  );
}

function seedConverted(commit, ledger) {
  const diff = execFileSync(
    'git',
    ['diff', `${commit}^`, commit, '--unified=0', '--', 'docs'],
    {cwd: repoRoot, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024},
  );
  const committedAt = execFileSync('git', ['show', '-s', '--format=%cI', commit], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim();
  const shortCommit = execFileSync('git', ['rev-parse', '--short', commit], {
    cwd: repoRoot,
    encoding: 'utf8',
  }).trim();
  const components = readReviewComponents();
  const currentlyReferenced = new Set(scanReferences('docs').map((item) => item.image));
  const existing = new Set(ledger.items.map((item) => item.image));
  let page = '';
  let added = 0;
  let skippedReferenced = 0;
  for (const line of diff.split(/\r?\n/)) {
    const pageMatch = line.match(/^\+\+\+ b\/(.+)$/);
    if (pageMatch) {
      page = pageMatch[1];
      continue;
    }
    if (!page || !line.startsWith('-') || line.startsWith('---')) continue;
    const re = /!\[[^\]]*\]\(([^)]+\.(?:png|jpe?g|webp|gif))\)/gi;
    let match;
    while ((match = re.exec(line))) {
      const image = resolveImage(page, match[1]);
      if (!image || existing.has(image)) continue;
      if (currentlyReferenced.has(image)) {
        skippedReferenced += 1;
        continue;
      }
      const component = components.get(image);
      ledger.items.push({
        image,
        page,
        status: 'converted',
        ...(component ? {component} : {}),
        reason: `已在提交 ${shortCommit} 中用实时 MDX 预览替换；原图文件保留供审核。`,
        evidence: 'git-diff',
        commit: shortCommit,
        updatedAt: committedAt,
      });
      existing.add(image);
      added += 1;
    }
  }
  writeLedger(ledger);
  console.log(
    `Seeded ${added} converted decisions from ${shortCommit}; skipped ${skippedReferenced} images that are still referenced.`,
  );
}

function inScope(page, dir) {
  const normalized = toPosix(dir).replace(/\/$/, '');
  return normalized === 'docs' || page === normalized || page.startsWith(`${normalized}/`);
}

function buildTasks(args, ledger, refs) {
  const decisions = new Map(ledger.items.map((item) => [item.image, item]));
  const rows = [];
  const refsByImage = new Map();
  for (const ref of refs) {
    const group = refsByImage.get(ref.image) ?? [];
    group.push(ref);
    refsByImage.set(ref.image, group);
  }
  for (const locations of refsByImage.values()) {
    const ref = locations[0];
    const decision = decisions.get(ref.image);
    rows.push({
      ...ref,
      referenceCount: locations.length,
      references: locations,
      status: decision?.status ?? 'pending',
      ...(decision
        ? {
            kind: decision.kind,
            component: decision.component,
            reason: decision.reason,
            updatedAt: decision.updatedAt,
          }
        : {}),
    });
  }
  const currentImages = new Set(refs.map((item) => item.image));
  for (const item of ledger.items) {
    if (inScope(item.page, args.dir) && !currentImages.has(item.image)) {
      rows.push({...item, line: null, referenceCount: 0, references: []});
    }
  }
  return rows
    .filter((item) => args.status === 'all' || item.status === args.status)
    .sort(
      (a, b) =>
        a.status.localeCompare(b.status, 'en') ||
        a.page.localeCompare(b.page, 'en') ||
        a.image.localeCompare(b.image, 'en'),
    );
}

function summarize(ledger, refs, dir) {
  const referenced = new Set(refs.map((item) => item.image));
  const summary = {pending: 0, converted: 0, kept: 0, deferred: 0};
  const decided = new Set();
  for (const item of ledger.items) {
    if (!inScope(item.page, dir)) continue;
    summary[item.status] += 1;
    decided.add(item.image);
  }
  for (const image of referenced) {
    if (!decided.has(image)) summary.pending += 1;
  }
  return summary;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage:
  node tools/screenshot-replace/task-ledger.mjs [--dir docs/v2/xaction] [--status pending|converted|kept|deferred|all] [--limit 50]
  node tools/screenshot-replace/task-ledger.mjs --json [--out file.json]
  node tools/screenshot-replace/task-ledger.mjs --check
  node tools/screenshot-replace/task-ledger.mjs --seed-converted <commit>`);
    return;
  }

  const ledger = readLedger();
  if (args.seedConverted) {
    seedConverted(args.seedConverted, ledger);
    return;
  }

  const allRefs = scanReferences('docs');
  const refs = args.dir === 'docs' ? allRefs : scanReferences(args.dir);
  const validation = validateLedger(ledger, allRefs);
  if (args.check) {
    for (const warning of validation.warnings) console.warn(`WARN ${warning}`);
    for (const error of validation.errors) console.error(`ERROR ${error}`);
    console.log(
      `ledger: ${ledger.items.length} decisions, ${validation.errors.length} errors, ${validation.warnings.length} warnings`,
    );
    if (validation.errors.length) process.exitCode = 1;
    return;
  }

  const summary = summarize(ledger, refs, args.dir);
  const tasks = buildTasks(args, ledger, refs);
  const payload = {dir: args.dir, summary, status: args.status, count: tasks.length, items: tasks};
  if (args.json || args.out) {
    const json = `${JSON.stringify(payload, null, 2)}\n`;
    if (args.out) {
      const outPath = path.resolve(repoRoot, args.out);
      mkdirSync(path.dirname(outPath), {recursive: true});
      writeFileSync(outPath, json, 'utf8');
      console.log(`Wrote ${tasks.length} tasks -> ${toPosix(path.relative(repoRoot, outPath))}`);
    } else process.stdout.write(json);
    return;
  }

  console.log(
    `screenshot tasks (${args.dir}): pending ${summary.pending}, converted ${summary.converted}, kept ${summary.kept}, deferred ${summary.deferred}`,
  );
  console.log(`showing ${Math.min(tasks.length, args.limit)} / ${tasks.length} ${args.status}`);
  for (const item of tasks.slice(0, args.limit)) {
    console.log(`- [${item.status}] ${item.page}${item.line ? `:${item.line}` : ''} -> ${item.image}`);
    if (item.reason) console.log(`  ${item.reason}`);
  }
}

main();
