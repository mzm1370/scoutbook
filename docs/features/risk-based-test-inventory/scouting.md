# Risk-Based Test Inventory — Scouting

Feature: Risk-based test inventory (targeted CI prerequisite)  
RFC: [0018-risk-based-test-inventory](../../rfcs/0018-risk-based-test-inventory.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| What is this artifact? | Living markdown inventory of **test areas** (packages / domains), not Feature Kanban cards | Ready |
| Tiers? | `P1` always-run safety net · `P2` targeted-preferred · `P3` on-demand / area-only | Ready |
| Relation to Feature `riskTier`? | Product risk on Features (RFC 0002) informs inventory; inventory decides **CI always-run**, not stage gates | Ready |
| Who owns updates? | PM maintains table; PO approves P1 list; Dev/QA propose changes via PR | Ready |
| Where does it live? | `docs/process/test-inventory.md` | Ready |
| In-app UI in this task? | No — docs only (CODEOWNERS = Task 2; turbo CI = later tasks) | Ready |
| Scouting gap / Decision Required areas? | Cannot be P1 always-run until behavior is Ready (Targeted Testing Part 2 rule) | Ready |

## Expected after implementation

Accepted RFC + filled `docs/process/test-inventory.md` linked from process policy. Later CI tasks read this table when wiring always-run jobs.
