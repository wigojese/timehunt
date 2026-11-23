# Daily Ten economy lab (Stage 2)

Reference model, exact solver and experiments for the rules in `docs/RULES_CANDIDATES.md`. Not product code. Standard library only.

```bash
python3 -m unittest -v      # 23 tests
python3 run_experiments.py  # writes docs/economy/results.md and results.json
python3 make_figures.py && node shoot.js   # figures (needs Node and Playwright)
```

| File | What |
|---|---|
| `model.py` | Rules: cases, shared bank, refusals, save and resume |
| `dp.py` | Exact dynamic-programming solver, fixed-rule evaluator, seeded simulator. Assumptions M1 to M7 are in the module docstring. |
| `test_economy.py` | Tests, including the exact 11/31 bound and solver-vs-simulation agreement |
| `run_experiments.py` | The 14 experiments (seed 20261122) |

Supersedes `docs/prototype-convergence/economy-simulation.py`, which had an undisclosed free opening card (see `docs/ECONOMY_EXPERIMENT.md` section 3.3).
