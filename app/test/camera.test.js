import test from 'node:test';
import assert from 'node:assert/strict';
import { makeCamera, yearToY, yToYear, zoomAt, panBy, fit, lerpCamera, tickPlan, visible, nearest, clampCamera } from '../motion/src/camera.js';
import { Transition, easeInOut } from '../motion/src/transition.js';
import { pathPosition, scrollFraction, scrollForMark } from '../motion/src/trail.js';
import { rng } from '../src/engine/rng.js';

const close = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) <= e, `${a} vs ${b}`);
const cam0 = () => makeCamera({ lo: 1960, hi: 1985, h: 420 });

test('year <-> y round trip is exact and later years are higher on screen', () => {
  const c = cam0();
  for (const y of [1960, 1972.5, 1985, 1800, 2100]) close(yToYear(c, yearToY(c, y)), y);
  assert.ok(yearToY(c, 1980) < yearToY(c, 1970));
});

test('zoomAt pins the focal year: it does not move, for 5,000 random zooms', () => {
  const r = rng(8);
  let c = cam0();
  for (let i = 0; i < 5000; i++) {
    const fy = r() * c.h, before = yToYear(c, fy), f = Math.exp((r() - .5) * 1.2);
    const z = zoomAt(c, fy, f);
    if (z.jump === 0) close(yToYear(z.cam, fy), before, 1e-7);
    else assert.ok(z.jump < c.span, 'a clamped jump stays small');
    c = z.cam;
    assert.ok(c.scale >= c.minScale - 1e-12 && c.scale <= c.maxScale + 1e-12);
  }
});

test('no unexpected year jump in a realistic pinch session: focal year never moves while pinching inside the corridor window', () => {
  const r = rng(21);
  let worst = 0;
  for (let s = 0; s < 300; s++) {
    let c = cam0();
    for (let i = 0; i < 40; i++) {
      const fy = 60 + r() * (c.h - 120), f = Math.exp((r() - .5) * .5);
      const z = zoomAt(panBy(c, (r() - .5) * 40), fy, f); worst = Math.max(worst, z.jump); c = z.cam;
    }
  }
  assert.ok(worst < 1e-9, `max focal jump ${worst} years`);
});

test('zoom in then out by the same factor restores the camera', () => {
  const c = cam0(), fy = 150;
  const a = zoomAt(c, fy, 2.5).cam, b = zoomAt(a, fy, 1 / 2.5).cam;
  close(b.scale, c.scale, 1e-9); close(b.center, c.center, 1e-9);
});

test('zoom limits: one year can be made at least 100 px tall; the corridor always fits when fully zoomed out', () => {
  let c = cam0();
  c = zoomAt(c, 200, 1e6).cam; assert.ok(c.scale >= 100);
  c = zoomAt(c, 200, 1e-9).cam; const v = visible(c);
  assert.ok(v.top >= 1985 && v.bottom <= 1960);
});

test('pan is clamped and invertible inside the bounds', () => {
  const c = cam0();
  const p = panBy(panBy(c, 30), -30); close(p.center, c.center, 1e-9);
  assert.ok(panBy(c, 1e9).center <= c.hi + c.span && panBy(c, -1e9).center >= c.lo - c.span);
});

test('fit puts the range in view with margin', () => {
  const c = fit(cam0(), 1966, 1970, 50);
  assert.ok(yearToY(c, 1970) >= 49 && yearToY(c, 1966) <= c.h - 49);
});

test('lerp is monotone in scale and hits both ends', () => {
  const a = cam0(), b = fit(a, 1968, 1969, 60);
  close(lerpCamera(a, b, 0).scale, a.scale); close(lerpCamera(a, b, 1).scale, b.scale, 1e-9);
  let prev = a.scale; for (let t = 0.1; t <= 1; t += 0.1) { const s = lerpCamera(a, b, t).scale; assert.ok(s >= prev - 1e-9); prev = s; }
});

test('semantic zoom: labels never closer than 30 px, level changes with scale, tick count stays small', () => {
  let c = cam0(); const levels = new Set();
  for (const f of [1, 1.7, 3, 6, 12, 30]) {
    const z = fit(c, 1970 - 20 / f, 1970 + 20 / f, 40); const p = tickPlan(z); levels.add(p.level);
    const labelled = p.ticks.filter(t => t.label);
    for (let i = 1; i < labelled.length; i++) assert.ok(Math.abs(labelled[i].y - labelled[i - 1].y) >= 29.9, `labels collide at ${p.level}`);
    assert.ok(p.ticks.length <= 140, `${p.ticks.length} ticks`);
  }
  assert.ok(levels.size >= 2, 'more than one semantic level appears');
});

test('BCE and CE: the label skips year zero and ticks cross the boundary', () => {
  const c = fit(makeCamera({ lo: -19, hi: 20, h: 420 }), -3, 4, 30), p = tickPlan(c);
  const labels = p.ticks.filter(t => t.label).map(t => t.label);
  assert.ok(labels.includes('1 BCE') && labels.includes('1 CE') && !labels.includes('0'), labels.join(','));
});

test('nearest snaps to a candidate only on request', () => {
  assert.equal(nearest([1918, 1919, 1920], 1919.4), 1919); assert.equal(nearest([1918, 1922], 1920.1), 1922);
});

test('Transition: forward, reverse mid-way continues from the picture, never from 0 or 1', () => {
  const t = new Transition({ duration: 400 });
  t.forward(0); close(t.progress(200), .5);
  t.reverse(200); close(t.progress(200), .5); close(t.progress(300), .25); close(t.progress(1000), 0);
  t.forward(1000); close(t.progress(1100), .25); assert.ok(t.settled(2000));
});

test('Transition: skip jumps to the end of the current direction; reduced motion has no duration', () => {
  const t = new Transition({ duration: 500 }); t.forward(0); t.skip(10); assert.equal(t.progress(10), 1);
  const r = new Transition({ duration: 500, reduced: true }); r.forward(0); assert.equal(r.progress(0), 1); r.reverse(0); assert.equal(r.progress(0), 0);
});

test('Transition: repeated interruptions keep progress inside [0, 1] and continuous', () => {
  const r = rng(4), t = new Transition({ duration: 300 }); let now = 0, last = 0;
  for (let i = 0; i < 500; i++) { now += r() * 120; const before = t.progress(now); assert.ok(before >= 0 && before <= 1); if (r() < .4) t.go(r() < .5 ? 1 : -1, now); close(t.progress(now), before, 1e-9); last = before; }
  assert.ok(Number.isFinite(last)); close(easeInOut(0), 0); close(easeInOut(1), 1); close(easeInOut(.5), .5);
});

test('path scroll: monotone, covers every mark, and is invertible', () => {
  const n = 10, start = 100, len = 3000;
  let prev = -1;
  for (let y = 0; y <= 3400; y += 50) { const f = scrollFraction(y, start, len), p = pathPosition(f, n); const pos = p.index + p.t; assert.ok(pos >= prev - 1e-9); prev = pos; }
  for (let i = 0; i < n; i++) { const p = pathPosition(scrollFraction(scrollForMark(i, n, start, len), start, len), n); assert.equal(p.nearest, i); }
});
