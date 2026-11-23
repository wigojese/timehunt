// Turns downloaded study logs into a per-case table. Usage: node scripts/summarise-study.mjs log1.json [log2.json ...] > summary.csv
// Reads only timings and choices recorded by the study mode. Contains no personal data.
import { readFileSync } from 'node:fs';

export function summarise(log) {
  const ev = log.events.slice().sort((a, b) => a.t - b.t);
  const rows = [];
  let cur = null, last = 0, longPauses = 0, reloads = 0;
  for (const e of ev) {
    if (e.e === 'session_start' && e.resumed) reloads++;
    if (e.t - last > 30000 && last) longPauses++;
    last = e.t;
    if (e.e === 'view' && e.status === 'active' && (!cur || cur.cursor !== e.cursor)) {
      cur = { cursor: e.cursor, start: e.t, reveals: 0, spent0: null, refused: 0, correct: null, end: null, insightAtStart: e.insight, longPauses: 0 };
      rows.push(cur);
    }
    if (!cur) continue;
    if (e.e === 'reveal' && e.ok) cur.reveals++;
    if ((e.e === 'reveal' || e.e === 'lock') && !e.ok) cur.refused++;
    if (e.e === 'lock' && e.ok && cur.end === null) { cur.end = e.t; cur.correct = e.correct === true; cur.insightAtEnd = e.insight; }
  }
  return {
    participant: log.participant, cond: log.cond, reloads, longPausesOver30s: longPauses,
    cases: rows.map(r => ({ case: r.cursor + 1, seconds: r.end === null ? null : Math.round((r.end - r.start) / 100) / 10, cluesBought: r.reveals, insightSpent: r.end === null ? null : r.insightAtStart - r.insightAtEnd, correct: r.correct, refusedActions: r.refused })),
  };
}
export function toCsv(summaries) {
  const lines = ['participant,cond,case,seconds,clues_bought,insight_spent,correct,refused_actions'];
  for (const s of summaries) for (const c of s.cases) lines.push([s.participant, s.cond, c.case, c.seconds, c.cluesBought, c.insightSpent, c.correct, c.refusedActions].join(','));
  return lines.join('\n');
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2);
  if (!files.length) { console.error('usage: node scripts/summarise-study.mjs study-log.json ...'); process.exit(2); }
  console.log(toCsv(files.map(f => summarise(JSON.parse(readFileSync(f, 'utf8'))))));
}
