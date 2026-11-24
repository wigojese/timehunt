# Asset rights record

| File | Source | Tool and model | Date | Prompt and references | Owner and licence | Commercial use confirmed | Status |
|---|---|---|---|---|---|---|---|
| `app/assets/characters/guide-master.webp` and `guide-lantern-map.webp` (transparent cutout) | Supplied by the user | Not stated (the user supplied the file; a first version was also generated with a Canva image generator on 2026-11-24) | 2026-11-24 | Not recorded | **Unknown** | **No** | **BLOCKS RELEASE until filled in** |
| `app/assets/characters/guide-{idle,earlier,later,clue,discovery,uncertain,rest,back}.webp` (originals in `design/art-originals/characters/`) | Supplied by the user as `TIMEHUNT_Named_Art_Assets.zip` | OpenAI image generation, per the supplier README | 2026-11-24 | Prompts not recorded; the master squirrel was the reference | **Unknown** | **No** | **BLOCKS RELEASE** |
| `app/assets/scenes/home-hero.webp`, `banner-aqueduct.webp` (originals in `design/art-originals/scenes/`) | Same zip | Same | 2026-11-24 | Not recorded | **Unknown** | **No** | **BLOCKS RELEASE** |

Notes from the supplier: the two scenes were upscaled (hero from 1073x1466, banner from 2022x778) so they carry no extra detail; `guide-back` includes a small illustrated valley; `banner-aqueduct` includes the squirrel. The banner's squirrel is used on purpose in the case screens; do not draw the guide badge over it. Nothing has been checked for exact character consistency by a person, or for resemblance to existing artists' work.

## Second batch (`TIMEHUNT_Missing_Art_Assets.zip`, 2026-11-24)
Originals in `design/art-originals/` with the supplier's own notes (`README_missing_assets_from_supplier.md`, `ASSET_RIGHTS_from_supplier.md`).

| File | Origin (per supplier) | Owner and licence | Commercial use confirmed | Status |
|---|---|---|---|---|
| `scenes/banner-city`, `banner-coast`, `banner-desert`, `banner-mountain` | Four panels cropped from one generated art board, extended with programmatic watercolour layers. Not separate high-resolution generations | **Unknown** | **No** | **BLOCKS RELEASE** |
| `scenes/reveal-cloud-edge` | Procedurally rendered (Python/Pillow) | Supplier states no third-party content; not verified | **No** | Pending |
| `textures/paper-grain`, `map-green`, `stipple`, `case-frame-ornaments` | Procedurally rendered (Python/Pillow/NumPy/SciPy) | Supplier states no third-party content; not verified | **No** | Pending |

Reviewed by me on 2026-11-24: tiles checked for seams (wrap-around difference is no larger than normal pixel noise); cloud edge has a transparent top and an opaque bottom; ornaments are 98% transparent. The banners hold a thin illustrated strip with large colour washes above and below, so they are used as designed (strip on top, ribbon in the wash). No person has reviewed them.
