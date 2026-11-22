# TIMEHUNT — Full Critical Design Evaluation

**Route B: Archive Afterimage vs. Route C: Deep-Time Instrument**  
**Disciplines:** art direction, graphic-design history, mobile UX, game design, behavioral psychology, motion systems, historical editorial integrity  
**Review date:** 23 November 2026  
**Material reviewed:** two user-supplied concept boards, each showing a home screen, an in-progress hunt and a 1969 world-reveal screen.  
**Decision:** *Do not approve either route unchanged. Use Route C as the gameplay foundation, borrow Route B's archival storytelling, and develop a genuinely new hybrid direction provisionally called STRATA.*

> **Scope and evidence note.** All assessments of interface quality, originality and player motivation are expert-style critical judgments based on **static concept images**, not evidence from an implemented game, usability tests or retention data. Historical claims and external design guidelines are documented separately in the references. Ratings are heuristic 0–10 judgments; their decimal precision is for comparison, not a claim of measurement.

## Contents

1. [Executive verdict](#1-executive-verdict)
2. [Ratings and methodology](#2-ratings-and-methodology)
3. [Route B: Archive Afterimage](#3-route-b-archive-afterimage)
4. [Route C: Deep-Time Instrument](#4-route-c-deep-time-instrument)
5. [The critical gameplay problem: an information clue worth zero](#5-the-critical-gameplay-problem-an-information-clue-worth-zero)
6. [Behavioral critique: what will actually make players return?](#6-behavioral-critique-what-will-actually-make-players-return)
7. [Recommended third direction: STRATA](#7-recommended-third-direction-strata)
8. [Color systems, hex codes and accessibility](#8-color-systems-hex-codes-and-accessibility)
9. [Typography and art-history references](#9-typography-and-art-history-references)
10. [Motion, path-scrolling and zoom choreography](#10-motion-path-scrolling-and-zoom-choreography)
11. [History, unusual facts, statistics and queer histories](#11-history-unusual-facts-statistics-and-queer-histories)
12. [Screen-by-screen redesign requirements](#12-screen-by-screen-redesign-requirements)
13. [Prioritized correction list and design-approval criteria](#13-prioritized-correction-list-and-design-approval-criteria)
14. [Tests to run before approving the design](#14-tests-to-run-before-approving-the-design)
15. [Final judgment](#15-final-judgment)
16. [Sources and further visual references](#16-sources-and-further-visual-references)

---

## 1. Executive verdict

**Route C is better for TIMEHUNT as a game. Route B is better as a designed historical publication. Neither yet meets the ambition of the master brief.**

- **Route B — Archive Afterimage: 7.2/10.** Strongest in typography, editorial coherence, photographic atmosphere and the idea of a year revealed as multiple simultaneous historical exposures. Weakest where a player must actually *operate* the game: the grid is small, its visual cells are repetitive, and the act of locating a year is less physically satisfying.
- **Route C — Deep-Time Instrument: 7.7/10.** Strongest in its object-like interface, tactile potential, zoom logic and the integration of navigation with the game's central metaphor. Weakest in the generic silver/blue/red instrument vocabulary, the intimidating size of the dial and the bland solved-year screen, where very different histories become four similar mini-dials.

The decisive conceptual distinction is:

> **B looks like a beautiful historical publication that contains a game. C begins to look like a game whose defining interaction is the manipulation of historical time.**

The answer is **not** merely to paint Route C a warmer color. That would retain the problems of predictable composition, insufficient historical character, overly literal instrument imagery and weak reveal dramaturgy.

**Recommended synthesis:**

1. Keep C's **physical, continuously navigable temporal controller**, but reduce its visual dominance.
2. Keep B's **editorial revelation of many worlds within one year**, but make each type of evidence look different.
3. Replace both routes' uniform visual environments with **a layered historical field**: an abstract time landscape, a precise navigational instrument and source-backed historical fragments.
4. Make all feedback, clue spending and zooming convey **real gameplay information**, not decoration.
5. Give the visual identity a **warm material foundation** rather than the prevailing blue/cobalt language.

### Design maturity

**Recommendation: Stage 3 (visual identity) is not approved.** The concepts are strong enough to justify an interactive prototype, but not production styling or systematic screen expansion. Design should now focus on *interaction proof* and *information clarity*, rather than another set of polished static screens.

---

## 2. Ratings and methodology

### Comparative scorecard

| Criterion | Route B /10 | Route C /10 | Higher-scoring route | Reason |
|---|---:|---:|---|---|
| Visual identity | **8.8** | 7.3 | B | Recognizable photographic and typographic language |
| Originality of interface | 7.6 | **8.5** | C | Dial-as-controller is more tied to the mechanic |
| Typography | **8.5** | 7.6 | B | Larger editorial contrast and more expressive hierarchy |
| Color and materiality | 7.2 | **7.5** | C | Tactile metals/ceramics are promising, despite problematic cobalt |
| Gameplay integration | 6.0 | **8.7** | C | The core object allows meaningful zoom and movement |
| Potential for replay appeal | 6.7 | **8.1** | C | Tactile mastery appears more plausible; untested |
| Historical storytelling | **8.6** | 5.6 | B | Four archival exposures beat four generic dials |
| Mobile usability | 5.8 | **6.8** | C | More obvious central action, but both need larger targets |
| Scroll and zoom potential | 6.4 | **9.0** | C | Coherent centuries → decades → years lens metaphor |
| Emotional appeal | **8.0** | 6.5 | B | B is more human, mysterious, editorially expressive |
| **Overall judgment** | **7.2** | **7.7** | **C** | Holistic fit for TIMEHUNT, not arithmetic mean |

**How to interpret these scores:** The criteria overlap. An unweighted mean would misleadingly pretend each dimension is independent and equally important. The overall score is a *holistic product judgment* emphasizing interaction, deduction clarity and the repeated core loop. The exact numbers should never be presented as user-research results.

### Review lens

**Art and design history.** Do the borrowed visual traditions have a reason to exist beyond fashion? Is the result historically literate rather than a generic “old-looking” aesthetic?

**Art direction and brand.** Would the product be recognizable from a cropped screenshot or a five-second video without its logo? Does it create a coherent world of materials, type and marks?

**Cognitive and behavioral UX.** Does each interaction have a clear signifier and informative feedback? Can a newcomer understand what is possible, what has changed and why? Does the product reward actual learning and deduction rather than mere habitual tapping? These questions align with interface heuristics such as visibility of system status, recognition rather than recall, user control and error prevention [R1].

**Game economy.** Do guesses and clues change the rational decision landscape? Are scarce resources fairly priced? Does each mistake teach something?

**Mobile performance and accessibility.** Can the core game work one-handed on a small phone, without precision tapping or mandatory animation? Apple advises touch regions around 44 × 44 points; WCAG 2.2 includes target-size and contrast criteria with defined exceptions [R2–R4].

---

## 3. Route B: Archive Afterimage

![Route B — supplied concept board](timehunt_review_assets/route_b_archive_afterimage.png)

*Figure B. The supplied concept: a navy/cyanotype photographic contact sheet, a halftone year grid, and a pale editorial solved-year page. The figure is included with the companion image bundle; the analysis below is readable without it.*

### What works

#### B1. An unusually coherent graphic narrative — **8.8/10**

The process metaphor is legible: a **hidden year is an undeveloped photographic exposure**. Each guess or clue brings a print toward visibility. This is not a random theme applied to history; it uses the archival fact that historical knowledge often reaches us as partial, delayed or unevenly preserved evidence.

The 12-thumbnail home contact sheet, halftone texture, crop/registration marks and distinctive orange ring share one graphic grammar. The 1969 reveal on pale paper reads as a processed print lifted out of the darkroom. This is a strong sequence of **hidden → exposed → developed**.

Historically, cyanotype is a real photographic process associated with John Herschel and Anna Atkins's early photographically illustrated work. That association supports the design's archival metaphor but does **not** mean cyanotype is representative of the entire history TIMEHUNT covers [R5, R6].

#### B2. Strong expressive typography — **8.5/10**

The oversized high-contrast serif of “Archive Afterimage” and “1969” contrasts productively with the small, tight sans-serif labels. The supplied board specifies **Bodoni Moda** for display and **IBM Plex Sans Condensed** for UI/evidence. That contrast feels edited rather than templated. The large 1969 is a genuine visual climax.

The limitation is that extreme stroke contrast and narrow detail can become fragile at small sizes. Preserve the display face only at sizes where the hairlines remain clear; use a calmer font for small body copy, numbers in dense cells and sourced captions.

#### B3. Best solved-year composition — **8.6/10 for editorial reveal**

Four selected views of 1969—Stonewall, Apollo 11, ARPANET and world population—communicate the game's most interesting promise: **one date contains simultaneous, culturally different histories**. The brief should scale that ambition beyond a grid of four entries, but the narrative move is right.

### What fails

#### B4. Too much blue, too little state contrast

Navy, cyanotype blue and lighter blue permeate the home and hunt screens. They are not merely accents; they determine nearly everything. The result is attractive at first glance but visually uniform. When the game needs to distinguish uncertainty, excluded periods, usable choices, ordinary context and major revelations, a single dominant blue family risks flattening those differences.

**Correction:** abandon cyanotype blue as the global UI substrate. Preserve it, if at all, as an *occasional color of actual photographic evidence or special archive material*, not the universal language of time.

#### B5. Attractive thumbnails, low mnemonic specificity

Most contact-sheet tiles are abstract dotted patterns. On the screenshot, several are visually similar enough that a player is unlikely to learn which is 1914 and which is 1937 from the imagery. This matters because recognition of distinct objects can help people navigate a collection, whereas near-identical marks impose extra reading effort. This is a design inference, not a tested memory result; it should be tested [R1].

**Correction:** make thumbnails correspond to genuinely distinguishable evidence forms: a silhouette, a texture from a verified artifact, an annotated chart fragment or a regionally meaningful graphic. Do not fabricate the look of an archival document and present it as genuine.

#### B6. The hunt screen reads like a spreadsheet in disguise

The narrow year boxes are visually precise but far too dense to be the main touch controller at all scales. The grid is strong as an **overview** and weak as the **primary input**. A year choice must be selectable without precision tapping.

**Correction:** separate the overview from the controller. The overview can show the corridor as a graphic “sheet”; selecting a decade should expand into larger year targets or a dedicated anchored temporal cursor. Aim for roughly 44-point or larger frequently used touch regions on iOS, while applying the relevant platform-specific accessibility checks [R2, R3].

#### B7. Opening metaphor misstates the choice space

The home screen presents a finite collection of dated thumbnails and says that one of the years is still developing, while the prompt below describes a target somewhere within a wider range. A first-time user could reasonably infer that the answer must be *one of the shown prints*. If those prints are samples rather than all valid answers, say so visually and in copy.

**Correction:** explain the relationship between the archive collection and today's continuous date range. E.g., archive items are *past hunts*; today's blank frame represents a mystery year anywhere in the defined interval.

#### B8. Too much admiration, not enough agency

The darkroom metaphor is stronger for viewing and revealing than manipulating continuous time. Where should the player drag? How does a pinch magnify from decades to single years? How does an evidence clue physically alter the contact sheet? The static frames do not yet answer these questions.

**Design verdict for B:** **Keep the editorial imagery, compositional contrast, evidence cards and dramatic reveal. Reject the contact-sheet grid as the sole year-selection control.**

---

## 4. Route C: Deep-Time Instrument

![Route C — supplied concept board](timehunt_review_assets/route_c_deep_time_instrument.png)

*Figure C. The supplied concept: a gray/silver precision dial with red needle and cobalt corridor, plus a dark solved-year screen with four sub-dials.*

### What works

#### C1. An object that is also the mechanic — **8.7/10 for gameplay integration**

This is Route C's decisive strength. The instrument is simultaneously a metaphor, a brand mark and an apparent controller. History becomes something a user can **locate** rather than merely read. A mobile game becomes memorable when a core gesture is unusually characteristic of that game.

Unlike a timeline card list, the dial explains the relationship between decades, years, narrowing corridors and precision. Its concentric rings make it plausible to zoom into an interval without abandoning the visual grammar.

#### C2. Zoom has a meaningful spatial grammar — **9.0/10 potential**

The outer bezel contains the broad time range. The inner ring magnifies the active corridor. A red needle can indicate a candidate year, while earlier guesses leave marks. This offers a credible movement system: **centuries → decades → years**, with the same selected historical coordinate preserved across scales.

The challenge is to make this more than animated geometry. Zoom must actually change usable precision and information density; it must not simply enlarge the same ticks.

#### C3. Tactile interaction could be emotionally distinctive

A precisely moving vernier, a resisting wheel, a firm selection click and a permanent engraved guess marker could make TIMEHUNT recognizable through interaction rather than color alone. These are hypotheses to prototype, not claims that haptics automatically increase engagement.

### What fails

#### C4. A polished instrument, but a predictable design language

Silver surface, black buttons, cobalt arc and red needle evoke industrial devices and rationalist product design. That ancestry is relevant, but the current combination reads as a premium measurement utility rather than a culturally distinctive history game.

The reference to **Braun-like functionalism** here is a *visual comparison*, not a claim of direct authorship or provenance. The UI should transcend the familiarity of the “minimal gray dial” trope.

**Correction:** introduce material irregularity, distinctive numerals and restrained historical strata, while keeping the precision of the controlling surface. Do **not** add random scratches or false patina merely to look old.

#### C5. The dial is physically and visually oversized

In the home composition the dial occupies most of the player's attention, with important instructions and actions pushed downward. That may be justified in a tactile puzzle, but the current screenshot does not prove the central object remains useful throughout the hunt.

**Correction:** distinguish **hero mode** from **playing mode**. Let the dial be heroic on the landing screen, then compress or transform it into a smaller persistent instrument once the game begins. Reserve valuable space for the viable corridor, guesses, clues and meaningful feedback.

#### C6. The right-side crown does not clearly announce itself as interactive

The small side crown resembles a decorative edge element. A physical knob may be obvious on a real device because people can touch and turn it. On a flat screen, it needs a convincing signifier: a visible movement response, handle geometry, a first-use demonstration and a non-gesture alternative. Weak signifiers are an established usability failure pattern [R7].

**Correction:** first-use prompt: “DRAG THE DIAL TO SET A YEAR,” with the wheel visibly following the initial touch; provide ±1 and ±10 controls, a tap-to-jump option and a clearly labeled commit action. Do not require the crown.

#### C7. The reveal has almost no dramatic transformation

Route C's 1969 world reveal has four miniature dials, each functioning as an icon for an unrelated historical story. That flattens different kinds of evidence into the same circular container. Stonewall, Apollo 11, ARPANET and a world population estimate demand different visual forms. In a product premised on surprising simultaneity, **uniform presentation is especially damaging**.

**Correction:** once the year is found, the precision dial should become only one element in a wider editorial world. The clock face can transform into a map, a data circle, an archival photograph, a scanned document or an object section when the form is appropriate to the content.

#### C8. Historical imagination is underdeveloped

The dial could support any subject with numbers: geology, astronomy, finance or athletics. Very little about its current architecture specifically evokes the uneven archives, disputed dates, ordinary life and radically different cultures of world history. This means the brand lacks a distinctive intellectual point of view.

**Correction:** the historical record should alter the instrument. In under-documented epochs, date resolution can become coarser; uncertain dates can be softly bounded rather than falsely exact; different content classes should produce different supported visual evidence. Do not let a smooth dial imply a level of precision the historical sources do not provide.

**Design verdict for C:** **Keep the continuously manipulable temporal instrument. Reject the giant dial as the whole visual identity, the default cobalt accent and the repeated mini-dial world reveal.**

---

## 5. The critical gameplay problem: an information clue worth zero

This is the most significant flaw visible in **both** concepts because it threatens trust in the game's underlying rules.

The mockups show:

- **Current surviving corridor:** 1958–1984, inclusive.
- **Remaining resource:** 8 Insight.
- **Offered clue:** “Artificial satellites are already orbiting Earth.”
- **Cost:** 2 Insight.
- **Clue footnote:** “Fogged 1951–1957” / comparable text.

The first artificial satellite, Sputnik 1, entered orbit on **4 October 1957** [R8]. Thus every year in the already displayed 1958–1984 corridor satisfies the clue. It excludes no additional year.

### Information-value audit

| Measure | Value |
|---|---:|
| Eligible years before clue | 27 |
| Eligible years after clue | 27 |
| Removed candidates | 0 |
| Candidate-space reduction | **0%** |
| Insight charged | **2** |

This is not a criticism of the historical fact. It is a criticism of the **economy of information**. A clue can be accurate and interesting while contributing nothing to the player's current deduction.

### Required correction

1. **Evaluate each clue against the player's current state**, not only against the full starting range.
2. Distinguish *contextual discoveries* from *deductive evidence*. If a fact cannot eliminate or differentiate eligible years, make it free contextual material or explicitly label it as non-narrowing.
3. Calculate incremental clue value after accounting for previously revealed clues. Three related “satellite era” statements must not be sold as three independent discoveries.
4. Show a transparent preview such as **“Narrows 27 candidate years to 12”** for truly constraining clues—without disclosing the answer.
5. Avoid always making the highest-information clue the best purchase: clue cost, available guesses, target range and player strategy should create meaningful trade-offs.
6. Retain human-interest facts for the solved-year editorial reveal even when they are no longer useful clues.

### A better visible feedback model

**Before clue:** “27 years remain.”  
**After a useful clue:** “11 years excluded. 16 remain.”  
**After a redundant clue is encountered:** “You already know this from your current range. No Insight charged.”

A more nuanced implementation can estimate information gain using candidate entropy rather than raw candidate count, especially if dates carry unequal plausibility or clue error bounds. But the metric must be understandable and the game should not pretend historical target selection is a scientific probability model.

### Behavioral significance

The recommendation is grounded in a plausible design principle: a meaningful choice should produce feedback the player can interpret. It is **not** proof that redundant clues cause churn in this product; that would require testing. But charging for visibly non-helpful information is a strong, testable hypothesis for perceived unfairness.

---

## 6. Behavioral critique: what will actually make players return?

A common mistake is to equate bright highlights, dramatic animation and multiple rewards with compelling play. In TIMEHUNT, replay appeal is more likely to come from a tight deduction loop:

**Hypothesis → placement → informative response → revised hypothesis → resource decision → satisfying solution.**

The core mechanisms should be independently enjoyable even when a player knows little history.

| Player feeling to design for | Required interaction | What to avoid |
|---|---|---|
| “I understand where I went wrong” | Earlier/later result, proximity band, clearly changed interval | Opaque wrong-answer flash |
| “That clue was worth it” | Observable reduction of uncertainty | Paying for redundant facts |
| “I can do better next time” | Meaningful clue and guess trade-offs | Random near-miss theatrics |
| “I found a world, not just a number” | Rich, varied historical reveal | Generic score modal or four identical icons |
| “I know how this device works” | Consistent manipulation and anchored zoom | Gesture surprises and unstable camera |
| “I want to share this” | Compact spoiler-free result, beautiful reveal artifact | Mandatory social login or revealing the target |

### Major psychological and usability risks

- **Learnability vs. spectacle:** an ingenious temporal instrument can still fail if a first-time player cannot discover how to set or submit a year. Test the first interaction without coaching.
- **Motor burden:** a large dial may look tactile, but repeatedly rotating through centuries can be tiring or imprecise. Test short and long changes separately.
- **Visual habituation:** if the entire game stays blue (B) or gray (C), meaningful state changes may lose salience. This is an interpretation to test, not a verified law of color psychology.
- **Cognitive overload:** the player already manages guesses, clue budgets, date ranges and historical content. Avoid additional nested rules, ornamental legends and persistent micro-labels competing for attention.
- **Interruptibility:** guessing should stay responsive. The most dramatic animation should occur **after** a successful hunt, not block every ordinary action.
- **Ethical retention:** favor mastery, curiosity, shareable discoveries and daily comparability over paid hints, forced waiting, fear-of-missing-out prompts or streak-repair purchases.

### Should TIMEHUNT feel “addictive”?

The brief's goal is best interpreted as **strong voluntary replay appeal**. A good player returns because the deduction feels fair, the instrument rewards increasing fluency and the world reveal remains surprising—not because the app imposes coercive timing. The actual retention effects of any design here remain unknown until measured with consent-based analytics and qualitative playtests.

---

## 7. Recommended third direction: STRATA

**Working title:** TIMEHUNT / STRATA  
**Design thesis:** *Time is not a clock face or a bookshelf of dates. It is a navigable field of accumulated evidence. Every guess leaves a trace; every source changes how the field can be read.*

This is a **new synthesis**, not a decorative combination of B and C.

### Three interconnected layers

**Layer I — Temporal field.** A fluid, calibrated landscape shows the historical continuum. Tick spacing responds to zoom; centuries, decades and years each have distinct typographic rhythms. Restricted regions fade or hatch, while surviving intervals remain readable. It can curve as a visual path, but time must remain numerically ordered and navigable.

**Layer II — Navigational instrument.** A compact version of C's dial or vernier becomes a persistent tactile selector. It is visibly functional, not an oversized logo. It allows direct years, ± steps, gesture manipulation and a fixed commit control. Previous guesses appear as persistent traces.

**Layer III — Evidence / world.** Inspired by B, solved years open into varied documentary fragments: photographs, excerpts, maps, tactile objects, personal testimonies, diagrams and statistical graphics. The material treatment reflects the type of source and its uncertainty, not just its date.

### Art direction principles

1. **STONE / STRATA = time and accumulated layers**, not literal archaeological authenticity.
2. **METAL / ENGRAVING = player interaction and measurement**, never historical proof.
3. **PAPER / ARCHIVE = documents and interpretation**, with real sourcing when shown as historical evidence.
4. **COLOR = gameplay meaning**; different hues must not become vague “era moods.”
5. **TYPOGRAPHY = scale and hierarchy**; typography changes scale with history without becoming illegible.
6. **IMPERFECTION = selective texture**, not noise applied uniformly over labels, graphs and buttons.
7. **EVIDENCE HAS A FORM**; a demographic estimate should look like a graphic with units and uncertainty, not like an unrelated clock.

### Visual identity tests

- Can the mark still be recognized if the app name is hidden?
- Can the player instantly distinguish a guess, an eliminated year, a clue and the actual solution?
- Are the three layers coherent at 320–390 CSS/point-wide mobile layouts?
- Does the interface remain recognizable in monochrome and reduced motion?
- Would a nonhistorian understand that this is a deduction game rather than a reference app?

---

## 8. Color systems, hex codes and accessibility

### 8.1 Existing Route B palette (as labeled on supplied board)

| Role | Hex | Critique |
|---|---|---|
| Prussian | `#12305A` | Strong atmospheric base; overdominates |
| Cyanotype | `#4F7FB5` | Historically meaningful photographic association; too pervasive as UI language |
| Print white | `#E6EEF0` | Excellent light reveal contrast |
| Fixer | `#9DB3C4` | Easy to confuse with inactive blue cells |
| Grease pencil | `#F0A93A` | Strong functional accent; should be used more deliberately |

**Verdict:** Retire the all-blue visual world. The orange ring currently carries most of the interaction emphasis; give different game states distinct *structural* treatments rather than relying on one orange outline.

### 8.2 Existing Route C palette (as labeled on supplied board)

| Role | Hex | Critique |
|---|---|---|
| Anodized | `#C9CDD0` | Coherent material base, somewhat cold |
| Ceramic | `#F1F0E8` | Good face/paper neutral |
| Engraving | `#16191B` | Strong dark anchor |
| Cobalt | `#2E4DF6` | Too “software default” for this concept; visually loud |
| Needle | `#D23A2A` | Clear emphasis; competes with cobalt |

**Verdict:** Keep the restrained neutrals as inspiration, but redesign the material and accent system. Remove cobalt entirely from the candidate core brand system.

### 8.3 Recommended replacement: Oxide & Bone

| Token | Name | Hex | Use |
|---|---|---|---|
| `surface.primary` | Bone | `#F2ECE0` | Main canvas, paper, quiet space |
| `ink.primary` | Coal | `#241F1B` | Primary text and mechanical parts |
| `action.primary` | Vermilion | `#B4412D` | Selected year, current guess, strong action |
| `evidence.secondary` | Patina | `#526A57` | Evidence path, marks, secondary visual signal |
| `accent.rare` | Brass | `#D4B058` | Reward gleam, special highlights, never small labels |
| `surface.high` | Paper | `#FBF7EF` | Editorial reveals and enlarged evidence |
| `ink.deep` | Soot | `#171817` | Very dark surfaces and high contrast |
| `accent.soft` | Pale rust | `#E6B6A4` | Restrained support areas and emphasis backgrounds |

**Computed WCAG 2.x contrast ratios** (using the standard relative-luminance formula; ratios rounded to 2 decimals):

| Foreground vs. Bone `#F2ECE0` | Ratio | Use recommendation |
|---|---:|---|
| Coal `#241F1B` | **13.87:1** | Primary body text: strong |
| Vermilion `#B4412D` | **4.78:1** | Normal text at AA threshold; still test thin strokes and size |
| Patina `#526A57` | **5.02:1** | Normal text at AA threshold |
| Brass `#D4B058` | **1.76:1** | **Do not use as small text on Bone** |
| Pale rust `#E6B6A4` | **1.54:1** | Decorative background, not fine text |

Brass on Coal is approximately **7.89:1**, making it much more suitable for an illuminated metallic highlight on dark material. Standards define additional requirements for large text, graphical objects and states; verifying one color pair does not certify an entire interface [R3].

### Rules for color semantics

- **Current candidate year:** vermilion plus distinct marker shape.
- **Eligible interval:** solid positive surface and clear labels.
- **Excluded years:** hatching/texture or contrast reduction plus accessible text labels; never just faded blue or gray.
- **Purchased evidence:** patina path plus source symbol.
- **Committed guess:** engraved notch; retain an accessible history list.
- **Solved target:** high-contrast typographic state, not just confetti or color change.
- **Danger / invalid action:** dedicated copy and shape, not simply reusing vermilion.

### Alternatives worth exploring, but not yet endorsed

**Option A — Blackened Copper:** near-black fields, copper-orange selector, warm paper evidence; more nocturnal and dramatic but risks dark-interface fatigue.  
**Option B — Mineral Library:** ivory, charcoal, olive and burnt red; strongest for cross-cultural editorial content.  
**Option C — Studio Instrument:** warm white, graphite, acid yellow used sparingly and one blood-orange line; graphically striking but needs careful contrast testing.

**Preferred:** Oxide & Bone, subject to testing. Don't approve a palette based solely on how the swatches look in isolation. Apply it to the full home/hunt/reveal sequence and verify states in context.

---

## 9. Typography and art-history references

### 9.1 Why B's typography succeeds

B uses a meaningful contrast between a high-contrast display face and compressed utility typography. The large “1969” is allowed to behave like a poster or exhibition title. Its character carries cultural tone while evidence copy remains informational.

**Retain:** an expressive display face for large numbers and short headlines, plus a utilitarian humanist/neo-grotesque family for UI, labels and sources.

**Reject:** oversized display lettering as a substitute for information hierarchy; hairline numerals in dense year selectors; tiny labels that only work at mockup scale.

### 9.2 Why C's typography is not enough

The supplied board specifies **Michroma** for the scales/years and **Hanken Grotesk** for UI/evidence. That creates technological consistency but contributes to the “precision tool without an era” feeling. A futuristic numeric face can also imply modern computational science rather than historical interpretation.

**Retain:** tabular numerals and consistent digit metrics, especially on moving instruments.

**Reject:** giving every headline the same techno-rationalist voice and relying on geometric letterforms to make the interface feel innovative.

### 9.3 More nuanced recommendation

A **three-part type system**, with strict functional roles:

1. **Display / discovery:** expressive serif or editorial display with excellent large-size numeral design, deployed sparingly for solved years and narrative reveal chapter openers.
2. **Instrument / data:** highly legible numerical typography with tabular figures, distinguishable 1/I/l and 0/O, and stable width during animation.
3. **Narrative / evidence:** plain, readable text face that works at small phone sizes and supports multiple scripts if international history or localization is planned.

Do not use typography to imply certainty when the underlying chronology is approximate. For ancient events with uncertain dating, show the range and precision explicitly, e.g. “c. 1200 BCE”, rather than typesetting a confidently precise year.

### 9.4 Actual visual ancestry

- **Cyanotype and early scientific image-making:** useful as a *historically situated archival metaphor*, not a universal treatment for antiquity [R5–R6].
- **Modernist instrument design:** relevant to function-led object interfaces; its lesson should be legibility and touch coherence, not simply brushed metal and circular rings.
- **Geological stratigraphy and museum specimen graphics:** useful for *accumulation, layering and evidence*, but only as metaphors. A chronological visualization must not imply literal geological equivalence.
- **Experimental editorial and exhibition design:** useful for unusual type scaling, cropping and juxtaposition; should increase interpretive richness rather than compromise factual charts.

---

## 10. Motion, path-scrolling and zoom choreography

**Both mockups are compelling stills. Neither demonstrates the motion system promised by the TIMEHUNT brief.** Motion cannot be approved from static images alone.

### Proposed six-beat interaction journey

**Beat 1 — Enter the field.** The opening shows the *whole eligible historical range*. A limited perspective shift reveals that the interval is navigable. The current year cursor is prominent; no extended animation delays the first interaction.

**Beat 2 — Form a hypothesis.** Drag or tap moves a fixed temporal marker relative to the calibrated field. The field has readable scale labels and friction, but the amount of movement remains predictable.

**Beat 3 — Zoom in.** Two-finger pinch or +/- zoom controls change the scale: centuries → decades → years. The historical coordinate under the user's fingers (or under the fixed cursor using buttons) stays visually anchored. Do not zoom away from the user’s chosen year.

**Beat 4 — Commit.** A press places a persistent guess trace. Earlier/later and distance feedback appear in place. The usable interval contracts while keeping the camera's context. The core action should remain quick.

**Beat 5 — Follow evidence.** Buying a clue reveals an evidence point connected to the temporal field. The view may travel a short path to the clue, then return to exactly the prior coordinate and zoom. The player should never have to reconstruct their position from memory.

**Beat 6 — Break open the year.** Once solved, the calibrated marker becomes the entry point into a different narrative layer. The reveal travels outward into people, places, material artifacts, statistics and historical questions, rather than merely presenting a score card.

### Recommended motion budget (design hypotheses to prototype)

| Interaction | Target character | Indicative duration |
|---|---|---:|
| Button/selector acknowledgment | Immediate, interruptible | ~80–160 ms |
| Guess placed and recorded | Firm but short | ~120–280 ms |
| Corridor contraction | Informative, no theatrics | ~180–350 ms |
| Small-scale zoom | Fluid, user-controlled | Follows gesture; short settle |
| Evidence branch travel | Spatial but optional | ~300–550 ms |
| Major solved-year reveal | Cinematic yet skippable | ~500–900 ms |

**These are design targets, not rules or promises about actual device performance.** Use a working prototype, test on midrange hardware and prioritize consistent input response over complex transitions.

### Path-scrolling: what it should and should not mean

**Should:** create a controlled feeling of traversing the time field; preserve chronological order; allow cinematic discovery; let the path curve or branch *visually* without distorting the mapping of dates.

**Should not:** require players to drag through a long invisible path; trap vertical page scrolling; randomly change the relationship between gesture distance and time; introduce parallax that causes text to slide independently of its label or information.

### Reduced motion

Provide a **fully equivalent** mode using direct position changes, shorter fades, fixed frames and concise state labels. Apple recommends adapting to Reduce Motion, including replacing substantial spatial transitions with simpler alternatives, and WCAG documents protections around interaction-triggered animation [R9–R11]. Make both modes understandable and functionally equivalent.

---

## 11. History, unusual facts, statistics and queer histories

The world reveal is TIMEHUNT's true editorial advantage. The history must have **variety of human experience and variety of visualization**. Simply adding an unusual fact under a date is not enough.

### The current 1969 set

The supplied designs show four items:

1. **Stonewall uprising**, beginning 28 June 1969 in New York [R12].
2. **Apollo 11 Moon landing**, 20 July 1969 [R13].
3. **Early ARPANET communication**, in 1969 between connected research sites [R14].
4. **Global population**, depicted as approximately 3.6 billion, a demographic estimate requiring an explicit named UN data revision and its methodology [R15].

This set demonstrates simultaneity, but three of the four stories are U.S.-centered. The same-year device should move beyond the relatively familiar “world changing inventions and famous events” formula. For instance, a reveal might juxtapose labor, food prices, local music, agricultural techniques, epidemics, household technology, migration, ordinary people, queer communities and political upheavals across multiple regions.

### Give different evidence different shapes

| Historical content | Appropriate treatment | Why |
|---|---|---|
| Specific dated event | Archival image/document with date/location | Human and material specificity |
| Queer activism/community | Documentary sources, testimony, mapped social settings | Agency, context, self-representation |
| Technical achievement | Annotated mechanism or interactive schematic | Show *how*, not just *when* |
| Demography / mortality | Chart with axes, units, uncertainty and data version | Makes statistics interpretable |
| Trade / migration | Route or flow graphic with evidence qualifications | Spatial relationships |
| Daily life | Material-culture objects, contextual illustration | Broadens beyond leaders and battles |
| Debated archaeology | Evidence comparison and uncertainty range | Avoids false certainty |
| Regional simultaneity | Linked mini-timelines and location labels | Builds the “many worlds, one year” idea |

### Queer history: substantive, not sensational

Historic England documents how historical terminology changes and how existing archives disproportionately preserve some communities over others [R16]. TIMEHUNT should distinguish contemporary self-description from retrospective labels; avoid projecting modern identity categories backward without explanation; and include contributions, relationships, creative lives and organizing, not exclusively repression or scandal. “Strange history” should never mean presenting marginalized people as curiosities.

### Content system requirements

- A visible **source** for every substantial claim.
- A **date precision** field: exact day, year, range, approximate, disputed.
- A distinction between **source observation, interpretation and hypothesis**.
- Named dataset and **edition/revision** for statistics, with units, scope and uncertainty as appropriate.
- A **regional/era balance review**, especially if daily targets are generated algorithmically.
- A way to show **multiple credible scholarly interpretations** when relevant.
- A **compact readable view** during gameplay and a **deeper optional view** after solving.

The goal is a playable historical publication that respects its audience—not a trivia engine padded with AI-generated “weird facts.”

---

## 12. Screen-by-screen redesign requirements

### Home screen

**Route B keeps:** mystery, teaser exposure, editorial title, strong call to action.  
**Route C keeps:** recognizable signature object and obvious sense of physical interaction.

**Redesign:** show a compact animated temporal instrument and one meaningful blank target; make the rules explicit: “A year is hidden. Spend guesses and evidence to find it.” Show daily hunt, practice and archive clearly. Don't imply the answer must be one of a small list of visible dates if it does not.

**Pass condition:** a new player can explain what to do after five seconds of viewing, without reading an introductory essay.

### First guess

**Redesign:** present the valid date domain, one large selector, one unambiguous “Commit guess” button and remaining attempts. Feedback should distinguish “earlier/later” from “closer/farther” if both are used.

**Pass condition:** a first-time player can submit a year without discovering a hidden gesture.

### Narrowed hunt

**Redesign:** the interval must visibly shrink and remain legible. Show prior marks and an efficient way to jump across decades versus adjust individual years. Never make the player select tiny year cells on a full-century overview.

**Pass condition:** selecting an adjacent year is easy even at maximum zoom, and zooming out preserves the current candidate.

### Evidence acquisition

**Redesign:** clues preview their type, cost and expected useful specificity in player-facing language. Redundant clues must not waste Insight. Source information should be available, but not dominate the decision.

**Pass condition:** a player can describe *what was learned* and why the purchase was or wasn't useful.

### Solved year

**Route B keeps:** giant year headline, strong light/dark contrast, four exposures as a narrative seed.  
**Route C rejects:** four nearly identical mini-dials.

**Redesign:** open with the solved date, then allow the world to unfold into multiple forms: image, document, map, chart, object and human story. Preserve a simple outcome summary for players who do not want to explore further.

**Pass condition:** each segment is legible, materially different when appropriate, sourced and understandable without relying on animation.

### Archive / replay

**Redesign:** retain B's strongest contact-sheet idea here, as a collectible library of *completed hunts*. Allow filtering by era, region and type of discovery; use identifiable visual thumbnails. Archive viewing should not make unrevealed daily answers easy to spoil.

---

## 13. Prioritized correction list and design-approval criteria

### P0 — Blockers, before approving visual identity

- [ ] Fix clue pricing and relevance: the Sputnik clue cannot cost Insight when no candidates are eliminated.
- [ ] Clarify the first-run task, target interval and meaning of the home-screen thumbnails.
- [ ] Make year selection usable without tiny cells or discovering a hidden crown gesture.
- [ ] Commit to a precise model of zoom anchoring and scroll-position restoration.
- [ ] Make feedback about earlier/later, eliminated years and guesses immediately legible.
- [ ] Replace the uniform mini-dial reveal with semantically appropriate content types.
- [ ] Provide equally functional reduced-motion interaction.

### P1 — Design identity, before polishing all screens

- [ ] Explore a warm non-blue direction; test **Oxide & Bone** on actual screens.
- [ ] Reduce dependence on one dominating geometric dial.
- [ ] Establish a functional type system for display, numbers and narrative text.
- [ ] Define the visual difference between **historical evidence**, **UI metaphor** and **illustrative reconstruction**.
- [ ] Create a credible *first six seconds* of gameplay with distinct feedback and one-handed ergonomics.
- [ ] Test how the design handles ancient history with uncertain dates; do not design exclusively for 1800–2000.

### P2 — Differentiation after the mechanic is proven

- [ ] Introduce special temporal transitions, not generic page animation.
- [ ] Develop a consistent family of engraved guesses, eliminated regions and source marks.
- [ ] Add carefully selected haptics and sound states, with independent controls.
- [ ] Create an archive collection whose individual entries are genuinely recognizable.
- [ ] Add rich comparative historical graphics and international source diversity.

### Minimum acceptance package for the next design review

Require **working artifacts**, not only static boards:

1. A short motion prototype of **home → first guess → narrowed corridor → clue → solve → world reveal**.
2. A realistic small-phone test, including dynamic text size.
3. One completed daily hunt with **valid historical data and nonredundant clues**.
4. A side-by-side visual comparison of B, C and STRATA using the **same exact content and game state**.
5. A reduced-motion walkthrough.
6. A documented color/contrast audit for text, states and critical icons.
7. A brief rationale showing why the recommended design is more usable and more memorable than the discarded alternatives.

**Approval should depend on these artifacts, not how photogenic a presentation board looks.**

---

## 14. Tests to run before approving the design

| Test | Procedure | Observe | Evidence needed to approve |
|---|---|---|---|
| Uncoached onboarding | Show home screen, no instructions | Can player state goal and start? | Most test participants correctly identify the basic action |
| Input discoverability | Ask for first guess | Does player find selector/crown? | No critical hidden-gesture blockers |
| Precision navigation | Ask for 1959, then 1960, then 1850 | Overshoot, fatigue, time | Adjacent and distant selections are comfortable |
| Clue-value comprehension | Offer useful and redundant clues | Understand cost/effect? | Players can explain the benefit of purchase |
| Visual hierarchy | Five-second screenshot exposure | Recall highest-priority elements | Correctly identify guess, remaining budget, action |
| Historical diversity | Show reveals from 1969, 1453, c. 1200 BCE | Does system work across eras? | Chronology, uncertainty and evidence remain coherent |
| Reduced motion | Use system setting | Are meanings preserved? | Full game remains playable, with no missing information |
| Small-phone accessibility | Test small viewport and larger text | Clipping, precision, hierarchy | Primary flow remains usable and readable |
| Delight without compulsion | 10–15-minute open play session | Voluntary replay and stated reasons | Replay is motivated by mastery/curiosity, not confusion |

These are **research plans**, not findings. For credible comparison, recruit players with different history familiarity, thumb reach, accessibility needs and gaming habits; avoid relying solely on the designer or the AI agent that produced the work.

---

## 15. Final judgment

The visual concepts are good enough to justify continued work, but not strong enough to justify locking the interface.

**Route B** has the stronger identity as a cultural artifact and the better approach to *what history looks like after discovery*. Its contact-sheet metaphor, expressive typography and 1969 editorial reveal deserve preservation. But its core controls risk being miniature, repetitive and conceptually less compelling than the final artwork.

**Route C** has the stronger interaction model and offers a believable reason for scrolling and zooming. The physical controller is the right strategic foundation for TIMEHUNT. But an oversized silver dial, cobalt accents and uniform reveal icons do not yet communicate the intellectual range, emotional humanity or visual surprise of world history.

**Best next move:** design **STRATA** around *continuous historical navigation*, *honest clues* and *editorial discoveries*, using a warm palette with precise functional marks and historically varied media.

> **The player should not feel like someone operating a clock to answer a quiz. They should feel like an investigator moving through historical time—where every guess changes the available territory, and every solved date opens into a much larger world.**

**Final scores: Route B 7.2/10; Route C 7.7/10. Recommended direction: C's interaction + B's storytelling, transformed into STRATA. Not approved for final visual production yet.**

---

## 16. Sources and further visual references

### Design practice / behavioral heuristics

- **[R1] Nielsen Norman Group — *10 Usability Heuristics for User Interface Design*.** Visibility of system status, recognition versus recall, user control, clear feedback and minimalist information prioritization. https://www.nngroup.com/articles/ten-usability-heuristics/
- **[R2] Apple Developer — *Buttons* (Human Interface Guidelines).** General guidance for at least 44 × 44 pt tappable regions. https://developer.apple.com/design/human-interface-guidelines/buttons
- **[R3] W3C — *WCAG 2.2*.** Contrast minimums, target-size criteria, animation considerations and their specific exceptions. https://www.w3.org/TR/WCAG22/
- **[R4] W3C — *Understanding Target Size (Minimum)*.** Explanation of the 24 CSS-pixel Level AA criterion and its exceptions; not a universal ideal touch target. https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- **[R7] Nielsen Norman Group — *Top 10 Application-Design Mistakes*.** Weak signifiers and the need to convey interaction possibilities. https://www.nngroup.com/articles/top-10-application-design-mistakes/
- **[R9] Apple Developer — *Motion* (Human Interface Guidelines).** Meaningful animation, status, guidance and motion restraint. https://developer.apple.com/design/human-interface-guidelines/motion
- **[R10] Apple Developer — *Accessibility* (Human Interface Guidelines).** Reduce Motion and other accessibility accommodations. https://developer.apple.com/design/human-interface-guidelines/accessibility
- **[R11] W3C — *Understanding Animation from Interactions*.** Interaction-triggered animation and controls for motion-sensitive users. https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions

### Art history, archival processes and visual references

- **[R5] Victoria and Albert Museum — *Cameraless photography*.** Herschel's cyanotype process and Anna Atkins's scientific image-making; useful context for B's reference language. https://www.vam.ac.uk/articles/cameraless-photography
- **[R6] Natural History Museum — *Anna Atkins’s cyanotypes: The first book of photographs*.** Historical grounding for contact prints, cyanotype and scientific images. https://www.nhm.ac.uk/discover/anna-atkins-cyanotypes-the-first-book-of-photographs.html
- **Visual reference A — V&A photography process collection:** https://www.vam.ac.uk/articles/photographic-processes
- **Visual reference B — MoMA, Anna Atkins artist record:** https://www.moma.org/artists/231-anna-atkins
- **Visual reference C — V&A, Atkins archival conservation and exhibition context:** https://www.vam.ac.uk/blog/caring-for-our-collections/a-blueprint-for-the-future-cyanotypes-by-anna-atkins

*These visual references support the critical discussion; they are not instructions to reproduce copyrighted layouts or artworks. Historical association must not be confused with ownership of a contemporary UI concept.*

### Historical fact-checking for the presented 1969 example

- **[R8] NASA — *Dawn of the Space Age*.** Sputnik 1 and the first satellite, 4 October 1957. https://www.nasa.gov/history/dawn-of-the-space-age/
- **[R12] Library of Congress — *Today in History: June 28*.** The beginning of the Stonewall uprising, 1969. https://www.loc.gov/item/today-in-history/june-28/
- **[R13] NASA — *Apollo 11 Timeline*.** Lunar landing on 20 July 1969. https://www.nasa.gov/wp-content/uploads/static/history/SP-4029/Apollo_11i_Timeline.htm
- **[R14] Internet Society — *A Brief History of the Internet*.** Early ARPANET nodes and message transmission in 1969. https://www.internetsociety.org/internet/history-internet/brief-history-internet/
- **[R15] United Nations DESA — *World Population Prospects*.** Official population datasets and revision information; check the specific revision before displaying a historic numerical estimate. https://population.un.org/wpp/
- **[R16] Historic England — *Who’s Included in the LGBTQ Past?*.** Historical terminology, archival bias and inclusive interpretation. https://historicengland.org.uk/research/inclusive-heritage/lgbtq-heritage-project/who-is-included/

### Transparency

- Ratings, route preference, the STRATA concept, proposed palettes, motion timings, testing criteria and judgments about aesthetic distinctiveness are **original recommendations**, not empirical conclusions from the sources.
- Hex colors for Routes B and C are transcribed from the supplied visual concept boards. The *Oxide & Bone* palette is a proposed design direction, and its specific reported contrast values are calculated from the listed hex colors, not sampled from a functioning interface.
- The review does not claim to have played, animated, coded or usability-tested the depicted designs.
