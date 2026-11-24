# TIMEHUNT — Generated Art Asset Pack

This archive contains **10 generated illustrations** from the last generation batch, renamed to match the exact paths in your art-asset brief. They are WebP files under `app/assets/`, ready to copy into the application repository.

## Included

| Destination path | Generated image source | Export dimensions |
|---|---|---|
| `app/assets/characters/guide-idle.webp` | `squirrel_guide_with_satchel_and_lantern.png` | 1122×1402 |
| `app/assets/characters/guide-earlier.webp` | `thoughtful_squirrel_with_map_and_hourglass.png` | 1122×1402 |
| `app/assets/characters/guide-later.webp` | `thoughtful_squirrel_cartographer.png` | 1122×1402 |
| `app/assets/characters/guide-clue.webp` | `curious_squirrel_s_map_discovery.png` | 1122×1402 |
| `app/assets/characters/guide-discovery.webp` | `squirrel_explorer_with_lantern_and_map.png` | 1122×1402 |
| `app/assets/characters/guide-uncertain.webp` | `puzzled_squirrel_comparing_notes.png` | 1122×1402 |
| `app/assets/characters/guide-rest.webp` | `sleeping_squirrel_on_a_mossy_rock.png` | 1122×1402 |
| `app/assets/characters/guide-back.webp` | `squirrel_explorer_over_the_valley.png` | 1122×1402 |
| `app/assets/scenes/home-hero.webp` | `armillary_sphere_under_moonlit_arch.png` | 1170×1600 |
| `app/assets/scenes/banner-aqueduct.webp` | `lantern_squirrel_over_the_valley.png` | 2340×900 |

## Important quality notes

- All eight squirrel images are transparency-preserving WebP cutouts. The original generation was 1122×1402, exceeding the requested 1080×1350 minimum.
- The portrait hero has been upscaled from 1073×1466 to 1170×1600, and the wide aqueduct banner from 2022×778 to 2340×900. Upscaling meets dimensions but does not create new illustration detail.
- **Review before shipping:** `guide-back.webp` includes a little illustrated valley beyond the squirrel, so it is not a strictly character-only cutout; `banner-aqueduct.webp` includes the squirrel on the left although the requested prompt was environment-only. Regenerate or retouch these two if clean separation is essential.
- These are concept assets, not yet independently checked for exact character consistency, color/edge artefacts, or mobile optimization.
- Not included because they have not been generated: `banner-city.webp`, `banner-coast.webp`, `banner-desert.webp`, `banner-mountain.webp`, `reveal-cloud-edge.webp`, and the three textures (`paper-grain.webp`, `map-green.webp`, `stipple.webp`). No historically specific reveal vignettes were generated.
- Before publication, create/update the required `docs/atlas/ASSET_RIGHTS.md` provenance and licensing audit. The tool used for these assets was OpenAI image generation on 2026-11-24; the precise prompts and rights terms should be recorded and independently checked. No guarantee of copyright ownership or commercial-use eligibility is asserted here.

## How to install

Unzip the archive at your repository root (not inside an existing `app/` directory), so the files appear at `app/assets/characters/guide-idle.webp`, etc. Point your UI code to these paths rather than displaying complete prototype board images as backgrounds for interactive screens.
