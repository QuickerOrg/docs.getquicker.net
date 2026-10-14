import type {ReactNode} from 'react';
import OriginalFooter from '@theme-original/DocItem/Footer';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import QuickerComments from '@site/src/components/QuickerComments';

export default function DocItemFooterWrapper(props: Record<string, unknown>): ReactNode {
  const {metadata, frontMatter} = useDoc();
  const extendedFrontMatter = frontMatter as Record<string, unknown>;
  const commentsEnabled = extendedFrontMatter.comments !== false;
  const docKey =
    typeof extendedFrontMatter.quickerDocKey === 'string'
      ? extendedFrontMatter.quickerDocKey
      : metadata.id;

  return (
    <>
      <OriginalFooter {...props} />
      {commentsEnabled && (
        <QuickerComments docKey={docKey} title={metadata.title} />
      )}
    </>
  );
}
