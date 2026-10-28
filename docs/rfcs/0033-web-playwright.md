# RFC 0033 — Web Playwright critical journeys

Status: Accepted  
Date: 2026-10  
Depends on: [0032-web-vitest](./0032-web-vitest.md),
[0011-feature-kanban-board](./0011-feature-kanban-board.md),
[0004-feature-stage-transitions](./0004-feature-stage-transitions.md)

## Summary

Add **Playwright** browser E2E to `@scoutbook/web` for the assessment
critical journey: **register/login → create Feature → Board → advance one
stage**. Keep it out of Turbo `pnpm test` (opt-in `test:e2e`, needs live
MySQL + API + Vite).

## Motivation

Assessment eng Task 12 and RFC 0032 deferred browser E2E. API already has
supertest e2e; the web shell had none. A single Chromium smoke path catches
proxy/auth/board regressions Vitest + MSW cannot.

## Detailed design

### Dependencies (dev)

- `@playwright/test`

### Layout

```
apps/web/
  playwright.config.ts
  e2e/
    critical-journey.spec.ts
```

### Config

- `baseURL`: `http://127.0.0.1:5173`
- Project: Chromium only
- `webServer`: reuse existing API (`:3000/health`) + Vite when present;
  otherwise start API + web from monorepo root
- Traces / screenshots on failure

### Scripts

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

Do **not** add `test:e2e` to Turbo `test` (same rationale as API e2e in
RFC 0021).

### Journey (smoke)

1. Open `/register`, create PO with unique email  
2. Create Feature (title + problem; defaults for risk/track)  
3. Open `/board`, assert card under Idea  
4. Click Advance → Scouting; assert card under Scouting  

### Out of scope

- GitHub Actions CI — [0034-github-actions-ci](./0034-github-actions-ci.md) (unit only; Playwright stays opt-in)  
- Multi-browser matrix  
- Full stage pipeline / RACI gates in browser  
- Visual regression  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Playwright configured under `@scoutbook/web`  
- [x] `test:e2e` script; not part of Turbo `pnpm test`  
- [x] Critical-journey smoke spec passes locally (MySQL + API + Vite)  
- [x] Inventory / AGENTS notes updated  
