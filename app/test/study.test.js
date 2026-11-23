import test from 'node:test';
import assert from 'node:assert/strict';
import { summarise, toCsv } from '../scripts/summarise-study.mjs';

// SYNTHETIC log written by hand for this test. It is not player data.
const log = { participant: 'SYNTH', cond: 'A', events: [
  { t: 0, e: 'session_start', resumed: false },
  { t: 10, e: 'view', cursor: 0, status: 'active', insight: 8 },
  { t: 20000, e: 'reveal', caseId: 'case-01', ok: true, insight: 6 },
  { t: 70000, e: 'lock', caseId: 'case-01', ok: true, correct: true, insight: 6 },
  { t: 70100, e: 'view', cursor: 0, status: 'active', insight: 6 },
  { t: 71000, e: 'next', ok: true },
  { t: 71100, e: 'view', cursor: 1, status: 'active', insight: 6 },
  { t: 80000, e: 'reveal', caseId: 'case-02', ok: false, code: 'INSUFFICIENT_INSIGHT', insight: 6 },
  { t: 90000, e: 'lock', caseId: 'case-02', ok: true, correct: false, insight: 6 },
] };

test('study summary: time per case, purchases, Insight spent, correctness, refusals, long pauses', () => {
  const s = summarise(log);
  assert.equal(s.cases.length, 2);
  assert.deepEqual(s.cases[0], { case: 1, seconds: 70, cluesBought: 1, insightSpent: 2, correct: true, refusedActions: 0 });
  assert.equal(s.cases[1].correct, false);
  assert.equal(s.cases[1].refusedActions, 1);
  assert.equal(s.longPausesOver30s, 1);
  assert.match(toCsv([s]), /^participant,cond,case,seconds/);
});
