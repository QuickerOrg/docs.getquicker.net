import {type ReactNode} from 'react';
import {MDXProvider} from '@mdx-js/react';
import components from '../mdxComponentsMap';

/**
 * Re-apply the site MDX map via MDXProvider. Faster/Rspack can drop theme
 * MDX mappings; wrapping here keeps names like ModuleParamPreview available
 * without a local import in every Markdown page.
 */
export default function MDXContent({children}: {children: ReactNode}): ReactNode {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
