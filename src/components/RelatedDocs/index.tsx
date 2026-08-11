import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type RelatedDocItem = {
  href: string;
  label: string;
  description?: string;
};

export type RelatedDocsProps = {
  items: readonly RelatedDocItem[];
  /**
   * Extra caption above chips. Leave empty when the MDX page already has
   * `## 相关链接` (needed for the right-side TOC).
   */
  title?: string;
  className?: string;
};

/** Compact in-article related links, one horizontal row. */
export default function RelatedDocs({
  items,
  title = '',
  className,
}: RelatedDocsProps): ReactNode {
  if (items.length === 0) {
    return null;
  }
  return (
    <section
      className={['qk-related-docs', styles.wrap, className]
        .filter(Boolean)
        .join(' ')}
      aria-label={title || '相关链接'}
    >
      {title ? <div className={styles.caption}>{title}</div> : null}
      <div className={styles.row}>
        {items.map((item) => (
          <Link key={item.href} className={styles.chip} href={item.href}>
            <span className={styles.title}>{item.label}</span>
            {item.description ? (
              <span className={styles.description}>{item.description}</span>
            ) : null}
          </Link>
        ))}
      </div>
    </section>
  );
}
