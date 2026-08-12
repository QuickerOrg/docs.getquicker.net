import type {ReactNode} from 'react';
import defaultCatalog from '@site/data/step-render/catalog.json';
import {getExampleAction} from './exampleRegistry';
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
  const loaded = example ? getExampleAction(example) : null;
  return (
    <StepProgramViewInner
      {...rest}
      catalog={catalog}
      data={data ?? loaded ?? {steps: []}}
      caption={caption ?? loaded?.title}
      variables={variables ?? loaded?.variables}
      showVariables={showVariables ?? Boolean(loaded?.variables?.length)}
    />
  );
}
