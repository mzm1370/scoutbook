# Graph Report - web  (2026-10-28)

## Corpus Check
- 69 files · ~25,234 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 2 file(s) not represented in the graph (top: (none) 1, .css 1)

## Summary
- 462 nodes · 549 edges · 45 communities (35 shown, 8 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8bc733ac`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- react
- compilerOptions
- devDependencies
- api.ts
- components.json
- labels.ts
- compilerOptions
- dependencies
- KanbanBoardPage.tsx
- DependencyGraphPage.tsx
- feature-raci-panel.tsx
- feature-scouting-panel.tsx
- scripts
- lucide-react
- feature-bug-triage-panel.tsx
- httpClient
- feature-test-health-panel.tsx
- feature-implementation-log-panel.tsx
- feature-release-log-panel.tsx
- feature-review-checklist-panel.tsx
- feature-rfc-check-panel.tsx
- feature-rfc-document-panel.tsx
- feature-test-plan-panel.tsx
- feature-testing-checklist-panel.tsx
- feature-ux-design-panel.tsx
- AbilityContext.tsx
- react-hook-form
- zod
- AuthContext.tsx
- feature-process-track-panel.tsx
- raci-diagram.tsx
- api-envelope.ts
- feature-badges.tsx
- login-form.tsx
- React + TypeScript + Vite
- kanban.ts
- SettingsPage
- app-header.tsx
- ApiError
- lifecycle.ts
- tsconfig.json
- server.ts

## God Nodes (most connected - your core abstractions)
1. `react` - 29 edges
2. `lucide-react` - 25 edges
3. `compilerOptions` - 21 edges
4. `react-router-dom` - 17 edges
5. `react-hook-form` - 16 edges
6. `zod` - 16 edges
7. `compilerOptions` - 15 edges
8. `scripts` - 10 edges
9. `FeatureRaciPanel()` - 8 edges
10. `FeatureScoutingPanel()` - 7 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (45 total, 8 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (36): name, private, type, version, monorepoRoot, root, @casl/react, eslint (+28 more)

### Community 1 - "react"
Cohesion: 0.05
Nodes (18): react, react-router-dom, mainNav, FeatureStageHistoryPanel(), formatWhen(), Props, crumbForPath(), DashboardLayout() (+10 more)

### Community 2 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations, jsx, lib (+15 more)

### Community 3 - "devDependencies"
Cohesion: 0.09
Nodes (23): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, jsdom, msw (+15 more)

### Community 4 - "api.ts"
Cohesion: 0.10
Nodes (19): ambiguityTrackingApi, authApi, bugTriageApi, decisionsNeededApi, docsSyncApi, featureRelationsApi, featuresApi, implementationLogApi (+11 more)

### Community 5 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 6 - "labels.ts"
Cohesion: 0.11
Nodes (17): BUG_TRIAGE_RISK_LABELS, BUG_TRIAGE_STATUS_LABELS, BUG_TRIAGE_TYPE_LABELS, FEATURE_STAGE_LABELS, IMPLEMENTATION_LOG_STATUS_LABELS, PROCESS_TRACK_LABELS, RELEASE_LOG_STATUS_LABELS, REVIEW_CHECKLIST_STATUS_LABELS (+9 more)

### Community 7 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 8 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, @casl/ability, @casl/react, @hookform/resolvers, lucide-react, react, react-dom, react-hook-form (+6 more)

### Community 9 - "KanbanBoardPage.tsx"
Cohesion: 0.15
Nodes (6): sonner, HttpRequestOptions, CardProps, KanbanBoardPage(), advanceFeature(), onColumnDrop()

### Community 10 - "DependencyGraphPage.tsx"
Cohesion: 0.16
Nodes (8): @xyflow/react, FeatureGraphNode, FeatureGraphNodeData, DependencyGraphCanvas(), DependencyGraphPage(), layoutNodes(), nodeTypes, toEdges()

### Community 11 - "feature-raci-panel.tsx"
Cohesion: 0.24
Nodes (8): DraftRow, FeatureRaciPanel(), save(), seed(), letterLabel(), Props, ROLE_COLS, toDraft()

### Community 12 - "feature-scouting-panel.tsx"
Cohesion: 0.21
Nodes (9): defaultValues, FeatureScoutingPanel(), cancelEdit(), onSubmit(), reload(), FormValues, Props, schema (+1 more)

### Community 13 - "scripts"
Cohesion: 0.20
Nodes (10): scripts, build, dev, lint, preview, start:dev, test, test:e2e (+2 more)

### Community 14 - "lucide-react"
Cohesion: 0.22
Nodes (6): lucide-react, FeatureStagePanel(), Props, AUTH_MODE_LABELS, FormValues, schema

### Community 15 - "feature-bug-triage-panel.tsx"
Cohesion: 0.25
Nodes (7): defaultValues, FeatureBugTriagePanel(), cancelEdit(), onSubmit(), FormValues, Props, schema

### Community 17 - "feature-test-health-panel.tsx"
Cohesion: 0.32
Nodes (7): emptyValues, FeatureTestHealthPanel(), onSubmit(), FormValues, parseOptionalInt(), Props, schema

### Community 18 - "feature-implementation-log-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureImplementationLogPanel(), FormValues, Props, schema

### Community 19 - "feature-release-log-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureReleaseLogPanel(), FormValues, Props, schema

### Community 20 - "feature-review-checklist-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureReviewChecklistPanel(), FormValues, Props, schema

### Community 21 - "feature-rfc-check-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureRfcCheckPanel(), FormValues, Props, schema

### Community 22 - "feature-rfc-document-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureRfcDocumentPanel(), FormValues, Props, schema

### Community 23 - "feature-test-plan-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureTestPlanPanel(), FormValues, Props, schema

### Community 24 - "feature-testing-checklist-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureTestingChecklistPanel(), FormValues, Props, schema

### Community 25 - "feature-ux-design-panel.tsx"
Cohesion: 0.29
Nodes (5): emptyValues, FeatureUxDesignPanel(), FormValues, Props, schema

### Community 26 - "AbilityContext.tsx"
Cohesion: 0.40
Nodes (4): @casl/ability, AbilityContext, AbilityProvider(), emptyAbility()

### Community 27 - "react-hook-form"
Cohesion: 0.33
Nodes (4): react-hook-form, FormValues, NewFeaturePage(), schema

### Community 28 - "zod"
Cohesion: 0.33
Nodes (4): zod, RegisterFormValues, RegisterPage(), registerSchema

### Community 29 - "AuthContext.tsx"
Cohesion: 0.33
Nodes (3): AuthContext, AuthContextValue, AuthProvider()

### Community 30 - "feature-process-track-panel.tsx"
Cohesion: 0.33
Nodes (3): EDITABLE, FeatureProcessTrackPanel(), Props

### Community 31 - "raci-diagram.tsx"
Cohesion: 0.40
Nodes (5): cellClass(), Props, RaciDiagram(), RaciDiagramRow, ROLE_COLS

### Community 32 - "api-envelope.ts"
Cohesion: 0.67
Nodes (5): apiErrorFromBody(), isApiFailure(), isApiSuccess(), parseLegacyOrUnknownError(), unwrapApiData()

### Community 34 - "login-form.tsx"
Cohesion: 0.40
Nodes (3): LoginFormProps, LoginFormValues, loginSchema

### Community 35 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + TypeScript + Vite

### Community 36 - "kanban.ts"
Cohesion: 0.67
Nodes (3): emptyFeaturesByStage(), FeaturesByStage, groupFeaturesByStage()

## Knowledge Gaps
- **236 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+231 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 302 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `KanbanBoardPage.tsx`, `DependencyGraphPage.tsx`, `feature-raci-panel.tsx`, `feature-scouting-panel.tsx`, `lucide-react`, `feature-bug-triage-panel.tsx`, `feature-test-health-panel.tsx`, `feature-implementation-log-panel.tsx`, `feature-release-log-panel.tsx`, `feature-review-checklist-panel.tsx`, `feature-rfc-check-panel.tsx`, `feature-rfc-document-panel.tsx`, `feature-test-plan-panel.tsx`, `feature-testing-checklist-panel.tsx`, `feature-ux-design-panel.tsx`, `AbilityContext.tsx`, `AuthContext.tsx`, `feature-process-track-panel.tsx`?**
  _High betweenness centrality (0.162) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `package.json`, `react`, `KanbanBoardPage.tsx`, `DependencyGraphPage.tsx`, `feature-raci-panel.tsx`, `feature-scouting-panel.tsx`, `feature-bug-triage-panel.tsx`, `feature-test-health-panel.tsx`, `feature-implementation-log-panel.tsx`, `feature-release-log-panel.tsx`, `feature-review-checklist-panel.tsx`, `feature-rfc-check-panel.tsx`, `feature-rfc-document-panel.tsx`, `feature-test-plan-panel.tsx`, `feature-testing-checklist-panel.tsx`, `feature-ux-design-panel.tsx`, `react-hook-form`, `zod`, `login-form.tsx`, `app-header.tsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _236 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04875886524822695 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05454545454545454 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._