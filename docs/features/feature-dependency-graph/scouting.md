# Feature Dependency Graph — Scouting

Feature: Feature dependency graph (blocks links)  
RFC: [0014-feature-dependency-graph](../../rfcs/0014-feature-dependency-graph.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Relationship model? | Simple directed **BLOCKS** only (`from` blocks `to`) | Ready |
| Richer types (related, depends-on)? | Deferred — v1 = BLOCKS | Ready |
| Who creates / deletes? | PO / PM | Ready |
| Who reads? | Any authenticated | Ready |
| Self-links? | Rejected | Ready |
| Duplicate same pair? | Rejected (unique from→to) | Ready |
| Cycles? | Allowed and shown (PO judgment); no auto-cycle reject | Ready |
| Stage gate? | None — relations independent of stage | Ready |

## Expected after implementation

`FeatureRelation` API + `/graph` React Flow view (nodes = Features, edges = BLOCKS).
