# Open questions

Urgency: **H** blocks the next stage, **M** needed within two stages, **L** later.

## Rules (decide in Stage 2, validate in Stages 4 and 5)
| ID | Question | Urg | How to settle | Owner stage |
|---|---|---|---|---|
| Q-01 | Lock policy per case: one Lock (A), two Locks (B), or one Lock plus a bounded confidence declaration (C) | H | Enumerate and simulate, then real players | 2, 5 |
| Q-02 | Does Trace survive? Its cost, a per-case or per-day cap, or an Evidence-first mode without it | H | Compare variants with exact bounds and bot strategies | 2 |
| Q-03 | Prices for Nudge and Deep Clue, and how "marginal value" is computed and shown | H | Marginal-utility checks on real clue sets | 2, 3 |
| Q-04 | Free dossier definition. It must not be a hidden fourth action. Target: leaves a beginner 2 to 6 candidate years before any paid help. | H | Author ten cases, test with novices | 2, 3, 5 |
| Q-05 | Scoring: how solved cases, clean solves and leftover Insight are weighed, and how assisted and missed cases are labelled | H | Bots that maximise points vs bots that solve | 2 |
| Q-06 | Strictly sequential cases, or skip and return? Leakage and fairness trade-off | M | Prototype both | 2, 5 |
| Q-07 | Dating precision: exact year only, or year ranges for uncertain history | M | Editorial design with real contested cases | 3 |
| Q-08 | Per-clue dating convention. Proposed default is end of year (D-009). | M | Editorial review | 2, 3 |
| Q-09 | Daily reset: UTC or user-local, and how a shared daily is published offline | M | Product and engineering | 10 |

## Content
| ID | Question | Urg | Owner stage |
|---|---|---|---|
| Q-10 | ~~Who is the historical editor?~~ **Answered:** the agent verifies (D-011), a human may add V3 review later. Remaining: the exact process, which Stage 3 defines. | M | 3 |
| Q-20 | Is "agent-verified to V2" enough to publish, or must a human reach V3 before release? Master prompt section 4.8 expects editor sign-off. The agent cannot supply a human's accountability. | H | 3, 13 |
| Q-11 | Which sources can actually be read by this environment? Library of Congress, MoMA and Historic England block automated reads (Cloudflare). Claims from them need a human to confirm. | M | 3 |
| Q-12 | Rights for archival images and documents: who clears them? No archival facsimile may be faked. | M | 3, 9 |
| Q-13 | Concorde, Stonewall, Apollo, microprocessor and population claims in the prototype are unverified by me. The microprocessor card is marked "to confirm". | H | 3 |
| Q-14 | The Pan-African Cultural Festival (Algiers, 21 July to 1 August 1969) is a candidate non-US story. Dates come from search summaries, not opened primary pages. | M | 3 |

## Design and engineering
| ID | Question | Urg | Owner stage |
|---|---|---|---|
| Q-15 | Platform: PWA or native cross-platform. Not decided; needs current official documentation. | M | 10 |
| Q-16 | Georgian support. Neither Young Serif nor Sofia Sans has Georgian glyphs. Need a tested fallback (for example a Noto Georgian face) and a check that it matches the metrics. | M | 6 |
| Q-17 | Font delivery. The prototypes load fonts from Google's servers. A shipped app needs self-hosted files and the licence text. | M | 10 |
| Q-18 | ~~Missing `references/` ZIP.~~ **Closed:** user said continue without it (D-012). | closed | n/a |
| Q-19 | The daily answer must not ship in client-readable plaintext once there is a real daily. The prototype hard-codes the answer. | M | 10 |

## Added in Stage 1
| ID | Question | Urg | How to settle | Owner stage |
|---|---|---|---|---|
| Q-21 | How much uncertainty should each free dossier leave, and should it vary by case? Arithmetic says the dossier supplies about 95% of the information (D-013). | H | Author real cases, measure candidates left for novices | 2, 3 |
| Q-22 | Should Lock confirmation be batched, as Return of the Obra Dinn confirms fates in sets of three, instead of per case? It would defeat brute force but delay feedback. | M | Evaluate as an extra variant in Stage 2 | 2 |
| Q-23 | Does TIMEHUNT need any streak or progress counter? Competitors use streaks. Ethical risk is streak loss pressure. | M | Test return without a streak | 5 |
| Q-24 | Target session length. The 6 to 12 minute figure in the revision document is an assumption. | M | Measure with a gray-box | 4, 5 |
| Q-25 | Competitor facts still unread: Chronophoto and TimeGuessr scoring, an official Wordle page, neal.fun, FTC and OECD pages (bot-blocked). | L | A human check, or a different route | 1 follow-up |
