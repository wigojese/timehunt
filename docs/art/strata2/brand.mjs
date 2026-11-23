import { pack, esc } from './data.mjs';
const lum = ([r, g, b]) => { const f = v => { v /= 255; return v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; }; return .2126 * f(r) + .7152 * f(g) + .0722 * f(b); };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));

export const iconSvg = (size, { bg = '#1B1A18', band = '#EDE6D6', mark = '#B4412D', mono = false, rx = 22 } = {}) => {
  const b = mono ? '#000' : band, m = mono ? '#000' : mark, back = mono ? 'none' : bg;
  const small = size <= 32; // small-size cut: three heavier layers, thicker marker, so the slip and the marker survive
  const body = small
    ? `<rect x="20" y="17" width="60" height="19" fill="${b}"/><rect x="31" y="40" width="60" height="19" fill="${b}"/><rect x="20" y="63" width="60" height="19" fill="${b}"/><rect x="6" y="44" width="88" height="11" fill="${m}"/><polygon points="6,36 28,49.5 6,63" fill="${m}"/>`
    : `<rect x="22" y="19" width="56" height="12" fill="${b}"/><rect x="22" y="34" width="56" height="12" fill="${b}"/><rect x="31" y="52" width="56" height="12" fill="${b}"/><rect x="22" y="67" width="56" height="12" fill="${b}"/><rect x="11" y="47" width="80" height="4" fill="${m}"/><polygon points="11,42 25,49 11,56" fill="${m}"/>`;
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Timehunt icon"><rect width="100" height="100" rx="${rx}" fill="${back}"/>${body}</svg>`;
};

export function brand() {
  const sw = [['Bone', '#F2ECE0', 'Ground'], ['Paper', '#FBF7EF', 'Raised surface'], ['Ink', '#241F1B', 'Text, borders, filled marks'], ['Muted', '#5C544A', 'Secondary text'], ['Oxide', '#B4412D', 'The one primary action'], ['Moss', '#4A6350', 'Bought-clue stipple, quiet confirm'], ['Soot', '#1B1A18', 'Solve and finale ground'], ['Brass', '#D2AC4F', 'Rule on soot only'], ['Faint', '#D9D0BE', 'Hatched band ground']];
  const swHtml = sw.map(([n, h, u]) => { const c = ratio(hex(h), hex('#F2ECE0')), c2 = ratio(hex(h), hex('#1B1A18')); return `<div class="sw"><div class="chipc" style="background:${h}"></div><b>${n} ${h}</b><span>${u}</span><span>on bone ${c.toFixed(1)}:1, on soot ${c2.toFixed(1)}:1</span></div>`; }).join('');
  const srcs = ['wp-institut_f%c3%bcr_sexualwissenschaft', 'wp-magnus_hirschfeld', 'q-ushmm'].map(id => pack.sources.find(s => s.id === id));
  const srcRows = srcs.map(s => `<div class="srcrow"><div><b>${esc(s.publisher)}</b><br>${esc(s.title)}</div><div class="${s.opened ? 'op' : 'nop'}">${s.opened ? 'Opened by the editor' : 'Not opened'}</div></div>`).join('');
  const sizes = [16, 24, 32, 48, 64, 120, 180];
  const row = (opts, bgc) => `<div class="icrow" style="background:${bgc}">${sizes.map(s => `<div class="ic">${iconSvg(s, opts)}<span>${s}</span></div>`).join('')}</div>`;
  return `<style>
  .bd{width:1800px;padding:44px 48px 48px;background:#14130F;color:#F2ECE0}.bd h1{font:400 50px/1 'Young Serif';margin-bottom:10px}.bd h2{font:400 26px/1.1 'Young Serif';margin:34px 0 8px}
  .bd p,.bd li{font-size:16.5px;line-height:1.45;color:#D8D0BF;max-width:90ch}.bd b{color:#F5EFE2}
  .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}.pn{background:#23211E;border:1px solid #3a362f;padding:18px 20px}.pn h3{font:400 21px/1.1 'Young Serif';margin-bottom:10px}
  .sws{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.sw{display:grid;gap:3px;font-size:14.5px;color:#D8D0BF}.chipc{height:46px;border:1px solid #6a6458}
  table{border-collapse:collapse;width:100%;font-size:15.5px;color:#D8D0BF}td,th{border-bottom:1px solid #3a362f;padding:8px 6px;text-align:left;vertical-align:top}th{color:#F5EFE2}
  .spec{background:#F2ECE0;color:#241F1B;padding:16px 18px}.spec>*{margin-bottom:6px}
  .tx{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:12px}.tx div{height:88px;border:2px solid #241F1B;display:flex;align-items:center;justify-content:center;font:700 14px/1.2 'Sofia Sans';padding:8px;text-align:center;color:#241F1B}
  .srcrow{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1.5px solid #8C8274;font-size:15.5px;color:#241F1B}.op{color:#4A6350;font-weight:700}.nop{color:#5C544A;font-weight:700}
  .icrow{display:flex;gap:22px;align-items:flex-end;padding:18px;margin-bottom:12px}.ic{display:grid;gap:6px;justify-items:center;font-size:13px;color:#8C8274}
  .rej{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
  </style><div class="bd"><div class="sub" style="font:600 16px/1 'Sofia Sans';color:#B4AB9A;margin-bottom:10px">STRATA 2.0 brand system</div><h1>Layers, cuts and one red action</h1>
  <p>STRATA keeps its core idea: time is a stack of layers, evidence cuts them, and what the evidence rules out is hatched or stippled. Version 2.0 adds what ten cases need: a day strip, status marks that work without colour, and years that are large enough to press.</p>
  <div class="g3" style="margin-top:24px"><div class="pn"><h3>Palette, measured</h3><div class="sws">${swHtml}</div><p style="margin-top:10px;font-size:14.5px">Ratios are computed from these hex values. Contrast of the actual layouts is in <b>contrast-report.json</b>.</p></div>
  <div class="pn"><h3>Type roles</h3><div class="spec"><div style="font:400 36px/1.05 'Young Serif'">A research institute in Berlin</div><div style="font:400 20px/1.3 'Young Serif'">In which year did the institute open?</div><div style="font:700 40px/1 'Sofia Sans Extra Condensed';font-variant-numeric:tabular-nums">1918 1919 1920</div><div style="font:400 17px/1.45 'Sofia Sans'">Body and evidence, Sofia Sans 17.</div><div style="font:400 15px/1.4 'Sofia Sans';color:#5C544A">Notes and captions, 15. Nothing under 14.</div></div>
  <table style="margin-top:8px"><tr><td><b>Display</b></td><td>Young Serif 30 to 42</td></tr><tr><td><b>Question</b></td><td>Young Serif 19 to 23</td></tr><tr><td><b>Years</b></td><td>Sofia Sans Extra Condensed 700, tabular, 24 to 40</td></tr><tr><td><b>Body, UI</b></td><td>Sofia Sans 17 and 15</td></tr><tr><td><b>Georgian</b></td><td>No glyphs in any of the three. Needs a tested fallback face (Q-16).</td></tr></table></div>
  <div class="pn"><h3>Texture grammar</h3><div class="tx"><div class="hatch">Hatch<br>ruled out by a free bound</div><div class="stipple">Stipple<br>ruled out by a bought clue</div><div style="background:#FBF7EF">Layer<br>possible year</div><div style="background:#1B1A18;color:#EDE6D6;border-color:#D2AC4F">Brass on soot<br>solved</div></div>
  <p style="margin-top:12px">Texture carries only these four meanings. Status uses shape: <span class="mk clean" style="color:#EDE6D6"></span> solved, <span class="mk assisted" style="color:#EDE6D6"></span> solved with help, <span class="mk missed" style="color:#EDE6D6"></span> missed, <span class="mk todo" style="color:#EDE6D6"></span> to come, always beside a word.</p>
  <p style="margin-top:10px"><b>Rhythm.</b> 4, 8, 12, 20, 26. Gutters 20 (22 in Option III). One primary action per screen, at the bottom, 26 from the edge, 52 high. Ten-segment day strip directly under the header.</p></div></div>
  <h2>Materials in motion</h2><table><tr><th>Material</th><th>Does what</th><th>Time</th><th>Reduced-motion twin</th></tr>
  <tr><td>Layer</td><td>The selected year lifts 2 px and gains the oxide edge</td><td>120 ms</td><td>Edge appears, no lift</td></tr>
  <tr><td>Stipple</td><td>Dots fill in over the years a bought clue removed, then a text line states the numbers</td><td>350 ms</td><td>Stipple and text appear together</td></tr>
  <tr><td>Hatch</td><td>Does not animate. It is the memory of what you cannot choose</td><td>none</td><td>same</td></tr>
  <tr><td>Split</td><td>On a solve, the layers part along the cut and the year grows in the gap, background bone to soot</td><td>500 to 900 ms, skippable</td><td>Straight cut to the solved screen</td></tr>
  <tr><td>Brass</td><td>A rule draws under the solved year on soot</td><td>300 ms</td><td>Present at once</td></tr></table>
  <p>Timings are design targets. None has been built or measured on a device.</p>
  <div class="g3" style="margin-top:8px"><div class="pn"><h3>Source reading</h3><div class="spec"><div style="font:700 17px/1 'Sofia Sans'">Sources, 3</div>${srcRows}<p style="font-size:14.5px;color:#5C544A">Opened means the editor read the cited passage. Not opened means only a search summary was seen. The label is text, never colour alone. Sources sit behind one disclosure at the foot of a result or a revealed clue.</p></div></div>
  <div class="pn"><h3>App icon</h3><p style="font-size:14.5px">A core of layers, one slipped sideways, crossed by the oxide marker. At 32 px and below a heavier three-layer cut is used. Tested at 16 to 180 px on light and dark, in grayscale and in monochrome.</p>${row({}, '#F2ECE0')}${row({}, '#1B1A18')}<div style="filter:grayscale(1)">${row({}, '#F2ECE0')}</div>${row({ mono: true }, '#E8E2D3')}</div>
  <div class="pn"><h3>Rejected</h3><div class="rej" style="grid-template-columns:1fr"><p><b>Dominant blue.</b> The earlier Route B navy dilutes STRATA and reads as a finance app.</p><p><b>Fake archives.</b> No scans, stamps, torn paper or invented documents. Where an image is shown it is a drawing made from the case's own data, labelled as such, until real, cleared images exist (Q-12).</p><p><b>Ornamental clocks.</b> Time here is stacked layers and numerals. A clock face says "now" and decorates nothing.</p></div></div></div></div>`;
}
