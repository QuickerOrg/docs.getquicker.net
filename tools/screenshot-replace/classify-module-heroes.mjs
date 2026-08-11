#!/usr/bin/env node
/**
 * Classify module-page first screenshots for batch → ModuleParamPreview.
 *
 *   node tools/screenshot-replace/classify-module-heroes.mjs
 *   node tools/screenshot-replace/classify-module-heroes.mjs --apply --limit 10
 *
 * Default is dry-run. --apply replaces only `form` heroes.
 */
import {readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const modulesDir = path.join(repoRoot, 'docs', 'v2', 'xaction', 'modules');

const PARAM_HEADING = /^(输入参数|参数说明|步骤参数|模块参数设置|参数|输出)$/;
const CONCEPT_HINT =
  /(基本的步骤定义|示例如下|效果如下|运行效果|如下图|场景)/;
const RUNTIME_EXCLUDE = new Set([
  'sys:notify', // -001 is toast result; form is -002
  'sys:if', // -001 is concept; steps are -002
  'sys:userInput', // -001 is runtime input window; form is -002
  'sys:reportProgress', // -001 gif
]);

function parseArgs(argv) {
  const out = {apply: false, limit: 0, json: false, out: '', prefix: ''};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--apply') out.apply = true;
    else if (a === '--json') out.json = true;
    else if (a === '--limit') out.limit = Number(argv[++i] ?? 0) || 0;
    else if (a === '--out') out.out = argv[++i] ?? '';
    else if (a === '--prefix') out.prefix = argv[++i] ?? '';
  }
  return out;
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name !== 'img') walk(full, acc);
    } else if (/\.mdx?$/i.test(name)) {
      acc.push(full);
    }
  }
  return acc;
}

function nextHeadingAfter(lines, imgLine) {
  for (let i = imgLine + 1; i < lines.length; i += 1) {
    const m = /^(#{2,3})\s+(.+)$/.exec(lines[i]);
    if (m) return m[2].trim();
  }
  return '';
}

function classifyPage(file) {
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  const key = /^moduleKey:\s*"([^"]+)"/m.exec(text)?.[1] ?? '';
  const rel = path.relative(repoRoot, file).replaceAll('\\', '/');
  const imgMatches = [];
  for (let i = 0; i < lines.length; i += 1) {
    const m = /!\[[^\]]*\]\((\.\/img\/[^)]+)\)/.exec(lines[i]);
    if (m) imgMatches.push({line: i, image: m[1], raw: lines[i]});
  }

  const already = /<ModuleParamPreview\b/.test(text);
  const base = {
    page: rel,
    key,
    already,
    imageCount: imgMatches.length,
  };

  if (!key) return {...base, kind: 'skip', reason: 'no-moduleKey'};
  if (already) return {...base, kind: 'done', reason: 'has-preview'};
  if (imgMatches.length === 0) return {...base, kind: 'insert', reason: 'no-image'};

  const first = imgMatches[0];
  const firstGif = /\.gif$/i.test(first.image);
  const headingAfter = nextHeadingAfter(lines, first.line);
  const ctx = lines.slice(Math.max(0, first.line - 3), first.line + 4).join('\n');

  if (RUNTIME_EXCLUDE.has(key) || firstGif) {
    return {
      ...base,
      kind: 'keep',
      reason: firstGif ? 'gif' : 'known-non-form',
      image: first.image,
      line: first.line + 1,
      headingAfter,
    };
  }

  const looksForm =
    /-001-/.test(first.image) &&
    (PARAM_HEADING.test(headingAfter) || imgMatches.length === 1) &&
    !CONCEPT_HINT.test(ctx);

  if (looksForm) {
    return {
      ...base,
      kind: 'form',
      reason: imgMatches.length === 1 ? 'single-001' : `before:${headingAfter}`,
      image: first.image,
      line: first.line + 1,
      headingAfter,
    };
  }

  return {
    ...base,
    kind: 'review',
    reason: CONCEPT_HINT.test(ctx) ? 'concept-context' : `heading:${headingAfter || '(none)'}`,
    image: first.image,
    line: first.line + 1,
    headingAfter,
  };
}

function applyReplace(file, row) {
  const text = readFileSync(file, 'utf8');
  if (row.kind === 'insert') {
    const next = text.replace(
      /(<XActionModuleMeta\s+moduleKey="[^"]+"\s*\/>)/,
      `$1\n\n<ModuleParamPreview moduleKey="${row.key}" />`,
    );
    if (next === text) return false;
    writeFileSync(file, next, 'utf8');
    return true;
  }
  if (row.kind !== 'form' || !row.image) return false;
  const escaped = row.image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`!\\[[^\\]]*\\]\\(${escaped}(?:\\s+"[^"]*")?\\)`);
  if (!re.test(text)) return false;
  const next = text.replace(re, `<ModuleParamPreview moduleKey="${row.key}" />`);
  writeFileSync(file, next, 'utf8');
  return true;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const rows = walk(modulesDir).map(classifyPage);
  const counts = {};
  for (const row of rows) {
    counts[row.kind] = (counts[row.kind] || 0) + 1;
  }

  let applied = 0;
  if (args.apply) {
    const targets = rows.filter((r) => {
      if (r.kind !== 'form' && r.kind !== 'insert') return false;
      if (args.prefix && !r.page.replaceAll('\\', '/').includes(args.prefix.replaceAll('\\', '/'))) {
        return false;
      }
      return true;
    });
    const slice = args.limit > 0 ? targets.slice(0, args.limit) : targets;
    for (const row of slice) {
      const full = path.join(repoRoot, row.page);
      if (applyReplace(full, row)) applied += 1;
    }
  }

  const payload = {
    dir: 'docs/v2/xaction/modules',
    counts,
    applied,
    apply: args.apply,
    items: rows,
  };

  if (args.out) {
    const outPath = path.resolve(repoRoot, args.out);
    writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
    console.log(`Wrote ${rows.length} rows → ${path.relative(repoRoot, outPath)}`);
  }

  if (!args.json) {
    console.log('# module hero classify');
    console.log(JSON.stringify(counts, null, 2));
    if (args.apply) console.log(`applied: ${applied}`);
    console.log('');
    for (const row of rows) {
      if (row.kind === 'done') continue;
      console.log(`- [${row.kind}] ${row.page}  ${row.key}  ${row.reason}`);
      if (row.image) console.log(`    ${row.image}`);
    }
  } else {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  }
}

main();
