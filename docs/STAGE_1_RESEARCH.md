# Stage 1: Product research, player jobs and competitive differentiation

*Date: 2026-11-22. This stage is research and analysis only. No gameplay was implemented. Nothing here comes from TIMEHUNT players, because there are none yet. Player scenarios are illustrative, not research data.*

## 0. How to read the evidence

Every competitor fact carries an evidence level.

| Level | Meaning |
|---|---|
| **A** | I opened the game's own page or ran its page in a browser in this stage |
| **B** | Search-result summary of reputable secondary coverage. Not opened by me. |
| **C** | My own reasoning or arithmetic. Labelled as such. |

Blocked or unread: neal.fun, the FTC dark-patterns page and the OECD dark-patterns page all returned bot-protection errors. I did not use them. I did not play any competitor beyond its first screens, so I have not measured completion times or felt their pacing.

## 1. Competitor matrix

| Game | Core loop | Feedback to the player | Where information comes from | Daily ritual | Learn from it | Do not copy | Evidence |
|---|---|---|---|---|---|---|---|
| [**Globle**](https://globle-game.com/) | Guess countries until you find the day's mystery country, in as few guesses as possible | Each wrong guess is coloured on a globe, hotter means closer. Distance is the minimum distance between land borders ([FAQ](https://globle-game.com/faq)). A colour-blind mode exists. | Every guess is a free probe with graded feedback | One country a day. The country changes and guesses reset at midnight in your time zone. | Hot and cold feedback is readable at a glance. A time-zone reset avoids a global rollover moment. | The idea that more free probing is the fun. On a one-dimensional year line, a distance plus a direction reveals the answer exactly. | A |
| [**Chronophoto**](https://www.chronophoto.app/) | Five rounds. Look at a photo, pick the year it was taken. | A score per photo. Reported as 0 to 1,000 per image, 5,000 per game ([PetaPixel](https://petapixel.com/2023/10/24/chronophoto-game-tests-your-photography-and-history-knowledge)). | The photograph itself. No bought clues. | Daily mode with streaks. Streaks sync across devices if you sign in. A daily email exists. | Fast single-estimate rounds. A year range setting ("at least 10" years). Party mode where a passcode gives everyone the same photos. A timer you can set to Off, Per photo or Whole game. Its [About page](https://www.chronophoto.app/about) admits "Photo dating mistakes happen". | Dating by recognising a photograph is recall and visual intuition, not deduction. | A for the loop and UI text, B for scoring |
| [**TimeGuessr**](https://timeguessr.com/) | Five rounds ("1/5"). Pick the year with arrows and drop a map pin. | A score. A forum thread reports up to 5,000 points for each of the two guesses. I could not confirm the formula. | The photograph | Single player, multiplayer and a Daily mode | Pairing "when" with "where" makes one answer richer. | Photo recognition again. | A for modes and round structure, B or weaker for scoring |
| **Wordle** (NYT) | Six tries at a five-letter word | Per-letter colour feedback on every guess | Combinatorial feedback: each guess says something about five positions | One puzzle a day | Rich feedback is what makes free guessing a deduction game. A one-dimensional number cannot give that. | Free guesses with simple feedback as the whole game | B only. I did not read an official NYT page. |
| [**Return of the Obra Dinn**](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn) | Deduce each crew member's identity and fate from frozen scenes | Fates are confirmed only in sets of three, with a short end-game exception. A fate you entered that was not confirmed is known to be wrong. | Evidence gathered by exploring | None (single-player game) | **Batched confirmation defeats brute force while keeping reasoning rewarding.** It is a direct model for the Lock problem. | Its pacing. It is a long game. | B |
| **The Case of the Golden Idol** | Investigate a scene, collect words, assemble statements about what happened | Two modes, Exploring and Thinking. A hint system exists. | Evidence collected as words, then assembled into claims | None | Evidence as objects you assemble into a claim is the closest relative of a "constraint on time". | Long, dense cases | B |
| [**Baba Is You**](https://en.wikipedia.org/wiki/Baba_Is_You) | Push word blocks to change the rules of each level | The level responds physically to the new rule | The rules themselves are the material | None | The rule is a visible object you can inspect and move. A constraint pinned to a layer in STRATA is the same idea. | Its aesthetic and its puzzle language | B |
| [**The Pudding**](https://pudding.cool/) | Visual essays that explain an idea (homepage lists issues through Nov 2026) | n/a | Data and narrative | None | The post-solve reveal should feel like an essay you steer, not a recap card. | Do not imitate its layouts | A (homepage only) |
| neal.fun | Small playful interactive pages | n/a | n/a | n/a | n/a | n/a | **Not reviewed.** Blocked by bot protection. |

Not reviewed, and I make no claim about them: other history guessing games, NYT Connections, or any game released after my knowledge cutoff.

## 2. Differentiation statement

> **In most daily games the unit of play is a guess. In TIMEHUNT the unit of play is a constraint on time.** You read sourced fragments, work out which years survive, and decide whether a scarce, shared resource is worth spending on more evidence. There are ten cases a day, and one wrong answer never ends the day.

Three things have to be true together for this to hold.

1. Free evidence must carry most of the reasoning (section 4).
2. A wrong Lock must not leak a free search path.
3. The ten dates must reveal something together that no single case could.

Today these are design claims. None has been built or tested.

### The two dismissals, tested honestly

**"It's Globle with dates."** *Mostly no.* Globle gives unlimited free probes with graded feedback, and the score is the number of probes. TIMEHUNT gives no free probes. Evidence comes from sourced text, probes cost a shared resource, and commitment is one Lock per case (provisional). *When it would be true:* if Trace is cheap and the dossier is thin, players will bisect a number line. That is Globle on a ruler, and it is what the old loop did.

**"It's ten quiz questions with a currency."** *Not yet disproved.* Differences: each case is solved by reasoning from provided fragments rather than recall, Insight is shared across cases, and the ten dates form one atlas. *When it would be true:* if dossiers are weak, players google the date, Insight becomes a tax, and the atlas is wallpaper. The "remarkable in the atlas that no single case showed" test in the master prompt (section 10) is therefore the one to watch.

## 3. Why a single year with free earlier/later failed

1. **Free direction makes the best strategy independent of content.** If every guess answers earlier or later, the optimal play is bisection. With G guesses and equality counting as a win, you can *guarantee* up to 2^G − 1 years: 31 years need 5 guesses, 63 years need 6, 201 years need 8 *(arithmetic, level C)*. A solver who knows no history plays the same algorithm on every puzzle.
2. **A near miss costs nothing, so there is no decision.** No resource is at stake on any guess. The only choice is where to cut.
3. **Distance feedback is worse than it looks.** On a line, "direction plus exact distance" gives the answer in one step. Globle's proximity feedback works because countries sit on a sphere, where distance alone does not locate the target.
4. **Evidence had no job.** Clues were optional extras layered over a number game. One of my own earlier clues removed zero candidate years.

## 4. Why a shared resource might work, and the finding that limits it

The case for sharing: scarcity across ten cases creates opportunity cost. The same point of Insight is worth more in some cases than others, so the player has to judge it. That is the long-horizon decision the single-case game lacked.

**The finding (level C, arithmetic):** locating a hidden year in a 200-year range takes about log₂(201) = 7.65 bits of information. Ten such cases need about **76.5 bits**. A Trace answers one yes-or-no question, so at most 1 bit. At a cost of 2 Insight, eight Insight buy at most **4 bits, about 5%** of the total.

Consequences, stated plainly:

- **The free dossiers must supply roughly 95% of the information.** If they do not, ten cases are unplayable without paid help, which breaks the rule that no case may require purchase.
- **Insight is a small lever unless clues are much stronger than Trace per point.** A clue that leaves 7 of 31 years is worth about 2.15 bits. Clue strength per Insight, not Trace, will decide whether allocation matters.
- **The strategy is mostly in dossier design.** Cases should leave different numbers of candidates (for example 2 in one, 6 in another) so that spending is a real judgement.

This changes the Stage 2 job. It is not "tune Insight prices". It is "decide how much uncertainty each case leaves, and make the bank decide a few close cases."

## 5. Where ten cases could exhaust the player

| Point | Why |
|---|---|
| Reading load | Ten dossiers of about three fragments is about thirty pieces of evidence before any reveal. |
| Decision fatigue | Every case asks for a reasoning step plus a spending step. |
| Starvation | When the bank hits 0 early, remaining cases feel like Lock-only guesses. |
| Early greed | A player who spends freely in cases 1 to 3 has nothing for case 9. |
| Difficulty spikes | One unfair case damages trust for the whole day. |
| Animation repetition | An elaborate camera move is charming once and tiresome ten times. |
| Time | Session length is unmeasured. The revision document assumes 6 to 12 minutes. That is an assumption. |

## 6. Player types and scenarios

Three player types and two accessibility contexts. **All are illustrative personas, not research findings.**

### P1: History novice (Mina)
*Plays Wordle and Connections. Does not know dates. Wants to feel clever, not quizzed.*
She opens the day and moves a marker within seconds. In case 1 the free dossier says the target comes after an event and before another, and she gets it from the fragments alone. By case 3 she notices Insight and holds it. In case 5 she has two candidate years and no way to tell them apart, so she guesses and misses. The miss screen shows the fragment she did not use. She buys her first clue in case 7, solves it, and finishes with 7 of 10 and 3 Insight unspent. She comes back tomorrow because case 4 surprised her, not because of a streak.
**Break points:** case 1 does not teach what to do. A dossier needs a date she cannot know. A miss is unexplained.

### P2: Casual daily puzzler (Dev)
*Five minutes on the train. Plays several daily games. Wants closure. Skips long text.*
He plays four cases and the train arrives. The game saves. He resumes at lunch. He skips the reveal each day but opens "my ten dates" for a few seconds. He treats Insight as a score and spends it all by case 5 if that is allowed.
**Break points:** ten cases feel long. Pause and resume loses state. The reveal blocks the result screen. Spending everything early ends his interest by case 6.

### P3: History enthusiast (Irina)
*Teaches history. Knows many dates. Distrusts "fun facts".*
She solves six cases from memory and never spends Insight. She notices a clue that counts "by 31 December" while she read it as "by 1 January". She checks the source note and, convinced, trusts the game. She finds the Stonewall dossier careful about language. She wants the reveal to show where each claim comes from.
**Break points:** an ambiguous dating rule. A source that says only "NASA". A reveal that is shallow. Cases solved by recall alone make the game trivial for her.

### A1: Low vision with a screen reader and large text (Samir)
*Uses VoiceOver or TalkBack and 200% text.*
He needs the timeline as a list or a stepper, not a drag. Each state change must be announced once: "Possible years 1969 to 1975, 7 years." He must reach Evidence, Trace and Lock in a sensible order. Texture and colour cannot carry meaning.
**Break points:** a drag-only timeline. Constant live-region chatter. Evidence text clipped at large sizes. Hatch versus stipple being the only difference between "ruled out by guess" and "by evidence".

### A2: One-handed, limited precision, reduced motion (Lena)
*Holds the phone with one hand on a train. Tremor. Motion sickness with large camera moves.*
She needs large targets, a typed year or stepper as an alternative to dragging, a "Fit range" control, and reduced-motion mode with no loss of information.
**Break points:** a 31 px stepper. A zoom that needs a pinch. A cinematic reveal she cannot skip.

## 7. Why a wrong answer is still interesting

A miss is not automatically interesting. It becomes interesting through design.

1. **It is the moment of peak attention.** The player has just committed to a hypothesis.
2. **The explanation can be specific.** Show which fragment, used or ignored, would have excluded the chosen year. This works only if each dossier is authored so that a wrong plausible year has a visible reason. That is an editorial requirement.
3. **The miss costs only that case.** The day continues. Obra Dinn never punishes a wrong entry, only withholds confirmation.
4. **A wrong Lock is one bit.** It removes that year. Disclose it plainly.
5. **The correct year still opens its world.** The case's reveal is not a prize for winning.

**Risks:** a patronising explanation, a miss that reveals the answer so completely that the case feels pointless, or a dossier where the wrong year has no discoverable reason. *Test:* after a miss, can the player say why they were wrong, and do they continue? (Hypothesis H5.)

## 8. Onboarding, information gain, daily ritual, ethical replay, break points

**Onboarding.** The first interaction should be moving the year marker within about 15 seconds. Introduce the three actions in one practice case, not a rules screen. Introduce the shared bank in case 2 and show the cost of any action before it is taken. *Unmeasured.*

**Information gain.** Report what a clue did after it is bought, with numbers ("104 to 27 possible years"). Before purchase, never show where it cuts. Keep the tutorial arithmetic honest: a clue that removes nothing is free context.

**Daily ritual.** Observed in competitors: one shared puzzle, a fixed daily reset, a short session, a shareable result, streaks (Chronophoto). For TIMEHUNT the ritual should be "I did today's expedition", not "I must not break my streak". Globle resets at local midnight, which avoids a single global moment. Whether TIMEHUNT needs any streak at all is open (Q-23 in `OPEN_QUESTIONS.md`; the reset convention is Q-09).

**Ethical replayability.** Allowed: practice cases, an archive, a spoiler-free share card, pause and resume. Not allowed: paid Insight or hints, streak repair, energy timers, urgency banners. The [FTC](https://www.ftc.gov/system/files/ftc_gov/pdf/P214800%20Dark%20Patterns%20Report%209.14.2022%20-%20FINAL.pdf) describes dark patterns as "design practices that trick or manipulate users into making choices they would not otherwise have made" (level B, via search summary; I could not read the page). A streak that punishes absence would be a design pressure of exactly this kind and should be tested before it is added.

**Break points** (where a player is most likely to stop): the first case, the first case that feels unfair, a miss with no reason, the moment the bank is empty, the middle of the ten, and the reveal if it cannot be skipped.

## 9. Six falsifiable product hypotheses

All thresholds are provisional starting points, not standards. Each says how it would be proved wrong.

| # | Hypothesis | How to test | Falsified if | Earliest stage |
|---|---|---|---|---|
| H1 | After one practice case, most new players can say what Evidence, Trace and Lock do and cost. | 8 to 12 new players, no help, then ask | Fewer than 60% can | 5 |
| H2 | A history novice can solve many cases from the free dossier alone, without looking anything up. | Novices play a pack with no paid help and no lookup | Novices solve fewer than 30% of cases dossier-only, or solving tracks prior knowledge more than reasoning | 5 |
| H3 | Where to spend Insight matters: a good allocation beats a naive one. | Bots with several policies on a real pack, then humans | A greedy early-spending policy is within 0.3 solved cases of the best policy, or almost all players choose the same allocation | 2, 5 |
| H4 | Trace is not dominant: a policy that also buys Evidence solves clearly more cases than Trace-only. | Exact bounds and bot simulation on the real pack | Trace-only is within 5 percentage points | 2 |
| H5 | A missed case does not end engagement, and the player can say why they missed. | Observe the case after a miss | Fewer than 50% continue, or fewer than half can name a reason | 5 |
| H6 | Ten cases are finishable in a normal sitting. | Compare with a six-case control. Measure completion and time. | Under 50% finish, or median time is over 15 minutes | 5 |

Two further hypotheses would be worth adding later: that the World Reveal is opened voluntarily by most players, and that a streak is not required for return.

## 10. Top ten retention risks, ranked

Rank is my judgement and untested.

| # | Risk | Mitigation to test |
|---|---|---|
| 1 | **Dossier quality.** If free evidence is weak, ten cases are unplayable or become lookups. | Author and test ten real cases with novices before any art. |
| 2 | **Starvation.** An empty bank makes late cases hopeless. | Ensure every case is playable with zero Insight. Show the bank honestly. |
| 3 | **Session length.** Ten cases may exceed attention. | Pause and resume, six-case control, measure drop-off by case. |
| 4 | **Content supply.** 10 cases a day is **3,650 a year**. | Editorial pipeline, reusable packs, a smaller launch cadence if needed. |
| 5 | **Trace or Lock exploits.** Score farming or cheap bits. | Bot players that maximise score. Never reward unused Locks. |
| 6 | **Trust.** A disputed date or dating convention damages credibility. | End-of-year default stated on every clue. Claim-level sources. Editorial verification. |
| 7 | **A miss feels unfair or unexplained.** | Author the reason a plausible wrong year fails. |
| 8 | **Reading and legibility load** on small screens and at large text. | 320 px test, large-text test, strict text budgets for dossiers. |
| 9 | **Motion fatigue.** | Short, skippable, reduced-motion twin. Test repetition across ten cases. |
| 10 | **Ritual pressure or no ritual.** Streak anxiety on one side, no reason to return on the other. | Offer progress without punishment. Test whether players return without a streak. |

Also watch: shared-result spoilers, offline answer leakage, and a Western skew in the first packs.

## 11. Self-critique of Stage 1

| Lens | Rating (subjective) | Evidence |
|---|---|---|
| Gameplay integrity | 6/10 | The bit-budget finding is solid arithmetic. No bot or player evidence yet. |
| Behavioral pleasure | 4/10 | Almost entirely hypothesis. No one has played the Daily Ten. |
| Historical credibility | n/a | No historical claims made beyond competitor facts. |
| Cultural range | n/a | Not yet in scope. |
| Accessibility | 5/10 | Two contexts analysed in prose. Nothing tested. |
| Technical health | n/a | No code. |

**Three weakest points.**
1. Competitor review is shallow. I read start screens, FAQs and secondary coverage. I did not play a full session of anything.
2. Scoring for Chronophoto and TimeGuessr is from secondary sources. Wordle was not read from an official page.
3. Personas are invented. They help me think but prove nothing about real players.

## 12. Verdict on the Stage 1 pass criterion

*"TIMEHUNT cannot accurately be dismissed as 'Globle with dates' or 'ten quiz questions with currency'."*

**Result: PARTLY MET.** It cannot be dismissed as Globle with dates as long as probes stay costly and evidence stays central. It *can* be fairly called "ten quiz questions with currency" if the dossiers are weak. That is the project's central risk, and it is a content problem, not a rules problem.
