# Fixtures

| File | What it is | How it is used |
|---|---|---|
| `invalid-pack-mutations.json` | 18 small edits. Each breaks one rule of a valid pack and names the error code `validatePack` must return. Stored as patches, not as copies of the 100 KB pack. | `test/pack.test.js` applies each to a fresh copy and expects refusal with that code and no content returned |
| `scenario-full-day.json` | The scripted day: miss on case 5, Deep clue on case 2, Nudge on cases 3, 7, 8 and 9, the last Insight spent on case 9, a refused purchase on case 10, finished with 0 Insight. Default C1 rules, so no Trace. | `test/fixtures.test.js` replays `log` and requires `expected.stateDigest` |
| `scenario-no-trace-seeded.json` | A seeded random player, seed 20261123, default rules. | same, and shows seed reproducibility |
| `scenario-deep-relation-seeded.json` | A seeded random player, seed 7, relation sold as a Deep clue (Q-32 variant). | same |

Every scenario file has: `packDigest` (the pack it was recorded against; the test fails if the pack changes), `rulesOverrides` and `rulesId`, `log` (the accepted commands, each with its `actionId`), and `expected` (state digest, score, Insight left, status). If you change the pack or the rules, rerun `node scripts/demo-run.mjs` and review the diff; a changed digest means play changed.

A digest is a 56-bit non-cryptographic hash of canonical JSON. It detects accidents and corruption, not tampering.
