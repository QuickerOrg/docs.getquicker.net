#!/usr/bin/env node
/**
 * OCR docs screenshots via qk-ocr-lite, then guess screenshot kind for
 * image → MDX component replacement.
 *
 *   node tools/screenshot-replace/ocr-classify.mjs <image.png> [...]
 *   node tools/screenshot-replace/ocr-classify.mjs --dir docs/v2/xaction/modules/basic/img --limit 20
 *   node tools/screenshot-replace/ocr-classify.mjs --from-md docs/v2/xaction/modules/basic/mouse.md
 *   node tools/screenshot-replace/ocr-classify.mjs --from-inventory tools/temp/xaction-inventory.json
 *
 * Env:
 *   QK_OCR_LITE_ROOT   default D:\source\repos\quicker\quickerorg\qk-ocr-lite
 *   QK_OCR_MODELS      override models dir (det.onnx + rec.onnx + dict)
 */
import {spawnSync} from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import {fileURLToPath} from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const DEFAULT_OCR_ROOT = 'D:\\source\\repos\\quicker\\quickerorg\\qk-ocr-lite';
const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.bmp', '.webp']);

/** @typedef {'step-param'|'var-def'|'steps'|'editor-chrome'|'runtime-dialog'|'runtime-toast'|'choice-list'|'context-menu'|'diagram'|'decorative'|'unknown'} Kind */
/** @typedef {'replace'|'keep'|'review'} Action */

/**
 * @typedef {{kind: Kind, weight: number, re: RegExp, cue?: string}} Rule
 */

/** @type {Rule[]} */
const RULES = [
  {kind: 'step-param', weight: 4, re: /保存\s*\(?\s*S\s*\)?/i, cue: '保存(S)'},
  {kind: 'step-param', weight: 3, re: /编辑步骤/, cue: '编辑步骤'},
  {kind: 'step-param', weight: 3, re: /模块参数设置/, cue: '模块参数设置'},
  {kind: 'step-param', weight: 2, re: /停用此步骤/, cue: '停用此步骤'},
  {kind: 'step-param', weight: 2, re: /运行后延迟/, cue: '运行后延迟'},
  {kind: 'step-param', weight: 1, re: /查看说明/, cue: '查看说明'},
  {kind: 'step-param', weight: 1, re: /(?<![一-龥])常规(?![一-龥])/, cue: '常规'},
  {kind: 'step-param', weight: 1, re: /(?<![一-龥])高级(?![一-龥])/, cue: '高级'},

  {kind: 'var-def', weight: 4, re: /添加变量|编辑变量/, cue: '变量对话框'},
  {kind: 'var-def', weight: 2, re: /变量名/, cue: '变量名'},
  {kind: 'var-def', weight: 2, re: /数据类型|变量类型/, cue: '类型'},
  {kind: 'var-def', weight: 2, re: /默认值/, cue: '默认值'},

  {kind: 'steps', weight: 3, re: /添加步骤/, cue: '添加步骤'},
  {kind: 'steps', weight: 2, re: /(?<![一-龥])否则(?![一-龥])/, cue: '否则'},
  {kind: 'steps', weight: 2, re: /如果(?![一-龥])/, cue: '如果'},
  {kind: 'steps', weight: 1, re: /步骤列表|执行步骤/, cue: '步骤列表'},

  {kind: 'editor-chrome', weight: 3, re: /动作设计器|动作编辑器/, cue: '设计器'},
  {kind: 'editor-chrome', weight: 2, re: /工具箱/, cue: '工具箱'},
  {kind: 'editor-chrome', weight: 2, re: /变量列表|局部变量/, cue: '变量栏'},

  {kind: 'choice-list', weight: 4, re: /请选择/, cue: '请选择'},
  {kind: 'choice-list', weight: 2, re: /确定\s*\(\s*S\s*\)/i, cue: '确定(S)'},
  {kind: 'choice-list', weight: 1, re: /取消\s*\(\s*C\s*\)/i, cue: '取消(C)'},

  {kind: 'context-menu', weight: 2, re: /识别类型|连续截图|悬浮此动作|调试运行/, cue: '菜单项'},
  {kind: 'context-menu', weight: 1, re: /通用文字|高精度文字|营业执照/, cue: '识别子菜单'},

  {kind: 'runtime-dialog', weight: 2, re: /确定\s*\(?\s*O?K?\s*\)?/i, cue: '确定'},
  {kind: 'runtime-dialog', weight: 1, re: /是\s*\(?\s*Y\s*\)?/i, cue: '是'},
  {kind: 'runtime-dialog', weight: 1, re: /否\s*\(?\s*N\s*\)?/i, cue: '否'},
  {kind: 'runtime-dialog', weight: 1, re: /取消\s*\(?\s*C?\s*\)?/i, cue: '取消'},

  {kind: 'diagram', weight: 2, re: /原点|坐标系|示意图/, cue: '示意图'},
  {kind: 'diagram', weight: 1, re: /x\s*=\s*0\s*,\s*y\s*=\s*0/i, cue: '原点坐标'},
  {kind: 'diagram', weight: 1, re: /[Xx]轴|[Yy]轴/, cue: '坐标轴'},
];

/** @type {Record<Kind, {component: string|null, action: Action}>} */
const KIND_MAP = {
  'step-param': {component: 'ModuleParamPreview', action: 'replace'},
  'var-def': {component: 'VariableDefPreview', action: 'replace'},
  steps: {component: 'StepProgramView', action: 'review'},
  'editor-chrome': {component: 'StepProgramView', action: 'review'},
  // Planned components: keep action=review until implemented in MDXComponents
  'runtime-dialog': {component: 'MsgBoxPreview', action: 'replace'},
  'runtime-toast': {component: 'NotifyToastPreview', action: 'replace'},
  'choice-list': {component: 'ChoiceListPreview', action: 'replace'},
  'context-menu': {component: 'ContextMenuPreview', action: 'replace'},
  diagram: {component: null, action: 'keep'},
  decorative: {component: null, action: 'keep'},
  unknown: {component: null, action: 'review'},
};

function parseArgs(argv) {
  /** @type {{images: string[], dirs: string[], fromMds: string[], inventories: string[], limit: number, json: boolean, out: string, text: boolean, models: string, ocrRoot: string, corpusOut: string, help: boolean}} */
  const out = {
    images: [],
    dirs: [],
    fromMds: [],
    inventories: [],
    limit: 0,
    json: true,
    out: '',
    text: false,
    models: process.env.QK_OCR_MODELS ?? '',
    ocrRoot: process.env.QK_OCR_LITE_ROOT ?? DEFAULT_OCR_ROOT,
    corpusOut: '',
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--dir') out.dirs.push(argv[++i] ?? '');
    else if (a === '--from-md') out.fromMds.push(argv[++i] ?? '');
    else if (a === '--from-inventory') out.inventories.push(argv[++i] ?? '');
    else if (a === '--limit') out.limit = Number(argv[++i] ?? 0) || 0;
    else if (a === '--out') out.out = argv[++i] ?? '';
    else if (a === '--models') out.models = argv[++i] ?? '';
    else if (a === '--ocr-root') out.ocrRoot = argv[++i] ?? '';
    else if (a === '--corpus-out') out.corpusOut = argv[++i] ?? '';
    else if (a === '--text') out.text = true;
    else if (a === '--no-json') out.json = false;
    else if (a === '-h' || a === '--help') out.help = true;
    else if (!a.startsWith('-')) out.images.push(a);
  }
  return out;
}

function resolveModels(ocrRoot, explicit) {
  const candidates = [
    explicit,
    path.join(ocrRoot, 'models', 'ppocrv6', 'tiny'),
    path.join(
      process.env.USERPROFILE ?? '',
      'Documents',
      'Quicker',
      '_packages',
      'quicker.ocr.v6tiny',
      '0.2.0',
    ),
  ].filter(Boolean);
  for (const dir of candidates) {
    if (existsSync(path.join(dir, 'det.onnx')) && existsSync(path.join(dir, 'rec.onnx'))) {
      return path.resolve(dir);
    }
  }
  throw new Error(
    `OCR models not found. Set QK_OCR_MODELS or put det.onnx under ${ocrRoot}\\models\\ppocrv6\\tiny`,
  );
}

function resolveCliProject(ocrRoot) {
  const csproj = path.join(ocrRoot, 'src', 'QuickerOcrLite.Cli', 'QuickerOcrLite.Cli.csproj');
  if (!existsSync(csproj)) {
    throw new Error(`QuickerOcrLite.Cli not found at ${csproj}. Set QK_OCR_LITE_ROOT.`);
  }
  return csproj;
}

function collectFromDir(dir) {
  const abs = path.resolve(repoRoot, dir);
  /** @type {string[]} */
  const files = [];
  for (const name of readdirSync(abs)) {
    const full = path.join(abs, name);
    if (!statSync(full).isFile()) continue;
    if (IMAGE_EXT.has(path.extname(name).toLowerCase())) files.push(full);
  }
  return files.sort((a, b) => a.localeCompare(b, 'en'));
}

function collectFromMd(mdPath) {
  const abs = path.resolve(repoRoot, mdPath);
  const text = readFileSync(abs, 'utf8');
  const base = path.dirname(abs);
  /** @type {string[]} */
  const files = [];
  for (const m of text.matchAll(/!\[[^\]]*\]\((\.\/img\/[^)]+)\)/g)) {
    const full = path.resolve(base, m[1]);
    if (existsSync(full)) files.push(full);
  }
  return files;
}

function collectFromInventory(inventoryPath) {
  const abs = path.resolve(repoRoot, inventoryPath);
  const payload = JSON.parse(readFileSync(abs, 'utf8'));
  const rows = Array.isArray(payload) ? payload : payload.items ?? payload.results ?? [];
  return rows
    .map((item) => {
      if (typeof item === 'string') return path.resolve(repoRoot, item);
      if (item?.page && item?.image) {
        return path.resolve(repoRoot, path.dirname(item.page), item.image);
      }
      if (item?.image) return path.resolve(repoRoot, item.image);
      return '';
    })
    .filter(Boolean);
}

/**
 * @param {string} fullText
 * @param {number} blockCount
 */
function classifyText(fullText, blockCount) {
  /** @type {Record<string, number>} */
  const scores = {};
  /** @type {string[]} */
  const cues = [];
  for (const rule of RULES) {
    if (!rule.re.test(fullText)) continue;
    scores[rule.kind] = (scores[rule.kind] ?? 0) + rule.weight;
    if (rule.cue && !cues.includes(rule.cue)) cues.push(rule.cue);
  }

  const compact = fullText.replace(/\s+/g, '');
  if (blockCount <= 4 && compact.length > 0 && compact.length < 80 && !scores['step-param'] && !scores['var-def']) {
    scores['runtime-toast'] = (scores['runtime-toast'] ?? 0) + 3;
    if (!cues.includes('短文案')) cues.push('短文案');
  }
  if (blockCount <= 8 && (scores.diagram ?? 0) >= 2 && (scores['step-param'] ?? 0) === 0) {
    scores.diagram = (scores.diagram ?? 0) + 1;
  }

  /** @type {[Kind, number][]} */
  const ranked = Object.entries(scores)
    .map(([k, v]) => /** @type {[Kind, number]} */ ([/** @type {Kind} */ (k), v]))
    .sort((a, b) => b[1] - a[1]);

  /** @type {Kind} */
  let kind = ranked[0]?.[0] ?? 'unknown';
  let top = ranked[0]?.[1] ?? 0;
  const second = ranked[1]?.[1] ?? 0;

  // Prefer choice-list over generic runtime-dialog when picker chrome is present
  if (
    (scores['choice-list'] ?? 0) >= 4 &&
    (scores['step-param'] ?? 0) < 3 &&
    /请选择/.test(fullText)
  ) {
    kind = 'choice-list';
    top = scores['choice-list'];
  }

  // Runtime dialog without step-param chrome
  if (kind === 'runtime-dialog' && (scores['step-param'] ?? 0) >= 3) {
    kind = 'step-param';
    top = scores['step-param'];
  }

  // Context menu: many short items, no save chrome
  if (
    (scores['context-menu'] ?? 0) >= 3 &&
    (scores['step-param'] ?? 0) === 0 &&
    !/保存\s*\(?\s*S\s*\)?/i.test(fullText)
  ) {
    kind = 'context-menu';
    top = scores['context-menu'];
  }

  if (blockCount <= 2 && (scores['step-param'] ?? 0) === 0 && (scores['choice-list'] ?? 0) === 0) {
    kind = 'runtime-toast';
  }
  if (blockCount === 0 || compact.length === 0) kind = 'decorative';

  /** @type {'high'|'medium'|'low'} */
  let confidence = 'low';
  if (top >= 6 && top - second >= 2) confidence = 'high';
  else if (top >= 3) confidence = 'medium';

  const map = KIND_MAP[kind] ?? KIND_MAP.unknown;
  /** @type {Action} */
  let action = map.action;
  if (kind === 'step-param' && confidence === 'low') action = 'review';
  if (kind === 'steps' && confidence === 'high') action = 'review'; // still need wire data

  return {
    kind,
    confidence,
    action,
    component: map.component,
    score: top,
    scores,
    cues,
  };
}

/**
 * @param {string} csproj
 * @param {string} models
 * @param {string[]} images
 * @param {string} corpusOut
 */
function runOcrBatch(csproj, models, images, corpusOut) {
  if (images.length === 0) return [];

  if (images.length === 1) {
    const args = [
      'run',
      '--project',
      csproj,
      '-c',
      'Release',
      '-p:SkipObfuscation=true',
      '--',
      images[0],
      '--cpu',
      '--models',
      models,
      '--threads',
      '4',
    ];
    const res = spawnSync('dotnet', args, {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      windowsHide: true,
    });
    if (res.status !== 0) {
      throw new Error(`OCR failed for ${images[0]}:\n${res.stderr || res.stdout}`);
    }
    const jsonText = extractJsonObject(res.stdout);
    const parsed = JSON.parse(jsonText);
    return [
      {
        filePath: path.resolve(images[0]),
        fileName: path.basename(images[0]),
        fullText: parsed.FullText ?? '',
        blockCount: Array.isArray(parsed.Blocks) ? parsed.Blocks.length : 0,
        isSuccess: Boolean(parsed.IsSuccess),
        error: parsed.Error ?? null,
      },
    ];
  }

  const tmp = mkdtempSync(path.join(os.tmpdir(), 'qk-ocr-classify-'));
  try {
    for (const img of images) {
      const dest = path.join(tmp, path.basename(img));
      // Avoid collisions when same basename from different folders
      const unique = existsSync(dest)
        ? path.join(tmp, `${path.parse(img).name}__${hashSuffix(img)}${path.extname(img)}`)
        : dest;
      try {
        linkSync(img, unique);
      } catch {
        copyFileSync(img, unique);
      }
    }
    const outPath = corpusOut || path.join(tmp, 'corpus.json');
    const args = [
      'run',
      '--project',
      csproj,
      '-c',
      'Release',
      '-p:SkipObfuscation=true',
      '--',
      '--corpus',
      '--images',
      tmp,
      '--out',
      outPath,
      '--cpu',
      '--models',
      models,
      '--threads',
      '4',
    ];
    const res = spawnSync('dotnet', args, {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      windowsHide: true,
    });
    if (res.status !== 0 && !existsSync(outPath)) {
      throw new Error(`OCR corpus failed:\n${res.stderr || res.stdout}`);
    }
    const manifest = JSON.parse(readFileSync(outPath, 'utf8'));
    /** @type {Map<string, string>} */
    const byBase = new Map(images.map((p) => [path.basename(p), path.resolve(p)]));
    return (manifest.Cases ?? []).map((c) => {
      const name = c.FileName;
      const orig =
        byBase.get(name) ||
        images.find((p) => path.basename(p) === name.replace(/__[a-f0-9]+(?=\.[^.]+$)/, '')) ||
        c.FilePath;
      return {
        filePath: path.resolve(orig),
        fileName: path.basename(orig),
        fullText: c.Text ?? c.Result?.FullText ?? '',
        blockCount: Array.isArray(c.Result?.Blocks) ? c.Result.Blocks.length : (c.Text ? c.Text.split(/\n/).length : 0),
        isSuccess: Boolean(c.IsSuccess),
        error: c.Error ?? null,
      };
    });
  } finally {
    rmSync(tmp, {recursive: true, force: true});
  }
}

function hashSuffix(p) {
  let h = 0;
  for (let i = 0; i < p.length; i += 1) h = (h * 31 + p.charCodeAt(i)) >>> 0;
  return h.toString(16).slice(0, 6);
}

function extractJsonObject(stdout) {
  const start = stdout.indexOf('{');
  const end = stdout.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error(`No JSON in OCR stdout:\n${stdout.slice(0, 500)}`);
  return stdout.slice(start, end + 1);
}

function printHelp() {
  console.log(`Usage:
  node tools/screenshot-replace/ocr-classify.mjs <image...>
  node tools/screenshot-replace/ocr-classify.mjs --dir <img-dir> [--limit N]
  node tools/screenshot-replace/ocr-classify.mjs --from-md <page.md>
  node tools/screenshot-replace/ocr-classify.mjs --from-inventory <inventory.json>

Options:
  --models <dir>     PP-OCRv6 model folder (det.onnx + rec.onnx)
  --ocr-root <dir>   qk-ocr-lite repo root
  --out <file.json>  write results JSON
  --text             also print fullText lines to stderr
  --no-json          table output only
`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  /** @type {string[]} */
  let images = [...args.images.map((p) => path.resolve(repoRoot, p))];
  for (const d of args.dirs) images.push(...collectFromDir(d));
  for (const md of args.fromMds) images.push(...collectFromMd(md));
  for (const inventory of args.inventories) images.push(...collectFromInventory(inventory));
  images = [...new Set(images)].filter((p) => {
    if (!existsSync(p)) {
      console.error(`missing: ${p}`);
      return false;
    }
    if (path.extname(p).toLowerCase() === '.gif') return false;
    return IMAGE_EXT.has(path.extname(p).toLowerCase());
  });
  if (args.limit > 0) images = images.slice(0, args.limit);
  if (images.length === 0) {
    printHelp();
    process.exit(1);
  }

  const ocrRoot = path.resolve(args.ocrRoot);
  const models = resolveModels(ocrRoot, args.models);
  const csproj = resolveCliProject(ocrRoot);

  console.error(`ocr-root=${ocrRoot}`);
  console.error(`models=${models}`);
  console.error(`images=${images.length}`);

  const ocrRows = runOcrBatch(csproj, models, images, args.corpusOut);
  const results = ocrRows.map((row) => {
    const cls = classifyText(row.fullText, row.blockCount);
    const rel = path.relative(repoRoot, row.filePath).replaceAll('\\', '/');
    return {
      image: rel,
      absPath: row.filePath,
      kind: cls.kind,
      confidence: cls.confidence,
      action: cls.action,
      component: cls.component,
      score: cls.score,
      cues: cls.cues,
      blockCount: row.blockCount,
      isSuccess: row.isSuccess,
      error: row.error,
      fullText: row.fullText,
    };
  });

  if (args.text) {
    for (const r of results) {
      console.error(`---- ${r.image} [${r.kind}/${r.action}] ----`);
      console.error(r.fullText);
    }
  }

  // Human table on stderr
  console.error('image\tkind\taction\tconf\tcues');
  for (const r of results) {
    console.error(`${r.image}\t${r.kind}\t${r.action}\t${r.confidence}\t${r.cues.join(',')}`);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    models,
    count: results.length,
    results: results.map(({fullText, ...rest}) =>
      args.text ? {fullText, ...rest} : {...rest, fullTextPreview: fullText.split(/\n/).slice(0, 12).join('\n')},
    ),
  };

  if (args.out) {
    const outPath = path.resolve(repoRoot, args.out);
    mkdirSync(path.dirname(outPath), {recursive: true});
    writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf8');
    console.error(`wrote ${outPath}`);
  }

  if (args.json) {
    console.log(JSON.stringify(payload, null, 2));
  }
}

main();
