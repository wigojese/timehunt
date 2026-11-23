// Gesture layer. Rules that keep the page usable:
//  * the camera surface uses touch-action: pan-y, so a one-finger vertical drag scrolls the PAGE (never trapped);
//  * two-finger pinch is handled here (pan-y turns off the browser's own pinch-zoom on that element only);
//  * the marker handle alone uses touch-action: none;
//  * a plain mouse wheel is never intercepted; only ctrl+wheel (trackpad pinch) zooms the camera;
//  * every gesture has a button or key equivalent (see view-camera.js).
export function attachPinch(el, { onPinch, onEnd, perf }) {
  const pts = new Map();
  let prevDist = 0, prevCy = 0;
  const stats = () => { const a = [...pts.values()]; return { dist: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y), cy: (a[0].y + a[1].y) / 2 }; };
  el.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || e.target.closest('[data-nodrag]')) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size === 2) { const s = stats(); prevDist = s.dist; prevCy = s.cy; try { el.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ } }
  });
  el.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pts.size !== 2) return;
    const s = stats(), r = el.getBoundingClientRect();
    if (prevDist > 8) { perf && perf.mark(e.timeStamp); onPinch({ focalY: s.cy - r.top, factor: s.dist / prevDist, dy: s.cy - prevCy }); }
    prevDist = s.dist; prevCy = s.cy;
  });
  const up = e => { if (pts.delete(e.pointerId) && pts.size < 2) { prevDist = 0; onEnd && onEnd(); } };
  el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up); el.addEventListener('lostpointercapture', up);
  el.addEventListener('wheel', e => {
    if (!e.ctrlKey) return; // natural page scroll is never captured
    e.preventDefault(); const r = el.getBoundingClientRect(); perf && perf.mark(e.timeStamp);
    onPinch({ focalY: e.clientY - r.top, factor: Math.exp(-e.deltaY * 0.01), dy: 0 });
  }, { passive: false });
}
export function attachHandleDrag(handle, { onMove, onEnd, perf }) {
  let on = false;
  handle.addEventListener('pointerdown', e => { on = true; handle.setPointerCapture(e.pointerId); e.preventDefault(); });
  handle.addEventListener('pointermove', e => { if (on) { perf && perf.mark(e.timeStamp); onMove(e.clientY); } });
  const end = () => { if (on) { on = false; onEnd && onEnd(); } };
  handle.addEventListener('pointerup', end); handle.addEventListener('pointercancel', end);
}
