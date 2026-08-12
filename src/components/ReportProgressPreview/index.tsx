/**
 * Read-only Quicker progress report float (bottom-right stack).
 * Source: QuickerPc/Quicker/View/Progress/ProgressReportWindow.xaml
 */
import {useEffect, useState, type ReactNode} from 'react';
import styles from './styles.module.css';

export type ReportProgressItem = {
  title: string;
  /** 0–100. Ignored when indeterminate. */
  percent?: number;
  text?: string;
  indeterminate?: boolean;
  showCancel?: boolean;
};

export type ReportProgressPreviewProps = {
  items?: readonly ReportProgressItem[];
  /**
   * When true, slowly advances determinate bars in a loop
   * (respects prefers-reduced-motion).
   */
  animate?: boolean;
  className?: string;
};

const DEFAULT_ITEMS: ReportProgressItem[] = [
  {title: '测试进度条', percent: 42, text: '第 42/100 项', showCancel: true},
  {title: '下载文件', percent: 68, text: '正在写入缓存…', showCancel: true},
];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Desktop progress float used by sys:reportProgress / download / HTTP. */
export default function ReportProgressPreview({
  items = DEFAULT_ITEMS,
  animate = true,
  className,
}: ReportProgressPreviewProps): ReactNode {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!animate || prefersReducedMotion()) {
      return undefined;
    }
    const id = window.setInterval(() => setTick((n) => n + 1), 80);
    return () => window.clearInterval(id);
  }, [animate]);

  return (
    <div
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      role="status"
      aria-label="进度报告示意">
      <div className={styles.header}>
        <span className={styles.brand}>Quicker</span>
        <span className={styles.clear} title="清理" aria-hidden>
          ⌫
        </span>
      </div>
      <div className={styles.list}>
        {items.map((item, index) => {
          const base = Math.max(0, Math.min(100, item.percent ?? 0));
          const live =
            animate && !item.indeterminate && !prefersReducedMotion()
              ? (base + tick) % 101
              : base;
          return (
            <div key={`${item.title}-${index}`} className={styles.item}>
              <div className={styles.titleRow}>
                <span className={styles.title}>{item.title}</span>
                {item.showCancel !== false ? (
                  <span className={styles.cancel} title="取消" aria-hidden>
                    ×
                  </span>
                ) : null}
              </div>
              <div
                className={[
                  styles.bar,
                  item.indeterminate ? styles.barIndeterminate : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={
                  item.indeterminate
                    ? `${item.title} 进行中`
                    : `${item.title} ${Math.round(live)}%`
                }>
                {!item.indeterminate ? (
                  <span className={styles.barFill} style={{width: `${live}%`}} />
                ) : (
                  <span className={styles.barPulse} />
                )}
              </div>
              {item.text ? <div className={styles.text}>{item.text}</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
