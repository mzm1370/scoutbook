# Per-step RACI letter ACL — Scouting

Feature: Enforce R/A on mapped RACI steps for gated Feature actions  
RFC: [0026-raci-letter-acl](../../rfcs/0026-raci-letter-acl.md)  
Status: DONE

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Gate stage advance? | No — defaults put PO as `I` on Implement; advance stays CASL | Ready |
| Gate manage RACI? | No — still `manage` Raci via CASL (PO/PM/TECH_LEAD) | Ready |
| Which actions? | Accept RFC; upsert scouting / impl / testing / review / release | Ready |
| Letters required? | Accept RFC → `A`; artifact upserts → `R` or `A` | Ready |
| Missing / renamed step? | Skip letter check (CASL only) so custom matrices do not lock out | Ready |
| Empty matrix? | Skip letter check | Ready |

## Expected after implementation

API returns 403 when the caller's role letter on the mapped step is not
allowed; UI disables those writes when RACI rows are loaded.
