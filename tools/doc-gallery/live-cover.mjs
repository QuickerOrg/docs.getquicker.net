/**
 * Extract the first compact runtime preview from MDX for DocCard live covers.
 * Only widgets that read well at ~300×148 (dialogs / toast / input).
 */

export const LIVE_COVER_TAGS = [
  'MsgBoxPreview',
  'NotifyToastPreview',
  'UserInputPreview',
  'ChoiceListPreview',
  'WaitWinPreview',
];

const TAG_RE = new RegExp(
  `<(${LIVE_COVER_TAGS.join('|')})\\b([\\s\\S]*?)(?:/>|>\\s*</(?:${LIVE_COVER_TAGS.join('|')})>)`,
);

/**
 * @param {string} raw
 * @returns {string}
 */
function unescapeString(raw) {
  let out = '';
  for (let i = 0; i < raw.length; i += 1) {
    if (raw[i] !== '\\' || i === raw.length - 1) {
      out += raw[i];
      continue;
    }
    const next = raw[i + 1];
    i += 1;
    if (next === 'n') out += '\n';
    else if (next === 't') out += '\t';
    else if (next === 'r') out += '\r';
    else out += next;
  }
  return out;
}

/**
 * @param {string} expr
 * @returns {unknown}
 */
function parseBraceExpr(expr) {
  const text = expr.trim();
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  const quoted = text.match(/^(['"])([\s\S]*)\1$/);
  if (quoted) return unescapeString(quoted[2]);
  if (text.startsWith('[') && text.endsWith(']')) {
    const items = [];
    const itemRe = /(['"])((?:\\.|(?!\1)[\s\S])*?)\1/g;
    let item;
    while ((item = itemRe.exec(text))) {
      items.push(unescapeString(item[2]));
    }
    return items;
  }
  return undefined;
}

/**
 * @param {string} attrs
 * @returns {Record<string, unknown>}
 */
export function parseJsxProps(attrs) {
  /** @type {Record<string, unknown>} */
  const props = {};
  const re =
    /([A-Za-z_][\w]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([\s\S]*?)\}))?/g;
  let match;
  while ((match = re.exec(attrs))) {
    const key = match[1];
    if (match[2] != null) {
      props[key] = unescapeString(match[2]);
    } else if (match[3] != null) {
      props[key] = unescapeString(match[3]);
    } else if (match[4] != null) {
      const value = parseBraceExpr(match[4]);
      if (value !== undefined) props[key] = value;
    } else {
      props[key] = true;
    }
  }
  return props;
}

/**
 * @param {string} body
 * @returns {{name: string, props: Record<string, unknown>} | null}
 */
export function extractLiveCover(body) {
  const match = TAG_RE.exec(body);
  if (!match) return null;
  return {
    name: match[1],
    props: parseJsxProps(match[2]),
  };
}
