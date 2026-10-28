# Flaky quarantine policy + automation — Scouting

Feature: Quarantine flaky tests with label + issue + CI guard  
RFC: [0038-flaky-quarantine](../../rfcs/0038-flaky-quarantine.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Policy home? | `docs/process/flaky-quarantine.md` | Ready |
| Label? | GitHub `flaky-test` (issue template applies it) | Ready |
| Issue? | Required before quarantine; use flaky issue form | Ready |
| Quarantine how? | Vitest/Playwright `.skip` with `flaky:#<n>` in title or adjacent comment | Ready |
| Automation? | `pnpm check:flaky` fails CI if a skip lacks an issue ref | Ready |
| Fixer bot / 500× re-runner? | Re-runner in RFC 0039; fixer bot still out | Ready |
| Live dashboards? | Out of scope (Task 19) | Ready |

## Expected after implementation

Flakes on main/nightly → open flaky issue → quarantine with issue id →
`check:flaky` keeps the convention honest until the test is fixed and unskipped.
