import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { replay, stateDigest, score } from '../src/engine/engine.js';
import { loadContent, rules } from './helpers.js';

const here = dirname(fileURLToPath(import.meta.url));
const fx = join(here, '..', 'fixtures');
const content = loadContent();

for (const f of readdirSync(fx).filter(n => n.startsWith('scenario-'))) {
  test(`fixture ${f}: replay reproduces the recorded state byte for byte`, () => {
    const j = JSON.parse(readFileSync(join(fx, f), 'utf8'));
    assert.equal(j.packDigest, content.digest, 'fixture was recorded against a different pack; rerun scripts/demo-run.mjs');
    const rl = rules(j.rulesOverrides);
    assert.equal(rl.id, j.rulesId);
    const { state, errors } = replay(content, rl, {}, j.log);
    assert.equal(errors.length, 0);
    assert.equal(stateDigest(state), j.expected.stateDigest);
    assert.deepEqual(score(state), j.expected.score);
    assert.equal(state.insight, j.expected.insightLeft);
  });
}
