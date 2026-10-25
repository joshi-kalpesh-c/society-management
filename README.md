# Society Management

Standalone housing society management product for India (INR).

Status: Phase 1 skeleton scaffolded (pnpm workspace). This folder is independent of finxone-platform; no Finxone services or code are required.

## Layout

- `apps/api` — NestJS modular monolith + Prisma schema (translate of DATABASE.md). JWT auth placeholder, society-membership guard, role guard; domain controllers stubbed for Phases 2–5.
- `apps/web` — Vite + React + TS + Tailwind, shadcn/ui-ready (`components.json`, CSS-variable theme). TanStack Table, react-hook-form + zod installed.
- `apps/mobile` — Expo + NativeWind skeleton (React Native Reusables to be added with first screens).
- `packages/contracts` — shared zod schemas, enums, integer-paise money helpers.

## Develop

```sh
pnpm install
pnpm --filter @society/contracts build   # once (or `dev` for watch mode)
docker compose up -d db                  # local Postgres on :5432
cp .env.example .env && cp .env.example apps/api/.env
pnpm --filter @society/api prisma:migrate
pnpm --filter @society/api seed          # dev users, all passwords: password123
pnpm dev:api      # NestJS on :3000
pnpm dev:web      # Vite on :5173, proxies /api
pnpm dev:mobile   # Expo
pnpm typecheck    # all packages
```

Seed users: `admin@example.com`, `resident@example.com`, `security@example.com`
(Sunrise Residency), `outsider@example.com` (Greenfield Heights).

Production: build artifacts (`pnpm -r build`) are what you deploy — API runs as
`node dist/main.js` against a managed Postgres; local Docker is dev-only.

Open Phase 0 decisions (auth provider, product name, hosting, storage) are marked `TODO(phase-0)` in code.

## Planning documents

- REQUIREMENTS.md — agreed scope, business rules, and decisions still needed.
- ARCHITECTURE.md — proposed stack, security, payment and visitor workflows.
- DATABASE.md — proposed entities, constraints, and financial model.
- SCREENS-AND-API.md — screen inventory and initial API specification.
- IMPLEMENTATION-PLAN.md — phased delivery and acceptance checks.

## Product summary

- Web portal and React Native apps for Android and iOS.
- One society initially, designed for multiple isolated societies later.
- Per-flat monthly maintenance, no partial maintenance payments, configurable daily late fees.
- Admin-provided UPI QR and UPI app launch where supported; manual admin payment verification and PDF receipts.
- Notices, notifications, voluntary and compulsory fundraising, and admin-configured reminders.
- Resident visitor approval; security fallback after two minutes without response, configurable by admin.

## Decision status

Business requirements explicitly agreed with the owner are recorded as confirmed in REQUIREMENTS.md. The technical stack, entity names, API paths, safeguards, and operational details are proposals, not implemented behavior. Resolve the listed open decisions before building dependent features.

No payment-provider integration, automatic bank verification, accounting suite, or production deployment is included by implication.
