# Decision log

Status values: **FIXED** (user decision), **PROVISIONAL** (user-named but must be validated), **PROPOSED** (mine, needs approval), **FINDING** (evidence, not a decision).

| ID | Date | Decision | Status | Source / approval | Alternatives considered | Reversal condition |
|---|---|---|---|---|---|---|
| D-001 | 2026-11-22 | The daily challenge is ten distinct hidden-date cases | FIXED | Master prompt v2 section 1.2 | One year per day (superseded) | User changes it |
| D-002 | 2026-11-22 | One shared bank of eight Insight per daily expedition, no refill between cases | FIXED | Master prompt v2 section 1.2 | Insight per case (superseded) | User changes it |
| D-003 | 2026-11-22 | STRATA is the visual direction, Oxide & Bone the starting tokens | FIXED | Master prompt v2 sections 1.2, 5.4 | Route B navy, Route C grey dial (rejected) | User changes it |
| D-004 | 2026-11-22 | Evidence / Trace / Lock is the provisional grammar | PROVISIONAL | Master prompt v2 section 1.2 item 5 | Trace removed or capped; Evidence-first | Stage 2 economy results or playtests |
| D-005 | 2026-11-22 | A missed case reveals its answer and the day continues. No shared lives pool. | FIXED | Master prompt v2 sections 1.3, 2.5 | Shared two-error limit (rejected) | User changes it |
| D-006 | 2026-11-22 | The old scoring formula `1000 + 100 x Insight + 150 x Locks` is rejected | FIXED | Master prompt v2 section 1.3 | Keep with tuning | Never, unless user reopens |
| D-007 | 2026-11-22 | Paid clues must remove at least one currently possible year, otherwise they are free context | FIXED | Master prompt v2 section 1.3 | Sell any true clue | User changes it |
| D-008 | 2026-11-22 | Repo hygiene: keep existing prototypes under `docs/` as read-only references. No app scaffold before the Stage 10 architecture decision. One canonical rules module only, created when rules are approved. | PROPOSED | Stage 0 audit | Scaffold now (rejected: contradicts section 8.1 and the stage gates) | Stage 10 decision |
| D-009 | 2026-11-22 | Default dating convention: "by 31 December of the target year", stated on every clue. Any other convention is explicit per clue. | **FIXED** | User approved at the Stage 0 gate, 2026-11-22 | 1 January convention (used in my STRATA 1.5 satellite clue, now inconsistent) | User changes it |
| D-010 | 2026-11-22 | Earlier source documents are preserved in `docs/source-documents/` so context loss does not lose the reasoning | PROPOSED, approved with Stage 0 | Stage 0 audit | Leave only in chat uploads (fragile) | User prefers them out of the repo |
| D-011 | 2026-11-22 | The agent acts as the project's historical editor and verifies every factual claim. Every claim carries a **verification level**: V0 unverified, V1 a source page was opened and the date or figure matched, V2 two independent sources agree, V3 reviewed by a named human. **The agent can set V0 to V2 only. V3 needs a person.** Nothing marked V0 or "to confirm" ships. | FIXED as the working method; the release threshold is OPEN (Q-20) | User instruction at the Stage 0 gate, 2026-11-22. The V-levels are my proposal. | A human editor only (user declined to supply one). Agent verification presented as human sign-off (rejected: dishonest). | User supplies a human editor |
| D-012 | 2026-11-22 | The missing reference ZIP is not required. Work continues with the boards already in `visual-prototypes/`. | FIXED | User answer at the Stage 0 gate | Wait for the ZIP | User sends it |
| D-013 | 2026-11-22 | Stage 1 finding shapes Stage 2: about 95% of the information to solve ten cases must come from free dossiers, because 8 Insight spent on Trace buys at most about 4 of about 76.5 bits. Stage 2 must set how much uncertainty each case leaves, not only prices. | PROPOSED | `STAGE_1_RESEARCH.md` section 4 | Treat Insight as the main economy | Stage 2 results |

## Findings recorded in Stage 0 (evidence, not decisions)

| ID | Finding | Evidence |
|---|---|---|
| F-001 | The earlier "Trace-only wins 63 to 70%" result came from a simulation that included an undisclosed free opening card narrowing the range to about 17 years. Without it, Trace-only wins about 35.2%, matching the exact bound 11/31 (35.5%). | Reproduced; see `STAGE_0_AUDIT.md` section 4. Formal treatment is Stage 2. |
| F-002 | With Trace at 2 Insight and 10 Insight, pure binary search wins 100% with or without the free card. | `F(4,2) = 47 >= 31`, plus Monte Carlo. |
| F-003 | A wrong Lock removes that year, so it communicates one bit. | Code and UI check. |
| F-004 | None of the three fonts in the STRATA type system contains Georgian glyphs. Young Serif has no Cyrillic either. | Glyph coverage measured from the font files. |
| F-005 | The repo contains no motion or gesture code except one pointer handler in `convergence.html`. | Strict code search. |
