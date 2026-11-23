# TIMEHUNT Daily Ten, gray-box (Stage 4)

A working, resumable ten-case game with a deliberately plain interface. It has **no dependencies** and needs only Node 22 and a browser. The interface is throw-away; the engine, rules and store are written to be ported (see `docs/STAGE_4_GRAYBOX.md`).

## Run it
```bash
cd app
node scripts/serve.mjs          # http://127.0.0.1:5173/
```
Open `http://127.0.0.1:5173/`. Useful switches:

| URL | What it does |
|---|---|
| `/?debug=1` | Test tools: arm a crash before or after the next save, reload, show the state digest |
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
npm test                        # 70 tests, about 3 seconds, no install needed
node scripts/demo-run.mjs       # replays the scripted and seeded days, rewrites fixtures/scenario-*.json
node scripts/record-video.mjs   # real-browser run, asserts 26 behaviours, writes docs/gray-box/ video and screenshots
```
`record-video.mjs` uses the Playwright that is pre-installed in the cloud environment at `/opt/node22/lib/node_modules/playwright`. Change that path on another machine.

## Layout
```
app/
  index.html, style.css          plain UI shell
  data/daily-pack-draft.json     copy of docs/pack/daily-pack-draft.json (build_pack.py writes both; a test checks they match)
  src/engine/                    PURE: no DOM, no storage, no clock, no randomness
    rules.js                     the one canonical rules module (numbers and switches)
    pack.js                      validatePack(): fail-safe, returns compiled content or errors
    engine.js                    createExpedition, transition, publicView, score, replay
    years.js, canon.js, rng.js   year labels (no year zero), canonical JSON + hash, seeded PRNG
  src/store/                     controller: transactional Session, storage adapters, crash simulator
  src/ui/main.js                 DOM rendering only
  src/sim/scenarios.js           scripted day and seeded bot (tests and tools only)
  test/                          node:test suites
  fixtures/                      documented JSON fixtures (see fixtures/README.md)
  scripts/                       serve, demo-run, record-video
```
