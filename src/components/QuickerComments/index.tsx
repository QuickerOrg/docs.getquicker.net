import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type Props = {
  docKey?: string;
  title?: string;
};

export default function QuickerComments({docKey, title}: Props): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const baseUrl = siteConfig.customFields?.quickerCommentsBaseUrl as
    | string
    | undefined;

  if (!docKey || !baseUrl) {
    return null;
  }

  const url = new URL(baseUrl);
  url.searchParams.set('key', docKey);
  if (title) {
    url.searchParams.set('title', title);
  }

  return (
    <section className="quicker-comments">
      <h2>反馈与讨论</h2>
      <iframe
        className="quicker-comments__frame"
        src={url.toString()}
        title={`${title ?? '文档'} 的反馈与讨论`}
        loading="lazy"
      />
    </section>
  );
}
