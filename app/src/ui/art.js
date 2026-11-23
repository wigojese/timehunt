// Temporal Atlas illustration kit (inline SVG). Everything here is decorative: aria-hidden, no meaning carried only by the picture.
// Drawn in code as a stand-in for commissioned art (see docs/atlas/ATLAS_REDESIGN.md). Text and numbers are never part of the art, except
// the year ladder in the hero, which is live <text>.
const INK = '#252B28', FUR = '#E6D3B0', FUR2 = '#D2B68C', BELLY = '#F6EBD3', RUST = '#B4502C', TAN = '#B98A55', GOLD = '#E1A52C', CREAM = '#FFF9EC';
const svg = (vb, body, cls = '', extra = '') => `<svg class="art ${cls}" viewBox="${vb}" aria-hidden="true" focusable="false" ${extra}>${body}</svg>`;
const star = (x, y, r = 5, f = GOLD) => `<path d="M${x} ${y - r}L${x + r * .28} ${y - r * .28}L${x + r} ${y}L${x + r * .28} ${y + r * .28}L${x} ${y + r}L${x - r * .28} ${y + r * .28}L${x - r} ${y}L${x - r * .28} ${y - r * .28}Z" fill="${f}"/>`;
const leaf = (x, y, rot, s = 1, f = '#3E7357') => `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" d="M0 0C10-14 28-14 36 0C28 14 10 14 0 0Z" fill="${f}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;

/** The squirrel guide. opts: {pose:'idle'|'map'|'lantern'|'think', flip:boolean}. Same body, tail, scarf and satchel in every pose. */
export function squirrel({ pose = 'idle', flip = false } = {}) {
  const tail = `<path d="M82 236C20 232 2 150 38 100C62 66 110 66 112 104C113 128 88 140 92 176C94 196 104 206 112 214Z" fill="${FUR}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M46 118C54 92 84 82 98 98M40 150C44 134 58 124 70 122M62 196C54 180 56 164 66 154" fill="none" stroke="${FUR2}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M30 128l6 3m-2 14l7 1m-1 14l6-1m8-62l4 5m8-12l3 6" stroke="${INK}" stroke-width="1.4" stroke-linecap="round" opacity=".55"/>`;
  const body = `<path d="M92 238C78 200 90 146 128 134C168 124 190 164 176 206C170 226 154 240 132 240Z" fill="${FUR}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="146" cy="200" rx="20" ry="32" fill="${BELLY}" opacity=".95"/>
    <path d="M100 242c8 6 22 6 30 0M138 242c8 6 24 6 32-2" stroke="${INK}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const satchel = `<path d="M104 142L168 218" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M104 142L168 218" stroke="${TAN}" stroke-width="5.5" stroke-linecap="round"/>
    <path d="M88 186h50a4 4 0 0 1 4 4v34a6 6 0 0 1-6 6H92a6 6 0 0 1-6-6v-34a4 4 0 0 1 2-4Z" fill="${TAN}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M86 194h56" stroke="${INK}" stroke-width="2.4"/><rect x="108" y="198" width="9" height="11" rx="2" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <path d="M96 182l-8-18 12-4 4 20Z" fill="${CREAM}" stroke="${INK}" stroke-width="2"/><path d="M108 184l2-22 11 2-3 22Z" fill="${CREAM}" stroke="${INK}" stroke-width="2"/>`;
  const head = `<path d="M118 78c-8-20 2-36 14-34 8 2 10 18 8 30Z" fill="${FUR}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M124 72c-3-10 0-20 6-20" fill="none" stroke="${RUST}" stroke-width="3" stroke-linecap="round" opacity=".7"/>
    <path d="M150 76c2-20 14-30 24-24 8 6 2 22-6 32Z" fill="${FUR}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M104 110c-2-26 18-44 44-42 26 2 42 20 38 42-2 14-12 26-30 28-24 3-50-6-52-28Z" fill="${FUR}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M168 114c10-4 22 0 24 8 2 8-8 14-20 12-8-1-12-8-4-20Z" fill="${BELLY}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="190" cy="118" rx="5.5" ry="4.2" fill="${INK}"/>
    <circle cx="158" cy="100" r="7" fill="${INK}"/><circle cx="160" cy="97.5" r="2.4" fill="#fff"/>
    <path d="M150 90q8-6 16-2" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M176 134q8 3 14-1" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M120 112l5 2m-4 8l6-1m-2 8l5-3" stroke="${INK}" stroke-width="1.4" stroke-linecap="round" opacity=".5"/>`;
  const scarf = `<path d="M104 132c20 18 56 18 80-4l4 14c-26 24-68 24-90 4Z" fill="${RUST}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M100 142c-18 6-34 22-54 18 10-20 24-32 52-36Z" fill="${RUST}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M62 150l12-4m-6 10l12-6" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>`;
  const paw = (x, y) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="${FUR}" stroke="${INK}" stroke-width="2.6"/>`;
  let props = `${paw(150, 176)}${paw(168, 182)}`;
  if (pose === 'map') props = `<g transform="rotate(-8 168 168)"><path d="M146 138h54v50h-54Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.6"/><path d="M160 150h26l-9 12 9 12h-26l9-12Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/><path d="M152 144h42M152 182h42" stroke="${INK}" stroke-width="1.4"/></g>${paw(150, 178)}${paw(176, 184)}`;
  if (pose === 'lantern') props = `<path d="M166 160C178 140 192 110 204 80" stroke="${INK}" stroke-width="13" stroke-linecap="round" fill="none"/><path d="M166 160C178 140 192 110 204 80" stroke="${FUR}" stroke-width="8" stroke-linecap="round" fill="none"/>
    ${paw(204, 80)}<circle cx="206" cy="38" r="40" fill="${GOLD}" opacity=".28"/><circle cx="206" cy="38" r="24" fill="${GOLD}" opacity=".28"/>
    <path d="M196 62h20l3-34h-26Z" fill="${GOLD}" stroke="${INK}" stroke-width="2.8" stroke-linejoin="round"/><path d="M193 28h26l-6-10h-14Z" fill="${INK}"/><path d="M200 14a6 6 0 0 1 12 0" fill="none" stroke="${INK}" stroke-width="2.6"/><path d="M193 62h26" stroke="${INK}" stroke-width="4"/><path d="M206 34c4 6 4 14 0 18-4-4-4-12 0-18Z" fill="#FFF3C9"/>${paw(150, 180)}`;
  if (pose === 'think') props = `${paw(160, 150)}${paw(150, 182)}<path d="M200 54l8-8m-2 14l12-2m-26-20l2-10" stroke="${GOLD}" stroke-width="3.2" stroke-linecap="round"/>`;
  return svg('0 0 240 262', `<g ${flip ? 'transform="translate(240 0) scale(-1 1)"' : ''}>${tail}${body}${satchel}${scarf}${head}${props}</g>`, `squirrel ${pose}`);
}

export const hourglass = (cls = '') => svg('0 0 40 56', `<path d="M8 4h24M8 52h24" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><path d="M11 6c0 14 18 14 18 22S11 36 11 50h18c0-14-18-14-18-22S29 20 29 6Z" fill="${CREAM}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/><path d="M14 8c2 8 10 8 12 0Z" fill="${GOLD}"/><path d="M13 49c2-8 12-8 14 0Z" fill="${GOLD}"/>`, 'hourglass ' + cls);
export const sunburst = (n = 14) => svg('-100 -100 200 200', Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, r1 = 62, r2 = i % 2 ? 80 : 94; return `<path d="M${(Math.cos(a) * r1).toFixed(1)} ${(Math.sin(a) * r1).toFixed(1)}L${(Math.cos(a) * r2).toFixed(1)} ${(Math.sin(a) * r2).toFixed(1)}" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>`; }).join(''), 'burst');
export const coin = svg('0 0 24 24', `<circle cx="12" cy="12" r="10" fill="${GOLD}" stroke="${INK}" stroke-width="2.2"/><path d="M7 9c2-4 8-4 10 0" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".7"/>`, 'coin');
export const pin = (c = RUST) => svg('0 0 24 32', `<path d="M12 30C5 20 3 15 3 11a9 9 0 0 1 18 0c0 4-2 9-9 19Z" fill="${c}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="11" r="3.5" fill="${CREAM}" stroke="${INK}" stroke-width="1.6"/>`, 'pin');
export const icons = {
  today: svg('0 0 32 32', `<path d="M5 6l7-2 8 3 7-2v21l-7 2-8-3-7 2Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M12 4v21m8-18v21" stroke="${INK}" stroke-width="1.8"/><circle cx="23" cy="13" r="2.4" fill="${RUST}"/>`, 'ico'),
  practice: svg('0 0 32 32', `<path d="M9 4h14M9 28h14" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M11 5c0 8 10 8 10 11s-10 3-10 11h10c0-8-10-8-10-11S21 13 21 5Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M13 7c1 4 5 4 6 0Z" fill="${GOLD}"/>`, 'ico'),
  archive: svg('0 0 32 32', `<path d="M5 8c4-3 8-3 11 0 3-3 7-3 11 0v18c-4-3-8-3-11 0-3-3-7-3-11 0Z" fill="${CREAM}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/><path d="M16 8v18" stroke="${INK}" stroke-width="2"/><path d="M9 13h4m-4 4h4m10-4h-4m4 4h-4" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`, 'ico'),
  settings: svg('0 0 32 32', `<circle cx="16" cy="16" r="5" fill="${CREAM}" stroke="${INK}" stroke-width="2.4"/><path d="M16 3v5m0 16v5M3 16h5m16 0h5M7 7l3.5 3.5m11 11L25 25M25 7l-3.5 3.5m-11 11L7 25" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`, 'ico'),
};

/** Wide landscape band for case and reveal headers: sky, hills, an aqueduct and trees. */
export function landscape() {
  const arches = Array.from({ length: 8 }, (_, i) => `<path d="M${40 + i * 38} 118v-22a15 15 0 0 1 30 0v22" fill="#9CC0C0" stroke="${INK}" stroke-width="2"/>`).join('');
  return svg('0 0 390 150', `<rect width="390" height="150" fill="#BFD8DC"/>
    <path d="M10 40c14-12 30-10 40 0 10-10 30-8 36 4 18-8 34 4 30 14H6Z" fill="#fff" opacity=".9" stroke="${INK}" stroke-width="1.6"/>
    <path d="M250 28c12-10 28-8 36 2 10-8 26-4 30 6 14-2 24 8 18 16H246Z" fill="#fff" opacity=".9" stroke="${INK}" stroke-width="1.6"/>
    <path d="M0 96c40-24 90-26 140-8 60-20 140-20 250 6v56H0Z" fill="#8DB48A" stroke="${INK}" stroke-width="2"/>
    <path d="M30 96h322v22H30Z" fill="#E5CF9F" stroke="${INK}" stroke-width="2"/><path d="M30 96h322" stroke="${INK}" stroke-width="3"/>${arches}
    <path d="M0 122c60-14 120-8 190 4 70 10 140-6 200-2v26H0Z" fill="#4B8068" stroke="${INK}" stroke-width="2"/>
    <path d="M0 140c80-8 150 0 220 2 60 2 120-6 170-4v12H0Z" fill="#2F5C4B"/>
    <g><path d="M262 124v-26" stroke="${INK}" stroke-width="5"/><circle cx="262" cy="86" r="22" fill="#3E7357" stroke="${INK}" stroke-width="2.4"/><circle cx="252" cy="78" r="9" fill="#5E9577"/></g>
    <g><path d="M60 126v-24" stroke="${INK}" stroke-width="5"/><circle cx="60" cy="92" r="18" fill="#3E7357" stroke="${INK}" stroke-width="2.4"/><circle cx="53" cy="86" r="7" fill="#5E9577"/></g>
    `, 'landscape');
}

const flower = (x, y, r = 6) => `<g>${[0, 72, 144, 216, 288].map(a => `<circle cx="${(x + Math.cos(a * Math.PI / 180) * r * .8).toFixed(1)}" cy="${(y + Math.sin(a * Math.PI / 180) * r * .8).toFixed(1)}" r="${r * .62}" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`).join('')}<circle cx="${x}" cy="${y}" r="${r * .42}" fill="${GOLD}" stroke="${INK}" stroke-width="1.2"/></g>`;
// a clump of overlapping leaves growing from (x,y); dir=1 grows right, -1 left
const clump = (x, y, dir, n = 9, dark = false) => Array.from({ length: n }, (_, i) => { const a = -70 + i * (140 / (n - 1)), s = 1.25 - (i % 3) * .22; return leaf(x + dir * (i % 4) * 7, y - (i % 5) * 9, dir === 1 ? a : 180 - a, s, i % 2 ? (dark ? '#2F5C4B' : '#4B8068') : (dark ? '#3E7357' : '#5E9577')); }).join('');

/** The home hero: sky, distant city and aqueduct, night-sky arch with the armillary sphere over a stepped path of centuries. Years are live text. */
export function hero(years = [2000, 1900, 1800, 1700, 1600]) {
  const rows = years.map((y, i) => { const t = i / (years.length - 1), yy = 292 + t * 82, w = 52 + t * 128; return `<path d="M${195 - w / 2 + 6} ${yy + 14}h${w - 12}" stroke="${INK}" stroke-width="1.6" opacity=".45"/><text x="195" y="${yy + 9}" text-anchor="middle" font-family="Fraunces,Georgia,serif" font-weight="600" font-size="${14 + t * 6}" fill="${INK}">${y}</text>`; }).join('');
  const stars = [[120, 112], [276, 108], [140, 160], [262, 168], [196, 78], [232, 128], [158, 80], [246, 84]].map(([x, y], i) => star(x, y, i % 2 ? 5 : 3.4)).join('');
  const city = [[300, 250, 18, 26], [320, 244, 16, 32], [338, 252, 20, 24], [356, 246, 14, 30], [372, 254, 16, 22]].map(([x, y, w, h], i) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${i % 2 ? '#E8C9A0' : '#EFD9B4'}" stroke="${INK}" stroke-width="1.6"/><path d="M${x - 1} ${y}l${w / 2 + 1} -9 l${w / 2 + 1} 9Z" fill="${RUST}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`).join('');
  const arches = Array.from({ length: 6 }, (_, i) => `<path d="M${14 + i * 20} 292v-14a8 8 0 0 1 16 0v14" fill="#B6D2D2" stroke="${INK}" stroke-width="1.5"/>`).join('');
  const cloud = (x, y, k = 1) => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 22c-12 0-14-18 2-20 4-14 26-14 32-2 12-6 26 4 20 14 12 2 10 8 0 8Z" fill="#fff" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`;
  return svg('0 0 390 440', `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#AFD0D8"/><stop offset=".75" stop-color="#F3EAD2"/></linearGradient>
      <pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${INK}" opacity=".28"/></pattern></defs>
    <rect width="390" height="440" fill="url(#sk)"/>${cloud(14, 24, 1.1)}${cloud(300, 40, 1)}${cloud(250, 14, .7)}
    <path d="M0 262c40-30 70-26 110-6 30-26 70-30 100-4 40-20 84-10 180 20v168H0Z" fill="#A9C3C8" stroke="${INK}" stroke-width="2"/>
    ${city}${arches}<path d="M10 292h118" stroke="${INK}" stroke-width="2.2"/>
    <path d="M85 340V176a110 128 0 0 1 220 0v164Z" fill="#1F4A66" stroke="${INK}" stroke-width="3"/>
    <path d="M85 340V176a110 128 0 0 1 220 0v164Z" fill="url(#dots)" opacity=".4"/>
    ${stars}<circle cx="150" cy="58" r="8" fill="${CREAM}" stroke="${INK}" stroke-width="1.8"/><path d="M200 50a8 8 0 1 0 0 16a6 6 0 0 1 0-16Z" fill="${CREAM}" stroke="${INK}" stroke-width="1.8"/><circle cx="246" cy="58" r="8" fill="${CREAM}" stroke="${INK}" stroke-width="1.8" opacity=".55"/>
    <g transform="translate(195 190)"><circle r="68" fill="#9BCBD2" stroke="${GOLD}" stroke-width="4"/>
      <ellipse rx="68" ry="25" fill="none" stroke="${GOLD}" stroke-width="2.2"/><ellipse rx="25" ry="68" fill="none" stroke="${GOLD}" stroke-width="2.2"/><ellipse rx="48" ry="68" fill="none" stroke="${GOLD}" stroke-width="1.8"/>
      <path d="M-68 0h136M0-68v136" stroke="${GOLD}" stroke-width="1.8"/>
      <path d="M-56 -26c8 6 28 8 44 2 6 8 3 18-5 26-15-5-33-10-39-28Z" fill="#6BA487" stroke="${INK}" stroke-width="1.6"/><path d="M22 4c8-5 22-3 29 6-5 15-18 21-27 16-3-8-5-16-2-22Z" fill="#6BA487" stroke="${INK}" stroke-width="1.6"/>
      <g transform="rotate(-18)"><ellipse rx="94" ry="22" fill="none" stroke="${INK}" stroke-width="9"/><ellipse rx="94" ry="22" fill="none" stroke="${GOLD}" stroke-width="5.5"/></g></g>
    <path d="M180 258h30l4 30h-38Z" fill="#E5CF9F" stroke="${INK}" stroke-width="2.4"/><path d="M156 292h78l-7-12h-64Z" fill="#EEDDB5" stroke="${INK}" stroke-width="2.4"/>
    <path d="M128 400L160 286h70l32 114Z" fill="#EFE2C2" stroke="${INK}" stroke-width="3"/><path d="M128 400L160 286M262 400L230 286" stroke="${INK}" stroke-width="3"/>${rows}
    <path d="M96 320v-34" stroke="${INK}" stroke-width="4"/><path d="M96 286l28 8-28 9Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <path d="M296 322v-34" stroke="${INK}" stroke-width="4"/><path d="M296 288l-28 8 28 9Z" fill="${GOLD}" stroke="${INK}" stroke-width="2"/>
    <path d="M0 360c60-8 120-4 195 4s130 4 195-4v84H0Z" fill="#6BA487" stroke="${INK}" stroke-width="2.4"/><path d="M0 360c60-8 120-4 195 4s130 4 195-4v84H0Z" fill="url(#dots)"/>
    <path d="M0 330c26-30 52-40 74-30l-18 140H0Z" fill="#3E7357" stroke="${INK}" stroke-width="3"/><path d="M390 326c-26-30-52-40-74-30l18 144h56Z" fill="#3E7357" stroke="${INK}" stroke-width="3"/>
    ${clump(2, 392, 1, 9, true)}${clump(388, 392, -1, 9, true)}${clump(14, 430, 1, 7)}${clump(376, 430, -1, 7)}
    ${flower(48, 420, 7)}${flower(76, 432, 6)}${flower(338, 424, 7)}${flower(312, 434, 6)}${flower(120, 424, 5)}${flower(268, 430, 5)}`, 'hero', 'preserveAspectRatio="xMidYMid slice"');
}

/** Corner foliage for the base of reveal and result screens. */
export const foliage = () => svg('0 0 390 60', `${[[0, 54, -30, 1.5], [24, 58, -60, 1.2], [60, 56, -20, 1.0], [390, 54, 210, 1.5], [364, 58, 240, 1.2], [330, 56, 200, 1.0]].map(([x, y, r, s]) => leaf(x, y, r, s, '#4B8068')).join('')}`, 'foliage');
