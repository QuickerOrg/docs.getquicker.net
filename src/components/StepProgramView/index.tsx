import type {ReactNode} from 'react';
import defaultCatalog from '@site/data/step-render/catalog.json';
import {
  StepProgramView as StepProgramViewInner,
  type StepProgramViewProps,
} from './StepProgramView';
import './styles.css';

export type {StepProgramViewProps};
export type {
  StepCatalog,
  StepCatalogRunner,
  StepProgramDensity,
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

type Props = Omit<StepProgramViewProps, 'catalog'> & {
  /** Offline runner catalog; defaults to data/step-render/catalog.json. */
  catalog?: StepProgramViewProps['catalog'];
};

/**
 * Docs MDX entry: read-only XAction step list.
 * Read-only list sliced from Headless `StepListEditor` / `StepListRowPreview`.
 */
export default function StepProgramView({
  catalog = defaultCatalog,
  ...rest
}: Props): ReactNode {
  return <StepProgramViewInner catalog={catalog} {...rest} />;
}
