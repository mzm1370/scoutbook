# Authentication — Scouting

Feature: Authentication  
RFC: [0001-authentication](../../rfcs/0001-authentication.md)  
Status: READY

## Questions resolved

| Question | Decision |
|---|---|
| How do users prove identity? | Email + password |
| How is the session carried? | JWT bearer in `Authorization` header |
| Multi-org in v1? | No — one team |
| Refresh tokens? | No — 1h access token, re-login |
| Shared contract? | `@scoutbook/types` (`AuthUser`, `LoginResponse`) |

## Current state

Partial NestJS stubs exist (`AuthModule`, `UsersModule`, JWT guard).
Web app is still the Vite starter with no auth UI.

## Expected after implementation

Working register/login/me API and React login/register + session restore,
as specified in RFC 0001.
