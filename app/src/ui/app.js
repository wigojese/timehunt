// Timehunt UI, Stage 7. Plain DOM, no framework. The engine and store are unchanged; this file only renders publicView() and dispatches commands.
import { validatePack } from '../engine/pack.js';
import { makeRules } from '../engine/rules.js';
import { publicView, shareText, stateDigest } from '../engine/engine.js';
import { yearLabel } from '../engine/years.js';
import { rng } from '../engine/rng.js';
import { Session } from '../store/session.js';
import { browserStorage, FaultyStorage } from '../store/storage.js';
import { t, setPseudo } from './strings.js';
import { hourglass, sunburst, pin, icons } from './art.js';

const $ = s => document.querySelector(s);
const main = $('#main'), nav = $('#nav'), dlg = $('#dlg');
const params = new URLSearchParams(location.search);
const debug = params.has('debug');
if (params.has('pseudo')) { setPseudo(true); document.documentElement.lang = 'en-XA'; }
const studyId = (params.get('study') || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 24);
const studyCond = params.get('cond') === 'B' ? 'B' : 'A';
const variants = (params.get('variant') || '').split(',').filter(Boolean);
const overrides = {};
if (variants.includes('trace')) overrides.trace = { enabled: true, cost: 2 };
if (variants.includes('cap1')) overrides.perCaseCap = 1;
if (variants.includes('deep') || (studyId && studyCond === 'B')) overrides.relationTier = 'deep';
if (variants.includes('norefund')) overrides.refundRedundant = false;

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let content, rules, daily, practice, storage, faulty, persistent = true;
let settings = { textScale: 100, reduceMotion: false, confirmSpend: true, onboarded: false, guide: true };
const ui = { route: 'trail', view: 'dossier', mode: 'daily', selected: {}, onbStep: 1, msg: '', focus: false, revealFor: null, returnTo: 'trail', heldStatus: null };
let counter = 0;
const t0 = Date.now();

// ---------- study log (local only, participant code only) ----------
const studyKey = `timehunt:study:${studyId}`;
function logEvent(e, data = {}) {
  if (!studyId) return;
  try {
    const cur = JSON.parse(localStorage.getItem(studyKey) || JSON.stringify({ participant: studyId, cond: studyCond, events: [] }));
    cur.events.push({ t: Date.now() - t0, wall: Date.now(), e, ...data });
    localStorage.setItem(studyKey, JSON.stringify(cur));
  } catch (err) { /* best effort */ }
}
function downloadStudyLog() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([localStorage.getItem(studyKey) || '{}'], { type: 'application/json' }));
  a.download = `timehunt-study-${studyId}.json`; a.click();
}

// ---------- settings, archive ----------
function loadSettings() { try { Object.assign(settings, JSON.parse(storage.getItem('timehunt:settings') || '{}')); } catch (e) { /* defaults */ } applySettings(); }
function saveSettings() { try { storage.setItem('timehunt:settings', JSON.stringify(settings)); } catch (e) { /* ignore */ } applySettings(); }
function applySettings() {
  document.documentElement.style.fontSize = settings.textScale + '%';
  document.documentElement.dataset.motion = settings.reduceMotion ? 'reduce' : 'auto';
  document.documentElement.dataset.guide = settings.guide === false ? 'off' : 'on';
}
function archive() { try { return JSON.parse(storage.getItem('timehunt:archive') || '[]'); } catch (e) { return []; } }
function pushArchive(v) {
  const list = archive();
  if (list.some(x => x.dailyId === v.dailyId)) return;
  list.unshift({ dailyId: v.dailyId, score: v.score, marks: v.cases.map(c => c.status), years: v.cases.map(c => c.resolution && c.resolution.answer) });
  try { storage.setItem('timehunt:archive', JSON.stringify(list.slice(0, 60))); } catch (e) { /* ignore */ }
}

// ---------- helpers ----------
const sess = () => (ui.mode === 'practice' && practice ? practice : daily);
const view = () => publicView(sess().state, content, rules);
function say(text) { ui.msg = text; $('#live').textContent = ''; setTimeout(() => { $('#live').textContent = text; }, 30); }
const stWord = s => ({ solved_clean: t('stSolved'), solved_assisted: t('stAssisted'), missed: t('stMissed'), active: t('stOpen'), not_started: t('stTodo') }[s]);
const cap = x => x.charAt(0).toUpperCase() + x.slice(1);
const stKey = s => ({ solved_clean: 'clean', solved_assisted: 'assisted', missed: 'missed', active: 'active', not_started: 'not_started' }[s]);

function dispatch(cmd) {
  const s = sess();
  const r = s.dispatch({ ...cmd, actionId: `ui-${++counter}-${Date.now().toString(36)}` });
  logEvent(cmd.type.toLowerCase(), { caseId: cmd.caseId, clue: cmd.clueId, year: cmd.year, ok: r.ok, code: r.error ? r.error.code : null, ev: r.events && r.events[0] ? r.events[0].type : null, correct: r.events && r.events[0] ? r.events[0].correct : undefined, insight: s.state ? s.state.insight : null });
  return r;
}

function srcList(ids) {
  const uniq = [...new Set(ids)].filter(i => content.sources[i]);
  if (!uniq.length) return '';
  return `<details class="src"><summary>${t('sources', { n: uniq.length })}</summary><ul>${uniq.map(i => { const s = content.sources[i];
    return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.publisher)}: ${esc(s.title)}</a><br><span class="${s.opened ? 'op' : 'nop'}">${s.opened ? t('opened') : t('notOpened')}</span></li>`; }).join('')}</ul></details>`;
}
function hud(v, label) {
  const left = v.insight, tot = v.insightInitial;
  return `<div class="hud"><span>${label}</span><span class="hudr"><span class="pegs" aria-hidden="true">${Array.from({ length: tot }, (_, i) => `<span class="peg ${i < left ? '' : 'off'}"></span>`).join('')}</span><span>${t('insightOf', { n: left, total: tot })}</span></span></div>`;
}
function strip(v) {
  if (v.cases.length < 2) return '';
  const n = k => v.cases.filter(c => c.status === k).length;
  const summary = t('stripSummary', { solved: n('solved_clean') + n('solved_assisted'), missed: n('missed'), todo: v.cases.length - n('solved_clean') - n('solved_assisted') - n('missed'), now: v.cursor + 1 });
  return `<div role="img" aria-label="${summary}"><ol class="strip" aria-hidden="true">${v.cases.map((c, i) => `<li ${i === v.cursor && v.status === 'active' ? 'class="now"' : ''}><span class="seg ${stKey(c.status)}"></span></li>`).join('')}</ol></div>`;
}
// The guide and scenes are the supplied illustrations (assets/characters, assets/scenes). Poses: master, idle, clue, discovery, uncertain, earlier, later, rest, back.
const POSE = { master: 'guide-lantern-map', idle: 'guide-idle', clue: 'guide-clue', discovery: 'guide-discovery', uncertain: 'guide-uncertain', earlier: 'guide-earlier', later: 'guide-later', rest: 'guide-rest', back: 'guide-back' };
const guide = (pose, cls = '') => `<div class="guide ${cls}" aria-hidden="true"><img src="assets/characters/${POSE[pose] || POSE.master}.webp?v=3" width="520" height="650" alt="" decoding="async"></div>`;
const scene = (pose, cls = '') => `<div class="scene ${cls}" aria-hidden="true"><img class="scene-img" src="assets/scenes/home-hero.webp?v=3" width="820" height="1121" alt="" decoding="async">${guide(pose, 'scene-guide')}</div>`;
const wordmark = () => `<p class="wordmark"><span class="hg" aria-hidden="true">${hourglass()}</span><span class="wm">${t('appName')}</span><span class="tag">${t('tagline')}</span></p>`;
// Decorative archetypes only (D-086): the landscape is chosen per case for variety, not as evidence of where or how an event happened.
const BANNER = { 'case-01': 'aqueduct', 'case-02': 'mountain', 'case-03': 'coast', 'case-04': 'city', 'case-05': 'desert', 'case-06': 'desert', 'case-07': 'mountain', 'case-08': 'mountain', 'case-09': 'city', 'case-10': 'aqueduct' };
const banner = (label, caseId) => { const k = BANNER[caseId] || 'aqueduct'; return `<div class="banner ${k}" aria-hidden="true"><img src="assets/scenes/banner-${k}.webp?v=4" width="1170" height="450" alt="" decoding="async"><span class="ribbon">${label}</span></div>`; };
const bar = (html, two = false) => `<div class="bar ${two ? 'two' : ''}">${html}</div>`;
const btn = (action, label, cls = '', extra = '') => `<button type="button" class="btn ${cls}" data-action="${action}" ${extra}>${label}</button>`;
function mainNav(active) {
  nav.innerHTML = [['trail', 'navToday'], ['practice', 'navPractice'], ['archive', 'navArchive'], ['settings', 'navSettings']].map(([r, k]) => `<button type="button" data-action="go" data-route="${r}" ${active === r ? 'aria-current="page"' : ''}>${icons[{ trail: 'today', practice: 'practice', archive: 'archive', settings: 'settings' }[r]]}<span>${t(k)}</span></button>`).join('');
  document.body.classList.add('has-nav');
}
function noNav() { nav.innerHTML = ''; document.body.classList.remove('has-nav'); }
function debugHtml() {
  if (!debug) return '';
  return `<div class="debug"><strong>Test tools</strong><div class="bar" style="position:static;margin:.5rem 0 0;padding:0;background:none"><button type="button" class="btn" data-action="crash-before">Arm crash before next save</button><button type="button" class="btn" data-action="crash-after">Arm crash after next save</button></div><p class="note">State digest <code>${stateDigest(sess().state)}</code></p></div>`;
}
const studyBar = () => (studyId ? `<div class="debug"><strong>Study ${esc(studyId)}, condition ${studyCond}</strong><div class="bar" style="position:static;margin:.5rem 0 0;padding:0;background:none"><button type="button" class="btn" data-action="dlstudy">Download study log</button></div></div>` : '');

// ---------- dialogs ----------
function ask({ title, body, yes, no }) {
  return new Promise(resolve => {
    const opener = document.activeElement;
    dlg.innerHTML = `<h2 id="dlgT" tabindex="-1">${title}</h2><p>${body}</p><div class="bar two"><button type="button" class="btn" data-d="no">${no}</button><button type="button" class="btn primary" data-d="yes">${yes}</button></div>`;
    let done = false;
    const finish = v => { if (done) return; done = true; dlg.removeEventListener('click', onClick); dlg.removeEventListener('close', onClose); if (dlg.open) dlg.close(); if (opener && opener.focus) opener.focus(); resolve(v); };
    const onClick = e => { const b = e.target.closest('[data-d]'); if (b) finish(b.dataset.d === 'yes'); };
    const onClose = () => finish(false);
    dlg.addEventListener('click', onClick); dlg.addEventListener('close', onClose);
    dlg.showModal();
    dlg.querySelector('[data-d="no"]').focus();
  });
}

// ---------- screens ----------
function renderOnboarding() {
  const n = ui.onbStep, k = ['onb1', 'onb2', 'onb3'][n - 1];
  noNav();
  const nextBtns = bar(`${n < 3 ? btn('onb-next', t('next'), 'primary') : btn('onb-done', t('done'), 'primary')}${n < 3 ? btn('onb-done', t('skip')) : ''}`);
  if (n === 1) return `${wordmark()}${scene('discovery', 'welcome')}
    <p class="note" style="text-align:center">${t('stepOf', { n })}</p><h1 id="h" tabindex="-1" style="text-align:center">${t(k + 't')}</h1><div class="bubble">${t(k)}</div><div class="spacer"></div>${nextBtns}`;
  const picture = n === 2 ? `<span class="pegs">${Array.from({ length: 8 }, () => '<span class="peg"></span>').join('')}</span>${guide('clue')}` : `${guide('back')}`;
  return `<div class="paper" style="margin-top:1rem"><p class="note" style="margin-top:.5rem">${t('stepOf', { n })}</p><h1 id="h" tabindex="-1">${t(k + 't')}</h1>
    <div class="howstep"><span class="n" aria-hidden="true">${n}</span><span class="picture" aria-hidden="true">${picture}</span><p>${t(k)}</p></div><div class="spacer"></div>${nextBtns}</div>`;
}

function renderTrail() {
  const v = publicView(daily.state, content, rules);
  mainNav('trail');
  const done = v.status === 'completed';
  const c = v.cases[v.cursor];
  const started = v.cases.some(x => x.status !== 'not_started' && x.status !== 'active') || (c && c.spent > 0);
  const label = done ? t('seeDay') : started || v.cursor > 0 ? t('resumeCase', { n: v.cursor + 1 }) : t('startCase', { n: 1 });
  const rows = v.cases.map((x, i) => `<li class="${i === v.cursor && !done ? 'cur' : ''}">${pin(i === v.cursor && !done ? '#E1A52C' : '#A94A28')}<span class="card"><span><span class="mk ${stKey(x.status)}" aria-hidden="true"></span>${t('caseOf', { n: i + 1 }).replace(' of 10', '')}</span><span class="note">${stWord(x.status)}</span></span></li>`).join('');
  return `${wordmark()}${scene('idle', 'homehero')}${hud(v, t('trailTitle'))}${strip(v)}
  <h1 id="h" tabindex="-1" class="sr">${t('trailTitle')}</h1><p>${t('trailLead')}</p>
  <ol class="path">${rows}</ol>
  <p class="note" style="margin-top:.75rem">${t('conv')}</p>
  <div class="spacer"></div>${studyBar()}
  ${bar(btn('trail-go', label, 'primary') + btn('howto', t('howItWorks')))}`;
}

function bands(c) {
  const free = c.freeCandidates, lo = c.corridor[0], hi = c.corridor[1];
  const later = hi > free[free.length - 1] ? `<div class="band hatch"><span>${t('ruledFree', { range: `${yearLabel(free[free.length - 1] + 1)} to ${yearLabel(hi)}` })}</span></div>` : '';
  const earlier = lo < free[0] ? `<div class="band hatch"><span>${t('ruledFree', { range: `${yearLabel(lo)} to ${yearLabel(free[0] - 1)}` })}</span></div>` : '';
  return { later, earlier };
}
function yearStack(c) {
  const b = bands(c), sel = ui.selected[c.id];
  const items = [...c.freeCandidates].reverse().map(y => {
    const live = c.candidates.includes(y);
    return `<label class="layer ${live ? '' : 'out stipple'}"><input type="radio" name="yr" value="${y}" ${live ? '' : 'disabled'} ${sel === y ? 'checked' : ''}><span class="y">${yearLabel(y)}</span><span class="st">${live ? (sel === y ? t('selected') : t('pressSelect')) : t('ruledClue')}</span></label>`;
  }).join('');
  return `<fieldset><legend id="lg">${t('chooseYear', { n: c.candidates.length })}</legend><div class="core" role="radiogroup" aria-labelledby="lg">${b.later}${items}${b.earlier}</div></fieldset>`;
}
function precise(c) {
  return `<details class="precise"><summary>${t('typeYear')}</summary><label class="l" for="ty">${t('typeYearLabel')}</label><input id="ty" type="text" inputmode="numeric" autocomplete="off"><button type="button" class="btn" data-action="typeyear">${t('useYear')}</button><p class="msg" id="tymsg" role="status"></p></details>`;
}
function notesHtml(c) {
  return `<ol class="notes">${c.free.map(f => `<li>${esc(f.text)}</li>`).join('')}${c.relation ? `<li>${esc(c.relation.text)}</li>` : ''}${c.context.map(x => `<li>${esc(x.text)}</li>`).join('')}</ol>`;
}
function freeSrc(c) { return srcList([...c.free.flatMap(f => f.sourceIds), ...(c.relation ? c.relation.sourceIds : [])]); }
const caseHead = (v, c) => `${hud(v, v.mode === 'practice' ? 'Practice' : t('caseOf', { n: c.order }))}${strip(v)}`;

function renderDossier(v, c) {
  noNav();
  return `${caseHead(v, c)}<p class="lens" style="margin-top:.75rem">${esc(c.lens)}</p><h1 id="h" tabindex="-1">${esc(c.title)}</h1><p class="q">${esc(c.question)}</p>
  <h2 style="font:700 1.0625rem var(--sans);margin-top:1rem">${t('notes')}</h2>${notesHtml(c)}${freeSrc(c)}
  <p class="note" style="margin-top:.75rem">${t('yearsFreeLine', { n: c.candidates.length })}. ${t('conv')}</p><div class="spacer"></div>
  ${bar(btn('to-hunt', t('readEvidence'), 'primary'))}`;
}
function renderHunt(v, c) {
  noNav();
  return `${caseHead(v, c)}<h1 id="h" tabindex="-1" style="font-size:1.375rem;font-family:var(--serif)">${esc(c.question)}</h1>
  <details><summary>${t('rereadNotes', { n: c.free.length + (c.relation ? 1 : 0) })}</summary>${notesHtml(c)}</details>
  ${yearStack(c)}${precise(c)}<p class="msg" id="msg" role="alert">${esc(ui.msg)}</p><div class="spacer"></div>${debugHtml()}
  ${bar(`${btn('to-evidence', t('evidenceBtn'))}${btn('lock', t('lockBtn', { year: ui.selected[c.id] !== undefined ? yearLabel(ui.selected[c.id]) : '' }).replace(/\s+$/, '') || t('lockBtn', { year: '' }), 'primary')}`, true)}`;
}
function renderEvidence(v, c) {
  noNav();
  const clues = c.clues.map(cl => {
    const tier = cl.tier === 'nudge' ? t('nudge') : t('deep');
    if (cl.revealed) return `<li class="clue rev"><strong>${esc(cl.category)}</strong> (${tier}, ${t('revealed').toLowerCase()})<br>${esc(cl.text)}${srcList(cl.sourceIds)}</li>`;
    const poor = cl.cost > v.insight;
    return `<li class="clue"><span><strong>${esc(cl.category)}</strong><br><span class="note">${tier}${poor ? '. ' + t('notEnough') : ''}</span></span>${btn('reveal', t('reveal', { cost: cl.cost }), '', `data-clue="${esc(cl.id)}" ${poor ? 'disabled' : ''}`)}</li>`;
  }).join('');
  const trace = v.rules.trace.enabled ? `<h2 style="font:700 1.0625rem var(--sans)">${t('traceTitle')}</h2><div class="ctl"><label class="l" for="trsel">${t('traceLabel')}</label><select id="trsel">${c.freeCandidates.map(y => `<option value="${y}">${yearLabel(y)}</option>`).join('')}</select></div>${btn('trace', t('traceBtn', { cost: v.rules.trace.cost }), '', v.rules.trace.cost > v.insight ? 'disabled' : '')}${c.trace.length ? `<p>${c.trace.map(x => t('traceResult', { year: yearLabel(x.year), r: t({ earlier: 'rEarlier', later: 'rLater', same: 'rSame' }[x.result]) })).join('; ')}</p>${c.trace[c.trace.length - 1].result === 'same' ? '' : guide(c.trace[c.trace.length - 1].result, 'trace-guide')}` : ''}` : '';
  return `${caseHead(v, c)}<h1 id="h" tabindex="-1">${t('evidenceTitle')}</h1><p class="note">${t('yearsLeft', { n: c.candidates.length })}</p>
  <h2 style="font:700 1.0625rem var(--sans)">${t('notes')}</h2>${notesHtml(c)}${freeSrc(c)}
  <h2 style="font:700 1.0625rem var(--sans)">${t('extraClues')}</h2>
  ${v.insight === 0 ? `<p class="note" role="status">${t('zeroInsight')}</p>` : ''}
  <ul class="sheet" style="list-style:none">${clues || '<li class="row">No extra clues for this case.</li>'}</ul><p class="note">${t('noNew')}</p>${trace}
  <p class="msg" role="alert">${esc(ui.msg)}</p><div class="spacer"></div>${debugHtml()}${bar(btn('to-hunt', t('backToYears'), 'primary'))}`;
}
function renderResult(v, c) {
  noNav();
  const r = c.resolution, hit = c.lock.correct, practiceMode = v.mode === 'practice';
  const last = v.cursor === v.cases.length - 1;
  const proof = Object.values(r.proof).map(p => `<li>${esc(p)}</li>`).join('');
  const srcs = [...c.free.flatMap(f => f.sourceIds), ...c.clues.flatMap(x => x.sourceIds || []), ...(c.relation ? c.relation.sourceIds : []), ...r.reveal.flatMap(x => x.sourceIds)];
  const nextLabel = practiceMode ? t('navPractice') : last ? t('seeDay') : t('nextCase');
  return `${caseHead(v, c)}<div class="result ${hit ? 'hit' : 'miss'}" role="status"><p><span class="mk ${hit ? (c.status === 'solved_clean' ? 'clean' : 'assisted') : 'missed'}" aria-hidden="true"></span>&nbsp; ${cap(hit ? t('stSolved') : t('stMissed'))}. ${t('youLocked', { year: yearLabel(c.lock.year) })}</p>
  <span class="yearwrap">${hit ? sunburst() : ''}<h1 id="h" tabindex="-1" class="big">${yearLabel(r.answer)}</h1></span><p>${esc(r.event)}.</p>${guide(hit ? 'discovery' : 'uncertain')}</div>
  ${hit ? '' : `<p style="margin-top:.75rem">${esc(r.missExplanation)}</p><p class="note">${t('missNote')}</p>`}
  <p class="note" style="margin-top:.75rem">${esc(r.definition)} ${esc(r.discoveryVsEvent)}</p>
  ${proof ? `<details><summary>${t('whyNot')}</summary><ul style="padding-left:1.25rem">${proof}</ul></details>` : ''}
  ${r.reveal.map(x => `<p style="margin-top:.75rem"><strong>${esc(x.title)}.</strong> ${esc(x.text)}</p>`).join('')}${srcList(srcs)}
  <div class="spacer"></div>${debugHtml()}${bar(`${btn('world', t('worldAround', { year: yearLabel(r.answer) }))}${btn('advance', nextLabel, 'primary')}`, true)}`;
}
function renderFinish(v) {
  mainNav('trail');
  const sc = v.score;
  const all = v.cases.map((c, i) => ({ ...c, i })).sort((a, b) => a.resolution.answer - b.resolution.answer);
  const rows = all.map(c => `<li class="tl"><span class="y">${yearLabel(c.resolution.answer)}</span><span>${esc(content.cases[c.i].title)}<span class="rb" style="width:${Math.max(4, Math.round(100 * (1 - Math.sqrt(Math.max(0, 2026 - c.resolution.answer)) / Math.sqrt(2030))))}%"></span></span><span><span class="mk ${stKey(c.status)}" aria-hidden="true"></span><span class="sr">${stWord(c.status)}</span></span></li>`).join('');
  return `${hud(v, t('appName'))}${strip(v)}<h1 id="h" tabindex="-1">${t('dayDone', { solved: sc.solved, total: v.cases.length, left: sc.insightLeft })}</h1><p>${t('dayDoneSub', { clean: sc.clean, assisted: sc.assisted, missed: sc.missed })}</p>
  <ul class="sheet" style="list-style:none">${rows}</ul>
  <h2 style="font:700 1.0625rem var(--sans)">${t('shareTitle')}</h2><pre id="share">${esc(shareText(daily.state, content))}</pre>
  <div class="spacer"></div>${studyBar()}${bar(`${btn('copy', t('copy'))}${btn('world-all', t('revealTitle'), 'primary')}`, true)}`;
}
function renderReveal() {
  noNav();
  const idx = ui.revealFor;
  const list = idx === 'all' ? [...content.cases].map((c, i) => ({ c, i })).sort((a, b) => a.c.target - b.c.target) : [{ c: content.cases[idx], i: idx }];
  const sessionView = view();
  const body = list.map(({ c, i }) => {
    const cv = sessionView.cases.find(x => x.id === c.id);
    if (!cv || !cv.resolution) return '';
    return `<h2>${yearLabel(c.target)}. ${esc(c.title)}</h2>${cv.resolution.reveal.map(x => `<p style="margin:.5rem 0"><strong>${esc(x.title)}.</strong> ${esc(x.text)}</p>`).join('')}${srcList(cv.resolution.reveal.flatMap(x => x.sourceIds))}`;
  }).join('');
  return `<h1 id="h" tabindex="-1">${t('revealTitle')}</h1><p class="note">${t('revealNote')}</p>${body}<div class="spacer"></div>${bar(btn('back', t('back'), 'primary'))}`;
}
function renderPractice() {
  mainNav('practice');
  const rows = content.cases.map(c => `<li class="row"><span>${esc(c.lens)}</span>${btn('practice-start', t('practiceCase', { n: c.order }), '', `data-case="${c.id}"`)}</li>`).join('');
  return `<h1 id="h" tabindex="-1">${t('practiceTitle')}</h1><p>${t('practiceLead')}</p>
  <div class="ctl"><label class="l" for="seed">${t('practiceSeed')}</label><input id="seed" type="text" inputmode="numeric" value="1" style="width:6rem;min-height:2.75rem;border:.125rem solid var(--ink);padding:.25rem .5rem;background:var(--paper)"></div>
  <ul class="sheet" style="list-style:none">${rows}</ul><div class="spacer"></div>${bar(btn('practice-random', t('practiceRandom'), 'primary'))}`;
}
function renderArchive() {
  mainNav('archive');
  const list = archive();
  const rows = list.map(a => `<li class="row" style="display:block"><strong>${esc(a.dailyId)}</strong><br>${t('archiveRow', { solved: a.score.solved, total: a.marks.length, left: a.score.insightLeft })}<br><span aria-hidden="true">${a.marks.map(m => `<span class="mk ${stKey(m)}"></span>`).join(' ')}</span><span class="sr">${a.marks.map((m, i) => `Case ${i + 1}: ${stWord(m)}`).join('. ')}</span></li>`).join('');
  return `<h1 id="h" tabindex="-1">${t('archiveTitle')}</h1>${list.length ? `<ul class="sheet" style="list-style:none">${rows}</ul>` : `<p>${t('archiveEmpty')}</p>${guide('rest', 'rest-guide')}`}`;
}
function renderSettings() {
  mainNav('settings');
  const sizes = [[100, 'size100'], [130, 'size130'], [160, 'size160'], [200, 'size200']];
  return `<h1 id="h" tabindex="-1">${t('settingsTitle')}</h1>
  <fieldset class="sheet"><legend class="sr">${t('textSize')}</legend><div class="ctl" style="display:block"><strong>${t('textSize')}</strong></div>${sizes.map(([p, k]) => `<label class="ctl"><span>${t(k)}</span><input type="radio" name="ts" value="${p}" ${settings.textScale === p ? 'checked' : ''}></label>`).join('')}</fieldset>
  <div class="sheet"><label class="ctl"><span>${t('reduceMotion')}</span><input type="checkbox" id="rm" ${settings.reduceMotion ? 'checked' : ''}></label><label class="ctl"><span>${t('showGuide')}</span><input type="checkbox" id="gd" ${settings.guide === false ? '' : 'checked'}></label><label class="ctl"><span>${t('confirmSpend')}</span><input type="checkbox" id="cs" ${settings.confirmSpend ? 'checked' : ''}></label>
  <div class="ctl"><span>${t('language')}</span><span>${t('langEn')}</span></div></div><p class="note">${t('langNote')}</p>
  <div style="margin-top:1rem">${btn('howto', t('howItWorks'))}</div><div style="margin-top:.75rem">${btn('clear', t('clearData'))}</div>${studyBar()}`;
}
function renderHeld() {
  noNav();
  return `<h1 id="h" tabindex="-1">${t('heldTitle')}</h1><p>${t('held_' + ui.heldStatus)}</p><p>${t('heldBody')}</p><div class="spacer"></div>${bar(btn('discard', t('startNew'), 'primary'))}`;
}
function renderError(title, errors) {
  noNav();
  return `<h1 id="h" tabindex="-1">${esc(title)}</h1><p>${t('errNothing')}</p><ul class="err">${errors.map(e => `<li>${esc(e.code)} at ${esc(e.path)}: ${esc(e.msg)}</li>`).join('')}</ul>`;
}

// ---------- router ----------
function routeForState() {
  const v = view();
  if (v.status === 'completed') return ui.mode === 'practice' ? 'practiceDone' : 'finish';
  const c = v.cases[v.cursor];
  return c.status === 'active' ? 'case' : 'result';
}
function render(opts = {}) {
  let html = '', routeKey = ui.route;
  main.setAttribute('aria-busy', 'false');
  try {
    if (ui.route === 'held') html = renderHeld();
    else if (ui.route === 'onboarding') html = renderOnboarding();
    else if (ui.route === 'trail') html = renderTrail();
    else if (ui.route === 'practice') html = renderPractice();
    else if (ui.route === 'archive') html = renderArchive();
    else if (ui.route === 'settings') html = renderSettings();
    else if (ui.route === 'reveal') html = renderReveal();
    else if (ui.route === 'play') {
      const rk = routeForState();
      if (rk === 'finish') { if (ui.mode === 'daily') { pushArchive(view()); html = renderFinish(view()); } else { ui.mode = 'daily'; ui.route = 'practice'; return render(); } }
      else if (rk === 'practiceDone') { ui.mode = 'daily'; ui.route = 'practice'; return render(); }
      else {
        const v = view(), c = v.cases[v.cursor];
        routeKey = rk === 'result' ? 'result' : ui.view;
        html = rk === 'result' ? renderResult(v, c) : ui.view === 'dossier' ? renderDossier(v, c) : ui.view === 'evidence' ? renderEvidence(v, c) : renderHunt(v, c);
      }
    }
  } catch (e) { html = renderError('Something went wrong', [{ code: 'RENDER', path: ui.route, msg: String(e.message) }]); console.error(e); }
  const onPlay = ui.route === 'play' && !html.startsWith('<h1') && !html.includes('class="banner"');
  if (onPlay) {
    const v = view(), c = v.cases && v.cases[v.cursor];
    const lab = v.mode === 'practice' ? 'Practice' : t('caseOf', { n: c.order });
    html = routeKey === 'result' ? `<div class="paper" style="margin-top:.75rem">${html}</div>` : `${banner(lab, c.id)}<div class="paper">${html}</div>`;
  }
  $('#app').dataset.theme = onPlay ? 'map' : 'paper';
  main.innerHTML = html;
  logEvent('view', { route: ui.route, sub: routeKey, cursor: sess() && sess().state ? sess().state.cursor : null, insight: sess() && sess().state ? sess().state.insight : null });
  if (opts.focus !== false && ui.focus) { const h = $('#h'); if (h) h.focus(); ui.focus = false; }
}
function clearResume() { if (ui.resumeNote) { ui.resumeNote = ''; setBanner(); } }
function go(route, extra = {}) { clearResume(); Object.assign(ui, extra, { route, focus: true, msg: '' }); history.pushState({ route, view: ui.view }, '', `#/${route}${route === 'play' ? '/' + ui.view : ''}`); render(); window.scrollTo(0, 0); }
function setView(v) { clearResume(); ui.view = v; ui.focus = true; ui.msg = ''; history.pushState({ route: 'play', view: v }, '', `#/play/${v}`); render(); window.scrollTo(0, 0); }
window.addEventListener('popstate', e => {
  const s = e.state;
  if (!s || !s.route || !content) return;
  ui.route = s.route; if (s.view) ui.view = s.view; ui.focus = true; render();
});

// ---------- actions ----------
document.addEventListener('click', async e => {
  const el = e.target.closest('[data-action]');
  if (!el || el.disabled) return;
  const a = el.dataset.action;
  const v = ['play'].includes(ui.route) && sess().state ? view() : null;
  const c = v && v.cases[v.cursor];
  if (a === 'go') return go(el.dataset.route, { mode: 'daily' });
  if (a === 'onb-next') { ui.onbStep++; ui.focus = true; return render(); }
  if (a === 'onb-done') { settings.onboarded = true; saveSettings(); return go('trail'); }
  if (a === 'howto') { ui.onbStep = 1; return go('onboarding'); }
  if (a === 'trail-go') { ui.mode = 'daily'; const vv = publicView(daily.state, content, rules); ui.view = vv.cases[vv.cursor] && vv.cases[vv.cursor].spent > 0 ? 'hunt' : 'dossier'; return go('play'); }
  if (a === 'to-hunt') return setView('hunt');
  if (a === 'to-evidence') return setView('evidence');
  if (a === 'back') return history.length > 1 ? history.back() : go('trail');
  if (a === 'lock') {
    const y = ui.selected[c.id];
    if (y === undefined) { ui.msg = t('chooseFirst'); say(ui.msg); $('#msg').textContent = ui.msg; const first = main.querySelector('input[name=yr]:not(:disabled)'); if (first) first.focus(); return; }
    const ok = await ask({ title: t('confirmLockT', { year: yearLabel(y) }), body: t('confirmLock'), yes: t('confirmLockYes', { year: yearLabel(y) }), no: t('keepChoosing') });
    if (!ok) return;
    const r = dispatch({ type: 'LOCK', caseId: c.id, year: y });
    if (!r.ok) { ui.msg = r.error.message; say(ui.msg); return render(); }
    ui.focus = true; ui.msg = ''; window.scrollTo(0, 0); return render();
  }
  if (a === 'reveal') {
    const cl = c.clues.find(x => x.id === el.dataset.clue);
    if (settings.confirmSpend) {
      const ok = await ask({ title: t('confirmRevealT'), body: t('confirmReveal', { category: esc(cl.category), tier: cl.tier === 'nudge' ? t('nudge') : t('deep'), cost: cl.cost, left: v.insight - cl.cost }), yes: t('confirmRevealYes', { cost: cl.cost }), no: t('cancel') });
      if (!ok) return;
    }
    const r = dispatch({ type: 'REVEAL', caseId: c.id, clueId: el.dataset.clue });
    if (!r.ok) ui.msg = r.error.code === 'SAVE_FAILED' ? t('saveFailed') : r.error.message;
    else { const ev = r.events[0]; ui.msg = ev && ev.type === 'CLUE_REVEALED' ? (ev.charged ? t('spent', { n: ev.charged }) : t('free')) : ''; }
    say(ui.msg); return render({ focus: false });
  }
  if (a === 'trace') {
    const y = Number($('#trsel').value);
    const r = dispatch({ type: 'TRACE', caseId: c.id, year: y });
    ui.msg = r.ok ? '' : r.error.message; say(ui.msg); return render({ focus: false });
  }
  if (a === 'typeyear') {
    const raw = $('#ty').value.trim().toUpperCase(), m = raw.match(/^(\d{1,4})\s*(BCE|BC|CE|AD)?$/), out = $('#tymsg');
    if (!m) { out.textContent = t('badYear'); return; }
    const n = Number(m[1]), year = /^BC/.test(m[2] || '') ? 1 - n : n;
    if (!c.freeCandidates.includes(year)) { out.textContent = t('badYear'); return; }
    if (!c.candidates.includes(year)) { out.textContent = t('ruledOutYear'); return; }
    ui.selected[c.id] = year; logEvent('select_year', { caseId: c.id, year, via: 'typed' }); render({ focus: false });
    const r = main.querySelector(`input[name=yr][value="${year}"]`); if (r) r.focus(); return;
  }
  if (a === 'advance') {
    const r = dispatch({ type: 'ADVANCE', caseId: c.id });
    if (!r.ok) { say(r.error.message); return; }
    ui.view = 'dossier'; ui.focus = true; ui.msg = '';
    if (ui.mode === 'practice' && sess().state.status === 'completed') { ui.mode = 'daily'; return go('practice'); }
    window.scrollTo(0, 0); return render();
  }
  if (a === 'world') { const idx = content.cases.findIndex(x => x.id === c.id); return go('reveal', { revealFor: idx }); }
  if (a === 'world-all') return go('reveal', { revealFor: 'all' });
  if (a === 'copy') { const txt = $('#share').textContent; try { await navigator.clipboard.writeText(txt); say(t('copied')); el.textContent = t('copied'); } catch (err) { const r = document.createRange(); r.selectNodeContents($('#share')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); say('Text selected. Copy it.'); } return; }
  if (a === 'practice-start') return startPractice(el.dataset.case);
  if (a === 'practice-random') { const seed = Number($('#seed').value) || 1; return startPractice(rng(seed).pick(content.cases).id); }
  if (a === 'clear') {
    const ok = await ask({ title: t('clearConfirmT'), body: t('clearConfirm'), yes: t('clearYes'), no: t('cancel') });
    if (!ok) return;
    try { Object.keys(localStorage).filter(k => k.startsWith('timehunt:')).forEach(k => localStorage.removeItem(k)); } catch (err) { /* ignore */ }
    location.href = location.pathname + location.search;
  }
  if (a === 'discard') { daily.discardAndStart(); return go('trail'); }
  if (a === 'dlstudy') { logEvent('download'); return downloadStudyLog(); }
  if (a === 'crash-before') { faulty && faulty.arm('before'); say('Next save will crash before writing.'); return; }
  if (a === 'crash-after') { faulty && faulty.arm('after'); say('Next save will crash after writing.'); return; }
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.name === 'yr') { const c = view().cases[view().cursor]; ui.selected[c.id] = Number(el.value); logEvent('select_year', { caseId: c.id, year: Number(el.value) }); main.querySelectorAll('.layer .st').forEach(s => { const lab = s.closest('.layer'); const inp = lab.querySelector('input'); if (!inp.disabled) s.textContent = inp.checked ? t('selected') : t('pressSelect'); }); const lock = main.querySelector('[data-action=lock]'); if (lock) lock.textContent = t('lockBtn', { year: yearLabel(Number(el.value)) }); $('#msg') && ($('#msg').textContent = ''); }
  if (el.name === 'ts') { settings.textScale = Number(el.value); saveSettings(); }
  if (el.id === 'rm') { settings.reduceMotion = el.checked; saveSettings(); }
  if (el.id === 'gd') { settings.guide = el.checked; saveSettings(); }
  if (el.id === 'cs') { settings.confirmSpend = el.checked; saveSettings(); }
});
function startPractice(caseId) {
  practice = new Session({ content, rules, storage, mode: 'practice', caseIds: [caseId], dailyId: `${content.packId}:practice` });
  practice.load();
  if (!practice.state) return go('practice');
  ui.mode = 'practice'; ui.view = 'dossier';
  if (practice.state.status === 'completed') { practice.discardAndStart(); }
  go('play');
}

// ---------- boot ----------
function setBanner() {
  const parts = [];
  if (content && content.status !== 'PUBLISHABLE') parts.push(t('draftBanner'));
  if (!persistent) parts.push(t('unsaved'));
  if (!navigator.onLine) parts.push(t('offline'));
  if (ui.resumeNote) parts.push(ui.resumeNote);
  $('#banner').textContent = parts.join(' ');
}
window.addEventListener('online', setBanner); window.addEventListener('offline', setBanner);

async function boot() {
  const bs = browserStorage(); storage = bs.storage; persistent = bs.persistent;
  loadSettings();
  if (debug) { faulty = new FaultyStorage(storage); storage = faulty; }
  let raw;
  try {
    const res = await fetch('data/daily-pack-draft.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    raw = await res.json();
  } catch (e) { main.innerHTML = renderError(t('errLoad'), [{ code: 'LOAD', path: 'data/daily-pack-draft.json', msg: String(e.message) }]); main.setAttribute('aria-busy', 'false'); main.querySelector('#h').focus(); return; }
  const v = validatePack(raw, { allowDraft: true });
  if (!v.ok) { main.innerHTML = renderError(t('errPack'), v.errors); main.setAttribute('aria-busy', 'false'); main.querySelector('#h').focus(); return; }
  content = v.content;
  try { rules = makeRules(overrides); } catch (e) { main.innerHTML = renderError('These rules are invalid', [{ code: 'RULES', path: '', msg: e.message }]); return; }
  daily = new Session({ content, rules, storage, ...(studyId ? { dailyId: `${content.packId}:${studyId}` } : {}) });
  const status = daily.load();
  if (studyId) logEvent('session_start', { resumed: status === 'resumed', rules: rules.id });
  if (!daily.state) { ui.heldStatus = status; ui.route = 'held'; setBanner(); return render(); }
  if (status === 'resumed' && daily.state.status === 'active' && (daily.state.cursor > 0 || daily.state.cases[0].spent > 0 || daily.state.cases[0].status !== 'active')) ui.resumeNote = t('resumeBanner', { n: daily.state.cursor + 1 });
  setBanner();
  ui.route = settings.onboarded ? 'trail' : 'onboarding';
  const h = location.hash.replace('#/', '').split('/')[0];
  if (settings.onboarded && ['practice', 'archive', 'settings'].includes(h)) ui.route = h;
  history.replaceState({ route: ui.route, view: ui.view }, '', `#/${ui.route}`);
  render();
}
boot();
