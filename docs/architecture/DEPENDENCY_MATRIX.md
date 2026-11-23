# Dependency and version matrix

Generated 2026-11-23 by `tools/verify/dep-matrix.mjs` from the npm registry. Versions and publish dates are queried, not remembered. Local runtime: Node v22.23.5.

| Package | Stack | Latest | Published | Node engines | Licence | Decision | Why | Verify |
|---|---|---|---|---|---|---|---|---|
| `typescript` | PWA | 7.0.2 | 2026-07-08 | >=16.20.0 | Apache-2.0 | USE 6.0.x, not 7 | typescript-eslint 8.74.0 supports TypeScript below 6.1.0 only (peer range), so 7.0.2 cannot be linted yet | [npm](https://www.npmjs.com/package/typescript/v/7.0.2) |
| `vite` | PWA | 8.3.8 | 2026-11-11 | ^20.19.0 || >=22.12.0 | MIT | USE | Build and dev server. Node ^20.19 or >=22.12 | [npm](https://www.npmjs.com/package/vite/v/8.3.8) |
| `vitest` | PWA | 5.1.1 | 2026-11-18 | ^22.12.0 || ^24.0.0 || >=26.0.0 | MIT | USE when sources become TypeScript | Today `node --test` is enough; Vitest adds TypeScript and browser-mode tests | [npm](https://www.npmjs.com/package/vitest/v/5.1.1) |
| `eslint` | PWA | 10.15.0 | 2026-11-13 | ^20.19.0 || ^22.13.0 || >=24 | MIT | USE (already in app/) | Flat config; baseline is clean | [npm](https://www.npmjs.com/package/eslint/v/10.15.0) |
| `typescript-eslint` | PWA | 8.74.0 | 2026-11-23 | ^18.18.0 || ^20.9.0 || >=21.1.0 | MIT | USE with TypeScript 6.0.x | Needed once sources are .ts | [npm](https://www.npmjs.com/package/typescript-eslint/v/8.74.0) |
| `playwright` | PWA | 1.65.1 | 2026-11-13 | >=20 | Apache-2.0 | USE (CI browser tests) | Already drives the audits | [npm](https://www.npmjs.com/package/playwright/v/1.65.1) |
| `axe-core` | PWA | 4.14.1 | 2026-11-16 | >=4 | MPL-2.0 | USE (already in app/) | Accessibility checks; MPL-2.0 licence, dev only | [npm](https://www.npmjs.com/package/axe-core/v/4.14.1) |
| `vite-plugin-pwa` | PWA | 2.0.0 | 2026-10-03 | >=20.19.0 | MIT | USE for the service worker and manifest | Peers: Vite up to ^8, workbox-build ^7.4.1 | [npm](https://www.npmjs.com/package/vite-plugin-pwa/v/2.0.0) |
| `workbox-build` | PWA | 7.4.1 | 2026-05-04 | >=20.0.0 | MIT | USE (via the plugin) | 4 moderate advisories in the dev tree (glob, minimatch); build-time only | [npm](https://www.npmjs.com/package/workbox-build/v/7.4.1) |
| `idb` | PWA | 8.0.4 | 2026-10-06 | none stated | ISC | USE if IndexedDB is adopted for the event log and cached packs | 1 KB wrapper; not needed while records fit one localStorage key | [npm](https://www.npmjs.com/package/idb/v/8.0.4) |
| `ajv` | PWA | 8.20.0 | 2026-04-24 | none stated | MIT | USE at build time (standalone validators) | JSON Schema stays the source of truth; keeps the runtime small | [npm](https://www.npmjs.com/package/ajv/v/8.20.0) |
| `zod` | PWA | 4.6.7 | 2026-10-12 | none stated | MIT | DO NOT ADD | A second schema language beside JSON Schema; no tested need | [npm](https://www.npmjs.com/package/zod/v/4.6.7) |
| `preact` | PWA | 11.2.0 | 2026-11-06 | none stated | MIT | WATCH, not adopted | Adopt only on the triggers in ADR-001; version 11.x at this date | [npm](https://www.npmjs.com/package/preact/v/11.2.0) |
| `@capacitor/core` | PWA+wrap | 8.6.2 | 2026-11-12 | none stated | MIT | DEFER | Wrapper for store distribution; decide after device evidence | [npm](https://www.npmjs.com/package/@capacitor/core/v/8.6.2) |
| `expo` | RN | 58.0.26 | 2026-11-17 | ^22.13.0 || ^24.3.0 || ^26.0.0 || >=27.0.0 | MIT | NOT CHOSEN | SDK 58; requires Node ^22.13 | [npm](https://www.npmjs.com/package/expo/v/58.0.26) |
| `react-native` | RN | 0.88.1 | 2026-10-27 | ^22.13.0 || ^24.3.0 || >= 26.0.0 | MIT | NOT CHOSEN | peerDependencies: react ^19.3.0 | [npm](https://www.npmjs.com/package/react-native/v/0.88.1) |
| `react` | RN | 19.3.1 | 2026-10-14 | >=0.10.0 | MIT | NOT CHOSEN |  | [npm](https://www.npmjs.com/package/react/v/19.3.1) |
| `react-native-reanimated` | RN | 4.8.0 | 2026-11-19 | none stated | MIT | NOT CHOSEN | peers: react-native 0.87 to 0.89, react-native-worklets 0.14.x | [npm](https://www.npmjs.com/package/react-native-reanimated/v/4.8.0) |
| `react-native-gesture-handler` | RN | 3.5.0 | 2026-11-05 | none stated | MIT | NOT CHOSEN |  | [npm](https://www.npmjs.com/package/react-native-gesture-handler/v/3.5.0) |
| `expo-sqlite` | RN | 58.0.18 | 2026-11-17 | none stated | MIT | NOT CHOSEN |  | [npm](https://www.npmjs.com/package/expo-sqlite/v/58.0.18) |
| `expo-router` | RN | 58.0.32 | 2026-11-17 | none stated | MIT | NOT CHOSEN |  | [npm](https://www.npmjs.com/package/expo-router/v/58.0.32) |

## Audit evidence, 2026-11-23

| Tree | Command | Result |
|---|---|---|
| Installed `app/` dev tree (typescript 6.0.3, eslint 10.15.0, @eslint/js, axe-core 4.14.1) | `npm audit` in `app/` | 0 vulnerabilities |
| Candidate PWA tree (vite, vite-plugin-pwa, vitest, typescript 6.0.3, idb, ajv), lockfile only | `npm i --package-lock-only --ignore-scripts ...` then `npm audit` in an empty folder | 4 moderate, 0 high, 0 critical: `vite-plugin-pwa` and `workbox-build` (direct and transitive), `glob` (AbortSignal cancellation bypass), `minimatch` (DoS via globparts). All are build-time tools; none is bundled into the shipped app. Revisit when workbox-build ships a fixed glob |
| Candidate Expo / React Native tree (expo, react-native, react, reanimated, gesture-handler, expo-sqlite, expo-router), lockfile only, `--legacy-peer-deps` | `npm i --package-lock-only --ignore-scripts --legacy-peer-deps ...` then `npm audit` in an empty folder | 3 moderate, 0 high, 0 critical; `expo` is flagged directly. Re-run on 2026-11-23 after an earlier unrecorded run. `--legacy-peer-deps` was needed to resolve the tree, itself a sign of the peer-range coupling in ADR-001 |

## What could not be verified

- expo.dev, reactnative.dev, MDN (website), web.dev and webkit.org were unreachable from this environment. Version, engines and peer information above comes from the npm registry; release facts from GitHub release pages; MDN storage statements from MDN's GitHub repository.
- Peer ranges quoted in prose (Reanimated against react-native 0.87 to 0.89; react-native against react ^19.3.0) come from registry metadata on the date above and can move within days.
- No package was built or run on a phone. "Decision" is a recommendation, not a test result.
