# Feature Kanban Board — Scouting

Feature: Kanban board (8 stage columns)  
RFC: [0011-feature-kanban-board](../../rfcs/0011-feature-kanban-board.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Cards? | Features only (bugs stay on detail) | Ready |
| New API? | No — reuse list + stage advance | Ready |
| Drag any column? | No — next stage only | Ready |
| Who advances? | PO / PM (same as stage API) | Ready |

## Expected after implementation

`/board` page, sidebar link, advance via next-column drop or button.
