/**
 * ResizeObserver that coalesces notifications onto the next animation frame.
 * Layout writes inside the raw callback (portals, clamp, scale) trip Chrome's
 * "ResizeObserver loop completed with undelivered notifications", which
 * webpack-dev-server then paints as a full-screen overlay.
 */
export function observeResize(
  targets: ReadonlyArray<Element | null | undefined>,
  onResize: () => void,
): () => void {
  let frame = 0;
  const ro = new ResizeObserver(() => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      onResize();
    });
  });
  for (const el of targets) {
    if (el) ro.observe(el);
  }
  return () => {
    if (frame) cancelAnimationFrame(frame);
    ro.disconnect();
  };
}
