# Affected / graph-filtered PR tests — Scouting

Feature: Turbo-scoped unit tests on PRs  
RFC: [0035-affected-ci](../../rfcs/0035-affected-ci.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Filter? | `turbo run test --filter=...[<base>]` (changed packages + dependents) | Ready |
| PR base? | `github.event.pull_request.base.sha` (not hard-coded `main`) | Ready |
| Push to main? | Keep **full** `pnpm test` + `pnpm build` (safety until nightly Task 16) | Ready |
| Build? | Same affected filter for `turbo run build` on PRs | Ready |
| Checkout? | `fetch-depth: 0` so git comparison works | Ready |
| P1 always-run? | Out of scope (Task 15) — docs-only PRs may run zero package tests | Ready |
| Playwright / API e2e? | Still out of CI | Ready |

## Expected after implementation

PR CI only runs unit tests/build for packages affected since the merge base;
`main` pushes still run the full unit suite.
