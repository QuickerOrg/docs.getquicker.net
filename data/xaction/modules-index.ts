/**
 * Combo-action module defs for docs UI.
 * Full catalogs stay on disk; each page loads only the module JSON it renders.
 * Kept in sync with docs:xaction:sync (do not hand-edit).
 */
import {PARAM_FILE_EXT} from './param-file-ext';

export type XActionParam = {
  key: string;
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  variableMode?: string;
  condition?: string;
  description?: string;
  /** Step-runner fileExt (e.g. `.js`) for param-field syntax highlight. */
  fileExt?: string;
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

const MODULE_FILE = /^[A-Za-z0-9_]+$/;

const moduleCache = new Map<string, XActionModuleDef>();
const inflight = new Map<string, Promise<XActionModuleDef | undefined>>();

function toModuleFileName(moduleKey: string): string | null {
  const name = moduleKey.trim().replace(/:/g, '_');
  return MODULE_FILE.test(name) ? name : null;
}

function applyParamFileExt(module: XActionModuleDef): XActionModuleDef {
  const byKey = PARAM_FILE_EXT[module.key];
  if (!byKey) {
    return module;
  }
  let changed = false;
  const inputs = module.inputs.map((input) => {
    const fileExt = input.fileExt ?? byKey[input.key];
    if (!fileExt || input.fileExt === fileExt) {
      return input;
    }
    changed = true;
    return {...input, fileExt};
  });
  return changed ? {...module, inputs} : module;
}

function remember(module: XActionModuleDef): XActionModuleDef {
  const next = applyParamFileExt(module);
  moduleCache.set(next.key, next);
  return next;
}

/** Sync cache lookup. Does not download; use `loadModuleDef` to fill the cache. */
export function getModuleDef(moduleKey: string): XActionModuleDef | undefined {
  return moduleCache.get(moduleKey);
}

/**
 * Load one `data/xaction/modules/<key>.json` async chunk.
 * Webpack emits a separate file per module; pages only download what they render.
 */
export function loadModuleDef(
  moduleKey: string,
): Promise<XActionModuleDef | undefined> {
  const cached = moduleCache.get(moduleKey);
  if (cached) {
    return Promise.resolve(cached);
  }
  const pending = inflight.get(moduleKey);
  if (pending) {
    return pending;
  }
  const fileName = toModuleFileName(moduleKey);
  if (!fileName) {
    return Promise.resolve(undefined);
  }
  const task = import(
    /* webpackChunkName: "xaction-mod-[request]" */
    `./modules/${fileName}.json`
  )
    .then((mod: {default?: XActionModuleDef} & XActionModuleDef) => {
      const data = mod.default ?? mod;
      inflight.delete(moduleKey);
      if (!data || typeof data.key !== 'string') {
        return undefined;
      }
      return remember(data);
    })
    .catch(() => {
      inflight.delete(moduleKey);
      return undefined;
    });
  inflight.set(moduleKey, task);
  return task;
}
