// World Reveal prototype: a hub of stories, each a different sequence of beats and interactive evidence forms, plus a finale that does more than list scores.
import { STORIES, LANE_SETS } from './stories.js';
import { FORMS, srcBlock } from './forms.js';
import * as L from './lib.js';

const $ = s => document.querySelector(s), main = $('#main'), esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let pack, sources, cases;
const DAY = ['assisted', 'assisted', 'assisted', 'clean', 'missed', 'clean', 'assisted', 'assisted', 'assisted', 'clean']; // illustrative: the Stage 4 scripted day
const prefs = { reduce: false, scale: 100 };
try { Object.assign(prefs, JSON.parse(localStorage.getItem('tr:prefs') || '{}')); } catch (e) { /* defaults */ }
const mq = matchMedia('(prefers-reduced-motion: reduce)'); const reduced = () => prefs.reduce || mq.matches;
const applyPrefs = () => { document.documentElement.style.fontSize = prefs.scale + '%'; document.documentElement.dataset.motion = reduced() ? 'reduce' : 'auto'; try { localStorage.setItem('tr:prefs', JSON.stringify(prefs)); } catch (e) { /* ignore */ } };
let prog = {}; try { prog = JSON.parse(localStorage.getItem('tr:progress') || '{}'); } catch (e) { /* none */ }
const saveProg = () => { try { localStorage.setItem('tr:progress', JSON.stringify(prog)); } catch (e) { /* ignore */ } };
const say = t => { const l = $('#live'); l.textContent = ''; setTimeout(() => { l.textContent = t; }, 30); };
const log = (e, d) => { (window.__events = window.__events || []).push({ e, d }); };
const STATE = { route: 'hub', id: null, beat: 0, cleanup: null };
window.__reveal = STATE;

function options() {
  return `<details class="opts"><summary class="btn">Display options</summary><nav aria-label="Display options"><label class="opt"><input type="checkbox" id="optrm" ${prefs.reduce ? 'checked' : ''}> Reduce motion</label>${[100, 130, 160, 200].map(s => `<button type="button" class="btn" data-scale="${s}" aria-pressed="${prefs.scale === s}">${s}%</button>`).join('')}</nav></details>`;
}
function bindOptions() {
  const rm = $('#optrm'); if (rm) rm.onchange = e => { prefs.reduce = e.target.checked; applyPrefs(); };
  document.querySelectorAll('[data-scale]').forEach(b => b.onclick = () => { prefs.scale = Number(b.dataset.scale); applyPrefs(); document.querySelectorAll('[data-scale]').forEach(x => x.setAttribute('aria-pressed', String(Number(x.dataset.scale) === prefs.scale))); });
}

// ---------- routing ----------
const hashOf = (r, id, b) => (r === 'hub' ? '#hub' : r === 'finale' ? `#finale.${b}` : `#s.${id}.${b}`);
function parse() { const p = location.hash.replace(/^#/, '').split('.'); if (p[0] === 's' && STORIES.some(s => s.id === p[1])) return { route: 'story', id: p[1], beat: Number(p[2] || 0) }; if (p[0] === 'finale') return { route: 'finale', id: 'finale', beat: Number(p[1] || 0) }; return { route: 'hub' }; }
function go(r, id, b = 0, { push = true, entry = false } = {}) { if (STATE.cleanup) { STATE.cleanup(); STATE.cleanup = null; } const h = hashOf(r === 'story' ? 'story' : r, id, b); if (push) history.pushState({}, '', h); else history.replaceState({}, '', h); route({ entry }); window.scrollTo(0, 0); }
window.addEventListener('popstate', () => { if (STATE.cleanup) { STATE.cleanup(); STATE.cleanup = null; } route({}); });
function route(o = {}) { const r = parse(); Object.assign(STATE, r); STATE.beat = r.beat || 0; if (r.route === 'hub') renderHub(); else renderStory(o.entry); }

// ---------- hub ----------
const FINALE = { id: 'finale', title: 'The ten marks together', year: '10', form: 'Find what the ten share', where: 'Every case in the day', beats: [{ id: 'marks', form: 'marks', title: 'Your ten marks', src: ['wp-voyager_1'] }, { id: 'pair', form: 'pair', title: 'Two marks share a year', src: ['wp-voyager_2', 'wp-ali_maow_maalin'] }, { id: 'place', form: 'place', title: 'The same coast, 645 years apart', src: ['wp-ibn_battuta', 'wp-ali_maow_maalin'] }, { id: 'name', form: 'name', title: 'A name that travelled', src: ['wp-rosetta_stone', 'wp-rosetta_(spacecraft)'] }, { id: 'cover', form: 'coverage', title: 'What the ten leave out', src: ['wp-concorde'] }, { id: 'take', form: 'takeaway', editorial: true, title: 'A selection, not a sample', src: ['wp-concorde'] }] };
function statusOf(id) { const p = prog[id]; if (!p) return { t: 'Not started', k: 'new' }; if (p.status === 'done') return { t: 'Finished', k: 'done' }; if (p.status === 'skipped') return { t: 'Skipped', k: 'skipped' }; return { t: `On beat ${p.beat + 1}`, k: 'resume' }; }
function renderHub() {
  const card = st => { const s = statusOf(st.id), n = (st.id === 'finale' ? FINALE : st).beats.length; return `<section class="hubcard" aria-labelledby="h-${st.id}"><span class="yr" aria-hidden="true">${st.year}</span><div><h2 id="h-${st.id}" style="margin:0">${esc(st.title)}</h2><p class="note">${esc(st.where)}</p></div><p class="meta"><span class="tag">${esc(st.form)}</span> <span class="tag">${s.t}</span> <span class="note">${n} beats</span></p><div class="acts">${s.k === 'resume' ? `<button type="button" class="btn primary" data-act="resume" data-id="${st.id}">Resume at beat ${prog[st.id].beat + 1}</button><button type="button" class="btn" data-act="start" data-id="${st.id}">Start over</button>` : `<button type="button" class="btn primary" data-act="start" data-id="${st.id}">${s.k === 'new' ? 'Open' : 'Replay'}</button>`}</div></section>`; };
  main.innerHTML = `${options()}<h1 tabindex="-1" id="h">The world around the year</h1><p class="lede">Six stories, each a different shape, and a finale. Every story can be skipped, and you can leave and resume. Every date has a source.</p>${STORIES.map(card).join('')}<h2>Then, all ten together</h2>${card(FINALE)}<div class="bar"><button type="button" class="btn" id="reset">Reset progress</button></div>`;
  bindOptions(); main.querySelectorAll('[data-act]').forEach(b => b.onclick = () => { const id = b.dataset.id, isF = id === 'finale'; const start = b.dataset.act === 'start'; if (start) delete prog[id]; saveProg(); go(isF ? 'finale' : 'story', id, start ? 0 : (prog[id] && prog[id].beat) || 0, { entry: start && !isF }); });
  $('#reset').onclick = () => { prog = {}; saveProg(); renderHub(); };
}

// ---------- entry transition: the found year becomes the story ----------
function playEntry(st) {
  const el = $('#entry'); if (reduced()) { el.hidden = true; return; }
  el.hidden = false; el.setAttribute('aria-hidden', 'false'); el.classList.remove('play'); el.innerHTML = `<div><span class="y">${st.year}</span><span class="rule"></span><span class="t">${esc(st.title)}</span><span class="note" style="color:var(--bs);display:block;margin-top:.75rem">Tap to continue</span></div>`; void el.offsetWidth;
  const end = () => { el.hidden = true; el.setAttribute('aria-hidden', 'true'); el.classList.remove('play'); el.onclick = null; window.__entryActive = false; };
  window.__entryActive = true; el.onclick = end; setTimeout(() => { if (!el.hidden) { el.classList.add('play'); setTimeout(end, 900); } }, 700);
  const onKey = e => { if (e.key === 'Escape') { end(); document.removeEventListener('keydown', onKey); } }; document.addEventListener('keydown', onKey);
}

// ---------- story stepper ----------
function renderStory(entry) {
  const isF = STATE.route === 'finale', st = isF ? FINALE : STORIES.find(s => s.id === STATE.id);
  const i = Math.min(Math.max(STATE.beat, 0), st.beats.length - 1), b = st.beats[i], last = i === st.beats.length - 1;
  prog[st.id] = { ...(prog[st.id] || {}), beat: i, status: (prog[st.id] && prog[st.id].status === 'done') ? 'done' : 'inprogress' }; saveProg();
  const ctx = { sources, log, reduced };
  let body, mount = () => {};
  if (b.form === 'text' || b.form === 'takeaway') body = `<p class="q" style="font-size:1.125rem">${esc(b.text || takeawayText(b))}</p>`;
  else if (b.form === 'marks' || b.form === 'pair' || b.form === 'coverage') { const f = FINALE_FORMS[b.form](ctx); body = f.html; mount = f.mount; }
  else { const f = FORMS[b.form](b, ctx, b.lanes); body = f.html; mount = f.mount; }
  const steps = `<ol class="steps" aria-label="Progress">${st.beats.map((x, k) => `<li class="${k < i ? 'done' : k === i ? 'now' : ''}"></li>`).join('')}</ol>`;
  main.innerHTML = `${options()}<nav class="crumbs" aria-label="Story"><a class="btn" href="#hub" id="tohub">All stories</a></nav>${steps}<p class="note" aria-live="polite">${esc(st.title)}. Beat ${i + 1} of ${st.beats.length}.</p><h1 tabindex="-1" id="h">${esc(b.title)}</h1>${body}${b.src && !b.form.match(/marks|coverage/) ? srcBlock(b.src, sources) : ''}
  <div class="dock"><div class="bar" style="margin:0"><button type="button" class="btn" id="prev" ${i === 0 ? 'disabled' : ''}>Previous</button><button type="button" class="btn primary" id="next">${last ? 'Finish' : 'Next'}</button></div></div><div class="bar">${last ? '' : '<button type="button" class="btn" id="skiptake">Skip to the end</button>'}<button type="button" class="btn" id="skipstory">Skip story</button></div>`;
  bindOptions(); mount(main); STATE.cleanup = () => { if (main._cleanup) main._cleanup(); };
  const bind = (id, fn) => { const e = $(id); if (e) e.onclick = fn; };
  const step = n => go(isF ? 'finale' : 'story', st.id, n, { push: false });
  bind('#tohub', e => { e.preventDefault(); go('hub'); }); bind('#prev', () => step(i - 1));
  bind('#next', () => { if (last) { prog[st.id].status = 'done'; saveProg(); go('hub'); } else step(i + 1); });
  bind('#skiptake', () => step(st.beats.length - 1)); bind('#skipstory', () => { prog[st.id] = { beat: i, status: 'skipped' }; saveProg(); go('hub'); });
  const h = $('#h'); if (h && !STATE.first) h.focus({ preventScroll: true }); STATE.first = false; say(`${st.title}. Beat ${i + 1} of ${st.beats.length}: ${b.title}.`);
  if (entry && i === 0 && !isF) playEntry(st);
  window.__beat = { story: st.id, i, form: b.form };
}
function takeawayText(b) { return b.id === 'take' ? 'The ten answers are a selection. Which cases a day contains, and which sources could be opened, decide what the day can show.' : ''; }

// ---------- finale forms ----------
const FINALE_FORMS = {
  marks(ctx) {
    const rows = cases.map((c, i) => ({ c, i, y: c.target.year, s: DAY[i] })).sort((a, b) => a.y - b.y); const gaps = L.gaps(rows.map(r => r.y));
    const story = id => STORIES.find(s => s.caseId === id);
    return { html: `<p class="note">The ten answers on one core, oldest first. Sample day: results are illustrative.</p><ol class="ev" id="core" style="list-style:none">${rows.map((r, k) => `${k ? `<li class="note" style="padding:.1rem 0 .1rem 1rem">${gaps[k - 1] ? gaps[k - 1].toLocaleString('en') + ' years' : 'the same year'}</li>` : ''}<li class="mergeable" data-y="${r.y}"><button type="button" class="btn" data-c="${r.c.id}"><strong style="min-width:4rem">${L.label(r.y)}</strong> ${esc(r.c.title)} <span class="note" style="margin-left:auto">${{ clean: 'solved', assisted: 'solved with help', missed: 'missed' }[r.s]}</span></button></li>`).join('')}</ol><div class="card" id="d" aria-live="polite"><h2 class="ch">Tap a mark</h2><p>Some marks open a story.</p></div>`,
      mount(r) { r.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { const c = cases.find(x => x.id === b.dataset.c), s = story(c.id); r.querySelector('#d').innerHTML = `<h2 class="ch">${L.label(c.target.year)}: ${esc(c.title)}</h2><p>${esc(c.target.event)}</p>${s ? `<div class="bar"><a class="btn primary" href="#s.${s.id}.0" data-open="${s.id}">Open the story</a></div>` : '<p class="note">No story for this mark in the prototype.</p>'}`; r.querySelectorAll('[data-open]').forEach(a => a.onclick = e => { e.preventDefault(); go('story', a.dataset.open, 0, { entry: true }); }); log('mark', c.id); }); } };
  },
  pair(ctx) {
    const cov = L.coverage(cases), y = cov.sameYear[0], two = cases.filter(c => c.target.year === y);
    return { html: `<div class="card pair"><h2 class="ch">${y} appears twice</h2><p>${two.map(c => `${esc(c.title)} (case ${c.order})`).join(' and ')} have the same answer. They were chosen separately.</p></div><div class="bar"><button type="button" class="btn primary" id="merge" aria-expanded="false">Bring them together</button></div><div id="lanes77" hidden></div>`,
      mount(r) { const box = r.querySelector('#lanes77'); r.querySelector('#merge').onclick = e => { const b = e.currentTarget; b.setAttribute('aria-expanded', 'true'); b.disabled = true; const f = FORMS.lanes({ lanes: 'LANES_1977' }, ctx); box.hidden = false; box.innerHTML = `<h2>${y}, as it happened elsewhere</h2>${f.html}<div class="relation"><span class="tag">Same year</span><p style="margin-top:.5rem">These events share a year. No source here says one caused another. The two marks are together because two puzzles chose 1977.</p><dl class="kv"><dt>Relationship</dt><dd>Simultaneous. No link is claimed.</dd><dt>What would make it a link</dt><dd>A source that says so.</dd></dl></div>${srcBlock(LANE_SETS.LANES_1977.events.flatMap(e => e.src), sources, 'Sources for this year')}`; f.mount(box); box.querySelector('h2').setAttribute('tabindex', '-1'); box.querySelector('h2').focus(); say(`${y}: lanes opened.`); log('pair-open', y); }; } };
  },
  coverage() {
    const c = L.coverage(cases), regs = Object.entries(c.regions).sort((a, b) => b[1] - a[1]), max = Math.max(...regs.map(r => r[1])), eras = Object.entries(c.eras).sort((a, b) => b[1] - a[1]);
    const southAsia = !Object.keys(c.regions).some(k => /south asia/i.test(k));
    const bars = list => `<div class="bars">${list.map(([k, v]) => `<div class="row"><span>${esc(k)}</span><span class="bar1" style="width:${v / max * 100}%" role="img" aria-label="${v}"></span><strong>${v}</strong></div>`).join('')}</div>`;
    return { html: `<p>Counts from the ten cases. A case can have more than one region.</p><h2>Answers by region</h2>${bars(regs)}<h2>Answers by era</h2>${bars(eras)}<div class="card"><h2 class="ch">What this shows</h2><ul style="padding-left:1.1rem"><li>${c.modern} of 10 answers fall between 1893 and 1977.</li><li>Europe and North America supply ${Math.round(c.westernShare * 100)}% of the ${c.anchorTotal} dated facts a player reads, even where the answer is elsewhere.</li><li>${southAsia ? 'No case is tagged South Asia.' : 'South Asia appears.'} Region tags are coarse: “Asia” covers five cases.</li><li>Everyday life is thin: no case is about food, clothing, housing or schooling.</li></ul></div>`, mount() {} };
  },
};

// ---------- boot ----------
(async function boot() {
  applyPrefs(); mq.addEventListener && mq.addEventListener('change', applyPrefs);
  try { pack = await (await fetch('../data/daily-pack-draft.json', { cache: 'no-store' })).json(); } catch (e) { main.innerHTML = '<h1>Could not load the pack</h1>'; return; }
  cases = pack.cases; sources = Object.fromEntries(pack.sources.map(s => [s.id, s]));
  if (!location.hash) history.replaceState({}, '', '#hub');
  STATE.first = true; route({}); window.__ready = true;
})();
