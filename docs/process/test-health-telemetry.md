# Test-health telemetry (dogfood)

Status: Accepted  
Date: 2026-10  
RFC: [0040-test-health-telemetry](../rfcs/0040-test-health-telemetry.md)  
Product record: [Feature test health](../rfcs/0030-feature-test-health.md)

How Scoutbook **dogfoods** CI signals into Stage 8 observe without running
Elasticsearch.

## Dashboard surfaces

| Surface | What you get |
|---|---|
| GitHub Actions → **CI** (push to `main`) | Full unit suite + step summary table |
| GitHub Actions → **Nightly full suite** | Same on a schedule (RFC 0037) |
| Workflow **Artifacts** | `vitest.json`, `junit.xml`, `test-health-summary.md` |
| Feature detail → **Test health** | Durable written watch (failure %, flakes, duration) |

## Loop

1. Open the latest **main** or **nightly** run.  
2. Read the job summary (pass/fail/skip/duration) or download artifacts.  
3. On the shipped Feature, fill **Test health** (RFC 0030) from those numbers.  
4. If something flakes, follow [flaky quarantine](./flaky-quarantine.md) and
   prove fixes with [stress re-run](../rfcs/0039-flaky-stress-rerun.md).

## Local (optional)

```bash
CI=true pnpm --filter @scoutbook/api test
CI=true pnpm --filter @scoutbook/web test
pnpm test:health-summary
```

## Not in v1

Self-hosted ci-stats / Kibana indexing — assessment inspiration only; Actions
is enough for this monorepo.
