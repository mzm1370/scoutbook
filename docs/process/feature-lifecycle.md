# Feature lifecycle (8 stages)

Status: Accepted  
Date: 2026-09  
Depends on: [Charter](../rfcs/0000-charter.md), [General policy](./general-policy.md)

Practical guide for moving a feature from spoken need to written, shippable
record. Audience: **PO, PM, Developer, QA**. Prefer short fields; deepen later.

## Core rule

Nothing advances while still ambiguous. Unknown behavior is flagged and
resolved — never guessed into code or tests.

## Stages at a glance

| # | Stage | Purpose (one line) | Main owner |
|---|---|---|---|
| 1 | Idea | Capture need + risk tier | PO / PM |
| 2 | Scouting | Current vs expected; list unknowns | Developer + PO |
| 3 | RFC | Written design only when needed | PO / tech decision |
| 4 | RACI | Who does / approves / is consulted | PO / PM |
| 5 | Implementation | Build + co-located tests | Developer |
| 6 | Testing | Prove it works; targeted where possible | Developer + QA |
| 7 | Review | Second person checks Definition of Done | Developer + Reviewer |
| 8 | Release | Ship, observe, triage bugs properly | PM / QA / Developer |

## Stage 1 — Idea

Write the need once (not a hallway chat). Minimum:

- Problem / motivation (one short paragraph)
- Risk tier: `P1` | `P2` | `P3`
- Optional: rough current behavior note

In Scoutbook today: create a Feature (`title`, `problem`, `riskTier`) — stage
starts at `IDEA`.

## Stage 2 — Scouting

Before code: document what is true today, what should be true, and what is
still unknown.

Use a table under `docs/features/<name>/scouting.md`:

| Question | Current state | Expected | Decision | Status |
|---|---|---|---|---|
| … | … | … | … | Ready / Decision Required / Investigating / Blocked |

**Statuses**

| Status | Meaning | May write tests for this behavior? |
|---|---|---|
| Ready | PO confirmed | Yes |
| Decision Required | Exists but no agreement | No — escalate to PO |
| Investigating | Current behavior unclear | No — finish scouting |
| Blocked | Waiting on PO/PM | No |

## Stage 3 — RFC check

Write an RFC **only if** at least one is true:

1. Changes a shared package public API/type used by more than one app
2. New architecture or cross-cutting concern (auth, new data flow, …)
3. Affects more than one app/service at once

Otherwise: Feature + scouting is enough. Template: [`docs/rfcs/_template.md`](../rfcs/_template.md).

## Stage 4 — RACI

For the feature’s steps, assign letters (one primary R and one A per step):

| Letter | Meaning |
|---|---|
| R | Does the work |
| A | Accountable / final approval |
| C | Consulted before deciding |
| I | Informed after |

Typical default (adjust per feature):

| Step | PO | PM | Developer | QA |
|---|---|---|---|---|
| Resolve ambiguities | A | C | I | I |
| Approve RFC (if any) | A | C | C | I |
| Implement | I | I | R | I |
| Write / update tests | I | I | R | R |
| Validate acceptance criteria | I | A | C | R |
| Release sign-off | A | A | I | R |

## Stage 5 — Implementation

- Prefer shared types/contracts in `@scoutbook/types` (or the target repo’s
  shared package) before forking shapes.
- Respect package boundaries; if a shared type changes, dependents are affected.
- Keep unit tests next to the code they cover.

## Stage 6 — Testing

Prove two things:

1. The change works (unit / integration / E2E as needed).
2. Targeted runs only re-test what the dependency graph says is affected
   (e.g. `turbo run test --filter=...[origin/main]`), when that tooling exists.

No automated tests for rows still `Decision Required`.

## Stage 7 — Review

Second person checks Definition of Done (use the PR template checklist).
Review is not “looks fine” — it is checklist-driven.

## Stage 8 — Release & bugs

Ship, watch, and classify bugs (see [bug triage](./bug-triage.md)):

- **Regression** → failing test, then fix.
- **Scouting gap** → stop; escalate to PO; do not guess.

## Definition of Done

A feature is done only when all are true:

1. Intake acceptance criteria met  
2. No remaining `Decision Required` rows for shipped behavior  
3. RFC Accepted if one was required  
4. Tests at the right levels  
5. Targeted (or agreed full) test run passed  
6. QA validated against written acceptance criteria  
7. Docs updated if others rely on the new behavior  

## Artifacts per feature

```
docs/features/<name>/
  scouting.md
  implementation-log.md   # optional short notes
docs/rfcs/NNNN-*.md       # only if RFC was required
```

GitHub helpers: `.github/ISSUE_TEMPLATE/`, `.github/PULL_REQUEST_TEMPLATE.md`.
