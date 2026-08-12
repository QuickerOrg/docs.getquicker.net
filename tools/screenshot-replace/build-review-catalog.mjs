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
  'ElseToggleMenuDemo',
  'VariableDefPreview',
  'StepProgramView',
  'WaitWinPreview',
  'TableFieldPreview',
  'TableDataPreview',
  'CoordDiagram',
  'ClickIndicatorPreview',
  'UserInputPreview',
  'ActionEditorPreview',
  'TextWindowPreview',
  'ReportProgressPreview',
  'ExpressionAssistPreview',
  'SearchBoxPreview',
  'PreviewMarks',
  'PreviewMap',
  'PreviewCompare',
];

/** Previews written in MDX without a leftover screenshot. Skip unpaired ModuleParamPreview (too many heroes). */
function shouldEmitDirect(name) {
  return name !== 'ModuleParamPreview';
}

const DECISIONS_FILE = path.join(repoRoot, 'data', 'screenshot-replace', 'decisions.json');

/** @returns {Map<string, {status?: string, action?: string, component?: string|null, reason?: string, notes?: string, kind?: string, sourceSnippet?: string, props?: object}>} */
function loadDecisionsByImage() {
  /** @type {Map<string, {status?: string, action?: string, component?: string|null, reason?: string, notes?: string, kind?: string, sourceSnippet?: string, props?: object}>} */
  const map = new Map();
  if (!existsSync(DECISIONS_FILE)) return map;
  try {
    const raw = JSON.parse(readFileSync(DECISIONS_FILE, 'utf8'));
    const items = Array.isArray(raw?.items) ? raw.items : [];
    for (const it of items) {
      if (!it?.image) continue;
      const key = String(it.image).replaceAll('\\', '/');
      map.set(key, {
        status: it.status || it.action,
        action: it.action,
        component: it.component || null,
        reason: it.reason,
        notes: it.notes,
        kind: it.kind,
        sourceSnippet: it.sourceSnippet,
        props: it.props,
      });
    }
  } catch {
    // ignore malformed ledger
  }
  return map;
}

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
    // Still record raw so gesture filters (dragDemo/wheelDelay/…) can see the prop.
    props[name] = expr.raw;
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
  const wrapperNames = new Set(['PreviewMarks', 'PreviewMap', 'PreviewCompare']);

  for (const name of PREVIEW_TAGS) {
    const re = wrapperNames.has(name)
      ? new RegExp(`<${name}\\b([\\s\\S]*?)>([\\s\\S]*?)<\\/${name}>|<${name}\\b([\\s\\S]*?)/>`, 'g')
      : new RegExp(`<${name}\\b([\\s\\S]*?)/>`, 'g');
    let m;
    while ((m = re.exec(text))) {
      const raw = m[0];
      const body = (m[1] ?? m[3] ?? '') || '';
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
        'columns',
        'rows',
        'editable',
        'compact',
        'showAddRow',
        'showActions',
        'name',
        'typeLabel',
        'defaultValue',
        'caption',
        'showParams',
        'showKey',
        'remark',
        'text',
        'showLineNum',
        'showToolbar',
        'mode',
        'query',
        'selectedAction',
        'selectedIcon',
        'results',
        'animate',
        'toolboxTab',
        'toolboxSearch',
        'toolboxSelected',
        'actionTitle',
        'actionDescription',
        'focus',
        'dragDemo',
        'historyDemo',
        'wheelDelay',
        'afterData',
        'showRun',
        'variable',
        'operation',
        'paramTitle',
        'paramValue',
        'tab',
        'marks',
        'anchors',
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
  // Shared category img/ folders: only this page's numbered assets (stem-001-hash.ext).
  // Avoid `expression` matching `expression-adv-*`.
  const stemRe = new RegExp(
    `^${pageStem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-\\d{3}-`,
    'i',
  );
  const files = readdirSync(imgDir).filter((f) => {
    if (!/\.(png|jpg|jpeg|webp|gif)$/i.test(f)) return false;
    return stemRe.test(f);
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

function imageSeq(fileName) {
  const m = /-(\d{3})-/i.exec(fileName);
  return m ? Number(m[1]) : 9999;
}

function isConvertedStatus(status) {
  return status === 'converted' || status === 'replaced';
}

/**
 * Resolve decision.component which may be compound ("PreviewMarks+ModuleParamPreview").
 * Prefer the leftmost page instance (wrapper) so pools stay disjoint.
 */
function resolveDecisionComponentName(decidedName, components) {
  if (!decidedName) return null;
  if (components.some((c) => c.name === decidedName)) return decidedName;
  if (!decidedName.includes('+')) return decidedName;
  const parts = decidedName.split('+').map((s) => s.trim()).filter(Boolean);
  for (const part of parts) {
    if (components.some((c) => c.name === part)) return part;
  }
  return parts[0] || decidedName;
}

function decisionBlob(dec) {
  return `${dec?.reason || ''} ${dec?.notes || ''} ${dec?.kind || ''}`;
}

/**
 * Only bind live props when the page instance is unambiguous.
 * Ambiguous multi-instance pages → page-ref (review UI opens the real doc).
 * Never zip orphans to the N-th ModuleParamPreview — that caused mass mismatches.
 */
function pickBoundComponent(decidedName, pool, dec, moduleKey) {
  const empty = {
    name: decidedName,
    raw: `<${decidedName} />`,
    props:
      moduleKey && decidedName === 'ModuleParamPreview' ? {moduleKey} : {},
    index: -1,
  };

  if (dec?.sourceSnippet && typeof dec.sourceSnippet === 'string') {
    const parsed = extractComponents(dec.sourceSnippet);
    const hit = parsed.find((c) => c.name === decidedName) || parsed[0];
    if (hit) {
      return {comp: hit, confidence: 'decision-snippet', renderMode: 'preview'};
    }
  }

  if (dec?.props && typeof dec.props === 'object' && !Array.isArray(dec.props)) {
    /** @type {Record<string, string>} */
    const props = {};
    for (const [k, v] of Object.entries(dec.props)) {
      props[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }
    return {
      comp: {name: decidedName, raw: `<${decidedName} />`, props, index: -1},
      confidence: 'decision-props',
      renderMode: 'preview',
    };
  }

  if (pool.length === 1) {
    return {comp: pool[0], confidence: 'decision-unique', renderMode: 'preview'};
  }

  const blob = decisionBlob(dec);
  if (decidedName === 'ActionEditorPreview') {
    if (/dragDemo|顶层 drag|分支槽|拖入|drag-from-toolbox|工具箱→/i.test(blob)) {
      const drags = pool.filter((c) => Boolean(c.props.dragDemo));
      if (drags.length === 1) {
        return {comp: drags[0], confidence: 'decision-gesture', renderMode: 'preview'};
      }
    }
    if (/historyDemo|撤销|重做/i.test(blob)) {
      const hist = pool.filter((c) => Boolean(c.props.historyDemo));
      if (hist.length === 1) {
        return {comp: hist[0], confidence: 'decision-gesture', renderMode: 'preview'};
      }
    }
  }
  if (decidedName === 'StepProgramView' && /wheelDelay|滚轮|延时/i.test(blob)) {
    let wheels = pool.filter((c) => Boolean(c.props.wheelDelay));
    if (/on delay|delay step|等待时间|sys:delay/i.test(blob)) {
      const delayWheels = wheels.filter((c) => /sys:delay/.test(c.props.data || ''));
      if (delayWheels.length === 1) {
        return {comp: delayWheels[0], confidence: 'decision-gesture', renderMode: 'preview'};
      }
      wheels = delayWheels.length ? delayWheels : wheels;
    } else {
      const nonDelay = wheels.filter((c) => !/sys:delay/.test(c.props.data || ''));
      if (nonDelay.length === 1) {
        return {comp: nonDelay[0], confidence: 'decision-gesture', renderMode: 'preview'};
      }
    }
    if (wheels.length === 1) {
      return {comp: wheels[0], confidence: 'decision-gesture', renderMode: 'preview'};
    }
  }
  if (decidedName === 'ElseToggleMenuDemo' && pool.length >= 1) {
    // Usually one per page.
    if (pool.length === 1) {
      return {comp: pool[0], confidence: 'decision-unique', renderMode: 'preview'};
    }
  }
  if (decidedName === 'SearchBoxPreview') {
    if (/实时|live/i.test(blob)) {
      const lives = pool.filter((c) => c.props.mode === 'live');
      if (lives.length === 1) {
        return {comp: lives[0], confidence: 'decision-gesture', renderMode: 'preview'};
      }
    }
    if (/Tab|传参|pick|param/i.test(blob)) {
      const picks = pool.filter(
        (c) => c.props.mode === 'pick' || c.props.mode === 'param' || !c.props.mode,
      );
      if (picks.length === 1) {
        return {comp: picks[0], confidence: 'decision-gesture', renderMode: 'preview'};
      }
    }
  }

  return {comp: empty, confidence: 'page-ref', renderMode: 'page-ref'};
}

/**
 * Pair orphan images using decisions.json only.
 * kept / deferred / missing → skip.
 * Prefer unambiguous binds; when remaining orphan count == remaining instance
 * count for that type, zip in document/image order (decision-order).
 * Otherwise page-ref + candidate props (no guessed single preview).
 */
function assignComponents(orphans, components, moduleKey, decisions) {
  /** @type {Record<string, typeof components>} */
  const byName = {};
  for (const c of components) {
    (byName[c.name] ||= []).push(c);
  }

  /** @type {{orphan: (typeof orphans)[0], decidedName: string, dec: object}[]} */
  const claimed = [];
  /** @type {{orphan: (typeof orphans)[0], decidedName: string}[]} */
  const keptRows = [];

  for (const orphan of orphans) {
    const dec = decisions.get(orphan.relPath);
    if (!dec || !isConvertedStatus(dec.status) || !dec.component) {
      continue;
    }
    const decidedName = resolveDecisionComponentName(String(dec.component), components);
    if (!decidedName) continue;
    // kept = leftover asset for human review only; never consume live instances.
    if (dec.action === 'kept') {
      keptRows.push({orphan, decidedName});
      continue;
    }
    claimed.push({orphan, decidedName, dec});
  }

  claimed.sort(
    (a, b) =>
      imageSeq(a.orphan.fileName) - imageSeq(b.orphan.fileName) ||
      a.orphan.fileName.localeCompare(b.orphan.fileName, 'en'),
  );

  /** @type {{orphan: (typeof orphans)[0], comp: {name: string, raw: string, props: Record<string, string>, index: number}, confidence: string, decidedComponent: string, renderMode: string, candidates?: {props: Record<string, string>, snippet: string}[]}[]} */
  const pairs = [];
  /** @type {Set<number>} */
  const usedIndexes = new Set();

  /** @type {Record<string, typeof claimed>} */
  const byDecided = {};
  for (const row of claimed) {
    (byDecided[row.decidedName] ||= []).push(row);
  }

  for (const [decidedName, group] of Object.entries(byDecided)) {
    const fullPool = byName[decidedName] || [];
    /** @type {typeof group} */
    const deferred = [];

    for (const row of group) {
      const available = fullPool.filter((c) => !usedIndexes.has(c.index));
      const {comp, confidence, renderMode} = pickBoundComponent(
        decidedName,
        available,
        row.dec,
        moduleKey,
      );
      if (renderMode === 'preview' && comp.index >= 0) {
        usedIndexes.add(comp.index);
        pairs.push({
          orphan: row.orphan,
          comp,
          confidence,
          decidedComponent: decidedName,
          renderMode,
        });
      } else {
        deferred.push(row);
      }
    }

    const remainingPool = fullPool.filter((c) => !usedIndexes.has(c.index));
    if (deferred.length > 0 && deferred.length === remainingPool.length) {
      deferred.sort(
        (a, b) =>
          imageSeq(a.orphan.fileName) - imageSeq(b.orphan.fileName) ||
          a.orphan.fileName.localeCompare(b.orphan.fileName, 'en'),
      );
      remainingPool.sort((a, b) => a.index - b.index);
      for (let i = 0; i < deferred.length; i += 1) {
        const comp = remainingPool[i];
        usedIndexes.add(comp.index);
        pairs.push({
          orphan: deferred[i].orphan,
          comp,
          confidence: 'decision-order',
          decidedComponent: decidedName,
          renderMode: 'preview',
        });
      }
      continue;
    }

    const candidates = remainingPool.slice(0, 12).map((c) => ({
      props: c.props,
      snippet: c.raw.replace(/\s+/g, ' ').trim().slice(0, 240),
    }));
    for (const row of deferred) {
      pairs.push({
        orphan: row.orphan,
        comp: {
          name: decidedName,
          raw: `<${decidedName} />`,
          props:
            moduleKey && decidedName === 'ModuleParamPreview' ? {moduleKey} : {},
          index: -1,
        },
        confidence: 'page-ref',
        decidedComponent: decidedName,
        renderMode: 'page-ref',
        candidates,
      });
    }
  }

  for (const {orphan, decidedName} of keptRows) {
    const pool = byName[decidedName] || [];
    pairs.push({
      orphan,
      comp: {
        name: decidedName,
        raw: `<${decidedName} />`,
        props:
          moduleKey && decidedName === 'ModuleParamPreview' ? {moduleKey} : {},
        index: -1,
      },
      confidence: 'page-ref',
      decidedComponent: decidedName,
      renderMode: 'page-ref',
      candidates: pool.slice(0, 12).map((c) => ({
        props: c.props,
        snippet: c.raw.replace(/\s+/g, ' ').trim().slice(0, 240),
      })),
    });
  }

  return pairs;
}

function main() {
  const pages = walkMd(docsRoot);
  const decisions = loadDecisionsByImage();
  /** @type {object[]} */
  const items = [];
  let skippedNoDecision = 0;
  const confidenceCounts = {};

  for (const file of pages) {
    const text = readFileSync(file, 'utf8');
    const components = extractComponents(text);
    const orphans = listOrphanImages(file, text);
    if (components.length === 0 && orphans.length === 0) continue;

    const pageRel = path.relative(repoRoot, file).replaceAll('\\', '/');
    const moduleKey = moduleKeyFromPage(text);
    const pageUrl = slugFromFrontMatter(text, file);
    const title = titleFromFrontMatter(text, file);
    const pairs = assignComponents(orphans, components, moduleKey, decisions);
    skippedNoDecision += Math.max(0, orphans.length - pairs.length);
    const used = new Set(pairs.map(({comp}) => `${comp.name}#${comp.index}`));

    for (const {orphan, comp, confidence, decidedComponent, renderMode, candidates} of pairs) {
      confidenceCounts[confidence] = (confidenceCounts[confidence] || 0) + 1;
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
        decidedComponent: decidedComponent || comp.name,
        pairConfidence: confidence,
        renderMode: renderMode || 'preview',
        props: renderMode === 'page-ref' ? {} : comp.props,
        candidates: renderMode === 'page-ref' && candidates?.length ? candidates : undefined,
        sourceSnippet:
          renderMode === 'page-ref'
            ? ''
            : comp.raw.replace(/\s+/g, ' ').trim().slice(0, 240),
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
        pairConfidence: 'direct',
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
    pairConfidence: confidenceCounts,
    skippedOrphansWithoutConvertedDecision: skippedNoDecision,
    items,
  };

  mkdirSync(outDir, {recursive: true});
  writeFileSync(outFile, JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`wrote ${items.length} items → ${path.relative(repoRoot, outFile)}`);
  console.log(bySource);
  console.log('pairConfidence', confidenceCounts);
  console.log('skipped orphans (no converted decision)', skippedNoDecision);
  console.log(byComponent);
}

main();
