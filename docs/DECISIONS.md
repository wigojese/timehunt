# Decision log

Status values: **FIXED** (user decision), **PROVISIONAL** (user-named but must be validated), **PROPOSED** (mine, needs approval), **FINDING** (evidence, not a decision).

| ID | Date | Decision | Status | Source / approval | Alternatives considered | Reversal condition |
|---|---|---|---|---|---|---|
| D-001 | 2026-11-22 | The daily challenge is ten distinct hidden-date cases | FIXED | Master prompt v2 section 1.2 | One year per day (superseded) | User changes it |
| D-002 | 2026-11-22 | One shared bank of eight Insight per daily expedition, no refill between cases | FIXED | Master prompt v2 section 1.2 | Insight per case (superseded) | User changes it |
| D-003 | 2026-11-22 | STRATA is the visual direction, Oxide & Bone the starting tokens | FIXED | Master prompt v2 sections 1.2, 5.4 | Route B navy, Route C grey dial (rejected) | User changes it |
| D-004 | 2026-11-22 | Evidence / Trace / Lock is the provisional grammar | PROVISIONAL | Master prompt v2 section 1.2 item 5 | Trace removed or capped; Evidence-first | Stage 2 economy results or playtests |
| D-005 | 2026-11-22 | A missed case reveals its answer and the day continues. No shared lives pool. | FIXED | Master prompt v2 sections 1.3, 2.5 | Shared two-error limit (rejected) | User changes it |
| D-006 | 2026-11-22 | The old scoring formula `1000 + 100 x Insight + 150 x Locks` is rejected | FIXED | Master prompt v2 section 1.3 | Keep with tuning | Never, unless user reopens |
| D-007 | 2026-11-22 | Paid clues must remove at least one currently possible year, otherwise they are free context | FIXED | Master prompt v2 section 1.3 | Sell any true clue | User changes it |
| D-008 | 2026-11-22 | Repo hygiene: keep existing prototypes under `docs/` as read-only references. No app scaffold before the Stage 10 architecture decision. One canonical rules module only, created when rules are approved. | PROPOSED | Stage 0 audit | Scaffold now (rejected: contradicts section 8.1 and the stage gates) | Stage 10 decision |
| D-009 | 2026-11-22 | Default dating convention: "by 31 December of the target year", stated on every clue. Any other convention is explicit per clue. | **FIXED** | User approved at the Stage 0 gate, 2026-11-22 | 1 January convention (used in my STRATA 1.5 satellite clue, now inconsistent) | User changes it |
| D-010 | 2026-11-22 | Earlier source documents are preserved in `docs/source-documents/` so context loss does not lose the reasoning | PROPOSED, approved with Stage 0 | Stage 0 audit | Leave only in chat uploads (fragile) | User prefers them out of the repo |
| D-011 | 2026-11-22 | The agent acts as the project's historical editor and verifies every factual claim. Every claim carries a **verification level**: V0 unverified, V1 a source page was opened and the date or figure matched, V2 two independent sources agree, V3 reviewed by a named human. **The agent can set V0 to V2 only. V3 needs a person.** Nothing marked V0 or "to confirm" ships. **Release threshold: V2 is sufficient (D-014).** | FIXED as the working method User instruction at the Stage 0 gate, 2026-11-22. The V-levels are my proposal. | A human editor only (user declined to supply one). Agent verification presented as human sign-off (rejected: dishonest). | User supplies a human editor |
| D-012 | 2026-11-22 | The missing reference ZIP is not required. Work continues with the boards already in `visual-prototypes/`. | FIXED | User answer at the Stage 0 gate | Wait for the ZIP | User sends it |
| D-013 | 2026-11-22 | Stage 1 finding shapes Stage 2: about 95% of the information to solve ten cases must come from free dossiers, because 8 Insight spent on Trace buys at most about 4 of about 76.5 bits. Stage 2 must set how much uncertainty each case leaves, not only prices. | PROPOSED | `STAGE_1_RESEARCH.md` section 4 | Treat Insight as the main economy | Stage 2 results |

## Findings recorded in Stage 0 (evidence, not decisions)

| ID | Finding | Evidence |
|---|---|---|
| F-001 | The earlier "Trace-only wins 63 to 70%" result came from a simulation that included an undisclosed free opening card narrowing the range to about 17 years. Without it, Trace-only wins about 35.2%, matching the exact bound 11/31 (35.5%). | Reproduced; see `STAGE_0_AUDIT.md` section 4. Formal treatment is Stage 2. |
| F-002 | With Trace at 2 Insight and 10 Insight, pure binary search wins 100% with or without the free card. | `F(4,2) = 47 >= 31`, plus Monte Carlo. |
| F-003 | A wrong Lock removes that year, so it communicates one bit. | Code and UI check. |
| F-004 | None of the three fonts in the STRATA type system contains Georgian glyphs. Young Serif has no Cyrillic either. | Glyph coverage measured from the font files. |
| F-005 | The repo contains no motion or gesture code except one pointer handler in `convergence.html`. | Strict code search. |

## Added in Stage 2 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-014 | 2026-11-23 | Agent-verified claims at level V2 (two independent sources agree) are sufficient to publish. A human review (V3) is welcome but not required. | **FIXED** | User answer at the Stage 1 gate | Require V3 before release | User changes it |
| D-015 | 2026-11-23 | Stage 1 approved. The dossier carries about 95% of the information (D-013) is accepted. Stage 2 evaluates batched confirmation. | **FIXED** | `APPROVE STAGE 1` | n/a | n/a |
| D-016 | 2026-11-23 | **Recommended variant C1:** one Lock per case, no Trace in the Daily, Nudge 1 / Deep 2, refund on redundant, 8 shared Insight, scored as solved cases with Insight left shown. Trace stays available in Practice or advanced mode. | PROPOSED | `RULES_CANDIDATES.md` section 10 | A3 (Trace at 3), B (two Locks), A (Trace at 2) | Stage 4 or 5 results |
| D-017 | 2026-11-23 | Per-case Insight cap of 1 is a switch to test, not a default. | PROPOSED | Experiment 14 | No cap | Stage 4 or 5 results |
| D-018 | 2026-11-23 | Scoring: solved cases. Drop the clean-solve bonus. Leftover bonus at most 5 per Insight or none. Spoiler-free share card. | PROPOSED | Experiments 5 and 13 | S1 as written in the master prompt | Playtests |
| D-019 | 2026-11-23 | Content rules: uniqueness proof per case, derivable at zero Insight, no coin-flip pairs, 3 to 6 machine-visible candidates as an authoring target, no clue that cuts nothing from the dossier's candidates, no pre-purchase strength or overlap labels. | PROPOSED | `RULES_CANDIDATES.md` section 9 | n/a | Stage 3 authoring evidence |
| D-020 | 2026-11-23 | Batched confirmation (Return of the Obra Dinn) is not adopted as a rules fix. Re-test as emotional pacing in Stage 5. | PROPOSED | Experiment 8 | Adopt it | Stage 5 |
| D-021 | 2026-11-23 | `experiments/economy/` is the single reference for the rules maths and supersedes `docs/prototype-convergence/economy-simulation.py`. | PROPOSED | Stage 2 | Keep both (rejected: two sources of truth) | n/a |

## Findings added in Stage 2

| ID | Finding | Evidence |
|---|---|---|
| F-006 | The earlier "63 to 70%" Trace-only claim reproduces at 71.0% (exact) once the simulator's free 20-year card is included, and is 35.5% without it. | Experiment 7 |
| F-007 | Trace at price 2 adds nothing over no Trace. At price 1 it dominates. At 3 or more it is never used. | Experiments 1 and 3 |
| F-008 | Two Locks add about 3.5 solved cases, mostly by guessing. Halving second-Lock credit does not remove this. | Experiments 1 and 8 |
| F-009 | Allocation across the day adds only 0.10 to 0.37 solved cases over naive spending in the chance-only model. | Experiment 2 |
| F-010 | Optimal spending is front-loaded. Cases 6 to 9 get no Insight on the Mixed pack. A per-case cap of 1 spreads it at about 0.3 solved cases. | Experiments 9 and 14 |
| F-011 | The gain per Insight falls from 0.50 (n = 2) to 0.13 (n = 14). | Experiment 10 |
| F-012 | The leftover-Insight bonus is inert up to 20 points per Insight. | Experiment 13 |

## Added in Stage 3 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-022 | 2026-11-23 | Stage 2 approved. User answered yes to: C1 as Daily default (one Lock, no Trace in the Daily, Nudge 1 / Deep 2, refund on redundant, 8 shared Insight); scoring as solved cases with Insight left shown; Stage 3 content rules in `RULES_CANDIDATES.md` section 9 including a uniqueness proof per case. D-016, D-018 and D-019 are now accepted for authoring; D-017 stays a test switch. | **FIXED** | `APPROVE STAGE 2` | n/a | User changes it |
| D-023 | 2026-11-23 | A case template of two free bounds, one free relation and one or two paid bounds. Relation clues give the uniqueness proof. | PROPOSED | `STAGE_3_CONTENT.md` | Hide the relation from players (see Q-32) | User answer to Q-32 |
| D-024 | 2026-11-23 | Verification gate is computed: V2 needs two opened pages from **different publishers**. Two Wikipedia pages are one publisher. Not-opened sources never count. | PROPOSED | `lint_pack.py` | Count Wikipedia twice (rejected) | User changes it |
| D-025 | 2026-11-23 | Year-level targets only where sources disagree on the day. Day disagreements are recorded in the case facts. | PROPOSED | Stage 3 research | Pick one day (rejected) | A primary source settles a day |
| D-026 | 2026-11-23 | Astronomical year numbering inside data (1 BCE = 0), labels never show year zero. | PROPOSED | Case 9 | Signed years with a gap | Engine design in Stage 10 |

## Findings added in Stage 3

| ID | Finding | Evidence |
|---|---|---|
| F-013 | All ten drafted cases are solvable by arithmetic from free evidence; paid Insight has no role. Effective residual after the free dossier is 1, not 3 to 6. | `AUDITS.md` section 3 |
| F-014 | Only 2 of 10 answers reach V2 under the available network. 0 of 10 cases pass the full gate. | `AUDITS.md` section 1 |
| F-015 | Linter caught five leaks in the first draft (target year in free context and in one title). | Lint run |
| F-016 | Seven of ten relations are "one calendar year after"; a player can learn to guess anchor plus one. | `AUDITS.md` section 3 |

## Added in Stage 4 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-027 | 2026-11-23 | Stage 3 approved (`APPROVE STAGE 3`, "approve and continue"). The user did not answer Q-32 to Q-35, so the Stage 3 pack stands as drafted and the open choices become Stage 5 test switches. | **FIXED** | User message | Block on answers (rejected: the user said continue) | User answers Q-32 to Q-35 |
| D-028 | 2026-11-23 | The gray-box is dependency-free JavaScript modules with `node:test`. It does not choose the product stack. D-008 (no app scaffold before Stage 10) is narrowed: Stage 4 of the master prompt explicitly requires a runnable build, so `app/` exists, with a portable engine and a throw-away UI. | PROPOSED | `STAGE_4_GRAYBOX.md` | React/Expo now (rejected: stack not decided, no verified compatibility check yet) | Stage 10 decision |
| D-029 | 2026-11-23 | Purchases are transactional: compute next state, one write, adopt only after the write, re-read the store if the write throws. Every command has an idempotent `actionId`. | PROPOSED | `session.js`, tests | Optimistic UI with rollback | Stage 10 persistence choice |
| D-030 | 2026-11-23 | A saved record that is corrupt, tampered, from another schema, or bound to a different pack or rules is held, never loaded or overwritten. The player may discard it explicitly and it is backed up. | PROPOSED | `session.js`, tests | Silent migration or reset (rejected, 8.5) | Playtest evidence |
| D-031 | 2026-11-23 | Prices live in `rules.js`, not in pack content. The pack's `cost` field is ignored by the engine. | PROPOSED | `engine.js` | Per-clue prices in content | Stage 5 if clue prices must vary |
| D-032 | 2026-11-23 | The daily identity in the gray-box is the pack id. No reset clock yet. | PROPOSED | `main.js` | UTC date key | Q-09, Stage 10 |

## Findings added in Stage 4

| ID | Finding | Evidence |
|---|---|---|
| F-017 | A random player who reads nothing solves 2.55 of 10 with no clues, 3.98 buying every clue (C1), 4.61 when the relation is sold as a Deep clue, and 3.51 under a per-case cap of 1. | 2,000 seeded runs per row, `STAGE_4_GRAYBOX.md` |
| F-018 | Five deliberately injected engine bugs were each caught by the suite (1 to 8 failing tests each). | `TEST_REPORT.md` |
| F-019 | 216,000 random commands in six rule variants broke no invariant. The bank never exceeded its start, never went negative, and `insight + spent` always equalled the start. | `properties.test.js` |

## Added in Stage 5 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-033 | 2026-11-23 | Authoring rule L9: within a case, no paid clue may remove a strict subset of what another paid clue removes. Implemented as a lint warning (`NESTED_CLUES`). Reason: with refund-on-redundant, nested clues make purchase order matter (cases 1, 2, 6). | PROPOSED | `SIMULATION_FINDINGS.md` section 2 | Remove refund; flat prices | Player evidence |
| D-034 | 2026-11-23 | Stage 4 approved (`APPROVE STAGE 4`). Stage 5 is delivered as a protocol plus simulations because the agent cannot recruit players. Human results are NOT TESTED. | **FIXED** | User message | Invent results (rejected) | n/a |
| D-035 | 2026-11-23 | Provisional rules decision: keep one Lock, drop Trace from the Daily (Practice or advanced only), keep Nudge 1 / Deep 2 and refund on redundant, relation visible or Deep clue undecided. Pre-written thresholds H1 to H9 decide what changes. | PROPOSED | `BACKLOG.md`, `PROTOCOL.md` | Keep Trace | H7 |
| D-036 | 2026-11-23 | Study mode records timings and choices locally with a participant code only. No network, no names. | PROPOSED | `main.js` | Analytics service (rejected: privacy, not needed) | Stage 10 telemetry decision |

## Findings added in Stage 5

| ID | Finding | Evidence |
|---|---|---|
| F-020 | A parser bot that reads only the free text solves 9.20 of 10 with no Insight on the draft pack. Best non-reader with Insight: 4.87. Chance: 2.57. | `strategy-lab.mjs` |
| F-021 | Selling the relation as a Deep clue raises the value of Insight (non-reader optimum 5.87 vs chance 2.57) and drops the parser bot to chance. | `strategy-lab.mjs` |
| F-022 | Deep-first purchase saves 1 Insight in cases 1, 2 and 6 (nested clues). | `strategy-lab.mjs`, lint L9 |
| F-023 | "Anchor plus one" solves 7 of 10. The answer is never the first of the free-bound candidates and is last in 3 of 10. | `strategy-lab.mjs` |
| F-024 | If ruled-out years were hidden, refused Locks would reveal them. A refusal is information. | Reasoning on `engine.js` |
