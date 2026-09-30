# Graph Report - web  (2026-09-30)

## Corpus Check
- 43 files · ~14,694 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 318 nodes · 370 edges · 32 communities (25 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `11aad26a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- compilerOptions
- react
- components.json
- compilerOptions
- devDependencies
- KanbanBoardPage.tsx
- react-router-dom
- labels.ts
- feature-raci-panel.tsx
- dependencies
- feature-scouting-panel.tsx
- api.ts
- feature-bug-triage-panel.tsx
- lucide-react
- feature-implementation-log-panel.tsx
- feature-release-log-panel.tsx
- feature-rfc-check-panel.tsx
- feature-testing-checklist-panel.tsx
- httpClient
- react-hook-form
- zod
- api-envelope.ts
- login-form.tsx
- React + TypeScript + Vite
- app-sidebar.tsx
- feature-badges.tsx
- kanban.ts
- ApiError
- tsconfig.json

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 21 edges
2. `lucide-react` - 17 edges
3. `react` - 16 edges
4. `compilerOptions` - 15 edges
5. `react-router-dom` - 13 edges
6. `react-hook-form` - 11 edges
7. `zod` - 11 edges
8. `FeatureRaciPanel()` - 8 edges
9. `KanbanBoardPage()` - 7 edges
10. `tailwind` - 6 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (32 total, 5 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.07
Nodes (30): name, private, scripts, build, dev, lint, preview, start:dev (+22 more)

### Community 1 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations, jsx, lib (+15 more)

### Community 2 - "react"
Cohesion: 0.09
Nodes (10): react, AuthContext, AuthContextValue, AuthProvider(), emptyValues, FeatureReviewChecklistPanel(), FormValues, Props (+2 more)

### Community 3 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 4 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 5 - "devDependencies"
Cohesion: 0.12
Nodes (16): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, tailwindcss, @tailwindcss/vite (+8 more)

### Community 6 - "KanbanBoardPage.tsx"
Cohesion: 0.15
Nodes (7): sonner, HttpRequestOptions, CardProps, firstPopulatedStage(), KanbanBoardPage(), advanceFeature(), onColumnDrop()

### Community 7 - "react-router-dom"
Cohesion: 0.15
Nodes (5): react-router-dom, crumbForPath(), DashboardLayout(), stages, LoginPage()

### Community 8 - "labels.ts"
Cohesion: 0.15
Nodes (12): BUG_TRIAGE_RISK_LABELS, BUG_TRIAGE_STATUS_LABELS, BUG_TRIAGE_TYPE_LABELS, FEATURE_STAGE_LABELS, IMPLEMENTATION_LOG_STATUS_LABELS, RELEASE_LOG_STATUS_LABELS, REVIEW_CHECKLIST_STATUS_LABELS, RFC_CHECK_STATUS_LABELS (+4 more)

### Community 9 - "feature-raci-panel.tsx"
Cohesion: 0.24
Nodes (8): DraftRow, FeatureRaciPanel(), save(), seed(), letterLabel(), Props, ROLE_COLS, toDraft()

### Community 10 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, @hookform/resolvers, lucide-react, react, react-dom, react-hook-form, react-router-dom, @scoutbook/types (+3 more)

### Community 11 - "feature-scouting-panel.tsx"
Cohesion: 0.24
Nodes (9): defaultValues, FeatureScoutingPanel(), cancelEdit(), onSubmit(), reload(), FormValues, Props, schema (+1 more)

### Community 12 - "api.ts"
Cohesion: 0.18
Nodes (10): authApi, bugTriageApi, featuresApi, implementationLogApi, raciApi, releaseLogApi, reviewChecklistApi, rfcCheckApi (+2 more)

### Community 13 - "feature-bug-triage-panel.tsx"
Cohesion: 0.25
Nodes (7): defaultValues, FeatureBugTriagePanel(), cancelEdit(), onSubmit(), FormValues, Props, schema

### Community 14 - "lucide-react"
Cohesion: 0.29
Nodes (5): lucide-react, AppHeader(), initials(), FeatureStagePanel(), Props

### Community 15 - "feature-implementation-log-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureImplementationLogPanel(), FormValues, Props, schema

### Community 16 - "feature-release-log-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureReleaseLogPanel(), FormValues, Props, schema

### Community 17 - "feature-rfc-check-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureRfcCheckPanel(), FormValues, Props, schema

### Community 18 - "feature-testing-checklist-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureTestingChecklistPanel(), FormValues, Props, schema

### Community 20 - "react-hook-form"
Cohesion: 0.33
Nodes (4): react-hook-form, RegisterFormValues, RegisterPage(), registerSchema

### Community 21 - "zod"
Cohesion: 0.33
Nodes (4): zod, FormValues, NewFeaturePage(), schema

### Community 22 - "api-envelope.ts"
Cohesion: 0.67
Nodes (5): apiErrorFromBody(), isApiFailure(), isApiSuccess(), parseLegacyOrUnknownError(), unwrapApiData()

### Community 23 - "login-form.tsx"
Cohesion: 0.40
Nodes (3): LoginFormProps, LoginFormValues, loginSchema

### Community 24 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 27 - "kanban.ts"
Cohesion: 0.67
Nodes (3): emptyFeaturesByStage(), FeaturesByStage, groupFeaturesByStage()

## Knowledge Gaps
- **171 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+166 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 213 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `lucide-react` connect `lucide-react` to `package.json`, `react`, `KanbanBoardPage.tsx`, `react-router-dom`, `feature-raci-panel.tsx`, `feature-scouting-panel.tsx`, `feature-bug-triage-panel.tsx`, `feature-implementation-log-panel.tsx`, `feature-release-log-panel.tsx`, `feature-rfc-check-panel.tsx`, `feature-testing-checklist-panel.tsx`, `react-hook-form`, `zod`, `login-form.tsx`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `package.json`, `KanbanBoardPage.tsx`, `feature-raci-panel.tsx`, `feature-scouting-panel.tsx`, `feature-bug-triage-panel.tsx`, `lucide-react`, `feature-implementation-log-panel.tsx`, `feature-release-log-panel.tsx`, `feature-rfc-check-panel.tsx`, `feature-testing-checklist-panel.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `react-router-dom` connect `react-router-dom` to `package.json`, `react`, `KanbanBoardPage.tsx`, `react-hook-form`, `zod`, `login-form.tsx`, `app-sidebar.tsx`?**
  _High betweenness centrality (0.062) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _171 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07196969696969698 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._