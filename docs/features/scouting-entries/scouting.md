# Scouting Entries — Scouting

Feature: Scouting Entries on Feature  
RFC: [0003-scouting-entries](../../rfcs/0003-scouting-entries.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Who can create/update rows? | Any authenticated role | Ready |
| Delete? | No — keep history | Ready |
| Status set? | READY, DECISION_REQUIRED, INVESTIGATING, BLOCKED | Ready |
| Replace NOT_DECIDED? | Yes → INVESTIGATING | Ready |
| READY without decision? | Invalid — require non-empty decision | Ready |
| Auto stage to SCOUTING? | No in this task | Ready |
| Field length? | Short caps (200/300) | Ready |

## Current state

Feature CRUD exists. Detail page shows Scouting placeholder. Types had
`NOT_DECIDED` / incomplete status set.

## Expected after implementation

API + Feature detail UI for scouting rows; tests; OpenAPI.
