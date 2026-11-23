#!/usr/bin/env node
/**
 * 6-chain image asset audit for docs/ and static/img/.
 * Chains checked:
 *  1. Markdown ![...](...) and markdown links
 *  2. MDX/JSX require(...), import ... from ..., <img src="...">
 *  3. src/ React TSX/TS/CSS references (/img/... or relative asset imports)
 *  4. docusaurus.config.ts & sidebars.ts
 *  5. data/screenshot-replace/decisions.json & data/screenshot-review/catalog.json
 *  6. plugins/ & tools/ references
 *
 * Usage:
 *   node tools/screenshot-replace/audit-unused-images.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const IMG_EXT = /\.(?:png|jpe?g|webp|gif|svg|ico)$/i;
const toPosix = (p) => p.replace(/\\/g, '/');

function walkFiles(dir, predicate) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'build', '.docusaurus', '.cache', '.git'].includes(entry.name)) continue;
      out.push(...walkFiles(full, predicate));
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

const docsImages = walkFiles(path.join(repoRoot, 'docs'), (f) => IMG_EXT.test(f)).map((f) =>
  toPosix(path.relative(repoRoot, f)),
);
const staticImages = walkFiles(path.join(repoRoot, 'static', 'img'), (f) => IMG_EXT.test(f))
  .map((f) => toPosix(path.relative(repoRoot, f)))
  // static/img/doc-gallery/ 为 build 时生成目录（已 gitignore）
  .filter((rel) => !rel.startsWith('static/img/doc-gallery/'));
const allImages = [...new Set([...docsImages, ...staticImages])].sort();

const chainRefs = new Map(allImages.map((img) => [img, new Set()]));
const addRef = (img, chain) => {
  const clean = img.split(/[?#]/, 1)[0];
  if (chainRefs.has(clean)) chainRefs.get(clean).add(chain);
};

const resolveFrom = (sourceRel, target) => {
  if (!target || /^(https?:|data:|mailto:)/i.test(target)) return '';
  const clean = target.split(/[?#]/, 1)[0].trim();
  if (clean.startsWith('/')) return `static/${clean.slice(1)}`;
  if (clean.startsWith('@site/')) return clean.slice('@site/'.length);
  if (clean.startsWith('.')) {
    return toPosix(path.posix.normalize(path.posix.join(path.posix.dirname(sourceRel), clean)));
  }
  return '';
};

// Chain 1 & 2: docs/*.md|mdx
for (const file of walkFiles(path.join(repoRoot, 'docs'), (f) => /\.(md|mdx)$/i.test(f))) {
  const rel = toPosix(path.relative(repoRoot, file));
  const txt = fs.readFileSync(file, 'utf8');
  for (const m of txt.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)) {
    const r = resolveFrom(rel, m[1]);
    if (r) addRef(r, 'markdown');
  }
  for (const m of txt.matchAll(/\brequire\(\s*['"]([^'"]+\.(?:png|jpe?g|webp|gif|svg|ico))['"]\s*\)/gi)) {
    const r = resolveFrom(rel, m[1]);
    if (r) addRef(r, 'mdx-jsx');
  }
  for (const m of txt.matchAll(/from\s+['"]([^'"]+\.(?:png|jpe?g|webp|gif|svg|ico))['"]/gi)) {
    const r = resolveFrom(rel, m[1]);
    if (r) addRef(r, 'mdx-jsx');
  }
  for (const m of txt.matchAll(/<(?:img|source)\b[^>]*?\bsrc=["']([^"']+)["']/gi)) {
    const r = resolveFrom(rel, m[1]);
    if (r) addRef(r, 'mdx-jsx');
  }
}

// Chain 3: src/
for (const file of walkFiles(path.join(repoRoot, 'src'), (f) => /\.(tsx?|jsx?|css|scss)$/i.test(f))) {
  const rel = toPosix(path.relative(repoRoot, file));
  const txt = fs.readFileSync(file, 'utf8');
  for (const m of txt.matchAll(/['"]((?:\/img\/|\.{1,2}\/|@site\/)[^'"]+\.(?:png|jpe?g|webp|gif|svg|ico))['"]/gi)) {
    const r = resolveFrom(rel, m[1]);
    if (r) addRef(r, 'src');
  }
  for (const m of txt.matchAll(/url\(['"]?([^'")\s]+\.(?:png|jpe?g|webp|gif|svg|ico))['"]?\)/gi)) {
    const r = resolveFrom(rel, m[1]);
    if (r) addRef(r, 'src');
  }
  // Template literal directory patterns such as `/img/quicker-var/${file}`
  for (const m of txt.matchAll(/`((?:\/img\/)[^`$]+\/)\$\{/g)) {
    const dirPrefix = `static/${m[1].slice(1)}`;
    for (const img of allImages) {
      if (img.startsWith(dirPrefix)) addRef(img, 'src');
    }
  }
}

// Chain 4: docusaurus.config.ts & sidebars.ts
for (const cfg of ['docusaurus.config.ts', 'sidebars.ts']) {
  const full = path.join(repoRoot, cfg);
  if (!fs.existsSync(full)) continue;
  const txt = fs.readFileSync(full, 'utf8');
  for (const m of txt.matchAll(/['"]((?:\/?img\/|\.{1,2}\/)[^'"]+\.(?:png|jpe?g|webp|gif|svg|ico))['"]/gi)) {
    const val = m[1].startsWith('img/') ? `static/${m[1]}` : resolveFrom(cfg, m[1]);
    if (val) addRef(val, 'config');
  }
}

// Chain 5: screenshot-replace & screenshot-review ledgers
const ledgerPath = path.join(repoRoot, 'data', 'screenshot-replace', 'decisions.json');
const convertedImages = new Set();
const keptOrDeferredUnref = [];
if (fs.existsSync(ledgerPath)) {
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));
  for (const item of ledger.items ?? []) {
    if (item.image) {
      addRef(item.image, `ledger:${item.status}`);
      if (item.status === 'converted') convertedImages.add(item.image);
      else if (!chainRefs.get(item.image)?.has('markdown') && !chainRefs.get(item.image)?.has('mdx-jsx')) {
        keptOrDeferredUnref.push(item.image);
      }
    }
  }
}

// Chain 6: plugins/ & tools/
for (const dir of ['plugins', 'tools']) {
  for (const file of walkFiles(path.join(repoRoot, dir), (f) => /\.(js|mjs|ts)$/i.test(f))) {
    const txt = fs.readFileSync(file, 'utf8');
    for (const img of allImages) {
      if (txt.includes(img) || txt.includes(path.posix.basename(img))) {
        // only record explicit path references, not generic filenames like image.png
        if (txt.includes(img)) addRef(img, 'tools');
      }
    }
  }
}

const activeImages = [];
const ledgerConvertedArchives = [];
const trulyUnreferenced = [];

for (const img of allImages) {
  const chains = chainRefs.get(img);
  const live = chains.has('markdown') || chains.has('mdx-jsx') || chains.has('src') || chains.has('config') || chains.has('tools');
  if (live) activeImages.push(img);
  else if (convertedImages.has(img)) ledgerConvertedArchives.push(img);
  else trulyUnreferenced.push(img);
}

console.log(`=== 6-Chain Image Audit ===`);
console.log(`Total image files (docs/ + static/img/): ${allImages.length}`);
console.log(`  Actively referenced: ${activeImages.length}`);
console.log(`  Historical converted ledger archives: ${ledgerConvertedArchives.length}`);
console.log(`  Truly unreferenced (no live chain, not converted archive): ${trulyUnreferenced.length}`);
if (trulyUnreferenced.length) {
  console.log('Truly unreferenced files:');
  for (const img of trulyUnreferenced) {
    console.log(`  - ${img} (chains: ${[...chainRefs.get(img)].join(', ') || 'none'})`);
  }
}
