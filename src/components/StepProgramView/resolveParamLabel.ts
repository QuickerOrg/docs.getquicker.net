/**
 * Docs wires often use variable names as param keys (selectedText, list…).
 * Map those onto catalog keys so Chinese labels still resolve.
 */
const PARAM_KEY_ALIASES: Readonly<Record<string, readonly string[]>> = {
  selectedText: ["output", "text", "content"],
  selectSuccess: ["isSuccess", "success"],
  success: ["isSuccess"],
  list: ["input", "items"],
  items: ["input", "list"],
  content: ["text", "output", "input"],
  message: ["msg"],
  msg: ["message"],
};

function labelOf(
  labels: Readonly<Record<string, string>>,
  key: string,
): string | undefined {
  const direct = labels[key]?.trim();
  if (direct) return direct;
  const lower = key.toLowerCase();
  for (const [k, v] of Object.entries(labels)) {
    if (k.toLowerCase() === lower && v.trim()) return v.trim();
  }
  return undefined;
}

/** Catalog display name for a wire param key; falls back to the raw key. */
export function resolveParamLabel(
  key: string,
  labels?: Readonly<Record<string, string>>,
): string {
  if (!labels) return key;
  const hit = labelOf(labels, key);
  if (hit) return hit;
  for (const alias of PARAM_KEY_ALIASES[key] ?? []) {
    const mapped = labelOf(labels, alias);
    if (mapped) return mapped;
  }
  return key;
}
