# Risk-ranked backlog after Stage 5

Risk = how badly the problem could sink the product x how likely it is real. **Evidence** says what the claim rests on: SIM (simulation or static analysis, this stage), TEST (automated test), NONE (no evidence yet).

| # | Risk | Item | Evidence | Next step | Stage |
|---:|---|---|---|---|---|
| 1 | High | No human has played. Every statement about comprehension, fairness, fatigue and fun is untested | NONE | Run `PROTOCOL.md` (Q-40) | 5 follow-up |
| 2 | High | With the relation visible, reading beats spending (9.2 vs 4.87). Insight is idle for readers | SIM | Test A vs B; decide Q-32 | 5 follow-up |
| 3 | High | The pack cannot ship: 0 of 10 cases publishable, 2 of 10 answers at V2 | TEST (lint, audits) | Open blocked sources or widen allowlist (Q-33) | 3 follow-up |
| 4 | High | Nested clue pairs make buying order matter in cases 1, 2, 6 | SIM | Rewrite the ladders; keep lint rule L9 (D-033) | 3 follow-up |
| 5 | Med | A first-run player gets no guidance. Nothing explains Insight, the end-of-year rule or the refund | NONE | Build a guided first case; test H1 and H8 | 6 or 7 |
| 6 | Med | Pattern leaks: seven relations are "one year after" (plus-one habit scores 7.2); the answer is never the first candidate | SIM | Vary offsets and position; add cases | 3 follow-up |
| 7 | Med | Case 3's relation needs a cross-reference the parser cannot make. Humans may find it hard | SIM | Watch it in the test | 5 |
| 8 | Med | Ruled-out years are visible in the selector. Hiding them makes refused Locks leak (Q-38) | Reasoning | Decide: keep visible, or ruled-out Lock counts as a miss | 5 follow-up |
| 9 | Med | Everyday-life case missing; modern skew; Western anchors 57% | TEST (audit) | Replace case 1 or 10 (Q-34) | 3 follow-up |
| 10 | Med | Case 4 needs a named sensitivity review the agent cannot supply (Q-36) | NONE | A person | 3 follow-up |
| 11 | Med | Daily reset and timezone rule not built (Q-09) | NONE | Decide | 10 |
| 12 | Med | Cases 6 and 10 share an answer (1977); a remembered answer is a hint (Q-35) | TEST (lint) | Decide | 3 follow-up |
| 13 | Low | Saved-state digest is not tamper-proof | TEST | Accept for casual play, or sign packs and state (8.5) | 10 |
| 14 | Low | Accessibility only tested in desktop Chromium at phone size | NONE | Device QA with screen readers and text scaling | 11 or later |
| 15 | Low | Share card is text only; no Trail, no connections yet | n/a | Build later | 8 or 9 |

## Decision on the Lock, Trace and cost candidates (provisional)
Based on the Stage 2 exact solver and the Stage 5 simulations. **No player evidence.** Each line says what would change it.

| Candidate | Decision for now | Because | Changes if |
|---|---|---|---|
| One Lock per case (C1) | **Keep** | Two Locks add about 3.5 solved cases mostly by guessing (F-008); one Lock has clean failure | Players find a single Lock too harsh (H2 false) |
| Trace in the Daily | **Drop from the Daily; keep as Practice or advanced** | At price 2 it adds nothing over no Trace (F-007); with free evidence this strong a higher-or-lower tool is redundant | H7 true |
| Nudge 1 / Deep 2 | **Keep, but fix the ladders** | Prices are fine; the order exploit is an authoring problem (backlog 4) | Players cannot tell Nudge from Deep |
| Refund on redundant | **Keep** | No Insight lost to a clue that taught nothing; optimum never needs it (SIM) | Players game it, or find it confusing |
| 8 shared Insight | **Keep as a test value** | Optimal spending is front-loaded, but players do not play optimally; cap-of-1 spreads it at a cost of 1.2 solves | H4 and H5 |
| Relation visible (A) or Deep clue (B) | **Undecided** | A is friendlier, B makes Insight matter | H4 and H5 |
