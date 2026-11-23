# Operations policies, build and deploy (Stage 10)

Each statement says whether it is **in place** (exists and was run), **written** (file exists, never run on its target), or **specified** (a rule for later stages). Nothing here claims that the app has been released, hosted or distributed.

## 1. Quality gates

| Gate | Command (from `app/` unless noted) | State on 2026-11-23 |
|---|---|---|
| Lint | `npm run lint` | **in place**: 0 errors, 14 warnings (unused variables in scripts and a test). Includes the engine boundary rules |
| Type check | `npm run typecheck` | **in place**: `tsc` strict on `docs/architecture/contracts.ts`; `checkJs` on engine, store, simulator: 0 errors |
| Unit and property tests | `npm test` | **in place**: 103 pass |
| All three | `npm run verify` | **in place** |
| Pack lint | `python3 tools/pack/lint_pack.py` (repo root) | **in place**: 0 errors, 3 warnings (NESTED_CLUES, known) |
| Pack build is reproducible and committed | `python3 tools/pack/build_pack.py && git diff --exit-code docs/pack app/data` | **in place** locally (byte-identical twice) |
| Browser audits | `node scripts/e2e-ui.mjs`, `e2e-reveal.mjs`, `e2e-motion.mjs` | **in place** locally (emulated Chromium) |
| Injection probe | `node tools/verify/xss-probe.mjs` (repo root) | **in place** locally |
| Claim re-check | `node tools/verify/check-claims.mjs` | **in place** (47/47 on the last run); needs network |
| CI | `.github/workflows/ci.yml` | **written, not run** |
| Weekly claim check | `.github/workflows/claims.yml` | **written, not run** |
| Dependency updates | `.github/dependabot.yml` | **written, not run** |

Rule: **a gate that has not run is not a pass.** The first pull request to run CI is Migration Step 1; until then, treat CI as unverified.

## 2. Dependency policy

1. **Runtime dependencies: none today.** Adding one needs a written reason in `docs/DECISIONS.md`: what it does, why the platform or twenty lines of code will not do, its size, licence, last release date, maintainer count and open advisories.
2. **Dev dependencies** are pinned by `package-lock.json` and installed with `npm ci --ignore-scripts` in CI. If a package genuinely needs an install script, allow it for that package only, with a comment.
3. **Verify, do not remember.** Versions, dates, engines and peer ranges are queried from the registry by `tools/verify/dep-matrix.mjs` into `DEPENDENCY_MATRIX.md`. Regenerate it at the start of every stage that changes dependencies.
4. **TypeScript stays on 6.0.x** until typescript-eslint's declared range includes 7.x (trigger T6 in ADR-001).
5. **Advisories.** `npm audit` must show no high or critical advisory in anything that ships. Moderate or lower advisories in dev-only trees are recorded with their path and reviewed monthly. 2026-11-23: 0 advisories in the installed tree.
6. **Licences.** MIT, ISC, BSD and Apache-2.0 are fine. MPL-2.0 (axe-core) is acceptable as a dev-only tool that is not bundled. Anything else needs a decision entry.
7. **Updates.** Dependabot groups development tools weekly; a major version bump needs the matrix regenerated in the same pull request. No auto-merge.
8. **Lockfiles are committed**; the Python tool pin is `tools/pack/requirements.txt`.

## 3. Secrets policy

- **The app has no secrets and must not need any.** No API keys in the client; a key in a client bundle is public.
- **The repository holds no secrets.** `.env*`, key files and signing material are in `.gitignore`; CI runs a secret scan before release (**specified**; the GitHub MCP server offers `run_secret_scanning`, which I have not run).
- **CI has no secrets today** and runs with `permissions: contents: read`. If a deploy job is added, it gets its own workflow, its own environment with required reviewers, and the narrowest token scope; secrets are never exposed to pull requests from forks (`pull_request`, not `pull_request_target`).
- **Third-party Actions are pinned by commit SHA before the first release**; until then they are pinned by major tag (`@v7`), which is a known weaker position. Dependabot proposes SHA bumps.
- **Signing keys** (store builds, if Capacitor is ever adopted) are generated and held by the owner, stored in a password manager and the platform's secure signing service, never committed, never given to an agent session.
- **Anything an agent session needs** is requested through the environment's credential flow, never pasted into chat or a file.
- **Leak procedure:** revoke first, rotate second, then rewrite history only if the owner decides to.

## 4. CI least privilege

- Workflow-level `permissions: contents: read`; widen per job only with a written reason.
- `concurrency` cancels superseded runs. `timeout-minutes` on every job.
- Browser jobs run with no credentials and no write access.
- Generated artifacts (reports, screenshots) are uploaded only if needed, with a short retention.
- Branch protection on `main` (required status checks, no force-push, reviews) is **specified**; it is a repository setting the owner must enable, and I cannot confirm it from here.

## 5. Release-build profiling policy

Stage 8's numbers came from a development server and headless Chromium. That is **not** a release build on a phone. From Stage 11:

1. Profile the **production build** (minified, service worker active), never the dev server.
2. Test on **at least one mid-range Android phone and one iPhone** before any performance claim (Stage 14 sets the device matrix; Q-53 to Q-56 ask the user which devices exist).
3. Record: frame time distribution during path scroll and the lock transition (p50, p95, longest), input-to-frame latency, main-thread long tasks, cold start to interactive, memory after a full ten-case day, and the transfer size of a day (gzip). The Stage 8 recorder (`?perf=1`) already captures the first three.
4. Budget starting points, **to be revised after the first device measurement**, not facts: transferred size of the shell under 150 KB gzipped (currently about 85 KB including the pack); no long task over 50 ms during gestures; p95 frame under 20 ms on the mid-range phone.
5. Reports go to `docs/perf/` with the device, OS, browser version, build hash and date. "Not tested" stays "not tested".

## 6. Build and deploy instructions

### 6.1 Today (works now)

From a clean checkout of this repository:

```bash
cd app
npm ci --ignore-scripts
npm run verify
```

```bash
node scripts/serve.mjs
```

Open `http://127.0.0.1:5173/`. For a phone on the same Wi-Fi follow `docs/TRY_IT.md`. Rebuilding the pack (repository root):

```bash
pip install -r tools/pack/requirements.txt
python3 tools/pack/build_pack.py
cd app && node scripts/demo-run.mjs
```

The last command refreshes the recorded fixtures; commit generated files together with the source change. Playwright scripts need Playwright installed globally and `PLAYWRIGHT_MODULE` pointing at it if it is not in the default path:

```bash
PLAYWRIGHT_MODULE="$(npm root -g)/playwright" node scripts/e2e-ui.mjs
```

### 6.2 Production build (specified, not built)

1. Add Vite (`vite build`), emitting hashed assets and a manifest; set `base` for the chosen host.
2. Add `vite-plugin-pwa` (or a 60-line hand-written service worker; decide at Step 2 by size) with: a versioned precache, network-first for the daily pack, a **kill switch** (a build-time flag that makes the next load unregister the worker and clear caches), and an update prompt that never interrupts a case.
3. Publish to static hosting over HTTPS. The host is **not chosen** (`OPEN_QUESTIONS.md`); candidates are any static host or object store with a CDN. Headers to set: a Content Security Policy without inline script, `Cache-Control` long for hashed assets and short for `index.html` and the pack manifest, `X-Content-Type-Options: nosniff`.
4. The daily pack is a separate file: `packs/<pack-id>.json` plus `manifest.json` carrying the digest. Publishing a pack never rebuilds the app.

### 6.3 Release and rollback (specified)

- Version the app with SemVer and tag releases; a tag triggers the (not yet written) deploy workflow.
- **Rollback:** redeploy the previous tag; the service worker kill switch handles a bad worker; saved records survive because schema migrations are forward-only and the previous record is kept (`MIGRATION_PLAN.md`).
- **Pack rollback:** point `manifest.json` at the previous pack file. Saved progress for the withdrawn pack is held by digest, not deleted.
- Capacitor or store packaging is out of scope until a trigger fires; Stage 15 writes the manual steps if it does.

## 7. Documentation hygiene

`STAGE_STATUS.md` is the source of truth for gate state; `DECISIONS.md` records choices with ids; `OPEN_QUESTIONS.md` records what needs the owner; `HANDOFF.md` is the page a new maintainer reads first. A claim of "tested", "published" or "verified" must name the evidence file or command.
