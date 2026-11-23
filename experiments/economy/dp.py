"""Exact dynamic-programming analysis of the Daily Ten economy (Stage 2).

Everything here is EXACT (no sampling) unless a function says Monte Carlo.

Model assumptions (each one is a limitation; see docs/ECONOMY_EXPERIMENT.md):
  M1  Cases are independent. Only the Insight bank links them.
  M2  After the free dossier a case has k candidate years and the target is uniform over them.
      (The dossier is free reading, not an action. Its output is k.)
  M3  A paid clue is an authored window of w consecutive years that contains the target. For a target
      uniform over k candidates, the window start is uniform among starts that contain the target.
      This makes the posterior uniform over (candidates INTERSECT window), so the state is just k.
  M4  Refund-on-redundant: a clue that removes nothing from the current candidates costs nothing.
      You still need the listed price available to attempt it.
  M5  A Trace at a candidate year returns earlier / later / same, at a fixed price.
  M6  Lock is free. In sequential mode a wrong Lock removes only that year (kept at an interval end).
  M7  Chance-only play inside the residual set. No player skill beyond the dossier is modelled,
      so results are LOWER BOUNDS on what a reasoning player can do.
Channels of the value vector: 0 score, 1 solved cases, 2 clean solves, 3 Trace uses, 4 Evidence reveals,
5 Insight left at end of day.
"""
import math
from collections import defaultdict
from functools import lru_cache

NCH = 6
ZERO = (0.0,) * NCH
EPS = 1e-12
SCORES = {"solved": (1.0, 0.0, 0.0), "S1": (100.0, 10.0, 5.0)}  # (per solve, per clean solve, per Insight left)


def vadd(a, b):
    return tuple(x + y for x, y in zip(a, b))


def vsc(a, p):
    return tuple(x * p for x in a)


@lru_cache(maxsize=None)
def window_outcomes(k, w):
    """Window of width w, target uniform over k candidates, start uniform among starts containing it.
    Returns (q_redundant, ((prob_given_informative, new_size), ...))."""
    total = k * w
    red = 0.0
    agg = defaultdict(float)
    for s in range(-(w - 1), k):
        a, b = max(0, s), min(k - 1, s + w - 1)
        size = b - a + 1
        wt = size / total
        if size == k:
            red += wt
        else:
            agg[size] += wt
    nonred = 1.0 - red
    if nonred < EPS:
        return red, ()
    return red, tuple((p / nonred, sz) for sz, p in sorted(agg.items()))


class Spec:
    def __init__(self, n, clues, universe=30):
        self.n = n                # candidates left after the free dossier
        self.clues = clues        # list of (cost, width)
        self.universe = universe  # starting corridor size, for the random-guesser baseline


def make_spec(n, var):
    """Authors add a clue only when it can be informative. Widths aim at about 1 bit (Nudge) and 2 bits (Deep)."""
    if var.get("menu") == "equal":
        # authored so the first Nudge adds about +0.20 solve probability and the first Deep about +0.40, at any n
        nudge_w = max(1, min(n - 1, round(1.0 / (1.0 / n + 0.20))))
        deep_w = max(1, min(n - 1, round(1.0 / (1.0 / n + 0.40))))
    else:
        nudge_w = max(1, round(n / 2))
        deep_w = max(1, round(n / 4))
    nc, dc = var.get("nudge", 1), var.get("deep", 2)
    if n <= 3:
        clues = [(nc, nudge_w)]
    elif n <= 6:
        clues = [(nc, nudge_w), (dc, deep_w)]
    else:
        clues = [(nc, nudge_w), (nc, nudge_w), (dc, deep_w)]
    if var.get("no_evidence"):
        clues = []
    return Spec(n, clues, var.get("universe", 30))


def actions(spec, var, st, allow_spend=True):
    k, ins, locks, mask, tu = st
    acts = [("lock",)]
    if not allow_spend or k < 2:
        return acts
    sc_cap = var.get("spend_cap")
    for idx, (cost, w) in enumerate(spec.clues):
        if not (mask >> idx) & 1 and ins >= cost and (sc_cap is None or tu + cost <= sc_cap):
            acts.append(("ev", idx))
    tau = var.get("tau")
    cap = var.get("tcap_case")
    if tau is not None and ins >= tau and (sc_cap is None or tu + tau <= sc_cap) and (cap is None or sc_cap is not None or tu < cap):
        for j in range(0, (k - 1) // 2 + 1):
            acts.append(("tr", j))
    return acts


def expand(spec, var, st, act):
    """Return (outcomes, counter_vector). outcomes: list of (p, 'state', next_state) or (p, 'term', (ins, solved, clean))."""
    k, ins, locks, mask, tu = st
    L = var["locks"]
    typ = act[0]
    if typ == "lock":
        if var.get("seq", True):
            out = [(1.0 / k, "term", (ins, 1, 1 if locks == L else 0, 0 if locks == L else 1))]
            if k > 1:
                if locks - 1 == 0:
                    out.append(((k - 1.0) / k, "term", (ins, 0, 0, 0)))
                else:
                    out.append(((k - 1.0) / k, "state", (k - 1, ins, locks - 1, mask, tu)))
        else:  # batched: all Locks committed together, no feedback in between
            kk = min(locks, k)
            out = [(1.0 / k, "term", (ins, 1, 1, 0))]
            if kk > 1:
                out.append(((kk - 1.0) / k, "term", (ins, 1, 0, 1)))
            if k > kk:
                out.append(((k - kk) / float(k), "term", (ins, 0, 0, 0)))
        return out, ZERO
    if typ == "tr":
        j, tau = act[1], var["tau"]
        inc = tau if var.get("spend_cap") is not None else 1
        out = []
        if j >= 1:
            out.append((j / k, "state", (j, ins - tau, locks, mask, tu + inc)))
        if k - 1 - j >= 1:
            out.append(((k - 1 - j) / k, "state", (k - 1 - j, ins - tau, locks, mask, tu + inc)))
        out.append((1.0 / k, "state", (1, ins - tau, locks, mask, tu + inc)))
        return out, (0, 0, 0, 1, 0, 0)
    idx = act[1]
    cost, w = spec.clues[idx]
    red, outs = window_outcomes(k, w)
    bit = 1 << idx
    out = []
    if red > EPS:
        out.append((red, "state", (k, ins, locks, mask | bit, tu)))
    inc = cost if var.get("spend_cap") is not None else 0
    for p, sz in outs:
        out.append(((1.0 - red) * p, "state", (sz, ins - cost, locks, mask | bit, tu + inc)))
    return out, (0, 0, 0, 0, 1, 0)


def solve_case(spec, var, wplan, wtrue, mode, sc, allow_spend=True):
    """wplan: scalar continuation used for DECISIONS. wtrue: vector continuation used for VALUE.
    mode: 'exp' expected value, 'worst' adversarial guarantee, 'best' oracle luck."""
    ws, wc, wl = sc
    frac = var.get("second_frac", 1.0)   # credit for a solve on a later Lock, as a fraction of a first-Lock solve
    memo = {}

    def term(ins, solved, clean, late=0):
        rew = ws * solved + wc * clean - ws * (1.0 - frac) * late
        t = wtrue[ins]
        return rew + wplan[ins], (rew + t[0], solved + t[1], clean + t[2], t[3], t[4], t[5])

    def agg(items):
        if mode == "exp":
            vp = sum(p * a for p, a, _ in items)
            vt = ZERO
            for p, _, b in items:
                vt = vadd(vt, vsc(b, p))
            return vp, vt
        pick = (min if mode == "worst" else max)(items, key=lambda it: (it[1], it[2][1]))
        return pick[1], pick[2]

    def rec(k, ins, locks, mask, tu):
        key = (k, ins, locks, mask, tu)
        if key in memo:
            return memo[key]
        best = None
        for act in actions(spec, var, key, allow_spend):
            outs, ctr = expand(spec, var, key, act)
            items = []
            for p, kind, payload in outs:
                if kind == "term":
                    vp, vt = term(*payload)
                else:
                    r = rec(*payload)
                    vp, vt = r[0], r[1]
                items.append((p, vp, vt))
            vp, vt = agg(items)
            vt = vadd(vt, ctr)
            if best is None or vp > best[0] + EPS:
                best = (vp, vt, act)
        memo[key] = best
        return best

    table = {}
    for b in range(len(wplan)):
        r = rec(spec.n, b, var["locks"], 0, 0)
        table[b] = r
    return table, memo


def solve_day(pack, var, mode="exp", score="S1", plan="opt", allow_spend=True, pk=0.0, bank=None):
    """pack: list of residual sizes. plan: 'opt' (plans with true future value) or 'myopic' (ignores the future)."""
    sc = (SCORES[score] if isinstance(score, str) else tuple(score)) if mode == "exp" else SCORES["solved"]
    ws, wc, wl = sc if mode == "exp" else (1.0, 0.0, 0.0)
    bank = var["bank"] if bank is None else bank
    n_cases = var.get("ncases", len(pack))
    pack = pack[:n_cases]
    wl_eff = wl if mode == "exp" else 0.0
    wtrue = {b: (wl_eff * b, 0, 0, 0, 0, b) for b in range(bank + 1)}
    wplan = {b: (wl_eff * b if plan == "opt" else 0.0) for b in range(bank + 1)}
    memos = [None] * len(pack)
    prior_tables = None
    if plan == "prior":
        # The player knows the DISTRIBUTION of later case sizes (the pack's own multiset) but not their order.
        prior_tables = [None] * (len(pack) + 1)
        prior_tables[len(pack)] = {b: wl_eff * b for b in range(bank + 1)}
        for j in range(len(pack) - 1, -1, -1):
            acc = {b: 0.0 for b in range(bank + 1)}
            t = prior_tables[j + 1]
            dummy = {b: (t[b], 0, 0, 0, 0, b) for b in t}
            for m in pack:
                table, _ = solve_case(make_spec(m, var), var, t, dummy, "exp", (ws, wc, wl_eff), allow_spend)
                for b in acc:
                    acc[b] += table[b][0] / len(pack)
            prior_tables[j] = acc
    for i in range(len(pack) - 1, -1, -1):
        spec = make_spec(pack[i], var)
        if prior_tables is not None:
            wplan = prior_tables[i + 1]
        table, memo = solve_case(spec, var, wplan, wtrue, mode, (ws, wc, wl_eff), allow_spend)
        memos[i] = memo
        newt, newp = {}, {}
        for b in range(bank + 1):
            vp, vt, _ = table[b]
            if pk > 0:
                known = (ws + wc + wtrue[b][0], 1 + wtrue[b][1], 1 + wtrue[b][2], wtrue[b][3], wtrue[b][4], wtrue[b][5])
                kp = ws + wc + wplan[b]
                vt = vadd(vsc(vt, 1 - pk), vsc(known, pk))
                vp = (1 - pk) * vp + pk * kp
            newt[b] = vt
            newp[b] = vp if plan == "opt" else 0.0
        wtrue, wplan = newt, newp
        if prior_tables is not None:
            wplan = prior_tables[i]
    return {"value": wtrue[bank], "memos": memos, "specs": [make_spec(n, var) for n in pack]}


def eval_rule(pack, var, rule, score="S1", pk=0.0):
    """Exact value of a fixed decision rule (no optimisation). rule(spec, var, state, acts) -> action in acts."""
    sc = SCORES[score] if isinstance(score, str) else tuple(score)
    ws, wc, wl = sc
    bank = var["bank"]
    pack = pack[:var.get("ncases", len(pack))]
    W = {b: (wl * b, 0, 0, 0, 0, b) for b in range(bank + 1)}
    for i in range(len(pack) - 1, -1, -1):
        spec = make_spec(pack[i], var)
        memo = {}

        def rec(k, ins, locks, mask, tu):
            key = (k, ins, locks, mask, tu)
            if key in memo:
                return memo[key]
            acts = actions(spec, var, key, True)
            act = rule(spec, var, key, acts)
            outs, ctr = expand(spec, var, key, act)
            vt = ZERO
            for p, kind, payload in outs:
                if kind == "term":
                    insx, solved, clean, late = payload
                    rew = ws * solved + wc * clean - ws * (1.0 - var.get("second_frac", 1.0)) * late
                    t = W[insx]
                    v = (rew + t[0], solved + t[1], clean + t[2], t[3], t[4], t[5])
                else:
                    v = rec(*payload)
                vt = vadd(vt, vsc(v, p))
            memo[key] = vadd(vt, ctr)
            return memo[key]

        newW = {}
        for b in range(bank + 1):
            vt = rec(spec.n, b, var["locks"], 0, 0)
            if pk > 0:
                t = W[b]
                known = (ws + wc + t[0], 1 + t[1], 1 + t[2], t[3], t[4], t[5])
                vt = vadd(vsc(vt, 1 - pk), vsc(known, pk))
            newW[b] = vt
        W = newW
    return W[bank]


# ---- fixed decision rules used as baselines -----------------------------------------------------------
def rule_zero(spec, var, st, acts):
    return ("lock",)


def rule_trace_first(spec, var, st, acts):
    k, ins, locks, mask, tu = st
    if k <= locks:
        return ("lock",)
    trs = [a for a in acts if a[0] == "tr"]
    if trs:
        return ("tr", (k - 1) // 2) if ("tr", (k - 1) // 2) in trs else trs[-1]
    return ("lock",)


def rule_clue_first(spec, var, st, acts):
    k, ins, locks, mask, tu = st
    if k <= locks:
        return ("lock",)
    evs = [a for a in acts if a[0] == "ev"]
    if evs:
        return min(evs, key=lambda a: spec.clues[a[1]][0])
    trs = [a for a in acts if a[0] == "tr"]
    if trs:
        return ("tr", (k - 1) // 2) if ("tr", (k - 1) // 2) in trs else trs[-1]
    return ("lock",)


# ---- Monte Carlo cross-check (seeded) -----------------------------------------------------------------
def simulate(result, var, rng, n_days=20000, score="S1"):
    """Follow the stored optimal policy on sampled days, using the explicit generative process of M3."""
    ws, wc, wl = SCORES[score]
    specs, memos = result["specs"], result["memos"]
    bank0, L = var["bank"], var["locks"]
    tau = var.get("tau")
    stats = defaultdict(float)
    sq = defaultdict(float)
    per_case_spend = [0.0] * len(specs)
    bank_at_start = [0.0] * len(specs)
    empty_at_start = [0.0] * len(specs)
    for _ in range(n_days):
        ins, solved, clean, tr, ev, score_total, late = bank0, 0, 0, 0, 0, 0.0, 0
        for i, spec in enumerate(specs):
            n = spec.n
            T = rng.randrange(n)
            lo, hi = 0, n - 1
            starts = [rng.randint(T - w + 1, T) for (_, w) in spec.clues]
            locks, mask, tu = L, 0, 0
            start_ins = ins
            bank_at_start[i] += ins
            empty_at_start[i] += 1 if ins == 0 else 0
            while True:
                k = hi - lo + 1
                act = memos[i][(k, ins, locks, mask, tu)][2]
                if act[0] == "lock":
                    if var.get("seq", True):
                        if T == lo:
                            solved += 1
                            clean += 1 if locks == L else 0
                            late += 0 if locks == L else 1
                            break
                        lo += 1
                        locks -= 1
                        if locks == 0:
                            break
                    else:
                        kk = min(locks, k)
                        if T - lo < kk:
                            solved += 1
                            clean += 1 if T == lo else 0
                            late += 0 if T == lo else 1
                        break
                elif act[0] == "tr":
                    y = lo + act[1]
                    ins -= tau
                    tr += 1
                    tu += tau if var.get("spend_cap") is not None else 1
                    if T < y:
                        hi = y - 1
                    elif T > y:
                        lo = y + 1
                    else:
                        lo = hi = y
                else:
                    idx = act[1]
                    cost, w = spec.clues[idx]
                    mask |= 1 << idx
                    ev += 1
                    a, b = max(lo, starts[idx]), min(hi, starts[idx] + w - 1)
                    if not (a == lo and b == hi):
                        ins -= cost
                        tu += cost if var.get("spend_cap") is not None else 0
                        lo, hi = a, b
                assert lo <= T <= hi, "invariant broken: target left the candidate set"
            per_case_spend[i] += start_ins - ins
        sc_total = ws * solved + wc * clean - ws * (1.0 - var.get("second_frac", 1.0)) * late + wl * ins
        for name, val in (("score", sc_total), ("solved", solved), ("clean", clean), ("trace", tr), ("ev", ev), ("left", ins)):
            stats[name] += val
            sq[name] += val * val
    out = {}
    for name in stats:
        m = stats[name] / n_days
        var_ = max(0.0, sq[name] / n_days - m * m)
        out[name] = (m, 1.96 * math.sqrt(var_ / n_days))
    out["spend_by_case"] = [s / n_days for s in per_case_spend]
    out["bank_at_start"] = [s / n_days for s in bank_at_start]
    out["p_empty_at_start"] = [s / n_days for s in empty_at_start]
    return out


# ---- exact guarantee for Trace-only play (the earlier 11/31 bound) -------------------------------------
@lru_cache(maxsize=None)
def trace_only_ceiling(T, L):
    """Most years any strategy can guarantee to win with T Traces and L Locks (equality counts)."""
    if T == 0:
        return L
    if L == 0:
        return 0
    return max(1 + trace_only_ceiling(T, L - 1), 1 + 2 * trace_only_ceiling(T - 1, L))
