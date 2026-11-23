# AI review of the World Reveal content

You asked for the AI to check the reveal content, and for a more surprising connection. This is that work. **It is an agent review, not a human one.** It cannot give V3, and it says so wherever it matters. Run again: `node tools/verify/check-claims.mjs` (about four minutes; it re-opens every cited page).

## 1. Fact check
Every factual claim in the stories and the finale (47) is listed in `tools/verify/claims.json` with its page and the wording that must appear. The checker re-opens each page in a browser and tests for that wording. Result: **47 of 47 found on their pages** (`docs/reveal/claim-check.json`).

What that proves: the stated fact is on the cited page. What it does not prove: that the page is right, that a second independent source agrees, or that my paraphrase carries the nuance. By publisher, 41 of the 47 rest on Wikipedia alone, 5 on WHO or CDC, and the rest on two of those. The first run had one failure, and it was my pattern, not the fact: the page writes "December 30, 1443 to January 28, 1444" in US style. Single-source claims stay V1. Mansa Musa's 1324 pilgrimage is still one source and still marked HOLD.

## 2. Sensitivity review (checklist applied to each story)
| Story | What could go wrong | What I did | Residual |
|---|---|---|---|
| Rosetta | A colonial-era object told as a European success story | Added a beat, **Whose is it?**, citing the 2003 call by Zahi Hawass for its return and that national museums typically oppose repatriation. It takes no side | A human with Egyptology or museum-ethics standing should read it |
| Smallpox | Death toll and a named patient | No death tolls in the story. The patient is not named in the story text, only in source titles. The last-death line names no one | The pack names him in a source title. Judge if that is acceptable |
| Manila galleon | Trade romanticised, colonisation hidden | The route beat now says the fleet belonged to the expedition sent to conquer the Philippines | One sentence is thin. A Filipino historian's view is not represented |
| Hangul | Korean material seen only through English Wikipedia | Kept to dates and the calendar conversion; no claims about meaning or national identity | Needs a Korean-language source check |
| 1324 to 1327 | Mali reduced to one pilgrimage; Islamic dates mishandled | Dates labelled; Islamic date given with its Gregorian equivalent as the source does; one-source claim flagged | A reviewer who knows Mali and the medieval Islamic world |
| 1969 | One African event added to look balanced | Said so on screen: the pack found one African event and could open one page | Tokenism risk remains; more non-Western sources are needed |
| Finale, same coast | Presenting Somalia only as a place of disease | Both nodes now show dignity and agency: Mogadishu "at the zenith of its prosperity"; the patient recovered and later worked on polio vaccination | A Somali reviewer |
| Finale, same year | Implying a link between FESTAC, Star Wars, Voyager and smallpox | Labelled "Simultaneous. No link is claimed" | none |
Case 4 (a queer-history institution) has no reveal story yet and would need its own review before one is written.

## 3. A more surprising connection
Candidates I looked at, with a page for each:
- **Rejected: the 2 March coincidence.** The Rosetta probe launched on 2 March 2004 and Concorde 001 first flew on 2 March 1969. True per Wikipedia, but a calendar coincidence with a day-level source disagreement on the Concorde date. Too cute, too fragile.
- **Rejected: Polo and Mansa Musa.** Already in the 1324 lanes, and the Mansa Musa date is one source.
- **Kept, new: the same coast, 645 years apart.** Ibn Battuta (case 7) reached Mogadishu in 1332, the city then at the zenith of its prosperity. The last known natural smallpox case (case 6) was diagnosed in October 1977 in Merca, immediately southwest of Mogadishu. Both are on the Somali coast. It only appears if you hold two cases side by side. Category: **Same place. No link is claimed.**
- **Kept, new: a name that travelled.** The stone found in 1799 (case 5) gave its name to the European Space Agency's Rosetta probe, launched on 2 March 2004, and its lander Philae was named after the obelisk that helped decipher hieroglyphs. 205 years from the finding to the launch, 2,199 from the decree. Category: **Named after. Documented: someone chose the name.** It is the opposite kind of connection to the 1977 coincidence, and the finale shows the two categories next to each other so the difference is the point.
- **Kept: the 1977 pair,** now one of three, each with its own label.

## 4. Decisions from your answers
1. AI checks the content: done as above, labelled as agent review. A named human reviewer is still the only route to V3 (Q-58 stays open, reduced to a final read).
2. More surprising connection: two added.
3. Only a few reveal stories per day: adopted as the plan. The prototype has six; a real day would show the reveal for three or fewer cases plus the finale (D-064).
