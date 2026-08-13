import {type ComponentType, type ReactNode} from 'react';
import XActionModuleMeta from '@site/src/components/XActionModuleMeta';
import StepProgramView from '@site/src/components/StepProgramView';
import ModuleParamPreview from '@site/src/components/ModuleParamPreview';
import ElseToggleMenuDemo from '@site/src/components/ContextMenuPreview/ElseToggleMenuDemo';

/**
 * One webpack async chunk for step-list / param previews.
 * ActionEditorPreview stays on its own chunk (it needs the full xaction catalog).
 * Marker string must survive minify so postBuild can find this file if needed.
 */
export const QK_HEAVY_PREVIEW_CHUNK = 'qk-chunk:heavy-preview';

export type HeavyPreviewName =
  | 'XActionModuleMeta'
  | 'StepProgramView'
  | 'ModuleParamPreview'
  | 'ElseToggleMenuDemo';

const HEAVY_PREVIEWS: Record<HeavyPreviewName, ComponentType<Record<string, unknown>>> = {
  XActionModuleMeta: XActionModuleMeta as ComponentType<Record<string, unknown>>,
  StepProgramView: StepProgramView as ComponentType<Record<string, unknown>>,
  ModuleParamPreview: ModuleParamPreview as ComponentType<Record<string, unknown>>,
  ElseToggleMenuDemo: ElseToggleMenuDemo as ComponentType<Record<string, unknown>>,
};

export default function HeavyPreviewHost({
  component,
  ...props
}: {component: HeavyPreviewName} & Record<string, unknown>): ReactNode {
  const Comp = HEAVY_PREVIEWS[component];
  if (!Comp) {
    return null;
  }
  return <Comp {...props} />;
}

HeavyPreviewHost.displayName = QK_HEAVY_PREVIEW_CHUNK;
