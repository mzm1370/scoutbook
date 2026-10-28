# RFC 0036 — P1 always-run CI

Status: Accepted  
Date: 2026-10  
Depends on: [0035-affected-ci](./0035-affected-ci.md),
[0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md),
[0034-github-actions-ci](./0034-github-actions-ci.md)

## Summary

On every **pull_request**, always run `@scoutbook/api` unit tests (the package
that owns inventory P1 areas: HTTP envelope, auth, stage gates, scouting /
Decisions Needed), in addition to Turbo affected test/build from RFC 0035.

## Motivation

Assessment eng Task 15 / inventory “Always-run?”. Affected-only PRs (RFC 0035)
can skip all tests on docs-only changes — fine for P2/P3, unsafe for P1
domains. The inventory requires a PR safety net for those areas.

## Detailed design

### P1 → package mapping (v1)

| Inventory P1 area | CI action |
|---|---|
| HTTP envelope / errors | `@scoutbook/api` unit tests |
| Auth (API) | `@scoutbook/api` unit tests |
| Feature stage gates | `@scoutbook/api` unit tests |
| Scouting + Decisions Needed | `@scoutbook/api` unit tests |
| Shared contracts (`packages/types`) | No package `test` script; built via `dependsOn: ["^build"]` when api tests run |
| Web auth pages | Deferred to more web Vitest; not a separate always-run package yet |

### PR workflow steps

```bash
# 1) P1 safety net (every PR)
pnpm turbo run test --filter=@scoutbook/api

# 2) Affected graph (RFC 0035)
pnpm turbo run test --filter="...[${{ github.event.pull_request.base.sha }}]"
pnpm turbo run build --filter="...[${{ github.event.pull_request.base.sha }}]"
```

Turbo cache makes the overlap cheap when api is also affected.

### Local script

```json
"test:p1": "turbo run test --filter=@scoutbook/api"
```

### Out of scope

| Deferred | Task |
|---|---|
| Nightly/weekly full suite | 16 |
| Flaky quarantine | 17 |
| Separate web-auth always-run package | when web auth specs exist |
| Lint / Playwright / API e2e | later |

## Alternatives considered

- Always-run entire monorepo on PR — rejected: undoes Task 14 targeting.  
- Path-filtered vitest only under `src/auth` etc. — rejected: over-fit; api
  suite is already fast (~seconds).  
- Second GHA job only for P1 — optional later; one job keeps setup simple.

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] PR CI always runs `@scoutbook/api` unit tests  
- [x] Affected test/build steps remain  
- [x] Root `test:p1` script; inventory / AGENTS / RFC 0035 updated  
