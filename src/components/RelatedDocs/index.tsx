import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type RelatedDocsLayout = 'chips' | 'cards';

export type RelatedDocItem = {
  href: string;
  label: string;
  description?: string;
  /** Cards layout only: span the full row. */
  featured?: boolean;
};

export type RelatedDocsProps = {
  items: readonly RelatedDocItem[];
  /**
   * Extra caption above chips. Leave empty when the MDX page already has
   * `## 相关链接` (needed for the right-side TOC).
   */
  title?: string;
  className?: string;
  /**
   * `chips` keeps the compact related-link row.
   * `cards` renders large jump buttons for sparse pages that mainly point elsewhere.
   */
  layout?: RelatedDocsLayout;
};

/** Compact in-article related links, or large jump cards. */
export default function RelatedDocs({
  items,
  title = '',
  className,
  layout = 'chips',
}: RelatedDocsProps): ReactNode {
  if (items.length === 0) {
    return null;
  }
  const isCards = layout === 'cards';
  return (
    <section
      className={['qk-related-docs', styles.wrap, className]
        .filter(Boolean)
        .join(' ')}
      data-layout={layout}
      aria-label={title || '相关链接'}
    >
      {title ? <div className={styles.caption}>{title}</div> : null}
      <div className={isCards ? styles.grid : styles.row}>
        {items.map((item) =>
          isCards ? (
            <Link
              key={item.href}
              className={styles.card}
              href={item.href}
              data-featured={item.featured ? 'true' : undefined}
            >
              <span className={styles.cardBody}>
                <span className={styles.cardTitle}>{item.label}</span>
                {item.description ? (
                  <span className={styles.cardDescription}>{item.description}</span>
                ) : null}
              </span>
              <span className={styles.cardArrow} aria-hidden>
                →
              </span>
            </Link>
          ) : (
            <Link key={item.href} className={styles.chip} href={item.href}>
              <span className={styles.title}>{item.label}</span>
              {item.description ? (
                <span className={styles.description}>{item.description}</span>
              ) : null}
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
