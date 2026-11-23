// Reversible, interruptible transition controller. Pure: callers pass `now` in ms. progress is always continuous, so an interruption
// (reverse, skip, restart) continues from where the picture is, never from 0 or 1.
export const easeInOut = p => (p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
export class Transition {
  constructor({ duration = 320, reduced = false } = {}) { this.duration = reduced ? 0 : duration; this.p0 = 0; this.t0 = 0; this.dir = 0; this.skipped = false; }
  get target() { return this.dir > 0 ? 1 : this.dir < 0 ? 0 : this.p0; }
  progress(now) {
    if (this.dir === 0) return this.p0;
    if (this.duration === 0) return this.dir > 0 ? 1 : 0;
    const d = (now - this.t0) / this.duration;
    const p = this.p0 + this.dir * d;
    return Math.min(1, Math.max(0, p));
  }
  eased(now) { return easeInOut(this.progress(now)); }
  /** Start moving toward 1 (dir 1) or 0 (dir -1) from the CURRENT progress. */
  go(dir, now) { const p = this.progress(now); this.p0 = p; this.t0 = now; this.dir = dir; return this; }
  forward(now) { return this.go(1, now); }
  reverse(now) { return this.go(-1, now); }
  skip(now) { this.p0 = this.dir >= 0 ? 1 : 0; this.dir = 0; this.skipped = true; return this; }
  settled(now) { const p = this.progress(now); return this.dir === 0 || (this.dir > 0 && p >= 1) || (this.dir < 0 && p <= 0); }
}
/** Tween a camera between two states with the same controller. */
export function tweenValue(a, b, p) { return a + (b - a) * p; }
