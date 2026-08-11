import {getModuleDef} from '@site/data/xaction/modules-index';
import type {ProgramVar, StepWire} from './types';

const VAR_NAME = /^[\w\u4e00-\u9fff][\w\u4e00-\u9fff.-]*$/;

function walk(steps: readonly StepWire[], visit: (step: StepWire) => void): void {
  for (const step of steps) {
    visit(step);
    if (step.ifSteps?.length) walk(step.ifSteps, visit);
    if (step.elseSteps?.length) walk(step.elseSteps, visit);
  }
}

function isVarName(raw: string): boolean {
  const name = raw.trim();
  if (!name || name.startsWith('$') || name.includes('\n')) return false;
  return VAR_NAME.test(name);
}

/**
 * Collect action variables from step output bindings (and `{name}` input refs).
 * Explicit `overrides` win on type / remark / order-prepended extras.
 */
export function collectProgramVars(
  steps: readonly StepWire[],
  overrides?: readonly ProgramVar[],
): ProgramVar[] {
  const byName = new Map<string, ProgramVar>();
  walk(steps, (step) => {
    const module = getModuleDef(step.key);
    for (const [outKey, raw] of Object.entries(step.outputs ?? {})) {
      if (!isVarName(raw)) continue;
      const name = raw.trim();
      const type = module?.outputs.find((item) => item.key === outKey)?.type;
      const prev = byName.get(name);
      if (!prev) {
        byName.set(name, {name, type});
        continue;
      }
      if (!prev.type && type) byName.set(name, {...prev, type});
    }
  });
  for (const extra of overrides ?? []) {
    const name = extra.name.trim();
    if (!name) continue;
    const prev = byName.get(name);
    byName.set(name, prev ? {...prev, ...extra, name} : {...extra, name});
  }
  return [...byName.values()];
}
