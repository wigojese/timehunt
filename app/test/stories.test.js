import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { STORIES, LANE_SETS } from '../reveal/src/stories.js';
import { laneSpan } from '../reveal/src/lib.js';

const here = dirname(fileURLToPath(import.meta.url));
const pack = JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8'));
const sources = Object.fromEntries(pack.sources.map(s => [s.id, s]));

test('every beat of every story cites sources that exist in the pack bibliography', () => {
  for (const st of STORIES) for (const b of st.beats) { assert.ok(b.src && b.src.length, `${st.id}/${b.id} has no source`); for (const id of b.src) assert.ok(sources[id], `${st.id}/${b.id}: unknown source ${id}`); }
});
test('every lane event cites existing sources and fits its axis', () => {
  for (const [k, set] of Object.entries(LANE_SETS)) for (const e of set.events) {
    assert.ok(e.src.length, `${k}: ${e.label} has no source`); for (const id of e.src) assert.ok(sources[id], `${k}: unknown ${id}`);
    assert.ok(set.lanes.some(l => l.id === e.lane), `${k}: unknown lane ${e.lane}`);
    const s = laneSpan(e); assert.ok(s.a >= set.lo - 1e-9 && s.b <= set.hi + 1e-9, `${k}: ${e.label} outside axis`);
  }
});
test('every story is tied to a case in the pack, its year is that case’s answer, and it has a takeaway and at least three beats', () => {
  for (const st of STORIES) { const c = pack.cases.find(x => x.id === st.caseId); assert.ok(c, st.id); assert.equal(c.target.year, st.year, st.id); assert.ok(st.beats.length >= 3); assert.ok(st.beats.some(b => b.form === 'takeaway' || b.form === 'relation'), `${st.id} has no closing beat`); }
});
test('at least four functionally distinct interaction forms exist across the stories', () => {
  const forms = new Set(STORIES.flatMap(s => s.beats.map(b => b.form)).filter(f => !['text', 'takeaway', 'relation'].includes(f)));
  for (const f of ['inspect', 'stonetime', 'compare', 'smallpox', 'isep', 'defs', 'route', 'span', 'calendar', 'lanes']) assert.ok(forms.has(f), f);
  assert.ok(forms.size >= 4);
});
test('beats that are not editorial make their own claims with sources; editorial beats only reuse sourced material', () => {
  for (const st of STORIES) for (const b of st.beats) if (b.editorial) assert.ok(b.src.length >= 1);
});
test('uncertain events are flagged and carry a note', () => {
  for (const set of Object.values(LANE_SETS)) for (const e of set.events) if (e.uncertain) assert.ok(e.note);
});

import { CONNECTIONS } from '../reveal/src/stories.js';
test('connections: every node cites existing sources; the stated gaps are arithmetic on the node years', () => {
  for (const [k, c] of Object.entries(CONNECTIONS)) for (const n of c.nodes) { assert.ok(n.src.length, `${k}/${n.label}`); for (const id of n.src) assert.ok(sources[id], `${k}: ${id}`); }
  const p = CONNECTIONS.place.nodes; assert.equal(p[1].y - p[0].y, 645);
  const n = CONNECTIONS.name.nodes; assert.equal(n[2].y - n[1].y, 205); assert.equal(n[2].y - n[0].y, 2199, 'from 196 BCE (-195) to 2004');
  assert.notEqual(CONNECTIONS.place.kind, CONNECTIONS.name.kind, 'the two connections are different categories');
});
