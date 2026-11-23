"""Builds docs/economy/figures.html and state-machine.html from results.json. Screenshots are taken by shoot.js."""
import json
import os

HERE = os.path.dirname(__file__)
OUT = os.path.join(HERE, "..", "..", "docs", "economy")
R = json.load(open(os.path.join(OUT, "results.json")))

BONE, PAPER, COAL, VERM, PAT, GREY, RULE, MUT = "#F2ECE0", "#FBF7EF", "#241F1B", "#B4412D", "#526A57", "#A9A194", "#BDB3A1", "#675F55"
HEAD = """<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Sofia+Sans:wght@400;600;700&display=block" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:%s;font-family:'Sofia Sans',sans-serif;color:%s}svg text{font-family:'Sofia Sans',sans-serif}</style></head><body>""" % (BONE, COAL)


def t(x, y, s, size=14, w=400, fill=COAL, anchor="start", extra=""):
    return '<text x="%s" y="%s" font-size="%s" font-weight="%s" fill="%s" text-anchor="%s" %s>%s</text>' % (x, y, size, w, fill, anchor, extra, s)


def rect(x, y, w, h, fill, stroke="none", sw=1, extra=""):
    return '<rect x="%s" y="%s" width="%s" height="%s" fill="%s" stroke="%s" stroke-width="%s" %s/>' % (x, y, w, h, fill, stroke, sw, extra)


def line(x1, y1, x2, y2, stroke=COAL, sw=1.5, extra=""):
    return '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-width="%s" %s/>' % (x1, y1, x2, y2, stroke, sw, extra)


# ---------------------------------------------------------------------------------------------------- figure
def panel_frame(x, y, w, h, title, sub):
    return rect(x, y, w, h, PAPER, RULE, 1) + t(x + 18, y + 30, title, 20, 700) + t(x + 18, y + 50, sub, 13.5, 400, MUT)


def fig():
    W, H = 1500, 1040
    s = [rect(0, 0, W, H, BONE)]
    s.append(t(40, 52, "Daily Ten economy: what the exact solver says", 30, 700, COAL, extra='style="font-family:\'Young Serif\',serif;font-weight:400"'))
    s.append(t(40, 78, "Chance-only model of play inside the free dossier. Packs are assumed shapes, not real content. All values are exact except where marked.", 15, 400, MUT))

    # (a) variants x packs
    x0, y0, w, h = 40, 100, 720, 440
    s.append(panel_frame(x0, y0, w, h, "A. Solved cases out of 10, by rule variant", "Realistic planner, 8 Insight. Grey = no spending at all."))
    variants = [("chance", "A  one Lock, Trace 2", GREY, "chance_solved"), ("A one Lock", "A  one Lock, Trace 2", COAL, "solved"),
                ("C no Trace", "C  Evidence-first, no Trace", PAT, "solved"), ("B two Locks", "B  two Locks in turn, Trace 2", VERM, "solved"),
                ("E two together", "E  two Locks committed together", "#C98C79", "solved")]
    ax, ay, aw, ah = x0 + 60, y0 + 90, w - 90, h - 160
    for v in range(0, 11, 2):
        yy = ay + ah - v / 10.0 * ah
        s.append(line(ax, yy, ax + aw, yy, RULE, 1))
        s.append(t(ax - 10, yy + 5, v, 13, 600, MUT, "end"))
    gw = aw / 3.0
    for gi, pk in enumerate(("Gentle", "Mixed", "Steep")):
        bw = (gw - 30) / len(variants)
        for bi, (lab, key, col, field) in enumerate(variants):
            val = R["e1"][pk][key][field]
            bx = ax + gi * gw + 15 + bi * bw
            bh = val / 10.0 * ah
            s.append(rect(bx, ay + ah - bh, bw - 4, bh, col))
            s.append(t(bx + (bw - 4) / 2, ay + ah - bh - 6, "%.1f" % val, 12.5, 700, COAL, "middle"))
        s.append(t(ax + gi * gw + gw / 2, ay + ah + 24, pk, 15, 700, COAL, "middle"))
    lx = x0 + 70
    for lab, key, col, field in variants:
        s.append(rect(lx, y0 + h - 34, 14, 14, col))
        s.append(t(lx + 20, y0 + h - 22, lab, 13, 600))
        lx += 24 + len(lab) * 7.4

    # (b) return per Insight
    x1 = 780
    s.append(panel_frame(x1, y0, 680, h, "B. What the first Insight buys", "Gain in solve probability per Insight, one Lock. Trace is the best split at price 2."))
    bx0, by0, bw_, bh_ = x1 + 60, y0 + 80, 580, h - 170
    for v in (0, 0.1, 0.2, 0.3, 0.4, 0.5):
        yy = by0 + bh_ - v / 0.5 * bh_
        s.append(line(bx0, yy, bx0 + bw_, yy, RULE, 1))
        s.append(t(bx0 - 10, yy + 5, "%.1f" % v, 13, 600, MUT, "end"))
    ns = list(range(2, 15))

    def X(n):
        return bx0 + (n - 2) / 12.0 * bw_

    def Y(v):
        return by0 + bh_ - v / 0.5 * bh_
    for n in ns:
        s.append(t(X(n), by0 + bh_ + 22, n, 13, 600, MUT, "middle"))
    s.append(t(bx0 + bw_ / 2, by0 + bh_ + 42, "candidates left after the free dossier (n)", 13.5, 600, MUT, "middle"))

    def series(vals, col, dash="", label=None, ly=0):
        pts = [(X(n), Y(v)) for n, v in vals if v is not None]
        s.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="3" %s/>' % (" ".join("%.1f,%.1f" % p for p in pts), col, ('stroke-dasharray="%s"' % dash) if dash else ""))
        for p in pts:
            s.append('<circle cx="%.1f" cy="%.1f" r="3.5" fill="%s"/>' % (p[0], p[1], col))
    nud = [(n, R["e10"][str(n)]["half"][0][1]) for n in ns]
    deep = [(n, R["e10"][str(n)]["half"][1][1] if len(R["e10"][str(n)]["half"]) > 1 else None) for n in ns]
    neq = [(n, R["e10"][str(n)]["equal"][0][1]) for n in ns]
    trc = [(n, (1.0 / n) if n >= 3 else 0.0) for n in ns]
    series(nud, COAL)
    series(deep, PAT, "6 4")
    series(neq, VERM, "2 5")
    series(trc, GREY)
    items = [("Nudge, 1 Insight", COAL, ""), ("Deep, 2 Insight", PAT, "6 4"), ("Nudge, equalised menu", VERM, "2 5"), ("Trace, 2 Insight", GREY, "")]
    lx = x1 + 40
    for lab, col, dash in items:
        s.append(line(lx, y0 + h - 14, lx + 22, y0 + h - 14, col, 3, ('stroke-dasharray="%s"' % dash) if dash else ""))
        s.append(t(lx + 28, y0 + h - 9, lab, 13, 600))
        lx += 44 + len(lab) * 6.6

    # (c) where Insight goes
    y1 = 570
    s.append(panel_frame(40, y1, 720, 440, "C. Where the Insight goes (Mixed pack, one Lock)", "Mean Insight spent per case by the realistic planner. Simulated, seed 20261122."))
    sp = R["e9"]["Mixed"]["spend"]
    ns_pack = [2, 3, 3, 4, 5, 6, 6, 8, 8, 10]
    cx0, cy0, cw, ch = 40 + 60, y1 + 80, 620, 250
    for v in (0, 1, 2):
        yy = cy0 + ch - v / 2.2 * ch
        s.append(line(cx0, yy, cx0 + cw, yy, RULE, 1))
        s.append(t(cx0 - 10, yy + 5, v, 13, 600, MUT, "end"))
    bw = cw / 10.0
    for i in range(10):
        hh = sp[i] / 2.2 * ch
        s.append(rect(cx0 + i * bw + 8, cy0 + ch - hh, bw - 16, hh, COAL if sp[i] > 0.01 else RULE))
        s.append(t(cx0 + i * bw + bw / 2, cy0 + ch - hh - 8, "%.1f" % sp[i], 13, 700, COAL, "middle"))
        s.append(t(cx0 + i * bw + bw / 2, cy0 + ch + 22, i + 1, 14, 700, COAL, "middle"))
        s.append(t(cx0 + i * bw + bw / 2, cy0 + ch + 42, "n=%d" % ns_pack[i], 12.5, 400, MUT, "middle"))
    s.append(t(40 + 360, y1 + 90 + ch + 66, "case number, and candidates left", 13.5, 600, MUT, "middle"))
    s.append(t(40 + 360, y1 + 90 + ch + 90, "Cases 6 to 9 get no Insight. The bank is gone by case 6.", 14.5, 700, VERM, "middle"))

    # (d) dossier sweep
    s.append(panel_frame(780, y1, 680, 440, "D. How uncertain should a dossier leave a case?", "Ten identical cases, one Lock. Solved cases out of 10."))
    dx0, dy0, dw, dh = 780 + 60, y1 + 90, 580, 260
    for v in range(0, 11, 2):
        yy = dy0 + dh - v / 10.0 * dh
        s.append(line(dx0, yy, dx0 + dw, yy, RULE, 1))
        s.append(t(dx0 - 10, yy + 5, v, 13, 600, MUT, "end"))
    e4 = R["e4"]

    def DX(n):
        return dx0 + (n - 2) / 10.0 * dw

    def DY(v):
        return dy0 + dh - v / 10.0 * dh
    for n in range(2, 13):
        s.append(t(DX(n), dy0 + dh + 22, n, 13, 600, MUT, "middle"))
    for key, col, dash in (("chance", GREY, ""), ("naive", PAT, "6 4"), ("opt", COAL, "")):
        pts = " ".join("%.1f,%.1f" % (DX(n), DY(e4[str(n)][key])) for n in range(2, 13))
        s.append('<polyline points="%s" fill="none" stroke="%s" stroke-width="3" %s/>' % (pts, col, ('stroke-dasharray="%s"' % dash) if dash else ""))
    s.append(t(dx0 + dw / 2, dy0 + dh + 44, "candidates left per case (n)", 13.5, 600, MUT, "middle"))
    lx = 780 + 70
    for lab, col, dash in (("chance only", GREY, ""), ("naive spender", PAT, "6 4"), ("best plan", COAL, "")):
        s.append(line(lx, y1 + 440 - 27, lx + 26, y1 + 440 - 27, col, 3, ('stroke-dasharray="%s"' % dash) if dash else ""))
        s.append(t(lx + 32, y1 + 440 - 22, lab, 13, 600))
        lx += 60 + len(lab) * 7.4
    return HEAD + '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">%s</svg></body></html>' % (W, H, W, H, "".join(s))


# ---------------------------------------------------------------------------------------------------- state machine
def box(x, y, w, h, title, sub="", fill=PAPER, stroke=COAL, tcol=COAL):
    out = [rect(x, y, w, h, fill, stroke, 1.6)]
    out.append(t(x + w / 2, y + (24 if sub else h / 2 + 5), title, 15.5, 700, tcol, "middle"))
    if sub:
        for i, ln in enumerate(sub.split("|")):
            out.append(t(x + w / 2, y + 44 + i * 17, ln, 13, 400, MUT if tcol == COAL else "#F2ECE0", "middle"))
    return "".join(out)


def arrow(x1, y1, x2, y2, label="", col=COAL, dash=""):
    return (line(x1, y1, x2, y2, col, 2, ('stroke-dasharray="%s"' % dash) if dash else "") +
            '<polygon points="%s" fill="%s"/>' % (_head(x1, y1, x2, y2), col) +
            (t((x1 + x2) / 2 + 6, (y1 + y2) / 2 - 6, label, 13, 600, col) if label else ""))


def _head(x1, y1, x2, y2, s=9):
    import math
    a = math.atan2(y2 - y1, x2 - x1)
    p1 = (x2, y2)
    p2 = (x2 - s * math.cos(a - 0.4), y2 - s * math.sin(a - 0.4))
    p3 = (x2 - s * math.cos(a + 0.4), y2 - s * math.sin(a + 0.4))
    return " ".join("%.1f,%.1f" % p for p in (p1, p2, p3))


def machine():
    W, H = 1500, 900
    s = [rect(0, 0, W, H, BONE)]
    s.append(t(40, 52, "One case: the state machine", 30, 700, COAL, extra='style="font-family:\'Young Serif\',serif;font-weight:400"'))
    s.append(t(40, 78, "C = the years still possible. The target is always in C. Anything refused costs nothing and changes nothing.", 15, 400, MUT))
    s.append(box(40, 120, 260, 70, "Case opens", "Free dossier read. C0 shown."))
    s.append(arrow(300, 155, 380, 155))
    s.append(box(380, 100, 300, 110, "Reasoning (free)", "Move the marker, read sources,|rule years in or out in your head.|Nothing here is charged."))
    # actions
    s.append(arrow(530, 210, 530, 270, "reveal"))
    s.append(box(380, 270, 300, 130, "Evidence: reveal clue j", "needs the listed price available|if it removes nothing: free|else C := C ∩ clue, pay price|then back to reasoning"))
    s.append(arrow(680, 155, 790, 155, "Trace"))
    s.append(box(790, 100, 330, 120, "Trace year y (only if kept)", "refused free if it cannot inform|earlier: C := years < y|later: C := years > y   same: C := {y}|then back to reasoning", fill=PAPER, stroke=GREY))
    s.append(line(380, 190, 340, 190, COAL, 2) + line(340, 190, 340, 510, COAL, 2) + arrow(340, 510, 380, 510))
    s.append(t(332, 345, "lock (any time)", 13, 600, COAL, "end"))
    s.append(box(380, 470, 300, 80, "Lock year y", "y must still be possible"))
    s.append(arrow(530, 550, 530, 600))
    # decision
    s.append('<polygon points="530,600 640,650 530,700 420,650" fill="%s" stroke="%s" stroke-width="1.6"/>' % (PAPER, COAL))
    s.append(t(530, 656, "y = target?", 15, 700, COAL, "middle"))
    s.append(arrow(640, 650, 780, 650, "yes", PAT))
    s.append(box(780, 610, 300, 80, "Solved", "clean if first Lock and no spend", fill=PAT, stroke=PAT, tcol="#F2ECE0"))
    s.append(arrow(420, 650, 300, 650, "no", VERM))
    s.append(box(40, 570, 260, 160, "Wrong Lock", "A: one Lock. Case is MISSED.|Answer and proof are revealed.|B: year y is removed, no direction.|Lock left: back to reasoning.|None left: MISSED."))
        # next
    s.append(arrow(930, 690, 930, 770))
    s.append(arrow(170, 730, 170, 770, "", VERM))
    s.append(box(40, 770, 1040, 80, "Next case", "Missed or solved, the day always continues. After case 10: the Daily Trail and the World Reveal."))
    # bank panel
    s.append(rect(1160, 100, 310, 750, PAPER, COAL, 1.6))
    s.append(t(1315, 138, "The daily bank", 20, 700, COAL, "middle"))
    for i, ln in enumerate(["8 Insight for all ten cases.", "Never negative. Never refilled.", "Spent only by Evidence (and", "Trace, if kept), never by", "navigation, Lock or rereading.", "", "One bank, ten independent cases:", "a miss in case 3 changes nothing", "about case 4 except what you", "chose to spend.", "", "Refused actions are atomic:", "no charge, no partial change.", "", "Saved after every action.", "Resuming restores the bank, every", "candidate set and every purchase.", "", "No double purchase.", "A clue already revealed is", "refused, not charged twice."]):
        s.append(t(1180, 178 + i * 24, ln, 14, 400, COAL))
    return HEAD + '<svg xmlns="http://www.w3.org/2000/svg" width="%d" height="%d" viewBox="0 0 %d %d">%s</svg></body></html>' % (W, H, W, H, "".join(s))


open(os.path.join(OUT, "figures.html"), "w").write(fig())
open(os.path.join(OUT, "state-machine.html"), "w").write(machine())
print("built figures.html and state-machine.html")
