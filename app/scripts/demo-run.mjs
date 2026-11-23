// Plays the scripted day and two seeded bot days from the command line and writes replayable fixtures.
// Usage: node scripts/demo-run.mjs        (rewrites fixtures/scenario-*.json)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validatePack } from '../src/engine/pack.js';
import { makeRules } from '../src/engine/rules.js';
import { stateDigest, score } from '../src/engine/engine.js';
import { scriptedDay, botDay } from '../src/sim/scenarios.js';

const here = dirname(fileURLToPath(import.meta.url));
const fx = join(here, '..', 'fixtures');
const content = validatePack(JSON.parse(readFileSync(join(here, '..', 'data', 'daily-pack-draft.json'), 'utf8')), { allowDraft: true }).content;

function fixture(name, description, rulesOverrides, run, extra = {}) {
  const rules = makeRules(rulesOverrides);
  const r = run(rules);
  const body = { _about: description, packDigest: content.digest, rulesOverrides, rulesId: rules.id, ...extra, log: r.log, expected: { stateDigest: stateDigest(r.state), score: score(r.state), insightLeft: r.state.insight, status: r.state.status } };
  writeFileSync(join(fx, name), JSON.stringify(body, null, 2) + '\n');
  console.log(`${name}: ${body.expected.score.solved}/10 solved, ${r.state.insight} Insight left, digest ${body.expected.stateDigest}`);
  return r;
}

const day = fixture('scenario-full-day.json',
  'Scripted day under the default C1 rules (no Trace): miss on case 5, Deep clue on case 2, Nudge on case 7, last Insight spent on case 9, case 10 finished with zero Insight. Replaying the log must reproduce expected.stateDigest.',
  {}, rules => scriptedDay(content, rules));
fixture('scenario-no-trace-seeded.json', 'Seeded random player, seed 20261123, default rules (no Trace).', {}, rules => { const d = botDay(content, rules, 20261123); return { state: d.state, log: d.log }; }, { seed: 20261123 });
fixture('scenario-deep-relation-seeded.json', 'Seeded random player, seed 7, relation sold as a Deep clue (Q-32 variant).', { relationTier: 'deep' }, rules => { const d = botDay(content, rules, 7); return { state: d.state, log: d.log }; }, { seed: 7 });
console.log('refusals in the scripted day:', day.attempts.filter(a => !a.ok).map(a => `${a.note} -> ${a.code}`).join('; '));
