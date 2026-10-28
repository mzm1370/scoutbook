# RFC 0037 — Nightly full suite

Status: Accepted  
Date: 2026-10  
Depends on: [0034-github-actions-ci](./0034-github-actions-ci.md),
[0035-affected-ci](./0035-affected-ci.md),
[0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md)

## Summary

Add a **scheduled** GitHub Actions workflow that runs the **full** monorepo
unit tests and build on `main` every night (plus manual `workflow_dispatch`).
This is the inventory Part 9 / assessment Task 16 safety net so affected PR
CI never becomes the only gate.

## Motivation

RFCs 0035–0036 intentionally skip packages on quiet PRs. Without a periodic
full run, P2/P3 regressions can hide until someone happens to touch that
package. Assessment and the test inventory require a nightly/weekly full suite.

## Detailed design

### Workflow

File: `.github/workflows/nightly.yml`

| Trigger | Detail |
|---|---|
| `schedule` | `0 3 * * *` (03:00 UTC daily) |
| `workflow_dispatch` | Manual run from Actions UI |

### Job

Same shape as `ci-main` (RFC 0034):

1. Checkout `main`  
2. Setup pnpm + Node 24  
3. `pnpm install --frozen-lockfile`  
4. `pnpm test`  
5. `pnpm build`

### Explicitly not included

| Item | Why |
|---|---|
| Playwright / API e2e | Need Chromium + MySQL; remain local/`test:e2e` |
| Lint | Web eslint still red (same deferral as RFC 0034) |
| Flaky quarantine | Done in [0038-flaky-quarantine](./0038-flaky-quarantine.md) |
| Stress re-runner | Done in [0039-flaky-stress-rerun](./0039-flaky-stress-rerun.md) |
| Separate weekly cron | Nightly already covers “weekly” intent; avoid duplicate cost |

### Relationship to push-on-main CI

`ci-main` on every push to `main` stays. Nightly catches drift if a push
was skipped, Actions was down, or cache/env differences surface later.

## Alternatives considered

- Weekly-only schedule — rejected: too slow to notice silent P2 gaps.  
- Fold into `ci.yml` with cron — acceptable, but a named `nightly.yml`
  makes the safety-net job obvious in the Actions UI.  
- Include Playwright in nightly first — rejected until a MySQL service
  job exists.

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] `.github/workflows/nightly.yml` — schedule + dispatch; full test + build  
- [x] No MySQL / Playwright in this workflow  
- [x] Inventory / AGENTS / related RFCs note Task 16 done  
