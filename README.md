# VITO-Alpha

Standalone alpha version of Prefoum — the Olfactory Intelligence Platform. Explore every feature with zero infrastructure, synthetic data, and instant deployment.

---

## Features

- 94 fully functional routes
- Zero backend dependency — no database, no Redis, no APIs
- Mock API layer — 200+ endpoints return synthetic responses
- Authentication bypass — always-logged-in guest experience
- AI Co-Pilot floating assistant
- 6 role-specific dashboards (perfumer, compliance, executive, etc.)
- 9 intelligence modules (Formula Accelerator, Compliance, Success Predictor, etc.)
- Session persistence via sessionStorage
- Feature flags — 27 features, 12 disabled for alpha
- Demo workspace factory with pre-populated data
- Deployable on Vercel in one click

---

## Installation

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run start
```

Open `http://localhost:3000` — no login, no configuration required.

---

## Deployment

Supports:

- **Vercel** — pre-configured via `vercel.json`
- **Static hosting** — export with `npm run build`
- **Docker** — lightweight Node.js image

```bash
# Vercel (recommended)
vercel --prod

# Static export
npm run build && npx serve out

# Docker
docker build -t vito-alpha .
docker run -p 3000:3000 vito-alpha
```

---

## Architecture

```
VITO-Alpha/
├── src/
│   ├── app/                         # 94 pages — identical routing to production
│   ├── lib/alpha/                   # Synthetic data engine
│   │   ├── config.ts                # Feature flags
│   │   ├── data-provider.ts         # 10 data generators, LCG, cache
│   │   ├── interceptor.ts           # 60+ API endpoint stubs
│   │   ├── fetch-override.ts        # Patches window.fetch for alpha
│   │   └── provider.tsx             # AlphaContext + useAlpha() hook
│   ├── lib/api.ts                   # Fake API layer — no axios
│   └── lib/store.ts                 # Auth store — always authenticated
├── docs/
├── package.json                     # Zero backend deps
├── vercel.json                      # One-click deploy
├── .env.example                     # NEXT_PUBLIC_ALPHA_MODE=true
└── .gitignore
```

---

## Status

**Alpha Release** — stable, 94/94 pages, zero TypeScript errors, deployable to production CDN.

| Metric | Value |
|---|---|
| Pages | 94 static + 2 dynamic |
| API stubs | ~200 endpoints |
| Build time | < 2 min |
| First load | 82 kB |
| Dependencies | 0 backend packages |

---

## Documentation

- [Architecture](docs/ALPHA_ARCHITECTURE.md) — full component map and data flow
- [Deployment](docs/ALPHA_DEPLOYMENT.md) — Vercel, static, Docker
- [Limitations](docs/ALPHA_LIMITATIONS.md) — what's disabled vs production
- [Migration Report](docs/PREFORM_TO_ALPHA.md) — every change from Prefoum to Alpha
