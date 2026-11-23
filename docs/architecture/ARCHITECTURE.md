# Architecture (Stage 10)

Status: proposed with ADR-001. Describes what exists today (marked **built**), what is specified but not built (marked **specified**), and what is only an option (marked **optional**). Nothing here claims a release.

## 1. Module diagram

```
                    AUTHORING (offline, not shipped)                      RUNTIME (the app)
 ┌────────────────────────────────────────────────────────┐   ┌─────────────────────────────────────────────────────┐
 │ tools/pack/pack_data.py   (cases, sources, claims)     │   │                    src/ui, motion, reveal           │
 │        │ build_pack.py                                 │   │  DOM / SVG / CSS. Reads PublicView only.            │
 │        ▼                                               │   │  Sends Commands. Owns no game rules.                │
 │ pack JSON  ──► pack.schema.json (JSON Schema)          │   └───────────────▲─────────────────┬───────────────────┘
 │        │        lint_pack.py (content rules, C0, leaks)│                   │ PublicView       │ Command
 │        ▼                                               │   ┌───────────────┴─────────────────▼───────────────────┐
 │ tools/verify/check-claims.mjs (page re-check)          │   │ src/store/session.js   Session                      │
 │ docs/reveal, docs/pack (human-readable reports)        │   │ load / dispatch / discardAndStart                   │
 └──────────────┬─────────────────────────────────────────┘   │ KeyValueStorage injected (localStorage, memory)     │
                │ publish: pack file + manifest (digest)      └───────────────▲─────────────────┬───────────────────┘
                ▼                                                             │ state            │ transition()
   ┌────────────────────────────┐   fetch / cache      ┌──────────────────────┴─────────────────▼───────────────────┐
   │ static host / CDN          │ ───────────────────► │ src/engine   (pure, no DOM, no storage, no clock)           │
   │ pack-YYYY-MM-DD.json       │                      │ pack.js validatePack → compiled content                     │
   │ manifest.json              │                      │ engine.js transition, publicView, replay, score, share      │
   └────────────────────────────┘                      │ rules.js  canon.js (digest)  rng.js  years.js               │
                                                       └─────────────────────────────────────────────────────────────┘
```

Direction of dependency: `ui → store → engine`. Authoring tools depend on nothing at runtime. `contracts.ts` describes every arrow and is compiled in strict mode (`npm run typecheck`).

## 2. Boundaries and who may know what

| Module | Knows | Must not know | Enforced by |
|---|---|---|---|
| `engine` | Compiled content, rules, state, commands | DOM, storage, network, clock, UI strings | ESLint `no-restricted-imports` + `no-restricted-globals` (**built**, negative-tested 2026-11-23) |
| `store` | Engine API, a `KeyValueStorage` | The DOM, rendering | Same rules on `session.js`. `storage.js` is the one adapter allowed to touch `localStorage` |
| `ui`, `motion`, `reveal` | `PublicView`, `Command`, `GameEvent` | Targets, unrevealed clue text, rules arithmetic | Tests: `publicView` never contains the target before resolution; render reads only the view |
| `tools/*` | Raw pack files, sources | The engine's runtime state | Separate directory, separate language for the builder |

`publicView` is the leak boundary: whatever it omits cannot reach a renderer, a screenshot test or a share card.

## 3. Schema validation (two layers, one source of truth per layer)

1. **Structure: JSON Schema** (`tools/pack/pack.schema.json`, draft 2020-12). **Built** at authoring time through Python `jsonschema`. At run time the engine does not load a schema validator; this keeps the shipped bundle at zero dependencies.
2. **Meaning: executable rules.** `tools/pack/lint_pack.py` (authoring, rules L1 to L9: convention wording, candidate set size, uniqueness proof, paid-clue usefulness, year-leak scan, source existence, computed verification level) and `validatePack` in the engine (run time, **built**: exactly ten cases, end-of-year convention, status must be `PUBLISHABLE` unless a draft is explicitly allowed, corridor and candidate arithmetic recomputed from predicates).
3. **Fail-safe.** `validatePack` never throws and returns no content on failure. An invalid or non-publishable pack is therefore never offered for play.
4. **Option (optional).** Compile the JSON Schema to a standalone validator at build time (Ajv standalone) so the browser can reject a bad downloaded pack before `validatePack`. Not needed until packs are fetched from a network (Stage 12).

A schema covering the *saved record* (not only the pack) is **specified** in `contracts.ts` (`SavedRecord`); at run time it is checked by `Session.load` (shape, schema number, digests).

## 4. Local store

**Built:** one record per expedition, key `timehunt:v{schema}:{mode}:{dailyId}[:caseIds]`, value

```
{ schema, packDigest, rulesId, stateDigest, state }
```

- **One write is the unit of atomicity.** `dispatch` computes the next state in memory, writes one record, and adopts the state only after the write succeeds. On a write exception it re-reads the store (a crash can land before or after the write) and adopts whichever state is provably stored.
- **Idempotent commands.** Every command carries `actionId`; a repeat returns the same state and a `DUPLICATE_IGNORED` event. A double tap cannot charge twice.
- **Digest.** `cyrb53` over canonical JSON detects accidental corruption and tampering by accident. **It is not a security measure** (section 7 and `THREAT_MODEL.md`).
- **Failure to write** surfaces as `SAVE_FAILED` with the exact message "Could not save. Nothing was charged." and no state change.

**Specified, not built:**

| Item | Plan | Why not now |
|---|---|---|
| IndexedDB for the event log and cached packs | `idb` wrapper behind the same `KeyValueStorage`-like async port | One small record per day fits `localStorage`. IndexedDB becomes necessary when the archive of completed days and offline packs grows past a few hundred KB |
| `navigator.storage.persist()` request | Ask after the first solved case, never on first paint | Browser decides; behaviour on iOS not tested |
| Export / import code | A copyable text of the record for moving devices | Needs a product decision on format and privacy (`OPEN_QUESTIONS.md`) |
| Archive of completed days | Read-only records keyed by day id | Stage 12 |

## 5. Deterministic packs

- **Build.** `python3 tools/pack/build_pack.py` writes `docs/pack/*` and `app/data/*`. Run twice on 2026-11-23, the output file is byte-identical (SHA-256 `1c90cd36…939d0a`), and it equals the committed file. CI repeats this and fails on any diff.
- **Identity.** The compiled content carries a `digest` over canonical JSON (sorted keys, no whitespace). Saved records store it; a changed pack is held, not silently mixed with old progress (`content_changed`).
- **Rules identity.** `rules.id` is a digest of the rules object plus `RULES_VERSION`; a rules change holds old records the same way (`rules_changed`).
- **Randomness and time.** Any shuffle uses `rng(seed)`. `Math.random` and the `Date` global are banned in the engine, store and simulator by lint (**built**, negative-tested 2026-11-23). Determinism is also tested: replaying a command log reproduces the final state byte for byte, for generated logs (`engine.test.js`) and for recorded fixtures (`fixtures.test.js`).
- **Day identity.** A day is its pack id, not the device clock; reset and timezone rules are a Stage 12 decision (`OPEN_QUESTIONS.md`).

## 6. Corruption recovery

| Condition | Detected by | Behaviour | Tested |
|---|---|---|---|
| Storage unreadable or unavailable | `getItem` throws or the probe fails | Play in memory; banner "Progress cannot be saved in this browser mode." | yes |
| Record is not JSON, or lacks `state` | `JSON.parse` / shape check | Status `corrupt`; the raw text is **held, not deleted**; the player chooses | yes |
| Digest mismatch | `stateDigest` ≠ stored | `corrupt`, held | yes |
| Schema number differs | `rec.schema` | `schema_unknown`, held (never guessed at) | yes |
| Pack changed | `packDigest` | `content_changed`, held | yes |
| Rules changed | `rulesId` | `rules_changed`, held | yes |
| Crash before a write | Fault injection `before` | State unchanged, retry safe | yes |
| Crash after a write | Fault injection `after` | Re-read adopts the stored state | yes |
| Player discards | `discardAndStart()` | Old record kept under `<key>.previous`, then a fresh start | yes |

"Held" means the app shows the choice and does nothing destructive until the player acts. Wording of those screens is in `ui/strings.js` and was reviewed in Stage 7.

## 7. Migrations

Rules (details in `MIGRATION_PLAN.md`): records carry `schema`; a migration is a pure function `n → n+1` (`Migration` in `contracts.ts`); migrations run on a copy, are verified by replaying the log to the same digest where a log exists, write the new record **before** removing nothing (the old record is copied to `.previous`), and an unknown **newer** schema is held, not downgraded. **Specified; no migration exists yet** because `STATE_SCHEMA` is still 1.

## 8. Source indexing

- Every clue, fact and reveal item names `source_ids`. `validatePack` and `lint_pack.py` reject unknown ids.
- A source record carries publisher, URL, whether it was **opened** by the agent, retrieved date, and a note. The verification level (V0 to V3) is **computed** from opened sources by distinct publisher, never typed in by hand.
- `docs/pack/BIBLIOGRAPHY.md`, `docs/reveal/SOURCES_RIGHTS.md` and `tools/verify/claims.json` (47 claims re-checked against pages by `check-claims.mjs`) are generated or verified from the same ids.
- **Specified (Stage 13):** a claim-level annotation table (claim → source id → quoted fragment → date checked → reviewer) and an inverted index (source → every claim that depends on it) so a retracted source finds every affected clue.

## 9. Optional publishing CMS

**Optional and not recommended yet.** Today the editor works in a structured repository (`pack_data.py`), which gives review by diff, a history of every change and a build that fails closed. A CMS adds hosting, accounts, a backup duty and a second source of truth. Revisit at Stage 13 only if a non-programmer editor is confirmed (`OPEN_QUESTIONS.md`). If adopted, the CMS must emit the same pack JSON and be gated by the same schema, lint and claim checks; it must never write to a published pack in place.

## 10. Internationalisation and accessibility hooks

- All player-facing strings come from `ui/strings.js` via `t(key, vars)`. A pseudo-locale (`?pseudo=1`) expands and accents text to expose truncation. **No second real language exists**; Georgian needs a font decision and a human translator (`OPEN_QUESTIONS.md`).
- Dates and years are formatted by one function (`yearLabel`) with no year zero; locale formatting through `Intl` is **specified** and not built.
- Accessibility depends on semantic DOM, so the web route keeps native elements (buttons, lists, headings). Charts and maps need text alternatives and keyboard paths; Stage 9 built stepper-based equivalents; no screen reader was run.

## 11. Build and delivery path (summary)

`npm ci` → `npm run verify` (lint, typecheck, tests) → pack build and sync check → browser audits → Vite build (**not yet configured**; the gray-box is served unbundled) → static hosting with a service worker for offline play (**specified**). Details and exact commands are in `OPERATIONS_POLICIES.md`.
