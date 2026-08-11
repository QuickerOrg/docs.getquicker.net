/**
 * Short step wire for docs / Agent (host-free).
 * Compatible with designer-ish aliases via {@link normalizeStepWire}.
 */
export type StepWire = {
  key: string;
  inputs?: Record<string, string>;
  outputs?: Record<string, string>;
  note?: string;
  disabled?: boolean;
  /** Optional display override; wins over catalog name when set. */
  title?: string;
  ifSteps?: StepWire[];
  elseSteps?: StepWire[];
};

/** One step-runner entry for offline catalog lookup. */
export type StepCatalogRunner = {
  name: string;
  description?: string;
  /** Icon spec: `fa:…`, `data:…`, https URL, or key into {@link StepCatalog.icons}. */
  icon?: string;
  /** Quicker StepType, e.g. If / Loop / Action — used for branch chrome hints. */
  stepType?: string;
  /** Param key → Chinese display name (from StepRunner / xaction catalog). */
  inputLabels?: Record<string, string>;
  outputLabels?: Record<string, string>;
  /** Param key → value → enum display name (for GetSummary). */
  inputEnums?: Record<string, Record<string, string>>;
  /**
   * `[StepSummary]` parts from the runner Definition.cs.
   * Param keys (optional `!` / `:n`) mixed with literal strings.
   */
  summaryParts?: string[];
};

/**
 * Offline catalog snapshot shipped with docs or embedded as JSON.
 * Build from Quicker StepRunner list (see scripts/build-catalog-from-runners.mjs).
 */
export type StepCatalog = {
  schemaVersion: 1;
  /** ISO or local timestamp string. */
  generatedAt?: string;
  /** Quicker / catalog release tag when known. */
  sourceVersion?: string;
  runners: Record<string, StepCatalogRunner>;
  /**
   * Optional static icon payloads keyed by catalog `icon` value or `res:` path.
   * Prefer data URLs for docs embeds so no Host icon API is required.
   */
  icons?: Record<string, string>;
};

export type StepRowPresentation = {
  primary: string;
  secondary?: string;
  iconSpec: string;
  titleAttr: string;
  stepType?: string;
};

export type StepProgramDensity = "docs" | "compact";

/** One row in the optional side variable list (Headless VariableList, docs-narrow). */
export type ProgramVar = {
  name: string;
  /** Catalog type, e.g. Text / Boolean / Image. */
  type?: string;
  remark?: string;
};
