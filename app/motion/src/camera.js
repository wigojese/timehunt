// Temporal camera: pure transform maths. No DOM, no clock.
// Years are astronomical numbers (1 BCE = 0) and may be fractional. Later years are at the TOP of the screen.
// A camera shows a vertical window of `h` pixels: y = h/2 - (year - center) * scale.
import { yearLabel } from '../../src/engine/years.js';

export const MAX_SCALE = 140; // px per year: one year is a big target
export function makeCamera({ lo, hi, h }) {
  const span = Math.max(1, hi - lo);
  const minScale = h / (3 * span + 4);
  const cam = { lo, hi, h, span, minScale, maxScale: MAX_SCALE, center: (lo + hi) / 2, scale: Math.min(MAX_SCALE, Math.max(minScale, (h * 0.8) / (span + 1))) };
  return cam;
}
export const yearToY = (c, year) => c.h / 2 - (year - c.center) * c.scale;
export const yToYear = (c, y) => c.center + (c.h / 2 - y) / c.scale;
export const visible = c => ({ top: c.center + c.h / 2 / c.scale, bottom: c.center - c.h / 2 / c.scale });
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export function clampCamera(c) {
  const scale = clamp(c.scale, c.minScale, c.maxScale);
  const center = clamp(c.center, c.lo - c.span, c.hi + c.span);
  return { ...c, scale, center };
}
/** Zoom by `factor` keeping the year under screen row `focalY` exactly where it is. Returns {cam, jump}. jump is the focal year's shift (0 unless a bound was hit). */
export function zoomAt(c, focalY, factor) {
  const y0 = yToYear(c, focalY);
  const scale = clamp(c.scale * factor, c.minScale, c.maxScale);
  const center = y0 - (c.h / 2 - focalY) / scale;
  const next = clampCamera({ ...c, scale, center });
  return { cam: next, jump: Math.abs(yToYear(next, focalY) - y0) };
}
export function panBy(c, dyPx) {
  // dragging content down (dy > 0) moves earlier years into view at the top: center decreases... later is at top, so center moves by dy/scale
  return clampCamera({ ...c, center: c.center + dyPx / c.scale });
}
/** Fit years [a, b] into the window with `padPx` margin top and bottom. */
export function fit(c, a, b, padPx = 40) {
  const w = Math.max(1e-6, b - a);
  const scale = clamp((c.h - 2 * padPx) / w, c.minScale, c.maxScale);
  return clampCamera({ ...c, scale, center: (a + b) / 2 });
}
/** Interpolate cameras in (centre, log scale) so a zoom feels even. */
export function lerpCamera(a, b, t) {
  const s = Math.exp(Math.log(a.scale) + (Math.log(b.scale) - Math.log(a.scale)) * t);
  return { ...a, center: a.center + (b.center - a.center) * t, scale: s };
}
const STEPS = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];
/** Semantic zoom: choose tick steps from the scale so labels never collide. Minor ticks need >= 7 px, labels >= 30 px. */
export function tickPlan(c) {
  const minor = STEPS.find(s => s * c.scale >= 7) || STEPS[STEPS.length - 1];
  const label = STEPS.find(s => s >= minor && s * c.scale >= 30 && s % minor === 0) || STEPS[STEPS.length - 1];
  const v = visible(c);
  const first = Math.ceil((v.bottom - minor) / minor) * minor, last = Math.floor((v.top + minor) / minor) * minor;
  const ticks = [];
  for (let y = first; y <= last; y += minor) {
    const labelled = y % label === 0;
    ticks.push({ year: y, y: yearToY(c, y), major: labelled, label: labelled ? yearLabel(Math.round(y)) : null });
  }
  return { minor, label, ticks, level: label >= 100 ? 'centuries' : label >= 10 ? 'decades' : label >= 5 ? 'fives' : 'years' };
}
export const nearest = (list, year) => list.reduce((b, y) => (Math.abs(y - year) < Math.abs(b - year) ? y : b), list[0]);
