import React from 'react';
// Import the original mapper
import MDXComponents from '@theme-original/MDXComponents';
import XActionModuleMeta from '@site/src/components/XActionModuleMeta';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Available in every MDX/Markdown page without local import
  XActionModuleMeta,
};
