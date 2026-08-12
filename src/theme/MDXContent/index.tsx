import React, {type ComponentProps, type ReactNode} from 'react';
import {MDXProvider} from '@mdx-js/react';
import ThemeMDXComponents from '@theme-original/MDXComponents';
import Mermaid from '@theme/Mermaid';
import XActionModuleMeta from '@site/src/components/XActionModuleMeta';
import StepProgramView from '@site/src/components/StepProgramView';
import VariableDefPreview from '@site/src/components/VariableDefPreview';
import ModuleParamPreview from '@site/src/components/ModuleParamPreview';
import NotifyToastPreview from '@site/src/components/NotifyToastPreview';
import MsgBoxPreview from '@site/src/components/MsgBoxPreview';
import ChoiceListPreview from '@site/src/components/ChoiceListPreview';
import ContextMenuPreview from '@site/src/components/ContextMenuPreview';
import WaitWinPreview from '@site/src/components/WaitWinPreview';
import TableFieldPreview from '@site/src/components/TableFieldPreview';
import TableDataPreview from '@site/src/components/TableDataPreview';
import PreviewCompare from '@site/src/components/PreviewCompare';
import PreviewMap from '@site/src/components/PreviewMap';
import PreviewMarks from '@site/src/components/PreviewMarks';
import ShareLinkCard from '@site/src/components/ShareLinkCard';
import RelatedDocs from '@site/src/components/RelatedDocs';
import XActionLanding from '@site/src/components/XActionLanding';
import CoordDiagram from '@site/src/components/CoordDiagram';
import ClickIndicatorPreview from '@site/src/components/ClickIndicatorPreview';
import UserInputPreview from '@site/src/components/UserInputPreview';
import ActionEditorPreview from '@site/src/components/ActionEditorPreview';
import NativeImg from '@site/src/theme/MDXComponents/NativeImg';

type MDXComponentsType = NonNullable<ComponentProps<typeof MDXProvider>['components']>;

const components = {
  ...ThemeMDXComponents,
  // Faster/Rspack can drop theme MDX mappings; register explicitly.
  mermaid: Mermaid,
  Mermaid,
  img: NativeImg,
  XActionModuleMeta,
  StepProgramView,
  VariableDefPreview,
  ModuleParamPreview,
  NotifyToastPreview,
  MsgBoxPreview,
  ChoiceListPreview,
  ContextMenuPreview,
  WaitWinPreview,
  TableFieldPreview,
  TableDataPreview,
  PreviewCompare,
  PreviewMap,
  PreviewMarks,
  ShareLinkCard,
  RelatedDocs,
  XActionLanding,
  CoordDiagram,
  ClickIndicatorPreview,
  UserInputPreview,
  ActionEditorPreview,
} as MDXComponentsType;

export default function MDXContent({children}: {children: ReactNode}): ReactNode {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
