import test from 'node:test';
import assert from 'node:assert/strict';
import { Session } from '../src/store/session.js';
import { MemoryStorage, FaultyStorage } from '../src/store/storage.js';
import { stateDigest } from '../src/engine/engine.js';
import { loadContent, rules } from './helpers.js';

const content = loadContent();
const R = rules();
const mk = (storage, o = {}) => new Session({ content, rules: R, storage, ...o });
const reveal = (s, aid, clue = 'p2') => s.dispatch({ type: 'REVEAL', caseId: s.state.cases[s.state.cursor].id, clueId: clue, actionId: aid });

test('fresh start, purchase, reload: the charge survives and is applied once', () => {
  const st = new MemoryStorage();
  let s = mk(st); assert.equal(s.load(), 'fresh');
  assert.equal(reveal(s, 'a1').ok, true);
  s = mk(st); assert.equal(s.load(), 'resumed');
  assert.equal(s.state.insight, 6);
  assert.deepEqual(s.state.cases[0].revealed, ['p2']);
});

test('crash BEFORE the write: nothing charged, nothing revealed, reload agrees, retry charges once', () => {
  const inner = new MemoryStorage(); const st = new FaultyStorage(inner);
  let s = mk(st); s.load();
  st.arm('before');
  const r = reveal(s, 'a1');
  assert.equal(r.ok, false);
  assert.equal(r.error.code, 'SAVE_FAILED');
  assert.equal(s.state.insight, 8);
  s = mk(st); s.load();
  assert.equal(s.state.insight, 8);
  assert.deepEqual(s.state.cases[0].revealed, []);
  assert.equal(reveal(s, 'a1').ok, true);
  assert.equal(s.state.insight, 6);
});

test('crash AFTER the write: the purchase is kept exactly once, and the retry with the same action id is ignored', () => {
  const st = new FaultyStorage(new MemoryStorage());
  let s = mk(st); s.load();
  st.arm('after');
  const r = reveal(s, 'a1');
  assert.equal(r.ok, true);
  assert.equal(r.recovered, true);
  assert.equal(s.state.insight, 6);
  s = mk(st); s.load();
  assert.equal(s.state.insight, 6);
  const again = reveal(s, 'a1');
  assert.equal(again.ok, true);
  assert.equal(s.state.insight, 6, 'no double charge');
  assert.equal(s.state.log.length, 1);
});

test('reload at every point of a full day always yields the same final state as playing straight through', () => {
  const st = new MemoryStorage();
  let s = mk(st); s.load();
  const straight = mk(new MemoryStorage()); straight.load();
  for (let i = 0; i < 10; i++) {
    const c = content.cases[i];
    for (const sess of [s, straight]) {
      if (c.clues.length) sess.dispatch({ type: 'REVEAL', caseId: c.id, clueId: c.clues[0].id, actionId: `r${i}` });
    }
    s = mk(st); s.load(); // reload after every purchase
    for (const sess of [s, straight]) sess.dispatch({ type: 'LOCK', caseId: c.id, year: c.target, actionId: `l${i}` });
    s = mk(st); s.load();
    for (const sess of [s, straight]) sess.dispatch({ type: 'ADVANCE', caseId: c.id, actionId: `n${i}` });
    s = mk(st); s.load();
  }
  assert.equal(s.state.status, 'completed');
  assert.equal(stateDigest(s.state), stateDigest(straight.state));
  assert.equal(s.state.insight, straight.state.insight);
});

test('a finished day stays finished after reload: no refill, no new expedition', () => {
  const st = new MemoryStorage();
  let s = mk(st); s.load();
  for (const c of content.cases) { s.dispatch({ type: 'LOCK', caseId: c.id, year: c.target, actionId: 'l' + c.id }); s.dispatch({ type: 'ADVANCE', caseId: c.id, actionId: 'n' + c.id }); }
  s = mk(st); assert.equal(s.load(), 'resumed');
  assert.equal(s.state.status, 'completed');
  assert.equal(s.state.insight, 8);
});

test('corrupt JSON, tampered state and unknown schema are held, not overwritten, and never crash', () => {
  const st = new MemoryStorage();
  let s = mk(st); s.load(); reveal(s, 'a1');
  const good = st.getItem(s.key);
  st.setItem(s.key, '{not json');
  s = mk(st); assert.equal(s.load(), 'corrupt');
  assert.equal(st.getItem(s.key), '{not json', 'held record must not be overwritten');
  assert.equal(s.dispatch({ type: 'ADVANCE', caseId: 'case-01', actionId: 'x' }).error.code, 'NO_STATE');
  const rec = JSON.parse(good); rec.state.insight = 99; // cheat: raise Insight without fixing the digest
  st.setItem(s.key, JSON.stringify(rec));
  s = mk(st); assert.equal(s.load(), 'corrupt');
  rec.schema = 999; st.setItem(s.key, JSON.stringify(rec));
  s = mk(st); assert.equal(s.load(), 'schema_unknown');
  assert.equal(s.discardAndStart(), 'fresh');
  assert.equal(s.state.insight, 8);
  assert.ok(st.getItem(s.key + '.previous'), 'the discarded record is kept');
});

test('content or rules changed mid-day: saved progress is not silently loaded or lost', () => {
  const st = new MemoryStorage();
  let s = mk(st); s.load(); reveal(s, 'a1');
  const other = { ...content, digest: 'different' };
  const s2 = new Session({ content: other, rules: R, storage: st }); assert.equal(s2.load(), 'content_changed');
  const s3 = new Session({ content, rules: rules({ perCaseCap: 1 }), storage: st }); assert.equal(s3.load(), 'rules_changed');
  s = mk(st); assert.equal(s.load(), 'resumed');
  assert.equal(s.state.insight, 6);
});

test('storage that throws on read (private mode) still starts a playable expedition', () => {
  const st = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); }, removeItem() {} };
  const s = mk(st);
  assert.equal(s.load(), 'fresh_unsaved');
  assert.equal(s.dispatch({ type: 'LOCK', caseId: 'case-01', year: 1969, actionId: 'a' }).ok, false);
  assert.equal(s.state.cases[0].status, 'active', 'unsaved play refuses to advance rather than diverging from storage');
});

test('practice mode uses its own record and bank and never touches the daily', () => {
  const st = new MemoryStorage();
  const d = mk(st); d.load(); reveal(d, 'a1');
  const p = new Session({ content, rules: R, storage: st, mode: 'practice', caseIds: ['case-06'] });
  assert.equal(p.load(), 'fresh');
  assert.equal(p.state.insight, R.practiceInsight);
  assert.equal(p.state.cases.length, 1);
  p.dispatch({ type: 'LOCK', caseId: 'case-06', year: 1977, actionId: 'p1' });
  p.dispatch({ type: 'ADVANCE', caseId: 'case-06', actionId: 'p2' });
  assert.equal(p.state.status, 'completed');
  const d2 = mk(st); d2.load();
  assert.equal(d2.state.insight, 6);
  assert.notEqual(d.key, p.key);
});
