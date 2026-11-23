// Path scroll: maps the page's natural scroll fraction onto a position along the ten marks. It never captures the scroll; it only reads it.
export function pathPosition(f, n) {
  const x = Math.min(1, Math.max(0, f)) * (n - 1);
  const index = Math.min(n - 2, Math.floor(x));
  return { index: Math.max(0, index), t: n < 2 ? 0 : x - Math.max(0, index), nearest: Math.round(x) };
}
export function scrollFraction(scrollY, startY, lengthPx) { return Math.min(1, Math.max(0, (scrollY - startY) / lengthPx)); }
/** Inverse: the scroll offset at which mark `i` is exactly in focus. */
export function scrollForMark(i, n, startY, lengthPx) { return startY + (n < 2 ? 0 : (i / (n - 1)) * lengthPx); }
