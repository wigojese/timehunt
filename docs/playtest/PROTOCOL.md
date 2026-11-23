# Formative playtest protocol, Daily Ten gray-box

**Status: a plan. No session has been run. Every result in this folder marked NOT TESTED is empty on purpose.** The agent cannot recruit or observe people. Simulations are in `SIMULATION_FINDINGS.md` and are labelled as simulations.

## 1. Questions this test must answer
1. **Comprehension.** Do novices understand Insight (shared, never refills), Evidence versus Lock, and the end-of-year convention without being told by the facilitator?
2. **Free dossier.** Do the free clues actually let people solve a case? (Simulation says a text parser solves 9.2 of 10; people are not parsers.)
3. **Insight relevance.** When the free evidence is enough, does Insight feel pointless (condition A), and does selling the key link (condition B) fix that or feel unfair?
4. **Load.** Are ten cases in a row overwhelming? Where do people stop or slow down?
5. **Fairness and satisfaction.** Do misses feel fair? Do people want to come back?
6. **Trace.** Is a "higher or lower" tool missed? (It is not in the game; we ask, we do not show it.)
7. **Beginner support.** Where do first-time players stall, and what do they ask for?

## 2. Participants
| Group | Count | Who |
|---|---:|---|
| Novice, history-familiar | 4 to 6 | Reads, watches or listens to history at least weekly; has never seen this game |
| Novice, history-unfamiliar | 4 to 6 | History is not a regular interest |
| Daily-puzzle enthusiast | 3 | Plays at least one daily puzzle (Wordle, Connections, GeoGuessr, TimeGuessr or similar) five days a week |

Adults only (18+). No colleagues, no one who has seen a prototype. Spread by age and device ownership as far as recruitment allows. With about 11 people this is **formative and qualitative**. Counts are reported as counts. No significance tests, no percentages beyond "n of N".

## 3. Conditions
Between-subjects, alternating by order of arrival (P01 A, P02 B, P03 A ...). Same ten cases, same order, same draft pack, one session per person.

| Condition | URL | Difference |
|---|---|---|
| A | `?study=P01&cond=A` | Relation clue visible as reading (the Stage 3 pack as drafted). Insight buys Nudge and Deep clues. |
| B | `?study=P02&cond=B` | Relation hidden and sold as a Deep clue called "Key link" (2 Insight). |

After the session each person sees the other condition for one case, read-only, for a preference question. This is the only within-person comparison.

## 4. Session (about 50 minutes)
| Min | Step | Material |
|---:|---|---|
| 0 to 5 | Welcome, consent, recording choice | `CONSENT_SCRIPT.md` |
| 5 to 8 | Pre-questions (history habit, puzzle habit, device) | `TASK_SHEETS.md` part A |
| 8 to 10 | Think-aloud warm-up on a neutral web page | part B |
| 10 to 15 | First screen: "tell me what you think this game is" (no instruction given) | part C |
| 15 to 40 | Play the day on the participant's own phone or a lent phone, thinking aloud | part D |
| 40 to 48 | Comprehension quiz, fairness and satisfaction scales, interview | parts E, F |
| 48 to 50 | Trace concept probe, other-condition glance, thanks | part G |

The facilitator does not explain rules. If a participant is stuck for 60 seconds, the facilitator uses the prompt ladder in part D and records the step used. A prompt is a finding.

## 5. Instrument
- **Gray-box study mode** records a local timestamped log: views, year selections, clue purchases, locks (with correctness), refusals, reloads. No network, no names. The participant code is the only identifier.
- **Download the log** with the "Download study log" button at the end. Then clear site data before the next participant.
- **Summarise** with `node app/scripts/summarise-study.mjs timehunt-study-P01.json ... > summary.csv`.
- **Observation sheet** (`OBSERVATION_TEMPLATE.md` and `.csv`) for what the log cannot see: confusion, quotes, facial and verbal reactions.

## 6. Measures
| Measure | How |
|---|---|
| Comprehension | Six quiz items scored right, partly, wrong; plus "what is this game" in the participant's words |
| Solved at zero Insight | Log: correct locks with no purchase on that case |
| Insight left at the end, and where it was spent | Log |
| Time per case; pauses over 30 s; stops | Log and observer |
| Perceived fairness, satisfaction, overwhelm, return intent | 1 to 5 scales, parts E and F |
| Desired next action | Open question, coded afterwards |
| Prompts needed | Facilitator tally |

## 7. Decision rules (written before any data)
These are decision aids for a small formative test, not statistical tests. Thresholds are mine and can be changed by you before the first session. They cannot be changed after.

| ID | Observation | If true | If false |
|---|---|---|---|
| H1 | At least 8 of 11 can say in their own words that Insight is shared and does not come back | Keep the Insight explanation as is | Add a first-run guided case and a persistent bank explainer |
| H2 | At least 7 of 11 rate misses 4 or 5 on "fair", and none quits after a miss | Keep miss-and-continue as is | Strengthen the miss explanation screen; revisit reveal wording |
| H3 | In condition A, at least 4 of 5 or 6 novices solve 6 or more cases with 0 Insight | The free dossier suffices | Free evidence is too hard: add clues to the free set, not to the paid menu |
| H4 | In condition A, median Insight left at the end is 5 or more | Insight is idle: adopt condition B or weaken the free relation (Q-32) | Insight is already used: keep A |
| H5 | In condition B, at least 4 of 5 or 6 spend 6 or more Insight and at most 1 calls it unfair | Adopt B | Keep A, rework clue prices |
| H6 | At least 9 of 11 finish all ten cases in one sitting, and median seconds on case 10 is no more than 1.5 times that of case 3 | Ten cases are not overwhelming | Cut to a shorter daily or add a rest point |
| H7 | At least 4 of 11 ask unprompted for a higher-or-lower tool, **and** at least 3 of them say they would spend Insight on it | Bring Trace back into the Daily at price 2 and re-run Stage 2 with real clue sets | Keep Trace out of the Daily (Practice or advanced only) |
| H8 | Fewer than 3 prompts per participant on average | Onboarding is adequate for this audience | Build first-run guidance before Stage 6 |
| H9 | Enthusiasts and novices differ by 2 or more points on median fairness or satisfaction | Report as a segment difference and design for the weaker segment | Treat as one audience |

## 8. Ethics and data
- Voluntary; can stop at any time with no reason; adults only; no sensitive personal data; no health or personality inference.
- Screen and voice recording only with explicit yes. Default is notes only.
- Data kept: participant code, logs, notes, scale scores. Names and contact details are kept in a separate sheet by the person who recruited, deleted after the incentive is paid or after 30 days.
- Stored only on the project owner's machine or drive. Not sent to third parties. Not used to train anything.
- Incentive: to be decided by you (Q-42). It must not depend on how well anyone plays.
- Content note: case 4 is about a queer-history institution and case 6 is about smallpox. Tell participants before play and let them skip a case. A skipped case is recorded as skipped.

## 9. Who does what
| Role | Task | Who |
|---|---|---|
| Recruiter | Find and schedule | You or someone you name (Q-40) |
| Facilitator | Run the session without leading | A person. A non-expert is fine; follow the script |
| Note-taker | Fill the observation sheet | A second person if possible |
| Agent | Prepare material, summarise logs you provide, write the findings with every claim tied to a file | Me |

## 10. What would invalidate the test
A facilitator who explains rules; a participant who has seen the game; a draft pack with an error found mid-test (note it, do not fix between sessions); fewer than 6 complete sessions (report as a pilot only).
