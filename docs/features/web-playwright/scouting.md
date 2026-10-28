# Web Playwright critical journeys — Scouting

Feature: Browser E2E for login → board → stage  
RFC: [0033-web-playwright](../../rfcs/0033-web-playwright.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Runner? | Playwright (`@playwright/test`) in `@scoutbook/web` | Ready |
| Scope? | One critical path: register (PO) → create Feature → Board → advance Idea→Scouting | Ready |
| Turbo `test`? | No — keep `test:e2e` opt-in (needs MySQL + API + Vite), like API e2e | Ready |
| Browsers? | Chromium only for v1 | Ready |
| Auth seed? | Self-register unique email per run (no shared fixture user) | Ready |
| GHA CI? | Out of scope (later eng task) | Ready |

## Expected after implementation

`pnpm --filter @scoutbook/web test:e2e` runs the smoke journey when MySQL,
API (`:3000`), and Vite (`:5173`) are available (Playwright can start/reuse
servers).
