import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as L from '../reveal/src/lib.js';

const here = dirname(fileURLToPath(import.meta.url));
const pack = JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8'));

test('date arithmetic: the two galleon legs and the Hangul month', () => {
  assert.equal(L.daysBetween({ y: 1565, m: 6, d: 1 }, { y: 1565, m: 10, d: 8 }), 129);
  assert.equal(L.legDays('back'), 129); assert.equal(L.legDays('out'), 84);
  assert.deepEqual(L.legDate('back', 129), { y: 1565, m: 10, d: 8 }); assert.deepEqual(L.legDate('back', 0), { y: 1565, m: 6, d: 1 });
  assert.deepEqual(L.legDate('back', 999), { y: 1565, m: 10, d: 8 }, 'clamped at the end');
  assert.deepEqual(L.lunarDay(0).greg, { y: 1443, m: 12, d: 30 });
  assert.deepEqual(L.lunarDay(29).greg, { y: 1444, m: 1, d: 28 }, 'day 30 of the 12th month is 28 January 1444');
  assert.equal(L.lunarDay(29).lunarDay, 30);
});

test('Hangul: the Gregorian year changes inside the 12th lunar month, on lunar day 3', () => {
  const years = Array.from({ length: 30 }, (_, k) => L.lunarDay(k).greg.y);
  assert.equal(years[0], 1443); assert.equal(years[1], 1443); assert.equal(years[2], 1444);
  assert.equal(new Set(years).size, 2);
});

test('stone bands: heights are proportional to the lines and fill the slab', () => {
  const r = L.bandRects(300, 6);
  assert.ok(Math.abs(r[2].y + r[2].h - 300) < 1e-9);
  assert.ok(Math.abs(r[2].h / r[0].h - 54 / 14) < 1e-9 && Math.abs(r[1].h / r[0].h - 32 / 14) < 1e-9);
});

test('stone status follows the sources by year', () => {
  assert.deepEqual(L.stoneStatus(1799), { found: true, translatedGreek: false, transliterated: false });
  assert.deepEqual(L.stoneStatus(1803), { found: true, translatedGreek: true, transliterated: false });
  assert.deepEqual(L.stoneStatus(1822), { found: true, translatedGreek: true, transliterated: true });
  assert.equal(L.stoneStatus(1790).found, false);
});

test('smallpox: regions end in the years WHO gives, and states are consistent', () => {
  const s = Object.fromEntries(L.smallpoxState(1975).map(r => [r.id, r.state]));
  assert.deepEqual(s, { sa: 'ended earlier', asia: 'ended this year', africa: 'not yet' });
  assert.ok(L.smallpoxState(1980).every(r => r.state === 'ended earlier'));
  assert.ok(L.smallpoxState(1965).every(r => r.state === 'not yet'));
  assert.deepEqual(L.isepSplit(), { endemic: 200, other: 100 });
});

test('lane spans keep their honest precision: point, month, year, range', () => {
  assert.equal(L.laneSpan({ at: { y: 1977, m: 8, d: 20 } }).kind, 'point');
  assert.equal(L.laneSpan({ at: { y: 1977, m: 10 } }).kind, 'month');
  assert.equal(L.laneSpan({ at: { y: 1324 } }).kind, 'year');
  assert.equal(L.laneSpan({ from: { y: 1977, m: 1, d: 15 }, to: { y: 1977, m: 2, d: 12 } }).kind, 'range');
  const m = L.laneSpan({ at: { y: 1977, m: 10 } }); assert.ok(m.b - m.a > 0.07 && m.b - m.a < 0.1, 'a month is about 1/12 of a year');
  const yr = L.laneSpan({ at: { y: 1324 } }); assert.ok(Math.abs(yr.b - yr.a - 1) < 1e-9);
});

test('lane filter and sort', () => {
  const ev = [{ lane: 'a', at: { y: 2000, m: 5, d: 1 } }, { lane: 'b', at: { y: 1999, m: 1, d: 1 } }, { lane: 'a', at: { y: 1999, m: 6, d: 1 } }];
  assert.equal(L.filterLanes(ev, 'a').length, 2); assert.equal(L.filterLanes(ev, 'all').length, 3);
  assert.deepEqual(L.sortEvents(ev).map(e => e.at.y), [1999, 1999, 2000]);
});

test('finale coverage is computed from the pack: regions, eras, shared year, Western share', () => {
  const c = L.coverage(pack.cases);
  assert.equal(c.years.length, 10); assert.deepEqual(c.sameYear, [1977]);
  assert.equal(c.regions.Asia, 5); assert.equal(c.regions.Europe, 4); assert.equal(c.modern, 5);
  assert.ok(c.westernShare > 0.5 && c.westernShare < 0.65, `western share ${c.westernShare}`);
  assert.equal(L.gaps(c.years).length, 9);
});
