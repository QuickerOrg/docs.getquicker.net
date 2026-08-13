import type {ComponentProps} from 'react';
import type {MDXProvider} from '@mdx-js/react';
import ThemeMDXComponents from '@theme-original/MDXComponents';
import NativeImg from '@site/src/theme/MDXComponents/NativeImg';
import RelatedDocs from '@site/src/components/RelatedDocs';
import ShareLinkCard from '@site/src/components/ShareLinkCard';
import {lazyHeavy, lazyMdx} from './lazyMdxComponent';

type MDXComponentsType = NonNullable<
  ComponentProps<typeof MDXProvider>['components']
>;

/**
 * Lightweight pieces stay eager (every docs page). Heavy live previews are
 * React.lazy so homepage / prose pages do not download catalog.json, example
 * actions, or editor chrome.
 */
const mdxComponentsMap = {
  ...ThemeMDXComponents,
  mermaid: lazyMdx(() => import('@theme/Mermaid')),
  Mermaid: lazyMdx(() => import('@theme/Mermaid')),
  img: NativeImg,
  RelatedDocs,
  ShareLinkCard,
  XActionModuleMeta: lazyHeavy('XActionModuleMeta'),
  StepProgramView: lazyHeavy('StepProgramView'),
  VariableDefPreview: lazyMdx(
    () => import('@site/src/components/VariableDefPreview'),
  ),
  ModuleParamPreview: lazyHeavy('ModuleParamPreview'),
  NotifyToastPreview: lazyMdx(
    () => import('@site/src/components/NotifyToastPreview'),
  ),
  MobileNotificationPreview: lazyMdx(
    () => import('@site/src/components/MobileNotificationPreview'),
  ),
  MsgBoxPreview: lazyMdx(() => import('@site/src/components/MsgBoxPreview')),
  ChoiceListPreview: lazyMdx(
    () => import('@site/src/components/ChoiceListPreview'),
  ),
  ContextMenuPreview: lazyMdx(
    () => import('@site/src/components/ContextMenuPreview'),
  ),
  ElseToggleMenuDemo: lazyHeavy('ElseToggleMenuDemo'),
  WaitWinPreview: lazyMdx(() => import('@site/src/components/WaitWinPreview')),
  TableFieldPreview: lazyMdx(
    () => import('@site/src/components/TableFieldPreview'),
  ),
  TableDataPreview: lazyMdx(
    () => import('@site/src/components/TableDataPreview'),
  ),
  PreviewCompare: lazyMdx(() => import('@site/src/components/PreviewCompare')),
  PreviewMap: lazyMdx(() => import('@site/src/components/PreviewMap')),
  PreviewMarks: lazyMdx(() => import('@site/src/components/PreviewMarks')),
  XActionLanding: lazyMdx(() => import('@site/src/components/XActionLanding')),
  CoordDiagram: lazyMdx(() => import('@site/src/components/CoordDiagram')),
  ClickIndicatorPreview: lazyMdx(
    () => import('@site/src/components/ClickIndicatorPreview'),
  ),
  UserInputPreview: lazyMdx(
    () => import('@site/src/components/UserInputPreview'),
  ),
  ActionEditorPreview: lazyMdx(
    () =>
      import(
        /* webpackChunkName: "qk-action-editor-preview" */
        '@site/src/components/ActionEditorPreview'
      ),
  ),
  TextWindowPreview: lazyMdx(
    () => import('@site/src/components/TextWindowPreview'),
  ),
  ReportProgressPreview: lazyMdx(
    () => import('@site/src/components/ReportProgressPreview'),
  ),
  ExpressionAssistPreview: lazyMdx(
    () => import('@site/src/components/ExpressionAssistPreview'),
  ),
  SearchBoxPreview: lazyMdx(
    () => import('@site/src/components/SearchBoxPreview'),
  ),
  ScreenshotSelectionDemo: lazyMdx(
    () => import('@site/src/components/ScreenshotSelectionDemo'),
  ),
  GestureTriggerDemo: lazyMdx(
    () => import('@site/src/components/GestureTriggerDemo'),
  ),
  FlowChart: lazyMdx(() => import('@site/src/components/FlowChart')),
} as MDXComponentsType;

export default mdxComponentsMap;
