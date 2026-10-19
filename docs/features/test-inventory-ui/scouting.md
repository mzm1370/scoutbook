# In-app test inventory UI — Scouting

Feature: Editable risk-based test inventory in Scoutbook  
RFC: [0027-test-inventory-ui](../../rfcs/0027-test-inventory-ui.md)  
Depends on: [0018](../../rfcs/0018-risk-based-test-inventory.md)  
Status: DONE

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Still distinct from Feature `riskTier`? | Yes — inventory = CI/test area priority | Ready |
| Source of truth? | DB rows in-app; seed from RFC 0018 defaults; markdown stays as docs snapshot | Ready |
| Who edits? | PO/PM/TECH_LEAD manage; **PO only** for P1 add/remove/tier change | Ready |
| Who reads? | Any authenticated role | Ready |
| Seed? | `POST .../seed` when empty; does not overwrite | Ready |
| Delete? | Yes for non-P1 (managers); P1 delete PO only | Ready |

## Expected after implementation

`/inventory` shows a living P1/P2/P3 table; managers can seed and edit;
P1 changes require PO.
