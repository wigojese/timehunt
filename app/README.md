# TIMEHUNT Daily Ten (Stage 7 UI)

A working, resumable ten-case game with a mid-fidelity accessible UI (STRATA Option I). Runtime needs only Node 22 and a browser; `axe-core` is a dev dependency for the audit script. The UI is a prototype; the engine, rules and store are written to be ported (see `docs/STAGE_4_GRAYBOX.md`, `docs/STAGE_7_UI.md`).

## Run it
```bash
cd app
node scripts/serve.mjs          # http://127.0.0.1:5173/
```
Open `http://127.0.0.1:5173/`. Useful switches:

| URL | What it does |
|---|---|
| `/?debug=1` | Test tools: arm a crash before or after the next save, show the state digest |
| `/?pseudo=1` | Pseudo-locale: every string 40% longer and accented, to test long and translated copy |
| `/?variant=trace` | Adds Trace at 2 Insight (off in the C1 default) |
| `/?variant=cap1` | At most 1 Insight spent per case (D-017 switch) |
| `/?variant=deep` | Hides the relation clue from free evidence and sells it as a Deep clue (Q-32) |
| `/?variant=norefund` | Charges for clues that remove nothing |
| `/?mode=practice&seed=7` | Practice: one case chosen from the seed, 2 Insight, separate save |
| Combine | `?debug=1&variant=trace,cap1` |

Saved progress lives in this browser's local storage. To start over, clear site data, or use the on-screen choice if a saved game is held.

## Test it
```bash
cd app
npm test                        # 71 engine tests, about 3 seconds, no install needed
node scripts/demo-run.mjs       # replays the scripted and seeded days, rewrites fixtures/scenario-*.json
npm install                     # once, for axe-core
node scripts/e2e-ui.mjs         # real-browser run: 78 assertions, axe on 33 screens, reach, text sizes, keyboard; writes docs/ui/
node scripts/make-flows.mjs     # composes the annotated flow sheets from those screenshots
```
`record-video.mjs` uses the Playwright that is pre-installed in the cloud environment at `/opt/node22/lib/node_modules/playwright`. Change that path on another machine.

## Layout
```
app/
  index.html, ui.css             UI shell and styles (rem-based, so the Text size setting scales everything)
  data/daily-pack-draft.json     copy of docs/pack/daily-pack-draft.json (build_pack.py writes both; a test checks they match)
  src/engine/                    PURE: no DOM, no storage, no clock, no randomness
    rules.js                     the one canonical rules module (numbers and switches)
    pack.js                      validatePack(): fail-safe, returns compiled content or errors
    engine.js                    createExpedition, transition, publicView, score, replay
    years.js, canon.js, rng.js   year labels (no year zero), canonical JSON + hash, seeded PRNG
  src/store/                     controller: transactional Session, storage adapters, crash simulator
  src/ui/app.js, strings.js      DOM rendering, routing, strings (with pseudo-locale)
  src/sim/scenarios.js           scripted day and seeded bot (tests and tools only)
  test/                          node:test suites
  fixtures/                      documented JSON fixtures (see fixtures/README.md)
  scripts/                       serve, demo-run, record-video
```

## Motion prototype (Stage 8)
`node scripts/serve.mjs`, then open `/motion/`. Add `?perf=1` for the frame recorder (use it on a real phone). `node scripts/e2e-motion.mjs` runs the 60-assertion emulated-touch audit; `node scripts/record-motion.mjs` rebuilds the video and storyboard. See `docs/STAGE_8_MOTION.md`.

## World Reveal prototype (Stage 9)
Open `/reveal/`. `node scripts/e2e-reveal.mjs` runs the 65-assertion audit, `make-reveal-sheets.mjs` builds the sheets and `make-reveal-docs.mjs` regenerates `docs/reveal/CONTENT_SCRIPTS.md` and `SOURCES_RIGHTS.md`. See `docs/STAGE_9_REVEAL.md`.
