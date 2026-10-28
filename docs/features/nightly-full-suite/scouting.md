# Nightly / weekly full suite — Scouting

Feature: Scheduled full unit test + build safety net  
RFC: [0037-nightly-full-suite](../../rfcs/0037-nightly-full-suite.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Cadence? | Nightly (UTC) + `workflow_dispatch`; weekly not a separate job | Ready |
| What runs? | Full `pnpm test` + `pnpm build` on `main` tip | Ready |
| Playwright / API e2e? | Out of scope (need DB/browsers; stay opt-in) | Ready |
| Replace main-push full CI? | No — keep both (push + schedule) | Ready |
| Branch? | `main` only | Ready |
| Flaky quarantine? | Out of scope (Task 17) | Ready |

## Expected after implementation

A scheduled GitHub Actions workflow runs the full Turbo unit suite and build
every night so targeted PR CI cannot silently drop coverage.
