// Stage 9 reveal prototype: behaviour, citations, skip and resume, reduced motion, large text, accessibility. Real Chromium.
// Usage: node scripts/e2e-reveal.mjs   (npm install once for axe-core)
import { createRequire } from 'node:module';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { start } from './serve.mjs';
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', '..', 'docs', 'reveal'); mkdirSync(join(OUT, 'screens'), { recursive: true });
const AXE = join(here, '..', 'node_modules', 'axe-core', 'axe.min.js');
const srv = await start(5194); const BASE = 'http://127.0.0.1:5194/reveal/index.html';
const checks = [], axeAll = [], shots = [], overflow = [];
const ok = (n, c, d = '') => { checks.push({ name: n, pass: !!c, detail: d }); if (!c) console.log('  FAIL:', n, d); };
const browser = await chromium.launch();
async function open(hash = 'hub', { reduced = false, scale = 100, w = 390, h = 844 } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: reduced ? 'reduce' : 'no-preference' });
  await ctx.addInitScript(s => { if (!localStorage.getItem('tr:prefs')) localStorage.setItem('tr:prefs', JSON.stringify({ reduce: false, scale: s })); }, scale);
  const p = await ctx.newPage(); p.ctx = ctx; p.errors = []; p.on('pageerror', e => p.errors.push(String(e))); p.on('console', m => { if (m.type() === 'error') p.errors.push(m.text()); });
  await p.goto(BASE + '#' + hash); await p.waitForFunction(() => window.__ready); await p.waitForTimeout(450); return p;
}
const h1 = p => p.locator('#h').textContent().then(s => s.trim());
const beat = (p, story, i) => p.evaluate(([s, i]) => { location.hash = `#s.${s}.${i}`; }, [story, i]).then(() => p.reload()).then(() => p.waitForFunction(() => window.__ready)).then(() => p.waitForTimeout(350));
const next = async p => { await p.locator('#next').click(); await p.waitForTimeout(250); };
async function audit(p, name) { await p.addScriptTag({ path: AXE }); const v = await p.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } })).violations.map(x => ({ id: x.id, impact: x.impact, target: x.nodes[0].target.join(' '), why: x.nodes[0].failureSummary.replace(/\s+/g, ' ').slice(0, 180) }))); axeAll.push({ screen: name, v }); return v; }
async function shot(p, name) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(80); await p.screenshot({ path: join(OUT, 'screens', name + '.png') }); shots.push(name); }
const setRange = (p, sel, v) => p.locator(sel).evaluate((e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, String(v));
const srcCheck = async (p, name) => { const n = await p.locator('details.src summary').count(); if (!n) return ok(`citations: ${name} has a sources disclosure`, false); await p.locator('details.src summary').first().click(); const links = await p.locator('details.src[open] a').evaluateAll(a => a.map(x => x.href)); const labels = await p.locator('details.src[open] .note').allTextContents(); ok(`citations: ${name} lists linked sources with opened or not opened`, links.length >= 1 && links.every(l => l.startsWith('https://')) && labels.every(t => /Opened|Not opened/.test(t)), `${links.length} links`); };

// ================= hub =================
console.log('hub');
{
  const p = await open('hub');
  ok('hub: six stories and a finale, each with a form named', (await p.locator('.hubcard').count()) === 7 && (await p.locator('.hubcard .tag').count()) >= 7);
  ok('hub: page loads without errors', p.errors.length === 0, p.errors.join('|')); await shot(p, '01-hub'); await audit(p, 'hub'); await p.ctx.close();
}
// ================= Rosetta =================
console.log('rosetta');
{
  const p = await open('hub');
  await p.locator('[data-act=start][data-id=rosetta]').click(); await p.waitForTimeout(250);
  ok('entry transition: the found year fills the screen first (full motion)', await p.locator('#entry').isVisible() && (await p.locator('#entry .y').textContent()) === '1799');
  await shot(p, '02-entry');
  await p.keyboard.press('Escape'); await p.waitForTimeout(150);
  ok('the entry is skippable with Escape, and the story is underneath', !(await p.locator('#entry').isVisible()) && (await h1(p)) === 'Found, not made');
  await audit(p, 'rosetta-text'); await srcCheck(p, 'rosetta beat 1'); await next(p);
  ok('inspect: the three registers are drawn with their line counts', (await p.locator('.band').count()) === 3 && (await p.locator('.band i').count()) === 14 + 32 + 54);
  await p.locator('.band[data-id=grk]').click(); ok('inspect: tapping Greek shows 54 lines and the 1803 translation', (await p.locator('#detail').textContent()).includes('54 lines') && (await p.locator('#detail').textContent()).includes('1803'));
  await p.locator('.band[data-id=hier]').focus(); await p.keyboard.press('Enter'); ok('inspect: keyboard Enter selects a register', (await p.locator('#detail').textContent()).includes('last 14 lines'));
  await shot(p, '03-inspect'); await audit(p, 'inspect'); await srcCheck(p, 'inspect'); await next(p);
  await setRange(p, '#yr', 1803); ok('time slider: 1803 shows a complete Greek translation, Egyptian not yet read', (await p.locator('#status').textContent()).includes('Greek text has a complete translation') && (await p.locator('.band.read').count()) === 1);
  await setRange(p, '#yr', 1822); ok('time slider: 1822 shows the Egyptian scripts transliterated', (await p.locator('#status').textContent()).includes('transliterated') && (await p.locator('.band.read').count()) === 3);
  await p.locator('#yr').focus(); await p.keyboard.press('ArrowLeft'); ok('time slider is keyboard operable', Number(await p.locator('#yr').inputValue()) === 1821);
  await shot(p, '04-stonetime'); await audit(p, 'stonetime'); await next(p);
  ok('compare: four accounts, none confirmed day', (await p.locator('#cl li').count()) === 4);
  await p.locator('#only').check(); ok('compare: filtering to opened pages leaves one account and says no day is given', (await p.locator('#cl li').count()) === 1 && (await p.locator('#sum').textContent()).includes('no account shown gives one'));
  await shot(p, '05-compare'); await audit(p, 'compare'); await next(p);
  ok('contested ownership is recorded, not hidden: the 2003 call to return the stone is cited and no side is taken', (await p.locator('body').textContent()).includes('Zahi Hawass') && (await p.locator('body').textContent()).includes('does not take a side')); await srcCheck(p, 'whose is it'); await next(p);
  ok('takeaway beat closes the story with the three dates', (await p.locator('body').textContent()).includes('196 BCE') && (await p.locator('body').textContent()).includes('1822'));
  await p.locator('#next').click(); await p.waitForTimeout(250); ok('Finish returns to the hub with the story marked Finished', (await p.locator('#h-rosetta').locator('xpath=ancestor::section').textContent()).includes('Finished'));
  ok('rosetta: no page errors', p.errors.length === 0, p.errors.join('|')); await p.ctx.close();
}
// ================= smallpox =================
console.log('smallpox');
{
  const p = await open('s.smallpox.1');
  await setRange(p, '#yr', 1975); const t = await p.locator('#st').textContent(); ok('chart: in 1975 Asia ends, Africa has not, South America already did', /Asia[\s\S]*Ended this year/.test(t) && /Africa[\s\S]*Not yet ended/.test(t) && /South America[\s\S]*Ended earlier/.test(t));
  await setRange(p, '#yr', 1980); ok('chart: in 1980 all three have ended', (await p.locator('#st').textContent()).split('Ended earlier').length === 4);
  await p.locator('#yr').focus(); ok('chart slider has a spoken value', (await p.locator('#yr').getAttribute('aria-valuetext')).includes('Africa'));
  await shot(p, '06-smallpox'); await audit(p, 'smallpox'); await srcCheck(p, 'smallpox chart'); await next(p);
  await p.locator('[data-k=own]').click(); ok('tap a bar part: the two-thirds fact', (await p.locator('#d').textContent()).includes('Two thirds'));
  await shot(p, '07-isep'); await audit(p, 'isep'); await next(p);
  await p.locator('.btn[data-id=natural]').click(); ok('definitions: the natural-case question gives October 1977', (await p.locator('#d').textContent()).includes('October 1977'));
  await p.locator('.btn[data-id=lab]').click(); ok('definitions: the any-kind question gives 1978', (await p.locator('#d').textContent()).includes('1978'));
  await shot(p, '08-defs'); await audit(p, 'defs'); await p.ctx.close();
}
// ================= galleon =================
console.log('galleon');
{
  const p = await open('s.galleon.1');
  await setRange(p, '#d', 129); ok('route: the end of the return leg is 8 October 1565, day 129 of 129', (await p.locator('#when').textContent()) === '8 October 1565' && (await p.locator('#sum').textContent()).includes('Day 129 of 129'));
  await setRange(p, '#d', 0); ok('route: the start is 1 June 1565', (await p.locator('#when').textContent()) === '1 June 1565');
  await p.locator('[data-leg=out]').click(); ok('route: the outbound leg is 84 days', (await p.locator('#d').getAttribute('max')) === '84'); await setRange(p, '#d', 84); ok('route: outbound ends 13 February 1565', (await p.locator('#when').textContent()) === '13 February 1565');
  ok('route: the ship is drawn on the path', await p.evaluate(() => { const s = document.getElementById('ship'); return Number(s.getAttribute('cx')) > 0; }));
  await shot(p, '09-route'); await audit(p, 'route'); await srcCheck(p, 'route'); await next(p);
  await p.locator('[data-i="1"]').click(); ok('span: the 1571 marker says the capital moved to Manila', (await p.locator('#d').textContent()).includes('Manila'));
  ok('span: 250 years is computed', (await p.locator('body').textContent()).includes('250 years')); await shot(p, '10-span'); await audit(p, 'span'); await p.ctx.close();
}
// ================= hangul =================
console.log('hangul');
{
  const p = await open('s.hangul.1');
  await setRange(p, '#k', 1); ok('calendar: lunar day 1 is 30 December 1443', (await p.locator('#o').textContent()).includes('30 December 1443'));
  await setRange(p, '#k', 3); ok('calendar: lunar day 3 is 1 January 1444 and the year has changed', (await p.locator('#o').textContent()).includes('1 January 1444') && (await p.locator('#y44').getAttribute('class')).includes('on') && !(await p.locator('#y43').getAttribute('class')).includes('on'));
  await setRange(p, '#k', 30); ok('calendar: lunar day 30 is 28 January 1444', (await p.locator('#o').textContent()).includes('28 January 1444'));
  await shot(p, '11-calendar'); await audit(p, 'calendar'); await next(p);
  ok('lanes: six events across two lanes', (await p.locator('#list li').count()) === 6);
  await p.locator('[data-lane=eu]').click(); ok('lanes: filtering to Europe leaves Varna only', (await p.locator('#list li').count()) === 1);
  await p.locator('[data-n]').first().click(); ok('lanes: tapping an event gives its date, its precision and its sources', (await p.locator('#d').textContent()).includes('10 November 1444') && (await p.locator('#d').textContent()).includes('The day is known') && (await p.locator('#d details.src').count()) === 1);
  await p.locator('[data-lane=all]').click(); await p.locator('#list [data-n]').nth(4).click(); ok('lanes: a month-only event says only the month is known', (await p.locator('#d').textContent()).includes('Only the month is known'));
  await shot(p, '12-lanes-hangul'); await audit(p, 'lanes'); await p.ctx.close();
}
// ================= road (coexistence) and 1969 (bias correction) =================
console.log('road and 1969');
{
  const p = await open('s.road.1');
  await p.locator('#list [data-n]').evaluateAll(b => b.length); const uncertain = p.locator('#list li', { hasText: 'Tenochtitlan' }).locator('button');
  await uncertain.click(); ok('uncertain events are flagged "uncertain" with a note and drawn dashed', (await p.locator('#d .tag').textContent()).includes('uncertain') && (await p.locator('#chart rect[stroke-dasharray]').count()) >= 1);
  await p.locator('[data-lane=en]').click(); ok('filter: England has two events', (await p.locator('#list li').count()) === 2);
  await shot(p, '13-lanes-road'); await audit(p, 'lanes-road'); await next(p);
  ok('relation beat states the category honestly (simultaneous, no link claimed)', (await p.locator('.relation').textContent()).includes('Simultaneous. No link is claimed.') && (await p.locator('.relation').textContent()).includes('A source that says so'));
  await shot(p, '14-relation'); await audit(p, 'relation');
  await p.goto(BASE + '#s.y1969.1'); await p.reload(); await p.waitForFunction(() => window.__ready); await p.waitForTimeout(300);
  ok('1969: the Algiers festival is drawn as a range in its own lane', (await p.locator('#list li', { hasText: 'Algiers' }).count()) === 1 && (await p.locator('[data-lane=afr]').count()) === 1);
  await p.locator('#list li', { hasText: 'Algiers' }).locator('button').click(); ok('1969: the festival card gives the source wording and says the end date is counted', (await p.locator('#d').textContent()).includes('eight days') && (await p.locator('#d').textContent()).includes('A range of days'));
  await next(p); ok('1969: the closing beat names the limit of the pack', (await p.locator('.relation').textContent()).includes('limit of this pack'));
  await shot(p, '15-bias'); await p.ctx.close();
}
// ================= finale =================
console.log('finale');
{
  const p = await open('finale.0');
  ok('finale: ten marks, oldest first, with the gaps between them', (await p.locator('#core [data-c]').count()) === 10 && (await p.locator('#core').textContent()).includes('1,323 years') && (await p.locator('#core').textContent()).includes('the same year'));
  await p.locator('[data-c=case-05]').click(); ok('finale: a mark with a story links to it', await p.locator('#d a[data-open=rosetta]').isVisible());
  await shot(p, '16-finale-marks'); await audit(p, 'finale-marks'); await next(p);
  ok('finale: names the pair that shares a year without claiming a link', (await p.locator('.pair').textContent()).includes('1977 appears twice'));
  await p.locator('#merge').click(); await p.waitForTimeout(250);
  ok('finale: bringing them together opens 1977 as lanes from five events and four themes', (await p.locator('#lanes77').isVisible()) && (await p.locator('#lanes77 #list li').count()) === 5 && (await p.locator('#lanes77 [data-lane]').count()) === 5);
  ok('finale: the relation is labelled Simultaneous, no link claimed', (await p.locator('#lanes77 .relation').textContent()).includes('Simultaneous. No link is claimed.'));
  await p.locator('#lanes77 [data-lane=afr]').click(); ok('finale: the African festival of January 1977 is in the cross-case view', (await p.locator('#lanes77 #list').textContent()).includes('FESTAC 77'));
  await p.locator('#lanes77 [data-lane=all]').click(); await shot(p, '17-finale-1977'); await audit(p, 'finale-1977'); await next(p);
  ok('finale: a second connection, the same coast 645 years apart, with its category', (await h1(p)) === 'The same coast, 645 years apart' && (await p.locator('.relation').textContent()).includes('Same place') && (await p.locator('.relation').textContent()).includes('No link is claimed'));
  await p.locator('button[data-i="1"]').click(); ok('place: Merca 1977 names the town, its recovery and the polio work, with sources', (await p.locator('#d').textContent()).includes('southwest of the capital') && (await p.locator('#d').textContent()).includes('polio') && (await p.locator('#d details.src').count()) === 1);
  await p.locator('button[data-i="0"]').click(); ok('place: Mogadishu 1332 is shown at the zenith of its prosperity', (await p.locator('#d').textContent()).includes('zenith of its prosperity'));
  await shot(p, '17b-finale-place'); await audit(p, 'finale-place'); await next(p);
  ok('finale: a third connection of a different kind: a documented naming, over 205 years from finding to launch', (await h1(p)) === 'A name that travelled' && (await p.locator('.relation').textContent()).includes('Named after') && (await p.locator('body').textContent()).includes('205 years') && (await p.locator('.relation').textContent()).includes('someone chose the name'));
  await p.locator('button[data-i="2"]').click(); ok('name: the probe and the lander are explained with sources', (await p.locator('#d').textContent()).includes('Philae obelisk') && (await p.locator('#d').textContent()).includes('2 March 2004') && (await p.locator('#d details.src').count()) === 1);
  await shot(p, '17c-finale-name'); await audit(p, 'finale-name'); await next(p);
  const cov = await p.locator('main').textContent(); ok('finale coverage: computed numbers (5 of 10 modern; 57% Western anchors; Asia 5)', cov.includes('5 of 10 answers fall between 1893 and 1977') && /Europe and North America supply 5\d%/.test(cov) && /Asia[\s\S]{0,20}5/.test(cov));
  await shot(p, '18-finale-coverage'); await audit(p, 'finale-coverage'); await next(p); ok('finale ends with a takeaway about selection', (await p.locator('body').textContent()).includes('A selection, not a sample'));
  await p.ctx.close();
}
// ================= skip and resume =================
console.log('skip and resume');
{
  const p = await open('hub'); await p.locator('[data-act=start][data-id=smallpox]').click(); await p.waitForTimeout(1000); await p.keyboard.press('Escape'); await next(p); await next(p);
  ok('progress is on beat 3', (await p.evaluate(() => window.__beat.i)) === 2);
  await p.reload(); await p.waitForFunction(() => window.__ready); await p.goto(BASE + '#hub'); await p.reload(); await p.waitForFunction(() => window.__ready); await p.waitForTimeout(300);
  ok('hub offers Resume at beat 3 after a reload', await p.locator('[data-act=resume][data-id=smallpox]').isVisible() && (await p.locator('[data-act=resume][data-id=smallpox]').textContent()).includes('beat 3'));
  await p.locator('[data-act=resume][data-id=smallpox]').click(); await p.waitForTimeout(300); ok('Resume returns to beat 3, with no entry transition', (await p.evaluate(() => window.__beat.i)) === 2 && !(await p.locator('#entry').isVisible()));
  await p.locator('#skiptake').click(); await p.waitForTimeout(200); ok('Skip to the end lands on the last beat', (await p.evaluate(() => window.__beat.i)) === 4);
  await p.locator('#skipstory').click(); await p.waitForTimeout(250); ok('Skip story returns to the hub marked Skipped', (await p.locator('#h-smallpox').locator('xpath=ancestor::section').textContent()).includes('Skipped'));
  await p.locator('#reset').click(); ok('Reset progress clears every status', (await p.locator('.hubcard', { hasText: 'Not started' }).count()) === 7); await p.ctx.close();
}
// ================= reduced motion =================
console.log('reduced motion');
{
  const p = await open('hub', { reduced: true }); await p.locator('[data-act=start][data-id=rosetta]').click(); await p.waitForTimeout(300);
  ok('reduced motion: no entry overlay; the story is shown at once', !(await p.locator('#entry').isVisible()) && (await h1(p)) === 'Found, not made');
  await p.goto(BASE + '#s.galleon.1'); await p.reload(); await p.waitForFunction(() => window.__ready); ok('reduced motion: route playback is replaced by the slider', !(await p.locator('#play').isVisible()));
  await p.goto(BASE + '#finale.1'); await p.reload(); await p.waitForFunction(() => window.__ready); await p.locator('#merge').click(); ok('reduced motion: the 1977 cross-case view opens at once with the same content', (await p.locator('#lanes77 #list li').count()) === 5);
  await p.ctx.close();
  const q = await open('hub'); await q.locator('[data-act=start][data-id=rosetta]').click(); await q.waitForTimeout(250); ok('full motion: the entry overlay is shown (comparison)', await q.locator('#entry').isVisible()); await q.ctx.close();
}
// ================= large text and widths =================
console.log('layout');
const hashes = [];
for (const [id, n] of [['rosetta', 6], ['smallpox', 5], ['galleon', 4], ['hangul', 4], ['road', 3], ['y1969', 3]]) for (let i = 0; i < n; i++) hashes.push(`s.${id}.${i}`);
for (let i = 0; i < 6; i++) hashes.push(`finale.${i}`);
for (const [w, scale] of [[320, 100], [390, 100], [390, 200]]) {
  const p = await open('hub', { w, h: 760, scale });
  for (const h of hashes) { await p.goto(BASE + '#' + h); await p.reload(); await p.waitForFunction(() => window.__ready); await p.waitForTimeout(120); const o = await p.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: innerWidth })); if (o.sw > o.vw) overflow.push({ w, scale, h, ...o }); }
  await p.ctx.close();
}
ok(`no horizontal scroll on any of ${hashes.length} beats at 320 px, 390 px and 390 px with 200% text`, overflow.length === 0, JSON.stringify(overflow.slice(0, 4)));
// ================= actions count =================
{
  const kinds = new Set();
  const p = await open('hub'); await p.goto(BASE + '#s.rosetta.1'); await p.reload(); await p.waitForFunction(() => window.__ready);
  const grab = async () => (await p.evaluate(() => (window.__events || []).map(e => e.e))).forEach(k => kinds.add(k));
  await p.locator('.band').first().click(); await next(p); await setRange(p, '#yr', 1810); await next(p); await p.locator('#only').check(); await grab();
  await p.goto(BASE + '#s.galleon.1'); await p.reload(); await p.waitForFunction(() => window.__ready); await setRange(p, '#d', 50); await p.locator('[data-leg=out]').click(); await grab();
  await p.goto(BASE + '#s.hangul.1'); await p.reload(); await p.waitForFunction(() => window.__ready); await setRange(p, '#k', 5); await grab();
  ok('at least four distinct user actions across evidence types were exercised', ['inspect', 'stone-year', 'compare-filter', 'route-day', 'leg', 'lunar-day'].every(k => kinds.has(k)), [...kinds].join(','));
  await p.ctx.close();
}
await browser.close(); srv.close();
const axeV = axeAll.flatMap(a => a.v.map(v => ({ screen: a.screen, ...v })));
writeFileSync(join(OUT, 'e2e-report.json'), JSON.stringify({ generated: new Date().toISOString().slice(0, 10), passed: checks.filter(c => c.pass).length, total: checks.length, checks, axe: { screens: axeAll.length, violations: axeV }, overflow, screenshots: shots }, null, 2) + '\n');
console.log(`\nREVEAL E2E ${checks.filter(c => c.pass).length}/${checks.length} passed; axe: ${axeV.length} violations on ${axeAll.length} screens; overflow: ${overflow.length}`);
for (const v of axeV.slice(0, 12)) console.log('  axe', v.screen, v.id, v.impact, v.target, '|', v.why);
