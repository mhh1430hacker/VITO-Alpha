# ALPHA_ARCHITECTURE.md

## VITO Alpha Component Map

```
src/
├── app/                           # 94 pages — identical routing to VITO production
│   ├── layout.tsx                 # Root layout (fetch override, providers)
│   ├── alpha-init.ts              # Injects global fetch interceptor
│   ├── providers.tsx              # AlphaProvider > IntelligenceProvider > AppShell
│   ├── dashboard/                 # 6 role-specific dashboards (perfumer, compliance, etc.)
│   ├── intelligence/              # 9 intelligence modules (accelerator, compliance, etc.)
│   ├── explorer/                  # Interactive knowledge graph viewer
│   ├── ai-lab/                    # 12 AI lab pages (training, inference, models, etc.)
│   ├── formulations/              # Formulation studio, wizard, library
│   ├── compliance/                # IFRA, REACH, CLP, SDS, audits
│   ├── investor/                  # Investor dashboard, login
│   ├── admin/                     # User management, billing, roles, SSO
│   ├── (marketing)/               # Pricing page
│   └── ...                        # All other production pages preserved
│
├── components/
│   ├── alpha/
│   │   └── alpha-banner.tsx       # Alpha overlay (countdown, detail panel)
│   ├── intelligence/              # Achievement toast, confetti, AI co-pilot, etc.
│   ├── layout/                    # AppShell, Sidebar, TopBar, Breadcrumbs
│   └── ui/                        # All shadcn/ui components
│
├── lib/
│   ├── alpha/                     # ⭐ THE ALPHA LAYER
│   │   ├── config.ts              # Feature flags (27 features, 12 disabled)
│   │   ├── environment.ts         # Deployment target detection
│   │   ├── data-provider.ts       # SyntheticDatasetProvider (1000+ lines)
│   │   │                          #   10 generators: materials, formulas, suppliers,
│   │   │                          #   experiments, predictions, checks, alerts,
│   │   │                          #   dashboardStats, knowledgeEntries, insights
│   │   │                          #   Seeded LCG for reproducibility
│   │   │                          #   localStorage caching with 1hr TTL
│   │   ├── interceptor.ts         # 60+ API endpoint stubs
│   │   ├── fetch-override.ts      # Monkeypatches globalThis.fetch
│   │   ├── workspace-factory.ts   # Demo workspaces (sessionStorage, 5 max)
│   │   └── provider.tsx           # AlphaContext + AlphaProvider + useAlpha()
│   │
│   ├── api.ts                     # Fake API (no axios, 200+ methods stubbed)
│   ├── store.ts                   # Zustand stores (auth defaults to guest)
│   ├── ai_api.ts                  # AI endpoints (preserved, uses fake api.ts)
│   ├── billing_api.ts             # Billing endpoints (preserved, uses fake api.ts)
│   ├── routes.ts                  # Route constants (preserved from production)
│   ├── intelligence/              # Intelligence layer (preserved)
│   └── ...                        # All other utility libraries
│
├── types/
│   └── index.ts                   # KPICards, Formula, Material, etc.
│
└── styles/
    └── globals.css                # Tailwind + shadcn/ui themes
```

## Data Flow

```
User clicks page
  ↓
Component mounts, calls API (e.g., dashboardAPI.getKPI())
  ↓
Fake api.ts intercepts → getAlphaStubResponse() checks URL
  ↓
Returns synthetic Promise<{ data, status }> immediately
  ↓
Component renders with fake data
  ↓
(Side effect) AlphaDataProvider seeds localStorage cache
```

## Key Design Decisions

1. **`any`-typed responses**: All api.ts stubs return `Promise<{ data: any }>`. This avoids chasing type compatibility with the full production schema.
2. **Generics accepted, ignored**: `api.get<Plan[]>()` accepts the type parameter but ignores it.
3. **No axios**: Removed from dependencies entirely. The fake api.ts object directly handles get/post/put/delete/patch.
4. **Fetch monkeypatch**: `fetch-override.ts` intercepts `window.fetch` so hardcoded `fetch('http://localhost:8000/...')` calls work without modification.
5. **Always-authenticated**: `useAuthStore` defaults `user` and `token` to guest values. No login required.
6. **No persist middleware**: Removed zustand persist — all state is in-memory only.
