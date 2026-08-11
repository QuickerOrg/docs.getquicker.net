import type {ReactNode} from 'react';
import styles from './styles.module.css';

export type WaitWinPreviewProps = {
  title?: string;
  message: string;
  /** Progress in `current/total` form, for example `44/100`. */
  progress?: string;
  /** Additional buttons followed by the default action button. */
  buttons?: string[];
  primaryIndex?: number;
  className?: string;
};

function parseProgress(value?: string): {label: string; percentage: number} | null {
  if (!value) return null;
  const match = /^\s*(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/.exec(value);
  if (!match) return {label: value, percentage: 0};
  const current = Number(match[1]);
  const total = Number(match[2]);
  const effective = current < 0 ? total + current : current;
  const percentage = total > 0 ? Math.min(100, Math.max(0, (effective / total) * 100)) : 0;
  return {label: `${effective}/${total}`, percentage};
}

/** Read-only Quicker “等待窗口” runtime preview for docs. */
export default function WaitWinPreview({
  title = '完成后继续',
  message,
  progress,
  buttons = ['继续'],
  primaryIndex = buttons.length - 1,
  className,
}: WaitWinPreviewProps): ReactNode {
  const parsedProgress = parseProgress(progress);

  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="dialog"
      aria-label="等待窗口示意"
      aria-modal="false">
      <div className={styles.titleBar}>
        <span className={styles.logo} aria-hidden>
          ⚡
        </span>
        <span className={styles.title}>{title}</span>
        <span className={styles.close} aria-hidden>
          ×
        </span>
      </div>
      <div className={styles.body}>
        {parsedProgress ? (
          <div className={styles.progress} aria-label={`进度 ${parsedProgress.label}`}>
            <span className={styles.progressValue} style={{width: `${parsedProgress.percentage}%`}} />
            <span className={styles.progressLabel}>{parsedProgress.label}</span>
          </div>
        ) : null}
        <div className={styles.message}>{message}</div>
        <div className={styles.buttons}>
          {buttons.map((label, index) => (
            <span
              key={`${label}-${index}`}
              className={index === primaryIndex ? styles.buttonPrimary : styles.button}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
