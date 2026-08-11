#!/usr/bin/env node
/**
 * List markdown screenshot refs for docs screenshot→component work.
 *
 * Usage:
 *   node tools/screenshot-replace/inventory.mjs
 *   node tools/screenshot-replace/inventory.mjs --dir docs/v2/xaction/concepts
 *   node tools/screenshot-replace/inventory.mjs --kind-guess --json
 */
import {mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

function parseArgs(argv) {
  const out = {dir: 'docs', json: false, kindGuess: false, out: ''};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dir') {
      out.dir = argv[++i] ?? out.dir;
    } else if (a === '--json') {
      out.json = true;
    } else if (a === '--kind-guess') {
      out.kindGuess = true;
    } else if (a === '--out') {
      out.out = argv[++i] ?? '';
    } else if (a === '--help' || a === '-h') {
      out.help = true;
    }
  }
  return out;
}

function walkMarkdown(dir, acc = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return acc;
  }
  for (const name of entries) {
    const full = path.join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'img' || name === '.git') continue;
      walkMarkdown(full, acc);
    } else if (/\.(md|mdx)$/i.test(name)) {
      acc.push(full);
    }
  }
  return acc;
}

function guessKind(imgRel, context) {
  const blob = `${imgRel}\n${context}`.toLowerCase();
  if (/\.gif(\)|$)/i.test(imgRel)) return 'decorative';
  if (/var-|变量|默认值|词典|添加\/编辑变量/.test(blob)) return 'var-def';
  if (/赋值|参数|弹窗|模块配置/.test(blob)) return 'step-param';
  if (/步骤定义|步骤列表|否则|如果|editor|basic-/.test(blob)) {
    if (/工具箱|变量定义|外观/.test(blob)) return 'editor-chrome';
    return 'steps';
  }
  if (/icon|按钮|面板/.test(blob)) return 'ui-other';
  return 'unknown';
}

function inventoryFile(filePath, kindGuess) {
  const text = readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const relPage = path.relative(repoRoot, filePath).replaceAll('\\', '/');
  const rows = [];
  const re = /!\[[^\]]*\]\((\.\/img\/[^)]+)\)/g;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(line)) !== null) {
      const imgRel = m[1];
      const ctxStart = Math.max(0, i - 4);
      const context = lines.slice(ctxStart, i + 1).join('\n');
      const headingRaw =
        [...lines.slice(0, i + 1)]
          .reverse()
          .find((l) => /^#{1,3}\s+/.test(l))
          ?.replace(/^#{1,3}\s+/, '') ?? '';
      const heading = headingRaw.replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
      const row = {
        page: relPage,
        line: i + 1,
        image: imgRel,
        heading,
      };
      if (kindGuess) {
        row.kindGuess = guessKind(imgRel, context);
      }
      rows.push(row);
    }
  }
  return rows;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(`Usage:
  node tools/screenshot-replace/inventory.mjs [--dir docs/v2/xaction/concepts] [--kind-guess] [--json] [--out file.json]`);
    process.exit(0);
  }

  const root = path.resolve(repoRoot, args.dir);
  const files = walkMarkdown(root);
  const rows = files.flatMap((f) => inventoryFile(f, args.kindGuess));

  if (args.json || args.out) {
    const payload = `${JSON.stringify(
      {
        repoRoot,
        dir: args.dir,
        pageCount: new Set(rows.map((r) => r.page)).size,
        imageCount: rows.length,
        items: rows,
      },
      null,
      2,
    )}\n`;
    if (args.out) {
      const outPath = path.resolve(repoRoot, args.out);
      mkdirSync(path.dirname(outPath), {recursive: true});
      writeFileSync(outPath, payload, 'utf8');
      console.log(`Wrote ${rows.length} items → ${path.relative(repoRoot, outPath)}`);
    } else {
      process.stdout.write(payload);
    }
    return;
  }

  console.log(`# screenshot inventory`);
  console.log(`dir: ${args.dir}`);
  console.log(`pages: ${new Set(rows.map((r) => r.page)).size}  images: ${rows.length}`);
  console.log('');
  for (const r of rows) {
    const guess = r.kindGuess ? `  [${r.kindGuess}]` : '';
    console.log(`- ${r.page}:${r.line}  ${r.image}${guess}`);
    if (r.heading) console.log(`  # ${r.heading}`);
  }
}

main();
