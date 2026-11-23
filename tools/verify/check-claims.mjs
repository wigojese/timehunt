// Re-opens each cited page and checks that the stated claim's wording is on it. This is an AI-run second pass, NOT human (V3) review.
// A claim passes when the regex matches the page text. Usage: node tools/verify/check-claims.mjs   (needs Playwright; polite delays and retries on rate limits)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url)); const claims = JSON.parse(readFileSync(join(here, 'claims.json'), 'utf8'));
const OUT = join(here, '..', '..', 'docs', 'reveal');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const b = await chromium.launch(); const page = await b.newPage({ viewport: { width: 1200, height: 900 } });
const cache = {}; const rows = [];
async function text(url) {
  if (cache[url] !== undefined) return cache[url];
  for (let t = 0; t < 4; t++) {
    try { const r = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); await page.waitForTimeout(1200); const status = r && r.status();
      if (status === 429) { await sleep(25000); continue; }
      const txt = (await page.evaluate(() => document.body.innerText)).replace(/\s+/g, ' '); cache[url] = { status, txt, title: await page.title() }; await sleep(2500); return cache[url]; }
    catch (e) { await sleep(4000); }
  }
  return (cache[url] = { status: 0, txt: '', title: '' });
}
for (const c of claims) { const p = await text(c.url); const ok = p.status === 200 && new RegExp(c.re, 'i').test(p.txt); rows.push({ ...c, status: p.status, ok }); console.log(ok ? 'PASS' : 'FAIL', c.story, '|', c.claim, p.status === 200 ? '' : `(HTTP ${p.status})`); }
await b.close();
const pass = rows.filter(r => r.ok).length;
writeFileSync(join(OUT, 'claim-check.json'), JSON.stringify({ checkedOn: new Date().toISOString().slice(0, 10), method: 'AI-run: page re-opened in a browser and the claim wording matched by regular expression. Not human review.', pass, total: rows.length, rows }, null, 2) + '\n');
console.log(`\nclaims confirmed on their pages: ${pass}/${rows.length}`);
