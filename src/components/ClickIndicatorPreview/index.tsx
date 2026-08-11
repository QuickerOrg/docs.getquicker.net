/**
 * Docs preview of Quicker “显示鼠标位置提示”.
 * Source: QuickerPc/Quicker/View/UI/ClickIndicator.xaml(+.cs)
 * Call site: MouseInputStepV2 ShowIndicator(150, Brushes.Red, Cursor.Position).
 */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type JSX,
} from 'react';
import styles from './styles.module.css';

export type ClickIndicatorPreviewProps = {
  /** Window size in CSS px. Product: 150. */
  size?: number;
  /** Ellipse stroke. Product: Brushes.Red. */
  color?: string;
  className?: string;
};

function PointerGlyph(): JSX.Element {
  return (
    <svg
      className={styles.pointer}
      width="16"
      height="20"
      viewBox="0 0 16 20"
      aria-hidden="true"
    >
      <path
        d="M1.2 1.2 L1.2 15.2 L5.1 11.8 L8.4 18.6 L10.6 17.6 L7.4 11 L13.2 11 Z"
        fill="#fff"
        stroke="#111"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Auto-looping ripple at the pointer. Click the stage to replay from the start.
 */
export default function ClickIndicatorPreview({
  size = 150,
  color = '#ff0000',
  className,
}: ClickIndicatorPreviewProps): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? false),
      {threshold: 0.35},
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const replay = useCallback(() => {
    setPlayKey((n) => n + 1);
  }, []);

  return (
    <div
      ref={rootRef}
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      style={
        {
          '--qi-size': `${size}px`,
          '--qi-color': color,
        } as CSSProperties
      }
    >
      <button
        type="button"
        className={styles.stage}
        onClick={replay}
        aria-label="鼠标位置提示：由小变大的红色水波纹，点击重播"
      >
        {visible ? (
          <span key={playKey} className={styles.circle} aria-hidden="true" />
        ) : (
          <span className={`${styles.circle} ${styles.circleStatic}`} aria-hidden="true" />
        )}
        <PointerGlyph />
      </button>
      <p className={styles.hint}>点击示意区可重播</p>
    </div>
  );
}
