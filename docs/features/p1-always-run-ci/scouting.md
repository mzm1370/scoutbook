# P1 always-run CI — Scouting

Feature: Force inventory P1 package tests on every PR  
RFC: [0036-p1-always-run-ci](../../rfcs/0036-p1-always-run-ci.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Which package? | Always `@scoutbook/api` unit tests (auth, envelope, stage gates, scouting) | Ready |
| `packages/types`? | No `test` script — covered via Turbo `^build` when api tests run | Ready |
| Web auth pages? | Stay under web Vitest growth; API auth remains the P1 CI gate for v1 | Ready |
| Job shape? | Same PR job: P1 step then affected step (union filters OK) | Ready |
| Main push? | Still full suite (RFC 0034) | Ready |
| Nightly? | Out of scope (Task 16) | Ready |

## Expected after implementation

Every PR runs `@scoutbook/api` unit tests even when the affected graph is empty
(e.g. docs-only), plus affected package tests/build.
