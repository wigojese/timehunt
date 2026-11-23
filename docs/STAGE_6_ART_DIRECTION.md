# Stage 6: STRATA 2.0 art direction for the ten-case day

Status: complete, awaiting `APPROVE STAGE 6`. Nothing from Stage 7 has been started.

**What this is.** Static boards built as HTML from real Stage 3 pack text and rendered in headless Chromium. They are drawings, not a running app. No motion, gesture, device or person has tested any of it. All subjective ratings are mine.

Files (all in `docs/art/strata2/`): `strata2-o1.png`, `strata2-o2.png`, `strata2-o3.png` (three options, eight screens each), `strata2-o*-gray.png` (the same in grayscale), `strata2-brand-system.png`, `contrast-report.json`. Sources: `data.mjs`, `tokens.css`, `option1.mjs` to `option3.mjs`, `brand.mjs`, `build.mjs`. Rebuild: `cd docs/art/strata2 && node build.mjs`.

## 1. What I analysed
Three STRATA 1.5 boards (hunt, world reveal, motion and system), STRATA 1.0, and routes A, B and C. What STRATA does best: a vertical core of layers, evidence drawn as cuts, ruled-out years as hatch or stipple, the oxide flag as the one red thing, Young Serif against Sofia Sans, and the solve as bone turning to soot with a brass rule. What the new rules change:
- **A ten-case day** needs a way to show "case 4 of 10" and the shared 8 Insight on every screen. STRATA 1.5 had one case and "guesses left".
- **Candidate sets are small (3 to 6 years, D-019).** The continuous scrolling ruler of 1.5 with 12 px year rows is no longer needed and was a known weakness (Stage 7 will remove it). Years can be large targets.
- **Reading is the game** (Stage 5 finding F-020). The evidence must be comfortable to read, not tucked behind a sheet.
- **Status must survive grayscale**, so shape carries it, not colour.

## 2. Three composition options
| | I. Instrument | II. Specimen | III. Editorial |
|---|---|---|---|
| Idea | The core is the hero; years are layers you press | The case is a tray; two pinned specimens bracket an empty slot | Type leads; evidence is numbered notes; years are a ruled line of numerals |
| Bank | Row of 8 pegs plus "Insight 6 of 8" | Text only | Text only |
| Day | Ten-segment strip under the header | Ten numbered tabs; a drawer of slots | Contents page with dot leaders |
| Ruled-out years | Hatched bands, labelled | Not shown (only live chips) | Not shown |
| Atlas | A list with a recency bar | A shelf of ten cards | A typeset list with the gaps between answers |

All three keep Oxide and Bone, Young Serif and Sofia Sans, one oxide primary action per screen, and the same eight states: Home and Daily Trail, case start, active hunt, evidence, missing a case, Lock success, partial progress after six cases, final ten-case atlas.

## 3. Verdict: Option I, with two borrowings
**Option I is the strongest, and I recommend it as the base.** Reasons, tied to measured things:
1. **Ten-case structure at a glance.** Peg row, ten-segment strip and "Case 4 of 10" are on every screen. In Option II and III the day is a text count.
2. **It is the only one that keeps STRATA's layered, cut-and-hatched look in grayscale** (see `strata2-o1-gray.png`). Hatch, stacked bands and the serif/condensed numeral pairing survive.
3. **Every possible year is a 52 px press target** and ruled-out years collapse into labelled hatch bands, which answers the "tiny year rows" problem.
4. **It shows what was ruled out and why** ("1923 to 1935 ruled out by free evidence") without a legend.

Borrow from Option III: the **numbered serif notes** for the Evidence sheet (best reading comfort), and the **gaps between answers** on the atlas. Borrow from Option II: the **"your year goes here" slot** idea only as a possible first-run teaching device.

Why not II: the tray prints both anchor years as large numerals, which makes the deduction nearly visible at a glance. That is a lovely metaphor and, given F-020 (reading already beats spending), it risks making the game easier still. Why not III: strongest reading, least STRATA; its hunt screen has no layers, hatch or stipple, so grayscale recognition falls to type alone.

## 4. System decisions
- **Tokens** (measured in `contrast-report.json` and on the brand board): Bone #F2ECE0, Paper #FBF7EF, Ink #241F1B, Muted #5C544A, Oxide #B4412D, Moss #4A6350, Soot #1B1A18, Brass #D2AC4F, Faint #D9D0BE. Dark-screen text is #EDE6D6 and #B4AB9A on soot.
- **Type roles:** Young Serif for titles (30 to 42) and the question (19 to 23); Sofia Sans Extra Condensed 700, tabular, for years (24 to 40); Sofia Sans 17 for body and 15 for notes. Nothing under 14 px. Georgian has no glyphs in any of the three faces (Q-16).
- **Texture grammar:** hatch = ruled out by a free bound; stipple = ruled out by a bought clue; plain layer = possible; brass rule on soot = solved. Nothing else carries texture.
- **Status marks by shape, always beside a word:** filled square solved, half-filled solved with help, slashed missed, dotted to come, oxide outline next.
- **One filled button per screen.** In the first grayscale render the dark "Reveal" buttons outweighed the oxide primary. I made clue buttons outlined, so the only filled button is the primary action.
- **Materials in motion** (design targets, unbuilt): layer lift 120 ms, stipple fill 350 ms, hatch static, solve split 500 to 900 ms skippable, brass rule 300 ms. Each has a reduced-motion twin on the brand board.
- **Source reading:** one disclosure at the foot of a result or a revealed clue, listing publisher, title and a text label, "Opened by the editor" or "Not opened". This carries the Stage 3 verification honesty into the UI.
- **App icon:** four-layer core, one layer slipped, crossed by the oxide marker. At 32 px and below a heavier three-layer cut. Tested at 16, 24, 32, 48, 64, 120, 180 px on light, dark, grayscale and monochrome.
- **Rejected:** dominant blue (Route B), fake archives (no scans, stamps or torn paper; drawings made from case data only, until real cleared images exist, Q-12), ornamental clocks.

## 5. Measured checks
| Check | Result |
|---|---|
| Text contrast on the **rendered** layouts (WCAG 2.x, text against its nearest solid background, large text 3:1, other 4.5:1) | **0 failures** over 126 (I), 166 (II) and 115 (III) text runs; lowest ratio 5.62 (white on oxide) |
| Text smaller than 14 px | 0 in all three options |
| Token pairs | All 14 pass, including non-text border 3.21 against bone (needs 3) and oxide against bone 4.78 |
| Grayscale | Primary action stays distinct by luminance (oxide 4.78 to 5.62 against its background) and by position; hatch and layers survive; shape-coded status survives |

**What the contrast check does not cover.** It measures text against a solid colour only. It does not measure text over hatch lines or stipple dots (the base tone is measured, the lines are not), focus rings, hover or pressed states, large-text scaling, or any real screen. A first version of this check passed everything while the render was unreadable, because it ran on a different page from the boards. It now runs on the boards themselves.

## 6. Candid critique (subjective, mine)
Scores out of 10. No viewer has seen these.

| Lens | I. Instrument | II. Specimen | III. Editorial |
|---|---:|---:|---:|
| Ten-case structure understood at a glance | 8 | 6 | 5 |
| Primary action unmistakable (also in grayscale) | 8 | 7 | 7 |
| STRATA recognisable in grayscale | 8 | 5 | 3 |
| Reading comfort of evidence | 6 | 6 | 9 |
| Fit with the rules (3 to 6 candidates) | 8 | 8 | 7 |
| Build cost (lower is better; 10 = cheap) | 7 | 6 | 9 |
| Memorability | 6 | 8 | 4 |
| Overall | **7.5** | 6.5 | 5.5 |

Weaknesses I would not hide:
1. **Option I gave up STRATA's best idea.** The continuous vertical ruler is gone, replaced by five stacked rows. It reads more like a well-made table than a core. That works only because candidate sets stay at 3 to 6. If packs ever leave 10 or more years, the layout breaks and needs the zoomable ruler back.
2. **The atlas is the weakest screen in all three.** The brief asks for an atlas; none of these is a map of anything. Option I has recency bars, II a shelf, III a gap list. A real atlas, where ten marks sit on one spatial core, is still to be designed (Stage 8 territory).
3. **Option I's text is still dense.** The Evidence sheet is a wall of 16.5 px sentences. The Stage 7 build should adopt Option III's numbered serif notes.
4. **Small-size marks.** Half-filled versus filled strip segments (14 px high) are separable in the renders but marginal on a small phone. The icon's slipped layer is lost at 16 px even in the heavy cut; the marker does the work there.
5. **Option II's cells.** The slash on a missed tile runs through the year, and the assisted tile uses a left stripe where the legend uses a half-fill. Small inconsistencies I left in the board.
6. **Everything is text on bone.** With one red button per screen the layouts are calm and, honestly, plain. The "memorable element" is the layered stack, and it is one component.
7. **The boards use the Stage 4 scripted day** for results and Insight counts. They are illustrative and every board says so.
8. **No motion, no device, no people.** Contrast is computed, not perceived. Legibility on a bright street or a cheap panel is unchecked.
9. **Fonts load from Google's servers.** A shipped app needs self-hosted files and licence text (Q-17).

Pass criterion, stated carefully: a viewer can understand the ten-case structure, find the primary action and recognise STRATA in grayscale. By my reading Option I meets all three at mobile scale; that reading is unproven until someone else looks.

## 7. Content fix made during this stage
While building the boards I found that case 6's `target.event` still said "in Merca, Somalia", a detail I had cut from the facts as unverified in Stage 3. It is now "in Somalia". The pack, the app copy and the fixtures were regenerated (71 tests pass).
