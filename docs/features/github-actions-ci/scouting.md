# GitHub Actions CI — Scouting

Feature: Run lint / unit tests / build on PR  
RFC: [0034-github-actions-ci](../../rfcs/0034-github-actions-ci.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Trigger? | `pull_request` + `push` to `main` | Ready |
| Jobs? | One `ci` job: install → test → build | Ready |
| Lint in CI? | Deferred — web eslint currently fails on existing hooks rules | Ready |
| Unit only? | Yes — Turbo `pnpm test` (API + web Vitest); no MySQL | Ready |
| Playwright / API e2e? | Out of scope (need browsers/DB; later tasks) | Ready |
| Affected filter? | Out of scope (Task 14) | Ready |
| P1 always-run / nightly? | Out of scope (Tasks 15–16) | Ready |
| Node / pnpm? | Node 24 + pnpm from `packageManager` | Ready |

## Expected after implementation

PRs show a required-capable **CI** check that runs monorepo lint, unit tests,
and build without live MySQL.
