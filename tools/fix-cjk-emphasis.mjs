/**
 * Find / fix CommonMark emphasis that fails next to CJK punctuation.
 *
 * MDX v3 / CommonMark: `**内容：**要` does NOT bold (closing ** sits between
 * punctuation and a letter). Prefer `**内容**：要`.
 * Bracket case `**【表达式】**表示` → `**【表达式】** 表示` (space after **).
 *
 * Usage:
 *   node tools/fix-cjk-emphasis.mjs           # dry-run
 *   node tools/fix-cjk-emphasis.mjs --apply   # rewrite docs/
 *   node tools/fix-cjk-emphasis.mjs --check   # exit 1 if issues remain
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = path.join(root, 'docs');
const apply = process.argv.includes('--apply');
const check = process.argv.includes('--check');

/** CJK sentence punctuation safe to move outside **...** (not ASCII — avoids &#123; / fa: false positives). */
const SENTENCE_PUNCT = /[，。！？；：、．…—～·]/
/** Closing brackets: keep inside emphasis; insert a space after ** instead. */
const CLOSING_BRACKET = /[】）」』》\]]$/;
const AFTER_LETTER = /[\u3400-\u9fff\uf900-\ufaffa-zA-Z0-9]/

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.mdx?$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function mapOutsideFences(markdown, transformLine) {
  let inFence = false;
  return markdown
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      return inFence ? line : transformLine(line);
    })
    .join('\n');
}

/** Skip inline code spans when fixing a line. */
function mapOutsideInlineCode(line, transform) {
  const parts = line.split(/(`[^`]*`)/g);
  return parts.map((part, i) => (i % 2 === 1 ? part : transform(part))).join('');
}

function fixEmphasisChunk(text) {
  // Only strong (**); italic is rarer and easy to false-positive.
  return text.replace(/\*\*([^*\n]+?)\*\*(?=\S)/g, (full, inner, offset, src) => {
    const after = src[offset + full.length] ?? '';
    if (!AFTER_LETTER.test(after)) return full;

    let end = inner.length;
    while (end > 0 && SENTENCE_PUNCT.test(inner[end - 1])) end -= 1;

    if (end > 0 && end < inner.length) {
      const core = inner.slice(0, end);
      const punct = inner.slice(end);
      if (!core.trim()) return full;
      return `**${core}**${punct}`;
    }

    if (CLOSING_BRACKET.test(inner)) {
      return `${full} `;
    }

    return full;
  });
}

function fixLine(line) {
  return mapOutsideInlineCode(line, fixEmphasisChunk);
}

const files = walk(docsRoot);
const changes = [];

for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const after = mapOutsideFences(before, fixLine);
  if (after === before) continue;
  const rel = path.relative(root, file).replaceAll('\\', '/');
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const samples = [];
  for (let i = 0; i < beforeLines.length; i++) {
    if (beforeLines[i] !== afterLines[i]) {
      samples.push({line: i + 1, from: beforeLines[i], to: afterLines[i]});
    }
  }
  changes.push({rel, samples, after});
  if (apply) fs.writeFileSync(file, after, 'utf8');
}

if (check) {
  if (changes.length > 0) {
    console.error(
      `CJK emphasis issues in ${changes.length} file(s). Run: node tools/fix-cjk-emphasis.mjs --apply`,
    );
    for (const {rel, samples} of changes.slice(0, 10)) {
      console.error(`  ${rel} (${samples.length} line(s))`);
    }
    process.exit(1);
  }
  console.log('CJK emphasis check passed.');
  process.exit(0);
}

if (changes.length === 0) {
  console.log('No CJK emphasis fixes needed.');
  process.exit(0);
}

console.log(
  `${apply ? 'Fixed' : 'Would fix'} ${changes.length} file(s)${apply ? '' : ' (dry-run; pass --apply)'}:`,
);
for (const {rel, samples} of changes) {
  console.log(`\n${rel}`);
  for (const s of samples.slice(0, 6)) {
    console.log(`  L${s.line}`);
    console.log(`    - ${s.from}`);
    console.log(`    + ${s.to}`);
  }
  if (samples.length > 6) console.log(`  … +${samples.length - 6} more`);
}
