# Changelog

## 2026-11-23: Stage 2
- Added `RULES_CANDIDATES.md` (rulebook, formal rules, state machines, variants, content rules, recommendation) and `ECONOMY_EXPERIMENT.md`.
- Added `experiments/economy/`: reference model, exact solver, 23 tests, 14 experiments, figures.
- Added `economy/` outputs: `results.md`, `results.json`, `economy-results.png`, `state-machine.png`.
- Recorded the Stage 1 approval and answers (D-014, D-015) and new proposals D-016 to D-021, findings F-006 to F-012, questions Q-26 to Q-31.
- Reproduced and explained the earlier 63 to 70% claim.
- No product code written.

## 2026-11-22: Stage 1
- Added `STAGE_1_RESEARCH.md`: competitor matrix, differentiation statement, why free earlier/later failed, the bit-budget finding, three player types and two accessibility contexts, wrong-answer analysis, six falsifiable hypotheses, top ten retention risks.
- Recorded the Stage 0 approval and the user's answers (D-009 fixed, D-011 editor method, D-012, D-013).
- Added open questions Q-20 to Q-25.
- Extended `RESEARCH_LOG.md` with competitor reads and evidence levels.
- No code written.
- Environment note: network access for globle-game.com, chronophoto.app, timeguessr.com, pudding.cool, neal.fun, ftc.gov and oecd.org was added to the Timehunt cloud environment for this research. neal.fun, ftc.gov and oecd.org still blocked automated reads.

## 2026-11-22: Stage 0
- Added `TIMEHUNT_MASTER_PROMPT.md` (master prompt v2, the operative spec).
- Preserved the five earlier source documents under `source-documents/`. The v1 master prompt is marked superseded.
- Initialised project, decision, question, status, handoff, content, research, playtest, critique and QA documents.
- Added `STAGE_0_AUDIT.md`.
- No application code written or changed.

## Before Stage 0 (design exploration, not stage-approved)
- Route A/B/C visual sketches (`visual-prototypes/`), STRATA 1.0 and 1.5 boards (`visual-prototypes/strata*/`).
- Convergence gray-box and simulation (`prototype-convergence/`).

## Stage 3 (2026-11-23)
- Added `tools/pack/` (pack data, linter, schema, builder) and `docs/pack/` (draft pack JSON, case sheets, bibliography, audits, connections, candidates, review book + screenshots), `docs/STAGE_3_CONTENT.md`.
- Recorded Stage 2 approval (D-022), D-023 to D-026, F-013 to F-016, Q-32 to Q-37.

## Stage 4 (2026-11-23)
- Added `app/` (engine, store, UI, tests, fixtures, scripts), `docs/STAGE_4_GRAYBOX.md`, `docs/gray-box/` (test report, e2e report, video, screenshots).
- `tools/pack/build_pack.py` now also writes `app/data/daily-pack-draft.json`; a test checks it equals `docs/pack/daily-pack-draft.json`.
- Recorded Stage 3 approval (D-027), D-028 to D-032, F-017 to F-019, Q-38 to Q-41.
