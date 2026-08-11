/**
 * Screen-space coordinate diagram for docs (Windows / Quicker mouse).
 * Origin is the primary monitor top-left; X grows right, Y grows down.
 * Not a Quicker chrome slice — teaching schematic, red marks match PreviewMap.
 */
import {
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type JSX,
  type PointerEvent,
} from 'react';
import {observeResize} from '@site/src/components/observeResize';
import styles from './styles.module.css';

export type CoordDiagramProps = {
  /** Logical primary-screen width in pixels. */
  width?: number;
  /** Logical primary-screen height in pixels. */
  height?: number;
  /** Draw a secondary monitor to the right (X continues past `width`). */
  showSecondary?: boolean;
  className?: string;
};

type Point = {
  x: number;
  y: number;
};

type Scale = {
  pxPerX: number;
  pxPerY: number;
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function AxisOverlay({
  width,
  height,
  markerId,
}: {
  width: number;
  height: number;
  markerId: string;
}): JSX.Element {
  const xLen = width * 0.42;
  const yLen = height * 0.42;
  const pad = Math.max(width, height) * 0.018;
  return (
    <svg
      className={styles.axes}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
      <line
        x1={pad}
        y1={pad}
        x2={xLen}
        y2={pad}
        stroke="currentColor"
        strokeWidth={Math.max(8, width * 0.004)}
        markerEnd={`url(#${markerId})`}
      />
      <line
        x1={pad}
        y1={pad}
        x2={pad}
        y2={yLen}
        stroke="currentColor"
        strokeWidth={Math.max(8, width * 0.004)}
        markerEnd={`url(#${markerId})`}
      />
      <text
        className={styles.axisText}
        x={xLen * 0.52}
        y={pad + height * 0.055}
        fill="currentColor"
      >
        X 轴正向
      </text>
      <text
        className={styles.axisText}
        x={pad + width * 0.028}
        y={yLen * 0.58}
        fill="currentColor"
        transform={`rotate(90 ${pad + width * 0.028} ${yLen * 0.58})`}
      >
        Y 轴正向
      </text>
    </svg>
  );
}

function Crosshair({leftPx, topPx, label}: {leftPx: number; topPx: number; label: string}): JSX.Element {
  return (
    <div className={styles.crosshair} style={{left: leftPx, top: topPx}} aria-hidden="true">
      <span className={styles.crossDot} />
      <span className={styles.crossLabel}>{label}</span>
    </div>
  );
}

/**
 * Interactive screen-coordinate schematic: hover to read (x, y).
 */
export default function CoordDiagram({
  width = 1920,
  height = 1080,
  showSecondary = true,
  className,
}: CoordDiagramProps): JSX.Element {
  const markerId = useId().replace(/:/g, '');
  const primaryRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<Scale>({pxPerX: 0, pxPerY: 0});
  const [point, setPoint] = useState<Point>({
    x: Math.round(width * 0.28),
    y: Math.round(height * 0.26),
  });

  useLayoutEffect(() => {
    const el = primaryRef.current;
    if (!el) return undefined;
    const update = (): void => {
      const rect = el.getBoundingClientRect();
      setScale({
        pxPerX: width > 0 ? rect.width / width : 0,
        pxPerY: height > 0 ? rect.height / height : 0,
      });
    };
    update();
    return observeResize([el], update);
  }, [width, height]);

  const readPoint = useCallback(
    (event: PointerEvent<HTMLDivElement>, originX: number): void => {
      const primary = primaryRef.current;
      if (!primary || scale.pxPerX <= 0 || scale.pxPerY <= 0) {
        return;
      }
      const rect = event.currentTarget.getBoundingClientRect();
      const x = originX + Math.round((event.clientX - rect.left) / scale.pxPerX);
      const y = Math.round((event.clientY - rect.top) / scale.pxPerY);
      const maxX =
        originX + Math.round(event.currentTarget.getBoundingClientRect().width / scale.pxPerX);
      setPoint({
        x: clamp(x, originX, Math.max(originX, maxX)),
        y: clamp(y, 0, height),
      });
    },
    [height, scale.pxPerX, scale.pxPerY],
  );

  const onPrimaryMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      readPoint(event, 0);
    },
    [readPoint],
  );

  const onSecondaryMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      readPoint(event, width);
    },
    [readPoint, width],
  );

  const onSecondary = point.x >= width;
  const label = `${point.x}, ${point.y}`;
  const primaryCross =
    !onSecondary && scale.pxPerX > 0
      ? {left: point.x * scale.pxPerX, top: point.y * scale.pxPerY}
      : null;
  const secondaryCross =
    onSecondary && scale.pxPerX > 0
      ? {left: (point.x - width) * scale.pxPerX, top: point.y * scale.pxPerY}
      : null;

  return (
    <figure
      className={['qk-docs-preview', styles.root, className].filter(Boolean).join(' ')}
      aria-label="屏幕坐标系示意：主屏左上角为原点，X 向右增大，Y 向下增大"
    >
      <div className={styles.desk}>
        <div className={styles.row}>
          <div className={styles.monitor}>
            <div
              ref={primaryRef}
              className={styles.screen}
              onPointerMove={onPrimaryMove}
              role="img"
              aria-label={`主屏 ${width}×${height}`}
            >
              <AxisOverlay width={width} height={height} markerId={`qk-coord-arrow-${markerId}`} />
              <div className={styles.origin}>
                <span className={styles.originDot} />
                <span className={styles.originText}>原点 (0, 0)</span>
              </div>
              {primaryCross ? (
                <Crosshair leftPx={primaryCross.left} topPx={primaryCross.top} label={label} />
              ) : null}
            </div>
            <div className={styles.caption}>
              主屏 {width}×{height}
            </div>
          </div>
          {showSecondary ? (
            <div className={`${styles.monitor} ${styles.monitorSecondary}`}>
              <div
                ref={secondaryRef}
                className={styles.screen}
                onPointerMove={onSecondaryMove}
                role="img"
                aria-label={`副屏，X 从 ${width} 起`}
              >
                {secondaryCross ? (
                  <Crosshair
                    leftPx={secondaryCross.left}
                    topPx={secondaryCross.top}
                    label={label}
                  />
                ) : null}
              </div>
              <div className={styles.caption}>副屏（X ≥ {width}）</div>
            </div>
          ) : null}
        </div>
      </div>
      <figcaption className={styles.hud}>
        <span className={styles.hudCoords} aria-live="polite">
          当前指针{' '}
          <strong>
            x = {point.x}, y = {point.y}
          </strong>
        </span>
        <span className={styles.hudHint}>
          {onSecondary ? '落在副屏' : '落在主屏'}。多屏时仍以主屏左上角为原点。
        </span>
      </figcaption>
    </figure>
  );
}
