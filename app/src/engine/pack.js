// Pack validation and compilation. A pack that fails validation is never offered for play (fail-safe).
import { digest } from './canon.js';
import { range, printsYear } from './years.js';

const err = (code, path, msg) => ({ code, path, msg });

function applyPredicate(years, p) {
  if (!p || typeof p !== 'object') return null;
  if (p.op === 'gte' && Number.isInteger(p.year)) return years.filter(y => y >= p.year);
  if (p.op === 'lte' && Number.isInteger(p.year)) return years.filter(y => y <= p.year);
  if (p.op === 'equals' && Number.isInteger(p.year)) return years.filter(y => y === p.year);
  return null;
}

/**
 * validatePack(raw, {allowDraft}) -> {ok, errors, warnings, content}
 * content is a compiled, frozen, engine-ready model (only present when ok).
 */
export function validatePack(raw, { allowDraft = false } = {}) {
  const errors = [], warnings = [];
  const bad = (c, p, m) => errors.push(err(c, p, m));
  if (!raw || typeof raw !== 'object') return { ok: false, errors: [err('NOT_AN_OBJECT', '', 'pack is not an object')], warnings, content: null };
  if (typeof raw.pack_id !== 'string' || !raw.pack_id) bad('PACK_ID', 'pack_id', 'missing pack_id');
  if (typeof raw.version !== 'string') bad('VERSION', 'version', 'missing version');
  if (raw.date_convention !== 'end-of-year') bad('CONVENTION', 'date_convention', 'only the end-of-year convention is supported');
  if (raw.status !== 'PUBLISHABLE' && !allowDraft) bad('NOT_PUBLISHABLE', 'status', `pack status is ${raw.status}; refusing to play a non-publishable pack`);
  if (!Array.isArray(raw.sources)) bad('SOURCES', 'sources', 'sources must be an array');
  if (!Array.isArray(raw.cases)) { bad('CASES', 'cases', 'cases must be an array'); return { ok: false, errors, warnings, content: null }; }
  if (raw.cases.length !== 10) bad('CASE_COUNT', 'cases', `a Daily Ten pack needs exactly 10 cases, found ${raw.cases.length}`);

  const sources = {};
  for (const s of raw.sources || []) {
    if (!s || typeof s.id !== 'string') { bad('SOURCE_ID', 'sources', 'source without id'); continue; }
    if (sources[s.id]) bad('SOURCE_DUP', `sources.${s.id}`, 'duplicate source id');
    if (typeof s.url !== 'string' || !/^https?:\/\//.test(s.url)) bad('SOURCE_URL', `sources.${s.id}`, 'source needs an http(s) url');
    sources[s.id] = s;
  }
  const ids = new Set();
  const orders = new Set();
  const cases = [];
  raw.cases.forEach((c, i) => {
    const P = `cases[${i}]`;
    if (!c || typeof c !== 'object') return bad('CASE_SHAPE', P, 'case is not an object');
    if (typeof c.id !== 'string') return bad('CASE_ID', P, 'case without id');
    if (ids.has(c.id)) bad('CASE_DUP', P, `duplicate case id ${c.id}`);
    ids.add(c.id);
    if (orders.has(c.order)) bad('ORDER_DUP', P, `duplicate order ${c.order}`);
    orders.add(c.order);
    if (c.order !== i + 1) bad('ORDER', P, `case order must be ${i + 1}`);
    const cor = c.corridor;
    if (!Array.isArray(cor) || cor.length !== 2 || !cor.every(Number.isInteger) || cor[0] > cor[1]) return bad('CORRIDOR', P, 'corridor must be [lo, hi] integers');
    const t = c.target && c.target.year;
    if (!Number.isInteger(t) || t < cor[0] || t > cor[1]) return bad('TARGET', P, 'target year missing or outside corridor');
    const free = Array.isArray(c.free) ? c.free : [], paid = Array.isArray(c.paid) ? c.paid : [];
    if (!free.length) bad('FREE', P, 'no free evidence');
    for (const f of [...free, ...paid]) {
      for (const sid of [...(f.source_ids || []), ...(f.corroboration_ids || [])]) if (!sources[sid]) bad('SOURCE_REF', `${P}.${f.id}`, `unknown source ${sid}`);
      if (!f.text || typeof f.text !== 'string') bad('CLUE_TEXT', `${P}.${f.id}`, 'clue without text');
    }
    // free bounds make C0
    let c0 = range(cor[0], cor[1]);
    let relation = null;
    for (const f of free) {
      if (f.kind === 'relation') {
        if (relation) bad('RELATION_DUP', P, 'more than one relation');
        const after = applyPredicate([t], f.predicate);
        if (!after || after.length !== 1) bad('RELATION_TARGET', `${P}.${f.id}`, 'relation does not select the target');
        relation = f;
        continue;
      }
      const next = applyPredicate(c0, f.predicate);
      if (!next) { bad('PREDICATE', `${P}.${f.id}`, 'invalid predicate'); continue; }
      c0 = next;
    }
    if (!c0.includes(t)) bad('TARGET_NOT_IN_C0', P, 'target is not in the free-evidence candidates');
    if (c0.length < 3 || c0.length > 6) bad('C0_SIZE', P, `free evidence leaves ${c0.length} candidates; authoring target is 3 to 6`);
    if (c.editorial && Array.isArray(c.editorial.c0) && digest(c.editorial.c0) !== digest(c0)) bad('C0_MISMATCH', P, 'editorial c0 differs from the machine c0');
    const clues = [];
    for (const p of paid) {
      if (!['nudge', 'deep'].includes(p.tier)) bad('TIER', `${P}.${p.id}`, 'tier must be nudge or deep');
      const keep = applyPredicate(c0, p.predicate);
      if (!keep) { bad('PREDICATE', `${P}.${p.id}`, 'invalid predicate'); continue; }
      if (!keep.includes(t)) bad('CLUE_REMOVES_TARGET', `${P}.${p.id}`, 'a paid clue removes the target');
      if (keep.length === c0.length) bad('CLUE_CUTS_NOTHING', `${P}.${p.id}`, 'a paid clue removes nothing from the free candidates (D-007)');
      clues.push({ id: p.id, tier: p.tier, category: p.category, text: p.text, predicate: p.predicate, sourceIds: p.source_ids || [] });
    }
    if (new Set(clues.map(x => x.id)).size !== clues.length) bad('CLUE_DUP', P, 'duplicate clue ids');
    for (const f of free) if (printsYear(f.text, t) || printsYear(f.anchor ? f.anchor.label + ' ' + f.anchor.date : '', t)) bad('LEAK_FREE', `${P}.${f.id}`, 'free evidence prints the target year');
    if (printsYear(c.question || '', t) || printsYear(c.title || '', t)) bad('LEAK_TITLE', P, 'title or question prints the target year');
    for (const x of c.context_free || []) if (printsYear(x.text, t)) bad('LEAK_CONTEXT', P, 'free context prints the target year');
    cases.push({
      id: c.id, order: c.order, title: c.title, question: c.question, corridor: cor.slice(), target: t, c0,
      free: free.filter(f => f.kind !== 'relation').map(f => ({ id: f.id, text: f.text, sourceIds: f.source_ids || [] })),
      relation: relation ? { id: relation.id, text: relation.text, sourceIds: relation.source_ids || [] } : null,
      context: (c.context_free || []).map(x => ({ text: x.text, sourceIds: x.sources || [] })),
      clues,
      resolution: {
        definition: c.target.definition, event: c.target.event, precision: c.target.precision, calendar: c.target.calendar,
        discoveryVsEvent: c.target.discovery_vs_event,
        proof: c.editorial ? c.editorial.uniqueness_proof || {} : {},
        missExplanation: c.editorial ? c.editorial.miss_explanation : '',
        reveal: (c.reveal || []).map(r => ({ title: r.title, text: r.text, form: r.form, sourceIds: r.sources || [] })),
      },
      hold: c.editorial ? c.editorial.hold || [] : [],
    });
  });
  if (errors.length) return { ok: false, errors, warnings, content: null };
  if (raw.status !== 'PUBLISHABLE') warnings.push(err('DRAFT', 'status', `playing a ${raw.status} pack because allowDraft is set`));
  const content = {
    packId: raw.pack_id, version: raw.version, status: raw.status, theme: raw.theme || '',
    digest: digest({ pack_id: raw.pack_id, version: raw.version, cases: raw.cases, sources: raw.sources }),
    cases, sources, connections: raw.connections || [], finaleThesis: raw.finale_thesis || '',
  };
  return { ok: true, errors: [], warnings, content };
}
