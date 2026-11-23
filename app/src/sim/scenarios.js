// Scripted and seeded play, used by tests, the demo CLI and the video recorder. Not part of the game.
import { createExpedition, transition, stateDigest, score, cluesFor } from '../engine/engine.js';
import { rng } from '../engine/rng.js';

let n = 0;
export const aid = prefix => `${prefix}-${++n}`;

/** The scripted day required by the Stage 4 brief. Returns {state, log, attempts}. */
export function scriptedDay(content, rules, { traceVariant = false } = {}) {
  let s = createExpedition(content, rules);
  const attempts = [];
  let k = 0;
  const run = (cmd, note) => {
    const r = transition(s, { ...cmd, actionId: `scripted-${++k}` }, content, rules);
    attempts.push({ note, type: cmd.type, ok: !r.error, code: r.error ? r.error.code : null, insight: r.next.insight });
    s = r.next;
    return r;
  };
  const plan = [
    { reveal: 'p2', note: 'case 1: Deep clue' },
    { reveal: 'p2', note: 'case 2: Deep clue (pay on case 2)' },
    { reveal: 'p1', note: 'case 3: Nudge' },
    { note: 'case 4: free evidence only' },
    { wrong: true, note: 'case 5: a miss, the day continues' },
    { note: 'case 6: free evidence only' },
    { reveal: 'p1', note: 'case 7: Nudge (pay on case 7)' },
    { reveal: 'p1', note: 'case 8: Nudge' },
    { reveal: 'p1', note: 'case 9: Nudge, spends the last Insight' },
    { reveal: 'p1', note: 'case 10: try to buy with zero Insight (refused)', expectRefused: true },
  ];
  content.cases.forEach((cc, i) => {
    const step = plan[i];
    if (step.reveal) run({ type: 'REVEAL', caseId: cc.id, clueId: step.reveal }, step.note);
    const cs = s.cases[s.cursor];
    const year = step.wrong ? cs.C.find(y => y !== cc.target) : cc.target;
    run({ type: 'LOCK', caseId: cc.id, year }, step.note + ' / lock');
    run({ type: 'ADVANCE', caseId: cc.id }, 'advance');
  });
  return { state: s, log: s.log, attempts };
}

/** A seeded random player. Same seed, same log. */
export function botDay(content, rules, seed, { buyChance = 0.5, lockChance = 1 } = {}) {
  const r = rng(seed);
  let s = createExpedition(content, rules);
  let k = 0;
  const act = cmd => { const t = transition(s, { ...cmd, actionId: `bot${seed}-${++k}` }, content, rules); s = t.next; return t; };
  for (let i = 0; i < content.cases.length; i++) {
    const cc = content.cases[i];
    const cs = () => s.cases[s.cursor];
    const clues = cluesFor(cc, rules).map(c => c.id);
    while (clues.length && r() < buyChance) { const id = clues.splice(r.int(clues.length), 1)[0]; act({ type: 'REVEAL', caseId: cc.id, clueId: id }); }
    act({ type: 'LOCK', caseId: cc.id, year: r.pick(cs().C) });
    act({ type: 'ADVANCE', caseId: cc.id });
  }
  return { state: s, log: s.log, digest: stateDigest(s), score: score(s) };
}
