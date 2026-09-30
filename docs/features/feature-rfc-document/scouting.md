# Feature RFC Document — Scouting

Feature: Full in-app RFC document on a Feature  
RFC: [0016-feature-rfc-document](../../rfcs/0016-feature-rfc-document.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Replace RFC check? | No — check stays; document is the written body when needed | Ready |
| Fields? | summary, motivation, detailedDesign, alternatives, drawbacks (short) | Ready |
| Statuses? | DRAFT · ACCEPTED · REJECTED | Ready |
| Who accepts/rejects? | PO / PM only | Ready |
| Stage gate? | RFC→RACI: existing check gate **plus** if check is ACCEPTED, document must be ACCEPTED | Ready |
| Max length? | 500 chars per field (short input UX) | Ready |

## Expected after implementation

`GET`/`PUT /features/:id/rfc` + Feature detail panel; docs sync can include `rfc.md` when present.
