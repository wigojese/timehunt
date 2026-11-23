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

## Stage 5 (2026-11-23)
- Added `docs/playtest/` (protocol, consent, task sheets, observation template, results sheet, simulation findings, backlog, revised rules) and `docs/STAGE_5_USABILITY.md`.
- Gray-box: study mode (`?study=`), `scripts/strategy-lab.mjs`, `scripts/summarise-study.mjs`, `scripts/study-smoke.mjs`, one new test (71 total).
- `tools/pack/lint_pack.py`: rule L9 NESTED_CLUES (warning). Removed committed `__pycache__` files and added `.gitignore`.
- Recorded D-033 to D-036, F-020 to F-024, Q-42 to Q-44.

## Stage 6 (2026-11-23)
- Added `docs/art/strata2/` (three composition boards, grayscale twins, brand system board, contrast report, generator sources) and `docs/STAGE_6_ART_DIRECTION.md`.
- Pack fix: case 6 `target.event` no longer says "Merca"; regenerated `docs/pack/`, `app/data/` and `app/fixtures/` (71 tests pass).
- Recorded D-037 to D-042, F-025 to F-029, Q-45 to Q-48.
