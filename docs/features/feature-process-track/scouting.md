# Feature process track (Light vs RFC) — Scouting

Feature: Classify each Feature as Light or RFC ceremony track  
RFC: [0022-feature-process-track](../../rfcs/0022-feature-process-track.md)  
Status: DONE

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Field name? | `processTrack`: `LIGHT` \| `RFC` | Ready |
| Who sets it? | PO on create; PO/PM may update before Implementation | Ready |
| P1 + Light? | Rejected — P1 must be `RFC` | Ready |
| Default suggestion? | P1→RFC, P3→LIGHT, P2→RFC (safer) | Ready |
| Light leave-RFC gate? | RFC check must be `NOT_NEEDED` | Ready |
| RFC leave-RFC gate? | Check `ACCEPTED` + document `ACCEPTED` | Ready |
| Skip stages on Light? | No — same 8 stages; lighter RFC ceremony only | Ready |
| Existing DB rows? | Column default `RFC` (safer for legacy) | Ready |

## Expected after implementation

Create form picks track; board/detail show badge; advancing RFC→RACI
enforces track-specific gates.
