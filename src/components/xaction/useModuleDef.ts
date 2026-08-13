import {useEffect, useState} from 'react';
import {
  getModuleDef,
  loadModuleDef,
  type XActionModuleDef,
} from '@site/data/xaction/modules-index';

export type ModuleDefState = {
  module: XActionModuleDef | undefined;
  ready: boolean;
};

/** Load one module JSON; reuses the sync cache when already fetched. */
export function useModuleDef(moduleKey: string): ModuleDefState {
  const [module, setModule] = useState<XActionModuleDef | undefined>(() =>
    getModuleDef(moduleKey),
  );
  const [ready, setReady] = useState(() => getModuleDef(moduleKey) !== undefined);

  useEffect(() => {
    const cached = getModuleDef(moduleKey);
    if (cached) {
      setModule(cached);
      setReady(true);
      return undefined;
    }
    let cancelled = false;
    setReady(false);
    void loadModuleDef(moduleKey).then((next) => {
      if (cancelled) {
        return;
      }
      setModule(next);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [moduleKey]);

  return {module, ready};
}
