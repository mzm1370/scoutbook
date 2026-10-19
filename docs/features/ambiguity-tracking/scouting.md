# Requirement Ambiguity Tracking — Scouting

Feature: Cross-feature Ambiguity Tracking table (all scouting statuses)  
RFC: [0023-ambiguity-tracking](../../rfcs/0023-ambiguity-tracking.md)  
Status: DONE

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Relation to Decisions Needed? | Keep `/decisions` as Decision Required inbox; add full table at `/ambiguity` | Ready |
| Columns? | Feature, Question, Current, Expected, Decision, Status, Risk, Stage, Action | Ready |
| Status filter? | Optional multi-status query; default = all | Ready |
| In-table edit? | No — open Feature scouting (same as Decisions Needed) | Ready |
| API path? | `GET /ambiguity-tracking` | Ready |

## Expected after implementation

Team can scan every scouting row in one table and filter by status before
writing tests (DOCX Part I rule).
