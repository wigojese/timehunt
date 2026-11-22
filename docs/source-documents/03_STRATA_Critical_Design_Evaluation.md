# TIMEHUNT / STRATA — Critical Design Evaluation

**Review of the revised mobile-first historical deduction game design**  
**Date:** 23 November 2026  
**Materials reviewed:** Three supplied STRATA presentation sheets: (1) *Time as a core sample / The honest hunt*, (2) *One year, four forms of evidence / The World Reveal*, and (3) *States, colour and type you can check / The system*.  
**Review lenses:** Art direction and visual history; interface and interaction design; cognitive ergonomics and behavioral psychology; historical research and editorial ethics; game-system fairness; accessibility and motion.  
**Status:** Design critique of static mockups, **not** a user test, accessibility audit of running software, code inspection, or verification of animation and haptics.

> **Verdict: Approve the STRATA art-direction *concept*, but do not approve production implementation of the present screens without another interaction and usability pass.**
>
> **STRATA scores 8.3/10 as a visual/product concept, and 6.7/10 for demonstrated implementation readiness.** It is more distinctive and more internally coherent than either previous route. Its major risks are excessive in-game visual density, underdeveloped embodied navigation, a World Reveal that reads like a well-typeset lesson rather than an exhilarating reward, and a subtle but consequential historical-date problem in the 1957 satellite clue.

### Images reviewed

These relative images display when this Markdown file is opened from the accompanying ZIP with its `assets/` folder. This text report remains intelligible without them.

![STRATA hunt and lock screen sequence](assets/01_hunt_sequence.png)

*Sheet 1: Home, the active hunt, evidence purchasing, and the solved-year lock screen.*

![STRATA World Reveal sequence](assets/02_world_reveal.png)

*Sheet 2: 1969 World Reveal — entry plus Concorde, Stonewall, Apollo 11, and global population.*

![STRATA design system](assets/03_design_system.png)

*Sheet 3: Colors, type, semantic states, mark, controls, and grayscale test.*

---

## 1. Executive judgment

The new design responds seriously to the earlier criticism. It does not merely apply warm colors to Route C's dial. It introduces a new representation of the central problem: **a historical year is located by reading, measuring, and cutting into a temporal core sample.** Each guess and purchased clue changes the available field. Evidence is physically pinned to the line at which it changes the possibilities. That is a much stronger relationship between theme, rules, visual form, and control.

Five advances are particularly convincing:

1. **The historical field is the game's main object.** It is no longer a decorative archive or an outsized dial surrounding conventional quiz mechanics.
2. **Visual states have explanations beyond color.** Hatch, stipple, stripes, outlines, labels, and boundary marks distinguish types of information.
3. **The clue system now visualizes information gain.** The caption that a clue reduced 104 candidate years to 27 is a genuine improvement over a contextless “2 Insight” price.
4. **The solved-year experience has multiple evidence forms.** A technical drawing, textual historical account, mechanism diagram, and population chart are treated differently.
5. **The design-system sheet demonstrates discipline.** It specifies real HEX colors, named type roles, sampled contrast ratios, icon sizes, and several ways to set a year.

And five reservations prevent unconditional approval:

1. **At actual phone size the hunt is still an intricate technical diagram first and a fast game second.** A player must decipher what many simultaneous textures, boundaries, markers, numbers and controls mean.
2. **The core-sample metaphor carries the aesthetic, but the relationship between texture and historical information remains ambiguous.** Decorative decade patterns can resemble data without communicating any data.
3. **The visual reward collapses after success.** The lock screen is strong; the subsequent reveal screens are competent but over-uniform, resembling editorial teaching slides more than exploration through history.
4. **The requested path-scrolling, pinch-zoom, camera continuity and scene morphing cannot be evaluated from still images.** This is an evidence gap, not proof that those interactions are absent from working code.
5. **The satellite clue's exact year boundary requires editorial clarification**: Sputnik 1 entered orbit on 4 October **1957**, whereas the screen excludes 1957 as though the general statement “satellites are already orbiting Earth” were only true from 1958. [H1]

**Core recommendation:** Keep STRATA's mechanism and materials, **subtract approximately 25–35% of simultaneously visible explanatory detail from the hunt**, give the reveal a dramatically different spatial and visual tempo, and prototype the camera before polishing more presentation boards. The proposed percentage is an art-direction target, not a measured clutter statistic.

---

## 2. Scorecard and how to interpret it

**These are critical-judgment scores, not empirical usability data.** A screenshot cannot prove an animation's fluidity, a control's actual touch target, screen-reader behavior, or whether anyone enjoys repeated play. Where a feature is only described rather than demonstrated, the rating reflects its current design evidence, not final potential.

| Dimension | Score /10 | Critical reading |
|---|---:|---|
| Originality of design concept | **8.8** | A strong, recognizable material metaphor; visually independent of generic quiz apps. |
| Brand and visual identity | **8.6** | Cohesive palette, icon, type, and repeated motifs; risks becoming overly austere. |
| Art-historical and material coherence | **8.5** | Engraving, strata and field-report conventions work together; sometimes their meanings blur. |
| Color and token architecture | **8.8** | Much better than the earlier blue-heavy route; use colors sparingly. |
| Typography as expressive design | **8.2** | Strong number/serif/condensed contrast; miniature information undermines its strength. |
| Information hierarchy | **7.0** | Clear primary date, but too many secondary systems compete for attention. |
| First-time comprehension | **6.6** | Several unexplained patterns and controls create an unnecessarily steep first minute. |
| One-hand ergonomics | **7.0** | Large action buttons and alternative inputs help; wheel/ruler access needs testing. |
| Game mechanic represented visually | **8.7** | Better match of guess → evidence → narrowed corridor than the previous routes. |
| Clue economy and fairness | **8.2** | Information gain is visible; year-boundary and preview-leak issues require resolution. |
| Behavioral replay appeal | **7.6** | Satisfying possibility-narrowing loop, but presentation may slow repeated sessions. |
| Motion and spatial-navigation design, demonstrated | **5.4** | Promising underlying geometry, but no actual scroll/zoom/transition prototype shown. |
| Solved-year lock moment | **8.5** | Strong typographic release of tension, understandable summary of the search path. |
| World Reveal editorial variety | **7.6** | Four form types, but visual rhythm is too consistent and mostly static. |
| Global historical breadth | **5.9** | 1969 selection is transatlantic/U.S.-heavy; a world-history promise needs more range. |
| Historical nuance and source-awareness | **8.2** | Uncertainty and sourcing are acknowledged; not yet publication-ready. |
| Accessibility *design intent* | **8.7** | Multiple input methods, non-color states, grayscale test, contrast checks. |
| Accessibility *demonstrated by mockups* | **6.8** | Tiny actual labels, patterned density, unknown text scaling and focus behavior. |
| Feasibility of a coherent prototype | **8.0** | Fixed year ranges and a deterministic engine are feasible if content pipeline is rigorous. |

**Overall concept: 8.3/10.** This is a qualitative holistic judgment, not an arithmetic mean of differently weighted categories.  
**Demonstrated production readiness: 6.7/10.** A further interactive prototype, accessibility review, and source review are required.

### Versus previous routes

| Route | Earlier evaluation | Current judgment |
|---|---:|---|
| B — Archive Afterimage | 7.2/10 | Better typographic atmosphere than gameplay control. |
| C — Deep-Time Instrument | 7.7/10 | Better physical control than historical breadth. |
| **STRATA — current** | **8.3/10 (concept)** | Best alignment of material, game logic, and evidence. |

This is a directional comparison of creative concepts, **not** a standardized head-to-head experiment: the previous designs and STRATA present different levels of detail.

---

## 3. The art-history critique: is STRATA a distinctive visual language?

### 3.1 What the design gets right

The strongest choice is to refer to **practices of reading evidence** rather than relying on superficial “old” motifs. The visual world draws from geological sections, calibrated measuring devices, archival tags, engraving and technical print. Those references have a productive conceptual relationship: they all externalize hidden structure and make invisible differences measurable.

STRATA is not trying to recreate a particular ancient civilization. It imagines a contemporary instrument that examines traces of many eras. That makes it much more extensible than fake parchment, classical columns, or a sepia “history” interface that inevitably privileges certain periods.

Its three typographic roles are appropriate: a distinctive soft serif for large years and narrative openings (the sheet names Young Serif); a condensed mechanical sans for rulers and labels (Sofia Sans Extra Condensed); and a more neutral reading face for prose (Sofia Sans). Those choices give expressive hierarchy without turning every interface element into an illustration.

The black app mark with staggered ivory bands and a vermilion diagonal fault is also promising. It communicates ordered strata disrupted by discovery. Unlike an hourglass or clock face, it can grow into a recognizable identity of its own.

### 3.2 What feels less resolved

**The design conflates three modes of notation:** the *scientific recording of layers*, the *measurement of time*, and the *categorization of guesses*. At times the layer pattern looks like a material sample; elsewhere the pattern literally means “ruled out by evidence” or “ruled out by guess.” That can be elegant if the vocabulary is consistent, but the present system offers too many visually similar textural dialects. A casual player may confuse decorative texture with historical information.

The promise that “each decade has its own texture so you learn it by sight” is also questionable. Why should 1960–1969 have a brick pattern and 1970–1979 a different one? Unless there is a learnable, stable, *useful* rule, the textures make the screen more intricate without improving reasoning. They can imply that the historical periods possess distinct geologic properties, or that a particular pattern has evidentiary meaning, when neither is true.

**Recommendation:** Reserve textures primarily for semantic states (available, excluded by guess, excluded by evidence, selected, solved). If decade band textures remain, use only two or three extremely subtle patterns as editorial atmosphere and keep them perceptually subordinate to the data. Test whether users can explain each pattern without a legend.

### 3.3 The limits of the geology analogy

“Older lies lower” is useful as a design metaphor, but historical years are not sediments and actual stratigraphic sequences can be disturbed, inverted, truncated or reworked. Treat the display as an invented **temporal instrument**, not as literal geological science. The vertical order is a deliberate convention; do not imply that physical strata correspond to fixed decades or that equal spatial bands correspond to equal historical evidence.

**Art-historical judgment:** It is an authored contemporary editorial identity with technical-print influences, not an archaeological reconstruction. That is a strength. Keep the constructed, speculative quality explicit.

---

## 4. Screen-by-screen critique: the honest hunt

### 4.1 Home — **8.2/10**

**Visible:** “Timehunt,” dated Daily Hunt, an 1800–2000 core sample, a narrow dark wheel with gold indicator, the statement “A year is hiding between 1800 and 2000,” and a broad vermilion CTA.

**Strengths.** The first screen explains what the player is searching for more clearly than the previous contact-sheet home. It presents the *entire* allowable time range, avoiding the ambiguity that only a few displayed years might be candidates. The left calendar ticks and layered body provide an immediate puzzle premise. The bottom CTA is direct and has strong visual contrast.

**Problems.** The core sample is still legible mainly as a beautiful object; new players may not know whether they should drag the striped object, the ticked ruler, or the dark right-hand wheel. The text “Drag the wheel, or use the keys, to set a year” appears before the player has seen the hunt controls. The gold marker inside the wheel sits close to the eventual solution year and can appear to mark a preexisting secret target—even if it is merely a default thumb position.

**Required change.** Make the home screen more of a *question* than a schematic: let a single active locator animate or move visibly under the player's finger, and avoid any highlight that could be mistaken for the concealed answer. Use a one-action, optional 5–10-second playable tutorial: move marker → see year update → release; then start. Avoid forcing everyone through instructions.

### 4.2 Active hunt — **7.1/10**

**Visible:** Daily Hunt 42, four guesses remaining, eight Insight remaining, candidate year **1962**, current corridor **1958–1984**, vertical section from about 1940 to 2000, striped/hatch/stipple regions, historical guess annotations, a tall right-side wheel, step buttons (−10, −1, +1, +10), “Fit 1958–1984,” “Evidence,” and “Lock in 1962.”

**Strengths.** State transitions appear conceptually honest. Guess 1880 produces “later”; 1985 produces “earlier”; the interval becomes 1881–1984 before the clue, then 1958–1984 after it. This is much stronger than changing a color and reporting “hot/cold.” The left micro-overview that retains the whole 1800–2000 interval is a good orientation mechanism; a player can see the relationship between global range and zoomed viewport. The exact candidate year is huge, which is appropriate. The primary action is visually prominent.

**Problems.** The interface asks players to interpret at least seven things simultaneously: (1) current year, (2) live corridor, (3) global range, (4) cropped range, (5) guess markers, (6) evidence-cut boundary, and (7) wheel interaction. This is more simultaneous data than most new players need to make the next decision. The block patterns fight with the 1962 locator. The evidence tag partly overprints the chart, which is conceptually neat but creates visual occlusion. The prior guess annotation looks like a pop-up inside a data area, obscuring the underlying representation. The bottom controls offer several interchangeable methods without showing a single default.

**Redesign:**

- Promote **one question** at a time: “What year will you try?” Keep `1962` largest; show `1958–1984 · 27 possible years` as one concise label.
- Put guess history behind a small expandable “2 guesses” affordance by default; keep the most recent boundary visible as a simple directional marker.
- Treat the large graph as a **navigable field**, not as the location of every sentence. Tapping a boundary reveals a panel; do not pin the full explanatory paragraph to the live chart during continuous scrubbing.
- Keep **one default control**: drag the wheel *or* tap the ruler, with direct year entry as an explicit alternate. Provide ±1/±10 as small supporting shortcuts, perhaps in a pull-up precision tray.
- Reserve a persistent, unobstructed 46–56 px interaction region for the principal selector; its actual dimensions must be verified on target devices. W3C WCAG 2.2 AA has a 24 CSS-px minimum criterion with exceptions, while the enhanced target-size criterion is 44 CSS px; those do not mean 24 px is good for a frequently manipulated game controller. [A1][A2]
- Make zoom position, clipping and corridor endpoints reversible and discoverable. The player should never think that years outside the visible viewport have been removed from the game.

**Behavioral diagnosis.** The board communicates enormous competence and precision, but may impose unnecessary *interpretive work*. Players should spend cognitive effort selecting better guesses, not decoding the plotting grammar. NN/g's recognition-over-recall principle is especially relevant to the multiple control methods and dense state legend. [U1]

### 4.3 Evidence overlay — **7.8/10**

**Visible:** A bottom sheet with four categories: Spaceflight, Queer history, Daily life and Demographics. Each has a preview, sharp/broad descriptors, geographical scope and a purchase cost. One clue promises the same cut as another; another is explicitly redundant and free.

**This is one of the largest improvements.** The design communicates that **the value of a clue is the information it gives you**, not merely its interesting subject. Explicitly showing a “same cut” warning is excellent. Showing a non-narrowing clue as free is a strong fairness signal.

**But there are three design problems.**

1. **“Buy 3” sounds like an in-app purchase.** Here the resource is Insight, not money. Say **“Use 3 Insight”** or **“Reveal · 3 Insight.”** On a game involving queer history, monetization-like phrasing next to identity and persecution also creates a tonal problem, even when no real money is involved.
2. **The preview may reveal the clue's answer before the player pays.** The small bars appear to visualize narrowing near specific temporal boundaries. If they reveal the exact direction or cutoff, an expert may infer the answer without spending Insight. Preview *estimated usefulness* (“likely to reduce the possible range substantially”) without leaking the actual hidden constraint.
3. **The taxonomy mixes domains and geography.** “Sharp · Worldwide” can describe an effect, but the categories themselves (“Queer history,” “Spaceflight,” “Daily life”) differ in subject specificity and evidentiary type. The system needs a stable formal clue taxonomy behind the editorial names.

**Better evidence-row design:** category / what question the clue can answer / approximate expected narrowing / evidence grade / amount of Insight / clear Reveal action. After purchase, show **actual** reduction as number of remaining years and a short, sourced explanatory sentence.

### 4.4 Solved-year lock — **8.6/10**

**Visible:** Dark stacked bands separate around the found year, huge **1969**, “Found in 4 of 6 guesses,” “5 of 10 Insight spent,” and a compact route through guesses 1880 → 1985 → 1962 → 1969.

This is the most successful individual game screen. It rewards deduction with a visual release: the date emerges from between material layers. The path recap is meaningful and shareable, and the brief score reporting is transparent rather than manipulative. The dark background is justified because success is a new mode, not because dark design always looks premium.

**Recommended refinement.** Let the animation preserve the exact *cut boundary* the player saw in the hunt: the existing stratum splits, then the date expands from the opening. Do not replace it with an unrelated splash transition. A small 1–2-second optional “opening the layers” moment could be memorable, but provide a tap-to-skip and a reduced-motion equivalent. Make “Open 1969” a more exciting semantic promise than “Continue”; it already is in the mockup.

---

## 5. The World Reveal: ambitious editorial idea, insufficient emotional range

### 5.1 Entry screen — **8.1/10**

“One year. Several worlds.” is concise and better than a generic success page. The four dated events form a recognizable path and communicate the project's central history proposition: **simultaneous does not mean causally connected.** That's a valuable distinction.

However, the short path is still a list. Make it *travel*: zoom out from the year to the four moments distributed in geography and subject, with continuity between the solved marker and each story's temporal location. The switch to archival exploration should feel like a reward for solving, not a mandatory lesson. “Skip to sources” is a good sign; also allow “Save for later,” “Explore another story,” and “Play another hunt,” without burying the fastest exit.

### 5.2 Concorde 001 — **8.0/10**

A labeled technical drawing is an appropriate form for explaining a material object. The 2 March 1969 first flight is corroborated by Air France and the Musée de l'Air et de l'Espace. [H2][H3] The design makes the aircraft's delta wing, droop nose and engines visible. But its miniature red annotation labels require enlargement on phones. A schematic should let players tap each feature, isolate it, and see what that engineering choice made possible. Static annotations on a small rectangle do not yet deliver the full value of an interactive diagram.

### 5.3 Stonewall uprising — **7.8/10**

The draft avoids sensational imagery and is careful to say that people involved in Stonewall used different identity language, an important historical principle. The Library of Congress dates the start to the early morning of 28 June 1969 and describes the subsequent days of protest. [H4] Historic England cautions against treating all historical LGBTQ identities as equivalents of present-day terminology. [H5]

But **the screen called “Documents” does not visibly display any document**. It is mainly explanatory body copy. The concept says “the words are not decoration; reading notes sits beside the story”; good intent, insufficient visual realization. Use a rights-cleared newspaper fragment, leaflet, organizational record, oral-history excerpt with precise attribution, or an annotated documentary transcription, *if* genuinely available. Show provenance and distinction between contemporary descriptions and later interpretations. Never fabricate an archival facsimile simply for atmosphere.

A more human story can be layered in without turning historical oppression into spectacle: who was there, what the social conditions were, which accounts differ, and how later commemoration can simplify or omit people.

### 5.4 Apollo 11 — **8.1/10**

The schematic visually distinguishes Earth, the Moon and four mission stages. NASA corroborates the launch on 16 July, lunar landing on 20 July, and splashdown on 24 July 1969. [H6] The orbital path is labeled “Not to scale,” which is good. The problem is that the drawing is mostly didactic. It should be a tiny interactive mechanism: tap 1–4 to animate movement along the route, scrub mission time, or compare real distances with a separate scaled explanatory view. The map/diagram is an explanatory model, not a physics simulation; keep labels honest.

### 5.5 World population — **7.5/10**

The decision to switch from narrative and mechanism to a chart is excellent. The year 1969 world population is presented as approximately **3.6 billion**, with an “Estimate” state rather than a fictitious exact census. This is the right kind of epistemic caution. The UN World Population Prospects is an appropriate source family, but the screenshot does not identify the specific revision, table, unit, interpolation or estimation date used. [H7]

The thin line and tiny axis labels feel too archival at the expense of reading. The point for 1969 should be unmistakable; tapping it should show the exact estimate used, population unit, source revision, and method. Consider a second view comparing 1969 with a later year using the **same** dataset, not casually mixing revisions or inventing a confidence interval.

### 5.6 The deeper reveal problem — **6.8/10 for the combined experiential journey**

All four stories use the same pale background, large serif title, thin divider, one small primary figure and lower explanatory text. The evidence forms differ, but the emotional and spatial *behavior* barely changes. The set feels like a very good museum microsite or textbook spread. It is not yet an unforgettable reward sequence for a successful hunt.

**Recommendation:** Keep evidence-driven form, but give each story a different *interaction verb* rather than a different illustration alone:

| Story | Distinct verb | Distinct form |
|---|---|---|
| Concorde | **Inspect** | Exploded object with tappable parts and reversible assembly. |
| Stonewall | **Read / compare** | Two situated source fragments, an annotation, and contextual timeline. |
| Apollo | **Trace** | Four-step mission trajectory you can scrub. |
| Population | **Scale / compare** | Responsive chart with an explicit counter and uncertainty note. |

The visual texture may unify them; the **actions** must differ. Make the transitions short, spatially continuous and user-controlled rather than turning the four stories into a compulsory linear slideshow.

### 5.7 Geographic and historical balance

For 1969, the chosen documentary sample comprises a European aviation milestone, a New York uprising, a U.S. lunar mission and global population. That's a reasonable *prototype* spread of evidence types, but a weak representation of “several worlds.” In the next content pass, include one or more equally well-sourced stories from Asia, Africa, Latin America, Oceania or the Middle East. Do not insert facts solely for a quota; instead commission stronger stories with primary or reputable secondary sources, and track balance across the whole catalog.

---

## 6. Game psychology and the actual replay loop

### The improvement

STRATA's strongest gameplay insight is **legible information reduction**. It shows not just “hotter” or “colder” but *why* the hypothesis space changed. A player who guesses 1880, then 1985, can see which years were excluded by the two comparisons. Evidence introduces a distinct strategic decision: spend limited Insight to remove more possibilities, or rely on deduction and preserve score resources. This can support mastery better than simple date memorization.

### The remaining psychological risks

**Cognitive overload.** Heavy patterns, numerical counters, year ruler, wheel, zoom window, historic annotations, and controls are all visible at once. The risk is that people feel like they are operating a surveying tool, but never reach the moment of playful intuition. The number of simultaneous state encodings should increase with experience rather than arrive fully formed in the first session.

**Loss of perceived control.** If wheel drag changes the year nonlinearly, if a zoom gesture shifts the chosen year unexpectedly, or if a bought clue removes a band without a predictable explanation, players may experience the instrument as arbitrary. Show immediate reversible previews before committing a guess.

**Ambiguous scarcity.** Insight is both a score resource and a means of winning. The design needs to prove that a 3-Insight “sharp” clue can often be worth buying, but is not universally optimal. Avoid a system where a player can always win by taking the same clue sequence.

**Weak replay tempo.** Each hunt has six guesses. If every action requires tapping small controls and reading paragraphs, daily play can become slow and dutiful. Keep the core hunt responsive and provide optional deeper explanation *after* a feedback response.

**Unearned narrative obligation.** A player may solve the date in one minute and have no time for four long stories. Celebrate the solve, then make the world reveal optional and easy to resume.

### Concrete behavioral improvements

- Use a **two-level interface**: *play mode* (year, corridor, primary control, one insight action), and *inspect mode* (guess history, evidence provenance, detailed stratigraphic annotations).
- Introduce a **one-sentence first-guess prompt**: “Choose any year to begin shrinking the range.” Do not front-load the full rules.
- Show each purchase's actual effect **only after purchase**: `104 → 27 possible years (−77, 74% removed)`; show total rather than misleading marginal value if several clues overlap.
- Provide a **low-friction retry** and meaningful daily share text that does not spoil the hidden answer; avoid bought advantages, paid hint bundles, energy timers or manipulative streak-repair mechanics.
- Prefer skill-based difficulty modes: broad years; two-clue puzzle; harder ranges; deliberately underdetermined “archive research” mode that accepts multiple justified answers rather than pretending certainty.
- Distinguish **interesting** from **useful**. A beautiful but non-narrowing fact can be a free Discovery rather than a paid clue.

**Behavioral takeaway:** STRATA has the ingredients of a satisfying game, but it still risks teaching the interface rather than letting players intuitively use it. The best next improvement is **less visible machinery during the act of deciding**.

---

## 7. The central historical/game-logic issue: 1957 versus 1958

This is the most consequential factual criticism in the three new boards. The revised UI says the purchased technology clue:

> “Artificial satellites are already orbiting Earth.”
>
> “Cuts 104 years down to 27. Rules out 1881–1957. Grade A.”

**What checks out mathematically:**

- Guess 1: 1880 is earlier than the target → candidate years **1881–2000** (if initial bounds are 1800–2000, inclusive).
- Guess 2: 1985 is later than the target → candidates **1881–1984**, totaling **104** years.
- Proposed purchased clue narrows to **1958–1984**, totaling **27** years.
- This eliminates **77** candidate years or approximately **74.0%** of the 104-year interval. The narrowing is mathematically sound *if the clue's rule really starts at 1958*.

**What requires correction:** NASA records that Sputnik 1, the first artificial Earth satellite, entered orbit on **4 October 1957**. [H1] The generic sentence “Artificial satellites are already orbiting Earth” can be true during **1957**. Unless TIMEHUNT defines the test as true **at the start of the hidden calendar year**, exclusion of all of 1957 is unjustified.

There are two defensible remedies:

1. **Keep the 27-year corridor and rewrite the clue:** “**By 1 January of this year, at least one artificial satellite had already reached Earth orbit.**” Then 1958 is a defensible first matching year, given Sputnik's 1957 launch and continued orbit into early January 1958. Document the time-of-year convention and actual sources.
2. **Keep the broad sentence and widen the eligible range to include 1957:** candidates **1957–1984** = **28** years. Do not claim that 1957 is impossible.

**Do not fix the issue merely by changing the tiny `Grade A` badge.** A Grade A source can support a true fact while the *game's logical inference* remains unsound. Content accuracy and clue validity need separate tests.

### Clue-valuation specification

For a current candidate set `C` and clue `E`, calculate the remaining set as `C' = C ∩ compatibleYears(E)`. The true marginal information of a purchased clue depends on the **current** `C`, not just the clue in isolation.

```text
candidate_years_before = {1881 ... 1984}   # 104 years
compatible_years = {1958 ... 2000}         # only if Jan 1 framing is used
candidate_years_after = intersection(...)  # {1958 ... 1984} = 27
removed = 104 - 27                         # 77
reduction_fraction = 77 / 104              # 0.74038...
```

If another clue already restricts the interval to `1958–1984`, the same technology clue has **0 marginal reduction** and should either be free, warned as redundant, or omitted from paid choices. The screen now gestures toward this excellent behavior; the engine must implement it, not hard-code the 1969 example.

Additional edge cases to test: BCE/CE without user-facing year zero, ambiguous centuries, events dated only to decades, changes in calendar systems, ongoing processes as opposed to instantaneous events, simultaneous truths that cannot uniquely isolate a year, and conflicting sources.

---

## 8. Color direction: a significant upgrade

The blue-heavy Archive Afterimage had rich atmosphere but overly uniform tonality. The warm mineral system is more natural to STRATA's material logic and feels less like a typical digital product. Crucially, vermilion has a role (active locator / committed action), patina has a role (evidence / live corridor), and brass is reserved for rare resolution accents.

### 8.1 Actual palette shown on the supplied sheet

| Token | HEX | Proposed meaning | Judgment |
|---|---|---|---|
| Bone | `#F2ECE0` | Main canvas | **Keep.** Warm, calm and distinctive. |
| Paper | `#FBF7EF` | Evidence tags and reveal | **Keep.** Useful subtle surface distinction. |
| Coal | `#241F1B` | Primary ink and marks | **Keep.** Softens harsh pure black. |
| Soot | `#171817` | Dark win screen | **Keep.** Strong mode contrast. |
| Vermilion | `#B4412D` | Current year, active action | **Keep, but use sparingly.** |
| Patina | `#526A57` | Evidence, active temporal corridor | **Keep.** Distinct from vermilion. |
| Brass | `#D4B058` | Revealed lock / dark accent | **Keep only for rare state transitions.** |
| Pale rust | `#E6B6A4` | Support background | **Reduce.** Too many warm surfaces can muddy hierarchy. |
| Muted ink | `#675F55` | Captions on light surfaces | **Keep for readable body-sized captions.** |
| Muted on dark | `#A59D8E` | Captions on Soot | **Keep, test at real mobile size.** |
| Stone 1 | `#D8CDB7` | Decade background | **Keep as one of very few neutrals.** |
| Stone 3 | `#B4AE95` | Darker decade background | **Reduce variation.** |

This is a precise transcription of the HEX values visible in the design-system sheet. The actual rendered pixels can vary due to screenshots, antialiasing and display conversion.

### 8.2 Contrast audit of declared solid color pairs

Computed independently using WCAG's sRGB relative-luminance formula, rounded to two decimals. These figures assess **declared flat color pairings**, not the full screenshot's typography, stipple antialiasing, opacity overlays or interactive states. W3C WCAG AA generally requires 4.5:1 for normal-size text and 3:1 for large text; non-text UI boundaries have additional criteria. [A2][A3]

| Foreground / background | Ratio | Normal text AA? | Intended use |
|---|---:|---|---|
| Coal / Bone | **13.87:1** | Pass | Main copy |
| Muted ink / Bone | **5.34:1** | Pass | Captions |
| Muted ink / Paper | **5.88:1** | Pass | Notes |
| Patina / Paper | **5.52:1** | Pass | Evidence headings |
| Bone / Vermilion | **4.78:1** | Pass, narrow margin | Primary CTA |
| Vermilion / Paper | **5.26:1** | Pass | Small interactive accents |
| Coal / Stone 3 | **7.33:1** | Pass | Timeline labels |
| Bone / Soot | **15.13:1** | Pass | Dark reveal copy |
| Muted on dark / Soot | **6.62:1** | Pass | Dark captions |
| Brass / Soot | **8.61:1** | Pass | Lock accent and number |
| Coal / Brass | **7.89:1** | Pass | Dark text on gold button |
| Brass / Bone | **1.76:1** | **Fail** | Do not use as ordinary text |
| Pale rust / Bone | **1.54:1** | **Fail** | Only as decorative fill / nonessential surface |

**Critical nuance:** A contrast table cannot prove the whole design accessible. A 9-pixel label that passes 5:1 contrast may still be frustrating or unreadable on a handheld screen. A busy crosshatch behind small text can create local contrast problems even if each token pair passes independently. Test actual composited pixels, dynamic text scaling, high contrast mode, focus and disabled states.

### 8.3 Color edits I would make

- Keep Bone, Coal, Vermilion, Patina and Soot as the **five primary semantic colors**.
- Reserve Brass for **solution and exceptional reward**. Don't use it for routine hints, lest its significance fade.
- Make Stone 1 and Stone 3 less contrasty on the hunt; prefer subtle lightness shifts over distinct ornamental textures every decade.
- Use only one muted ink at typical caption sizes; multiple adjacent grays can look refined in a poster and blurry in a phone.
- Audit Vermilion on Bone/ Paper in the smallest text settings, including disabled and selected states.
- Avoid making Stonewall or other difficult historical material inherit a “danger red” treatment merely because the identity palette uses vermilion. Semantic colors must not imply moral judgement about the subject matter.

---

## 9. Typography: expressive at poster scale, fragile at phone scale

The combination of Young Serif for the year/major headings, Sofia Sans Extra Condensed for ticks/instrument labels and Sofia Sans for body copy is conceptually coherent. The contrast of optical styles helps distinguish measuring from narrating. The giant `1962` and `1969` are successful landmarks; they make the interface identifiable even in a small screenshot.

But the primary sheets themselves betray the problem: many labels, source notes and controls look small enough that readers may need to zoom the presentation image to examine them. In live UI, the same material must survive common phone widths (including approximately 320–375 logical px), dynamic font scaling, different operating-system fonts, and localization.

**Specific requirements:**

- Treat **16 CSS/DP-equivalent px as a practical starting point for important body copy**, adjusted for chosen font metrics; this is a design target, not a universal WCAG requirement.
- Footnotes/secondary notes should ideally not fall below a tested **12–14 px equivalent** in the most compact responsive layout. If source metadata cannot fit, provide an accessible disclosure rather than shrinking it to dust.
- Numbers used as coordinates must use stable widths where appropriate, especially during fast scrubbing. Ensure the typeface supplies suitable tabular numerals or use a dedicated numerical face.
- Prevent text baked into illustrations. Dates, axis units, and chart labels should be rendered separately so they can reflow and enlarge.
- Allow long translated strings to wrap. If Georgian localization is planned, test actual Georgian body and numeral fonts rather than assuming a fallback has the same proportions.
- Make source hierarchy consistent: title, subheading, body, provenance, source status. The footnotes do not need to all be visible at once.

A designer should test at **100%, 130%, 160% and 200% text scaling** before claiming the density problem solved. The exact platform limits and layout behavior depend on implementation.

---

## 10. Interaction and motion: the most important missing proof

The prior brief's signature demand is a tactile temporal camera: path-scrolling, zoom-in/zoom-out, seamless transitions and a journey from a guess into historical evidence. STRATA now provides a visual coordinate system that *could* support this. It does **not yet show the transitions operating**. Storyboards of static screens are not equivalent to demonstrated motion quality.

### 10.1 Required temporal camera model

**Coordinates:** Keep a stable logical year `t`, a continuous camera scale `s` (years per screen unit) and a focal/pivot coordinate `p` (the time under the player's finger or selection marker). Zoom must preserve `p` during a pinch or wheel gesture, preventing an unwanted jump in historical position.

**Visual scale changes:** Show centuries at a broad scale, then decades and years as the player zooms. Label density should adjust semantically; simply enlarging the same tick labels will make clutter worse.

**Corridor:** Excluded portions remain visible as faint hatched context, while the candidate range remains open. A zoom-to-corridor button should reveal enough context to prevent an impression that the possible range was secretly altered.

**Evidence branch:** Purchasing a clue should not teleport the player to an unrelated card. A short, reversible lateral or depth transition can connect the cutting line on the sample to the corresponding evidence record, followed by a return to exactly the prior camera position.

**World Reveal transition:** The solved stratum should remain visually continuous as it opens into an editorial scene. For example, the thin 1969 boundary expands into a year spine, four dated waypoints appear, then tapping one transforms the waypoint into its appropriate evidence form.

### 10.2 The danger of a too-literal scroll path

A winding path can be novel, but forcing every candidate selection onto a curved trajectory may make exact year guessing less predictable. Path-scrolling should describe the *camera route through information*, not introduce geometric uncertainty into the required numeric choice. Use the wheel/ruler for precision, and the unfolding path for context and discovery.

### 10.3 Suggested motion grammar (hypotheses to test)

| Interaction | Design range | Purpose | Reduced-motion alternative |
|---|---|---|---|
| Year scrubbing | Direct manipulation, frame-synchronous | Preserve physical control | Static value changes while input updates |
| Small feedback / chip | ~100–220 ms | Confirm without delay | Immediate state and text change |
| Corridor recomposition | ~250–450 ms | Show candidate reduction | Discrete redraw with before/after text |
| Evidence sheet / branch | ~250–500 ms | Keep context | Crossfade or immediate sheet |
| Solved split | ~500–900 ms, skippable | Emotional payoff | Immediate split and title |
| World-story transition | ~350–700 ms, skippable | Spatial continuity | Simple crossfade with persistent label |

These timings are **proposed design ranges**, not universal standards. The correct duration depends on device, complexity and real user testing. Apple recommends purpose-driven motion, avoiding distracting repeated effects, supporting reduced motion, and keeping frequent interactions simple. [A4][A5]

### 10.4 Technical and human-factors acceptance tests

- The time under the finger stays at the same coordinate during pinch-zoom within a defined pixel tolerance.
- Scrubbing remains smooth on a representative mid-range phone; test both 60 Hz and high-refresh displays, rather than relying on development desktop captures.
- Quickly reversing direction does not cause the year value to drift, desynchronize or skip unexpectedly.
- Leaving and reopening Evidence preserves selected year, camera position and candidate interval.
- Opening the system keyboard does not cover the current year, confirmed action or close mechanism.
- Users who cannot pinch, drag precisely, or perceive motion can achieve all core actions through accessible controls.
- Reduce Motion substitutes understandable transitions without hiding information or changing gameplay.
- No transition blocks a new guess or forces the player to wait for animation when immediate input is possible.

---

## 11. Accessibility: rigorous intentions, but still not validated

The design-system sheet is unusually serious in treating accessibility as a compositional constraint. It includes a grayscale hunt, multiple year-entry methods, text labels in addition to color, a contrast table and a minimum-control-size claim. This deserves credit.

But the mockups do **not** establish whether the running product meets accessibility expectations. In particular, a grayscale screenshot proves only that some differences survive desaturation. It does not prove that patterns are distinguishable for low vision, that disabled states are meaningful, that VoiceOver can navigate the temporal field, or that focus never disappears behind the bottom sheet.

**Audit requirements:**

1. Verify all frequent actions' actual bounding-box sizes on device. W3C's 24 px minimum criterion and 44 px enhanced criterion contain exceptions; adopt a more generous design target for the main game controller. [A1][A2]
2. Provide a descriptive text label for every state: “1958 through 1984 remain possible, 27 years”; “1880 was too early”; “1985 was too late”; “1962 is selected but not submitted.”
3. Announce only meaningful state changes to screen readers; avoid reading every tick while swiping.
4. Use native accessibility actions to increment/decrement the selected year and jump to a specified year.
5. Ensure the evidence sheet traps focus appropriately while open, can be dismissed without gesture, and restores focus to its trigger.
6. Use clear, large hover/focus/tap alternatives to on-chart annotations and thin markers.
7. Check text scaling, high-contrast appearance, color-vision differences, reduced-motion support, left-handed orientation and both screen orientations if supported.
8. Provide meaningful descriptions for charts and diagrams, including data values, measurement units, and why the image matters.
9. Ensure keyboard interaction does not allow accidental duplicate submissions; an explicit `Lock in [year]` confirmation should remain reversible up to commitment.

**Rating distinction:** accessibility intent **8.7/10**, accessibility demonstrated by static mockups **6.8/10**.

---

## 12. Historical editorial standards and trust

STRATA's strongest historical move is to separate **what happened** from **how we know**. The population panel marks an estimate rather than an exact count. The Stonewall panel acknowledges historical terminology. The Apollo diagram admits it is not to scale. The Concorde panel leaves a source-verification note rather than fabricating a citation.

But a game whose mechanic spends points on claims must use stricter editorial controls than a casual fact site:

### Three separate evidence ratings

- **Source confidence:** quality of the specific cited material supporting the claim.
- **Temporal precision:** exact day/year, approximate year, decade, date range, or open-ended period.
- **Deduction validity:** whether the claim actually excludes the years the game says it excludes.

A reputable NASA source supports the existence of Sputnik in 1957; that does not automatically validate excluding 1957 from the current puzzle. All three ratings must be checked independently.

### Required source record

Each clue and World Reveal claim should have: stable claim ID; exact claim wording; cited source URL and title; page or archival identifier; date accessed; source type; confidence grade; precision; valid-year set or interval; calendar convention; geographic scope; editorial notes; alternate/contested readings; licensing status for images; reviewer and last-reviewed date.

### Sources visible in the mockup are placeholders

“Source to be confirmed at editorial review,” generic NASA labels, and UN WPP with “revision to confirm” are appropriately transparent for an early mockup, but **not acceptable for release**. The final game needs resolvable source records at claim level, not generic institution credits. Real archival images must be licensed or otherwise lawfully reusable. An AI-generated visual reconstruction must never be passed off as a real 1969 photograph or document.

### Queer history

The topic is integrated into the main world-history program rather than treated as a token bonus. That's positive. But the evidence economy should not reduce identity and persecution to a novelty category. Editorial work must distinguish actors' self-descriptions from today's categories, include contested accounts and avoid assuming all people in a movement experienced or described it identically. [H4][H5]

### Facts that must be finalized for the displayed 1969 puzzle

| Claim in mockup | External verification status | Release work |
|---|---|---|
| Concorde 001 first flight on 2 March 1969 | Corroborated by Air France and an aerospace museum [H2][H3] | Attach exact citation; confirm diagram accuracy and rights. |
| Stonewall uprising beginning 28 June 1969 | Corroborated by Library of Congress [H4] | Cite particular archival/secondary material; careful identity language. |
| Apollo 11 launch/landing/return in July 1969 | Corroborated by NASA [H6] | Link mission chronology; distinguish mission date from local-time subtleties if shown. |
| Global population approximately 3.6 billion | Plausible estimate; UN WPP source family located [H7] | Record actual dataset revision and exact number; do not imply exact census. |
| Satellites “already orbiting Earth” excludes 1957 | **Not valid as phrased**, given Sputnik 1's 1957 orbit [H1] | Clarify January 1 rule or retain 1957. |

---

## 13. Precision on the date-selection model

A subtle game-design concern emerges from the visual system: a player may choose `1962`, the UI shows a beautifully accurate-looking ruler, and the game displays exactly 27 possible years. That implies quantitative certainty. TIMEHUNT must earn this precision with a data model.

**For the MVP, use discrete candidate years.** The core can still animate continuously, but all rule checks should operate on a reproducible finite set of integer years with explicit display conventions. Keep the target uniformly drawn only if content balance and clue constraints support such a distribution; do not imply statistical uniformity if curated puzzles vary strongly by era.

The game's state should include:

```text
puzzle_id
puzzle_version
published_target_year
initial_inclusive_year_range
remaining_candidate_years
selected_year
committed_guesses: [{year, earlier_or_later, timestamp/order}]
purchased_clue_ids
insight_balance
camera_view: {center_year, years_per_screen_unit}
source_version
session_status: active | solved | failed
```

A clue that narrows a target date uncertain to ±5 years cannot be used as though it proves a particular year. Similarly, the meaning of “in the same year” can vary by calendar convention and historical region. Store both display precision and computational logic.

**Scoring fairness:** Show the remaining guess budget and Insight cost transparently; avoid a hidden point penalty for a normal guess. If higher Insight spending lowers final score, state that clearly. If paid clues do not affect share ranking, make clear why Insight exists beyond cosmetics or challenge difficulty.

---

## 14. Recommended redesign direction: STRATA 1.5

**Keep the concept; simplify the hunt; dramatize the discovery.** Do not abandon this for a fourth unrelated style.

### 14.1 Home

Preserve the whole-core sample, but have one obvious interaction: a vertical drag can temporarily move a marker; a short line of copy names the action. Reduce the number of simultaneous hatch patterns. Keep the warm field. The hidden year must not appear visually indicated before the hunt begins.

### 14.2 Hunt screen

Shift the default eye path to: **(1) current year → (2) remaining interval → (3) temporal control → (4) lock button**. Guess history, information provenance and multi-pattern legends live in inspect mode. Use a lighter map-like field with solid semantic boundaries; retain the beautiful texture at low contrast.

### 14.3 Evidence screen

Replace “Buy” with “Reveal”; preview clue *power* without disclosing answer location; show actual overlap and marginal value once bought. Keep source confidence visible, but leave full footnotes behind a second tap. A free, non-narrowing item should be clearly framed as **Discovery**, not a strategically useful clue.

### 14.4 Lock screen

Almost keep as-is. Preserve the same geometry during the win animation, ensure 1969 does not grow before the player can process success, show the path compactly, and allow share/open/replay. Retain the dark contrast as a rare reward.

### 14.5 World Reveal

Give the player a visible historical *journey*, not a carousel of nearly identical pages. Preserve consistent typography and provenance, but make each scene operate through a distinct action (inspect, compare, trace, scale). Add geographic diversity before claiming worldwide coverage. Use real archival materials wherever rights and quality permit; mark illustration distinctly.

### 14.6 Design system

Keep five semantic colors, simplify decorative stone variants, enlarge small captions, rationalize the state-language grammar to a small memorable set, and test the icon at 24, 32, 48 and 64 px with actual platform masking. Current icon looks credible, but its diagonal fault can read like a generic scratch at tiny sizes; consider slightly exaggerating the offset in small-size variants.

---

## 15. Priority backlog: what must change first

| Priority | Issue | Why it matters | Acceptance evidence |
|---|---|---|---|
| **P0** | 1957/1958 satellite clue semantics | Historical credibility and game fairness | Unit test + documented claim + corrected copy/range. |
| **P0** | Clue preview potentially leaks exact temporal cut | Can invalidate Insight economics | Blind puzzle test: no answer revealed pre-purchase. |
| **P0** | Text too small on hunt and reveal screens | Basic readability and accessibility | Real-device screenshots at normal/large text scales. |
| **P0** | Live time-range/ruler gestures unproven | Central experience is motion and control | Runnable interactive prototype, not another poster. |
| **P1** | Excessive patterns in hunt | Increases cognitive interpretation burden | Novices can identify current year, valid range, last guess without a legend. |
| **P1** | Duplicate controls create crowded layout | Slows one-hand gameplay | A clear default + discoverable precision alternative. |
| **P1** | “Buy” language implies purchase | Trust and user understanding | Use explicit Insight wording; usability comprehension test. |
| **P1** | World Reveal feels like a static lesson | Weak reward loop | Four distinct interaction verbs working in prototype. |
| **P1** | Narrow geographic sample | Undercuts central global-history promise | Editorial balance plan; stronger non-Western 1969 story. |
| **P1** | Generic or pending citations | Claim provenance unresolved | Stable, resolvable source IDs for every published claim. |
| **P2** | App icon at tiny sizes | Legibility/brand recall | Masked 24–64 px icon study. |
| **P2** | More sophisticated microcopy | Tone is still technical in places | Friendly but precise text for novices and experts. |
| **P2** | Atmospheric audio and haptics | Potential tactile memorability | Optional haptics + user preference + accessibility test. |

**P0 = block approval of release-bound implementation**, P1 = necessary before full production polish, P2 = enhancement after the core experience is validated.

---

## 16. Usability experiment to run before another full mockup round

Test **a runnable build** with approximately 8–12 participants new to TIMEHUNT, plus 4–6 players of daily deduction games. These sample sizes are exploratory design recommendations, not a statistically representative validation. Use real phones with different sizes and operating systems where possible.

### Test tasks

1. Without onboarding, identify the possible target range on Home.
2. Make a first guess, explain whether it was early or late.
3. After two guesses, explain which years remain possible.
4. Set `1962` using the most obvious method and then adjust to `1963`.
5. Open Evidence and explain which item costs Insight and why.
6. Predict whether a second clue in the same overlap group gives new information.
7. Solve a small test puzzle and explain how the outcome changed the year field.
8. Explore one of the four World Reveal stories and then exit to another hunt.
9. Repeat while using larger text, reduced motion or a one-handed grip.

### Observations to record

- Time to first *correctly understood* guess, and the number of prompts required.
- Whether participants mistake the gold wheel marker for a clue to the answer.
- Ability to distinguish excluded-by-guess, excluded-by-evidence, current candidate, and previously selected year.
- Whether users notice that the `1958–1984` corridor contains exactly 27 integers.
- Incorrect taps, accidental commitments, unintended zoom jumps, and gesture recovery.
- Comprehension of `Insight`: do players think “Buy 3” means money?
- Recall of one unexpected historical story after play, not simply the final year.
- Willingness to play again *without* a daily reward or completion streak.

A strong qualitative signal is not “I understood after you explained it.” It is **“I can make the next move, and I know why it matters.”**

### Proposed exit criteria (hypotheses)

- In a small formative test, **at least 80%** can make the first intentional valid guess without facilitation inside **30 seconds**.
- **At least 80%** can correctly identify the live corridor after receiving two pieces of feedback.
- No observed paid clue falsely excludes an historically compatible year.
- No non-color-only screen state is unintelligible when the color channel is removed.
- The core hunt is operable at enlarged text and without multi-finger gestures.
- At least half the participants choose to explore one World Reveal story; measure this rather than design by assumption.

These thresholds are starting design gates, not industry-certified benchmarks. Adjust them based on real observation and participants' needs.

---

## 17. Approval decision

**Approve now:** STRATA's name/metaphor direction, the warm color family, the idea of a continuously navigable historical field, a materially meaningful lock screen, multiple evidence representations, and the separation of guess cuts from evidence cuts.

**Approve with revisions:** Typography hierarchy, right-side wheel, detailed decade textures, clue selection sheet, app mark, and current 1969 editorial sequence.

**Do not approve yet:** The specific production hunt layout, paid-clue semantics until the 1957 date rule is fixed, motion quality, accessible responsive layout, source publication status, or the assumption that four static reveal pages deliver a unique spatial experience.

### Final critical judgment

STRATA is **not AI-slop** in the usual sense of an interchangeable dashboard assembled from generic cards, gradients and stock illustration. It has a coherent authored metaphor, controlled palette, meaningful numerical typography and a considered relationship between evidence and state. That is real progress.

The remaining threat is a different kind of overdesign: **a beautifully formalized system whose visual cleverness outruns the player's ability to enjoy using it**. Geological textures, rational labels, calibrated grids and tiny proof notes can produce the aura of intellectual rigor without necessarily creating a fluid, addictive game. The solution is not more detail; it is more editorial selectivity.

**STRATA should make each deduction feel like cutting away ignorance, then make the solved year open into a wider, stranger, more human world.** Keep that as the test for every line, mark, texture, sound and motion choice.

**Final ratings:** **8.3/10 concept; 6.7/10 demonstrated implementation readiness.** Directionally stronger than both earlier routes. **Proceed to an interactive motion-and-usability prototype, not another static design presentation.**

---

## References and verification notes

**How these references are used:** External links corroborate specific historical or accessibility claims and provide design guidance. Subjective scores and aesthetic criticism are the reviewer's judgments, not claims established by the links. This review inspected the three uploaded mockups; no running software was evaluated.

### Accessibility and interaction

- **[A1]** W3C WAI, *Understanding Success Criterion 2.5.8: Target Size (Minimum).* Details the 24 CSS-pixel minimum and exceptions. https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum
- **[A2]** W3C, *Web Content Accessibility Guidelines (WCAG) 2.2.* See 2.5.5 enhanced target size (44×44 CSS px), 2.5.8 minimum, 1.4.3 text contrast and 1.4.11 non-text contrast. https://www.w3.org/TR/WCAG22/
- **[A3]** W3C WAI, *Understanding Success Criterion 1.4.3: Contrast (Minimum).* https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- **[A4]** Apple, *Human Interface Guidelines — Motion.* https://developer.apple.com/design/human-interface-guidelines/motion
- **[A5]** Apple, *Human Interface Guidelines — Accessibility.* https://developer.apple.com/design/human-interface-guidelines/accessibility
- **[A6]** Apple, *Human Interface Guidelines — Gestures.* https://developer.apple.com/design/human-interface-guidelines/gestures
- **[U1]** Nielsen Norman Group, *Memory Recognition and Recall in User Interfaces.* https://www.nngroup.com/articles/recognition-and-recall/
- **[U2]** Nielsen Norman Group, *10 Usability Heuristics for User Interface Design.* https://www.nngroup.com/articles/ten-usability-heuristics/

### Historical source checks

- **[H1]** NASA, *Dawn of the Space Age.* Sputnik 1 launched and reached orbit on **4 October 1957**. https://www.nasa.gov/history/dawn-of-the-space-age/
- **[H2]** Air France, *Genesis of a Legend: The Origins of Concorde.* First flight of prototype 001 from Toulouse, **2 March 1969**. https://corporate.airfrance.com/en/genesis-legend-origins-concorde
- **[H3]** Musée de l'Air et de l'Espace, *Concorde prototype 001 F-WTSS.* https://www.museeairespace.fr/aller-plus-haut/collections/bac-sud-aviation-concorde-prototype-001-f-wtss/
- **[H4]** Library of Congress, *Today in History — June 28.* The Stonewall Uprising began **28 June 1969** and continued over subsequent days. https://www.loc.gov/item/today-in-history/june-28/
- **[H5]** Historic England, *Our Approach to LGBTQ Heritage.* Historical and current identity terms need careful contextualization. https://historicengland.org.uk/research/inclusive-heritage/lgbtq-heritage-project/our-approach/
- **[H6]** NASA, *Apollo 11 Mission Overview.* Mission timeline for July 1969. https://www.nasa.gov/missions/apollo/apollo-11/apollo-11-mission-overview/
- **[H7]** United Nations, Department of Economic and Social Affairs, *World Population Prospects.* The relevant published data revision and exact 1969 value still need selection in the content record. https://population.un.org/wpp/

### Methodology and confidence

This review combined direct visual examination of the provided STRATA boards, comparisons with the preceding TIMEHUNT design directions, checks of the declared palette with the WCAG contrast formula, and targeted verification of several source-sensitive historical statements. It has **not** audited source files, run the game, measured actual device target sizes, evaluated prototypes with players, tested fonts for localization, or measured animation performance. “Potential,” “risk” and “would” statements are recommendations or hypotheses; do not treat them as observed user behavior.
