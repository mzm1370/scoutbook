# Graph Report - scoutbook  (2026-09-28)

## Corpus Check
- 197 files · ~72,181 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 6, .mdc 2, .css 2)

## Summary
- 1653 nodes · 2680 edges · 134 communities (112 shown, 18 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `55d5b9a2`
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
- features.service.ts
- package.json
- devDependencies
- web/components.json
- ui/components.json
- compilerOptions
- RFC 0001 — Authentication
- compilerOptions
- CreateScoutingEntryDto
- devDependencies
- tasks
- RaciAssignment
- features.module.ts
- AppController
- compilerOptions
- api/README.md
- compilerOptions
- feature-scouting-panel.tsx
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
- auth.controller.ts
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
- .create
- app-header.tsx
- @nestjs/common
- button.tsx
- alert.tsx
- FeaturesPage.tsx
- Feature lifecycle (8 stages)
- RegisterPage.tsx
- Scoutbook — Agent Policy
- RFC 0002 — Feature Record Core
- dependencies
- field.tsx
- swagger.ts
- dependencies
- RFC 0003 — Scouting Entries
- Scoutbook — General Process & Agent Policy
- Scoutbook — Project Charter
- scripts
- devDependencies
- FeatureRfcCheck
- RFC NNNN — Title
- app.module.ts
- App.tsx
- scripts
- Scoutbook API — OpenAPI
- Authentication — Scouting
- Feature Record — Scouting
- exports
- Detailed design
- vite.config.ts
- Scoutbook (Claude Code)
- API request / response envelope
- imports
- eslint.config.js
- scripts
- http-interceptor.ts
- RFC 0004 — Feature Stage Transitions
- labels.ts
- RegisterDto
- FeatureRaciPanel
- Bug triage
- Scouting Entries — Scouting
- DashboardLayout.tsx
- PULL_REQUEST_TEMPLATE.md
- FeatureScoutingPanel
- RFC 0005 — Feature RFC Check Record
- sheet.tsx
- Feature
- Feature Stage Transitions — Scouting
- after-compile.sh
- Feature RACI Matrix — Scouting
- react-router-dom
- @nestjs/swagger
- SidebarProvider
- LoginDto
- Feature RFC Check — Scouting
- vite-tsconfig-paths
- FeaturesController
- FeaturesService
- feature-raci.service.ts
- RFC 0007 — Feature Implementation Log
- FeatureImplementationLogService
- feature-implementation-log-panel.tsx
- feature-raci-panel.tsx
- UpsertFeatureImplementationLogDto
- Feature Implementation Log — Scouting
- FeatureRfcCheckPanel

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 39 edges
2. `@nestjs/swagger` - 25 edges
3. `FeaturesService` - 25 edges
4. `compilerOptions` - 22 edges
5. `compilerOptions` - 21 edges
6. `AuthUser` - 20 edges
7. `cn` - 19 edges
8. `UserRole` - 18 edges
9. `RaciAssignment` - 16 edges
10. `Feature` - 16 edges

## Surprising Connections (you probably didn't know these)
- `JwtPayload` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/guards/jwt-auth.guard.ts → packages/types/src/index.ts
- `AdvanceFeatureStageDto` --references--> `FeatureStage`  [EXTRACTED]
  apps/api/src/features/dto/advance-feature-stage.dto.ts → packages/types/src/index.ts
- `CreateFeatureDto` --references--> `RiskTier`  [EXTRACTED]
  apps/api/src/features/dto/create-feature.dto.ts → packages/types/src/index.ts
- `CreateScoutingEntryDto` --references--> `ScoutingStatus`  [EXTRACTED]
  apps/api/src/features/dto/create-scouting-entry.dto.ts → packages/types/src/index.ts
- `FeatureImplementationLogResponseDto` --references--> `ImplementationLogStatus`  [EXTRACTED]
  apps/api/src/features/dto/feature-implementation-log-response.dto.ts → packages/types/src/index.ts

## Import Cycles
- None detected.

## Communities (134 total, 18 thin omitted)

### Community 0 - "index.ts"
Cohesion: 0.13
Nodes (20): AuthContext, AuthContextValue, AuthProvider(), authApi, featuresApi, implementationLogApi, raciApi, rfcCheckApi (+12 more)

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
Cohesion: 0.06
Nodes (31): author, description, prettier, @scoutbook/types, @types/node, typescript, license, name (+23 more)

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

### Community 12 - ".login"
Cohesion: 0.07
Nodes (30): ApiConflictResponse, AuthController, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags (+22 more)

### Community 13 - "features.service.ts"
Cohesion: 0.18
Nodes (12): FeatureImplementationLog, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn, assertImmediateNextStage() (+4 more)

### Community 14 - "package.json"
Cohesion: 0.11
Nodes (18): devDependencies, prettier, turbo, typescript, engines, node, prettier, typescript (+10 more)

### Community 15 - "devDependencies"
Cohesion: 0.10
Nodes (20): devDependencies, @nestjs/cli, @nestjs/mau, @nestjs/schematics, @nestjs/testing, oxlint, prettier, source-map-support (+12 more)

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

### Community 21 - "CreateScoutingEntryDto"
Cohesion: 0.07
Nodes (35): CreateScoutingEntryDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, MinLength (+27 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+8 more)

### Community 23 - "tasks"
Cohesion: 0.13
Nodes (14): dependsOn, inputs, outputs, dependsOn, cache, persistent, dependsOn, $schema (+6 more)

### Community 24 - "RaciAssignment"
Cohesion: 0.05
Nodes (44): RaciAssignmentInputDto, ReplaceFeatureRaciDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength (+36 more)

### Community 25 - "features.module.ts"
Cohesion: 0.20
Nodes (12): ScoutingEntryResponseDto, ApiProperty, ScoutingEntry, Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn (+4 more)

### Community 26 - "AppController"
Cohesion: 0.20
Nodes (9): AppController, ApiOkResponse, ApiOperation, ApiTags, Controller, Get, AppService, Injectable (+1 more)

### Community 27 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, module, moduleResolution, outDir, skipLibCheck, strictNullChecks, exclude (+3 more)

### Community 28 - "api/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 29 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, jsx, module, moduleResolution, noEmit, plugins, extends (+2 more)

### Community 30 - "feature-scouting-panel.tsx"
Cohesion: 0.12
Nodes (20): emptyValues, FormValues, Props, schema, defaultValues, FormValues, Props, schema (+12 more)

### Community 31 - ".put"
Cohesion: 0.17
Nodes (13): FeatureImplementationLogController, ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse (+5 more)

### Community 32 - "What's inside?"
Cohesion: 0.20
Nodes (9): Apps and Packages, Build, Develop, Remote Caching, Turborepo starter, Useful Links, Using this example, Utilities (+1 more)

### Community 33 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 34 - "sidebar.tsx"
Cohesion: 0.10
Nodes (18): mainNav, upcomingNav, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+10 more)

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

### Community 44 - "auth.controller.ts"
Cohesion: 0.11
Nodes (18): IS_PUBLIC_KEY, AuthUserDto, HealthResponseDto, LoginResponseDto, ApiProperty, RegisterDto, ApiProperty, IsEmail (+10 more)

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

### Community 63 - ".create"
Cohesion: 0.15
Nodes (15): Roles(), CreateFeatureDto, ApiProperty, IsIn, IsString, MaxLength, MinLength, ApiBadRequestResponse (+7 more)

### Community 64 - "app-header.tsx"
Cohesion: 0.10
Nodes (10): AppHeader(), initials(), Avatar(), AvatarFallback(), DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+2 more)

### Community 65 - "@nestjs/common"
Cohesion: 0.20
Nodes (5): ROLES_KEY, RolesGuard, Injectable, @nestjs/common, vitest

### Community 66 - "button.tsx"
Cohesion: 0.20
Nodes (11): FeatureStagePanel(), Props, stages, FeatureDetailPage(), Button(), buttonVariants, Card(), CardContent() (+3 more)

### Community 67 - "alert.tsx"
Cohesion: 0.33
Nodes (3): Alert(), alertVariants, class-variance-authority

### Community 68 - "FeaturesPage.tsx"
Cohesion: 0.22
Nodes (8): FeaturesPage(), Skeleton(), Table(), TableBody(), TableCell(), TableHead(), TableHeader(), TableRow()

### Community 69 - "Feature lifecycle (8 stages)"
Cohesion: 0.15
Nodes (13): Artifacts per feature, Core rule, Definition of Done, Feature lifecycle (8 stages), Stage 1 — Idea, Stage 2 — Scouting, Stage 3 — RFC check, Stage 4 — RACI (+5 more)

### Community 70 - "RegisterPage.tsx"
Cohesion: 0.17
Nodes (10): LoginFormProps, LoginFormValues, loginSchema, RegisterFormValues, RegisterPage(), registerSchema, USER_ROLES, CardFooter() (+2 more)

### Community 71 - "Scoutbook — Agent Policy"
Cohesion: 0.10
Nodes (21): 1. Fully responsive (best practices), 1. Uniform request / response envelope (middleware + interceptor), 2. Prefer shared functions, 2. Short input, flexible capture (Idea → Implementation), 3. Easy login, enjoyable system, 3. Prefer shared classes, 4. Smooth professional lifecycle (dev happy, business safe), Architecture (+13 more)

### Community 72 - "RFC 0002 — Feature Record Core"
Cohesion: 0.17
Nodes (12): Acceptance criteria, API contract, Data model, Decision, Frontend, `GET /features`, `GET /features/:id`, Goals (+4 more)

### Community 73 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, class-variance-authority, cn, @fontsource-variable/geist, lucide-react, next-themes, radix-ui, react (+4 more)

### Community 74 - "field.tsx"
Cohesion: 0.16
Nodes (8): Field(), FieldGroup(), FieldLabel(), fieldVariants, Label(), Separator(), cn, radix-ui

### Community 75 - "swagger.ts"
Cohesion: 0.32
Nodes (9): bootstrap(), exportOpenApi(), buildOpenApiDocument(), __dirname, OPENAPI_YAML_PATHS, setupSwagger(), writeOpenApiYaml(), @nestjs/core (+1 more)

### Community 76 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @hookform/resolvers, lucide-react, react, react-dom, react-hook-form, react-router-dom, @scoutbook/types (+3 more)

### Community 77 - "RFC 0003 — Scouting Entries"
Cohesion: 0.17
Nodes (12): Acceptance criteria, Alternatives considered, API (JWT required), Data model, Detailed design, Drawbacks, Effect on dependency graph and tests, Frontend (+4 more)

### Community 78 - "Scoutbook — General Process & Agent Policy"
Cohesion: 0.18
Nodes (11): Agent operating policy, Architecture (HTTP + shared code), Docs layout, Out of policy until RFC'd, Product process (8 stages), Product UX (audience: PO / PM / Developer / QA), Purpose, Quality bar (+3 more)

### Community 79 - "Scoutbook — Project Charter"
Cohesion: 0.25
Nodes (8): Core Concept, GitHub Docs Sync, Long-term goal: AI-assisted implementation, MVP Scope, Problem, Scoutbook — Project Charter, Stack, Who it's for

### Community 81 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, deploy, format, lint, openapi:export, start, start:debug (+7 more)

### Community 82 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, @repo/eslint-config, @repo/typescript-config, @types/react, @types/react-dom, typescript

### Community 83 - "FeatureRfcCheck"
Cohesion: 0.07
Nodes (33): ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureRfcCheckDto, FeatureRfcCheck (+25 more)

### Community 84 - "RFC NNNN — Title"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Detailed design, Drawbacks, Effect on dependency graph and tests, Motivation, RFC NNNN — Title, Summary (+2 more)

### Community 85 - "app.module.ts"
Cohesion: 0.17
Nodes (11): AppModule, { ObserveModule, ObserveInstrument }, Module, AuthModule, Module, FeaturesModule, Module, @nestjs/config (+3 more)

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

### Community 92 - "Detailed design"
Cohesion: 0.18
Nodes (11): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Default seed steps (lifecycle), Detailed design, Frontend, Motivation (+3 more)

### Community 93 - "vite.config.ts"
Cohesion: 0.40
Nodes (4): root, @tailwindcss/vite, vite, @vitejs/plugin-react

### Community 94 - "Scoutbook (Claude Code)"
Cohesion: 0.50
Nodes (3): Claude-specific, graphify, Scoutbook (Claude Code)

### Community 95 - "API request / response envelope"
Cohesion: 0.50
Nodes (4): API request / response envelope, Failure, Success, Web client

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
Cohesion: 0.33
Nodes (5): IMPLEMENTATION_LOG_STATUS_LABELS, RFC_CHECK_STATUS_LABELS, RISK_TIER_LABELS, ROLE_LABELS, SCOUTING_STATUS_LABELS

### Community 102 - "RegisterDto"
Cohesion: 0.40
Nodes (5): RegisterDto, IsEmail, IsIn, IsNotEmpty, MinLength

### Community 105 - "FeatureRaciPanel"
Cohesion: 0.31
Nodes (6): FeatureRaciPanel(), reload(), save(), seed(), letterLabel(), toDraft()

### Community 106 - "Bug triage"
Cohesion: 0.29
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

### Community 113 - "Feature"
Cohesion: 0.15
Nodes (12): FeatureResponseDto, ApiProperty, Feature, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn (+4 more)

### Community 114 - "Feature Stage Transitions — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Stage Transitions — Scouting, Questions resolved

### Community 116 - "Feature RACI Matrix — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature RACI Matrix — Scouting, Questions resolved

### Community 118 - "@nestjs/swagger"
Cohesion: 0.17
Nodes (15): CurrentUser, ApiFailureEnvelopeDto, AdvanceFeatureStageDto, ApiProperty, IsIn, FeatureImplementationLogResponseDto, ApiProperty, FeatureRfcCheckResponseDto (+7 more)

### Community 120 - "LoginDto"
Cohesion: 0.50
Nodes (3): LoginDto, IsEmail, IsNotEmpty

### Community 121 - "Feature RFC Check — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature RFC Check — Scouting, Questions resolved

### Community 123 - "FeaturesController"
Cohesion: 0.21
Nodes (10): FeaturesController, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse, Controller (+2 more)

### Community 124 - "FeaturesService"
Cohesion: 0.33
Nodes (3): FeaturesService, Injectable, Feature

### Community 125 - "feature-raci.service.ts"
Cohesion: 0.36
Nodes (5): RaciAssignmentResponseDto, ApiProperty, DEFAULT_RACI_STEPS, RACI_VALUES, RaciValue

### Community 126 - "RFC 0007 — Feature Implementation Log"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, API (JWT — any authenticated), Data model, Detailed design, Frontend, Motivation, RFC 0007 — Feature Implementation Log (+2 more)

### Community 127 - "FeatureImplementationLogService"
Cohesion: 0.36
Nodes (4): FeatureImplementationLogService, Injectable, InjectRepository, FeatureImplementationLog

### Community 128 - "feature-implementation-log-panel.tsx"
Cohesion: 0.22
Nodes (6): emptyValues, FeatureImplementationLogPanel(), FormValues, Props, schema, react-hook-form

### Community 129 - "feature-raci-panel.tsx"
Cohesion: 0.32
Nodes (6): DraftRow, Props, ROLE_COLS, RaciAssignmentInput, Badge(), badgeVariants

### Community 130 - "UpsertFeatureImplementationLogDto"
Cohesion: 0.29
Nodes (7): ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, UpsertFeatureImplementationLogDto

### Community 132 - "Feature Implementation Log — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Implementation Log — Scouting, Questions resolved

## Knowledge Gaps
- **731 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+726 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1010 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **18 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `api/package.json`, `swagger.ts`, `auth.controller.ts`, `features.service.ts`, `app.module.ts`, `@nestjs/swagger`, `features.module.ts`, `AppController`, `feature-raci.service.ts`, `api-response.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `api/package.json`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `react-router-dom` to `web/package.json`, `sidebar.tsx`, `button.tsx`, `FeaturesPage.tsx`, `RegisterPage.tsx`, `DashboardLayout.tsx`, `App.tsx`, `feature-scouting-panel.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _731 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12666666666666668 - nodes in this community are weakly interconnected._
- **Should `Scoutbook — Agent Policy` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._