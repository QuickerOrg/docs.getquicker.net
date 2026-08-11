#!/usr/bin/env node
/**
 * Build catalog of preview components for /lab/screenshot-review.
 *
 * Two sources:
 *   - orphan: unused page img/ paired with a live preview
 *   - direct: MDX-authored preview with no leftover screenshot (e.g. StepProgramView)
 *
 *   node tools/screenshot-replace/build-review-catalog.mjs
 *   → data/screenshot-review/catalog.json
 */
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const docsRoot = path.join(repoRoot, 'docs');
const outDir = path.join(repoRoot, 'data', 'screenshot-review');
const outFile = path.join(outDir, 'catalog.json');

const PREVIEW_TAGS = [
  'ModuleParamPreview',
  'NotifyToastPreview',
  'MsgBoxPreview',
  'ChoiceListPreview',
  'ContextMenuPreview',
  'VariableDefPreview',
  'StepProgramView',
  'WaitWinPreview',
  'TableFieldPreview',
];

function walkMd(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === 'img') continue;
      walkMd(full, acc);
    } else if (/\.mdx?$/i.test(name)) acc.push(full);
  }
  return acc;
}

function slugFromFrontMatter(text, file) {
  const slug = /^slug:\s*"([^"]+)"/m.exec(text)?.[1];
  if (slug) return slug.startsWith('/') ? slug : `/${slug}`;
  const rel = path.relative(docsRoot, file).replaceAll('\\', '/').replace(/\.mdx?$/, '');
  return `/${rel}`;
}

function titleFromFrontMatter(text, file) {
  return /^title:\s*"([^"]+)"/m.exec(text)?.[1] || path.basename(file, path.extname(file));
}

function moduleKeyFromPage(text) {
  return (
    /^moduleKey:\s*"([^"]+)"/m.exec(text)?.[1] ||
    /<ModuleParamPreview\b[^>]*moduleKey="([^"]+)"/.exec(text)?.[1] ||
    ''
  );
}

/** Extract a balanced `{...}` or `[...]` starting at `openIdx`. */
function sliceBalanced(src, openIdx) {
  const open = src[openIdx];
  const close = open === '{' ? '}' : open === '[' ? ']' : '';
  if (!close) return null;
  let depth = 0;
  let inStr = null;
  let escaped = false;
  for (let i = openIdx; i < src.length; i += 1) {
    const ch = src[i];
    if (inStr) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inStr = ch;
      continue;
    }
    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return src.slice(openIdx, i + 1);
    }
  }
  return null;
}

/** Convert a JS object/array literal (single quotes, bare keys) to a value. */
function parseJsLiteral(literal) {
  let s = literal.trim();
  s = s.replace(/,(\s*[}\]])/g, '$1');
  // Quote bare keys: {label: → {"label":
  s = s.replace(/([{\[,]\s*)([A-Za-z_][\w]*)\s*:/g, '$1"$2":');
  // 'string' → JSON string
  s = s.replace(/'((?:\\'|[^'])*)'/g, (_, inner) =>
    JSON.stringify(inner.replace(/\\'/g, "'").replace(/\\n/g, '\n')),
  );
  return JSON.parse(s);
}

function extractPropExpr(body, propName) {
  const re = new RegExp(`\\b${propName}\\s*=\\s*`);
  const m = re.exec(body);
  if (!m) return null;
  const i = m.index + m[0].length;
  const ch = body[i];
  if (ch === '{' || ch === '[') {
    // values={{...}}  → outer braces are JSX expression wrapper
    if (ch === '{' && body[i + 1] === '{') {
      const inner = sliceBalanced(body, i + 1);
      if (!inner) return null;
      return {kind: 'object', raw: inner};
    }
    if (ch === '{' && (body[i + 1] === '[' || body[i + 1] === '{')) {
      // items={[...]} or openPath={['a']}
      const innerStart = i + 1;
      const inner = sliceBalanced(body, innerStart);
      if (!inner) return null;
      return {kind: inner[0] === '[' ? 'array' : 'object', raw: inner};
    }
    if (ch === '{') {
      // {expr} where expr might be number or identifier
      const wrapped = sliceBalanced(body, i);
      if (!wrapped) return null;
      const inner = wrapped.slice(1, -1).trim();
      if (inner[0] === '[' || inner[0] === '{') {
        return {kind: inner[0] === '[' ? 'array' : 'object', raw: inner};
      }
      return {kind: 'expr', raw: inner};
    }
    if (ch === '[') {
      const raw = sliceBalanced(body, i);
      return raw ? {kind: 'array', raw} : null;
    }
  }
  if (ch === '"') {
    const end = body.indexOf('"', i + 1);
    if (end > i) return {kind: 'string', raw: body.slice(i + 1, end)};
  }
  if (ch === "'") {
    const end = body.indexOf("'", i + 1);
    if (end > i) return {kind: 'string', raw: body.slice(i + 1, end)};
  }
  return null;
}

function putParsedProp(props, name, expr) {
  if (!expr) return;
  try {
    if (expr.kind === 'string') {
      props[name] = expr.raw;
      return;
    }
    if (expr.kind === 'expr') {
      // maxLines={3} showIndex / boolean-ish
      if (/^\d+(\.\d+)?$/.test(expr.raw)) {
        props[name] = expr.raw;
        return;
      }
      if (expr.raw === 'true' || expr.raw === 'false') {
        props[name] = expr.raw;
        return;
      }
      // JSX string expr: {"a\nb"} or {'{\n  "k": 1\n}'}
      const asString = parseJsStringLiteral(expr.raw);
      if (asString != null) {
        props[name] = asString;
        return;
      }
      props[name] = expr.raw;
      return;
    }
    const value = parseJsLiteral(expr.raw);
    props[name] = typeof value === 'string' ? value : JSON.stringify(value);
  } catch {
    // keep going; incomplete props are better than failing the page
  }
}

/** Unquote a JS/JSX string literal; returns null if not a string literal. */
function parseJsStringLiteral(raw) {
  const t = (raw ?? '').trim();
  if (t.length < 2) return null;
  const quote = t[0];
  if ((quote !== '"' && quote !== "'") || t[t.length - 1] !== quote) return null;
  return unescapeJsStringContent(t.slice(1, -1), quote);
}

function unescapeJsStringContent(inner, quote) {
  let out = '';
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (ch !== '\\' || i + 1 >= inner.length) {
      out += ch;
      continue;
    }
    const next = inner[i + 1];
    i += 1;
    if (next === 'n') out += '\n';
    else if (next === 'r') out += '\r';
    else if (next === 't') out += '\t';
    else if (next === '\\') out += '\\';
    else if (next === quote || next === '"' || next === "'") out += next;
    else out += next;
  }
  return out;
}

/** @param {string} text */
function extractComponents(text) {
  /** @type {{name: string, raw: string, props: Record<string, string>, index: number}[]} */
  const items = [];
  for (const name of PREVIEW_TAGS) {
    const re = new RegExp(`<${name}\\b([\\s\\S]*?)/>`, 'g');
    let m;
    while ((m = re.exec(text))) {
      const raw = m[0];
      const body = m[1] ?? '';
      /** @type {Record<string, string>} */
      const props = {};
      for (const pm of body.matchAll(/(\w+)="([^"]*)"/g)) {
        props[pm[1]] = pm[2];
      }
      for (const pm of body.matchAll(/(\w+)=\{"((?:\\.|[^"\\])*)"\}/g)) {
        props[pm[1]] = pm[2].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      }

      for (const propName of [
        'moduleKey',
        'openPath',
        'items',
        'options',
        'buttons',
        'globalButtons',
        'values',
        'inputVars',
        'outputVars',
        'focusKeys',
        'data',
        'maxLines',
        'selectedIndex',
        'showIndex',
        'showMoreMenu',
        'showClose',
        'primaryIndex',
        'styleVariant',
        'variant',
        'icon',
        'title',
        'message',
        'tooltip',
        'progress',
        'fields',
        'field',
        'name',
        'typeLabel',
        'defaultValue',
        'caption',
        'showParams',
        'showKey',
        'remark',
      ]) {
        putParsedProp(props, propName, extractPropExpr(body, propName));
      }

      items.push({name, raw, props, index: m.index});
    }
  }
  items.sort((a, b) => a.index - b.index);
  return items;
}

function listOrphanImages(pageFile, text) {
  const imgDir = path.join(path.dirname(pageFile), 'img');
  if (!existsSync(imgDir)) return [];
  const pageStem = path.basename(pageFile, path.extname(pageFile)).toLowerCase();
  // Shared category img/ folders: only pair files for this page stem (mouse-*.png).
  const files = readdirSync(imgDir).filter((f) => {
    if (!/\.(png|jpg|jpeg|webp)$/i.test(f)) return false;
    const lower = f.toLowerCase();
    return lower.startsWith(`${pageStem}-`) || lower.startsWith(`${pageStem}_`);
  });
  return files
    .filter((f) => !text.includes(f))
    .map((f) => ({
      fileName: f,
      absPath: path.join(imgDir, f),
      relPath: path.relative(repoRoot, path.join(imgDir, f)).replaceAll('\\', '/'),
    }))
    .sort((a, b) => a.fileName.localeCompare(b.fileName, 'en'));
}

function stableId(pageRel, imageRel) {
  return createHash('sha1').update(`${pageRel}|${imageRel}`).digest('hex').slice(0, 16);
}

function pickComponentForImage(imageName, components, moduleKey) {
  const is001 = /-001-/.test(imageName);
  const mpp = components.filter((c) => c.name === 'ModuleParamPreview');
  const runtime = components.filter((c) => c.name !== 'ModuleParamPreview' && c.name !== 'StepProgramView');
  const steps = components.filter((c) => c.name === 'StepProgramView');

  const pickNamed = (name) => components.find((c) => c.name === name);

  // Pages that mix runtime, parameter, and variable-definition screenshots need
  // explicit image-to-component routing. Filename-wide hints (for example
  // "menu" or "waitwin") are too broad for these pages.
  if (/action-custom-context-menu-007-/i.test(imageName)) return pickNamed('ModuleParamPreview');
  if (/var-dict-(001|002)-/i.test(imageName)) return pickNamed('VariableDefPreview');
  if (/var-dict-(003|004)-/i.test(imageName)) return pickNamed('ModuleParamPreview');
  if (/showmenu-002-/i.test(imageName)) return pickNamed('ModuleParamPreview');
  if (/showmenu-(001|003)-/i.test(imageName)) return pickNamed('ContextMenuPreview');
  if (/showwaitwin-(002|004)-/i.test(imageName)) return pickNamed('ModuleParamPreview');
  if (/showwaitwin-001-/i.test(imageName)) return pickNamed('WaitWinPreview');

  // Annotated / concept diagrams must stay as images — never pair with live previews.
  if (/(coord|diagram|origin)/i.test(imageName)) return null;

  if (/tablevar-(003|004)-/i.test(imageName)) {
    const tableField = components.find((c) => c.name === 'TableFieldPreview');
    if (tableField) return tableField;
  }

  // Runtime screenshots: prefer toast/dialog/list even when filename is *-001*
  if (/(notify|msgbox|userselect|toast|menu)/i.test(imageName) && runtime.length) {
    const byHint = runtime.find((c) => {
      if (/notify/i.test(imageName)) return c.name === 'NotifyToastPreview';
      if (/msgbox/i.test(imageName)) return c.name === 'MsgBoxPreview';
      if (/userselect/i.test(imageName)) return c.name === 'ChoiceListPreview';
      if (/menu/i.test(imageName)) return c.name === 'ContextMenuPreview';
      return false;
    });
    if (byHint) return byHint;
  }

  if (/(showwaitwin|waitwin)/i.test(imageName) && runtime.length) {
    const wait = runtime.find((c) => c.name === 'WaitWinPreview');
    if (wait) return wait;
  }

  if (is001 && mpp.length) {
    return mpp[0];
  }
  if (mpp.length) return mpp[0];
  if (runtime.length) return runtime[0];
  // StepProgramView only pairs when the orphan is clearly a steps/editor chrome shot.
  // Concept diagrams (e.g. tablevar-001 annotated 列/行) must not steal the loop wire.
  if (steps.length && /(steps?|flow|if-else|editor|chrome)/i.test(imageName)) {
    return steps[0];
  }
  if (moduleKey) {
    return {
      name: 'ModuleParamPreview',
      raw: `<ModuleParamPreview moduleKey="${moduleKey}" />`,
      props: {moduleKey},
      index: -1,
    };
  }
  return null;
}

/** Previews written in MDX without a leftover screenshot. Skip unpaired ModuleParamPreview (too many heroes). */
function shouldEmitDirect(name) {
  return name !== 'ModuleParamPreview';
}

function assignComponents(orphans, components, moduleKey) {
  /** @type {Record<string, typeof components>} */
  const byName = {};
  for (const c of components) {
    (byName[c.name] ||= []).push(c);
  }
  /** @type {Record<string, number>} */
  const nextIdx = {};

  /** @type {{orphan: typeof orphans[0], comp: NonNullable<ReturnType<typeof pickComponentForImage>>}[]} */
  const pairs = [];

  for (const orphan of orphans) {
    const picked = pickComponentForImage(orphan.fileName, components, moduleKey);
    if (!picked) continue;

    const pool = byName[picked.name] || [picked];
    const idx = nextIdx[picked.name] || 0;
    const comp = pool[Math.min(idx, pool.length - 1)];
    nextIdx[picked.name] = idx + 1;

    pairs.push({orphan, comp});
  }
  return pairs;
}

function main() {
  const pages = walkMd(docsRoot);
  /** @type {object[]} */
  const items = [];

  for (const file of pages) {
    const text = readFileSync(file, 'utf8');
    const components = extractComponents(text);
    if (components.length === 0) continue;
    const orphans = listOrphanImages(file, text);

    const pageRel = path.relative(repoRoot, file).replaceAll('\\', '/');
    const moduleKey = moduleKeyFromPage(text);
    const pageUrl = slugFromFrontMatter(text, file);
    const title = titleFromFrontMatter(text, file);
    const pairs = assignComponents(orphans, components, moduleKey);
    const used = new Set(pairs.map(({comp}) => `${comp.name}#${comp.index}`));

    for (const {orphan, comp} of pairs) {
      const id = stableId(pageRel, orphan.relPath);
      items.push({
        id,
        source: 'orphan',
        page: pageRel,
        pageUrl,
        title,
        moduleKey: comp.props.moduleKey || moduleKey || '',
        image: orphan.relPath,
        imageName: orphan.fileName,
        component: comp.name,
        props: comp.props,
        sourceSnippet: comp.raw.replace(/\s+/g, ' ').trim().slice(0, 240),
      });
    }

    for (const comp of components) {
      if (used.has(`${comp.name}#${comp.index}`)) continue;
      if (!shouldEmitDirect(comp.name)) continue;
      const slot = `direct:${comp.name}#${comp.index}`;
      items.push({
        id: stableId(pageRel, slot),
        source: 'direct',
        page: pageRel,
        pageUrl,
        title,
        moduleKey: comp.props.moduleKey || moduleKey || '',
        image: '',
        imageName: comp.props.caption || '（直接写组件）',
        component: comp.name,
        props: comp.props,
        sourceSnippet: comp.raw.replace(/\s+/g, ' ').trim().slice(0, 240),
      });
    }
  }

  items.sort(
    (a, b) =>
      a.page.localeCompare(b.page, 'en') ||
      String(a.source).localeCompare(String(b.source), 'en') ||
      a.imageName.localeCompare(b.imageName, 'en') ||
      a.component.localeCompare(b.component, 'en'),
  );

  const byComponent = {};
  const bySource = {orphan: 0, direct: 0};
  for (const it of items) {
    byComponent[it.component] = (byComponent[it.component] || 0) + 1;
    if (it.source === 'direct') bySource.direct += 1;
    else bySource.orphan += 1;
  }

  const catalog = {
    generatedAt: new Date().toISOString(),
    count: items.length,
    byComponent,
    bySource,
    items,
  };

  mkdirSync(outDir, {recursive: true});
  writeFileSync(outFile, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`wrote ${items.length} items → ${path.relative(repoRoot, outFile)}`);
  console.log(bySource);
  console.log(byComponent);
}

main();
