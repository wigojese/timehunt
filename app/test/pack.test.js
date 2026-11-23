import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validatePack } from '../src/engine/pack.js';
import { yearLabel, printsYear } from '../src/engine/years.js';
import { raw } from './helpers.js';

const here = dirname(fileURLToPath(import.meta.url));
const muts = JSON.parse(readFileSync(join(here, '..', 'fixtures', 'invalid-pack-mutations.json'), 'utf8')).mutations;

function apply(obj, m) {
  const parts = m.path.split('.');
  let o = obj;
  for (const p of parts.slice(0, -1)) o = o[/^\d+$/.test(p) ? Number(p) : p];
  const last = parts[parts.length - 1];
  const key = /^\d+$/.test(last) ? Number(last) : last;
  if (m.op === 'set') o[key] = m.value;
  else if (m.op === 'truncate') o[key].length = m.length;
  else if (m.op === 'delete') delete o[key];
  return obj;
}

test('the draft pack is refused as a daily unless allowDraft is set (fail-safe)', () => {
  const r = validatePack(raw());
  assert.equal(r.ok, false);
  assert.ok(r.errors.some(e => e.code === 'NOT_PUBLISHABLE'));
  assert.equal(r.content, null);
  const ok = validatePack(raw(), { allowDraft: true });
  assert.equal(ok.ok, true);
  assert.ok(ok.warnings.some(w => w.code === 'DRAFT'));
});

for (const m of muts) {
  test(`invalid pack refused: ${m.name} -> ${m.expect}`, () => {
    const r = validatePack(apply(raw(), m), { allowDraft: true });
    assert.equal(r.ok, false, 'pack must be refused');
    assert.equal(r.content, null, 'no content may be returned for an invalid pack');
    assert.ok(r.errors.some(e => e.code === m.expect), `expected ${m.expect}, got ${r.errors.map(e => e.code)}`);
  });
}

test('garbage input never throws and is refused', () => {
  for (const x of [null, undefined, 42, 'text', [], {}, { cases: 'no' }, { cases: [null] }]) {
    const r = validatePack(x, { allowDraft: true });
    assert.equal(r.ok, false);
  }
});

test('validation is deterministic: same pack, same digest; any content change changes it', () => {
  const a = validatePack(raw(), { allowDraft: true }).content.digest;
  const b = validatePack(raw(), { allowDraft: true }).content.digest;
  assert.equal(a, b);
  const p = raw(); p.cases[3].question += ' ';
  assert.notEqual(validatePack(p, { allowDraft: true }).content.digest, a);
});

test('year labels never show a year zero and handle BCE', () => {
  assert.equal(yearLabel(1969), '1969');
  assert.equal(yearLabel(2), '2 CE');
  assert.equal(yearLabel(1), '1 CE');
  assert.equal(yearLabel(0), '1 BCE');
  assert.equal(yearLabel(-19), '20 BCE');
  assert.equal(printsYear('born in 2 CE', 2), true);
  assert.equal(printsYear('on 2 September 1801', 2), false);
  assert.equal(printsYear('1 BCE', 0), true);
});

test('case 9 (BCE/CE) compiles: six candidate years across the missing year zero', () => {
  const c = validatePack(raw(), { allowDraft: true }).content.cases[8];
  assert.deepEqual(c.c0, [0, 1, 2, 3, 4, 5]);
  assert.deepEqual(c.c0.map(yearLabel), ['1 BCE', '1 CE', '2 CE', '3 CE', '4 CE', '5 CE']);
});

test('the app copy of the pack equals the editorial pack in docs/pack (no second source of truth)', () => {
  const a = readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8');
  const b = readFileSync(join(here, '..', '..', 'docs', 'pack', 'daily-pack-draft.json'), 'utf8');
  assert.equal(a, b);
});

test('a source URL that is not http(s) is rejected (no javascript: or data: links can come from a pack)', () => {
  for (const bad of ['javascript:alert(1)', 'data:text/html,<b>x</b>', 'ftp://example.org/x', '//example.org/x', '']) {
    const p = raw();
    p.sources[0].url = bad;
    const v = validatePack(p, { allowDraft: true });
    assert.equal(v.ok, false, bad);
    assert.ok(v.errors.some(e => e.code === 'SOURCE_URL'), bad);
  }
});
