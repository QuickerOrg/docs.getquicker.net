import type {ProgramVar, StepWire} from './types';

export type ExampleAction = {
  code: string;
  title: string;
  description?: string;
  author?: string;
  revision?: number;
  source: string;
  pulledAt?: string;
  variables?: ProgramVar[];
  steps: StepWire[];
};

const EXAMPLE_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const cache = new Map<string, ExampleAction>();
const inflight = new Map<string, Promise<ExampleAction | null>>();

function normalizeCode(code: string): string {
  return code.trim().toLowerCase();
}

/**
 * Load one shared-action example JSON. Webpack emits a separate async chunk
 * per file under `data/step-render/examples/`; pages only download the GUID
 * they render.
 */
export function loadExampleAction(code: string): Promise<ExampleAction | null> {
  const key = normalizeCode(code);
  if (!EXAMPLE_ID.test(key)) {
    return Promise.resolve(null);
  }
  const cached = cache.get(key);
  if (cached) {
    return Promise.resolve(cached);
  }
  const pending = inflight.get(key);
  if (pending) {
    return pending;
  }
  const task = import(
    `../../../data/step-render/examples/${key}.json`
  )
    .then((mod: {default?: ExampleAction} & ExampleAction) => {
      const data = mod.default ?? mod;
      cache.set(key, data);
      inflight.delete(key);
      return data;
    })
    .catch(() => {
      inflight.delete(key);
      return null;
    });
  inflight.set(key, task);
  return task;
}

/** Sync peek at examples already loaded on this page. */
export function getExampleAction(code: string): ExampleAction | null {
  return cache.get(normalizeCode(code)) ?? null;
}
