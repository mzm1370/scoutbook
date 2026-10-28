# Graph Report - scoutbook  (2026-10-19)

## Corpus Check
- 331 files · ~118,295 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 7, .mdc 2, .css 2)

## Summary
- 2755 nodes · 5280 edges · 186 communities (164 shown, 19 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 88 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1c8dcd25`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api.ts
- Scoutbook — Agent Policy
- web/package.json
- ui/package.json
- eslint-config/package.json
- api/package.json
- /graphify
- What You Must Do When Invoked
- What You Must Do When Invoked
- compilerOptions
- compilerOptions
- dependencies
- .update
- .upsert
- package.json
- .put
- web/components.json
- ui/components.json
- compilerOptions
- RFC 0001 — Authentication
- compilerOptions
- .create
- devDependencies
- tasks
- RaciAssignment
- FeatureRfcDocument
- feature-bug-triage.service.ts
- compilerOptions
- api/README.md
- compilerOptions
- scripts
- FeatureImplementationLog
- What's inside?
- graphify reference: extra exports and benchmark
- sidebar.tsx
- graphify reference: extra exports and benchmark
- oxlint.json
- tsconfig.build.json
- typescript-config/package.json
- graphify reference: query, path, explain
- nest-cli.json
- graphify reference: query, path, explain
- types/package.json
- react-library.json
- @nestjs/swagger
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native AGENTS.md integration
- graphify reference: incremental update and cluster-only
- React + TypeScript + Vite
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- httpClient
- web/tsconfig.json
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- .agents/skills/graphify/references/extraction-spec.md
- .claude/CLAUDE.md
- .claude/skills/graphify/references/extraction-spec.md
- eslint-config/README.md
- api-response.ts
- DocsSyncService
- app-header.tsx
- scouting.service.ts
- card.tsx
- app.module.ts
- TestInventoryPage.tsx
- Feature lifecycle (8 stages)
- DashboardLayout.tsx
- Scoutbook — Agent Policy
- RFC 0013 — Feature Stage History
- dependencies
- .create
- .findById
- dependencies
- RFC 0003 — Scouting Entries
- Scoutbook — General Process & Agent Policy
- Scoutbook — Project Charter
- auth.service.ts
- github-api.client.ts
- devDependencies
- .put
- RFC NNNN — Title
- sheet.tsx
- App.tsx
- scripts
- .list
- Authentication — Scouting
- Feature Record — Scouting
- exports
- FeaturesService
- vite.config.ts
- UpsertFeatureReleaseLogDto
- DecisionsNeededController
- imports
- eslint.config.js
- scripts
- http-interceptor.ts
- RFC 0004 — Feature Stage Transitions
- labels.ts
- RFC 0021 — Turbo Test Task
- alert.tsx
- Bug triage
- Scouting Entries — Scouting
- KanbanBoardPage.tsx
- PULL_REQUEST_TEMPLATE.md
- FeatureScoutingPanel
- RFC 0005 — Feature RFC Check Record
- Detailed design
- index.ts
- Feature Stage Transitions — Scouting
- after-compile.sh
- 0000-charter.md
- Detailed design
- RFC 0002 — Feature Record Core
- RFC 0010 — Feature Release Log & Bug Triage
- Feature Dependency Graph — Scouting
- feature-scouting-panel.tsx
- Detailed design
- RFC 0008 — Feature Testing Checklist
- Detailed design
- RFC 0007 — Feature Implementation Log
- swagger.ts
- RFC 0012 — Decisions Needed Inbox
- Detailed design
- devDependencies
- RFC 0019 — CASL Role Permissions
- Feature Implementation Log — Scouting
- features.module.ts
- 0017-process-visuals.md
- Feature Testing Checklist — Scouting
- RFC 0009 — Feature Review Checklist
- generate-docs.ts
- features.service.ts
- FeatureBugTriagePanel
- RFC 0011 — Feature Kanban Board
- Detailed design
- Feature Release Log & Bug Triage — Scouting
- UpsertFeatureTestingChecklistDto
- 0023-ambiguity-tracking.md
- .constructor
- UpsertDocsSyncConnectionDto
- feature-rfc-check-panel.tsx
- Detailed design
- Feature RFC Document — Scouting
- NewFeaturePage.tsx
- avatar.tsx
- feature-graph-node.tsx
- UpsertFeatureReviewChecklistDto
- token-crypto.ts
- raci-diagram.tsx
- feature-release-log-panel.tsx
- feature-lifecycle.md
- CreateScoutingEntryDto
- UpdateScoutingEntryDto
- TestInventoryPage
- RFC 0020 — CODEOWNERS Ownership Mapping
- LoginDto
- RolesGuard
- Detailed design
- RFC 0018 — Risk-Based Test Inventory
- CASL Role Permissions — Scouting
- Designer + Tech Lead roles — Scouting
- JwtAuthGuard
- GitHub Docs Sync — Scouting
- FeatureRaciPanel
- RegisterDto
- 0021-turbo-test-task.md
- SettingsPage
- Feature RACI Matrix — Scouting
- Risk-based test inventory
- feature-testing-checklist-panel.tsx
- vite-tsconfig-paths
- Detailed design
- Scoutbook API — OpenAPI
- Feature process track (Light vs RFC) — Scouting
- test-inventory.controller.ts
- FeatureRfcCheck
- .login
- feature-review-checklist-panel.tsx
- Feature Kanban Board — Scouting

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 74 edges
2. `@nestjs/swagger` - 58 edges
3. `AuthUser` - 43 edges
4. `FeaturesService` - 42 edges
5. `UserRole` - 39 edges
6. `typeorm` - 31 edges
7. `CurrentUser` - 31 edges
8. `Button()` - 28 edges
9. `FeatureStage` - 25 edges
10. `Feature` - 24 edges

## Surprising Connections (you probably didn't know these)
- `JwtPayload` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/guards/jwt-auth.guard.ts → packages/types/src/index.ts
- `AuthUserDto` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/dto/auth-response.dto.ts → packages/types/src/index.ts
- `RegisterDto` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/dto/register.dto.ts → packages/types/src/index.ts
- `AmbiguityTrackingItemResponseDto` --references--> `FeatureStage`  [EXTRACTED]
  apps/api/src/features/dto/ambiguity-tracking-item-response.dto.ts → packages/types/src/index.ts
- `AmbiguityTrackingItemResponseDto` --references--> `RiskTier`  [EXTRACTED]
  apps/api/src/features/dto/ambiguity-tracking-item-response.dto.ts → packages/types/src/index.ts

## Import Cycles
- None detected.

## Communities (186 total, 19 thin omitted)

### Community 0 - "api.ts"
Cohesion: 0.05
Nodes (39): AuthContext, AuthContextValue, AuthProvider(), ambiguityTrackingApi, authApi, bugTriageApi, decisionsNeededApi, docsSyncApi (+31 more)

### Community 1 - "Scoutbook — Agent Policy"
Cohesion: 0.10
Nodes (21): 1. Fully responsive (best practices), 1. Uniform request / response envelope (middleware + interceptor), 2. Prefer shared functions, 2. Short input, flexible capture (Idea → Implementation), 3. Easy login, enjoyable system, 3. Prefer shared classes, 4. Smooth professional lifecycle (dev happy, business safe), Architecture (+13 more)

### Community 2 - "web/package.json"
Cohesion: 0.08
Nodes (23): @casl/ability, eslint, @eslint/js, eslint-plugin-react-hooks, globals, lucide-react, react, react-dom (+15 more)

### Community 3 - "ui/package.json"
Cohesion: 0.11
Nodes (18): eslint, lucide-react, react, react-dom, sonner, @types/react, @types/react-dom, typescript (+10 more)

### Community 4 - "eslint-config/package.json"
Cohesion: 0.06
Nodes (34): config, nextJsConfig, devDependencies, @babel/core, @babel/eslint-parser, @babel/preset-typescript, eslint, eslint-config-prettier (+26 more)

### Community 5 - "api/package.json"
Cohesion: 0.06
Nodes (32): author, description, @casl/ability, prettier, @scoutbook/types, @types/node, typescript, license (+24 more)

### Community 6 - "/graphify"
Cohesion: 0.06
Nodes (30): For --cluster-only, For git commit hook, For /graphify add, For /graphify explain, For /graphify path, For /graphify query, For native CLAUDE.md integration, For --update (incremental re-extraction) (+22 more)

### Community 7 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native AGENTS.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 8 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 9 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, ignoreDeprecations (+15 more)

### Community 10 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations, jsx, lib (+15 more)

### Community 11 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, bcrypt, @casl/ability, class-transformer, class-validator, mysql2, @nestjs/common, @nestjs/config (+14 more)

### Community 12 - ".update"
Cohesion: 0.05
Nodes (52): ApiNoContentResponse, CreateTestInventoryItemDto, ApiProperty, ApiPropertyOptional, IsIn, IsInt, IsOptional, IsString (+44 more)

### Community 13 - ".upsert"
Cohesion: 0.16
Nodes (17): DocsSyncController, ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags (+9 more)

### Community 14 - "package.json"
Cohesion: 0.10
Nodes (19): devDependencies, prettier, turbo, typescript, engines, node, prettier, typescript (+11 more)

### Community 15 - ".put"
Cohesion: 0.15
Nodes (14): FeatureTestingChecklistController, ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse (+6 more)

### Community 16 - "web/components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 17 - "ui/components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 18 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 19 - "RFC 0001 — Authentication"
Cohesion: 0.12
Nodes (17): Acceptance criteria, API contract, Backend design (NestJS), Data model, Decision, Env vars, Frontend design (React + Vite), `GET /auth/me` (protected) (+9 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, declaration, declarationMap, esModuleInterop, incremental, isolatedModules, lib, module (+8 more)

### Community 21 - ".create"
Cohesion: 0.18
Nodes (16): ScoutingController, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags (+8 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+8 more)

### Community 23 - "tasks"
Cohesion: 0.11
Nodes (17): dependsOn, inputs, outputs, dependsOn, cache, persistent, dependsOn, $schema (+9 more)

### Community 24 - "RaciAssignment"
Cohesion: 0.05
Nodes (47): RaciAssignmentInputDto, ReplaceFeatureRaciDto, ApiProperty, ApiPropertyOptional, IsIn, IsInt, IsOptional, IsString (+39 more)

### Community 25 - "FeatureRfcDocument"
Cohesion: 0.07
Nodes (32): ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureRfcDocumentDto, FeatureRfcDocument (+24 more)

### Community 26 - "feature-bug-triage.service.ts"
Cohesion: 0.06
Nodes (50): CreateFeatureBugTriageDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, MinLength (+42 more)

### Community 27 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, module, moduleResolution, outDir, skipLibCheck, strictNullChecks, exclude (+3 more)

### Community 28 - "api/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 29 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, jsx, module, moduleResolution, noEmit, plugins, extends (+2 more)

### Community 30 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, deploy, format, lint, openapi:export, start, start:debug (+7 more)

### Community 31 - "FeatureImplementationLog"
Cohesion: 0.07
Nodes (31): ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureImplementationLogDto, FeatureImplementationLog (+23 more)

### Community 32 - "What's inside?"
Cohesion: 0.20
Nodes (9): Apps and Packages, Build, Develop, Remote Caching, Turborepo starter, Useful Links, Using this example, Utilities (+1 more)

### Community 33 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 34 - "sidebar.tsx"
Cohesion: 0.11
Nodes (17): mainNav, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupContent() (+9 more)

### Community 35 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 36 - "oxlint.json"
Cohesion: 0.29
Nodes (6): env, node, rules, @typescript-eslint/no-explicit-any, @typescript-eslint/no-floating-promises, $schema

### Community 37 - "tsconfig.build.json"
Cohesion: 0.29
Nodes (6): compilerOptions, rootDir, exclude, extends, include, ./tsconfig.json

### Community 38 - "typescript-config/package.json"
Cohesion: 0.29
Nodes (6): license, name, private, publishConfig, access, version

### Community 39 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 40 - "nest-cli.json"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 41 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 42 - "types/package.json"
Cohesion: 0.22
Nodes (8): dependencies, @casl/ability, @casl/ability, main, name, private, types, version

### Community 43 - "react-library.json"
Cohesion: 0.33
Nodes (5): compilerOptions, jsx, extends, ./base.json, $schema

### Community 44 - "@nestjs/swagger"
Cohesion: 0.12
Nodes (23): CurrentUser, AuthUserDto, HealthResponseDto, LoginResponseDto, ApiProperty, ApiFailureEnvelopeDto, DocsSyncConnectionResponseDto, DocsSyncResultResponseDto (+15 more)

### Community 45 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 46 - "graphify reference: commit hook and native AGENTS.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native AGENTS.md integration, graphify reference: commit hook and native AGENTS.md integration

### Community 47 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 48 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 49 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 50 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 51 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 62 - "api-response.ts"
Cohesion: 0.07
Nodes (25): ErrorResponseDto, ApiProperty, ApiPropertyOptional, AllExceptionsFilter, ApiResponse, RequestWithId, ResponseTransformInterceptor, Injectable (+17 more)

### Community 63 - "DocsSyncService"
Cohesion: 0.31
Nodes (5): DocsSyncService, Injectable, normalizeGithubRepoUrl(), parseGithubRepoUrl(), DocsSyncConnection

### Community 64 - "app-header.tsx"
Cohesion: 0.15
Nodes (8): AppHeader(), initials(), DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger()

### Community 65 - "scouting.service.ts"
Cohesion: 0.14
Nodes (16): AmbiguityTrackingItemResponseDto, ApiProperty, DecisionNeededItemResponseDto, ApiProperty, ScoutingEntryResponseDto, ApiProperty, SeedScoutingChecklistResponseDto, ApiProperty (+8 more)

### Community 66 - "card.tsx"
Cohesion: 0.16
Nodes (14): FeatureStageHistoryPanel(), formatWhen(), Props, Props, stages, countByStage(), LifecyclePage(), LoginPage() (+6 more)

### Community 67 - "app.module.ts"
Cohesion: 0.11
Nodes (20): AppModule, { ObserveModule, ObserveInstrument }, Module, AuthModule, Module, IS_PUBLIC_KEY, JwtPayload, DocsSyncModule (+12 more)

### Community 68 - "TestInventoryPage.tsx"
Cohesion: 0.13
Nodes (16): FeaturesPage(), Badge(), badgeVariants, Button(), buttonVariants, Label(), Separator(), Skeleton() (+8 more)

### Community 69 - "Feature lifecycle (8 stages)"
Cohesion: 0.15
Nodes (13): Artifacts per feature, Core rule, Definition of Done, Feature lifecycle (8 stages), Stage 1 — Idea, Stage 2 — Scouting, Stage 3 — RFC check, Stage 4 — RACI (+5 more)

### Community 70 - "DashboardLayout.tsx"
Cohesion: 0.20
Nodes (9): crumbForPath(), DashboardLayout(), SidebarInset(), SidebarProvider(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger() (+1 more)

### Community 71 - "Scoutbook — Agent Policy"
Cohesion: 0.10
Nodes (21): 1. Fully responsive (best practices), 1. Uniform request / response envelope (middleware + interceptor), 2. Prefer shared functions, 2. Short input, flexible capture (Idea → Implementation), 3. Easy login, enjoyable system, 3. Prefer shared classes, 4. Smooth professional lifecycle (dev happy, business safe), Architecture (+13 more)

### Community 72 - "RFC 0013 — Feature Stage History"
Cohesion: 0.13
Nodes (13): Expected after implementation, Feature Stage History — Scouting, Questions resolved, Acceptance criteria, Alternatives considered, API (JWT), Data model, Detailed design (+5 more)

### Community 73 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, class-variance-authority, cn, @fontsource-variable/geist, lucide-react, next-themes, radix-ui, react (+4 more)

### Community 74 - ".create"
Cohesion: 0.06
Nodes (37): CreateFeatureRelationDto, ApiProperty, ApiPropertyOptional, IsIn, IsInt, IsOptional, Min, Type (+29 more)

### Community 75 - ".findById"
Cohesion: 0.35
Nodes (3): ScoutingService, Injectable, ScoutingEntry

### Community 76 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, @casl/ability, @casl/react, @hookform/resolvers, lucide-react, react, react-dom, react-hook-form (+6 more)

### Community 77 - "RFC 0003 — Scouting Entries"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT required), Data model, Detailed design, Drawbacks, Effect on dependency graph and tests, Frontend (+4 more)

### Community 78 - "Scoutbook — General Process & Agent Policy"
Cohesion: 0.18
Nodes (11): Agent operating policy, Architecture (HTTP + shared code), Docs layout, Out of policy until RFC'd, Product process (8 stages), Product UX (audience: PO / PM / Developer / QA), Purpose, Quality bar (+3 more)

### Community 79 - "Scoutbook — Project Charter"
Cohesion: 0.25
Nodes (8): Core Concept, GitHub Docs Sync, Long-term goal: AI-assisted implementation, MVP Scope, Problem, Scoutbook — Project Charter, Stack, Who it's for

### Community 80 - "auth.service.ts"
Cohesion: 0.11
Nodes (16): AuthService, Injectable, RegisterDto, ApiProperty, IsEmail, IsIn, MinLength, Column (+8 more)

### Community 81 - "github-api.client.ts"
Cohesion: 0.27
Nodes (7): FetchGithubApiClient, GhJson, Injectable, GithubApiClient, GithubCommitFile, GithubRepoRef, GithubSyncResult

### Community 82 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, @repo/eslint-config, @repo/typescript-config, @types/react, @types/react-dom, typescript

### Community 83 - ".put"
Cohesion: 0.09
Nodes (23): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureRfcCheckDto (+15 more)

### Community 84 - "RFC NNNN — Title"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Detailed design, Drawbacks, Effect on dependency graph and tests, Motivation, RFC NNNN — Title, Summary (+2 more)

### Community 85 - "sheet.tsx"
Cohesion: 0.18
Nodes (5): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle()

### Community 87 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, start:dev

### Community 88 - ".list"
Cohesion: 0.14
Nodes (12): AmbiguityTrackingController, parseStatusQuery(), ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiQuery, ApiTags (+4 more)

### Community 89 - "Authentication — Scouting"
Cohesion: 0.19
Nodes (7): Authentication — Scouting, Current state, Expected after implementation, Questions resolved, Expected after implementation, Per-step RACI letter ACL — Scouting, Questions resolved

### Community 90 - "Feature Record — Scouting"
Cohesion: 0.40
Nodes (4): Current state, Expected after implementation, Feature Record — Scouting, Questions resolved

### Community 91 - "exports"
Cohesion: 0.40
Nodes (5): exports, ./components/*, ./globals.css, ./hooks/*, ./lib/*

### Community 92 - "FeaturesService"
Cohesion: 0.06
Nodes (46): CheckPolicies(), CreateFeatureDto, ApiProperty, IsIn, IsString, MaxLength, MinLength, FeatureStageHistory (+38 more)

### Community 93 - "vite.config.ts"
Cohesion: 0.40
Nodes (4): root, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 94 - "UpsertFeatureReleaseLogDto"
Cohesion: 0.07
Nodes (32): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureReleaseLogDto (+24 more)

### Community 95 - "DecisionsNeededController"
Cohesion: 0.20
Nodes (8): DecisionsNeededController, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, Controller, Get

### Community 96 - "imports"
Cohesion: 0.50
Nodes (4): imports, #components/*, #hooks/*, #lib/*

### Community 98 - "scripts"
Cohesion: 0.67
Nodes (3): scripts, check-types, lint

### Community 100 - "RFC 0004 — Feature Stage Transitions"
Cohesion: 0.15
Nodes (13): Acceptance criteria, Alternatives considered, API, Detailed design, Drawbacks, Effect on dependency graph and tests, Frontend, Motivation (+5 more)

### Community 101 - "labels.ts"
Cohesion: 0.13
Nodes (14): BUG_TRIAGE_RISK_LABELS, BUG_TRIAGE_STATUS_LABELS, BUG_TRIAGE_TYPE_LABELS, FEATURE_STAGE_LABELS, IMPLEMENTATION_LOG_STATUS_LABELS, PROCESS_TRACK_LABELS, RELEASE_LOG_STATUS_LABELS, REVIEW_CHECKLIST_STATUS_LABELS (+6 more)

### Community 102 - "RFC 0021 — Turbo Test Task"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Detailed design, Local commands, Motivation, Out of scope, Package scripts, RFC 0021 — Turbo Test Task, Root `package.json` (+2 more)

### Community 105 - "alert.tsx"
Cohesion: 0.33
Nodes (3): Alert(), alertVariants, class-variance-authority

### Community 106 - "Bug triage"
Cohesion: 0.33
Nodes (6): After PO decides (scouting gap), Bug triage, First question, Minimal capture (when filing a bug), Regression checklist, Why the split matters

### Community 107 - "Scouting Entries — Scouting"
Cohesion: 0.40
Nodes (4): Current state, Expected after implementation, Questions resolved, Scouting Entries — Scouting

### Community 108 - "KanbanBoardPage.tsx"
Cohesion: 0.24
Nodes (8): FeatureStagePanel(), BoardFeatureCard(), CardProps, KanbanBoardPage(), advanceFeature(), onColumnDrop(), isImmediateNextStage(), nextFeatureStage()

### Community 109 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Definition of Done, Notes for reviewers, Summary

### Community 110 - "FeatureScoutingPanel"
Cohesion: 0.38
Nodes (5): FeatureScoutingPanel(), cancelEdit(), onSubmit(), reload(), statusBadgeVariant()

### Community 111 - "RFC 0005 — Feature RFC Check Record"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT), Data model (1:1 with Feature), Detailed design, Drawbacks, Frontend, Meaning of status (+4 more)

### Community 112 - "Detailed design"
Cohesion: 0.20
Nodes (10): Acceptance criteria, CASL (`defineAbilitiesFor`), Detailed design, Frontend, Identity, Motivation, Out of scope, RACI data model (+2 more)

### Community 113 - "index.ts"
Cohesion: 0.07
Nodes (36): FeatureRelationResponseDto, ApiProperty, FeatureReleaseLogResponseDto, ApiProperty, RaciAssignmentResponseDto, ApiProperty, FeatureDetailPage(), RFC-0012 (+28 more)

### Community 114 - "Feature Stage Transitions — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Stage Transitions — Scouting, Questions resolved

### Community 116 - "0000-charter.md"
Cohesion: 0.11
Nodes (13): Claude-specific, graphify, Scoutbook (Claude Code), API request / response envelope, Failure, Success, Web client, CODEOWNERS — Scouting (+5 more)

### Community 117 - "Detailed design"
Cohesion: 0.18
Nodes (11): Acceptance criteria, Alternatives considered, API (JWT), Data model, Detailed design, Frontend, Motivation, Out of scope (+3 more)

### Community 118 - "RFC 0002 — Feature Record Core"
Cohesion: 0.17
Nodes (12): Acceptance criteria, API contract, Data model, Decision, Frontend, `GET /features`, `GET /features/:id`, Goals (+4 more)

### Community 119 - "RFC 0010 — Feature Release Log & Bug Triage"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Bug triage rows (0-N), Detailed design, Frontend, Motivation, Release log (0-or-1), RFC 0010 — Feature Release Log & Bug Triage (+2 more)

### Community 121 - "Feature Dependency Graph — Scouting"
Cohesion: 0.21
Nodes (6): Expected after implementation, Feature Dependency Graph — Scouting, Questions resolved, Expected after implementation, Feature RFC Check — Scouting, Questions resolved

### Community 122 - "feature-scouting-panel.tsx"
Cohesion: 0.09
Nodes (32): defaultValues, FormValues, Props, schema, emptyValues, FeatureImplementationLogPanel(), FormValues, Props (+24 more)

### Community 123 - "Detailed design"
Cohesion: 0.18
Nodes (11): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Default seed steps (lifecycle), Detailed design, Frontend, Motivation (+3 more)

### Community 124 - "RFC 0008 — Feature Testing Checklist"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Detailed design, Frontend, Motivation, RFC 0008 — Feature Testing Checklist (+2 more)

### Community 125 - "Detailed design"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT), Data model (0–1 per Feature), Detailed design, Docs sync, Frontend, Motivation (+4 more)

### Community 126 - "RFC 0007 — Feature Implementation Log"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Detailed design, Frontend, Motivation, RFC 0007 — Feature Implementation Log (+2 more)

### Community 127 - "swagger.ts"
Cohesion: 0.35
Nodes (8): bootstrap(), exportOpenApi(), buildOpenApiDocument(), __dirname, OPENAPI_YAML_PATHS, setupSwagger(), writeOpenApiYaml(), yaml

### Community 128 - "RFC 0012 — Decisions Needed Inbox"
Cohesion: 0.14
Nodes (12): Decisions Needed — Scouting, Expected after implementation, Questions resolved, Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Detailed design, Frontend (+4 more)

### Community 129 - "Detailed design"
Cohesion: 0.17
Nodes (12): Acceptance criteria, API, Data model, Detailed design, Docs sync, Frontend, Motivation, Out of scope (+4 more)

### Community 130 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, @nestjs/cli, @nestjs/mau, @nestjs/schematics, @nestjs/testing, oxlint, prettier, source-map-support (+12 more)

### Community 131 - "RFC 0019 — CASL Role Permissions"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API, Detailed design, Drawbacks, Effect on dependency graph and tests, Matrix (v1), Motivation (+4 more)

### Community 132 - "Feature Implementation Log — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Implementation Log — Scouting, Questions resolved

### Community 133 - "features.module.ts"
Cohesion: 0.13
Nodes (14): ROLES_KEY, FeatureTestingChecklistResponseDto, ApiProperty, FeatureRaciAclService, Injectable, FeatureTestingChecklistService, Injectable, InjectRepository (+6 more)

### Community 134 - "0017-process-visuals.md"
Cohesion: 0.15
Nodes (11): Expected after implementation, Process visuals — Scouting, Questions resolved, Acceptance criteria, Detailed design, Motivation, Out of scope, Process flowchart (`/lifecycle`) (+3 more)

### Community 135 - "Feature Testing Checklist — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Testing Checklist — Scouting, Questions resolved

### Community 136 - "RFC 0009 — Feature Review Checklist"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Detailed design, Frontend, Motivation, RFC 0009 — Feature Review Checklist (+2 more)

### Community 137 - "generate-docs.ts"
Cohesion: 0.18
Nodes (17): escapeMdCell(), FeatureBundle, featureSlug(), GeneratedFile, generateDocsMarkdown(), OverviewInput, RaciRow, RelationEdge (+9 more)

### Community 138 - "features.service.ts"
Cohesion: 0.06
Nodes (38): GITHUB_API_CLIENT, AdvanceFeatureStageDto, ApiProperty, IsIn, FeatureResponseDto, ApiProperty, FeatureStageHistoryResponseDto, ApiProperty (+30 more)

### Community 139 - "FeatureBugTriagePanel"
Cohesion: 0.67
Nodes (3): FeatureBugTriagePanel(), cancelEdit(), onSubmit()

### Community 140 - "RFC 0011 — Feature Kanban Board"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Data, Detailed design, Frontend, Interactions, Motivation, Out of scope (+2 more)

### Community 141 - "Detailed design"
Cohesion: 0.17
Nodes (12): Acceptance criteria, API, CASL, Data model, Defaults, Detailed design, Motivation, Out of scope (+4 more)

### Community 142 - "Feature Release Log & Bug Triage — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Release Log & Bug Triage — Scouting, Questions resolved

### Community 143 - "UpsertFeatureTestingChecklistDto"
Cohesion: 0.22
Nodes (8): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureTestingChecklistDto

### Community 144 - "0023-ambiguity-tracking.md"
Cohesion: 0.11
Nodes (14): Expected after implementation, Questions resolved, Requirement Ambiguity Tracking — Scouting, Expected after implementation, Questions resolved, Scouting checklist template — Scouting, Acceptance criteria, API (JWT — any authenticated) (+6 more)

### Community 145 - ".constructor"
Cohesion: 0.25
Nodes (7): InjectRepository, GithubConnection, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Inject

### Community 146 - "UpsertDocsSyncConnectionDto"
Cohesion: 0.29
Nodes (7): ApiProperty, ApiPropertyOptional, IsOptional, IsString, MaxLength, MinLength, UpsertDocsSyncConnectionDto

### Community 147 - "feature-rfc-check-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureRfcCheckPanel(), FormValues, Props, schema

### Community 148 - "Detailed design"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT), Data model, Detailed design, Frontend, Generated files, GitHub flow (+4 more)

### Community 149 - "Feature RFC Document — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature RFC Document — Scouting, Questions resolved

### Community 150 - "NewFeaturePage.tsx"
Cohesion: 0.09
Nodes (24): EDITABLE, FeatureProcessTrackPanel(), onRiskChange(), Props, DraftRow, Props, ROLE_COLS, DependencyGraphCanvas() (+16 more)

### Community 152 - "feature-graph-node.tsx"
Cohesion: 0.40
Nodes (3): FeatureGraphNode, FeatureGraphNodeData, @xyflow/react

### Community 153 - "UpsertFeatureReviewChecklistDto"
Cohesion: 0.07
Nodes (32): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureReviewChecklistDto (+24 more)

### Community 154 - "token-crypto.ts"
Cohesion: 0.73
Nodes (4): decryptToken(), encryptToken(), parseEncryptionKey(), tokenLastFour()

### Community 155 - "raci-diagram.tsx"
Cohesion: 0.40
Nodes (5): cellClass(), Props, RaciDiagram(), RaciDiagramRow, ROLE_COLS

### Community 156 - "feature-release-log-panel.tsx"
Cohesion: 0.14
Nodes (11): emptyValues, FeatureReleaseLogPanel(), FormValues, Props, schema, emptyValues, FeatureRfcDocumentPanel(), FormValues (+3 more)

### Community 157 - "feature-lifecycle.md"
Cohesion: 0.22
Nodes (3): Expected after implementation, Feature Review Checklist — Scouting, Questions resolved

### Community 158 - "CreateScoutingEntryDto"
Cohesion: 0.25
Nodes (8): CreateScoutingEntryDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, MinLength

### Community 159 - "UpdateScoutingEntryDto"
Cohesion: 0.29
Nodes (7): ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, MinLength, UpdateScoutingEntryDto

### Community 160 - "TestInventoryPage"
Cohesion: 0.53
Nodes (5): TestInventoryPage(), onCreate(), onDelete(), onTierChange(), reload()

### Community 161 - "RFC 0020 — CODEOWNERS Ownership Mapping"
Cohesion: 0.22
Nodes (9): Acceptance criteria, Detailed design, File, Mapping (v1), Motivation, Out of scope, RFC 0020 — CODEOWNERS Ownership Mapping, Summary (+1 more)

### Community 162 - "LoginDto"
Cohesion: 0.50
Nodes (3): LoginDto, IsEmail, IsNotEmpty

### Community 164 - "Detailed design"
Cohesion: 0.22
Nodes (9): Acceptance criteria, API, Detailed design, Frontend, Motivation, Out of scope, RFC 0024 — Scouting Checklist Template, Shared constant (`@scoutbook/types`) (+1 more)

### Community 165 - "RFC 0018 — Risk-Based Test Inventory"
Cohesion: 0.14
Nodes (14): Acceptance criteria, Alternatives considered, Artifact, Detailed design, Drawbacks, Effect on dependency graph and tests, Motivation, Out of scope (this RFC) (+6 more)

### Community 166 - "CASL Role Permissions — Scouting"
Cohesion: 0.50
Nodes (3): CASL Role Permissions — Scouting, Expected after implementation, Questions resolved

### Community 167 - "Designer + Tech Lead roles — Scouting"
Cohesion: 0.50
Nodes (3): Designer + Tech Lead roles — Scouting, Expected after implementation, Questions resolved

### Community 169 - "GitHub Docs Sync — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, GitHub Docs Sync — Scouting, Questions resolved

### Community 170 - "FeatureRaciPanel"
Cohesion: 0.36
Nodes (5): FeatureRaciPanel(), save(), seed(), letterLabel(), toDraft()

### Community 171 - "RegisterDto"
Cohesion: 0.40
Nodes (5): RegisterDto, IsEmail, IsIn, IsNotEmpty, MinLength

### Community 172 - "0021-turbo-test-task.md"
Cohesion: 0.40
Nodes (3): Expected after implementation, Questions resolved, Turbo test task — Scouting

### Community 174 - "Feature RACI Matrix — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature RACI Matrix — Scouting, Questions resolved

### Community 175 - "Risk-based test inventory"
Cohesion: 0.19
Nodes (9): Expected after implementation, Questions resolved, Risk-Based Test Inventory — Scouting, Change log, How to use (until CI exists), Inventory (Scoutbook v1), Mapping to existing unit tests (today), Risk-based test inventory (+1 more)

### Community 176 - "feature-testing-checklist-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureTestingChecklistPanel(), FormValues, Props, schema

### Community 178 - "Detailed design"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Action → step → letters, Alternatives considered, API, Detailed design, Helpers (`@scoutbook/types`), Motivation, Not gated (this RFC) (+4 more)

### Community 180 - "Scoutbook API — OpenAPI"
Cohesion: 0.40
Nodes (4): Auth in Swagger UI, Errors, Regenerate from Nest decorators, Scoutbook API — OpenAPI

### Community 183 - "Feature process track (Light vs RFC) — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature process track (Light vs RFC) — Scouting, Questions resolved

### Community 184 - "test-inventory.controller.ts"
Cohesion: 0.11
Nodes (18): CaslAbilityFactory, Injectable, CHECK_POLICIES_KEY, PolicyHandler, PoliciesGuard, Injectable, TestInventoryItemResponseDto, ApiProperty (+10 more)

### Community 185 - "FeatureRfcCheck"
Cohesion: 0.13
Nodes (14): FeatureRfcCheckResponseDto, ApiProperty, FeatureRfcCheck, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+6 more)

### Community 186 - ".login"
Cohesion: 0.07
Nodes (29): ApiConflictResponse, AppController, ApiOkResponse, ApiOperation, ApiTags, Controller, Get, AppService (+21 more)

### Community 191 - "feature-review-checklist-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureReviewChecklistPanel(), FormValues, Props, schema

### Community 193 - "Feature Kanban Board — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Kanban Board — Scouting, Questions resolved

## Knowledge Gaps
- **1038 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+1033 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1579 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `features.module.ts` to `scouting.service.ts`, `app.module.ts`, `feature-bug-triage.service.ts`, `api/package.json`, `token-crypto.ts`, `features.service.ts`, `@nestjs/swagger`, `auth.service.ts`, `github-api.client.ts`, `index.ts`, `test-inventory.controller.ts`, `.login`, `api-response.ts`, `swagger.ts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `@nestjs/swagger` to `api.ts`, `features.module.ts`, `features.service.ts`, `.update`, `.upsert`, `.put`, `.create`, `FeatureRfcDocument`, `feature-bug-triage.service.ts`, `UpsertFeatureReviewChecklistDto`, `FeatureImplementationLog`, `test-inventory.controller.ts`, `.login`, `scouting.service.ts`, `app.module.ts`, `.create`, `auth.service.ts`, `.put`, `FeaturesService`, `UpsertFeatureReleaseLogDto`, `index.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Why does `cn` connect `TestInventoryPage.tsx` to `app-header.tsx`, `card.tsx`, `ui/package.json`, `sidebar.tsx`, `DashboardLayout.tsx`, `alert.tsx`, `sheet.tsx`, `NewFeaturePage.tsx`, `avatar.tsx`, `feature-scouting-panel.tsx`, `feature-release-log-panel.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _1038 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `api.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.04983388704318937 - nodes in this community are weakly interconnected._
- **Should `Scoutbook — Agent Policy` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._