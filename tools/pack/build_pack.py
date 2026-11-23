"""Builds every Stage 3 artefact from pack_data.py. Run: python3 tools/pack/build_pack.py

Outputs (all under docs/pack/ unless noted):
  daily-pack-draft.json, CASE_SHEETS.md, BIBLIOGRAPHY.md, AUDITS.md, CANDIDATES.md, CONNECTIONS.md, case-sheets.html
  tools/pack/pack.schema.json
"""
import html
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import pack_data as D  # noqa: E402
import lint_pack as L  # noqa: E402

ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "docs", "pack")
os.makedirs(OUT, exist_ok=True)

REP = L.analyse()
show = L.show
E = html.escape


def w(name, text):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        f.write(text)


# ---------------------------------------------------------------------------------------------------------
# Connections computed from the data, never typed by hand
# ---------------------------------------------------------------------------------------------------------
def gaps(years):
    ys = sorted(years)
    return [b - a for a, b in zip(ys, ys[1:])]


def build_connections():
    tg = {c["order"]: c["target"]["year"] for c in D.CASES}
    out = []
    first4 = [tg[i] for i in range(1, 5)]
    out.append(dict(
        after_case=4, kind="meta-historical", title="Same year, different day",
        text=("You have placed four marks: %s. Look at the dates inside two of those cases. Sources disagree about the day of "
              "Concorde's first flight (1 or 2 March 1969) and of the Berlin Institute's opening (1 or 6 July 1919), but not about the year. "
              "A record can disagree about the day and still agree on the year." % ", ".join(show(y) for y in sorted(first4))),
        claim_type="editorial observation about source disagreement; the day-level disagreements are recorded in each case's facts",
        reveals_future_answer=False))
    first7 = [tg[i] for i in range(1, 8)]
    g = gaps(first7)
    out.append(dict(
        after_case=7, kind="chronological", title="How far apart are your marks?",
        text=("Placed in order, your seven marks are %s. The gaps between neighbours are %s years. The pack was chosen by editors, "
              "so the gaps describe our selection as much as the past." % (
                  ", ".join(show(y) for y in sorted(first7)), ", ".join(str(x) for x in g))),
        claim_type="arithmetic on solved answers; the interpretation is labelled editorial",
        reveals_future_answer=False))
    return out


CONN = build_connections()
D.PACK["connections"] = CONN


# ---------------------------------------------------------------------------------------------------------
# JSON pack
# ---------------------------------------------------------------------------------------------------------
def predicate(frag):
    if frag.get("kind") == "relation":
        if frag["type"] == "years_after":
            return {"op": "equals", "year": frag["anchor"]["year"] + frag["n"], "rule": "anchor_year_plus_n",
                    "anchor_year": frag["anchor"]["year"], "n": frag["n"]}
        return {"op": "equals", "year": frag["era_start"] + frag["n"] - 1, "rule": "era_year",
                "era_start": frag["era_start"], "n": frag["n"]}
    if frag["direction"] == "had_happened":
        return {"op": "gte", "year": frag["anchor"]["year"]}
    return {"op": "lte", "year": frag["anchor"]["year"] - 1}


def jfrag(f, paid=False):
    o = {"id": f["id"], "text": f["text"],
         "anchor": {"label": f["anchor"]["label"], "date": f["anchor"]["date"], "year": f["anchor"]["year"],
                    "year_label": show(f["anchor"]["year"]), "region": f["anchor"]["region"]},
         "predicate": predicate(f), "convention": "end-of-year" if f.get("kind") != "relation" else "calendar-year-arithmetic",
         "source_ids": f["sources"], "corroboration_ids": f["corroboration"]}
    if paid:
        o.update({"tier": f["tier"], "cost": f["cost"], "category": f["category"]})
    else:
        o["kind"] = f["kind"]
    if f.get("note"):
        o["editor_note"] = f["note"]
    return o


def jcase(c):
    r = REP["cases"][c["id"]]
    return {
        "id": c["id"], "order": c["order"], "title": c["title"], "lens": c["lens"], "region": c["region"], "era": c["era"],
        "difficulty": c["difficulty"], "question": c["question"], "corridor": c["corridor"],
        "target": dict(c["target"], year_label=show(c["target"]["year"])),
        "free": [jfrag(f) for f in c["free"]],
        "paid": [jfrag(p, True) for p in c["paid"]],
        "context_free": c["context_free"],
        "reveal": c["reveal"],
        "editorial": {
            "c0": r["c0"], "c0_labels": [show(y) for y in r["c0"]],
            "uniqueness_proof": {str(y): t for y, t in r["uniqueness"].items()},
            "paid_effects": r["paid"], "fragment_levels": r["levels"], "blockers": r["blockers"],
            "target_fact_level": r["target_fact_level"], "publishable": r["publishable"],
            "arithmetic_solvable_from_free": r["arithmetic_solvable_from_free"],
            "facts": c["facts"], "hold": c["hold"], "sample_player": c["sample_player"], "miss_explanation": c["miss_explanation"],
        },
    }


PACK_JSON = {
    "pack_id": D.PACK["pack_id"], "version": D.PACK["version"], "status": D.PACK["status"],
    "date_convention": D.PACK["date_convention"], "year_numbering": "astronomical integers in JSON (1 BCE = 0); labels never show a year zero",
    "theme": D.PACK["theme"], "finale_thesis": D.PACK["finale_thesis"],
    "sources": D.SOURCES, "cases": [jcase(c) for c in D.CASES], "connections": CONN,
}

SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "title": "TIMEHUNT daily pack (draft schema, Stage 3)",
    "type": "object",
    "required": ["pack_id", "version", "status", "date_convention", "sources", "cases", "connections", "finale_thesis"],
    "properties": {
        "status": {"enum": ["DRAFT_NOT_PUBLISHABLE", "REVIEW", "PUBLISHABLE"]},
        "date_convention": {"const": "end-of-year"},
        "sources": {"type": "array", "items": {"type": "object", "required": ["id", "title", "publisher", "url", "kind", "opened", "retrieved"]}},
        "cases": {
            "type": "array", "minItems": 10, "maxItems": 10,
            "items": {
                "type": "object",
                "required": ["id", "order", "title", "lens", "region", "question", "corridor", "target", "free", "paid", "reveal", "editorial"],
                "properties": {
                    "corridor": {"type": "array", "items": {"type": "integer"}, "minItems": 2, "maxItems": 2},
                    "target": {"type": "object", "required": ["year", "event", "definition", "precision", "calendar", "discovery_vs_event"]},
                    "free": {"type": "array", "minItems": 3, "items": {"type": "object", "required": ["id", "text", "anchor", "predicate", "convention", "source_ids", "kind"]}},
                    "paid": {"type": "array", "minItems": 1, "items": {"type": "object", "required": ["id", "text", "anchor", "predicate", "tier", "cost", "category", "source_ids"],
                                                                      "properties": {"tier": {"enum": ["nudge", "deep"]}, "cost": {"enum": [1, 2]}}}},
                    "editorial": {"type": "object", "required": ["c0", "uniqueness_proof", "paid_effects", "fragment_levels", "blockers", "publishable", "facts", "hold", "sample_player"],
                                  "properties": {"c0": {"type": "array", "minItems": 3, "maxItems": 6}}},
                },
            },
        },
        "connections": {"type": "array", "items": {"type": "object", "required": ["after_case", "title", "text"]}},
    },
}

with open(os.path.join(HERE, "pack.schema.json"), "w", encoding="utf-8") as f:
    json.dump(SCHEMA, f, indent=2, ensure_ascii=False)
    f.write("\n")
with open(os.path.join(OUT, "daily-pack-draft.json"), "w", encoding="utf-8") as f:
    json.dump(PACK_JSON, f, indent=2, ensure_ascii=False)
    f.write("\n")
# the gray-box app reads an identical copy (Stage 4); app/test checks the two stay equal
os.makedirs(os.path.join(ROOT, "app", "data"), exist_ok=True)
with open(os.path.join(ROOT, "app", "data", "daily-pack-draft.json"), "w", encoding="utf-8") as f:
    json.dump(PACK_JSON, f, indent=2, ensure_ascii=False)
    f.write("\n")

schema_note = "jsonschema not installed; schema not validated"
try:
    import jsonschema
    jsonschema.validate(PACK_JSON, SCHEMA)
    schema_note = "validated against tools/pack/pack.schema.json (jsonschema)"
except ImportError:
    pass
print("pack json:", schema_note)

# ---------------------------------------------------------------------------------------------------------
# Shared helpers
# ---------------------------------------------------------------------------------------------------------
SRC = D.SOURCE_INDEX


def src_links_md(ids):
    out = []
    for i in ids:
        s = SRC[i]
        out.append("[%s](%s)%s" % (s["title"], s["url"], "" if s["opened"] else " (not opened)"))
    return "; ".join(out) if out else "none"


def used_by():
    m = {}
    for c in D.CASES:
        ids = set()
        for f in c["free"] + c["paid"]:
            ids |= set(f["sources"]) | set(f["corroboration"])
        for x in c["facts"]:
            ids |= set(x["opened"]) | set(x["corroborated_by"])
        for x in c["reveal"] + c["context_free"]:
            ids |= set(x["sources"])
        for i in ids:
            m.setdefault(i, []).append(c["order"])
    return m


USED = used_by()

# ---------------------------------------------------------------------------------------------------------
# CASE_SHEETS.md
# ---------------------------------------------------------------------------------------------------------
md = ["# Ten case sheets: draft pack 001, \"%s\"\n" % D.PACK["theme"],
      "**Status: DRAFT, NOT PUBLISHABLE.** Spoilers throughout: each sheet gives its answer. Generated from `tools/pack/pack_data.py` by `tools/pack/build_pack.py`; do not edit by hand.\n",
      "Dating convention on every clue: *true on 31 December of the target year* (D-009). Years inside the data are astronomical integers; labels never show a year zero.\n"]
for c in D.CASES:
    r = REP["cases"][c["id"]]
    t = c["target"]
    md.append("\n---\n\n## Case %d. %s\n" % (c["order"], c["title"]))
    md.append("**Lens:** %s. **Regions:** %s. **Era:** %s. **Reveal form:** %s. **Difficulty:** %s.\n" % (
        c["lens"], ", ".join(c["region"]), c["era"], c["reveal_form"], c["difficulty"]))
    md.append("**Question.** %s\n" % c["question"])
    md.append("**Answer: %s.** %s\n" % (show(t["year"]), t["event"]))
    md.append("- Definition: %s\n- Precision: %s. Calendar: %s.\n- Discovery versus event: %s\n- Corridor: %s to %s.\n" % (
        t["definition"], t["precision"], t["calendar"], t["discovery_vs_event"], show(c["corridor"][0]), show(c["corridor"][1])))
    md.append("\n**Free evidence** (what every player sees)\n")
    for f in c["free"]:
        lv = r["levels"]["free " + f["id"]]
        md.append("- *%s* %s  \n  Anchor: %s, %s. Sources: %s. Level **%s**." % (
            f["kind"], f["text"], f["anchor"]["label"], f["anchor"]["date"], src_links_md(f["sources"] + f["corroboration"]), lv))
    md.append("\n**Candidates after the two free bounds (C0):** %s (%d years).\n" % (", ".join(show(y) for y in r["c0"]), len(r["c0"])))
    md.append("**Uniqueness proof** (why only %s survives the relation):\n" % show(t["year"]))
    for y, why in sorted(r["uniqueness"].items()):
        md.append("- %s" % why)
    md.append("\n**Paid clues**\n")
    for p, pe in zip(c["paid"], r["paid"]):
        md.append("- %s, %d Insight, category *%s*: %s  \n  Cuts %s from C0, leaves %d. %s Sources: %s. Level **%s**." % (
            p["tier"].capitalize(), p["cost"], p["category"], p["text"],
            ", ".join(show(y) for y in pe["cuts"]) or "nothing", pe["remaining"],
            "It resolves the case." if pe["resolves"] else "", src_links_md(p["sources"]), r["levels"]["paid " + p["id"]]))
    if c["context_free"]:
        md.append("\n**Free context (cuts nothing):** " + " ".join(x["text"] for x in c["context_free"]) + "\n")
    md.append("\n**Sample player explanation (free evidence only, zero Insight)**\n")
    for i, step in enumerate(c["sample_player"], 1):
        md.append("%d. %s" % (i, step))
    md.append("\n**If the player misses.** %s\n" % c["miss_explanation"])
    md.append("**Reveal.** Form: %s.\n" % c["reveal_form"])
    for rv in c["reveal"]:
        md.append("- *%s* (%s): %s Sources: %s." % (rv["title"], rv["form"], rv["text"], src_links_md(rv["sources"])))
    md.append("\n**Facts and verification**\n")
    for x in c["facts"]:
        md.append("- [%s] %s (%s; %s). Opened: %s. Corroboration seen only in search summaries: %s.%s" % (
            x["level"], x["claim"], x["value"], x["precision"], src_links_md(x["opened"]), src_links_md(x["corroborated_by"]),
            (" Note: " + x["note"]) if x["note"] else ""))
    if c["hold"]:
        md.append("\n**HOLD FOR RESEARCH**\n")
        for h in c["hold"]:
            md.append("- " + h)
    if r["blockers"]:
        md.append("\n**Publication blockers (computed):** " + "; ".join(r["blockers"]) + ".\n")
w("CASE_SHEETS.md", "\n".join(md) + "\n")

# ---------------------------------------------------------------------------------------------------------
# BIBLIOGRAPHY.md
# ---------------------------------------------------------------------------------------------------------
b = ["# Source bibliography, draft pack 001\n",
     "Every source the pack touches. **Opened** means the editor loaded the page in a browser engine in this stage and read the cited passage. "
     "**Not opened** means the page was blocked or failed, and only a search-result summary of it was seen. A not-opened source is recorded as corroboration "
     "of weaker standing and never counts toward V1 or V2 (D-011).\n",
     "Two Wikipedia pages are one publisher and do not make V2. V2 here means at least two opened pages from different publishers.\n",
     "\n| ID | Publisher | Title and locator | Opened | Used in cases | URL |", "|---|---|---|---|---|---|"]
for s in D.SOURCES:
    b.append("| `%s` | %s | %s. %s | %s | %s | %s |" % (
        s["id"], s["publisher"], s["title"], s["note"].replace("|", "/"), "yes" if s["opened"] else "**no**",
        ", ".join(str(x) for x in sorted(set(USED.get(s["id"], [])))) or "none", s["url"]))
b.append("\n## Reachability\n")
b.append("Opened reliably: Wikipedia, WHO, CDC, NASA science pages (limited). Blocked or failed: Encyclopaedia Britannica, museum and national-history sites, UNESCO, "
         "the US Holocaust Memorial Museum, Library of Congress, and several news sites. A request to read archived copies through the Internet Archive was refused by the "
         "environment. Consequence: for eight of ten targets the second independent opened source is missing, and the pack stays DRAFT until a human opens those pages or the "
         "network allowlist is widened (see the checkpoint report).\n")
w("BIBLIOGRAPHY.md", "\n".join(b) + "\n")

# ---------------------------------------------------------------------------------------------------------
# Coverage statistics
# ---------------------------------------------------------------------------------------------------------
from collections import Counter  # noqa: E402

treg = Counter(r for c in D.CASES for r in c["region"])
era = Counter(c["era"] for c in D.CASES)
areg = Counter()
for c in D.CASES:
    for f in c["free"] + c["paid"]:
        areg[f["anchor"]["region"]] += 1
atotal = sum(areg.values())
lens_list = [(c["order"], c["lens"]) for c in D.CASES]
years = sorted(c["target"]["year"] for c in D.CASES)
n_v2_target = sum(1 for c in D.CASES if REP["cases"][c["id"]]["target_fact_level"] == "V2")
n_pub = sum(1 for c in D.CASES if REP["cases"][c["id"]]["publishable"])
frag_levels = Counter()
for r in REP["cases"].values():
    for lv in r["levels"].values():
        frag_levels[lv] += 1
tight = [(c["order"], p["id"]) for c in D.CASES for p in REP["cases"][c["id"]]["paid"] if p["prints_target"]]
resolving = [(c["order"], p["id"]) for c in D.CASES for p in REP["cases"][c["id"]]["paid"] if p["resolves"]]
c0sizes = [len(REP["cases"][c["id"]]["c0"]) for c in D.CASES]
ladder_after_all = {}
for c in D.CASES:
    r = REP["cases"][c["id"]]
    s = set(r["c0"])
    for p in c["paid"]:
        s &= L.effect(p, s)
    ladder_after_all[c["order"]] = len(s)

# ---------------------------------------------------------------------------------------------------------
# AUDITS.md
# ---------------------------------------------------------------------------------------------------------
a = ["# Stage 3 audits, draft pack 001\n",
     "Generated by `tools/pack/build_pack.py` from the lint results (`tools/pack/lint_pack.py`). Numbers below are computed, not typed.\n",
     "\n## 1. Verification\n",
     "Rule (D-011, D-014): V1 = one source page opened and the date matched; V2 = two independent opened pages from different publishers; V3 needs a named human. "
     "A case is **publishable** only if every clue it shows is V2 and no HOLD remains.\n",
     "\n| Case | Target fact | Fragments at V2 / total | Publishable | Blockers |", "|---|---|---|---|---|"]
for c in D.CASES:
    r = REP["cases"][c["id"]]
    v2 = sum(1 for v in r["levels"].values() if v == "V2")
    a.append("| %d. %s | %s | %d / %d | %s | %s |" % (
        c["order"], c["title"], r["target_fact_level"], v2, len(r["levels"]), "yes" if r["publishable"] else "no",
        (str(len(r["blockers"])) + " fragments below V2" + ("; HOLD items" if c["hold"] else "")) if (r["blockers"] or c["hold"]) else "none"))
a.append("\n**Totals.** Targets at V2: **%d of 10**. Cases publishable: **%d of 10**. Clue fragments by level: V2 %d, V1 %d, V0 %d (of %d)." % (
    n_v2_target, n_pub, frag_levels["V2"], frag_levels["V1"], frag_levels["V0"], sum(frag_levels.values())))
a.append("\nThe stage pass criterion was that every publishable hard boundary has a traceable source and a stated time convention. "
         "That holds in the narrow sense: every clue carries source ids with locators, a computed level and the end-of-year convention, and the linter rejects a clue "
         "without them. In the stricter sense, **no case in this pack is publishable yet**, because most boundaries rest on one opened page. "
         "The pack is deliberately marked `DRAFT_NOT_PUBLISHABLE`.\n")
a.append("\n### Claims reduced or removed during editing\n")
a.append("These were in an earlier draft and were cut because they were not backed by a page the editor opened: petition signature counts, the name of New Zealand's governor in 1893, "
         "the Māori-electorate election date, the 'iron' rain gauge, 'a hospital cook in Merca', 'Venice' for Marco Polo's death, the Berlin Institute's motto and location, "
         "Hirschfeld's 1935 death, the length of Ibn Battuta's planned pilgrimage, the Golden Record's '55 languages' (page not opened), and Concorde airline names. "
         "Exact Han census totals stay on HOLD because sources disagree. Day-level disagreements are recorded rather than resolved: Concorde 1 or 2 March 1969, the Berlin Institute 1 or 6 July 1919, "
         "the Rosetta Stone 15 or 19 July (one encyclopedia says August) 1799, and Maalin 22, 26 or 31 October 1977. Years never differ.\n")
a.append("\n## 2. Coverage and bias\n")
a.append("**Target regions (a case can count for several):** " + "; ".join("%s %d" % (k, v) for k, v in treg.most_common()) + ".\n")
a.append("**Anchor regions** (every dated fact a player sees, %d in all): " % atotal + "; ".join(
    "%s %d (%d%%)" % (k, v, round(100 * v / atotal)) for k, v in areg.most_common()) + ".\n")
a.append("**Eras of targets:** " + "; ".join("%s %d" % (k, v) for k, v in era.most_common()) + ". Answers sorted: " + ", ".join(show(y) for y in years) + ".\n")
a.append("\n**What the pack does well.** Five of ten cases are centred outside Europe and North America (2, 3, 6, 8, 9) and two more (5, 7) span Africa and Europe; "
         "queer history has a dedicated case (4); women's political history has one (2); a quantitative record (9) and a public-health record (6) are present; "
         "case 7 puts Mali, Morocco, Italy and England in one decade; case 8 and case 9 teach calendar and BCE/CE handling.\n")
a.append("\n**Gaps, stated plainly.**\n")
a.append("- **Anchors lean Western even where the targets do not.** Europe and North America supply %d%% of all anchors. Boeing, Apollo, the Eiffel Tower, the Lumière brothers, Viking 1 and Star Wars are the free clues in cases 1, 2, 6 and 10. A player from outside that tradition gets a harder deduction on exactly the cases that look global." % round(100 * (areg["Europe"] + areg["North America"]) / atotal))
a.append("- **Modern skew.** Five of ten targets fall between 1893 and 1977. Only one is ancient. Nothing is prehistoric, nothing pre-Han in Asia, nothing medieval in the Americas or South Asia.")
a.append("- **South Asia, the Middle East as a centre, Indigenous Americas and Pacific history before 1800 are absent.** Case 7 touches the Islamic world through Ibn Battuta, and case 3 touches the Philippines and Mexico, but neither is centred there. Candidate reserves for South Asia and the Americas are listed in CANDIDATES.md and all are on HOLD.")
a.append("- **Everyday life is thin.** The brief asks for everyday-life history. Case 3 (trade route) and case 6 (medicine) come closest. A cooking, clothing, housing or schooling case is missing. This is the main content gap and I recommend replacing one modern case (1 or 10) with it.")
a.append("- **Women and gender beyond case 2 and case 4 are underrepresented.** Of the ten, none has a named woman as the protagonist.")
a.append("- **Single-person framing.** Cases 4, 5 and 7 are told through named men. The Han and Manila-galleon cases are institutional.")
a.append("- **Quantitative data.** Cases 6 and 9 carry it, but case 9's exact figures are on HOLD, so the pack currently has one dependable quantitative reveal.")
a.append("- **A surprising coexistence** is present (case 7, and the finale). The finale's coincidence is a selection effect. The Daily Trail says so.\n")
a.append("\n## 3. Clue leakage\n")
a.append("Machine checks, all passing: (a) no free text, anchor label, anchor date, title, question or pre-purchase label prints the target year; (b) every paid clue keeps the target; "
         "(c) every paid clue removes at least one year from C0; (d) |C0| is 3 to 6 in all ten cases (sizes %s); (e) the free relation selects exactly the target in all ten; (f) no clue prints another case's target year." % ", ".join(map(str, c0sizes)))
a.append("\n**Findings the linter does not fail on, but a reviewer should weigh.**\n")
a.append("1. **Every case is solvable by arithmetic from free evidence alone.** The free relation (\"one calendar year after X\") names an anchor with a stated date, so a player can add and finish without historical knowledge. "
         "This is what the Stage 3 brief asked for (a novice solves from free evidence) and what D-019 requires, but it has a cost: **paid Insight has no job in these ten cases.** "
         "The Stage 2 economy assumed 3 to 6 candidates left after the free dossier. Here the effective residual after reading everything is 1. This is the largest open question of the stage (Q-32).")
a.append("2. **Resolving paid clues.** %d paid clues leave a single candidate (%s). %d paid clues print the target year in their own text (%s). Once bought, those clues name the answer. That is acceptable for a clue that resolves, but the player should not be able to mistake a purchase for a hint when the price is 2." % (
    len(resolving), ", ".join("case %d %s" % x for x in resolving), len(tight), ", ".join("case %d %s" % x for x in tight)))
a.append("3. **Thin ladders.** If the free relation were hidden (the Stage 2 assumption), the residual after buying every paid clue would be %s. Cases with one paid clue cannot be resolved by purchase alone. Each case needs two or three real paid clues, not one or two." % (
    ", ".join("case %d: %d" % (k, v) for k, v in ladder_after_all.items())))
a.append("4. **Case 6 and case 10 share an answer (1977).** The finale's design needs this coincidence, but a player who remembers case 6's answer can try 1977 on case 10 with 1976 and 1978 as the only alternatives. Case 10's paid clue 1 literally restates case 6's answer. Recommended: keep the coincidence, but remove case 10's paid clue 1 and make the finale's relation clue the only route, or move the coincidence to the Trail screen after both are locked.")
a.append("5. **Pattern risk.** Seven of ten answers have a relation of exactly one calendar year after an anchor (cases 1, 2, 3, 4, 5, 7, 10). A player who notices will guess anchor+1. Vary the offsets (the draft already uses 2 in case 6 and 4 in case 8) and add non-integer-offset relations such as ordering or era counting (case 9).")
a.append("6. **Uncertainty flags.** Cases 5, 8 and 9 involve dates players may know differently (August versus July 1799; 1443 versus 1446; 2 CE versus 'first century BCE'). Each target definition states which event is meant and the miss explanation says what the near answers were.")
a.append("\n## 4. Convention audit\n")
a.append("All bound clues begin \"By the end of that year\" (D-009). Relation clues say \"calendar year\" or name an era. Case 8's Joseon dates are lunar and are converted, with the Gregorian year boundary named in the reveal. "
         "Case 7's anchor is a Hijri date with a Gregorian equivalent given by the source. Case 9 treats 1 BCE as astronomical year 0 internally and shows no year zero.\n")
a.append("\n## 5. Schema and lint\n")
a.append("Schema: %s. Lint: %d errors, %d warnings. Run `python3 tools/pack/lint_pack.py`.\n" % (schema_note, len(REP["errors"]), len(REP["warnings"])))
w("AUDITS.md", "\n".join(a) + "\n")

# ---------------------------------------------------------------------------------------------------------
# CONNECTIONS.md
# ---------------------------------------------------------------------------------------------------------
cn = ["# Milestone connections and finale thesis\n",
      "Connections appear after case 4 and case 7. They may use only answers the player has already locked or been shown, and must not reveal a later answer. "
      "The text below is generated from the case data, so it cannot disagree with the answers.\n"]
for x in CONN:
    cn.append("\n## After case %d. %s\n\n%s\n\n- Kind: %s\n- Claim type: %s\n- Reveals a future answer: %s\n" % (
        x["after_case"], x["title"], x["text"], x["kind"], x["claim_type"], "no" if not x["reveals_future_answer"] else "YES"))
cn.append("\n## Finale thesis (case 10)\n\n%s\n\n" % D.PACK["finale_thesis"])
cn.append("**Claim discipline.** The Trail may say that two events share a year. It must not say that one caused the other, that the world was \"connected\" by them, or that the pack's selection reflects history's balance. "
          "Case 10's answer duplicates case 6's, a constraint recorded in AUDITS.md section 3.\n")
cn.append("\n**Spoiler check.** After case 4 the player has locked or been shown cases 1 to 4 only. After case 7, cases 1 to 7. Neither text uses an answer from cases 8 to 10.\n")
w("CONNECTIONS.md", "\n".join(cn) + "\n")

# ---------------------------------------------------------------------------------------------------------
# CANDIDATES.md (registry of 19 topics)
# ---------------------------------------------------------------------------------------------------------
RESERVES = [
    ("R1", "Stonewall uprising, New York", "Queer history", "North America", "modern",
     "Over-represented in English-language queer history; shown here only to record why it was not chosen. Would need two opened sources for the date and a decision on discovery versus event. Q-13 flagged it as unverified."),
    ("R2", "Pan-African Cultural Festival, Algiers", "Culture, non-US", "Africa", "modern",
     "Q-14. Dates seen only in search summaries. Strong candidate for a non-European 1969 case. HOLD FOR RESEARCH: open a primary or encyclopedic page for the dates."),
    ("R3", "Dunhuang Library Cave found", "Archaeology: found, made, decoded", "Asia", "modern",
     "A discovery-versus-event case (the cave was sealed centuries before it was opened). HOLD FOR RESEARCH: discovery year and the order of the Stein and Pelliot visits."),
    ("R4", "Uniform penny postage", "Everyday life", "Europe", "modern",
     "Would fill the everyday-life gap with a data-friendly case (a stamp). HOLD FOR RESEARCH: the exact year versus the date of first use."),
    ("R5", "Great Zimbabwe", "Contested dating", "Africa", "medieval",
     "Good for range precision, because the dating of its building phases is argued. HOLD FOR RESEARCH: a source that gives phases with their uncertainty. Probably a range case, not a single year."),
    ("R6", "Gutenberg's Bible", "Technology and media", "Europe", "early modern",
     "Dated 'c.' in most sources, which fits a range case. HOLD FOR RESEARCH."),
    ("R7", "Plague arrives in Sicily", "Medicine and public health", "Europe", "medieval",
     "The Black Death in Europe, often dated to a port arrival. HOLD FOR RESEARCH: the year and the strength of the evidence for the arrival story."),
    ("R8", "Edicts of Ashoka", "Documents and inscriptions", "South Asia", "ancient",
     "Fills the South Asia gap. HOLD FOR RESEARCH: regnal chronology depends on a reconstruction, so this is a range case."),
    ("R9", "Lascaux cave found", "Archaeology: found, made, decoded", "Europe", "modern",
     "A found-versus-made case (the paintings are far older than the discovery). HOLD FOR RESEARCH: discovery year, and the painted age with its uncertainty."),
]
cd = ["# Candidate registry, draft pack 001\n",
      "Nineteen topics were considered: **ten finalists** with full records in CASE_SHEETS.md, and **nine reserves** that are compact briefs only. "
      "Reserve briefs state no dates. Everything in them is from the editor's general knowledge, not opened sources, and each needs research before it can become a case.\n",
      "\n## Finalists\n", "| # | Topic | Lens | Region | Era | Answer | Target fact level |", "|---|---|---|---|---|---|---|"]
for c in D.CASES:
    cd.append("| %d | %s | %s | %s | %s | %s | %s |" % (c["order"], c["title"], c["lens"], ", ".join(c["region"]), c["era"],
                                                       show(c["target"]["year"]), REP["cases"][c["id"]]["target_fact_level"]))
cd.append("\n## Reserves (HOLD FOR RESEARCH)\n")
cd.append("| ID | Topic | Lens | Region | Era | Why held |")
cd.append("|---|---|---|---|---|---|")
for rid, tp, ln, rg, er, why in RESERVES:
    cd.append("| %s | %s | %s | %s | %s | %s |" % (rid, tp, ln, rg, er, why))
cd.append("\n## Why these ten\n")
cd.append("Selection followed the Stage 3 brief: a queer-history case, an everyday-life case, quantitative data, non-European regions, a surprising coexistence and a calendar problem. "
          "The test was whether a dated, openable source existed for a year-level boundary. That filter favoured topics with Wikipedia coverage, which is itself a bias recorded in AUDITS.md.\n")
w("CANDIDATES.md", "\n".join(cd) + "\n")

# ---------------------------------------------------------------------------------------------------------
# HTML review book
# ---------------------------------------------------------------------------------------------------------
REGION_TONE = {"Europe": "#6E7F94", "North America": "#8C7A56", "Oceania": "#4F7F7A", "Asia": "#A8693F", "Africa": "#B4412D",
               "Americas": "#7C6A8F", "Global": "#675F55"}


def tone(c):
    return REGION_TONE.get(c["region"][0], "#675F55")


def cell(y, state):
    return '<span class="yc %s">%s</span>' % (state, E(show(y)))


def strip(c):
    r = REP["cases"][c["id"]]
    t = c["target"]["year"]
    c0 = r["c0"]
    rows = []
    # free bounds row
    rows.append('<div class="srow"><div class="slab">Free bounds leave</div><div class="scells">%s</div></div>' % "".join(
        cell(y, "target" if y == t else "live") for y in c0))
    rel = [f for f in c["free"] if f["kind"] == "relation"][0]
    rows.append('<div class="srow"><div class="slab">Free relation keeps</div><div class="scells">%s</div></div>' % "".join(
        cell(y, "target" if y == t else "cut") for y in c0))
    for p, pe in zip(c["paid"], r["paid"]):
        rows.append('<div class="srow"><div class="slab">%s, %d Insight, %s</div><div class="scells">%s</div></div>' % (
            E(p["tier"].capitalize()), p["cost"], E(p["category"]),
            "".join(cell(y, ("target" if y == t else "live") if y in pe["keeps"] else "cut") for y in c0)))
    return '<div class="strip" role="group" aria-label="How each clue narrows the candidate years">%s</div>' % "".join(rows)


def lvl(v):
    return '<span class="lv %s">%s</span>' % (v.lower(), v)


def srcs_html(ids):
    out = []
    for i in ids:
        s = SRC[i]
        cls = "" if s["opened"] else ' class="unopened"'
        out.append('<a%s href="%s">%s</a>' % (cls, E(s["url"]), E(s["publisher"] + (": " + s["title"].replace(" (Wikipedia)", "")) if s["publisher"] != "Wikimedia Foundation" else "Wikipedia: " + s["title"].replace(" (Wikipedia)", ""))))
    return ", ".join(out) or "none"


def case_html(c):
    r = REP["cases"][c["id"]]
    t = c["target"]
    h = []
    h.append('<article class="case" id="%s">' % c["id"])
    h.append('<header class="chead" style="--tone:%s"><div class="cnum">%d</div><div><h2>%s</h2><p class="lens">%s. %s. %s.</p></div></header>' % (
        tone(c), c["order"], E(c["title"]), E(c["lens"]), E(", ".join(c["region"])), E(c["era"])))
    h.append('<p class="q">%s</p>' % E(c["question"]))
    h.append('<p class="ans"><b>Answer %s.</b> %s <span class="prec">Precision: %s. Calendar: %s.</span></p>' % (
        E(show(t["year"])), E(t["event"]), E(t["precision"]), E(t["calendar"])))
    h.append('<p class="def">%s <i>%s</i></p>' % (E(t["definition"]), E(t["discovery_vs_event"])))
    h.append("<h3>How the clues cut the candidates</h3>")
    h.append(strip(c))
    h.append('<p class="note">Candidates are the years that survive the two free bounds. Struck years are removed by that row. The free relation is what makes the answer unique.</p>')
    h.append("<h3>Free evidence</h3><ul class=\"frag\">")
    for f in c["free"]:
        h.append("<li>%s<div class=\"meta\">%s on %s, %s. %s. %s</div></li>" % (
            E(f["text"]), E(f["anchor"]["label"]), E(f["anchor"]["date"]), E(f["kind"]), lvl(r["levels"]["free " + f["id"]]), srcs_html(f["sources"] + f["corroboration"])))
    h.append("</ul>")
    h.append("<h3>Paid clues</h3><ul class=\"frag\">")
    for p, pe in zip(c["paid"], r["paid"]):
        h.append("<li>%s<div class=\"meta\">%s, %d Insight, %s. Cuts %s. %s. %s</div></li>" % (
            E(p["text"]), E(p["tier"].capitalize()), p["cost"], E(p["category"]),
            E(", ".join(show(y) for y in pe["cuts"])) or "nothing", lvl(r["levels"]["paid " + p["id"]]), srcs_html(p["sources"])))
    h.append("</ul>")
    h.append("<h3>A novice solves it, zero Insight</h3><ol class=\"walk\">%s</ol>" % "".join("<li>%s</li>" % E(s) for s in c["sample_player"]))
    h.append('<p class="miss"><b>If they miss:</b> %s</p>' % E(c["miss_explanation"]))
    h.append("<h3>Reveal</h3><ul class=\"frag\">%s</ul>" % "".join(
        "<li><b>%s.</b> %s<div class=\"meta\">%s</div></li>" % (E(rv["title"]), E(rv["text"]), E(rv["form"])) for rv in c["reveal"]))
    if c["hold"] or r["blockers"]:
        h.append('<div class="hold"><h3>Before this can ship</h3><ul>')
        for x in c["hold"]:
            h.append("<li>Hold for research: %s</li>" % E(x))
        h.append("<li>%d of %d clue fragments are below V2.</li>" % (sum(1 for v in r["levels"].values() if v != "V2"), len(r["levels"])))
        h.append("</ul></div>")
    h.append("</article>")
    return "\n".join(h)


# Day overview: strata column, ordered by answer year
ordered = sorted(D.CASES, key=lambda c: c["target"]["year"])
layers = []
for i, c in enumerate(ordered):
    lv = REP["cases"][c["id"]]["target_fact_level"]
    gap = ""
    if i:
        g = c["target"]["year"] - ordered[i - 1]["target"]["year"]
        gap = '<div class="gap">%s</div>' % ("%s years" % format(g, ",") if g else "same year")
    layers.append('%s<a class="layer" href="#%s" style="--tone:%s"><span class="ly">%s</span><span class="lt">%s</span>'
                  '<span class="lc">Case %d. %s</span><span class="lv2 %s">%s</span></a>' % (
                      gap, c["id"], tone(c), E(show(c["target"]["year"])), E(c["title"]), c["order"], E(c["lens"]), lv.lower(), lv))

CSS = """
:root{--bone:#F2ECE0;--panel:#FBF7EF;--ink:#241F1B;--muted:#675F55;--line:#BDB3A1;--oxide:#B4412D;--moss:#526A57;--clay:#C98C79;--dust:#A9A194;
--serif:'Young Serif',Georgia,serif;--sans:'Sofia Sans',system-ui,sans-serif}
*{box-sizing:border-box}html{color-scheme:light}
body{margin:0;background:var(--bone);color:var(--ink);font:17px/1.55 var(--sans);-webkit-font-smoothing:antialiased}
a{color:var(--oxide);text-underline-offset:3px}a.unopened{color:var(--muted);text-decoration-style:dashed}
a:focus-visible{outline:3px solid var(--moss);outline-offset:2px}
main{max-width:920px;margin:0 auto;padding:40px 16px 96px}
h1{font:400 clamp(30px,5vw,46px)/1.08 var(--serif);margin:0 0 12px;max-width:16em}
h2{font:400 clamp(24px,3.4vw,32px)/1.15 var(--serif);margin:0}
h3{font:700 17px/1.3 var(--sans);margin:28px 0 8px}
.lede{max-width:44em;color:var(--muted);margin:0 0 6px}
.stamp{display:inline-block;margin:14px 0 0;padding:4px 12px;border:2px solid var(--oxide);color:var(--oxide);font-weight:700;transform:rotate(-1.2deg);background:var(--panel)}
.core{margin:36px 0 12px;padding:0}
.core h2{margin-bottom:6px}
.layer{display:grid;grid-template-columns:5.2em 1fr auto;gap:2px 16px;align-items:baseline;padding:12px 16px 12px 20px;background:var(--panel);border-left:10px solid var(--tone);border-top:1px solid var(--line);border-bottom:1px solid var(--line);color:var(--ink);text-decoration:none}
.layer:hover{background:#fff}.layer:focus-visible{outline:3px solid var(--moss);outline-offset:-3px}
.ly{font:400 22px/1 var(--serif);font-variant-numeric:tabular-nums}.lt{font-weight:700}.lc{grid-column:2;color:var(--muted);font-size:15px}
.lv2{grid-row:1;grid-column:3;font-size:14px;font-weight:700;padding:1px 8px;border:1.5px solid var(--dust);color:var(--muted)}
.lv2.v2{border-color:var(--moss);color:var(--moss)}
.gap{padding:6px 0 6px 40px;color:var(--muted);font-size:14.5px;border-left:2px dotted var(--dust);margin-left:4px}
.corehint{color:var(--muted);font-size:15px;max-width:44em}
.facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0;margin:28px 0 0;border-top:2px solid var(--ink)}
.fact{padding:14px 16px 14px 0}.fact b{display:block;font:400 28px/1.1 var(--serif)}.fact span{color:var(--muted);font-size:15px}
.case{margin-top:72px;padding-top:8px;border-top:2px solid var(--ink)}
.chead{display:grid;grid-template-columns:auto 1fr;gap:18px;align-items:center;margin:18px 0 8px;padding-left:16px;border-left:10px solid var(--tone)}
.cnum{font:400 56px/1 var(--serif);color:var(--tone)}
.lens{margin:2px 0 0;color:var(--muted);font-size:15.5px}
.q{font:400 21px/1.35 var(--serif);max-width:32em;margin:18px 0 8px}
.ans{margin:0 0 4px;max-width:46em}.prec{color:var(--muted);font-size:15px;display:block}
.def{color:var(--muted);max-width:46em;margin:0;font-size:16px}
.strip{display:grid;gap:0;background:var(--panel);border:1px solid var(--line);padding:6px 14px}
.srow{display:grid;grid-template-columns:minmax(150px,1.1fr) 3fr;gap:12px;align-items:center;padding:8px 0;border-top:1px dotted var(--line)}
.srow:first-child{border-top:0}.slab{font-size:15px;color:var(--muted)}
.scells{display:flex;flex-wrap:wrap;gap:6px}
.yc{font:700 15px/1 var(--sans);font-variant-numeric:tabular-nums;padding:7px 10px;border:1.5px solid var(--dust)}
.yc.live{background:#E6DFCF;border-color:var(--muted)}
.yc.target{background:var(--oxide);border-color:var(--oxide);color:#fff}
.yc.cut{color:#8d8577;border-style:dashed;text-decoration:line-through;background:transparent}
.note{color:var(--muted);font-size:15px;margin:8px 0 0;max-width:46em}
.frag{list-style:none;padding:0;margin:0}.frag li{padding:10px 0;border-top:1px solid var(--line);max-width:48em}
.frag li:first-child{border-top:0}
.meta{color:var(--muted);font-size:14.5px;margin-top:3px}
.lv{font-weight:700;font-size:13.5px;padding:0 6px;border:1.5px solid var(--dust)}.lv.v2{border-color:var(--moss);color:var(--moss)}.lv.v0{border-color:var(--oxide);color:var(--oxide)}
.walk{padding-left:1.3em;max-width:46em}.walk li{margin:6px 0}
.miss{max-width:46em}
.hold{margin-top:22px;padding:4px 18px 12px;background:#F6E4DC;border-left:6px solid var(--oxide);max-width:48em}.hold h3{margin-top:14px}
.audit{margin-top:72px;border-top:2px solid var(--ink);padding-top:12px}
.audit table{border-collapse:collapse;width:100%;font-size:15.5px;background:var(--panel)}
.audit th,.audit td{text-align:left;padding:8px 10px;border:1px solid var(--line);vertical-align:top}
.audit th{background:#E6DFCF}
.audit ul{max-width:48em}
@media (max-width:620px){.layer{grid-template-columns:4.4em 1fr;padding-right:12px}.lv2{grid-column:2;grid-row:auto;justify-self:start}.srow{grid-template-columns:1fr}.cnum{font-size:44px}body{font-size:16.5px}}
@media (prefers-reduced-motion:no-preference){.stamp{animation:settle .6s ease-out both}@keyframes settle{from{opacity:0;transform:rotate(-6deg) scale(1.08)}to{opacity:1;transform:rotate(-1.2deg)}}}
"""

aud_rows = "".join(
    "<tr><td>%d. %s</td><td>%s</td><td>%d of %d</td><td>%s</td></tr>" % (
        c["order"], E(c["title"]), REP["cases"][c["id"]]["target_fact_level"],
        sum(1 for v in REP["cases"][c["id"]]["levels"].values() if v == "V2"), len(REP["cases"][c["id"]]["levels"]),
        "yes" if REP["cases"][c["id"]]["publishable"] else "no") for c in D.CASES)

page = """<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Draft pack 001, editor's review book</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Sofia+Sans:wght@400;600;700&display=swap" rel="stylesheet">
<style>%(css)s</style></head><body><main>
<h1>The world was doing other things</h1>
<p class="lede">Draft pack 001 for the Daily Ten, with every answer shown. This is the editor's book: it contains spoilers, the sources behind each clue, and the checks that decide whether a case may ship.</p>
<span class="stamp">Draft, not publishable</span>
<section class="core" aria-labelledby="coreh"><h2 id="coreh">The day as a core sample</h2>
<p class="corehint">Layers sit in answer order, oldest at the top. The colour bar is the case's region; the box on the right is how well its answer is verified. The gaps are the arithmetic the Daily Trail will show.</p>
%(layers)s</section>
<div class="facts"><div class="fact"><b>%(v2)d of 10</b><span>answers confirmed by two independent opened sources</span></div>
<div class="fact"><b>%(pub)d of 10</b><span>cases that pass the full publication gate today</span></div>
<div class="fact"><b>%(c0)s</b><span>candidate years left by the free bounds, per case</span></div>
<div class="fact"><b>1</b><span>year left once the free relation is read: free evidence alone solves every case</span></div></div>
%(cases)s
<section class="audit" id="audit"><h2>Verification at a glance</h2>
<p>A case ships only when every clue it shows rests on two opened pages from different publishers and no hold remains. Underlined grey links are pages that could not be opened.</p>
<table><thead><tr><th>Case</th><th>Answer verified</th><th>Clues at V2</th><th>Publishable</th></tr></thead><tbody>%(rows)s</tbody></table>
<p>The full audits, bibliography and registry of 19 candidate topics are in the repository under <code>docs/pack/</code>.</p></section>
</main></body></html>""" % dict(css=CSS, layers="".join(layers), v2=n_v2_target, pub=n_pub, c0=", ".join(map(str, c0sizes)),
                                   cases="\n".join(case_html(c) for c in D.CASES), rows=aud_rows)
w("case-sheets.html", page)
print("built; errors=%d warnings=%d targetV2=%d publishable=%d" % (len(REP["errors"]), len(REP["warnings"]), n_v2_target, n_pub))
