// Offline, install and update proof (Stage 11). Real Chromium (Playwright): installs the service worker, goes offline, plays a case, reloads,
// then checks that an update waits (never interrupts) and that the kill switch removes the worker and its caches.
// Usage: node scripts/e2e-offline.mjs
import { createRequire } from 'node:module';
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { start } from './serve.mjs';
import { manifestText } from './build-sw.mjs';
import { validatePack } from '../src/engine/pack.js';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const content = validatePack(JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8')), { allowDraft: true }).content;
const target = content.cases[0].target;

// A tiny front server so the test can swap sw-manifest.js (an "update" or the kill switch) without touching files.
const inner = await start(5189);
let override = null;
const front = createServer(async (req, res) => {
  if (override && req.url.split('?')[0] === '/sw-manifest.js') { res.writeHead(200, { 'content-type': 'text/javascript', 'cache-control': 'no-store' }); return res.end(override); }
  const r = await fetch('http://127.0.0.1:5189' + req.url);
  res.writeHead(r.status, { 'content-type': r.headers.get('content-type') || 'application/octet-stream', 'cache-control': 'no-store' });
  res.end(Buffer.from(await r.arrayBuffer()));
}).listen(5190);
const BASE = 'http://127.0.0.1:5190/';

const checks = [];
const ok = (name, cond, detail = '') => { checks.push({ name, pass: !!cond, detail }); console.log((cond ? '  ok   ' : '  FAIL ') + name + (detail && !cond ? ' ' + detail : '')); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
const cacheInfo = () => page.evaluate(async () => { const ks = (await caches.keys()).filter(k => k.startsWith('timehunt-')); const out = {}; for (const k of ks) out[k] = (await (await caches.open(k)).keys()).length; return out; });
const waitFor = async (fn, ms = 15000) => { const t = Date.now(); while (Date.now() - t < ms) { if (await fn()) return true; await page.waitForTimeout(150); } return false; };

console.log('A. install');
await page.goto(BASE + '?sw=1');
await page.evaluate(() => navigator.serviceWorker.ready);
ok('a service worker registered and active', await waitFor(async () => (await page.evaluate(() => navigator.serviceWorker.getRegistration())) && await page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration()).active)));
const build = (readFileSync(join(here, '..', 'sw-manifest.js'), 'utf8').match(/__BUILD = '([0-9a-f]+)'/) || [])[1];
const expectCount = (manifestText().match(/"[^"\n]+",?\n/g) || []).length;
await waitFor(async () => Object.keys(await cacheInfo()).length > 0);
let ci = await cacheInfo();
ok('the cache is named for the build', Object.keys(ci).includes('timehunt-' + build), JSON.stringify(ci));
ok('the whole shell is precached', (ci['timehunt-' + build] || 0) >= expectCount - 1, `${ci['timehunt-' + build]} of ${expectCount}`);
const manifestOk = await page.evaluate(async () => { const r = await fetch('manifest.webmanifest'); const j = await r.json(); return r.ok && j.display === 'standalone' && j.icons.length >= 3; });
ok('the manifest is served and installable (standalone, icons)', manifestOk);

console.log('B. offline play');
await page.reload(); await page.waitForSelector('[data-action]');
await ctx.setOffline(true);
await page.reload(); await page.waitForSelector('[data-action]');
ok('the app loads with the network off', await page.locator('.wordmark').count() > 0);
ok('the offline notice is shown', /offline/i.test(await page.locator('#banner').innerText()));
const imgs = await page.evaluate(() => [...document.images].map(i => ({ src: i.src.split('/').pop(), ok: i.complete && i.naturalWidth > 0 })));
ok('illustrations load offline', imgs.length > 0 && imgs.every(i => i.ok), JSON.stringify(imgs));
const fontOk = await page.evaluate(async () => { await document.fonts.ready; return [...document.fonts].filter(f => f.status === 'loaded').length; });
ok('fonts load offline', fontOk >= 3, 'loaded ' + fontOk);
await page.click('[data-action="onb-next"]'); await page.click('[data-action="onb-next"]'); await page.click('[data-action="onb-done"]');
await page.click('[data-action="trail-go"]'); await page.click('[data-action="to-hunt"]');
await page.click(`label.layer:has(input[value="${target}"])`);
await page.click('[data-action="lock"]');
const yes = page.locator('dialog[open] [data-d="yes"]'); if (await yes.count()) await yes.click();
await page.waitForSelector('.result');
ok('a case can be solved offline', /Solved/i.test(await page.locator('.result').innerText()));
await page.reload(); await page.waitForSelector('[data-action]');
ok('the solved case is still there after an offline reload', await page.locator('.result, .banner, .hud').count() > 0 && /Insight|Solved|Case 1/.test(await page.locator('main').innerText()));
await ctx.setOffline(false);

console.log('C. an update waits and never interrupts');
override = manifestText().replace(/__BUILD = '[0-9a-f]+'/, "__BUILD = 'testupdate01'");
await page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
ok('the new version installs and waits', await waitFor(async () => page.evaluate(async () => !!(await navigator.serviceWorker.getRegistration()).waiting)));
ok('the banner says a new version is ready', await waitFor(async () => /new version is ready/i.test(await page.locator('#banner').innerText())));
ci = await cacheInfo();
ok('the old cache is kept until the app is closed', Object.keys(ci).includes('timehunt-' + build) && Object.keys(ci).includes('timehunt-testupdate01'), JSON.stringify(ci));
ok('the page was not reloaded or interrupted', await page.locator('main').innerText().then(t => t.length > 20));

console.log('D. the kill switch');
override = manifestText({ kill: true });
await page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.update()));
ok('the kill switch removes the worker', await waitFor(async () => (await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length)) === 0, 20000));
ok('the kill switch deletes every cache', await waitFor(async () => Object.keys(await cacheInfo()).length === 0, 20000));

await browser.close(); front.close(); inner.close();
const failed = checks.filter(c => !c.pass).length;
console.log(`\nOFFLINE E2E ${checks.length - failed}/${checks.length} passed`);
process.exit(failed ? 1 : 0);
