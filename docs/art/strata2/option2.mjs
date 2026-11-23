// OPTION II: SPECIMEN. The case is a tray. Two pinned specimens bracket an empty slot; you choose what fills it. The day is a drawer of ten slots.
import { C, label, DAY, esc } from './data.mjs';

export const css = `
.o2 .top{display:flex;justify-content:space-between;align-items:center;padding:0 18px;height:40px;font:600 15px/1 var(--sans)}
.o2 .tabs{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;padding:0 18px;margin-top:6px}
.o2 .tab{height:26px;border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;font:700 14px/1 var(--sans);background:var(--paper)}
.o2 .tab.clean{background:var(--ink);color:var(--bone)}.o2 .tab.assisted{background:linear-gradient(90deg,var(--ink) 50%,var(--paper) 50%);color:var(--oxide-ink);mix-blend-mode:normal}
.o2 .tab.assisted span{background:var(--paper);color:var(--ink);padding:0 3px}.o2 .tab.missed{background:var(--paper);text-decoration:line-through}.o2 .tab.todo{border-style:dotted}.o2 .tab.now{outline:3px solid var(--oxide);outline-offset:1px}
.o2 h1{font:400 30px/1.05 var(--serif);padding:0 18px}.o2 .q{font:400 19px/1.3 var(--serif);padding:0 18px}
.o2 .tray{margin:14px 18px 0;border:2px solid var(--ink);background:var(--paper);padding:14px;position:relative}
.o2 .tray:before,.o2 .tray:after{content:"";position:absolute;width:14px;height:14px;border:2px solid var(--oxide)}
.o2 .tray:before{left:-2px;top:-2px;border-right:0;border-bottom:0}.o2 .tray:after{right:-2px;bottom:-2px;border-left:0;border-top:0}
.o2 .spec{display:grid;grid-template-columns:78px 1fr;gap:10px;align-items:center;padding:8px 0;border-bottom:1.5px dashed var(--rule)}
.o2 .spec:last-child{border-bottom:0}.o2 .spec .y{font:700 34px/1 var(--cond);font-variant-numeric:tabular-nums}.o2 .spec .t{font-size:15.5px;line-height:1.3}
.o2 .slot{display:flex;align-items:center;justify-content:center;height:62px;margin:8px 0;border:2px dashed var(--oxide);font:400 17px/1.2 var(--serif);color:var(--ink);text-align:center}
.o2 .chips{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:6px;margin:14px 18px 0}
.o2 .chip{min-height:56px;border:2px solid var(--ink);display:flex;align-items:center;justify-content:center;font:700 22px/1 var(--cond);background:var(--paper);font-variant-numeric:tabular-nums}
.o2 .chip.sel{background:var(--ink);color:var(--bone);box-shadow:0 5px 0 var(--oxide)}
.o2 .acts{position:absolute;left:18px;right:18px;bottom:26px;display:grid;grid-template-columns:1fr 1.5fr;gap:10px}
.o2 .note{font-size:15px;line-height:1.4;color:var(--muted)}
.o2 .env{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border:2px solid var(--ink);margin-top:8px;background:var(--bone)}
.o2 .drawer{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:0 18px}
.o2 .cell{aspect-ratio:3/4;border:2px solid var(--ink);display:flex;flex-direction:column;justify-content:space-between;padding:6px;background:var(--paper);font:700 14px/1 var(--sans)}
.o2 .cell .y{font:700 19px/1 var(--cond);font-variant-numeric:tabular-nums}.o2 .cell.todo{border-style:dotted;background:transparent}.o2 .cell.next{outline:3px solid var(--oxide);outline-offset:1px}
.o2 .cell.clean{background:var(--ink);color:var(--bone)}.o2 .cell.missed{background:var(--paper);background-image:linear-gradient(to top right,transparent 49%,var(--ink) 49% 51%,transparent 51%)}
.o2 .cell.assisted{background:var(--paper);box-shadow:inset 9px 0 0 var(--ink);padding-left:15px}
.o2 .big{font:400 84px/.95 var(--serif);text-align:center;padding:16px 0;background:#2A2825;color:var(--bone-on-soot)}
.o2 .brassrule{height:3px;background:var(--brass)}
`;
const tabs = (states, now) => `<div class="tabs">${states.map((s, i) => `<span class="tab ${s} ${i + 1 === now ? 'now' : ''}"><span>${i + 1}</span></span>`).join('')}</div>`;
const top = (l, r) => `<div class="safe"></div><div class="top"><span>${l}</span><span>${r}</span></div>`;
const bracket = c => {
  const lo = c.free.find(f => f.predicate.op === 'gte'), hi = c.free.find(f => f.predicate.op === 'lte');
  const spec = (f, side) => `<div class="spec"><span class="y">${label(f.anchor.year)}</span><span class="t"><b>${esc(f.anchor.label)}</b><br><span class="note">${side}</span></span></div>`;
  return { lo, hi, html: (sel) => `<div class="tray">${spec(hi, 'The year is before this one')}<div class="slot">${sel ? label(sel) : 'your year goes here'}</div>${spec(lo, 'The year is this one or later')}</div>` };
};
const chips = (cs, sel) => `<div class="chips">${[...cs].reverse().map(y => `<span class="chip ${y === sel ? 'sel' : ''}">${label(y)}</span>`).join('')}</div>`;
const prior = (n) => DAY.slice(0, n - 1).map(d => d.s).concat(Array(11 - n).fill('todo')).slice(0, 10);

export function screens() {
  const c4 = C('case-04'), c5 = C('case-05'), c6 = C('case-06');
  const out = [];
  out.push({ name: 'Home and Daily Trail', html: `<div class="o2">${top('Mon 23 Nov', 'Insight 8 of 8')}
    <div style="padding:20px 18px 0"><span class="tag">Draft pack, sample day</span></div><h1 style="padding-top:12px;font-size:34px">The Daily Ten</h1>
    <p style="padding:10px 18px 18px;font-size:17px;line-height:1.45">Ten trays. Fill the empty slot in each with the year it belongs to.</p>
    <div class="drawer">${Array.from({ length: 10 }, (_, i) => `<div class="cell ${i === 0 ? 'next' : 'todo'}"><span>${i + 1}</span><span class="y" style="font-size:15px">${i === 0 ? 'Next' : ''}</span></div>`).join('')}</div>
    <p class="note" style="padding:14px 18px 0">Each slot opens when you reach it. Eight Insight, shared, never refilled.</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Open tray 1</div></div></div>` });
  out.push({ name: 'Case start', html: `<div class="o2">${top('Case 4 of 10', 'Insight 8 of 8')}${tabs(prior(4).map((s, i) => i === 3 ? 'todo' : s), 4)}
    <p class="note" style="padding:20px 18px 4px">${esc(c4.lens)}</p><h1>${esc(c4.title)}</h1><p class="q" style="margin-top:14px">${esc(c4.question)}</p>
    <div class="tray" style="margin-top:18px"><div class="slot" style="height:80px">${c4.free.length} specimens in the tray.<br>One slot is empty.</div></div>
    <p class="note" style="padding:12px 18px 0">Reading is free. Every clue is true on 31 December of the hidden year.</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Open the tray</div></div></div>` });
  const b4 = bracket(c4);
  out.push({ name: 'Active hunt', html: `<div class="o2">${top('Case 4 of 10', 'Insight 6 of 8')}${tabs(prior(4).map((s, i) => i === 3 ? 'todo' : s), 4)}
    <p class="q" style="padding-top:14px">${esc(c4.question)}</p>${b4.html(1920)}${chips(c4.editorial.c0, 1920)}
    <p class="note" style="padding:10px 18px 0">${c4.editorial.c0.length} possible years. The third clue is in Evidence.</p>
    <div class="acts"><div class="btn">Evidence</div><div class="btn primary">Lock ${label(1920)}</div></div></div>` });
  out.push({ name: 'Evidence', html: `<div class="o2">${top('Case 4 of 10', 'Insight 6 of 8')}${tabs(prior(4).map((s, i) => i === 3 ? 'todo' : s), 4)}
    <h1 style="font-size:26px;padding-top:16px">Evidence</h1>
    <div class="tray">${c4.free.map(f => `<div class="spec" style="grid-template-columns:1fr"><span class="t">${esc(f.text)}<br><span class="note">${esc(f.anchor.label)}, ${esc(f.anchor.date)}</span></span></div>`).join('')}</div>
    <p style="font:700 17px/1 var(--sans);padding:16px 18px 0">Sealed clues</p>
    <div style="padding:0 18px">${c4.paid.map(x => `<div class="env"><span><b>${esc(x.category)}</b><br><span class="note">${x.tier === 'nudge' ? 'Nudge' : 'Deep clue'}</span></span><span class="btn" style="min-height:46px">Open, ${x.cost} Insight</span></div>`).join('')}</div>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn">Back to the tray</div></div></div>` });
  const b5 = bracket(c5);
  out.push({ name: 'Missing a case', html: `<div class="o2">${top('Case 5 of 10', 'Insight 4 of 8')}${tabs(prior(5).map((s, i) => i === 4 ? 'missed' : s), 5)}
    <p class="note" style="padding:20px 18px 4px"><span class="mk missed"></span>&nbsp; Missed. You locked 1798.</p>
    <div class="tray"><div class="slot" style="border-style:solid;font:400 44px/1 var(--serif);height:84px">${label(c5.target.year)}</div></div>
    <p style="padding:14px 18px 0;font-size:16.5px;line-height:1.4">${esc(c5.editorial.miss_explanation)}</p>
    <p class="note" style="padding:10px 18px 0">${esc(c5.reveal[0].title)}. ${esc(c5.reveal[0].text)}</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Next tray</div></div></div>` });
  out.push({ name: 'Lock success', dark: true, html: `<div class="o2" style="background:var(--soot);height:844px;color:var(--bone-on-soot)">${top('Case 6 of 10', 'Insight 4 of 8')}
    <div style="height:130px"></div><div class="brassrule"></div><div class="big">${label(c6.target.year)}</div><div class="brassrule"></div>
    <p style="padding:22px 18px 0;font:400 22px/1.25 var(--serif)">Solved. ${esc(c6.target.event.replace(/ \(.*/, ''))}.</p>
    <p style="padding:12px 18px 0;font-size:16.5px;line-height:1.45;color:var(--muted-on-soot)">${esc(c6.reveal[1].text)}</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Next tray</div></div></div>` });
  const six = DAY.slice(0, 6);
  out.push({ name: 'Progress after six cases', html: `<div class="o2">${top('Six trays filled', 'Insight 3 of 8')}
    <h1 style="font-size:28px;padding-top:18px">Your drawer so far</h1>
    <div class="drawer" style="margin-top:14px">${DAY.map((d, i) => i < 6 ? `<div class="cell ${d.s}"><span>${d.n}</span><span class="y">${label(d.year)}</span></div>` : `<div class="cell ${i === 6 ? 'next' : 'todo'}"><span>${d.n}</span><span></span></div>`).join('')}</div>
    <p class="note" style="padding:14px 18px 0"><span class="mk clean"></span> solved &nbsp; <span class="mk assisted"></span> with help &nbsp; <span class="mk missed"></span> missed</p>
    <p style="padding:10px 18px 0;font-size:16.5px;line-height:1.45">Four trays left. The drawer shows only the years you have already found.</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Open tray 7</div></div></div>` });
  const all = [...DAY].sort((a, b) => a.year - b.year);
  out.push({ name: 'Final ten-case atlas', html: `<div class="o2">${top('The Daily Ten, complete', 'Insight 0 of 8')}
    <h1 style="font-size:28px;padding-top:16px">9 of 10 solved</h1><p class="note" style="padding:4px 18px 10px">Sample day, not a real result. Oldest on the left.</p>
    <div class="drawer">${all.map(d => `<div class="cell ${d.s}" style="aspect-ratio:3/4.4"><span>${d.n}</span><span class="y">${label(d.year)}</span></div>`).join('')}</div>
    <p class="note" style="padding:14px 18px 0">Two trays hold 1977. Nothing connects them. They share a year.</p>
    <div class="acts" style="grid-template-columns:1fr 1fr"><div class="btn">Share</div><div class="btn primary">Explore the shelf</div></div></div>` });
  return out;
}
