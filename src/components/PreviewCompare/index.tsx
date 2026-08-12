import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import styles from './styles.module.css';

export type PreviewCompareAnimateConfig = {
  /** Time each pane stays fully visible (ms). Default 2800. */
  holdMs?: number;
  /** Crossfade duration (ms). Default 450. */
  fadeMs?: number;
};

export type PreviewCompareProps = {
  /** Exactly two preview children (usually ModuleParamPreview). */
  children: ReactNode;
  /** Pane titles, shown above each preview. */
  labels?: [string, string];
  /** Relationship text under the pair (replaces red-arrow captions). */
  caption?: string;
  /**
   * Auto-cycle between the two panes with a crossfade (before → after).
   * Falls back to the static side-by-side layout when the user prefers reduced motion.
   */
  animate?: boolean | PreviewCompareAnimateConfig;
  className?: string;
};

const DEFAULT_HOLD_MS = 2800;
const DEFAULT_FADE_MS = 450;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Side-by-side (wide) / stacked (docs column) pair of live previews.
 * Use when a teaching screenshot maps a field in module A to a field in module B.
 * Optional `animate` crossfades the two panes in one stage (discrete gesture demos).
 */
export default function PreviewCompare({
  children,
  labels,
  caption,
  animate,
  className,
}: PreviewCompareProps): ReactNode {
  const panes = Children.toArray(children).filter(Boolean);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [motionOk, setMotionOk] = useState(false);

  const animateOn = Boolean(animate);
  const opts: PreviewCompareAnimateConfig =
    typeof animate === 'object' && animate ? animate : {};
  const holdMs = opts.holdMs && opts.holdMs > 0 ? opts.holdMs : DEFAULT_HOLD_MS;
  const fadeMs = opts.fadeMs && opts.fadeMs > 0 ? opts.fadeMs : DEFAULT_FADE_MS;

  useEffect(() => {
    setMotionOk(!prefersReducedMotion());
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !animateOn || !motionOk) {
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      {threshold: 0.3},
    );
    io.observe(el);
    return () => io.disconnect();
  }, [animateOn, motionOk]);

  useEffect(() => {
    if (!animateOn || !motionOk || !inView || hovered) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setActive((prev) => (prev === 0 ? 1 : 0));
    }, holdMs + fadeMs);
    return () => window.clearInterval(id);
  }, [animateOn, motionOk, inView, hovered, holdMs, fadeMs]);

  if (panes.length !== 2) {
    return (
      <div className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
        <p className={styles.error}>
          PreviewCompare 需要恰好两个子预览，当前为 {panes.length} 个。
        </p>
      </div>
    );
  }

  const leftLabel = labels?.[0] ?? '来源';
  const rightLabel = labels?.[1] ?? '对应';
  const useCycle = animateOn && motionOk;

  if (useCycle) {
    const activeLabel = active === 0 ? leftLabel : rightLabel;
    return (
      <div
        ref={rootRef}
        className={[
          'qk-docs-preview',
          styles.root,
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}>
        <div className={styles.cycleHeader}>
          <div className={styles.label}>{activeLabel}</div>
          <div className={styles.dots} role="status" aria-live="polite">
            <button
              type="button"
              className={active === 0 ? styles.dotActive : styles.dot}
              aria-label={leftLabel}
              aria-current={active === 0 ? 'true' : undefined}
              onClick={() => setActive(0)}
            />
            <button
              type="button"
              className={active === 1 ? styles.dotActive : styles.dot}
              aria-label={rightLabel}
              aria-current={active === 1 ? 'true' : undefined}
              onClick={() => setActive(1)}
            />
          </div>
        </div>
        <div
          className={styles.stage}
          style={{['--pc-fade-ms' as string]: `${fadeMs}ms`}}>
          <div
            className={[styles.stagePane, active === 0 ? styles.stagePaneActive : '']
              .filter(Boolean)
              .join(' ')}
            aria-hidden={active !== 0}>
            {panes[0]}
          </div>
          <div
            className={[styles.stagePane, active === 1 ? styles.stagePaneActive : '']
              .filter(Boolean)
              .join(' ')}
            aria-hidden={active !== 1}>
            {panes[1]}
          </div>
        </div>
        {caption ? <p className={styles.caption}>{caption}</p> : null}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}>
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
