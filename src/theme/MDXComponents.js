import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
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
import ShareLinkCard from '@site/src/components/ShareLinkCard';
import XActionLanding from '@site/src/components/XActionLanding';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Faster/Rspack can drop theme MDX mappings; register explicitly.
  mermaid: Mermaid,
  Mermaid,
  // Available in every MDX/Markdown page without local import
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
  ShareLinkCard,
  XActionLanding,
};
