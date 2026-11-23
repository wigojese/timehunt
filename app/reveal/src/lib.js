// Pure helpers for the reveal prototype: date arithmetic, chart scales, state functions. No DOM.
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const utc = ({ y, m, d }) => Date.UTC(y, m - 1, d);
export const daysBetween = (a, b) => Math.round((utc(b) - utc(a)) / 864e5);
export const addDays = (d, n) => { const t = new Date(utc(d) + n * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; };
export const fmtDate = ({ y, m, d }) => `${d} ${MONTHS[m - 1]} ${y}`;
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const yearFrac = ({ y, m = 1, d = 1 }) => y + (utc({ y, m, d }) - utc({ y, m: 1, d: 1 })) / (365 * 864e5);
export const label = y => (y <= 0 ? `${1 - y} BCE` : String(y));

// ---- Rosetta stone: band heights are proportional to the number of lines in each register (Wikipedia: 14 remaining, 32, 54)
export const STONE_BANDS = [
  { id: 'hier', name: 'Egyptian hieroglyphs', lines: 14, linesNote: 'Only the last 14 lines remain. This register is the most damaged.', readAt: 1822 },
  { id: 'dem', name: 'Demotic', lines: 32, linesNote: 'The best-preserved register: 32 lines.', readAt: 1822 },
  { id: 'grk', name: 'Ancient Greek', lines: 54, linesNote: '54 lines. The first 27 survive in full.', readAt: 1803 },
];
export function bandRects(totalH, gap, bands = STONE_BANDS) {
  const total = bands.reduce((a, b) => a + b.lines, 0), usable = totalH - gap * (bands.length - 1);
  let y = 0; return bands.map(b => { const h = usable * b.lines / total; const r = { id: b.id, y, h }; y += h + gap; return r; });
}
export function stoneStatus(year) {
  // what the sources say has happened by the end of `year`
  return { found: year >= 1799, translatedGreek: year >= 1803, transliterated: year >= 1822 };
}
export const STONE_EVENTS = [
  { year: 1799, text: 'Found by French soldiers at Rashid (Rosetta), in July.', src: ['wp-rosetta_stone'] },
  { year: 1801, text: 'Surrendered to the British under the Capitulation of Alexandria.', src: ['wp-rosetta_stone'] },
  { year: 1802, text: 'On public display at the British Museum, where it still is.', src: ['wp-rosetta_stone'] },
  { year: 1803, text: 'First complete translation of the Greek text published.', src: ['wp-rosetta_stone'] },
  { year: 1822, text: 'Champollion announces the transliteration of the Egyptian scripts, in Paris.', src: ['wp-rosetta_stone'] },
];

// ---- Smallpox: the regions WHO names and the year each was eliminated
export const SMALLPOX = [
  { id: 'sa', region: 'South America', end: 1971 },
  { id: 'asia', region: 'Asia', end: 1975 },
  { id: 'africa', region: 'Africa', end: 1977 },
];
export function smallpoxState(year) {
  return SMALLPOX.map(r => ({ ...r, state: year < r.end ? 'not yet' : year === r.end ? 'ended this year' : 'ended earlier' }));
}
export const SMALLPOX_MARKS = [
  { id: 'major', when: { y: 1975, m: 10, d: 16 }, text: '16 October 1975', what: 'The last known case of the deadlier form, variola major, reported in Bangladesh.', src: ['wp-rahima_banu', 'who-smallpox'] },
  { id: 'natural', when: { y: 1977, m: 10 }, text: 'October 1977', what: 'The last known natural case, diagnosed in Somalia. Sources give 22, 26 or 31 October, so only the month is used.', src: ['wp-ali_maow_maalin', 'who-smallpox', 'cdc-smallpox'] },
  { id: 'lab', when: { y: 1978 }, text: '1978', what: 'A laboratory-acquired outbreak in England. The last recorded smallpox death.', src: ['wp-janet_parker'] },
  { id: 'declared', when: { y: 1980 }, text: '1980', what: 'WHO declares smallpox officially eradicated.', src: ['who-smallpox'] },
];
export const ISEP = { total: 300, endemicShare: 2 / 3 }; // US$ millions, approximate (WHO)
export const isepSplit = () => ({ endemic: Math.round(ISEP.total * ISEP.endemicShare), other: ISEP.total - Math.round(ISEP.total * ISEP.endemicShare) });

// ---- Manila galleon legs. Dates come from Wikipedia; durations are arithmetic on them.
export const LEGS = {
  out: { name: 'Out: La Navidad to Samar', from: { y: 1564, m: 11, d: 21 }, to: { y: 1565, m: 2, d: 13 }, fromLabel: 'La Navidad, Mexico', toLabel: 'Samar, Philippines' },
  back: { name: 'Back: Cebu to Acapulco', from: { y: 1565, m: 6, d: 1 }, to: { y: 1565, m: 10, d: 8 }, fromLabel: 'Cebu, Philippines', toLabel: 'Acapulco, Mexico' },
};
export const legDays = leg => daysBetween(LEGS[leg].from, LEGS[leg].to);
export const legDate = (leg, day) => addDays(LEGS[leg].from, clamp(day, 0, legDays(leg)));

// ---- Hangul: the 12th lunar month of 1443 runs 30 Dec 1443 to 28 Jan 1444 (Wikipedia). Days in between are counted from the start.
export const LUNAR12 = { start: { y: 1443, m: 12, d: 30 }, days: 30 };
export const lunarDay = k => { const g = addDays(LUNAR12.start, clamp(k, 0, LUNAR12.days - 1)); return { lunarDay: clamp(k, 0, LUNAR12.days - 1) + 1, greg: g }; };

// ---- Lanes: events on a time axis, with honest precision (point, range, month, year)
export function laneSpan(ev) {
  const f = (o, end) => { if (o.m && o.d) return yearFrac(o); if (o.m) return o.y + (o.m - 1 + (end ? 1 : 0)) / 12; return o.y + (end ? 1 : 0); };
  const a = f(ev.from || ev.at, false);
  const b = ev.to ? (ev.to.m && ev.to.d ? yearFrac(ev.to) : f(ev.to, true)) : ev.at && (ev.at.m && ev.at.d) ? a : f(ev.from || ev.at, true);
  return { a, b, kind: ev.to ? 'range' : ev.at && ev.at.m && ev.at.d ? 'point' : ev.at && ev.at.m ? 'month' : 'year' };
}
export const filterLanes = (events, laneId) => (laneId === 'all' ? events : events.filter(e => e.lane === laneId));
export const sortEvents = events => [...events].sort((x, y) => laneSpan(x).a - laneSpan(y).a);
export const xScale = (lo, hi, w) => v => ((v - lo) / (hi - lo)) * w;

// ---- Finale: coverage computed from the pack, never typed
export function coverage(cases) {
  const count = (arr) => arr.reduce((m, k) => { m[k] = (m[k] || 0) + 1; return m; }, {});
  const regions = count(cases.flatMap(c => c.region));
  const eras = count(cases.map(c => c.era));
  const anchors = count(cases.flatMap(c => [...c.free, ...c.paid].map(f => f.anchor.region)));
  const total = Object.values(anchors).reduce((a, b) => a + b, 0);
  const years = cases.map(c => c.target.year).sort((a, b) => a - b);
  const modern = cases.filter(c => c.target.year >= 1893 && c.target.year <= 1977).length;
  const sameYear = Object.entries(years.reduce((m, y) => { m[y] = (m[y] || 0) + 1; return m; }, {})).filter(([, n]) => n > 1).map(([y]) => Number(y));
  return { regions, eras, anchors, anchorTotal: total, years, modern, sameYear, westernShare: ((anchors.Europe || 0) + (anchors['North America'] || 0)) / total };
}
export const gaps = years => years.slice(1).map((y, i) => y - years[i]);
