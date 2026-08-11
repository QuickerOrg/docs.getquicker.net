/**
 * Step-runner `fileExt` overlay for docs param previews.
 * Catalog sync tables do not carry fileExt yet; keep this map until they do.
 * Prefer first-line `//.js` / `##.py` in the value when present (Quicker editor hint).
 *
 * Note: qkrpc reports sys:csscript.script fileExt as `.js` (wrong); use `.cs`.
 */
export const PARAM_FILE_EXT: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  'sys:jsscript': {script: '.js'},
  'sys:csscript': {
    script: '.cs',
    scriptForLp: '.cs',
    scriptForAssembly: '.cs',
  },
  'sys:pythonscript': {script: '.py'},
  'sys:chromecontrol': {script: '.js'},
  'sys:webview2': {script: '.js'},
};

const FIRST_LINE_EXT = /^(?:\/\/|##|;|--)\.([A-Za-z0-9]+)\b/;

const EXT_TO_PRISM: Readonly<Record<string, string>> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  cs: 'csharp',
  py: 'python',
  ps1: 'powershell',
  json: 'json',
  html: 'markup',
  xml: 'markup',
  css: 'css',
  md: 'markdown',
  cmd: 'batch',
  bat: 'batch',
};

function normalizeExt(raw: string | undefined): string {
  return (raw ?? '').trim().replace(/^\./, '').toLowerCase();
}

/** Prism language from first-line hint, then step-runner fileExt. */
export function resolvePrismLanguage(
  fileExt: string | undefined,
  value: string,
): string | undefined {
  const firstLine = value.split(/\r?\n/, 1)[0] ?? '';
  const fromValue = FIRST_LINE_EXT.exec(firstLine)?.[1];
  const ext = normalizeExt(fromValue ?? fileExt);
  return ext ? EXT_TO_PRISM[ext] : undefined;
}

export function resolveRunScriptFileExt(
  scriptType: string | undefined,
  customExt?: string,
): string | undefined {
  const type = (scriptType ?? '').trim();
  if (type === 'PS') return '.ps1';
  if (type === 'AHK') return '.ahk';
  if (type === 'BAT') return '.bat';
  if (type === 'CMD_F' || type.startsWith('CMD_')) return '.cmd';
  if (type === 'CUSTOM') return customExt;
  return undefined;
}
