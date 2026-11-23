import { validatePack } from '../engine/pack.js';
import { makeRules } from '../engine/rules.js';
import { publicView, shareText, stateDigest } from '../engine/engine.js';
import { yearLabel } from '../engine/years.js';
import { rng } from '../engine/rng.js';
import { Session } from '../store/session.js';
import { browserStorage, FaultyStorage } from '../store/storage.js';

const $ = s => document.querySelector(s);
const main = $('#main');
const params = new URLSearchParams(location.search);
const debug = params.has('debug');
// Study mode (Stage 5): ?study=P03&cond=A|B records a local, timestamped event log. Nothing leaves the browser.
const studyId = (params.get('study') || '').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 24);
const studyCond = params.get('cond') === 'B' ? 'B' : 'A';
const t0 = Date.now();
const studyKey = `timehunt:study:${studyId}`;
function logEvent(e, data = {}) {
  if (!studyId) return;
  try {
    const cur = JSON.parse(localStorage.getItem(studyKey) || '{"participant":"' + studyId + '","cond":"' + studyCond + '","events":[]}');
    cur.events.push({ t: Date.now() - t0 + (cur.offset || 0), wall: Date.now(), e, ...data });
    localStorage.setItem(studyKey, JSON.stringify(cur));
  } catch (err) { /* study log is best effort and never blocks play */ }
}
function downloadStudyLog() {
  const blob = new Blob([localStorage.getItem(studyKey) || '{}'], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `timehunt-study-${studyId}.json`; a.click();
}
const variants = (params.get('variant') || '').split(',').filter(Boolean);
const overrides = {};
if (variants.includes('trace')) overrides.trace = { enabled: true, cost: 2 };
if (variants.includes('cap1')) overrides.perCaseCap = 1;
if (variants.includes('deep')) overrides.relationTier = 'deep';
if (variants.includes('norefund')) overrides.refundRedundant = false;
if (studyId && studyCond === 'B') overrides.relationTier = 'deep'; // condition B: the relation is sold as a Deep clue

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
let session, content, rules, uiState = { selected: {}, msg: '', focusHeading: true };
let faulty = null;
let actionCounter = 0;

function say(text) { uiState.msg = text; $('#live').textContent = text; }

function fail(title, errors) {
  $('#banner').textContent = '';
  main.innerHTML = `<h2 tabindex="-1" id="h">${esc(title)}</h2><p>Nothing was started and no progress was changed.</p><ul class="err">${errors.map(e => `<li>${esc(e.code)} at ${esc(e.path)}: ${esc(e.msg)}</li>`).join('')}</ul>`;
  main.querySelector('#h').focus();
}

async function boot() {
  let raw;
  try {
    const res = await fetch('data/daily-pack-draft.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    raw = await res.json();
  } catch (e) {
    return fail('The pack could not be loaded', [{ code: 'LOAD', path: 'data/daily-pack-draft.json', msg: String(e.message) }]);
  }
  const v = validatePack(raw, { allowDraft: true });
  if (!v.ok) return fail('Today\'s pack failed validation and was not loaded', v.errors);
  content = v.content;
  try { rules = makeRules(overrides); } catch (e) { return fail('These rules are invalid', [{ code: 'RULES', path: '', msg: e.message }]); }
  const bs = browserStorage();
  let storage = bs.storage;
  if (debug) { faulty = new FaultyStorage(storage); storage = faulty; }
  const practice = params.get('mode') === 'practice';
  let opts = studyId ? { dailyId: `${content.packId}:${studyId}` } : {};
  if (practice) {
    const seed = Number(params.get('seed') || 1);
    const pick = rng(seed).pick(content.cases).id;
    opts = { mode: 'practice', caseIds: [pick], dailyId: `${content.packId}:seed${seed}` };
  }
  session = new Session({ content, rules, storage, ...opts });
  const status = session.load();
  if (studyId) logEvent('session_start', { resumed: status === 'resumed', rules: rules.id });
  const notes = ['DRAFT PACK: not publishable (' + v.warnings.map(w => w.code).join(', ') + '). Gray-box build.'];
  if (!bs.persistent) notes.push('Progress cannot be saved in this browser mode.');
  if (practice) notes.push('Practice mode: separate from the daily, 2 Insight.');
  $('#banner').textContent = notes.join(' ');
  if (!session.state) return renderConflict(status);
  render();
}

function renderConflict(status) {
  const text = {
    corrupt: 'The saved game could not be read, or it was changed outside the game.',
    schema_unknown: 'The saved game was made by a different version of this app.',
    content_changed: 'Today\'s cases changed since you started. Your saved progress belongs to the earlier version.',
    rules_changed: 'The rules changed since you started. Your saved progress belongs to the earlier rules.',
  }[status] || 'The saved game cannot be used.';
  main.innerHTML = `<h2 tabindex="-1" id="h">Saved game on hold</h2><p>${esc(text)}</p><p>Your saved record has not been touched. If you start again, the old record is kept under a backup key.</p><div class="row"><button id="discard" class="primary">Start a new expedition</button></div>`;
  $('#discard').onclick = () => { session.discardAndStart(); uiState = { selected: {}, msg: '', focusHeading: true }; render(); };
  $('#h').focus();
}

function dispatch(cmd, okMsg) {
  const r = session.dispatch({ ...cmd, actionId: `ui-${++actionCounter}-${Date.now().toString(36)}` });
  logEvent(cmd.type.toLowerCase(), { caseId: cmd.caseId, clue: cmd.clueId, year: cmd.year, ok: r.ok, code: r.error ? r.error.code : null, ev: r.events && r.events[0] ? r.events[0].type : null, correct: r.events && r.events[0] ? r.events[0].correct : undefined, insight: session.state ? session.state.insight : null });
  if (!r.ok) say(r.error.message);
  else say(okMsg ? okMsg(r) : '');
  return r;
}

function sourceList(ids) {
  const uniq = [...new Set(ids)].filter(i => content.sources[i]);
  if (!uniq.length) return '';
  return `<p class="src">Sources: ${uniq.map(i => { const s = content.sources[i]; return `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.publisher)}: ${esc(s.title)}</a>${s.opened ? '' : ' (not opened by the editor)'}`; }).join('; ')}</p>`;
}

function progress(v) {
  const word = { solved_clean: 'solved', solved_assisted: 'solved with help', missed: 'missed', active: 'open', not_started: 'to come' };
  return `<ol class="prog" aria-label="Progress through ten cases">${v.cases.map((c, i) =>
    `<li ${i === v.cursor && v.status === 'active' ? 'aria-current="step"' : ''}>${i + 1}<span class="s">${word[c.status]}</span></li>`).join('')}</ol>`;
}

function render() {
  const v = publicView(session.state, content, rules);
  logEvent('view', { cursor: v.cursor, status: v.status, insight: v.insight });
  const head = `<div class="bank"><h1>TIMEHUNT, ${v.mode === 'practice' ? 'Practice' : 'The Daily Ten'}</h1>
    <span aria-live="polite">Insight <strong id="ins">${v.insight}</strong> of ${v.insightInitial}</span></div>${progress(v)}`;
  if (v.status === 'completed') return renderEnd(v, head);
  const c = v.cases[v.cursor];
  const resolved = c.status !== 'active';
  const sel = uiState.selected[c.id] ?? c.candidates[0];
  const opts = Array.from({ length: c.corridor[1] - c.corridor[0] + 1 }, (_, i) => c.corridor[0] + i).map(y => {
    const out = !c.candidates.includes(y);
    return `<option value="${y}" ${y === sel ? 'selected' : ''} ${out && !resolved ? 'disabled' : ''}>${yearLabel(y)}${out ? ' (ruled out)' : ''}</option>`;
  }).join('');
  const clueHtml = c.clues.map(cl => cl.revealed
    ? `<div class="clue rev"><strong>${esc(cl.category)}</strong> (${cl.tier === 'nudge' ? 'Nudge' : 'Deep clue'}, revealed)<br>${esc(cl.text)}${sourceList(cl.sourceIds)}</div>`
    : `<div class="clue"><button data-clue="${esc(cl.id)}" ${resolved || cl.cost > v.insight ? 'disabled' : ''}>${cl.tier === 'nudge' ? 'Nudge' : 'Deep clue'}: ${esc(cl.category)}. Costs ${cl.cost} Insight.</button>${cl.cost > v.insight && !resolved ? ' <span class="note">Not enough Insight.</span>' : ''}</div>`).join('');
  const traceHtml = v.rules.trace.enabled && !resolved ? `<h3>Trace (test variant)</h3><div class="row"><label for="tr">Compare with year</label><select id="tr">${opts}</select><button id="trbtn" ${v.rules.trace.cost > v.insight ? 'disabled' : ''}>Trace for ${v.rules.trace.cost} Insight</button></div>${c.trace.length ? `<p>${c.trace.map(t => `${yearLabel(t.year)}: the answer is ${t.result === 'same' ? 'that year' : t.result}`).join('; ')}</p>` : ''}` : '';
  const srcIds = [...c.free.flatMap(f => f.sourceIds), ...(c.relation ? c.relation.sourceIds : [])];
  main.innerHTML = `${head}
    <h2 id="h" tabindex="-1">Case ${c.order}. ${esc(c.title)}</h2>
    <p class="q">${esc(c.question)}</p>
    <h3>Evidence</h3>
    <ul class="ev">${c.free.map(f => `<li>${esc(f.text)}</li>`).join('')}${c.relation ? `<li>${esc(c.relation.text)}</li>` : ''}${c.context.map(x => `<li>${esc(x.text)}</li>`).join('')}</ul>
    ${sourceList(srcIds)}
    <div class="cands"><strong>${c.candidates.length} possible ${c.candidates.length === 1 ? 'year' : 'years'} left:</strong> ${c.candidates.map(yearLabel).join(', ')}</div>
    <h3>Extra clues</h3><div class="clues">${clueHtml || '<p>No extra clues for this case.</p>'}</div>
    ${traceHtml}
    ${resolved ? resultHtml(c, v) : `<h3>Lock a year</h3><p class="note">One Lock per case. If you are wrong you see the answer and the day goes on.</p>
      <div class="row"><label for="yr">Year</label><select id="yr">${opts}</select><button id="lock" class="primary">Lock this year</button></div>`}
    <p class="msg" role="alert">${esc(uiState.msg)}</p>
    ${debug ? debugHtml() : ''}${studyHtml()}`;
  main.querySelectorAll('button[data-clue]').forEach(b => b.onclick = () => {
    const r = dispatch({ type: 'REVEAL', caseId: c.id, clueId: b.dataset.clue }, r => { const e = r.events[0]; return e && e.type === 'CLUE_REVEALED' ? (e.charged ? `Revealed. ${e.charged} Insight spent.` : 'Revealed. It told you nothing new, so it cost nothing.') : ''; });
    render();
  });
  const yr = $('#yr'); if (yr) yr.onchange = () => { uiState.selected[c.id] = Number(yr.value); logEvent('select_year', { caseId: c.id, year: Number(yr.value) }); };
  const lock = $('#lock'); if (lock) lock.onclick = () => {
    dispatch({ type: 'LOCK', caseId: c.id, year: Number($('#yr').value) }, r => r.events[0] && r.events[0].correct ? 'Correct.' : 'Not that year. The answer is shown below.');
    render();
  };
  const trb = $('#trbtn'); if (trb) trb.onclick = () => { dispatch({ type: 'TRACE', caseId: c.id, year: Number($('#tr').value) }, r => r.events[0] ? `Traced: the answer is ${r.events[0].result}.` : ''); render(); };
  const next = $('#next'); if (next) next.onclick = () => { dispatch({ type: 'ADVANCE', caseId: c.id }); uiState.msg = ''; render(); };
  bindDebug();
  if (uiState.focusHeading) { $('#h').focus(); uiState.focusHeading = false; }
}

function resultHtml(c, v) {
  const r = c.resolution, hit = c.lock.correct;
  const srcs = [...c.free.flatMap(f => f.sourceIds), ...c.clues.flatMap(x => x.sourceIds || []), ...(c.relation ? c.relation.sourceIds : []), ...r.reveal.flatMap(x => x.sourceIds)];
  const proof = Object.values(r.proof).map(p => `<li>${esc(p)}</li>`).join('');
  return `<div class="result ${hit ? 'hit' : 'miss'}" role="status"><h3>${hit ? 'Solved' : 'Missed'}: the answer is ${esc(yearLabel(r.answer))}</h3>
    <p>${esc(r.event)}. You locked ${esc(yearLabel(c.lock.year))}.</p>
    <p>${esc(r.definition)}</p><p class="note">${esc(r.discoveryVsEvent)}</p>
    ${proof ? `<h3>Why not the others</h3><ul>${proof}</ul>` : ''}
    ${hit ? '' : `<p>${esc(r.missExplanation)}</p>`}
    ${r.reveal.map(x => `<p><strong>${esc(x.title)}.</strong> ${esc(x.text)}</p>`).join('')}
    ${sourceList(srcs)}
    <div class="row"><button id="next" class="primary">${v.cursor === v.cases.length - 1 ? 'See the day' : 'Next case'}</button></div></div>`;
}

function renderEnd(v, head) {
  const sc = v.score;
  const rows = v.cases.map(c => `<tr><td>${c.order}</td><td>${esc(c.title)}</td><td>${esc(yearLabel(c.resolution.answer))}</td><td>${c.status === 'missed' ? 'missed' : c.status === 'solved_clean' ? 'solved' : 'solved with help'}</td><td>${c.spent}</td></tr>`).join('');
  main.innerHTML = `${head}<h2 id="h" tabindex="-1">${sc.solved} of ${v.cases.length} solved. ${sc.insightLeft} Insight left.</h2>
    <p>${sc.clean} solved with no Insight, ${sc.assisted} with help, ${sc.missed} missed. A miss never ended the day.</p>
    <table><thead><tr><th>#</th><th>Case</th><th>Answer</th><th>Result</th><th>Insight used</th></tr></thead><tbody>${rows}</tbody></table>
    <h3>Share (no answers)</h3><pre id="share">${esc(shareText(session.state, content))}</pre>
    <p class="note">Insight does not refill. The Daily Trail screen is not built in this stage.</p>
    ${debug ? debugHtml() : ''}${studyHtml()}`;
  bindDebug();
  $('#h').focus();
}

function debugHtml() {
  const s = session.state;
  return `<div class="debug"><strong>Test tools</strong>
    <div class="row"><button id="crash-before">Arm crash before next save</button><button id="crash-after">Arm crash after next save</button><button id="reload">Reload page</button></div>
    <p class="note">Log length ${s.log.length}. State digest <code id="dg">${stateDigest(s)}</code>. Rules <code>${esc(rules.id)}</code>. Variants: ${esc(variants.join(',') || 'none (C1 default)')}.</p></div>`;
}
function studyHtml() {
  return studyId ? `<div class="debug"><strong>Study ${esc(studyId)}, condition ${studyCond}</strong><div class="row"><button id="dl">Download study log</button></div><p class="note">The log stays in this browser until you download it. It holds timings and choices only.</p></div>` : '';
}
function bindDebug() {
  const dl = $('#dl'); if (dl) dl.onclick = () => { logEvent('download'); downloadStudyLog(); };
  if (!debug) return;
  const b = $('#crash-before'), a = $('#crash-after'), r = $('#reload');
  if (b) b.onclick = () => { faulty.arm('before'); say('Next save will crash before writing.'); render(); };
  if (a) a.onclick = () => { faulty.arm('after'); say('Next save will crash after writing.'); render(); };
  if (r) r.onclick = () => location.reload();
}

boot();
