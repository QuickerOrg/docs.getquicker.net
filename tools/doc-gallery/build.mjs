/**
 * Scan docs/ for DocCard gallery covers + descriptions.
 * Copies first images to static/img/doc-gallery/ (gitignored).
 * Returns the gallery map for the Docusaurus plugin to inject at runtime.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {isStructuralHint} from "./hints.mjs";
import {extractLiveCover} from "./live-cover.mjs";
import {snapshotAbs} from "./previews.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DOCS_DIR = path.join(ROOT, "docs");
const COVER_DIR = path.join(ROOT, "static/img/doc-gallery");

/** @typedef {{href: string, title: string, description: string, covers: string[], dir: string, kind: "doc" | "category", position: number, excerpt: string, hints: string[], liveCover: {name: string, props: Record<string, unknown>} | null}} GallerySource */

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return {fm: {}, body: raw};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    let value = kv[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fm[kv[1]] = value;
  }
  return {fm, body: raw.slice(match[0].length)};
}

function isBoilerplateDescription(text, title) {
  const value = (text ?? "").trim();
  if (!value) return true;
  if (title && value === title) return true;
  if (/的 Quicker 2\.0 使用说明\.?$/.test(value)) return true;
  if (/模块参考/.test(value) && /参数表由/.test(value)) return true;
  return false;
}

function stripMd(text) {
  return text
    .replace(/\*\*/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .trim();
}

function extractExcerpt(body, title, description) {
  const skip = new Set([title, description].filter(Boolean).map((value) => value.trim()));
  const chunks = [];
  for (const line of body.split(/\r?\n/)) {
    const raw = line.trim();
    if (!raw) continue;
    if (
      raw.startsWith("#") ||
      raw.startsWith("!") ||
      raw.startsWith("<") ||
      raw.startsWith("```") ||
      raw.startsWith(":::") ||
      raw.startsWith("import ") ||
      raw.startsWith("|") ||
      /^【[^】]+】/.test(raw)
    ) {
      continue;
    }
    const text = stripMd(raw.replace(/^[-*]\s+/, ""));
    if (!text || text.length < 4 || skip.has(text)) continue;
    chunks.push(text);
    if (chunks.length >= 2 || chunks.join("").length >= 90) break;
  }
  return chunks.join("");
}

function similarHint(a, b) {
  if (a === b || a.includes(b) || b.includes(a)) return true;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) diff += 1;
  }
  return diff <= 1;
}

function extractHints(body) {
  /** @type {string[]} */
  const hints = [];
  const seen = new Set();
  for (const match of body.matchAll(/【([^】]{1,16})】/g)) {
    const label = match[1].trim();
    if (!label || seen.has(label) || hints.some((item) => similarHint(item, label))) continue;
    seen.add(label);
    hints.push(label);
    if (hints.length >= 4) return hints;
  }
  for (const match of body.matchAll(/^#{2,3}\s+(.+)$/gm)) {
    const label = stripMd(match[1]).replace(/\s*\{#.*\}$/, "");
    if (!label || isStructuralHint(label) || seen.has(label) || hints.some((item) => similarHint(item, label))) continue;
    seen.add(label);
    hints.push(label);
    if (hints.length >= 4) break;
  }
  return hints;
}

function firstParagraph(body) {
  const chunks = [];
  for (const line of body.split(/\r?\n/)) {
    const text = line.trim();
    if (!text) {
      if (chunks.length > 0) break;
      continue;
    }
    if (
      text.startsWith("#") ||
      text.startsWith("!") ||
      text.startsWith("<") ||
      text.startsWith("```") ||
      text.startsWith(":::") ||
      text.startsWith("import ") ||
      text.startsWith("|") ||
      text.startsWith("- ") ||
      text.startsWith("* ")
    ) {
      if (chunks.length > 0) break;
      continue;
    }
    chunks.push(text.replace(/\*\*/g, ""));
    if (chunks.join("").length >= 48) break;
  }
  return chunks.join("");
}

function firstLocalImage(body, fileDir) {
  const re = /!\[[^\]]*]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(body))) {
    const src = match[1].trim().replace(/^['"]|['"]$/g, "").split(/\s+/)[0];
    if (!src || /^(https?:|data:)/i.test(src)) continue;
    if (src.startsWith("/")) {
      const abs = path.join(ROOT, "static", src.replace(/^\//, ""));
      if (fs.existsSync(abs)) return abs;
      continue;
    }
    const abs = path.resolve(fileDir, src);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
}

function defaultDocHref(file) {
  const rel = path.relative(DOCS_DIR, file).replace(/\\/g, "/");
  return `/${rel.replace(/\.mdx?$/, "")}`;
}

function coverPublicPath(abs) {
  const ext = path.extname(abs).toLowerCase() || ".png";
  const hash = crypto
    .createHash("sha1")
    .update(path.relative(ROOT, abs).replace(/\\/g, "/"))
    .digest("hex")
    .slice(0, 12);
  return {fileName: `${hash}${ext}`, publicPath: `/img/doc-gallery/${hash}${ext}`};
}

function writeIfChanged(dest, buf) {
  try {
    if (fs.readFileSync(dest).equals(buf)) return false;
  } catch {
    // missing
  }
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.writeFileSync(dest, buf);
  return true;
}

function collectDocs() {
  /** @type {GallerySource[]} */
  const docs = [];
  for (const file of walkFiles(DOCS_DIR)) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = fs.readFileSync(file, "utf8");
    const {fm, body} = parseFrontMatter(raw);
    const title = (fm.sidebar_label || fm.title || path.basename(file, path.extname(file))).trim();
    const href = (fm.slug || defaultDocHref(file)).trim();
    const fmDesc = (fm.description ?? "").trim();
    const description = isBoilerplateDescription(fmDesc, title)
      ? firstParagraph(body)
      : fmDesc;
    const imageAbs = firstLocalImage(body, path.dirname(file));
    const previewAbs = snapshotAbs(ROOT, href);
    const coverAbs =
      imageAbs ??
      (fs.existsSync(previewAbs) ? previewAbs : null);
    docs.push({
      href,
      title,
      description,
      covers: coverAbs ? [coverAbs] : [],
      dir: path.dirname(file),
      kind: "doc",
      position: Number(fm.sidebar_position ?? 9999),
      excerpt: extractExcerpt(body, title, description),
      hints: extractHints(body),
      liveCover: extractLiveCover(body),
    });
  }
  return docs;
}

function collectCategories(docs) {
  /** @type {GallerySource[]} */
  const categories = [];
  for (const file of walkFiles(DOCS_DIR)) {
    if (path.basename(file) !== "_category_.json") continue;
    let json;
    try {
      json = JSON.parse(fs.readFileSync(file, "utf8"));
    } catch {
      continue;
    }
    const href = json?.link?.slug;
    if (!href || typeof href !== "string") continue;
    const dir = path.dirname(file);
    const title = (json.link?.title || json.label || path.basename(dir)).trim();
    const children = docs
      .filter((doc) => doc.dir === dir || doc.dir.startsWith(`${dir}${path.sep}`))
      .sort((a, b) => a.position - b.position || a.title.localeCompare(b.title, "zh-Hans"));
    const covers = [];
    for (const child of children) {
      if (child.covers[0] && !covers.includes(child.covers[0])) {
        covers.push(child.covers[0]);
      }
      if (covers.length >= 4) break;
    }
    const fmDesc = (json.link?.description || json.description || "").trim();
    const description = isBoilerplateDescription(fmDesc, title)
      ? children
          .slice(0, 4)
          .map((child) => child.title)
          .join("、")
      : fmDesc;
    categories.push({
      href,
      title,
      description,
      covers,
      dir,
      kind: "category",
      position: Number(json.position ?? 9999),
      excerpt: "",
      hints: children.slice(0, 4).map((child) => child.title),
      liveCover: null,
    });
  }
  return categories;
}

export function buildDocGallery() {
  const docs = collectDocs();
  const categories = collectCategories(docs);
  /** @type {Record<string, {description?: string, covers?: string[], excerpt?: string, hints?: string[], liveCover?: {name: string, props: Record<string, unknown>}}>} */
  const gallery = {};
  const usedNames = new Set();

  for (const item of [...docs, ...categories]) {
    const covers = [];
    for (const abs of item.covers) {
      const {fileName, publicPath} = coverPublicPath(abs);
      usedNames.add(fileName);
      writeIfChanged(path.join(COVER_DIR, fileName), fs.readFileSync(abs));
      covers.push(publicPath);
    }
    const entry = {};
    if (item.description) entry.description = item.description;
    if (item.liveCover) entry.liveCover = item.liveCover;
    if (covers.length > 0) {
      entry.covers = covers;
    } else {
      if (item.excerpt) entry.excerpt = item.excerpt;
      if (item.hints.length > 0) entry.hints = item.hints;
    }
    if (entry.description || entry.covers || entry.excerpt || entry.hints || entry.liveCover) {
      gallery[item.href] = entry;
    }
  }

  if (fs.existsSync(COVER_DIR)) {
    for (const name of fs.readdirSync(COVER_DIR)) {
      if (!usedNames.has(name)) {
        fs.unlinkSync(path.join(COVER_DIR, name));
      }
    }
  }

  return {
    gallery,
    docs: docs.length,
    categories: categories.length,
    cards: Object.keys(gallery).length,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const stats = buildDocGallery();
  process.stdout.write(`doc-gallery: ${stats.cards} cards (${stats.docs} docs, ${stats.categories} categories)\n`);
}
