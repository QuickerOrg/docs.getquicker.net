#!/usr/bin/env node
/**
 * Pull a getquicker shared action and write StepWire JSON.
 *
 *   node tools/example-actions/pull-shared-action.mjs <code-or-url>
 *   node tools/example-actions/pull-shared-action.mjs --from-md docs/v2/xaction/modules/basic/userinput.md
 *   node tools/example-actions/pull-shared-action.mjs --write-registry
 */
import {mkdirSync, readdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  convertSharedActionDto,
  extractSharedCode,
  sharedActionUrl,
} from './convert-shared-action.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const examplesDir = path.join(repoRoot, 'data', 'step-render', 'examples');
const DEFAULT_SOFT = process.env.QUICKER_SOFT_VERSION || '1.44.0';

function parseArgs(argv) {
  const out = {codes: [], fromMd: [], writeRegistry: false, dryRun: false, help: false};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--write-registry') out.writeRegistry = true;
    else if (arg === '--dry-run') out.dryRun = true;
    else if (arg === '--from-md') out.fromMd.push(argv[++i] ?? '');
    else if (!arg.startsWith('-')) out.codes.push(arg);
  }
  return out;
}

function codesFromMarkdown(file) {
  const text = readFileSync(file, 'utf8');
  const found = [];
  const re =
    /getquicker\.net\/(?:Sharedaction|sharedaction)\?code=([0-9a-f-]{36})/gi;
  let match;
  while ((match = re.exec(text))) {
    const code = match[1].toLowerCase();
    if (!found.includes(code)) found.push(code);
  }
  return found;
}

async function fetchSharedAction(code) {
  const url =
    `https://getquicker.net/api/profiles/GetSharedActionByLink` +
    `?url=${encodeURIComponent(sharedActionUrl(code))}` +
    `&softVersion=${encodeURIComponent(DEFAULT_SOFT)}` +
    `&tick=${Date.now()}`;
  const res = await fetch(url, {
    headers: {Accept: 'application/json'},
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${code}`);
  }
  const body = await res.json();
  if (!body?.isSuccess || !body.data) {
    throw new Error(body?.message || `API failed for ${code}`);
  }
  return body.data;
}

function countExamples() {
  mkdirSync(examplesDir, {recursive: true});
  return readdirSync(examplesDir).filter((name) => name.endsWith('.json')).length;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage:
  node tools/example-actions/pull-shared-action.mjs <code-or-url> [...]
  node tools/example-actions/pull-shared-action.mjs --from-md <page.md>
  node tools/example-actions/pull-shared-action.mjs --write-registry
    (compat: examples load on demand by filename; does not rewrite exampleRegistry.ts)`);
    return;
  }

  const codes = [...args.codes.map(extractSharedCode).filter(Boolean)];
  for (const file of args.fromMd) {
    const abs = path.isAbsolute(file) ? file : path.join(repoRoot, file);
    codes.push(...codesFromMarkdown(abs));
  }
  const unique = [...new Set(codes.map((c) => c.toLowerCase()))];

  if (unique.length === 0 && !args.writeRegistry) {
    console.error('No shared-action code found.');
    process.exitCode = 1;
    return;
  }

  mkdirSync(examplesDir, {recursive: true});
  const results = [];
  for (const code of unique) {
    const dto = await fetchSharedAction(code);
    const converted = convertSharedActionDto(dto);
    if (!converted.ok) {
      results.push({code, status: 'skipped', reason: converted.reason});
      continue;
    }
    const outFile = path.join(examplesDir, `${code}.json`);
    if (!args.dryRun) {
      writeFileSync(outFile, `${JSON.stringify(converted.example, null, 2)}\n`, 'utf8');
    }
    results.push({
      code,
      status: 'converted',
      title: converted.example.title,
      steps: converted.example.steps.length,
      file: path.relative(repoRoot, outFile).replaceAll('\\', '/'),
    });
  }

  if (!args.dryRun && (unique.length > 0 || args.writeRegistry)) {
    results.push({status: 'examples', count: countExamples()});
  }

  console.log(JSON.stringify({ok: true, results}, null, 2));
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
