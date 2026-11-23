// Builds docs/architecture/DEPENDENCY_MATRIX.md from the npm registry at run time, so versions and dates are checked, not remembered.
// Usage: node tools/verify/dep-matrix.mjs   (needs network access to registry.npmjs.org)
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'architecture', 'DEPENDENCY_MATRIX.md');
// [package, stack, decision, why]
const ROWS = [
  ['typescript', 'PWA', 'USE 6.0.x, not 7', 'typescript-eslint 8.74.0 supports TypeScript below 6.1.0 only (peer range), so 7.0.2 cannot be linted yet'],
  ['vite', 'PWA', 'USE', 'Build and dev server. Node ^20.19 or >=22.12'],
  ['vitest', 'PWA', 'USE when sources become TypeScript', 'Today `node --test` is enough; Vitest adds TypeScript and browser-mode tests'],
  ['eslint', 'PWA', 'USE (already in app/)', 'Flat config; baseline is clean'],
  ['typescript-eslint', 'PWA', 'USE with TypeScript 6.0.x', 'Needed once sources are .ts'],
  ['playwright', 'PWA', 'USE (CI browser tests)', 'Already drives the audits'],
  ['axe-core', 'PWA', 'USE (already in app/)', 'Accessibility checks; MPL-2.0 licence, dev only'],
  ['vite-plugin-pwa', 'PWA', 'USE for the service worker and manifest', 'Peers: Vite up to ^8, workbox-build ^7.4.1'],
  ['workbox-build', 'PWA', 'USE (via the plugin)', '4 moderate advisories in the dev tree (glob, minimatch); build-time only'],
  ['idb', 'PWA', 'USE if IndexedDB is adopted for the event log and cached packs', '1 KB wrapper; not needed while records fit one localStorage key'],
  ['ajv', 'PWA', 'USE at build time (standalone validators)', 'JSON Schema stays the source of truth; keeps the runtime small'],
  ['zod', 'PWA', 'DO NOT ADD', 'A second schema language beside JSON Schema; no tested need'],
  ['preact', 'PWA', 'WATCH, not adopted', 'Adopt only on the triggers in ADR-001; version 11.x at this date'],
  ['@capacitor/core', 'PWA+wrap', 'DEFER', 'Wrapper for store distribution; decide after device evidence'],
  ['expo', 'RN', 'NOT CHOSEN', 'SDK 58; requires Node ^22.13'],
  ['react-native', 'RN', 'NOT CHOSEN', 'peerDependencies: react ^19.3.0'],
  ['react', 'RN', 'NOT CHOSEN', ''],
  ['react-native-reanimated', 'RN', 'NOT CHOSEN', 'peers: react-native 0.87 to 0.89, react-native-worklets 0.14.x'],
  ['react-native-gesture-handler', 'RN', 'NOT CHOSEN', ''],
  ['expo-sqlite', 'RN', 'NOT CHOSEN', ''],
  ['expo-router', 'RN', 'NOT CHOSEN', ''],
];
const q = (p, f) => JSON.parse(execFileSync('npm', ['view', p, '--json', ...f], { encoding: 'utf8', timeout: 60000 }));
const lines = ['# Dependency and version matrix', '', `Generated ${new Date().toISOString().slice(0, 10)} by \`tools/verify/dep-matrix.mjs\` from the npm registry. Versions and publish dates are queried, not remembered. Local runtime: Node ${process.version}.`, '', '| Package | Stack | Latest | Published | Node engines | Licence | Decision | Why | Verify |', '|---|---|---|---|---|---|---|---|---|'];
for (const [p, stack, dec, why] of ROWS) {
  try { const j = q(p, ['dist-tags', 'time', 'engines', 'license']); const v = j['dist-tags'].latest; lines.push(`| \`${p}\` | ${stack} | ${v} | ${(j.time[v] || '').slice(0, 10)} | ${(j.engines && j.engines.node) || 'none stated'} | ${j.license} | ${dec} | ${why} | [npm](https://www.npmjs.com/package/${p}/v/${v}) |`); }
  catch (e) { lines.push(`| \`${p}\` | ${stack} | lookup failed | | | | ${dec} | ${why} | |`); }
}
lines.push('', '## Audit evidence, 2026-11-23', '',
  '| Tree | Command | Result |', '|---|---|---|',
  '| Installed `app/` dev tree (typescript 6.0.3, eslint 10.15.0, @eslint/js, axe-core 4.14.1) | `npm audit` in `app/` | 0 vulnerabilities |',
  '| Candidate PWA tree (vite, vite-plugin-pwa, vitest, typescript 6.0.3, idb, ajv), lockfile only | `npm i --package-lock-only --ignore-scripts ...` then `npm audit` in an empty folder | 4 moderate, 0 high, 0 critical: `vite-plugin-pwa` and `workbox-build` (direct and transitive), `glob` (AbortSignal cancellation bypass), `minimatch` (DoS via globparts). All are build-time tools; none is bundled into the shipped app. Revisit when workbox-build ships a fixed glob |',
  '| Candidate Expo / React Native tree (expo, react-native, react, reanimated, gesture-handler, expo-sqlite, expo-router), lockfile only, `--legacy-peer-deps` | `npm i --package-lock-only --ignore-scripts --legacy-peer-deps ...` then `npm audit` in an empty folder | 3 moderate, 0 high, 0 critical; `expo` is flagged directly. Re-run on 2026-11-23 after an earlier unrecorded run. `--legacy-peer-deps` was needed to resolve the tree, itself a sign of the peer-range coupling in ADR-001 |',
  '',
  '## What could not be verified', '',
  '- expo.dev, reactnative.dev, MDN (website), web.dev and webkit.org were unreachable from this environment. Version, engines and peer information above comes from the npm registry; release facts from GitHub release pages; MDN storage statements from MDN\'s GitHub repository.',
  '- Peer ranges quoted in prose (Reanimated against react-native 0.87 to 0.89; react-native against react ^19.3.0) come from registry metadata on the date above and can move within days.',
  '- No package was built or run on a phone. "Decision" is a recommendation, not a test result.');
writeFileSync(OUT, lines.join('\n') + '\n'); console.log('wrote', OUT);
