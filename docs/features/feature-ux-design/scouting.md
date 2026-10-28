# Feature UX design artifact — Scouting

Feature: Capture happy / empty / loading / error UI design on a Feature  
RFC: [0028-feature-ux-design](../../rfcs/0028-feature-ux-design.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| New pipeline stage? | No — keep 8 stages; add 1:1 artifact | Ready |
| When filled? | During Scouting/RFC; gate leaving RFC → RACI | Ready |
| Fields? | Four state checkboxes + short summary + optional mockup path/notes | Ready |
| Statuses? | NOT_STARTED · IN_PROGRESS · READY · NOT_NEEDED | Ready |
| Light track? | Allow NOT_NEEDED (no UI change) | Ready |
| RFC track? | Require READY (all four states + summary ≥ 5) | Ready |
| Who edits? | Any authenticated (CASL update UxDesign); Designer primary | Ready |

## Expected after implementation

Feature detail shows a UX Design panel; advance RFC→RACI blocked until
the record matches the process track.
