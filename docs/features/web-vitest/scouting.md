# Web Vitest + RTL (+ MSW) — Scouting

Feature: Unit/integration tests for `@scoutbook/web`  
RFC: [0032-web-vitest](../../rfcs/0032-web-vitest.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Runner? | Vitest (same family as API) | Ready |
| DOM? | `jsdom` + Testing Library | Ready |
| HTTP mocks? | MSW node server in setup | Ready |
| Turbo? | Add `test` script so `pnpm test` includes web | Ready |
| Scope of first tests? | Labels + envelope + HttpClient (MSW) + one badge RTL | Ready |
| Playwright? | Out of scope (Task 12) | Ready |

## Expected after implementation

`pnpm --filter @scoutbook/web test` and root `pnpm test` run web unit tests.
