# Art asset pack: what to supply and how to prompt for it

The squirrel you supplied (`app/assets/characters/guide-master.webp`) is the **style lock**. It is a fine-ink and watercolour natural-history illustration: warm paper, pencil stipple, brass, rust, moss. Every other asset must look like it was drawn by the same hand. Attach it as a reference image to every prompt below.

**Style lock sentence (paste into every prompt):**
> Match the attached squirrel illustration exactly in style: fine dark-brown ink linework with varied line weight, pencil stippling and hatching, soft watercolour washes, warm cream paper, palette of cream, moss and sage green, teal, brass gold and burnt rust. Vintage atlas and natural-history print feel. No 3D, no gloss, no neon, no text, no border, no watermark.

**Background rule:** plain flat paper colour `#F9F0DF` (the squirrel's own background), so the art can sit on the app's paper surfaces by multiply blending. If your tool can export transparent PNG cutouts, supply those too. Full-bleed scenes need no special background.

**Delivery:** drop files in `app/assets/<folder>/` with the names below, at least the stated width, PNG or WebP. Tell me when they are in and I wire them up. Keep a note of the tool, date and prompt for each file (rights record, see below).

## Status (2026-11-24)
Received and in use: eight poses, `home-hero`, `banner-aqueduct`, `banner-city`, `banner-coast`, `banner-desert`, `banner-mountain`, `reveal-cloud-edge` (installed, not yet placed), `paper-grain`, `map-green`, `stipple`, `case-frame-ornaments`. Still needed for the full set: a banner or scene per remaining place type if cases need them (each case currently maps to one of five landscapes, see D-086), and the research-backed reveal vignettes. Better quality would come from separate full-height banner compositions at 2340 x 900 instead of crops of a board.

## 1. Character poses (same squirrel, same scarf, satchel, tail, eye) — `app/assets/characters/`
Size: 1080 x 1350. Use the master as reference and say "same character, new pose".
| File | Prompt (after the style lock) |
|---|---|
| `guide-idle.webp` | Same squirrel, sitting calmly on the mossy rock in profile, looking to the right toward something in the distance, paws resting on the satchel, lantern unlit hanging from the satchel strap. |
| `guide-earlier.webp` | Same squirrel standing, one paw pointing left, head turned left, thoughtful, map tucked under the other arm. |
| `guide-later.webp` | Mirror of the above: pointing right, head turned right. |
| `guide-clue.webp` | Same squirrel pulling a small paper fragment from the satchel, looking at it with interest. |
| `guide-discovery.webp` | Same squirrel holding the brass lantern high, warm gold glow, delighted but calm expression. |
| `guide-uncertain.webp` | Same squirrel holding two small notes side by side, head tilted, curious and unsure. |
| `guide-rest.webp` | Same squirrel curled up sleeping on the rock with the tail around it, scarf loose, map folded beside it. |
| `guide-back.webp` | Same squirrel seen from behind, looking out over a valley, satchel and scarf visible. |

## 2. Scenes — `app/assets/scenes/` (portrait, 1170 x 1600 unless noted)
| File | Prompt (after the style lock) |
|---|---|
| `home-hero.webp` | A tall arched night-sky window in an ink-and-watercolour landscape: deep blue sky with gold stars and moon phases, a large brass armillary sphere with a ringed orbit standing on a stepped stone path that recedes toward it, flags on poles, rolling hills with a distant hilltop town and a Roman aqueduct, leafy trees and white flowers framing both sides. Leave the lower third calm for a button. No text. |
| `banner-aqueduct.webp` (2340 x 900) | Wide pastoral landscape: sky with soft clouds, a long stone aqueduct across green valley hills, round trees, a winding river. Calm, low detail near the top and bottom edges so a ribbon label can sit over it. |
| `banner-city.webp` (2340 x 900) | Wide hilltop town with terracotta roofs, a domed church, cypress trees and a stone bridge over a river. |
| `banner-coast.webp` (2340 x 900) | Wide harbour coast with old sailing ships, cliffs and a lighthouse. |
| `banner-desert.webp` (2340 x 900) | Wide dry landscape with a river, palms, and distant stone monuments. Avoid any real monument that is not tied to the case. |
| `banner-mountain.webp` (2340 x 900) | Wide mountain valley with a mule path and a small bridge. |
| `reveal-cloud-edge.webp` (2340 x 600) | A soft painted cloud bank edge, cream on transparent, to blend a scene into paper. |

## 3. Textures — `app/assets/textures/` (tileable, 1024 x 1024)
| File | Prompt |
|---|---|
| `paper-grain.webp` | Seamless tileable cream handmade paper, fine fibres, very subtle, almost flat, no stains. |
| `map-green.webp` | Seamless tileable muted atlas-green paper with faint sage contour lines and gentle watercolour variation, low contrast so text on cream cards stays readable. |
| `stipple.webp` | Seamless tileable fine pencil stipple on transparent, low density. |

## 4. Reveal vignettes (later, **research-backed only**) — `app/assets/reveal/<case>/`
Each vignette depicts a *real* sourced thing for one case (for example the Rosetta Stone, a smallpox ward poster, a Manila galleon). They must not be invented from prompts alone. Per vignette I need: the source link, what the picture shows, what is symbolic. Do not supply any until the case's sources are agreed; I will give a per-case brief.

## Rights record (required)
For every asset keep: file name, tool and model, date, the exact prompt, the reference images used, who owns the output under the tool's terms, and whether commercial use is allowed. **Check the terms before shipping.** Output from image generators may have unclear ownership, may not be copyrightable in some places, and can resemble existing artists' work. I will add a `docs/atlas/ASSET_RIGHTS.md` table and block a release if a row is empty. The master squirrel's row is empty today.

## Consistency tips
Generate each pose several times and keep the best; check ears, eye, scarf colour and satchel buckles against the master. If a pose drifts, regenerate with the master attached and "same character, do not change the face, scarf or satchel". An illustrator can later redraw anything that cannot be matched.
