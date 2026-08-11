import { resolveParamLabel } from "./resolveParamLabel";
import type { StepCatalog, StepRowPresentation, StepWire } from "./types";

function formatParamPreview(
  map: Record<string, string> | undefined,
  labels: Readonly<Record<string, string>> | undefined,
  limit = 1,
): string[] {
  if (!map) return [];
  const parts: string[] = [];
  for (const [key, value] of Object.entries(map)) {
    if (!value.trim()) continue;
    const label = resolveParamLabel(key, labels);
    const compact = value.replace(/\s+/g, " ").trim();
    const shown = compact.length > 48 ? `${compact.slice(0, 48)}…` : compact;
    parts.push(`${label}: ${shown}`);
    if (parts.length >= limit) break;
  }
  return parts;
}

/**
 * Pure row labels for docs render: catalog name + note/summary, no Host.
 */
export function resolveStepRowPresentation(
  step: StepWire,
  catalog?: StepCatalog | null,
): StepRowPresentation {
  const entry = catalog?.runners[step.key];
  const primary = (step.title?.trim() || entry?.name?.trim() || step.key).trim();
  const note = step.note?.trim();
  const summaryBits = [
    ...formatParamPreview(step.inputs, entry?.inputLabels, 1),
    ...formatParamPreview(step.outputs, entry?.outputLabels, 1),
  ];
  // Prefer explicit note; else compact Quicker-like summary from labeled params.
  const secondary = note || (summaryBits.length > 0 ? summaryBits.join(" · ") : undefined);
  const iconSpec = (entry?.icon ?? "").trim();
  const titleAttr = secondary ? `${primary} — ${secondary}` : primary;
  return {
    primary,
    secondary,
    iconSpec,
    titleAttr,
    stepType: entry?.stepType,
  };
}
