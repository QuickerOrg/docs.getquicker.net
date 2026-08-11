#!/usr/bin/env node
/**
 * Build data/step-render/catalog.json from data/xaction/catalog.json
 * and overlay step icon specs + FA SVG paths from Quicker.
 *
 * Icon source (read-only):
 *   QUICKER_ROOT/QuickerPc/Quicker/Actions/XActions/BuildinRunners (*.Definition.cs)
 *   QUICKER_ROOT/Libs/FontAwesomeIconsWpf/EFontAwesomeIcon.cs
 * Extra glyphs: every `fa:Name` referenced from docs/ and src/.
 *
 *   node tools/screenshot-replace/build-step-catalog.mjs
 */
import {existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const srcPath = path.join(repoRoot, 'data', 'xaction', 'catalog.json');
const outDir = path.join(repoRoot, 'data', 'step-render');
const catalogOut = path.join(outDir, 'catalog.json');
const faOut = path.join(outDir, 'fa-icons.json');

const DEFAULT_QUICKER_ROOT = 'D:\\source\\repos\\quicker\\quickerorg\\Quicker';

function labelMap(items) {
  if (!Array.isArray(items)) return undefined;
  const out = {};
  for (const p of items) {
    if (!p || typeof p.key !== 'string' || !p.key.trim()) continue;
    if (typeof p.name !== 'string' || !p.name.trim()) continue;
    out[p.key.trim()] = p.name.trim();
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** @param {unknown} selections */
function enumMap(selections) {
  if (!selections || typeof selections !== 'object') return undefined;
  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  for (const [key, group] of Object.entries(selections)) {
    const items = group && typeof group === 'object' ? group.items : null;
    if (!Array.isArray(items)) continue;
    /** @type {Record<string, string>} */
    const map = {};
    for (const item of items) {
      const value = typeof item?.value === 'string' ? item.value.trim() : '';
      const name = typeof item?.name === 'string' ? item.name.trim() : '';
      if (value && name) map[value] = name;
    }
    if (Object.keys(map).length) out[key] = map;
  }
  return Object.keys(out).length ? out : undefined;
}

function camelParamKey(name) {
  if (!name) return '';
  return name.length === 1 ? name.toLowerCase() : name[0].toLowerCase() + name.slice(1);
}

/** Map Params.Property → InputParam/OutputParam Key. */
function collectParamKeys(csText) {
  /** @type {Record<string, string>} */
  const map = {};
  const re =
    /\[(?:ControlField)?(?:Input|Output)Param\(([\s\S]*?)\)\][\s\S]*?public\s+partial\s+\S+\s+(\w+)\s*\{/g;
  let m;
  while ((m = re.exec(csText))) {
    const prop = m[2];
    const key = /Key\s*=\s*"([^"]+)"/.exec(m[1])?.[1]?.trim() || camelParamKey(prop);
    if (prop && key) map[prop] = key;
  }
  return map;
}

/** Split StepSummary(...) args; commas inside strings / nameof() stay intact. */
function splitSummaryArgs(inner) {
  const parts = [];
  let buf = '';
  let depth = 0;
  let inStr = false;
  let escape = false;
  for (const ch of inner) {
    if (inStr) {
      buf += ch;
      if (escape) escape = false;
      else if (ch === '\\') escape = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') {
      inStr = true;
      buf += ch;
      continue;
    }
    if (ch === '(') depth += 1;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) {
      const piece = buf.trim();
      if (piece) parts.push(piece);
      buf = '';
      continue;
    }
    buf += ch;
  }
  const last = buf.trim();
  if (last) parts.push(last);
  return parts;
}

/**
 * Compile one C# StepSummary argument to a template part.
 * nameof(Params.Path) + " " → catalog key `path` (or literal).
 */
function compileSummaryArg(raw, propToKey) {
  let compiled = '';
  const tokenRe = /nameof\s*\(\s*Params\.(\w+)\s*\)|"((?:\\.|[^"\\])*)"/g;
  let m;
  while ((m = tokenRe.exec(raw))) {
    if (m[1]) compiled += m[1];
    else compiled += m[2].replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\"/g, '"');
  }
  if (!compiled && raw) return null;
  const tagged = /^([A-Za-z_]\w*)(!)?(?::(\d+))?$/.exec(compiled);
  if (tagged && propToKey[tagged[1]]) {
    return `${propToKey[tagged[1]]}${tagged[2] ?? ''}${tagged[3] != null ? `:${tagged[3]}` : ''}`;
  }
  return compiled;
}

/** Parse [StepSummary] next to [Step(Key=)] from Definition.cs. */
function collectStepSummaryParts(quickerRoot) {
  const runnersDir = path.join(
    quickerRoot,
    'QuickerPc',
    'Quicker',
    'Actions',
    'XActions',
    'BuildinRunners',
  );
  /** @type {Record<string, string[]>} */
  const byKey = {};
  for (const file of walkCs(runnersDir)) {
    const text = readFileSync(file, 'utf8');
    const propToKey = collectParamKeys(text);
    const summaryRe = /\[StepSummary\(([\s\S]*?)\)\]/g;
    let sm;
    while ((sm = summaryRe.exec(text))) {
      const before = text.slice(0, sm.index);
      const stepBlocks = [...before.matchAll(/\[Step\(([\s\S]*?)\)\]/g)];
      const lastStep = stepBlocks[stepBlocks.length - 1];
      const key = lastStep ? /Key\s*=\s*"([^"]+)"/.exec(lastStep[1])?.[1]?.trim() : '';
      if (!key) continue;
      const parts = splitSummaryArgs(sm[1])
        .map((arg) => compileSummaryArg(arg, propToKey))
        .filter((part) => part != null);
      if (parts.length) byKey[key] = parts;
    }
  }
  return byKey;
}

function walkCs(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkCs(full, acc);
    else if (name.endsWith('.Definition.cs')) acc.push(full);
  }
  return acc;
}

/** @param {string} spec */
function faNameFromSpec(spec) {
  const raw = spec.trim();
  if (!raw.toLowerCase().startsWith('fa:')) return '';
  const body = raw.slice(3).trim();
  const colon = body.indexOf(':');
  return (colon < 0 ? body : body.slice(0, colon)).trim();
}

/** Parse [Step(...)] blocks for Key + FaIcon / Icon. */
function collectStepIconSpecs(quickerRoot) {
  const runnersDir = path.join(
    quickerRoot,
    'QuickerPc',
    'Quicker',
    'Actions',
    'XActions',
    'BuildinRunners',
  );
  /** @type {Record<string, string>} */
  const byKey = {};
  for (const file of walkCs(runnersDir)) {
    const text = readFileSync(file, 'utf8');
    const blocks = text.matchAll(/\[Step\(([\s\S]*?)\)\]/g);
    for (const m of blocks) {
      const body = m[1];
      const key = /Key\s*=\s*"([^"]+)"/.exec(body)?.[1]?.trim();
      if (!key) continue;
      const iconStr = /(?<![A-Za-z])Icon\s*=\s*"([^"]+)"/.exec(body)?.[1]?.trim();
      const faEnum = /FaIcon\s*=\s*EFontAwesomeIcon\.(\w+)/.exec(body)?.[1]?.trim();
      if (iconStr) {
        byKey[key] = iconStr;
      } else if (faEnum) {
        byKey[key] = `fa:${faEnum}`;
      }
    }
  }
  return byKey;
}

const FA_SPEC_RE = /fa:((?:Light|Solid|Regular|Brands|Duotone)_[A-Za-z0-9]+)/g;
const SCAN_EXT = new Set(['.md', '.mdx', '.ts', '.tsx', '.js', '.mjs', '.css']);

function walkFiles(dir, acc = []) {
  if (!existsSync(dir)) return acc;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.docusaurus' || name === 'build') continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, acc);
    else if (SCAN_EXT.has(path.extname(name))) acc.push(full);
  }
  return acc;
}

/** Collect `fa:Name` specs used by docs previews and site components. */
function collectReferencedFaNames() {
  /** @type {Set<string>} */
  const names = new Set();
  for (const file of [...walkFiles(path.join(repoRoot, 'docs')), ...walkFiles(path.join(repoRoot, 'src'))]) {
    const text = readFileSync(file, 'utf8');
    FA_SPEC_RE.lastIndex = 0;
    let m;
    while ((m = FA_SPEC_RE.exec(text))) {
      names.add(m[1]);
    }
  }
  return names;
}

/** Load only the FA enum members we need from EFontAwesomeIcon.cs. */
function loadFaGlyphs(quickerRoot, names) {
  const enumFile = path.join(
    quickerRoot,
    'Libs',
    'FontAwesomeIconsWpf',
    'EFontAwesomeIcon.cs',
  );
  /** @type {Record<string, {path: string, width: number, height: number}>} */
  const out = {};
  if (!existsSync(enumFile) || names.size === 0) return out;

  const text = readFileSync(enumFile, 'utf8');
  const re =
    /\[FontAwesomeSvgInformation\("((?:\\.|[^"\\])*)",\s*(\d+),\s*(\d+)\)\]\s*(\w+)\s*,/g;
  let m;
  while ((m = re.exec(text))) {
    const name = m[4];
    if (!names.has(name)) continue;
    out[name] = {
      path: m[1],
      width: Number(m[2]),
      height: Number(m[3]),
    };
  }
  return out;
}

function resolveQuickerRoot() {
  const fromEnv = process.env.QUICKER_ROOT?.trim();
  const candidates = [fromEnv, DEFAULT_QUICKER_ROOT].filter(Boolean);
  for (const root of candidates) {
    const enumFile = path.join(root, 'Libs', 'FontAwesomeIconsWpf', 'EFontAwesomeIcon.cs');
    if (existsSync(enumFile)) return root;
  }
  return '';
}

const src = JSON.parse(readFileSync(srcPath, 'utf8'));
const runners = {};
for (const m of src.modules || []) {
  if (!m?.key || !m?.name) continue;
  const entry = {
    name: String(m.name).trim(),
  };
  if (m.description) entry.description = String(m.description).trim();
  if (m.stepType) entry.stepType = String(m.stepType).trim();
  const inputs = labelMap(m.inputs);
  const outputs = labelMap(m.outputs);
  if (inputs) entry.inputLabels = inputs;
  if (outputs) entry.outputLabels = outputs;
  const enums = enumMap(m.selections);
  if (enums) entry.inputEnums = enums;
  runners[m.key] = entry;
}

const quickerRoot = resolveQuickerRoot();
/** @type {string[]} */
const missingFa = [];
if (quickerRoot) {
  const iconByKey = collectStepIconSpecs(quickerRoot);
  const summaryByKey = collectStepSummaryParts(quickerRoot);
  for (const [key, parts] of Object.entries(summaryByKey)) {
    if (!runners[key]) continue;
    runners[key].summaryParts = parts;
  }
  const needed = collectReferencedFaNames();
  for (const [key, spec] of Object.entries(iconByKey)) {
    if (!runners[key]) continue;
    runners[key].icon = spec;
    const faName = faNameFromSpec(spec);
    if (faName) needed.add(faName);
  }
  const glyphs = loadFaGlyphs(quickerRoot, needed);
  for (const name of needed) {
    if (!glyphs[name]) missingFa.push(name);
  }
  mkdirSync(outDir, {recursive: true});
  writeFileSync(
    faOut,
    `${JSON.stringify(
      {
        schemaVersion: 1,
        generatedAt: new Date().toISOString(),
        source: path.relative(repoRoot, path.join(quickerRoot, 'Libs/FontAwesomeIconsWpf/EFontAwesomeIcon.cs')).replaceAll('\\', '/'),
        count: Object.keys(glyphs).length,
        icons: Object.fromEntries(
          Object.entries(glyphs).sort(([a], [b]) => a.localeCompare(b, 'en')),
        ),
      },
      null,
      2,
    )}\n`,
    'utf8',
  );
  console.log(
    `Wrote ${Object.keys(glyphs).length} FA glyphs → ${path.relative(repoRoot, faOut)}`,
  );
  if (missingFa.length) {
    console.warn(`Missing FA enum members: ${missingFa.join(', ')}`);
  }
} else {
  console.warn(
    'QUICKER_ROOT not found; catalog built without icon overlay. Set QUICKER_ROOT or clone Quicker to the default path.',
  );
}

if (runners['sys:if']) runners['if'] = {...runners['sys:if']};
if (runners['sys:simpleIf']) runners['if-only'] = {...runners['sys:simpleIf']};
if (runners['sys:each']) runners['loop'] = {...runners['sys:each']};

const catalog = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceVersion: 'xaction-catalog',
  runners,
};

mkdirSync(outDir, {recursive: true});
writeFileSync(catalogOut, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
const withIcon = Object.values(runners).filter((r) => r.icon).length;
console.log(
  `Wrote ${Object.keys(runners).length} runners (${withIcon} with icon) → ${path.relative(repoRoot, catalogOut)}`,
);
