import type { StepCatalog, StepCatalogRunner, StepWire } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readLabelMap(raw: unknown): Record<string, string> | undefined {
  if (!isRecord(raw)) return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = k.trim();
    if (!key || typeof v !== "string" || !v.trim()) continue;
    out[key] = v.trim();
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function asStringMap(value: unknown): Record<string, string> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }
  const out: Record<string, string> = {};
  for (const [rawKey, rawVal] of Object.entries(value)) {
    const k = rawKey.trim();
    if (!k) continue;
    if (typeof rawVal === "string") {
      if (rawVal.trim()) {
        // Designer short wire: `input.var` → catalog key `input`.
        out[k.endsWith(".var") ? k.slice(0, -4) : k] = rawVal;
      }
      continue;
    }
    // Designer inputParams: { varKey?, value? }
    if (isRecord(rawVal)) {
      const varKey = typeof rawVal.varKey === "string" ? rawVal.varKey.trim() : "";
      const text =
        typeof rawVal.value === "string"
          ? rawVal.value
          : rawVal.value == null
            ? ""
            : String(rawVal.value);
      // Keep the runner param key so catalog labels still resolve.
      if (varKey) {
        out[k] = varKey;
      } else if (text.trim()) {
        out[k] = text;
      }
      continue;
    }
    if (rawVal != null && String(rawVal).trim()) {
      out[k] = String(rawVal);
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Normalize short wire or designer-ish step objects for presentational render. */
export function normalizeStepWire(raw: unknown): StepWire | null {
  if (!isRecord(raw)) {
    return null;
  }
  const key =
    (typeof raw.key === "string" && raw.key.trim()) ||
    (typeof raw.stepRunnerKey === "string" && raw.stepRunnerKey.trim()) ||
    (typeof raw.StepRunnerKey === "string" && raw.StepRunnerKey.trim()) ||
    "";
  if (!key) {
    return null;
  }

  const inputs = asStringMap(raw.inputs ?? raw.inputParams ?? raw.InputParams);
  const outputs = asStringMap(raw.outputs ?? raw.outputParams ?? raw.OutputParams);
  const note =
    typeof raw.note === "string" && raw.note.trim()
      ? raw.note.trim()
      : typeof raw.Remark === "string" && raw.Remark.trim()
        ? raw.Remark.trim()
        : undefined;
  const title =
    typeof raw.title === "string" && raw.title.trim()
      ? raw.title.trim()
      : typeof raw.displayName === "string" && raw.displayName.trim()
        ? raw.displayName.trim()
        : undefined;
  const disabled = raw.disabled === true || raw.Disabled === true ? true : undefined;
  const delayRaw = raw.delayMs ?? raw.DelayMs;
  const delayParsed =
    typeof delayRaw === "number"
      ? delayRaw
      : typeof delayRaw === "string"
        ? Number.parseInt(delayRaw, 10)
        : Number.NaN;
  const delayMs =
    Number.isFinite(delayParsed) && delayParsed > 0 ? Math.round(delayParsed) : undefined;

  const ifRaw = raw.ifSteps ?? raw.IfSteps;
  const elseRaw = raw.elseSteps ?? raw.ElseSteps;
  const ifSteps = Array.isArray(ifRaw)
    ? ifRaw.map(normalizeStepWire).filter((s): s is StepWire => s != null)
    : undefined;
  const elseSteps = Array.isArray(elseRaw)
    ? elseRaw.map(normalizeStepWire).filter((s): s is StepWire => s != null)
    : undefined;

  const step: StepWire = { key };
  if (inputs) step.inputs = inputs;
  if (outputs) step.outputs = outputs;
  if (note) step.note = note;
  if (title) step.title = title;
  if (disabled) step.disabled = true;
  if (delayMs != null) step.delayMs = delayMs;
  if (ifSteps && ifSteps.length > 0) step.ifSteps = ifSteps;
  if (elseSteps && elseSteps.length > 0) step.elseSteps = elseSteps;
  return step;
}

export function normalizeStepList(data: unknown): StepWire[] {
  let value = data;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return [];
    }
  }
  if (Array.isArray(value)) {
    return value.map(normalizeStepWire).filter((s): s is StepWire => s != null);
  }
  if (isRecord(value)) {
    if (Array.isArray(value.steps)) {
      return value.steps.map(normalizeStepWire).filter((s): s is StepWire => s != null);
    }
    const single = normalizeStepWire(value);
    return single ? [single] : [];
  }
  return [];
}

/** Accept catalog object or JSON string; invalid input yields empty runners. */
export function normalizeStepCatalog(raw: unknown): StepCatalog {
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value) as unknown;
    } catch {
      return { schemaVersion: 1, runners: {} };
    }
  }
  if (!isRecord(value)) {
    return { schemaVersion: 1, runners: {} };
  }
  const runnersRaw = isRecord(value.runners) ? value.runners : {};
  const runners: StepCatalog["runners"] = {};
  for (const [key, entry] of Object.entries(runnersRaw)) {
    const k = key.trim();
    if (!k || !isRecord(entry)) continue;
    const name = typeof entry.name === "string" ? entry.name.trim() : "";
    if (!name) continue;
    const item: StepCatalogRunner = { name };
    if (typeof entry.description === "string" && entry.description.trim()) {
      item.description = entry.description.trim();
    }
    if (typeof entry.icon === "string" && entry.icon.trim()) {
      item.icon = entry.icon.trim();
    }
    if (typeof entry.stepType === "string" && entry.stepType.trim()) {
      item.stepType = entry.stepType.trim();
    }
    const inputLabels = readLabelMap(entry.inputLabels);
    const outputLabels = readLabelMap(entry.outputLabels);
    if (inputLabels) item.inputLabels = inputLabels;
    if (outputLabels) item.outputLabels = outputLabels;
    if (Array.isArray(entry.summaryParts)) {
      const parts = entry.summaryParts
        .filter((part): part is string => typeof part === 'string')
        .map((part) => part);
      if (parts.length) item.summaryParts = parts;
    }
    if (isRecord(entry.inputEnums)) {
      const enums: Record<string, Record<string, string>> = {};
      for (const [paramKey, group] of Object.entries(entry.inputEnums)) {
        const pk = paramKey.trim();
        if (!pk || !isRecord(group)) continue;
        const map = readLabelMap(group);
        if (map) enums[pk] = map;
      }
      if (Object.keys(enums).length) item.inputEnums = enums;
    }
    runners[k] = item;
  }
  const iconsRaw = isRecord(value.icons) ? value.icons : undefined;
  const icons: Record<string, string> | undefined = iconsRaw
    ? Object.fromEntries(
        Object.entries(iconsRaw).filter(
          (pair): pair is [string, string] =>
            typeof pair[0] === "string" &&
            pair[0].trim().length > 0 &&
            typeof pair[1] === "string" &&
            pair[1].trim().length > 0,
        ),
      )
    : undefined;
  return {
    schemaVersion: 1,
    generatedAt: typeof value.generatedAt === "string" ? value.generatedAt : undefined,
    sourceVersion: typeof value.sourceVersion === "string" ? value.sourceVersion : undefined,
    runners,
    icons: icons && Object.keys(icons).length > 0 ? icons : undefined,
  };
}
