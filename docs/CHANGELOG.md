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

## Stage 7 (2026-11-23)
- Replaced the gray-box UI with the Option I mid-fidelity UI: `app/index.html`, `app/ui.css`, `app/src/ui/app.js`, `app/src/ui/strings.js` (pseudo-locale included). Engine and store unchanged apart from two read-only additions to `publicView` (`lens`, `freeCandidates`).
- Added `app/scripts/e2e-ui.mjs` (78 assertions, axe-core on 33 screens, reach, tap targets, overflow, text sizes, pseudo-locale, keyboard) and `app/scripts/make-flows.mjs`. `axe-core` is a dev dependency (`npm install` once).
- Retired `app/scripts/record-video.mjs`; updated `study-smoke.mjs` to the new DOM.
- Added `docs/ui/` (flow sheets, screens, accessibility trees, e2e report) and `docs/STAGE_7_UI.md`.
- Recorded D-043 to D-050, F-030 to F-034, Q-49 to Q-52.

## Stage 8 (2026-11-23)
- Added `app/motion/` (camera, transition, path-scroll maths, gestures, camera view, prototype, reveal data, perf recorder), `app/test/camera.test.js` (15 tests; 86 in all), `app/scripts/e2e-motion.mjs` (60 assertions, axe, reduced motion, large text, performance), `app/scripts/record-motion.mjs` (video and storyboard).
- Added `docs/motion/` (storyboard, video, perf summary, screenshots, e2e report) and `docs/STAGE_8_MOTION.md`. `docs/motion/frames/` is regenerated and ignored.
- Recorded D-051 to D-057, F-035 to F-038, Q-53 to Q-56.

## Stage 9 (2026-11-23)
- Added `app/reveal/` (hub, six stories, finale, twelve evidence forms), `app/test/reveal.test.js` and `stories.test.js` (14 tests; 100 in all), `app/scripts/e2e-reveal.mjs` (65 assertions), `make-reveal-sheets.mjs`, `make-reveal-docs.mjs`.
- Added `docs/reveal/` (CONTENT_SCRIPTS, SOURCES_RIGHTS, sheets, screens, e2e report) and `docs/STAGE_9_REVEAL.md`.
- Pack: added sources `wp-festac_77`, `wp-pan-africanism`, `wp-apollo_11`; fuller notes for Rosetta and WHO; case 3's question now says "ships" and records the Arellano hold. Regenerated `docs/pack/`, `app/data/`, `app/fixtures/`.
- Recorded D-058 to D-063, F-039 to F-043, Q-57 to Q-60.
