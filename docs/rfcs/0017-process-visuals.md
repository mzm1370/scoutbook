# RFC 0017 — Process Visuals (Flowchart + RACI Diagram)

Status: Accepted  
Date: 2026-09  
Depends on: [0000-charter](./0000-charter.md),
[0006-feature-raci](./0006-feature-raci.md),
[0011-feature-kanban-board](./0011-feature-kanban-board.md)

## Summary

Charter visuals remaining after Kanban and dependency graph:

1. **Process flowchart** — 8 lifecycle stages as a scannable flow  
2. **RACI as a diagram** — color-coded matrix view (not only editable dropdowns)

No new API. Web-only rendering of existing Feature list + RACI rows.

## Motivation

Charter MVP lists a process flowchart and “RACI matrix rendered visually.”
Kanban shows pipeline position; the flowchart teaches the fixed process.
The editable RACI table is heavy on mobile; a diagram view makes R/A/C/I
scanable in seconds.

## Detailed design

### Process flowchart (`/lifecycle`)

- Nodes: `FEATURE_STAGES` with shared labels  
- Edges: one-step forward only (matches RFC 0004)  
- Optional badge: count of Features currently in that stage (`GET /features`)  
- Responsive: vertical stack on phone; horizontal wrap/scroll on desktop  
- Sidebar + dashboard link: **Lifecycle**

### Visual RACI (Feature detail)

Keep existing edit table/cards. Add a **Diagram** toggle/section:

- Grid: rows = steps, columns = PO / PM / Dev / QA  
- Cell color by letter (R / A / C / I / empty)  
- Read-only; edits stay in the existing controls  
- Mobile: horizontal scroll on the diagram strip with sticky step labels

### Out of scope

- Drag-reorder stages  
- Export diagram as image  
- Separate RACI-only page  

## Acceptance criteria

- [x] `/lifecycle` flowchart + nav  
- [x] Feature RACI diagram view  
- [x] Responsive; web build clean; graphify updated  
