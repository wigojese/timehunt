# STRATA 2.0 boards

Generated. See `docs/STAGE_6_ART_DIRECTION.md` for the reasoning and the critique.

```bash
cd docs/art/strata2
node build.mjs      # rebuilds board-*.html, brand-system.html, contrast-report.json and every PNG
```
Needs Node 22 and the pre-installed Playwright at `/opt/node22/lib/node_modules/playwright`. Fonts load from Google Fonts, so a network connection is needed to render with the real faces.

`data.mjs` reads `docs/pack/daily-pack-draft.json`; nothing on the boards is invented history. `DAY` in `data.mjs` is the Stage 4 scripted day and is illustrative.
