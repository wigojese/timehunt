# Stage 5: early usability and balancing

Status: complete as a **plan and simulation stage**, awaiting `APPROVE STAGE 5`. **No player has played. Human findings: NOT TESTED.** Nothing from Stage 6 has been started.

## Contents of `docs/playtest/`
| File | Purpose |
|---|---|
| `PROTOCOL.md` | Questions, participants (8 to 12 novices, 3 enthusiasts), conditions A and B, 50-minute session, measures, pre-written decision rules H1 to H9, ethics, roles |
| `CONSENT_SCRIPT.md` | Plain-language consent with separate yes or no for notes, screen, voice and quotes |
| `TASK_SHEETS.md` | Facilitator script, prompt ladder, fixed probes, comprehension quiz with correct answers, scales, Trace probe |
| `OBSERVATION_TEMPLATE.md`, `observation-template.csv` | Event codes, per-case sheet, scales |
| `RESULTS.md` | Every hypothesis marked NOT TESTED |
| `SIMULATION_FINDINGS.md`, `simulation-results.json` | Labelled simulations and static analysis on the real pack |
| `BACKLOG.md` | 15 items ranked by risk, with the evidence behind each, and a provisional decision on Lock, Trace and costs |
| `../../docs/playtest/REVISED_RULES.md` | User-readable rules v0.2 |

## Code added
- Study mode in the gray-box: `?study=P01&cond=A|B`. Local timestamped log of views, choices, purchases, locks (with correctness), refusals and reloads. Per-participant saves. A download button. No network. Checked by `scripts/study-smoke.mjs` (6 of 6).
- `scripts/summarise-study.mjs` turns downloaded logs into a per-case CSV (1 test, on a synthetic log marked as such).
- `scripts/strategy-lab.mjs` for the simulations.
- Lint rule L9 `NESTED_CLUES` (warning). It flags cases 1, 2 and 6.

Test suite: 71 passing (was 70). `npm test` in `app/`.

## What the simulations found (not player data)
1. With the relation visible, a parser that only reads the free text solves 9.20 of 10 with no Insight; the best a non-reader can do with Insight is 4.87; chance is 2.57. Reading dominates spending.
2. With the relation sold as a Deep clue, Insight matters: 2.57 to 5.87.
3. Buying order matters in cases 1, 2 and 6: the dearer clue first saves 1 Insight.
4. "Anchor plus one" solves 7 of 10. The answer is never the first candidate and is last in 3 of 10.
5. Free text is 764 words (about 3.8 minutes of pure reading). Whether ten cases is overwhelming is unmeasured.

## Decision (provisional, no player evidence)
Keep one Lock. Drop Trace from the Daily (keep in Practice or advanced). Keep Nudge 1 and Deep 2 and refund on redundant, but rewrite the clue ladders so the order of purchase never matters. Leave relation visible or sold as a Deep clue undecided until H4 and H5 are tested. Details and reversal conditions are in `BACKLOG.md`.

## What was not done
Recruiting, scheduling, any session, any real telemetry (there is none), any device or assistive-technology check, any claim about fun or fairness.
