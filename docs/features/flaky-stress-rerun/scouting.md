# Flaky / stress re-runner — Scouting

Feature: On-demand multi-rerun to prove or disprove flakes  
RFC: [0039-flaky-stress-rerun](../../rfcs/0039-flaky-stress-rerun.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Tool? | Root `pnpm test:stress` → `scripts/stress-rerun.mjs` | Ready |
| Suites? | `api` / `web` (Vitest loop) + `web-e2e` (Playwright `--repeat-each`) | Ready |
| Default runs? | 20; max 500 (assessment Flaky Test Runner scale) | Ready |
| CI? | `workflow_dispatch` only — not on every PR | Ready |
| Quarantine? | Still RFC 0038; stress proves a fix before unskip | Ready |
| Dashboards? | Out of scope (Task 19) | Ready |

## Expected after implementation

QA/Dev can stress a single spec locally or via Actions and see pass/fail
counts before closing a `flaky-test` issue.
