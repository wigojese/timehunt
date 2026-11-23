# Stage 7: responsive information architecture and accessible game UI

Status: complete, awaiting `APPROVE STAGE 7`. Nothing from Stage 8 has been started.

**What this is.** The Stage 4 gray-box UI is replaced by a working, interactive mid-fidelity UI built on the STRATA Option I direction (D-038). It runs on the same engine and store; only `app/src/ui/`, `app/index.html` and `app/ui.css` changed, plus a strings module. It is plain HTML and CSS, no framework. Run it: `cd app && node scripts/serve.mjs`.

**What it is not.** It is not tested with people, a real phone, VoiceOver or TalkBack. Everything measured below was measured in headless Chromium with Playwright and axe-core. It has no motion, no Georgian, and no real World Reveal.

## 1. Information architecture
```
First run  ->  Onboarding (3 steps, skippable)
                  |
Today (Daily Trail) --- Start / Continue case n
   |                        |
   |                  Dossier (question, numbered notes, sources)
   |                        |  [Choose a year]
   |                  Case hunt (years as layers, Lock)  <-> Evidence (notes, extra clues, Trace variant)
   |                        |  [Lock] -> confirm
   |                  Result (answer, why, sources)  --> World Reveal entry (prototype) -> Back
   |                        |  [Next case]
   |                  ... case 10 ...
   |                        |
   +----------------- Ten-case finish (score, years, share) --> World Reveal list (prototype)
Practice (pick or seed)   Archive (finished days)   Settings (text size, motion, confirm, language, delete)
Bottom nav on Today, Practice, Archive, Settings. Inside a case, the bottom bar holds the actions and there is no nav.
```
Routes: `onboarding`, `trail`, `play` (dossier, hunt, evidence, result), `finish`, `reveal`, `practice`, `archive`, `settings`, `held`, `error`. Browser Back works; every screen also has an on-screen Back or Next.

## 2. Screens, as built
Annotated sheets: `docs/ui/flow-1-play-loop.png` (the loop, 12 screens), `flow-2-states.png` (8 states), `flow-3-secondary.png` (Practice, Archive, Settings, Trace, World Reveal list), `flow-4-responsive.png` (320 to 1024 px), `flow-5-textsize-pseudo.png` (100 to 200% text and pseudo-locale). Individual screens: `docs/ui/screens/`. Accessibility trees as the browser exposes them: `docs/ui/aria/*.txt`.

## 3. Decisions
**Primary year selector: stacked layers (D-043).** A native radio group styled as full-width 56 px rows, one per possible year, with the labelled hatch bands for years ruled out by free evidence and stipple rows for years ruled out by a bought clue. Reasons: only 3 to 6 years are ever possible (D-019), so no ruler is needed; native radios give arrow-key movement, a screen-reader group name and a visible state for free; each year is a large target; nothing is chart-overprinted.
**Precision alternative: "Type a year instead" (D-044).** A disclosure with a text field that accepts `1920`, `2 CE` or `5 BCE`, tells you when a year is not in play or is ruled out, and selects the matching layer. It is the non-visual and non-pointer path for any selector, and the path to build on if a pack ever has more than about 8 candidates (not tested at that size, because the validator refuses it).
**No gesture is required anywhere (D-045).** There is no swipe, pinch, drag or long press. Every action is a button, radio, checkbox, disclosure or link. The whole case loop was run with the keyboard alone in the e2e.
**Lock is always confirmed; spending is confirmed by default (D-046).** A dialog says what will happen in words, focuses "Keep choosing" or "Cancel" first, and closes on Escape. Settings can turn off the spending confirmation. The Lock confirmation stays on because a Lock is the one irreversible choice. This adds a tap to every Lock; whether it feels protective or tedious is a Stage 5 question.
**Reading stays on the main path (D-047).** Notes are numbered serif text (borrowed from Option III), in the dossier, in a "Re-read the notes" disclosure on the hunt screen, and on the Evidence sheet.
**Lining figures (D-048).** Young Serif's default numerals are old-style, so 1900 reads as "19oo" and a score of 0 reads as "o". The UI forces lining figures everywhere and tabular lining figures on every year.

## 4. Component inventory (the build list)
| Component | Used on | Notes |
|---|---|---|
| HUD: label, bank pegs (decorative), text "Insight n of N" | every case screen, trail, finish | Pegs are `aria-hidden`; text carries the value |
| Day strip, ten segments, shape-coded | trail, case screens, finish | One `img` with a spoken summary: "3 solved, 1 missed, 6 still to come. Now on case 4." |
| Numbered notes | dossier, hunt (disclosure), evidence | Serif 17 px, lining figures |
| Year stack (radio layers and bands) | hunt | See section 3 |
| Precise year entry | hunt | Disclosure, text input, message region |
| Clue row | evidence | Category and tier on the left, price on the button, reason when disabled |
| Confirm dialog | Lock, spend, delete | Native `dialog`, focus trap and Escape for free |
| Result card | result | Year, event, why not the others, reveal text |
| Source disclosure | dossier, evidence, result, reveal | Publisher, title, "Opened by the editor" or "Not opened" as words |
| Bottom action bar | every screen with an action | Sticky, 1 or 2 buttons, stacks at large text |
| Bottom nav | trail, practice, archive, settings | 4 tabs, `aria-current` |
| Banner | all | Draft pack, offline, unsaved, resume (cleared after the first action) |
| Settings controls | settings | Text size (4), reduce motion, confirm spend, language, delete |
Not built: share sheet beyond Copy, any chart or atlas beyond a list with recency bars, any animation.

## 5. State inventory
| State | Where shown | Checked |
|---|---|---|
| Loading | first paint | busy region and heading; ends |
| Resume | trail banner and "Continue case n" | reload mid-case keeps Insight and case; banner clears on first action |
| Zero Insight | evidence, HUD | all clue buttons disabled with a stated reason; reading and locking stay free |
| Missed case | result | "Missed", the answer, why, "A miss never ends your day" |
| Solved with help or clean | result, strip, finish | by shape and by word |
| No network | banner | play continues; sources note |
| Save failed | evidence | "Could not save. Nothing was charged." Insight unchanged, retry charges once |
| Held save (corrupt or changed) | held | one explicit action, old record backed up |
| Invalid pack | error | refused with codes, no nav, nothing saved |
| Practice finished | practice | returns to the list; daily untouched |
| Empty archive | archive | says what to do |

## 6. Measured results (headless Chromium, `docs/ui/e2e-report.json`)
| Check | Result |
|---|---|
| End-to-end assertions | **78 of 78** pass |
| axe-core (WCAG 2.0, 2.1, 2.2 A and AA, plus best practice) on 33 screens | **1 finding**, 0 on 32 screens. The one: "target size: partially obscured" on a Practice list row that sits under the sticky bar and nav at scroll position 0. It clears when scrolled; `scroll-padding-bottom` keeps focused items out from behind the bar. I left it, because moving the primary action out of the thumb zone would be worse. |
| axe colour-contrast on the real screens | passes on every screen audited |
| Tap targets under 44 CSS px | **0** (links in source lists were 19 px; fixed) |
| One-hand reach: primary action position | **30 of 30** primary buttons sit in the bottom 45% of the viewport (a thumb-zone assumption, not a hand study) |
| Horizontal scroll at 320, 360, 390, 430, 768, 1024 px | **none** |
| Text size 130, 160 and 200% | no horizontal scroll, nothing clipped, Lock still reachable; action buttons stack |
| Pseudo-locale (+40% length, accented) | no horizontal scroll, nothing clipped at 360 px on trail, hunt and evidence |
| Rendered text below 14 px | **none** on trail, dossier, hunt, evidence, result |
| Tabular numerals on years | yes |
| Keyboard | skip link first; Enter and Space work; arrow keys move the year; the dialog traps focus and Escape closes it and returns focus; typed-year path works |
| Wrong taps | Lock with nothing chosen: message, no dialog; cancel spends nothing; Escape cancels a Lock |
| Study mode | 8 of 8 (`scripts/study-smoke.mjs`) |
| Engine tests | 71 of 71 |

## 7. Accessibility findings, by what I fixed
1. The notices banner sat outside any landmark. Now an `aside` named "Notices".
2. Links in source lists were 19 px tall. Now 44 px.
3. The sticky action bar and the bottom nav overlapped, hiding the "How it works" button. The bar now sits above the nav.
4. At 200% text the HUD, pegs and year rows overflowed to 477 px wide. Pegs are capped in pixels, the HUD and year rows wrap.
5. The day strip was ten list items read aloud before every question. It is now one spoken summary.
6. The pegs duplicated the text. They are now decorative.
7. Programmatic focus on the page title drew a ring on every load. Focus now moves only after navigation, and the ring shows for keyboard users only.
8. The "welcome back" banner stayed on every later screen. It now clears after the first action.
9. The sticky bar covered the keyboard-focused control. `scroll-padding-bottom` added.
10. The first loading state had no heading. It does now.

**Not done, and I will not claim:** VoiceOver, TalkBack, Switch Control, voice control, high-contrast and forced-colours rendering on a device, real reduced-motion behaviour (there is almost no motion to reduce), RTL, any real second language, the Dynamic Type of iOS. Automated tools find a fraction of real problems; the aria snapshots give a good reading order but are not a screen-reader test.

## 8. Candid critique (subjective, mine; no one else has seen this)
| Lens | Score of 10 | Why |
|---|---:|---|
| Next action is obvious | 8 | One red button per screen, at the bottom; verified by position and label, not by watching a person |
| Case count, shared resource and possible years visible without a legend | 8 | "Case 4 of 10", "Insight 6 of 8", "5 possible years" and the listed years are on the case screens; the pegs and strip are redundant by design |
| One-hand reach | 8 | Measured geometrically; a stacked bar plus nav uses about 130 px, which is a lot on a 568 px phone (not tested at that height) |
| Reading comfort | 8 | Serif notes at 17 px and lining figures are good |
| Robustness to large text and long copy | 8 | Tested to 200% and +40%; real translations will differ |
| Visual character | 5 | It is calm and plain. The layered stack and hatch bands carry STRATA, little else does |
| Delight | 3 | No motion, no sound, no moment of solve beyond a card |
| Friction | 6 | Every Lock needs two taps and every spend two, by default |
Weaknesses, plainly:
- **Confirm fatigue is a real risk.** I added friction on the evidence that wrong taps happen, but I have no evidence of how often. The reveal confirmation can be switched off; the Lock one cannot.
- **The three-view case (dossier, hunt, evidence) costs taps.** Reading and choosing are separate screens, and the notes disclosure on the hunt screen is the shortcut. Whether people flip back and forth a lot is only knowable from play.
- **The solve is a card, not a moment.** The Stage 6 split-to-soot animation does not exist yet.
- **The finish list is the weakest screen**, as predicted in Stage 6. Recency bars are decoration.
- **The Practice list names every case's lens**, which spoils topics. Fine for a prototype, not for a product.
- **World Reveal is a text list.** It proves the entry and return path only.
- **The draft banner is always on.** It is honest and it is noise.

## 9. Pass criteria, stated carefully
- *A new player can identify the next action, case count, shared resource and possible years without reading a legend.* True by construction and by measured text on the trail, dossier, hunt and result screens; **not tested with a new player.**
- *Every key action has a non-gesture path.* True: there are no gestures. Keyboard and screen-reader trees checked in Chromium; no assistive technology tested.

## 10. Build list for what follows
1. Replace the finish list with the real atlas (Stage 8 or 9).
2. Add the solve moment and the layer and stipple motion with reduced-motion twins (Stage 8).
3. Self-host fonts and set the Georgian fallback (Q-16, Q-17).
4. Move user-facing strings to a translation pipeline; test with a real second language and a human translator.
5. Run the Stage 5 protocol on this UI, including the confirm-fatigue question.
6. Device pass: iOS and Android phones, VoiceOver, TalkBack, 568 px height, one-hand observation.
7. Decide the daily reset and the archive's date model (Q-09).
