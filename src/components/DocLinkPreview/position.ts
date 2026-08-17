export type PopupPlacement = 'below' | 'above';

export type PopupCoords = {
  top: number;
  left: number;
  placement: PopupPlacement;
};

export function pickAnchorRect(
  anchor: HTMLElement,
  x: number,
  y: number,
): DOMRect {
  const rects = [...anchor.getClientRects()];
  if (rects.length === 0) return anchor.getBoundingClientRect();
  let best = rects[0]!;
  let bestDist = Infinity;
  for (const rect of rects) {
    const cx = Math.min(Math.max(x, rect.left), rect.right);
    const cy = Math.min(Math.max(y, rect.top), rect.bottom);
    const dist = (x - cx) ** 2 + (y - cy) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = rect;
    }
  }
  return best;
}

export function computePopupCoords(
  anchorRect: DOMRect,
  popup: {width: number; height: number},
  viewport: {width: number; height: number} = {
    width: window.innerWidth,
    height: window.innerHeight,
  },
): PopupCoords {
  const pad = 12;
  const gap = 8;
  const {width, height} = popup;
  let left = anchorRect.left;
  if (left + width > viewport.width - pad) {
    left = viewport.width - pad - width;
  }
  if (left < pad) left = pad;

  const below = anchorRect.bottom + gap;
  const above = anchorRect.top - gap - height;
  const fitsBelow = below + height <= viewport.height - pad;
  const fitsAbove = above >= pad;
  if (fitsBelow || !fitsAbove) {
    const top = Math.min(below, Math.max(pad, viewport.height - pad - height));
    return {top, left, placement: 'below'};
  }
  return {top: Math.max(pad, above), left, placement: 'above'};
}
