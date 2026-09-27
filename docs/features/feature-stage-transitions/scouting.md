# Feature Stage Transitions — Scouting

Feature: Controlled stage advancement  
RFC: [0004-feature-stage-transitions](../../rfcs/0004-feature-stage-transitions.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Who may advance? | PO and PM only | Ready |
| Skip stages? | No — immediate next only | Ready |
| Backward? | No in this task | Ready |
| Gate SCOUTING → RFC? | Block if any non-READY scouting row | Ready |
| Empty scouting OK to leave SCOUTING? | Yes | Ready |
| DEVELOPER/QA advance? | No — 403 | Ready |

## Expected after implementation

`PATCH /features/:id/stage` + Feature detail Advance control; tests green.
