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

## Added in Stage 6 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-037 | 2026-11-23 | Stage 5 approved (`APPROVE STAGE 5`). | **FIXED** | User message | n/a | n/a |
| D-038 | 2026-11-23 | STRATA 2.0 base direction is **Option I, Instrument**: years as pressable layers, ruled-out years as labelled hatch bands, peg row for the bank, ten-segment day strip. Borrow Option III's numbered serif evidence notes and gap labels. | PROPOSED | `STAGE_6_ART_DIRECTION.md` | Option II (Specimen), Option III (Editorial) | Viewer feedback; candidate sets above 6 years |
| D-039 | 2026-11-23 | Status is carried by shape plus a word, never colour alone: filled solved, half-filled solved with help, slashed missed, dotted to come. | PROPOSED | Boards | Colour-coded status | Accessibility review |
| D-040 | 2026-11-23 | One filled button per screen (the oxide primary). Clue-purchase buttons are outlined. | PROPOSED | Grayscale render | Dark filled clue buttons | Player confusion |
| D-041 | 2026-11-23 | Contrast is checked on the rendered boards, text against its nearest solid background, by `docs/art/strata2/build.mjs`, with the limits stated. | PROPOSED | `contrast-report.json` | Token-only check (rejected: it passed an unreadable render) | A fuller audit tool |
| D-042 | 2026-11-23 | App icon: four-layer core with one slipped layer and an oxide marker; a heavier three-layer cut at 32 px and below. | PROPOSED | Brand board | Single glyph | Device masks and store review |

## Findings added in Stage 6

| ID | Finding | Evidence |
|---|---|---|
| F-025 | A contrast check run on a different page from the board passed everything while the board's text was unreadable (light text inherited onto light phones). The check now runs on the boards. | Build history |
| F-026 | 0 contrast failures on 407 rendered text runs across three options; lowest 5.62:1. No text under 14 px. | `contrast-report.json` |
| F-027 | In grayscale the dark clue buttons outweighed the oxide primary. Outlining them fixed it. | `strata2-o1-gray.png` |
| F-028 | Option II prints both anchor years as large numerals, which makes the deduction more visible and, given F-020, risks making the game easier. | `strata2-o2.png` |
| F-029 | Case 6's `target.event` still named "Merca", a detail removed as unverified in Stage 3. Fixed in the pack. | `pack_data.py` |

## Added in Stage 7 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-043 | 2026-11-23 | Primary year selector: a native radio group styled as stacked 56 px layers, with labelled hatch bands for years ruled out by free evidence and stipple rows for years ruled out by a clue. | PROPOSED | `STAGE_7_UI.md` | Scrolling ruler; chips row | Candidate sets above about 8; player evidence |
| D-044 | 2026-11-23 | Precision alternative: "Type a year instead" accepting `1920`, `2 CE`, `5 BCE`, with refusal messages. | PROPOSED | `app.js` | Stepper | Player evidence |
| D-045 | 2026-11-23 | No gesture is required for any action. Every action is a button, radio, checkbox, disclosure or link. | PROPOSED | e2e keyboard run | Swipe and pinch shortcuts | Never for required actions |
| D-046 | 2026-11-23 | Lock is always confirmed. Spending is confirmed by default and can be switched off in Settings. | PROPOSED | `STAGE_7_UI.md` | No confirmation | Stage 5 evidence on confirm fatigue |
| D-047 | 2026-11-23 | Evidence notes are numbered serif text on the main path: dossier, hunt disclosure, evidence sheet. | PROPOSED | Stage 6 borrowing | Hide notes behind a sheet | Player evidence |
| D-048 | 2026-11-23 | Lining figures are forced everywhere, tabular on years. Young Serif's old-style figures make "1900" read as "19oo". | PROPOSED | Rendered test | Old-style figures | A font change |
| D-049 | 2026-11-23 | Stage 6 approved (`APPROVE STAGE 6`). Option I with Option III's notes is the working direction. | **FIXED** | User message | n/a | n/a |
| D-050 | 2026-11-23 | The Stage 4 browser recorder is retired. `scripts/e2e-ui.mjs` replaces it and asserts the same behaviours on the new UI. The Stage 4 video and report remain as the record of that stage. | PROPOSED | Changelog | Keep both | n/a |

## Findings added in Stage 7

| ID | Finding | Evidence |
|---|---|---|
| F-030 | The Stage 6 boards used Young Serif's old-style figures, so years with zeros and scores of 0 read as letters. The app now forces lining figures. | Rendered test |
| F-031 | The sticky action bar and a sticky bottom nav overlapped and hid a button. | axe target-size |
| F-032 | At 200% text, fixed-size pegs and a single-row HUD overflowed to 477 px. | e2e overflow check |
| F-033 | 78 end-to-end assertions pass; axe finds 1 issue on 33 screens (a list row obscured by the sticky bar at scroll top). | `docs/ui/e2e-report.json` |
| F-034 | All 30 primary buttons sit in the bottom 45% of the viewport. This is a geometric proxy for one-hand reach, not a hand study. | `e2e-report.json` |

## Added in Stage 8 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-051 | 2026-11-23 | Stage 7 approved (`APPROVE STAGE 7`). | **FIXED** | User message | n/a | n/a |
| D-052 | 2026-11-23 | The motion prototype is isolated in `app/motion/` and does not use the engine or the Stage 7 UI. Camera, transition and path maths are pure modules with unit tests. | PROPOSED | `STAGE_8_MOTION.md` | Build into the main UI first | Stage 10 architecture |
| D-053 | 2026-11-23 | The camera surface uses `touch-action: pan-y`: one finger scrolls the page, two fingers pinch the camera, the marker handle alone uses `touch-action: none`, a plain wheel is never intercepted. Every gesture has a button or key. | PROPOSED | e2e | Full-surface gesture capture (rejected: scroll trap) | Real-device evidence |
| D-054 | 2026-11-23 | Transitions are reversible controllers whose progress is continuous; interruptions continue from the current picture. | PROPOSED | `transition.js`, tests | Fire-and-forget CSS transitions | n/a |
| D-055 | 2026-11-23 | Path scroll reads natural scroll and never captures it; the controls to move along the path sit inside the sticky camera. | PROPOSED | e2e | Scroll-jacking | n/a |
| D-056 | 2026-11-23 | Timeline cameras show no ruled-out hatch; hatch keeps its one meaning. Pin labels collapse to dots under 40 px spacing; the dates are always also listed as text. | PROPOSED | Storyboard | Overprinted labels | n/a |
| D-057 | 2026-11-23 | The Stage 8 performance claim is limited to emulation until a real device run exists. `?perf=1` provides the recorder. | PROPOSED | `perf.js` | Claim performance from emulation | A device run |

## Findings added in Stage 8

| ID | Finding | Evidence |
|---|---|---|
| F-035 | Focal pinning holds: maximum focal-year shift 2e-13 years across 12,000 random pinch steps; under 0.08 years in a touch pinch. | `camera.test.js`, `e2e-motion.mjs` |
| F-036 | Render work is 0.3 ms p95 per frame at full speed and 3.0 ms at 6x CPU slowdown, with 190 layouts in an 8.8 s pinch, drag and branch run. Headless frame times are quantised at the display rate and say little about a phone. | `perf-summary.json` |
| F-037 | Ten collision and gesture bugs found and fixed while building; seven open risks listed, none tested on a device. | `STAGE_8_MOTION.md` section 4 |
| F-038 | Reduced motion reaches the end state in about 50 ms or less against 340 to 900 ms, with the same verdict and answer. | `e2e-report.json` |

## Added in Stage 9 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-058 | 2026-11-23 | Stage 8 approved ("approve and continue"). Q-53 to Q-56 stay open: no real-phone run yet. | **FIXED** | User message | n/a | n/a |
| D-059 | 2026-11-23 | The reveal prototype is isolated in `app/reveal/`. Stories are data (`stories.js`); every beat and lane event cites pack source ids; tests refuse unknown sources. | PROPOSED | `STAGE_9_REVEAL.md` | Hand-written pages | Stage 10 architecture |
| D-060 | 2026-11-23 | No third-party media in the prototype. Every graphic is generated from sourced data and labelled a diagram. | PROPOSED | `SOURCES_RIGHTS.md` | Stock or archival images | A rights search (Q-12, Q-48) |
| D-061 | 2026-11-23 | Relationships between cases are labelled by category. Simultaneous events say "Simultaneous. No link is claimed. What would make it a link: a source that says so." | PROPOSED | Relation cards | Unlabelled juxtaposition | n/a |
| D-062 | 2026-11-23 | Precision is drawn: a day is a mark, a month or year or range is a band, an uncertain tradition is dashed. | PROPOSED | Lanes | Single dots for all dates | n/a |
| D-063 | 2026-11-23 | Case 3's question says "Spanish ships", not "a Spanish ship", because Arellano also returned in 1565. | PROPOSED | Wikipedia, Manila galleon | Keep "first ship" | Evidence of who arrived first |

## Findings added in Stage 9

| ID | Finding | Evidence |
|---|---|---|
| F-039 | Urdaneta and Alonso de Arellano both made successful return trips in 1565; the case's "a Spanish ship" framing was too strong. | Wikipedia, Manila galleon |
| F-040 | An unsourced sentence from Stage 3 (outward direction easier) was removed from the reveal; the story keeps only what the opened page supports. | `stories.js` |
| F-041 | FESTAC 77 (Lagos, 15 January to 12 February 1977, about 16,000 participants, 56 African nations and the diaspora) adds a non-Western event to the 1977 cross-case view. | Wikipedia, FESTAC 77 |
| F-042 | Two events a lane's width apart collided their numeric labels and axis years; both were fixed by staggering and thinning. | Screenshots |
| F-043 | A sticky Previous and Next bar again obscures one selectable list item at some scroll positions (axe target size). Same trade-off as Stage 7. | `e2e-report.json` |

## Added after the Stage 9 gate (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-064 | 2026-11-23 | Stage 9 approved. Answers to the gate: the AI checks reveal content (labelled agent review, not V3); the finale looks for a more surprising connection; **only a few reveal stories per day** (three or fewer plus the finale). | **FIXED** | User message | A story for every case | User changes it |
| D-065 | 2026-11-23 | Facts in reveals are re-checked by `tools/verify/check-claims.mjs` (47 claims, 47 found). A claim list entry is required for every new factual claim. | PROPOSED | `REVIEW.md` | Manual re-reading | A better verifier |
| D-066 | 2026-11-23 | The finale shows three connection categories side by side: Same year, Same place, Named after, each with its label and what would make it a link. | PROPOSED | `stories.js` | Only coincidences | Player evidence |

| ID | Finding | Evidence |
|---|---|---|
| F-044 | Somalia appears twice in the day: Ibn Battuta reached Mogadishu in 1332, and the last natural smallpox case was diagnosed in Merca, southwest of Mogadishu, in 1977. | `claim-check.json` |
| F-045 | The Rosetta probe (launched 2 March 2004) is named after the stone found in 1799; its lander is named after the Philae obelisk. | `claim-check.json` |
| F-046 | My first pattern for one claim failed because Wikipedia writes dates in US style. The checker now reports misses so patterns can be fixed, not claims hidden. | `check-claims.mjs` |
| F-047 | Two source ids for the new Wikipedia pages were wrong and the UI silently dropped them. A test now checks every connection node's sources exist. | `stories.test.js` |

## Added in Stage 10 (2026-11-23)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-067 | 2026-11-23 | Stage 9 approved with three answers (D-064). Stage 10 only is authorised. | **FIXED** | User message | n/a | n/a |
| D-068 | 2026-11-23 | Ship first as a TypeScript PWA built with Vite, static hosting, no server in v1. | PROPOSED | `ADR-001-stack.md` | Expo/React Native; PWA + Capacitor; fully native | Any trigger T1 to T5 in ADR-001, most likely after real-device evidence |
| D-069 | 2026-11-23 | Engine, content validator and store stay framework-free and independent of rendering. This is enforced by ESLint (imports, platform globals, `Math.random`, `Date`), with negative tests. | PROPOSED | `app/eslint.config.js` | Convention only | n/a |
| D-070 | 2026-11-23 | No UI framework until a trigger fires (T4). Preact is the first candidate. | PROPOSED | ADR-001 section 5 | Adopt React or Preact now | Two consecutive stages with defects caused by hand-written DOM updates, or shared state over about six screens |
| D-071 | 2026-11-23 | Pin TypeScript to 6.0.x because typescript-eslint 8.74.0 declares support below 6.1.0; latest is 7.0.2. | PROPOSED | `DEPENDENCY_MATRIX.md` | Run 7.x without TS linting | typescript-eslint widens its range (T6) |
| D-072 | 2026-11-23 | Defer Capacitor and store distribution. Do not adopt Expo/React Native or native code now. | PROPOSED | ADR-001 | Wrap now for store reach | T2 or T3 in ADR-001 |
| D-073 | 2026-11-23 | Schema validation in two layers: JSON Schema at authoring time, executable rules at authoring and run time. No run-time schema library. Zod is not added. | PROPOSED | `ARCHITECTURE.md` section 3 | Zod, or Ajv standalone in the client | Packs fetched from a network (Stage 12) |
| D-074 | 2026-11-23 | Offline-first with the day's pack on the device. Answers are readable by a determined player. Accepted for v1; a server-reveal mode is designed only if a competitive mode is wanted. | PROPOSED | `THREAT_MODEL.md` section 3 | Obfuscation; server reveal; server-verified scores | A leaderboard or competitive mode is requested |
| D-075 | 2026-11-23 | Dependencies: none at runtime. New runtime dependencies need a written case. Matrix is generated from the registry. No auto-merge of updates. | PROPOSED | `OPERATIONS_POLICIES.md` | Ad hoc | n/a |
| D-076 | 2026-11-23 | The CMS stays optional. Authoring remains a structured repository until a non-programmer editor is confirmed. | PROPOSED | `ARCHITECTURE.md` section 9 | Adopt a CMS now | Q-64 answered yes |

## Findings added in Stage 10

| ID | Finding | Evidence |
|---|---|---|
| F-048 | `docs/TRY_IT.md` was wrong for the Node server: `/motion/` and `/reveal/` returned 404. Fixed; regression test added. | `serve.test.js` |
| F-049 | The motion and reveal prototypes do not run `validatePack`, so a `javascript:` source URL would have become a link. Both now accept http(s) only; `validatePack` already rejects other schemes, now tested. | `pack.test.js`, `xss-probe.mjs` |
| F-050 | The repository had no secret patterns in `.gitignore`. Added before writing the secrets policy. | `.gitignore` |
| F-051 | My first injection probe could pass without ever showing the payload. It now records whether the payload appeared and warns if not. The reveal page does not display pack text, so that run proves nothing for it. | `xss-probe.mjs` |
| F-052 | typescript-eslint 8.74.0 (published the day of this audit) declares TypeScript below 6.1.0, while TypeScript 7.0.2 is latest. | `DEPENDENCY_MATRIX.md` |
| F-053 | The Expo/React Native candidate tree needed `--legacy-peer-deps` to resolve, and the Vite + PWA tree shows 4 moderate build-time advisories (workbox-build, glob, minimatch). Neither is a blocker. | `DEPENDENCY_MATRIX.md` audit section |
| F-054 | Pack build is byte-identical across runs and equals the committed file. | Stage 10 run, SHA-256 `1c90cd36…939d0a` |

## Added: Temporal Atlas redesign (2026-11-24)

| ID | Date | Decision | Status | Source / approval | Alternatives | Reversal condition |
|---|---|---|---|---|---|---|
| D-077 | 2026-11-24 | The game UI adopts the user's Temporal Atlas direction (squirrel guide, map-green and paper, Fraunces/Archivo/Source Sans 3). This revises the Stage 6 STRATA look for the game screens only. | PROPOSED, built as a prototype at the user's request | User message with four boards and the art guide | Keep STRATA | User rejects the result |
| D-078 | 2026-11-24 | Rust is darkened to `#A94A28` so cream text passes contrast. | PROPOSED | `ATLAS_REDESIGN.md` | Guide's `#BD5833` with ink text | n/a |
| D-079 | 2026-11-24 | Illustrations are code-drawn SVG stand-ins; production art is to be commissioned or produced under the guide's asset list. | PROPOSED | `art.js` | Raster art now | Art budget decision |
| D-080 | 2026-11-24 | Fonts are self-hosted (OFL) instead of loaded from Google. | PROPOSED | `app/fonts/` | Google Fonts | n/a |
| D-081 | 2026-11-24 | Stage 10 approved. Stage 11 authorised. User direction: real illustrated assets before further UI work; apply the Atlas look to Motion and Reveal; richer backgrounds, textures and photography-like depth; the code-drawn squirrel is rejected as too weak. | **FIXED** | User message | n/a | n/a |
| D-082 | 2026-11-24 | The user's illustrated squirrel (`app/assets/characters/`) is the style lock for all art. It is multiplied onto paper surfaces (its background is paper cream). The code-drawn vector hero is retired from the welcome and home screens because the styles clash; other scenery and poses wait for supplied art (`ASSET_PROMPTS.md`). | PROPOSED | User message with image | Keep vector scenery | n/a |
| D-083 | 2026-11-24 | Every art file needs a rights row (`ASSET_RIGHTS.md`); an empty row blocks release. | PROPOSED | `ASSET_RIGHTS.md` | Ad hoc | n/a |
