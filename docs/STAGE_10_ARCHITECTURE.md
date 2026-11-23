# Stage 10: Production architecture and delivery decision

Status: complete as a **decision package and tooling baseline**. It rests on emulated browser evidence and registry metadata. **No real phone, no CI run, no human review.** Awaiting `APPROVE STAGE 10`.

## 1. The decision in five lines

1. Ship first as a **TypeScript PWA built with Vite**; static hosting; no server in v1.
2. Keep **engine, content validator and store** as framework-free modules, with the independence from rendering **enforced by lint**.
3. **No UI framework yet.** Add Preact only when trigger T4 fires.
4. **TypeScript 6.0.3**, not 7.0.2, because typescript-eslint's declared range stops below 6.1.0.
5. **Defer Capacitor; do not adopt Expo/React Native or native** until a trigger in the ADR fires.

Full record, options table, compromises and triggers: [`architecture/ADR-001-stack.md`](architecture/ADR-001-stack.md). The user decides; this is a recommendation.

## 2. Deliverables

| Required | File |
|---|---|
| Architectural decision record | `architecture/ADR-001-stack.md` |
| Dependency/version matrix with verification links | `architecture/DEPENDENCY_MATRIX.md` (generated from the npm registry by `tools/verify/dep-matrix.mjs`) |
| Module diagram, boundaries, schema validation, local store, deterministic packs, corruption recovery, migrations, source indexing, optional CMS | `architecture/ARCHITECTURE.md` |
| Typed API contracts | `architecture/contracts.ts` (strict-compiles) |
| Threat model, cheating and offline trade-offs | `architecture/THREAT_MODEL.md` |
| Migration plan from the gray-box | `architecture/MIGRATION_PLAN.md` |
| Build/deploy instructions; lint, typecheck, tests, CI, release profiling, secrets policies | `architecture/OPERATIONS_POLICIES.md` |
| Tooling baseline | `app/eslint.config.js`, `app/tsconfig*.json`, `.github/workflows/ci.yml`, `claims.yml`, `.github/dependabot.yml`, `tools/pack/requirements.txt` |

## 3. What was run and what it showed (2026-11-23)

| Check | Result |
|---|---|
| `npm run verify` (lint, typecheck, tests) | 0 lint errors (14 warnings in scripts/tests), 0 type errors, **103/103 tests** |
| Clean install from lockfile (`npm ci --ignore-scripts`) in a fresh copy | Installs; 0 vulnerabilities; verify passes (one test needs `docs/pack`, absent from my partial copy) |
| Boundary rules | `import ../ui` in the engine, `window`, `Math.random` and `Date` in the engine or store each fail lint (negative tests run) |
| Pack build | Byte-identical on two runs; equals the committed file |
| Registry facts | Versions, dates, engines and licences queried at run time into the matrix |
| Injection probe | 585 payloads in pack text: nothing executed on the game or motion pages; reveal proves nothing (does not show pack text) |

## 4. Defects found and fixed while doing this stage

1. **`docs/TRY_IT.md` was wrong for the Node server.** `/motion/` and `/reveal/` returned 404 (only Python's server served directory indexes). Fixed in `scripts/serve.mjs`; regression test added.
2. **Motion and reveal prototypes would have rendered a `javascript:` source URL as a link** because they skip `validatePack`. Both now restrict links to http(s); a test proves `validatePack` rejects other schemes.
3. **`.gitignore` had no secret patterns**, contradicting the secrets policy I was about to write. Added.
4. **The first draft of the architecture text claimed lint enforced determinism; it only banned platform globals.** `Math.random` and `Date` are now banned too.
5. **My first injection probe reported "no injection" while two of four pages had not shown the payload.** The probe now records whether the payload was ever on screen and warns when it was not.

## 5. Honest limits

- **No real device.** Every performance, gesture, storage-eviction and accessibility statement is emulated or unknown. This decision is the weakest exactly where it matters most: whether a PWA is good enough on a real mid-range phone.
- **No prototype of Expo/React Native.** The comparison for that route rests on registry metadata, GitHub release pages and my reading of documented peer ranges, **not** on building the gesture prototype there. The master prompt asks for comparison "using the actual gesture prototype"; I did that for the web route only.
- **Unreachable sources:** expo.dev, reactnative.dev, MDN's own site, web.dev, webkit.org. I used npm, GitHub release pages and MDN's GitHub content instead.
- **CI, Dependabot and the claims workflow have never run** on GitHub.
- **Types are partial.** Engine, store and simulator are checked as JavaScript; the full TypeScript conversion is Stage 11 work.
- **Threat model and ADR have one reviewer: the agent that wrote them.**
- **Security results are narrow.** The probe covers pack text only. T-11 is not an audit.

## 6. Open questions raised

See `OPEN_QUESTIONS.md` Q-61 to Q-66 (devices, hosting, store distribution, CMS need, storage-loss tolerance, answer secrecy).
