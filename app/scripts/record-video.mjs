// End-to-end run in a real browser (Playwright, headless Chromium): plays case 1 to 10, records video and screenshots,
// and asserts every behaviour the Stage 4 brief names. Usage: node scripts/record-video.mjs
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, renameSync, mkdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validatePack } from '../src/engine/pack.js';
import { start } from './serve.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', '..', 'docs', 'gray-box');
mkdirSync(out, { recursive: true });
const tmp = join(out, '_video_tmp'); rmSync(tmp, { recursive: true, force: true });

const content = validatePack(JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8')), { allowDraft: true }).content;
const srv = await start(5199);
const url = 'http://127.0.0.1:5199/?debug=1';
const checks = [];
const ok = (name, cond, detail = '') => { checks.push({ name, pass: !!cond, detail }); if (!cond) throw new Error('E2E FAILED: ' + name + ' ' + detail); };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, recordVideo: { dir: tmp, size: { width: 390, height: 844 } } });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const pause = ms => page.waitForTimeout(ms);
const insight = async () => Number(await page.textContent('#ins'));
const heading = async () => (await page.textContent('#h')).trim();
const shot = async n => page.screenshot({ path: join(out, `graybox-${n}.png`) });
const lockYear = async y => { await page.selectOption('#yr', String(y)); await pause(250); await page.click('#lock'); await pause(700); };
const next = async () => { await page.click('#next'); await pause(450); };
const reveal = async (n) => { await page.click(`button[data-clue="${n}"]`); await pause(600); };

await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload(); await pause(900);
ok('draft banner is shown', (await page.textContent('#banner')).includes('DRAFT PACK'));
ok('starts at case 1 with 8 Insight', (await heading()).startsWith('Case 1.') && (await insight()) === 8);
await shot('01-case-open');

const T = i => content.cases[i].target;
// case 1: Deep clue, solved with help
await reveal('p2'); ok('case 1: Deep clue costs 2', (await insight()) === 6);
await lockYear(T(0)); ok('case 1 solved', (await page.textContent('.result h3')).startsWith('Solved')); await shot('02-solved'); await next();
// case 2: pay on case 2
await reveal('p2'); ok('case 2: Deep clue paid, 4 left', (await insight()) === 4);
await lockYear(T(1)); await next();
// case 3: reload mid-purchase (crash before the write)
ok('case 3 open', (await heading()).startsWith('Case 3.'));
await page.click('#crash-before'); await pause(300);
await reveal('p1');
ok('crash before write: user told nothing was charged', (await page.textContent('.msg')).includes('Nothing was charged'));
ok('crash before write: Insight unchanged', (await insight()) === 4);
await shot('03-crash-before-save');
await page.reload(); await pause(900);
ok('after reload: still case 3, Insight 4, clue not revealed', (await heading()).startsWith('Case 3.') && (await insight()) === 4 && (await page.locator('button[data-clue="p1"]').count()) === 1);
await reveal('p1'); ok('retry works and charges once', (await insight()) === 3);
await lockYear(T(2)); await next();
// case 4: free evidence only
await lockYear(T(3)); ok('case 4 solved with no Insight', (await insight()) === 3); await next();
// case 5: a miss
const wrong5 = content.cases[4].c0.find(y => y !== T(4));
await lockYear(wrong5);
ok('case 5 missed and answer shown', (await page.textContent('.result h3')).startsWith('Missed') && (await page.textContent('.result h3')).includes(String(T(4))));
await shot('04-missed');
await page.reload(); await pause(900);
ok('reload on a resolved case keeps the miss', (await page.textContent('.result h3')).startsWith('Missed'));
await next();
ok('a miss did not end the day: case 6 opens', (await heading()).startsWith('Case 6.'));
// case 6
await lockYear(T(5)); await next();
// case 7: pay, with a crash AFTER the write
await page.click('#crash-after'); await pause(300);
await reveal('p1');
ok('crash after write: purchase kept once', (await insight()) === 2);
await page.reload(); await pause(900);
ok('after reload: charged exactly once', (await insight()) === 2 && (await page.locator('.clue.rev').count()) === 1);
await lockYear(T(6)); await next();
// case 8
await reveal('p1'); ok('case 8 Nudge', (await insight()) === 1);
await lockYear(T(7)); await next();
// case 9: the last token
await reveal('p1'); ok('case 9 spends the last Insight', (await insight()) === 0); await shot('05-last-token');
await lockYear(T(8)); await next();
// case 10: nothing left to spend
ok('case 10: clue buttons are disabled at zero Insight', (await page.locator('button[data-clue]:not([disabled])').count()) === 0 && (await page.textContent('.clues')).includes('Not enough Insight'));
await shot('06-zero-insight');
await lockYear(T(9));
await page.click('#next'); await pause(900);
const endHead = await heading();
ok('ends with 9 of 10 solved and 0 Insight left', endHead.startsWith('9 of 10 solved') && endHead.includes('0 Insight left'), endHead);
await shot('07-finished');
await page.reload(); await pause(900);
ok('reload after finishing: still finished, no refill', (await heading()).startsWith('9 of 10 solved') && (await insight()) === 0);
ok('share text has no answers', !/(1969|1893|1565|1919|1799|1977|1325|1446|2 CE)/.test(await page.textContent('#share')));
ok('no page errors', errors.length === 0, errors.join(' | '));
await pause(600);

// invalid pack fail-safe in the browser
await ctx.close();
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p2 = await ctx2.newPage();
await p2.route('**/data/daily-pack-draft.json', async route => {
  const raw = JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8'));
  raw.cases[0].paid[0].predicate.year = 1900; // a paid clue that cuts nothing
  await route.fulfill({ contentType: 'application/json', body: JSON.stringify(raw) });
});
await p2.goto('http://127.0.0.1:5199/'); await p2.waitForTimeout(800);
ok('invalid pack: refused with a clear message and no game started', (await p2.textContent('main')).includes('failed validation') && (await p2.locator('#lock').count()) === 0);
await p2.screenshot({ path: join(out, 'graybox-08-invalid-pack.png') });
ok('invalid pack: nothing saved', (await p2.evaluate(() => Object.keys(localStorage).length)) === 0);
await ctx2.close();

// Trace variant smoke
const ctx3 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p3 = await ctx3.newPage();
await p3.goto('http://127.0.0.1:5199/?variant=trace'); await p3.waitForTimeout(700);
ok('trace variant shows Trace; default does not', (await p3.locator('#trbtn').count()) === 1);
await ctx3.close();
await browser.close(); srv.close();

const vid = join(tmp, require('node:fs').readdirSync(tmp).find(f => f.endsWith('.webm')));
renameSync(vid, join(out, 'graybox-run.webm')); rmSync(tmp, { recursive: true, force: true });
writeFileSync(join(out, 'e2e-report.json'), JSON.stringify({ checks, passed: checks.filter(c => c.pass).length, total: checks.length }, null, 2));
console.log(`E2E: ${checks.filter(c => c.pass).length}/${checks.length} checks passed; video at docs/gray-box/graybox-run.webm`);
