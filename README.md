# Bawo - Fair Pay for AI Data Labeling

**Mobile-first PWA for crypto-powered AI data labeling with instant stablecoin payments**

## Overview

Bawo connects African workers with AI companies needing data labeling services. Workers earn $3-6/hour (2-4x industry rates) and receive instant stablecoin payments via Celo blockchain, eliminating traditional payment rail friction.

**Key Features:**
- Instant cUSD payments (<5s from task completion to wallet)
- Zero-knowledge identity verification via Self Protocol
- Mobile-first PWA optimized for MiniPay browser (<2MB footprint)
- Offline-first task caching for intermittent connectivity
- Multi-layer quality assurance (golden tasks, consensus, spot checks)

## Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Blockchain:** Celo (cUSD payments via viem)
- **Identity:** Self Protocol (ZK passport verification)
- **State Management:** Zustand
- **Testing:** Vitest (unit), Playwright (E2E - Sprint 6)
- **Deployment:** Vercel (frontend + API routes)
- **Monitoring:** Axiom (logs), BetterStack (uptime)

## Quick Start

### Prerequisites

- Node.js 20+ (check with `node -v`)
- npm or pnpm
- Supabase account (free tier)

### Setup (15 minutes)

1. **Clone and install dependencies**

```bash
git clone <repository-url>
cd bawo
npm install
```

2. **Set up Supabase**

   - Create a project at [supabase.com](https://supabase.com)
   - Go to SQL Editor in Supabase dashboard
   - Copy contents of `supabase/migrations/001_initial_schema.sql`
   - Paste and run in SQL Editor
   - Verify: 8 tables created (workers, clients, projects, tasks, task_responses, transactions, points_ledger, referrals)

   See [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) for detailed instructions.

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Where to find these:**
- Supabase Dashboard → Project Settings → API
- URL = Project URL
- Anon Key = `anon` `public` key
- Service Role Key = `service_role` key (keep secret!)

4. **Start development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Expected:** Homepage with "Bawo - Fair pay for AI data labeling" message.

## Available Scripts

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run test:unit    # Run unit tests
npm run test:watch   # Run tests in watch mode
```

## Project Structure

```
bawo/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API routes
│   │   ├── v1/auth/          # Authentication endpoints (Sprint 1: mock)
│   │   │   ├── wallet/       # Worker wallet verification
│   │   │   └── client/       # Client email/password auth
│   │   └── health/           # Health check endpoint
│   ├── globals.css           # Global styles + Tailwind
│   ├── layout.tsx            # Root layout (Plus Jakarta Sans font)
│   └── page.tsx              # Homepage
├── components/               # React components
│   └── ui/                   # shadcn/ui components
│       ├── button.tsx        # Button with warm palette variants
│       ├── card.tsx          # Card with cream background
│       ├── input.tsx         # Input with 48px touch target
│       └── label.tsx         # Label component
├── lib/                      # Utilities and configurations
│   ├── utils.ts              # cn() utility, formatUSD, formatNumber
│   └── supabase.ts           # Supabase client setup
├── supabase/                 # Database migrations
│   └── migrations/
│       └── 001_initial_schema.sql  # 8 tables + RLS policies
├── test/                     # Test files
│   ├── setup.ts              # Vitest setup
│   └── utils.test.ts         # Utility function tests
├── docs/                     # Documentation
│   └── SUPABASE_SETUP.md     # Supabase setup guide
├── .github/workflows/        # CI/CD
│   └── ci.yml                # GitHub Actions (lint, test, build)
├── package.json              # Dependencies and scripts
├── tailwind.config.ts        # Tailwind with warm palette
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
├── vercel.json               # Vercel deployment config
└── README.md                 # This file
```

## Sprint Progress

### ✅ Sprint 1: Foundation & Setup (Current)

**Completed:**
- [x] Next.js 14 app with App Router and TypeScript
- [x] Tailwind CSS configured with warm palette (Warm White #FEFDFB, Teal #1A5F5A, Terracotta #C45D3A)
- [x] shadcn/ui components (button, card, input, label)
- [x] Supabase schema (8 tables with RLS policies)
- [x] Authentication skeleton (mock endpoints)
- [x] GitHub Actions CI (lint, type-check, test, build)
- [x] Vercel deployment configuration
- [x] Unit tests with Vitest

**Next up:**
- Sprint 2: Worker Onboarding (MiniPay detection, Self Protocol integration)
- Sprint 3: Task Engine (sentiment analysis, text classification tasks)
- Sprint 4: Payment Infrastructure (Celo blockchain integration)
- Sprint 5: Client Dashboard (project creation, results download)
- Sprint 6: Gamification & Polish (points program, PWA, offline support)

## API Endpoints

### Health Check

```bash
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2026-01-28T20:00:00.000Z",
  "version": "0.1.0",
  "sprint": 1,
  "environment": "development"
}
```

### Worker Authentication (Mock - Sprint 1)

```bash
POST /api/v1/auth/wallet/verify
Content-Type: application/json

{
  "walletAddress": "0x1234...",
  "signature": "0xabcd...",
  "message": "Sign in to Bawo"
}

Response:
{
  "data": {
    "token": "mock_jwt_token_0x1234...",
    "userId": "worker_0x1234...",
    "walletAddress": "0x1234...",
    "verificationLevel": 0,
    "message": "Wallet verified (mock response for Sprint 1)"
  }
}
```

### Client Authentication (Mock - Sprint 1)

```bash
POST /api/v1/auth/client/login
Content-Type: application/json

{
  "email": "client@example.com",
  "password": "secure-password-123"
}

Response:
{
  "data": {
    "token": "mock_client_jwt_client",
    "userId": "client_client",
    "email": "client@example.com",
    "message": "Login successful (mock response for Sprint 1)"
  }
}
```

## Design System

### Color Palette (from DESIGN.md)

**Warm Palette (Worker App):**
- Background: `#FEFDFB` (Warm White)
- Surface: `#FAF7F2` (Cream)
- Primary: `#1A5F5A` (Deep Teal)
- Secondary: `#C45D3A` (Terracotta)
- Text: `#3D3935` (Warm Gray 800)

**Semantic Colors:**
- Success: `#2D8A3D` (Green)
- Warning: `#C4883A` (Amber)
- Error: `#C43A3A` (Red)
- Money: `#C4A23A` (Gold) - for earnings display

### Typography

- **Font:** Plus Jakarta Sans (Google Fonts)
- **Weights:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Base size:** 16px (minimum for iOS to prevent zoom)
- **Scale:** 12px / 14px / 16px / 18px / 20px / 24px / 30px

### Touch Targets

All buttons and interactive elements: **48x48px minimum** (per DESIGN.md mobile-first requirements)

## Testing

### Run Tests

```bash
npm run test:unit        # Run once
npm run test:watch       # Watch mode
```

### Write Tests

Tests live in `test/` directory:

```typescript
// test/example.test.ts
import { describe, it, expect } from 'vitest'
import { formatUSD } from '@/lib/utils'

describe('formatUSD', () => {
  it('formats USD amounts', () => {
    expect(formatUSD(12.47)).toBe('$12.47')
  })
})
```

## Deployment

### Vercel (Recommended)

1. **Connect GitHub repository**
   - Go to [vercel.com](https://vercel.com)
   - Import project from GitHub
   - Framework Preset: Next.js
   - Build Command: `npm run build`

2. **Configure environment variables**
   - Add all variables from `.env.local` in Vercel dashboard
   - Settings → Environment Variables

3. **Deploy**
   - Push to `main` or `master` branch → auto-deploys
   - Pull requests → preview deployments

### Manual Deployment

```bash
npm run build
npm run start
```

Serves on port 3000 by default.

## Performance Targets (Sprint 6)

From PRD Section 8.1:

| Metric | Target | Critical For |
|--------|--------|--------------|
| Initial Load | <3s on 3G | Worker engagement (expensive data plans) |
| Time to Interactive | <5s | Task flow |
| Task Load Time | <2s | Worker retention |
| Payment Confirmation | <5s | Trust, instant payment UX |
| PWA Install Size | <2MB | MiniPay constraint, $50 Android phones |
| JS Bundle (gzipped) | <150kb | Mobile bandwidth optimization |

## Contributing

This is an MVP project. Contributions are not currently accepted, but feedback is welcome via GitHub issues.

## Development Workflow

1. Create feature branch: `git checkout -b feature/task-name`
2. Make changes
3. Run tests: `npm run test:unit`
4. Type check: `npm run type-check`
5. Lint: `npm run lint`
6. Commit: `git commit -m "feat(scope): description"`
7. Push: `git push origin feature/task-name`
8. Open PR → CI runs automatically
9. Merge after CI passes

## Troubleshooting

### Cannot connect to Supabase

**Error:** `Invalid Supabase URL` or `Missing credentials`

**Fix:**
1. Check `.env.local` exists (not `.env.example`)
2. Verify URL format: `https://xxx.supabase.co`
3. Restart dev server: `npm run dev`

### Build fails with type errors

**Error:** TypeScript errors during build

**Fix:**
1. Run type check locally: `npm run type-check`
2. Fix reported errors
3. Rebuild: `npm run build`

### Tests fail

**Error:** Tests don't run or fail unexpectedly

**Fix:**
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Check test setup: `test/setup.ts`
3. Run with verbose output: `npm run test:unit -- --reporter=verbose`

## Documentation

- [Supabase Setup Guide](./docs/SUPABASE_SETUP.md)
- [PRD (Product Requirements)](./grimoires/loa/prd.md)
- [SDD (Software Design)](./grimoires/loa/sdd.md)
- [Sprint Plan](./grimoires/loa/sprint.md)
- [Design Specification](./DESIGN.md)

## License

Proprietary - All rights reserved

## Contact

For questions or support during MVP development, create a GitHub issue.

---

**Sprint 1 Status:** ✅ Complete | **Next:** Sprint 2 (Worker Onboarding)
