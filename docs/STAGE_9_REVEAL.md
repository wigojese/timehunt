# Stage 9: editorial World Reveal

Status: complete as a clickable prototype, awaiting `APPROVE STAGE 9`. Nothing from Stage 10 has been started. Run it: `cd app && node scripts/serve.mjs`, then open `/reveal/` (see `docs/TRY_IT.md`).

**What this is.** A hub of six stories and a finale, each a different sequence of beats with its own interactive evidence form. It is isolated from the game, reads the Stage 3 pack, and uses no third-party media: every graphic is a drawing generated in code from the sourced data and says so on screen. **Nothing has been reviewed by a person or played by anyone.** All content is draft (0 of 10 cases are publishable).

## 1. The evidence forms (12, in nine functionally distinct interactions)
| # | Form | What the player does | Used in |
|---|---|---|---|
| 1 | Object inspection | Tap a register of the Rosetta Stone. Bands are as tall as their line counts (14, 32, 54) | Rosetta |
| 2 | Time scrub on an object | Move the year 1799 to 1825; the stone shows what had been translated or transliterated | Rosetta |
| 3 | Source comparison | Filter four accounts of the discovery day to the pages the editor actually opened; the summary recomputes | Rosetta |
| 4 | Scrubbable chart | Move the year across the three regions WHO names; each row reads Not yet, This year, Earlier | Smallpox |
| 5 | Tap-to-read bar | Tap the two parts of the programme's cost (two thirds, one third) | Smallpox |
| 6 | Choose-a-question timeline | Pick one of four meanings of "the last case" and see its date | Smallpox |
| 7 | Route scrub | Choose a leg, move along it, play or pause; days counted from sourced dates; schematic, no coastline | Manila galleon |
| 8 | Span with markers | Tap 1565, 1571 or 1815 on 250 years | Manila galleon |
| 9 | Calendar conversion | Move through the 12th lunar month of 1443; the Gregorian year flips from 1443 to 1444 on lunar day 3 | Hangul |
| 10 | Lanes with filter and tap | Filter by theme, tap an event: exact date, how precisely it is known (day, month, year or range), uncertainty, sources, V-level | Hangul, 1324, 1969, 1977 |
| 11 | Relation card | Reads a stated relationship category and what would make it a link | 1324, 1969 |
| 12 | Finale: marks, pair, coverage | Tap a mark; bring two marks together; read computed coverage | Finale |

## 2. The stories (no fixed template)
| Story | Beats | Shape | Region |
|---|---:|---|---|
| A slab found by soldiers (1799) | 5 | text, inspect, scrub, compare, takeaway | Egypt, France, Britain |
| The last case that was not a laboratory's (1977) | 5 | text, chart, bar, choose, takeaway | Africa, Asia, South America |
| The way back across the Pacific (1565) | 4 | text, route, span, takeaway | Mexico, the Philippines |
| Sounds for the people (1446) | 4 | text, calendar, lanes, takeaway | Korea, with Varna for contrast |
| Who was on the road? (1325) | 3 | text, lanes, relation | Morocco, Mali, Italy, England |
| A very fast prototype (1969) | 3 | text, lanes, bias note | France, United States, Algeria |
The frame is shared (progress bar, Previous and Next, Skip). The shape inside it is not.

## 3. Transitions
- **Found year to story.** Opening a story shows the answer year on a soot field for 0.7 s, then the year lifts away into the story. Tap or Escape skips it. Reduced motion shows no overlay at all and goes straight to the first beat.
- **Ten marks to a cross-case discovery.** The finale lists the ten answers on one core with the gaps between them. The pair that shares a year (1977, computed, not typed) is outlined; "Bring them together" opens 1977 as lanes: FESTAC 77 in Lagos (15 January to 12 February), Star Wars (25 May), Voyager 2 (20 August), Voyager 1 (5 September), the last natural smallpox case (October). With reduced motion it opens at once with the same content.

## 4. The finale does more than display ten scores
It computes and shows: the ten answers and the gaps between neighbours; the one year two answers share; what that year looked like in Africa, in film, in space and in health; the counts by region and era; that 5 of 10 answers fall between 1893 and 1977; that Europe and North America supply 57% of the dated facts a player reads; that no case is tagged South Asia; that everyday life is missing. It ends by saying the ten are a selection, not a sample.

## 5. The researched connection, and how it is labelled
**1977, five events in four themes.** The last known natural smallpox case was diagnosed in Somalia in October; WHO says smallpox was eliminated from Africa in 1977; Voyager 2 and 1 launched on 20 August and 5 September; Star Wars was released on 25 May; FESTAC 77, a festival of African and diaspora culture with about 16,000 participants from 56 African nations and the diaspora, ran in Lagos from 15 January to 12 February. The connection only appears because two separate cases both answer 1977. **Relationship label on screen: "Simultaneous. No link is claimed. What would make it a link: a source that says so."** The pair is together because two puzzles chose 1977, and the screen says so.

## 6. Correcting Western bias, and where it did not work
The 1969 case was the suggested test. Its easy sources are aircraft and the Moon landing. I looked for a non-Western 1969 event and found, on Wikipedia, the Pan-African Cultural Festival in Algiers, from 21 July for eight days. It is in the 1969 story, in its own lane, flagged as one source. Research this stage also found FESTAC 77 for the 1977 lanes. The stories now centre Korea, Morocco and Mali, South America, Asia and Africa as often as Europe.
**It is still biased.** Every source is English-language, mostly Wikipedia; I could open only Wikipedia, WHO, CDC and NASA pages; 1969's non-Western content rests on one article's passing mention; the Rosetta and Manila stories are told from European and Spanish archives; the smallpox chart shows only the regions WHO names. The coverage panel says so rather than hiding it.

## 7. Citations
Every beat and every lane event carries source ids that exist in the pack bibliography; tests refuse a story with an unknown source. Each beat shows a Sources disclosure with publisher, title, link, "Opened by the editor" or "Not opened", and a computed level (V1 one opened page, V2 two independent opened pages). Three accounts of the Rosetta discovery day come from search summaries and a blocked Britannica page; they appear under the label "source not opened" and are never counted. Full scripts: `docs/reveal/CONTENT_SCRIPTS.md`. Rights: `docs/reveal/SOURCES_RIGHTS.md` (no third-party media; fonts OFL; Wikipedia text paraphrased, CC BY-SA 4.0 noted).

## 8. Research findings that changed the content
- **Case 3 was wrong about "first".** Wikipedia says Urdaneta and Alonso de Arellano both made successful return trips in 1565. The case asked about "a Spanish ship" being first. The year is unaffected; the question now says "ships", and the HOLD list records that who arrived first is unsettled.
- **I had an unsourced sentence.** The Stage 3 reveal said getting to the Philippines was the easier direction. I could not verify it, so the story now says only what the page supports: Urdaneta was given the task of finding a return route, and the route was inaugurated in 1565.
- **Rosetta details are real.** Line counts (14 remaining, 32, 54 with the first 27 complete), size (1,123 by 757 by 284 mm), the 1801 surrender and 1802 display are from the opened Wikipedia page, so the diagram is to scale in lines.
- **WHO gives more than a year.** Its page adds that some European regions had eliminated smallpox by 1900, over 2 million died each year in affected continents, and the programme cost about US$300 million, two thirds from endemic countries. Those are used.

## 9. Evidence
| Check | Result |
|---|---|
| Unit tests (maths, citations, forms present) | 100 of 100 pass (14 new) |
| Browser audit (`scripts/e2e-reveal.mjs`) | **65 of 65** pass |
| axe-core, 17 screens (one per form) | 1 finding: a selected list button sits under the sticky Previous and Next bar at one scroll position |
| Horizontal scroll on 28 beats at 320 px, 390 px, and 390 px with 200% text | none |
| Skip and resume | Skip to the end, Skip story, Resume at the saved beat after a reload, Reset, all asserted |
| Reduced motion | no entry overlay, no route playback, merge opens at once, same content |
| Distinct actions exercised | inspect, scrub year, compare filter, route scrub, leg choice, lunar-day scrub, and more |
Sheets: `docs/reveal/sheet-forms-1.png`, `sheet-forms-2.png`, `sheet-finale.png`; per-screen images in `docs/reveal/screens/`.

## 10. Qualitative critique (subjective, mine; nobody else has seen this)
| Lens | Score of 10 | Why |
|---|---:|---|
| Variety of evidence interactions | 8 | Nine different things to do, each tied to what the evidence is |
| The calendar flip | 8 | The best "oh" in the set: the year changes in the middle of a month |
| Honesty of presentation | 8 | Precision, uncertainty, one-source and not-opened labels are on screen |
| The finale does more than scores | 7 | It computes, compares and states limits; the discovery is modest |
| Surprise of the 1977 connection | 5 | Real and sourced, but a simultaneity, and we say so; it is a small spark, not a revelation |
| Emotional pull of the stories | 4 | They are clear and a little dry; no images, no voice, no object you can almost touch |
| Non-Western balance | 5 | Better than before; still English Wikipedia all the way down |
| Reading load | 5 | Each beat is short; six stories and a finale is a lot of text on a phone |
| Visual polish | 5 | Plain and legible; the lane chart is small and the route is a sketch |
Plainly: the forms work and tell the truth. They do not yet make anyone feel the past. The route and lane charts are the weakest visuals. Every story shares one stepper frame, so the stories vary in shape but not in presentation. Three of the six rest on one opened page per fact. No person has judged any of it, and nothing here has been checked for sensitivity (the 1977 smallpox and 1325 Mali material would want a named reviewer).

## 11. Pass criteria, stated carefully
- *At least four distinct user actions across evidence types:* yes, nine, asserted in the browser.
- *Correct citations:* every claim cites an existing source, with its opened status and level; V2 is rare and the page says so. "Correct" in the sense of a reviewer checking each cited page has not been done beyond the editor's own reading.
- *The player can skip:* yes, three ways.
- *The finale does more than display ten scores:* yes, with the caveat above.
