# Handoff

**As of:** 2026-11-22, end of Stage 0. **Branch:** `claude/peaceful-fermat-j8inv8`. **Remote:** `origin` (github.com/wigojese/timehunt).

## State in one paragraph
There is no application. The repo holds the operative spec, the preserved source documents, design boards, one single-case gray-box and one simulation script. Stage 0 is done and awaits approval. Do not start Stage 1 without `APPROVE STAGE 0`.

## Read first
1. `TIMEHUNT_MASTER_PROMPT.md` (operative spec). Sections 0, 1, 9 and 11 matter most.
2. `STAGE_0_AUDIT.md` (what exists, what is verified, what to replace).
3. `DECISIONS.md` and `OPEN_QUESTIONS.md`.

## File map
| Path | What it is | Trust level |
|---|---|---|
| `TIMEHUNT_MASTER_PROMPT.md` | Operative spec, v2 | Authoritative |
| `source-documents/` | Earlier prompts and evaluations. 01 is superseded. | Context only |
| `prototype-convergence/convergence.html` | Single-case gray-box, 128 lines, no build step | Reference only, replace |
| `prototype-convergence/economy-simulation.py` | Monte Carlo of the old single-case economy, seed 7 | Has an undisclosed free-card assumption, see F-001 |
| `visual-prototypes/strata/`, `strata-1.5/` | JS-drawn SVG boards. Static. | Visual reference only |
| `visual-prototypes/route-*.html` | Rejected routes B and C, plus route A that inspired STRATA | Archive |

## Commands
- View the gray-box: open `docs/prototype-convergence/convergence.html` in a browser. Add `?insight=8&locks=2&trace=3` to change the economy.
- Run the simulation: `python3 docs/prototype-convergence/economy-simulation.py` (standard library only).
- There is no build, test or deploy command because there is no toolchain yet.

## Blockers
- Some primary sources cannot be read from this environment (Q-11).
- The user's reference ZIP is absent (Q-18).
- No historical editor is named (Q-10).

## Next step
Wait for `APPROVE STAGE 0`. Then Stage 1 only: product research and differentiation.
