import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type NotifyToastVariant = 'info' | 'success' | 'warning' | 'error';
export type NotifyToastStyle = 'default' | 'card';

export type NotifyToastPreviewProps = {
  /** Toast body text (supports newlines). */
  message: string;
  /** Color / icon kind. */
  variant?: NotifyToastVariant;
  /**
   * `default` — solid bar (bottom style).
   * `card` — white card with tinted icon (style 2 / top-right).
   */
  styleVariant?: NotifyToastStyle;
  showClose?: boolean;
  /** Visually clamp lines; trailing “…” when truncated. */
  maxLines?: number;
  className?: string;
};

const VARIANT_LABEL: Record<NotifyToastVariant, string> = {
  info: 'i',
  success: '✓',
  warning: '!',
  error: '×',
};

/**
 * Read-only Quicker “提示消息” toast for docs (replaces runtime screenshots).
 */
export default function NotifyToastPreview({
  message,
  variant = 'info',
  styleVariant = 'default',
  showClose = true,
  maxLines,
  className,
}: NotifyToastPreviewProps): ReactNode {
  const lines = message.replace(/\r\n/g, '\n').split('\n');
  const clamped =
    typeof maxLines === 'number' && maxLines > 0 && lines.length > maxLines
      ? [...lines.slice(0, maxLines), '…']
      : lines;

  return (
    <div
      className={[
        styles.root,
        styles[`v_${variant}`],
        styleVariant === 'card' ? styles.styleCard : styles.styleDefault,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label="提示消息示意">
      <span className={styles.icon} aria-hidden>
        {VARIANT_LABEL[variant]}
      </span>
      <div className={styles.message}>
        {clamped.map((line, i) => (
          <div key={i}>{line || '\u00a0'}</div>
        ))}
      </div>
      {showClose ? (
        <span className={styles.close} aria-hidden>
          ×
        </span>
      ) : null}
    </div>
  );
}
