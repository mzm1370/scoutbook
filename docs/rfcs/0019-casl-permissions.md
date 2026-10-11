# RFC 0019 — CASL Role Permissions

Status: Accepted  
Date: 2026-10  
Depends on: [0001-authentication](./0001-authentication.md),
[0006-feature-raci](./0006-feature-raci.md)

## Summary

Introduce **CASL** abilities derived from `UserRole` (`PO` | `PM` |
`DEVELOPER` | `QA`). Shared `defineAbilitiesFor(role)` in `@scoutbook/types`
drives Nest `PoliciesGuard` (403) and web UI hide/disable. **RACI** is
editable only by PO/PM; Developer and QA have read-only access.

## Motivation

Today only a few routes use `@Roles`; RACI seed/replace is open to every
authenticated user. Walkthrough showed Developers editing RACI by accident.
Ad-hoc `canAdvance` / service `user.role` checks diverge. One ability matrix
keeps API and UI aligned.

## Detailed design

### Subjects / actions

Subjects: `Feature`, `ScoutingEntry`, `RfcCheck`, `RfcDocument`, `Raci`,
`ImplementationLog`, `TestingChecklist`, `ReviewChecklist`, `ReleaseLog`,
`Bug`, `FeatureRelation`, `DocsSync`.

Actions: `read` | `create` | `update` | `manage` | `advance` | `accept`.

### Matrix (v1)

| Ability | PO | PM | DEVELOPER | QA |
|---|---|---|---|---|
| `create` Feature | yes | — | — | — |
| `advance` Feature | yes | yes | — | — |
| `manage` Raci | yes | yes | — | — |
| `read` Raci | yes | yes | yes | yes |
| `accept` RfcCheck / RfcDocument | yes | yes | — | — |
| `update` RfcCheck / RfcDocument | yes | yes | yes | yes |
| `manage` FeatureRelation | yes | yes | — | — |
| `manage` DocsSync | yes | — | — | — |
| update Scouting / ImpLog / Testing / Review / Release / Bug | yes | yes | yes | yes |
| `read` authenticated resources | yes | yes | yes | yes |

### API

- `CaslAbilityFactory` + `@CheckPolicies` + `PoliciesGuard`
- RACI `POST .../seed` and `PUT .../raci` require `manage` Raci
- Create Feature / advance / relations / docs-sync use CASL
- RFC accept in services uses `ability.can('accept', ...)` (or equivalent role via factory)

### Web

- Ability from `user.role` after login
- RACI panel: no Seed/Edit/Save when `cannot('manage','Raci')`
- Advance / New Feature / Settings / RFC Accept use same abilities

## Alternatives considered

- Keep `@Roles` only — rejected: no shared UI rules; RACI stayed open.  
- Per-step RACI letter ACL — deferred (later RFC).  
- nest-casl package — rejected: thin custom guard is enough for v1.

## Drawbacks

- Matrix must stay in sync when new subjects appear.  
- Services that still check `user.role` for Accept should call the factory.

## Effect on dependency graph and tests

Adds `@casl/ability` (types + apps) and `@casl/react` (web). Unit tests for
`defineAbilitiesFor`; e2e Developer RACI write → 403.

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Shared `defineAbilitiesFor`  
- [x] RACI seed/replace PO/PM only (API + UI)  
- [x] Key routes on PoliciesGuard; web AbilityProvider  
- [x] Unit + e2e; graphify updated  
