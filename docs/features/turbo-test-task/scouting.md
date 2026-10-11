# Turbo test task — Scouting

Feature: Turborepo `test` pipeline task  
RFC: [0021-turbo-test-task](../../rfcs/0021-turbo-test-task.md)  
Status: DONE

## Questions resolved

| Question | Decision | Status |
|---|---|---|
| Task name? | `test` in root `turbo.json` | Ready |
| dependsOn? | `["^build"]` — dependents built first (Part 5 edges) | Ready |
| Outputs? | `coverage/**` for cache | Ready |
| Who has scripts today? | `@scoutbook/api` (`vitest run`); web Vitest = later task | Ready |
| Root command? | `pnpm test` → `turbo run test` | Ready |
| Affected filter? | Documented; wire CI filter in later task | Ready |

## Expected after implementation

`pnpm test` / `pnpm turbo run test` runs API unit tests; packages without a `test` script are skipped.
