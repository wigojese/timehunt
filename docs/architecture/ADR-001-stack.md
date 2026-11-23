# ADR-001: Production stack and delivery route

Status: **PROPOSED** for Stage 10 approval. Date: 2026-11-23. Supersedes nothing. Decision owner: the user (this record recommends; it does not decide).

## 1. Decision

1. **Ship first as a TypeScript progressive web app (PWA), built with Vite.** A static site: no server is needed to play a day.
2. **Keep the engine, content validator and store as framework-free TypeScript modules** with no DOM, no browser globals and no imports from view code. This is enforced by lint (section 6), not by convention.
3. **Add no UI framework yet.** The gray-box UI is about 430 lines of plain DOM. Adopt Preact (about 4 KB) only when a trigger in section 5 fires.
4. **Pin TypeScript to 6.0.x** (installed 6.0.3), not 7.0.2, because the linter's declared range stops below 6.1.0 (section 4).
5. **Defer a Capacitor wrapper.** Decide on store distribution after real-device evidence (Stage 14) and the launch plan (Stage 15). The engine is the same in either case.
6. **Do not adopt Expo / React Native or fully native code now.** Not because they are bad: nothing tested so far needs them, and each adds a large dependency surface that this product has no demonstrated need for.

## 2. Context: what is actually known

| Fact | Evidence | Strength |
|---|---|---|
| The engine is pure and idempotent; 101 unit tests pass; the UI renders only from `publicView` | `app/src/engine`, `app/test`, 2026-11-23 run | Tested |
| The whole app (code, CSS, 10-case pack) is about 85 KB gzipped, no runtime dependencies | `tar | gzip` of `src motion reveal data ui.css index.html` | Measured |
| Gesture, path scroll and transition work in DOM + SVG + CSS | Stage 8 prototype, 65 + 72 browser assertions | **Emulated Chromium only; no real phone** |
| Frame work is cheap: `render()` about 0.3 ms at full speed, about 3 ms at 6x CPU slowdown, against a 16.7 ms budget | `docs/motion/perf-summary.json` | **Headless emulation; says little about a phone GPU** |
| Offline play and resume work with one `localStorage` record per expedition; crash, corrupt, schema and content/rules changes are handled | `session.test.js` fault injection | Tested in Node with an injected store |
| The UI has an expanding pseudo-locale and no real second language | `strings.js`, `?pseudo=1` | Tested for layout; Georgian needs a font and a human translator |
| Accessibility: axe-core on the prototype pages, reduced motion, 200% text | Stage 7/8/9 reports | Automated only; no VoiceOver or TalkBack run |

What is **not** known: any real-device frame rate, touch-handling quirk, iOS storage-eviction behaviour, haptics, app-store review outcome, or how players react to a PWA install prompt. Section 7 lists what each unknown would change.

## 3. Options compared

Scoring is qualitative. "Evidence" says whether this repository tested it. A cell that says *docs only* means I read registry or release metadata but built nothing.

| Criterion | A. TypeScript PWA (recommended) | B. Expo / React Native | C. PWA + Capacitor wrapper | D. Fully native (Swift + Kotlin) |
|---|---|---|---|---|
| Gesture prototype (Stage 8) | Built and run here (emulated). Pointer events, CSS transforms, SVG | Would be a rewrite on Reanimated + Gesture Handler. **Not built.** *Docs only.* | Same as A, inside a system web view. **Not built.** | Rewrite twice. Not built |
| Motion profiling | Measured in emulation only | Unknown | Web-view performance differs from the browser; unknown | Best ceiling; unknown here |
| Offline persistence | Service worker + `localStorage` / IndexedDB. MDN states origin storage is best-effort and can be evicted; `navigator.storage.persist()` is decided by the browser | SQLite / file storage, durable on device. *Docs only* | App-container storage, but the web view's rules still apply. Unverified | Durable |
| Internationalisation | `Intl` plus our string table; Georgian needs a font | Same strings table; native fonts. *Docs only* | As A | Platform localisation |
| Accessibility | Semantic HTML, axe-checked; real screen readers untested | Native accessibility props; chart/map semantics must be hand-built. *Docs only* | As A | Strongest platform support; two codebases |
| Deployment | Static hosting. Update is a page load | Store review per release; over-the-air JS updates possible. *Docs only* | Store review; web content could ship in the bundle | Store review x2 |
| Maintenance cost | One language, 0 runtime dependencies today | Large tree: React, React Native, Expo SDK, Reanimated, worklets. Peer ranges move together (see matrix) | A + a native shell and plugins | Two codebases |
| Reach | Any modern browser, shareable URL | Stores only | Stores + web | Stores only |
| Engine reuse | Direct | Direct if the engine runs unchanged on Hermes: **expected, untested** | Direct | Rewrite or bridge |
| Registry audit (2026-11-23, lockfile-only trees, see matrix) | 0 vulnerabilities in the installed dev tree; Vite + PWA candidate: 4 moderate, build-time only | Expo and React Native candidate: 3 moderate (needed `--legacy-peer-deps` to resolve) | As A + wrapper | n/a |

Why A. The product's differentiator is authored content and a calm, legible interaction, not native capability. The engine is already independent of rendering. A PWA keeps one codebase, one deploy and the least dependency surface, and loses nothing that has been shown to matter yet. The things it might lose (durable storage, haptics, notifications, store discoverability) are **named risks with triggers**, not assumptions.

Why not B now. React Native is a sound choice when the gesture and animation work needs the native UI thread. I have no evidence that it does: Stage 8's measurements are emulated and cheap, but they are not a phone. Moving to B on a hunch would trade a working, tested prototype for a rewrite and a fast-moving dependency tree (Expo SDK 58 requires Node ^22.13; react-native 0.88.1 declares react ^19.3.0; Reanimated 4.8.0 declares react-native 0.87 to 0.89 and worklets 0.14.x; see the matrix).

## 4. Compromises accepted by this decision

1. **TypeScript 6.0.3, not the newest 7.0.2.** `typescript-eslint` 8.74.0 declares support for TypeScript below 6.1.0. Running 7.x means type checking works but linting TypeScript sources would be unsupported. Revisit when typescript-eslint widens its range. Cost: not on the newest compiler for a while.
2. **Type checking is currently `checkJs` plus a strict `.ts` contract file.** The sources are still `.js` with JSDoc. Converting to `.ts` is a mechanical Stage 11 step, not done here. Cost: types are weaker than a full conversion.
3. **No UI framework until needed.** Cost: hand-written DOM updates will not scale past a certain screen count (trigger T4).
4. **Storage durability is best-effort in a browser.** We reduce the harm (single-record transactions, digests, held-not-deleted corrupt records, export) but cannot promise permanence. Cost: a player who clears site data, or whose browser evicts it, can lose progress. Mitigation: request persistent storage and offer an export code; both are Stage 11 to 12 work, neither is built.
5. **No server in v1.** Scores are not authoritative and the day's answers ship to the device (section on cheating in `THREAT_MODEL.md`). Cost: a determined player can read answers. We accept that for a single-player puzzle and document it.
6. **CI and the Dependabot config exist but have never run.** They are written and parse as YAML. They have not executed on GitHub. Cost: the first real run may fail for reasons I could not see.

## 5. Triggers that reopen this decision

| Id | Trigger | Would move us toward |
|---|---|---|
| T1 | On a real mid-range phone, path scroll or the transition drops below an agreed frame target in a release build | Move rendering to canvas / WebGL first; only then consider B |
| T2 | Real-device tests show saved progress lost in normal use (not manual clearing), even with persistent storage requested | IndexedDB first; then C (Capacitor) for durable app storage |
| T3 | A decision that store distribution or push-style reminders are required | C, with B only if native UI is also required |
| T4 | UI state shared across more than about six screens, or hand-written updates cause a defect in two consecutive stages | Add Preact (or a similar small library) behind the existing `publicView` boundary |
| T5 | Screen-reader testing shows the web chart/map semantics cannot be made usable | Reconsider native accessibility (B, D) |
| T6 | typescript-eslint supports TypeScript 7 | Upgrade the compiler |
| T7 | A required dependency drops our Node version or has an unpatched high advisory in the shipped (not dev-only) tree | Re-run the matrix; replace or pin |

## 6. Boundaries that keep the choice reversible

Enforced in `app/eslint.config.js`, with a negative test run on 2026-11-23:

- `src/engine/**` may import only other engine modules; no UI, store, motion or reveal imports.
- `src/engine/**`, `src/store/session.js` and `src/sim/**` may not use `window`, `document`, `localStorage`, `sessionStorage`, `navigator`, `location`, `history`, `matchMedia`, `getComputedStyle`, `requestAnimationFrame` or `fetch`. Capabilities are injected (`KeyValueStorage`, clock, pack source).
- The UI reads only `publicView`, defined in `docs/architecture/contracts.ts`.

Because of these rules, option B, C or D reuses the engine, the pack format and the tests, and replaces only `src/ui`, `motion` and `reveal`. That reuse is the compromise's insurance. "Expected, untested" applies to running the engine under Hermes (React Native's JavaScript engine): I did not run it.

## 7. What I could not verify

- **Real devices.** No phone, tablet or screen reader was available. Every device-dependent claim above is marked emulated or unknown.
- **Pages that were unreachable from this environment**: expo.dev, reactnative.dev, MDN's website, web.dev and webkit.org. I used npm registry metadata and GitHub release pages / MDN's GitHub content instead; the matrix links the sources actually read.
- **Store policies, iOS PWA limits and Capacitor behaviour** were not tested. Treat statements about them as open questions (see `OPEN_QUESTIONS.md`).
- **CI has not run on GitHub.**
- **No human reviewer** has read this record; it has had one pass by the agent that wrote it.

## 8. Consequences

- Stage 11 can start on the existing modules, converting sources to TypeScript file by file with `tsc` and ESLint as the gate.
- Everything that varies by platform (storage, clock, share sheet, haptics) goes behind an interface defined in `contracts.ts`.
- The decision is cheap to reverse until Stage 11 adds screens. It becomes expensive after Stage 12. If a trigger is likely to fire, test it before Stage 11 ends.
