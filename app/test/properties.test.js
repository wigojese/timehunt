import test from 'node:test';
import assert from 'node:assert/strict';
import { createExpedition, transition, stateDigest, replay, score } from '../src/engine/engine.js';
import { rng } from '../src/engine/rng.js';
import { scriptedDay, botDay } from '../src/sim/scenarios.js';
import { loadContent, rules } from './helpers.js';

const content = loadContent();

const VARIANTS = {
  c1: rules(),
  noRefund: rules({ refundRedundant: false }),
  cap1: rules({ perCaseCap: 1 }),
  trace: rules({ trace: { enabled: true, cost: 2 } }),
  relDeep: rules({ relationTier: 'deep' }),
  small: rules({ insight: 3 }),
};

function randomCommand(r, s, rl) {
  const cs = s.cases[s.cursor];
  const cc = content.cases[s.cursor];
  const caseId = r() < 0.04 ? r.pick(content.cases).id : cc.id; // sometimes the wrong case
  const k = r.int(10);
  const actionId = r() < 0.1 && s.applied.length ? r.pick(s.applied) : `f${r.int(1e9)}`; // sometimes a repeated id
  if (k < 4) return { type: 'REVEAL', caseId, clueId: r.pick([...cc.clues.map(c => c.id), 'f3', 'zz']), actionId };
  if (k < 5) return { type: 'TRACE', caseId, year: cc.corridor[0] + r.int(cc.corridor[1] - cc.corridor[0] + 1), actionId };
  if (k < 8) return { type: 'LOCK', caseId, year: r() < 0.7 ? r.pick(cs.C.length ? cs.C : [cc.target]) : cc.corridor[0] - 1 + r.int(40), actionId };
  return { type: 'ADVANCE', caseId, actionId };
}

function invariants(s, rl, initial) {
  assert.ok(s.insight >= 0 && s.insight <= initial, `insight ${s.insight}`);
  const spent = s.cases.reduce((a, c) => a + c.spent, 0);
  assert.equal(s.insight + spent, initial, 'bank conserved: nothing refills, nothing vanishes');
  s.cases.forEach((c, i) => {
    const cc = content.cases[i];
    if (c.status !== 'not_started') assert.ok(c.C.includes(cc.target), `target left candidates in ${c.id}`);
    assert.equal(new Set(c.revealed).size, c.revealed.length, 'clue revealed twice');
    if (rl.perCaseCap !== null) assert.ok(c.spent <= rl.perCaseCap);
    if (c.status === 'not_started') assert.ok(i > s.cursor);
    if (i < s.cursor) assert.ok(['solved_clean', 'solved_assisted', 'missed'].includes(c.status), 'earlier case left unresolved');
  });
  assert.equal(new Set(s.applied).size, s.applied.length);
  assert.equal(s.log.length, s.applied.length);
}

for (const [name, rl] of Object.entries(VARIANTS)) {
  test(`fuzz (${name}): 300 random sessions keep every invariant`, () => {
    for (let seed = 1; seed <= 300; seed++) {
      const r = rng(seed * 7919);
      let s = createExpedition(content, rl);
      const init = s.insightInitial;
      for (let i = 0; i < 120; i++) {
        const before = s;
        const t = transition(s, randomCommand(r, s, rl), content, rl);
        if (t.error) assert.equal(t.next, before, 'refused command must not change state');
        s = t.next;
        invariants(s, rl, init);
      }
      const { state, errors } = replay(content, rl, {}, s.log);
      assert.equal(errors.length, 0);
      assert.equal(stateDigest(state), stateDigest(s), `replay diverged (seed ${seed})`);
    }
  });
}

test('seed reproducibility: same seed gives the same day, different seeds give different days', () => {
  const rl = rules();
  const a = botDay(content, rl, 20261123), b = botDay(content, rl, 20261123), c = botDay(content, rl, 20261124);
  assert.equal(a.digest, b.digest);
  assert.deepEqual(a.log, b.log);
  assert.notEqual(a.digest, c.digest);
  assert.equal(a.state.status, 'completed');
});

test('bot days under every variant end completed with a legal score', () => {
  for (const [name, rl] of Object.entries(VARIANTS)) {
    for (let seed = 1; seed <= 50; seed++) {
      const d = botDay(content, rl, seed);
      assert.equal(d.state.status, 'completed', name);
      const sc = score(d.state);
      assert.equal(sc.solved + sc.missed, 10);
      assert.ok(sc.insightLeft >= 0);
    }
  }
});

test('scripted day: case 1 to 10, a miss on 5, payments on 2 and 7, last token spent on 9, finishes with zero Insight', () => {
  const rl = rules();
  const { state, attempts } = scriptedDay(content, rl);
  assert.equal(state.status, 'completed');
  assert.equal(state.insight, 0);
  const sc = score(state);
  assert.equal(sc.missed, 1);
  assert.equal(sc.solved, 9);
  assert.equal(state.cases[4].status, 'missed');
  assert.ok(state.cases[1].spent === 2 && state.cases[6].spent === 1);
  assert.equal(state.cases[8].spent, 1);
  const last = attempts.find(a => a.note.startsWith('case 10: try'));
  assert.equal(last.ok, false);
  assert.equal(last.code, 'INSUFFICIENT_INSIGHT');
  assert.equal(state.cases[9].status, 'solved_clean');
});

test('no-Trace run: the default rules never accept a Trace, and the scripted day is identical with Trace switched on but unused', () => {
  const off = scriptedDay(content, rules());
  const on = scriptedDay(content, rules({ trace: { enabled: true, cost: 2 } }));
  assert.equal(off.state.cases.every(c => c.trace.length === 0), true);
  assert.deepEqual(off.log, on.log);
  assert.equal(transition(createExpedition(content, rules()), { type: 'TRACE', caseId: 'case-01', year: 1968, actionId: 'x' }, content, rules()).error.code, 'TRACE_DISABLED');
});
