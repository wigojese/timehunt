// OPTION I: INSTRUMENT. The core is the hero. Years are stacked layers you press; bank is a row of eight pegs; the day is a segmented strip.
import { C, label, DAY, STATUS_WORD, esc } from './data.mjs';

export const css = `
.o1 .top{display:flex;justify-content:space-between;align-items:center;padding:0 20px;height:40px;font:600 15px/1 var(--sans)}
.o1 .pegs{display:flex;gap:4px;align-items:center}.o1 .peg{width:12px;height:20px;border:2px solid var(--ink);background:var(--ink)}.o1 .peg.off{background:transparent;border-style:dashed}
.o1 .strip{display:flex;gap:3px;padding:0 20px;margin-top:8px}.o1 .seg{flex:1;height:14px;border:2px solid var(--ink)}
.o1 .seg.clean{background:var(--ink)}.o1 .seg.assisted{background:linear-gradient(90deg,var(--ink) 50%,transparent 50%)}.o1 .seg.missed{background:linear-gradient(to top right,transparent 44%,var(--ink) 44% 56%,transparent 56%)}.o1 .seg.todo{border-style:dotted}.o1 .seg.now{outline:3px solid var(--oxide);outline-offset:1px}
.o1 h1{font:400 34px/1.02 var(--serif);padding:0 20px}
.o1 .q{font:400 20px/1.3 var(--serif);padding:0 20px}
.o1 .body{padding:0 20px;font-size:17px;line-height:1.45}
.o1 .core{margin:14px 20px 0;border:2px solid var(--ink);background:var(--paper)}
.o1 .band{display:flex;align-items:center;justify-content:space-between;padding:0 14px;min-height:52px;border-bottom:2px solid var(--ink)}
.o1 .band:last-child{border-bottom:0}
.o1 .band .y{font:700 40px/1 var(--cond);font-variant-numeric:tabular-nums;letter-spacing:.5px}
.o1 .band.cut{min-height:46px;font:600 15px/1.25 var(--sans);color:var(--ink)}
.o1 .band.sel{background:var(--paper);box-shadow:inset 10px 0 0 var(--oxide)}
.o1 .band.sel .y{padding-left:12px}
.o1 .flag{font:700 15px/1 var(--sans);background:var(--oxide);color:#fff;padding:7px 9px}
.o1 .acts{position:absolute;left:20px;right:20px;bottom:26px;display:grid;grid-template-columns:1fr 1.5fr;gap:10px}
.o1 .note{font-size:15px;line-height:1.4;color:var(--muted)}
.o1 .row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:2px solid var(--ink)}
.o1 .row:first-child{border-top:0}
.o1 .sheet{margin:10px 20px 0;border:2px solid var(--ink);background:var(--paper)}.o1 .sheet .row{padding:12px 14px}
.o1 .dk h1,.o1 .dk .y{color:var(--bone-on-soot)}
.o1 .dk .brassrule{height:3px;background:var(--brass);margin:0 20px}
.o1 .big{font:400 88px/0.95 var(--serif);padding:0 20px;letter-spacing:-1px}
.o1 .tl{display:grid;grid-template-columns:76px 1fr auto;gap:6px 12px;align-items:center;padding:11px 14px;border-bottom:2px solid var(--ink);font-size:16px}
.o1 .tl:last-child{border-bottom:0}
.o1 .rb{display:block;height:6px;background:var(--ink);margin-top:4px}.o1 .tl .y{font:700 28px/1 var(--cond)}
`;

const pegs = (n, of = 8) => `<span class="pegs" aria-label="Insight ${n} of ${of}">${Array.from({ length: of }, (_, i) => `<span class="peg ${i < n ? '' : 'off'}"></span>`).join('')}</span>`;
const strip = (states, now) => `<div class="strip">${states.map((s, i) => `<span class="seg ${s} ${i + 1 === now ? 'now' : ''}"></span>`).join('')}</div>`;
const top = (txt, n) => `<div class="safe"></div><div class="top"><span>${txt}</span><span style="display:flex;gap:10px;align-items:center">${pegs(n)}<span>Insight ${n} of 8</span></span></div>`;
const allTodo = Array(10).fill('todo');
const bands = (c, sel) => {
  const lo = c.corridor[0], hi = c.corridor[1], cs = c.editorial.c0;
  const later = `<div class="band cut hatch"><span>${label(cs[cs.length - 1] + 1)} to ${label(hi)} ruled out</span><span>by free evidence</span></div>`;
  const mid = [...cs].reverse().map(y => `<div class="band ${y === sel ? 'sel' : ''}"><span class="y">${label(y)}</span>${y === sel ? '<span class="flag">Selected</span>' : '<span class="note">Press to select</span>'}</div>`).join('');
  const earlier = `<div class="band cut hatch"><span>${label(lo)} to ${label(cs[0] - 1)} ruled out</span><span>by free evidence</span></div>`;
  return `<div class="core">${later}${mid}${earlier}</div>`;
};

export function screens() {
  const c4 = C('case-04'), c5 = C('case-05'), c6 = C('case-06');
  const out = [];
  // 1 Home / Daily Trail
  out.push({ name: 'Home and Daily Trail', html: `<div class="o1">${top('Mon 23 Nov', 8)}${strip(['next', ...Array(9).fill('todo')].map((s, i) => i ? 'todo' : 'todo'), 1)}
    <div style="padding:26px 20px 0"><span class="tag">Draft pack, sample day</span></div>
    <h1 style="margin-top:14px">The Daily Ten</h1>
    <p class="body" style="margin-top:12px">Ten cases. One hidden year in each. Eight Insight for the whole day.</p>
    <div class="sheet" style="margin-top:24px">${[1, 2, 3].map(n => `<div class="row"><span><span class="mk ${n === 1 ? 'next' : 'todo'}"></span>&nbsp; Case ${n}</span><span class="note">${n === 1 ? 'Next' : 'To come'}</span></div>`).join('')}<div class="row"><span class="note">Cases 4 to 10 open as you go</span><span></span></div></div>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Start case 1</div></div>
    <div style="position:absolute;bottom:92px;left:20px;right:20px;display:flex;justify-content:space-between;font:600 16px/1 var(--sans)"><span>Practice</span><span>How it works</span></div></div>` });
  // 2 Case start
  out.push({ name: 'Case start', html: `<div class="o1">${top('Case 4 of 10', 8)}${strip(['clean', 'assisted', 'assisted', 'todo', ...Array(6).fill('todo')], 4)}
    <p class="note" style="padding:22px 20px 6px">${esc(c4.lens)}</p><h1>${esc(c4.title)}</h1>
    <p class="q" style="margin-top:16px">${esc(c4.question)}</p>
    <div class="sheet" style="margin-top:22px"><div class="row"><span>Years in play</span><b>${label(c4.corridor[0])} to ${label(c4.corridor[1])}</b></div><div class="row"><span>Free evidence</span><b>${c4.free.length} pieces</b></div><div class="row"><span>Still possible after reading</span><b>${c4.editorial.c0.length} years</b></div></div>
    <p class="note" style="padding:14px 20px 0">Reading is free. Every clue is true on 31 December of the hidden year.</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Read the evidence</div></div></div>` });
  // 3 Active hunt
  out.push({ name: 'Active hunt', html: `<div class="o1">${top('Case 4 of 10', 6)}${strip(['clean', 'assisted', 'assisted', 'todo', ...Array(6).fill('todo')], 4)}
    <p class="q" style="padding-top:14px">${esc(c4.question)}</p>
    <p class="note" style="padding:6px 20px 0">${c4.editorial.c0.length} possible years. Press a layer, then lock it.</p>
    ${bands(c4, 1920)}
    <div class="acts"><div class="btn">Evidence</div><div class="btn primary">Lock ${label(1920)}</div></div></div>` });
  // 4 Evidence
  const p = c4.paid;
  out.push({ name: 'Evidence', html: `<div class="o1">${top('Case 4 of 10', 6)}${strip(['clean', 'assisted', 'assisted', 'todo', ...Array(6).fill('todo')], 4)}
    <h1 style="font-size:28px;padding-top:16px">Evidence</h1>
    <div class="sheet">${c4.free.map(f => `<div class="row" style="display:block"><p style="font-size:16.5px;line-height:1.4">${esc(f.text)}</p><p class="note">${esc(f.anchor.label)}, ${esc(f.anchor.date)}</p></div>`).join('')}</div>
    <p style="font:700 17px/1 var(--sans);padding:16px 20px 6px">Extra clues</p>
    <div class="sheet" style="margin-top:0">${p.map(x => `<div class="row"><span><b>${esc(x.category)}</b><br><span class="note">${x.tier === 'nudge' ? 'Nudge' : 'Deep clue'}</span></span><span class="btn" style="min-height:46px">Reveal, ${x.cost} Insight</span></div>`).join('')}</div>
    <p class="note" style="padding:10px 20px 0">A clue that tells you nothing new costs nothing.</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn">Back to the core</div></div></div>` });
  // 5 Missing a case
  const proof = Object.values(c5.editorial.uniqueness_proof);
  out.push({ name: 'Missing a case', html: `<div class="o1">${top('Case 5 of 10', 4)}${strip(['clean', 'assisted', 'assisted', 'clean', 'missed', ...Array(5).fill('todo')], 5)}
    <p class="note" style="padding:20px 20px 4px"><span class="mk missed"></span>&nbsp; Missed. You locked 1798.</p>
    <p class="body" style="font:400 21px/1.3 var(--serif)">The answer is ${label(c5.target.year)}.</p>
    <div class="sheet" style="margin-top:14px"><div class="row" style="display:block"><p style="font-size:16.5px;line-height:1.4">${esc(c5.editorial.miss_explanation)}</p></div><div class="row" style="display:block"><p class="note">${esc(c5.reveal[0].title)}</p><p style="font-size:16.5px;line-height:1.4">${esc(c5.reveal[0].text)}</p></div></div>
    <p class="note" style="padding:12px 20px 0">A miss never ends your day. Five cases to go with 4 Insight.</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Next case</div></div></div>` });
  // 6 Lock success
  out.push({ name: 'Lock success', dark: true, html: `<div class="o1 dk" style="background:var(--soot);height:844px;color:var(--bone-on-soot)">${top('Case 6 of 10', 4).replace(/var\(--ink\)/g, 'var(--bone-on-soot)')}
    <div style="height:150px"></div><div class="brassrule"></div><div class="big" style="padding:14px 20px;background:#2A2825;color:var(--bone-on-soot)">${label(c6.target.year)}</div><div class="brassrule"></div>
    <p class="body" style="margin-top:22px;font:400 22px/1.25 var(--serif)">Solved. ${esc(c6.target.event.replace(/ \(.*/, ''))}.</p>
    <p class="body" style="margin-top:12px;color:var(--muted-on-soot)">${esc(c6.reveal[1].text)}</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Next case</div></div></div>` });
  // 7 Partial progress after six
  const six = DAY.slice(0, 6);
  out.push({ name: 'Progress after six cases', html: `<div class="o1">${top('Six cases done', 3)}${strip([...six.map(d => d.s), ...Array(4).fill('todo')], 7)}
    <h1 style="font-size:30px;padding-top:18px">Your core so far</h1>
    <div class="core" style="margin-top:12px">${[...six].sort((a, b) => b.year - a.year).map(d => `<div class="tl"><span class="y">${label(d.year)}</span><span>${esc(d.c.title)}</span><span><span class="mk ${d.s}"></span></span></div>`).join('')}</div>
    <p class="note" style="padding:10px 20px 0"><span class="mk clean"></span> solved &nbsp; <span class="mk assisted"></span> with help &nbsp; <span class="mk missed"></span> missed</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Case 7</div></div></div>` });
  // 8 Final atlas
  const all = [...DAY].sort((a, b) => a.year - b.year);
  out.push({ name: 'Final ten-case atlas', html: `<div class="o1">${top('Day complete', 0)}${strip(DAY.map(d => d.s), 0)}
    <h1 style="font-size:30px;padding-top:16px">9 of 10 solved</h1><p class="note" style="padding:4px 20px 0">0 Insight left. Sample day, not a real result.</p>
    <div class="core" style="margin-top:12px">${all.map(d => `<div class="tl" style="padding:7px 14px"><span class="y" style="font-size:24px">${label(d.year)}</span><span style="font-size:15.5px">${esc(d.c.title)}<span class="rb" style="width:${Math.max(6, Math.round(100 * (1 - Math.sqrt(Math.max(0, 2026 - d.year)) / Math.sqrt(2030))))}%"></span></span><span><span class="mk ${d.s}"></span></span></div>`).join('')}</div>
    <div class="acts" style="grid-template-columns:1fr 1fr"><div class="btn">Share</div><div class="btn primary">Explore the core</div></div></div>` });
  return out;
}
