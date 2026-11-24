// THE canonical rules module. One source of truth for numbers and switches (Stage 2, variant C1).
// Every field is a test value, not a validated economy (see docs/RULES_CANDIDATES.md).
import { digest } from './canon.js';

export const RULES_VERSION = 'c1-0.2';   // 0.2: Lock accepts any year in the case's range (open choice), not only the remaining candidates

export const DEFAULT_RULES = Object.freeze({
  insight: 8,                        // shared bank for the day, never refills
  costs: Object.freeze({ nudge: 1, deep: 2 }),
  refundRedundant: true,             // a clue that removes nothing from the current candidates costs 0
  perCaseCap: null,                  // null, or a max Insight spent per case (D-017 test switch)
  trace: Object.freeze({ enabled: false, cost: 2 }), // C1: no Trace in the Daily
  relationTier: 'free',              // 'free': relation shown as reading; 'deep': hidden and sold as a Deep clue (Q-32)
  practiceInsight: 2,
  showRuledOut: true,                // the year selector greys out years already ruled out
});

export function makeRules(overrides = {}) {
  const r = {
    ...DEFAULT_RULES, ...overrides,
    costs: { ...DEFAULT_RULES.costs, ...(overrides.costs || {}) },
    trace: { ...DEFAULT_RULES.trace, ...(overrides.trace || {}) },
  };
  if (!Number.isInteger(r.insight) || r.insight < 0) throw new RangeError('rules.insight must be a non-negative integer');
  for (const [k, v] of Object.entries(r.costs)) if (!Number.isInteger(v) || v < 1) throw new RangeError(`cost ${k} must be a positive integer`);
  if (r.perCaseCap !== null && (!Number.isInteger(r.perCaseCap) || r.perCaseCap < 0)) throw new RangeError('perCaseCap');
  if (!['free', 'deep'].includes(r.relationTier)) throw new RangeError('relationTier must be free or deep');
  if (!Number.isInteger(r.trace.cost) || r.trace.cost < 1) throw new RangeError('trace.cost');
  /** @type {typeof r & {version: string, id: string}} */
  const out = { ...r, version: RULES_VERSION, id: digest({ ...r, version: RULES_VERSION, id: undefined }) };
  return Object.freeze(out);
}
