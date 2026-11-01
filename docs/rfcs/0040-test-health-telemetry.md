# RFC 0040 — Test-health CI telemetry (dogfood)

Status: Accepted  
Date: 2026-10  
Depends on: [0030-feature-test-health](./0030-feature-test-health.md),
[0037-nightly-full-suite](./0037-nightly-full-suite.md),
[0034-github-actions-ci](./0034-github-actions-ci.md)

## Summary

Publish **Vitest JSON + JUnit** reports from full-suite CI (`main` push +
nightly), write a **GitHub Actions step summary**, and upload artifacts so
teams dogfood test health through Actions + the existing Feature **test
health** panel (RFC 0030). No Elasticsearch/Kibana cluster.

## Motivation

Assessment eng Task 19 / Stage 8 observe: Elastic indexes CI into Kibana.
Scoutbook already has a written observe record; it lacked a live CI signal
source. Charter MVP does not include running Elasticsearch — Actions is the
right dashboard surface for this repo.

## Detailed design

### Vitest (CI only)

When `CI=true`, `@scoutbook/api` and `@scoutbook/web` vitest configs enable:

- reporters: `default`, `json`, `junit`
- output under each package `reports/vitest.json` and `reports/junit.xml`

### Summarizer

`scripts/summarize-test-health.mjs`:

- Reads `apps/*/reports/vitest.json`  
- Prints pass/fail/skip/duration table  
- Appends markdown to `GITHUB_STEP_SUMMARY` when set  
- Writes `reports/test-health-summary.md` at repo root for the artifact

### Workflows

| Workflow | Change |
|---|---|
| `ci.yml` `ci-main` | After `pnpm test`, run summarizer; upload `reports/**` + package reports |
| `nightly.yml` | Same |
| PR `ci-pr` | No change (affected/P1 stay lean) |

### Product dogfood

- Process note: [test-health-telemetry.md](../process/test-health-telemetry.md)  
- Feature test-health panel: short helper linking to Actions CI/nightly and the
  process doc (how to copy failure%/duration into the form)

### Out of scope

| Item | Why |
|---|---|
| Self-hosted ES + Kibana ci-stats | Infra / charter |
| Auto-upsert Feature test-health from CI | Needs Feature↔suite mapping; later |
| Playwright/API e2e reports in GHA | Still opt-in local |

## Acceptance criteria

- [ ] Scouting + this RFC + process note  
- [ ] CI vitest reporters + summarizer  
- [ ] Main + nightly upload summary/artifacts  
- [ ] Feature panel helper links  
- [ ] Inventory / AGENTS / RFC 0030 updated  
