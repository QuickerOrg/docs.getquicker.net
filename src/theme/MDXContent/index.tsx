import React, {type ReactNode} from 'react';
import {MDXProvider} from '@mdx-js/react';
import type {MDXComponents as MDXComponentsType} from '@mdx-js/react';
import ThemeMDXComponents from '@theme-original/MDXComponents';
import XActionModuleMeta from '@site/src/components/XActionModuleMeta';

const components = {
  ...ThemeMDXComponents,
  XActionModuleMeta,
} as MDXComponentsType;

export default function MDXContent({children}: {children: ReactNode}): ReactNode {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
