// Records the motion prototype as video (touch emulated, 390x844) and builds the transition storyboards.
// Storyboard frames are deterministic: the transition progress is set directly, so every frame is the same on every run.
// Usage: node scripts/record-motion.mjs
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync, readdirSync, renameSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { start } from './serve.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', '..', 'docs', 'motion'); mkdirSync(join(OUT, 'frames'), { recursive: true }); rmSync(join(OUT, '_v'), { recursive: true, force: true });
const srv = await start(5195); const BASE = 'http://127.0.0.1:5195/motion/index.html';
const browser = await chromium.launch(); const sleep = ms => new Promise(r => setTimeout(r, ms));
const mk = async ({ reduced = false, video = false } = {}) => { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference', ...(video ? { recordVideo: { dir: join(OUT, '_v'), size: { width: 390, height: 844 } } } : {}) }); const p = await ctx.newPage(); p.ctx = ctx; p.cdp = await ctx.newCDPSession(p); return p; };
const go = async (p, hash) => { await p.goto(BASE + '#/' + hash); await p.waitForFunction(() => window.__ready); await p.waitForTimeout(600); };
const touch = (p, type, pts) => p.cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y], i) => ({ x, y, id: i + 1 })) });
async function pinch(p, cx, cy, d0, d1, steps = 28) { await touch(p, 'touchStart', [[cx, cy - d0 / 2], [cx, cy + d0 / 2]]); for (let i = 1; i <= steps; i++) { const d = d0 + (d1 - d0) * i / steps; await touch(p, 'touchMove', [[cx, cy - d / 2], [cx, cy + d / 2]]); await sleep(24); } await touch(p, 'touchEnd', []); await sleep(200); }

// ---------- video ----------
{
  const p = await mk({ video: true });
  await go(p, 'trail'); await sleep(600);
  for (let i = 0; i < 6; i++) { await p.mouse.wheel(0, 380); await sleep(420); }
  for (let i = 0; i < 14; i++) { const n = await p.evaluate(() => window.__trail.nearest); if (n === 4) break; await p.locator(n < 4 ? '#next' : '#prev').click(); await sleep(950); }
  await p.locator('.pm[tabindex="0"]').first().click(); await sleep(900);
  const cb = await p.locator('#cam').boundingBox(); const cx = cb.x + cb.width / 2, cy = cb.y + cb.height * .55;
  await pinch(p, cx, cy, 70, 240); await pinch(p, cx, cy, 240, 90); await pinch(p, cx, cy, 90, 300); await sleep(300);
  await p.locator('#cam').focus(); await p.keyboard.press('ArrowUp'); await sleep(300); await p.keyboard.press('ArrowUp'); await sleep(400);
  await p.locator('#ev').click(); await sleep(800); await p.goBack(); await sleep(700);
  await p.locator('#ev').click(); await sleep(120); await p.goBack(); await sleep(800);
  await p.locator('#lock').click(); await sleep(1500);
  await p.locator('#toreveal').click(); await sleep(1000);
  for (let i = 0; i < 4; i++) { await p.locator('#rnext').click(); await sleep(1500); }
  await p.ctx.close();
  const f = readdirSync(join(OUT, '_v')).find(x => x.endsWith('.webm')); renameSync(join(OUT, '_v', f), join(OUT, 'motion-run.webm')); rmSync(join(OUT, '_v'), { recursive: true, force: true });
}

// ---------- storyboards ----------
const frames = {};
for (const reduced of [false, true]) {
  const tag = reduced ? 'reduced' : 'full';
  const p = await mk({ reduced });
  await go(p, 'case/case-05');
  const cb = await p.locator('#cam').boundingBox(); const cx = cb.x + cb.width / 2, cy = cb.y + cb.height * .55;
  // camera semantic zoom: three levels
  if (!reduced) {
    for (const [i, fac] of [[0, 0], [1, 1], [2, 2]]) { if (fac) await pinch(p, cx, cy, 80, 80 + 170 * fac, 30); await p.waitForTimeout(250); const lv = await p.evaluate(() => window.__camView.state().level); await p.screenshot({ path: join(OUT, 'frames', `zoom-${i}.png`) }); frames['zoom-' + i] = lv; }
  }
  await go(p, 'case/case-05'); await p.locator('#cam').focus(); await p.keyboard.press('ArrowUp'); await p.waitForTimeout(250);
  // evidence branch at fixed progress values (default) or what a reduced-motion user sees (single state change)
  await p.locator('#ev').click(); await p.waitForTimeout(700); await p.goBack(); await p.waitForTimeout(700);
  const ps = reduced ? [0, 1] : [0, .25, .5, .75, 1];
  for (const q of ps) { await p.evaluate(q => { scrollTo(0, 0); const b = window.__branch; b.p0 = q; b.dir = 0; window.__frameBranch(); }, q); await p.waitForTimeout(80); await p.screenshot({ path: join(OUT, 'frames', `branch-${tag}-${q}.png`) }); }
  await p.evaluate(() => { const b = window.__branch; b.p0 = 0; b.dir = 0; window.__frameBranch(); });
  // lock opening
  await p.evaluate(() => { const st = window.__lockState; st.lockY = window.__yTo(window.__camView.marker); document.getElementById('lyr').textContent = '1799'; });
  const ls = reduced ? [0, 1] : [0, .2, .4, .6, 1];
  for (const q of ls) { await p.evaluate(q => { scrollTo(0, 0); const l = window.__lock; l.p0 = q; l.dir = 0; window.__frameLock(); }, q); await p.waitForTimeout(80); await p.screenshot({ path: join(OUT, 'frames', `lock-${tag}-${q}.png`) }); }
  await p.ctx.close();
}
await browser.close(); srv.close();
// ---------- compose sheets ----------
const b2 = await chromium.launch(); const p2 = await b2.newPage({ viewport: { width: 1800, height: 900 } });
const cell = (f, cap) => `<figure><img src="frames/${f}" width="260"><figcaption>${cap}</figcaption></figure>`;
const css = `body{margin:0;background:#14130F;color:#EDE6D6;font:15px/1.4 'Sofia Sans',system-ui,sans-serif}.w{padding:30px 36px}h1{font:400 32px/1 'Young Serif',serif;margin:0 0 14px}h2{font:700 17px/1 'Sofia Sans';margin:26px 0 10px;color:#D2AC4F}.g{display:flex;gap:16px}figure{margin:0}img{display:block;border:2px solid #3a362f}figcaption{margin-top:6px;max-width:260px;font-size:14px}`;
const row = (title, items) => `<h2>${title}</h2><div class="g">${items.map(([f, c]) => cell(f, c)).join('')}</div>`;
const html = `<div class="w"><h1>Transition storyboard: full motion and reduced motion</h1><p>Frames are set to exact transition progress, so they are identical on every run. Real timing: branch 340 ms, lock opening 900 ms, camera zoom 360 ms. Reduced motion has no travel: the end state appears at once and nothing is lost.</p>
${row('Semantic zoom (pinch out): the ruler changes what it labels as it zooms', [['zoom-0.png', 'Overview: the whole corridor, centuries or decades labelled'], ['zoom-1.png', 'Closer: years labelled'], ['zoom-2.png', 'Close: each possible year is a large numeral and a target']])}
${row('Evidence branch, full motion. The ruler dims and stays where it is; the sheet rises.', [0, .25, .5, .75, 1].map(q => [`branch-full-${q}.png`, `Progress ${q}`]))}
${row('Evidence branch, reduced motion', [0, 1].map(q => [`branch-reduced-${q}.png`, q ? 'Open at once' : 'Closed']))}
${row('Lock opening, full motion. The layers part along the lock and the year grows in the gap.', [0, .2, .4, .6, 1].map(q => [`lock-full-${q}.png`, `Progress ${q}`]))}
${row('Lock opening, reduced motion. A straight cut to the same final state.', [0, 1].map(q => [`lock-reduced-${q}.png`, q ? 'Final state at once' : 'Before'])) }</div>`;
writeFileSync(join(OUT, 'storyboard.html'), `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Sofia+Sans:wght@400;700&display=block" rel="stylesheet"><style>${css}</style></head><body>${html}</body></html>`);
await p2.goto('file://' + join(OUT, 'storyboard.html')); await p2.waitForTimeout(900); await p2.screenshot({ path: join(OUT, 'storyboard.png'), fullPage: true });
await b2.close(); rmSync(join(OUT, 'storyboard.html'));
console.log('video and storyboard written; zoom levels:', JSON.stringify(frames));
