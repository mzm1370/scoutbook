# Graph Report - scoutbook  (2026-09-27)

## Corpus Check
- 170 files · ~62,166 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: (none) 6, .mdc 2, .css 2)

## Summary
- 1399 nodes · 2084 edges · 116 communities (98 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1b17bbf5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- AuthUser
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
- auth.module.ts
- package.json
- devDependencies
- web/components.json
- ui/components.json
- compilerOptions
- RFC 0001 — Authentication
- compilerOptions
- .create
- devDependencies
- tasks
- scripts
- scouting.controller.ts
- app.module.ts
- compilerOptions
- api/README.md
- compilerOptions
- .login
- @nestjs/common
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
- index.ts
- RegisterPage.tsx
- field.tsx
- FeaturesPage.tsx
- Feature lifecycle (8 stages)
- button.tsx
- Scoutbook — Agent Policy
- RFC 0002 — Feature Record Core
- dependencies
- auth-response.dto.ts
- swagger.ts
- dependencies
- RFC 0003 — Scouting Entries
- Scoutbook — General Process & Agent Policy
- Scoutbook — Project Charter
- AppModule
- devDependencies
- react-router-dom
- RFC NNNN — Title
- feature-badges.tsx
- App.tsx
- scripts
- Scoutbook API — OpenAPI
- Authentication — Scouting
- Feature Record — Scouting
- exports
- features.service.ts
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
- feature-scouting-panel.tsx
- Bug triage
- Scouting Entries — Scouting
- FeaturesService
- PULL_REQUEST_TEMPLATE.md
- ScoutingService
- login-form.tsx
- UpdateScoutingEntryDto
- CreateFeatureDto
- Feature Stage Transitions — Scouting
- after-compile.sh

## God Nodes (most connected - your core abstractions)
1. `@nestjs/common` - 30 edges
2. `compilerOptions` - 22 edges
3. `compilerOptions` - 21 edges
4. `cn` - 19 edges
5. `@nestjs/swagger` - 16 edges
6. `FeaturesService` - 16 edges
7. `UserRole` - 16 edges
8. `AuthUser` - 16 edges
9. `Feature` - 16 edges
10. `scripts` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AuthUserDto` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/dto/auth-response.dto.ts → packages/types/src/index.ts
- `RegisterDto` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/dto/register.dto.ts → packages/types/src/index.ts
- `JwtPayload` --references--> `UserRole`  [EXTRACTED]
  apps/api/src/auth/guards/jwt-auth.guard.ts → packages/types/src/index.ts
- `CreateFeatureDto` --references--> `RiskTier`  [EXTRACTED]
  apps/api/src/features/dto/create-feature.dto.ts → packages/types/src/index.ts
- `UpdateScoutingEntryDto` --references--> `ScoutingStatus`  [EXTRACTED]
  apps/api/src/features/dto/update-scouting-entry.dto.ts → packages/types/src/index.ts

## Import Cycles
- None detected.

## Communities (116 total, 15 thin omitted)

### Community 0 - "AuthUser"
Cohesion: 0.15
Nodes (13): AuthContext, AuthContextValue, AuthProvider(), authApi, featuresApi, scoutingApi, AdvanceFeatureStageRequest, AuthUser (+5 more)

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

### Community 12 - "User"
Cohesion: 0.15
Nodes (11): AuthService, Injectable, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, User, Injectable (+3 more)

### Community 13 - "auth.module.ts"
Cohesion: 0.18
Nodes (8): AuthModule, Module, JwtAuthGuard, Injectable, Module, UsersModule, @nestjs/config, @nestjs/jwt

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

### Community 21 - ".create"
Cohesion: 0.16
Nodes (16): ScoutingController, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags (+8 more)

### Community 22 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+8 more)

### Community 23 - "tasks"
Cohesion: 0.13
Nodes (14): dependsOn, inputs, outputs, dependsOn, cache, persistent, dependsOn, $schema (+6 more)

### Community 24 - "scripts"
Cohesion: 0.13
Nodes (15): scripts, build, deploy, format, lint, openapi:export, start, start:debug (+7 more)

### Community 25 - "scouting.controller.ts"
Cohesion: 0.13
Nodes (17): CreateScoutingEntryDto, ApiProperty, ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, MinLength (+9 more)

### Community 26 - "app.module.ts"
Cohesion: 0.12
Nodes (17): AppController, ApiOkResponse, ApiOperation, ApiTags, Controller, Get, { ObserveModule, ObserveInstrument }, AppService (+9 more)

### Community 27 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, jsx, module, moduleResolution, outDir, skipLibCheck, strictNullChecks, exclude (+3 more)

### Community 28 - "api/README.md"
Cohesion: 0.18
Nodes (10): Compile and run the project, Deployment, Description, License, Observability, Project setup, Resources, Run tests (+2 more)

### Community 29 - "compilerOptions"
Cohesion: 0.18
Nodes (10): compilerOptions, allowJs, jsx, module, moduleResolution, noEmit, plugins, extends (+2 more)

### Community 30 - ".login"
Cohesion: 0.16
Nodes (15): ApiConflictResponse, AuthController, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags (+7 more)

### Community 31 - "@nestjs/common"
Cohesion: 0.24
Nodes (7): IS_PUBLIC_KEY, ROLES_KEY, JwtPayload, RolesGuard, Injectable, UserRole, @nestjs/common

### Community 32 - "What's inside?"
Cohesion: 0.20
Nodes (9): Apps and Packages, Build, Develop, Remote Caching, Turborepo starter, Useful Links, Using this example, Utilities (+1 more)

### Community 33 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 34 - "sidebar.tsx"
Cohesion: 0.06
Nodes (32): mainNav, upcomingNav, crumbForPath(), DashboardLayout(), Sheet(), SheetContent(), SheetDescription(), SheetHeader() (+24 more)

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
Cohesion: 0.14
Nodes (16): AuthUserDto, LoginResponseDto, ApiProperty, LoginDto, ApiProperty, IsEmail, IsNotEmpty, IsString (+8 more)

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
Cohesion: 0.09
Nodes (18): AllExceptionsFilter, ApiResponse, RequestContextMiddleware, RequestWithId, Injectable, apiErrorFromBody(), isApiFailure(), isApiSuccess() (+10 more)

### Community 63 - ".create"
Cohesion: 0.14
Nodes (19): ApiForbiddenResponse, Roles(), FeaturesController, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse (+11 more)

### Community 64 - "app-header.tsx"
Cohesion: 0.10
Nodes (10): AppHeader(), initials(), Avatar(), AvatarFallback(), DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel() (+2 more)

### Community 65 - "index.ts"
Cohesion: 0.15
Nodes (17): CurrentUser, AdvanceFeatureStageDto, ApiProperty, IsIn, FeatureResponseDto, ApiProperty, assertImmediateNextStage(), SCOUTING_BLOCKING_STATUSES (+9 more)

### Community 66 - "RegisterPage.tsx"
Cohesion: 0.13
Nodes (13): FormValues, NewFeaturePage(), schema, RegisterFormValues, RegisterPage(), registerSchema, FieldGroup(), Select() (+5 more)

### Community 67 - "field.tsx"
Cohesion: 0.15
Nodes (9): Field(), FieldDescription(), FieldError(), FieldLabel(), fieldVariants, Label(), Separator(), cn (+1 more)

### Community 68 - "FeaturesPage.tsx"
Cohesion: 0.22
Nodes (8): FeaturesPage(), Skeleton(), Table(), TableBody(), TableCell(), TableHead(), TableHeader(), TableRow()

### Community 69 - "Feature lifecycle (8 stages)"
Cohesion: 0.15
Nodes (13): Artifacts per feature, Core rule, Definition of Done, Feature lifecycle (8 stages), Stage 1 — Idea, Stage 2 — Scouting, Stage 3 — RFC check, Stage 4 — RACI (+5 more)

### Community 70 - "button.tsx"
Cohesion: 0.20
Nodes (11): FeatureStagePanel(), Props, stages, FeatureDetailPage(), Button(), buttonVariants, Card(), CardContent() (+3 more)

### Community 71 - "Scoutbook — Agent Policy"
Cohesion: 0.10
Nodes (21): 1. Fully responsive (best practices), 1. Uniform request / response envelope (middleware + interceptor), 2. Prefer shared functions, 2. Short input, flexible capture (Idea → Implementation), 3. Easy login, enjoyable system, 3. Prefer shared classes, 4. Smooth professional lifecycle (dev happy, business safe), Architecture (+13 more)

### Community 72 - "RFC 0002 — Feature Record Core"
Cohesion: 0.17
Nodes (12): Acceptance criteria, API contract, Data model, Decision, Frontend, `GET /features`, `GET /features/:id`, Goals (+4 more)

### Community 73 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, class-variance-authority, cn, @fontsource-variable/geist, lucide-react, next-themes, radix-ui, react (+4 more)

### Community 74 - "auth-response.dto.ts"
Cohesion: 0.48
Nodes (5): ApiFailureEnvelopeDto, ErrorResponseDto, ApiProperty, ApiPropertyOptional, ApiErrorCode

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

### Community 81 - "AppModule"
Cohesion: 0.38
Nodes (4): AppModule, Module, @nestjs/testing, supertest

### Community 82 - "devDependencies"
Cohesion: 0.29
Nodes (7): devDependencies, eslint, @repo/eslint-config, @repo/typescript-config, @types/react, @types/react-dom, typescript

### Community 84 - "RFC NNNN — Title"
Cohesion: 0.20
Nodes (10): Acceptance criteria, Alternatives considered, Detailed design, Drawbacks, Effect on dependency graph and tests, Motivation, RFC NNNN — Title, Summary (+2 more)

### Community 85 - "feature-badges.tsx"
Cohesion: 0.18
Nodes (6): stageVariant, Alert(), alertVariants, Badge(), badgeVariants, class-variance-authority

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

### Community 92 - "features.service.ts"
Cohesion: 0.16
Nodes (15): Feature, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ScoutingEntry, Column (+7 more)

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
Cohesion: 0.50
Nodes (3): RISK_TIER_LABELS, ROLE_LABELS, SCOUTING_STATUS_LABELS

### Community 102 - "RegisterDto"
Cohesion: 0.40
Nodes (5): RegisterDto, IsEmail, IsIn, IsNotEmpty, MinLength

### Community 105 - "feature-scouting-panel.tsx"
Cohesion: 0.19
Nodes (11): defaultValues, FeatureScoutingPanel(), cancelEdit(), onSubmit(), reload(), FormValues, Props, schema (+3 more)

### Community 106 - "Bug triage"
Cohesion: 0.33
Nodes (6): After PO decides (scouting gap), Bug triage, First question, Minimal capture (when filing a bug), Regression checklist, Why the split matters

### Community 107 - "Scouting Entries — Scouting"
Cohesion: 0.40
Nodes (4): Current state, Expected after implementation, Questions resolved, Scouting Entries — Scouting

### Community 108 - "FeaturesService"
Cohesion: 0.44
Nodes (3): FeaturesService, Injectable, Feature

### Community 109 - "PULL_REQUEST_TEMPLATE.md"
Cohesion: 0.50
Nodes (3): Definition of Done, Notes for reviewers, Summary

### Community 110 - "ScoutingService"
Cohesion: 0.38
Nodes (4): ScoutingService, Injectable, InjectRepository, ScoutingEntry

### Community 111 - "login-form.tsx"
Cohesion: 0.29
Nodes (5): LoginFormProps, LoginFormValues, loginSchema, CardFooter(), Input()

### Community 112 - "UpdateScoutingEntryDto"
Cohesion: 0.29
Nodes (7): ApiPropertyOptional, IsIn, IsOptional, IsString, MaxLength, MinLength, UpdateScoutingEntryDto

### Community 113 - "CreateFeatureDto"
Cohesion: 0.33
Nodes (6): CreateFeatureDto, ApiProperty, IsIn, IsString, MaxLength, MinLength

### Community 114 - "Feature Stage Transitions — Scouting"
Cohesion: 0.50
Nodes (3): Expected after implementation, Feature Stage Transitions — Scouting, Questions resolved

## Knowledge Gaps
- **685 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `$schema` (+680 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 879 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@nestjs/common` connect `@nestjs/common` to `index.ts`, `api/package.json`, `swagger.ts`, `auth.controller.ts`, `auth.module.ts`, `User`, `AppModule`, `scouting.controller.ts`, `app.module.ts`, `features.service.ts`, `api-response.ts`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `cn` connect `field.tsx` to `app-header.tsx`, `RegisterPage.tsx`, `ui/package.json`, `sidebar.tsx`, `FeaturesPage.tsx`, `button.tsx`, `feature-scouting-panel.tsx`, `login-form.tsx`, `feature-badges.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `react-router-dom` to `web/package.json`, `sidebar.tsx`, `FeaturesPage.tsx`, `RegisterPage.tsx`, `button.tsx`, `login-form.tsx`, `App.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _685 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Scoutbook — Agent Policy` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `web/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `ui/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._