# Stage 11: complete polished vertical slice (progress log)

Status: **IN PROGRESS.** Not ready for `APPROVE STAGE 11`. This file records what is built and what is still missing against the Stage 11 list in `TIMEHUNT_MASTER_PROMPT.md`.

## Done so far (2026-11-24)
| Item | State | Evidence |
|---|---|---|
| Real illustrated art in the game: guide poses, home scene, per-case banners, textures | Built; rights NOT cleared (`docs/atlas/ASSET_RIGHTS.md`) | `docs/atlas/contact-sheet.png`, `banners-sheet.png` |
| Atlas look on the game, Motion and Reveal prototypes | Built | 78/78 UI, 60/60 motion, 72/72 reveal checks, 0 axe violations |
| Installable app: manifest, icons, `display: standalone` | Built; **install prompt not tried on a real phone** | `e2e-offline.mjs` |
| Offline play: versioned precache (47 files, 2.4 MB), network-first pack, update waits, kill switch | Built and tested in Chromium | `e2e-offline.mjs` 16/16 |
| Onboarding, Evidence, Lock, miss, solve, shared Insight, Practice, share text, settings, accessibility | Existing from Stages 4 to 7, restyled | `e2e-ui.mjs` |

## Still to do before the Stage 11 checkpoint
1. **Three connected cases as part of the ten-case trail** with the real shared bank and final state shape, and a feature flag to switch provisional economy variants without contradictory labels.
2. **One World Reveal story inside the game flow** (today the reveal prototype is a separate page).
3. **Share preview** screen (today the share is plain text on the finish screen).
4. **Sources and rights:** a source manifest for the slice.
5. **Real-phone test of one-hand play, install and offline** (needs a phone and a person; Q-53 to Q-56, Q-61).
6. **Deliverables:** code review, annotated interaction video, UI consistency audit, performance report (release build on a phone), decisions for the full ten-case build.
7. Rights for every art file (Q-70).

## Known limits
- Install and offline are proven in emulated Chromium only. iOS Safari behaviour (install, storage eviction) is unverified.
- Art is generated and partly upscaled; sharpness on large screens is untested.
- Service worker caching ignores query strings, so the `?v=` cache-busters on image URLs do nothing offline; the build id in the cache name is the real version.
