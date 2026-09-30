# Graph Report - scoutbook  (2026-09-30)

## Corpus Check
- 257 files · ~92,092 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 6, .mdc 2, .css 2)

## Summary
- 2150 nodes · 3861 edges · 159 communities (137 shown, 18 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 61 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `919538bf`
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
- User
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
- RaciAssignment
- class-validator
- .findById
- compilerOptions
- api/README.md
- compilerOptions
- feature-release-log-panel.tsx
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
- .login
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
- card.tsx
- LoginDto
- FeaturesPage.tsx
- Feature lifecycle (8 stages)
- feature-testing-checklist.service.ts
- Scoutbook — Agent Policy
- RFC 0013 — Feature Stage History
- dependencies
- .create
- swagger.ts
- dependencies
- RFC 0003 — Scouting Entries
- Scoutbook — General Process & Agent Policy
- Scoutbook — Project Charter
- 0000-charter.md
- scripts
- devDependencies
- FeatureRfcCheck
- RFC NNNN — Title
- devDependencies
- App.tsx
- scripts
- Scoutbook API — OpenAPI
- Authentication — Scouting
- Feature Record — Scouting
- exports
- FeatureReviewChecklist
- vite.config.ts
- UpsertFeatureReleaseLogDto
- @nestjs/common
- imports
- eslint.config.js
- scripts
- http-interceptor.ts
- RFC 0004 — Feature Stage Transitions
- labels.ts
- field.tsx
- FeatureRaciPanel
- Bug triage
- Scouting Entries — Scouting
- DashboardLayout.tsx
- PULL_REQUEST_TEMPLATE.md
- FeatureScoutingPanel
- RFC 0005 — Feature RFC Check Record
- sheet.tsx
- features.controller.ts
- Feature Stage Transitions — Scouting
- after-compile.sh
- Feature RACI Matrix — Scouting
- Detailed design
- RFC 0002 — Feature Record Core
- RFC 0010 — Feature Release Log & Bug Triage
- Feature RFC Check — Scouting
- RegisterPage.tsx
- Detailed design
- RFC 0008 — Feature Testing Checklist
- app.controller.ts
- RFC 0007 — Feature Implementation Log
- create-feature-relation.dto.ts
- RFC 0012 — Decisions Needed Inbox
- auth.controller.ts
- KanbanBoardPage.tsx
- Feature Implementation Log — Scouting
- feature-implementation-log.service.ts
- api-envelope.ts
- Feature Testing Checklist — Scouting
- RFC 0009 — Feature Review Checklist
- feature-review-checklist-panel.tsx
- feature-rfc-check-panel.tsx
- FeatureBugTriagePanel
- RFC 0011 — Feature Kanban Board
- Feature Review Checklist — Scouting
- Feature Release Log & Bug Triage — Scouting
- feature-graph-node.tsx
- Feature Kanban Board — Scouting
- auth.service.ts
- features.module.ts
- @nestjs/swagger
- DependencyGraphPage
- jwt-auth.guard.ts
- feature-scouting-panel.tsx
- all-exceptions.filter.ts
- SidebarProvider
- ApiErrorBody
- ScoutingEntry
- Feature Dependency Graph — Scouting
- vite-tsconfig-paths
- Decisions Needed — Scouting
- Scoutbook (Claude Code)

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 55 edges
2. `@nestjs/swagger` - 44 edges
3. `FeaturesService` - 38 edges
4. `AuthUser` - 31 edges
5. `typeorm` - 24 edges
6. `compilerOptions` - 22 edges
7. `Button()` - 22 edges
8. `compilerOptions` - 21 edges
9. `FeatureStage` - 21 edges
10. `CurrentUser` - 20 edges

## Surprising Connections (you probably didn't know these)
- `JwtPayload` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/guards/jwt-auth.guard.ts → packages/types/src/index.ts
- `AdvanceFeatureStageDto` --references--> `FeatureStage`  [EXTRACTED]
  apps/api/src/features/dto/advance-feature-stage.dto.ts → packages/types/src/index.ts
- `CreateFeatureRelationDto` --references--> `FeatureRelationType`  [EXTRACTED]
  apps/api/src/features/dto/create-feature-relation.dto.ts → packages/types/src/index.ts
- `CreateFeatureDto` --references--> `RiskTier`  [EXTRACTED]
  apps/api/src/features/dto/create-feature.dto.ts → packages/types/src/index.ts
- `CreateScoutingEntryDto` --references--> `ScoutingStatus`  [EXTRACTED]
  apps/api/src/features/dto/create-scouting-entry.dto.ts → packages/types/src/index.ts

## Import Cycles
- None detected.

## Communities (159 total, 18 thin omitted)

### Community 0 - "index.ts"
Cohesion: 0.07
Nodes (36): AuthContext, AuthContextValue, AuthProvider(), authApi, bugTriageApi, decisionsNeededApi, featureRelationsApi, featuresApi (+28 more)

### Community 1 - "Scoutbook — Agent Policy"
Cohesion: 0.10
Nodes (21): 1. Fully responsive (best practices), 1. Uniform request / response envelope (middleware + interceptor), 2. Prefer shared functions, 2. Short input, flexible capture (Idea → Implementation), 3. Easy login, enjoyable system, 3. Prefer shared classes, 4. Smooth professional lifecycle (dev happy, business safe), Architecture (+13 more)

### Community 2 - "web/package.json"
Cohesion: 0.09
Nodes (21): eslint, @eslint/js, eslint-plugin-react-hooks, globals, lucide-react, react, react-dom, @scoutbook/types (+13 more)

### Community 3 - "ui/package.json"
Cohesion: 0.11
Nodes (18): eslint, lucide-react, react, react-dom, sonner, @types/react, @types/react-dom, typescript (+10 more)

### Community 4 - "eslint-config/package.json"
Cohesion: 0.06
Nodes (34): config, nextJsConfig, devDependencies, @babel/core, @babel/eslint-parser, @babel/preset-typescript, eslint, eslint-config-prettier (+26 more)

### Community 5 - "api/package.json"
Cohesion: 0.07
Nodes (29): author, description, prettier, @scoutbook/types, @types/node, typescript, license, name (+21 more)

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
Cohesion: 0.10
Nodes (21): dependencies, bcrypt, class-transformer, class-validator, mysql2, @nestjs/common, @nestjs/config, @nestjs/core (+13 more)

### Community 12 - "User"
Cohesion: 0.15
Nodes (11): AuthService, Injectable, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, User, Injectable (+3 more)

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

### Community 24 - "RaciAssignment"
Cohesion: 0.05
Nodes (44): RaciAssignmentInputDto, ReplaceFeatureRaciDto, ApiProperty, ApiPropertyOptional, IsIn, IsInt, IsOptional, IsString (+36 more)

### Community 25 - "class-validator"
Cohesion: 0.42
Nodes (5): ScoutingEntryResponseDto, ApiProperty, SCOUTING_STATUSES, ScoutingStatus, class-validator

### Community 26 - ".findById"
Cohesion: 0.06
Nodes (49): CreateFeatureBugTriageDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, MinLength (+41 more)

### Community 27 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, module, moduleResolution, outDir, skipLibCheck, strictNullChecks, exclude (+3 more)

### Community 28 - "api/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 29 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, jsx, module, moduleResolution, noEmit, plugins, extends (+2 more)

### Community 30 - "feature-release-log-panel.tsx"
Cohesion: 0.10
Nodes (23): DraftRow, Props, ROLE_COLS, emptyValues, FeatureReleaseLogPanel(), FormValues, Props, schema (+15 more)

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
Cohesion: 0.33
Nodes (5): main, name, private, types, version

### Community 43 - "react-library.json"
Cohesion: 0.33
Nodes (5): compilerOptions, jsx, extends, ./base.json, $schema

### Community 44 - ".login"
Cohesion: 0.16
Nodes (14): ApiConflictResponse, AuthController, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags (+6 more)

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
Cohesion: 0.13
Nodes (12): ErrorResponseDto, ApiProperty, ApiPropertyOptional, ApiResponse, RequestWithId, ResponseTransformInterceptor, Injectable, ApiErrorCode (+4 more)

### Community 63 - "FeaturesService"
Cohesion: 0.07
Nodes (32): CreateFeatureDto, ApiProperty, IsIn, IsString, MaxLength, MinLength, InjectRepository, FeaturesController (+24 more)

### Community 64 - "app-header.tsx"
Cohesion: 0.10
Nodes (10): AppHeader(), initials(), Avatar(), AvatarFallback(), DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+2 more)

### Community 65 - "app.module.ts"
Cohesion: 0.13
Nodes (16): AppModule, { ObserveModule, ObserveInstrument }, Module, AuthModule, Module, RequestContextMiddleware, Injectable, FeaturesModule (+8 more)

### Community 66 - "card.tsx"
Cohesion: 0.18
Nodes (14): FeatureStageHistoryPanel(), formatWhen(), Props, Props, stages, DependencyGraphCanvas(), layoutNodes(), nodeTypes (+6 more)

### Community 67 - "LoginDto"
Cohesion: 0.50
Nodes (3): LoginDto, IsEmail, IsNotEmpty

### Community 68 - "FeaturesPage.tsx"
Cohesion: 0.22
Nodes (8): FeaturesPage(), Skeleton(), Table(), TableBody(), TableCell(), TableHead(), TableHeader(), TableRow()

### Community 69 - "Feature lifecycle (8 stages)"
Cohesion: 0.15
Nodes (13): Artifacts per feature, Core rule, Definition of Done, Feature lifecycle (8 stages), Stage 1 — Idea, Stage 2 — Scouting, Stage 3 — RFC check, Stage 4 — RACI (+5 more)

### Community 70 - "feature-testing-checklist.service.ts"
Cohesion: 0.23
Nodes (9): FeatureTestingChecklist, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, TESTING_CHECKLIST_STATUSES (+1 more)

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

### Community 75 - "swagger.ts"
Cohesion: 0.35
Nodes (8): bootstrap(), exportOpenApi(), buildOpenApiDocument(), __dirname, OPENAPI_YAML_PATHS, setupSwagger(), writeOpenApiYaml(), yaml

### Community 76 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, @hookform/resolvers, lucide-react, react, react-dom, react-hook-form, react-router-dom, @scoutbook/types (+4 more)

### Community 77 - "RFC 0003 — Scouting Entries"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT required), Data model, Detailed design, Drawbacks, Effect on dependency graph and tests, Frontend (+4 more)

### Community 78 - "Scoutbook — General Process & Agent Policy"
Cohesion: 0.18
Nodes (11): Agent operating policy, Architecture (HTTP + shared code), Docs layout, Out of policy until RFC'd, Product process (8 stages), Product UX (audience: PO / PM / Developer / QA), Purpose, Quality bar (+3 more)

### Community 79 - "Scoutbook — Project Charter"
Cohesion: 0.25
Nodes (8): Core Concept, GitHub Docs Sync, Long-term goal: AI-assisted implementation, MVP Scope, Problem, Scoutbook — Project Charter, Stack, Who it's for

### Community 80 - "0000-charter.md"
Cohesion: 0.25
Nodes (4): API request / response envelope, Failure, Success, Web client

### Community 81 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, deploy, format, lint, openapi:export, start, start:debug (+7 more)

### Community 82 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, @repo/eslint-config, @repo/typescript-config, @types/react, @types/react-dom, typescript

### Community 83 - "FeatureRfcCheck"
Cohesion: 0.07
Nodes (33): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureRfcCheckDto (+25 more)

### Community 84 - "RFC NNNN — Title"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Detailed design, Drawbacks, Effect on dependency graph and tests, Motivation, RFC NNNN — Title, Summary (+2 more)

### Community 85 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, @nestjs/cli, @nestjs/mau, @nestjs/schematics, @nestjs/testing, oxlint, prettier, source-map-support (+12 more)

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

### Community 92 - "FeatureReviewChecklist"
Cohesion: 0.18
Nodes (11): FeatureReviewChecklistResponseDto, ApiProperty, FeatureReviewChecklist, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+3 more)

### Community 93 - "vite.config.ts"
Cohesion: 0.40
Nodes (4): root, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 94 - "UpsertFeatureReleaseLogDto"
Cohesion: 0.07
Nodes (32): ApiProperty, ApiPropertyOptional, IsBoolean, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureReleaseLogDto (+24 more)

### Community 95 - "@nestjs/common"
Cohesion: 0.20
Nodes (7): RaciAssignmentResponseDto, ApiProperty, DEFAULT_RACI_STEPS, RACI_VALUES, RaciValue, @nestjs/common, vitest

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
Cohesion: 0.15
Nodes (12): BUG_TRIAGE_RISK_LABELS, BUG_TRIAGE_STATUS_LABELS, BUG_TRIAGE_TYPE_LABELS, FEATURE_STAGE_LABELS, IMPLEMENTATION_LOG_STATUS_LABELS, RELEASE_LOG_STATUS_LABELS, REVIEW_CHECKLIST_STATUS_LABELS, RFC_CHECK_STATUS_LABELS (+4 more)

### Community 102 - "field.tsx"
Cohesion: 0.12
Nodes (10): Alert(), alertVariants, Field(), FieldGroup(), fieldVariants, Label(), Separator(), class-variance-authority (+2 more)

### Community 105 - "FeatureRaciPanel"
Cohesion: 0.36
Nodes (5): FeatureRaciPanel(), save(), seed(), letterLabel(), toDraft()

### Community 106 - "Bug triage"
Cohesion: 0.33
Nodes (6): After PO decides (scouting gap), Bug triage, First question, Minimal capture (when filing a bug), Regression checklist, Why the split matters

### Community 107 - "Scouting Entries — Scouting"
Cohesion: 0.40
Nodes (4): Current state, Expected after implementation, Questions resolved, Scouting Entries — Scouting

### Community 108 - "DashboardLayout.tsx"
Cohesion: 0.28
Nodes (7): crumbForPath(), DashboardLayout(), SidebarInset(), Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger()

### Community 109 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Definition of Done, Notes for reviewers, Summary

### Community 110 - "FeatureScoutingPanel"
Cohesion: 0.47
Nodes (5): FeatureScoutingPanel(), cancelEdit(), onSubmit(), reload(), statusBadgeVariant()

### Community 111 - "RFC 0005 — Feature RFC Check Record"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT), Data model (1:1 with Feature), Detailed design, Drawbacks, Frontend, Meaning of status (+4 more)

### Community 112 - "sheet.tsx"
Cohesion: 0.18
Nodes (5): Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle()

### Community 113 - "features.controller.ts"
Cohesion: 0.16
Nodes (10): Roles(), ROLES_KEY, RolesGuard, Injectable, AdvanceFeatureStageDto, ApiProperty, IsIn, FeatureStageHistoryResponseDto (+2 more)

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

### Community 122 - "RegisterPage.tsx"
Cohesion: 0.12
Nodes (11): LoginFormProps, LoginFormValues, loginSchema, LoginPage(), RegisterFormValues, RegisterPage(), registerSchema, CardFooter() (+3 more)

### Community 123 - "Detailed design"
Cohesion: 0.18
Nodes (11): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Default seed steps (lifecycle), Detailed design, Frontend, Motivation (+3 more)

### Community 124 - "RFC 0008 — Feature Testing Checklist"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Detailed design, Frontend, Motivation, RFC 0008 — Feature Testing Checklist (+2 more)

### Community 125 - "app.controller.ts"
Cohesion: 0.22
Nodes (9): AppController, ApiOkResponse, ApiOperation, ApiTags, Controller, Get, AppService, Injectable (+1 more)

### Community 126 - "RFC 0007 — Feature Implementation Log"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Detailed design, Frontend, Motivation, RFC 0007 — Feature Implementation Log (+2 more)

### Community 127 - "create-feature-relation.dto.ts"
Cohesion: 0.38
Nodes (5): FeatureRelationResponseDto, ApiProperty, FEATURE_RELATION_TYPES, FeatureRelationType, class-transformer

### Community 128 - "RFC 0012 — Decisions Needed Inbox"
Cohesion: 0.22
Nodes (9): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Detailed design, Frontend, Motivation, Out of scope, RFC 0012 — Decisions Needed Inbox (+1 more)

### Community 129 - "auth.controller.ts"
Cohesion: 0.16
Nodes (15): AuthUserDto, HealthResponseDto, LoginResponseDto, ApiProperty, RegisterDto, ApiProperty, IsEmail, IsIn (+7 more)

### Community 130 - "KanbanBoardPage.tsx"
Cohesion: 0.24
Nodes (8): FeatureStagePanel(), BoardFeatureCard(), CardProps, KanbanBoardPage(), advanceFeature(), onColumnDrop(), isImmediateNextStage(), nextFeatureStage()

### Community 132 - "Feature Implementation Log — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Implementation Log — Scouting, Questions resolved

### Community 133 - "feature-implementation-log.service.ts"
Cohesion: 0.19
Nodes (11): FeatureImplementationLogResponseDto, ApiProperty, FeatureImplementationLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+3 more)

### Community 134 - "api-envelope.ts"
Cohesion: 0.52
Nodes (6): apiErrorFromBody(), isApiFailure(), isApiSuccess(), parseLegacyOrUnknownError(), unwrapApiData(), ApiEnvelope

### Community 135 - "Feature Testing Checklist — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Testing Checklist — Scouting, Questions resolved

### Community 136 - "RFC 0009 — Feature Review Checklist"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Detailed design, Frontend, Motivation, RFC 0009 — Feature Review Checklist (+2 more)

### Community 137 - "feature-review-checklist-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureReviewChecklistPanel(), FormValues, Props, schema

### Community 138 - "feature-rfc-check-panel.tsx"
Cohesion: 0.20
Nodes (9): emptyValues, FeatureRfcCheckPanel(), FormValues, Props, schema, Badge(), badgeVariants, Button() (+1 more)

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

### Community 143 - "feature-graph-node.tsx"
Cohesion: 0.40
Nodes (3): FeatureGraphNode, FeatureGraphNodeData, @xyflow/react

### Community 144 - "Feature Kanban Board — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Kanban Board — Scouting, Questions resolved

### Community 145 - "auth.service.ts"
Cohesion: 0.22
Nodes (8): LoginDto, ApiProperty, IsEmail, IsNotEmpty, IsString, MinLength, bcrypt, @nestjs/jwt

### Community 146 - "features.module.ts"
Cohesion: 0.12
Nodes (19): DecisionNeededItemResponseDto, ApiProperty, FeatureResponseDto, ApiProperty, Feature, Column, CreateDateColumn, Entity (+11 more)

### Community 147 - "@nestjs/swagger"
Cohesion: 0.20
Nodes (14): CurrentUser, ApiFailureEnvelopeDto, FeatureReleaseLogResponseDto, ApiProperty, FeatureRfcCheckResponseDto, ApiProperty, FeatureTestingChecklistResponseDto, ApiProperty (+6 more)

### Community 149 - "jwt-auth.guard.ts"
Cohesion: 0.29
Nodes (4): IS_PUBLIC_KEY, JwtAuthGuard, JwtPayload, Injectable

### Community 150 - "feature-scouting-panel.tsx"
Cohesion: 0.13
Nodes (16): defaultValues, FormValues, Props, schema, emptyValues, FeatureImplementationLogPanel(), FormValues, Props (+8 more)

### Community 151 - "all-exceptions.filter.ts"
Cohesion: 0.36
Nodes (3): AllExceptionsFilter, RequestWithId, Catch

### Community 154 - "ScoutingEntry"
Cohesion: 0.12
Nodes (15): FeatureStageHistory, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, ScoutingEntry, Column (+7 more)

### Community 155 - "Feature Dependency Graph — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Dependency Graph — Scouting, Questions resolved

### Community 157 - "Decisions Needed — Scouting"
Cohesion: 0.50
Nodes (3): Decisions Needed — Scouting, Expected after implementation, Questions resolved

### Community 160 - "Scoutbook (Claude Code)"
Cohesion: 0.50
Nodes (3): Claude-specific, graphify, Scoutbook (Claude Code)

## Knowledge Gaps
- **841 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+836 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1271 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `auth.controller.ts`, `api/package.json`, `feature-implementation-log.service.ts`, `User`, `UpsertFeatureTestingChecklistDto`, `auth.service.ts`, `features.module.ts`, `@nestjs/swagger`, `jwt-auth.guard.ts`, `all-exceptions.filter.ts`, `class-validator`, `.findById`, `api-response.ts`, `app.module.ts`, `feature-testing-checklist.service.ts`, `swagger.ts`, `FeatureRfcCheck`, `features.controller.ts`, `app.controller.ts`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `RegisterPage.tsx` to `web/package.json`, `sidebar.tsx`, `card.tsx`, `FeaturesPage.tsx`, `KanbanBoardPage.tsx`, `feature-rfc-check-panel.tsx`, `DashboardLayout.tsx`, `feature-graph-node.tsx`, `App.tsx`, `feature-release-log-panel.tsx`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `react-hook-form` connect `feature-scouting-panel.tsx` to `web/package.json`, `feature-review-checklist-panel.tsx`, `feature-rfc-check-panel.tsx`, `RegisterPage.tsx`, `feature-release-log-panel.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _841 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07195121951219512 - nodes in this community are weakly interconnected._
- **Should `Scoutbook — Agent Policy` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._