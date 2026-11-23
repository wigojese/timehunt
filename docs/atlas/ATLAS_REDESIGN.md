# Temporal Atlas redesign of the game UI

Status: **visual revision requested by the user, built as a prototype.** It reopens the Stage 6 art direction (STRATA "Oxide & Bone") and the Stage 7 look, as the art guide requires ("treat these boards as a proposed art-direction change… record the changes"). It does **not** approve Stage 10. Screens: `contact-sheet.png`, individual PNGs in this folder, `pose-sheet.png`.

## What changed
| Area | Change |
|---|---|
| Palette | Guide tokens: paper, forest/atlas green, sage, teal, sky, brass gold, rust, ink. **Rust darkened to `#A94A28`** (guide proposes `#BD5833`, which gives about 4.3:1 with cream text) |
| Type | Self-hosted, latin subsets, OFL: Fraunces (titles, buttons, year numerals), Archivo italic condensed (wordmark), Source Sans 3 (body). About 212 KB. No Google Fonts request, so it works offline |
| Wordmark and brand | Hourglass + condensed oblique TIMEHUNT + tagline, as live text |
| Guide | Squirrel with rust scarf, tan satchel, lantern and map, four poses plus mirrored (`src/ui/art.js`). Optional: Settings has "Show the squirrel guide" |
| Scenes | Home and welcome hero (night-sky arch, armillary, stepped century path, hills, foliage, flowers); landscape banner on case screens |
| Surfaces | Map-green frame with contour lines, cream paper panels, ink outlines, offset shadows, static grain |
| Controls | Rust primary button with ink border and press travel, cream secondary, ribbons, paper-tab nav with icons |
| Game parts | Insight as brass coins (numeric text kept), cases as pins on a dotted trail, years as a stepped ladder with a gold selected tag, field-note clues, year plaque on result |

## Verified (2026-11-24)
`npm run verify` 103/103 tests, 0 lint errors, 0 type errors. Game audit 78/78, axe 0 violations over 33 screens, no overflow at 160% and 200% text, no text under 14 px, no target under 44 px. Motion 60/60. Reveal 72/72 (one known axe item, unchanged). Two of the first-draft failures were found and fixed by this audit: HUD overflow at large text, and tagline and tab labels under 14 px.

## Honest limits
- **This is not the reference's painterly quality.** The illustrations are SVG drawn in code: clean, flat, consistent, but simpler than the generated boards. Closing that gap needs commissioned or carefully produced art (the guide's section 29 asset list), with `art.js` as the placement brief.
- **Not restyled yet:** the Motion and World Reveal prototypes (`/motion/`, `/reveal/`) still use the STRATA look. In-game reveal, practice, archive, settings and finish screens get the new colours, type and panels but no custom scenes.
- **The guide's Earlier/Later chips and 1600 to 2000 slider are not used.** The game's approved mechanics are a free candidate ladder, Insight and one Lock; the guide itself says the slider is shorthand.
- **Not tested on a real phone.** Emulated Chromium only. Georgian needs a font; Source Sans 3 and Fraunces have no Georgian glyphs, so a fallback would apply.
- Historical numbers in the reference (1848, 424 M) were not copied.
- Asset weight: fonts 212 KB, art in code (small). Not profiled on a device.
