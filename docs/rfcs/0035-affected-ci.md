# RFC 0035 — Affected / graph-filtered PR tests

Status: Accepted  
Date: 2026-10  
Depends on: [0034-github-actions-ci](./0034-github-actions-ci.md),
[0021-turbo-test-task](./0021-turbo-test-task.md),
[0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md)

## Summary

Narrow **pull_request** CI to Turborepo graph-filtered unit tests and builds
(`--filter=...[<base-sha>]`) so PRs only pay for changed packages and their
dependents. Keep **full** unit test + build on `push` to `main`.

## Motivation

Assessment eng Task 14 / Targeted Automated Testing scoped pipelines. RFC 0034
runs the whole monorepo on every PR — fine for a small repo, but the inventory
and PR template already expect
`turbo run test --filter=...[origin/main]`.

## Detailed design

### Checkout

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

Full history is required for Turbo’s git comparison.

### PR job (`pull_request`)

```bash
pnpm turbo run test --filter="...[${{ github.event.pull_request.base.sha }}]"
pnpm turbo run build --filter="...[${{ github.event.pull_request.base.sha }}]"
```

`...[sha]` = packages changed since that commit **plus** dependents in the
workspace graph.

### Main job (`push` to `main`)

Unchanged from RFC 0034:

```bash
pnpm test
pnpm build
```

### Local scripts (root `package.json`)

```json
"test:affected": "turbo run test --filter=...[origin/main]",
"build:affected": "turbo run build --filter=...[origin/main]"
```

### Workflow shape

Either one workflow with conditional steps, or two jobs (`ci-pr` / `ci-main`)
gated by `if:`. Prefer **two jobs** for clear logs.

### Out of scope

| Deferred | Task |
|---|---|
| Force P1 inventory packages always on PR | Done in [0036-p1-always-run-ci](./0036-p1-always-run-ci.md) |
| Nightly/weekly full suite | Done in [0037-nightly-full-suite](./0037-nightly-full-suite.md) |
| Flaky quarantine | Done in [0038-flaky-quarantine](./0038-flaky-quarantine.md) |
| Lint / Playwright / API e2e in CI | later |

## Alternatives considered

- Always filter vs `origin/main` even on main pushes — rejected: main keeps a
  full unit suite; nightly adds another (RFC 0037).  
- Only filter tests, always full build — rejected: build is the costly step;
  same graph applies.  
- `pnpm --filter` instead of Turbo — rejected: Turbo owns the task graph and
  `dependsOn: ["^build"]`.

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] PR CI uses Turbo `...[base-sha]` for test + build  
- [x] `main` push keeps full unit test + build  
- [x] `fetch-depth: 0`; root `test:affected` / `build:affected` scripts  
- [x] Inventory / AGENTS / RFC 0034 notes updated  
