// Isolated motion prototype: path-scroll trail, temporal camera, evidence branch, lock opening, one World Reveal pathway.
// It reads the Stage 3 pack directly and does not use the game engine: the point here is movement, not rules.
import { yearToY, yToYear } from './camera.js';
import { CamView } from './view-camera.js';
import { Transition } from './transition.js';
import { pathPosition, scrollFraction, scrollForMark } from './trail.js';
import { Perf } from './perf.js';
import { REVEALS } from './reveal-data.js';
import { yearLabel } from '../../src/engine/years.js';

const $ = s => document.querySelector(s);
const main = $('#main'), params = new URLSearchParams(location.search);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const href = u => /^https?:\/\//i.test(String(u)) ? esc(u) : "#"; // only http(s) links; a pack must never inject javascript: URLs
const perf = new Perf(); window.__perf = perf; window.__yAt = y => (cur.view ? yToYear(cur.view.cam, y) : null); window.__yTo = y => (cur.view ? yearToY(cur.view.cam, y) : null);
const DAY = ['assisted', 'assisted', 'assisted', 'clean', 'missed', 'clean', 'assisted', 'assisted', 'assisted', 'clean']; // illustrative: the Stage 4 scripted day
let pack, cases, sources;
const prefs = { reduce: false, scale: 100 };
try { Object.assign(prefs, JSON.parse(sessionStorage.getItem('mp:prefs') || '{}')); } catch (e) { /* defaults */ }
const mq = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => prefs.reduce || mq.matches;
function applyPrefs() { document.documentElement.style.fontSize = prefs.scale + '%'; document.documentElement.dataset.motion = reduced() ? 'reduce' : 'auto'; try { sessionStorage.setItem('mp:prefs', JSON.stringify(prefs)); } catch (e) { /* ignore */ } }
const say = t => { const l = $('#live'); l.textContent = ''; setTimeout(() => { l.textContent = t; }, 30); };
history.scrollRestoration = 'manual';
const proto = (() => { try { return JSON.parse(sessionStorage.getItem('mp:proto') || '{}'); } catch (e) { return {}; } })();
const saveProto = () => { try { sessionStorage.setItem('mp:proto', JSON.stringify(proto)); } catch (e) { /* ignore */ } };
const scrollMem = (() => { try { return JSON.parse(sessionStorage.getItem('mp:scroll') || '{}'); } catch (e) { return {}; } })();
const saveScroll = key => { scrollMem[key] = scrollY; try { sessionStorage.setItem('mp:scroll', JSON.stringify(scrollMem)); } catch (e) { /* ignore */ } };

// ---------- routing with scroll restoration ----------
let cur = { key: '', cleanup: null, view: null, branch: null, lock: null };
const parse = () => { const p = location.hash.replace(/^#\//, '').split('/'); return { name: p[0] || 'trail', id: p[1], sub: p[2] }; };
function optionsBar() {
  return `<details class="opts"><summary class="btn">Display options</summary><nav class="top" aria-label="Display options"><label class="opt"><input type="checkbox" id="optrm" ${prefs.reduce ? 'checked' : ''}> Reduce motion</label>${[100, 130, 160, 200].map(s => `<button type="button" class="btn" data-scale="${s}" aria-pressed="${prefs.scale === s}">${s}%</button>`).join('')}</nav></details>`;
}
function bindOptions() {
  $('#optrm').onchange = e => { prefs.reduce = e.target.checked; applyPrefs(); };
  document.querySelectorAll('[data-scale]').forEach(b => b.onclick = () => { prefs.scale = Number(b.dataset.scale); applyPrefs(); document.querySelectorAll('[data-scale]').forEach(x => x.setAttribute('aria-pressed', String(Number(x.dataset.scale) === prefs.scale))); });
}
function navigate(hash, replace = false) {
  if (replace) history.replaceState({}, '', hash); else history.pushState({}, '', hash);
  route(true);
}
window.addEventListener('popstate', () => route(false));
document.addEventListener('click', e => { const a = e.target.closest('a[href^="#/"]'); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.button) return; e.preventDefault(); navigate(a.getAttribute('href')); });
window.addEventListener('pagehide', () => saveScroll(cur.key));
function route(pushed) {
  if (cur.key) saveScroll(cur.key);
  const r = parse(), key = r.name === 'case' || r.name === 'reveal' ? `${r.name}/${r.id}` : r.name;
  if (cur.key === key && r.name === 'case') return syncBranch(r.sub === 'evidence');
  if (cur.cleanup) cur.cleanup();
  cur = { key, cleanup: null, view: null, branch: null, lock: null };
  window.__camView = null;
  if (r.name === 'case') renderCase(r.id, r.sub === 'evidence'); else if (r.name === 'reveal') renderReveal(r.id); else renderTrail();
  if (!pushed) { const y = scrollMem[key] || 0; const restore = () => scrollTo(0, y); requestAnimationFrame(restore); setTimeout(restore, 150); setTimeout(restore, 450); } else scrollTo(0, 0);
  const h = main.querySelector('h1'); if (h && pushed) h.focus({ preventScroll: true });
}

// ---------- trail: path scroll ----------
function renderTrail() {
  const n = cases.length, rowH = 72;
  main.innerHTML = `${optionsBar()}<h1 tabindex="-1" id="h">The Daily Ten, as a path</h1>
  <p class="lede">Scroll the page. The path moves with your scroll, and the page keeps scrolling after it. Nothing here captures your scroll. Use Previous and Next, or the list below, if you prefer.</p>
  <div class="path" id="path"><div class="pathcam" id="pcam" role="group" aria-label="Path of ten cases, moved by scrolling"><div class="strip" id="strip">${cases.map((c, i) => `<a class="pm" href="#/case/${c.id}" data-i="${i}" style="top:${i * rowH}px"><span class="mkx ${DAY[i]}" aria-hidden="true"></span><span class="yy">${yearLabel(c.target.year)}</span><span class="tt">${i + 1}. ${esc(c.title)}<br><span class="note">${{ clean: 'solved', assisted: 'solved with help', missed: 'missed' }[DAY[i]]}</span></span></a>`).join('')}</div><div class="lens" aria-hidden="true"></div><div class="pcctl"><button type="button" class="btn" id="prev">Previous case</button><button type="button" class="btn" id="next">Next case</button></div></div></div>
  <p class="note" id="where" aria-live="polite"></p>
  <div class="after"><h2>The page goes on</h2><div class="card"><p>This card is below the path. If scrolling were trapped by the path, you could not read this.</p></div>
  <h2>All ten, as plain links</h2><ol class="list">${cases.map((c, i) => `<li><a href="#/case/${c.id}" style="display:inline-block;min-height:2.75rem;padding:.5rem 0">${esc(c.title)}</a></li>`).join('')}</ol></div>`;
  bindOptions();
  const path = $('#path'), strip = $('#strip'), pcam = $('#pcam'), marks = [...strip.children];
  const geom = () => { const startY = path.getBoundingClientRect().top + scrollY, len = path.offsetHeight - pcam.offsetHeight; return { startY, len }; };
  let raf = 0, lastNearest = -1;
  const update = () => { raf = 0; const { startY, len } = geom(), f = scrollFraction(scrollY, startY, len), p = pathPosition(f, n), pos = p.index + p.t, H = pcam.clientHeight;
    strip.style.transform = `translateY(${H / 2 - pos * rowH - rowH / 2}px)`;
    marks.forEach((m, i) => { const d = Math.abs(i - pos); m.style.opacity = Math.max(.9, 1 - .05 * d); m.style.transform = `scale(${Math.max(.62, 1 - .2 * d)})`; m.style.transformOrigin = 'left center'; m.tabIndex = d < .5 ? 0 : -1; });
    if (p.nearest !== lastNearest) { lastNearest = p.nearest; $('#where').textContent = `On case ${p.nearest + 1} of ${n}: ${cases[p.nearest].title}`; }
    window.__trail = { f, pos, nearest: p.nearest, scrollY, startY, len }; };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
  const go = d => { const { startY, len } = geom(), p = pathPosition(scrollFraction(scrollY, startY, len), n); const i = Math.min(n - 1, Math.max(0, p.nearest + d)); scrollTo({ top: scrollForMark(i, n, startY, len), behavior: reduced() ? 'auto' : 'smooth' }); };
  $('#prev').onclick = () => go(-1); $('#next').onclick = () => go(1);
  requestAnimationFrame(update);
  cur.cleanup = () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); };
}

// ---------- case: camera, evidence branch, lock opening ----------
function renderCase(id, evidenceOpen) {
  const c = cases.find(x => x.id === id) || cases[4], st = proto[c.id] || (proto[c.id] = { marker: null, locked: false });
  const cands = c.editorial.c0;
  main.innerHTML = `${optionsBar()}<p><a href="#/trail" class="btn">Back to the path</a></p><h1 tabindex="-1" id="h">${esc(c.title)}</h1><p class="q">${esc(c.question)}</p>
  <div class="stage" id="stage"><div id="cam" tabindex="0" role="group" aria-label="Year ruler. Plus and minus zoom. Zero fits all years. Arrow up and down move the marker."></div>
    <section class="branch" id="branch" aria-label="Evidence" tabindex="-1"><h2 id="bh" tabindex="-1">Evidence</h2><ol>${c.free.map(f => `<li>${esc(f.text)}</li>`).join('')}</ol><h2>Extra clues</h2><p class="note">${c.paid.map(p => `${esc(p.category)} (${p.tier}, ${p.cost} Insight)`).join('. ')}.</p><div class="bar"><button type="button" class="btn primary" id="bback">Back to the years</button></div></section>
    <div class="lockov" id="lockov" aria-hidden="true"><div class="half t" id="lt"></div><div class="half b" id="lb"></div><div class="band" id="lband"><span class="yr" id="lyr"></span></div></div></div>
  <p class="level" id="level" aria-live="polite"></p>
  <div id="camctl"><div class="bar"><button type="button" class="btn" id="zout" aria-label="Zoom out">&minus;</button><button type="button" class="btn" id="zin" aria-label="Zoom in">+</button><button type="button" class="btn" id="zfit">Fit</button><button type="button" class="btn" id="mup" aria-label="Marker to a later year">Later</button><button type="button" class="btn" id="mdn" aria-label="Marker to an earlier year">Earlier</button></div>
  <div class="bar"><button type="button" class="btn" id="ev">Evidence</button><button type="button" class="btn primary" id="lock">Lock</button><button type="button" class="btn" id="skip" hidden>Skip</button></div>
  <details><summary class="btn" style="width:100%">Type a year instead</summary><div class="row"><label for="ty">Year</label><input id="ty" inputmode="numeric" autocomplete="off" style="min-height:3rem;padding:.25rem .5rem;border:.125rem solid var(--ink);background:var(--paper)"><button type="button" class="btn" id="tyb">Use this year</button></div><p class="note" id="tym" role="status"></p></details></div>
  <div id="verdict" class="verdict" hidden></div>
  <p class="note">Two fingers pinch the ruler and the year under your fingers stays put. One finger scrolls the page. Drag the red handle to move the marker. Every one of these has a button or key.</p>`;
  bindOptions();
  const camEl = $('#cam'), br = new Transition({ duration: 340, reduced: reduced() }), lk = new Transition({ duration: 900, reduced: reduced() });
  const view = new CamView(camEl, { lo: c.corridor[0], hi: c.corridor[1], candidates: cands, marker: st.marker, reduced, perf, name: c.id, onMarker: (y) => { st.marker = y; saveProto(); status(); $('#lock').textContent = `Lock ${yearLabel(y)}`; } });
  cur.view = view; cur.branch = br; cur.lock = lk; window.__camView = view; window.__branch = br; window.__lock = lk;
  const status = () => { $('#level').textContent = `Showing ${view.plan ? view.plan.level : ''}. ${st.marker !== null ? `Marker on ${yearLabel(st.marker)}.` : 'No year chosen.'} ${cands.length} possible years.`; };
  const timers = {};
  camEl.addEventListener('keydown', e => { if (e.key === '+' || e.key === '=') view.zoomBy(1.6); else if (e.key === '-') view.zoomBy(1 / 1.6); else if (e.key === '0') view.fitCorridor(); else if (e.key === 'ArrowUp') view.nudgeMarker(1); else if (e.key === 'ArrowDown') view.nudgeMarker(-1); else return; e.preventDefault(); setTimeout(status, 60); });
  $('#zin').onclick = () => { view.zoomBy(1.6); setTimeout(status, 400); }; $('#zout').onclick = () => { view.zoomBy(1 / 1.6); setTimeout(status, 400); }; $('#zfit').onclick = () => { view.fitCorridor(); setTimeout(status, 400); };
  $('#mup').onclick = () => { view.nudgeMarker(1); }; $('#mdn').onclick = () => { view.nudgeMarker(-1); };
  $('#tyb').onclick = () => { const m = $('#ty').value.trim().toUpperCase().match(/^(\d{1,4})\s*(BCE|BC|CE|AD)?$/); if (!m) { $('#tym').textContent = 'That is not a year.'; return; } const y = /^BC/.test(m[2] || '') ? 1 - Number(m[1]) : Number(m[1]); if (!cands.includes(y)) { $('#tym').textContent = 'That year is not in play.'; return; } view.setMarker(y, true); view.animateTo({ ...view.cam, center: y }); $('#tym').textContent = `Marker on ${yearLabel(y)}.`; };
  const frameBranch = () => { const now = performance.now(), p = br.progress(now), e = br.eased(now); const bEl = $('#branch'); if (!bEl) return;
    bEl.style.visibility = p > 0 ? 'visible' : 'hidden'; bEl.style.transform = `translateY(${(1 - e) * 100}%)`; camEl.style.opacity = String(1 - .65 * e); camEl.style.transform = `scale(${1 - .03 * e})`;
    $('#camctl').inert = p > .5; if (!br.settled(now)) timers.b = requestAnimationFrame(frameBranch); else { if (p >= 1) $('#bh').focus({ preventScroll: true }); }
    window.__branchP = p; };
  const syncBranch = open => { const now = performance.now(); cancelAnimationFrame(timers.b); if (open) br.forward(now); else br.reverse(now); frameBranch(); if (!open) setTimeout(() => { if (br.progress(performance.now()) <= 0) $('#ev') && $('#ev').focus({ preventScroll: true }); }, br.duration + 40); };
  cur.sync = syncBranch; window.__syncBranch = syncBranch; window.__frameBranch = frameBranch;
  $('#ev').onclick = () => navigate(`#/case/${c.id}/evidence`); $('#bback').onclick = () => history.back();
  $('#branch').addEventListener('keydown', e => { if (e.key === 'Escape') history.back(); });
  // lock opening
  const frameLock = () => { const now = performance.now(), p = lk.progress(now), e = lk.eased(now), h = view.cam.h; const ov = $('#lockov'); if (!ov) return; ov.style.visibility = p > 0 ? 'visible' : 'hidden';
    const ly = st.lockY ?? h / 2, bh = 4 + e * (h - 4); $('#lt').style.height = ly + 'px'; $('#lt').style.transform = `translateY(${-e * ly}px)`; $('#lb').style.top = ly + 'px'; $('#lb').style.height = (h - ly) + 'px'; $('#lb').style.transform = `translateY(${e * (h - ly)}px)`;
    const band = $('#lband'); band.style.top = `${Math.max(0, Math.min(h - bh, ly - bh / 2))}px`; band.style.height = bh + 'px'; const yr = $('#lyr'); yr.style.opacity = String(Math.max(0, (e - .25) / .75)); yr.style.transform = `scale(${.6 + .4 * e})`;
    $('#skip').hidden = lk.settled(now); if (!lk.settled(now)) timers.l = requestAnimationFrame(frameLock); else if (p >= 1) finishLock(); window.__lockP = p; };
  const finishLock = () => { st.locked = true; saveProto(); const v = $('#verdict'); const ok = st.marker === c.target.year; v.hidden = false; $('#lock').disabled = true;
    const rv = REVEALS[c.id]; v.innerHTML = `<strong>${ok ? 'Solved' : 'Missed'}.</strong> ${ok ? '' : `You locked ${yearLabel(st.marker)}. `}The answer is ${yearLabel(c.target.year)}. ${rv ? `<div class="bar"><a class="btn primary" href="#/reveal/${c.id}" id="toreveal">The world around ${yearLabel(c.target.year)}</a></div>` : '<span class="note">No reveal pathway is built for this case in the prototype.</span>'}`; say(`${ok ? 'Solved' : 'Missed'}. The answer is ${yearLabel(c.target.year)}.`); };
  const startLock = () => { if (st.marker === null) { $('#level').textContent = 'Choose a year first.'; return; } st.lockY = yearToY(view.cam, st.marker); $('#lyr').textContent = yearLabel(c.target.year); camEl.inert = true; lk.forward(performance.now()); frameLock(); };
  $('#lock').onclick = startLock;
  window.__frameLock = frameLock; window.__lockState = st;
  const skip = () => { lk.skip(performance.now()); frameLock(); };
  $('#skip').onclick = skip; $('#lockov').addEventListener('pointerdown', skip);
  if (st.locked) { st.lockY = st.lockY ?? view.cam.h / 2; $('#lyr').textContent = yearLabel(c.target.year); lk.p0 = 1; lk.dir = 0; frameLock(); finishLock(); camEl.inert = true; }
  if (st.marker !== null) $('#lock').textContent = `Lock ${yearLabel(st.marker)}`;
  if (evidenceOpen) { br.p0 = 1; br.dir = 0; frameBranch(); }
  view.wake(); setTimeout(status, 80);
  cur.cleanup = () => { cancelAnimationFrame(timers.b); cancelAnimationFrame(timers.l); view.destroy(); };
}
function syncBranch(open) { if (cur.sync) cur.sync(open); }

// ---------- World Reveal pathway ----------
function renderReveal(id) {
  const R = REVEALS[id];
  if (!R) { main.innerHTML = `${optionsBar()}<h1 id="h" tabindex="-1">No reveal here yet</h1><p><a class="btn" href="#/trail">Back to the path</a></p>`; bindOptions(); return; }
  const key = 'mp:rev:' + id; let saved = 0; try { saved = Number(sessionStorage.getItem(key) || 0); } catch (e) { /* none */ }
  const all = R.events.map(e => e.year);
  main.innerHTML = `${optionsBar()}<p><a class="btn" href="#/case/${id}" id="back">Back to the case</a></p><h1 tabindex="-1" id="h">${esc(R.title)}</h1><p class="lede">${esc(R.kind)}</p>
  <div class="bar"><button type="button" class="btn" id="rprev">Previous step</button><button type="button" class="btn" id="rnext">Next step</button><button type="button" class="btn" id="rskip">Skip to the end</button></div>
  ${saved > 0 ? `<div class="verdict" id="resume">You were on step ${saved + 1} of ${R.steps.length}. <div class="bar"><button type="button" class="btn primary" id="rres">Resume</button><button type="button" class="btn" id="rstart">Start over</button></div></div>` : ''}
  <div class="rev-cam"><div id="rcam" role="img" aria-label="A timeline. The dates are listed in the text below."></div><p class="level" id="rlevel" aria-live="polite"></p></div>
  <h2>Dates on this timeline</h2><ol>${R.events.map(e => `<li>${yearLabel(Math.round(e.year))}: ${esc(e.label)}</li>`).join('')}</ol>
  ${R.steps.map((s, i) => `<section class="step" data-i="${i}" id="s${i}" aria-labelledby="st${i}"><p class="note">Step ${i + 1} of ${R.steps.length}</p><h2 id="st${i}">${esc(s.title)}</h2><p>${esc(s.text)}</p></section>`).join('')}
  <h2>Sources</h2><ul class="src" style="list-style:none">${R.sources.map(sid => { const s = sources[sid]; return s ? `<li><a href="${href(s.url)}" target="_blank" rel="noopener">${esc(s.publisher)}: ${esc(s.title)}</a> <span class="note">${s.opened ? 'Opened by the editor' : 'Not opened'}</span></li>` : ''; }).join('')}</ul><p class="note">${esc(R.honest)}</p>`;
  bindOptions();
  const lo = Math.min(...all) - 40, hi = Math.max(...all) + 40;
  const view = new CamView($('#rcam'), { lo, hi, pins: R.events.map(e => ({ year: e.year, label: esc(e.label) })), reduced, perf, name: 'reveal' });
  cur.view = view; window.__camView = view;
  let active = -1, first = true; const setStep = (i, user) => { if (i === active) return; active = i; const s = R.steps[i]; view.fitRange(s.range[0], s.range[1], 800); $('#rlevel').textContent = `Step ${i + 1} of ${R.steps.length}: ${s.title}.`; main.querySelectorAll('.step').forEach((el, k) => el.classList.toggle('on', k === i)); if (!first) { try { sessionStorage.setItem(key, String(i)); } catch (e) { /* ignore */ } } first = false; window.__revStep = i; };
  const steps = [...main.querySelectorAll('.step')];
  const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) setStep(Number(e.target.dataset.i)); }, { rootMargin: '-32% 0px -48% 0px', threshold: 0 });
  steps.forEach(s => io.observe(s));
  const go = i => { const k = Math.min(steps.length - 1, Math.max(0, i)); steps[k].scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); setStep(k); };
  $('#rnext').onclick = () => go(active + 1); $('#rprev').onclick = () => go(active - 1); $('#rskip').onclick = () => go(steps.length - 1);
  if ($('#rres')) { $('#rres').onclick = () => { go(saved); $('#resume').remove(); }; $('#rstart').onclick = () => { try { sessionStorage.removeItem(key); } catch (e) { /* ignore */ } $('#resume').remove(); go(0); }; }
  setStep(0); view.fitRange(R.steps[0].range[0], R.steps[0].range[1], 0);
  cur.cleanup = () => { io.disconnect(); view.destroy(); };
}

// ---------- perf panel ----------
function perfPanel() {
  if (!params.has('perf')) return;
  const p = $('#perfpanel'); p.hidden = false;
  p.innerHTML = `<strong>Performance recorder</strong> <button type="button" class="btn" id="prec">Record</button> <button type="button" class="btn" id="pstop" disabled>Stop</button> <button type="button" class="btn" id="pdl" disabled>Download JSON</button><pre id="pout" style="white-space:pre-wrap;max-height:8rem;overflow:auto"></pre>`;
  let last = null;
  $('#prec').onclick = () => { perf.start(prompt ? 'device run' : ''); $('#prec').disabled = true; $('#pstop').disabled = false; };
  $('#pstop').onclick = () => { last = perf.stop(); $('#pout').textContent = JSON.stringify(last, null, 1); $('#prec').disabled = false; $('#pstop').disabled = true; $('#pdl').disabled = false; };
  $('#pdl').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(last, null, 2)], { type: 'application/json' })); a.download = 'timehunt-motion-perf.json'; a.click(); };
}

// ---------- boot ----------
(async function boot() {
  applyPrefs();
  try { const res = await fetch('../data/daily-pack-draft.json', { cache: 'no-store' }); pack = await res.json(); } catch (e) { main.innerHTML = '<h1>Could not load the pack</h1>'; return; }
  cases = pack.cases; sources = Object.fromEntries(pack.sources.map(s => [s.id, s]));
  perfPanel();
  mq.addEventListener && mq.addEventListener('change', applyPrefs);
  if (!location.hash) history.replaceState({}, '', '#/trail');
  route(true); main.removeAttribute('aria-busy');
  window.__ready = true;
})();
