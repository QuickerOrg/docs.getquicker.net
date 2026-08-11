import {Children, type ReactNode} from 'react';
import styles from './styles.module.css';

export type PreviewCompareProps = {
  /** Exactly two preview children (usually ModuleParamPreview). */
  children: ReactNode;
  /** Pane titles, shown above each preview. */
  labels?: [string, string];
  /** Relationship text under the pair (replaces red-arrow captions). */
  caption?: string;
  className?: string;
};

/**
 * Side-by-side (wide) / stacked (docs column) pair of live previews.
 * Use when a teaching screenshot maps a field in module A to a field in module B.
 */
export default function PreviewCompare({
  children,
  labels,
  caption,
  className,
}: PreviewCompareProps): ReactNode {
  const panes = Children.toArray(children).filter(Boolean);
  if (panes.length !== 2) {
    return (
      <div className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
        <p className={styles.error}>PreviewCompare 需要恰好两个子预览，当前为 {panes.length} 个。</p>
      </div>
    );
  }

  const leftLabel = labels?.[0] ?? '来源';
  const rightLabel = labels?.[1] ?? '对应';

  return (
    <div className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.panes}>
        <figure className={styles.pane}>
          <figcaption className={styles.label}>{leftLabel}</figcaption>
          {panes[0]}
        </figure>
        <div className={styles.arrow} aria-hidden>
          <span className={styles.arrowWide}>→</span>
          <span className={styles.arrowNarrow}>↓</span>
        </div>
        <figure className={styles.pane}>
          <figcaption className={styles.label}>{rightLabel}</figcaption>
          {panes[1]}
        </figure>
      </div>
      {caption ? <p className={styles.caption}>{caption}</p> : null}
    </div>
  );
}
