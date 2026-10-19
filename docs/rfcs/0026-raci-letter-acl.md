# RFC 0026 — Per-step RACI Letter ACL

Status: Accepted  
Date: 2026-10  
Depends on: [0006-feature-raci](./0006-feature-raci.md),
[0019-casl-permissions](./0019-casl-permissions.md),
[0025-designer-tech-lead-roles](./0025-designer-tech-lead-roles.md)

## Summary

Layer **RACI letter checks** on top of role-based CASL for a small set of
Feature actions. When a matching RACI step row exists, the caller's role must
hold the required letter(s) on that step.

## Motivation

CASL (RFC 0019) gates by role title. The assessment ownership model also
expects accountability from the **matrix** (who is R / A on each step). Without
letter ACL, a Developer can edit the release sign-off log even when the seed
marks them `I` on that step.

## Detailed design

### Helpers (`@scoutbook/types`)

- Stable default step names (`RACI_STEP_NAMES`) aligned with `DEFAULT_RACI_STEPS`
- `raciValueForRole(row, role)` → column letter
- `RaciLetterAction` + `canRaciLetter(role, rows, action)` → boolean
- Match step by case-insensitive trimmed `stepName`

### Action → step → letters

| Action | Step name (default) | Letters |
|---|---|---|
| `acceptRfc` | Approve the RFC | `A` |
| `updateScouting` | Resolve open ambiguities | `R` \| `A` |
| `updateImplementationLog` | Implement it | `R` \| `A` |
| `updateTestingChecklist` | Write / update tests | `R` \| `A` |
| `updateReviewChecklist` | Validate acceptance criteria | `R` \| `A` |
| `updateReleaseLog` | Final sign-off for release | `R` \| `A` |

`acceptRfc` applies only when setting RFC check/document status to
**Accepted**. Other RFC edits stay CASL `update`.

### Skip rules

If the Feature has **no** RACI rows, or the mapped step name is **missing**
(custom matrix), letter ACL is skipped — CASL alone applies.

### Not gated (this RFC)

- Stage advance (`advance` Feature)  
- Manage / seed RACI  
- Docs sync, Feature create, relations  
- Bug triage  

### API

`FeatureRaciAclService.assertAllowed(featureId, role, action)` → `403` with a
clear message when denied.

Wired into: scouting create/update; RFC accept path; implementation /
testing / review / release upserts.

### Web

Load RACI (or reuse panel data) on Feature detail; disable write controls when
`canRaciLetter` is false (and show short helper text).

## Alternatives considered

- Gate stage advance by letter — rejected: seed puts PO as `I` on Implement.  
- Require letter even when step missing — rejected: custom matrices would brick.  
- Full CASL subject-per-step — deferred; pure helpers are enough for v1.

## Acceptance criteria

- [x] Scouting + this RFC  
- [x] Shared letter helpers + unit tests  
- [x] API 403 when letter denied; skip when no matching step  
- [x] Web disables gated writes when RACI denies  
- [x] graphify updated  
