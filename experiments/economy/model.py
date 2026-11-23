"""Reference rules model for the Daily Ten (Stage 2).

This is a specification-by-code, NOT product code. It exists so that the rules in
docs/RULES_CANDIDATES.md can be tested. Standard library only.

Conventions
- A case has a universe of integer years and a verified target t.
- C is the set of currently possible years. Invariant: t is always in C.
- Dating convention is end-of-year (D-009): a clue is true for year y if it holds on 31 December of y.
- Candidate sets may contain gaps (after a wrong Lock in second-chance mode).
"""
from dataclasses import dataclass, field
from typing import FrozenSet, Optional, Dict, List


class RuleError(Exception):
    """An action was refused. Refused actions never change state or charge Insight."""


@dataclass(frozen=True)
class Clue:
    id: str
    cost: int                    # listed price in Insight
    lo: Optional[int] = None     # inclusive lower bound on the target year, None = unbounded
    hi: Optional[int] = None     # inclusive upper bound, None = unbounded
    group: Optional[str] = None  # correlation group; clues in one group make the same cut


def apply_constraint(cands: FrozenSet[int], lo: Optional[int], hi: Optional[int]) -> FrozenSet[int]:
    return frozenset(y for y in cands if (lo is None or y >= lo) and (hi is None or y <= hi))


def removed_by(cands: FrozenSet[int], clue: Clue) -> int:
    return len(cands) - len(apply_constraint(cands, clue.lo, clue.hi))


def charge_for(cands: FrozenSet[int], clue: Clue) -> int:
    """A clue that removes nothing from the current candidates costs nothing."""
    return 0 if removed_by(cands, clue) == 0 else clue.cost


def trace_result(target: int, y: int) -> str:
    return "earlier" if target < y else ("later" if target > y else "same")


def trace_is_informative(cands: FrozenSet[int], y: int) -> bool:
    """A Trace is refused (and not charged) when it cannot tell the player anything:
    y must be a candidate (equality possible) or candidates must lie on both sides."""
    if y in cands:
        return len(cands) >= 2
    return any(c < y for c in cands) and any(c > y for c in cands)


def trace_apply(cands: FrozenSet[int], y: int, result: str) -> FrozenSet[int]:
    if result == "earlier":
        return frozenset(c for c in cands if c < y)
    if result == "later":
        return frozenset(c for c in cands if c > y)
    return frozenset([y])


@dataclass
class Case:
    case_id: str
    universe: range
    target: int
    free_constraints: List[Clue]
    paid_clues: List[Clue]
    locks_allowed: int = 1
    cands: FrozenSet[int] = field(default=frozenset())
    locks_left: int = 0
    bought: set = field(default_factory=set)
    traces_used: int = 0
    status: str = "open"          # open | solved_clean | solved_assisted | missed
    spent: int = 0

    def __post_init__(self):
        c = frozenset(self.universe)
        for k in self.free_constraints:
            c = apply_constraint(c, k.lo, k.hi)
        if self.target not in c:
            raise ValueError("free dossier removes the target: %s" % self.case_id)
        self.cands = c
        self.locks_left = self.locks_allowed


class Day:
    """One daily expedition: ten independent cases and ONE shared Insight bank."""

    def __init__(self, cases: List[Case], bank: int = 8, trace_cost: Optional[int] = 2):
        self.cases = cases
        self.bank = bank
        self.initial_bank = bank
        self.trace_cost = trace_cost
        self.log: List[tuple] = []

    # ---- guards ------------------------------------------------------------
    def _open(self, i: int) -> Case:
        c = self.cases[i]
        if c.status != "open":
            raise RuleError("case %s is closed" % c.case_id)
        return c

    def _spend(self, n: int):
        if n < 0 or n > self.bank:
            raise RuleError("cannot spend %d with %d left" % (n, self.bank))
        self.bank -= n

    # ---- actions -----------------------------------------------------------
    def reveal(self, i: int, clue_id: str) -> int:
        c = self._open(i)
        clue = next((k for k in c.paid_clues if k.id == clue_id), None)
        if clue is None:
            raise RuleError("no such clue")
        if clue_id in c.bought:
            raise RuleError("clue already revealed")          # no double purchase
        if self.bank < clue.cost:
            raise RuleError("not enough Insight to attempt this clue")
        charge = charge_for(c.cands, clue)
        new = apply_constraint(c.cands, clue.lo, clue.hi)
        if c.target not in new:
            raise ValueError("clue would remove the target (editorial error)")
        self._spend(charge)
        c.cands, c.spent = new, c.spent + charge
        c.bought.add(clue_id)
        self.log.append(("reveal", i, clue_id, charge))
        return charge

    def trace(self, i: int, y: int) -> str:
        c = self._open(i)
        if self.trace_cost is None:
            raise RuleError("Trace is not available")
        if not trace_is_informative(c.cands, y):
            raise RuleError("no new information: not charged")
        if self.bank < self.trace_cost:
            raise RuleError("not enough Insight")
        self._spend(self.trace_cost)
        res = trace_result(c.target, y)
        c.cands = trace_apply(c.cands, y, res)
        c.traces_used += 1
        c.spent += self.trace_cost
        self.log.append(("trace", i, y, res))
        return res

    def lock(self, i: int, y: int) -> str:
        c = self._open(i)
        if y not in c.cands:
            raise RuleError("year already ruled out: not charged, no lock used")
        if y == c.target:
            c.status = "solved_clean" if (c.spent == 0 and c.locks_left == c.locks_allowed) else "solved_assisted"
            self.log.append(("lock", i, y, "correct"))
            return "correct"
        c.locks_left -= 1
        c.cands = c.cands - {y}                                # removes ONLY that year, no direction
        if c.locks_left == 0:
            c.status = "missed"                                # the day continues
        self.log.append(("lock", i, y, "wrong"))
        return "wrong"

    # ---- persistence -------------------------------------------------------
    def to_dict(self) -> Dict:
        return {
            "bank": self.bank, "initial_bank": self.initial_bank, "trace_cost": self.trace_cost,
            "cases": [{"id": c.case_id, "cands": sorted(c.cands), "locks_left": c.locks_left,
                       "bought": sorted(c.bought), "traces_used": c.traces_used,
                       "status": c.status, "spent": c.spent} for c in self.cases],
        }

    def restore(self, d: Dict):
        """Restore mutable state onto a Day built from the same published pack."""
        self.bank = d["bank"]
        for c, s in zip(self.cases, d["cases"]):
            assert c.case_id == s["id"]
            c.cands, c.locks_left = frozenset(s["cands"]), s["locks_left"]
            c.bought, c.traces_used = set(s["bought"]), s["traces_used"]
            c.status, c.spent = s["status"], s["spent"]
