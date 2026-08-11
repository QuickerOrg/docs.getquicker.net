import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type ChoiceListGlobalButton = string | {label: string; tone?: 'primary' | 'default'};

export type ChoiceListPreviewProps = {
  title?: string;
  options: string[];
  /** Show 1-based index prefix like Quicker UI. */
  showIndex?: boolean;
  selectedIndex?: number;
  /** When set, show filter input filled with this text. */
  filterText?: string;
  hint?: string;
  /** Extra footer buttons before OK/Cancel (e.g. global menu buttons). */
  globalButtons?: ChoiceListGlobalButton[];
  showMoreMenu?: boolean;
  primaryLabel?: string;
  secondaryLabel?: string;
  className?: string;
};

/**
 * Read-only Quicker “用户选择” list dialog for docs.
 */
export default function ChoiceListPreview({
  title = '请选择',
  options,
  showIndex = true,
  selectedIndex,
  filterText,
  hint,
  globalButtons = [],
  showMoreMenu = false,
  primaryLabel = '确定(S)',
  secondaryLabel = '取消(C)',
  className,
}: ChoiceListPreviewProps): ReactNode {
  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="用户选择示意"
      aria-modal="false">
      <div className={styles.titleBar}>
        <span className={styles.logo} aria-hidden />
        <span className={styles.titleText}>{title}</span>
        <span className={styles.titleControls} aria-hidden>
          <span>−</span>
          <span>×</span>
        </span>
      </div>
      {filterText != null && filterText !== '' ? (
        <div className={styles.filterRow}>
          <div className={styles.filterInput}>
            <span>{filterText}</span>
            <span className={styles.filterClear} aria-hidden>
              ×
            </span>
          </div>
        </div>
      ) : null}
      <div className={styles.list}>
        {options.map((opt, i) => {
          const selected = selectedIndex === i;
          return (
            <div
              key={`${i}-${opt}`}
              className={[styles.item, selected ? styles.itemSelected : ''].filter(Boolean).join(' ')}>
              {showIndex ? <span className={styles.index}>{i + 1}</span> : null}
              <span className={styles.itemLabel}>{opt}</span>
            </div>
          );
        })}
      </div>
      {hint ? <div className={styles.hint}>{hint}</div> : null}
      <div className={styles.footer}>
        <div className={styles.footerExtra}>
          {globalButtons.map((btn, i) => {
            const label = typeof btn === 'string' ? btn : btn.label;
            const tone = typeof btn === 'string' ? 'primary' : (btn.tone ?? 'primary');
            return (
              <span
                key={`${label}-${i}`}
                className={tone === 'primary' ? styles.btnPrimary : styles.btn}>
                {label}
              </span>
            );
          })}
          {showMoreMenu ? (
            <span className={styles.btnPrimary} aria-hidden>
              …
            </span>
          ) : null}
        </div>
        <div className={styles.footerActions}>
          <span className={styles.btnPrimary}>{primaryLabel}</span>
          <span className={styles.btn}>{secondaryLabel}</span>
        </div>
      </div>
    </div>
  );
}
