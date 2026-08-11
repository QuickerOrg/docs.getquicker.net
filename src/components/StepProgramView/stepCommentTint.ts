/**
 * Comment / step note tint markers — ported from Headless
 * `features/steps/stepCommentTint.ts` (WPF StepNode `[tint:red]…`).
 */
export const STEP_COMMENT_TINTS = ['red', 'yellow', 'green', 'blue', 'gray'] as const;
export type StepCommentTint = (typeof STEP_COMMENT_TINTS)[number];

const TINT_PREFIX = 'tint:';

export function normalizeStepCommentTint(
  value: string | null | undefined,
): StepCommentTint | null {
  const raw = (value ?? '').trim().toLowerCase();
  if (raw === 'grey') {
    return 'gray';
  }
  return (STEP_COMMENT_TINTS as readonly string[]).includes(raw)
    ? (raw as StepCommentTint)
    : null;
}

export function parseStepCommentStyle(text: string | null | undefined): {
  displayText: string;
  tint: StepCommentTint | null;
  hexBackground: string | null;
} {
  const source = text ?? '';
  if (!source.startsWith('[') || source.indexOf(']') <= 1) {
    return {displayText: source, tint: null, hexBackground: null};
  }
  const end = source.indexOf(']');
  const marker = source.slice(1, end);
  if (marker.toLowerCase().startsWith(TINT_PREFIX)) {
    const tint = normalizeStepCommentTint(marker.slice(TINT_PREFIX.length));
    if (tint) {
      return {displayText: source.slice(end + 1), tint, hexBackground: null};
    }
  }
  if (marker.startsWith('#')) {
    const bg = marker.split(',')[0]?.trim() ?? '';
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(bg)) {
      return {displayText: source.slice(end + 1), tint: null, hexBackground: bg};
    }
  }
  return {displayText: source, tint: null, hexBackground: null};
}

export function stripStepCommentStyleMarker(
  text: string | null | undefined,
): string {
  return parseStepCommentStyle(text).displayText;
}

/** Dark text on light custom hex, light text on dark — WCAG-ish luminance. */
export function contrastOnHex(hex: string): string {
  const raw = hex.trim().replace('#', '');
  const full =
    raw.length === 3
      ? raw
          .split('')
          .map((ch) => `${ch}${ch}`)
          .join('')
      : raw.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return '#1a1a1a';
  }
  const toLin = (channel: number): number => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const r = toLin(Number.parseInt(full.slice(0, 2), 16));
  const g = toLin(Number.parseInt(full.slice(2, 4), 16));
  const b = toLin(Number.parseInt(full.slice(4, 6), 16));
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.45 ? '#1a1a1a' : '#f4f4f5';
}
