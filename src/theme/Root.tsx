import type {ReactNode} from 'react';
import type {Props} from '@theme/Root';
import DocLinkPreview from '@site/src/components/DocLinkPreview';

export default function Root({children}: Props): ReactNode {
  return (
    <>
      {children}
      <DocLinkPreview />
    </>
  );
}
