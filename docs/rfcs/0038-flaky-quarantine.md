# RFC 0038 — Flaky quarantine policy + automation

Status: Accepted  
Date: 2026-10  
Depends on: [0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md),
[0030-feature-test-health](./0030-feature-test-health.md),
[0037-nightly-full-suite](./0037-nightly-full-suite.md)

## Summary

Add a written **flaky quarantine** process and light automation: GitHub issue
form + `flaky-test` label, skip convention that cites an issue, and a
`pnpm check:flaky` script enforced in PR + nightly CI. No fixer bot or
stress re-runner (Task 18).

## Motivation

Assessment eng Task 17 / flaky section: “quarantine and open an issue.” Feature
test-health (RFC 0030) records watch notes but does not govern repo test
hygiene. Without a convention, skips rot silently.

## Detailed design

### Policy

[`docs/process/flaky-quarantine.md`](../process/flaky-quarantine.md):

1. Confirm flake on `main` or nightly (not a one-off PR env glitch).  
2. Open a **Flaky test** issue (template) → gets `flaky-test` label.  
3. Quarantine with `it.skip` / `test.skip` / `describe.skip` (or Playwright
   `test.skip`) and include `flaky:#<issue>` in the title or a comment on the
   same / previous line.  
4. Owner (CODEOWNERS path) fixes; unskip; close issue.  
5. Do not delete failing assertions to go green.

### Issue template

`.github/ISSUE_TEMPLATE/flaky_test.yml` — suite path, symptom, last CI run,
owner hint.

### Check script

`scripts/check-flaky-quarantine.mjs` scans `**/*.{spec,test}.{ts,tsx}` and
`**/e2e/**/*.{ts,tsx}` for skip markers. Each hit must match
`flaky:#\d+` nearby (title string or `// flaky:#N` comment). Exit 1 otherwise.

### CI

| Workflow | Step |
|---|---|
| `ci.yml` (PR + main) | `pnpm check:flaky` after install |
| `nightly.yml` | same |

### Out of scope

| Item | Task |
|---|---|
| Multi-rerun stress runner | Done in [0039-flaky-stress-rerun](./0039-flaky-stress-rerun.md) |
| Test-health dashboards / CI telemetry index | 19 |
| Auto-open issues from CI logs | later (noisy without flake classifier) |
| Auto-fixer PRs | never for v1 |

## Alternatives considered

- Only a markdown policy — rejected: no enforcement.  
- Skip allowlist JSON — rejected: issue-linked skips stay next to the test.  
- Full Elastic-style quarantine package — rejected: overkill for this monorepo.

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Process doc + flaky issue template  
- [x] `check:flaky` script + root script  
- [x] Wired into PR/main/nightly CI  
- [x] Inventory / general-policy / AGENTS updated  
