# Stage 4: working Daily Ten gray-box

Status: complete, awaiting `APPROVE STAGE 4`. Nothing from Stage 5 has been started.

Run instructions: `app/README.md`. Test report: `docs/gray-box/TEST_REPORT.md`. Video: `docs/gray-box/graybox-run.webm` (real Chromium, mobile viewport, 2 MB). Screenshots: `docs/gray-box/graybox-*.png`.

## What was built
A ten-case game that plays from case 1 to the end screen, with the C1 rules from Stage 2 (one Lock, no Trace in the Daily, Nudge 1 and Deep 2, refund on redundant, 8 shared Insight that never refill), the Stage 3 draft pack as content, source display, a plain year selector, a score line and a spoiler-free share text. It resumes from browser storage. A Practice mode plays one seeded case with 2 Insight and its own save.

| Layer (per `TIMEHUNT_MASTER_PROMPT.md` 8.2) | Where | Notes |
|---|---|---|
| Pure game engine | `app/src/engine/engine.js` | Commands REVEAL, TRACE, LOCK, ADVANCE. `transition()` is pure and returns the same state object on refusal. Candidate sets, not ranges. |
| Canonical rules | `app/src/engine/rules.js` | One module. All prices and switches live here, not in content. |
| Editorial content and validation | `app/src/engine/pack.js` | `validatePack()` re-checks the Stage 3 rules at load. A bad pack returns errors and no content. |
| Application controller and persistence | `app/src/store/session.js` | One record per command, written once. |
| UI | `app/src/ui/main.js`, `index.html` | Semantic controls only. No STRATA styling. |

## Decisions I made (all recorded in `DECISIONS.md`)
- **Stack:** dependency-free JavaScript modules, `node:test`, no framework. This does not choose the product stack. Stage 10 still decides between Expo, a PWA and native, after checking current documentation. The engine has no DOM or storage import, so it moves to TypeScript or React Native unchanged apart from types.
- **Q-32 to Q-35 were not answered at the gate.** I built with the Stage 3 pack as it stands (relation clue visible as reading) and made the alternative a switch: `?variant=deep` hides the relation and sells it as a Deep clue. Both can be tested in Stage 5.
- **Transactions:** compute the next state, write one record, only then adopt it. If the write throws, re-read the store and adopt whatever is there. Every command carries an `actionId`; a repeat is ignored, not refused, so a double tap cannot charge twice.
- **Held records:** corrupt, tampered, other-version, changed-pack or changed-rules saves are never loaded or overwritten. The player is told, and may explicitly start again; the old record is kept under a `.previous` key.
- **View as a security boundary:** `publicView()` is the only thing the UI reads. It omits the target and the text of unrevealed clues. This prevents accidental leaks in the UI. It does not stop someone reading the pack file (8.5 trade-off, unchanged).

## Demonstration of the brief's required run
Recorded and asserted in `scripts/record-video.mjs`: case 1 to 10; Deep clue paid on case 2 and Nudge on case 7; a miss on case 5 and the day continues; reload after the miss; crash before a save (message "Could not save. Nothing was charged.", reload, retry charges once); crash after a save (kept once); the last Insight spent on case 9; case 10 with clue buttons disabled; finish with 9 of 10 solved and 0 Insight; reload after finishing shows the same result; an invalid pack is refused and nothing is saved; a Trace variant exists and the default has none.

## What the random-player numbers say (not a balance result)
2,000 seeded random players per row, picking a random surviving year after buying a random subset of clues. Pure chance with no clues is 2.57 solved of 10.

| Rules | Buys no clue | Buys each clue with p = 0.5 | Buys every clue it can |
|---|---|---|---|
| C1 default | 2.55 solved, 8.0 Insight left | 3.83, 1.1 left | 3.98, 0 left |
| Relation as Deep clue | 2.55, 8.0 | 4.56, 0.7 | 4.61, 0 |
| Per-case cap of 1 | 2.55, 8.0 | 3.09, 3.8 | 3.51, 0 |

These players do not read the evidence. A player who reads the free relation solves every case with no Insight (Stage 3, F-013). The table only shows the machine behaves as the Stage 2 model predicted: clues help, the cap spreads Insight, and nothing can go below zero.

## What this stage did not do
Real phones, screen readers and text scaling; human play of any kind (Stage 5); two Locks; Trace in the Daily; the Daily Trail and the case-4 and case-7 connections; the daily reset clock and timezone rule (Q-09); sharing beyond showing text; the practice picker UI; internationalisation; any STRATA styling or motion.

## Defects and rough edges found
- The first draft of the Trace test asserted on events after a refusal. Test bug, fixed.
- The scripted bot did not buy the relation clue in the Deep variant, which made two table rows identical. Fixed and numbers regenerated.
- In the browser, a refused purchase is mostly prevented by disabling the button. The refusal path itself (`INSUFFICIENT_INSIGHT`, `ALREADY_REVEALED`, duplicate action) is proven by engine and session tests, not by a visible click in the video.
- The year selector lists the whole corridor and greys out ruled-out years. That shows the candidate set before the player has read anything. Whether it spoils the deduction is a Stage 5 question (Q-38).
