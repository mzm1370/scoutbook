# RFC 0039 — Flaky / stress re-runner

Status: Accepted  
Date: 2026-10  
Depends on: [0038-flaky-quarantine](./0038-flaky-quarantine.md),
[0032-web-vitest](./0032-web-vitest.md),
[0033-web-playwright](./0033-web-playwright.md)

## Summary

Add an on-demand **stress re-runner** that executes one spec many times
(default 20, max 500) so a flaky fix is proven before unskip. Local CLI plus
a GitHub Actions `workflow_dispatch` job. Not part of PR CI.

## Motivation

Assessment eng Task 18 / Flaky Test Runner. Quarantine (RFC 0038) tracks
debt; a single green CI run after unskip is weak evidence. Elastic-style
“rerun up to ~500 times” is the bar; Scoutbook exposes the same control
without always paying that cost.

## Detailed design

### CLI

```bash
pnpm test:stress -- --pkg api --file src/common/http/api-response.spec.ts --runs 50
pnpm test:stress -- --pkg web --file src/lib/labels.spec.ts --runs 20
pnpm test:stress -- --pkg web-e2e --file e2e/critical-journey.spec.ts --runs 10
```

| Flag | Meaning |
|---|---|
| `--pkg` | `api` \| `web` \| `web-e2e` (required) |
| `--file` | Path relative to that package (required) |
| `--runs` | Integer 1–500 (default **20**) |
| `-t` / `--testNamePattern` | Optional Vitest/Playwright name filter |

**Vitest (`api` / `web`):** loop `vitest run <file>` `--runs` times; print
`pass=X fail=Y`; exit 1 if any fail.

**Playwright (`web-e2e`):** one invocation with `--repeat-each=<runs>` (needs
API + Vite if the journey hits live servers — document reuseExistingServer).

### Actions

`.github/workflows/stress-rerun.yml` — `workflow_dispatch` inputs mirror the
CLI. Unit packages only in GHA by default (no MySQL/Playwright browsers unless
we add them later). v1 dispatch supports `api` and `web`; `web-e2e` remains
local-first.

### Policy link

Update [flaky-quarantine.md](../process/flaky-quarantine.md): before closing a
flaky issue, prefer `pnpm test:stress` at ≥20 runs (higher if still suspicious).

### Out of scope

| Item | Why |
|---|---|
| Auto-trigger from CI failures | Noisy; Task 19 telemetry first |
| Fixer bot PRs | Assessment-scale tooling; not v1 |
| Always 500 on nightly | Cost; on-demand only |

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] `scripts/stress-rerun.mjs` + `pnpm test:stress`  
- [x] `workflow_dispatch` for api/web  
- [x] Quarantine process + AGENTS updated  
