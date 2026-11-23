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

/** CJK sentence punctuation safe to move outside **...** (not ASCII — avoids &#123; / fa: false positives). */
const SENTENCE_PUNCT = /[，。！？；：、．…—～·]/;
/** Closing brackets: keep inside emphasis; insert a space after ** instead. */
const CLOSING_BRACKET = /[】）」』》\]]$/;
const AFTER_LETTER = /[\u3400-\u9fff\uf900-\ufaffa-zA-Z0-9]/;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.mdx?$/i.test(entry.name)) out.push(full);
  }
  return out;
}

function countRun(str, index, ch) {
  let end = index;
  while (end < str.length && str[end] === ch) end += 1;
  return end - index;
}

/** Find the closing backtick run matching `tickLen` starting from `from`, or -1 if unclosed. */
function findClosingBackticks(line, from, tickLen) {
  let i = from;
  while (i < line.length) {
    if (line[i] === '`') {
      const len = countRun(line, i, '`');
      if (len === tickLen) return i + len;
      i += len;
      continue;
    }
    i += 1;
  }
  return -1;
}

/**
 * Find the matching closing `**` on the same line starting from `from`.
 * Skips inline code spans and backslash escapes. Returns -1 if unclosed or
 * if an unescaped bare `*` / `***` appears outside inline code before closing.
 */
function findClosingDoubleStar(line, from) {
  let i = from;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '\\' && i + 1 < line.length) {
      i += 2;
      continue;
    }
    if (ch === '`') {
      const tickLen = countRun(line, i, '`');
      const closeTicks = findClosingBackticks(line, i + tickLen, tickLen);
      i = closeTicks !== -1 ? closeTicks : i + tickLen;
      continue;
    }
    if (ch === '*') {
      const starLen = countRun(line, i, '*');
      if (starLen === 2) {
        if (i > from && !/\s/.test(line[i - 1])) {
          return i;
        }
        return -1;
      }
      // Bare `*` or `***` inside strong candidate: abort pairing safely.
      return -1;
    }
    i += 1;
  }
  return -1;
}

function rewriteMatchedStrong(inner, after) {
  const full = `**${inner}**`;
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
}

/** Fix CJK emphasis spacing/punctuation on a single Markdown line (paired `**...**`). */
export function fixLine(line) {
  const hasCr = line.endsWith('\r');
  const raw = hasCr ? line.slice(0, -1) : line;
  let out = '';
  let i = 0;

  while (i < raw.length) {
    const ch = raw[i];
    if (ch === '\\' && i + 1 < raw.length) {
      out += raw.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (ch === '`') {
      const tickLen = countRun(raw, i, '`');
      const closeTicks = findClosingBackticks(raw, i + tickLen, tickLen);
      const end = closeTicks !== -1 ? closeTicks : i + tickLen;
      out += raw.slice(i, end);
      i = end;
      continue;
    }
    if (ch === '*') {
      const starLen = countRun(raw, i, '*');
      if (starLen !== 2) {
        out += raw.slice(i, i + starLen);
        i += starLen;
        continue;
      }
      if (i + 2 >= raw.length || /\s/.test(raw[i + 2])) {
        out += '**';
        i += 2;
        continue;
      }
      const closeIdx = findClosingDoubleStar(raw, i + 2);
      if (closeIdx === -1) {
        out += '**';
        i += 2;
        continue;
      }
      const inner = raw.slice(i + 2, closeIdx);
      const after = raw[closeIdx + 2] ?? '';
      out += rewriteMatchedStrong(inner, after);
      i = closeIdx + 2;
      continue;
    }
    out += ch;
    i += 1;
  }

  return hasCr ? `${out}\r` : out;
}

/** Fix CJK emphasis across a Markdown document, skipping fenced code blocks. */
export function fixMarkdown(markdown) {
  let inFence = false;
  let fenceChar = '';
  return markdown
    .split('\n')
    .map((line) => {
      const match = line.match(/^\s*(```|~~~)/);
      if (match) {
        const marker = match[1][0];
        if (!inFence) {
          inFence = true;
          fenceChar = marker;
        } else if (marker === fenceChar) {
          inFence = false;
          fenceChar = '';
        }
        return line;
      }
      return inFence ? line : fixLine(line);
    })
    .join('\n');
}

function main() {
  const apply = process.argv.includes('--apply');
  const check = process.argv.includes('--check');
  const files = walk(docsRoot);
  const changes = [];

  for (const file of files) {
    const before = fs.readFileSync(file, 'utf8');
    const after = fixMarkdown(before);
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
}

const isMain =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]).toLowerCase() ===
    fileURLToPath(import.meta.url).toLowerCase();

if (isMain) {
  main();
}
