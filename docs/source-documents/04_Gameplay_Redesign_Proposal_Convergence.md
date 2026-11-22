# TIMEHUNT — A Better Game, Not Just a Better Interface

**Gameplay redesign proposal and decision document**  
**Version:** 1.0 · 23 November 2026  
**Status:** Concept proposal for feedback — **not** an approved specification  
**Primary recommendation:** Keep **STRATA** as the visual world; replace the automatic earlier/later guessing loop with **CONVERGENCE**, a compact historical-evidence deduction game.

---

## Executive verdict

**TIMEHUNT should be about finding the one year where several fragments of history meet—not merely finding a number by repeated higher/lower guesses.**

The previous concept had an attractive identity: a mystery year, a geological core showing time in layers, purchased clues, and an editorial reveal. But the dominant gameplay action was essentially a number-guessing algorithm. On a range of 201 possible years, six well-placed earlier/later comparisons can eliminate most candidates even without historical knowledge. The UI was intellectually and visually more complex than the puzzle.

I recommend a simple change to the player's central question:

> **Old TIMEHUNT:** “Which year is it?” → guess → earlier or later → repeat.  
> **New TIMEHUNT:** “Which year could make all this evidence true?” → choose what to investigate → narrow the possibilities → risk a final identification.

The new version should feel like **a pocket-sized historical detective game**: a few decisions, one readable canvas, 2–4 minutes per round, and a discovery worth seeing even after the puzzle ends.

### At a glance

| Dimension | Earlier prototype | Recommended redesign |
|---|---|---|
| Main action | Repeated numerical guess | Spend resources on targeted evidence, scans, or a final lock |
| Feedback | Free earlier/later for every guess | Directional information costs a resource; wrong locks do not give free narrowing |
| Player skill | Binary search and date recall | Information strategy, temporal reasoning, pattern recognition, and some historical learning |
| Meaning of clues | Optional facts that may or may not help | Explicit, verified constraints whose contribution can be seen |
| Drama | “Am I close?” | “I have three candidates left—do I investigate or commit?” |
| Visual metaphor | A very elaborate year selector | Layers of time visibly intersect into a small surviving core |
| After solving | Historical article/reveal | A varied, interactive *world-in-that-year* discovery |

**Important:** These are design hypotheses, not claims of measured engagement. The best rules must be tested in playable prototypes before the art direction is finalized.

---

## 1. The problem to solve before any new mockups

### 1.1 Binary search is mechanically efficient but emotionally thin

If each failed guess automatically tells a player “earlier” or “later,” an optimal player always selects the midpoint. This is essentially a search algorithm. It has initial tension but little variety: the optimal strategy hardly changes between puzzles, eras, or cultures.

### 1.2 Clues are currently subordinated to the number game

A historical clue must *change what a player can reasonably infer*. If the known corridor is **1958–1984**, “artificial satellites are already orbiting Earth” eliminates **zero** candidate years because Sputnik 1 launched in 1957. Charging two Insight for that statement damages confidence in the game economy. It could be a delightful background fact; it is **not** a useful paid deduction clue in that state.

A better game evaluates every clue against the **current candidate set**, not merely against the original target year.

### 1.3 A clever visual system cannot compensate for unclear stakes

STRATA has wonderful foundations—engraved strata, red fault line, expressive numbers, textured exclusions, archival evidence—but it currently asks the user to understand too many visual conventions before knowing what decisions matter. The design should make the *result of a choice* visually obvious within a fraction of a second.

### 1.4 Avoid the opposite mistake

Do **not** replace a trivial guessing game with a highly complicated detective simulation. A mobile brain game needs a sentence-length explanation, one-minute onboarding, and a familiar three-action vocabulary. Depth must emerge from the decisions, not from a sprawling rules manual.

---

## 2. Three possible gameplay directions

These scores are **subjective design assessments** (out of 10), not validated user metrics.

| Concept | 10-second explanation | Replay potential | Accessibility to history beginners | Distinctiveness | Implementation risk | My verdict |
|---|---|---:|---:|---:|---:|---|
| **A. CONVERGENCE** | Investigate clues until only one historical year fits | **9.2** | **8.8** | **9.0** | Medium | **Build first** |
| **B. CHRONOCHAIN** | Place events in order while clues uncover missing dates | 8.8 | 8.1 | 7.6 | Low–medium | Good secondary mode |
| **C. TIME FRACTURE** | Repair an altered historical timeline by spotting inconsistencies | 8.4 | 7.0 | 9.1 | High | Save for future expansion |

**A — Convergence** is my recommendation because it preserves what already makes TIMEHUNT distinctive: a hidden year, evidence, a time-scale instrument, geographic breadth and a dramatic reveal. It also gives the player genuinely different choices from one round to the next.

**B — Chronochain:** A chain of events is missing pieces. Players drag new event cards into chronological position, gaining more space only when they make correct placements. This is immediately understandable but closer to existing timeline-sort games.

**C — Time Fracture:** The user inspects a historical scene in which one event, technology or institution is out of its proper time. Fixing one fracture exposes another. The mechanic is visually rich but requires much more bespoke artwork and historical quality control.

**Recommendation:** Make **Convergence the core game**. Experiment with Chronochain as an optional fast mode *after* the core is proven.

---

## 3. The recommended game: TIMEHUNT — CONVERGENCE

### The one-sentence pitch

> **One year is hidden. Three kinds of historical evidence can lead you to it. You cannot afford everything: decide what to investigate and when to lock in your answer.**

### The one-minute explanation for a first-time player

1. A year is hidden within a visible time range.
2. Use **Evidence** to uncover historical clues or **Trace** to test whether a chosen year is earlier or later than the hidden year.
3. Both actions consume your limited **Insight**. The timeline visibly crosses out years that no longer fit.
4. When ready, **Lock** a year. You have only two locks. Use fewer resources to score better.
5. Once solved, explore surprising things happening around the world in that same year.

The key: **a Lock is not another free scan**. A wrong lock consumes an attempt and should *not* automatically tell you earlier or later. Otherwise players will again brute-force the search.

### Three actions, no more

| Action | What the player does | What happens | Proposed cost |
|---|---|---|---:|
| **EVIDENCE** | Choose a clue category or evidence item | Reveals a historical fact and a usable year constraint | 1–4 Insight |
| **TRACE** | Test a chosen year on the scale | Reveals earlier/later and removes incompatible years | 2 Insight |
| **LOCK** | Commit to the selected year | Correct = solve; wrong = lose one lock attempt, without free earlier/later feedback | 0 Insight; 1 of 2 locks |

**Reference economy for paper testing:** 10 Insight, 2 locks, one free *opening context* card, no countdown. This is **not final balancing**. Compare with 8 and 12 Insight, and with one versus two locks, before committing.

**Opening context is not a fourth action.** It is the puzzle's first clue: evocative, easy to understand, and deliberately not a giveaway.

### What makes the loop compelling?

- **Different risk appetites:** A confident player can lock early; a cautious one can spend resources on another investigation.
- **Multiple routes to the same answer:** Some players prefer historical context; some prefer numerical traces; others combine both.
- **Meaningful uncertainty:** “I know it's in 1969–1971, but my Insight is nearly gone.”
- **Satisfying convergence:** Visual uncertainty shrinks, not just an abstract guess counter.
- **Learning that feeds mastery:** A player discovers temporal relationships that may help in later puzzles.
- **A reward independent of winning:** A short, thoughtful world reveal makes even a difficult round worthwhile.

---

## 4. A complete example round (the answer is 1969)

**The following is an illustrative tutorial puzzle, not a finalized content pack.** It uses actual historical anchors but a simplified clue menu to demonstrate the logic. The real game would check the source wording and boundary semantics in an editorial tool.

**Starting corridor:** 1950–1980 (31 candidate years).  
**Resources:** 10 Insight; 2 locks.  
**Player sees:** a stratified vertical timeline, a movable year marker, and three available clue categories.

### First decision — Evidence or Trace?

A player buys a **Technology / Travel** evidence item for 2 Insight:

> “The first Concorde prototype has already flown, but scheduled Concorde passenger service has not yet begun.”

A source-backed evidence panel explains that the first Concorde prototype flew on **2 March 1969**; scheduled passenger service began **in 1976**. For a year-based puzzle where “already flown” means *by the end of the target year*, this evidence supports a candidate interval of **1969–1975**.

**The corridor narrows from 31 to 7 years.** The player sees exactly what was ruled out and why. The text and the visual rule must agree; no secret mathematical effect.

### Second decision — Spend more Insight or gamble?

The player uses **TRACE 1972** for 2 Insight.

The instrument responds **“Earlier.”** Now the surviving candidates are **1969, 1970 and 1971**.

### Third decision — Another Trace or early Lock?

At this point the player could risk a 1-in-3 blind guess (assuming no other historical knowledge), but a failed Lock is costly. Instead the player buys **TRACE 1970** for 2 Insight.

The reply is **“Earlier.”** Combining the evidence yields **1969 as the only remaining candidate**.

### The final move

The player taps **LOCK 1969**. The surviving geological strip opens along its fault line and becomes a historical *cross-section of 1969*.

**Total spent:** 6 Insight. **Remaining:** 4 Insight and both locks (because the correct lock does not consume a failed-attempt allowance). The exact final scoring equation can change in testing.

### The reward: same year, multiple worlds

In a short reveal, the player encounters four very different sources and representations:

- **2 March, Toulouse:** the first flight of the Concorde 001 prototype, shown as a labeled technical drawing. [National Museums Scotland](https://www.nms.ac.uk/discover-catalogue/concorde-the-story-of-supersonic-passenger-flight)
- **28 June, New York:** the beginning of the Stonewall uprising, shown using carefully sourced historical narrative and archival material. [U.S. National Park Service](https://www.nps.gov/articles/000/stonewall-national-monument-landscape-976163.htm)
- **20 July, Moon:** the Apollo 11 landing, represented by a faithful mission timeline or diagram. [NASA](https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_11i_Timeline.htm)
- **29 October, California:** the first ARPANET host-to-host transmission between UCLA and SRI, shown as a network schematic. [Internet Society](https://www.internetsociety.org/internet/history-internet/brief-history-internet/)

These events are simultaneous at the scale of **one calendar year**, but they are **not claimed to be causally connected**.

**Why this works better:** The player solved a constraint problem, chose when to spend information, and discovered how an unexpected cultural and technological cross-section fits together. The game is not dependent on already knowing the date of Stonewall or Apollo 11.

### Important editorial distinction

The **dated historical events** above are externally verifiable. The **gameplay structure**, proposed costs, and phrase “the year is somewhere in this interval” are designer constructs. They must not be presented as historical quotations, and a clue's temporal interpretation must be explicit (e.g., “by 31 December of the target year”).

---

## 5. Clue design: this is the heart of the game

### 5.1 Every clue needs two layers

**Story layer:** a curious, grounded human fact worth discovering.  
**Deduction layer:** a well-defined, computable restriction on candidate years.

Example:

> **Story:** “An experimental supersonic passenger aircraft has made its first flight, but regular Concorde passenger travel has not started.”  
> **Logical restriction:** `1969 ≤ target_year ≤ 1975` under a specified year-end convention.  
> **Source metadata:** two source records for the beginning and end boundaries.

The player should understand the story without having to decode implementation notation. The machine should understand the notation without needing to interpret free-form prose.

### 5.2 Categories should change the kind of historical material—not act as arbitrary answer buttons

Use a small rotating pool of recognizable categories: **People**, **Inventions**, **Everyday Life**, **Queer History**, **Politics**, **Places**, **Science**, **Numbers**, **Art**, and **Material Evidence**. A given puzzle offers only 3–4 categories at once.

Categories are for editorial variety. No one category should always be the strongest, cheapest, or most necessary.

### 5.3 Information gain must be measured against current knowledge

Let `C` be the current set of viable years and `C'` the set remaining after a clue.

`reduction = 1 - |C'| / |C|`

For example, 27 candidates reduced to 9 is a **66.7% reduction**. A clue that leaves 27 of 27 is **0%** and should not be sold as narrowing evidence.

A stronger information-theory measure for a uniform candidate set is:

`information_bits = log2(|C| / |C'|)`

These calculations describe **logical possibility reduction**; they are not proof that players perceive the clue as equally helpful. Usability testing still matters.

**Critical implementation detail:** Do **not** show the exact reduction for an unpurchased clue if it depends on the hidden answer; that preview would itself leak information. Show a stable, truthful *general* descriptor such as **Broad / Focused / Precise**, the category, and the cost. After buying, show the actual narrowed interval.

### 5.4 Handle redundant or correlated evidence honestly

Two clues might sound different but convey the same time interval. For example, a Sputnik-related claim and a generic artificial-satellite clue could overlap almost completely.

The system must:

- Compute a clue's **marginal** value after previously opened clues.
- Suppress or replace information that rules out no additional candidate year.
- Offer a free contextual fact instead of charging for a zero-value clue.
- Avoid giving an automatic winning clue at negligible cost for every puzzle.
- Record correlations between clue cards; do not present strongly dependent facts as independent confirmation.
- Show plainly when a clue establishes **context** rather than further narrowing the search.

### 5.5 Don't turn “queer history” into an exotic category

Queer and gender-diverse histories belong alongside labor, science, food, architecture, religion, migration and politics. Some sources use concepts of gender and sexuality very different from modern identity labels. Record original terminology, evidence type, interpretations and uncertainty, and avoid sensational trivia or unsupported retrospective identities. Historical difficulty should come from chronology and reasoning, not from obscurity or pain treated as spectacle.

---

## 6. Difficulty, score and replay: make skill matter

### Recommended scoring philosophy

The game should reward **solving with less information**, not only memorizing more dates or clicking faster.

A simple prototype scoring scheme:

`score = 1000 + 100 × unused_Insight + 150 × unused_failed_Locks + 100 × distinct_evidence_categories_used`

This is a **test formula**, not a proven balance. The cross-category bonus encourages varied research, but must be checked for exploits—if spending one Insight on a useless extra category increases score, it is a bad incentive. An alternative is to put cross-category discovery into an optional badge rather than score.

**Important scoring guardrail:** The player must not receive more points for buying a clue than the resource cost it incurs, unless there is a consciously designed bonus challenge.

### Three proposed modes, introduced progressively

| Mode | Duration target | Twist | Purpose |
|---|---:|---|---|
| **Daily Hunt** | 2–4 minutes | Same puzzle and rules for everyone; one canonical daily result | Social comparison and habit |
| **Practice** | 1–5 minutes | Unlimited curated puzzles; no public streak pressure | Experimentation and learning |
| **Deep Hunt** | 4–8 minutes | Wider date ranges, fewer resources, more uncertain evidence | Advanced replay |

Do **not** launch with eight modes, upgrades, loot boxes or energy timers. A larger experience can be earned by developing better clue combinations and stories, not by piling on currencies.

### Why people might replay

The intended motivation is: “I nearly solved that with two Insight left. Next time I can reason better.” A successful loop creates competence, curiosity and near-term mastery—not artificial losses or fear of a broken streak.

**Avoid:** paid hints, paid guesses, forced ads after failures, random penalties that distort fairness, hard-to-cancel notifications and manipulative countdowns. The game should be compelling without relying on coercive retention.

---

## 7. What to keep and change in the STRATA design

### Keep

- The **Oxide & Bone** material language rather than the old cobalt/blue palette.
- The physical vertical strata as a legible representation of chronology.
- A single **vermilion fault line** for the currently selected year.
- Stripes, hatching, and stone-like textures as supporting state markers.
- Different editorial forms for evidence: maps, archival excerpts, diagrams, reconstructed objects, quantified charts.
- Visible provenance and a distinct treatment for uncertainty.

### Change immediately

**1. Make the corridor the hero, not the numeric year.** The largest object during play should be the **remaining possible interval** and its narrowing, not simply “1962” in giant type.

**2. Reduce the interface to three prominent actions:** `Evidence`, `Trace`, `Lock`. Keep other controls contextual or behind the selected tool.

**3. Remove the dense miniature-control cluster** from the default hunt view. An array of ±1/±10 keys, a wheel, a range-fit control, multiple tokens, vertical ruler, evidence tags and guess history is too much for the first minute of play.

**4. Remove redundant visual codes.** Patterns can distinguish excluded/revealed/confirmed areas, but each texture must have a clear legend and should not imply more historical precision than exists.

**5. Replace passive “evidence list” screens with decision-oriented previews.** Users should ask “Which source is worth my limited Insight?” not “Which of these four article headlines should I read?”

**6. Rework the reveal as the emotional center of the app.** Different kinds of history deserve different representations. The Stonewall event should not be reduced to the same miniature dial as a population statistic.

### Suggested compact hunt layout (schematic, not a final wireframe)

```text
┌──────────────────────────────────┐
│ TIMEHUNT  /  DAILY 042           │
│ Insight  ● ● ● ● ● ● ○ ○ ○ ○       │
│ Locks    ◇ ◇                     │
│                                  │
│  THE YEAR IS SOMEWHERE HERE      │
│  ┌────────────────────────────┐  │
│  │ 1950                     │  │
│  │ ▒▒▒▒▒▒ ruled out         │  │
│  │ ═════ viable years ═══   │  │
│  │ ---- selected year ----  │  │
│  │ ▒▒▒▒▒▒ ruled out         │  │
│  │                     1980 │  │
│  └────────────────────────────┘  │
│                                  │
│ CURRENT RANGE   1969–1971       │
│ 3 POSSIBLE YEARS                │
│                                  │
│ [ EVIDENCE ]      [ TRACE ]      │
│                                  │
│ [ LOCK A YEAR ]                  │
└──────────────────────────────────┘
```

The visual form should ultimately be much more expressive than the sketch. The **information hierarchy**, however, should stay this simple.

---

## 8. Motion, path-scrolling and zoom: preserve the good ambition

**Rule:** Movement is worthwhile when it helps the player *understand an inference*. Avoid cinema at the expense of repeated gameplay.

### Interaction choreography

| Trigger | Motion | What it teaches |
|---|---|---|
| Drag temporal scale | World glides beneath a fixed locator | The selected year changes predictably |
| Zoom / Fit corridor | View smoothly re-scales around the same temporal anchor | Large spans become smaller spans without losing location |
| Buy evidence | A source fragment travels toward the corresponding time band and docks | Evidence has historical and logical placement |
| Apply a constraint | Excluded strata hatch or fold out of active focus | These years are no longer possible |
| Trace a year | A shallow fault line splits earlier/later; the viable side remains | This was a paid directional test |
| Lock correctly | The remaining band becomes a narrow incision, then opens outward | A single year contains many simultaneous worlds |
| Open World Reveal | A vertical journey branches into geography, people, science, and culture | Different histories coexist without being the same story |

### Path-scrolling, not scroll trapping

A gently changing route may connect the main temporal corridor to evidence fragments. **Vertical page scrolling** moves the reader through the post-solve narrative; **dragging the ruler** changes the candidate year. These actions must not conflict. Never hijack the main page scroll to spin a control without explicit focus. Provide `Fit range`, typed-year selection, tapable steps, keyboard alternatives and a reduced-motion version.

### Timing suggestions for prototypes

- Tap/haptic confirmation: **80–180 ms**.
- Constraint narrowing: **180–350 ms**.
- Instrument camera reframe: **250–500 ms**, interruptible.
- Major reveal transition: **450–900 ms**, with a Skip option.

These are art-direction starting points, **not** empirically verified ideal timings. Performance, readability, device input and reduced-motion preferences outrank the numbers. Apple recommends meaningful, restrained motion, while WCAG accessibility guidance covers target sizes and interaction-triggered animation. [Apple HIG: Motion](https://developer.apple.com/design/human-interface-guidelines/motion) · [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/).

---

## 9. Historical content should be its own product advantage

The game must answer **“What made that particular time strange, revealing or unexpectedly connected?”** not just “Which famous events happened?”

Use a balanced editorial program including:

1. **Unexpected simultaneity:** events in distant places during the same year, without implying causal links.
2. **Everyday life:** transportation costs, meals, housing, disease, clothing, wages, school, work, technologies and language—only when sources support them.
3. **Queer and gender histories:** social worlds, people, institutions, activism, documents and cultural concepts with careful historical terminology.
4. **Numbers with definitions:** demographic data, literacy, migration, urbanization, scientific measurements and trade, always with scope, units and uncertainty.
5. **Odd or counterintuitive facts:** surprising inventions, accidental discoveries, unusual laws or technologies, selected for historical meaning rather than clickbait.
6. **Beyond a single Western chronology:** Africa, South and East Asia, the Caucasus, the Americas, Oceania and transregional histories.
7. **Historical uncertainty:** contested dates, archaeological interpretations and gaps in evidence as part of the story—not errors to conceal.

Every puzzle needs a provenance record: source URL or catalog identifier, source type, date precision, calendar convention, interpretation note, confidence/uncertainty tag, region, editor review status and content licensing/rights. For some eras, **a year-range mystery** is more honest than pretending a single exact year is known.

**Editorial requirement:** Historical statistics must never be turned into fabricated precision. The “World Reveal” can legitimately show an estimate or wide interval, as long as it says how the number was constructed.

---

## 10. Technical and mathematical rules the builder must get right

### A. A formal candidate-set engine

The source of truth is a set of possible years, not the number displayed on the screen.

```ts
// Conceptual pseudocode, not production implementation.
type CandidateYears = Set<number>;

type EvidenceConstraint = {
  id: string;
  lowerInclusive: number | null;
  upperInclusive: number | null;
  evidenceIds: string[];
  datingConvention: 'end-of-year' | 'start-of-year' | 'event-day';
};

function applyConstraint(
  current: CandidateYears,
  constraint: EvidenceConstraint
): CandidateYears {
  return new Set([...current].filter((year) =>
    (constraint.lowerInclusive === null || year >= constraint.lowerInclusive) &&
    (constraint.upperInclusive === null || year <= constraint.upperInclusive)
  ));
}
```

That interval-only implementation is appropriate for the **first vertical slice**. A later version may support non-contiguous year sets, uncertainty intervals and probabilistic evidence, but do not present probabilistic likelihoods as logical certainty.

### B. Definition of year and date

- Decide if an event counts when it happened at any point during the target calendar year.
- Explicitly handle BCE/CE arithmetic, avoiding a displayed historical year zero.
- Record original calendar and translated calendar dates where relevant.
- Distinguish a **known event date**, an **approximate date**, and a **long-term historical process**.
- Never eliminate a candidate based on false precision or a contested chronology.

### C. Offline, deterministic and fair

- The same daily ID and content version yield the same hidden year, permitted action set, clue effects and answer.
- Replay after interruption restores the exact candidate set and spent resources.
- Clues cannot contradict one another or accidentally exclude the actual answer.
- On at least one reasonable route, the maximum allowed budget permits a deterministic solution. Test this using a puzzle solver rather than relying only on a human editor.
- Difficulty tiers should be based on actual solved candidate trajectories and user tests, not only era obscurity.
- Avoid generating historical “facts” with an LLM at runtime. Generate candidate copy offline, then verify it editorially.

### D. Three automated sanity checks

```text
ASSERT hidden_year is in starting candidate set.
ASSERT every paid clue preserves hidden_year.
ASSERT a purchased narrowing clue excludes >=1 currently viable year,
       or costs 0 / is clearly labelled non-narrowing context.
```

Add tests for contradictory evidence, duplicate clue effects, failed lock behavior, partial saves, accessibility, slow devices, smaller screens and font scaling.

---

## 11. What should the first playable prototype contain?

**Make this before creating another glossy set of 15 screens.** A small playable vertical slice is more useful than another static brand board.

| Stage | Tangible output | Required feedback gate |
|---|---|---|
| **0 — Paper rules** | Two competing budgets; exact action costs; ten puzzle scripts; mathematical check of solvability | Is the central choice exciting? **Stop.** |
| **1 — Gray-box prototype** | One finger-operated timeline, candidate interval, Evidence/Trace/Lock; no elaborate art | Can a first-time player explain it after one round? **Stop.** |
| **2 — Test sessions** | 5–8 observed players including history beginners; notes on confusion, false expectations and time-to-understanding | Did anyone repeatedly choose a strategy that makes all others useless? **Stop.** |
| **3 — STRATA art integration** | Color, typography, source fragments, focus/zoom, haptic language | Does the art make inference clearer or slower? **Stop.** |
| **4 — World Reveal vertical slice** | One fully sourced 1969 cross-section with at least three distinct visual forms | Is the post-solve experience worth discovering? **Stop.** |
| **5 — Content expansion** | Curated set of 25–40 quality-controlled mysteries across eras and regions | Are difficulty and source quality consistent? **Stop.** |
| **6 — Daily-ready build** | Offline persistence, deterministic daily publishing, share result, analytics consent, accessibility and device QA | Is it reliable enough to release? **Stop.** |

In each stage, the developer/AI should present observable artifacts, findings, outstanding risks and recommendations, **ask for feedback and wait for explicit approval**. Feedback is not permission to continue automatically.

### Exact prototype acceptance tests

A playable prototype succeeds provisionally if most first-time players can:

- Explain what they are hunting within **20–30 seconds** of initial exposure.
- Identify what each of the three actions costs without external explanation.
- Say why the candidate range shrank after an evidence purchase.
- Recover from a wrong lock without assuming it provides a free earlier/later hint.
- Complete a tutorial puzzle without needing prior knowledge of the event dates.
- Express a clear preference when faced with two plausible next actions.

These are **design targets**, not pass/fail standards established by research. Revise them after observing real play.

---

## 12. What I would deliberately **not** do

- **Not** make it a historical Wordle clone with the same underlying midpoint-search strategy.
- **Not** build a huge inventory of clue currencies, upgrades, lives, cooldowns or paid rescue items.
- **Not** demand that all players already know famous dates. Historical knowledge can help, but evidence should make the puzzle solvable.
- **Not** award points for useless paid clues.
- **Not** make every round a complete documentary; a 60–120-second optional reveal can coexist with deeper explorable archives.
- **Not** represent all years equally precisely in ancient periods where exact chronology is contested.
- **Not** turn the World Reveal into four identical cards or dials.
- **Not** force a scroll-to-zoom flourish on every repeated gameplay action.
- **Not** treat speculative psychological scores as validation.

---

## 13. Risks and how to test them

| Risk | Why it matters | Mitigation |
|---|---|---|
| **Clues become trivial answer giveaways** | Buying the strongest clue always beats deduction | Tier/price clues; test optimal play; some direct anchors should be expensive or scarce |
| **Best action is always TRACE** | This recreates the old binary-search loop | Simulate choice outcomes and adjust information economy; diversify puzzles |
| **Best action is always EVIDENCE** | Player no longer meaningfully chooses | Compare budgets and clue strength; make scans sometimes strategically preferable |
| **Players don't know any dates** | Historic trivia becomes a gate | Provide dated boundaries within opened evidence; tutorial solvable entirely by logic |
| **The UI becomes denser** | Three-action clarity is lost | Only show relevant control after selecting an action |
| **Uncertain source dates produce false certainty** | Editorial trust collapses | Support uncertain intervals; block precise-year puzzles without support |
| **Reveals feel like homework** | Strong game ends in a boring article | 2–4 optional visual micro-scenes, short copy, one engaging surprise each |
| **Daily play is exhausted quickly** | More content doesn't equal deeper mechanics | Varied clue menus and decision paths; test for dominant strategy and novelty |

---

## 14. My recommendation and decision threshold

**Build TIMEHUNT: CONVERGENCE inside the STRATA visual language.** Keep the tactile historical core and its warm material identity, but let player choice—not the giant year display—drive the experience. Preserve the World Reveal as the major payoff and fund it with strong historical research.

The most important question to resolve is **whether a player feels they are making interesting decisions**, rather than executing a predictable algorithm or buying the answer. Do a prototype with one puzzle before making more elaborate design boards.

### Final concept ratings (subjective, untested)

| Attribute | Earlier higher/lower TIMEHUNT | Proposed Convergence |
|---|---:|---:|
| Explainability | 9.0/10 | 8.2/10 |
| Strategic decision-making | 4.2/10 | **8.8/10** |
| Potential for genuinely different runs | 4.8/10 | **8.7/10** |
| Historical content integrated into play | 5.2/10 | **9.2/10** |
| Ability to work for beginners | 7.5/10 | **8.5/10** if evidence is designed correctly |
| Compatibility with STRATA | 8.0/10 | **9.4/10** |
| Risk of overcomplication | Low | **Medium — must be controlled** |

> **Design north star:** *Don't ask players to search for a year. Ask them to assemble enough history that only one year remains possible.*

---

## 15. Source and reference notes

The links below support historical examples and general interface/accessibility principles. **They do not validate the proposed game rules or predictive rating scores**, which are original design recommendations requiring prototyping.

### Historical references

1. **National Museums Scotland — Concorde: the story of supersonic passenger flight.** First prototype flight on 2 March 1969 and history of subsequent service.  
   <https://www.nms.ac.uk/discover-catalogue/concorde-the-story-of-supersonic-passenger-flight>
2. **National Park Service — Stonewall National Monument Cultural Landscape.** The Stonewall uprising and events beginning 28 June 1969.  
   <https://www.nps.gov/articles/000/stonewall-national-monument-landscape-976163.htm>
3. **NASA — Apollo 11 Timeline.** Apollo 11 lunar landing on 20 July 1969.  
   <https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_11i_Timeline.htm>
4. **Internet Society — A Brief History of the Internet.** ARPANET development and October 1969 host-to-host connection.  
   <https://www.internetsociety.org/internet/history-internet/brief-history-internet/>
5. **Computer History Museum — The First 50 Years of Living Online.** Independent archival context for the October 1969 transmission.  
   <https://computerhistory.org/blog/history-of-the-future-october-29-1969-fifty-years-of-a-connected-world/>

### Interaction and accessibility references

6. **Apple Human Interface Guidelines — Motion.** Using meaningful, comfortable motion and clear feedback.  
   <https://developer.apple.com/design/human-interface-guidelines/motion>
7. **Apple Human Interface Guidelines — Accessibility.** Assistive input, scalable content and reduced-motion expectations.  
   <https://developer.apple.com/design/human-interface-guidelines/accessibility>
8. **W3C — WCAG 2.2.** Target size, alternatives to gesture-only input, accessible states and motion guidance.  
   <https://www.w3.org/TR/WCAG22/>
9. **W3C — Understanding Target Size (Minimum).** Explains the 24 CSS-pixel AA requirement with exceptions; larger practical touch targets are preferable for this game.  
   <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum>

### Design-methodology note

The comparative scores, recommended prices, budgets, timings, visual behavior, and success metrics in this document are **original proposals**. Their value lies in being precise enough to falsify in a user test; none should be presented as established findings without that test.

---

**Suggested next decision:** Approve or reject the core three-action idea—**Evidence / Trace / Lock**—*before* commissioning another visual direction. If it does not produce interesting decisions in a plain prototype, revisit the mechanic rather than polishing STRATA again.
