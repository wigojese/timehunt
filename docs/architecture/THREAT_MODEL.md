# Threat model (Stage 10)

Scope: a single-player, offline-capable daily puzzle with no accounts, no server-side state and no payments. Written by the agent; **not reviewed by a security professional**. Statements marked *tested* have an automated test in this repository; *reasoned* means argued from the design only.

## 1. What we protect, in order

1. **The player's saved progress** (integrity and availability). Losing a solved case is the worst everyday failure.
2. **Historical accuracy and provenance.** A wrong or unsourced clue is a harm to trust, and an unverified clue must not reach a published pack.
3. **The surprise.** Answers should not leak through the UI, the share text or the shipped files more than the design accepts.
4. **Player privacy.** The product should need no personal data.
5. **The deployment pipeline** (so no one can ship a pack or build in our name).

Fairness of a leaderboard is **not** a protected asset in v1, because there is no leaderboard. If one is ever added, section 4 reopens.

## 2. Actors

| Actor | Capability | Motivation |
|---|---|---|
| Curious player | Browser dev tools, view source | Peek at the answer |
| Cheater | Edits stored state, replays or scripts the app | Better score or streak |
| Careless self | Clears site data, switches browser, offline for days | None; this is the common case |
| Malicious content or dependency | Poisoned pack file or npm package | Run code, change history, track players |
| Compromised CI or maintainer account | Push to main, change workflows | Ship tampered builds |
| Network attacker | Controls a Wi-Fi hotspot | Alter or read downloads |

## 3. Cheating and offline: the explicit trade-off

The design chooses **offline-first with the day's pack on the device**. Consequences, stated plainly:

| Option | What it buys | What it costs | Chosen? |
|---|---|---|---|
| A. Pack on device, engine on device (**current**) | Plays offline, instant, no server cost, no account, works on a train | A player can read the answers from the downloaded file or dev tools; a player can edit local state | **Yes, for v1** |
| B. Obfuscate or encrypt the target in the pack | Hides answers from casual view-source | Only casual protection (the key must ship with the app); adds complexity and failure modes | No: false assurance |
| C. Server reveals answers only on Lock | Real secrecy per case | Needs connectivity at every Lock; server, uptime and abuse handling; kills offline | No for v1; a possible later mode if a leaderboard appears |
| D. Server-verified score | Leaderboard integrity | Server, accounts or tokens, privacy duties | No |

Why A is acceptable here: scores are personal (a private streak and a shareable text, not a ranking); a cheat harms only the cheater's own enjoyment; and the spoilers a casual player meets are the share text and the UI, which `publicView` and the spoiler-safe share format control.

What we do anyway (cheap, honest):

- `publicView` never returns the target or unrevealed clue text before a case resolves (*tested*, `engine.test.js`). This protects against UI bugs and screenshots, **not** against someone reading the pack file.
- The share text contains no years or event names (*tested*; the format was reviewed in Stage 7).
- The state digest detects **accidental** corruption. It is a non-cryptographic hash (cyrb53) over data the user controls, so it does **not** stop deliberate editing: anyone can edit the state and recompute the digest (*reasoned*). We do not call it tamper-proof anywhere.
- Rules arithmetic is re-derived by `transition` from content, not trusted from the record, so editing the Insight number in a saved record is accepted only if the record also passes the digest check; a self-edited record is possible and is treated as the player's own business (*reasoned*).

Accepted: a player can find every answer in the pack file in under a minute. If answer secrecy becomes a product requirement (for example a competitive mode), the answer is option C, designed then, not retrofitted.

## 4. Threats and mitigations

| Id | Threat | Likelihood / impact | Mitigation now | Residual risk |
|---|---|---|---|---|
| T-01 | Browser evicts or clears local data; progress lost | Medium / High | One-record atomic writes; held-not-deleted corrupt records; (specified) persistent-storage request and export code | Real loss still possible; **not tested on iOS** |
| T-02 | Crash or power loss mid-write | Low / Medium | Single `setItem`; re-read after a write exception (*tested* with fault injection) | None known |
| T-03 | Double tap or replayed command charges twice | Medium / Medium | `actionId` idempotence; refused commands return the same state (*tested*) | None known |
| T-04 | Stored state edited to cheat | Medium / Low | None beyond the digest; accepted (section 3) | Accepted |
| T-05 | Answers read from pack or dev tools | High / Low | Accepted for v1 (section 3) | Accepted |
| T-06 | Wrong historical claim published | Medium / High | Verification levels computed from opened sources; V2 required to publish; `DRAFT_NOT_PUBLISHABLE` refuses play; 47 claims re-checked by script; sensitive-topic review | Single-source V1 claims remain; **no named human reviewer** |
| T-07 | Source page changes or disappears | High / Medium | Retrieved dates; weekly claim-check workflow (written, not run) | Needs maintenance |
| T-08 | Poisoned pack file served from CDN | Low / High | `validatePack` rejects structure and rule violations; digest in manifest (**specified**); signed manifest (**optional**, only when packs are fetched remotely) | A valid-looking but false pack passes validation: provenance review is the control |
| T-09 | Malicious or compromised npm package | Low-Medium / High | No runtime dependencies today; lockfile; `npm ci --ignore-scripts` in CI; Dependabot; audit; pin versions; review any new runtime dependency (policy below) | Dev-tree transitive packages are trusted |
| T-10 | CI compromise or secret leak | Low / High | CI has `contents: read` only; no secrets exist; actions to be pinned by SHA before release (policy) | Actions currently tagged by major version |
| T-11 | XSS or script injection through pack text | Low / High | The game, motion and reveal views escape pack text before it enters HTML. `tools/verify/xss-probe.mjs` injects an `<img onerror>` and `<script>` payload into 585 free-text fields, clicks through each page, and fails on any execution: **no injection on the game, game+debug or motion pages (payload shown as inert text)**. The reveal page never displayed pack text in that run, so for reveal the probe proves nothing (its story text lives in code, not the pack). **Found and fixed during Stage 10:** the motion and reveal prototypes did not validate the pack, so a `javascript:` source URL would have become a clickable link; both now allow only `http(s)` links, and `validatePack` rejects other schemes (new test) | The gray-box builds HTML by string templates, so one future unescaped field reintroduces the risk. A Content Security Policy (no inline script, `object-src 'none'`) is **specified, not built**; it needs the Vite build in Stage 11 |
| T-12 | Tracking and privacy leaks | Low / Medium | No analytics, accounts or cookies in the code. Network calls found by search: only `fetch` of the pack JSON (`app.js`, `motion`, `reveal`). Outbound source links use `target="_blank" rel="noopener"` (modern browsers imply `noreferrer` for `noopener`; I did not test the Referer header) | Any future telemetry must be opt-in and documented. Hosting logs will see IP addresses; that depends on the host chosen in Stage 15 |
| T-13 | Network attacker alters downloads | Low / Medium | HTTPS only on hosting; service worker only on HTTPS origins | Depends on hosting configuration, not yet chosen |
| T-14 | Service worker serves a stale or broken app forever | Medium / High | Versioned caches, skip-waiting policy and a kill-switch route (**specified**; not built) | Real risk until built and tested |
| T-15 | Time and timezone abuse (change the device clock to replay a day) | Medium / Low | Day identity is the pack id, not the clock; clock rules are a Stage 12 decision | Open question |
| T-16 | Content rights or privacy claims about named people | Medium / Medium | Rights manifest; sensitive-topic edits (Stage 9); no personal data about living people beyond documented public records | Needs a rights review |

T-11 and T-12 were checked against the code on 2026-11-23 (results in the rows). Neither check is a security audit: the probe covers pack text only, not every input, and I did not run a dependency-level or browser-extension analysis.

## 5. Privacy position (v1)

- No accounts, no analytics, no advertising identifiers, no cookies set by us.
- Saved progress lives on the device only.
- Outbound requests: fetching the app and the day's pack from our host; source links are opened by the player's explicit tap.
- Before launch (Stage 15): a privacy statement, an age and content review, and a decision on crash reporting. Crash or error reporting, if added, must strip content, use no identifiers and be opt-in unless counsel says otherwise.

## 6. Review cadence

Re-read this document at the start of Stage 11, Stage 12 (fetching packs) and Stage 15 (launch), and whenever a trigger in ADR-001 fires. Add a row for every new network call, storage location or dependency.
