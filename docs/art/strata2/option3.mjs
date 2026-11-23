// OPTION III: EDITORIAL. Field notes. Type leads; evidence reads as numbered notes; years are a line of numerals; the day is an index.
import { C, label, DAY, esc } from './data.mjs';

export const css = `
.o3{font-family:var(--sans)}
.o3 .top{display:flex;justify-content:space-between;align-items:baseline;padding:0 22px;height:40px;font:600 15px/1 var(--sans)}
.o3 .rule{height:2px;background:var(--ink);margin:0 22px}
.o3 h1{font:400 38px/1.04 var(--serif);padding:0 22px}
.o3 .q{font:400 23px/1.28 var(--serif);padding:0 22px}
.o3 .kick{font:600 16px/1 var(--sans);color:var(--muted);padding:0 22px}
.o3 .notes{padding:0 22px;counter-reset:n}.o3 .notes p{font:400 17.5px/1.5 var(--serif);margin:12px 0 0 28px;position:relative}
.o3 .notes p:before{counter-increment:n;content:counter(n);position:absolute;left:-28px;top:2px;font:700 15px/1.4 var(--sans);color:var(--oxide);width:22px}
.o3 .years{display:flex;justify-content:space-between;margin:16px 22px 0;border-top:2px solid var(--ink);border-bottom:2px solid var(--ink)}
.o3 .yr{flex:1;text-align:center;padding:16px 0 14px;font:400 22px/1 var(--serif);font-variant-numeric:tabular-nums;border-left:1.5px solid var(--rule)}
.o3 .yr:first-child{border-left:0}.o3 .yr.sel{background:var(--ink);color:var(--bone)}
.o3 .acts{position:absolute;left:22px;right:22px;bottom:26px;display:grid;grid-template-columns:1fr 1.5fr;gap:10px}
.o3 .note{font-size:15px;line-height:1.4;color:var(--muted);padding:0 22px}
.o3 .idx{margin:12px 22px 0}.o3 .li{display:flex;align-items:baseline;gap:8px;padding:10px 0;border-bottom:1.5px solid var(--rule);font-size:17px}
.o3 .li .l{flex:1}.o3 .li .d{flex:0 0 28px;border-bottom:2px dotted var(--rule);align-self:end;height:12px;flex:1}.o3 .li .a{font:400 22px/1 var(--serif);font-variant-numeric:tabular-nums}
.o3 .big{font:400 96px/.95 var(--serif);padding:18px 22px;background:#2A2825;color:var(--bone-on-soot)}
.o3 .brassrule{height:3px;background:var(--brass)}
.o3 .clue{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-top:1.5px solid var(--rule)}
.o3 .bar{height:12px;background:var(--ink)}
`;
const top = (l, r) => `<div class="safe"></div><div class="top"><span>${l}</span><span>${r}</span></div><div class="rule"></div>`;
const li = (n, t, a, mk) => `<div class="li"><span class="l"><span class="mk ${mk}"></span>&nbsp; ${n}. ${esc(t)}</span><span class="d"></span><span class="a">${a}</span></div>`;

export function screens() {
  const c4 = C('case-04'), c5 = C('case-05'), c6 = C('case-06');
  const out = [];
  out.push({ name: 'Home and Daily Trail', html: `<div class="o3">${top('Monday 23 November', 'Insight 8 of 8')}
    <p class="kick" style="padding-top:22px"><span class="tag">Draft pack, sample day</span></p><h1 style="padding-top:12px;font-size:42px">The Daily Ten</h1>
    <p class="q" style="padding-top:12px;font-size:19px">Ten questions, each with one hidden year. Eight Insight to share.</p>
    <div class="idx">${DAY.slice(0, 5).map((d, i) => `<div class="li"><span class="l"><span class="mk ${i === 0 ? 'next' : 'todo'}"></span>&nbsp; ${d.n}. ${esc(d.c.lens)}</span><span class="d"></span><span class="note" style="padding:0">${i === 0 ? 'Next' : ''}</span></div>`).join('')}<div class="li"><span class="l note" style="padding:0">Five more to come</span></div></div>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Begin with question 1</div></div></div>` });
  out.push({ name: 'Case start', html: `<div class="o3">${top('Question 4 of 10', 'Insight 8 of 8')}
    <p class="kick" style="padding-top:26px">${esc(c4.lens)}</p><h1 style="padding-top:10px">${esc(c4.title)}</h1>
    <p class="q" style="padding-top:18px">${esc(c4.question)}</p>
    <p class="note" style="padding-top:20px">${c4.free.length} notes to read, free. They leave ${c4.editorial.c0.length} possible years. Every clue is true on 31 December of the hidden year.</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Read the notes</div></div></div>` });
  out.push({ name: 'Active hunt', html: `<div class="o3">${top('Question 4 of 10', 'Insight 6 of 8')}
    <p class="q" style="padding-top:16px;font-size:20px">${esc(c4.question)}</p>
    <div class="notes">${c4.free.map(f => `<p>${esc(f.text)}</p>`).join('')}</div>
    <div class="years">${[...c4.editorial.c0].map(y => `<span class="yr ${y === 1920 ? 'sel' : ''}">${y}</span>`).join('')}</div>
    <p class="note" style="padding-top:10px">${c4.editorial.c0.length} possible years. Choose one, then lock it.</p>
    <div class="acts"><div class="btn">Extra clues</div><div class="btn primary">Lock ${label(1920)}</div></div></div>` });
  out.push({ name: 'Evidence', html: `<div class="o3">${top('Question 4 of 10', 'Insight 6 of 8')}
    <h1 style="font-size:28px;padding-top:16px">Extra clues</h1><p class="note" style="padding-top:8px">The notes you have already read stay on the previous page.</p>
    <div class="idx">${c4.paid.map(x => `<div class="clue"><span><b style="font-size:19px">${esc(x.category)}</b><br><span class="note" style="padding:0">${x.tier === 'nudge' ? 'Nudge' : 'Deep clue'}</span></span><span class="btn" style="min-height:46px">Reveal, ${x.cost} Insight</span></div>`).join('')}</div>
    <p class="note" style="padding-top:12px">A clue that tells you nothing new costs nothing.</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn">Back to the notes</div></div></div>` });
  out.push({ name: 'Missing a case', html: `<div class="o3">${top('Question 5 of 10', 'Insight 4 of 8')}
    <p class="kick" style="padding-top:22px"><span class="mk missed"></span>&nbsp; Missed. You locked 1798.</p><h1 style="padding-top:10px;font-size:46px">${label(c5.target.year)}</h1>
    <p class="q" style="padding-top:14px;font-size:19px;line-height:1.4">${esc(c5.editorial.miss_explanation)}</p>
    <p class="note" style="padding-top:16px"><b>${esc(c5.reveal[0].title)}.</b> ${esc(c5.reveal[0].text)}</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Next question</div></div></div>` });
  out.push({ name: 'Lock success', dark: true, html: `<div class="o3" style="background:var(--soot);height:844px;color:var(--bone-on-soot)">${top('Question 6 of 10', 'Insight 4 of 8').replace(/var\(--ink\)/g, 'x')}
    <div style="height:120px"></div><div class="brassrule"></div><div class="big">${label(c6.target.year)}</div><div class="brassrule"></div>
    <p class="q" style="padding-top:22px;font-size:21px">Solved. ${esc(c6.target.event.replace(/ \(.*/, ''))}.</p>
    <p style="padding:12px 22px 0;font:400 17px/1.5 var(--serif);color:var(--muted-on-soot)">${esc(c6.reveal[1].text)}</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Next question</div></div></div>` });
  out.push({ name: 'Progress after six cases', html: `<div class="o3">${top('Six of ten answered', 'Insight 3 of 8')}
    <h1 style="font-size:30px;padding-top:18px">The day so far</h1>
    <div class="idx">${DAY.slice(0, 6).map(d => li(d.n, d.c.title, label(d.year), d.s)).join('')}<div class="li"><span class="l"><span class="mk next"></span>&nbsp; 7. Next question</span></div></div>
    <p class="note" style="padding-top:12px"><span class="mk clean"></span> solved &nbsp; <span class="mk assisted"></span> with help &nbsp; <span class="mk missed"></span> missed</p>
    <div class="acts" style="grid-template-columns:1fr"><div class="btn primary">Question 7</div></div></div>` });
  const all = [...DAY].sort((a, b) => a.year - b.year);
  out.push({ name: 'Final ten-case atlas', html: `<div class="o3">${top('The Daily Ten, complete', 'Insight 0 of 8')}
    <h1 style="font-size:30px;padding-top:16px">9 of 10 solved</h1><p class="note" style="padding-top:4px">Sample day, not a real result. Oldest first, with the years between.</p>
    <div class="idx" style="margin-top:8px">${all.map((d, i) => `${i ? `<div class="note" style="padding:2px 0 2px 24px;font-size:14px;border-left:2px dotted var(--rule);margin-left:8px">${(d.year - all[i - 1].year) ? (d.year - all[i - 1].year).toLocaleString('en') + ' years' : 'same year'}</div>` : ''}<div class="li" style="padding:3px 0;border:0"><span class="l" style="font-size:16px"><span class="mk ${d.s}"></span>&nbsp; ${esc(d.c.title)}</span><span class="a" style="font-size:20px">${label(d.year)}</span></div>`).join('')}</div>
    <div class="acts" style="grid-template-columns:1fr 1fr"><div class="btn">Share</div><div class="btn primary">Read the plate</div></div></div>` });
  return out;
}
