# RFC 0021 — Turbo Test Task

Status: Accepted  
Date: 2026-10  
Depends on: [0000-charter](./0000-charter.md),
[0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md)

## Summary

Add a Turborepo `test` task so monorepo tests run through the dependency
graph (`dependsOn: ["^build"]`), matching Targeted Automated Testing
Part 5 / §13.7–13.8. Root `pnpm test` invokes `turbo run test`.

## Motivation

Without a `test` task, agents and CI cannot use Turbo’s package graph for
unit tests. PR templates already mention
`turbo run test --filter=...[origin/main]`, but the task was missing.

## Detailed design

### `turbo.json`

```json
"test": {
  "dependsOn": ["^build"],
  "outputs": ["coverage/**"]
}
```

### Root `package.json`

```json
"test": "turbo run test"
```

### Package scripts

| Package | `test` script (this RFC) |
|---|---|
| `@scoutbook/api` | Already `vitest run` |
| `@scoutbook/web` | `vitest run` (RFC 0032) |
| `@scoutbook/types` / `@scoutbook/ui` | None — Turbo skips |

### Local commands

```bash
pnpm test
pnpm turbo run test --filter=@scoutbook/api
# later (CI task):
pnpm turbo run test --filter=...[origin/main]
```

## Out of scope

- Web Vitest + Testing Library — done in [0032-web-vitest](./0032-web-vitest.md)  
- GitHub Actions affected CI  
- E2E under Turbo (`test:e2e` stays API-local; needs MySQL)  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] `turbo.json` `test` task + root `pnpm test`  
- [x] `pnpm test` runs API unit tests successfully  
