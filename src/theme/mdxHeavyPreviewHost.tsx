import {type ComponentType, type ReactNode} from 'react';
import XActionModuleMeta from '@site/src/components/XActionModuleMeta';
import StepProgramView from '@site/src/components/StepProgramView';
import ModuleParamPreview from '@site/src/components/ModuleParamPreview';
import ActionEditorPreview from '@site/src/components/ActionEditorPreview';
import ElseToggleMenuDemo from '@site/src/components/ContextMenuPreview/ElseToggleMenuDemo';

/**
 * One webpack async chunk for catalog-coupled previews. MDX tags pass
 * `component` so React.lazy is declared once (avoids duplicating catalog.json).
 */
export type HeavyPreviewName =
  | 'XActionModuleMeta'
  | 'StepProgramView'
  | 'ModuleParamPreview'
  | 'ActionEditorPreview'
  | 'ElseToggleMenuDemo';

const HEAVY_PREVIEWS: Record<HeavyPreviewName, ComponentType<Record<string, unknown>>> = {
  XActionModuleMeta: XActionModuleMeta as ComponentType<Record<string, unknown>>,
  StepProgramView: StepProgramView as ComponentType<Record<string, unknown>>,
  ModuleParamPreview: ModuleParamPreview as ComponentType<Record<string, unknown>>,
  ActionEditorPreview: ActionEditorPreview as ComponentType<Record<string, unknown>>,
  ElseToggleMenuDemo: ElseToggleMenuDemo as ComponentType<Record<string, unknown>>,
};

export default function HeavyPreviewHost({
  component,
  ...props
}: {component: HeavyPreviewName} & Record<string, unknown>): ReactNode {
  const Comp = HEAVY_PREVIEWS[component];
  return <Comp {...props} />;
}
