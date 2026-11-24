# TIMEHUNT — Missing illustration assets (2026-11-24)

Includes the previously missing four landscape banners, three repeatable textures, and the reveal cloud edge. One **optional** case-frame ornamental overlay is also included to make green case screens richer.

## File paths

- `app/assets/scenes/banner-city.webp` — 2340 × 900
- `app/assets/scenes/banner-coast.webp` — 2340 × 900
- `app/assets/scenes/banner-desert.webp` — 2340 × 900
- `app/assets/scenes/banner-mountain.webp` — 2340 × 900
- `app/assets/scenes/reveal-cloud-edge.webp` — 2340 × 600, transparent
- `app/assets/textures/paper-grain.webp` — 1024 × 1024, repeatable
- `app/assets/textures/map-green.webp` — 1024 × 1024, repeatable
- `app/assets/textures/stipple.webp` — 1024 × 1024, transparent/repeatable
- `app/assets/textures/case-frame-ornaments.webp` — 1170 × 1600, optional transparent overlay

## How to integrate

Copy `app/assets/` into your project repository root. Use the banner images as independent illustration backdrops, always overlay real, accessible text in components. Use a `background-repeat: repeat` style for the paper and map textures, ideally at 512–1024 px depending on display density. Keep actual headings and interactive buttons on solid cream surfaces rather than directly on detailed map lines.

For green case frames: (1) base `map-green.webp` with repeat tile; (2) optionally position `case-frame-ornaments.webp` in a `pointer-events: none` image layer above the frame background but below functional content; (3) place solid/near-solid cream UI panels on top. Do not use multiply blending on an already opaque atlas-green texture when it would darken or lower contrast.

For transitions: position `reveal-cloud-edge.webp` flush with the bottom edge of the historical illustration; its upper region is transparent and lower region is opaque cream, so the scene gradually flows into an editorial paper section. Avoid placing essential text behind cloud edges.

## Quality / provenance notes

The four banners are taken from a generated reference sheet and augmented to full intended pixel sizes; they are **not separately rendered originals at 2340 × 900**. Test their detail and sharpness at realistic phone size, and commission/regenerate from independent high-res compositions if exact original fine-line fidelity is required. The three procedural textures are genuinely seamless in their underlying periodic construction (minor individual stipple dots are naturally stochastic). The preview `docs/atlas/previews/green-case-frame-preview.jpg` is a proof of texture application, not an app screen implementation.

See `docs/atlas/ASSET_RIGHTS.md` for provenance and pending rights review. Historical settings are decorative archetypes only; do not treat the illustrated architecture or landscape as evidence that a named event took place there. The original timehunt case requirements remain in force.
