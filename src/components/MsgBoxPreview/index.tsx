import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type MsgBoxIcon = 'info' | 'question' | 'warning' | 'error' | 'none';

export type MsgBoxPreviewProps = {
  title?: string;
  /** Body text; newlines preserved. */
  message: string;
  icon?: MsgBoxIcon;
  /** Button labels left → right. First is primary by default. */
  buttons?: string[];
  /** Index of highlighted primary button. */
  primaryIndex?: number;
  className?: string;
};

const ICON_GLYPH: Record<Exclude<MsgBoxIcon, 'none'>, string> = {
  info: 'i',
  question: '?',
  warning: '!',
  error: '×',
};

/**
 * Read-only Quicker MsgBox / confirm dialog for docs.
 */
export default function MsgBoxPreview({
  title = 'Quicker',
  message,
  icon = 'question',
  buttons = ['确定', '取消'],
  primaryIndex = 0,
  className,
}: MsgBoxPreviewProps): ReactNode {
  return (
    <div
      className={[styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="弹窗提示示意"
      aria-modal="false">
      <div className={styles.titleBar}>
        <span className={styles.titleText}>{title}</span>
        <span className={styles.titleClose} aria-hidden>
          ×
        </span>
      </div>
      <div className={styles.body}>
        {icon !== 'none' ? (
          <span className={[styles.icon, styles[`icon_${icon}`]].join(' ')} aria-hidden>
            {ICON_GLYPH[icon]}
          </span>
        ) : null}
        <div className={styles.message}>{message}</div>
      </div>
      <div className={styles.footer}>
        {buttons.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className={i === primaryIndex ? styles.btnPrimary : styles.btn}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
