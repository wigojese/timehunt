# Simulation findings (not player data)

**Everything here comes from `app/scripts/strategy-lab.mjs` running on the draft pack. No person played. These numbers say how the rules machine and the pack behave. They say nothing about what players feel, understand or enjoy.** Raw output: `simulation-results.json`. Re-run: `cd app && node scripts/strategy-lab.mjs`.

## 1. A program that only reads the free text nearly always wins
A "parser" bot sees the same text a player sees. It applies the relation sentence ("one calendar year after ...") and locks that year. It buys nothing.

| Rules | Parser bot, solved of 10 | "Anchor plus one" habit | Pure chance | Best a non-reader can do with Insight |
|---|---:|---:|---:|---:|
| C1 default, relation visible | **9.20** | 7.20 | 2.57 | 4.87 |
| Relation sold as Deep clue | 2.57 | 2.57 | 2.57 | 5.87 |
| Per-case cap of 1 | 9.20 | 7.20 | 2.57 | 3.70 |

- The parser misses only case 3, whose relation refers to an anchor stated in another clue. Whether people manage that cross-reference is a test question.
- The "anchor plus one" habit solves 7 of 10 and fails cases 3, 6 (offset two) and 8 (offset four). Seven of ten relations use "one calendar year after". A player can learn the habit.
- With the relation visible, **buying Insight is dominated by reading**: the optimum for someone who does not read is 4.87, the reader gets about 9.2 for free. This is F-013 shown in the running game.
- With the relation sold as a Deep clue, Insight matters a lot (2.57 to 5.87), because the key link is the only thing that picks the year out. The cost is that the free dossier then leaves 3 to 6 candidates, so most guesses are near chance.

## 2. Buying order matters in 3 of 6 two-clue cases
With refund-on-redundant, buying the bigger clue first can make the smaller one free.

| Case | Cost to buy both, Nudge first | Deep first |
|---:|---:|---:|
| 1 | 3 | 2 |
| 2 | 3 | 2 |
| 6 | 3 | 2 |
| 4, 5, 10 | 3 | 3 |

In cases 1, 2 and 6 the Nudge removes a subset of what the Deep clue removes ("nested" clues). A player who learns this saves 1 Insight in each. The Stage 5 backlog proposes an authoring rule (D-033, now a lint warning) that bans nested pairs. The lint reports exactly these three.

## 3. Where Insight goes at the optimum
Exact dynamic programme on the real clue menus, 8 Insight, a player who guesses uniformly among the survivors:
- Default: Insight per case 2, 0, 0, 3, 0, 2, 0, 0, 0, 1. Front-loaded, as F-010 predicted. Cases 7 to 9 get nothing.
- Relation as Deep: 0, 2, 0, 2, 0, 0, 0, 2, 2, 0 (four key links).
- Cap of 1: 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, which is worth 3.70, 1.2 less than uncapped.

The "no refund" variant has the same optimum because an optimal player never buys a redundant clue.

## 4. Position of the answer among the candidates
Target position among the free-bound candidates: 3/3, 5/6, 2/5, 2/5, 2/3, 3/3, 2/3, 6/6, 3/6, 2/3. The answer is never the first candidate. It is the last in 3 of 10 cases. "Always lock the last" scores 3, "always lock the middle" 4, "always lock the first" 0. With 10 cases this is not a statistical result, but it is a pattern a player could pick up, and it comes from how the cases were authored (the relation always points forward from an anchor).

## 5. Reading load, as an estimate
The free text of the ten cases is 764 words, 72 to 83 per case. At 200 words per minute that is 3.8 minutes of pure reading for the day. Thinking, arithmetic and purchase decisions are **not measured**. The 6 to 12 minute session target (Q-24) remains an assumption until real timings exist. This estimate cannot say whether ten cases is overwhelming.

## 6. Exploit audit of the rules as built
| Candidate exploit | Result | Evidence |
|---|---|---|
| Reload to retry a Lock or recover Insight | Not possible. Every command is saved before it counts, and a finished day stays finished | `session.test.js` |
| Double tap to double-charge, or to get a clue free | Not possible. Action ids make repeats idempotent; a revealed clue cannot be bought again | `engine.test.js`, `session.test.js` |
| Probe the answer with refused Locks | Refused locks only name years the selector already shows as ruled out. If the selector hid that information, refusals would leak it (Q-38), so the display must stay or a ruled-out Lock must count as a miss | Reasoned from `engine.js`; not built as a variant |
| Edit saved state to gain Insight | Blocked for casual edits by the state digest. A person who reads the source can recompute the digest. This is a 56-bit non-cryptographic hash, so it protects against accidents, not a determined player | `session.test.js`, 8.5 trade-off |
| Read the answer from the pack file | Possible. The pack holds the answers. Offline play accepts this (8.5) | `data/daily-pack-draft.json` |
| Buy clues in a cheaper order | **Yes, in cases 1, 2 and 6** (section 2) | `strategy-lab.mjs` |
| Dominant strategy that beats careful play | **Yes in condition A**: read the relation, never spend (section 1) | `strategy-lab.mjs` |
