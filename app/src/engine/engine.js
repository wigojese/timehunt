// Pure game engine. No DOM, no storage, no clock, no randomness. transition() never mutates its inputs.
import { digest } from './canon.js';

export const STATE_SCHEMA = 1;

const clone = v => JSON.parse(JSON.stringify(v));
const fail = (state, code, message) => ({ next: state, events: [], error: { code, message } });

function availableClues(cc, rules) {
  const list = cc.clues.map(c => ({ ...c, cost: rules.costs[c.tier] }));
  if (rules.relationTier === 'deep' && cc.relation) {
    list.push({ id: cc.relation.id, tier: 'deep', category: 'Key link', text: cc.relation.text, predicate: { op: 'equals', year: cc.target },
      sourceIds: cc.relation.sourceIds, cost: rules.costs.deep });
  }
  return list;
}
export const cluesFor = availableClues;

function keep(C, p) {
  if (p.op === 'gte') return C.filter(y => y >= p.year);
  if (p.op === 'lte') return C.filter(y => y <= p.year);
  return C.filter(y => y === p.year);
}

/** createExpedition(content, rules, {dailyId, mode, caseIds}) -> state */
export function createExpedition(content, rules, { dailyId = content.packId, mode = 'daily', caseIds = null } = {}) {
  const chosen = caseIds ? caseIds.map(id => content.cases.find(c => c.id === id)).filter(Boolean) : content.cases;
  if (!chosen.length || (caseIds && chosen.length !== caseIds.length)) throw new Error('unknown case id');
  if (mode === 'daily' && chosen.length !== 10) throw new Error('a daily expedition needs exactly ten cases');
  const insight = mode === 'practice' ? rules.practiceInsight : rules.insight;
  const cases = chosen.map((c, i) => ({
    id: c.id, status: i === 0 ? 'active' : 'not_started', C: i === 0 ? c.c0.slice() : [], revealed: [], spent: 0, lock: null, trace: [],
  }));
  return {
    schema: STATE_SCHEMA, dailyId, mode, packDigest: content.digest, rulesId: rules.id,
    insightInitial: insight, insight, cursor: 0, status: 'active', cases, applied: [], log: [],
  };
}

export function stateDigest(state) { return digest(state); }

/**
 * transition(state, command, content, rules) -> {next, events, error}
 * Commands: REVEAL {caseId, clueId, actionId} | TRACE {caseId, year, actionId} | LOCK {caseId, year, actionId} | ADVANCE {caseId, actionId}
 * A refused command returns the same state object and an error: no charge, no partial change.
 * A repeated actionId is idempotent: same state object, a DUPLICATE_IGNORED event, no error.
 */
export function transition(state, cmd, content, rules) {
  if (!cmd || typeof cmd.type !== 'string') return fail(state, 'BAD_COMMAND', 'command without type');
  if (typeof cmd.actionId !== 'string' || !cmd.actionId) return fail(state, 'NO_ACTION_ID', 'every command needs an actionId');
  if (state.applied.includes(cmd.actionId)) return { next: state, events: [{ type: 'DUPLICATE_IGNORED', actionId: cmd.actionId }], error: null };
  if (state.status !== 'active') return fail(state, 'EXPEDITION_OVER', 'the expedition is finished');
  const cs = state.cases[state.cursor];
  if (cmd.caseId !== cs.id) return fail(state, 'NOT_CURRENT_CASE', 'only the current case can be acted on');
  const cc = content.cases.find(c => c.id === cs.id);
  const resolved = cs.status !== 'active';
  const done = (next, events) => {
    next.applied.push(cmd.actionId);
    next.log.push(clone(cmd));
    return { next, events, error: null };
  };

  if (cmd.type === 'REVEAL' || cmd.type === 'TRACE') {
    if (resolved) return fail(state, 'CASE_RESOLVED', 'this case is already resolved');
    let cost, newC, ev;
    if (cmd.type === 'REVEAL') {
      const clue = availableClues(cc, rules).find(c => c.id === cmd.clueId);
      if (!clue) return fail(state, 'UNKNOWN_CLUE', 'no such clue');
      if (cs.revealed.includes(clue.id)) return fail(state, 'ALREADY_REVEALED', 'clue already revealed');
      cost = clue.cost;
      newC = keep(cs.C, clue.predicate);
      ev = { type: 'CLUE_REVEALED', clueId: clue.id };
    } else {
      if (!rules.trace.enabled) return fail(state, 'TRACE_DISABLED', 'Trace is not part of these rules');
      if (!Number.isInteger(cmd.year)) return fail(state, 'BAD_YEAR', 'year must be an integer');
      cost = rules.trace.cost;
      const t = cc.target;
      const r = cmd.year === t ? 'same' : t < cmd.year ? 'earlier' : 'later';
      newC = r === 'same' ? [t] : r === 'earlier' ? cs.C.filter(y => y < cmd.year) : cs.C.filter(y => y > cmd.year);
      if (newC.length === cs.C.length) return fail(state, 'TRACE_UNINFORMATIVE', 'that year cannot narrow the candidates');
      ev = { type: 'TRACED', year: cmd.year, result: r };
    }
    if (state.insight < cost) return fail(state, 'INSUFFICIENT_INSIGHT', `needs ${cost} Insight, ${state.insight} left`);
    const redundant = newC.length === cs.C.length;
    const charge = redundant && rules.refundRedundant ? 0 : cost;
    if (rules.perCaseCap !== null && cs.spent + charge > rules.perCaseCap) return fail(state, 'CASE_CAP', `this case allows at most ${rules.perCaseCap} Insight`);
    if (!newC.includes(cc.target)) return fail(state, 'INVARIANT', 'target would leave the candidates; refused');
    const next = clone(state);
    const ns = next.cases[next.cursor];
    next.insight -= charge;
    ns.spent += charge;
    ns.C = newC;
    if (cmd.type === 'REVEAL') ns.revealed.push(cmd.clueId); else ns.trace.push({ year: cmd.year, result: ev.result });
    return done(next, [{ ...ev, charged: charge, refunded: redundant && charge === 0 ? cost : 0, removed: cs.C.filter(y => !newC.includes(y)), insight: next.insight }]);
  }

  if (cmd.type === 'LOCK') {
    if (resolved) return fail(state, 'CASE_RESOLVED', 'this case is already resolved');
    if (!Number.isInteger(cmd.year)) return fail(state, 'BAD_YEAR', 'year must be an integer');
    if (!cs.C.includes(cmd.year)) return fail(state, 'RULED_OUT', 'that year is already ruled out');
    const correct = cmd.year === cc.target;
    const next = clone(state);
    const ns = next.cases[next.cursor];
    ns.lock = { year: cmd.year, correct };
    ns.status = correct ? (ns.spent === 0 ? 'solved_clean' : 'solved_assisted') : 'missed';
    return done(next, [{ type: 'LOCKED', year: cmd.year, correct, status: ns.status }]);
  }

  if (cmd.type === 'ADVANCE') {
    if (!resolved) return fail(state, 'NOT_RESOLVED', 'lock a year before moving on');
    const next = clone(state);
    if (next.cursor === next.cases.length - 1) {
      next.status = 'completed';
      return done(next, [{ type: 'EXPEDITION_COMPLETED' }]);
    }
    next.cursor += 1;
    const nx = next.cases[next.cursor];
    nx.status = 'active';
    nx.C = content.cases.find(c => c.id === nx.id).c0.slice();
    return done(next, [{ type: 'CASE_OPENED', caseId: nx.id }]);
  }
  return fail(state, 'UNKNOWN_COMMAND', `unknown command ${cmd.type}`);
}

export function score(state) {
  const n = k => state.cases.filter(c => c.status === k).length;
  const clean = n('solved_clean'), assisted = n('solved_assisted'), missed = n('missed');
  return { solved: clean + assisted, clean, assisted, missed, unplayed: state.cases.length - clean - assisted - missed, insightLeft: state.insight, insightSpent: state.insightInitial - state.insight };
}

/** Everything the player may see. Hidden: the target, unrevealed clue text and predicates, resolution material of unresolved cases. */
export function publicView(state, content, rules) {
  const view = {
    dailyId: state.dailyId, mode: state.mode, status: state.status, insight: state.insight, insightInitial: state.insightInitial,
    cursor: state.cursor, score: score(state), rules: { trace: rules.trace, perCaseCap: rules.perCaseCap, relationTier: rules.relationTier, costs: rules.costs },
    cases: state.cases.map((cs, i) => {
      const cc = content.cases.find(c => c.id === cs.id);
      const base = { id: cs.id, order: i + 1, status: cs.status };
      if (cs.status === 'not_started') return base;
      const clues = availableClues(cc, rules).map(c => {
        const rev = cs.revealed.includes(c.id);
        return { id: c.id, tier: c.tier, cost: c.cost, category: c.category, revealed: rev, ...(rev ? { text: c.text, sourceIds: c.sourceIds } : {}) };
      });
      const open = {
        ...base, title: cc.title, lens: cc.lens, question: cc.question, corridor: cc.corridor, candidates: cs.C, freeCandidates: cc.c0, spent: cs.spent, trace: cs.trace,
        free: cc.free, relation: rules.relationTier === 'free' ? cc.relation : null, context: cc.context, clues,
        lock: cs.lock,
      };
      if (cs.status === 'active') return open;
      return { ...open, resolution: { answer: cc.target, ...cc.resolution, proof: cc.resolution.proof, hold: cc.hold } };
    }),
  };
  return view;
}

/** Replay a command log from a fresh expedition. Deterministic: same inputs give the same stateDigest. */
export function replay(content, rules, opts, log) {
  let s = createExpedition(content, rules, opts);
  const errors = [];
  for (const cmd of log) {
    const r = transition(s, cmd, content, rules);
    if (r.error) errors.push({ cmd, error: r.error });
    s = r.next;
  }
  return { state: s, errors };
}

export function shareText(state, content) {
  const marks = state.cases.map(c => ({ solved_clean: '■', solved_assisted: '▣', missed: '□' }[c.status] || '·')).join('');
  const sc = score(state);
  return `TIMEHUNT Daily Ten, pack ${content.packId}\n${marks}\n${sc.solved}/${state.cases.length} solved, ${sc.insightLeft} Insight left`;
}
