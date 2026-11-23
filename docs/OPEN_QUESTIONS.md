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
| Q-20 | ~~Is agent-verified V2 enough to publish?~~ **Answered yes** by the user (D-014). | closed | n/a |
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
| Q-22 | ~~Should Lock confirmation be batched?~~ **Evaluated:** no mechanical benefit (D-020). Only emotional pacing remains. | low | Stage 5 | 5 |
| Q-23 | Does TIMEHUNT need any streak or progress counter? Competitors use streaks. Ethical risk is streak loss pressure. | M | Test return without a streak | 5 |
| Q-24 | Target session length. The 6 to 12 minute figure in the revision document is an assumption. | M | Measure with a gray-box | 4, 5 |
| Q-25 | Competitor facts still unread: Chronophoto and TimeGuessr scoring, an official Wordle page, neal.fun, FTC and OECD pages (bot-blocked). | L | A human check, or a different route | 1 follow-up |

## Added in Stage 2
| ID | Question | Urg | How to settle | Owner stage |
|---|---|---|---|---|
| Q-26 | Is C1 (one Lock, no Trace) the Daily default, and does the user want Trace kept in the Daily at price 3? | H | User approval | 2 gate |
| Q-27 | Does Insight allocation become a real decision once players have reasoning skill and confidence? The model has no skill. | H | Think-aloud with 8 to 12 players | 5 |
| Q-28 | Per-case Insight cap of 1: adopt, or accept front-loading? | M | Gray-box with the cap as a switch | 4, 5 |
| Q-29 | Do real clue sets behave like the assumed windows? Re-run the solver on real packs. | H | Rerun `run_experiments.py` with real residual sizes and menus | 3 |
| Q-30 | Is the "uniqueness proof" authorable at ten cases a day, and by whom? | H | Stage 3 pilot | 3 |
| Q-31 | Whether a confidence declaration (L3) adds anything. Scoring-only, untestable by simulation. | L | Players | 5 |

## Added in Stage 3
| ID | Question | Urg | How to settle | Owner stage |
|---|---|---|---|---|
| Q-32 | Free evidence solves every case by arithmetic, so Insight is idle. Keep (cases are derivations, Insight is for hard days), hide the relation behind a paid tier, or weaken it to a range relation? | H | User decision, then re-run the Stage 2 solver on real ladders | 3 gate, 4 |
| Q-33 | Who opens the blocked sources (Britannica, museums, UNESCO, USHMM) to lift eight targets to V2? Or widen the network allowlist? | H | User | 3 gate |
| Q-34 | Everyday-life case is missing. Replace case 1 or case 10 with one? | M | User | 3 |
| Q-35 | Cases 6 and 10 share an answer. Keep the finale coincidence, and drop case 10's paid clue that restates case 6? | M | User | 3 |
| Q-36 | Case 4 uses period vocabulary for a queer-history institution. Who gives the named sensitivity review the agent cannot? | M | User | 3 |
| Q-37 | Paid ladders are thin (one clue in cases 3, 7, 8, 9). Each needs two or three real clues if Insight is to matter. | H | Author more clues | 3 revision or 4 |

## Added in Stage 4
| ID | Question | Urg | How to settle | Owner stage |
|---|---|---|---|---|
| Q-38 | Does greying out ruled-out years in the selector spoil the deduction? `rules.showRuledOut` exists but the gray-box does not yet toggle it. | M | Compare with and without in think-aloud play | 5 |
| Q-39 | Is `relationTier` free or deep? Same question as Q-32, now testable with the `?variant=deep` switch. | H | Players, 8 to 12 | 5 |
| Q-40 | Stage 5 needs real players. Who, how recruited, and where? The agent cannot run human sessions. | H | User | 4 gate |
| Q-41 | The pack still cannot ship (0 of 10 publishable). Is a gray-box playtest on a draft pack acceptable, with a visible draft banner? | M | User | 4 gate |

## Added in Stage 5
| ID | Question | Urg | How to settle | Owner stage |
|---|---|---|---|---|
| Q-42 | Incentive for participants, and budget | M | User | 5 follow-up |
| Q-43 | May the thresholds H1 to H9 in `PROTOCOL.md` stand, or do you want to change any before the first session? They are locked after that. | H | User | 5 gate |
| Q-44 | If ruled-out years are hidden, should a ruled-out Lock count as a miss? | M | User, then test | 5 follow-up |

## Added in Stage 6
| ID | Question | Urg | How to settle | Owner stage |
|---|---|---|---|---|
| Q-45 | Do you agree with Option I as the base, with Option III's evidence notes? Or do you prefer II or III? | H | User | 6 gate |
| Q-46 | The atlas is the weakest screen in all three options. Should Stage 8 or 9 own a real spatial atlas, and what should it show? | M | User | 8 or 9 |
| Q-47 | Does Option I's stacked rows replace the zoomable ruler for good? It breaks if a case ever has more than about 8 candidates. | M | Stage 7 design and pack rules | 7 |
| Q-48 | Real cleared images for reveals. Until they exist, reveals use drawings made from case data. Who sources and clears images? | M | User | 9 |
