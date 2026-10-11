# CASL Role Permissions — Scouting

Feature: CASL role-based permissions (API + web)  
RFC: [0019-casl-permissions](../../rfcs/0019-casl-permissions.md)  
Status: READY

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Library? | `@casl/ability` shared rules; `@casl/react` on web | Ready |
| Depth? | Role matrix only — not RACI letter ACL per step | Ready |
| RACI edit? | **PO / PM** `manage`; **Developer / QA** `read` only | Ready |
| Enforce where? | Nest PoliciesGuard (403) + web hide/disable | Ready |
| Shared rules? | `defineAbilitiesFor(role)` in `@scoutbook/types` | Ready |
| Keep `@Roles`? | Migrate touched routes to CASL; RolesGuard may remain unused | Ready |
| Feature create / advance? | Unchanged: PO create; PO/PM advance | Ready |

## Expected after implementation

Developer/QA see RACI diagram but cannot Seed/Edit/Save. Same rules on API.
