# Designer + Tech Lead roles — Scouting

Feature: Add DESIGNER and TECH_LEAD to Scoutbook identity + RACI  
RFC: [0025-designer-tech-lead-roles](../../rfcs/0025-designer-tech-lead-roles.md)  
Status: DONE

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Role slugs? | `DESIGNER`, `TECH_LEAD` | Ready |
| CASL — Designer? | Like Dev/QA: update stage artifacts; no advance/create/manage Raci/accept | Ready |
| CASL — Tech Lead? | Like PM: advance, update Feature, manage Raci, accept RFC, manage relations; no create Feature / DocsSync | Ready |
| RACI matrix? | Add `designerValue` + `techLeadValue` columns | Ready |
| Seed defaults? | Include Designer/Tech Lead letters on DEFAULT_RACI_STEPS | Ready |
| Register? | Both roles selectable | Ready |

## Expected after implementation

Users can register as Designer or Tech Lead; RACI shows six role columns;
Tech Lead can advance and accept RFCs like PM.
