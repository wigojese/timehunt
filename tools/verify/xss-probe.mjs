// Injection probe (Stage 10, threat T-11): puts a hostile payload into the free-text fields of the pack, loads every page,
// clicks through the controls, and fails if any payload executed or became markup.
// Usage: node tools/verify/xss-probe.mjs        (PLAYWRIGHT_MODULE overrides the Playwright path)
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const APP = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'app');
const { start } = await import(join(APP, 'scripts', 'serve.mjs'));
const srv = await start(5199);

const PAY = '<img src=x onerror="window.__pwned=(window.__pwned||0)+1"><script>window.__pwned=99</script>';
const raw = JSON.parse(readFileSync(join(APP, 'data', 'daily-pack-draft.json'), 'utf8'));
// Keys whose values drive logic or must stay valid for the pack to load; everything else is free text and gets the payload.
const keep = new Set(['id', 'pack_id', 'version', 'status', 'date_convention', 'kind', 'op', 'direction', 'type', 'tier', 'precision', 'level', 'form', 'category',
  'convention', 'rule', 'calendar', 'date', 'year_label', 'retrieved', 'digest', 'sources', 'source_ids', 'corroboration', 'corroboration_ids', 'opened', 'corroborated_by', 'url', 'publisher']);
let n = 0;
function poison(o, key) {
  if (typeof o === 'string') {
    if (keep.has(key) || (/^[a-z0-9_%:.\-/]+$/i.test(o) && o.length < 24)) return o;
    n++; return PAY + o;
  }
  if (Array.isArray(o)) return o.map(x => poison(x, key));
  if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, poison(v, k)]));
  return o;
}
const bad = poison(raw);
console.log('poisoned strings:', n);

const b = await chromium.launch();
const pages = [['/', 'game'], ['/?debug=1', 'game+debug'], ['/motion/', 'motion'], ['/reveal/', 'reveal']];
let fail = 0; const untested = [];
for (const [url, name] of pages) {
  const ctx = await b.newContext(); const page = await ctx.newPage();
  let dialogs = 0; page.on('dialog', d => { dialogs++; d.dismiss(); });
  await page.route('**/data/daily-pack-draft.json', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify(bad) }));
  await page.goto('http://127.0.0.1:5199' + url); await page.waitForTimeout(700);
  // Sticky check: was the payload ever on screen as inert text? A probe that never saw it proves nothing.
  let seenAsText = false;
  const look = async () => { if (!seenAsText) seenAsText = await page.evaluate(() => document.body.innerText.includes('<img src=x')); };
  await look();
  for (let pass = 0; pass < 6; pass++) {
    const btns = await page.$$('button:visible, a.btn:visible, summary:visible');
    for (const x of btns.slice(0, 40)) { try { await x.click({ timeout: 300, noWaitAfter: true }); } catch { /* element moved: fine */ } await look(); }
    await page.waitForTimeout(100);
  }
  const st = await page.evaluate(() => ({
    pwned: window.__pwned || 0,
    injectedImg: document.querySelectorAll('img[src="x"]').length,
    injectedScript: [...document.scripts].filter(s => s.textContent.includes('__pwned')).length,
  }));
  st.payloadSeenAsText = seenAsText;
  console.log(name.padEnd(11), JSON.stringify(st), 'dialogs=' + dialogs);
  if (!seenAsText) untested.push(name);
  if (st.pwned || st.injectedImg || st.injectedScript || dialogs) fail++;
  await ctx.close();
}
await b.close(); srv.close();
if (untested.length) console.log('WARNING: payload never appeared on screen for: ' + untested.join(', ') + ' (surface not exercised; not proof of safety)');
console.log(fail ? `INJECTION FOUND on ${fail} page(s)` : 'NO INJECTION on any page');
process.exit(fail ? 1 : 0);
