# RFC 0025 — Designer + Tech Lead Roles

Status: Accepted  
Date: 2026-10  
Depends on: [0001-authentication](./0001-authentication.md),
[0006-feature-raci](./0006-feature-raci.md),
[0019-casl-permissions](./0019-casl-permissions.md)

## Summary

Extend Scoutbook roles from four to six — add **DESIGNER** and **TECH_LEAD** —
matching the Testing Scouting Assessment lifecycle roles. Update CASL abilities
and the RACI matrix columns accordingly.

## Motivation

The assessment doc’s RACI and ownership model include Designer (UX) and Tech
Lead / Reviewer (merge quality). Without these roles, teams cannot register or
assign RACI letters for those accountabilities.

## Detailed design

### Identity

`UserRole = 'PO' | 'PM' | 'DEVELOPER' | 'QA' | 'DESIGNER' | 'TECH_LEAD'`

- Register / JWT / `User.role` enum accept the new values.
- Labels: Designer, Tech Lead.

### CASL (`defineAbilitiesFor`)

| Ability | DESIGNER | TECH_LEAD |
|---|---|---|
| `read` all | yes | yes |
| update stage artifacts + RfcCheck/RfcDocument | yes | yes |
| `advance` / `update` Feature | — | yes |
| `manage` Raci | — | yes |
| `accept` RfcCheck / RfcDocument | — | yes |
| `manage` FeatureRelation | — | yes |
| `create` Feature | — | — |
| `manage` DocsSync | — | — |

PO/PM/DEVELOPER/QA abilities unchanged.

### RACI data model

Add columns (default `''`):

- `designerValue`  
- `techLeadValue`  

`DEFAULT_RACI_STEPS` include both. Leave-RACI gate counts R/A across all six
role letters.

### Frontend

- Register role select includes Designer / Tech Lead.
- RACI panel + diagram: six columns (PO, PM, Dev, QA, Des, TL).
- Docs sync RACI markdown includes the new columns.

### Out of scope

- Per-step RACI letter ACL (still deferred)  
- Separate UX-stage artifact for Designer mockups  
- Renaming existing users  

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Types + User enum + register  
- [x] CASL tests for DESIGNER / TECH_LEAD  
- [x] RACI columns + seed + UI + gate  
- [x] Docs sync overview / RACI table  
