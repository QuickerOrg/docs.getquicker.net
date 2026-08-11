/**
 * Offline IStepRunner.GetSummary for docs.
 * Source: Quicker.StepEngine StepSummaryHelper.GetSummaryFromParts
 * + StepNode.GetDefaultStepInfo (ToShortString 100, flatten newlines).
 *
 * Templates live on catalog.summaryParts, extracted from [StepSummary(...)].
 */
import type {StepCatalogRunner, StepWire} from './types';

const ROW_LIMIT = 100;

function toShortString(value: string, limit: number): string {
  if (limit <= 0 || value.length <= limit) return value;
  return `${value.slice(0, limit)}...`;
}

function parsePart(part: string): {
  key: string;
  direct: boolean;
  limit: number;
} | null {
  let body = part;
  let limit = 70;
  const colon = body.lastIndexOf(':');
  if (colon > 0 && colon < body.length - 1) {
    const n = Number(body.slice(colon + 1));
    if (Number.isFinite(n)) {
      body = body.slice(0, colon);
      limit = n;
    }
  }
  let direct = false;
  if (body.endsWith('!')) {
    direct = true;
    body = body.slice(0, -1);
  }
  const key = body.trim();
  if (!key) return null;
  return {key, direct, limit};
}

function displayValue(
  step: StepWire,
  key: string,
  enums: Readonly<Record<string, string>> | undefined,
  limit: number,
): string {
  const bound = step.outputs?.[key];
  if (bound != null) {
    return bound.trim() ? `{${bound.trim()}}` : '-';
  }
  const raw = step.inputs?.[key];
  if (raw == null) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^\{.+\}$/.test(trimmed)) return trimmed;
  const named = enums?.[trimmed];
  const text = named ?? raw;
  return toShortString(text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'), limit);
}

/**
 * Render one step's GetSummary text. Empty when the runner has no template.
 */
export function resolveStepSummary(
  step: StepWire,
  runner?: StepCatalogRunner | null,
): string {
  const parts = runner?.summaryParts;
  if (!parts?.length) return '';
  let out = '';
  for (const part of parts) {
    if (!part) continue;
    const parsed = parsePart(part);
    const isParam =
      parsed != null &&
      (step.inputs?.[parsed.key] != null ||
        step.outputs?.[parsed.key] != null ||
        runner?.inputLabels?.[parsed.key] != null ||
        runner?.outputLabels?.[parsed.key] != null);
    if (parsed && isParam) {
      out += displayValue(
        step,
        parsed.key,
        runner?.inputEnums?.[parsed.key],
        parsed.limit,
      );
    } else {
      out += part;
    }
  }
  return toShortString(out.replace(/\r?\n/g, ' '), ROW_LIMIT).trim();
}
