import test from 'node:test';
import assert from 'node:assert/strict';
import { createExpedition, transition, score, publicView, replay, stateDigest, cluesFor } from '../src/engine/engine.js';
import { loadContent, rules, id, deepFreeze } from './helpers.js';

const content = loadContent();
const R = rules();
const fresh = (r = R) => createExpedition(content, r);
const T = (s, cmd, r = R) => transition(s, { actionId: id(), ...cmd }, content, r);
const cur = (s) => content.cases[s.cursor];

test('all ten cases compile with 3 to 6 candidates and the target inside', () => {
  assert.equal(content.cases.length, 10);
  for (const c of content.cases) { assert.ok(c.c0.length >= 3 && c.c0.length <= 6, c.id); assert.ok(c.c0.includes(c.target), c.id); }
});

test('a new expedition: 8 Insight, case 1 active, later cases closed with no candidates', () => {
  const s = fresh();
  assert.equal(s.insight, 8);
  assert.equal(s.cases[0].status, 'active');
  assert.deepEqual(s.cases[0].C, content.cases[0].c0);
  assert.ok(s.cases.slice(1).every(c => c.status === 'not_started' && c.C.length === 0));
});

test('revealing a clue charges its tier price, narrows candidates and keeps the target', () => {
  const s = fresh(); const c = cur(s);
  const r = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p2' });
  assert.equal(r.error, null);
  assert.equal(r.next.insight, 6);
  assert.ok(r.next.cases[0].C.length < s.cases[0].C.length);
  assert.ok(r.next.cases[0].C.includes(c.target));
  assert.equal(r.events[0].charged, 2);
});

test('refund on redundant: a clue that removes nothing now costs 0', () => {
  let s = fresh(); const c = cur(s);
  s = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p2' }).next; // leaves one candidate
  const r = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p1' });
  assert.equal(r.error, null);
  assert.equal(r.next.insight, s.insight);
  assert.equal(r.events[0].charged, 0);
  assert.equal(r.events[0].refunded, 1);
});

test('refundRedundant=false charges for a redundant clue (switch isolated)', () => {
  const r2 = rules({ refundRedundant: false });
  let s = createExpedition(content, r2); const c = cur(s);
  s = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p2' }, r2).next;
  const r = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p1' }, r2);
  assert.equal(r.next.insight, s.insight - 1);
});

test('a refused action changes nothing and returns the same state object', () => {
  const s = fresh();
  for (const cmd of [
    { type: 'REVEAL', caseId: cur(s).id, clueId: 'nope' },
    { type: 'LOCK', caseId: cur(s).id, year: 1 },
    { type: 'ADVANCE', caseId: cur(s).id },
    { type: 'REVEAL', caseId: content.cases[3].id, clueId: 'p1' },
    { type: 'TRACE', caseId: cur(s).id, year: 1968 },
  ]) {
    const r = T(s, cmd);
    assert.ok(r.error, JSON.stringify(cmd));
    assert.equal(r.next, s);
  }
});

test('already revealed is refused without a second charge', () => {
  let s = fresh(); const c = cur(s);
  s = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p1' }).next;
  const r = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p1' });
  assert.equal(r.error.code, 'ALREADY_REVEALED');
  assert.equal(r.next.insight, s.insight);
});

test('a repeated actionId is idempotent: no double charge, no error', () => {
  const s = fresh(); const c = cur(s);
  const cmd = { type: 'REVEAL', caseId: c.id, clueId: 'p2', actionId: 'same-tap' };
  const a = transition(s, cmd, content, R);
  const b = transition(a.next, cmd, content, R);
  assert.equal(b.error, null);
  assert.equal(b.next, a.next);
  assert.equal(b.events[0].type, 'DUPLICATE_IGNORED');
  assert.equal(b.next.insight, 6);
});

test('insufficient Insight is refused, never negative', () => {
  const r1 = rules({ insight: 1 });
  let s = createExpedition(content, r1); const c = cur(s);
  const r = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p2' }, r1);
  assert.equal(r.error.code, 'INSUFFICIENT_INSIGHT');
  assert.equal(r.next.insight, 1);
});

test('lock: correct with no spending is solved_clean; with spending is solved_assisted; wrong is missed and reveals', () => {
  let s = fresh(); let c = cur(s);
  let r = T(s, { type: 'LOCK', caseId: c.id, year: c.target });
  assert.equal(r.next.cases[0].status, 'solved_clean');
  s = fresh();
  s = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p1' }).next;
  r = T(s, { type: 'LOCK', caseId: c.id, year: c.target });
  assert.equal(r.next.cases[0].status, 'solved_assisted');
  const wrong = fresh().cases[0].C.find(y => y !== c.target);
  r = T(fresh(), { type: 'LOCK', caseId: c.id, year: wrong });
  assert.equal(r.next.cases[0].status, 'missed');
  assert.equal(r.events[0].correct, false);
});

test('a ruled-out year cannot be locked, and a second lock is refused', () => {
  const s = fresh(); const c = cur(s);
  assert.equal(T(s, { type: 'LOCK', caseId: c.id, year: c.corridor[0] - 1 }).error.code, 'RULED_OUT');
  const l = T(s, { type: 'LOCK', caseId: c.id, year: c.target }).next;
  assert.equal(T(l, { type: 'LOCK', caseId: c.id, year: c.target }).error.code, 'CASE_RESOLVED');
});

test('a missed case never ends the day: the next case opens and play continues to case 10 and completion', () => {
  let s = fresh();
  for (let i = 0; i < 10; i++) {
    const c = cur(s);
    const wrong = s.cases[s.cursor].C.find(y => y !== c.target);
    s = T(s, { type: 'LOCK', caseId: c.id, year: i % 2 ? wrong : c.target }).next;
    s = T(s, { type: 'ADVANCE', caseId: c.id }).next;
  }
  assert.equal(s.status, 'completed');
  assert.equal(score(s).solved, 5);
  assert.equal(score(s).missed, 5);
});

test('after completion no command is accepted and Insight does not refill', () => {
  let s = fresh();
  for (let i = 0; i < 10; i++) { const c = cur(s); s = T(s, { type: 'LOCK', caseId: c.id, year: c.target }).next; s = T(s, { type: 'ADVANCE', caseId: c.id }).next; }
  assert.equal(s.status, 'completed');
  assert.equal(s.insight, 8);
  assert.equal(T(s, { type: 'LOCK', caseId: 'case-10', year: 1977 }).error.code, 'EXPEDITION_OVER');
});

test('the 8-Insight bank is shared across cases and never refills between them', () => {
  let s = fresh();
  s = T(s, { type: 'REVEAL', caseId: cur(s).id, clueId: 'p2' }).next; // -2
  s = T(s, { type: 'LOCK', caseId: cur(s).id, year: cur(s).target }).next;
  s = T(s, { type: 'ADVANCE', caseId: cur(s).id }).next;
  assert.equal(s.insight, 6);
  s = T(s, { type: 'REVEAL', caseId: cur(s).id, clueId: 'p2' }).next; // -2 more
  assert.equal(s.insight, 4);
});

test('Trace is off in the C1 default and works as a switch: earlier, later, same, uninformative, price', () => {
  assert.equal(T(fresh(), { type: 'TRACE', caseId: 'case-01', year: 1968 }).error.code, 'TRACE_DISABLED');
  const rt = rules({ trace: { enabled: true, cost: 2 } });
  const s = createExpedition(content, rt);
  const c = content.cases[0]; // target 1969, C0 1967..1969
  let r = transition(s, { type: 'TRACE', caseId: c.id, year: 1968, actionId: 'a' }, content, rt);
  assert.equal(r.events[0].result, 'later'); assert.deepEqual(r.next.cases[0].C, [1969]); assert.equal(r.next.insight, 6);
  r = transition(s, { type: 'TRACE', caseId: c.id, year: 1969, actionId: 'b' }, content, rt);
  assert.equal(r.events[0].result, 'same'); assert.deepEqual(r.next.cases[0].C, [1969]);
  r = transition(s, { type: 'TRACE', caseId: c.id, year: 1967, actionId: 'c' }, content, rt);
  assert.equal(r.events[0].result, 'later'); assert.deepEqual(r.next.cases[0].C, [1968, 1969]);
  r = transition(s, { type: 'TRACE', caseId: c.id, year: 1990, actionId: 'd' }, content, rt);
  assert.equal(r.error.code, 'TRACE_UNINFORMATIVE', 'a year later than every candidate cuts nothing, so Trace is refused');
  assert.equal(r.next.insight, 8);
  r = transition(s, { type: 'TRACE', caseId: c.id, year: 1968, actionId: 'e' }, content, rt);
  r = transition(r.next, { type: 'LOCK', caseId: c.id, year: 1969, actionId: 'f' }, content, rt);
  assert.equal(r.next.cases[0].status, 'solved_assisted');
});

test('per-case Insight cap of 1 (D-017 switch) refuses a Deep clue and a second Nudge', () => {
  const rc = rules({ perCaseCap: 1 });
  let s = createExpedition(content, rc); const c = content.cases[1]; // case 2 has nudge + deep
  s = transition(s, { type: 'LOCK', caseId: 'case-01', year: 1969, actionId: 'l1' }, content, rc).next;
  s = transition(s, { type: 'ADVANCE', caseId: 'case-01', actionId: 'a1' }, content, rc).next;
  assert.equal(transition(s, { type: 'REVEAL', caseId: c.id, clueId: 'p2', actionId: 'x' }, content, rc).error.code, 'CASE_CAP');
  s = transition(s, { type: 'REVEAL', caseId: c.id, clueId: 'p1', actionId: 'y' }, content, rc).next;
  assert.equal(transition(s, { type: 'REVEAL', caseId: c.id, clueId: 'p2', actionId: 'z' }, content, rc).error.code, 'CASE_CAP');
});

test('relationTier=deep hides the relation from free evidence and sells it as a Deep clue that resolves the case', () => {
  const rd = rules({ relationTier: 'deep' });
  const s = createExpedition(content, rd);
  const v = publicView(s, content, rd);
  assert.equal(v.cases[0].relation, null);
  const clue = v.cases[0].clues.find(c => c.category === 'Key link');
  assert.ok(clue && clue.cost === 2 && !clue.text);
  const r = transition(s, { type: 'REVEAL', caseId: 'case-01', clueId: 'f3', actionId: 'k' }, content, rd);
  assert.deepEqual(r.next.cases[0].C, [1969]);
  assert.equal(publicView(createExpedition(content, rules()), content, rules()).cases[0].relation.id, 'f3');
});

test('publicView leaks nothing: no target, no unrevealed clue text, no resolution before the case is resolved', () => {
  const s = fresh();
  const v = publicView(s, content, R);
  const json = JSON.stringify(v);
  assert.ok(!('resolution' in v.cases[0]));
  assert.ok(!json.includes('definition'));
  for (const c of content.cases) for (const cl of c.clues) assert.ok(!json.includes(cl.text), `unrevealed clue text leaked: ${cl.id}`);
  assert.deepEqual(Object.keys(v.cases[5]).sort(), ['id', 'order', 'status']);
  assert.ok(!Object.keys(v.cases[0]).includes('target'));
  const l = T(s, { type: 'LOCK', caseId: 'case-01', year: 1969 }).next;
  assert.equal(publicView(l, content, R).cases[0].resolution.answer, 1969);
});

test('pre-purchase clue metadata is only tier, cost and category: no strength or overlap hints', () => {
  const v = publicView(fresh(), content, rules());
  for (const cl of v.cases[0].clues) assert.deepEqual(Object.keys(cl).sort(), ['category', 'cost', 'id', 'revealed', 'tier']);
});

test('transition never mutates its inputs', () => {
  const s = deepFreeze(fresh());
  const cmd = deepFreeze({ type: 'REVEAL', caseId: 'case-01', clueId: 'p2', actionId: 'freeze' });
  const r = transition(s, cmd, content, R);
  assert.equal(r.error, null);
  assert.notEqual(r.next, s);
  assert.equal(s.insight, 8);
});

test('replay of the accepted command log reproduces the exact state', () => {
  let s = fresh();
  for (let i = 0; i < 4; i++) {
    const c = cur(s);
    s = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p1' }).next;
    s = T(s, { type: 'LOCK', caseId: c.id, year: c.target }).next;
    s = T(s, { type: 'ADVANCE', caseId: c.id }).next;
  }
  const { state, errors } = replay(content, R, {}, s.log);
  assert.equal(errors.length, 0);
  assert.equal(stateDigest(state), stateDigest(s));
});

test('cluesFor lists exactly the paid clues in the default rules and adds the relation only in deep tier', () => {
  const cc = content.cases[0];
  assert.equal(cluesFor(cc, rules()).length, 2);
  assert.equal(cluesFor(cc, rules({ relationTier: 'deep' })).length, 3);
});

test('score: solved cases lead; Insight left is shown but cannot make 0 solves beat 10', () => {
  const a = { ...fresh(), insight: 8 };
  const sc = score(a);
  assert.equal(sc.solved, 0);
  assert.equal(sc.insightLeft, 8);
  let s = fresh();
  for (let i = 0; i < 10; i++) { const c = cur(s); s = T(s, { type: 'REVEAL', caseId: c.id, clueId: 'p1' }).next; s = T(s, { type: 'LOCK', caseId: c.id, year: c.target }).next; s = T(s, { type: 'ADVANCE', caseId: c.id }).next; }
  assert.equal(score(s).solved, 10);
  assert.ok(score(s).solved > score(a).solved);
});
