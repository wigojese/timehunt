// Interactive evidence forms. Each form is a function (beat, ctx) -> { html, mount(root) }. All graphics are drawn from the sourced data.
import * as L from './lib.js';
import { LANE_SETS, CONNECTIONS } from './stories.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = (r, s) => r.querySelector(s);

export function levelOf(ids, sources) {
  const pubs = new Set(ids.map(i => sources[i]).filter(s => s && s.opened).map(s => s.publisher));
  return pubs.size >= 2 ? 'V2' : pubs.size === 1 ? 'V1' : 'V0';
}
export function srcBlock(ids, sources, label = 'Sources') {
  const uniq = [...new Set(ids)].filter(i => sources[i]);
  const lv = levelOf(uniq, sources);
  return `<details class="src"><summary>${label} (${uniq.length}) <span class="lv ${lv === 'V2' ? 'v2' : ''}" title="V1: one opened page. V2: two independent opened pages.">${lv}</span></summary><ul>${uniq.map(i => { const s = sources[i]; return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.publisher)}: ${esc(s.title)}</a><br><span class="note">${s.opened ? 'Opened by the editor' : 'Not opened'}</span></li>`; }).join('')}</ul></details>`;
}

// ---------- 1. object inspection: the stone ----------
function stoneHtml(mode) {
  return `<div class="stone" role="group" aria-label="Diagram of the stone: three registers, each as tall as its number of lines">${L.STONE_BANDS.map(b => `<button type="button" class="band" data-id="${b.id}" aria-pressed="false" style="min-height:${b.lines * 0.27 + 2}rem"><span class="nm"><span>${b.name}</span><span class="note">${b.lines} lines</span></span>${'<i></i>'.repeat(b.lines)}</button>`).join('')}</div><p class="note">Diagram, not a photograph. Band height is proportional to the number of lines. Size of the stone: 1,123 by 757 by 284 mm, granodiorite.</p>`;
}
export function inspect(beat, ctx) {
  return { html: `<div class="card" id="detail" aria-live="polite"><h2 class="ch">Choose a register</h2><p>Tap a band to see what it holds and what is left of it.</p></div>${stoneHtml()}`,
    mount(r) {
      const sel = id => { r.querySelectorAll('.band').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === id))); r.querySelectorAll('.band').forEach(b => b.classList.toggle('sel', b.dataset.id === id)); const b = L.STONE_BANDS.find(x => x.id === id);
        $(r, '#detail').innerHTML = `<h2 class="ch">${b.name}</h2><p>${b.linesNote}</p><p class="note">${b.id === 'grk' ? 'The Greek text could be translated first: the complete translation was published in 1803.' : 'The Egyptian scripts were transliterated, in Paris, in 1822.'}</p>`; ctx.log('inspect', id); };
      r.querySelectorAll('.band').forEach(b => b.onclick = () => sel(b.dataset.id));
    } };
}
export function stonetime(beat, ctx) {
  return { html: `<label for="yr" class="read" id="yrl">Year: <span id="yv">1799</span></label><input id="yr" class="rng" type="range" min="1799" max="1825" step="1" value="1799" aria-describedby="status"><div class="card" id="status" aria-live="polite"></div>${stoneHtml()}<ol class="ev" id="evl"></ol>`,
    mount(r) {
      const draw = y => { const s = L.stoneStatus(y); $(r, '#yv').textContent = y; $(r, '#yr').setAttribute('aria-valuetext', `${y}`);
        r.querySelectorAll('.band').forEach(b => { const band = L.STONE_BANDS.find(x => x.id === b.dataset.id); const read = y >= band.readAt; b.dataset.s = read ? 'read' : ''; b.classList.toggle('read', read); b.querySelector('.nm span:last-child').textContent = `${band.lines} lines${read ? '. ' + (band.id === 'grk' ? 'Translation published' : 'Transliteration announced') : ''}`; });
        const past = L.STONE_EVENTS.filter(e => e.year <= y);
        $(r, '#status').innerHTML = `<h2 class="ch">${y}</h2><p>${s.transliterated ? 'The Egyptian scripts have been transliterated.' : s.translatedGreek ? 'The Greek text has a complete translation. The Egyptian scripts are not yet read.' : 'Study is underway. No complete translation has been published.'}</p>`;
        $(r, '#evl').innerHTML = past.map(e => `<li class="card" style="margin:.25rem 0"><strong>${e.year}</strong> ${e.text}</li>`).join(''); };
      $(r, '#yr').oninput = e => { draw(Number(e.target.value)); ctx.log('stone-year', e.target.value); }; draw(1799);
    } };
}
// ---------- 2. source comparison ----------
const CLAIMS = [
  { who: 'Wikipedia, Rosetta Stone', claim: 'July 1799', day: null, opened: true },
  { who: 'A search-result summary, source not opened', claim: '15 July 1799', day: '15 July', opened: false },
  { who: 'A search-result summary, source not opened', claim: '19 July 1799', day: '19 July', opened: false },
  { who: 'Encyclopaedia Britannica (page blocked; summary only)', claim: 'August 1799', day: 'August', opened: false },
];
export function compare(beat, ctx) {
  return { html: `<label class="opt"><input type="checkbox" id="only"> Only pages the editor opened</label><ul class="ev" id="cl" style="list-style:none"></ul><div class="card" id="sum" aria-live="polite"></div>`,
    mount(r) { const draw = () => { const only = $(r, '#only').checked; const rows = CLAIMS.filter(c => !only || c.opened);
      $(r, '#cl').innerHTML = rows.map(c => `<li class="card" style="margin:.25rem 0"><strong>${c.claim}</strong><br><span class="note">${c.who}. ${c.opened ? 'Opened.' : 'Not opened.'}</span></li>`).join('');
      const days = new Set(rows.map(c => c.day).filter(Boolean));
      $(r, '#sum').innerHTML = `<h2 class="ch">${rows.length} account${rows.length === 1 ? '' : 's'} shown</h2><p>Year: every account says 1799. Day: ${days.size === 0 ? 'no account shown gives one.' : `${days.size} different answers (${[...days].join(', ')}), and none is confirmed by two opened pages.`}</p>`; ctx.log('compare-filter', only); };
      $(r, '#only').onchange = draw; draw(); } };
}
// ---------- 3. chart you scrub: smallpox by region ----------
export function smallpox(beat, ctx) {
  const lo = 1965, hi = 1982, W = 340, x = L.xScale(lo, hi, 300), rowH = 44;
  const bars = L.SMALLPOX.map((r, i) => `<g><text x="4" y="${34 + i * rowH}" font-size="14">${r.region}</text><rect x="20" y="${42 + i * rowH}" width="${x(r.end + 1)}" height="14" fill="#241F1B"/><text x="${24 + x(r.end + 1)}" y="${54 + i * rowH}" font-size="14">ends ${r.end}</text></g>`).join('');
  const ticks = [1965, 1970, 1975, 1980].map(y => `<g><line x1="${20 + x(y)}" x2="${20 + x(y)}" y1="22" y2="${22 + rowH * 3}" stroke="#8C8274" stroke-dasharray="2 3"/><text x="${20 + x(y) - 16}" y="${22 + rowH * 3 + 16}" font-size="14">${y}</text></g>`).join('');
  return { html: `<svg class="svgc" viewBox="0 0 ${W} 200" role="img" aria-label="Chart: the year smallpox ended in South America (1971), Asia (1975) and Africa (1977), per WHO">${ticks}${bars}<line id="cur" x1="20" x2="20" y1="22" y2="${22 + rowH * 3}" stroke="#B4412D" stroke-width="3"/></svg><p class="note">Bars run from the left edge of the chart to the year WHO gives. The edge is where the chart starts, not where smallpox started. WHO names only these regions.</p><label for="yr" class="read">Year: <span id="yv"></span></label><input id="yr" class="rng" type="range" min="${lo}" max="${hi}" value="1972"><div id="st"></div>`,
    mount(r) { const draw = y => { $(r, '#yv').textContent = y; $(r, '#cur').setAttribute('x1', 20 + x(y + 0.5)); $(r, '#cur').setAttribute('x2', 20 + x(y + 0.5)); const st = L.smallpoxState(y);
      $(r, '#st').innerHTML = st.map(s => `<div class="rowstat"><span>${s.region}</span><strong>${s.state === 'not yet' ? 'Not yet ended' : s.state === 'ended this year' ? 'Ended this year' : 'Ended earlier'}</strong></div>`).join(''); $(r, '#yr').setAttribute('aria-valuetext', `${y}: ` + st.map(s => `${s.region} ${s.state}`).join(', ')); };
      $(r, '#yr').oninput = e => { draw(Number(e.target.value)); ctx.log('smallpox-year', e.target.value); }; draw(1972); } };
}
// ---------- 4. tap a stacked bar: who paid ----------
export function isep(beat, ctx) {
  const s = L.isepSplit();
  return { html: `<div role="group" aria-label="Cost of the programme, about US$300 million" style="display:flex;gap:.25rem;margin:.5rem 0"><button type="button" class="btn" data-k="own" style="flex:2;min-height:5rem;flex-direction:column">Endemic countries’ own efforts<br><strong>about US$${s.endemic}M</strong></button><button type="button" class="btn" data-k="other" style="flex:1;min-height:5rem;flex-direction:column">The rest<br><strong>about US$${s.other}M</strong></button></div><div class="card" id="d" aria-live="polite"><h2 class="ch">Tap a part</h2><p>The bar is drawn two to one.</p></div><p class="note">WHO gives the total (about US$300 million) and the share (two thirds). The dollar figures here are that arithmetic, rounded.</p>`,
    mount(r) { r.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { r.querySelectorAll('[data-k]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); $(r, '#d').innerHTML = b.dataset.k === 'own' ? `<h2 class="ch">Two thirds</h2><p>WHO says two thirds of the cost came from the endemic countries for their own eradication efforts.</p>` : `<h2 class="ch">The other third</h2><p>WHO also lists vaccines given freely to the programme by Britain, Canada, Cuba, France, the Soviet Union and the United States.</p>`; ctx.log('isep', b.dataset.k); }); } };
}
// ---------- 5. definitions: pick the question, see the date ----------
export function defs(beat, ctx) {
  const lo = 1974, hi = 1981, x = L.xScale(lo, hi, 300);
  const pos = m => 20 + x(m.when.y + (m.when.m ? (m.when.m - 1) / 12 + (m.when.d ? m.when.d / 365 : 0.04) : 0.5));
  return { html: `<div class="chips" role="group" aria-label="Which question?">${L.SMALLPOX_MARKS.map(m => `<button type="button" class="btn" data-id="${m.id}" aria-pressed="false">${{ major: 'Last deadlier-form case', natural: 'Last natural case', lab: 'Last case of any kind', declared: 'Eradication declared' }[m.id]}</button>`).join('')}</div><svg class="svgc" viewBox="0 0 340 90" role="img" aria-label="Timeline 1974 to 1981 with four marked dates"><line x1="20" x2="320" y1="45" y2="45" stroke="#241F1B" stroke-width="2"/>${[1974, 1976, 1978, 1980].map(y => `<g><line x1="${20 + x(y)}" x2="${20 + x(y)}" y1="40" y2="50" stroke="#241F1B"/><text x="${20 + x(y) - 16}" y="72" font-size="14">${y}</text></g>`).join('')}${L.SMALLPOX_MARKS.map(m => `<rect class="mk" data-id="${m.id}" x="${pos(m) - 6}" y="33" width="12" height="24" fill="#FBF7EF" stroke="#241F1B" stroke-width="2"/>`).join('')}</svg><div class="card" id="d" aria-live="polite"><h2 class="ch">Choose a question</h2><p>Each answer is a different date.</p></div>`,
    mount(r) { r.querySelectorAll('.btn[data-id]').forEach(b => b.onclick = () => { r.querySelectorAll('.btn[data-id]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); const m = L.SMALLPOX_MARKS.find(z => z.id === b.dataset.id); r.querySelectorAll('.mk').forEach(k => { k.setAttribute('fill', k.dataset.id === m.id ? '#B4412D' : '#FBF7EF'); });
      $(r, '#d').innerHTML = `<h2 class="ch">${m.text}</h2><p>${m.what}</p>`; ctx.log('defs', m.id); }); } };
}
// ---------- 6. follow a route: schematic, dates are sourced ----------
export function route(beat, ctx) {
  const P = { out: 'M280 118 Q175 175 62 92', back: 'M70 128 Q175 18 276 146' };
  return { html: `<div class="chips" role="radiogroup" aria-label="Choose a leg"><button type="button" class="btn" role="radio" aria-checked="true" data-leg="out">Out</button><button type="button" class="btn" role="radio" aria-checked="false" data-leg="back">Back</button></div><svg class="svgc" viewBox="0 0 340 200" role="img" aria-label="Schematic of the two legs between the Philippines on the left and Mexico on the right. No coastline and no track."><path id="p-out" d="${P.out}" fill="none" stroke="#8C8274" stroke-width="2" stroke-dasharray="4 4"/><path id="p-back" d="${P.back}" fill="none" stroke="#8C8274" stroke-width="2" stroke-dasharray="4 4"/><path id="trace" d="" fill="none" stroke="#B4412D" stroke-width="4"/><circle cx="62" cy="92" r="6" fill="#241F1B"/><circle cx="70" cy="128" r="6" fill="#241F1B"/><circle cx="280" cy="118" r="6" fill="#241F1B"/><circle cx="276" cy="146" r="6" fill="#241F1B"/><text x="6" y="82" font-size="14">Samar</text><text x="6" y="150" font-size="14">Cebu</text><text x="228" y="108" font-size="14">La Navidad</text><text x="246" y="170" font-size="14">Acapulco</text><circle id="ship" r="9" fill="#B4412D" stroke="#FBF7EF" stroke-width="3"/></svg><p class="note">Schematic only: no coastline and no track. The sources give the dates; the ship is placed by interpolating them.</p><div class="read" id="when"></div><label for="d" class="sr">Day along the leg</label><input id="d" class="rng" type="range" min="0" value="0"><div class="chips"><button type="button" class="btn" id="play">Play</button></div><div class="card" id="sum" aria-live="polite"></div>`,
    mount(r) { let leg = 'back', raf = 0; const path = id => $(r, '#p-' + id), range = $(r, '#d');
      const draw = () => { const n = L.legDays(leg), day = Number(range.value), d = L.legDate(leg, day), pth = path(leg), len = pth.getTotalLength(), pt = pth.getPointAtLength(len * day / n);
        $(r, '#ship').setAttribute('cx', pt.x); $(r, '#ship').setAttribute('cy', pt.y); $(r, '#when').textContent = `${L.fmtDate(d)}`; range.setAttribute('aria-valuetext', `${L.fmtDate(d)}, day ${day} of ${n}`);
        const trace = $(r, '#trace'); trace.setAttribute('d', pth.getAttribute('d')); trace.setAttribute('stroke-dasharray', `${len * day / n} ${len}`);
        $(r, '#sum').innerHTML = `<h2 class="ch">${L.LEGS[leg].name}</h2><p>${L.LEGS[leg].fromLabel}, ${L.fmtDate(L.LEGS[leg].from)}, to ${L.LEGS[leg].toLabel}, ${L.fmtDate(L.LEGS[leg].to)}.</p><p><strong>Day ${day} of ${n}.</strong> The days are counted from the two dates.</p>`; };
      const setLeg = l => { leg = l; range.max = L.legDays(l); range.value = 0; r.querySelectorAll('[data-leg]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.leg === l))); path(leg === 'out' ? 'back' : 'out').setAttribute('opacity', '.25'); path(leg).setAttribute('opacity', '1'); draw(); ctx.log('leg', l); };
      r.querySelectorAll('[data-leg]').forEach(b => b.onclick = () => setLeg(b.dataset.leg)); range.oninput = () => { draw(); ctx.log('route-day', range.value); };
      const play = $(r, '#play'); if (ctx.reduced()) play.hidden = true;
      play.onclick = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; play.textContent = 'Play'; return; } play.textContent = 'Pause'; const n = L.legDays(leg); let last = performance.now(); const step = t => { const dt = t - last; last = t; range.value = Math.min(n, Number(range.value) + dt / 40); draw(); if (Number(range.value) >= n) { raf = 0; play.textContent = 'Play'; return; } raf = requestAnimationFrame(step); }; if (Number(range.value) >= n) range.value = 0; raf = requestAnimationFrame(step); };
      setLeg('back'); r._cleanup = () => cancelAnimationFrame(raf); } };
}
// ---------- 7. span with markers ----------
export function span(beat, ctx) {
  const lo = 1565, hi = 1815, M = [{ y: 1565, t: 'The route opens', d: 'Urdaneta’s ship reaches Acapulco, 8 October 1565.' }, { y: 1571, t: 'Capital moves to Manila', d: 'The Spanish colonial capital moved to Manila in 1571.' }, { y: 1815, t: 'The route ends', d: 'The Manila galleon route operated "from 1565 to 1815".' }];
  const x = L.xScale(lo, hi, 100);
  return { html: `<div class="card"><strong>${hi - lo} years</strong> from the first crossing to the last year of the route.</div><div style="position:relative;height:2rem;margin:.5rem 0" aria-hidden="true"><div style="position:absolute;left:0;right:0;top:.9rem;border-top:.25rem solid var(--ink)"></div>${M.map(m => `<span style="position:absolute;left:calc(${x(m.y)}% - .4rem);top:.4rem;width:.8rem;height:1.2rem;background:var(--oxide);border:.125rem solid var(--ink)"></span>`).join('')}</div><div class="chips" role="group" aria-label="Markers on the route's 250 years">${M.map((m, i) => `<button type="button" class="btn" data-i="${i}" aria-pressed="false">${m.y}</button>`).join('')}</div><div class="card" id="d" aria-live="polite"><h2 class="ch">Tap a year</h2></div>`,
    mount(r) { r.querySelectorAll('[data-i]').forEach(b => b.onclick = () => { const m = M[b.dataset.i]; r.querySelectorAll('[data-i]').forEach(z => z.setAttribute('aria-pressed', String(z === b))); $(r, '#d').innerHTML = `<h2 class="ch">${m.y}: ${m.t}</h2><p>${m.d}</p>`; ctx.log('span', m.y); }); } };
}
// ---------- 8. calendar conversion ----------
export function calendar(beat, ctx) {
  return { html: `<div class="bigyears" aria-hidden="true"><div id="y43">1443</div><div id="y44">1444</div></div><div class="cells" id="cells" aria-hidden="true">${Array.from({ length: 30 }, (_, k) => `<span class="${L.lunarDay(k).greg.y === 1444 ? 'y2' : ''}"></span>`).join('')}</div><p class="note">Solid cells are days in 1443. Hatched cells are days in 1444.</p><label for="k" class="read">Lunar day <span id="kv"></span> of the 12th month</label><input id="k" class="rng" type="range" min="1" max="30" value="1"><div class="card" id="o" aria-live="polite"></div><p class="note">The two end dates, 30 December 1443 and 28 January 1444, are from the source. The days between are counted from them.</p>`,
    mount(r) { const draw = k => { const { lunarDay, greg } = L.lunarDay(k - 1); $(r, '#kv').textContent = lunarDay; $(r, '#o').innerHTML = `<h2 class="ch">${L.fmtDate(greg)}</h2><p>Lunar day ${lunarDay} of the 12th month of 1443 is ${greg.y === 1443 ? 'still in the Gregorian year 1443' : 'already in the Gregorian year 1444'}.</p>`;
      $(r, '#y43').classList.toggle('on', greg.y === 1443); $(r, '#y44').classList.toggle('on', greg.y === 1444); r.querySelectorAll('.cells span').forEach((c, i) => c.classList.toggle('now', i === k - 1)); $(r, '#k').setAttribute('aria-valuetext', `Lunar day ${lunarDay}, ${L.fmtDate(greg)}`); };
      $(r, '#k').oninput = e => { draw(Number(e.target.value)); ctx.log('lunar-day', e.target.value); }; draw(1); } };
}
// ---------- 9. lanes with filter and tap ----------
export function lanes(beat, ctx, setKey) {
  const set = LANE_SETS[beat.lanes || setKey], W = 340, labW = 4, padT = 18, laneH = 60, ev = L.sortEvents(set.events), x = L.xScale(set.lo, set.hi, W - 20);
  return { html: `<div class="chips" role="group" aria-label="Show lanes"><button type="button" class="btn" data-lane="all" aria-pressed="true">All lanes</button>${set.lanes.map(l => `<button type="button" class="btn" data-lane="${l.id}" aria-pressed="false">${l.label}</button>`).join('')}</div><div id="chart"></div><ol class="ev" id="list"></ol><div class="card" id="d" aria-live="polite"><h2 class="ch">Tap an event</h2><p>A single mark is a known day. A band is a month, a year or a range. A dashed band is uncertain.</p></div>`,
    mount(r) { let lane = 'all', sel = null;
      const draw = () => { const shown = set.lanes.filter(l => lane === 'all' || l.id === lane), H = padT + shown.length * laneH + 26;
        const axis = set.unit === 'year' ? Array.from({ length: Math.floor(set.hi - set.lo) + 1 }, (_, i) => ({ v: set.lo + i, t: String(set.lo + i) })) : [0, 3, 6, 9].map(m => ({ v: set.lo + m / 12, t: ['Jan', 'Apr', 'Jul', 'Oct'][m / 3] }));
        let svg = `<svg class="svgc" viewBox="0 0 ${W} ${H}" role="img" aria-label="Events on a time axis, one lane per theme. The list below gives every date in words.">`;
        axis.forEach((a, ai) => { const every = axis.length > 6 ? 2 : 1, lastA = ai === axis.length - 1 && axis.length > 1 && every === 1, show = ai % every === 0; svg += `<line x1="${10 + x(a.v)}" x2="${10 + x(a.v)}" y1="${padT}" y2="${H - 26}" stroke="#D9D0BE"/>${show ? `<text x="${10 + x(a.v) + (lastA ? 0 : -4)}" y="${H - 8}" font-size="14" text-anchor="${lastA ? 'end' : 'start'}">${a.t}</text>` : ''}`; });
        shown.forEach((l, li) => { const y0 = padT + li * laneH; svg += `<text x="12" y="${y0 + 12}" font-size="14" font-weight="700">${l.label}</text><line x1="10" x2="${W - 10}" y1="${y0 + 52}" y2="${y0 + 52}" stroke="#241F1B" stroke-width="1"/>`; let lastLx = -99;
          ev.filter(e => e.lane === l.id).forEach(e => { const s = L.laneSpan(e), n = ev.indexOf(e) + 1, xa = 10 + x(s.a), xb = 10 + x(s.b), isSel = sel === n; const col = isSel ? '#B4412D' : '#241F1B'; const lx = Math.max(xa - 4, lastLx + 18); lastLx = lx;
            if (s.kind === 'point') svg += `<circle cx="${xa}" cy="${y0 + 42}" r="7" fill="${col}"/><text x="${lx}" y="${y0 + 30}" font-size="14" font-weight="700">${n}</text>`;
            else svg += `<rect x="${xa}" y="${y0 + 36}" width="${Math.max(8, xb - xa)}" height="12" fill="${e.uncertain ? 'none' : col}" stroke="${col}" stroke-width="2" ${e.uncertain ? 'stroke-dasharray="4 3"' : ''}/><text x="${lx}" y="${y0 + 30}" font-size="14" font-weight="700">${n}</text>`; }); });
        svg += '</svg>'; $(r, '#chart').innerHTML = svg;
        $(r, '#list').innerHTML = ev.map((e, i) => ({ e, i: i + 1 })).filter(({ e }) => lane === 'all' || e.lane === lane).map(({ e, i }) => `<li><button type="button" class="btn ${sel === i ? 'on' : ''}" data-n="${i}" aria-pressed="${sel === i}">${i}. ${esc(e.label)}</button></li>`).join('');
        r.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { sel = Number(b.dataset.n); const e = ev[sel - 1], s = L.laneSpan(e);
          const when = e.from ? `${L.fmtDate(e.from)} to ${L.fmtDate(e.to)}` : e.at.d ? L.fmtDate(e.at) : e.at.m ? `${L.MONTHS[e.at.m - 1]} ${e.at.y}` : String(e.at.y);
          const prec = { point: 'The day is known.', month: 'Only the month is known.', year: 'Only the year is known.', range: 'A range of days.' }[s.kind];
          const lv = levelOf(e.src, ctx.sources);
          $(r, '#d').innerHTML = `<h2 class="ch">${esc(e.label)}</h2><p><strong>${when}</strong>. ${prec}${e.uncertain ? ' <span class="tag">uncertain</span>' : ''}</p>${e.note ? `<p class="note">${esc(e.note)}</p>` : ''}${srcBlock(e.src, ctx.sources, 'Sources')}<p class="note">Verification: ${lv}.</p>`; draw(); ctx.log('lane-event', sel); }); };
      r.querySelectorAll('[data-lane]').forEach(b => b.onclick = () => { lane = b.dataset.lane; sel = null; r.querySelectorAll('[data-lane]').forEach(z => z.setAttribute('aria-pressed', String(z === b))); draw(); ctx.log('lane-filter', lane); });
      draw(); } };
}
// ---------- 10. relation card: states the category honestly ----------
export function relation(beat, ctx) {
  const kind = beat.id === 'bias' ? 'A limit of this pack' : 'Same period';
  return { html: `<div class="relation"><span class="tag">${kind}</span><p style="margin-top:.5rem">${esc(beat.text)}</p><dl class="kv" style="margin-top:.5rem"><dt>Relationship</dt><dd>${beat.id === 'bias' ? 'Selection, not history' : 'Simultaneous. No link is claimed.'}</dd><dt>What would make it a link</dt><dd>A source that says so.</dd></dl></div>`, mount() {} };
}
// ---------- 11. connection chain: tap the nodes, read the category ----------
export function connection(key) {
  return (beat, ctx) => { const c = CONNECTIONS[key], ys = c.nodes.map(n => n.y), lo = Math.min(...ys), hi = Math.max(...ys), x = L.xScale(lo, hi, 290);
    const gap = hi - lo;
    return { html: `<div class="card"><strong>${gap.toLocaleString('en')} years</strong> between the first and last mark${key === 'name' ? ' (196 BCE to 2016)' : ''}. ${key === 'name' ? `From the stone's finding to the probe's launch: ${(2004 - 1799)} years.` : ''}</div><svg class="svgc" viewBox="0 0 340 90" role="img" aria-label="${c.nodes.map(n => `${L.label(n.y)} ${n.label}`).join(', ')}"><line x1="20" x2="310" y1="45" y2="45" stroke="#241F1B" stroke-width="2"/>${c.nodes.map((n, i) => `<rect class="nd" data-i="${i}" x="${20 + x(n.y) - 7}" y="33" width="14" height="24" fill="#FBF7EF" stroke="#241F1B" stroke-width="2"/>`).join('')}</svg><div class="chips" role="group" aria-label="Marks">${c.nodes.map((n, i) => `<button type="button" class="btn" data-i="${i}" aria-pressed="false">${L.label(n.y)}: ${n.label}</button>`).join('')}</div><div class="card" id="d" aria-live="polite"><h2 class="ch">Tap a mark</h2></div><div class="relation"><span class="tag">${c.kind}</span><dl class="kv" style="margin-top:.5rem"><dt>Relationship</dt><dd>${c.kind}. ${c.claim}</dd><dt>What would make it a link</dt><dd>${key === 'name' ? 'Here the link is documented: someone chose the name.' : 'A source that says one led to the other.'}</dd></dl></div>`,
      mount(r) { r.querySelectorAll('button[data-i]').forEach(b => b.onclick = () => { const n = c.nodes[b.dataset.i]; r.querySelectorAll('button[data-i]').forEach(z => z.setAttribute('aria-pressed', String(z === b))); r.querySelectorAll('.nd').forEach(z => z.setAttribute('fill', z.dataset.i === b.dataset.i ? '#B4412D' : '#FBF7EF')); $(r, '#d').innerHTML = `<h2 class="ch">${L.label(n.y)}: ${n.label}</h2><p>${esc(n.text)}</p>${srcBlock(n.src, ctx.sources)}`; ctx.log('connection-' + key, n.y); }); } }; };
}
export const FORMS = { place: connection('place'), name: connection('name'), inspect, stonetime, compare, smallpox, isep, defs, route, span, calendar, lanes, relation };
