/**
 * Stroke helpers sliced / adapted from:
 * - Quicker.Headless/.../gestureStrokeGeometry.ts (fit, resample, direction name)
 * - Quicker Domain/Gestures/GestureStrokeGeometry.cs (centripetal Catmull-Rom → Bezier)
 */

export type StrokePoint = {x: number; y: number};

export type FittedStroke = {
  xs: number[];
  ys: number[];
};

const EPSILON = 1e-9;
const CONTROL_POINT_MIN_DISTANCE = 8;

/** Fit stroke into a box with padding; returns pixel coords for each point. */
export function fitStrokeToBox(
  points: StrokePoint[],
  width: number,
  height: number,
  pad = 8,
): FittedStroke | null {
  if (points.length < 2 || width <= 0 || height <= 0) {
    return null;
  }

  let minX = points[0]!.x;
  let maxX = points[0]!.x;
  let minY = points[0]!.y;
  let maxY = points[0]!.y;
  for (const p of points) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }

  const spanX = Math.max(1, maxX - minX);
  const spanY = Math.max(1, maxY - minY);
  const scale = Math.min((width - pad * 2) / spanX, (height - pad * 2) / spanY);
  const ox = (width - spanX * scale) / 2;
  const oy = (height - spanY * scale) / 2;

  const xs: number[] = [];
  const ys: number[] = [];
  for (const p of points) {
    xs.push(ox + (p.x - minX) * scale);
    ys.push(oy + (p.y - minY) * scale);
  }
  return {xs, ys};
}

/** Total polyline length in the stroke's own coordinate space. */
export function strokePathLength(points: StrokePoint[]): number {
  let len = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i]!.x - points[i - 1]!.x;
    const dy = points[i]!.y - points[i - 1]!.y;
    len += Math.hypot(dx, dy);
  }
  return len;
}

/**
 * Resample a stroke to roughly evenly spaced points.
 * Keeps the original endpoints.
 */
export function resampleStroke(points: StrokePoint[], targetCount = 64): StrokePoint[] {
  if (points.length < 2) return points.slice();
  const total = strokePathLength(points);
  if (total <= 0) return points.slice();

  const count = Math.max(2, targetCount);
  const step = total / (count - 1);
  const out: StrokePoint[] = [points[0]!];
  let prev = points[0]!;
  let distSoFar = 0;
  let nextAt = step;

  for (let i = 1; i < points.length; i++) {
    const curr = points[i]!;
    let segLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    while (segLen > 0 && distSoFar + segLen >= nextAt && out.length < count - 1) {
      const t = (nextAt - distSoFar) / segLen;
      const nx = prev.x + (curr.x - prev.x) * t;
      const ny = prev.y + (curr.y - prev.y) * t;
      out.push({x: nx, y: ny});
      prev = {x: nx, y: ny};
      segLen = Math.hypot(curr.x - prev.x, curr.y - prev.y);
      distSoFar = nextAt;
      nextAt += step;
    }
    distSoFar += Math.hypot(curr.x - prev.x, curr.y - prev.y);
    prev = curr;
  }

  out.push(points[points.length - 1]!);
  return out;
}

/** 8-direction arrows, index = round(atan2(dy, dx) / 45°) in canvas space (y grows down). */
const DIRECTION_ARROWS = ['→', '↘', '↓', '↙', '←', '↖', '↑', '↗'] as const;

/**
 * Derive a compact arrow short-name from a stroke, e.g. "→↓←".
 */
export function deriveGestureDirectionName(
  points: StrokePoint[] | null | undefined,
  options?: {maxArrows?: number; minRunRatio?: number},
): string {
  const pts = points ?? [];
  if (pts.length < 2) {
    return '';
  }
  const total = strokePathLength(pts);
  if (total <= 0) {
    return '';
  }

  const maxArrows = options?.maxArrows ?? 6;
  const minRun = total * (options?.minRunRatio ?? 0.14);

  const runs: Array<{dir: number; len: number}> = [];
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i]!.x - pts[i - 1]!.x;
    const dy = pts[i]!.y - pts[i - 1]!.y;
    const len = Math.hypot(dx, dy);
    if (len <= 0) {
      continue;
    }
    const dir = (((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8);
    const last = runs[runs.length - 1];
    if (last && last.dir === dir) {
      last.len += len;
    } else {
      runs.push({dir, len});
    }
  }

  const out: number[] = [];
  for (const run of runs) {
    if (run.len < minRun) {
      continue;
    }
    if (out.length === 0 || out[out.length - 1] !== run.dir) {
      out.push(run.dir);
    }
  }

  return out
    .slice(0, maxArrows)
    .map((dir) => DIRECTION_ARROWS[dir])
    .join('');
}

function distance(a: StrokePoint, b: StrokePoint): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Thin control points so Catmull-Rom has room to bend (matches WPF ControlPointMinDistance). */
export function thinControlPoints(
  points: StrokePoint[],
  minDistance = CONTROL_POINT_MIN_DISTANCE,
): StrokePoint[] {
  if (points.length < 2) return points.slice();
  const out: StrokePoint[] = [points[0]!];
  for (let i = 1; i < points.length - 1; i++) {
    if (distance(out[out.length - 1]!, points[i]!) >= minDistance) {
      out.push(points[i]!);
    }
  }
  const last = points[points.length - 1]!;
  if (distance(out[out.length - 1]!, last) > EPSILON) {
    out.push(last);
  } else if (out.length === 1) {
    out.push(last);
  }
  return out;
}

function getBezierControlPoints(
  p0: StrokePoint,
  p1: StrokePoint,
  p2: StrokePoint,
  p3: StrokePoint,
): {c1: StrokePoint; c2: StrokePoint} {
  const d1 = distance(p0, p1);
  const d2 = distance(p1, p2);
  const d3 = distance(p2, p3);
  const r1 = Math.sqrt(d1);
  const r2 = Math.sqrt(d2);
  const r3 = Math.sqrt(d3);

  let c1: StrokePoint;
  const denominator1 = 3 * r1 * (r1 + r2);
  if (denominator1 > EPSILON) {
    const weight = 2 * d1 + 3 * r1 * r2 + d2;
    c1 = {
      x: (d1 * p2.x - d2 * p0.x + weight * p1.x) / denominator1,
      y: (d1 * p2.y - d2 * p0.y + weight * p1.y) / denominator1,
    };
  } else {
    c1 = {...p1};
  }

  let c2: StrokePoint;
  const denominator2 = 3 * r3 * (r3 + r2);
  if (denominator2 > EPSILON) {
    const weight = 2 * d3 + 3 * r3 * r2 + d2;
    c2 = {
      x: (d3 * p1.x - d2 * p3.x + weight * p2.x) / denominator2,
      y: (d3 * p1.y - d2 * p3.y + weight * p2.y) / denominator2,
    };
  } else {
    c2 = {...p2};
  }

  return {c1, c2};
}

/**
 * Build an SVG path using centripetal Catmull-Rom → cubic Bezier (WPF GestureStrokeGeometry).
 */
export function strokeToSmoothSvgPath(points: StrokePoint[]): string {
  const thinned = thinControlPoints(points);
  if (thinned.length < 2) {
    return '';
  }
  if (thinned.length === 2) {
    const a = thinned[0]!;
    const b = thinned[1]!;
    return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} L ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  }

  let d = `M ${thinned[0]!.x.toFixed(1)} ${thinned[0]!.y.toFixed(1)}`;
  for (let i = 1; i < thinned.length; i++) {
    const p0 = i >= 2 ? thinned[i - 2]! : thinned[i - 1]!;
    const p1 = thinned[i - 1]!;
    const p2 = thinned[i]!;
    const p3 = i + 1 < thinned.length ? thinned[i + 1]! : thinned[i]!;
    const {c1, c2} = getBezierControlPoints(p0, p1, p2, p3);
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

/** Interpolate along a polyline by fraction [0, 1] of path length. */
export function strokePrefixByFraction(
  points: StrokePoint[],
  fraction: number,
): StrokePoint[] {
  if (points.length < 2) return points.slice();
  const t = Math.min(1, Math.max(0, fraction));
  if (t <= 0) return [points[0]!];
  if (t >= 1) return points.slice();

  const total = strokePathLength(points);
  const target = total * t;
  const out: StrokePoint[] = [points[0]!];
  let walked = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const curr = points[i]!;
    const seg = Math.hypot(curr.x - prev.x, curr.y - prev.y);
    if (walked + seg >= target) {
      const u = seg > 0 ? (target - walked) / seg : 0;
      out.push({
        x: prev.x + (curr.x - prev.x) * u,
        y: prev.y + (curr.y - prev.y) * u,
      });
      return out;
    }
    out.push(curr);
    walked += seg;
  }
  return out;
}
