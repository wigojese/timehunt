# Handoff

**As of:** 2026-11-23, end of Stage 2. **Branch:** `claude/peaceful-fermat-j8inv8`. **Remote:** `origin` (github.com/wigojese/timehunt).

## State in one paragraph
There is no application. The repo holds the operative spec, the preserved source documents, design boards, one single-case gray-box and one simulation script. Stages 0 and 1 are approved. Stage 2 (economy and rules) is done and awaits approval. Do not start Stage 3 without `APPROVE STAGE 2`.

## Read first
1. `TIMEHUNT_MASTER_PROMPT.md` (operative spec). Sections 0, 1, 9 and 11 matter most.
2. `RULES_CANDIDATES.md` and `ECONOMY_EXPERIMENT.md` (the rules proposal and the evidence for it), then `STAGE_0_AUDIT.md` (what exists, what is verified, what to replace) and `STAGE_1_RESEARCH.md` (competitors, the bit-budget finding, hypotheses, risks).
3. `DECISIONS.md` and `OPEN_QUESTIONS.md`.

## File map
| Path | What it is | Trust level |
|---|---|---|
| `TIMEHUNT_MASTER_PROMPT.md` | Operative spec, v2 | Authoritative |
| `source-documents/` | Earlier prompts and evaluations. 01 is superseded. | Context only |
| `prototype-convergence/convergence.html` | Single-case gray-box, 128 lines, no build step | Reference only, replace |
| `prototype-convergence/economy-simulation.py` | Old Monte Carlo | **Superseded** by `experiments/economy/` (D-021) |
| `../experiments/economy/` | Reference model, exact solver, 23 tests, 14 experiments | Trust the tests; assumptions M1 to M7 in `dp.py` |
| `visual-prototypes/strata/`, `strata-1.5/` | JS-drawn SVG boards. Static. | Visual reference only |
| `visual-prototypes/route-*.html` | Rejected routes B and C, plus route A that inspired STRATA | Archive |

## Commands
- View the gray-box: open `docs/prototype-convergence/convergence.html` in a browser. Add `?insight=8&locks=2&trace=3` to change the economy.
- Rules lab: `cd experiments/economy && python3 -m unittest -v && python3 run_experiments.py` (standard library only).
- There is no build, test or deploy command because there is no toolchain yet.

## Blockers
- Some primary sources cannot be read from this environment (Q-11).
- The user's reference ZIP is absent (Q-18).
- No historical editor is named (Q-10).

## Next step
Wait for `APPROVE STAGE 2`. Then Stage 3 only: historical content architecture and the first ten-case dossier, using the content rules in `RULES_CANDIDATES.md` section 9.

## After Stage 3
Stage 3 is complete and awaiting `APPROVE STAGE 3`. Rebuild with `python3 tools/pack/build_pack.py`; lint with `python3 tools/pack/lint_pack.py`. Edit only `tools/pack/pack_data.py`, never the generated files. Do not start Stage 4 without approval. Biggest open item: Q-32 (free evidence solves everything).

## After Stage 4
Stage 4 is complete and awaiting `APPROVE STAGE 4`. `cd app && npm test` (70 tests) and `node scripts/serve.mjs` to play. Rules live only in `app/src/engine/rules.js`; content only in `tools/pack/pack_data.py` (rebuild with `python3 tools/pack/build_pack.py`, then `node app/scripts/demo-run.mjs` to refresh fixtures). Do not start Stage 5 without approval. Stage 5 needs human players the agent cannot supply (Q-40).

## After Stage 5
Stage 5 is complete as a plan and simulation stage and awaits `APPROVE STAGE 5`. No human sessions have been run. To run them: follow `docs/playtest/PROTOCOL.md`; give participants `?study=Pnn&cond=A|B`; download each log; run `node app/scripts/summarise-study.mjs`. Only then fill `docs/playtest/RESULTS.md`. Do not start Stage 6 without approval.

## After Stage 6
Stage 6 is complete and awaits `APPROVE STAGE 6`. Boards rebuild with `cd docs/art/strata2 && node build.mjs`. Recommended direction: Option I (Instrument) plus Option III's evidence notes (D-038, unapproved). No STRATA styling exists in `app/`; Stage 7 builds the real screens. Do not start Stage 7 without approval.
