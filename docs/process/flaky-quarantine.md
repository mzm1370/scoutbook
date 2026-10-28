# Flaky test quarantine

Status: Accepted  
Date: 2026-10  
RFC: [0038-flaky-quarantine](../rfcs/0038-flaky-quarantine.md)  
Scouting: [flaky-quarantine](../features/flaky-quarantine/scouting.md)

How Scoutbook handles **intermittent** test failures without deleting coverage
or pretending a single green rerun fixed them.

## When this applies

- A unit/integration/E2E test fails on `main` or **nightly** (RFC 0037) and
  passes on retry without a code change.  
- Or the same test fails/passes across consecutive CI runs with no related diff.

Do **not** quarantine a deterministic failure on a PR — fix or revert the PR.

## Procedure

1. **Confirm** flake (rerun locally or wait for a second CI failure).  
2. **Open** a GitHub issue with the **Flaky test** template → label `flaky-test`.  
3. **Quarantine** in the same PR (or follow-up):
   - Vitest: `it.skip` / `test.skip` / `describe.skip`
   - Playwright: `test.skip`
   - Include `flaky:#<issueNumber>` in the test title **or** a `// flaky:#N`
     comment on the same or previous line.  
4. **Own** via [CODEOWNERS](../../.github/CODEOWNERS) for that path.  
5. **Fix** the root cause, remove the skip, close the issue. Prefer proving
   stability with Task 18 stress re-runs when that lands.

## Forbidden

- Deleting assertions or entire specs to go green.  
- Bare `.skip(` / `test.skip` without an issue id (`pnpm check:flaky` fails CI).  
- Quarantining P1 auth/stage-gate coverage indefinitely — escalate to PO/QA if
  blocked more than a few days.

## Local / CI

```bash
pnpm check:flaky
```

Runs on every PR, push to `main`, and nightly.

## Product note

Feature **test health** (RFC 0030) is a written watch on a Feature after ship —
it does not replace this repo quarantine process.
