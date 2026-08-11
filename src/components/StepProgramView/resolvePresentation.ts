import {resolveStepSummary} from './resolveStepSummary';
import {stripStepCommentStyleMarker} from './stepCommentTint';
import type {StepCatalog, StepRowPresentation, StepWire} from './types';

/**
 * Compact list-row labels. Same formula as Headless resolveStepListRowPresentation:
 * note wins; else Host GetSummary (here: catalog [StepSummary] parts).
 * Strip `[tint:red]` / `[#hex]` markers from the visible note (WPF StepNode).
 */
export function resolveStepRowPresentation(
  step: StepWire,
  catalog?: StepCatalog | null,
): StepRowPresentation {
  const entry = catalog?.runners[step.key];
  const primary = (step.title?.trim() || entry?.name?.trim() || step.key).trim();
  const note = stripStepCommentStyleMarker(step.note).trim();
  const summary = stripStepCommentStyleMarker(resolveStepSummary(step, entry)).trim();
  const secondary = note || summary || undefined;
  const iconSpec = (entry?.icon ?? '').trim();
  const titleAttr = secondary ? `${primary} — ${secondary}` : primary;
  return {
    primary,
    secondary,
    iconSpec,
    titleAttr,
    stepType: entry?.stepType,
  };
}
