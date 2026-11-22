# TIMEHUNT: THE DAILY TEN
## A critical response to the Convergence prototype and a proposed shared-Insight redesign

**Status:** Design recommendation for review, **not** an approved or playtested game economy  
**Date:** 23 November 2026  
**Basis:** The attached `convergence.html` gray-box prototype; the supplied screenshot and developer's testing notes; the earlier Convergence gameplay proposal.  
**Audience:** Product/game designer, AI coding agent, historian/content editor, UX/motion designer.

---

## 1. Executive decision

**I recommend changing TIMEHUNT from one mystery year per day to one daily expedition containing ten historical date mysteries, with a single shared reserve of eight Insight points.**

This is a meaningful gameplay redesign, not a numerical configuration change. It introduces the missing strategic question: **Which mystery deserves my scarce investigative resources?** A player can solve an early case quickly by spending a clue, but doing so changes their options for the next nine cases. The optimal choice varies from day to day and from player to player.

However, **do not run the existing 31-year puzzle ten times with a shared bank of eight Insight.** On the current rules that would mostly produce frustration, random locks, and questions that are inaccessible without existing date knowledge. Every case must become a fair, compact mystery with a useful free starting dossier. The eight tokens should be **optional investigative assistance**, not a charge for access to the facts needed to play.

### What stays; what changes

| Component | Existing gray-box | Recommended Daily Ten |
|---|---|---|
| Daily challenge | One hidden year | **Ten distinct historical date mysteries** |
| Insight | Refills for each puzzle | **Eight shared points for all ten cases** |
| Evidence | Mostly purchased | **Basic free evidence; optional paid investigative assistance** |
| Trace | Repeatable paid earlier/later | **Expensive optional diagnostic, not the dominant strategy** |
| Lock | Two attempts, shared within one puzzle | **One commitment per case as default; evaluate a second-chance variant** |
| Failure | End the single hunt | **Reveal that case, record its outcome, advance—never end the whole day** |
| Cross-case effects | None | **Optional historically grounded connections that help later cases** |
| Result | One year, one score | **Ten-year timeline, mystery-by-mystery performance and World Reveal** |
| Session | A few minutes | **Roughly 6–12 minutes in total, resumable at any point** |

**One-line pitch:** *Ten hidden moments. Eight chances to ask for help. How much of history can you uncover?*

---

## 2. Why your idea is better

A single mystery can collapse into repetitive binary search. A ten-case sequence makes the player's **allocation decisions** part of the challenge.

Imagine the day begins with a relatively approachable twentieth-century case, then presents a harder ancient-history case, then one about social history, then a case involving a strange invention. Do you spend two of your eight Insight points on the first case to secure a quick win? Or trust your inference and save those points for the unfamiliar cases ahead?

This creates three separate pleasures:

1. **Local deduction:** Can I solve the current case from evidence?
2. **Long-horizon strategy:** Is buying help here worth giving up future options?
3. **Cumulative discovery:** What did these ten historical moments have in common, and what do they reveal when placed together?

The desired feeling is not a slot machine or a punitive streak. It is more like a small daily expedition in which you become better at weighing evidence. This is a design hypothesis to test, not a proven claim about engagement.

---

## 3. First: challenge the prototype's simulation result

### 3.1 What the provided HTML demonstrably does

The supplied single-file prototype contains:

- A **1950–1980** inclusive candidate set (31 years) with a fixed hidden answer of **1969**.
- Four evidence cards with year-interval constraints (`Concorde`, `Apollo`, `Stonewall`, and `micro`).
- An Insight reserve, two Locks by default, and a configurable Trace price.
- A Trace that costs Insight and answers **earlier / later / same**; a wrong Lock removes only that exact year.
- An evidence card that becomes free when it excludes no remaining candidate years.
- A score of `1000 + 100 × remaining Insight + 150 × remaining Locks`.
- Ten load-time self-checks, validating some clue invariants but **not** validating economic balance, optimal policies or the reported 20,000-game simulation.

These observations come directly from the attached code. The simulation code cited in the developer's message is **not included** in that HTML, so its reported win rates are not reproducible from the supplied file alone.

### 3.2 The reported 63–70% Trace-only win rate is questionable

For the suggested rules—**8 Insight, Trace costing 3, two Locks**—a player can afford **at most two paid Traces**, leaving two exact-answer Lock attempts. The starting corridor has 31 possibilities.

Under these precise assumptions—**uniformly distributed hidden year; no historical prior; no paid/free evidence; no external information; optimal adaptive Trace/Lock strategy**—at most **11 of the 31** hidden years can be guaranteed reachable as winning outcomes. That bounds success at **11/31 ≈ 35.5%**, not 63–70%.

A simple decision-tree proof: each Trace can itself hit the exact year (one successful branch), or split into earlier/later branches. With two Traces, each of the four end branches can accommodate two final Lock guesses; there are up to three successful Trace-equality nodes. Total: `4 × 2 + 3 = 11` possible target-year wins. The same limit follows from recurrence `F(0, L)=L` and `F(T, L)=max(1 + F(T, L−1), 1 + 2F(T−1, L))`, with `F(2,2)=11`.

**Important qualification:** The claimed simulation percentage could reflect a nonuniform distribution of historical targets, strong prior knowledge, different action ordering, hidden hints, or another decision model. It is not automatically dishonest; it is **unsupported for the rules as stated**. Request the actual simulation, input distribution, player strategy and seed before adopting the result.

### 3.3 The AI correctly identified two additional issues

- **A wrong Lock is not literally information-free:** it excludes the guessed year. This may be acceptable, but do not describe it otherwise.
- **A clue already implied by visible constraints is worthless as paid narrowing evidence.** The prototype appropriately waives its cost; keep that principle in the expanded product.

**Verdict:** Do **not** approve the proposed `Trace 3 / Insight 8 / 2 Locks` setup as a finished single-puzzle economy. The ten-case redesign should be balanced independently.

---

## 4. Proposed rules for the Daily Ten — version 0.1

### 4.1 The daily structure

- **Ten cases per calendar day.** The same curated, versioned collection for everyone in a chosen daily-challenge time zone; show the next reset time transparently.
- **Eight total Insight points** at the start of the entire expedition. They **do not refill between cases**.
- **A different target date or year for each case**, with a deliberate mix of eras, regions, subjects and clue types.
- **Short free starting dossiers** per case: enough to infer something substantial even if the player spends zero Insight.
- The user can **pause after any case** and resume later with the same saved state; no countdown pressure.
- One **Daily Ten score**, with a per-case breakdown of clean solves, assisted solves, wrong Locks, Insight spent and cases completed.
- **Unlimited non-scoring practice** using separate cases; practice never consumes the daily bank.
- The solved collection unfolds into one coherent **historical atlas or World Reveal**, not ten identical paragraphs.

### 4.2 A single case, in five steps

1. **Open the case:** One historical question, an initial plausible date corridor, and 2–3 readable free evidence fragments appear. Explain the time precision (year, month, day) clearly.
2. **Reason visually:** Players can compare evidence, inspect uncertainty, and move the time locator for free. Show which candidates the available facts exclude.
3. **Decide about help:** Spend Insight for an additional carefully selected clue or an optional Trace; or conserve it for later cases.
4. **Commit a date:** Select the year and Lock it. The player immediately learns whether it is correct. A miss does not end the daily expedition.
5. **Learn and advance:** Show a brief, rewarding explanation and the date's place in the evolving ten-point historical constellation. Proceed to the next case.

### 4.3 Insight actions (hypotheses; tune after tests)

| Action | Proposed cost | Effect | Design constraint |
|---|---:|---|---|
| Explore visible evidence | **0** | Read and compare the initial dossier | Must support meaningful inference without payment |
| Reveal a *Nudge* | **1** | Gives an additional useful constraint or contextual anchor | Must remove at least one possible candidate or explicitly offer non-narrowing context for free |
| Reveal a *Deep Clue* | **2** | Stronger, typically more precise evidence | Must be independently verified and priced for **marginal** information value |
| Take a *Trace* | **2** initially | Tests an exact year for earlier / later / same | Not free, not mandatory, and never the dominant strategy |
| Review a redundant clue | **0** | Context already implied by known evidence | Cannot silently consume Insight |

**These prices are proposed starting values, not measured optimum values.** With only eight points for ten cases, a three-point Trace is an exceptionally expensive purchase, and two-point clues can be afforded at most four times. That may be desirable for a hard mode, but not necessarily for the initial beginner-friendly daily format.

**Pricing rule:** Never reveal the entire text of an unopened paid clue in a teaser. Before buying, show category, origin/region, format and a carefully calibrated indication of what kind of evidence it offers; the information it will reveal should not already be present in the preview. Do not promise a mathematically sharp clue unless the actual remaining candidate set justifies that claim.

### 4.4 Attempts and failure: three candidate variants to test

**Variant A — one Lock per case (recommended first test):** A correct Lock earns a clean solve. A wrong Lock records a miss, reveals the answer with explanation, and moves on. This makes the ten-case expedition resilient and gives straightforward score interpretation.

**Variant B — two Locks per case:** Players may try once and continue after an error, but the second attempt earns a lower score. The wrong guess removes that precise year; disclose that information. This may be better for beginners, but it increases the value of speculative guessing.

**Variant C — confidence wager, without gambling mechanics:** Before locking, choose *certain / likely / risky*. Confidence changes only a small, bounded score bonus; never deduct purchased currency or punish players beyond the current case. Test whether it improves self-reflection or merely adds friction.

**Avoid a shared two-Lock pool for all ten cases.** Two errors ending the entire daily challenge would turn curiosity into risk avoidance and push players to use every hint immediately.

---

## 5. The essential fairness rule: ten solvable cases with zero paid Insight

A shared bank of eight means that **two cases cannot each require five Insight to become logically playable**. The case designer has to do more work up front.

Each puzzle should supply, for free:

- A *historical anchor* showing an approximate range or a sourced relationship to a dated event.
- A second, independent constraint (before/after, overlap, chronology or material evidence).
- A third observation or visual artifact that helps narrow the corridor further, without requiring obscure memorized facts.
- A clear explanation of whether the target is **a precise event**, **an approximate date**, or **the start/end of a process**.

**Do not confuse “true clues” with “useful clues.”** If the revealed facts all apply to all remaining years, the puzzle becomes a blind date guess. The minimum editorial test is that a motivated novice can explain what each clue changed, without needing an encyclopedia open in another tab.

A practical acceptance target for testing (not a universal rule): the free dossier should reduce a beginner's **feasible candidate set to a small, intelligible group** (for example, 2–6 years) before optional paid evidence. A case can still be demanding if the player must draw a non-obvious relationship between those remaining candidates. Later cases may be harder, but the game should never rely on misinformation or undisclosed dates.

**Editorial counterexample:** “Satellites orbit Earth” offers no new constraint if all remaining years are 1958–1984. It can be excellent free world-building, but is not worth two of the day's eight points.

---

## 6. Ten puzzles should relate to each other—but not become one fragile chain

The shared currency alone creates cross-case strategy. A stronger second layer is **historical connectivity**.

Instead of ten arbitrary trivia prompts, arrange the day as a subtle thematic constellation: inventions and their social consequences; simultaneous events in different regions; migration and exchange; global transformations; the lives of people whose dates overlap; the changing meanings of a political idea; or one unexpected historical connection spanning centuries.

**Low-friction version (build first):** Each completed case adds a dated marker to a single navigable daily timeline. After cases 4 and 7, the game offers a short optional discovery connecting two solved moments. This adds narrative surprise without changing game fairness.

**Experimental advanced version:** A completed case may provide an explicit **Bridge Fact** relevant to a future case. For example, “The next mystery happened after the event you just dated.” Because this carries real information, its power should be accounted for during difficulty testing. The next case must remain understandable if a player missed the earlier one: do not gate basic information behind perfect completion.

**Do not build ten isolated mini-quizzes with only a progress counter.** The whole expedition must offer something that a single round could not.

---

## 7. How an example Daily Ten might feel

This is an **illustrative content plan**, not a ready-to-publish historically verified dataset. All dates, captions, and implications need source-level editorial review before implementation.

| Case | Historical lens | Main player decision | What makes it distinct |
|---:|---|---|---|
| 1 | A remarkable invention | Infer from a device and two dated technological constraints | Gentle onboarding; no Insight needed |
| 2 | A political turning point | Compare political documents and sequencing | Chronology, not memorized dates |
| 3 | Everyday food and trade | Read a recipe, commodity route or import record | Ordinary life rather than rulers |
| 4 | Queer community history | Work from a historical record, careful vocabulary and contextual dates | Respectful, source-aware reading |
| 5 | An archaeological discovery | Distinguish discovery date from object's estimated age | Date precision and epistemic uncertainty |
| 6 | Medicine or disease | Compare evidence before and after a discovery | Causal reasoning without simplistic progress narratives |
| 7 | A strange historical coincidence | Match overlapping lives or inventions | Surprise and simultaneity |
| 8 | Africa, Asia, or the Americas | Identify a moment outside the usual European chronology | Geographic breadth |
| 9 | A numerical history puzzle | Interpret a genuinely sourced quantitative series | Data reading, not trivia |
| 10 | The convergence | Combine insights across at least two earlier cases | A satisfying final synthesis |

### An example player run

| Case | Outcome | Insight used | Bank remaining |
|---:|---|---:|---:|
| Start | — | — | **8** |
| 1 | Solved with free evidence | 0 | 8 |
| 2 | Solved | 1 | 7 |
| 3 | Solved with free evidence | 0 | 7 |
| 4 | Needed a Deep Clue | 2 | 5 |
| 5 | Missed, learned why | 0 | 5 |
| 6 | Solved | 1 | 4 |
| 7 | Solved with free evidence | 0 | 4 |
| 8 | Used a Deep Clue | 2 | 2 |
| 9 | Solved with free evidence | 0 | 2 |
| 10 | Used a Trace | 2 | **0** |

**This is a sample story, not a predicted success rate.** Its value is that resource decisions span the whole daily session and that a missed case doesn't erase previous progress.

---

## 8. STRATA's visual system becomes more meaningful with ten dates

The ten-case model could resolve several shortcomings of the previous visual designs. Instead of making one giant geological column carry all the product's meaning, the player sees a **growing collection of cuts through time**.

### The Daily Trail (home)

A vertical, meandering path has **ten stops**, each represented by a differently textured and historically distinct stratum fragment. The path reveals how many cases remain, where Insight has been spent, and what has been solved. Do **not** show the correct years before their puzzles are completed. Distinguish completed, missed, current and future cases by text/shape/pattern in addition to color.

### The Case Camera (during play)

The current case still has STRATA's temporal core and tactile selection instrument. However, restrict the main view to a legible corridor, one clearly selected year, and a compact evidence summary. On narrow phones, do not simultaneously display a full 31-row timeline, a micro-log, an Insight toolbar, and three primary buttons at tiny sizes. Reveal secondary detail on demand.

### Evidence (investigation)

Present free evidence in the main flow; use a sheet or side panel for paid assistance. A purchased clue pins itself to the precise temporal region it constrains. Show a reversible before/after animation: *these years were possible; these are still possible*. Motion must preserve chronological orientation.

### The Convergence (end of day)

After case 10, the ten marks connect in an editorial chronology. Zoom out to show temporal distance, then zoom into 2–3 surprising relationships (not a forced slideshow of all ten). The story may shift between a map, a statistical chart, a document, an object drawing and a scene of everyday life. The revealed relationship must be historically defensible, not a manufactured causal story.

### Motion rules

- **Path-scrolling** is a navigational language, never an obstacle course. Native vertical scrolling must remain usable.
- Zoom must preserve the year under the user's pointer or center of focus; never jump to an arbitrary temporal coordinate.
- Preserve state when returning from evidence: candidate set, locator, zoom, purchased clues, and scroll position.
- Let the player skip cinematic reveals or use reduced motion. A fast puzzle loop should not require waiting through the same elaborate animation ten times.
- Make each case's art distinct through evidence type, region and material—not by assigning a rainbow color to every century.

---

## 9. Scoring and success metrics: do not reward reckless guesses

The existing single-puzzle formula `1000 + 100 × Insight remaining + 150 × unused Locks` strongly values retained resources. Applied naively to ten cases, it could reward skipping meaningful investigation or taking irrational early chances.

A starting score structure should separate:

- **Solved cases:** the main score driver.
- **Insight efficiency:** a smaller secondary bonus, counted **once at the end of all ten cases**.
- **First-lock accuracy:** modest bonus per clean solution.
- **Understanding / engagement:** do not score whether the user reads the story; keep educational exploration voluntary.

**Illustrative formula—not final:** `Total = 100 × solved_cases + 10 × clean_solves + 5 × remaining_insight`. Cap bonus contributions so the rational strategy is to solve more cases, not to save tokens and miss puzzles.

For example, saving one Insight should never outweigh solving an extra mystery. Avoid raw time-based penalties unless a separate optional speed mode is explicitly selected.

### What to measure in real tests

- Completion rate by case number (especially drop-off around cases 5–8).
- Percentage of cases solved, separately for first-time and experienced players.
- Insight remaining and purchased clue types by case.
- Whether purchases increase actual solve rates and player comprehension.
- Time per case, total time, pause/resume rate and device-based interaction errors.
- The relationship between history familiarity and performance.
- Replay intention **and** whether players can describe the rules correctly after the tutorial.

Set success thresholds only after a baseline pilot. Start with 8–12 participant think-aloud sessions plus automated simulations that use multiple explicitly defined player strategies. Do not present simulated outcomes as human engagement measures.

---

## 10. Implementation changes required by the supplied HTML

The current single-case prototype is useful as a rules experiment. It is **not** a ten-case architecture yet.

### Data / engine

Create a `DailyExpedition` holding `daily_id`, content version, 10 ordered puzzle IDs, 8 shared Insight, individual case states, clue purchases, attempted/solved dates, completed cases, and results. Keep each candidate set case-local; never accidentally carry a narrowed year range into unrelated cases. Every purchase must debit the **shared** reserve transactionally, and the full expedition must be saved atomically.

Separate pure deduction logic from rendering, DOM interactions and data content. Add invariant tests for: target always inside surviving candidates; a clue never removes its own hidden target; no negative Insight; a purchase applies once; zero-marginal evidence is free; a missed case does not end the session; completed cases are immutable; refresh/resume preserves the bank; two cases cannot both spend the final token due to a duplicate event; and published daily packs are deterministic by date and version.

### Playability and accessibility

The HTML currently hardcodes `#app { width: 390px; }`, and its timeline renders 31 year rows into 372 vertical pixels (roughly 12 px each). That is acceptable only as a mechanical gray-box. Replace it with responsive sizing and a precise selection alternative: numeric entry or stepper, plus an optional zoomed ruler. Ensure effective tap areas meet mobile accessibility expectations and include non-gesture pathways.

The current evidence preview only describes categories and costs; for Daily Ten it must also explain what is **already known** without spoiling the paid content. The History / Result screen is absent and becomes especially important when ten cases share a narrative arc.

### Source reliability

One attached card lists its source as **“to confirm.”** Do not put such content into a published daily puzzle. Every fact used as a paid, mandatory or decisive clue needs a verified source, a date convention, editorial sign-off, and a recorded reason for its candidate-year constraints.

For ancient or uncertain events, do not fabricate an exact year: either offer a puzzle with an appropriately bounded answer/range, or use only historical cases with sufficiently reliable precision for an exact-date mechanic.

---

## 11. Four balancing prototypes—not one guessed economy

Before visual production, compare all four variants on the same set of at least ten curated, source-checked cases. Ensure at least half the cases are not easily solved by users who already know popular U.S./European history dates.

| Variant | Free evidence | Shared Insight | Trace price | Lock rule | Purpose |
|---|---|---:|---:|---|---|
| A — **Daily Ten Lite** | 3 fragments/case | 8 | 2 | 2 attempts/case | Beginner-friendly baseline |
| B — **Daily Ten Sharp** | 3 fragments/case | 8 | 2 | **1 attempt/case** | Strong meaningful commitment |
| C — **Evidence First** | 3–4 fragments/case | 8 | **Trace unavailable** | 2 attempts/case | Tests whether Trace adds anything beyond binary search |
| D — **Fewer Cases** | 3 fragments/case | 8 | 2 | 1 attempt/case | Six curated cases as the shorter-session control |

The user has proposed **ten cases**, and that should be the lead direction. Variant D exists only as a controlled check against exhaustion, not as a recommendation to discard the ten-case idea.

**Core test:** Can a person unfamiliar with the historical event solve several cases by *reading and reasoning* rather than googling the date? If not, create better basic evidence—not simply more generous token pricing.

---

## 12. Non-negotiable user-experience rules

1. A new player must understand the goal in **one sentence** and learn the three actions in one quick practice case.
2. Each case should require a **meaningful deduction**, not only recognition of a memorized date.
3. Paid evidence must disclose its **cost before purchase**; purchased cards show a source and dating rule.
4. A wrong Lock must never silently provide extra directional information.
5. A missed case must not terminate or reset the day; player progress persists.
6. Daily progress must be recoverable after refresh, app restart and offline use where supported.
7. No paid hints, purchasable Insight, loot-box mechanics, punitive streak repairs, energy timers or misleading urgency.
8. Avoid characterizing queer histories or marginalized communities as merely shocking or exotic; research historical self-description, context and uncertainties.
9. The final World Reveal should use multiple evidence forms and include global, non-elite and everyday-life histories.
10. At every development stage, the coding agent must **stop, demonstrate what changed, request feedback and wait for explicit approval**.

---

## 13. What I would tell the AI coding agent now

*This is a practical feedback message, not a replacement master prompt. It should be read alongside the report above.*

> I do not approve the single-year economy as final. I want to change TIMEHUNT to a daily ten-case expedition: players must investigate **ten different hidden historical dates**, using **one shared bank of eight Insight points across the entire day**, not eight per case. Each case must contain enough free historical evidence to be meaningfully approachable without spending Insight; clues and Trace are optional help, and spending on one case reduces resources for later ones.
>
> Preserve Evidence / Trace / Lock provisionally, but redesign how attempts, scoring, source-backed clues and shared resources work. A missed case should reveal its answer and let the player continue. The day should culminate in a connected, visually rich ten-date World Reveal using STRATA's path-scrolling and zoom language.
>
> Before modifying code, challenge the earlier 63–70% Trace-only simulation: show the actual simulation source, target-year distribution, player policy, random seed and assumptions. Under 31 uniformly possible years, Trace at 3, eight Insight and two Locks appear to support at most 11/31 (~35.5%) Trace-only wins; explain the discrepancy.
>
> Present **at least three daily-economy variants**, a proposed ten-case content pack with sources, and the smallest playable multi-case prototype. Include explicit tests for shared-token persistence, zero-value clue pricing, no double-purchases and case independence. Keep the architecture modular and the UI readable on a small phone.
>
> **STOP after this design stage and ask for my feedback. Do not implement a polished visual system or proceed to the next stage until I explicitly approve.**

---

## 14. Approval decision and rating

**My recommendation:** Approve the *principle* of a ten-mystery daily expedition with eight shared Insight, but **do not approve the rule economy or production UI until the gray-box has been rebuilt and tested accordingly**.

| Design element | Judgment (subjective) | Reason |
|---|---:|---|
| One mystery year per day | 6.2/10 | Clear, but repetitive and binary-search-dominated |
| Ten **independent** mysteries with shared bank | 8.0/10 | Stronger planning, but risk of feeling like ten separate quizzes |
| Ten mysteries with a connected historical final reveal | **9.0/10** | Distinct cumulative experience, strategy and historical discovery |
| Existing 31-year gray-box replicated ten times | **3.5/10** | Resource starvation, inconsistent difficulty and poor novice access |
| Proposed Daily Ten with curated free evidence | **8.7/10 concept potential** | Needs playtesting before any retention or success claims |

**Bottom line:** The strongest TIMEHUNT is not “guess 1969 ten times over.” It is **a ten-stop trip through history in which every bit of evidence has a cost, every mystery changes your resource strategy, and the final collection reveals something you could not see from any single date.**

---

## Provenance and reading notes

- **Prototype reviewed:** User-supplied `convergence.html` (HTML/CSS/JavaScript). Specific mechanics were inspected directly in source. The prototype's on-load tests establish local clue invariants only; the cited separate simulation was not provided.
- **Screenshots reviewed:** User-supplied Convergence gray-box storyboard showing initial range, evidence menu, narrowing, Lock outcomes and simulation summary.
- **Related design work:** Earlier TIMEHUNT gameplay proposal and STRATA evaluations from this project, used for design continuity.
- **Historical stories and proposed prices:** Illustrative, not release-ready evidence or empirically validated optimum values.
- **Statistical statement:** The 11/31 success bound is a conditional mathematical result, not a prediction of player performance.
