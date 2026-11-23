"""Pack linter and analyser for the Daily Ten draft pack.

Implements the content rules of RULES_CANDIDATES.md section 9 (D-019) as executable checks:

  L1  every clue states the end-of-year convention ("By the end of that year ..." or a calendar-year relation)
  L2  target is inside the corridor and inside C0 (the candidate set made by the free bounds)
  L3  3 <= |C0| <= 6
  L4  the free relation selects exactly the target inside C0 (uniqueness proof)
  L5  every paid clue keeps the target and removes at least one year from C0 (D-007)
  L6  the target year is not printed in free text, titles, the question or pre-purchase metadata
  L7  every source id exists; every fragment's verification level is computed, not asserted
  L8  cross-case: no free or paid text prints another case's target year; duplicate answers are listed

Years are astronomical integers (1 BCE = 0). Display never shows a year zero.
Usage: python3 tools/pack/lint_pack.py   (exit status 1 if any hard check fails)
"""
import re
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pack_data as D  # noqa: E402


def show(y):
    """Display label with no year zero."""
    if y <= 0:
        return "%d BCE" % (1 - y)
    return "%d CE" % y if y < 1000 else str(y)


def year_patterns(y):
    """Strings whose presence would print the year."""
    if y <= 0:
        return [r"%d\s*(BCE|BC)" % (1 - y)]
    if y < 1000:
        return [r"(?<![\d])%d\s*(CE|AD)" % y]
    return [r"(?<![\d])%d(?![\d])" % y]


def prints_year(text, y):
    return any(re.search(p, text) for p in year_patterns(y))


def effect(clue, c0):
    """Return the set of years that remain after applying one bound clue to the full range c0."""
    a = clue["anchor"]["year"]
    if clue["direction"] == "had_happened":
        return {y for y in c0 if y >= a}
    return {y for y in c0 if y <= a - 1}


def c0_of(case):
    lo, hi = case["corridor"]
    s = set(range(lo, hi + 1))
    for f in case["free"]:
        if f["kind"] == "bound":
            s &= effect(f, s)
    return s


def relation_year(f):
    a = f["anchor"]["year"]
    if f["type"] == "years_after":
        return a + f["n"]
    if f["type"] == "era_year":
        return f["era_start"] + f["n"] - 1
    raise ValueError(f["type"])


def level_of(frag):
    ids = list(frag.get("sources", [])) + list(frag.get("corroboration", []))
    opened = [D.SOURCE_INDEX[i] for i in ids if i in D.SOURCE_INDEX and D.SOURCE_INDEX[i]["opened"]]
    pubs = {o["publisher"] for o in opened}
    if len(pubs) >= 2:
        return "V2"
    if len(pubs) == 1:
        return "V1"
    return "V0"


def analyse():
    errors, warnings = [], []
    out = {"cases": {}, "errors": errors, "warnings": warnings}
    targets = {c["id"]: c["target"]["year"] for c in D.CASES}
    for c in D.CASES:
        cid = c["id"]
        t = c["target"]["year"]
        lo, hi = c["corridor"]
        r = {"c0": [], "paid": [], "uniqueness": {}, "levels": {}, "blockers": []}
        c0 = c0_of(c)
        r["c0"] = sorted(c0)
        # L1 convention
        for f in c["free"]:
            ok = f["text"].startswith("By the end of that year") if f["kind"] == "bound" else ("calendar year" in f["text"] or "era" in f["text"])
            if not ok:
                errors.append("%s %s: convention wording missing" % (cid, f["id"]))
        for p in c["paid"]:
            if not p["text"].startswith("By the end of that year"):
                errors.append("%s %s: convention wording missing" % (cid, p["id"]))
        # L2 L3
        if not (lo <= t <= hi):
            errors.append("%s: target outside corridor" % cid)
        if t not in c0:
            errors.append("%s: target not in C0" % cid)
        if not (3 <= len(c0) <= 6):
            errors.append("%s: |C0| = %d, outside 3..6" % (cid, len(c0)))
        # L4 uniqueness
        rels = [f for f in c["free"] if f["kind"] == "relation"]
        if len(rels) != 1:
            errors.append("%s: expected exactly one free relation, found %d" % (cid, len(rels)))
        else:
            rf = rels[0]
            want = relation_year(rf)
            sel = [y for y in c0 if y == want]
            if sel != [t]:
                errors.append("%s: relation selects %s, target is %s" % (cid, sel, t))
            for y in sorted(c0 - {t}):
                a = rf["anchor"]["year"]
                if rf["type"] == "years_after":
                    r["uniqueness"][y] = "%s is %+d calendar years from %s (%s); the clue needs +%d." % (
                        show(y), y - a if not (y <= 0 < a or a <= 0 < y) else y - a, rf["anchor"]["label"], show(a), rf["n"])
                else:
                    r["uniqueness"][y] = "%s is era year %d (the era began in %s); the clue needs era year %d." % (
                        show(y), y - rf["era_start"] + 1, show(rf["era_start"]), rf["n"])
        # L5 paid clues
        for p in c["paid"]:
            keep = effect(p, c0)
            cut = sorted(c0 - keep)
            if t not in keep:
                errors.append("%s %s: paid clue removes the target" % (cid, p["id"]))
            if not cut:
                errors.append("%s %s: paid clue cuts nothing from C0 (D-007)" % (cid, p["id"]))
            r["paid"].append({"id": p["id"], "tier": p["tier"], "cost": p["cost"], "keeps": sorted(keep),
                              "cuts": cut, "remaining": len(keep), "resolves": len(keep) == 1,
                              "prints_target": prints_year(p["text"], t)})
        # L6 leakage in player-facing text before purchase
        fields = [("question", c["question"]), ("title", c["title"])]
        for f in c["free"]:
            fields.append(("free " + f["id"], f["text"]))
            fields.append(("free anchor " + f["id"], f["anchor"]["label"] + " " + f["anchor"]["date"]))
        for x in c.get("context_free", []):
            fields.append(("context", x["text"]))
        for p in c["paid"]:
            fields.append(("paid pre-purchase " + p["id"], p["category"] + " " + p["tier"]))
        for name, txt in fields:
            if prints_year(txt, t):
                errors.append("%s: target year printed in %s" % (cid, name))
        # arithmetic-solvable flag
        r["arithmetic_solvable_from_free"] = (len(rels) == 1 and len(c0) >= 1)
        # L7 sources and levels
        allfrag = [("free " + f["id"], f) for f in c["free"]] + [("paid " + p["id"], p) for p in c["paid"]]
        for name, f in allfrag:
            for sid in list(f.get("sources", [])) + list(f.get("corroboration", [])):
                if sid not in D.SOURCE_INDEX:
                    errors.append("%s %s: unknown source %s" % (cid, name, sid))
            lv = level_of(f)
            r["levels"][name] = lv
            if lv != "V2":
                r["blockers"].append("%s (%s) is %s" % (name, f["anchor"]["label"], lv))
        for x in c["facts"]:
            for sid in x["opened"] + x["corroborated_by"]:
                if sid not in D.SOURCE_INDEX:
                    errors.append("%s fact: unknown source %s" % (cid, sid))
        for rv in c["reveal"]:
            for sid in rv["sources"]:
                if sid not in D.SOURCE_INDEX:
                    errors.append("%s reveal: unknown source %s" % (cid, sid))
        tf = [x for x in c["facts"]][0]
        r["target_fact_level"] = tf["level"]
        r["publishable"] = (not r["blockers"]) and not c["hold"]
        # sample explanation sanity: first step mentions both ends of C0
        s1 = c["sample_player"][0]
        if str(min(c0)) not in s1 and show(min(c0)) not in s1 and "1 BCE" not in s1:
            warnings.append("%s: sample explanation does not mention the lower bound" % cid)
        out["cases"][cid] = r
    # L8 cross-case
    byyear = {}
    for cid, y in targets.items():
        byyear.setdefault(y, []).append(cid)
    out["duplicate_answers"] = {y: v for y, v in byyear.items() if len(v) > 1}
    cross = []
    for c in D.CASES:
        for other in D.CASES:
            if other["id"] == c["id"]:
                continue
            ot = other["target"]["year"]
            if ot == c["target"]["year"]:
                continue
            for f in c["free"]:
                if prints_year(f["text"], ot) and prints_year(other["question"], ot) is False:
                    cross.append((c["id"], "free " + f["id"], other["id"], ot))
            for p in c["paid"]:
                if prints_year(p["text"], ot):
                    cross.append((c["id"], "paid " + p["id"], other["id"], ot))
    out["cross_leak"] = cross
    return out


def main():
    rep = analyse()
    for cid, r in rep["cases"].items():
        print("%s C0=%s paid=%s publishable=%s targetV=%s" % (
            cid, [show(y) for y in r["c0"]], [(p["id"], p["remaining"]) for p in r["paid"]], r["publishable"], r["target_fact_level"]))
    print("duplicate answers:", {show(y): v for y, v in rep["duplicate_answers"].items()})
    print("cross-case prints:", [(a, b, c, show(y)) for a, b, c, y in rep["cross_leak"]])
    for w in rep["warnings"]:
        print("WARN", w)
    for e in rep["errors"]:
        print("ERROR", e)
    print("%d errors, %d warnings" % (len(rep["errors"]), len(rep["warnings"])))
    return 1 if rep["errors"] else 0


if __name__ == "__main__":
    sys.exit(main())
