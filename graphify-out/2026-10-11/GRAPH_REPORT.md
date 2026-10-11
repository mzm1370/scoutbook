# Graph Report - scoutbook  (2026-10-11)

## Corpus Check
- 300 files · ~105,546 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 7, .mdc 2, .css 2)

## Summary
- 2479 nodes · 4601 edges · 181 communities (157 shown, 19 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 71 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b62cba2f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.ts
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
- .login
- UpsertFeatureReviewChecklistDto
- package.json
- UpsertFeatureTestingChecklistDto
- web/components.json
- ui/components.json
- compilerOptions
- RFC 0001 — Authentication
- compilerOptions
- ScoutingService
- devDependencies
- tasks
- .replace
- .put
- .findById
- compilerOptions
- api/README.md
- compilerOptions
- docs-sync.controller.ts
- .put
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
- UserRole
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
- FeaturesService
- app-header.tsx
- app.module.ts
- RegisterPage.tsx
- app.controller.ts
- FeaturesPage.tsx
- Feature lifecycle (8 stages)
- DashboardLayout.tsx
- Scoutbook — Agent Policy
- RFC 0013 — Feature Stage History
- dependencies
- .create
- upsert-feature-review-checklist.dto.ts
- dependencies
- RFC 0003 — Scouting Entries
- Scoutbook — General Process & Agent Policy
- Scoutbook — Project Charter
- @nestjs/common
- scripts
- devDependencies
- .put
- RFC NNNN — Title
- sheet.tsx
- App.tsx
- scripts
- Scoutbook API — OpenAPI
- Authentication — Scouting
- Feature Record — Scouting
- exports
- .upsert
- vite.config.ts
- UpsertFeatureReleaseLogDto
- replace-feature-raci.dto.ts
- imports
- eslint.config.js
- scripts
- http-interceptor.ts
- RFC 0004 — Feature Stage Transitions
- labels.ts
- feature-testing-checklist-panel.tsx
- feature-raci-panel.tsx
- Bug triage
- Scouting Entries — Scouting
- KanbanBoardPage.tsx
- PULL_REQUEST_TEMPLATE.md
- feature-scouting-panel.tsx
- RFC 0005 — Feature RFC Check Record
- cn
- @nestjs/swagger
- Feature Stage Transitions — Scouting
- after-compile.sh
- Feature RACI Matrix — Scouting
- Detailed design
- RFC 0002 — Feature Record Core
- RFC 0010 — Feature Release Log & Bug Triage
- Feature RFC Check — Scouting
- feature-rfc-check-panel.tsx
- Detailed design
- RFC 0008 — Feature Testing Checklist
- Detailed design
- RFC 0007 — Feature Implementation Log
- swagger.ts
- RFC 0012 — Decisions Needed Inbox
- auth.controller.ts
- devDependencies
- RFC 0019 — CASL Role Permissions
- Feature Implementation Log — Scouting
- Feature
- RFC 0017 — Process Visuals (Flowchart + RACI Diagram)
- Feature Testing Checklist — Scouting
- RFC 0009 — Feature Review Checklist
- generate-docs.ts
- feature-rfc-document-panel.tsx
- FeatureBugTriagePanel
- RFC 0011 — Feature Kanban Board
- Feature Review Checklist — Scouting
- Feature Release Log & Bug Triage — Scouting
- upsert-feature-release-log.dto.ts
- FeatureImplementationLog
- github-api.client.ts
- features.module.ts
- AuthUser
- Detailed design
- Feature RFC Document — Scouting
- feature-bug-triage-panel.tsx
- Decisions Needed — Scouting
- feature-graph-node.tsx
- raci-diagram.tsx
- class-validator
- Feature Dependency Graph — Scouting
- CASL Role Permissions — Scouting
- RaciAssignment
- ScoutingEntry
- Scoutbook (Claude Code)
- RFC 0020 — CODEOWNERS Ownership Mapping
- AbilityContext.tsx
- LoginDto
- RfcCheckStatus
- RFC 0018 — Risk-Based Test Inventory
- upsert-feature-rfc-document.dto.ts
- API request / response envelope
- GitHub Docs Sync — Scouting
- upsert-feature-testing-checklist.dto.ts
- alert.tsx
- feature-stage.ts
- SettingsPage
- Feature Kanban Board — Scouting
- Risk-based test inventory
- Process visuals — Scouting
- LoginPage.tsx
- vite-tsconfig-paths
- CODEOWNERS — Scouting
- Risk-Based Test Inventory — Scouting

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 68 edges
2. `@nestjs/swagger` - 50 edges
3. `FeaturesService` - 40 edges
4. `AuthUser` - 36 edges
5. `typeorm` - 28 edges
6. `Button()` - 25 edges
7. `CurrentUser` - 24 edges
8. `FeatureStage` - 23 edges
9. `compilerOptions` - 22 edges
10. `UserRole` - 22 edges

## Surprising Connections (you probably didn't know these)
- `AuthUserDto` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/dto/auth-response.dto.ts → packages/types/src/index.ts
- `RegisterDto` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/dto/register.dto.ts → packages/types/src/index.ts
- `JwtPayload` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/guards/jwt-auth.guard.ts → packages/types/src/index.ts
- `ErrorResponseDto` --references--> `ApiErrorCode`  [EXTRACTED]
  apps/api/src/common/dto/error-response.dto.ts → packages/types/src/index.ts
- `CreateFeatureRelationDto` --references--> `FeatureRelationType`  [EXTRACTED]
  apps/api/src/features/dto/create-feature-relation.dto.ts → packages/types/src/index.ts

## Import Cycles
- None detected.

## Communities (181 total, 19 thin omitted)

### Community 0 - "index.ts"
Cohesion: 0.06
Nodes (46): AuthContext, AuthContextValue, AuthProvider(), authApi, bugTriageApi, decisionsNeededApi, docsSyncApi, featureRelationsApi (+38 more)

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

### Community 12 - ".login"
Cohesion: 0.11
Nodes (18): ApiConflictResponse, AuthController, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags (+10 more)

### Community 13 - "UpsertFeatureReviewChecklistDto"
Cohesion: 0.09
Nodes (25): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureReviewChecklistDto (+17 more)

### Community 14 - "package.json"
Cohesion: 0.11
Nodes (18): devDependencies, prettier, turbo, typescript, engines, node, prettier, typescript (+10 more)

### Community 15 - "UpsertFeatureTestingChecklistDto"
Cohesion: 0.09
Nodes (25): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureTestingChecklistDto (+17 more)

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

### Community 21 - "ScoutingService"
Cohesion: 0.06
Nodes (43): DecisionsNeededController, ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, Controller, Get (+35 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+8 more)

### Community 23 - "tasks"
Cohesion: 0.13
Nodes (14): dependsOn, inputs, outputs, dependsOn, cache, persistent, dependsOn, $schema (+6 more)

### Community 24 - ".replace"
Cohesion: 0.07
Nodes (37): RaciAssignmentInputDto, ReplaceFeatureRaciDto, ApiProperty, ApiPropertyOptional, IsIn, IsInt, IsOptional, IsString (+29 more)

### Community 25 - ".put"
Cohesion: 0.09
Nodes (25): ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureRfcDocumentDto, FeatureRfcDocumentController (+17 more)

### Community 26 - ".findById"
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

### Community 30 - "docs-sync.controller.ts"
Cohesion: 0.19
Nodes (11): CaslAbilityFactory, Injectable, CHECK_POLICIES_KEY, CheckPolicies(), PolicyHandler, PoliciesGuard, Injectable, DocsSyncConnectionResponseDto (+3 more)

### Community 31 - ".put"
Cohesion: 0.09
Nodes (24): ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureImplementationLogDto, FeatureImplementationLogController (+16 more)

### Community 32 - "What's inside?"
Cohesion: 0.20
Nodes (9): Apps and Packages, Build, Develop, Remote Caching, Turborepo starter, Useful Links, Using this example, Utilities (+1 more)

### Community 33 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 34 - "sidebar.tsx"
Cohesion: 0.10
Nodes (19): mainNav, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupContent() (+11 more)

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

### Community 44 - "UserRole"
Cohesion: 0.07
Nodes (25): AuthModule, Module, IS_PUBLIC_KEY, ROLES_KEY, JwtAuthGuard, JwtPayload, Injectable, RolesGuard (+17 more)

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
Cohesion: 0.10
Nodes (19): AllExceptionsFilter, ApiResponse, RequestWithId, ResponseTransformInterceptor, Injectable, apiErrorFromBody(), isApiFailure(), isApiSuccess() (+11 more)

### Community 63 - "FeaturesService"
Cohesion: 0.09
Nodes (28): CreateFeatureDto, ApiProperty, IsIn, IsString, MaxLength, MinLength, FeaturesController, ApiBadRequestResponse (+20 more)

### Community 64 - "app-header.tsx"
Cohesion: 0.15
Nodes (8): AppHeader(), initials(), DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuSeparator(), DropdownMenuTrigger()

### Community 65 - "app.module.ts"
Cohesion: 0.13
Nodes (14): AppModule, { ObserveModule, ObserveInstrument }, Module, RequestContextMiddleware, RequestWithId, Injectable, DocsSyncModule, Module (+6 more)

### Community 66 - "RegisterPage.tsx"
Cohesion: 0.13
Nodes (20): FeatureStageHistoryPanel(), formatWhen(), Props, Props, LoginFormProps, LoginFormValues, loginSchema, stages (+12 more)

### Community 67 - "app.controller.ts"
Cohesion: 0.22
Nodes (9): AppController, ApiOkResponse, ApiOperation, ApiTags, Controller, Get, AppService, Injectable (+1 more)

### Community 68 - "FeaturesPage.tsx"
Cohesion: 0.22
Nodes (8): FeaturesPage(), Skeleton(), Table(), TableBody(), TableCell(), TableHead(), TableHeader(), TableRow()

### Community 69 - "Feature lifecycle (8 stages)"
Cohesion: 0.15
Nodes (13): Artifacts per feature, Core rule, Definition of Done, Feature lifecycle (8 stages), Stage 1 — Idea, Stage 2 — Scouting, Stage 3 — RFC check, Stage 4 — RACI (+5 more)

### Community 70 - "DashboardLayout.tsx"
Cohesion: 0.28
Nodes (7): crumbForPath(), DashboardLayout(), SidebarInset(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

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
Cohesion: 0.09
Nodes (29): CreateFeatureRelationDto, ApiProperty, ApiPropertyOptional, IsIn, IsInt, IsOptional, Min, Type (+21 more)

### Community 75 - "upsert-feature-review-checklist.dto.ts"
Cohesion: 0.47
Nodes (4): FeatureReviewChecklistResponseDto, ApiProperty, REVIEW_CHECKLIST_STATUSES, ReviewChecklistStatus

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

### Community 80 - "@nestjs/common"
Cohesion: 0.19
Nodes (4): DEFAULT_RACI_STEPS, defineAbilitiesFor(), @nestjs/common, vitest

### Community 81 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, deploy, format, lint, openapi:export, start, start:debug (+7 more)

### Community 82 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, @repo/eslint-config, @repo/typescript-config, @types/react, @types/react-dom, typescript

### Community 83 - ".put"
Cohesion: 0.09
Nodes (26): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureRfcCheckDto (+18 more)

### Community 84 - "RFC NNNN — Title"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Detailed design, Drawbacks, Effect on dependency graph and tests, Motivation, RFC NNNN — Title, Summary (+2 more)

### Community 85 - "sheet.tsx"
Cohesion: 0.18
Nodes (5): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle()

### Community 87 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, start:dev

### Community 88 - "Scoutbook API — OpenAPI"
Cohesion: 0.40
Nodes (4): Auth in Swagger UI, Errors, Regenerate from Nest decorators, Scoutbook API — OpenAPI

### Community 89 - "Authentication — Scouting"
Cohesion: 0.40
Nodes (4): Authentication — Scouting, Current state, Expected after implementation, Questions resolved

### Community 90 - "Feature Record — Scouting"
Cohesion: 0.40
Nodes (4): Current state, Expected after implementation, Feature Record — Scouting, Questions resolved

### Community 91 - "exports"
Cohesion: 0.40
Nodes (5): exports, ./components/*, ./globals.css, ./hooks/*, ./lib/*

### Community 92 - ".upsert"
Cohesion: 0.09
Nodes (31): DocsSyncController, ApiBadRequestResponse, ApiBearerAuth, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags (+23 more)

### Community 93 - "vite.config.ts"
Cohesion: 0.40
Nodes (4): root, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 94 - "UpsertFeatureReleaseLogDto"
Cohesion: 0.07
Nodes (32): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureReleaseLogDto (+24 more)

### Community 95 - "replace-feature-raci.dto.ts"
Cohesion: 0.21
Nodes (9): FeatureRelationResponseDto, ApiProperty, RaciAssignmentResponseDto, ApiProperty, FEATURE_RELATION_TYPES, FeatureRelationType, RACI_VALUES, RaciValue (+1 more)

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
Cohesion: 0.14
Nodes (13): BUG_TRIAGE_RISK_LABELS, BUG_TRIAGE_STATUS_LABELS, BUG_TRIAGE_TYPE_LABELS, FEATURE_STAGE_LABELS, IMPLEMENTATION_LOG_STATUS_LABELS, RELEASE_LOG_STATUS_LABELS, REVIEW_CHECKLIST_STATUS_LABELS, RFC_CHECK_STATUS_LABELS (+5 more)

### Community 102 - "feature-testing-checklist-panel.tsx"
Cohesion: 0.19
Nodes (10): emptyValues, FeatureTestingChecklistPanel(), FormValues, Props, schema, Badge(), badgeVariants, Button() (+2 more)

### Community 105 - "feature-raci-panel.tsx"
Cohesion: 0.22
Nodes (9): DraftRow, FeatureRaciPanel(), save(), seed(), letterLabel(), Props, ROLE_COLS, toDraft() (+1 more)

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

### Community 110 - "feature-scouting-panel.tsx"
Cohesion: 0.24
Nodes (9): defaultValues, FeatureScoutingPanel(), cancelEdit(), onSubmit(), reload(), FormValues, Props, schema (+1 more)

### Community 111 - "RFC 0005 — Feature RFC Check Record"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT), Data model (1:1 with Feature), Detailed design, Drawbacks, Frontend, Meaning of status (+4 more)

### Community 112 - "cn"
Cohesion: 0.16
Nodes (6): Avatar(), AvatarFallback(), Label(), Separator(), cn, radix-ui

### Community 113 - "@nestjs/swagger"
Cohesion: 0.12
Nodes (18): AdvanceFeatureStageDto, ApiProperty, IsIn, DecisionNeededItemResponseDto, ApiProperty, FeatureResponseDto, ApiProperty, FeatureStageHistoryResponseDto (+10 more)

### Community 114 - "Feature Stage Transitions — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Stage Transitions — Scouting, Questions resolved

### Community 116 - "Feature RACI Matrix — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature RACI Matrix — Scouting, Questions resolved

### Community 117 - "Detailed design"
Cohesion: 0.18
Nodes (11): Acceptance criteria, Alternatives considered, API (JWT), Data model, Detailed design, Frontend, Motivation, Out of scope (+3 more)

### Community 118 - "RFC 0002 — Feature Record Core"
Cohesion: 0.17
Nodes (12): Acceptance criteria, API contract, Data model, Decision, Frontend, `GET /features`, `GET /features/:id`, Goals (+4 more)

### Community 119 - "RFC 0010 — Feature Release Log & Bug Triage"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Bug triage rows (0-N), Detailed design, Frontend, Motivation, Release log (0-or-1), RFC 0010 — Feature Release Log & Bug Triage (+2 more)

### Community 121 - "Feature RFC Check — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature RFC Check — Scouting, Questions resolved

### Community 122 - "feature-rfc-check-panel.tsx"
Cohesion: 0.09
Nodes (29): emptyValues, FeatureImplementationLogPanel(), FormValues, Props, schema, emptyValues, FeatureReviewChecklistPanel(), FormValues (+21 more)

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
Cohesion: 0.22
Nodes (9): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Detailed design, Frontend, Motivation, Out of scope, RFC 0012 — Decisions Needed Inbox (+1 more)

### Community 129 - "auth.controller.ts"
Cohesion: 0.15
Nodes (15): AuthUserDto, HealthResponseDto, LoginResponseDto, ApiProperty, LoginDto, ApiProperty, IsEmail, IsNotEmpty (+7 more)

### Community 130 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, @nestjs/cli, @nestjs/mau, @nestjs/schematics, @nestjs/testing, oxlint, prettier, source-map-support (+12 more)

### Community 131 - "RFC 0019 — CASL Role Permissions"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API, Detailed design, Drawbacks, Effect on dependency graph and tests, Matrix (v1), Motivation (+4 more)

### Community 132 - "Feature Implementation Log — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Implementation Log — Scouting, Questions resolved

### Community 133 - "Feature"
Cohesion: 0.07
Nodes (28): InjectRepository, GithubConnection, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, Feature, Column (+20 more)

### Community 134 - "RFC 0017 — Process Visuals (Flowchart + RACI Diagram)"
Cohesion: 0.25
Nodes (8): Acceptance criteria, Detailed design, Motivation, Out of scope, Process flowchart (`/lifecycle`), RFC 0017 — Process Visuals (Flowchart + RACI Diagram), Summary, Visual RACI (Feature detail)

### Community 135 - "Feature Testing Checklist — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Testing Checklist — Scouting, Questions resolved

### Community 136 - "RFC 0009 — Feature Review Checklist"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Detailed design, Frontend, Motivation, RFC 0009 — Feature Review Checklist (+2 more)

### Community 137 - "generate-docs.ts"
Cohesion: 0.18
Nodes (17): escapeMdCell(), FeatureBundle, featureSlug(), GeneratedFile, generateDocsMarkdown(), OverviewInput, RaciRow, RelationEdge (+9 more)

### Community 138 - "feature-rfc-document-panel.tsx"
Cohesion: 0.25
Nodes (6): emptyValues, FeatureRfcDocumentPanel(), FormValues, Props, schema, react-hook-form

### Community 139 - "FeatureBugTriagePanel"
Cohesion: 0.67
Nodes (3): FeatureBugTriagePanel(), cancelEdit(), onSubmit()

### Community 140 - "RFC 0011 — Feature Kanban Board"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Data, Detailed design, Frontend, Interactions, Motivation, Out of scope (+2 more)

### Community 141 - "Feature Review Checklist — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Review Checklist — Scouting, Questions resolved

### Community 142 - "Feature Release Log & Bug Triage — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Release Log & Bug Triage — Scouting, Questions resolved

### Community 143 - "upsert-feature-release-log.dto.ts"
Cohesion: 0.47
Nodes (4): FeatureReleaseLogResponseDto, ApiProperty, RELEASE_LOG_STATUSES, ReleaseLogStatus

### Community 144 - "FeatureImplementationLog"
Cohesion: 0.07
Nodes (28): FeatureImplementationLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, FeatureReviewChecklist (+20 more)

### Community 145 - "github-api.client.ts"
Cohesion: 0.23
Nodes (9): FetchGithubApiClient, GhJson, Injectable, GithubApiClient, GithubCommitFile, GithubRepoRef, GithubSyncResult, normalizeGithubRepoUrl() (+1 more)

### Community 146 - "features.module.ts"
Cohesion: 0.17
Nodes (11): RELATION_ENUM, FeatureRfcDocument, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn (+3 more)

### Community 147 - "AuthUser"
Cohesion: 0.40
Nodes (6): CurrentUser, ApiFailureEnvelopeDto, ErrorResponseDto, ApiProperty, ApiPropertyOptional, AuthUser

### Community 148 - "Detailed design"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT), Data model, Detailed design, Frontend, Generated files, GitHub flow (+4 more)

### Community 149 - "Feature RFC Document — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature RFC Document — Scouting, Questions resolved

### Community 150 - "feature-bug-triage-panel.tsx"
Cohesion: 0.09
Nodes (18): defaultValues, FormValues, Props, schema, emptyValues, FeatureReleaseLogPanel(), FormValues, Props (+10 more)

### Community 151 - "Decisions Needed — Scouting"
Cohesion: 0.50
Nodes (3): Decisions Needed — Scouting, Expected after implementation, Questions resolved

### Community 152 - "feature-graph-node.tsx"
Cohesion: 0.40
Nodes (3): FeatureGraphNode, FeatureGraphNodeData, @xyflow/react

### Community 153 - "raci-diagram.tsx"
Cohesion: 0.40
Nodes (5): cellClass(), Props, RaciDiagram(), RaciDiagramRow, ROLE_COLS

### Community 154 - "class-validator"
Cohesion: 0.20
Nodes (9): FeatureImplementationLogResponseDto, ApiProperty, ScoutingEntryResponseDto, ApiProperty, IMPLEMENTATION_LOG_STATUSES, ImplementationLogStatus, SCOUTING_STATUSES, ScoutingStatus (+1 more)

### Community 155 - "Feature Dependency Graph — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Dependency Graph — Scouting, Questions resolved

### Community 156 - "CASL Role Permissions — Scouting"
Cohesion: 0.50
Nodes (3): CASL Role Permissions — Scouting, Expected after implementation, Questions resolved

### Community 158 - "RaciAssignment"
Cohesion: 0.20
Nodes (9): RaciAssignment, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique, UpdateDateColumn (+1 more)

### Community 159 - "ScoutingEntry"
Cohesion: 0.22
Nodes (8): ScoutingEntry, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, InjectRepository

### Community 160 - "Scoutbook (Claude Code)"
Cohesion: 0.50
Nodes (3): Claude-specific, graphify, Scoutbook (Claude Code)

### Community 161 - "RFC 0020 — CODEOWNERS Ownership Mapping"
Cohesion: 0.22
Nodes (9): Acceptance criteria, Detailed design, File, Mapping (v1), Motivation, Out of scope, RFC 0020 — CODEOWNERS Ownership Mapping, Summary (+1 more)

### Community 162 - "AbilityContext.tsx"
Cohesion: 0.33
Nodes (5): AbilityContext, AbilityProvider(), emptyAbility(), AppAction, AppSubject

### Community 163 - "LoginDto"
Cohesion: 0.50
Nodes (3): LoginDto, IsEmail, IsNotEmpty

### Community 164 - "RfcCheckStatus"
Cohesion: 0.47
Nodes (4): FeatureRfcCheckResponseDto, ApiProperty, RFC_CHECK_STATUSES, RfcCheckStatus

### Community 165 - "RFC 0018 — Risk-Based Test Inventory"
Cohesion: 0.14
Nodes (14): Acceptance criteria, Alternatives considered, Artifact, Detailed design, Drawbacks, Effect on dependency graph and tests, Motivation, Out of scope (this RFC) (+6 more)

### Community 166 - "upsert-feature-rfc-document.dto.ts"
Cohesion: 0.47
Nodes (4): FeatureRfcDocumentResponseDto, ApiProperty, RFC_DOCUMENT_STATUSES, RfcDocumentStatus

### Community 168 - "API request / response envelope"
Cohesion: 0.50
Nodes (4): API request / response envelope, Failure, Success, Web client

### Community 169 - "GitHub Docs Sync — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, GitHub Docs Sync — Scouting, Questions resolved

### Community 170 - "upsert-feature-testing-checklist.dto.ts"
Cohesion: 0.47
Nodes (4): FeatureTestingChecklistResponseDto, ApiProperty, TESTING_CHECKLIST_STATUSES, TestingChecklistStatus

### Community 174 - "Feature Kanban Board — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Kanban Board — Scouting, Questions resolved

### Community 175 - "Risk-based test inventory"
Cohesion: 0.33
Nodes (6): Change log, How to use (until CI exists), Inventory (Scoutbook v1), Mapping to existing unit tests (today), Risk-based test inventory, Tier legend

### Community 176 - "Process visuals — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Process visuals — Scouting, Questions resolved

### Community 179 - "CODEOWNERS — Scouting"
Cohesion: 0.67
Nodes (3): CODEOWNERS — Scouting, Expected after implementation, Questions resolved

### Community 180 - "Risk-Based Test Inventory — Scouting"
Cohesion: 0.67
Nodes (3): Expected after implementation, Questions resolved, Risk-Based Test Inventory — Scouting

## Knowledge Gaps
- **946 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+941 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1432 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `app.module.ts`, `auth.controller.ts`, `app.controller.ts`, `api/package.json`, `class-validator`, `UserRole`, `github-api.client.ts`, `features.module.ts`, `AuthUser`, `@nestjs/swagger`, `api-response.ts`, `.findById`, `.upsert`, `docs-sync.controller.ts`, `swagger.ts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `cn` connect `cn` to `app-header.tsx`, `RegisterPage.tsx`, `ui/package.json`, `sidebar.tsx`, `FeaturesPage.tsx`, `feature-testing-checklist-panel.tsx`, `DashboardLayout.tsx`, `alert.tsx`, `sheet.tsx`, `feature-bug-triage-panel.tsx`, `feature-rfc-check-panel.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `AuthUser` connect `AuthUser` to `index.ts`, `auth.controller.ts`, `.create`, `.login`, `UserRole`, `UpsertFeatureReviewChecklistDto`, `UpsertFeatureTestingChecklistDto`, `@nestjs/swagger`, `.put`, `.put`, `UpsertFeatureReleaseLogDto`, `.findById`, `.upsert`, `FeaturesService`, `docs-sync.controller.ts`, `.put`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _946 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05725490196078432 - nodes in this community are weakly interconnected._
- **Should `Scoutbook — Agent Policy` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._