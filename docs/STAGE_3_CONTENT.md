# Stage 3: historical content architecture and first ten-case dossier

Status: complete, awaiting `APPROVE STAGE 3`. Nothing from Stage 4 has been started.

## What exists
| Artefact | Path |
|---|---|
| Pack data (single source of truth) | `tools/pack/pack_data.py` |
| Linter (rules D-019 as code) | `tools/pack/lint_pack.py` |
| Builder, schema | `tools/pack/build_pack.py`, `tools/pack/pack.schema.json` |
| Draft pack (schema-valid JSON) | `docs/pack/daily-pack-draft.json` |
| Ten case sheets, with sample player explanations | `docs/pack/CASE_SHEETS.md` |
| Bibliography (URL, locator, opened or not) | `docs/pack/BIBLIOGRAPHY.md` |
| Audits: verification, coverage and bias, clue leakage | `docs/pack/AUDITS.md` |
| Case 4 and case 7 connections, finale thesis | `docs/pack/CONNECTIONS.md` |
| 19-topic registry (10 finalists, 9 HOLD reserves) | `docs/pack/CANDIDATES.md` |
| Review book and screenshots | `docs/pack/case-sheets.html`, `docs/pack/review-book-*.png` |

Rebuild everything with `python3 tools/pack/build_pack.py`. Lint alone: `python3 tools/pack/lint_pack.py`.

## Case template
Two free "bound" clues ("By the end of that year, X had happened" or "had not yet happened") make C0, a 3 to 6 year candidate set. One free "relation" clue (calendar-year offset, or an era year) selects exactly the target. One or two paid clues (Nudge 1 Insight, Deep 2 Insight) each cut at least one year from C0. A uniqueness proof lists why every other candidate fails the relation.

## Results (computed)
- Lint: 0 errors, 0 warnings. C0 sizes 3, 6, 5, 5, 3, 3, 3, 6, 6, 3.
- Targets at V2: 2 of 10 (cases 6 and 10). Cases passing the full publication gate: 0 of 10. Clue fragments: 3 at V2, 43 at V1.
- Every case is solvable by arithmetic from free evidence alone. Paid Insight has no job in this pack as written (Q-32).
- Cases 6 and 10 share the answer 1977 (finale coincidence, a leakage risk).
- Anchor regions: Europe and North America supply 57% of the dated facts players see.

## What blocks publication
Second opened, independent source for eight targets and for most anchors. Blocked sites: Britannica, museum and national-history sites, UNESCO, USHMM. The environment refused an Internet Archive route. A human with a normal browser, or a widened network allowlist, closes this. Several exact figures are on HOLD (Han census totals, petition counts, the Golden Record language count).
