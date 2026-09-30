# RFC 0011 — Feature Kanban Board

Status: Accepted  
Date: 2026-09  
Depends on: [0002-feature-record](./0002-feature-record.md),
[0004-feature-stage-transitions](./0004-feature-stage-transitions.md),
[0000-charter](./0000-charter.md)

## Summary

Add a **Kanban board** view: one column per lifecycle stage (8), cards =
Features from `GET /features`. PO/PM may advance a card **one step forward**
via drag-drop onto the next column or an Advance control — same rules as
`PATCH /features/:id/stage` (gates unchanged).

## Motivation

Charter MVP includes a Kanban board so PM/PO see pipeline position at a
glance. List view alone does not show column flow.

## Detailed design

### Data

No new API. Board loads `GET /features` and groups by `currentStage`.

Cards show: title, risk tier, link to `/features/:id`.

v1 cards = **Features only**. Bug triage rows stay on Feature detail
(RFC 0010); not separate board cards yet.

### Interactions

| Who | Action |
|---|---|
| Any authenticated | View board, open Feature |
| PO / PM | Advance one step: drag card to **immediate next** column, or Advance button |
| Others | Read-only board (no drag advance) |

Dropping on a non-next column → client reject (toast); no API call.  
Advance API failures (gates, 403) → existing interceptor toast; card stays.

### Frontend

- Route: `/board`
- Sidebar nav: Board
- **Dashboard body** (beside sidebar): `width: 100%` of remaining space,
  `min-w-0` + `overflow-x-hidden` so the **page never scrolls horizontally**.
- **Board strip only:** `overflow-x-auto` with standard column width (`w-72`);
  cards fill the column. Swipe/scroll sideways here only.
- Touch: snap columns; large Advance button. Desktop: drag to next column.

### Out of scope

- Drag reorder within a column  
- Skip / backward stage moves  
- Bug cards as first-class board items  
- New board-specific API or websocket live sync  

## Alternatives considered

- New `GET /board` aggregate — rejected (list already enough).  
- Free drag to any column — rejected (breaks RFC 0004 gates).  
- DnD library — deferred; HTML5 DnD + Advance button is enough for v1.

## Acceptance criteria

- [x] `/board` shows 8 columns with Features grouped by stage  
- [x] Card opens Feature detail  
- [x] PO/PM can advance one step (button and/or drop on next column)  
- [x] Non-next drop rejected client-side; server gates still apply  
- [x] Nav + responsive layout; builds clean  
