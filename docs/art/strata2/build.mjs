// Builds the STRATA 2.0 art-direction boards, runs the contrast check on the rendered layouts, renders PNGs.
// Usage: node build.mjs   (needs the pre-installed Playwright; fonts load from Google Fonts)
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as o1 from './option1.mjs';
import * as o2 from './option2.mjs';
import * as o3 from './option3.mjs';
import { brand } from './brand.mjs';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright');
const here = dirname(fileURLToPath(import.meta.url));
const tokens = readFileSync(join(here, 'tokens.css'), 'utf8');
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Sofia+Sans:wght@400;600;700&family=Sofia+Sans+Extra+Condensed:wght@600;700&display=block" rel="stylesheet">`;
const OPTS = [
  { key: 'o1', mod: o1, name: 'Option I. Instrument', tag: 'The core is the hero', why: 'Years are layers you press. The bank is a row of eight pegs, the day a ten-segment strip. Ruled-out years collapse into hatched bands, so every selectable year is a full-size target.' },
  { key: 'o2', mod: o2, name: 'Option II. Specimen', tag: 'The case is a tray', why: 'Two pinned specimens bracket an empty slot and you decide what fills it. Years are a row of five chips. The day is a drawer of ten slots that fills with the years you found.' },
  { key: 'o3', mod: o3, name: 'Option III. Editorial', tag: 'Type leads, years are numerals', why: 'The evidence reads as numbered notes in a serif. Years are a ruled line of numerals. The day is a contents page with dot leaders.' },
];
const boardCss = `
.board{width:1800px;padding:44px 48px 40px;background:#14130F;color:#F2ECE0}
.head{display:grid;grid-template-columns:520px 1fr;gap:48px;align-items:end;margin-bottom:30px}
.head h1{font:400 50px/.98 'Young Serif',serif}.head .sub{font:600 16px/1 'Sofia Sans';color:#B4AB9A;margin-bottom:12px}
.head p{font-size:17.5px;line-height:1.45;max-width:72ch;color:#D8D0BF}
.grid{display:grid;grid-template-columns:repeat(4,390px);gap:34px 40px}
.cap b{display:block;font:400 19px/1.2 'Young Serif';margin-bottom:4px}
`;
const phone = (s, i) => `<div class="cell"><div class="phone ${s.dark ? 'dark' : ''}">${s.html}</div><div class="cap"><b>${i + 1}. ${s.name}</b></div></div>`;
const page = (title, body, extra = '') => `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${title}</title>${FONTS}<style>${tokens}${boardCss}${o1.css}${o2.css}${o3.css}${extra}</style></head><body>${body}</body></html>`;

const files = {};
for (const o of OPTS) {
  const sc = o.mod.screens();
  files[`board-${o.key}.html`] = page(o.name, `<div class="board"><div class="head"><div><div class="sub">STRATA 2.0, composition option</div><h1>${o.name}</h1><div class="sub" style="margin-top:10px">${o.tag}</div></div><p>${o.why} All eight screens use real text from the Stage 3 draft pack. The sample day (results, Insight left) is the Stage 4 scripted day and is illustrative, not a real result.</p></div><div class="grid">${sc.map(phone).join('')}</div></div>`);
}
files['brand-system.html'] = page('STRATA 2.0 brand system', brand({ tokens }));
for (const [n, h] of Object.entries(files)) writeFileSync(join(here, n), h);

const browser = await chromium.launch();
const report = { generated: new Date().toISOString().slice(0, 10), options: {} };
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };

for (const o of OPTS) {
  const p = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 1 });
  await p.goto('file://' + join(here, `board-${o.key}.html`)); await p.waitForTimeout(1200);
  const items = await p.evaluate(() => {
    const parse = c => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const a = m[1].split(',').map(Number); return { rgb: a.slice(0, 3), a: a.length > 3 ? a[3] : 1 }; };
    const out = [];
    document.querySelectorAll('.phone').forEach((ph, si) => {
      const w = document.createTreeWalker(ph, NodeFilter.SHOW_TEXT);
      let n; while ((n = w.nextNode())) {
        const t = n.textContent.trim(); if (!t) continue;
        const el = n.parentElement; const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const fg = parse(cs.color); let bg = null, e = el, grad = false;
        while (e) { const s = getComputedStyle(e); const b = parse(s.backgroundColor); if (s.backgroundImage.includes('gradient') && e !== ph) grad = true; if (b && b.a > .9) { bg = b.rgb; break; } e = e.parentElement; }
        const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
        out.push({ screen: si + 1, text: t.slice(0, 40), fg: fg.rgb, bg, size, bold, grad });
      }
    });
    return out;
  });
  const fails = [], all = [];
  for (const it of items) {
    if (!it.bg) continue;
    const r = ratio(it.fg, it.bg); const large = it.size >= 24 || (it.size >= 18.66 && it.bold); const need = large ? 3 : 4.5;
    all.push(r);
    if (r < need) fails.push({ screen: it.screen, text: it.text, ratio: +r.toFixed(2), need, size: it.size });
  }
  const small = items.filter(i => i.size < 14).map(i => ({ screen: i.screen, text: i.text, size: i.size }));
  report.options[o.key] = { textRuns: all.length, minRatio: +Math.min(...all).toFixed(2), failures: fails, textUnder14px: small };
  await p.close();
}

// Non-text and control pairs on the real tokens
const T = { bone: [242, 236, 224], paper: [251, 247, 239], ink: [36, 31, 27], oxide: [180, 65, 45], white: [255, 255, 255], moss: [74, 99, 80], soot: [27, 26, 24], brass: [210, 172, 79], rule: [140, 130, 116], muted: [92, 84, 74], faint: [217, 208, 190], boneOnSoot: [237, 230, 214], mutedOnSoot: [180, 171, 154] };
report.tokenPairs = [
  ['ink on bone', 'ink', 'bone', 4.5], ['ink on paper', 'ink', 'paper', 4.5], ['muted on bone', 'muted', 'bone', 4.5], ['muted on paper', 'muted', 'paper', 4.5],
  ['white on oxide (primary button)', 'white', 'oxide', 4.5], ['oxide on bone (marker, flag edge)', 'oxide', 'bone', 3], ['oxide on paper', 'oxide', 'paper', 3], ['moss on bone', 'moss', 'bone', 4.5],
  ['bone on ink (dark button, selected chip)', 'bone', 'ink', 4.5], ['bone-on-soot on soot', 'boneOnSoot', 'soot', 4.5], ['muted-on-soot on soot', 'mutedOnSoot', 'soot', 4.5], ['brass on soot (rule)', 'brass', 'soot', 3],
  ['rule on bone (non-text border)', 'rule', 'bone', 3], ['ink on faint (hatch band text)', 'ink', 'faint', 4.5],
].map(([n, a, b, need]) => ({ pair: n, ratio: +ratio(T[a], T[b]).toFixed(2), need, pass: ratio(T[a], T[b]) >= need }));
writeFileSync(join(here, 'contrast-report.json'), JSON.stringify(report, null, 2) + '\n');

// Render PNGs
for (const o of OPTS) {
  const p = await browser.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 1.5 });
  await p.goto('file://' + join(here, `board-${o.key}.html`)); await p.waitForTimeout(1400);
  await p.screenshot({ path: join(here, `strata2-${o.key}.png`), fullPage: true });
  await p.addStyleTag({ content: 'html{filter:grayscale(1)}' }); await p.waitForTimeout(200);
  await p.screenshot({ path: join(here, `strata2-${o.key}-gray.png`), fullPage: true });
  await p.close();
}
const pb = await browser.newPage({ viewport: { width: 1800, height: 1000 }, deviceScaleFactor: 1.5 });
await pb.goto('file://' + join(here, 'brand-system.html')); await pb.waitForTimeout(1500);
await pb.screenshot({ path: join(here, 'strata2-brand-system.png'), fullPage: true });
await browser.close();
for (const [k, v] of Object.entries(report.options)) console.log(k, 'runs', v.textRuns, 'min ratio', v.minRatio, 'failures', v.failures.length, 'text<14px', v.textUnder14px.length);
console.log('token pairs failing:', report.tokenPairs.filter(x => !x.pass).map(x => `${x.pair} ${x.ratio}`));
