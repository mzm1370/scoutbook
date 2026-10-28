# Feature test health (Release observe) — Scouting

Feature: Capture CI failure / flaky / duration watch after ship  
RFC: [0030-feature-test-health](../../rfcs/0030-feature-test-health.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| New pipeline stage? | No — Release stays terminal; add 1:1 observe artifact | Ready |
| Live CI API? | Out of scope — short written capture + optional metrics | Ready |
| Fields? | Three watch checkboxes + optional failure%/flaky count/duration + summary | Ready |
| Statuses? | NOT_STARTED · WATCHING · HEALTHY · AT_RISK · NOT_NEEDED | Ready |
| Stage gate? | None (same as release log) | Ready |
| vs Release log? | Release log = shipped/observing status; test health = CI signals | Ready |
| Who edits? | Any authenticated (CASL update TestHealth); QA / Tech Lead primary | Ready |

## Expected after implementation

Feature detail shows a Test health panel beside Release / bugs; teams can
record watch signals without waiting for GitHub Actions integration.
