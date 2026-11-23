// Frame and input-latency recorder. Works on any device: open the page with ?perf=1, press Record, do the gestures, press Stop, Download JSON.
export class Perf {
  constructor() { this.rec = false; this.frames = []; this.lat = []; this.pending = []; this.cost = []; this.raf = 0; this.last = 0; this.t0 = 0; }
  start(label = '') { this.label = label; this.frames = []; this.lat = []; this.pending = []; this.cost = []; this.rec = true; this.t0 = performance.now(); this.last = 0; const loop = t => { if (!this.rec) return; if (this.last) this.frames.push(t - this.last); this.last = t; for (const ts of this.pending) this.lat.push(t - ts); this.pending = []; this.raf = requestAnimationFrame(loop); }; this.raf = requestAnimationFrame(loop); }
  addCost(ms) { if (this.rec) this.cost.push(ms); }
  mark(eventTimeStamp) { if (this.rec) this.pending.push(eventTimeStamp); }
  stop() { this.rec = false; cancelAnimationFrame(this.raf); return this.summary(); }
  summary() {
    const q = (a, p) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); return +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(2); };
    const f = this.frames;
    return { label: this.label, ua: navigator.userAgent, dpr: devicePixelRatio, viewport: [innerWidth, innerHeight], durationMs: Math.round(performance.now() - this.t0), frames: f.length,
      frameMs: { p50: q(f, .5), p95: q(f, .95), p99: q(f, .99), max: f.length ? +Math.max(...f).toFixed(2) : null },
      renderMs: { n: this.cost.length, p50: q(this.cost, .5), p95: q(this.cost, .95), max: this.cost.length ? +Math.max(...this.cost).toFixed(2) : null },
      over16_7: f.filter(x => x > 16.7 * 1.5).length, over33: f.filter(x => x > 33.4).length, over50: f.filter(x => x > 50).length,
      inputToFrameMs: { n: this.lat.length, p50: q(this.lat, .5), p95: q(this.lat, .95), max: this.lat.length ? +Math.max(...this.lat).toFixed(2) : null } };
  }
}
