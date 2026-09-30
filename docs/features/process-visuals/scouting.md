# Process visuals — Scouting

Feature: Process flowchart + visual RACI diagram  
RFC: [0017-process-visuals](../../rfcs/0017-process-visuals.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| New API? | No — client visuals over existing data | Ready |
| Process flowchart? | `/lifecycle` page: 8-stage flow from `FEATURE_STAGES` | Ready |
| RACI visual? | Diagram view on Feature detail (color cells) beside edit table | Ready |
| Live feature counts on flowchart? | Yes — optional counts from `GET /features` | Ready |

## Expected after implementation

Sidebar **Lifecycle** + Feature RACI diagram mode; responsive; no new backend.
