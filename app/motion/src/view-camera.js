// A camera view: the temporal ruler with a candidate corridor, a marker and optional pins. DOM + transforms only.
import { makeCamera, yearToY, yToYear, zoomAt, panBy, fit, lerpCamera, tickPlan, nearest, visible } from './camera.js';
import { Transition } from './transition.js';
import { attachPinch, attachHandleDrag } from './gestures.js';
import { yearLabel } from '../../src/engine/years.js';

export class CamView {
  constructor(el, { lo, hi, candidates = [], marker = null, pins = [], reduced = () => false, perf = null, onMarker = () => {}, name = 'cam' }) {
    this.el = el; this.opt = { lo, hi }; this.cands = candidates; this.marker = marker; this.pins = pins; this.reducedFn = reduced; this.perf = perf; this.onMarker = onMarker; this.name = name;
    this.cam = makeCamera({ lo, hi, h: el.clientHeight || 420 });
    this.anim = null; this.dirty = true; this.pool = []; this.pinEls = [];
    el.classList.add('cam'); el.innerHTML = `<div class="free hatch top" aria-hidden="true"></div><div class="free hatch bottom" aria-hidden="true"></div><div class="cands" aria-hidden="true"></div><div class="ticks" aria-hidden="true"></div><div class="rows" aria-hidden="true"></div><div class="pins"></div><div class="mk" ${marker === null ? 'hidden' : ''}><span class="flag"></span><span class="hdl" data-nodrag tabindex="-1" aria-hidden="true"></span></div>`;
    this.q = s => el.querySelector(s);
    this.pins.forEach(p => { const d = document.createElement('div'); d.className = 'pin'; d.innerHTML = `<span class="dot"></span><span class="t"><b>${yearLabel(Math.round(p.year))}</b> ${p.label}</span>`; this.q('.pins').append(d); this.pinEls.push(d); });
    attachPinch(el, { perf, onPinch: ({ focalY, factor, dy }) => { this.cancelAnim(); let c = this.cam; if (dy) c = panBy(c, dy); this.cam = zoomAt(c, focalY, factor).cam; this.dirty = true; this.wake(); } });
    attachHandleDrag(this.q('.hdl'), { perf, onMove: cy => { const r = el.getBoundingClientRect(); this.setMarker(nearest(this.cands, yToYear(this.cam, cy - r.top)), true); }, onEnd: () => this.wake() });
    el.addEventListener('click', e => { if (e.target.closest('[data-nodrag]') || !this.cands.length) return; const r = el.getBoundingClientRect(); const y = yToYear(this.cam, e.clientY - r.top); if (y >= Math.min(...this.cands) - .5 && y <= Math.max(...this.cands) + .5) this.setMarker(nearest(this.cands, y), true); });
    this.ro = new ResizeObserver(() => { const h = el.clientHeight; if (h && h !== this.cam.h) { this.cam = { ...this.cam, h, minScale: h / (3 * this.cam.span + 4) }; this.dirty = true; this.wake(); } }); this.ro.observe(el);
    this.wake();
  }
  get reduced() { return this.reducedFn(); }
  setMarker(y, fromUser = false) { if (y === this.marker) return; this.marker = y; this.q('.mk').hidden = y === null; this.dirty = true; this.onMarker(y, fromUser); this.wake(); }
  cancelAnim() { this.anim = null; }
  zoomBy(factor) { this.cancelAnim(); this.animateTo(zoomAt(this.cam, this.cam.h / 2, factor).cam); }
  fitCorridor() { const a = Math.min(...this.cands), b = Math.max(...this.cands); this.animateTo(fit(this.cam, a - 1, b + 1, 50)); }
  fitRange(a, b, ms = 700) { this.animateTo(fit(this.cam, a, b, 60), ms); }
  animateTo(target, ms = 360) { if (this.reduced || ms === 0) { this.cam = target; this.anim = null; this.dirty = true; this.wake(); return; } this.anim = { from: this.cam, to: target, tr: new Transition({ duration: ms }).forward(performance.now()) }; this.wake(); }
  nudgeMarker(d) { const i = this.cands.indexOf(this.marker); const j = Math.min(this.cands.length - 1, Math.max(0, (i < 0 ? 0 : i) + d)); this.setMarker(this.cands[j], true); const y = yearToY(this.cam, this.marker); if (y < 30 || y > this.cam.h - 30) this.cam = { ...this.cam, center: this.marker }; this.dirty = true; this.wake(); }
  wake() { if (this._raf) return; this._raf = requestAnimationFrame(t => { this._raf = 0; this.frame(t); }); }
  frame(now) {
    if (this.anim) { const p = this.anim.tr.eased(performance.now()); this.cam = lerpCamera(this.anim.from, this.anim.to, p); this.dirty = true; if (this.anim.tr.settled(performance.now())) { this.cam = this.anim.to; this.anim = null; } }
    if (this.dirty) { const t = performance.now(); this.render(); this.dirty = false; this.perf && this.perf.addCost(performance.now() - t); }
    if (this.anim) this.wake();
    window.__camCount = (window.__camCount || 0) + 1;
  }
  render() {
    const c = this.cam, h = c.h, plan = tickPlan(c);
    this.plan = plan; this.el.dataset.level = plan.level;
    const lo = Math.min(...(this.cands.length ? this.cands : [c.lo])) - .5, hi = Math.max(...(this.cands.length ? this.cands : [c.hi])) + .5;
    const yTop = yearToY(c, hi), yBot = yearToY(c, lo);
    const cd = this.q('.cands'); cd.style.transform = `translateY(${yTop}px)`; cd.style.height = Math.max(0, yBot - yTop) + 'px';
    const ft = this.q('.free.top'), fb = this.q('.free.bottom');
    ft.style.height = Math.max(0, yTop) + 'px'; fb.style.top = Math.min(h, yBot) + 'px'; fb.style.height = Math.max(0, h - yBot) + 'px';
    const ticks = this.q('.ticks'); while (this.pool.length < plan.ticks.length) { const d = document.createElement('div'); d.className = 'tick'; d.innerHTML = '<span class="ln"></span><span class="lb"></span>'; ticks.append(d); this.pool.push(d); }
    this.pool.forEach((d, i) => { const t = plan.ticks[i]; if (!t) { d.hidden = true; return; } d.hidden = false; d.style.transform = `translateY(${t.y}px)`; d.classList.toggle('major', t.major); const lb = d.lastChild; if (lb.textContent !== (t.label || '')) lb.textContent = t.label || ''; });
    // candidate rows: large year numerals once a year is >= 34 px tall
    const rows = this.q('.rows'); const showRows = c.scale >= 34 && this.cands.length;
    if (showRows) { const want = this.cands.length; if (rows.children.length !== want) { rows.innerHTML = this.cands.map(y => `<div class="row" data-y="${y}"><span class="ry">${yearLabel(y)}</span></div>`).join(''); }
      [...rows.children].forEach((r, i) => { const y = this.cands[i]; r.style.transform = `translateY(${yearToY(c, y + .5)}px)`; r.style.height = c.scale + 'px'; r.classList.toggle('sel', y === this.marker); }); } else rows.innerHTML = '';
    if (this.marker !== null) { const mk = this.q('.mk'); mk.style.transform = `translateY(${yearToY(c, this.marker)}px)`; this.q('.flag').textContent = yearLabel(this.marker); }
    const order = this.pins.map((p, i) => ({ i, y: yearToY(c, p.year) })).sort((a, b) => a.y - b.y); let lastLabelY = -1e9;
    order.forEach(({ i, y }) => { const d = this.pinEls[i]; d.hidden = y < -20 || y > h + 20; d.style.transform = `translateY(${y}px)`; const showText = y - lastLabelY >= 40; d.classList.toggle('dotonly', !showText); if (!d.hidden && showText) lastLabelY = y; });
    const bare = this.cands.length === 0; ['.free.top', '.free.bottom', '.cands'].forEach(sel => { this.q(sel).style.display = bare ? 'none' : ''; });
  }
  state() { return { ...this.cam, marker: this.marker, level: this.plan && this.plan.level }; }
  destroy() { this.ro.disconnect(); }
}
