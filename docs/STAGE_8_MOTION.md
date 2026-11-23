# Stage 8: temporal camera, path scroll and interactive transition proof

Status: complete as a **prototype proven in headless Chromium with emulated touch**, awaiting `APPROVE STAGE 8`. Nothing from Stage 9 has been started.

**The honest headline.** The brief asks for gestures on at least one real phone and a performance trace on a specified device. **I have no phone and no device. Neither was done.** What I did instead: real touch events through the browser's DevTools protocol, emulated CPU slowdown, and an in-page recorder (`?perf=1`) that you can run on any phone and send me the JSON. Every number below is from a cloud VM. Treat them as evidence the code is light, not as evidence a phone is smooth.

## 1. What exists
Run: `cd app && node scripts/serve.mjs`, open `http://127.0.0.1:5173/motion/`. On a phone on the same network use the machine's address; add `?perf=1` for the recorder.

| Piece | File | What it does |
|---|---|---|
| Temporal camera maths | `app/motion/src/camera.js` | Pure. Year to screen and back, zoom around a pinned year, pan, fit, lerp, semantic tick plan, BCE/CE labels |
| Transition controller | `app/motion/src/transition.js` | Pure, reversible and interruptible. Progress is continuous, so reversing mid-way starts from the picture, not from 0 or 1 |
| Path-scroll maths | `app/motion/src/trail.js` | Reads the page's natural scroll and maps it to a position along the ten marks. Never captures scroll |
| Gestures | `gestures.js` | Two-pointer pinch with focal pinning; marker-handle drag; ctrl+wheel zoom. One-finger vertical drag and plain wheel are left to the page |
| Camera view | `view-camera.js` | DOM and transforms. Candidate corridor, hatch for ruled-out years, marker with a drag handle, large year numerals once zoomed, date pins with collision handling |
| Prototype | `main.js` | Trail with path scroll, case with camera, evidence branch, lock opening, World Reveal pathway, display options |
| Reveal data | `reveal-data.js` | Two pathways from Stage 3 facts: the Rosetta Stone (made, found, read) and the 1324 to 1327 coexistence, which says in words that it is not causal |
| Recorder | `perf.js` | Frame times, input-to-frame latency, render cost; downloadable JSON |

It is isolated: it reads the pack and does not use the game engine or the Stage 7 UI.

## 2. How each required behaviour works
- **Semantic zoom.** Tick spacing is chosen from the scale so labels are at least 30 px apart. Levels run from centuries to single years; once a year is 34 px tall the possible years appear as large numerals. Tested: no collisions, level changes, at most 140 ticks.
- **Focal pinning.** The year under the pinch centre does not move. Property test: 5,000 random zooms, and 300 sessions of 40 pans and zooms inside the window, **maximum focal-year shift 2e-13 years**. In the browser, a touch pinch moved the focal year by under 0.08 years.
- **Path scroll.** The Trail has a tall page section with a sticky camera. Page scroll position selects the mark in focus. Previous and Next buttons sit **inside** the sticky camera (an early version put them after the path, unreachable without scrolling the whole path).
- **Candidate corridor and markers.** The possible years are a paper band; everything else is hatched; the marker is a red line with a flag and a drag handle. The marker changes only by explicit action (handle, tap on a year, arrow keys, Later and Earlier buttons, typed year). Camera motion never changes it, tested by touch.
- **Evidence branch.** The sheet rises over the ruler, which dims and stays exactly where it is. Closing returns the camera unchanged (centre, scale and marker equal to 1e-9). Opening pushes a history entry, so the browser Back button closes it.
- **Interrupted animation.** Reversing at 40% continued from about 40%. Sampled progress peaked between 0.1 and 1 and its largest step between samples was under 0.2; it ended closed with the camera intact. A 500-step random interruption test keeps progress in [0, 1] and continuous.
- **Lock stratum opening.** The layers part along the lock and a soot band grows with the year; 900 ms, skippable by Skip or a tap. Reduced motion shows the final state at once.
- **World Reveal pathway.** Five scroll-driven steps move a sticky timeline camera from the 196 BCE decree out to 2,000 years and back in to 1799, 1803 and 1822. Next, Previous and Skip to the end work; Resume offers the saved step after a reload; Back returns to the locked case. Every date is also in the page text.
- **Reduced motion.** `prefers-reduced-motion` or the option: zoom settles in 52 ms (versus 392 ms), the branch is at 100% by 30 ms (versus 10%), the lock is at 100% by 40 ms (versus 5%). The verdict and the answer year are the same in both.
- **Large text.** At 130% and 200%: no horizontal scroll, the ruler stays at least 200 px tall, pinch works, typed entry works, Lock is large and reachable.
- **Precision entry.** "Type a year instead" accepts a year, refuses one that is not in play, and moves the marker and camera there.
- **Natural scroll and no trap.** A one-finger swipe on the ruler or the path scrolls the page and leaves the camera alone (`touch-action: pan-y`). A plain mouse wheel is never intercepted; only ctrl+wheel zooms. The page scrolls past the end of the path to its own bottom.
- **Scroll restoration and Back.** Scroll positions are saved at every route change and restored on Back and Forward (it needed three tries: see the bug list). Forward returned to the same position within 6 px.
- **Motion is never the only channel.** Every transition ends in text: the live status line, the verdict, the step line, the dates list.

## 3. Evidence
| Check | Result |
|---|---|
| Transform and transition maths (`npm test`) | 15 new tests, **86 of 86** pass |
| Browser e2e with emulated touch (`scripts/e2e-motion.mjs`) | **60 of 60** assertions pass |
| axe-core on trail, case, open branch and reveal | **0 violations** |
| Video of a full run | `docs/motion/motion-run.webm` (390 x 844, 2.6 MB) |
| Storyboard, full and reduced motion | `docs/motion/storyboard.png` (exact progress frames) |
| Large text, lock and branch screenshots | `docs/motion/*.png` |

**Performance, emulated** (`docs/motion/perf-summary.json`). Scenario: six pinches of 30 steps, a 40-step marker drag, and an evidence branch open and close, about 8.8 s.

| CPU slowdown | Frames | Frame time p95 | Longest frame | Input to frame p95 | `render()` p50 / p95 / max | Main-thread task time |
|---|---:|---:|---:|---:|---|---:|
| 1x | 524 | 16.7 ms | 16.8 ms | 32.2 ms | 0.2 / 0.3 / 4.5 ms | 0.57 s of 8.7 |
| 4x | 530 | 16.8 ms | 16.8 ms | 31.7 ms | 0.9 / 1.9 / 3.3 ms | 2.30 s of 8.8 |
| 6x | 530 | 16.8 ms | 33.4 ms | 31.7 ms | 1.5 / 3.0 / 5.8 ms | 3.50 s of 8.9 |
Path scroll at 4x: 79 frames, p95 16.8 ms.

**How to read this.** Headless Chromium paces frames at the display rate and rasterises in software, so frame times look quantised at 16.7 ms and say little about a phone's GPU. The informative numbers are the work per frame: our `render()` costs about 0.3 ms at full speed and 3 ms at 6x, against a 16.7 ms budget, with 190 layouts and 238 style recalculations in the whole run. That is good headroom. It is not a phone measurement.

## 4. Collision and gesture bug list
**Found and fixed in this stage**
1. Previous and Next buttons were placed after the 520vh path, so reaching them meant scrolling the whole path. Moved inside the sticky camera.
2. Internal links did not save the scroll position, so Back and Forward could not restore it. All internal links now go through one route function that saves scroll first.
3. Scroll restoration landed 21 px off because the page was not at full height yet. Restore now retries at 150 and 450 ms.
4. Opening the reveal overwrote its saved step with step 0 before the player could resume. It now saves only after the first change.
5. Distant path marks were faded to 30% opacity and failed contrast (axe, 3.55:1). Floor raised to 90%.
6. The disabled primary button was oxide with grey text and unreadable. Now a quiet disabled style.
7. The Skip button stayed visible: `display:flex` overrode the `hidden` attribute. Added `[hidden]{display:none}`.
8. On the reveal timeline, the 1799, 1803 and 1822 labels overprinted each other. Labels now collapse to dots when closer than 40 px; the dates are also listed as text.
9. The reveal timeline drew the "ruled out" hatch above and below because it reused the case camera. Bands are now hidden when a camera has no candidates, so hatch keeps one meaning.
10. A test artefact worth keeping: a pinch aimed at a ruler that is off screen does nothing. At 200% text the ruler can be below the fold, so the e2e scrolls it into view first. A real player has to scroll too.

**Open, untested, and I think real**
- **iOS Safari.** It handles two-finger touch differently; pointer-event pinch with `touch-action: pan-y` is likely fine on current iOS but unproven.
- **Page zoom.** `pan-y` on the ruler switches off the browser's own pinch-zoom on that element (it still works elsewhere). Someone who relies on browser zoom loses it on the ruler. The text-size option and the buttons are the alternative; this needs a decision (Q-54).
- **Double-tap zoom** is also off on the ruler, by the same property.
- **Edge gestures.** The marker handle sits at the right edge. Android gesture navigation takes both edges and iOS takes the left. The handle is inset 20 px; whether that is enough is unknown.
- **Mobile browser chrome.** Address bars that hide while scrolling change the viewport height; the camera follows through a resize observer, but a jump while pinching is untested.
- **Scroll-linked updates run on the main thread.** Fine at 6x here; a busy low-end phone may show lag. Scroll-driven animation timelines would move it off the thread; not adopted.
- **Palm and third-finger touches** during a pinch are not handled beyond ignoring a third pointer.
- **Marker drag snaps to the nearest possible year while dragging**, which is correct but has no haptic or sound.

## 5. Candid critique (subjective, mine)
| Lens | Score of 10 |
|---|---:|
| It is an experience, not stills | 7 |
| No unexpected year jump | 9 (property tested; no real hand tested) |
| No scroll trap | 8 (tested by touch swipe and wheel; not on a real browser's pull-to-refresh or overscroll) |
| Evidence evidence of acceptable performance | 4 (cheap per frame in emulation; nothing on a phone) |
| The transitions look good | 5 (they are clear and plain; the lock opening is the best; the branch is a slide) |
| Reveal pathway | 6 (it explains one idea well with real dates; it is two cases, text on a timeline, and not yet a story) |
Plainly: the camera and the transition controller are solid, small, and tested. The look is utilitarian. The reveal is a working skeleton with honest content and no rights-cleared media. Nothing here has been seen on a phone, and nobody has used it.

## 6. What is missing for a pass on the stated criteria
- **A real phone.** Gestures, a recording of a real screen, and a performance capture on a named device. Run `?perf=1`, press Record, do the pinch, drag and branch, press Stop, Download JSON, and send me `timehunt-motion-perf.json` with the phone model.
- **Playtime from a person**, to see whether the pinch feels right and whether anyone hits a trap.
