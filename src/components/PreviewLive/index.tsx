/**
 * Live value bus for PreviewMap: the param form reports catalog values,
 * and the runtime preview (MsgBoxPreview, …) re-renders from them.
 */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export type PreviewLiveSnapshot = {
  values: Readonly<Record<string, string>>;
  extras: {
    actionIcon?: string;
  };
};

const PreviewLiveEnabledContext = createContext(false);
const PreviewLiveReportContext = createContext<
  ((next: PreviewLiveSnapshot | null) => void) | null
>(null);
const PreviewLiveSnapshotContext = createContext<PreviewLiveSnapshot | null>(
  null,
);

function valuesEqual(
  a: Readonly<Record<string, string>>,
  b: Readonly<Record<string, string>>,
): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if ((a[key] ?? '') !== (b[key] ?? '')) return false;
  }
  return true;
}

function snapshotEqual(
  a: PreviewLiveSnapshot | null,
  b: PreviewLiveSnapshot | null,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.extras.actionIcon === b.extras.actionIcon && valuesEqual(a.values, b.values)
  );
}

export function PreviewLiveProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const [snapshot, setSnapshot] = useState<PreviewLiveSnapshot | null>(null);
  const report = useCallback((next: PreviewLiveSnapshot | null) => {
    setSnapshot((prev) => (snapshotEqual(prev, next) ? prev : next));
  }, []);
  return (
    <PreviewLiveEnabledContext.Provider value={true}>
      <PreviewLiveReportContext.Provider value={report}>
        <PreviewLiveSnapshotContext.Provider value={snapshot}>
          {children}
        </PreviewLiveSnapshotContext.Provider>
      </PreviewLiveReportContext.Provider>
    </PreviewLiveEnabledContext.Provider>
  );
}

/** Present when the tree is inside PreviewMap (enables live text editing). */
export function usePreviewLiveEnabled(): boolean {
  return useContext(PreviewLiveEnabledContext);
}

export function usePreviewLiveReporter():
  | ((next: PreviewLiveSnapshot | null) => void)
  | null {
  return useContext(PreviewLiveReportContext);
}

export function usePreviewLiveSnapshot(): PreviewLiveSnapshot | null {
  return useContext(PreviewLiveSnapshotContext);
}
