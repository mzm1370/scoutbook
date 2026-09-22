# RFC NNNN — Title

Status: Draft | Final Comment Period | Accepted | Rejected  
Date: YYYY-MM  
Author:  
Depends on: [0000-charter](./0000-charter.md)

## Summary

2–3 sentences. If you cannot summarize it, you are not ready to write the RFC.

## Motivation

Why is this needed? What happens if we do nothing?

## Detailed design

APIs, data model, flows, sample shapes. Precise enough that another developer
(or agent) could implement with **zero follow-up questions**. Prefer structured
fields and tables over essays.

## Alternatives considered

What else was considered and **why it was rejected**.

## Drawbacks

Cost: maintenance, new dependency, migration risk, UX friction, etc.

## Effect on dependency graph and tests

Does this change package boundaries, shared types, or which packages must
re-test when this area changes?

## Unresolved questions

Open decisions that review must close before Accept.

## Acceptance criteria

- [ ] …  
- [ ] …  

---

### When to use an RFC

Write one if any of these is true:

1. Shared public API/type used by more than one app  
2. New architecture or cross-cutting concern  
3. Affects more than one app/service  

Otherwise skip the RFC; Feature + scouting is enough.
