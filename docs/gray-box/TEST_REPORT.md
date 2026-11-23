# Stage 4 test report

Run: 2026-11-23, Node v22.23.5, `cd app && npm test`. Result: **70 passed, 0 failed**, about 3 seconds. The browser run `node scripts/record-video.mjs` passed **26 of 26** assertions (`e2e-report.json`).

## What the tests prove, and what they do not

| Brief requirement | Evidence |
|---|---|
| Budget never refills | `fuzz (*)`: bank conservation `insight + sum(spent) = initial` after every one of 216,000 random commands in six rule variants; `a finished day stays finished after reload`; browser check `reload after finishing: still finished, no refill` |
| Never double-charges | `a repeated actionId is idempotent`; `crash AFTER the write`; `already revealed is refused`; browser case 7 |
| Never below zero | `insufficient Insight is refused`; fuzz invariant `insight >= 0`; browser case 10 disabled clues |
| No failure ends the expedition | `a missed case never ends the day` (5 misses, still completes); browser miss on case 5 then case 6 opens |
| No stale state after refresh | `reload at every point of a full day` (reload after every purchase, lock and advance) equals the straight-through digest; browser reloads after a miss, after a purchase, after finishing |
| Reload mid-purchase | `crash BEFORE the write` (no charge, no reveal, retry charges once) and `crash AFTER the write` (charged once, same action id ignored). Browser: both crashes injected through the Test tools, then page reload |
| Spend the last token | `scripted day` and browser case 9 (0 Insight), case 10 purchase refused |
| Finish with zero Insight | `scripted day`, browser header `9 of 10 solved. 0 Insight left.` |
| Deterministic replay | `replay of the accepted command log reproduces the exact state`; fuzz replays every session; three fixtures replay to a recorded digest |
| Seed reproducibility | `seed reproducibility`: same seed same digest and log, different seed different |
| No-Trace run | `no-Trace run`: default rules reject Trace; the scripted day is identical with Trace on but unused |
| Fail-safe for invalid packs | 18 mutation tests plus `garbage input never throws`; browser shows a message and starts nothing; `invalid pack: nothing saved` |
| No leakage through the view | `publicView leaks nothing`; `pre-purchase clue metadata is only tier, cost and category` |
| BCE and CE | `year labels never show a year zero`; `case 9 compiles` |

## Do the tests bite? Mutation check
Five deliberate bugs were put into `engine.js` one at a time. Each was caught, then the file was restored byte for byte (`cmp` clean).

| Bug | Tests failing |
|---|---|
| Insight check loosened by one | 8 |
| Redundant clues always charged | 1 |
| Duplicate-action protection removed | 8 |
| Ruled-out years lockable | 2 |
| A free Insight appears on case 4 | 7 |

## Limits of this evidence
- The browser run is headless Chromium at 390 x 844. It is not a real phone. No VoiceOver, TalkBack, text enlargement or low-end device check was done.
- Fuzz and bots are random. They test the rules machine, not whether the game is fun or fair (Stage 5).
- Persistence is browser local storage with a single write per command. "Reload mid-purchase" means a crash before or after that write; there is no in-flight half-state to reload into.
- Two Locks, the Daily Trail, case-4 and case-7 connections, daily reset by clock, share-card copying, and the practice picker UI are not built.

## Raw output
```
✔ all ten cases compile with 3 to 6 candidates and the target inside
✔ a new expedition: 8 Insight, case 1 active, later cases closed with no candidates
✔ revealing a clue charges its tier price, narrows candidates and keeps the target
✔ refund on redundant: a clue that removes nothing now costs 0
✔ refundRedundant=false charges for a redundant clue (switch isolated)
✔ a refused action changes nothing and returns the same state object
✔ already revealed is refused without a second charge
✔ a repeated actionId is idempotent: no double charge, no error
✔ insufficient Insight is refused, never negative
✔ lock: correct with no spending is solved_clean; with spending is solved_assisted; wrong is missed and reveals
✔ a ruled-out year cannot be locked, and a second lock is refused
✔ a missed case never ends the day: the next case opens and play continues to case 10 and completion
✔ after completion no command is accepted and Insight does not refill
✔ the 8-Insight bank is shared across cases and never refills between them
✔ Trace is off in the C1 default and works as a switch: earlier, later, same, uninformative, price
✔ per-case Insight cap of 1 (D-017 switch) refuses a Deep clue and a second Nudge
✔ relationTier=deep hides the relation from free evidence and sells it as a Deep clue that resolves the case
✔ publicView leaks nothing: no target, no unrevealed clue text, no resolution before the case is resolved
✔ pre-purchase clue metadata is only tier, cost and category: no strength or overlap hints
✔ transition never mutates its inputs
✔ replay of the accepted command log reproduces the exact state
✔ cluesFor lists exactly the paid clues in the default rules and adds the relation only in deep tier
✔ score: solved cases lead; Insight left is shown but cannot make 0 solves beat 10
✔ fixture scenario-deep-relation-seeded.json: replay reproduces the recorded state byte for byte
✔ fixture scenario-full-day.json: replay reproduces the recorded state byte for byte
✔ fixture scenario-no-trace-seeded.json: replay reproduces the recorded state byte for byte
✔ the draft pack is refused as a daily unless allowDraft is set (fail-safe)
✔ invalid pack refused: nine cases -> CASE_COUNT
✔ invalid pack refused: wrong convention -> CONVENTION
✔ invalid pack refused: target outside corridor -> TARGET
✔ invalid pack refused: bad corridor -> CORRIDOR
✔ invalid pack refused: target removed by a free bound -> TARGET_NOT_IN_C0
✔ invalid pack refused: free bounds leave one candidate -> C0_SIZE
✔ invalid pack refused: paid clue cuts nothing -> CLUE_CUTS_NOTHING
✔ invalid pack refused: paid clue removes the target -> CLUE_REMOVES_TARGET
✔ invalid pack refused: invalid predicate -> PREDICATE
✔ invalid pack refused: unknown tier -> TIER
✔ invalid pack refused: free text prints the target year -> LEAK_FREE
✔ invalid pack refused: title prints the target year -> LEAK_TITLE
✔ invalid pack refused: unknown source id -> SOURCE_REF
✔ invalid pack refused: duplicate case id -> CASE_DUP
✔ invalid pack refused: wrong order -> ORDER
✔ invalid pack refused: relation selects the wrong year -> RELATION_TARGET
✔ invalid pack refused: editorial c0 disagrees with the machine -> C0_MISMATCH
✔ invalid pack refused: source without a url -> SOURCE_URL
✔ invalid pack refused: clue without text -> CLUE_TEXT
✔ garbage input never throws and is refused
✔ validation is deterministic: same pack, same digest; any content change changes it
✔ year labels never show a year zero and handle BCE
✔ case 9 (BCE/CE) compiles: six candidate years across the missing year zero
✔ the app copy of the pack equals the editorial pack in docs/pack (no second source of truth)
✔ fuzz (c1): 300 random sessions keep every invariant
✔ fuzz (noRefund): 300 random sessions keep every invariant
✔ fuzz (cap1): 300 random sessions keep every invariant
✔ fuzz (trace): 300 random sessions keep every invariant
✔ fuzz (relDeep): 300 random sessions keep every invariant
✔ fuzz (small): 300 random sessions keep every invariant
✔ seed reproducibility: same seed gives the same day, different seeds give different days
✔ bot days under every variant end completed with a legal score
✔ scripted day: case 1 to 10, a miss on 5, payments on 2 and 7, last token spent on 9, finishes with zero Insight
✔ no-Trace run: the default rules never accept a Trace, and the scripted day is identical with Trace switched on but unused
✔ fresh start, purchase, reload: the charge survives and is applied once
✔ crash BEFORE the write: nothing charged, nothing revealed, reload agrees, retry charges once
✔ crash AFTER the write: the purchase is kept exactly once, and the retry with the same action id is ignored
✔ reload at every point of a full day always yields the same final state as playing straight through
✔ a finished day stays finished after reload: no refill, no new expedition
✔ corrupt JSON, tampered state and unknown schema are held, not overwritten, and never crash
✔ content or rules changed mid-day: saved progress is not silently loaded or lost
✔ storage that throws on read (private mode) still starts a playable expedition
✔ practice mode uses its own record and bank and never touches the daily
ℹ tests 70
ℹ suites 0
ℹ pass 70
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2781.535803
```
