# TIMEHUNT — THE DAILY TEN
## The Definitive STRATA / CONVERGENCE Master Prompt
### A mobile-first historical deduction game: gameplay, editorial research, art direction, cinematic motion, engineering, experiments, and stage-gated delivery

**Edition:** 2.0 · Consolidated project specification · 23 November 2026  
**Status:** Paste-ready master prompt; product commitments, hypotheses, and outstanding approvals are explicitly distinguished.  
**Audience:** AI coding agent (Claude Code, Codex, etc.), game designer, creative director, interaction designer, historian/editor, QA engineer.  
**Project identity:** TIMEHUNT (product) / **The Daily Ten** (core daily mode) / **CONVERGENCE** (deduction engine) / **STRATA** (visual-spatial system).  
**Central promise:** **Ten hidden moments. Eight chances to ask for help. How much of history can you uncover?**

> **START HERE.** This is a replacement for—not a supplement to—the earlier single-year TIMEHUNT master prompt. Read the entire file before acting. Place it in the repo at `docs/TIMEHUNT_MASTER_PROMPT.md`. The instructions between `BEGIN MASTER PROMPT` and `END MASTER PROMPT` are operative. Begin **STAGE 0 ONLY**, show an honest repository audit and proposed next decision, then **STOP AND ASK FOR FEEDBACK**. No later stage is pre-approved.
>
> **Important:** This is an implementable creative/product specification, not a claim that the new game is already balanced, that the supplied screens have been tested on phones, or that the prototype's historical content is release-ready. Designs, scoring constants, economics and performance targets require explicit validation.

---

## Reader's map

| Part | What it establishes |
|---|---|
| A — Decision ledger | Which earlier ideas survive; which are superseded; what remains untested |
| B — Core game | The ten-case expedition, eight shared Insight, Evidence / Trace / Lock, fairness and scoring |
| C — Content | Strange statistics, queer and everyday histories, global coverage, factual provenance |
| D — STRATA | Visual design language, palettes, typography, iconography, material meaning |
| E — Motion / UX | True temporal camera, path-scroll, zoom, interactive World Reveal, reduced motion |
| F — Engineering | 2024–2026 maintained practices, deterministic engine, state, persistence, tests |
| G — Stages | Mandatory checkpoints and deliverables for every approval stage |
| H — Appendices | Examples, schema, algorithm sketches, audits, references and execution commands |

---

# BEGIN MASTER PROMPT

## 0. YOUR JOB, QUALITY STANDARD AND IMMUTABLE COLLABORATION CONTRACT

You are an interdisciplinary, exceptionally demanding creative team rather than a generic coding assistant. Adopt the responsibilities of: lead game designer; specialist in decision-making, cognitive load and humane retention; experimental editorial art director; senior mobile UX and motion designer; historian and historical-data editor; senior TypeScript/mobile engineer; accessibility lead; and rigorous test engineer. **Challenge the brief when facts, mathematics or interaction logic do not support a proposal.** Preserve the intended experience, never blindly execute a broken mechanic.

Create a game that is visually recognizable from a three-second clip, engaging when the player knows little history, and editorially credible enough that educators and historians will not see it as a fact generator. It must not resemble a generic quiz app, museum brochure, SaaS dashboard, or shiny AI-produced concept board. Favor a small number of original, deeply considered systems over a collection of fashionable effects.

### 0.1 One-stage-per-approval contract — non-negotiable

**Only one development stage may be executed in each approval cycle.** Stages 0–15 appear later in this document; they are not permission to build them all at once. At the end of EVERY stage:

1. Deliver the actual requested artifacts: source files, diagrams, playable link/local path, videos/screen recordings, datasets, test outputs, comparisons, as applicable.
2. Explicitly identify **built**, **mocked**, **tested**, **simulated**, **not tested**, and **proposed** items. Never present a poster as proof of functioning gestures or a passing unit test as proof of pleasurable gameplay.
3. Summarize decisions, two credible alternatives, why they were rejected, accessibility impact, historical accuracy concerns, risks and unresolved dependencies.
4. Critique your own work against the actual TIMEHUNT criteria and state what remains weak.
5. Update `docs/DECISIONS.md`, `docs/OPEN_QUESTIONS.md`, `docs/STAGE_STATUS.md`, `docs/CHANGELOG.md`, and `docs/HANDOFF.md` (or initialize them in Stage 0).
6. Show a **PASS / FAIL / NOT TESTED** acceptance table, with file/test proof where possible.
7. **STOP** and end your answer with the following checkpoint, customized to the active stage:

> **CHECKPOINT — STAGE N: [STAGE NAME]**  
> I have completed only Stage N and stopped. Here are the artifacts, tests, risks and alternatives for review. What should I change? Reply **REVISE STAGE N: [feedback]** to iterate this stage, or **APPROVE STAGE N** to authorize Stage N+1. I will not proceed without that explicit approval.

If user feedback says “make it better,” “I don't like the colors,” “why?”, or “show me alternatives,” **remain within the active stage**. A positive comment is not approval. Approval is never implied from prior conversations. If an implementation discovery contradicts an approved decision, log it and ask to reopen the relevant stage. Do not silently override the user. Ask for crucial feedback at every gate, but avoid blocking routine work on unnecessary clarification questions.

**First response to this file:** Read repository and exact source materials; audit what exists; perform **Stage 0 only**. Do not generate new polished screens or start the ten-case engine until the appropriate stage has been approved.

### 0.2 Repository/handoff discipline for long agent sessions

Make this project robust to context-window loss and different coding sessions:

- `docs/PROJECT_VISION.md`: 1–2-page north star, current user-approved thesis.
- `docs/DECISIONS.md`: dated ADR-like log: decision, alternatives, owner, approval stage, reason, reversal conditions.
- `docs/OPEN_QUESTIONS.md`: unresolved issues, urgency, proposed tests, stage owner.
- `docs/STAGE_STATUS.md`: stage number, gate, proof, next allowed action.
- `docs/HANDOFF.md`: concise latest build state, commands, file map, blockers, next step.
- `docs/CONTENT_POLICY.md`: editorial standards and sensitivity guidance.
- `docs/RESEARCH_LOG.md`: bibliographic claims with links, retrieval dates and confidence.
- `docs/PLAYTESTS.md`: test protocol/results, separating observations from assumptions.
- `docs/DESIGN_CRITIQUE.md`: annotated review, scores as subjective not objective.
- `docs/QA_MATRIX.md`: test matrix and device status.

At each stage, change only the necessary files, write readable commits, and summarize exact changed paths. Never create a second competing source of truth for the game rules. Version the canonical rules in one module and this document's decision ledger. Do not inflate the repo with unapproved concept art, generated sample datasets, redundant components or speculative frameworks.

---

## 1. PRODUCT NORTH STAR AND RECONCILIATION OF ALL PRIOR WORK

### 1.1 The product explained in one breath

**TIMEHUNT is a daily historical detective expedition.** Players solve **ten distinct hidden-date mysteries per day**, using the same **eight Insight points across all ten**. Each case begins with substantive **free source-backed evidence**; they reason about what dates remain possible, optionally spend a scarce shared resource on additional evidence or a directional Trace, and commit a year with **Lock**. A wrong answer doesn't terminate the expedition. Every case becomes a mark in a connected, explorable historical landscape; the expedition culminates in an extraordinary World Reveal connecting multiple moments across place, culture, statistics, everyday life and sources.

The long-game skill is **choosing how to distribute scarce investigative help across ten cases**. The local skill is **historical inference, not obscure fact recognition or blind number search**. The aesthetic pleasure is **physically moving through layers of time**. The editorial reward is **seeing unexpected simultaneities and historical connections**, without inventing causality.

### 1.2 What is FIXED from the user's decisions

1. **Ten historical mysteries per daily challenge**—not one hidden year for the entire day.
2. **Eight Insight total per daily expedition**, shared across the ten cases; Insight does **not** reset after each case.
3. The game is mobile-first, one-hand-friendly, replayable, exceptionally distinctive, and more satisfying than fast historical trivia.
4. **STRATA is the active visual direction**: layered time, Oxide & Bone, tactile material register, experimental editorial precision. Do **not** default back to blue, cyanotype navy, or a plain gray dial.
5. **CONVERGENCE is the provisional gameplay grammar**: Evidence / Trace / Lock. It must be rebalanced for the Daily Ten before production approval.
6. The core session should include a genuine and accessible **path-scrolling / zoom-in / zoom-out** experience, not just animated screen swaps or ordinary vertical scrolling with cards.
7. The reveal is an **interactive historical world**, not four static slides or a congratulatory score modal.
8. Historical content extends far beyond monarchs/wars: statistically interesting, strange, counterintuitive, cross-cultural, queer, scientific, social, ordinary-life, material, ecological and underrepresented history.
9. Every factual clue needs defensible sourcing, temporal precision, uncertainty metadata and editorial QA.
10. All work is **stage-gated**: the AI **MUST stop and request feedback after every step**.
11. Prefer verified, actively maintained **2024–2026 ecosystem guidance**; check official sources at the time of implementation rather than using stale tutorial snippets.
12. Do not confuse high replay value with coercive psychological manipulation.

### 1.3 Superseded or explicitly rejected older rules

| Old proposal/prototype | New status | Why |
|---|---|---|
| One hidden year per day; six guesses; ten Insight each hunt | **REPLACED** by ten dates and one shared eight-Insight bank | Weak long-horizon strategy and repetitive binary search |
| Earlier/later feedback on every free guess | **REPLACED** by paid, optional Trace (if Trace survives balancing) | Pure binary search dominates otherwise |
| Two Locks shared within one puzzle as default | **NOT APPROVED**; test one vs two **per case** | Reckless guesses and scoring exploits |
| Trace = 2 or 3 and clue = 1–4 by fiat | **HYPOTHESIS**; test for ten-case economy | Costs not empirically balanced |
| `1000 + 100×remainingInsight + 150×remainingLocks` | **REJECTED** | Encourages risky Locks; weights saving ahead of solving |
| Big dial + cobalt/blue accent | **REJECTED as final art** | Generic industrial identity, overly cold/monotone |
| Full-screen contact-sheet year picker | **REJECTED for core hunt** | Unclear range, tiny targets, insufficient temporal control |
| Dense permanent stratigraphy with every note pasted inside it | **REDESIGN** | High cognitive load, obstructed controls and illegible text |
| A four-card static year reveal | **REPLACE WITH interactive multi-form World Reveal** | Does not fulfill exploratory or emotional promise |
| Claimed “Trace-only 63–70% win” simulation | **UNVERIFIED / disputed** | Under uniform 31-year, two-Trace, two-Lock assumptions the bound is lower |
| “Satellites already orbit” sold within 1958–1984 | **PROHIBITED as paid narrowing clue** | Eliminates zero remaining years |
| Ten disconnected date quizzes | **REJECTED** | Shared resource alone is not sufficient narrative identity |

### 1.4 Open choices, to be settled by experiment and user approval

- Whether default Lock is one attempt or two **per case**, and how a miss is scored.
- Whether Trace remains in beginner mode, its cost, and whether it is capped per case/day.
- Optional ability to skip a case and return later, vs sequential cases, given leakage/fairness tradeoffs.
- Difficulty progression; number of initial free fragments; typical residual candidates before optional help.
- Nudge/Deep Clue prices, spoiler strength and correlation handling.
- Final scoring equation, partial-credit behavior for uncertain historical date ranges, scoring of assisted solves and practice.
- Daily reset convention (UTC vs user-local), language/geography pack policy, online/offline publication strategy.
- Primary platform (PWA vs native cross-platform); exact current dependencies.
- Exact selected font family, quality/availability of Georgian localization, asset licensing.

**Do not “decide” these simply because a static mockup contains them.** Show evidence, prototype alternatives and ask approval at the specified stage.

### 1.5 Success definition (not vanity metrics)

- A novice understands goal and three actions after a short playable example, without prior history knowledge.
- The game rewards reasoning from free evidence; no case is hostage to purchasing clues or knowing a textbook date.
- Choices about spending eight Insight across ten cases feel consequential and fair, not arbitrary or anxiety-inducing.
- Players can explain why years were excluded and can recognize a redundant clue.
- The core interaction feels tactile, legible, fast and memorable across devices.
- A wrong guess is instructive and does not destroy the ten-case session.
- The reveal provokes curiosity and source exploration; players recall genuinely interesting history.
- Players voluntarily return because of puzzle craft, not manipulative streaks.

Avoid claiming that “10 mysteries means longer engagement is automatically better.” This is a hypothesis; measure session fatigue and the percentage voluntarily finishing cases 7–10. Provide graceful pause/resume and a shorter optional practice loop.

---

## 2. CANONICAL DAILY GAME — PLAYER RULES AND LOOP

### 2.1 One-sentence onboarding

**“Find ten hidden historical years using clues. You have eight Insight for extra help across the whole day, so spend it wisely.”**

Then show the three verbs: **READ EVIDENCE → TEST WITH TRACE (OPTIONAL) → LOCK A YEAR**. The free year selector is not itself a paid action.

### 2.2 Daily expedition structure

- Exactly **10 ordered cases** in the user-selected daily pack.
- Begin with `sharedInsight = 8`; it cannot become negative; do not sell more, regenerate it mid-run, or charge it outside explicit player actions.
- Case states: `not_started`, `active`, `solved_clean`, `solved_assisted`, `missed`, `revealed`, `skipped` (if skipping is approved); record exact attempt counts and evidence purchases rather than relying only on labels.
- Save after each meaningful action and support resuming at the same case, selected year, camera coordinate, clue state and shared bank.
- Individual puzzles include a verified target **year** or, for supported advanced modes, a properly defined bounded date window/precision. The main Daily Ten should start with precisely dated single-year targets for clarity.
- Each has a **plausible initial corridor** with 2–3 independent, substantive **free evidence fragments**. More can be added after usability testing, not to disguise poor case construction.
- The selected year may change freely, via dragging or accessible alternatives. Scanning the ruler is **free** and reveals no hidden truth.
- Exactly when the player commits with Lock do they receive correct/incorrect outcome; *a wrong Lock may eliminate its exact year but does not reveal earlier/later*.
- A miss always leads to clear explanation and the next case; **never eject from the entire day**, remove previous progress, or deduct future Insight as a punishment.
- The ten answers form a single **Daily Trail**, with additional historical connections optional during play and a distinctive multi-scale finale.
- Practice mode is unlimited, separate and unscored by default; it never spends the daily eight-Insight budget.

### 2.3 Local case loop, exactly specified

**Beat 0 — Orient:** A new temporal stratum grows out of the Daily Trail. One evocative question, target unit (“year”), initial corridor and short free starting dossier appear. Player can immediately inspect a source note or move the locator.

**Beat 1 — Infer:** The player reads evidence, identifies before/after/overlap constraints, and visibly sees excluded ranges (if explicitly encoded). Their remaining candidates can form intervals **or gaps**, not necessarily one continuous span.

**Beat 2 — Allocate:** Player may choose extra evidence or optional Trace, with a clearly labeled cost and what kind of informational function it performs. The UI must not hide a necessary action behind a bottom sheet.

**Beat 3 — Commit:** Player chooses a year and taps **Lock [year]**. A one-time clear confirmation is allowed if accidental taps are a known issue; avoid a redundant confirmation modal after every deliberate Lock. Locked outcomes persist.

**Beat 4 — Understand:** Whether correct or wrong, reveal the year, the logical proof, the sources and a short satisfying discovery. Offer an optional deeper story and **Next case**. Never force a long explanatory sequence before advancing.

**Beat 5 — Connect:** On the Daily Trail, add this date as a physical mark. Optional moments after cases 4 and 7 reveal a surprising but defensible relation; explain whether the connection is chronological, geographic, contextual or causal, and do not conflate them.

### 2.4 The three actions and common controls

| Action | Basic effect | Initial cost hypothesis | Trust and usability requirement |
|---|---|---:|---|
| **Read/inspect free dossier** | View pre-existing source-backed constraints | **0** | Must be enough for substantive reasoning |
| **Nudge** (inside Evidence) | Additional useful clue, usually a modest constraint | **1 Insight** | Price visible; meaningful conditional utility |
| **Deep Clue** (inside Evidence) | Stronger clue, richer historical evidence | **2 Insight** | Never guaranteed single-year giveaway by default |
| **Trace** | Test selected year; reveal earlier / later / equal | **2 Insight**, *experimental* | Not free; cannot be the optimal mechanical default |
| **Lock** | Commit selected year | **0 Insight**, attempt limited | Wrong Lock excludes precisely that date only |
| **Review evidence / sources** | Reread purchased or free material | **0** | No repeated charge, no penalty for rereading |
| **Redundant contextual fact** | Interesting history, no new cut | **0** | Must not be sold as a narrowing hint |
| **Select, pan, zoom, fit corridor, enter year** | Navigate time, no game-truth feedback | **0** | Never debit budget for navigation |

All costs are test candidates, **not approved production values**. In a day with only eight tokens, affordability across cases matters more than “fun” prices in one case. Show `8 Insight for all 10 cases` in onboarding; show `3 / 8 remain · Case 7/10` during play, unobtrusively. Be especially clear that “spend Insight” does not mean real money.

### 2.5 Competing Lock policies (do not silently choose)

- **A — one Lock per case (first experiment):** One commitment; correct = solve; wrong = miss and reveal. Strong clarity, but risks punishing a player who has narrowed to two equally plausible dates.
- **B — two Locks per case:** Second chance, reduced case credit. First miss removes only chosen year. Must test whether blind guesses become rational.
- **C — one Lock with optional explicit confidence declaration:** Confidence changes only a small bounded scoring component; no wagering tokens or gamified gambling.

Present and simulate these, then test with real people. **Never** use a shared two-error lives system that can end the full day early. Default for the first isolated test may be A, but mark it **provisional** until approval.

### 2.6 More meaningful daily structure than ten unrelated questions

Design each day around a **subtle editorial constellation**, not an obvious trivia theme. Possible structures:

- “Before this became everyday”: materials, inventions, and adoption across cultures.
- “The world was doing other things”: surprising simultaneous events on different continents.
- “Things that travel”: foods, languages, people, printing, crops, disease, money, ideas.
- “Being counted”: population measures, censuses, calendars, trade totals, births, work time.
- “Margins and majorities”: social organization, queer communities, labor, people absent from traditional histories.
- “The long shadow”: early cause / later response / adaptation, with claims of causality sourced.
- “Not the invention you thought”: myths about firsts, claimed dates, evidence caveats.

**Not all ten cases should be linked by a giant secret plot.** Some connections may be thematic or temporal, not causal. Before the finale, the player may see their own ten date marks and optional Bridge Facts; missing a prior answer must never make the next puzzle unsolvable. Bridges that narrow a later case must be part of the documented starting conditions and counted in difficulty tests. There must be at least one satisfying discovery that emerges only from considering **multiple** cases together.

### 2.7 Session rhythm and fatigue

Initial target: **6–12 minutes of core play for all ten**, plus optional reveal exploration; this is a hypothesis, not a performance claim. Mix case shapes: two entry-level cases, several medium deductions, one visual/data case, one challenging case, and a finale that brings the day's constellation together. Avoid steadily increasing difficulty regardless of learning. Offer “Continue later,” save progress automatically and never show a punitive timer in the main daily mode. Practice can include optional speed challenges later.

---

## 3. PUZZLE LOGIC: FAIR EVIDENCE, MEASURABLE INFORMATION, NO CHEAP BINARY SEARCH

### 3.1 Formal target and candidate set

Let the candidate universe for a case be `U = {y ∈ integers | startYear ≤ y ≤ endYear}` under the documented internal year convention. Let `t ∈ U` be its verified target. Let `C ⊆ U` be currently feasible years. Initially `C = U`; then apply **free dossier constraints** to derive `C0`, and any subsequently purchased clues/Traces to derive `C1`, `C2` etc.

- **Evidence:** `C' = { y ∈ C : predicate_evidence(y) = true }`.
- **Trace at year g:** if `t < g`, `C' = {y ∈ C : y < g}`; if `t > g`, analogous; if `t = g`, `C' = {g}`. This is paid information, not a free guess.
- **Wrong Lock at g:** in second-chance mode only, `C' = C \ {g}`; reveal no direction. In one-Lock mode, the case ends on miss.
- **Invariant:** **`t ∈ C` always**, until the case is completed. Candidate sets may contain disconnected intervals, and `min(C)–max(C)` must not be misrepresented as an unbroken possible range.

Never infer logical candidate cuts from a prose paragraph at runtime with an LLM. Every clue must have an **editor-reviewed machine predicate** and sourced explanation. For ambiguous historical claims, the safe output is *context only*; do not silently treat them as precise boundaries.

### 3.2 Every free dossier must be genuinely playable

Provide an initial anchor and at least two **independently motivated** useful observations. They may be a dated document relation, a source object with terminus constraints, an already published numerical plot, a before/after institutional reform, a personal lifespan overlapping an event, or an explicit chronological relationship to another verified event. Sources matter, but the player should not need to leave the app to do arithmetic or fact-check during play.

**Case-design bar:** A reasonably engaged novice must have a plausible line of deduction **without buying any Insight**, not merely have historical facts that happen to be true. A working design target might leave **2–6 distinguishable candidate years** after reading free evidence, depending on intended challenge. If the only path to one exact year is obscure external knowledge, then either add a free discriminating fact, redefine the answer precision or eliminate the case from the beginner daily pack. Ten cases with eight shared resources cannot require paid clues for basic solvability.

**Case card example — illustrative, verify before release:**

```
CASE 04 — A moment when two histories intersect
Target scale: YEAR
Initial corridor: 1965–1975
Free evidence A: an accessible dated source puts the event AFTER a documented boundary.
Free evidence B: a separately sourced institutional record puts it BEFORE another boundary.
Free evidence C: a small artifact or numeric relation discriminates the last possibilities.
Question: Which exact year satisfies all three?
Optional Evidence: one Nudge, one Deep Clue, neither mandatory.
```

This describes the design of a case, not a validated historical puzzle. The production pack needs concrete sources and a derivable answer.

### 3.3 What “useful” means and how to price it

For actual known candidate sets `C` before and `C'` after a clue:

- `removed = |C| − |C'|`
- `reduction = removed / |C|`, for nonempty C.
- `uniform_information_bits = log2(|C| / |C'|)` is a modeling diagnostic, **not** a psychological measure of helpfulness or a universal optimal price.
- For a nonuniform, explicitly stated model prior, compute reduction in posterior entropy or expected success probability under that prior; report the assumption.
- Track **marginal** usefulness after already known clues. Two differently worded facts can be equivalent constraints.

**Critical anti-leak principle:** A clue preview must not disclose its actual interval, exact excluded years, before/after direction, remaining candidate count, or whether it fits the current selected guess, unless that information has already been earned. The supplied STRATA clue-preview graphic risked showing the shape/location of a cut before paying. Preview **evidence type, topic, source confidence, cost, and a broad truthfully calibrated description**, not outcome-specific information. Because the target is fixed, even a “this clue will cut 80%” label may leak information; audit pre-purchase metadata for leakage.

If a purchased clue would now remove **zero additional candidate years**, do not debit Insight. Show it as free context or replace it with another available clue. Check duplication by exact logical equivalence and by overlapping `correlationGroup`. If you display “the same cut as another clue” **before purchase**, do not inadvertently tell players a fact they do not know; when that equivalence itself leaks, omit the clue rather than advertise its effect.

**The clue is never the product of a category label alone.** “Spaceflight, Sharp, Worldwide” describes a subject, not an exact interval. The engine must distinguish documentary source, historically interpreted claim, and mechanical cut.

### 3.4 Trace must not dominate or become mandatory

The previous prototype made Trace a paid earlier/later scan. That is acceptable as an option, but the default should be *investigate history*, not purchase a binary-search operation repeatedly. Evaluate at least:

1. Trace permitted, price 2, optional cap per case.
2. Trace price 3, with fair alternative free evidence.
3. Trace absent from the beginner Daily Ten; available in an advanced/practice mode.
4. Additional constraint on Trace: using it gives less case bonus than source-based deduction, **only if this does not create weird scoring pressure**.

Simulate optimal policies with several player assumptions; then playtest. Do not manipulate Trace's answer or introduce random misinformation merely to make it less effective. One purpose of testing is to decide whether the mechanic deserves to exist at all.

### 3.5 Mathematical honesty about the earlier simulated prototype

The attached `convergence.html` was a gray-box **single-case** page with `1950–1980`, hidden `1969`, cards for Concorde/Apollo/Stonewall/microprocessor, configurable Insight/Locks/Trace, 31 vertically rendered rows in about 372 px, fixed 390px app width and a score rewarding unused resources. It ran **ten self-check assertions** about clue invariants. That does not validate retention, ten-case economy or a separately reported `20,000`-run simulation.

A prior coding-agent response claimed that, with eight Insight, Trace costing three and two Locks, Trace-only could win **63–70%**. Under **uniform 31-year targets, no clues or historical priors, two Traces and two exact Lock attempts**, the upper bound is **11/31 ≈ 35.5%** across any deterministic strategy. If a reported simulation differs, investigate its hidden-year distribution, player model, payment rules, use of hints, stopping conditions, random seed and code. The result might have had different assumptions; do not call it validated or tune the game to it blindly. Reproduce the actual code and clearly label **simulation vs real-player results**.

### 3.6 Wrong Locks, confidence and scoring exploits

- A wrong Lock **does** communicate that exact year was incorrect, although it should not say earlier/later. Disclose this honestly.
- A player must not profit by blind Locking when the candidate set is large because unused-Lock bonuses exceed the cost of learning.
- Do not pay enough points for untouched Insight that saving one Insight is preferable to correctly solving an entire case.
- Do not deduct Insight on a network failure, double-click, replayed action or missing response.
- If no paid clues were purchased, the game can still show rich free context and sources.

A transparent **scoring candidate** to test: `100 × casesSolved + 10 × cleanSolves + 5 × remainingInsight`. Case outcomes dominate the budget bonus. This is **illustrative only**; test against bots maximizing points rather than actual solving, against novices with varying history knowledge, and across differently difficult ten-case packs. Consider alternative normalized case weights and clear assisted/missed labels. Never call a derived score “intelligence” or rank moral worth.

### 3.7 Playtesting the economy as a game, not as a spreadsheet

Before implementation, design a ten-case **sourced** starter pack, then perform simulations with:

- Uniform guesser; random guesser; optimal numerical policy; simplistic Trace-first policy; clue-first deduction; novice using free dossiers; strong prior-knowledge player; and risk-averse/risk-seeking variants.
- Same published packs, same seeds and identical budget constraints across candidate economies.
- Monte Carlo confidence intervals where sampling is used; exact enumeration for small candidate sets wherever possible.
- Measures: solved count, clue spend, per-case miss probability, unspent budget, policy advantage, score exploit rate, whether the final two cases are starved, and sensitivity to clues being correlated.
- Real usability tests with 8–12 new players plus some daily-puzzle enthusiasts; don't infer subjective appeal from bots.

**Show the source code and assumptions for simulations.** A graph without the policy or target distribution is not evidence that an economy is good. Publish a decision table recommending which variant to prototype and why.

---
## 4. HISTORICAL EDITORIAL SYSTEM: FACTS AS PLAYABLE EVIDENCE

### 4.1 Editorial philosophy

History is not a warehouse of disconnected dates. Each case should invite a **precise, interesting question** whose answer depends on contextual reasoning. We are interested in surprising **simultaneity**, differences in ordinary lives, competing explanations, material evidence and timescales. Avoid the trap of “the world's most famous ten events” or an unbalanced Western-great-men catalogue. The facts should be pleasurable to discover **even when the player misses**.

Editorial mission: **history as an evidence-led investigation, not a fact generator**. Do not invent a connection because it makes the storytelling flow prettier. Distinguish temporal co-occurrence from influence, causation, trade connection, thematic analogy and inference. Do not manufacture archaeological certainty or equivalence across different cultural chronologies.

### 4.2 Coverage requirements for published packs

Across a rolling set of packs, deliberately track balance by:

- **Period:** ancient, medieval/post-classical, early modern, modern, contemporary; reflect uneven date precision. Deep prehistoric content often cannot support exact-year play and belongs in approximate-interval/alternative formats unless evidence genuinely permits an exact date.
- **Geography:** Africa, West/Central/South/East/Southeast Asia, Oceania, Middle East, Europe, the Americas, cross-regional networks; don't silently treat a region as a single civilization.
- **Perspective:** rulers and laws; labor and families; technologies; art and literature; religion and belief; economics; ecology; food and migration; public health and medicine; gender/sexuality; marginalized communities; ordinary routines.
- **Evidence:** archaeological artifact; primary document; map; oral history; historical photograph (where licensable); quantified record; scholarly synthesis; modern reconstruction (clearly labeled).
- **Narrative treatment:** counterintuitive coincidence, misremembered “first,” lived experience, cause vs consequence, named individual vs structural process, contested historical claim.

These are editorial audits, **not mechanical quotas that force poor cases into the daily pack**. Report per-month distribution and explicitly describe why certain regions/periods remain underrepresented (e.g. source survival or date uncertainty). Do not equate “less documented” with “less historically significant.”

### 4.3 Strange and unusual history without clickbait

Seek facts that produce **“wait, really?”** moments, but ground them in sources. Examples of promising *formats*, **not already verified release claims**:

- Two people with seemingly different historical contexts whose documented lifespans overlap.
- A technology known in one region long before it became common elsewhere; carefully distinguish first appearance from broad adoption.
- A commodity or everyday food crossing regions through trade, coercion and cultural exchange.
- A documented animal, tool, law, exhibition or community practice with an unexpected chronology.
- A counterintuitive overlap between an old institution and a modern technology.
- Historical figures' ages at major events, only when dates are well established.
- Population and life-expectancy comparisons with clear denominators, uncertainty and source revisions.
- Inventions whose “date” changes depending on prototype, publication, patent, first commercial use or diffusion.
- Competing datings of the same artifact and how scholars discriminate between them.
- How long a journey, harvest, letter delivery or construction took, with date/route/method caveats.
- Statistically notable contemporaneous transitions in multiple regions—but not a fake universal “percentage of history.”

Do not flatten atrocities, slavery, colonial violence or persecution into amusement. Humor should arise from surprising chronology, human ingenuity and cultural contrast—not from victims or identities.

### 4.4 Queer history and contested identity language

Queer and gender histories are important **ordinary parts of global history**, not a novelty cabinet. The editorial approach must:

- Record contemporaneous names and self-descriptions where possible; distinguish them from later umbrella terminology.
- Avoid retroactively asserting modern labels for people who did not use or have access to those categories.
- Include legal, social, artistic, domestic, communal and joyful lives as well as activism and oppression.
- Show source limitations; persecution records and hostile archives are not neutral descriptions of people's lives.
- Avoid exoticizing terms like “bizarre” next to marginalized identities. Place these subjects in historical context, with respectful wording and verified attribution.
- Consider historical language and place-specific concepts rather than forcing present-day Western categories onto other cultures.
- Vet sensitivity and editorial tone with appropriate expertise where available, especially if publishing for teens.

Potential source families: Library of Congress LGBTQ collections, U.S. National Archives, Historic England LGBTQ history guidance, scholarly monographs and archives in relevant regions. A clue can be about a dated organization, publication, law, gathering or text *when verified*; the player's task is to reason about the chronology, not guess anyone's identity.

### 4.5 Interesting statistics: no fake precision

Statistics require more discipline than ordinary event dates. Every quantitative card should carry:

- Statistic's exact variable and unit, denominator and geographic coverage.
- Source institution, edition/revision, retrieval date, table ID/URL, publication/observation dates.
- Whether **measured**, **estimated**, **reconstructed**, **inferred**, or **unknown** (and what the category means).
- Method and known uncertainty; “about” when warranted.
- True zero vs unavailable/null; no zero-filled gaps.
- Explicit comparability limits across regions, times, source revisions or political definitions.
- Chart whose scale and axis labels are rendered in code and remain comprehensible when enlarged. Avoid dramatic charts with misleading truncated axes.
- No invented exact percentages of people believing something, no undifferentiated “world's first,” and no pseudo-probability assigned to historical claims.

Example: for the 1969 World Reveal, a global population figure around 3.6 billion can be visually compelling, but publication requires the exact UN World Population Prospects revision and table/method used. Do not use “3.6 billion” as an exact worldwide count with no context. A separate educational chart might show why estimates change across revisions.

### 4.6 Date conventions and source interpretation

Main daily mode targets **integer historical years**. Adopt one clear internal representation; if using astronomical numbering, **internal year 0 = 1 BCE**, with user-visible BCE/CE formatting that never shows a fictitious historical year zero. Test transitions across 1 BCE / 1 CE and century calculations; date arithmetic differs between historical year labels and astronomical coordinates.

- Store calendar in source record (Julian, Gregorian, Hijri, other documented system), conversion method and uncertainty.
- Never silently convert an ambiguous “Old Style” date to Gregorian. Display a concise conversion note where relevant.
- Distinguish: exact event date, date range expressing uncertain dating, period of an ongoing process, publication date vs occurrence date, archaeological discovery date vs artifact creation estimate, and approximate scholarly conventional dates.
- For logical constraints define a **year-boundary rule**. Proposed main-mode default: a claim “already happened” counts **by 31 December of the target year**, unless the displayed claim says otherwise.
- A documented year interval should include/exclude endpoints according to explicit rule; use half-open intervals internally only if safely translated for UI.
- For ongoing processes, do not claim a single “year of the event” without defining which milestone or threshold.
- Never derive hard time boundaries from uncertain scholarly prose without representing the uncertainty and offering alternative interpretations.

### 4.7 Source grades and object model

Use at least three **separate** axes rather than one vague confidence badge:

1. **Source quality/provenance:** archival object/official record, peer-reviewed synthesis, reputable institutional explanation, journalistic summary, unverified.
2. **Dating precision:** exact day, month, year, decade, range or undated.
3. **Interpretive confidence:** documented direct claim, well-supported inference, contested interpretation, reconstruction or speculation.

A respectable primary source can still be mistaken or biased. An excellent scholarly explanation can be uncertain about an event date. Make both visible when relevant.

Every pivotal clue and reveal fragment must be linked to identifiable source IDs with stable URLs or bibliographic data. A bare label (“NASA”) is not sufficient for publication; specify document/page/record and what claim it supports. Keep the licensing status of photographs, facsimiles, archival scans and generated illustrations distinct from source truth.

### 4.8 Case editor workflow and content release gate

`Pitch → source discovery → claim extraction → independent dating verification → constraint specification → cultural/sensitivity check → mechanic QA → novice solve test → visual evidence form → citations/rights → publish in versioned pack`.

Require editorial checkboxes:

- Is the central question specific, interesting and answerable?
- Is its target exactly defined and precise enough for integer-year play?
- Do free constraints honestly support a meaningful deduction?
- Does each paid clue retain its target and have calibrated marginal value?
- Are two independent source records available for pivotal or contested facts where feasible?
- Are dates/years correctly converted, uncertainty represented and images licensed?
- Are global coverage, queer/gender history and ordinary life handled without sensationalism?
- Is it enjoyable without memorization and does it avoid a single obvious unearned date-spoiler?
- Is it distinct in interaction shape from nearby cases in the same pack?
- Are historical claims still valid when the puzzle's corridor changes?

No AI-autogenerated unreviewed “fact JSON” in the release pipeline. An LLM can help prepare research leads, but may not silently invent/approve sources or boundaries. Label placeholder copy and “to confirm” content as development-only, never publish it.

### 4.9 Verified reference scene: 1969 (for tutorial and World Reveal)

The prototypes repeatedly use **1969**; treat it as a continuity reference, not proof that every draft is factually ready.

| Scene | Proposed interaction | Editorial grounding |
|---|---|---|
| Concorde 001 first flight, 2 March 1969 | Explore aircraft mechanical drawing: tap features, relate design to speed and noise | Confirm via French aviation museums/Air France/National Museums Scotland with clear prototype vs passenger service distinction |
| Stonewall uprising, starting 28 June 1969 | Read genuine documented excerpts, map/social context and multiple historical voices; explain identity-language choices | Library of Congress, U.S. National Park Service and reputable histories; license or transcribe documents lawfully |
| Apollo 11 lunar landing, 20 July 1969 | Interactively scrub mission milestones with an explicitly schematic orbit view | NASA mission logs and timeline; diagrams explicitly **not to scale** unless they are |
| ARPANET first network message, October 1969 | Watch nodes/packets connect through a sourced network chronology | Internet Society and original archival sources; distinguish network tests, nodes and operational interpretations |
| World population, circa 1969 | Explore a chart with a sourced revision and estimate status | UN World Population Prospects, exact series/version required |

Consider **additional non-U.S. world context** as the editor researches the year. It is insufficient to claim worldwide scope if most chosen events occur in the United States. Different types of stories should visibly take different forms. A fabricated archival scan is unacceptable even as mood-setting “evidence.” Use clearly marked reconstructed illustrations only as illustrative material.

### 4.10 Example day editorial architecture (concept, not release dataset)

| Case | Lens | What the player actually reasons about | Optional reveal form |
|---:|---|---|---|
| 1 | Curious invention | Prototype date vs first common use | Interactive object anatomy |
| 2 | Political institutional change | Relative order of records | Annotated document and timeline |
| 3 | Food and trade | Documentary evidence of a commodity's movement | Trade-flow map, with uncertainty |
| 4 | Queer communities | Historical publication or organization chronology | Source excerpts and civic map |
| 5 | Archaeology | Artifact's age vs date of discovery | Layered object investigation |
| 6 | Medicine and public health | Before/after intervention and source limits | Careful, non-sensational quantitative graphic |
| 7 | Historical overlap | Two simultaneous but surprising lives | Synchronized biographical bands |
| 8 | Asia, Africa, Americas or Oceania | Region-specific historical sequence | Place-sensitive visual reconstruction |
| 9 | Social/economic numbers | Plot reading and estimation constraints | Inspectable data visualization |
| 10 | The convergence | Combined insight from dated case outcomes | Full-scale trail/world atlas transformation |

The pack must not require completing case N correctly to understand case N+1. Case 10 may reference prior revelations but provide the information again for players who missed earlier cases. A thematic connection should be a payoff, not a hidden paywall.

---

## 5. ART DIRECTION: STRATA AS A MEANINGFUL MATERIAL SYSTEM

### 5.1 Historical design decisions from the user's prototypes

The project explored three identifiable routes:

- **Route B — Archive Afterimage:** rich editorial contact-sheet/cyanotype storytelling and strong display typography; rejected as the primary game controller because of dominant blue, similar-looking tiles, tiny year targets and weak spatial agency. Its **multi-form archival reveal idea survives**.
- **Route C — Deep-Time Instrument:** physical dial and intuitive scale changes; rejected as full aesthetic solution because silver/blue industrial styling felt clinical and the dial dominated the display. Its **tactile, physically logical temporal-control principle survives**.
- **STRATA — Time as a Core Sample:** warm paper/bone/ink, geological layers, cut/ruled-out years, a vertical time sample, paper-tagged clues, a precision wheel, and a dark splitting “Found 1969” state. This is the **active direction**, with critique: distinctive but dense hunt UI, tiny notes, excess patterns, and unproven interaction motion. The first STRATA boards depicted a tenable design *system*, not an approved final app.
- **CONVERGENCE gray-box:** clear Evidence / Trace / Lock experiment with strong candidate-set logic but no final STRATA art. Its single-case layout and old economy must **not** be cloned ten times.

Previous review heuristics (subjective, not user test results): Route B ~**7.2/10**, Route C ~**7.7/10**, STRATA **8.3/10 concept**, but **6.7/10 demonstrated implementation readiness**. These are reference judgments; the final design must earn approval through real interactions, not by repeating scores.

### 5.2 What makes STRATA coherent

History behaves like a **stratified physical specimen**: a navigable column of temporal layers marked by readable cuts, seams, mapped evidence and committed guesses. The metaphor has three semantic parts:

- **Rock / layer / grain = passage, duration, temporal texture and evidence of change.** The pattern is a visualization grammar, not arbitrary wallpaper.
- **Instrument / ruler / locator = player control and precision.** Everything that resembles a control must actually work.
- **Paper / archival fragment / diagram / photograph = what evidence reveals about the people living in time.** Reconstructed images are not fake primary records.

When players narrow a corridor, they should perceive their ignorance being **cut away**. When a case is solved, the stratum opens into a human world. When ten cases are complete, the earlier fragments reassemble into a coherent editorial atlas.

### 5.3 Visual character: distinctiveness without anachronistic nostalgia

Use a carefully engineered hybrid of geological sections, printed scientific diagrams, modernist book design, archival material culture and striking contemporary editorial typography. Include selective irregular registration, fine tactile paper grain, mechanical ruler marks and purposeful asymmetry. Do not imitate any specific living designer's artwork or trade dress.

**Do not use:** all-over parchment or generic sepia, nonstop grain as visual noise, cobalt/cyanotype as the dominant palette, glassmorphism, neon gradients, three-dimensional spinning globes with no informational role, AI-generated “historical photos,” ornamental clocks that do nothing, repetitive rounded cards, endless dots, generic monuments/silhouettes, fake maps/borders, lazy pictograms or oversized dashboards of KPIs. Do not render text/date labels inside generated illustrations.

A good phone screenshot must be legible without explaining the metaphor. The game's shape language should survive **grayscale**, low-resolution thumbnails and 24–64px app-icon sizes. Beauty cannot come at the cost of a comprehensible next action.

### 5.4 Color: Oxide & Bone as canonical starting tokens

| Token | HEX | Purpose | Rule |
|---|---|---|---|
| `bone` | `#F2ECE0` | Main canvas; calm reading field | Default active-light surface |
| `paper` | `#FBF7EF` | Editorial notes and reveal surfaces | Keep contrast meaningful, not barely visible |
| `coal` | `#241F1B` | Primary ink, measurements, controls | Main body text |
| `soot` | `#171817` | Dark solved state and nighttime reveal | State transition, not every screen |
| `vermilion` | `#B4412D` | Current chosen year, committed actions | Use sparingly and consistently |
| `patina` | `#526A57` | Live candidate/evidence corridor | Pair with pattern and text; not color alone |
| `brass` | `#D4B058` | Rarely found answer, solved transition | Do not use as small text on Bone |
| `paleRust` | `#E6B6A4` | Quiet supportive fill | Avoid overuse |
| `mutedInk` | `#675F55` | Secondary captions on light | Test in actual layout |
| `mutedDark` | `#A59D8E` | Captions on Soot | Never tiny against textured fill |
| `stone1` | `#D8CDB7` | Subtle decade tone | Reduce decorative variability |
| `stone3` | `#B4AE95` | Secondary stratum | Use only with semantic role |

**Known token-pair contrast ratios, rounded (from previous design audit; recheck composited runtime UI):** Coal/Bone **13.87:1**; MutedInk/Bone **5.34:1**; Patina/Paper **5.52:1**; Bone/Vermilion **4.78:1**; Bone/Soot **15.13:1**; Brass/Soot **8.61:1**; Coal/Brass **7.89:1**; **Brass/Bone 1.76:1 FAIL for ordinary small text**; **PaleRust/Bone 1.54:1 FAIL** for text. Typography size, texture, antialiasing, opacity and overlays can change practical readability, so token contrast is not sufficient to certify accessibility.

**State rules:** selected/committed year = Vermilion plus a shape/label; available candidate region = Patina plus a clear edge/pattern; excluded by guess = diagonal hatch plus labeled directional boundary; excluded by evidence = stipple or a distinct pattern plus tag; past guess = location mark with text; solved = open seam plus Brass and explicit “Found”; zero-value clue = neutral free-context label, not “bad hint.” Do not use emotional color semantics that cast queer history or traumatic subjects as dangerous.

The user does **not** like the earlier blue. If a design introduces blue, it must make a strong, documented semantic case and ask approval; otherwise **do not** add it.

### 5.5 Typography: three roles, one logic

The latest supplied STRATA concept uses:

1. **Young Serif**, or a similarly distinctive, well-tested editorial display face, for major years and chapter openings (not paragraphs of tiny copy).
2. **Sofia Sans Extra Condensed**, or a similarly robust condensed numerical/measurement face, for timeline ticks and calibrated labels. Make numerals truly readable; provide tabular number alternatives.
3. **Sofia Sans**, or a credible highly legible family, for the reading interface, descriptions and sources.

This is a **starting design system**, not a mandate to use unavailable fonts or violate licenses. Test different weights, optical sizes and real rendered glyphs at small phone widths. A decorative 10px source note is not acceptable just because its font looks sophisticated on the board.

Baseline typography targets (to test on devices): important body text around **16–18 CSS/DP-equivalent px**; critical action labels not smaller than **15–16**; secondary source text generally **12–14+** with disclosure when required; display numbers may vary widely if they never occlude controls. Test enlarged font settings at **100%, 130%, 160%, 200%**. Preserve real text (not embedded raster copy), accessible names, text selection/source copying and long-language wrapping.

**Localization:** English first unless user chooses otherwise, but architect the UI for Georgian from day one (full Unicode, plural categories, historical BCE/CE localization, no hard-coded left/right or fixed string widths). Before declaring Georgian supported, test actual **Georgian fonts with comparable readable body proportions** and date/number formatting. Do not assume English display faces contain Georgian characters.

### 5.6 Texture hierarchy and icons

- **Macro:** restrained stratum bands that communicate time scale or phase.
- **Meso:** different exclusion patterns that communicate source of narrowing.
- **Micro:** subtle ink grain on selected illustration surfaces, never to the detriment of tiny text and tick labels.
- Create a consistent stroke language for markers, cut notches, source pins, rulers and connector lines; use source evidence and action semantics, not generic traveler icons or cartoon citizens.
- Revisit the earlier STRATA **slipped strata / vermilion cut** app icon. Test it masked, grayscale and at 24/32/48/64px. Make sure it reads as an intentional image, not a loading bars symbol.
- Avoid decorative sound effects suggesting simulated scientific measurement. Use a small, optional palette of tactile confirmation sounds/haptics tied to actual actions: selection, evidence acquired, Lock, seam open. Offer mute and reduced haptic settings. Never use surprise noise in the tutorial.

### 5.7 Essential screen hierarchy

**Home / Daily Trail:** ten case marks or slots, 8-point shared reserve, current case, date/reset info, clear Start/Continue, Practice and Archive. The ten slots should themselves form a *visual historic route*, not ten indistinguishable rectangular cards. The first screen must quickly communicate the actual ten-case mission, unlike the earlier “one hidden year” STRATA home. A completed case's location should remain visible without revealing future answers.

**Case / hunt screen:** one focal question, one dominant selected year, concise `valid candidates`/`range` label, clear 1–3 free evidence fragments, one dominant time-navigation controller, Evidence/Trace/Lock actions and remaining eight-point **shared** balance. Minimize persistent logs and chart-overprinted paragraphs. Show only state needed for the next action; put the rest behind purposeful expandable details.

**Evidence sheet:** informative preview **without temporal leak**; exact cost in Insight, sources/precision after reveal, clear confirmation of resulting cuts. Use “Reveal · 1 Insight,” not “Buy 1.” A no-value fact is “Free context,” not a charged clue.

**Lock state:** the exact chosen stratum opens into an answer. On success show the number in its own territory; on miss reveal the answer without shame or long failure animation. The user moves immediately to the next case.

**Daily Trail / end-of-day view:** ten dated marks; visually distinguish solved, assisted, missed, context; show total solved, spent/remaining Insight, meaningful links; no misleading luck badges or achievements calculated from arbitrary numbers.

**World Reveal:** a user-controlled, explorable short journal/atlas that uses genuinely different evidence-specific interfaces: drawing, text/object, mapped movement, document reading, small statistic, lived-experience collage, chronological comparison. End with a real interpretive question or surprising comparison, not a generic lesson.

---
## 6. INTERACTION AND MOTION: MAKE TIME A PLACE, NOT AN ANIMATED SLIDER

The user explicitly prioritizes **path-scrolling, zooming into and out of time, seamless transitions, and a uniquely mobile gesture language**. This is a core product requirement, but it must be shown in a **functioning prototype**, not merely described beside static screens. Excessive animation would undermine the fast deduction loop; reserve cinematic moves for the moments when information becomes meaningful.

### 6.1 Three nested navigational scales

**Scale A — The Daily Trail:** The ten puzzles form a temporal constellation. A navigable path travels between dated case markers after their solutions are shown. Zoom out to perceive which were separated by decades or millennia, and show thematic connections without implying equal temporal spacing. Respect chronological scaling; if using compressed or nonlinear spacing, label it unmistakably.

**Scale B — The Case Camera:** Each puzzle has a legible time field containing its possible dates and exclusions. Pan/scroll to change the viewed area; zoom between century/decade/year context; maintain a stable year under the pointer during pinch. The active year locator is distinct from the camera center and candidate corridor.

**Scale C — The World Reveal:** Once a case or day is solved, the selected stratum unfolds into a set of evidence worlds. Here the interface may move from a small mark to an object anatomy, map, primary document or quantitative graphic. This is the space for expressive, optional storytelling and surprising transitions.

**Never make a winding path the only way to select an exact year.** Path-scrolling guides the *camera/story*; a ruler or editable year control handles *numerical precision*. Don't trap the vertical page scroll or steal every swipe on the screen. Avoid horizontal scroll as the mandatory way to read long passages.

### 6.2 Temporal camera: mathematical requirements

Represent a camera by `centerTime`, `scale` (e.g., years per logical pixel), `viewportWidth/Height`, `focalTime` and optional scene-path progress. Define `timeToScreen(t, camera)` and `screenToTime(x, camera)` as inverses within tolerance. If a vertical time axis is used, adapt coordinates accordingly. When zooming around a pinch focal point `f`, choose the new camera center so that the **same temporal coordinate remains underneath `f`** before and after zoom.

For a linear illustrative axis:

```
screenX(t) = viewportCenterX + (t - centerYear) / yearsPerPixel
focusTime = screenToTime(pointerX, oldCamera)
newCenterYear = focusTime - (pointerX - viewportCenterX) * newYearsPerPixel
```

This example is one-dimensional; use the analogous transform for the actual vertical STRATA ruler or a two-dimensional world path. Use floating-point camera coordinates; snap to exact integer years **only on explicit selected-year adjustment**, not on every camera movement. Support BCE/CE using internal normalized coordinates without visible year zero. Avoid floating-point instability at very large deep-time ranges; use local origins or precision-safe transforms. No animated interpolation may accidentally change the selected or submitted year.

**Semantic zoom:** at broad scale show centuries and large region labels; at mid scale decades and major date marks; at close scale years and relevant evidence cuts. Do not simply magnify 100 tiny labels. Zoom should not spawn expensive DOM/native views for every possible year. Use virtualization, coarse-level aggregation or viewport rendering.

### 6.3 Three gesture channels that do not fight

1. **Navigate** (one finger drag/wheel/scroll depending platform): move in time or move a clearly labeled tactile selector. Choose one principal behavior; don't confuse dragging the specimen with dragging the selector. Define boundaries, inertial friction, overscroll and snap behavior through tests.
2. **Zoom** (pinch, wheel modifier or dedicated control): change years-per-screen-unit, anchoring the finger focal date. Provide clearly marked `+`, `–` and **Fit possibilities** alternatives.
3. **Inspect** (tap/keyboard focus/assistive action): open the relevant source/boundary/evidence panel without moving the selected year. A close action restores the exact previous camera state and focus.

Every gesture must have a non-gesture equivalent: `−10`, `−1`, `+1`, `+10` or an accessible stepper, optional direct numeric year entry, Fit corridor, Next/Previous case, Open/Close evidence. Enlarge gesture handles in effective hit area without making the artwork cartoonishly oversized. Aim for comfortably tappable 44–48+ pt/DP equivalents for frequent controls, while testing against platform guidance; WCAG 2.2 AA's web target minimum is 24 CSS px with exceptions, not a recommended size for precision play.

### 6.4 Six signature motion sequences (prototype each)

| Trigger | Spatial continuity | Desired feeling | Reduced-motion equivalent |
|---|---|---|---|
| Daily entry → Case 1 | One blank stratum separates from ten-mark Daily Trail | Invitation into a historical sample | Immediate state change plus brief label fade |
| Pinch century → year | Ruler recuts itself; larger ticks split into smaller calibrated ticks | Precision emerging | Discrete zoom steps, no scale flight |
| Reveal evidence | Tagged document/diagram slides into the exact related temporal cut; return restores camera | Evidence physically changes knowledge | Static sheet with explicit before/after candidate count |
| Trace | Needle/locator becomes a cut; infeasible interval retracts or hatches | A test has consequences | Direct marker + text `Earlier` / `Later` |
| Lock | Same chosen line opens into found date or gentle miss state | Release and understanding | Instant result with persistent mark and readable explanation |
| Ten-case finale | Zoom out from last solution to the ten case points, then travel a connected path into multiple historical evidence forms | “History is larger than this answer” | Static overview with numbered chapters and normal navigation |

**Object permanence:** The red selected-year marker should become the red cut/solved boundary, not dissolve into unrelated sparkles. Keep visual correspondences between before and after. If a visualization changes meaning, introduce a label or transition indicating the new representation; never morph a measured axis into a decorative graphic that might imply false numeric continuity.

### 6.5 Narrative path-scrolling / scene architecture

The World Reveal should work like a beautifully directed interactive essay, but should not force the player through a long linear lesson. Use **native vertical reading behavior** as the default and selective sticky scene sequences for signature moments. In a pinned stage, scrolling may move the camera along a meaningful route, zoom into a source object or change from map to document; as soon as the interaction is complete, normal reading resumes. Never trap wheel/touch gestures, require horizontal scrolling to complete, or make users scroll backwards blindly to exit a scene.

Use consistent storyboard notation: `scene`, `camera`, `time coordinate`, `player gesture`, `object continuity`, `annotation`, `source status`, `exit`, `reduced-motion alternative`. For each path transition produce a still storyboard **and an interactive demonstration / recording** with exact durations measured, not only promised.

### 6.6 Performance and motion budgets

- Target fluid frame delivery on representative mid-range iOS and Android phones, aiming for 60 fps on 60Hz displays; on higher-refresh devices respect native capabilities without promising 120 fps universally. A 60Hz frame has about **16.7 ms** total; set measurable JS/UI-thread budgets and profile real release builds.
- Suggested, testable interaction-duration ranges: selection feedback **100–220 ms**; candidate recomposition **250–450 ms**; evidence sheet **250–500 ms**; solved stratum split **500–900 ms**, always skippable; World Reveal cross-scene transitions **350–700 ms** where user-controlled movement makes sense. These are guidelines, not mandatory delays.
- Avoid continuous expensive grain redraw, excessive blur, particle fields, background parallax for its own sake, large native view counts, state changes for every animation tick on the JS thread, and forced waits for decorative animations.
- Animated layers should only exist when actually necessary; cache patterns/assets and tune the rendering method based on device profiling. Pause offscreen motion and allow interruptions.
- Persist camera state during app background/resume; discard an obsolete animation gracefully if the player jumps to a new case.
- Always respect operating-system Reduce Motion; support a deliberate in-game Reduced Motion switch if feasible. Equivalent gameplay is mandatory, not a degraded consolation mode.
- Provide screen-reader descriptions of candidate counts, evidence status, Trace result, current case, shared Insight and Lock consequences. Do not encode states solely with colors or textures.

### 6.7 Responsive acceptance tests for motion and navigation

Test at widths approximately **320, 360, 390, 430+ logical px**, plus landscape/tablet behavior (explicitly supported or carefully constrained). Test low-end and mid-range devices, 60/90/120Hz where available, OS font scaling and screen-reader navigation. Verify:

- Pinch anchor keeps the same time under the fingers within an agreed tolerance.
- Selector remains precise to exactly one year at maximum supported zoom.
- Ruler works without multi-finger gestures.
- Candidate number agrees with engine despite pan/zoom and gaps.
- No accidental Lock due to panning, scroll-end or stacked gestures.
- Evidence returns to identical zoom/center/selected year after closing.
- All buttons remain tappable with large type and safe-area insets.
- App can be operated in monochrome and with reduced motion.
- No forced animation blocks quick expert play.
- Ten solved markers remain navigable and distinguishable on the Daily Trail.

---

## 7. INTERFACE MAP, MICROCOPY AND STATE INVENTORY

### 7.1 Architecture of the product

```
TIMEHUNT
├── Daily Ten (primary)
│   ├── Today / Daily Trail / start-resume
│   ├── Case 01–10
│   │   ├── Free Dossier
│   │   ├── Temporal Camera / candidate field
│   │   ├── Evidence sheet (Nudge / Deep Clue)
│   │   ├── Trace (optional)
│   │   ├── Lock / result / source notes
│   │   └── Return to Daily Trail
│   ├── Connecting moments after cases 4, 7 (optional)
│   ├── Expedition results / shared-bank breakdown
│   └── World Reveal / ten-point atlas
├── Practice (independent, repeatable, non-scoring)
├── Archive (past completed Daily Tens, read-only)
├── Learn to Play (interactive mini-case, no budget cost)
├── Sources / How we know (contextual citations and data transparency)
└── Settings (accessibility, sound, language, data/privacy)
```

Do not create an account requirement for first play. A daily case can be enjoyed without a subscription and without accepting optional analytics.

### 7.2 Screen-by-screen data required

**Home:** Date and reset reference zone; Daily Ten challenge number; Case N/10; shared Insight `8 total / X left`; current progress trail; one CTA; clear Practice/Archive; progress recovery state; sources/about. Do **not** show future target dates. A completed year becomes visible only after its case is locked or revealed.

**Tutorial:** a micro example with one or two free documents and an obvious inference, then a zero-cost demonstration of optional paid clue decision in a sandbox. Clearly state that spending in tutorial has no daily consequences. Allow skip/replay.

**Case intro:** precise question, answer unit, initial valid range and evidence fragments. Avoid abstract “somewhere here” if a handful of visible years are not the entire allowed set. Cite/call out source records when inspected.

**Hunt:** active year and possible set/corridor, shared Insight, case number, free evidence summaries and state controls. Collapsible previous deductions, accessibility-first numeric entry and ruler. Do not pin long copy over textures or marks.

**Evidence:** preview respects unknown information, shows exact price and availability, records acquired clue/redundancy, persistent sources/constraints. If no Insight remains, free evidence remains usable and paid options explain why disabled without shame.

**Trace:** show exact tested year and explicit cost before test. State result as “target is earlier than 1972” rather than ambiguous arrows; new candidate set and count are narrated as well as drawn.

**Lock:** intentional confirmation via clear button label `Lock in 1969`, state-dependent disabled rules, immediate accurate result; no earlier/later on miss. One-Lock and two-Lock variants must not share ambiguous labels.

**Case resolved:** show the result, how the evidence converged, one surprising/contextual insight, exact source, Continue. Skipping story does not remove progress. An unsolved case is still marked and included in the user's ten-point trail once revealed.

**End-of-day:** ten-case trace, total solved, clean/assisted count, Insight spent/remaining, wrong attempts, meaningful cross-case relationships; a minimalist shareable spoiler-free result and access to the atlas. Do not shame low scores or misrepresent skill.

**World Reveal:** timeline navigation, optional geography comparison where supported, and interactive stories in different evidence forms. Different historical periods need distinct research-based media forms; do not force every story into the same four-panel template.

**Settings:** reduced motion, contrast, sound/haptics, font scaling support, language, privacy/analytics, reset local data with confirmation, version and content source details.

### 7.3 Essential error/empty/edge states

Specify visuals, copy and recovery behavior for: no network; available offline pack; missing next-day pack; corrupted pack; content-patch mismatch; no clue purchase value; insufficient Insight; zero Insight remaining; exhausted Lock; invalid date entry; BCE/CE format issue; empty candidate set due to content bug; interrupted app during purchase; duplicate tap; long loading; font not loaded; zoom beyond limits; already solved case; day reset during session; app resumed after midnight; mixed-version daily challenge; source URL broken; optional content flagged as sensitive; no images due to licensing. None may silently lose the player's eight shared Insight or completed dates.

**Example microcopy (draft, to test):**

- “10 mysteries. 8 Insight. Make every clue count.”
- “There are 4 possible years left.”
- “That evidence tells you nothing new in this range. Read it free.”
- “Trace 1972 — Use 2 Insight to find out whether the answer is earlier or later?”
- “Lock 1972 — This is your final answer for this case.”
- “Not this year. Here's what the sources tell us.”
- “Case 7 of 10. You have 3 Insight for the remaining four cases.”
- “One year, several worlds.”

Avoid cold internal words (`predicate`, `marginal entropy`, `candidateSet`) in public UI; these belong in developer/editor views. Avoid treating missed cases as personal failure (“You weren't clever enough”).

### 7.4 Share cards and social replay

Design two spoiler policies: a spoiler-free same-day card shows ten result marks, Insight spent and a simple expressive path **without dates/clues**; an optional spoiler-rich post-reveal card can show the full atlas after an explicit warning. Both must function without personal data, automatic tracking links or coercive invitations. Support sharing via platform UI if available and accessible text alternative for copy/paste. Do not pressure users into inviting friends to recover lost resources.

---

## 8. TECHNICAL ARCHITECTURE — MODERN, MAINTAINED AND TESTABLE

### 8.1 Technology-selection rule (2024–2026+)

The user's requirement is to work with **maintained, documented approaches prevalent in the past three years**, not to pretend that older foundational practices are invalid. **Before choosing packages or generating production code, browse official compatibility/release notes and record verification date.** Use a stack decision document comparing:

- **React Native / Expo / TypeScript:** recommended starting candidate for a mobile-first, touch-and-gesture-heavy, offline-capable iOS/Android application. At the time of this brief, **Expo SDK 58 (Oct 2026)** is available with **React Native 0.88** and **React 19.3**; verify current compatibility, installed runtime, tooling, New Architecture requirements, licenses and breaking changes when building.
- **Web-first PWA:** viable if instant browser distribution, link sharing and iteration speed outweigh native haptic/gesture constraints; prototype real mobile pinch/pan, offline behavior and browser navigation before assuming it suffices.
- **Native SwiftUI + Jetpack Compose:** consider if camera/render interaction requirements or platform-specific feel justify two implementations; evaluate development burden and test coverage honestly.

Potential supported libraries **subject to official version check**: Expo Router, expo-sqlite, Reanimated 4.x, React Native Gesture Handler (currently supported API), suitable drawing/canvas primitives, runtime schema validation (e.g., Zod or equivalent), maintained accessible components, test frameworks supported by installed SDK, EAS build/update tooling. Reanimated 4.x requires React Native New Architecture; don't cargo-cult legacy APIs. Verify library/framework exact compatibility; do not invent current versions or install every fashionable package.

**Do not force Expo if the user is continuing an existing working web prototype and a staged migration is less risky.** Stage 0 audits the code; Stage 7 approves architecture. Use the existing `convergence.html` as a rules reference only if its logic is actually consistent; no attempt to reuse its fixed-width DOM and tangled state is mandatory.

### 8.2 Architecture boundaries

```
┌──────────────────────────┐
│ UI / navigation          │  screens, accessible inputs, i18n
├──────────────────────────┤
│ Motion / Temporal Camera │  transforms, gestures, render optimizations
├──────────────────────────┤
│ Application Controller   │  current case, commands, transactions
├──────────────────────────┤
│ Pure Game Engine         │  candidate sets, Evidence / Trace / Lock, score
├──────────────────────────┤
│ Editorial Content        │  dates, source records, clue predicates, packs
├──────────────────────────┤
│ Persistence / Sync       │  offline records, migrations, daily identity
├──────────────────────────┤
│ Optional Network         │  content delivery, integrity, analytics opt-in
└──────────────────────────┘
```

**Key rule:** The game must run headlessly in unit tests. The engine must not import React components or read the DOM. Historical facts must not be hard-coded into UI branches. Motion cannot mutate the answer. Persisted state is the authority for the shared bank. The content schema must be validated at ingestion before a pack is offered for play.

### 8.3 Representative typed model (adapt after architecture approval)

```ts
type CaseId = string;
type DailyId = string; // e.g. UTC-date + region/language variant

type DatePrecision = 'day' | 'month' | 'year' | 'decade' | 'range';
type DateBasis = 'gregorian' | 'julian' | 'astronomical-year' | 'other';
type EvidenceRole = 'free' | 'nudge' | 'deep' | 'context';
type CaseStatus = 'not_started' | 'active' | 'solved' | 'missed' | 'revealed';

type Source = {
  id: string; institution: string; title: string; url?: string;
  publicationDate?: string; accessedOn: string; documentLocator?: string;
  dateBasis?: DateBasis; datingPrecision?: DatePrecision;
  confidenceNote: string; rights?: string;
};

type Constraint = {
  kind: 'between' | 'before' | 'after' | 'allowed-set';
  // Internal integer years; no player-visible historical year zero.
  from?: number; to?: number; inclusive?: boolean; years?: number[];
  editorialReason: string; sourceIds: string[];
};

type EvidenceItem = {
  id: string; caseId: CaseId; role: EvidenceRole;
  category: string; format: 'document'|'object'|'diagram'|'map'|'data'|'narrative';
  teaser: string; text: string; cost: 0|1|2|3;
  constraints: Constraint[]; correlationGroup?: string;
  sourceIds: string[]; verified: boolean;
};

type HistoricalCase = {
  id: CaseId; title: string; question: string;
  startYear: number; endYear: number; targetYear: number; targetPrecision: 'year';
  freeEvidenceIds: string[]; optionalEvidenceIds: string[];
  sourceIds: string[]; regionTags: string[]; eraTags: string[];
  sensitivityTags: string[]; revealStoryIds: string[];
};

type CaseProgress = {
  caseId: CaseId; status: CaseStatus; selectedYear: number;
  acquiredEvidenceIds: string[]; traceHistory: Array<{year:number; result:'earlier'|'later'|'same'}>;
  lockHistory: Array<{year:number; correct:boolean}>;
  remainingYearSet: number[]; camera?: {center:number; yearsPerPx:number};
  startedAt?: string; completedAt?: string;
};

type DailyExpedition = {
  dailyId: DailyId; contentVersion: string; contentHash: string;
  caseIds: CaseId[]; // EXACTLY 10 for the main daily format
  insightInitial: 8; insightRemaining: number;
  currentCaseIndex: number; caseProgress: Record<CaseId, CaseProgress>;
  status: 'not_started'|'active'|'completed'; lastUpdatedAt: string;
  score?: number;
};
```

**Never use this example blindly without resolving**: whether target bounds are inclusive; what each constraint means for unknown/contested dates; content immutability; daily reset rules; versioned currencies; and how to prevent a teaser from disclosing a solved target. Schema is a conceptual starting point, not proof a content set is valid.

### 8.4 Engine commands and transactional transitions

```ts
type Command =
  | {type:'SELECT_YEAR'; caseId:CaseId; year:number}
  | {type:'FIT_CANDIDATES'; caseId:CaseId}
  | {type:'REVEAL_EVIDENCE'; caseId:CaseId; evidenceId:string; actionId:string}
  | {type:'TRACE'; caseId:CaseId; year:number; actionId:string}
  | {type:'LOCK'; caseId:CaseId; year:number; actionId:string}
  | {type:'ADVANCE_CASE'; fromCaseId:CaseId}
  | {type:'RESUME_EXPEDITION'};

function transition(
  state: DailyExpedition, command: Command, content: ContentPack
): {next:DailyExpedition; events:GameEvent[]} {
  // Pure, deterministic rules; return result or typed error.
  // Validate active case, currency, reveal status, uniqueness of actionId.
  // Apply constraints and deductions; enforce target containment invariant.
  // Transition with no mutation on invalid/duplicate purchases.
  throw new Error('implement after approved Stage 2');
}
```

Use idempotent action IDs for Insight purchases and Locks. Persist the state change and budget debit as a **single transaction**. Duplicate taps or app restarts must not double-charge. If a content pack is invalid, fail the pack validation before players start. Store an append-only local event log or equivalent auditable command history for diagnosis and replay; control its size and privacy.

### 8.5 Content pack and daily identity

- Daily pack contains exactly ten distinct case IDs, content version, publication time, reset zone, language, content digest, and complete sources needed offline.
- Daily seed/selection must be deterministic and auditable, with editorial overrides for quality, diversity and crisis/sensitivity review. Deterministic randomness cannot replace human source validation.
- **Important security tradeoff:** Offline play requires distributing the target and data to clients (or an equivalent verifiable secret mechanism); an expert can inspect assets and discover answers. Do not claim full anti-cheat secrecy under offline-first design. Decide whether ordinary casual puzzle fairness or server-authoritative competitive integrity is a priority, and state the tradeoff.
- Daily puzzle must not mutate mid-day due to content updates; versioned snapshot of the pack and migration behavior preserve consistent progress.
- At reset, retain a safely resumable session or explicitly disclose expiration rules; never silently clear partially completed work.
- Ensure repeatable behavior across timezones: distinguish **display date** from **daily challenge identity**. Consider a UTC reset plus local time display for equal challenges; get approval and be transparent.
- Store solved/seen case IDs to avoid repeats in Practice where reasonable, while not permitting unlimited play to leak upcoming daily answers through a shared content pool.

### 8.6 Testing matrix and invariants

**Unit/property tests:** all targets survive constraints; every marketed “narrowing” clue removes something in its qualifying contexts or is free; intersections are associative/idempotent; a previous purchased clue cannot charge again; purchases are atomic and nonnegative; wrong Lock never gives earlier/later; no premature termination of Daily Ten; cases do not share candidate sets; all ten ordered case IDs are unique; score can never reward 0 solves above 10 solves merely from unused resources; BCE/CE calculations; date precision/interval boundary.

**Content tests:** no source placeholder in publishable pack; no broken required source record; all references resolvable; every hard boundary supported; no future target appears in teaser; optional clue previews leak no inferred cut; cross-case bridge facts don't require previous success; source edition and image license status.

**Integration tests:** reopen after clue purchase; airplane-mode restart; same-day content update; wrong Lock → next case; case 10 complete → atlas; share card spoiler policy; daily reset across timezone/DST change; screen-reader reading order; scaled fonts.

**Device QA:** real Android/iOS phones including smaller screens, text enlargement, reduced motion, VoiceOver/TalkBack, low connectivity, slow CPU, rotated screen where relevant, long or translated copy, background/resume, memory pressure, native safe areas, high-refresh and 60Hz profiling.

**Human playtests:** realistic player comprehension and emotional response—simulations cannot establish these. Separate measured data from design intent. Seek contradictory observations and refine the engine before glossy polishing.

### 8.7 Security, privacy, growth and ethical boundaries

The first launch must work without login. Collect minimal technical telemetry with consent and clear opt-out; avoid granular invasive tracking or health/personality inference. Keep children and teens in mind, follow applicable platform requirements, and determine age rating based on actual content. No paid Insight, purchasable guesses, streak-repair sales, loot boxes, deceptive notifications, energy timers, engineered near misses or unavoidable social sharing. If monetization is considered later, use transparently priced, non-advantage options or voluntary support, with a separate approval stage.

Data deletion/export should be understandable. Do not send raw play histories to third parties by default. Open external source links deliberately, with clear context and robust fallback. Protect content/admin tooling, validate all pack inputs, and use least-privilege credentials in CI. Never put API secrets in client bundles.

---
## 9. EXECUTION ROADMAP — SIXTEEN HARD-GATED STAGES

**This is an instruction to work sequentially, not a suggestion.** In each stage, show one concrete result, critiques, risks and the exact checkpoint. Do not run Stage N+1 in the same response. When a stage needs the previous one's artifacts, reuse them rather than regenerating giant explanations. When user feedback invalidates a past assumption, document it and reopen the relevant stage with permission.

### Standard checkpoint report template for EVERY stage

```text
STAGE N — [EXACT NAME]
1. Summary: what was actually accomplished (not merely proposed)
2. Artifacts: concrete file paths/links, exact changed files
3. Demo: screenshots/video/live test; what it proves and does not prove
4. Critical self-review: top 3 weaknesses and how to test them
5. Decisions and rationale; two credible alternatives
6. History/source confidence and accessibility impact
7. Risks, unknowns, unresolved dependencies
8. Acceptance criteria: PASS / FAIL / NOT TESTED + supporting proof
9. Updated decision ledger and handoff notes
10. Feedback questions (at most 3 focused, substantive questions)
CHECKPOINT — STAGE N: [NAME]
... [mandatory approval sentence]
```

### STAGE 0 — Audit the existing TIMEHUNT project and migration requirements

**Goal:** Truthfully understand the current repo, previous source documents and playable files; establish the safest migration into Daily Ten.

**Must do:** Inspect repository tree, toolchain, scripts, package locks, `convergence.html` if present, existing STRATA assets, tests, current data format and deploy flow. Distinguish the user-provided HTML, agent's screenshot boards, research docs and actual runnable source. Use the supplied mockups as references, not as permission to copy arbitrary layout. Note the old single-case assumptions and their affected components. Identify which assets are licensed/owned. Scan for hidden source-of-truth duplicates, stale dependencies, visual components that were never actually made interactive and any test that only checks static invariants. Initialize documentation/handoff files listed earlier.

**Deliver:** `docs/PROJECT_VISION.md`, `docs/DECISIONS.md`, `docs/STAGE_STATUS.md`, `docs/HANDOFF.md`, repo audit with file tree and a migration impact map by component, table of verified vs claimed prototype behavior, and blockers. Do not rewrite the app yet.

**Pass:** Exact repo state known; contradictions with Daily Ten identified; user can see what survives and what needs replacement.

**STOP — request `APPROVE STAGE 0`.**

### STAGE 1 — Product research, player jobs and competitive differentiation

**Goal:** establish why people would choose TIMEHUNT instead of a trivia game or ordinary year-guessing puzzle.

**Must do:** Review official/documented examples of Globle, Chronophoto, TimeGuessr, contemporary rule-switching/deduction games and interface-led independent games. Separate verified mechanics from assumptions and do not copy graphic identities. Evaluate at least three player types (history novice, casual daily puzzler, history enthusiast) and at least two accessibility contexts. Identify why single-year earlier/later failed, why shared resources might succeed, and where ten cases could become exhausting. Analyze onboarding, information gains, daily ritual, ethical replayability and break points.

**Deliver:** linked competitor matrix, differentiation statement, three player scenarios, “why a wrong answer is still interesting” analysis, six falsifiable product hypotheses, and top ten retention risks. Do not implement gameplay yet.

**Pass:** TIMEHUNT cannot accurately be dismissed as “Globle with dates” or “ten quiz questions with currency.”

**STOP — request `APPROVE STAGE 1`.**

### STAGE 2 — Daily Ten economy and formal rules (decision before code)

**Goal:** solve the most fundamental problem: what is the fun, fair, strategically interesting action loop for **ten cases and eight shared Insight**?

**Must do:** Specify state machines for Evidence, Trace, Lock, candidate-set intersections, candidate gaps, free dossier, clue previews, daily bank and failure. Explore at least four variations: (A) one Lock/case, Trace cost 2; (B) two Locks/case, Trace 2; (C) evidence-first, Trace absent/capped; (D) contrast condition with six cases but same 8 Insight solely as a fatigue control—not a replacement for the user's preferred ten. Propose clue prices and exact marginal-utility checks. Compute worst-case and best-case information policies, score exploits, Trace-first domination and lock-spamming risk.

**Simulation honesty:** Provide source code, seeds, target distributions and strategies. Reproduce and explain the earlier claimed 63–70% Trace-only rate; if unavailable, state it cannot be verified. Include exact or enumerated results when possible; no fake human success rates. Show a rulebook understandable to a 13+ new player. Treat the opening dossier as free and not a hidden fourth action.

**Deliver:** `docs/RULES_CANDIDATES.md`, `docs/ECONOMY_EXPERIMENT.md`, formal candidate mathematics, action table, simulation scripts/tests, visual flowchart and recommended variant with explicit weaknesses.

**Pass:** There is a rigorous rule proposal, economy comparison and no obvious reward for refusing to solve cases or buying valueless clues. It is not yet “balanced” until users play.

**STOP — request `APPROVE STAGE 2`.**

### STAGE 3 — Historical content architecture and first ten-case dossier

**Goal:** design ten logically fair mysteries across varied historical contexts with excellent sources.

**Must do:** Research at least 15–20 candidate topics so the final ten can be curated. For each candidate, record exact target definition, 2–3 free fragments, their machine constraints, 1–3 optional clues, potential redundant links, dates/precision/calendar, editorial delight, source citations and global/era perspective. Demonstrate a novice solving from **free evidence** without relying on memorized year facts. Include source-intensive example(s) with queer and everyday-life history, quantitative data, non-European regions and a surprising coexistence relationship. Where sources are missing or ambiguous, mark **HOLD FOR RESEARCH** and substitute a better case; do not fabricate precision. Specify “discovery vs event” dates clearly.

**Deliver:** first `daily-pack-draft.json` schema-valid where feasible, ten editorial case sheets, source bibliography with URLs and document locators, proposed 4/7 milestone connections and finale thesis, coverage/bias audit, clue leakage audit, and review-ready sample player explanations.

**Pass:** Every intended publishable hard boundary has a traceable source and time convention; no basic case requires paid Insight just to function.

**STOP — request `APPROVE STAGE 3`.**

### STAGE 4 — Working Daily Ten gray-box, no art polish

**Goal:** replace the provided one-case prototype with a functional, resumable ten-case game **before** production visuals.

**Must do:** Implement pure candidate engine, ten-case progression, shared eight-Insight bank, transaction-safe purchases, free dossier, chosen Lock variant, correct/missed results, source display, resumed local state, clear score, simple Practice mode. Use semantic, legible controls; a plain year selector is fine for this stage. Provide switchable test variants if they can be isolated cleanly. Demonstrate case 1→10, including missing a case, paying on cases 2 and 7, spending the last token, reloading mid-purchase and finishing with zero Insight. Include deterministic replay and a no-Trace run.

**Deliver:** runnable build and exact run instructions; engine tests, documented JSON fixtures, video of real interactions, test report, seed reproducibility and a fail-safe for invalid packs. **Do not** spend time implementing STRATA animations at this stage.

**Pass:** Ten cases work; budget does not refill, double-charge or go below zero; no failure ends entire expedition; no stale state after refresh.

**STOP — request `APPROVE STAGE 4`.**

### STAGE 5 — Early usability and balancing: does the loop actually work?

**Goal:** find problems before investing in polished design.

**Must do:** Recruit or propose a realistic protocol for ~8–12 formative novice tests plus a few daily-puzzle enthusiasts. Compare people familiar and unfamiliar with history. Record comprehension of Insight, Evidence/Trace/Lock, pauses, perceived fairness, satisfaction and desired next action. Simulations must be labeled as simulations; if no users can be recruited by the agent, produce the test script and mark outcomes NOT TESTED rather than inventing results. Assess whether ten cases are overwhelming and whether free dossiers actually suffice. Review detailed churn/drop-off by case number if real telemetry exists, and verify no exploit dominates.

**Deliver:** test plan, consent script, task sheets, observation template, actual findings if performed, risk-ranked backlog, decision on Lock/Trace/cost candidates, and user-readable revised rules.

**Pass:** Clear evidence about whether to retain Trace and how to support beginners; no fabricated playtest statistics.

**STOP — request `APPROVE STAGE 5`.**

### STAGE 6 — STRATA 2.0 art direction for the NEW daily structure

**Goal:** translate STRATA's strongest visual identity into ten connected mysteries without clutter.

**Must do:** Deeply analyze the three latest STRATA boards and both earlier routes. Produce **three genuinely different composition options** within the retained Oxide & Bone STRATA family (not palette swaps), each showing Home/Daily Trail, case start, active hunt, evidence, missing a case, Lock success, partial progress after six cases and final ten-case atlas. Consider an instrument-forward layout, a specimen-forward layout and a literary editorial layout; justify why one is stronger. Explore rhythm, typography, animated role of materials, texture grammar, source reading and app icon. Contrast-check actual layouts, not only tokens. Reject dominant blue, fake archives and ornamental clocks.

**Deliver:** annotated art-direction boards and brand system, 3 composition variants with rationale, accessible color tokens, type roles, sample content design, app icon tests at small sizes, and an unusually candid design critique with 1–10 subjective ratings.

**Pass:** A viewer can understand the ten-case structure, distinguish the primary action and recognize STRATA in grayscale at mobile scale.

**STOP — request `APPROVE STAGE 6`.**

### STAGE 7 — Responsive information architecture and accessible game UI

**Goal:** build practical, beautiful screen hierarchy before cinematic motion.

**Must do:** Produce screen-by-screen flows and interactive low/mid-fidelity prototypes for onboarding, Daily Trail, dossier, case hunt, evidence, Trace, Lock, results, ten-case finish, World Reveal entry, Practice, Archive and Settings. Test one-hand reach and small screen widths, long copy, translated labels, tabular numerals, source disclosures, wrong taps and screen readers. Remove chart-overprinted explanations and tiny 12px year rows from the gray-box. Decide the primary selector and precision alternative. Show zero Insight, missed case, loading, no-network and resume states.

**Deliver:** annotated UI flows, actual functional wireframes, component inventory, state inventory, responsive screenshots and accessibility findings. Present a clear build list, not dozens of decorative components.

**Pass:** New player can identify the next action, case count, shared resource and currently possible years without reading a legend. Every key action has a non-gesture path.

**STOP — request `APPROVE STAGE 7`.**

### STAGE 8 — Temporal camera, path-scrolling and interactive transition proof

**Goal:** prove the signature navigation in running code.

**Must do:** Implement prototype of temporal camera (semantic zoom, focal pinning, path scroll), candidate corridor and markers, evidence branch transition and return, Lock stratum opening, Daily Trail overview and one full World Reveal pathway. Make gestures work on at least one real phone; record screen capture and performance trace. Test reduced motion, large text, precision entry, natural page scroll, interrupted animation, scroll restoration and backward navigation. Avoid motion as the only information channel.

**Deliver:** runnable isolated motion prototype, transition storyboard/video, transform math tests, performance capture on specified device, reduced-motion comparison and collision/gesture bug list.

**Pass:** This is an experience, not still mockups; no unexpected year jump; no mandatory scroll trap; there is measured evidence of acceptable performance.

**STOP — request `APPROVE STAGE 8`.**

### STAGE 9 — Editorial World Reveal: one year, several worlds, ten years, one atlas

**Goal:** make the historical reward compelling enough to justify the game beyond correct guessing.

**Must do:** Build at least four **functionally distinct** interactive evidence forms (e.g. document inspection, object diagram, time series, geographic connection) with real sources and rights-cleared or clearly illustrative media. Prototype the transition from a found year to its story and from ten solved/missed date marks to a cross-case discovery. Use the 1969 source types as one possible test, but correct Western bias and avoid a fixed four-slide template. Include a researched short surprising connection that only emerges from multiple case dates; ensure the relationship category is labeled honestly (simultaneous ≠ causal). Let players skip and resume reveal stories.

**Deliver:** research-backed content scripts, data charts, diagrams, clickable full reveal prototype, sources and rights manifest, reduced-motion version and qualitative critique.

**Pass:** At least four distinct user actions across evidence types; correct citations; player can skip; the finale does more than display ten scores.

**STOP — request `APPROVE STAGE 9`.**

### STAGE 10 — Production architecture and delivery decision

**Goal:** choose the smallest maintainable production stack based on tested needs.

**Must do:** Compare installed stack vs Expo/React Native vs PWA vs fully native using the actual gesture prototype, motion profiling, offline persistence, internationalization, accessibility, deployment and maintenance. Verify official release notes **at this stage** (not just from this document), package compatibility and security advisories. Define module boundaries, schema validation, local store, deterministic packs, corruption recovery, migrations, source indexing and optional publishing CMS. Document cheating/offline tradeoffs. Establish linting, typecheck, tests, CI, release-build profiling and app secrets policies.

**Deliver:** architectural decision record, dependency/version matrix with verification links, module diagram, typed API contracts, build/deploy instructions, threat model and migration plan from gray-box.

**Pass:** A clear technical choice with documented compromises; no cargo-cult framework additions; engine remains independent from rendering.

**STOP — request `APPROVE STAGE 10`.**

### STAGE 11 — Complete polished vertical slice (three connected cases)

**Goal:** integrate engine, final interaction design, art and editorial content in a small end-to-end product.

**Must do:** Implement three cases **as part of the eventual ten-case Daily Trail**, using the real shared bank and correct final state structure. Include onboarding, Evidence/Trace/Lock, a miss, a solve, saved Insight, motion, one World Reveal story, sources, a share preview, Practice and accessibility. Test one-hand play on real phones. Keep feature flags to swap provisional economy variants without shipping contradictory UI labels. No invented historical sources.

**Deliver:** installable/testable build, code review, annotated interaction video, source manifest, UI consistency audit, performance report and decisions for full ten-case implementation.

**Pass:** It feels like one cohesive authored game, not a gray-box engine under an ornamental visual layer; all three cases persist and the shared currency is correct.

**STOP — request `APPROVE STAGE 11`.**

### STAGE 12 — Full Daily Ten, practice, archive and daily infrastructure

**Goal:** finish the first ten-case Daily Ten as a functional product.

**Must do:** Implement all ten approved and sourced cases, eight shared Insight, full-day progress, optional bridges, final atlas, results, spoiler-safe sharing, Practice separation, archive of completed days, offline daily pack, versioned content, deterministic daily identity, reset/timezone rules and content-availability fallbacks. Make the data pipeline scale beyond the first pack without hard-coded screens for each target year.

**Deliver:** release-candidate functional build, complete ten-case replay, automated end-to-end scripts, fixture packs, source-indexed data, accessibility audit and proof of offline/resume behavior.

**Pass:** Daily Ten actually runs start-to-finish with approved rules, including miss/zero-Insight cases and atlas completion; no leakage of future answers.

**STOP — request `APPROVE STAGE 12`.**

### STAGE 13 — Sustainable historical publishing pipeline and QA tooling

**Goal:** enable ongoing high-quality daily challenges without relying on unverified AI facts.

**Must do:** Build an editor-friendly schema/input process (CMS or structured repository as approved), source proof, claim-level annotation, date/calendar validation, content rights tracking, case solver and balance audit, proof of free-evidence viability, spoiler-leak preview tests, correlation/zero-value clue detection, region/era tracking, publication versioning and pack rollback. If real moderation or archival permissions are required, document them rather than silently skipping.

**Deliver:** editor workflow documentation, validation scripts, curated queue of future puzzles, editorial review checklist, provenance export, sensitive-content policy and regression test fixtures.

**Pass:** A future Daily Ten can be authored and checked without changing game-engine code; unverified clues cannot reach published state.

**STOP — request `APPROVE STAGE 13`.**

### STAGE 14 — Playtest, rebalance, accessibility, performance and security hardening

**Goal:** test the full experience rather than just individual screens and rules.

**Must do:** Real-device QA on target phones; profiling mid-range device; 10-case fatigue, text scaling, VoiceOver/TalkBack, contrast, reduced motion, offline behavior, corrupted packs, app interruption, timezone change, content spoilers, score exploit bots, shared resource transaction consistency, accessibility of charts/maps, and historical editorial audit. Compare at least two approved economy candidates with real players, in a way appropriate to sample size. Assess voluntary return and whether players remember an interesting fact, not just how long they played. Rank fixes and repeat tests.

**Deliver:** release-blocker list, actual device matrix, playtest observations and caveats, performance measurements, automated run reports, updated copy, source audit, decision on final economy and documented unresolved limitations.

**Pass:** No blocker in basic ten-case fairness, evidence provenance, offline data safety, readability or key accessibility path. Quantitative targets must be based on actual build testing; “not tested” cannot be marked passed.

**STOP — request `APPROVE STAGE 14`.**

### STAGE 15 — Launch, ethical growth and maintainable handoff

**Goal:** publish responsibly and leave a codebase that can be maintained.

**Must do:** Prepare platform-specific metadata, screenshots/video, supported devices, privacy statement, age/content review, signed builds, test distribution, release notes, rollback plan, crash/error reporting with privacy, source/rights acknowledgements, accessible help pages and content schedule. Design optional reminder notifications only if explicitly requested/approved; don't guilt the player over streaks. Produce a 30-day content and maintenance plan and an honest backlog separated from shipped features. If launch tooling/accounts are unavailable, provide precise manual deployment steps rather than claiming release.

**Deliver:** production readiness checklist, app/store assets, deployment guide, versioning and rollback runbook, maintainer handoff, user-facing history/source guidance, post-launch monitoring/feedback plan.

**Pass:** User can reproduce builds and maintain puzzles, and any unsupported claim (published, tested, externally verified) is clearly marked.

**STOP — request `APPROVE STAGE 15` before initiating any optional roadmap.**

### Optional post-MVP work (NOT authorized by this prompt)

Only with a new user-approved scope: additional time resolutions (exact day, decade, archaeological uncertainty), expanded languages, collaborative daily mode, creator/editor collections, classroom mode, richer maps and archival illustration, weekly narrative expeditions, optional soundscape, competition/leagues, or other games in a shared history platform. Every added feature must justify its impact on fairness, sources, learning, mobile ergonomics and content maintenance.

---

## 10. QUALITY BARS AND THE MANDATORY SELF-CRITIC

The AI must review every stage through at least five lenses, each with an honest **1–10 subjective rating** and written evidence; numbers do not replace the critique:

| Lens | Ask, critically |
|---|---|
| Gameplay integrity | Does the player reason, or brute-force / memorize / exploit points? |
| Behavioral pleasure | Are the decisions consequential, understandable and worth repeating without coercion? |
| Visual identity | Would this be recognizable with the logo removed? Does each texture or color mean something? |
| Mobile ergonomics | Can it be used one-handed, on a small screen, with large text and no precision gesture? |
| Temporal spatial interaction | Does zoom really change scale with object continuity, or just animate a static screen? |
| Historical credibility | Can every significant fact, uncertainty and date boundary be traced to a source? |
| Cultural range | Is this really world history, or mostly well-known Western milestones? |
| Editorial reward | Does World Reveal generate curiosity rather than feel like homework? |
| Technical health | Are state, events, offline persistence and content testable independently? |
| Accessibility | Is the same logical information available beyond color, motion and tiny targets? |

At each gate, list **top three weakest points**. Evaluate the design on a real phone when possible; otherwise explicitly qualify judgment as static or source-code-based. Avoid praise-only assessments, generic “modern and sleek” statements, and ungrounded 10/10 ratings. Explain the user's **specific** discomfort with dominant blue, soulless visual identity, meaningless icons and fixed UI templates. Favor memorable relationships among form, data and player action.

### Mandatory anti-AI-slop release tests

- Replace the logo with another game's name. Would the screen still look identical? If yes, visual identity is insufficient.
- Remove all illustrations and effects. Can the player still understand and play? If no, accessibility/gameplay foundation is weak.
- Remove every blue color. Does hierarchy survive? It should; blue is not necessary to STRATA.
- Freeze animation. Does the visual state still tell the full truth? It must.
- Inspect a 320px-wide screen. Are captions, dates, controls and source notes legible? If not, fail design approval.
- Print the game states in grayscale. Can users tell excluded-by-guess from excluded-by-evidence? They must.
- Remove all paid clues. Can users make meaningful progress through the daily pack? They must.
- Give the game to a person who knows little history. Do they have a reasonable next move? If not, fail case design.
- Ask a skilled solver to maximize score without caring about answers. Can they exploit scoring or Insight? If yes, fail economy.
- Ask what is remarkable about the completed ten-date atlas that was not visible in ten isolated cases. If the answer is “nothing,” fail narrative design.

---

## 11. KNOWN FAILURE MODES AND NON-NEGOTIABLE REMEDIES

1. **Ten unplayable mini-quizzes:** fix free dossiers, case diversity and coherent progression before adding extra tokens.
2. **Trace-only binary search:** change pricing/action availability only after showing player/bot evidence; never provide free directional feedback on all guesses.
3. **Eight shared Insight feels punitive:** avoid mandatory purchases, allow misses to advance, test beginner-first lesson design, add optional non-scoring Practice.
4. **One solved date exposes later cases:** keep each case independent and explicitly version bridge facts; don't gate cases behind winning.
5. **Historical captions without proof:** claim-level sources and source status at publication; no “to confirm” in release.
6. **Clue preview leak:** no target-dependent bar revealing exact cut prior to purchase; fuzz/withhold previews safely and truthfully.
7. **Geology becomes wallpaper:** each stratum/pattern has a semantic meaning; remove decorations that add noise.
8. **Interface resembles an encyclopedia rather than a game:** get the player to manipulate the year within seconds; optional deeper reveal remains optional.
9. **Motion causes dizziness:** equivalent reduced-motion grammar and gestures, clear skip and restore functions.
10. **False statistical certainty:** distinguish model-based historical estimates, documentary values and unknowns.
11. **The reveal only works for 1969:** verify that the system represents deep history, non-photographic evidence and non-Western sources without fake imagery.
12. **Fixed mockups passed off as a functioning experience:** require actual device demo and trace/profiling proof at Stage 8.
13. **Server/offline cheating claims:** do not claim both offline full target availability and absolute secrecy; choose a clear threat model.
14. **One case drains all resources:** budget reserve is shared by design, but case difficulty and costs must be tested across the whole pack, not optimized per puzzle.
15. **Misleading interactive material:** chart units, scale, estimated data, reconstructed borders and calendar differences must be explicit.
16. **Infinite design loops:** one stage at a time, version decisions, prototype weakest hypotheses first, do not polish hypothetical future screens prematurely.

---

## 12. FIRST MESSAGE THE AGENT SHOULD SEND (AFTER READING THIS DOCUMENT)

Do not simply repeat this prompt. Carry out the Stage 0 audit within the available tools, then report the findings. If the repo contains `convergence.html`, discuss its actual engine behavior and limitations. If it contains STRATA screens but no motion code, say so. Identify which documents/assets were available and which were not. List the minimum rules decisions that must be resolved before the ten-case implementation. End with the **Stage 0 checkpoint** and wait.

### Feedback processing examples

**User:** “Looks good but the colors still feel lifeless.”  
**Agent:** critique palette, layout, contrast and actual game state, revise only the active design stage, show alternatives, end with the same stage checkpoint.

**User:** “The Trace mechanic feels boring; remove it.”  
**Agent:** acknowledge the change, determine which approved stages are affected, update the decision ledger, revise the economy prototype, report evidence and **STOP**; don't implement all later stages without approval.

**User:** “Approved, let's continue.”  
**Agent:** if this is unambiguously an approval of the currently displayed checkpoint, record it and proceed to **the next single stage only**. If unclear which stage is approved, ask once; never assume multiple approvals.

**User:** “APPROVE STAGE 4.”  
**Agent:** log explicit approval, start Stage 5 and stop at its checkpoint.

---

# END MASTER PROMPT

---

# RESEARCH / DESIGN REFERENCE APPENDICES

These are project context, reasoning and sources; keep them in the repository. The section above remains the operative prompt.

## Appendix A — Exactly what changed between TIMEHUNT 1.0 and this edition

| Earlier project artifact | Retained insights | Replaced / corrected |
|---|---|---|
| Initial master prompt | Evidence-backed history, exceptional visuals, 2024–26 engineering, hard checkpoints | Single-year daily / six guesses / per-hunt Insight baseline |
| Archive Afterimage mockup | Editorial typography; photographic/archival mood; “one year, several worlds” | Saturated navy/cyanotype as full palette; contact-sheet year controller |
| Deep-Time Instrument mockup | Physical manipulation; scale-changing instrument; tactile focus | Oversized static dial, silver/blue cliché, same-looking reveal dials |
| STRATA prototype pass | Oxide & Bone; stratified year field; distinct evidence/guess cut states; split solved year | Overdense active hunt, tiny labels, static story slides; no proven path-scroll |
| STRATA design-system sheet | Semantic texture+shape; color contrast audit; Young Serif/Sofia roles; app mark | Assuming a static contrast table equals accessibility or rendered performance |
| Convergence gray-box `convergence.html` | Pure candidate concept, Evidence/Trace/Lock verbs, source-aware clue ideas, duplicate clue handling | 390px fixed view, one 31-year puzzle, self-checks mislabeled as balanced simulation, point exploitation |
| Gameplay redesign proposal | Convergence as deduction, diminishing information value, world reveal as reward | Per-case 10 Insight and earlier one-puzzle rule assumptions |
| Daily Ten revision | **10 dates + 8 shared Insight**; free evidence; persistent run; optional bridges; source audits | Any single-case economy copied unmodified or one-life daily elimination |

### Appendix A.1 — Supplied mockups and assets (when packaged)

This project has the following user-supplied visual references. **Inspect these exact files if present**, rather than inventing a STRATA interpretation from the text alone:

1. `references/01_archive_afterimage.png` — Route B; cyanotype/contact sheet, blue art direction.
2. `references/02_deep_time_instrument.png` — Route C; industrial dial, precise instrument gesture.
3. `references/03_strata_hunt_sequence.png` — STRATA first-pass home, narrowed hunt, clue sheet, solved-year state.
4. `references/04_strata_world_reveal.png` — 1969 four evidence forms and world reveal.
5. `references/05_strata_design_system.png` — Oxide & Bone, state textures, type roles, app mark, controls.
6. `references/06_convergence_graybox.png` — playable Evidence/Trace/Lock gray-box screens and claimed simulations.
7. `references/convergence.html` — actual 31-year HTML/JS prototype; inspect as code, not as final architecture.

#### Visual index (images included in the companion ZIP)

**Route B — Archive Afterimage**  
![Route B: Archive Afterimage](references/01_archive_afterimage.png)

**Route C — Deep-Time Instrument**  
![Route C: Deep-Time Instrument](references/02_deep_time_instrument.png)

**STRATA — Hunt, evidence, and lock sequence**  
![STRATA hunt sequence](references/03_strata_hunt_sequence.png)

**STRATA — World Reveal concepts**  
![STRATA World Reveal](references/04_strata_world_reveal.png)

**STRATA — Color, typography, states, grayscale, and input controls**  
![STRATA design system](references/05_strata_design_system.png)

**CONVERGENCE — Gray-box prototype and simulation-summary panel**  
![Convergence gray-box](references/06_convergence_graybox.png)

If working from the Markdown-only file and these images are not mounted, document that limitation in Stage 0 and ask for/locate the original assets. Do not claim visual inspection from a missing local path. The accompanying ZIP prepared with this master prompt provides the images for reference.

## Appendix B — Worked Daily Ten experience: hypothetical journey with shared budget

**All historical case labels below are illustrative placeholders, not published source-checked puzzles.** The numbers show *how shared Insight creates a strategic arc*, not measured behavior.

| Step | Player outcome | Insight spent this case | Shared balance |
|---|---|---:|---:|
| Begin | Today: 10 unsolved dates | — | **8** |
| Case 1 | Free evidence leads to a clean solve | 0 | 8 |
| Case 2 | Nudge helps discriminate two plausible dates | 1 | 7 |
| Case 3 | Clean solve from documentary inference | 0 | 7 |
| Case 4 | Queer-community history case, optional Deep Clue | 2 | 5 |
| Case 5 | Miss; learns correct dating and source disagreement | 0 | 5 |
| Case 6 | One optional Nudge, solves | 1 | 4 |
| Case 7 | Recognizes an earlier/later relation from a source | 0 | 4 |
| Case 8 | Deep Clue resolves source-based uncertainty | 2 | 2 |
| Case 9 | Interprets a chart without buying help | 0 | 2 |
| Case 10 | Uses final Trace before Lock | 2 | **0** |
| Finale | Nine solves, one miss (illustration) | 8 total | 0 |

The interesting decision is *not* whether the app gives enough money for arbitrary hard puzzles. It is **when extra help is valuable**, given that each case is designed to be worth attempting unaided. The player retains agency to pause or inspect the World Reveal without losing progress.

## Appendix C — Evidence mathematics and a corrected tutorial example

**Earlier single-case illustrative constraints:** `1950–1980`, target `1969`. The first Concorde prototype flew in 1969, scheduled passenger service began in 1976: as of the **end of a target year**, “first flight has happened, passenger service has not” supports `1969–1975`. A Trace at `1972` returning “earlier” leaves `1969–1971`. A Trace at `1970` returning “earlier” leaves `1969`. This is a useful demonstration of set intersection. **It is NOT the new Daily Ten economy and must not be offered as the only main daily puzzle.**

**Earlier satellite example:** Selling “artificial satellites orbit Earth” when the player already knows `1958–1984` is useless as a paid clue. Sputnik 1 began orbiting in 1957; under the year-end convention all 27 surviving years already satisfy the claim. The clue may be free context; `removed=0`, `reduction=0%`. The prototype's “1957/1958” semantics must be reconciled precisely.

**Earlier overlap example:** After opening a clue `target ≥1969`, buying another clue merely stating “Stonewall has already begun” (as of year end) may remove no remaining years. The game must not charge again for the same temporal cut just because the subject differs. The Stonewall story may still be valuable editorial material after solving. Distinguish **narrative novelty** from **mechanical new information**.

**Proof sketch for the reported Trace-only discrepancy:** With 31 equiprobable years, two paid Traces and two exact Locks, at most four final direction branches each support two Lock guesses (=8 possible success leaves), and at most three Trace “equal” hits provide additional winning nodes (=3), totaling ≤11 possible winning targets. Thus ≤11/31 ≈35.5%. That is a bound under stated assumptions, not a real-world win-rate claim. Request original simulator or correct assumptions before tuning.

## Appendix D — Critical UX principles extracted from earlier evaluations

1. **Prioritize the next decision.** Do not force seven different data layers onto a phone at once; show selected year, relevant candidates, free evidence and optional action. Collapse technical details.
2. **Use pattern for truth.** Hatches and stipples distinguish exclusion mechanisms, but low-contrast, overly dense patterns can reduce legibility; offer labels and an accessible legend.
3. **Every currency transaction must be comprehensible.** “Reveal · 2 Insight” is better than “Buy 2” and avoids confusion with payments.
4. **Keep context during zoom.** The earlier STRATA specimen is promising, but static screenshots cannot verify camera identity, gesture performance or scroll restoration.
5. **Give different history different forms.** Documents must actually show documents; diagrams should expose a mechanism; numerical claims need labeled axes; maps need honest boundaries.
6. **Color is not personality alone.** Blue was rejected because it homogenized screens; the new warm tokens only work if material, typography and interactions are authored together.
7. **Solved reveal is a payoff, not a forced lecture.** Give emotional release and a fast Next action, with deeper optional stories.
8. **Show cross-cultural history rather than claim it.** A 1969 story set centered on U.S. institutions is not automatically a world history cross-section.
9. **Human-centered writing matters.** A user who asks “what should I do in this game?” is giving evidence that the product was overspecified visually and underspecified mechanically. Explain the goal in one sentence and demonstrate it with actions.
10. **Audit the actual code.** A working single-page HTML proof is valuable, but not evidence that a global ten-case bank, real art system or offline daily publishing has been implemented.

## Appendix E — Official reference library and verification responsibilities

Use the following as **starting points**, never as blanket authority for unverified specific case facts. Verify URLs, versions, current guidance and licensing at research/implementation time. Recording retrieval dates and specific source locations is mandatory for actual puzzles.

### Mobile engineering and animation

- Expo SDK 58 release notes (Oct 2026): https://expo.dev/changelog/sdk-58
- Current Expo SDK / RN compatibility table: https://docs.expo.dev/versions/latest/
- React Native 0.88 release announcement (Oct 2026): https://reactnative.dev/blog/2026/10/19/react-native-0.88
- React Native Reanimated documentation: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
- Reanimated New Architecture compatibility: https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/
- Gesture Handler: https://docs.swmansion.com/react-native-gesture-handler/
- Expo SQLite: https://docs.expo.dev/versions/latest/sdk/sqlite/
- Expo Router: https://docs.expo.dev/router/introduction/
- React Native performance guide: https://reactnative.dev/docs/performance

### Accessibility and interaction

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- W3C reduced-motion technique: https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- Apple Human Interface Guidelines, Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Apple Accessibility / Reduce Motion: https://developer.apple.com/documentation/swiftui/accessibilityreducesmotion
- Material Design accessibility: https://m3.material.io/foundations/accessible-design/overview
- Nielsen Norman Group, recognition vs recall principles: https://www.nngroup.com/articles/recognition-and-recall/

### Historical sources, quantitative archives and calendar conventions

- NASA Apollo 11 mission overview: https://www.nasa.gov/missions/apollo/apollo-11-mission-overview/
- NASA Apollo 11 history: https://www.nasa.gov/history/july-20-1969-one-giant-leap-for-mankind/
- U.S. National Park Service, Stonewall National Monument: https://www.nps.gov/ston/index.htm
- Library of Congress LGBTQ+ Studies: https://guides.loc.gov/lgbtq-studies
- Internet Society, Brief History of the Internet: https://www.internetsociety.org/internet/history-internet/brief-history-internet/
- United Nations World Population Prospects: https://population.un.org/wpp/
- Historic England, LGBTQ+ heritage: https://historicengland.org.uk/research/inclusive-heritage/lgbtq-heritage/
- U.S. Naval Observatory (calendars/year numbering): https://aa.usno.navy.mil/faq/calendars
- Unicode CLDR / calendar and year formatting: https://cldr.unicode.org/
- Europeana digital cultural heritage: https://www.europeana.eu/
- Smithsonian Open Access: https://www.si.edu/openaccess
- Wikimedia Commons licensing guidance (verify each object): https://commons.wikimedia.org/wiki/Commons:Licensing
- National Museums Scotland, Concorde research starting point: https://www.nms.ac.uk/discover-catalogue/concorde-the-story-of-supersonic-passenger-flight

### Game references (study mechanics without copying)

- Globle: https://globle-game.com/
- Chronophoto: https://www.chronophoto.app/
- TimeGuessr: https://timeguessr.com/
- The Pudding (interactive editorial storytelling inspiration, not gameplay imitation): https://pudding.cool/
- Neal.fun (small playful interaction references, not an art-template license): https://neal.fun/

### Ethics and privacy

- U.S. Federal Trade Commission, dark patterns resources: https://www.ftc.gov/news-events/topics/truth-advertising/dark-patterns
- OECD dark commercial patterns resources: https://www.oecd.org/en/topics/dark-commercial-patterns.html

**Caution:** Different external pages have different update frequencies, authority and permissible use rights. Editorial source citations in a published puzzle must reference the actual claim, not merely one of these general landing pages. Do not copy copyrighted articles, maps or photos into the app unless rights permit.

---

## Appendix F — Master acceptance checklist for launch reviewers

Use this checklist as a master test inventory; stage approvals do not automatically satisfy final release conditions.

### Game

- [ ] Exactly ten well-sourced daily cases, one shared eight-Insight reserve, no per-case refill.
- [ ] Free dossier per case enables meaningful reasoning and is truly free.
- [ ] Clear Evidence / Trace / Lock actions; prices and attempt rules approved from tests.
- [ ] No zero-value paid clue; no preview hint leakage; no score exploit.
- [ ] Wrong Lock does not give earlier/later; missed case advances.
- [ ] Persisted shared budget and case states survive crashes, offline and restarts.
- [ ] Practice does not spend daily Insight; Daily Ten is not pay-to-win.
- [ ] Finale connects multiple cases, not ten isolated result modals.

### Historical credibility

- [ ] All decisive dates and constraints checked against recorded sources and calendar conventions.
- [ ] All “first,” “only,” population and life-expectancy claims specify definitions and limits.
- [ ] Sensitive and queer histories represented carefully, with language notes where needed.
- [ ] Geography, period and social-history coverage audited and gaps explained.
- [ ] All media have clear provenance/rights and reconstructions are labeled.
- [ ] No “to confirm” or unsourced content in published packs.

### Experience and design

- [ ] STRATA is distinctive without blue-dominated dashboards or decorative geology.
- [ ] Hunt is readable on smallest target phone; selected year and next action unmistakable.
- [ ] Semantic zoom, focal pinning and path-scrolling actually work in a running build.
- [ ] Transitions preserve spatial identity and can be interrupted/skipped.
- [ ] Evidence forms differ meaningfully; maps/charts use actual data and scale.
- [ ] Reduced motion, screen reader, large text and one-hand alternatives work.
- [ ] Grayscale meanings, target sizes and composited contrast tested on device.

### Production

- [ ] Active official framework docs and compatibility verified at build time.
- [ ] Engine/headless tests, property tests and migration tests pass.
- [ ] Content is versioned and deterministic; offline/secrecy tradeoff documented.
- [ ] Security/privacy/app-store/age/rights requirements addressed truthfully.
- [ ] Real-device profiling performed; blockers fixed or disclosed.
- [ ] All stage approvals and decisions recorded; current handoff reproducible.

---

## FINAL OPERATING INSTRUCTION

> **Read the entire master prompt and current repository. Begin STAGE 0 ONLY. Do not recreate old single-year TIMEHUNT mechanics. Treat the user's newest decision—TEN hidden historical dates per daily challenge with EIGHT shared Insight—as canonical. Preserve STRATA's Oxide & Bone visual identity, but do not confuse poster mockups with approved mobile interaction. Prove fair historical deduction first, then cinematic time navigation and an editorial World Reveal. Complete the stage report, print the exact checkpoint, ask for feedback, and STOP.**
