/**
 * Build-time index of combo-action modules for docs UI.
 * Prefer catalog.json (full defs) over per-file imports.
 * Regenerated conceptually whenever catalog sync runs; safe to keep as thin wrapper.
 */
import catalog from './catalog.json';

export type XActionParam = {
  key: string;
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  variableMode?: string;
  condition?: string;
  description?: string;
};

export type XActionOutput = {
  key: string;
  name: string;
  type: string;
  condition?: string;
  description?: string;
};

export type XActionSelectionItem = {
  value: string;
  name: string;
  description?: string;
};

export type XActionSelection = {
  name: string;
  items: XActionSelectionItem[];
};

export type XActionModuleDef = {
  key: string;
  name: string;
  description?: string;
  category: string;
  categoryName: string;
  stepType: string;
  isRisky: boolean;
  isProOnly: boolean;
  inputs: XActionParam[];
  outputs: XActionOutput[];
  selections?: Record<string, XActionSelection>;
};

type CatalogShape = {
  modules: XActionModuleDef[];
};

const typedCatalog = catalog as CatalogShape;

export const modulesByKey: Record<string, XActionModuleDef> = Object.fromEntries(
  typedCatalog.modules.map((module) => [module.key, module]),
);

export function getModuleDef(moduleKey: string): XActionModuleDef | undefined {
  return modulesByKey[moduleKey];
}
