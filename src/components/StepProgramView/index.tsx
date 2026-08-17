import {useEffect, useState, type ReactNode} from 'react';
import defaultCatalog from '@site/data/step-render/catalog.json';
import {loadExampleAction, type ExampleAction} from './exampleRegistry';
import {
  StepProgramView as StepProgramViewInner,
  type StepProgramViewProps,
} from './StepProgramView';
import './styles.css';

export type {StepProgramViewProps};
export type {WheelDelayDemoConfig, WheelDelayKind, WheelDelayTick} from './useWheelDelayDemo';
export type {
  StepCatalog,
  StepCatalogRunner,
  StepProgramDensity,
  ProgramVar,
  StepRowPresentation,
  StepWire,
} from './types';
export {
  normalizeStepCatalog,
  normalizeStepList,
  normalizeStepWire,
} from './normalize';
export {resolveParamLabel} from './resolveParamLabel';
export {resolveStepRowPresentation} from './resolvePresentation';
export {DocsStepIcon} from './DocsStepIcon';
export {StepInspectPopup} from './StepInspectPopup';

type Props = Omit<StepProgramViewProps, 'catalog' | 'data'> & {
  /** Offline runner catalog; defaults to data/step-render/catalog.json. */
  catalog?: StepProgramViewProps['catalog'];
  data?: StepProgramViewProps['data'];
  /** Shared-action GUID; loads `data/step-render/examples/<code>.json`. */
  example?: string;
};

/**
 * Docs MDX entry: read-only XAction step list.
 * Read-only list sliced from Headless `StepListEditor` / `StepListRowPreview`.
 */
export default function StepProgramView({
  catalog = defaultCatalog,
  example,
  data,
  caption,
  variables,
  showVariables,
  ...rest
}: Props): ReactNode {
  const skipExampleLoad = Boolean(data);
  const [loaded, setLoaded] = useState<ExampleAction | null>(null);
  const [exampleReady, setExampleReady] = useState(!example || skipExampleLoad);

  useEffect(() => {
    if (!example || skipExampleLoad) {
      setLoaded(null);
      setExampleReady(true);
      return;
    }
    setExampleReady(false);
    let cancelled = false;
    void loadExampleAction(example).then((next) => {
      if (cancelled) {
        return;
      }
      setLoaded(next);
      setExampleReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [example, skipExampleLoad]);

  if (!exampleReady) {
    return (
      <div
        className="qk-docs-preview-fallback"
        role="status"
        aria-label="正在加载示例动作"
      />
    );
  }

  const resolved = data ?? loaded;
  return (
    <StepProgramViewInner
      {...rest}
      catalog={catalog}
      data={resolved ?? {steps: []}}
      caption={caption ?? loaded?.title}
      variables={variables ?? loaded?.variables}
      showVariables={showVariables ?? Boolean(loaded?.variables?.length)}
    />
  );
}
