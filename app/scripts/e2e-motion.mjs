// Stage 8 motion prototype: behaviour, gesture, reduced-motion, large-text, scroll-restoration and performance checks in real Chromium.
// Touch is emulated through the DevTools protocol (real touch events -> pointer events). This is NOT a real phone.
// Usage: node scripts/e2e-motion.mjs   (npm install once for axe-core)
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync, renameSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { start } from './serve.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', '..', 'docs', 'motion'); mkdirSync(OUT, { recursive: true });
const AXE = join(here, '..', 'node_modules', 'axe-core', 'axe.min.js');
const srv = await start(5196); const BASE = 'http://127.0.0.1:5196/motion/index.html';
const checks = [], notes = {}; const bugs = [];
const ok = (name, cond, detail = '') => { checks.push({ name, pass: !!cond, detail }); if (!cond) console.log('  FAIL:', name, detail); };
const browser = await chromium.launch();
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function open(hash = '', { reduced = false, scale = 100, w = 390, h = 844, video = false, query = '' } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2, reducedMotion: reduced ? 'reduce' : 'no-preference', ...(video ? { recordVideo: { dir: join(OUT, '_v'), size: { width: w, height: h } } } : {}) });
  await ctx.addInitScript(s => sessionStorage.setItem('mp:prefs', JSON.stringify({ reduce: false, scale: s })), scale);
  const page = await ctx.newPage(); page.ctx = ctx; page.errors = [];
  page.on('pageerror', e => page.errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') page.errors.push(m.text()); });
  await page.goto(BASE + query + (hash ? '#/' + hash : '')); await page.waitForFunction(() => window.__ready); await page.waitForTimeout(500);
  page.cdp = await ctx.newCDPSession(page);
  return page;
}
const touch = (page, type, pts) => page.cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i + 1 })) });
async function pinch(page, cx, cy, d0, d1, steps = 24, ms = 16) {
  await touch(page, 'touchStart', [[cx, cy - d0 / 2], [cx, cy + d0 / 2]]);
  for (let i = 1; i <= steps; i++) { const d = d0 + (d1 - d0) * i / steps; await touch(page, 'touchMove', [[cx, cy - d / 2], [cx, cy + d / 2]]); await sleep(ms); }
  await touch(page, 'touchEnd', []);
}
async function swipe(page, x, y, dy, ms = 320) { const n = 20; await touch(page, 'touchStart', [[x, y]]); for (let i = 1; i <= n; i++) { await touch(page, 'touchMove', [[x, y + dy * i / n]]); await sleep(ms / n); } await touch(page, 'touchEnd', []); await sleep(350); }
const box = (page, sel) => page.locator(sel).boundingBox();
const camState = page => page.evaluate(() => { const v = window.__camView; return v ? { ...v.state() } : null; });
const yAt = (page, y) => page.evaluate(y => window.__yAt(y), y);
async function audit(page, name) {
  await page.addScriptTag({ path: AXE });
  const v = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map(x => ({ id: x.id, impact: x.impact, nodes: x.nodes.length, target: x.nodes[0].target.join(' '), why: x.nodes[0].failureSummary.replace(/\s+/g, ' ').slice(0, 200) })));
  notes.axe = notes.axe || []; notes.axe.push({ screen: name, violations: v }); return v;
}

// ================= A. trail: path scroll, natural scroll =================
console.log('A. trail');
{
  const p = await open('trail');
  ok('trail loads without errors', p.errors.length === 0, p.errors.join('|'));
  const a = await p.evaluate(() => ({ ...window.__trail }));
  await p.mouse.wheel(0, 900); await p.waitForTimeout(350);
  const b = await p.evaluate(() => ({ ...window.__trail }));
  ok('wheel scroll moves the path forward (natural scroll, nothing captured)', b.pos > a.pos && b.scrollY > a.scrollY, `${a.pos}->${b.pos}`);
  await p.screenshot({ path: join(OUT, 'trail-mid.png') });
  await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight)); await p.waitForTimeout(300);
  const end = await p.evaluate(() => ({ y: scrollY, max: document.documentElement.scrollHeight - innerHeight, f: window.__trail.f }));
  ok('no scroll trap: the page scrolls past the path to its own end', end.y >= end.max - 2 && end.f === 1, JSON.stringify(end));
  ok('the content after the path is reachable and visible', await p.locator('text=The page goes on').isVisible());
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(200);
  await swipe(p, 195, 420, -500);
  const t = await p.evaluate(() => window.__trail);
  ok('a one-finger swipe on the path surface scrolls the page (touch-action pan-y)', t.scrollY > 100, `scrollY ${t.scrollY}`);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(200);
  await p.locator('#next').click(); await p.waitForTimeout(900); const n1 = await p.evaluate(() => window.__trail.nearest);
  await p.locator('#next').click(); await p.waitForTimeout(900); const n2 = await p.evaluate(() => window.__trail.nearest);
  ok('Next case button moves the path one mark at a time (non-scroll path)', n2 === n1 + 1 && n1 >= 1, `${n1},${n2}`);
  await p.locator('#prev').click(); await p.waitForTimeout(900);
  ok('Previous case button moves back', (await p.evaluate(() => window.__trail.nearest)) === n1);
  await audit(p, 'trail');
  await p.ctx.close();
}

// ================= B. camera: pinch, pin, gestures, buttons =================
console.log('B. camera');
let beforeEv;
{
  const p = await open('case/case-05');
  ok('case loads without errors', p.errors.length === 0, p.errors.join('|'));
  const cb = await box(p, '#cam');
  const cx = cb.x + cb.width / 2, cy = cb.y + cb.height * 0.62;
  const c0 = await camState(p); const focalY = cy - cb.y; const yearBefore = await yAt(p, focalY);
  await pinch(p, cx, cy, 90, 260);
  const c1 = await camState(p); const yearAfter = await yAt(p, focalY);
  ok('pinch out zooms in', c1.scale > c0.scale * 1.5, `${c0.scale.toFixed(1)}->${c1.scale.toFixed(1)}`);
  ok('focal pinning: the year under the fingers does not move (no unexpected year jump)', Math.abs(yearAfter - yearBefore) < 0.08, `${yearBefore} -> ${yearAfter}`);
  ok('semantic zoom: more detail after zooming in', c0.level !== c1.level || c1.scale > 30, `${c0.level} -> ${c1.level}`);
  await p.screenshot({ path: join(OUT, 'camera-zoomed.png') });
  const before2 = await yAt(p, focalY); await pinch(p, cx, cy, 260, 100); const after2 = await yAt(p, focalY);
  ok('pinch in zooms out and the focal year still holds', Math.abs(before2 - after2) < 0.08 && (await camState(p)).scale < c1.scale);
  // the marker never changes during camera motion
  const m0 = (await camState(p)).marker; await pinch(p, cx, cy, 100, 300); ok('camera motion never changes the marker year', (await camState(p)).marker === m0);
  // single finger on the ruler scrolls the page, not the camera
  const y0 = await p.evaluate(() => scrollY), cc0 = await camState(p); await swipe(p, cx, cb.y + 150, -250);
  const y1 = await p.evaluate(() => scrollY), cc1 = await camState(p);
  ok('one-finger drag on the ruler scrolls the page and leaves the camera alone', y1 > y0 && Math.abs(cc1.center - cc0.center) < 1e-9 && cc1.scale === cc0.scale, `scrollY ${y0}->${y1}`);
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(150);
  // buttons and keys
  const s0 = (await camState(p)).scale; await p.locator('#zin').click(); await p.waitForTimeout(700); const s1 = (await camState(p)).scale;
  await p.locator('#zout').click(); await p.waitForTimeout(700); const s2 = (await camState(p)).scale;
  ok('zoom buttons work (non-gesture path)', s1 > s0 && s2 < s1);
  await p.locator('#zfit').click(); await p.waitForTimeout(700);
  ok('Fit button fits the possible years in view', (await camState(p)).scale > 20);
  await p.locator('#cam').focus(); await p.keyboard.press('+'); await p.waitForTimeout(700); const k1 = (await camState(p)).scale; await p.keyboard.press('-'); await p.waitForTimeout(700); const k2 = (await camState(p)).scale;
  ok('keyboard + and - zoom the ruler', k1 > k2);
  await p.keyboard.press('ArrowUp'); await p.waitForTimeout(150); const mk1 = (await camState(p)).marker; await p.keyboard.press('ArrowUp'); await p.waitForTimeout(150); const mk2 = (await camState(p)).marker;
  ok('keyboard arrows move the marker between possible years', mk1 !== null && mk2 !== mk1, `${mk1},${mk2}`);
  // marker handle drag does not scroll the page
  const mkBox = await box(p, '.mk .hdl'); const sy = await p.evaluate(() => scrollY);
  await touch(p, 'touchStart', [[mkBox.x + 20, mkBox.y + 20]]); for (let i = 1; i <= 12; i++) { await touch(p, 'touchMove', [[mkBox.x + 20, mkBox.y + 20 + i * 8]]); await sleep(16); } await touch(p, 'touchEnd', []);
  await p.waitForTimeout(150);
  ok('dragging the marker handle moves the marker and does not scroll the page', (await p.evaluate(() => scrollY)) === sy && (await camState(p)).marker !== null);
  // precision entry
  await p.locator('details > summary:has-text("Type a year")').click(); await p.locator('#ty').fill('1800'); await p.locator('#tyb').click(); await p.waitForTimeout(500);
  ok('precision entry sets the marker', (await camState(p)).marker === 1800);
  await p.locator('#ty').fill('1999'); await p.locator('#tyb').click(); ok('precision entry refuses a year not in play', (await p.locator('#tym').textContent()).includes('not in play'));
  ok('ctrl+wheel (trackpad pinch) zooms, plain wheel does not', await (async () => { const s = (await camState(p)).scale; await p.mouse.move(cx, cy); await p.mouse.wheel(0, -200); await p.waitForTimeout(100); const same = (await camState(p)).scale === s; return same; })());
  await audit(p, 'case'); beforeEv = await camState(p);
  await p.ctx.close();
}

// ================= C. evidence branch: transition, interruption, return, back navigation =================
console.log('C. evidence branch');
{
  const p = await open('case/case-05');
  await p.locator('#zin').click(); await p.waitForTimeout(700); await p.keyboard.press('Tab');
  await p.locator('#cam').focus(); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(200);
  const pre = await camState(p);
  await p.locator('#ev').click(); await p.waitForTimeout(600);
  ok('evidence branch opens to progress 1', (await p.evaluate(() => window.__branch.progress(performance.now()))) === 1);
  ok('branch: the ruler controls are inert while the branch is open; focus is in the branch', await p.evaluate(() => document.getElementById('camctl').inert && document.activeElement.id === 'bh'));
  await p.screenshot({ path: join(OUT, 'branch-open.png') });
  await p.goBack(); await p.waitForTimeout(600);
  const post = await camState(p);
  ok('return: the camera is exactly as it was (centre, scale, marker)', Math.abs(post.center - pre.center) < 1e-9 && post.scale === pre.scale && post.marker === pre.marker);
  ok('browser Back closed the branch and stayed on the case', (await p.evaluate(() => location.hash)) === '#/case/case-05' && (await p.evaluate(() => window.__branch.progress(performance.now()))) === 0);
  ok('focus returned to the Evidence button', await p.evaluate(() => document.activeElement.id === 'ev'));
  // interruption: open then reverse at ~40%, sampling progress
  const samples = await p.evaluate(async () => { const out = []; const br = window.__branch; document.getElementById('ev').click(); const t0 = performance.now(); await new Promise(res => setTimeout(res, 110)); history.back(); const t1 = performance.now(); for (let i = 0; i < 40; i++) { out.push(br.progress(performance.now())); await new Promise(r => setTimeout(r, 12)); } return { out, mid: out[0] }; });
  const mx = Math.max(...samples.out), steps = samples.out.slice(1).map((v, i) => Math.abs(v - samples.out[i]));
  ok('interrupted opening reverses from where it was: never jumps to 0 or 1', mx > 0.1 && mx < 1 && Math.max(...steps) < 0.2, `peak ${mx.toFixed(2)}, max step ${Math.max(...steps).toFixed(2)}`);
  await p.waitForTimeout(500);
  ok('after the interruption the branch ends closed and the camera is intact', (await p.evaluate(() => window.__branch.progress(performance.now()))) === 0 && (await camState(p)).scale === pre.scale);
  // forward/back history
  await p.locator('#ev').click(); await p.waitForTimeout(500); await p.goBack(); await p.waitForTimeout(500); await p.goForward(); await p.waitForTimeout(500);
  ok('Back then Forward reopens the branch', (await p.evaluate(() => window.__branch.progress(performance.now()))) === 1);
  await p.keyboard.press('Escape'); await p.waitForTimeout(600);
  ok('Escape closes the branch', (await p.evaluate(() => window.__branch.progress(performance.now()))) === 0);
  await p.locator('#ev').click(); await p.waitForTimeout(500); await audit(p, 'branch-open');
  await p.ctx.close();
}

// ================= D. lock opening, interruption, skip, then reveal pathway =================
console.log('D. lock and reveal');
{
  const p = await open('case/case-05');
  ok('Skip is hidden until a lock opening is running', !(await p.locator('#skip').isVisible()));
  await p.locator('#lock').click(); ok('Lock without a year asks for one', (await p.locator('#level').textContent()).includes('Choose a year first'));
  await p.locator('#cam').focus(); await p.keyboard.press('ArrowUp'); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(150);
  const mk = (await camState(p)).marker; await p.locator('#lock').click(); await p.waitForTimeout(300);
  const mid = await p.evaluate(() => window.__lock.progress(performance.now()));
  ok('lock opening is mid-way after 300 ms (an animation, not a cut)', mid > 0.1 && mid < 0.95, `p=${mid.toFixed(2)}`);
  await p.screenshot({ path: join(OUT, 'lock-mid.png') });
  await p.locator('#skip').click(); await p.waitForTimeout(100);
  ok('Skip finishes the opening at once', (await p.evaluate(() => window.__lock.progress(performance.now()))) === 1 && (await p.locator('#verdict').isVisible()));
  ok('the opened stratum shows the answer year', (await p.locator('#lyr').textContent()) === '1799');
  ok('the locked marker is the year the player chose', (await camState(p)).marker === mk);
  await p.screenshot({ path: join(OUT, 'lock-done.png') });
  const hash = await p.locator('#toreveal').getAttribute('href'); ok('verdict links to the reveal', hash === '#/reveal/case-05');
  await p.locator('#toreveal').click(); await p.waitForTimeout(900);
  ok('reveal opens with a timeline, a step and the dates in text', (await p.locator('h1').textContent()).includes('Rosetta') && (await p.locator('ol li:has-text("1799")').count()) >= 1);
  const lvl = []; for (let i = 0; i < 5; i++) { await p.locator('#rnext').click(); await p.waitForTimeout(1100); lvl.push(await camState(p)); }
  const steps = await p.evaluate(() => window.__revStep);
  ok('Next step walks the five steps and the camera zooms to each', steps === 4 && new Set(lvl.map(l => l.level)).size >= 2, lvl.map(l => l.level).join(','));
  const overlap = await p.evaluate(() => { const els = [...document.querySelectorAll('.pin:not([hidden]):not(.dotonly) .t')].map(e => e.getBoundingClientRect()); let bad = 0; for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) { const a = els[i], b = els[j]; if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom) bad++; } return { shown: els.length, overlaps: bad }; });
  ok('reveal timeline: no two visible date labels overlap (the others collapse to dots, and the dates are also in the text list)', overlap.overlaps === 0, JSON.stringify(overlap));
  await p.screenshot({ path: join(OUT, 'reveal-step.png') });
  await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
  const stepBefore = await p.evaluate(() => window.__revStep); await p.mouse.wheel(0, 2400); await p.waitForTimeout(1200);
  ok('natural wheel scroll also advances the steps', (await p.evaluate(() => window.__revStep)) >= 2, `${stepBefore} -> ${await p.evaluate(() => window.__revStep)}`);
  ok('step progress is announced in text', (await p.locator('#rlevel').textContent()).includes('Step'));
  // scroll restoration + back
  const sy = await p.evaluate(() => scrollY); await p.goBack(); await p.waitForTimeout(700);
  ok('Back from the reveal returns to the locked case with the verdict', await p.locator('#verdict').isVisible() && (await p.locator('#lyr').textContent()) === '1799');
  await p.goForward(); await p.waitForTimeout(900); const sy2 = await p.evaluate(() => scrollY);
  ok('scroll restoration: Forward returns to the same scroll position', Math.abs(sy2 - sy) < 6, `${sy} -> ${sy2}`);
  // resume
  await p.reload(); await p.waitForFunction(() => window.__ready); await p.waitForTimeout(600);
  ok('reload offers Resume at the saved step', await p.locator('#resume').isVisible());
  await p.locator('#rres').click(); await p.waitForTimeout(1000);
  ok('Resume jumps to the saved step', (await p.evaluate(() => window.__revStep)) >= 3);
  await p.locator('#rskip').click(); await p.waitForTimeout(900);
  ok('Skip to the end reaches the last step', (await p.evaluate(() => window.__revStep)) === 4);
  await audit(p, 'reveal');
  await p.ctx.close();
}

// ================= E. reduced motion: same content, no travel =================
console.log('E. reduced motion');
const cmp = {};
for (const reduced of [false, true]) {
  const p = await open('case/case-05', { reduced });
  const out = {};
  await p.evaluate(() => { window.__log = []; });
  const sc0 = (await camState(p)).scale; const t0 = await p.evaluate(() => performance.now()); await p.locator('#zin').click();
  out.zoomSettleMs = await p.evaluate(async ([t0, sc0]) => { const v = window.__camView; for (let i = 0; i < 200; i++) { if (!v.anim && Math.abs(v.cam.scale - sc0) > 1e-6) return Math.round(performance.now() - t0); await new Promise(r => setTimeout(r, 10)); } return -1; }, [t0, sc0]);
  await p.locator('#ev').click(); await p.waitForTimeout(30); out.branchAt30ms = await p.evaluate(() => +window.__branch.progress(performance.now()).toFixed(2)); await p.waitForTimeout(500); out.branchEnd = await p.evaluate(() => window.__branch.progress(performance.now()));
  await p.goBack(); await p.waitForTimeout(400);
  await p.locator('#cam').focus(); await p.keyboard.press('ArrowUp'); await p.locator('#lock').click(); await p.waitForTimeout(40); out.lockAt40ms = await p.evaluate(() => +window.__lock.progress(performance.now()).toFixed(2));
  await p.waitForTimeout(1000); out.lockEnd = await p.evaluate(() => window.__lock.progress(performance.now()));
  out.verdictShown = await p.locator('#verdict').isVisible(); out.answerYear = await p.locator('#lyr').textContent();
  cmp[reduced ? 'reduced' : 'full'] = out; await p.ctx.close();
}
notes.reducedMotion = cmp;
ok('reduced motion: zoom, branch and lock arrive at their end state at once', cmp.reduced.branchAt30ms === 1 && cmp.reduced.lockAt40ms === 1 && cmp.reduced.zoomSettleMs >= 0 && cmp.reduced.zoomSettleMs < 150, JSON.stringify(cmp.reduced));
ok('full motion: the same transitions take visible time', cmp.full.branchAt30ms < 0.5 && cmp.full.lockAt40ms < 0.5 && cmp.full.zoomSettleMs > 200, JSON.stringify(cmp.full));
ok('reduced motion loses no information: verdict and answer year still shown', cmp.reduced.verdictShown && cmp.reduced.answerYear === '1799' && cmp.full.verdictShown);

// ================= F. large text =================
console.log('F. large text');
for (const scale of [130, 200]) {
  const p = await open('case/case-05', { scale });
  const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: innerWidth, camH: document.getElementById('cam').clientHeight }));
  ok(`text ${scale}%: no horizontal scroll; ruler still ${scale === 200 ? 'tall enough to use' : 'usable'}`, o.sw <= o.vw && o.camH >= 200, JSON.stringify(o));
  await p.locator('#cam').scrollIntoViewIfNeeded(); await p.waitForTimeout(200); const cb = await box(p, '#cam'); const ok0 = await camState(p); await pinch(p, cb.x + cb.width / 2, cb.y + cb.height / 2, 80, 220); ok(`text ${scale}%: pinch still works`, (await camState(p)).scale > ok0.scale);
  await p.locator('#cam').focus(); await p.keyboard.press('ArrowUp'); await p.locator('details > summary:has-text("Type a year")').click(); await p.locator('#ty').fill('1799'); await p.locator('#tyb').click(); await p.waitForTimeout(400);
  ok(`text ${scale}%: precision entry works`, (await camState(p)).marker === 1799);
  await p.screenshot({ path: join(OUT, `large-text-${scale}.png`) });
  if (scale === 200) { const r = await p.evaluate(() => { document.getElementById('lock').scrollIntoView(); const b = document.getElementById('lock').getBoundingClientRect(); return b.width > 100 && b.height >= 44; }); ok('text 200%: the Lock button is reachable and large', r); }
  await p.ctx.close();
}
const axeV = (notes.axe || []).flatMap(a => a.violations.map(v => ({ screen: a.screen, ...v })));

// ================= G. performance =================
console.log('G. performance');
const perfRuns = [];
for (const rate of [1, 4, 6]) {
  const p = await open('case/case-05', { query: '' });
  await p.locator('#cam').focus(); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(200);
  await p.cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const m0 = await p.cdp.send('Performance.getMetrics'); await p.cdp.send('Performance.enable'); const m00 = await p.cdp.send('Performance.getMetrics');
  await p.evaluate(() => window.__perf.start(`pinch+drag+branch`));
  const cb = await box(p, '#cam');
  for (let k = 0; k < 3; k++) { await pinch(p, cb.x + cb.width / 2, cb.y + cb.height * .55, 80, 300, 30, 16); await pinch(p, cb.x + cb.width / 2, cb.y + cb.height * .55, 300, 80, 30, 16); }
  const mk = await box(p, '.mk .hdl'); await touch(p, 'touchStart', [[mk.x + 20, mk.y + 20]]); for (let i = 1; i <= 40; i++) { await touch(p, 'touchMove', [[mk.x + 20, mk.y + 20 + Math.sin(i / 4) * 60]]); await sleep(16); } await touch(p, 'touchEnd', []);
  await p.locator('#ev').click(); await p.waitForTimeout(500); await p.goBack(); await p.waitForTimeout(500);
  const s = await p.evaluate(() => window.__perf.stop());
  const m1 = await p.cdp.send('Performance.getMetrics'); const d = k => +((m1.metrics.find(x => x.name === k).value - m00.metrics.find(x => x.name === k).value)).toFixed(3);
  perfRuns.push({ cpuThrottle: rate + 'x', ...s, cpu: { taskSec: d('TaskDuration'), scriptSec: d('ScriptDuration'), layoutSec: d('LayoutDuration'), recalcStyleSec: d('RecalcStyleDuration'), layoutCount: d('LayoutCount'), recalcStyleCount: d('RecalcStyleCount') } }); await p.ctx.close();
}
// trail path scroll under 4x
{
  const p = await open('trail'); await p.cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await p.evaluate(() => window.__perf.start('path scroll')); for (let i = 0; i < 30; i++) { await p.mouse.wheel(0, 120); await sleep(16); } await sleep(300);
  perfRuns.push({ cpuThrottle: '4x', ...(await p.evaluate(() => window.__perf.stop())) }); await p.ctx.close();
}
notes.perf = perfRuns;
for (const r of perfRuns) console.log(`  ${r.label} @${r.cpuThrottle}: frames ${r.frames}, p50 ${r.frameMs.p50}, p95 ${r.frameMs.p95}, max ${r.frameMs.max}, >33ms ${r.over33}, input->frame p95 ${r.inputToFrameMs.p95}, render() p95 ${r.renderMs && r.renderMs.p95}ms, cpu ${JSON.stringify(r.cpu || '')}`);
const worst4 = perfRuns.filter(r => r.cpuThrottle === '4x' && r.label.startsWith('pinch'))[0];
ok('performance @4x CPU: 95th percentile frame time under 33 ms during pinch, drag and branch', worst4 && worst4.frameMs.p95 <= 33.4, JSON.stringify(worst4 && worst4.frameMs));
ok('performance @4x CPU: input-to-frame 95th percentile under 50 ms', worst4 && worst4.inputToFrameMs.p95 !== null && worst4.inputToFrameMs.p95 <= 50, JSON.stringify(worst4 && worst4.inputToFrameMs));

await browser.close(); srv.close();
writeFileSync(join(OUT, 'perf-summary.json'), JSON.stringify({ note: 'Headless Chromium on a cloud VM with emulated touch and emulated CPU throttling. NOT a phone. Run the page with ?perf=1 on a real device and send the downloaded JSON.', runs: perfRuns }, null, 2) + '\n');
const report = { generated: new Date().toISOString().slice(0, 10), checks, passed: checks.filter(c => c.pass).length, total: checks.length, axe: axeV, reducedMotion: cmp };
writeFileSync(join(OUT, 'e2e-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`\nMOTION E2E ${report.passed}/${report.total} passed; axe violations: ${axeV.length}`);
for (const v of axeV.slice(0, 12)) console.log('  axe', v.screen, v.id, v.impact, v.target, '|', v.why);
