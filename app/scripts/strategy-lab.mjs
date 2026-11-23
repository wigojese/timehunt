// SIMULATION ONLY. Nothing here is player data. Strategy bots and exact optima on the real draft pack.
// Usage: node scripts/strategy-lab.mjs   (writes docs/playtest/simulation-results.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validatePack } from '../src/engine/pack.js';
import { makeRules } from '../src/engine/rules.js';
import { cluesFor, createExpedition, publicView } from '../src/engine/engine.js';
import { yearLabel } from '../src/engine/years.js';

const here = dirname(fileURLToPath(import.meta.url));
const content = validatePack(JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8')), { allowDraft: true }).content;
const keep = (C, p) => C.filter(y => (p.op === 'gte' ? y >= p.year : p.op === 'lte' ? y <= p.year : y === p.year));

// ---- 1. exact chance-only optimum on the real pack --------------------------------------------------
// A player who cannot reason from the text picks uniformly among surviving years. Clue effects are fixed, so there is no adaptivity:
// per case, enumerate every ordered subset of clues, apply refund-on-redundant, value = 1/|C after|.
function perms(arr) { if (arr.length <= 1) return [arr]; return arr.flatMap((x, i) => perms([...arr.slice(0, i), ...arr.slice(i + 1)]).map(p => [x, ...p])); }
function subsets(arr) { return arr.reduce((acc, x) => acc.concat(acc.map(s => [...s, x])), [[]]); }
function caseOptions(cc, rules) {
  const clues = cluesFor(cc, rules);
  const best = new Map(); // budget -> {value, plan}
  const plans = [];
  for (const sub of subsets(clues)) for (const order of perms(sub)) {
    let C = cc.c0.slice(), cost = 0, ok = true;
    for (const cl of order) {
      const n = keep(C, cl.predicate);
      const charge = n.length === C.length && rules.refundRedundant ? 0 : cl.cost;
      if (rules.perCaseCap !== null && cost + charge > rules.perCaseCap) { ok = false; break; }
      cost += charge; C = n;
    }
    if (ok) plans.push({ cost, value: 1 / C.length, order: order.map(c => c.id) });
  }
  return plans;
}
function optimum(rules) {
  const B = rules.insight;
  const opts = content.cases.map(cc => caseOptions(cc, rules));
  // dp[i][b] = best total expected solves from cases i.. with b Insight left
  const dp = Array.from({ length: 11 }, () => Array(B + 1).fill(0)), choice = Array.from({ length: 10 }, () => Array(B + 1).fill(null));
  for (let i = 9; i >= 0; i--) for (let b = 0; b <= B; b++) {
    let bestV = -1, bestP = null;
    for (const p of opts[i]) if (p.cost <= b) { const v = p.value + dp[i + 1][b - p.cost]; if (v > bestV + 1e-12) { bestV = v; bestP = p; } }
    dp[i][b] = bestV; choice[i][b] = bestP;
  }
  const plan = []; let b = B;
  for (let i = 0; i < 10; i++) { const p = choice[i][b]; plan.push({ case: i + 1, spend: p.cost, order: p.order, left: 1 / p.value }); b -= p.cost; }
  const chance = content.cases.reduce((a, c) => a + 1 / c.c0.length, 0);
  return { chance, optimum: dp[0][B], plan };
}

// ---- 2. strategy bots that see only publicView text ------------------------------------------------
const WORD = { one: 1, two: 2, three: 3, four: 4 };
function yearsIn(text) {
  const out = [];
  for (const m of text.matchAll(/(?<![\d])(\d{1,4})\s*(BCE|CE)?(?![\d])/g)) {
    const n = Number(m[1]);
    if (m[2] === 'BCE') out.push(1 - n); else if (n >= 100 || m[2] === 'CE') out.push(n);
  }
  return out;
}
// "text parser": applies the relation sentence the way a careful reader would, but only when the anchor year is in the same sentence.
function parseRelation(text) {
  let m = text.match(/\b(one|two|three|four) calendar years? after\b(.*)/i);
  if (m) { const ys = yearsIn(m[2]); if (ys.length) return ys[ys.length - 1] + WORD[m[1].toLowerCase()]; }
  m = text.match(/\b(second|third) year of the .* era.* began in (.*?)[.]/i);
  if (m) { const ys = yearsIn(m[2]); if (ys.length) return ys[0] + ({ second: 2, third: 3 }[m[1].toLowerCase()] - 1); }
  return null;
}
function plusOne(text) { const ys = yearsIn(text); return ys.length ? ys[ys.length - 1] + 1 : null; } // the "anchor plus one" habit
function solveProb(guess, C, target) { return guess !== null && C.includes(guess) ? (guess === target ? 1 : 0) : (C.includes(target) ? 1 / C.length : 0); }

function textBots(rules) {
  const s = createExpedition(content, rules);
  const res = { parser: [], plusOne: [], first: [], last: [], median: [] };
  content.cases.forEach((cc, i) => {
    const st = { ...s, cursor: i, cases: s.cases.map((c, j) => j === i ? { ...c, status: 'active', C: cc.c0.slice() } : c) };
    const v = publicView(st, content, rules).cases[i];
    const C = v.candidates;
    const rel = v.relation ? v.relation.text : null;
    res.parser.push({ case: i + 1, guess: rel ? parseRelation(rel) : null, p: rel ? solveProb(parseRelation(rel), C, cc.target) : 1 / C.length });
    res.plusOne.push({ case: i + 1, guess: rel ? plusOne(rel) : null, p: rel ? solveProb(plusOne(rel), C, cc.target) : 1 / C.length });
    const pos = C.indexOf(cc.target);
    res.first.push(pos === 0 ? 1 : 0); res.last.push(pos === C.length - 1 ? 1 : 0); res.median.push(pos === Math.floor((C.length - 1) / 2) || pos === Math.ceil((C.length - 1) / 2) ? 1 : 0);
  });
  return res;
}
const sum = a => a.reduce((x, y) => x + (typeof y === 'number' ? y : y.p), 0);

// ---- 3. ordering exploit: does buying the bigger clue first save Insight? ------------------------------
function orderCosts(cc, rules) {
  const cl = cluesFor(cc, rules);
  if (cl.length < 2) return null;
  const run = order => { let C = cc.c0.slice(), cost = 0; for (const c of order) { const n = keep(C, c.predicate); cost += (n.length === C.length ? 0 : c.cost); C = n; } return { cost, left: C.length }; };
  const asc = [...cl].sort((a, b) => a.cost - b.cost), desc = [...cl].sort((a, b) => b.cost - a.cost);
  return { nudgeFirst: run(asc), deepFirst: run(desc) };
}

// ---- 4. reading load estimate (an estimate, not a measurement) --------------------------------------------
const words = t => t.trim().split(/\s+/).filter(Boolean).length;
const load = content.cases.map(cc => ({ case: cc.order, words: words(cc.question) + cc.free.reduce((a, f) => a + words(f.text), 0) + (cc.relation ? words(cc.relation.text) : 0) + cc.context.reduce((a, f) => a + words(f.text), 0) }));

// ---- run ---------------------------------------------------------------------------------------------------
const out = { _label: 'SIMULATION AND STATIC ANALYSIS ONLY. No human played. Not evidence about player experience.', pack: content.packId, variants: {} };
for (const [name, o] of [['C1 default (relation visible)', {}], ['relation sold as Deep clue', { relationTier: 'deep' }], ['per-case cap 1', { perCaseCap: 1 }], ['no refund', { refundRedundant: false }]]) {
  const rules = makeRules(o);
  out.variants[name] = { optimum: optimum(rules), textBots: (() => { const t = textBots(rules); return { parser: sum(t.parser), plusOne: sum(t.plusOne), first: sum(t.first), last: sum(t.last), median: sum(t.median), parserDetail: t.parser, plusOneDetail: t.plusOne }; })() };
}
out.ordering = content.cases.map(cc => ({ case: cc.order, ...(orderCosts(cc, makeRules()) || {}) })).filter(x => x.nudgeFirst);
out.targetPosition = content.cases.map(cc => ({ case: cc.order, candidates: cc.c0.length, position: cc.c0.indexOf(cc.target) + 1 }));
out.readingLoad = { perCase: load, totalWords: load.reduce((a, x) => a + x.words, 0), minutesAt200wpmReadingOnly: +(load.reduce((a, x) => a + x.words, 0) / 200).toFixed(1) };
writeFileSync(join(here, '..', '..', 'docs', 'playtest', 'simulation-results.json'), JSON.stringify(out, null, 2) + '\n');

const f = x => x.toFixed(2);
for (const [n, v] of Object.entries(out.variants)) {
  console.log(`\n${n}\n  pure chance ${f(v.optimum.chance)}  exact optimum of a non-reader ${f(v.optimum.optimum)}`);
  console.log(`  text bots: parser ${f(v.textBots.parser)}  plus-one ${f(v.textBots.plusOne)}  always-first ${v.textBots.first}  always-last ${v.textBots.last}  median ${v.textBots.median}`);
  console.log('  optimum plan (Insight per case): ' + v.optimum.plan.map(p => p.spend).join(' '));
}
console.log('\nparser misses (default):', out.variants['C1 default (relation visible)'].textBots.parserDetail.filter(d => d.p < 1).map(d => `case ${d.case} guess ${d.guess}`).join('; '));
console.log('plus-one misses (default):', out.variants['C1 default (relation visible)'].textBots.plusOneDetail.filter(d => d.p < 1).map(d => `case ${d.case} guess ${d.guess}`).join('; '));
console.log('\nordering (Insight to buy every clue): ', out.ordering.map(o => `case ${o.case}: nudge-first ${o.nudgeFirst.cost}, deep-first ${o.deepFirst.cost}`).join(' | '));
console.log('target position in candidates:', out.targetPosition.map(t => `${t.position}/${t.candidates}`).join(' '));
console.log('reading load:', out.readingLoad.totalWords, 'words =', out.readingLoad.minutesAt200wpmReadingOnly, 'min at 200 wpm; per case', load.map(l => l.words).join(' '));
