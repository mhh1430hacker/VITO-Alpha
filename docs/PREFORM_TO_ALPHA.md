# PREFORM_TO_ALPHA.md

## Migration Report: Prefoum → VITO-Alpha

Every component from Prefoum's frontend was analyzed for its dependencies and replaced/augmented in VITO-Alpha.

---

## Source Files Rewritten

| Original File | Alpha Replacement | Dependencies Removed | Synthetic Added |
|---|---|---|---|
| `src/lib/api.ts` (axios, 200 lines) | `src/lib/api.ts` (fake, 135 lines) | axios, interceptors, token refresh | `fakeResponse()`, `getAlphaStubResponse()` |
| `src/lib/store.ts` (persist middleware) | `src/lib/store.ts` (no persist) | zustand persist, localStorage hydration | Default guest user/token |
| `src/lib/billing_api.ts` (generics, 296 lines) | `src/lib/billing_api.ts` (simplified, 167 lines) | axios generics, tight types | Loose types with `[key: string]: any`, utility functions |
| `src/lib/multimodel_api.ts` (axios, own instance) | `src/lib/multimodel_api.ts` (fake api) | axios, own interceptor, GPU calls | Uses shared fake api.ts |
| `src/components/layout/app-shell.tsx` | Same file, line 28-32 rewritten | `useAuthStore.persist` (hydration) | Immediate `setHydrated(true)` |
| `src/app/layout.tsx` | `+ import './alpha-init'` | — | Fetch override injector |
| *(no original)* | `src/lib/alpha/fetch-override.ts` | — | Monkeypatches `window.fetch` |
| *(no original)* | `src/app/alpha-init.ts` | — | Client-side entry for fetch override |

## Files Added (No Original)

| File | Purpose |
|---|---|
| `src/lib/alpha/config.ts` | Feature flags, 27 features, 12 disabled |
| `src/lib/alpha/environment.ts` | Deployment detection, backend URL = "" |
| `src/lib/alpha/data-provider.ts` | 1042 lines: 10 synthetic data generators, LCG, localStorage cache |
| `src/lib/alpha/interceptor.ts` | 260 lines: 60+ API endpoint stubs |
| `src/lib/alpha/workspace-factory.ts` | Demo workspace creation, sessionStorage |
| `src/lib/alpha/provider.tsx` | AlphaContext + AlphaProvider + hooks |
| `src/components/alpha/alpha-banner.tsx` | Alpha overlay with countdown |
| `package.json` | No axios, no backend deps |
| `vercel.json` | One-click deploy with NEXT_PUBLIC_ALPHA_MODE=true |
| `.env.example` | Single line: NEXT_PUBLIC_ALPHA_MODE=true |
| `docs/ALPHA_ARCHITECTURE.md` | Component map + data flow |
| `docs/ALPHA_DEPLOYMENT.md` | Vercel/static deployment |
| `docs/ALPHA_LIMITATIONS.md` | What's missing |
| `docs/PREFORM_TO_ALPHA.md` | This file |

## Files Removed

| Original File | Reason |
|---|---|
| `e2e/` directory | Playwright tests — needs backend |
| `playwright.config.ts` | Playwright config — needs backend |
| `backend/` (not copied) | Entire backend — no infrastructure |
| `docker/` (not copied) | No Docker needed |
| `*.md` files from Prefoum root | Replaced with alpha-specific docs |

## Preserved Unchanged (274 files)

- All 94 page components (app/)
- All UI components (components/ui/, components/intelligence/, etc.)
- All layout components (sidebar, topbar, breadcrumbs, etc.)
- All lib files except api.ts, store.ts, billing_api.ts, multimodel_api.ts
- All styles (globals.css, tailwind.config.ts)
- All public assets

---

## API Coverage

### Fully Stubbed (return synthetic data)

| Module | Stub Count | Example |
|---|---|---|
| authAPI | 5 | getMe → guest user |
| dashboardAPI | 6 | getKPI → synthetic stats |
| adminAPI | 9 | listUsers → fake perfumers |
| aiAPI | 21 | analyzeFormula → pre-computed scores |
| formulasAPI | 7 | list → empty |
| materialsAPI | 7 | list → empty |
| optimizationAPI | 2 | optimize → fake result |
| companyAPI | 5 | list → empty |
| teamAPI | 2 | invite → fake success |
| demoAPI | 3 | provision → alpha demo |
| onboardingAPI | 5 | progress → step 1 |
| profileAPI | 1 | update → success |
| billingAPI | 28 | listPlans → empty |
| embeddingAPI | 7 | search → empty |
| trainingAPI | 28 | all → disabled message |
| inferenceAPI | 19 | predict → empty |
| modelRegistryAPI | 14 | list → empty |
| similarityAPI | 9 | similarity → empty |
| searchAPI | 4 | search → empty |
| featureStoreAPI | 8 | features → empty |
| recommendationAPI | 9 | alternatives → empty |
| **TOTAL** | **~200** | All endpoints interceptable |

### Hardcoded fetch() Overrides

| Caller | Original URL | Status |
|---|---|---|
| demo-generator/page.tsx | `/api/v1/demo/generate-company/preview` | Intercepted by fetch override |
| alpha/bugs/page.tsx | `/api/v1/alpha/bugs` | Intercepted by fetch override |
| alpha/waitlist/page.tsx | `/api/v1/alpha/waitlist` | Intercepted by fetch override |
| alpha/feedback/page.tsx | `/api/v1/alpha/feedback` | Intercepted by fetch override |
| alpha/roadmap/page.tsx | `/api/v1/alpha/roadmap` | Intercepted by fetch override |
