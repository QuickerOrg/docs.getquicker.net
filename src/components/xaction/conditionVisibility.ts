/** Catalog conditions currently use compact labels such as `仅：download, query`. */
export function isStepParamVisible(
  param: {condition?: string},
  currentValues: Readonly<Record<string, string>>,
  showHidden = false,
): boolean {
  const raw = param.condition?.trim() ?? '';
  if (!raw || showHidden) return true;

  const only = /^仅[：:]\s*(.+)$/.exec(raw);
  if (!only) return true;

  const wanted = only[1]
    .split(/[,，]/)
    .map((value) => value.trim())
    .filter(Boolean);
  if (wanted.length === 0) return true;

  return Object.values(currentValues).some((value) => wanted.includes(value));
}
