/**
 * Parse sys:select `items` / `operations` lines (same rules as the module doc).
 * First line `|=sep` or `$$|=sep` changes the display|value delimiter.
 */

export type ParsedSelectItem = {
  label: string;
  value: string;
  icon?: string;
};

function stripIcon(raw: string): {icon?: string; rest: string} {
  const match = /^\[([^\]]+)\]/.exec(raw);
  if (!match) return {rest: raw};
  return {icon: match[1].trim(), rest: raw.slice(match[0].length)};
}

function stripTooltip(label: string): string {
  const match = /\(([^)]{3,})\)$/.exec(label);
  if (!match) return label;
  return label.slice(0, match.index);
}

export function parseSelectDelimiter(raw: string): {delim: string; lines: string[]} {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  if (lines.length === 0) return {delim: '|', lines};
  const first = lines[0]?.trim().replace(/^\$\$/, '') ?? '';
  if (first.startsWith('|=')) {
    return {delim: first.slice(2), lines: lines.slice(1)};
  }
  return {delim: '|', lines};
}

export function parseSelectItems(raw: string): ParsedSelectItem[] {
  const {delim, lines} = parseSelectDelimiter(raw);
  const out: ParsedSelectItem[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const {icon, rest} = stripIcon(trimmed);
    let label = rest;
    let value = rest;
    if (delim) {
      const at = rest.lastIndexOf(delim);
      if (at >= 0) {
        label = rest.slice(0, at);
        value = rest.slice(at + delim.length);
      }
    }
    label = stripTooltip(label).trim();
    value = value.trim();
    out.push({
      label: label || value,
      value: value || label,
      icon,
    });
  }
  return out;
}

/** `[=]!Label|value` lines become footer buttons; other `[=]` lines need “…”. */
export function parseSelectGlobalChrome(raw: string): {
  buttons: string[];
  showMoreMenu: boolean;
} {
  const buttons: string[] = [];
  let showMoreMenu = false;
  for (const line of raw.replace(/\r\n/g, '\n').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('[=]')) continue;
    let rest = trimmed.slice(3);
    const iconed = stripIcon(rest);
    rest = iconed.rest;
    if (rest.startsWith('!')) {
      const item = parseSelectItems(rest.slice(1))[0];
      if (item?.label) buttons.push(item.label);
      continue;
    }
    showMoreMenu = true;
  }
  return {buttons, showMoreMenu};
}

export function resolveSelectIndex(
  items: readonly ParsedSelectItem[],
  defaultValue: string | undefined,
): number | undefined {
  const wanted = (defaultValue ?? '').trim();
  if (!wanted || items.length === 0) return undefined;
  const byValue = items.findIndex((item) => item.value === wanted);
  if (byValue >= 0) return byValue;
  if (/^\d+$/.test(wanted)) {
    const index = Number(wanted);
    if (index >= 0 && index < items.length) return index;
  }
  return undefined;
}
