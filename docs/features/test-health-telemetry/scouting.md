# Test-health dashboards / telemetry — Scouting

Feature: CI test reports + summary dogfooded into Feature observe  
RFC: [0040-test-health-telemetry](../../rfcs/0040-test-health-telemetry.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Elasticsearch/Kibana? | No — out of charter infra; use GitHub Actions as the dashboard | Ready |
| What to emit? | Vitest JSON + JUnit under `reports/` when `CI=true` | Ready |
| Surfaces? | GHA step summary + uploaded artifacts; Feature test-health panel links | Ready |
| Who fills metrics? | Still humans (RFC 0030); CI gives numbers to copy into the panel | Ready |
| Nightly / main? | Both full-suite jobs publish reports | Ready |
| PR affected CI? | Skip heavy reporters (keep PR fast); P1/affected unchanged | Ready |

## Expected after implementation

Nightly and main CI show a test-health summary and artifacts; Feature detail
points QA to those runs when filling failure%/flaky/duration.
