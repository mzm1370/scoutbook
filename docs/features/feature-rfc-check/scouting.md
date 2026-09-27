# Feature RFC Check — Scouting

Feature: RFC check record on Feature  
RFC: [0005-feature-rfc-check](../../rfcs/0005-feature-rfc-check.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Full RFC editor in app? | No — check record + optional docPath | Ready |
| Who can set ACCEPTED? | PO / PM only | Ready |
| Who can save other statuses? | Any authenticated | Ready |
| Gate RFC → RACI? | Require NOT_NEEDED or ACCEPTED | Ready |
| NEEDED without checklist true? | Invalid | Ready |
| NOT_NEEDED with a true checkbox? | Invalid | Ready |

## Expected after implementation

API + Feature detail panel; stage gate on leaving RFC; tests green.
