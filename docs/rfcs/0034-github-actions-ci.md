# RFC 0034 — GitHub Actions CI

Status: Accepted  
Date: 2026-10  
Depends on: [0021-turbo-test-task](./0021-turbo-test-task.md),
[0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md),
[0032-web-vitest](./0032-web-vitest.md)

## Summary

Add a **GitHub Actions** workflow that runs on pull requests and pushes to
`main`: install dependencies, Turbo unit tests (`pnpm test`), and build.
This closes assessment eng Task 13 (Stage 6–7 “green CI” gate) without MySQL
or browser E2E. Lint is deferred until `@scoutbook/web` eslint is green.

## Motivation

RFCs 0021 / 0032 / 0033 deferred GHA. Local `pnpm test` exists, but PRs had no
automated check. Assessment Stage 6–7 expects CI on the latest commit.

## Detailed design

### Workflow

File: `.github/workflows/ci.yml`

| Trigger | Branches |
|---|---|
| `pull_request` | all |
| `push` | `main` |

### Steps (single job `ci`)

1. Checkout  
2. Setup pnpm (version from root `packageManager`)  
3. Setup Node 24 with pnpm cache  
4. `pnpm install --frozen-lockfile`  
5. `pnpm test` (Turbo — `@scoutbook/api` + `@scoutbook/web` Vitest)  
6. `pnpm build`

### Explicitly not in this workflow

| Deferred | Why / next task |
|---|---|
| `pnpm lint` as a required step | Web eslint fails today on existing hooks rules |
| `turbo run test --filter=...[base]` on PRs | Done in [0035-affected-ci](./0035-affected-ci.md) |
| Separate P1 always-run job | Task 15 |
| Nightly/weekly full suite | Task 16 |
| Playwright / API e2e | Need Chromium + MySQL; keep opt-in locally |

### Permissions

Default `contents: read` only.

## Alternatives considered

- Start with affected-only filters — rejected for v1: need a full unit safety
  net first; Task 14 narrows PRs later.  
- Include Playwright in the same job — rejected: slow, needs browsers + API +
  DB; stay local/`test:e2e` until a dedicated job exists.  
- Buildkite (assessment doc) — rejected: Scoutbook uses GitHub; GHA is enough.

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] `.github/workflows/ci.yml` runs test + build on PR / main  
- [x] No MySQL / Playwright / required lint in this workflow  
- [x] Inventory / AGENTS / related RFCs note GHA exists; Tasks 14–16 still later  
