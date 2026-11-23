"""Tests for the Stage 2 reference model and exact solver. Run:  python3 -m unittest -v   (from this folder)"""
import random
import unittest
from itertools import product

import model as M
import dp as D


def mk_case(cid, target, lo=1960, hi=1980, free=(), paid=(), locks=1):
    return M.Case(cid, range(lo, hi + 1), target, list(free), list(paid), locks_allowed=locks)


def mk_day(bank=8):
    c0 = mk_case("c0", 1969, free=[M.Clue("f", 0, 1965, 1975)],
                 paid=[M.Clue("a", 1, 1969, None, "m"), M.Clue("b", 1, 1969, None, "m"), M.Clue("u", 2, None, 1971)])
    c1 = mk_case("c1", 1972, free=[M.Clue("f", 0, 1970, 1976)], paid=[M.Clue("a", 1, 1972, None)])
    return M.Day([c0, c1], bank=bank, trace_cost=2)


class ModelTests(unittest.TestCase):
    def test_free_dossier_keeps_target(self):
        with self.assertRaises(ValueError):
            mk_case("bad", 1969, free=[M.Clue("x", 0, 1970, None)])

    def test_redundant_clue_is_free(self):
        d = mk_day()
        self.assertEqual(d.reveal(0, "a"), 1)       # first cut costs 1
        self.assertEqual(d.reveal(0, "b"), 0)       # same cut, now removes nothing: free
        self.assertEqual(d.bank, 7)

    def test_shared_bank_across_cases(self):
        d = mk_day()
        d.reveal(0, "a")
        d.reveal(1, "a")
        self.assertEqual(d.bank, 6)                 # one bank, not one per case

    def test_no_double_purchase(self):
        d = mk_day()
        d.reveal(0, "a")
        before = d.to_dict()
        with self.assertRaises(M.RuleError):
            d.reveal(0, "a")
        self.assertEqual(before, d.to_dict())       # refused action changes nothing

    def test_bank_never_negative_and_refusal_is_atomic(self):
        d = mk_day(bank=1)
        before = d.to_dict()
        with self.assertRaises(M.RuleError):
            d.reveal(0, "u")                         # price 2, bank 1
        with self.assertRaises(M.RuleError):
            d.trace(0, 1972)                         # Trace costs 2
        self.assertEqual(before, d.to_dict())
        self.assertGreaterEqual(d.bank, 0)

    def test_uninformative_trace_refused_and_free(self):
        d = mk_day()
        before = d.to_dict()
        with self.assertRaises(M.RuleError):
            d.trace(0, 1990)                         # everything is earlier than 1990: no information
        self.assertEqual(before, d.to_dict())

    def test_wrong_lock_removes_only_that_year_and_gives_no_direction(self):
        c = mk_case("c", 1969, free=[M.Clue("f", 0, 1965, 1975)], locks=2)
        d = M.Day([c, mk_case("d", 1970)], bank=8)
        before = set(c.cands)
        self.assertEqual(d.lock(0, 1966), "wrong")
        self.assertEqual(set(c.cands), before - {1966})
        self.assertEqual(c.status, "open")           # second chance left

    def test_miss_closes_case_but_not_the_day(self):
        d = mk_day()
        self.assertEqual(d.lock(0, 1970), "wrong")
        self.assertEqual(d.cases[0].status, "missed")
        self.assertEqual(d.cases[1].status, "open")
        d.reveal(1, "a")                             # the day continues
        self.assertEqual(d.lock(1, 1972), "correct")

    def test_ruled_out_lock_is_refused(self):
        d = mk_day()
        with self.assertRaises(M.RuleError):
            d.lock(0, 1961)

    def test_case_independence(self):
        d = mk_day()
        snap = frozenset(d.cases[1].cands)
        d.reveal(0, "a")
        d.trace(0, 1972)
        self.assertEqual(snap, d.cases[1].cands)

    def test_save_and_resume_round_trip(self):
        d = mk_day()
        d.reveal(0, "a")
        d.lock(1, 1971)
        saved = d.to_dict()
        d2 = mk_day()
        d2.restore(saved)
        self.assertEqual(saved, d2.to_dict())
        with self.assertRaises(M.RuleError):
            d2.reveal(0, "a")                        # resumed state remembers the purchase

    def test_target_never_leaves_candidates_under_random_play(self):
        rng = random.Random(2026)
        for _ in range(300):
            d = mk_day()
            for _ in range(12):
                i = rng.randrange(2)
                c = d.cases[i]
                act = rng.choice(["reveal", "trace", "lock"])
                try:
                    if act == "reveal":
                        d.reveal(i, rng.choice([k.id for k in c.paid_clues]))
                    elif act == "trace":
                        d.trace(i, rng.randint(1960, 1980))
                    else:
                        d.lock(i, rng.choice(sorted(c.cands) or [1960]))
                except M.RuleError:
                    pass
                if c.status == "open":
                    self.assertIn(c.target, c.cands)
                self.assertGreaterEqual(d.bank, 0)


class SolverTests(unittest.TestCase):
    VAR = dict(locks=1, tau=2, seq=True, bank=8)

    def test_window_probabilities_sum_to_one_and_match_brute_force(self):
        for k, w in product(range(2, 9), range(1, 7)):
            red, outs = D.window_outcomes(k, w)
            self.assertAlmostEqual(red + (1 - red) * sum(p for p, _ in outs), 1.0, places=9)
            # brute force: target uniform over k, window start uniform among starts containing the target
            dist = {}
            for T in range(k):
                for s in range(T - w + 1, T + 1):
                    a, b = max(0, s), min(k - 1, s + w - 1)
                    dist[b - a + 1] = dist.get(b - a + 1, 0) + 1.0 / (k * w)
            self.assertAlmostEqual(dist.get(k, 0.0), red, places=9)
            for p, sz in outs:
                self.assertAlmostEqual(dist[sz] / (1 - red), p, places=9)

    def test_trace_only_ceiling_matches_the_11_over_31_bound(self):
        self.assertEqual(D.trace_only_ceiling(2, 2), 11)
        self.assertEqual(D.trace_only_ceiling(4, 2), 47)
        var = dict(locks=2, tau=3, seq=True, bank=6, no_evidence=True)
        r = D.solve_day([31], var, score="solved")
        self.assertAlmostEqual(r["value"][1], 11 / 31, places=9)          # exact, not simulated

    def test_two_traces_at_cost_three_with_eight_insight(self):
        var = dict(locks=2, tau=3, seq=True, bank=8, no_evidence=True)    # 8 // 3 = 2 Traces
        self.assertAlmostEqual(D.solve_day([31], var, score="solved")["value"][1], 11 / 31, places=9)

    def test_trace_at_cost_two_binary_search_always_wins_31_years(self):
        var = dict(locks=2, tau=2, seq=True, bank=8, no_evidence=True)    # 4 Traces: ceiling 47 >= 31
        self.assertAlmostEqual(D.solve_day([31], var, score="solved")["value"][1], 1.0, places=9)

    def test_zero_spend_equals_chance_in_residual(self):
        pack = [2, 3, 4, 5, 6]
        for L in (1, 2):
            var = dict(locks=L, tau=2, seq=True, bank=8)
            r = D.solve_day(pack, var, score="solved", allow_spend=False)
            self.assertAlmostEqual(r["value"][1], sum(min(L, n) / n for n in pack), places=9)

    def test_batch_equals_sequential_when_one_lock(self):
        pack = [3, 5, 8]
        a = D.solve_day(pack, dict(locks=1, tau=2, seq=True, bank=8), score="S1")["value"][0]
        b = D.solve_day(pack, dict(locks=1, tau=2, seq=False, bank=8), score="S1")["value"][0]
        self.assertAlmostEqual(a, b, places=9)

    def test_worst_case_guarantees(self):
        v = dict(locks=1, tau=None, seq=True, bank=8, no_evidence=True)
        self.assertEqual(D.solve_day([2], v, mode="worst")["value"][1], 0)
        v2 = dict(locks=2, tau=None, seq=True, bank=8, no_evidence=True)
        self.assertEqual(D.solve_day([2], v2, mode="worst")["value"][1], 1)

    def test_optimal_never_worse_than_any_fixed_rule(self):
        pack = [2, 3, 4, 6, 8]
        var = dict(locks=1, tau=2, seq=True, bank=8)
        opt = D.solve_day(pack, var, score="S1", plan="opt")["value"][0]
        for rule in (D.rule_zero, D.rule_trace_first, D.rule_clue_first):
            self.assertLessEqual(D.eval_rule(pack, var, rule)[0], opt + 1e-9)
        self.assertLessEqual(D.solve_day(pack, var, score="S1", plan="myopic")["value"][0], opt + 1e-9)
        self.assertLessEqual(D.solve_day(pack, var, score="S1", plan="prior")["value"][0], opt + 1e-9)

    def test_dp_matches_seeded_monte_carlo(self):
        pack = [2, 3, 4, 5, 6, 8]
        var = dict(locks=2, tau=2, seq=True, bank=8)
        r = D.solve_day(pack, var, score="S1", plan="opt")
        mc = D.simulate(r, var, random.Random(12345), n_days=20000, score="S1")
        m, ci = mc["score"]
        self.assertLess(abs(m - r["value"][0]), max(3 * ci, 1.0))
        self.assertLess(abs(mc["solved"][0] - r["value"][1]), max(3 * mc["solved"][1], 0.02))
        self.assertLess(abs(mc["left"][0] - r["value"][5]), max(3 * mc["left"][1], 0.05))

    def test_spend_cap_is_respected_and_never_helps_in_expectation(self):
        pack = [2, 3, 4, 5, 6, 8, 10]
        free = D.solve_day(pack, dict(locks=1, tau=None, seq=True, bank=8), plan="opt")
        capped_var = dict(locks=1, tau=None, seq=True, bank=8, spend_cap=1)
        capped = D.solve_day(pack, capped_var, plan="opt")
        self.assertLessEqual(capped["value"][0], free["value"][0] + 1e-9)     # a constraint cannot add value
        for spec, memo in zip(capped["specs"], capped["memos"]):
            for (k, ins, locks, mask, tu), (vp, vt, act) in memo.items():
                self.assertLessEqual(tu, 1)                                   # never more than the cap spent in a case
        mc = D.simulate(capped, capped_var, random.Random(7), n_days=4000, score="S1")
        self.assertLessEqual(max(mc["spend_by_case"]), 1.0 + 1e-9)

    def test_insight_never_negative_in_policy(self):
        pack = [4, 6, 8, 10]
        var = dict(locks=1, tau=2, seq=True, bank=8)
        r = D.solve_day(pack, var, score="S1")
        for spec, memo in zip(r["specs"], r["memos"]):
            for (k, ins, locks, mask, tu), (vp, vt, act) in memo.items():
                self.assertGreaterEqual(ins, 0)
                if act[0] == "tr":
                    self.assertGreaterEqual(ins, var["tau"])
                if act[0] == "ev":
                    self.assertGreaterEqual(ins, spec.clues[act[1]][0])   # the listed price must be affordable


if __name__ == "__main__":
    unittest.main()
