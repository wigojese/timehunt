// Real content for the boards, read from the Stage 3 draft pack. Nothing here is invented history.
// The sample DAY (results, Insight left) is illustrative, taken from the Stage 4 scripted day, and every board says so.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const here = dirname(fileURLToPath(import.meta.url));
export const pack = JSON.parse(readFileSync(join(here, '..', '..', 'pack', 'daily-pack-draft.json'), 'utf8'));
export const label = y => (y <= 0 ? `${1 - y} BCE` : y < 1000 ? `${y} CE` : String(y));
export const C = id => pack.cases.find(c => c.id === id);
// Scripted day (Stage 4 fixture): miss on 5, help on 1, 2, 3, 7, 8, 9; clean on 4, 6, 10.
export const DAY = [
  { n: 1, s: 'assisted' }, { n: 2, s: 'assisted' }, { n: 3, s: 'assisted' }, { n: 4, s: 'clean' }, { n: 5, s: 'missed' },
  { n: 6, s: 'clean' }, { n: 7, s: 'assisted' }, { n: 8, s: 'assisted' }, { n: 9, s: 'assisted' }, { n: 10, s: 'clean' },
].map(d => ({ ...d, c: pack.cases[d.n - 1], year: pack.cases[d.n - 1].target.year }));
export const STATUS_WORD = { clean: 'Solved', assisted: 'Solved with help', missed: 'Missed', next: 'Next', todo: 'To come' };
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const sentence = s => s.replace(/^By the end of that year, /, 'By the end of that year, ');
