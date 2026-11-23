// Composes contact sheets and exports the data charts from the reveal screenshots. Usage: node scripts/make-reveal-sheets.mjs (after e2e-reveal.mjs)
import { createRequire } from 'node:module';
import { readdirSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url)); const OUT = join(here, '..', '..', 'docs', 'reveal');
const files = readdirSync(join(OUT, 'screens')); const f = k => files.find(x => x.includes(k));
const sheet = (name, title, items, cols = 6) => ({ name, html: `<div class="w"><h1>${title}</h1><div class="g" style="grid-template-columns:repeat(${cols},300px)">${items.map(([k, c]) => `<figure><img src="screens/${f(k)}" width="300" alt=""><figcaption>${c}</figcaption></figure>`).join('')}</div></div>` });
const sheets = [
  sheet('forms-1', 'Evidence forms 1 to 6: inspect, scrub a year, compare sources, scrub a chart, tap a bar, choose a question', [['inspect', 'Inspect: tap a register of the stone; bands are as tall as their lines'], ['stonetime', 'Scrub: move the year; the stone shows what had been read'], ['compare', 'Compare: filter the accounts of the day to those the editor opened'], ['smallpox', 'Chart: scrub the year across WHO’s three regions'], ['isep', 'Tap a bar: who paid'], ['defs', 'Choose a question: four dates for “the last case”']]),
  sheet('forms-2', 'Evidence forms 7 to 12: route, span, calendar, lanes, uncertainty, relation', [['route', 'Route: scrub a leg; days counted from sourced dates; schematic'], ['span', 'Span: tap a year on 250 years of the route'], ['calendar', 'Calendar: scrub the 12th lunar month; the Gregorian year flips on day 3'], ['lanes-hangul', 'Lanes: filter, tap, see precision (day, month, year)'], ['lanes-road', 'Uncertainty: a dashed band is a tradition, not a fact'], ['relation', 'Relation card: simultaneous, no link claimed']]),
  sheet('finale', 'The finale: ten marks, one shared year, what the ten leave out', [['finale-marks', 'Ten marks, oldest first, with the gaps between them'], ['finale-1977', 'Two marks share 1977: open the year as lanes'], ['finale-coverage', 'What the ten leave out, computed from the pack'], ['02-entry', 'Entry: the found year fills the screen, then becomes the story'], ['bias', 'A limit of the pack, stated plainly'], ['hub', 'The hub: six stories and a finale, skippable and resumable']], 6),
];
const css = `body{margin:0;background:#14130F;color:#EDE6D6;font:15px/1.4 'Sofia Sans',system-ui,sans-serif}.w{padding:30px 36px}h1{font:400 30px/1.1 'Young Serif',serif;margin:0 0 18px}.g{display:grid;gap:22px 24px}figure{margin:0}img{display:block;border:2px solid #3a362f}figcaption{margin-top:6px;max-width:300px}`;
const b = await chromium.launch();
for (const s of sheets) { writeFileSync(join(OUT, s.name + '.html'), `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Sofia+Sans:wght@400;600&display=block" rel="stylesheet"><style>${css}</style></head><body>${s.html}</body></html>`); const p = await b.newPage({ viewport: { width: 2000, height: 900 } }); await p.goto('file://' + join(OUT, s.name + '.html')); await p.waitForTimeout(800); await p.screenshot({ path: join(OUT, 'sheet-' + s.name + '.png'), fullPage: true }); await p.close(); rmSync(join(OUT, s.name + '.html')); }
await b.close(); console.log('sheets:', sheets.map(s => 'sheet-' + s.name + '.png').join(', '));
