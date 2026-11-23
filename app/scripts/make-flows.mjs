// Composes the annotated flow sheets from the screenshots written by e2e-ui.mjs. Usage: node scripts/make-flows.mjs
import { createRequire } from 'node:module';
import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', '..', 'docs', 'ui');
const files = readdirSync(join(OUT, 'screens'));
const f = key => files.find(x => x.includes(key));
const SHEETS = [
  ['flow-1-play-loop', 'Flow 1. One case, start to finish, then the day', 6, [
    ['onboarding-1', 'Onboarding, three steps, skippable. Step 1 of 3.'],
    ['trail-start', 'Daily Trail. Case count, bank, ten-segment strip and one action: Start case 1. Nav at the bottom.'],
    ['dossier', 'Dossier. Question, numbered notes, sources behind a disclosure. One action: Choose a year.'],
    ['hunt-empty', 'Case hunt. Possible years are listed as large layers; ruled-out years are labelled bands. Nothing pre-selected.'],
    ['hunt-selected', 'Choosing a year changes the Lock label. Evidence is one tap away.'],
    ['lock-confirm', 'Lock asks first, in words. Escape or "Keep choosing" cancels.'],
    ['evidence', 'Evidence. Notes again, extra clues with price on the button, "tells you nothing new costs nothing".'],
    ['reveal-confirm', 'Spending asks first: cost and what is left. Can be switched off in Settings.'],
    ['evidence-revealed', 'A revealed clue shows its text and its sources.'],
    ['result-solved', 'Result. The year, what it was, why not the others, sources. Next case, or the world around it.'],
    ['result-missed', 'A miss: the answer, why, "A miss never ends your day". Same layout.'],
    ['finish', 'Ten-case finish. Score line, marks by shape, years oldest first with recency bars, spoiler-free share.'],
  ]],
  ['flow-2-states', 'Flow 2. States', 6, [
    ['loading', 'Loading: busy state with a heading and text.'],
    ['offline', 'No network: a banner says play continues and sources open later. Play works.'],
    ['resume-trail', 'Resume after reload: banner and "Continue case 3". Insight unchanged.'],
    ['save-failed', 'Save failed: "Nothing was charged." Insight unchanged.'],
    ['zero-insight', 'Zero Insight: all clue buttons disabled with a reason; reading and locking stay free.'],
    ['invalid-pack', 'Invalid pack: refused with codes; no navigation, nothing started.'],
    ['held', 'Held save: explained, one explicit action, old record backed up.'],
    ['world-entry', 'World Reveal entry: prototype, with a Back that returns to the result.'],
  ]],
  ['flow-3-secondary', 'Flow 3. Practice, Archive, Settings, Trace variant', 5, [
    ['practice', 'Practice: pick a case or let the seed pick. Separate save, 2 Insight.'],
    ['archive', 'Archive: finished days on this device, with shape marks and words.'],
    ['settings', 'Settings: text size, motion, spending confirmation, language, delete.'],
    ['trace-variant', 'Trace (test variant): a named control, a price, the result in words.'],
    ['world-all', 'World Reveal list after the day (prototype).'],
  ]],
];
const cell = (file, cap, w = 390) => `<figure><img src="screens/${file}" width="${w}" alt=""><figcaption>${cap}</figcaption></figure>`;
const css = `body{margin:0;background:#14130F;color:#EDE6D6;font:15px/1.4 'Sofia Sans',system-ui,sans-serif}.w{padding:36px 40px}h1{font:400 38px/1 'Young Serif',serif;margin:0 0 24px}
.g{display:grid;gap:28px 32px}figure{margin:0}img{display:block;border:2px solid #3a362f;border-radius:6px}figcaption{margin-top:8px;max-width:390px}`;
const pages = [];
for (const [name, title, cols, items] of SHEETS) pages.push([name, `<div class="w"><h1>${title}</h1><div class="g" style="grid-template-columns:repeat(${cols},390px)">${items.map(([k, c]) => cell(f(k), c)).join('')}</div></div>`]);
pages.push(['flow-4-responsive', `<div class="w"><h1>Responsive: the case hunt at 320, 360, 390, 430, 768 and 1024 px</h1><div class="g" style="grid-template-columns:repeat(6,auto);align-items:start">${[320, 360, 390, 430, 768, 1024].map(w => cell(`resp-hunt-w${w}.png`, `${w} px wide. No horizontal scroll. Action bar stays at the thumb.`, w >= 768 ? 300 : w)).join('')}</div></div>`]);
pages.push(['flow-5-textsize-pseudo', `<div class="w"><h1>Text size 100, 130, 160, 200 percent, and long translated copy</h1><div class="g" style="grid-template-columns:repeat(4,390px)">${[100, 130, 160, 200].map(s => cell(`text-hunt-${s}.png`, `Text ${s}%. Nothing clipped; Lock reachable by scrolling.`)).join('')}${['trail', 'hunt', 'evidence'].map(k => cell(`pseudo-${k}.png`, `Pseudo-locale (+40% length, accented), ${k}, 360 px.`, 360)).join('')}</div></div>`]);
const b = await chromium.launch();
for (const [name, body] of pages) {
  writeFileSync(join(OUT, name + '.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${name}</title><link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Sofia+Sans:wght@400;600;700&display=block" rel="stylesheet"><style>${css}</style></head><body>${body}</body></html>`);
  const p = await b.newPage({ viewport: { width: 1800, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('file://' + join(OUT, name + '.html')); await p.waitForTimeout(900);
  await p.screenshot({ path: join(OUT, name + '.png'), fullPage: true }); await p.close();
}
await b.close();
console.log('wrote', pages.map(p => p[0]).join(', '));
