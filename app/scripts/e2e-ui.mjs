// Stage 7 end-to-end, accessibility and layout audit. Real Chromium (Playwright). Asserts behaviour, runs axe-core on every screen,
// measures reach and tap targets, checks overflow at widths and text sizes, dumps accessibility trees, and writes screenshots.
// Usage: node scripts/e2e-ui.mjs      (needs `npm install` once for axe-core)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validatePack } from '../src/engine/pack.js';
import { start } from './serve.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', '..', 'docs', 'ui');
mkdirSync(join(OUT, 'screens'), { recursive: true }); mkdirSync(join(OUT, 'aria'), { recursive: true });
const AXE = join(here, '..', 'node_modules', 'axe-core', 'axe.min.js');
const raw = JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8'));
const content = validatePack(raw, { allowDraft: true }).content;
const T = i => content.cases[i].target;
const label = y => (y <= 0 ? `${1 - y} BCE` : y < 1000 ? `${y} CE` : String(y));

const srv = await start(5197);
const BASE = 'http://127.0.0.1:5197/';
const checks = [], axeResults = [], reach = [], overflow = [], targets = [], shots = [];
const ok = (name, cond, detail = '') => { checks.push({ name, pass: !!cond, detail }); if (!cond) console.log('  FAIL:', name, detail); };
const browser = await chromium.launch();
const newCtx = (o = {}) => browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, ...o });
let n = 0;
async function snap(page, name) { await page.evaluate(() => { const st = document.createElement('style'); st.id = 'nodebug'; st.textContent = '.debug{display:none!important}'; document.head.append(st); }); const dlgOpen = await page.locator('dialog[open]').count(); if (!dlgOpen) { await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(60); await page.evaluate(() => window.scrollTo(0, 0)); } const f = `${String(++n).padStart(2, '0')}-${name}.png`; await page.screenshot({ path: join(OUT, 'screens', f) }); await page.evaluate(() => document.getElementById('nodebug') && document.getElementById('nodebug').remove()); shots.push(f); return f; }
async function audit(page, name) {
  await page.addScriptTag({ path: AXE });
  const r = await page.evaluate(async () => { const x = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }); return x.violations.map(v => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, target: v.nodes[0] && v.nodes[0].target.join(' '), why: v.nodes[0] && v.nodes[0].failureSummary.replace(/\s+/g, ' ').slice(0, 260) })); });
  axeResults.push({ screen: name, violations: r });
  // reach and tap targets
  const m = await page.evaluate(() => {
    const vh = innerHeight, vw = innerWidth;
    const vis = e => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const els = [...document.querySelectorAll('button, a[href]:not(.skip), input:not([type=hidden]), select, summary, label.layer')].filter(vis);
    return { primary: [...document.querySelectorAll('.btn.primary')].filter(vis).map(e => { const r = e.getBoundingClientRect(); return { text: e.textContent.trim().slice(0, 30), top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width) }; }),
      small: els.map(e => { const r = e.getBoundingClientRect(); const t = e.closest('label.layer') || e; const rr = t.getBoundingClientRect(); return { tag: e.tagName + (e.type ? ':' + e.type : ''), text: (e.textContent || e.name || '').trim().slice(0, 24), w: Math.round(rr.width), h: Math.round(rr.height) }; }).filter(x => (x.w < 44 || x.h < 44) && !/checkbox|radio/.test(x.tag)), vh, vw, scrollW: document.documentElement.scrollWidth };
  });
  for (const p of m.primary) reach.push({ screen: name, ...p, vh: m.vh, inLower45: p.top >= m.vh * 0.55 - 1 || p.bottom > m.vh * 0.9 });
  if (m.small.length) targets.push({ screen: name, small: m.small });
  if (m.scrollW > m.vw) { const off = await page.evaluate(() => [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 5).map(e => e.tagName + '.' + e.className + ' ' + e.textContent.trim().slice(0, 20))); overflow.push({ screen: name, scrollW: m.scrollW, vw: m.vw, offenders: off }); }
  return m;
}
async function aria(page, name) { const s = await page.locator('body').ariaSnapshot(); writeFileSync(join(OUT, 'aria', name + '.txt'), s + '\n'); return s; }
const h1 = p => p.locator('#h').first().textContent().then(s => s.trim());
const focusedId = p => p.evaluate(() => document.activeElement && (document.activeElement.id || document.activeElement.tagName));
const insight = p => p.locator('.hudr > span:last-child').first().textContent().then(s => Number(s.match(/Insight (\d+) of/)[1]));
async function pickYear(page, y) { await page.locator('label.layer', { hasText: new RegExp(`^\\s*${label(y)}`) }).first().click(); }
async function lockFlow(page, y) { await pickYear(page, y); await page.getByRole('button', { name: /^Lock/ }).click(); await page.getByRole('dialog').getByRole('button', { name: /^Lock/ }).click(); await page.waitForTimeout(150); }
async function reveal(page, clueIdx, expectCost) {
  await page.getByRole('button', { name: /^Evidence$/ }).click(); await page.waitForTimeout(100);
  await page.locator('button[data-action=reveal]').nth(clueIdx).click();
  await page.getByRole('dialog').getByRole('button', { name: /^Reveal for/ }).click(); await page.waitForTimeout(150);
  await page.getByRole('button', { name: /Back to the years/ }).click(); await page.waitForTimeout(100);
}
async function newPage(ctxOpts = {}, url = BASE, onboarded = true) {
  const ctx = await newCtx(ctxOpts);
  const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(String(e))); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.addInitScript(o => { if (o && !localStorage.getItem('timehunt:settings')) localStorage.setItem('timehunt:settings', JSON.stringify({ textScale: 100, reduceMotion: false, confirmSpend: true, onboarded: true })); }, onboarded);
  await page.goto(url); await page.waitForTimeout(700);
  page.errors = errors; page.ctx = ctx;
  return page;
}

// ======================= A. full day by pointer =======================
console.log('A. full day');
{
  const page = await newPage({}, BASE + '?debug=1', false);
  // onboarding
  ok('first run shows onboarding step 1 of 3', (await h1(page)) === 'Read, then choose');
  await snap(page, 'onboarding-1'); await audit(page, 'onboarding-1'); await aria(page, 'onboarding');
  await page.getByRole('button', { name: 'Next' }).click(); await page.getByRole('button', { name: 'Next' }).click();
  ok('onboarding step 3 names the one Lock', (await h1(page)) === 'One Lock per case');
  await snap(page, 'onboarding-3');
  await page.getByRole('button', { name: 'Start playing' }).click();
  ok('trail: title and next action', (await h1(page)) === 'The Daily Ten' && await page.getByRole('button', { name: 'Start case 1' }).isVisible());
  ok('trail: bank and case structure visible without a legend', (await page.locator('.hudr').textContent()).includes('Insight 8 of 8') && (await page.locator('.strip li').count()) === 10);
  await snap(page, 'trail-start'); await audit(page, 'trail-start'); await aria(page, 'trail');
  await page.getByRole('button', { name: 'Start case 1' }).click();
  ok('dossier: focus moves to the case title after navigation', (await focusedId(page)) === 'h');
  ok('dossier: shows case count, notes and possible years', (await page.locator('.hud').textContent()).includes('Case 1 of 10') && (await page.locator('ol.notes li').count()) >= 3);
  await snap(page, 'dossier'); await audit(page, 'dossier'); await aria(page, 'dossier');
  await page.getByRole('button', { name: 'Choose a year' }).click();
  ok('hunt: possible years are listed and none is pre-selected', (await page.locator('input[name=yr]:not(:disabled)').count()) === content.cases[0].c0.length && (await page.locator('input[name=yr]:checked').count()) === 0);
  await snap(page, 'hunt-empty'); await audit(page, 'hunt'); await aria(page, 'hunt');
  // wrong tap: lock with nothing chosen
  await page.getByRole('button', { name: /^Lock/ }).click();
  ok('wrong tap: Lock with no year gives a message and opens no dialog', (await page.locator('#msg').textContent()).includes('Choose a year first') && !(await page.locator('dialog[open]').count()));
  await snap(page, 'hunt-nothing-chosen');
  await pickYear(page, T(0));
  ok('hunt: choosing a year updates the Lock label', (await page.getByRole('button', { name: /^Lock/ }).textContent()).includes(label(T(0))));
  await snap(page, 'hunt-selected');
  await page.getByRole('button', { name: /^Lock/ }).click();
  ok('lock asks for confirmation', await page.getByRole('dialog').isVisible());
  await snap(page, 'lock-confirm'); await audit(page, 'lock-confirm'); await aria(page, 'lock-confirm');
  await page.keyboard.press('Escape'); await page.waitForTimeout(150);
  ok('Escape cancels the lock; nothing happened; focus returns to the Lock button', !(await page.locator('dialog[open]').count()) && (await page.getByRole('button', { name: /^Lock/ }).isVisible()));
  // Evidence + reveal with confirm, Deep clue on case 1
  await page.getByRole('button', { name: /^Evidence$/ }).click();
  await snap(page, 'evidence'); await audit(page, 'evidence'); await aria(page, 'evidence');
  const deepIdx = await page.locator('li.clue').evaluateAll(els => els.findIndex(e => /Deep clue/.test(e.textContent)));
  await page.locator('button[data-action=reveal]').nth(deepIdx).click();
  ok('spend is confirmed with the cost and what is left', /Costs? 2 Insight|costs 2 Insight/.test(await page.getByRole('dialog').textContent()) && (await page.getByRole('dialog').textContent()).includes('6 left'));
  await snap(page, 'reveal-confirm');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click(); await page.waitForTimeout(100);
  ok('cancel spends nothing', (await insight(page)) === 8);
  await page.locator('button[data-action=reveal]').nth(deepIdx).click(); await page.getByRole('dialog').getByRole('button', { name: /^Reveal for/ }).click(); await page.waitForTimeout(150);
  ok('reveal charges 2, once', (await insight(page)) === 6);
  await snap(page, 'evidence-revealed');
  await page.getByRole('button', { name: 'Back to the years' }).click();
  await lockFlow(page, T(0));
  ok('result: solved, answer shown, focus on the answer', (await h1(page)) === String(T(0)) && (await focusedId(page)) === 'h');
  await snap(page, 'result-solved'); await audit(page, 'result-solved'); await aria(page, 'result');
  await page.getByRole('button', { name: /^Next case/ }).click();
  // case 2 deep, case 3 with a crash before save
  await page.getByRole('button', { name: 'Choose a year' }).click();
  await reveal(page, 1, 2);
  ok('case 2 spent Insight', (await insight(page)) <= 7);
  await lockFlow(page, T(1)); await page.getByRole('button', { name: /^Next case/ }).click();
  // case 3: crash before save during a purchase
  await page.getByRole('button', { name: 'Choose a year' }).click();
  const before3 = await insight(page);
  await page.getByRole('button', { name: /^Evidence$/ }).click();
  await page.getByRole('button', { name: 'Arm crash before next save' }).click();
  await page.locator('button[data-action=reveal]').first().click(); await page.getByRole('dialog').getByRole('button', { name: /^Reveal for/ }).click(); await page.waitForTimeout(150);
  ok('crash before save: told nothing was charged', (await page.locator('.msg').first().textContent()).includes('Nothing was charged') && (await insight(page)) === before3);
  await snap(page, 'save-failed');
  await page.reload(); await page.waitForTimeout(700);
  ok('reload mid-case: resume banner, same Insight, same case', (await page.locator('#banner').textContent()).includes('Welcome back') && (await insight(page)) === before3);
  await snap(page, 'resume-trail');
  await page.getByRole('button', { name: /^Continue case 3/ }).click();
  await page.getByRole('button', { name: 'Choose a year' }).click();
  await page.getByRole('button', { name: /^Evidence$/ }).click();
  await page.locator('button[data-action=reveal]').first().click(); await page.getByRole('dialog').getByRole('button', { name: /^Reveal for/ }).click(); await page.waitForTimeout(150);
  ok('retry charges once', (await insight(page)) === before3 - 1);
  await page.getByRole('button', { name: 'Back to the years' }).click();
  await lockFlow(page, T(2)); await page.getByRole('button', { name: /^Next case/ }).click();
  // case 4 free, case 5 miss
  await page.getByRole('button', { name: 'Choose a year' }).click(); await lockFlow(page, T(3)); await page.getByRole('button', { name: /^Next case/ }).click();
  await page.getByRole('button', { name: 'Choose a year' }).click();
  const wrong5 = content.cases[4].c0.find(y => y !== T(4));
  await lockFlow(page, wrong5);
  ok('miss: shown as missed with the answer; day continues', /missed/i.test(await page.locator('.result').textContent()) && (await h1(page)) === String(T(4)));
  await snap(page, 'result-missed'); await audit(page, 'result-missed');
  await page.getByRole('button', { name: /^The world around/ }).click();
  ok('World Reveal entry opens and Back returns', (await h1(page)).includes('World Reveal'));
  await snap(page, 'world-entry'); await audit(page, 'world-entry');
  await page.getByRole('button', { name: 'Back' }).click(); await page.waitForTimeout(150);
  ok('back from World Reveal returns to the result', (await h1(page)) === String(T(4)));
  await page.getByRole('button', { name: /^Next case/ }).click();
  // 6 free, 7 8 9 nudge, 10 zero
  await page.getByRole('button', { name: 'Choose a year' }).click(); await lockFlow(page, T(5)); await page.getByRole('button', { name: /^Next case/ }).click();
  for (const i of [6, 7, 8]) {
    await page.getByRole('button', { name: 'Choose a year' }).click();
    await page.getByRole('button', { name: /^Evidence$/ }).click(); await page.locator('button[data-action=reveal]').first().click();
    await page.getByRole('dialog').getByRole('button', { name: /^Reveal for/ }).click(); await page.waitForTimeout(120);
    await page.getByRole('button', { name: 'Back to the years' }).click();
    await lockFlow(page, T(i)); await page.getByRole('button', { name: /^Next case/ }).click();
  }
  ok('last Insight spent on case 9', true);
  await page.getByRole('button', { name: 'Choose a year' }).click();
  ok('zero Insight: bank shows 0 and says so', (await insight(page)) === 0);
  await page.getByRole('button', { name: /^Evidence$/ }).click();
  ok('zero Insight: clue buttons disabled with a reason', (await page.locator('button[data-action=reveal]:not([disabled])').count()) === 0 && (await page.locator('body').textContent()).includes('no Insight left'));
  await snap(page, 'zero-insight'); await audit(page, 'zero-insight'); await aria(page, 'zero-insight');
  await page.getByRole('button', { name: 'Back to the years' }).click();
  await lockFlow(page, T(9));
  await page.getByRole('button', { name: /^See your day/ }).click(); await page.waitForTimeout(200);
  const fin = await h1(page);
  ok('finish: 9 of 10 solved, 0 Insight left', fin.startsWith('9 of 10 solved') && fin.includes('0 Insight left'), fin);
  ok('finish share text has no answers', !/(1969|1893|1565|1919|1799|1977|1325|1446|2 CE)/.test(await page.locator('#share').textContent()));
  await snap(page, 'finish'); await audit(page, 'finish'); await aria(page, 'finish');
  await page.getByRole('button', { name: /World Reveal/ }).click(); await snap(page, 'world-all'); await audit(page, 'world-all');
  await page.getByRole('button', { name: 'Back' }).click();
  await page.reload(); await page.waitForTimeout(700);
  await page.getByRole('button', { name: 'Archive' }).click();
  ok('archive lists the finished day', (await page.locator('main').textContent()).includes('9 of 10 solved'));
  await snap(page, 'archive'); await audit(page, 'archive'); await aria(page, 'archive');
  ok('A: no page errors', page.errors.length === 0, page.errors.join(' | '));
  await page.ctx.close();
}

// ======================= B. keyboard only =======================
console.log('B. keyboard');
{
  const page = await newPage();
  await page.keyboard.press('Tab');
  ok('skip link is first in tab order', (await page.evaluate(() => document.activeElement.className)) === 'skip');
  await page.getByRole('button', { name: 'Start case 1' }).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(150);
  ok('keyboard: Enter starts the case; focus on title', (await focusedId(page)) === 'h');
  await page.getByRole('button', { name: 'Choose a year' }).focus(); await page.keyboard.press('Space'); await page.waitForTimeout(150);
  await page.locator('input[name=yr]:not(:disabled)').first().focus();
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(100);
  ok('keyboard: arrow keys move the radio selection', (await page.locator('input[name=yr]:checked').count()) === 1);
  await page.getByRole('button', { name: /^Lock/ }).focus(); await page.keyboard.press('Enter'); await page.waitForTimeout(150);
  ok('keyboard: dialog traps focus on its first control', (await page.evaluate(() => document.activeElement.closest('dialog') !== null)));
  await page.keyboard.press('Tab');
  ok('keyboard: focus stays inside the open dialog', (await page.evaluate(() => document.activeElement.closest('dialog') !== null)));
  await page.keyboard.press('Escape');
  await page.locator('details.precise > summary').focus(); await page.keyboard.press('Enter');
  await page.locator('#ty').fill('1999'); await page.getByRole('button', { name: 'Use this year' }).click();
  ok('typed precision path: an out-of-play year is refused with a message', (await page.locator('#tymsg').textContent()).includes('not a year in play'));
  await page.locator('#ty').fill(String(T(0))); await page.getByRole('button', { name: 'Use this year' }).click();
  ok('typed precision path: a valid year selects it', (await page.locator('input[name=yr]:checked').inputValue()) === String(T(0)));
  const tabs = []; for (let i = 0; i < 40; i++) { await page.keyboard.press('Tab'); tabs.push(await page.evaluate(() => { const e = document.activeElement; const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return { vis: r.width > 0, ring: s.outlineStyle !== 'none' || (e.closest('label.layer') && getComputedStyle(e.closest('label.layer')).outlineStyle !== 'none') }; })); }
  ok('keyboard: every focus stop is visible on screen', tabs.every(t => t.vis));
  await page.ctx.close();
}

// ======================= C. states =======================
console.log('C. states');
{
  // loading
  const ctx = await newCtx(); const p = await ctx.newPage();
  await p.addInitScript(() => localStorage.setItem('timehunt:settings', JSON.stringify({ onboarded: true, textScale: 100, confirmSpend: true })));
  await p.route('**/data/daily-pack-draft.json', async r => { await new Promise(res => setTimeout(res, 1500)); r.continue(); });
  await p.goto(BASE); await p.waitForTimeout(400);
  ok('loading: busy state with text', (await p.locator('main').getAttribute('aria-busy')) === 'true' && (await p.locator('main').textContent()).includes('Loading'));
  await snap(p, 'loading'); await audit(p, 'loading');
  await p.waitForTimeout(1600); ok('loading ends', (await p.locator('main').getAttribute('aria-busy')) === 'false');
  // offline
  await ctx.setOffline(true); await p.waitForTimeout(300);
  ok('offline: banner says play continues', (await p.locator('#banner').textContent()).includes('offline'));
  await p.getByRole('button', { name: 'Start case 1' }).click(); await p.getByRole('button', { name: 'Choose a year' }).click(); await pickYear(p, T(0));
  ok('offline: play works', (await p.locator('input[name=yr]:checked').count()) === 1);
  await snap(p, 'offline'); await audit(p, 'offline');
  await ctx.setOffline(false); await ctx.close();
  // invalid pack
  const c2 = await newCtx(); const p2 = await c2.newPage();
  await p2.route('**/data/daily-pack-draft.json', async r => { const j = JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8')); j.cases.length = 9; r.fulfill({ contentType: 'application/json', body: JSON.stringify(j) }); });
  await p2.goto(BASE); await p2.waitForTimeout(700);
  ok('invalid pack: refused, nothing started, no nav', (await p2.locator('main').textContent()).includes('failed validation') && (await p2.locator('#nav button').count()) === 0);
  await snap(p2, 'invalid-pack'); await audit(p2, 'invalid-pack'); await c2.close();
  // held record
  const c3 = await newCtx(); const p3 = await c3.newPage();
  await p3.addInitScript(() => { localStorage.setItem('timehunt:settings', JSON.stringify({ onboarded: true })); localStorage.setItem('timehunt:v1:daily:daily-draft-001', '{broken'); });
  await p3.goto(BASE); await p3.waitForTimeout(700);
  ok('held saved game: explained, with one explicit action', (await h1(p3)) === 'Saved game on hold' && (await p3.getByRole('button', { name: 'Start a new expedition' }).count()) === 1);
  await snap(p3, 'held'); await audit(p3, 'held'); await c3.close();
}

// ======================= D. settings, practice =======================
console.log('D. settings and practice');
{
  const page = await newPage();
  await page.getByRole('button', { name: 'Settings' }).click();
  await snap(page, 'settings'); await audit(page, 'settings'); await aria(page, 'settings');
  await page.getByLabel('Largest').check(); await page.waitForTimeout(150);
  ok('settings: text size 200% applies to the whole page', (await page.evaluate(() => getComputedStyle(document.documentElement).fontSize)) === '32px');
  await page.getByLabel('Standard').check();
  await page.getByLabel('Ask before spending Insight').uncheck(); await page.reload(); await page.waitForTimeout(600);
  ok('settings persist across reload', (await page.evaluate(() => JSON.parse(localStorage.getItem('timehunt:settings')).confirmSpend)) === false);
  await page.getByRole('button', { name: 'Practice' }).click();
  await snap(page, 'practice'); await audit(page, 'practice'); await aria(page, 'practice');
  await page.getByRole('button', { name: 'Pick one for me' }).click(); await page.waitForTimeout(200);
  ok('practice: starts one case with 2 Insight', (await page.locator('.hud').textContent()).includes('Insight 2 of 2') && !(await page.locator('.strip').count()));
  await page.getByRole('button', { name: 'Choose a year' }).click();
  await page.getByRole('button', { name: /^Evidence$/ }).click();
  await page.locator('button[data-action=reveal]').first().click(); await page.waitForTimeout(150);
  ok('confirm-off: reveal happens without a dialog', (await insight(page)) <= 1);
  await page.getByRole('button', { name: 'Back to the years' }).click();
  const tgt = await page.evaluate(() => 0);
  const firstLive = await page.locator('input[name=yr]:not(:disabled)').first().inputValue();
  await page.locator('label.layer', { hasText: label(Number(firstLive)) }).first().click(); await page.getByRole('button', { name: /^Lock/ }).click(); await page.getByRole('dialog').getByRole('button', { name: /^Lock/ }).click(); await page.waitForTimeout(200);
  await page.getByRole('button', { name: /^Practice/ }).last().click(); await page.waitForTimeout(250);
  ok('practice: finishing returns to the Practice list', (await h1(page)) === 'Practice');
  await page.getByRole('button', { name: 'Today' }).click(); await page.waitForTimeout(200);
  ok('practice never touched the daily: still 8 Insight, case 1', (await insight(page)) === 8 && (await page.getByRole('button', { name: 'Start case 1' }).count()) === 1);
  await page.getByRole('button', { name: 'Settings' }).click();
  await page.getByRole('button', { name: /Delete saved games/ }).click();
  ok('delete is confirmed first', await page.getByRole('dialog').isVisible());
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  await page.ctx.close();
}

// ======================= E. responsive, text size, long copy, trace variant =======================
console.log('E. responsive');
const widths = [320, 360, 390, 430, 768, 1024];
const resp = [];
for (const w of widths) {
  const ctx = await newCtx({ viewport: { width: w, height: w >= 768 ? 900 : 760 } });
  const page = await ctx.newPage(); await page.addInitScript(() => localStorage.setItem('timehunt:settings', JSON.stringify({ onboarded: true, textScale: 100, confirmSpend: true })));
  await page.goto(BASE); await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Start case 1' }).click(); await page.getByRole('button', { name: 'Choose a year' }).click(); await pickYear(page, T(0));
  const m = await audit(page, `hunt-w${w}`);
  const f = `resp-hunt-w${w}.png`; await page.screenshot({ path: join(OUT, 'screens', f) }); resp.push({ w, f, scrollW: m.scrollW });
  ok(`no horizontal scroll at ${w}px`, m.scrollW <= w, `scrollWidth ${m.scrollW}`);
  await ctx.close();
}
const scales = [100, 130, 160, 200];
const sc = [];
for (const s of scales) {
  const ctx = await newCtx({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage(); await page.addInitScript(s => localStorage.setItem('timehunt:settings', JSON.stringify({ onboarded: true, textScale: s, confirmSpend: true })), s);
  await page.goto(BASE); await page.waitForTimeout(600);
  await page.getByRole('button', { name: 'Start case 1' }).click(); await page.getByRole('button', { name: 'Choose a year' }).click(); await pickYear(page, T(0));
  const m = await audit(page, `hunt-t${s}`);
  const clip = await page.evaluate(() => [...document.querySelectorAll('button, .layer, .band, h1, label')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible').map(e => e.textContent.trim().slice(0, 30)));
  await page.evaluate(() => scrollTo(0, 0)); const f = `text-hunt-${s}.png`; await page.screenshot({ path: join(OUT, 'screens', f) }); sc.push({ s, f });
  ok(`text ${s}%: no horizontal scroll`, m.scrollW <= 390, `scrollWidth ${m.scrollW}`);
  ok(`text ${s}%: the Lock button is still reachable by scrolling`, await page.getByRole('button', { name: /^Lock/ }).isVisible());
  ok(`text ${s}%: nothing clipped`, clip.length === 0, clip.join(' | '));
  await ctx.close();
}
// long copy / translated-label stress
for (const [name, steps] of [['trail', async p => {}], ['hunt', async p => { await p.locator('[data-action=trail-go]').click(); await p.locator('[data-action=to-hunt]').click(); }], ['evidence', async p => { await p.locator('[data-action=trail-go]').click(); await p.locator('[data-action=to-hunt]').click(); await p.locator('[data-action=to-evidence]').click(); }]]) {
  const ctx = await newCtx({ viewport: { width: 360, height: 740 } }); const page = await ctx.newPage();
  await page.addInitScript(() => localStorage.setItem('timehunt:settings', JSON.stringify({ onboarded: true, textScale: 100, confirmSpend: true })));
  await page.goto(BASE + '?pseudo=1'); await page.waitForTimeout(600); await steps(page);
  const m = await audit(page, `pseudo-${name}`);
  const clip = await page.evaluate(() => [...document.querySelectorAll('button, .layer, .band, label')].filter(e => e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible').map(e => e.textContent.trim().slice(0, 30)));
  await page.screenshot({ path: join(OUT, 'screens', `pseudo-${name}.png`) });
  ok(`pseudo-locale (+40% long, accented) ${name}: no horizontal scroll`, m.scrollW <= 360, `scrollWidth ${m.scrollW}`);
  ok(`pseudo-locale ${name}: nothing clipped`, clip.length === 0, clip.join(' | '));
  await ctx.close();
}
// trace variant sheet
{
  const page = await newPage({}, BASE + '?variant=trace');
  await page.getByRole('button', { name: 'Start case 1' }).click(); await page.getByRole('button', { name: 'Choose a year' }).click(); await page.getByRole('button', { name: /^Evidence$/ }).click();
  ok('Trace variant: sheet offers Trace with a price', await page.getByRole('button', { name: /Trace for 2 Insight/ }).isVisible());
  await page.getByLabel('Compare with year').selectOption('1968'); await page.getByRole('button', { name: /Trace for/ }).click(); await page.waitForTimeout(150);
  ok('Trace variant: result is stated in words', (await page.locator('body').textContent()).includes('1968: the answer is later'));
  await snap(page, 'trace-variant'); await audit(page, 'trace-variant'); await page.ctx.close();
}
// minimum rendered font size across every screen at 100%
{
  const page = await newPage();
  let minSize = 99, where = '';
  const probe = async name => { const r = await page.evaluate(() => { let m = 99, w = ''; const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = walker.nextNode())) { if (!n.textContent.trim()) continue; const el = n.parentElement; const cs = getComputedStyle(el); if (cs.display === 'none' || el.closest('.sr, .skip, .debug')) continue; const sz = parseFloat(cs.fontSize); if (sz < m) { m = sz; w = n.textContent.trim().slice(0, 30); } } return { m, w }; }); if (r.m < minSize) { minSize = r.m; where = name + ': ' + r.w; } };
  await probe('trail');
  await page.locator('[data-action=trail-go]').click(); await probe('dossier');
  await page.locator('[data-action=to-hunt]').click(); await probe('hunt');
  await page.locator('[data-action=to-evidence]').click(); await probe('evidence');
  await page.getByRole('button', { name: /^Back to the years/ }).click(); await pickYear(page, T(0)); await page.getByRole('button', { name: /^Lock/ }).click(); await page.getByRole('dialog').getByRole('button', { name: /^Lock/ }).click(); await page.waitForTimeout(200); await probe('result');
  ok('no rendered text under 14 px on trail, dossier, hunt, evidence or result', minSize >= 14, `${minSize}px at ${where}`);
  await page.ctx.close();
}
// tabular numerals
{
  const page = await newPage();
  await page.getByRole('button', { name: 'Start case 1' }).click(); await page.getByRole('button', { name: 'Choose a year' }).click();
  const tn = await page.evaluate(() => getComputedStyle(document.querySelector('.layer .y')).fontVariantNumeric);
  ok('year numerals are tabular', tn.includes('tabular-nums'), tn);
  await page.ctx.close();
}

await browser.close(); srv.close();
// ---------- report ----------
const seriousAxe = axeResults.flatMap(a => a.violations.map(v => ({ screen: a.screen, ...v })));
const report = { generated: new Date().toISOString().slice(0, 10), checks, passed: checks.filter(c => c.pass).length, total: checks.length, axe: { screens: axeResults.length, violations: seriousAxe }, reach, targetsUnder44: targets, overflow, responsive: resp, textScales: sc, screenshots: shots };
writeFileSync(join(OUT, 'e2e-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`\nE2E ${report.passed}/${report.total} checks passed. axe: ${seriousAxe.length} violation entries over ${axeResults.length} screens. overflow: ${overflow.length}. screens with targets under 44px: ${targets.length}`);
for (const v of seriousAxe.slice(0, 20)) console.log('  axe', v.screen, v.id, v.impact, v.target, '|', v.why);
