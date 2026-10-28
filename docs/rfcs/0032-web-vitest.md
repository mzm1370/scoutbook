# RFC 0032 — Web Vitest + React Testing Library (+ MSW)

Status: Accepted  
Date: 2026-10  
Depends on: [0021-turbo-test-task](./0021-turbo-test-task.md),
[0018-risk-based-test-inventory](./0018-risk-based-test-inventory.md)

## Summary

Add **Vitest**, **React Testing Library**, and **MSW** to `@scoutbook/web` so
UI and client logic have a unit/integration harness. Wire a `test` script so
Turbo / `pnpm test` includes the web package (closes the deferral in RFC 0021).

## Motivation

Assessment eng Task 11 and the risk inventory mark web shell as P2 with
“prefer Vitest/RTL when Task lands.” API already uses Vitest; web had none.

## Detailed design

### Dependencies (dev)

- `vitest`, `jsdom`
- `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- `msw`

### Config

- `apps/web/vitest.config.ts` — React plugin, `@web` alias, `jsdom`, setup file  
- `apps/web/src/test/setup.ts` — jest-dom matchers + MSW `setupServer` lifecycle  
- Specs: `src/**/*.{test,spec}.{ts,tsx}`

### Scripts

```json
"test": "vitest run",
"test:watch": "vitest"
```

### Initial coverage (smoke, not full suite)

1. Pure labels map  
2. API envelope unwrap helpers  
3. `HttpClient` success/failure via MSW  
4. One presentational component (badge) with RTL  

### Out of scope

- Playwright browser E2E — [0033-web-playwright](./0033-web-playwright.md)  
- GitHub Actions CI — [0034-github-actions-ci](./0034-github-actions-ci.md)  
- Full page coverage / Storybook  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Web Vitest + RTL + MSW configured  
- [x] `test` script; `pnpm test` includes `@scoutbook/web`  
- [x] Smoke specs pass  
- [x] RFC 0021 / inventory notes updated  
