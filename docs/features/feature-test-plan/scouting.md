# Feature test plan artifact — Scouting

Feature: Capture Unit / Integration / E2E obligations before Implementation  
RFC: [0029-feature-test-plan](../../rfcs/0029-feature-test-plan.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| New pipeline stage? | No — keep 8 stages; add 1:1 Planning artifact | Ready |
| When filled? | During RACI / before Implementation | Ready |
| Gate? | RACI → IMPLEMENTATION | Ready |
| Fields? | unit / integration / e2e planned bools + short summary + notes | Ready |
| Statuses? | NOT_STARTED · IN_PROGRESS · READY · NOT_NEEDED | Ready |
| Light track? | Allow NOT_NEEDED (no automated pyramid) | Ready |
| RFC track? | Require READY (≥1 layer + summary ≥ 5) | Ready |
| vs Testing checklist? | Plan = intent before code; checklist = evidence after | Ready |
| Who edits? | Any authenticated (CASL update TestPlan); QA / Tech Lead primary | Ready |

## Expected after implementation

Feature detail shows a Test plan panel; advance RACI→Implementation blocked
until the record matches the process track.
