# Software Design Document: Bawo

**Version:** 1.0
**Date:** 2026-01-28
**Author:** Architecture Designer Agent
**Status:** Draft
**PRD Reference:** grimoires/loa/prd.md v2.0
**Design Reference:** DESIGN.md

---

## Table of Contents

1. [Project Architecture](#1-project-architecture)
2. [Software Stack](#2-software-stack)
3. [Database Design](#3-database-design)
4. [UI Design](#4-ui-design)
5. [API Specifications](#5-api-specifications)
6. [Error Handling Strategy](#6-error-handling-strategy)
7. [Testing Strategy](#7-testing-strategy)
8. [Development Phases](#8-development-phases)
9. [Known Risks and Mitigation](#9-known-risks-and-mitigation)
10. [Open Questions](#10-open-questions)
11. [Appendix](#11-appendix)

---

## 1. Project Architecture

### 1.1 System Overview

Bawo is a **mobile-first Progressive Web Application (PWA)** that connects African workers with AI companies needing data labeling services. The system enables instant stablecoin micropayments via the Celo blockchain, eliminating traditional payment rail friction.

**Core Capabilities:**
- Worker task completion with instant cUSD payment
- Client project creation and results management
- Zero-knowledge identity verification via Self Protocol
- Offline-first task caching for intermittent connectivity
- Multi-layer quality assurance (golden tasks, consensus, spot checks)
- Points-based cold start incentive system

**Key Constraints (from PRD):**
> "Initial load <3s on 3G, bundle size <150kb JS gzipped, payment confirmation <5s" (PRD Section 8.1)
> "2MB footprint target for MiniPay constraint, $50 Android phones" (DESIGN.md Section 5)

### 1.2 Architectural Pattern

**Pattern:** **Serverless Monolith with Edge Distribution**

**Justification:**
Given the requirements analysis:
- **Mobile-first with PWA**: Next.js 14 App Router provides optimal SSR/SSG + client-side hydration
- **Sub-3s load times on 3G**: Edge CDN (Cloudflare) + aggressive caching + code splitting
- **<2MB bundle size**: Monolithic approach reduces duplication; serverless functions keep backend lean
- **Instant payments (<5s)**: Direct blockchain integration in API routes (no microservice latency)
- **Small team, fast iteration**: Monolith accelerates MVP development (no distributed system complexity)

**Phase 2 Evolution Path:**
- Extract payment processing to dedicated service if transaction volume exceeds 10K/day
- Consider queue workers for consensus calculation if task throughput > 1M/month
- Maintain monolith for business logic; extract only when bottlenecks proven

### 1.3 Component Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BAWO PLATFORM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                          CLIENT LAYER                                 │  │
│  │  ┌──────────────────┐              ┌──────────────────┐              │  │
│  │  │   Worker PWA      │              │  Client Dashboard │              │  │
│  │  │  (Mobile-First)   │              │   (Desktop Web)   │              │  │
│  │  │  - Next.js 14     │              │   - Next.js 14    │              │  │
│  │  │  - Service Worker │              │   - Stripe-like UI│              │  │
│  │  │  - IndexedDB      │              │   - React Query   │              │  │
│  │  │  - Zustand        │              │   - Zustand       │              │  │
│  │  └────────┬──────────┘              └────────┬──────────┘              │  │
│  │           │                                  │                          │  │
│  └───────────┼──────────────────────────────────┼──────────────────────────┘  │
│              │                                  │                             │
│              ▼                                  ▼                             │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                          API LAYER (Next.js API Routes)                 │  │
│  │                                                                         │  │
│  │  /api/workers/*     /api/tasks/*      /api/projects/*   /api/payments/*│  │
│  │  - Verification     - Assignment      - Creation        - Deposits     │  │
│  │  - Profile          - Submission      - Results         - Withdrawals  │  │
│  │  - Stats            - QA              - Monitoring      - Transactions │  │
│  │                                                                         │  │
│  └────────┬──────────────┬───────────────┬──────────────┬─────────────────┘  │
│           │              │               │              │                    │
│           ▼              ▼               ▼              ▼                    │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐            │
│  │  Supabase   │  │  Redis   │  │    R2     │  │     Celo     │            │
│  │  Postgres   │  │  Queue   │  │ Storage   │  │  Blockchain  │            │
│  │  + Auth     │  │  +Cache  │  │  (Assets) │  │  (Payments)  │            │
│  │  +Realtime  │  │          │  │           │  │              │            │
│  └─────────────┘  └──────────┘  └───────────┘  └──────────────┘            │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │                       IDENTITY & VERIFICATION                           │  │
│  │                                                                         │  │
│  │  ┌──────────────────┐              ┌──────────────────┐                │  │
│  │  │  Self Protocol   │              │     MiniPay      │                │  │
│  │  │  ZK Identity     │              │  Wallet Provider │                │  │
│  │  │  (NFC Passport)  │              │  (11M users)     │                │  │
│  │  └──────────────────┘              └──────────────────┘                │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

                    EXTERNAL INTEGRATIONS
                    ┌────────────────┐
                    │   Cloudflare   │
                    │   - CDN/Edge   │
                    │   - R2 Storage │
                    └────────────────┘
```

### 1.4 System Components

#### Worker PWA (Mobile Frontend)

**Purpose:** Primary interface for workers to complete tasks and receive payments

**Responsibilities:**
- Auto-detect and connect MiniPay wallet (no manual connection)
- Display available tasks based on worker verification level
- Handle task submission with offline queue support
- Show real-time earnings and balance updates
- Facilitate withdrawal to MiniPay wallet

**Interfaces:**
- `/api/workers/*` - Profile, verification, stats
- `/api/tasks/*` - Listing, assignment, submission
- `/api/payments/*` - Balance, withdrawals

**Dependencies:**
- MiniPay browser detection (window.ethereum provider)
- Self Protocol SDK for ZK verification
- IndexedDB for offline task storage
- Service Workers for background sync

**Key Constraints:**
- Bundle size: <150kb JS gzipped (per DESIGN.md Section 11)
- Initial load: <3s on 3G connection
- Touch targets: 48x48px minimum (DESIGN.md Section 7)

#### Client Dashboard (Web Frontend)

**Purpose:** Interface for AI companies to create projects and download results

**Responsibilities:**
- Project creation with CSV upload
- Real-time progress monitoring
- Quality metrics dashboard
- Results download with accuracy scores
- Billing and payment management

**Interfaces:**
- `/api/projects/*` - CRUD operations
- `/api/payments/*` - Deposits, transaction history

**Dependencies:**
- Supabase Realtime for live project updates
- MoonPay for fiat on-ramp (optional)

**Design Style:**
- Stripe-like clarity (per DESIGN.md)
- Desktop-optimized (responsive to mobile)
- Cool gray surfaces vs warm worker palette

#### Task Engine (Core Service)

**Purpose:** Central orchestration of task lifecycle and quality assurance

**Responsibilities:**
- Task assignment based on worker tier and language skills
- Consensus calculation (3 workers per task)
- Golden task injection and validation (10% of tasks)
- Reputation scoring and tier progression
- Payment calculation and escrow management

**Interfaces:**
- Internal: Called by API routes
- External: Publishes events to Supabase Realtime

**Dependencies:**
- Supabase Postgres for task state
- Redis for task queue and locks
- Celo for payment transactions

**Quality Assurance Flow:**
```
Task Created → Assign to 3 Workers → Collect Responses
                    ↓
              ┌─────────────┐
              │ Is Golden?  │
              └─────┬───────┘
                Yes │ No
                    ↓
            Validate Answer
                    ↓
         ┌──────────┴──────────┐
    Pass │                 Fail │
         ↓                      ↓
    Update Rep              Flag Worker
         ↓                      ↓
    Calculate Consensus ← ──────┘
         ↓
    2+ Agree?
         ↓
    Yes: Pay All 3
    No: Escalate to Expert
```

#### Payment Router

**Purpose:** Handle all payment operations (worker payouts, client deposits)

**Responsibilities:**
- Worker task payment via Celo cUSD
- Withdrawal to MiniPay wallets
- Client deposit processing (crypto + card via MoonPay)
- Transaction logging and confirmation

**Interfaces:**
- `/api/payments/withdraw` - Worker withdrawals
- `/api/payments/deposit` - Client deposits
- Celo JSON-RPC via viem

**Dependencies:**
- Celo blockchain (L2)
- MiniPay wallet integration
- MoonPay API (optional fiat on-ramp)

**Fee Structure (from PRD Section 10.1):**
```
Client pays: $0.08/label
Worker gets: $0.05/label (60%)
Platform:    $0.03/label (40%)
Celo fee:    $0.0002 (<1%)
Net margin:  $0.028/label (35%)
```

#### Identity Service

**Purpose:** Zero-knowledge identity verification and worker reputation

**Responsibilities:**
- Self Protocol NFC passport verification
- Verification level management (Level 0-3)
- Language skill verification
- Portable reputation via Self Protocol DIDs

**Interfaces:**
- `/api/workers/verify` - Initiate Self verification
- Self Protocol SDK for ZK proof generation

**Dependencies:**
- Self Protocol SDK (@selfprotocol/sdk)
- Supabase for verification state storage

**Verification Levels (from PRD Section 7.4):**
| Level | Requirements | Tasks Unlocked | Daily Limit |
|-------|-------------|----------------|-------------|
| Level 0 | Phone only | Training tasks | $0 |
| Level 1 | Phone + Email | Basic English tasks | $10/day |
| Level 2 | + Self Protocol | All standard tasks | $50/day |
| Level 3 | + Language verification | Premium language tasks | $200/day |

**Fallback Strategy (from PRD Section 16.2):**
> "If Self delays, launch with phone verification only (Level 1), revisit in 3 months"

#### Points System (Cold Start)

**Purpose:** Incentivize workers during low-volume period before paying clients

**Responsibilities:**
- Award points for training tasks and quality performance
- Manage redemption pool (capped at 20% monthly revenue)
- Enforce points expiry (12 months)
- Prevent treasury overhang

**Interfaces:**
- `/api/points/earn` - Award points
- `/api/points/redeem` - Convert to cUSD

**Redemption Logic (from PRD Section 5.1):**
```typescript
// Points can only be redeemed if:
1. Worker has points balance
2. Revenue pool has funds (monthly revenue > 0)
3. Worker active in last 30 days
4. Redemption request < 20% of monthly revenue
5. Points not expired (< 12 months old)

Conversion rate: 100 points = $1 cUSD
Max outstanding: 500,000 points (~$5K liability)
```

### 1.5 Data Flow

#### Worker Task Completion Flow

```
1. Worker opens PWA (opens in MiniPay browser)
   ↓
2. MiniPay wallet auto-detected → wallet address captured
   ↓
3. Worker verifies via Self Protocol (NFC passport scan)
   ↓ ZK proof sent (no PII transmitted)
   ↓
4. Verification badge granted → Worker sees available tasks
   ↓
5. Worker taps "Start Task" → Task marked "assigned" in DB
   ↓
6. Worker reads text, selects sentiment (Positive/Negative/Neutral)
   ↓
7. Worker taps "Submit"
   ↓
8. If offline: Queue in IndexedDB → sync when connected
   If online: POST /api/tasks/:id/submit
   ↓
9. Task Engine checks:
   - Is this a golden task? → Validate immediately
   - Collect responses from 3 workers → Calculate consensus
   ↓
10. If consensus reached (2+ agree):
    → Pay all 3 workers (cUSD via Celo)
    → Update reputation scores
    → Mark task complete
    ↓
11. Worker sees "Earned $0.05" notification
    ↓
12. Balance updated in UI (polling or Realtime subscription)
```

#### Client Project Creation Flow

```
1. Client logs in (email/password via Supabase Auth)
   ↓
2. Client clicks "Create Project"
   ↓
3. Client uploads CSV (max 50MB)
   ↓ Upload to R2 via presigned URL
   ↓
4. Client sets task type (sentiment/classification)
   Client writes instructions (template provided)
   Client sets price per task (min $0.08/label)
   ↓
5. System calculates total cost:
   (num_rows × price_per_task)
   ↓
6. Client confirms → Check balance
   ↓ Sufficient? Yes → Escrow funds in DB
   ↓ Insufficient? → Redirect to deposit
   ↓
7. System parses CSV → Create task records
   ↓
8. Tasks queued in Redis → Workers start picking them up
   ↓
9. Client sees live progress (Supabase Realtime subscription)
   ↓
10. When 100% complete:
    → Generate results CSV (original + labels + confidence)
    → Upload to R2
    → Email client notification
    ↓
11. Client downloads results
```

### 1.6 External Integrations

| Service | Purpose | API Type | Documentation | Criticality |
|---------|---------|----------|---------------|-------------|
| **Celo Blockchain** | cUSD payments, wallet balances | JSON-RPC | https://docs.celo.org | Critical (MVP) |
| **Self Protocol** | ZK identity verification | REST SDK | https://docs.selfprotocol.com | Critical (MVP with fallback) |
| **MiniPay** | Wallet provider, auto-connect | window.ethereum | https://docs.minipay.com | Critical (MVP) |
| **Supabase** | Database, Auth, Realtime | REST + WebSocket | https://supabase.com/docs | Critical (MVP) |
| **Upstash Redis** | Task queue, distributed locks | REST + Redis protocol | https://upstash.com/docs | Critical (MVP) |
| **Cloudflare R2** | File storage (CSVs, datasets) | S3-compatible | https://developers.cloudflare.com/r2 | Critical (MVP) |
| **MoonPay** | Fiat on-ramp for client deposits | REST | https://moonpay.com/docs | Optional (Phase 2) |
| **PostHog** | Analytics, feature flags | JavaScript SDK | https://posthog.com/docs | Non-critical |

**Dependency Risk Assessment (from PRD Section 13.1):**
- **Self Protocol integration issues**: Medium likelihood, High impact
  - **Mitigation**: "Validate Week 1-2; fallback to tiered KYC if unavailable"
- **MiniPay restricts access**: Low likelihood, High impact
  - **Mitigation**: "Yellow Card backup; direct wallet support"

### 1.7 Deployment Architecture

**Frontend (Next.js PWA + Client Dashboard):**
- **Platform**: Vercel
- **Regions**: Global edge network with Africa PoPs
- **CDN**: Cloudflare (Kenya, South Africa edge nodes for <100ms latency)
- **Build**: Static generation (SSG) for marketing pages, Server-Side Rendering (SSR) for dashboards

**Backend (API Routes):**
- **Platform**: Vercel Serverless Functions
- **Runtime**: Node.js 20 (Bun for local dev)
- **Cold Start**: Optimized via edge functions (<50ms in Kenya)

**Database:**
- **Platform**: Supabase (hosted Postgres 15)
- **Regions**: Primary in US (Supabase default), read replica in EU if latency issues
- **Backup**: Automated daily backups, 7-day retention

**Queue & Cache:**
- **Platform**: Upstash Redis (serverless)
- **Regions**: Global replication

**File Storage:**
- **Platform**: Cloudflare R2
- **Regions**: Auto-distributed globally

**Blockchain:**
- **Network**: Celo Mainnet (L2)
- **RPC Provider**: Celo public nodes + Infura backup
- **Hot Wallet**: Managed via environment variables (rotate every 90 days)

**Monitoring & Observability:**
- **Logs**: Axiom (per tech stack in PRD)
- **Uptime**: BetterStack with Africa checks
- **Errors**: Native Vercel error tracking
- **Analytics**: PostHog

### 1.8 Scalability Strategy

**Horizontal Scaling:**
- Next.js API routes auto-scale via Vercel serverless (up to 1000 concurrent invocations)
- Supabase connection pooling (PgBouncer) handles up to 10K concurrent connections
- Redis queue workers scale independently (trigger additional workers at queue depth >100)

**Vertical Scaling:**
- Not applicable for serverless architecture
- Database can scale vertically if query performance degrades (Supabase Pro tier)

**Auto-scaling Triggers:**
| Metric | Threshold | Action |
|--------|-----------|--------|
| API response time | >500ms p95 | Scale Vercel functions |
| DB connections | >80% pool | Upgrade Supabase tier |
| Redis queue depth | >500 tasks | Trigger additional workers |
| Task submission rate | >1000/min | Enable rate limiting |

**Load Balancing:**
- Cloudflare DNS + CDN for geographic distribution
- Vercel edge functions route to nearest region
- Redis queue distributes tasks evenly across workers

**Performance Targets (from PRD Section 8.1):**
| Metric | Target | Critical For |
|--------|--------|--------------|
| **Initial Load** | <3s on 3G | Worker engagement (expensive data) |
| **Time to Interactive** | <5s | Task flow |
| **Task Load Time** | <2s | Worker retention |
| **Payment Confirmation** | <5s | Trust, instant payment UX |
| **PWA Install Size** | <2MB | MiniPay constraint, $50 phones |

**Bundle Size Budget (from DESIGN.md Section 11):**
- Total JS: <150kb gzipped
- Total CSS: <30kb gzipped
- Images: WebP format, lazy loaded, <50kb each

### 1.9 Security Architecture

**Authentication:**

**Workers:**
- **Primary**: Wallet-based authentication (MiniPay auto-connect)
  - No password required; wallet signature proves ownership
  - Session stored in Supabase Auth with wallet address as identifier
- **Verification**: Self Protocol ZK proofs (no PII stored)
- **Session Duration**: 7 days (wallet-based sessions persist)

**Clients:**
- **Method**: Email/password via Supabase Auth
- **MFA**: Optional (email verification required)
- **Session Duration**: 24 hours
- **Password Requirements**: Min 12 characters, bcrypt hashing

**Authorization:**

**Role-Based Access Control (RBAC):**
```typescript
enum Role {
  WORKER = 'worker',
  CLIENT = 'client',
  ADMIN = 'admin'
}

enum WorkerTier {
  LEVEL_0 = 0, // Training only
  LEVEL_1 = 1, // Basic tasks, $10/day
  LEVEL_2 = 2, // All tasks, $50/day
  LEVEL_3 = 3  // Premium tasks, $200/day
}

// Row-Level Security (RLS) in Supabase:
// Workers can only see their own tasks/earnings
// Clients can only see their own projects
// Admin can see all (for support)
```

**Data Protection:**

**Encryption at Rest:**
- Database: Supabase default encryption (AES-256)
- File storage: R2 server-side encryption
- Secrets: Vercel environment variables (encrypted)

**Encryption in Transit:**
- HTTPS only (TLS 1.3)
- Certificate: Vercel/Cloudflare auto-managed
- HSTS headers enforced

**PII Handling:**
> "No PII stored (Self Protocol ZK proofs only)" (PRD Section 8.4)

**Zero-Knowledge Approach:**
- Self Protocol NFC passport scan → ZK proof generated
- Only proof hash stored on-chain (no passport data)
- Worker identity verified without revealing personal information

**Network Security:**
- **CORS**: Strict origin whitelist (bawo.work domain only)
- **CSP Headers**: Prevent XSS attacks
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; ...
  ```
- **Rate Limiting**:
  - Auth endpoints: 5 requests/min per IP
  - Task submission: 60 requests/min per worker
  - API general: 100 requests/min per user

**Security Requirements (from PRD Section 8.4):**
- [x] HTTPS only
- [x] CSRF protection (Supabase handles)
- [x] XSS prevention (React escaping, CSP headers)
- [x] SQL injection prevention (Supabase parameterized queries)
- [x] Rate limiting on auth endpoints (Supabase built-in)
- [x] Wallet signature verification for sensitive operations
- [x] No PII stored (Self Protocol ZK proofs only)

**Wallet Security:**
- Hot wallet for automated payments (low balance, frequent rotation)
- Client deposits held in separate cold wallet (manual withdrawal approval >$1K)
- Transaction signing requires both environment variable key + runtime nonce

**Audit & Compliance:**
- All financial transactions logged immutably
- GDPR compliance: Right to erasure (worker can delete account, only wallet address retained for audit)
- Kenya Data Protection Act: ODPC registration required (all controllers)

---

## 2. Software Stack

### 2.1 Frontend Technologies

#### Worker PWA (Mobile)

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Framework** | Next.js | 14.1.0 | App Router for optimal SSR/SSG, built-in PWA support, automatic code splitting. Industry-proven for <3s load times. |
| **UI Library** | React | 18.2.0 | Stable, component-based architecture, excellent mobile performance with concurrent rendering. |
| **Styling** | Tailwind CSS | 3.4.0 | Utility-first, tree-shakeable (<30kb CSS target), mobile-first responsive design, matches DESIGN.md tokens. |
| **Component Library** | shadcn/ui | Latest | Unstyled, accessible components (WCAG AA), small bundle impact (~5kb per component), Tailwind-native. |
| **State Management** | Zustand | 4.5.0 | Lightweight (1kb), simple API, no boilerplate. Chosen over Redux (-10kb), Jotai for simplicity. |
| **Data Fetching** | React Query (TanStack Query) | 5.17.0 | Built-in caching, offline support, optimistic updates. Critical for offline task queue. |
| **Forms** | React Hook Form | 7.49.0 | Minimal re-renders, built-in validation, small bundle (9kb). |
| **Wallet Integration** | viem | 2.7.0 | Lightweight Ethereum library (smaller than ethers.js), TypeScript-native, Celo-compatible. |
| **Offline Storage** | IndexedDB (via idb) | 7.1.0 | Browser-native, supports large datasets, critical for offline task caching. |
| **Service Worker** | Workbox (via next-pwa) | 7.0.0 | Precaching, runtime caching, background sync for offline submissions. |
| **Testing** | Vitest | 1.2.0 | Fast, Vite-native, compatible with React Testing Library. |
| **E2E Testing** | Playwright | 1.40.0 | Cross-browser, mobile viewport emulation, network throttling for 3G testing. |

**Key Libraries:**
- `@selfprotocol/sdk`: Zero-knowledge identity verification
- `@tanstack/react-query`: Server state management with offline support
- `idb`: IndexedDB wrapper for offline task storage
- `next-pwa`: Service Worker generation for PWA functionality
- `framer-motion`: Smooth animations (<5kb gzipped)

**Bundle Size Strategy:**
- **Code splitting**: Dynamic imports for non-critical components
- **Tree shaking**: ES modules only, Tailwind JIT purging
- **Lazy loading**: Images (next/image), below-the-fold components
- **Compression**: Brotli via Vercel edge (better than gzip)

**Target Bundle Breakdown:**
```
Next.js runtime:     ~40kb gzipped
React + ReactDOM:    ~35kb gzipped
Tailwind CSS:        ~25kb gzipped
Application code:    ~40kb gzipped
Total JS:           ~150kb gzipped ✅ (meets DESIGN.md constraint)
```

#### Client Dashboard (Desktop)

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Framework** | Next.js | 14.1.0 | Same stack as worker app for code sharing (shared components, utils). |
| **Styling** | Tailwind CSS | 3.4.0 | Consistent design system, cool gray palette vs warm worker palette. |
| **State Management** | Zustand | 4.5.0 | Lightweight, shared store patterns with worker app. |
| **Data Fetching** | React Query | 5.17.0 | Realtime dashboard updates via Supabase subscriptions. |
| **Charts** | Recharts | 2.10.0 | Composable, accessible charts for project metrics (accuracy %, completion rate). |
| **File Upload** | react-dropzone | 14.2.0 | CSV upload with drag-and-drop, file validation. |
| **CSV Parsing** | PapaParse | 5.4.0 | Fast, streaming CSV parser for large files (up to 50MB). |

**Design Differentiation (from DESIGN.md):**
| Aspect | Worker App | Client Dashboard |
|--------|------------|------------------|
| Background | Warm White (#FEFDFB) | White (#FFFFFF) |
| Personality | Warm, encouraging | Sparse, technical (Stripe-like) |
| Accent | Terracotta for warmth | Teal only for focus |
| Density | Generous spacing | Efficient layouts |

### 2.2 Backend Technologies

| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Runtime** | Node.js | 20 LTS | Vercel serverless default, stable, well-supported. Bun 1.0 for local dev (faster). |
| **Framework** | Next.js API Routes | 14.1.0 | Integrated with frontend, no CORS setup, automatic deployment via Vercel. |
| **API Design** | REST | - | Simple, cacheable, widely understood. GraphQL deferred (unnecessary complexity for MVP). |
| **Database Client** | Supabase JS | 2.39.0 | Official client, typed queries, Realtime subscriptions, Row-Level Security. |
| **Queue** | Upstash Redis SDK | 1.28.0 | Serverless-native, REST-based (no persistent connections), task queue + caching. |
| **Blockchain** | viem | 2.7.0 | Celo JSON-RPC client, fee abstraction support (CIP-64), TypeScript-native. |
| **File Storage** | AWS SDK v3 (S3 client) | 3.490.0 | R2 is S3-compatible, lightweight modular SDK. |
| **Validation** | Zod | 3.22.0 | TypeScript-first schema validation, runtime type safety for API requests. |
| **Authentication** | Supabase Auth | Built-in | JWT tokens, email/password, wallet signature verification. |
| **Testing** | Vitest | 1.2.0 | Same as frontend for consistency, fast. |
| **Integration Testing** | Supertest | 6.3.0 | HTTP assertions, mocking API routes. |

**Key Libraries:**
- `@supabase/supabase-js`: Database client with Realtime
- `@upstash/redis`: Serverless Redis for task queue
- `viem`: Celo blockchain interactions
- `zod`: Request/response validation
- `bcrypt`: Password hashing (clients only)

**API Route Structure:**
```
app/api/
├── workers/
│   ├── verify/route.ts          # POST - Self Protocol verification
│   ├── profile/route.ts         # GET/PUT - Worker profile
│   └── stats/route.ts           # GET - Task completion stats
├── tasks/
│   ├── available/route.ts       # GET - List available tasks
│   ├── [id]/
│   │   ├── start/route.ts       # POST - Claim task
│   │   ├── submit/route.ts      # POST - Submit response
│   │   └── skip/route.ts        # POST - Return to queue
├── earnings/
│   ├── route.ts                 # GET - Earnings history
│   ├── balance/route.ts         # GET - Current balance
│   └── withdraw/route.ts        # POST - Initiate withdrawal
├── projects/
│   ├── route.ts                 # GET/POST - List/create projects
│   ├── [id]/
│   │   ├── route.ts             # GET/PUT - Project details
│   │   ├── upload/route.ts      # POST - Upload CSV
│   │   └── results/route.ts     # GET - Download results
├── payments/
│   ├── balance/route.ts         # GET - Client balance
│   ├── deposit/route.ts         # POST - Generate deposit address
│   └── history/route.ts         # GET - Transaction history
└── points/
    ├── earn/route.ts            # POST - Award points (internal)
    └── redeem/route.ts          # POST - Redeem points for cUSD
```

### 2.3 Infrastructure & DevOps

| Category | Technology | Purpose |
|----------|------------|---------|
| **Cloud Provider** | Vercel | Frontend + API routes hosting, global edge network, automatic deployments |
| **Database** | Supabase (hosted Postgres 15) | Managed database with Auth, Realtime, Row-Level Security |
| **Queue** | Upstash Redis | Serverless task queue, distributed locks, caching |
| **Storage** | Cloudflare R2 | S3-compatible object storage for CSV files, datasets |
| **Blockchain** | Celo Mainnet (L2) | cUSD payments, wallet balances |
| **CDN** | Cloudflare | Global edge caching, Africa PoPs (Kenya, South Africa) |
| **DNS** | Cloudflare | DNS + DDoS protection |
| **CI/CD** | GitHub Actions + Vercel | Automated tests, preview deployments, production deploys |
| **Monitoring** | Axiom | Structured logging, query-based dashboards |
| **Uptime** | BetterStack | Status page, incident management, Africa health checks |
| **Analytics** | PostHog | Event tracking, feature flags, session replay |
| **Error Tracking** | Vercel native | Built-in error monitoring |
| **Secrets Management** | Vercel Environment Variables | Encrypted at rest, team access control |

**Infrastructure as Code:**
- Not required for MVP (Vercel/Supabase handle infrastructure)
- Phase 2: Consider Terraform if multi-cloud or complex networking needed

**Deployment Pipeline:**
```
┌──────────────┐
│   PR Opened  │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│  GitHub Actions                  │
│  1. Lint (ESLint + Prettier)    │
│  2. Type check (tsc)             │
│  3. Unit tests (Vitest)          │
│  4. Build check                  │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Vercel Preview Deploy           │
│  - Unique URL per PR             │
│  - Full-stack preview            │
│  - Lighthouse CI (performance)   │
└──────┬───────────────────────────┘
       │
       ▼ (PR approved + merged to main)
┌──────────────────────────────────┐
│  GitHub Actions                  │
│  1. All checks above             │
│  2. E2E tests (Playwright)       │
└──────┬───────────────────────────┘
       │
       ▼
┌──────────────────────────────────┐
│  Vercel Production Deploy        │
│  - Atomic deployment             │
│  - Instant rollback available    │
│  - Edge cache invalidation       │
└──────────────────────────────────┘
```

**Environment Strategy:**
- **Development**: Local (localhost:3000), Supabase local instance
- **Preview**: Per-PR deployments (Vercel), Supabase staging DB
- **Production**: bawo.work, Supabase production DB

---

## 3. Database Design

### 3.1 Database Technology

**Primary Database:** PostgreSQL 15 (via Supabase)

**Justification:**
- **ACID compliance**: Financial transactions require strict consistency
- **Row-Level Security (RLS)**: Built-in authorization (workers see only their tasks)
- **Realtime subscriptions**: Native to Supabase, critical for live dashboard updates
- **JSON support**: Flexible task metadata (JSONB columns)
- **Full-text search**: Built-in (pg_trgm) for task content searching
- **Mature ecosystem**: Well-understood, extensive tooling

**Extensions Enabled:**
- `uuid-ossp`: UUID generation
- `pg_trgm`: Fuzzy text search
- `pg_stat_statements`: Query performance monitoring

### 3.2 Schema Design

#### Core Entities

##### 1. Workers

```sql
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,

    -- Self Protocol Identity
    self_did TEXT UNIQUE,  -- did:selfid:celo:0x...
    verification_level INTEGER DEFAULT 0 CHECK (verification_level BETWEEN 0 AND 3),
    verified_languages TEXT[] DEFAULT '{}',  -- ['en', 'sw', 'sheng']

    -- Reputation & Stats
    tier TEXT DEFAULT 'newcomer' CHECK (tier IN ('newcomer', 'bronze', 'silver', 'gold', 'expert')),
    tasks_completed INTEGER DEFAULT 0,
    accuracy_score DECIMAL(5,2) DEFAULT 0.00 CHECK (accuracy_score BETWEEN 0 AND 100),
    earnings_lifetime_usd DECIMAL(12,2) DEFAULT 0.00,

    -- Points System (Cold Start)
    points_balance INTEGER DEFAULT 0,
    points_earned_lifetime INTEGER DEFAULT 0,
    points_redeemed_lifetime INTEGER DEFAULT 0,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_workers_wallet ON workers(wallet_address);
CREATE INDEX idx_workers_self_did ON workers(self_did);
CREATE INDEX idx_workers_tier ON workers(tier);
CREATE INDEX idx_workers_verification_level ON workers(verification_level);
CREATE INDEX idx_workers_last_active ON workers(last_active_at DESC);

-- Row-Level Security: Workers can only see their own record
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY workers_select_own ON workers FOR SELECT USING (wallet_address = current_user_wallet());
CREATE POLICY workers_update_own ON workers FOR UPDATE USING (wallet_address = current_user_wallet());
```

##### 2. Clients

```sql
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    company_name TEXT,

    -- Supabase Auth Integration
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Billing
    balance_usd DECIMAL(12,2) DEFAULT 0.00,
    total_spent_usd DECIMAL(12,2) DEFAULT 0.00,

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_auth_user ON clients(auth_user_id);

-- RLS: Clients can only see their own record
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY clients_select_own ON clients FOR SELECT USING (auth_user_id = auth.uid());
CREATE POLICY clients_update_own ON clients FOR UPDATE USING (auth_user_id = auth.uid());
```

##### 3. Projects

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

    -- Project Config
    name TEXT NOT NULL,
    task_type TEXT NOT NULL CHECK (task_type IN ('sentiment', 'classification')),
    instructions TEXT NOT NULL,
    price_per_task_usd DECIMAL(6,4) NOT NULL CHECK (price_per_task_usd >= 0.02),

    -- Options for classification tasks
    classification_options TEXT[],  -- e.g., ['Sports', 'Politics', 'Tech']

    -- Progress
    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),

    -- Quality Metrics
    consensus_rate DECIMAL(5,2),  -- % of tasks with 2+ agreement
    avg_accuracy DECIMAL(5,2),     -- Accuracy on golden tasks

    -- Files
    source_file_url TEXT,  -- R2 URL for uploaded CSV
    results_file_url TEXT, -- R2 URL for results CSV

    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- RLS: Clients see only their projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY projects_select_own ON projects FOR SELECT USING (
    client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);
```

##### 4. Tasks

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,

    -- Task Content
    content TEXT NOT NULL,  -- Text to label (max 500 chars enforced in app)
    task_type TEXT NOT NULL CHECK (task_type IN ('sentiment', 'classification')),

    -- For classification tasks
    classification_options TEXT[],

    -- Assignment & Consensus
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'completed', 'expired', 'escalated')),
    assigned_to UUID[],  -- Array of worker IDs (up to 3)
    required_workers INTEGER DEFAULT 3,

    -- Quality Assurance
    is_golden_task BOOLEAN DEFAULT FALSE,
    golden_answer TEXT,  -- Correct answer if golden task

    -- Results
    final_label TEXT,
    consensus_reached BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(5,2),  -- 0-100

    -- Timing
    time_limit_seconds INTEGER DEFAULT 45,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_assigned_to ON tasks USING GIN(assigned_to);  -- Array index

-- RLS: Workers see assigned tasks, clients see tasks in their projects
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_select_assigned ON tasks FOR SELECT USING (
    current_user_wallet() = ANY(assigned_to) OR
    project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid()))
);
```

##### 5. Task Responses

```sql
CREATE TABLE task_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,

    -- Response
    response TEXT NOT NULL,  -- Worker's answer
    response_time_seconds INTEGER,  -- How long worker took

    -- Quality Check
    is_correct BOOLEAN,  -- Validated against golden answer if applicable

    -- Metadata
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_task_responses_task ON task_responses(task_id);
CREATE INDEX idx_task_responses_worker ON task_responses(worker_id);
CREATE INDEX idx_task_responses_submitted_at ON task_responses(submitted_at DESC);

-- RLS: Workers see their responses, clients see responses for their project tasks
ALTER TABLE task_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY task_responses_select ON task_responses FOR SELECT USING (
    worker_id IN (SELECT id FROM workers WHERE wallet_address = current_user_wallet()) OR
    task_id IN (SELECT id FROM tasks WHERE project_id IN (SELECT id FROM projects WHERE client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())))
);
```

##### 6. Transactions

```sql
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Parties
    worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,

    -- Transaction Details
    type TEXT NOT NULL CHECK (type IN ('task_payment', 'withdrawal', 'deposit', 'referral_bonus', 'streak_bonus', 'points_redemption')),
    amount_usd DECIMAL(12,6) NOT NULL,

    -- Blockchain
    tx_hash TEXT UNIQUE,  -- Celo transaction hash
    from_address TEXT,
    to_address TEXT,

    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),

    -- Metadata
    metadata JSONB,  -- Task ID, project ID, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_transactions_worker ON transactions(worker_id);
CREATE INDEX idx_transactions_client ON transactions(client_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);

-- RLS: Workers see their transactions, clients see their transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY transactions_select ON transactions FOR SELECT USING (
    worker_id IN (SELECT id FROM workers WHERE wallet_address = current_user_wallet()) OR
    client_id IN (SELECT id FROM clients WHERE auth_user_id = auth.uid())
);
```

##### 7. Points Ledger (Cold Start)

```sql
CREATE TABLE points_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,

    -- Points Details
    points_amount INTEGER NOT NULL,  -- Positive for earn, negative for redeem
    type TEXT NOT NULL CHECK (type IN ('training_task', 'golden_bonus', 'referral', 'streak_7d', 'streak_30d', 'language_verification', 'redemption')),

    -- Related Entities
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,

    -- Expiry
    expires_at TIMESTAMP WITH TIME ZONE,  -- 12 months from issuance

    -- Metadata
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_points_ledger_worker ON points_ledger(worker_id);
CREATE INDEX idx_points_ledger_type ON points_ledger(type);
CREATE INDEX idx_points_ledger_expires_at ON points_ledger(expires_at);

-- RLS: Workers see their points history
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY points_ledger_select ON points_ledger FOR SELECT USING (
    worker_id IN (SELECT id FROM workers WHERE wallet_address = current_user_wallet())
);
```

#### Entity Relationships

```
clients (1) ──< (N) projects
projects (1) ──< (N) tasks
tasks (1) ──< (N) task_responses
workers (1) ──< (N) task_responses
workers (1) ──< (N) transactions
workers (1) ──< (N) points_ledger
clients (1) ──< (N) transactions
```

### 3.3 Data Modeling Approach

**Normalization Level:** 3NF (Third Normal Form)

**Denormalization Strategy:**
- **Worker stats** (tasks_completed, accuracy_score, earnings_lifetime) denormalized in `workers` table
  - **Why**: Avoid expensive aggregations on every profile load
  - **Update pattern**: Increment on task completion (background job)

- **Project progress** (total_tasks, completed_tasks) denormalized in `projects` table
  - **Why**: Real-time dashboard requires fast counts
  - **Update pattern**: Increment on task completion via database trigger

- **Task classification_options** duplicated from project
  - **Why**: Task can be queried independently without JOIN
  - **Update pattern**: Set on task creation, immutable

**Consistency Mechanisms:**
- Database triggers for automatic counter updates
- Periodic reconciliation job (daily) to catch drift

### 3.4 Migration Strategy

**Tool:** Supabase Migrations (SQL-based)

**Versioning:**
- All schema changes in `supabase/migrations/*.sql`
- Timestamped filenames: `20260128000000_initial_schema.sql`
- Never edit existing migrations (always create new)

**Deployment:**
```bash
# Local development
supabase db reset  # Drop and recreate

# Staging/Production
supabase db push  # Apply pending migrations
```

**Rollback Strategy:**
- Each migration includes `-- Rollback` section with DROP/ALTER statements
- Manual rollback if needed (Supabase doesn't auto-rollback)

**Zero-Downtime Changes:**
- Additive changes first (add columns/tables)
- Migrate data
- Remove old columns/tables in later migration

### 3.5 Data Access Patterns

| Query | Frequency | Optimization |
|-------|-----------|--------------|
| List available tasks for worker | High (every 5s polling) | Index on `status` + `assigned_to`, LIMIT 20 |
| Get worker profile | High (every page load) | Index on `wallet_address`, single-row lookup |
| Get project progress | Medium (dashboard polling every 10s) | Denormalized counts, index on `project_id` |
| Calculate consensus | High (on task submission) | Index on `task_id`, LIMIT 3 responses |
| Get client project list | Medium (dashboard load) | Index on `client_id` + `created_at DESC`, pagination |
| Validate golden task | High (on task completion) | Index on `task_id`, single-row lookup |
| Worker earnings history | Low (profile page) | Index on `worker_id` + `created_at DESC`, pagination |

**Query Performance Targets:**
- Single-row lookups: <10ms p95
- List queries (paginated): <50ms p95
- Aggregations (project metrics): <100ms p95

### 3.6 Caching Strategy

**Cache Provider:** Upstash Redis (serverless)

**Cached Data:**

| Data | TTL | Invalidation |
|------|-----|--------------|
| Worker profile | 5 minutes | On profile update, task completion |
| Available tasks list | 10 seconds | On new task creation |
| Project metrics | 30 seconds | On task completion |
| Client balance | 1 minute | On transaction |
| Leaderboard (future) | 5 minutes | On daily cron job |

**Cache Keys Convention:**
```
worker:{wallet_address}:profile
worker:{wallet_address}:available_tasks
project:{project_id}:metrics
client:{client_id}:balance
```

**Invalidation Strategy:**
- **Write-through**: Update DB → invalidate cache
- **Lazy loading**: Cache miss → query DB → set cache

**Redis Data Structures:**
```typescript
// Task Queue (List)
LPUSH task_queue:pending {task_id}
RPOP task_queue:pending  // Worker claims task

// Distributed Locks (String with TTL)
SET lock:task:{task_id} 1 EX 60 NX  // Prevent double-assignment

// Cache (Hash)
HSET worker:{wallet_address} profile {json}
EXPIRE worker:{wallet_address} 300
```

### 3.7 Backup and Recovery

**Backup Provider:** Supabase built-in backups

**Backup Frequency:**
- **Automated**: Daily at 02:00 UTC
- **Manual**: On-demand before major migrations

**Retention Period:**
- **Daily backups**: 7 days
- **Weekly backups**: 4 weeks (Sundays)
- **Monthly backups**: 3 months (1st of month)

**Recovery Time Objective (RTO):** 4 hours
- Time to restore database from backup to operational state

**Recovery Point Objective (RPO):** 24 hours
- Maximum acceptable data loss (since last daily backup)

**Testing:**
- Quarterly restore drills to staging environment
- Validate data integrity post-restore

**Disaster Recovery Plan:**
1. Detect outage (BetterStack alerts)
2. Assess data corruption vs infrastructure failure
3. If data corruption: Restore from latest backup to new Supabase project
4. Update DNS/environment variables to new database
5. Communicate downtime to users (status page)

---

## 4. UI Design

### 4.1 Design System

**Component Library:** shadcn/ui (Radix UI primitives + Tailwind)

**Justification:**
- Unstyled components → full control over visual design
- WCAG AA accessible by default
- Tree-shakeable (only include used components)
- TypeScript-native
- Small bundle impact (~5kb per component)

**Design Tokens:**

From DESIGN.md Section 6:

**Colors:**
```css
/* Neutrals (Warm Base) */
--color-warm-white: #FEFDFB;
--color-cream: #FAF7F2;
--color-sand: #F0EBE3;
--color-warm-gray-600: #6B665C;
--color-warm-gray-800: #3D3935;
--color-warm-black: #2C2925;

/* Primary (Deep Teal) */
--color-teal-100: #C7E6E4;
--color-teal-500: #2D8A83;
--color-teal-600: #1A7068;
--color-teal-700: #1A5F5A;  /* Primary brand color */

/* Secondary (Terracotta) */
--color-terracotta-500: #C45D3A;
--color-terracotta-600: #A84E31;

/* Semantic */
--color-success: #2D8A3D;
--color-warning: #C4883A;
--color-error: #C43A3A;
--color-money-gold: #C4A23A;
```

**Typography:**
```css
/* Font Family */
--font-family-primary: 'Plus Jakarta Sans', Inter, system-ui, -apple-system, sans-serif;

/* Type Scale */
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;  /* Mobile minimum to prevent iOS zoom */
--font-size-lg: 18px;
--font-size-xl: 20px;
--font-size-2xl: 24px;
--font-size-3xl: 30px;

/* Font Weights */
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

**Spacing:**
```css
--spacing-2: 8px;
--spacing-4: 16px;
--spacing-6: 24px;
--spacing-8: 32px;
--spacing-12: 48px;  /* Touch target minimum */
```

**Theming:** Single theme (warm palette), no dark mode for MVP

### 4.2 Key User Flows

#### Flow 1: Worker Onboarding

```
Worker clicks WhatsApp link → Opens in MiniPay browser → Wallet auto-connects
  ↓
Bawo detects MiniPay (window.ethereum) → Captures wallet address
  ↓
"Verify you're human" prompt → Opens Self app → Scans NFC passport (10s)
  ↓
ZK proof sent to Bawo (no PII) → Verification badge granted
  ↓
Training tutorial (5 sample tasks) → Completion → See task dashboard
  ↓
Success: Worker can start earning
```

**Fallback (if Self unavailable):**
```
Phone verification via MiniPay → Level 1 access → Basic tasks only → $10/day limit
```

#### Flow 2: Task Completion (Sentiment Analysis)

```
Worker sees available tasks → Taps "Start Task" → Task marked "assigned"
  ↓
Task screen: Timer (45s), text to classify, 3 buttons (Pos/Neg/Neu)
  ↓
Worker reads, taps sentiment → Taps "Submit"
  ↓
If online: POST /api/tasks/:id/submit → Consensus check → Payment
If offline: Save to IndexedDB → Queue for sync → Payment when reconnected
  ↓
"Earned $0.05" notification → Running total updated → Next task auto-loads
  ↓
Success: Continuous task flow, instant feedback
```

#### Flow 3: Worker Withdrawal

```
Worker taps "Withdraw" on Earnings screen → Sees balance ($12.47 cUSD)
  ↓
Enters amount (or taps "Max") → Pre-filled MiniPay address shown
  ↓
Taps "Withdraw Now" → Celo transaction signed → <5s confirmation
  ↓
"Sent! Check your MiniPay wallet" → cUSD appears in MiniPay
  ↓
Worker taps "Cash out to M-PESA" → MiniPay off-ramp → 55 seconds to local currency
  ↓
Success: Instant access to earnings
```

#### Flow 4: Client Project Creation

```
Client logs in → Dashboard → "Create Project" button
  ↓
Form: Name, task type (dropdown), CSV upload (drag-and-drop)
  ↓
CSV previewed (first 10 rows) → Client reviews → Sets instructions (template)
  ↓
Sets price per task (min $0.08 shown) → Total cost calculated
  ↓
Balance check: Sufficient? Launch → Insufficient? Redirect to deposit
  ↓
Tasks queued → Dashboard shows progress bar (real-time via Supabase Realtime)
  ↓
Success: Project live, workers start labeling
```

### 4.3 Page/View Structure

#### Worker App (Mobile PWA)

| Page | URL | Purpose | Key Components |
|------|-----|---------|----------------|
| **Splash** | `/` | Loading, wallet connection | Logo, spinner, "Connecting wallet..." |
| **Onboarding** | `/onboard` | Identity verification | Self Protocol button, tutorial carousel |
| **Task Dashboard** | `/tasks` | Home, available tasks | EarningsDisplay, TaskCard list, "Withdraw" button |
| **Active Task** | `/task/:id` | Complete task | Timer, text content, SentimentSelector, "Submit" button |
| **Earnings** | `/earnings` | Detailed earnings history | Balance, chart, transaction list, "Withdraw" |
| **Withdraw** | `/withdraw` | Initiate payout | WithdrawForm, wallet address, "Withdraw Now" |
| **Profile** | `/profile` | Stats, settings, referrals | Verification badge, tier, accuracy, languages, "Refer Friends" |
| **Leaderboard** (Phase 2) | `/leaderboard` | Top earners | Rankings, prize pool |
| **Offline** | `/offline` | Offline state | "You're offline" message, task queue status |

#### Client Dashboard (Desktop Web)

| Page | URL | Purpose | Key Components |
|------|-----|---------|----------------|
| **Login** | `/login` | Authentication | Email/password form, "Sign Up" link |
| **Sign Up** | `/signup` | Registration | Email/password/company, terms checkbox |
| **Dashboard** | `/dashboard` | Overview | Balance, active/completed project cards, "Create Project" |
| **Create Project** | `/projects/new` | New project setup | CSV upload, task type selector, instructions textarea |
| **Project Detail** | `/projects/:id` | Monitor progress | Progress bar, quality metrics, activity log, "Download Results" |
| **Deposit** | `/deposit` | Add funds | Deposit address (QR code), MoonPay integration, transaction history |
| **Settings** | `/settings` | Account settings | API keys, webhooks, notification preferences |

### 4.4 Component Architecture

#### Worker App

```
App
├── Layout (if authenticated)
│   ├── BottomNav (Home, Earnings, Profile)
│   └── Toaster (shadcn/ui Toast)
├── Pages
│   ├── TaskDashboard
│   │   ├── EarningsDisplay
│   │   ├── TaskCard[] (list)
│   │   └── EmptyState (if no tasks)
│   ├── ActiveTask
│   │   ├── Timer
│   │   ├── TaskContent (text)
│   │   ├── SentimentSelector (or ClassificationSelector)
│   │   └── SubmitButton
│   ├── Earnings
│   │   ├── BalanceCard
│   │   ├── EarningsChart (recharts)
│   │   └── TransactionList
│   ├── Withdraw
│   │   └── WithdrawForm
│   └── Profile
│       ├── VerificationBadge
│       ├── StatsGrid
│       └── ReferralSection
└── Components (Shared)
    ├── Button (shadcn/ui)
    ├── Input (shadcn/ui)
    ├── Card (shadcn/ui)
    ├── Toast (shadcn/ui)
    ├── TaskCard (custom)
    ├── Timer (custom)
    ├── SentimentSelector (custom)
    └── EarningsDisplay (custom)
```

#### Client Dashboard

```
App
├── Layout (if authenticated)
│   ├── Sidebar (Dashboard, Projects, Deposit, Settings)
│   └── Header (Balance, User menu)
├── Pages
│   ├── Dashboard
│   │   ├── BalanceCard
│   │   ├── ProjectCard[] (active)
│   │   └── ProjectCard[] (completed)
│   ├── CreateProject
│   │   ├── ProjectForm
│   │   ├── CSVUpload (react-dropzone)
│   │   └── CostCalculator
│   ├── ProjectDetail
│   │   ├── ProgressBar
│   │   ├── QualityMetrics
│   │   ├── ActivityLog
│   │   └── DownloadButton
│   ├── Deposit
│   │   ├── DepositAddress (QR code)
│   │   ├── MoonPayWidget (iframe)
│   │   └── TransactionHistory
│   └── Settings
│       ├── APIKeysSection
│       ├── WebhooksSection
│       └── NotificationPreferences
└── Components (Shared)
    ├── Button (shadcn/ui)
    ├── Input (shadcn/ui)
    ├── Card (shadcn/ui)
    ├── Table (shadcn/ui)
    └── Chart (recharts)
```

### 4.5 Responsive Design Strategy

**Breakpoints:**
```css
/* Tailwind default (mobile-first) */
sm: 640px   /* Small tablets portrait */
md: 768px   /* Tablets landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

**Approach:** Mobile-first (from DESIGN.md)

**Worker App:**
- Optimized for mobile (<768px)
- Single-column layout
- Bottom navigation (thumb-friendly)
- Works on desktop but not optimized

**Client Dashboard:**
- Optimized for desktop (>1024px)
- Sidebar + main content layout
- Responsive down to tablet (768px)
- Mobile usable but not primary

**Touch Targets:**
> "Touch targets: 48x48px minimum (thick fingers on cracked screens)" (DESIGN.md Section 7)

### 4.6 Accessibility Standards

**WCAG Level:** AA (target)

**Key Considerations:**
- [x] Keyboard navigation (all interactive elements tabbable)
- [x] Screen reader support (ARIA labels on all buttons/inputs)
- [x] Color contrast 4.5:1 minimum (validated via Lighthouse)
- [x] Focus indicators (2px solid teal ring)
- [x] Alt text for all images
- [x] No color-only information (always text/icon)
- [x] Form labels associated with inputs
- [x] Error messages announced to screen readers
- [x] Skip to main content link

**Testing:**
- Automated: Lighthouse CI on every PR (accessibility score >90)
- Manual: Keyboard-only navigation testing
- Screen reader: VoiceOver (iOS) testing on key flows

### 4.7 State Management

**Global State (Zustand):**
```typescript
// stores/worker.ts
interface WorkerStore {
  profile: WorkerProfile | null;
  balance: number;
  isVerified: boolean;
  setProfile: (profile: WorkerProfile) => void;
  updateBalance: (amount: number) => void;
}

// stores/tasks.ts
interface TaskStore {
  currentTask: Task | null;
  availableTasks: Task[];
  offlineQueue: SubmittedTask[];
  setCurrentTask: (task: Task) => void;
  queueOfflineSubmission: (submission: SubmittedTask) => void;
  syncOfflineQueue: () => Promise<void>;
}

// stores/ui.ts
interface UIStore {
  isLoading: boolean;
  toasts: Toast[];
  showToast: (toast: Toast) => void;
  dismissToast: (id: string) => void;
}
```

**Server State (React Query):**
```typescript
// hooks/useWorkerProfile.ts
export function useWorkerProfile() {
  return useQuery({
    queryKey: ['worker', 'profile'],
    queryFn: async () => {
      const res = await fetch('/api/workers/profile');
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// hooks/useAvailableTasks.ts
export function useAvailableTasks() {
  return useQuery({
    queryKey: ['tasks', 'available'],
    queryFn: async () => {
      const res = await fetch('/api/tasks/available');
      return res.json();
    },
    refetchInterval: 10 * 1000, // Poll every 10s
  });
}

// hooks/useSubmitTask.ts
export function useSubmitTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ taskId, response }) => {
      const res = await fetch(`/api/tasks/${taskId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ response }),
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries(['tasks', 'available']);
      queryClient.invalidateQueries(['worker', 'profile']);
    },
  });
}
```

**Offline Queue (IndexedDB via idb):**
```typescript
// lib/offlineQueue.ts
import { openDB } from 'idb';

const db = await openDB('bawo-offline', 1, {
  upgrade(db) {
    db.createObjectStore('taskSubmissions', { keyPath: 'id' });
  },
});

export async function queueSubmission(submission: SubmittedTask) {
  await db.add('taskSubmissions', submission);
}

export async function getQueuedSubmissions() {
  return db.getAll('taskSubmissions');
}

export async function clearQueue() {
  const tx = db.transaction('taskSubmissions', 'readwrite');
  await tx.objectStore('taskSubmissions').clear();
}
```

**Realtime Subscriptions (Client Dashboard):**
```typescript
// hooks/useProjectProgress.ts
export function useProjectProgress(projectId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Subscribe to project updates via Supabase Realtime
    const subscription = supabase
      .channel(`project-${projectId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${projectId}`,
      }, (payload) => {
        setProgress(payload.new.completed_tasks / payload.new.total_tasks);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [projectId]);

  return progress;
}
```

---

## 5. API Specifications

### 5.1 API Design Principles

**Style:** REST (JSON over HTTPS)

**Justification:**
- Simple, cacheable, widely understood
- No GraphQL complexity needed for MVP
- HTTP verbs map cleanly to CRUD operations

**Versioning:** URL path (`/api/v1/*`)
- Allows breaking changes in v2 without disrupting v1 clients
- Version in path (not header) for easier browser testing

**Authentication:**
- **Workers**: Wallet signature verification
  - Header: `X-Wallet-Address: 0x...`
  - Header: `X-Signature: {signature}` (message signed by wallet)
- **Clients**: Bearer token (Supabase JWT)
  - Header: `Authorization: Bearer {token}`

**Response Format:**
```json
// Success
{
  "data": { ... },
  "meta": { "timestamp": "2026-01-28T12:00:00Z" }
}

// Error
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {},
    "requestId": "uuid"
  }
}
```

### 5.2 Endpoints

#### Workers API

##### Worker Verification

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/workers/verify` | Initiate Self Protocol verification | None (public) |
| GET | `/api/v1/workers/profile` | Get worker profile | Wallet signature |
| PUT | `/api/v1/workers/profile` | Update worker profile | Wallet signature |
| GET | `/api/v1/workers/stats` | Get worker statistics | Wallet signature |

**Example: POST /api/v1/workers/verify**

```http
POST /api/v1/workers/verify
Content-Type: application/json

{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "selfProof": "{zk_proof_from_self_sdk}"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "workerId": "550e8400-e29b-41d4-a716-446655440000",
    "verificationLevel": 2,
    "verifiedAt": "2026-01-28T12:00:00Z"
  },
  "meta": { "timestamp": "2026-01-28T12:00:00Z" }
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": {
    "code": "INVALID_PROOF",
    "message": "Self Protocol proof validation failed",
    "details": { "reason": "Proof signature mismatch" },
    "requestId": "req_abc123"
  }
}
```

##### Tasks API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/tasks/available` | List available tasks for worker | Wallet signature |
| POST | `/api/v1/tasks/:id/start` | Claim a task | Wallet signature |
| POST | `/api/v1/tasks/:id/submit` | Submit task response | Wallet signature |
| POST | `/api/v1/tasks/:id/skip` | Return task to queue (no penalty) | Wallet signature |

**Example: GET /api/v1/tasks/available**

```http
GET /api/v1/tasks/available?limit=20
X-Wallet-Address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
X-Signature: {signed_message}
```

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": "task_abc123",
      "type": "sentiment",
      "content": "This product is amazing! I love it.",
      "payAmount": 0.05,
      "timeLimit": 45,
      "estimatedTime": 30
    },
    {
      "id": "task_def456",
      "type": "classification",
      "content": "Breaking: Government announces new policy...",
      "options": ["Politics", "Sports", "Tech", "Other"],
      "payAmount": 0.03,
      "timeLimit": 30,
      "estimatedTime": 20
    }
  ],
  "meta": {
    "timestamp": "2026-01-28T12:00:00Z",
    "total": 147,
    "page": 1,
    "limit": 20
  }
}
```

**Example: POST /api/v1/tasks/:id/submit**

```http
POST /api/v1/tasks/task_abc123/submit
X-Wallet-Address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
X-Signature: {signed_message}
Content-Type: application/json

{
  "response": "positive",
  "responseTime": 27
}
```

**Response (200 OK):**
```json
{
  "data": {
    "taskId": "task_abc123",
    "status": "submitted",
    "earned": 0.05,
    "newBalance": 12.52,
    "message": "Earned $0.05! Payment confirmed."
  },
  "meta": { "timestamp": "2026-01-28T12:00:00Z" }
}
```

##### Earnings API

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/earnings` | Earnings history | Wallet signature |
| GET | `/api/v1/earnings/balance` | Current balance | Wallet signature |
| POST | `/api/v1/earnings/withdraw` | Initiate withdrawal | Wallet signature |

**Example: POST /api/v1/earnings/withdraw**

```http
POST /api/v1/earnings/withdraw
X-Wallet-Address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
X-Signature: {signed_message}
Content-Type: application/json

{
  "amount": 12.47,
  "toAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "transactionId": "tx_xyz789",
    "amount": 12.47,
    "fee": 0.0002,
    "txHash": "0x9f5b7c8d...",
    "status": "confirmed",
    "confirmedAt": "2026-01-28T12:00:03Z"
  },
  "meta": { "timestamp": "2026-01-28T12:00:03Z" }
}
```

#### Projects API (Clients)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/projects` | List client projects | Bearer token |
| POST | `/api/v1/projects` | Create project | Bearer token |
| GET | `/api/v1/projects/:id` | Get project details | Bearer token |
| PUT | `/api/v1/projects/:id` | Update project (pause/resume) | Bearer token |
| POST | `/api/v1/projects/:id/upload` | Upload CSV data | Bearer token |
| GET | `/api/v1/projects/:id/results` | Download results CSV | Bearer token |

**Example: POST /api/v1/projects**

```http
POST /api/v1/projects
Authorization: Bearer {supabase_jwt}
Content-Type: application/json

{
  "name": "Swahili Sentiment Analysis - Product Reviews",
  "taskType": "sentiment",
  "instructions": "Determine if the product review is positive, negative, or neutral. Consider cultural context for Swahili text.",
  "pricePerTask": 0.08,
  "sourceFileUrl": "https://r2.bawo.work/uploads/client_123/data.csv"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "proj_abc123",
    "name": "Swahili Sentiment Analysis - Product Reviews",
    "taskType": "sentiment",
    "totalTasks": 5000,
    "completedTasks": 0,
    "status": "active",
    "totalCost": 400.00,
    "createdAt": "2026-01-28T12:00:00Z",
    "estimatedCompletion": "2026-01-30T12:00:00Z"
  },
  "meta": { "timestamp": "2026-01-28T12:00:00Z" }
}
```

**Example: GET /api/v1/projects/:id**

```http
GET /api/v1/projects/proj_abc123
Authorization: Bearer {supabase_jwt}
```

**Response (200 OK):**
```json
{
  "data": {
    "id": "proj_abc123",
    "name": "Swahili Sentiment Analysis - Product Reviews",
    "taskType": "sentiment",
    "totalTasks": 5000,
    "completedTasks": 3847,
    "status": "active",
    "progress": 76.94,
    "qualityMetrics": {
      "consensusRate": 92.4,
      "avgAccuracy": 94.2,
      "rejectionRate": 2.1
    },
    "createdAt": "2026-01-28T12:00:00Z",
    "updatedAt": "2026-01-29T15:30:00Z"
  },
  "meta": { "timestamp": "2026-01-29T15:30:00Z" }
}
```

#### Payments API (Clients)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/payments/balance` | Get client balance | Bearer token |
| POST | `/api/v1/payments/deposit` | Generate deposit address | Bearer token |
| GET | `/api/v1/payments/history` | Transaction history | Bearer token |

**Example: POST /api/v1/payments/deposit**

```http
POST /api/v1/payments/deposit
Authorization: Bearer {supabase_jwt}
Content-Type: application/json

{
  "amount": 1000.00,
  "method": "crypto"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "depositAddress": "0x1234567890abcdef...",
    "qrCode": "data:image/png;base64,...",
    "amount": 1000.00,
    "currency": "USDC",
    "network": "Celo",
    "expiresAt": "2026-01-28T13:00:00Z"
  },
  "meta": { "timestamp": "2026-01-28T12:00:00Z" }
}
```

#### Points API (Cold Start)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/points/balance` | Get points balance | Wallet signature |
| POST | `/api/v1/points/redeem` | Redeem points for cUSD | Wallet signature |
| GET | `/api/v1/points/history` | Points transaction history | Wallet signature |

**Example: POST /api/v1/points/redeem**

```http
POST /api/v1/points/redeem
X-Wallet-Address: 0x742d35Cc6634C0532925a3b844Bc454e4438f44e
X-Signature: {signed_message}
Content-Type: application/json

{
  "points": 5000
}
```

**Response (200 OK):**
```json
{
  "data": {
    "pointsRedeemed": 5000,
    "usdAmount": 50.00,
    "txHash": "0x9f5b7c8d...",
    "newPointsBalance": 1234,
    "newUsdBalance": 62.47,
    "redemptionPoolRemaining": 350.00
  },
  "meta": { "timestamp": "2026-01-28T12:00:00Z" }
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": {
    "code": "REDEMPTION_POOL_INSUFFICIENT",
    "message": "Not enough funds in redemption pool. Available: $12.00, Requested: $50.00",
    "details": {
      "poolAvailable": 12.00,
      "requested": 50.00,
      "monthlyRevenue": 60.00,
      "redemptionCap": 12.00
    },
    "requestId": "req_def456"
  }
}
```

### 5.3 Rate Limiting

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Auth (verify, login) | 5 requests | 1 minute |
| Task submission | 60 requests | 1 minute |
| Task listing | 120 requests | 1 minute |
| Profile/stats | 60 requests | 1 minute |
| Projects (create) | 10 requests | 1 hour |
| Projects (read) | 120 requests | 1 minute |
| Withdrawals | 5 requests | 1 hour |

**Response (429 Too Many Requests):**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 42 seconds.",
    "details": {
      "limit": 60,
      "window": "1 minute",
      "retryAfter": 42
    },
    "requestId": "req_ghi789"
  }
}
```

**Headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1706447520
Retry-After: 42
```

---

## 6. Error Handling Strategy

### 6.1 Error Categories

| Category | HTTP Status | Example | Client Action |
|----------|-------------|---------|---------------|
| **Validation** | 400 Bad Request | Invalid input data | Show field-specific error, allow retry |
| **Authentication** | 401 Unauthorized | Invalid wallet signature | Redirect to login/onboarding |
| **Authorization** | 403 Forbidden | Insufficient permissions | Show "Access denied" message |
| **Not Found** | 404 Not Found | Resource doesn't exist | Show "Not found" page, link to dashboard |
| **Conflict** | 409 Conflict | Task already assigned | Refresh available tasks |
| **Rate Limit** | 429 Too Many Requests | Too many requests | Show retry countdown, auto-retry |
| **Server Error** | 500 Internal Server Error | Unexpected error | Show "Try again" message, log to Axiom |
| **Service Unavailable** | 503 Service Unavailable | Database/blockchain down | Show maintenance message, retry after delay |

### 6.2 Error Response Format

**Standard Error Structure:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message for client display",
    "details": {
      "field": "specific field if validation error",
      "expected": "what was expected",
      "received": "what was received"
    },
    "requestId": "req_abc123",
    "timestamp": "2026-01-28T12:00:00Z"
  }
}
```

**Error Codes:**
```typescript
enum ErrorCode {
  // Validation
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_FIELD = 'MISSING_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',

  // Authentication
  INVALID_SIGNATURE = 'INVALID_SIGNATURE',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',

  // Authorization
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  VERIFICATION_REQUIRED = 'VERIFICATION_REQUIRED',
  TIER_UPGRADE_REQUIRED = 'TIER_UPGRADE_REQUIRED',

  // Business Logic
  TASK_NOT_AVAILABLE = 'TASK_NOT_AVAILABLE',
  TASK_ALREADY_ASSIGNED = 'TASK_ALREADY_ASSIGNED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  REDEMPTION_POOL_INSUFFICIENT = 'REDEMPTION_POOL_INSUFFICIENT',
  POINTS_EXPIRED = 'POINTS_EXPIRED',

  // External Services
  BLOCKCHAIN_ERROR = 'BLOCKCHAIN_ERROR',
  SELF_PROTOCOL_ERROR = 'SELF_PROTOCOL_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',

  // Generic
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
}
```

### 6.3 Logging Strategy

**Log Levels:**
- **ERROR**: Unhandled exceptions, 5xx errors, blockchain transaction failures
- **WARN**: Rate limit violations, validation errors, Self Protocol timeouts
- **INFO**: Successful operations (task submission, payment confirmation)
- **DEBUG**: Detailed request/response data (disabled in production)

**Structured Logging (JSON):**
```json
{
  "level": "ERROR",
  "timestamp": "2026-01-28T12:00:00Z",
  "requestId": "req_abc123",
  "userId": "worker_123",
  "endpoint": "/api/v1/tasks/abc123/submit",
  "error": {
    "code": "BLOCKCHAIN_ERROR",
    "message": "Celo transaction failed",
    "stack": "...",
    "details": { "txHash": "0x..." }
  },
  "context": {
    "taskId": "abc123",
    "payAmount": 0.05,
    "workerTier": "silver"
  }
}
```

**Correlation IDs:**
- Generate unique `requestId` on every API call
- Include in response headers: `X-Request-ID`
- Include in all log entries for that request
- Allows tracing request flow across services

**Log Retention:**
- **Production**: 30 days in Axiom
- **Staging**: 7 days
- **Development**: Local console only

**Sensitive Data Handling:**
- **Never log**: Passwords, wallet private keys, Self Protocol proofs (only hashes)
- **Redact**: Full wallet addresses (log last 6 chars only), email addresses (mask domain)

### 6.4 Client-Side Error Handling

**Network Errors:**
```typescript
// Retry with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;

      // Don't retry 4xx errors (client fault)
      if (res.status >= 400 && res.status < 500) {
        throw new Error(`Client error: ${res.status}`);
      }

      // Retry 5xx errors (server fault)
      lastError = new Error(`Server error: ${res.status}`);
    } catch (err) {
      lastError = err as Error;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, i) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  throw lastError;
}
```

**Offline Handling:**
```typescript
// Queue task submissions offline
if (!navigator.onLine) {
  await offlineQueue.add({ taskId, response, timestamp });
  showToast({ message: "Saved offline. Will submit when connected.", type: "info" });
  return;
}

// Sync queue when online
window.addEventListener('online', async () => {
  const queued = await offlineQueue.getAll();
  for (const submission of queued) {
    try {
      await submitTask(submission.taskId, submission.response);
      await offlineQueue.remove(submission.id);
    } catch (err) {
      console.error('Offline sync failed:', err);
    }
  }
});
```

**User-Facing Error Messages (from DESIGN.md Section 9):**
- Friendly, not technical
- Actionable
- Examples:
  - "Can't connect. Check your internet." (not "Network error")
  - "Not enough funds. You have $X available." (not "Insufficient balance")
  - "Please select an option" (not "Required field")
  - "Time's up. Task returned to queue." (not "Timeout")

---

## 7. Testing Strategy

### 7.1 Testing Pyramid

| Level | Coverage Target | Tools | Examples |
|-------|-----------------|-------|----------|
| **Unit** | 80% code coverage | Vitest | Pure functions, utility modules, components |
| **Integration** | Key API flows | Vitest + Supertest | API routes, database queries, blockchain interactions |
| **E2E** | Critical user paths | Playwright | Onboarding, task submission, withdrawal |

**Rationale:**
- **High unit test coverage**: Fast feedback, cheap to run, catch regressions early
- **Integration tests on key flows**: Validate component interactions (API + DB + blockchain)
- **E2E tests on critical paths**: Validate end-to-end user experience (expensive, run on CI only)

### 7.2 Testing Guidelines

#### Unit Tests

**What to test:**
- Utility functions (pure functions, no side effects)
- React components (rendering, user interactions)
- Business logic (consensus calculation, reputation scoring)
- Validation schemas (Zod)

**Example:**
```typescript
// lib/consensus.test.ts
import { describe, it, expect } from 'vitest';
import { calculateConsensus } from './consensus';

describe('calculateConsensus', () => {
  it('should return majority answer when 2+ agree', () => {
    const responses = [
      { workerId: '1', response: 'positive' },
      { workerId: '2', response: 'positive' },
      { workerId: '3', response: 'negative' },
    ];

    const result = calculateConsensus(responses);

    expect(result.consensusReached).toBe(true);
    expect(result.finalLabel).toBe('positive');
    expect(result.confidence).toBeGreaterThan(0.66);
  });

  it('should escalate when no majority', () => {
    const responses = [
      { workerId: '1', response: 'positive' },
      { workerId: '2', response: 'negative' },
      { workerId: '3', response: 'neutral' },
    ];

    const result = calculateConsensus(responses);

    expect(result.consensusReached).toBe(false);
    expect(result.escalated).toBe(true);
  });
});
```

**Coverage Target:**
- Critical business logic: 100%
- Utilities: 90%+
- React components: 70%+ (focus on logic, not presentation)

#### Integration Tests

**What to test:**
- API routes with database interactions
- Blockchain transaction flows
- External service integrations (Self Protocol, Celo)

**Example:**
```typescript
// app/api/tasks/[id]/submit/route.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createMocks } from 'node-mocks-http';
import { POST } from './route';

describe('POST /api/tasks/:id/submit', () => {
  beforeEach(async () => {
    // Seed test database
    await db.tasks.create({
      id: 'task_123',
      content: 'Test task',
      status: 'assigned',
      assigned_to: ['worker_1'],
    });
  });

  it('should submit task response and trigger payment', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { response: 'positive', responseTime: 27 },
      headers: {
        'x-wallet-address': '0x123...',
        'x-signature': 'valid_signature',
      },
    });

    await POST(req, { params: { id: 'task_123' } });

    expect(res._getStatusCode()).toBe(200);
    const data = JSON.parse(res._getData());
    expect(data.data.earned).toBe(0.05);

    // Verify database updated
    const task = await db.tasks.findById('task_123');
    expect(task.status).toBe('completed');

    // Verify transaction created
    const tx = await db.transactions.findByTaskId('task_123');
    expect(tx.amount).toBe(0.05);
    expect(tx.status).toBe('confirmed');
  });
});
```

**Coverage Target:**
- All API endpoints: 100%
- Happy path + major error cases

#### E2E Tests

**What to test:**
- Critical user flows (must work for product to function)
- Cross-browser compatibility (MiniPay/Chrome mobile)
- Performance (3s load time on 3G)

**Example:**
```typescript
// e2e/worker-onboarding.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Worker Onboarding', () => {
  test('should complete full onboarding flow', async ({ page }) => {
    // Navigate to app
    await page.goto('https://bawo.work');

    // Verify MiniPay wallet auto-connects
    await expect(page.locator('text=Connecting wallet...')).toBeVisible();
    await expect(page.locator('text=Connected: 0x742d...')).toBeVisible({ timeout: 5000 });

    // Start Self Protocol verification
    await page.click('button:has-text("Verify with Self")');

    // Mock Self Protocol NFC scan (in test env)
    await page.evaluate(() => {
      window.mockSelfVerification({ success: true, level: 2 });
    });

    // Verify badge appears
    await expect(page.locator('text=Verified')).toBeVisible({ timeout: 10000 });

    // Complete tutorial
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("Positive")');
      await page.click('button:has-text("Submit")');
    }

    // Verify redirected to task dashboard
    await expect(page).toHaveURL(/\/tasks$/);
    await expect(page.locator('text=Available Tasks')).toBeVisible();
  });

  test('should load in <3s on 3G', async ({ page }) => {
    // Throttle to 3G
    await page.route('**/*', route => route.continue({ delay: 100 }));

    const start = Date.now();
    await page.goto('https://bawo.work');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(3000);
  });
});
```

**Coverage:**
- Worker: Onboarding, task completion, withdrawal
- Client: Project creation, progress monitoring, results download
- Offline: Task caching, queue sync

**Test Environments:**
- **Mobile**: iPhone SE, Android (low-end Tecno/Infinix)
- **Desktop**: Chrome, Firefox, Safari (client dashboard)
- **Network**: 3G throttling, offline mode

### 7.3 CI/CD Integration

**GitHub Actions Workflow:**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test-unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  test-integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run db:migrate:test
      - run: npm run test:integration

  test-e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - name: Upload artifacts
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://bawo-preview-${{ github.event.pull_request.number }}.vercel.app
          uploadArtifacts: true
          temporaryPublicStorage: true
```

**Required Checks Before Merge:**
- ✅ Lint passes (ESLint, Prettier)
- ✅ Type check passes (tsc --noEmit)
- ✅ Unit tests pass (80%+ coverage)
- ✅ Integration tests pass
- ✅ E2E tests pass (critical paths)
- ✅ Lighthouse score >90 (performance, accessibility)

**Deployment Flow:**
```
PR opened → Preview deploy (Vercel) → Tests run → Review → Merge to main → Production deploy
```

---

## 8. Development Phases

### Phase 1: Foundation (Sprint 1-2) — Weeks 1-4

**Goal:** MVP infrastructure, authentication, basic task flow

**Deliverables:**
- [ ] **Project Setup**
  - Next.js 14 app initialized
  - Tailwind + shadcn/ui configured
  - Supabase project created
  - Vercel deployment pipeline
  - GitHub Actions CI setup

- [ ] **Database Schema**
  - All tables created (workers, clients, projects, tasks, task_responses, transactions, points_ledger)
  - Indexes created
  - Row-Level Security policies enabled
  - Migration scripts tested

- [ ] **Authentication System**
  - **Workers**: MiniPay wallet auto-connect
  - **Workers**: Wallet signature verification
  - **Workers**: Self Protocol integration (with phone-only fallback)
  - **Clients**: Email/password via Supabase Auth
  - Session management (JWT tokens)

- [ ] **Core API Endpoints**
  - `/api/v1/workers/verify` (POST)
  - `/api/v1/workers/profile` (GET/PUT)
  - `/api/v1/tasks/available` (GET)
  - `/api/v1/tasks/:id/submit` (POST)
  - `/api/v1/projects` (GET/POST)
  - `/api/v1/payments/balance` (GET)

**Success Criteria:**
- Worker can onboard with MiniPay wallet
- Worker can verify via Self Protocol (or phone fallback)
- Client can create account and log in
- API endpoints return mock data (no real tasks yet)
- CI pipeline runs on every PR

**Estimated Effort:** 80 hours (2 weeks @ 40hr/week, solo dev)

### Phase 2: Core Features (Sprint 3-5) — Weeks 5-10

**Goal:** Complete task lifecycle, payments, quality assurance

**Deliverables:**
- [ ] **Task Engine**
  - Task creation from CSV upload
  - Task assignment (queue in Redis)
  - Consensus calculation (3 workers)
  - Golden task injection (10%)
  - Reputation scoring

- [ ] **Worker UI (Mobile PWA)**
  - Task dashboard (available tasks)
  - Active task screen (sentiment/classification)
  - Timer component (countdown)
  - Task submission with offline queue
  - Earnings display
  - Withdrawal flow

- [ ] **Client Dashboard (Desktop)**
  - Project creation form
  - CSV upload (to R2)
  - Project detail page (progress, metrics)
  - Results download
  - Deposit flow (crypto address)

- [ ] **Payment Integration**
  - Celo blockchain integration (viem)
  - Worker task payment (cUSD)
  - Worker withdrawal to MiniPay
  - Client deposit handling
  - Transaction logging

- [ ] **Offline Support**
  - Service Worker setup (next-pwa)
  - IndexedDB task caching
  - Submission queue sync
  - Offline indicator

- [ ] **Points System (Cold Start)**
  - Points awarding (training tasks)
  - Points redemption (capped at 20% revenue)
  - Points expiry (12 months)
  - Treasury management

**Success Criteria:**
- Worker can complete end-to-end task flow (claim → submit → get paid)
- Payment arrives in MiniPay wallet within 5 seconds
- Client can upload CSV, monitor progress, download results
- Consensus mechanism correctly identifies majority answer
- Offline task queue syncs when reconnected
- Points system functional with redemption limits enforced

**Estimated Effort:** 200 hours (5 weeks @ 40hr/week)

### Phase 3: Quality & Performance (Sprint 6-7) — Weeks 11-14

**Goal:** Optimize performance, add quality features, prepare for launch

**Deliverables:**
- [ ] **Performance Optimization**
  - Bundle size <150kb JS gzipped (code splitting, tree shaking)
  - Initial load <3s on 3G (Lighthouse CI validation)
  - Image optimization (WebP, lazy loading)
  - Cloudflare CDN setup (Africa PoPs)

- [ ] **Quality Assurance**
  - Golden task validation
  - Spot check system (5% expert review)
  - Worker tier progression (newcomer → bronze → silver → gold)
  - Language verification tasks

- [ ] **UI/UX Refinements**
  - Animations (framer-motion)
  - Empty states
  - Loading states
  - Error messages (user-friendly)
  - Accessibility audit (WCAG AA)

- [ ] **Testing**
  - Unit test coverage >80%
  - Integration tests for all API routes
  - E2E tests for critical flows
  - Mobile device testing (Tecno, Infinix, Samsung A-series)

- [ ] **Monitoring & Analytics**
  - Axiom logging setup
  - BetterStack uptime monitoring
  - PostHog analytics
  - Error tracking

- [ ] **Documentation**
  - API documentation (OpenAPI spec)
  - Worker onboarding guide
  - Client integration guide
  - Admin runbook (deployment, troubleshooting)

**Success Criteria:**
- Lighthouse performance score >90
- Bundle size <150kb (validated)
- All critical flows covered by E2E tests
- Accessibility score >90
- Monitoring dashboards operational

**Estimated Effort:** 120 hours (3 weeks @ 40hr/week)

### Phase 4: Launch Prep & Beta (Sprint 8-9) — Weeks 15-18

**Goal:** Beta testing with real users, iterate based on feedback

**Deliverables:**
- [ ] **Beta Launch (Kenya)**
  - Recruit 50 founding workers (WhatsApp groups, university outreach)
  - Create 500 training tasks (Swahili sentiment)
  - Onboard 1-2 pilot clients (free 100 labels)
  - Monitor performance and quality

- [ ] **Iteration Based on Feedback**
  - Fix bugs reported by beta users
  - Adjust task instructions based on confusion
  - Optimize payment flow based on drop-offs
  - Refine UI based on mobile usability issues

- [ ] **Security Hardening**
  - Penetration testing (basic)
  - Rate limiting tuning
  - Hot wallet rotation setup
  - Secrets management audit

- [ ] **Compliance**
  - Kenya Data Protection Act registration (ODPC)
  - Terms of Service drafted
  - Privacy Policy drafted
  - Independent contractor agreements

**Success Criteria:**
- 50 verified workers onboarded
- 600+ training tasks completed
- 1 pilot client project completed successfully
- Quality metrics: 90%+ accuracy on golden tasks
- No critical bugs reported

**Estimated Effort:** 120 hours (4 weeks @ 30hr/week, includes beta monitoring)

### Phase 5: Public Launch (Sprint 10+) — Week 19+

**Goal:** Full Kenya launch, scale to first revenue targets

**Deliverables:**
- [ ] **Public Launch**
  - Marketing site live (bawo.work)
  - Worker referral program active
  - Client prospecting (28 targets)
  - First dataset published (Swahili sentiment)

- [ ] **Scale to Month 3 Targets**
  - 200 active workers
  - 2 paying clients
  - $1K MRR

- [ ] **Continuous Improvement**
  - Weekly retrospectives
  - Feature requests prioritized
  - Performance monitoring
  - Client feedback loop

**Success Criteria (Month 3):**
- 200 workers, 40%+ weekly retention
- 2 paying clients, 8,000 tasks/month
- $1K MRR
- <1% error rate, 99.5%+ uptime

**Ongoing:** Iterate toward Year 1 targets (3,000 workers, 28 clients, $43K MRR)

---

## 9. Known Risks and Mitigation

### 9.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Self Protocol integration fails** | Medium | High | Validate SDK Week 1-2; fallback to phone verification (Level 1 only); revisit in 3 months |
| **Celo network congestion** | Low | Medium | Monitor gas prices; batch small payments if fees spike; use Celo's fee abstraction to pay in cUSD |
| **Supabase Realtime subscription limits** | Medium | Medium | Batch updates every 5s instead of instant; use polling fallback if subscriptions hit limits |
| **Bundle size exceeds 150kb** | Medium | High | Aggressive code splitting; lazy load non-critical components; monitor bundle size in CI |
| **3G load time >3s** | High | High | Cloudflare CDN with Africa PoPs; aggressive caching; defer non-critical JS; validate in Lighthouse CI |
| **Offline sync conflicts** | Medium | Low | Last-write-wins strategy; show conflict notification to worker; allow manual resolution |
| **IndexedDB quota exceeded** | Low | Low | Limit cached tasks to 100; auto-purge tasks older than 7 days |
| **Vercel serverless cold starts** | Medium | Medium | Use edge functions for critical paths; pre-warm functions with cron jobs |

### 9.2 Security Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Hot wallet compromise** | Low | High | Low balance ($500 max); rotate keys every 90 days; multi-sig for client deposits >$1K |
| **Sybil attacks (fake workers)** | High | High | Self Protocol (1 passport = 1 account); device fingerprinting; IP analysis; golden task accuracy tracking |
| **Worker collusion (answer sharing)** | High | Medium | Randomized task variants; detect coordinated patterns; golden tasks prevent gaming |
| **SQL injection** | Low | High | Supabase parameterized queries; Zod input validation; no raw SQL from user input |
| **XSS attacks** | Low | High | React auto-escaping; CSP headers; sanitize user-generated content (task instructions) |
| **CSRF attacks** | Low | Medium | Supabase CSRF protection; wallet signature verification; SameSite cookies |
| **Rate limit bypass** | Medium | Medium | Distributed rate limiting (Redis); IP + user ID tracking; CAPTCHA on repeated violations |
| **Phishing (fake Bawo site)** | Medium | High | Educate workers via WhatsApp; official domain verification; MiniPay browser whitelist |

### 9.3 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **MiniPay restricts access** | Low | High | Yellow Card backup integration; direct Celo wallet support; M-PESA integration if needed |
| **Worker supply insufficient** | Medium | Medium | Increase referral bonuses; partner with universities; run paid acquisition (Facebook) |
| **Client demand slow** | Medium | High | Offer extended free pilots; create benchmark datasets to sell; partner with AI bootcamps |
| **Quality issues at scale** | Medium | High | Increase consensus to 5 workers; add human QA layer; reduce task complexity temporarily |
| **Regulatory issues (Kenya)** | Low | High | VASP Bill passed (low risk); partner with licensed entity; focus on most favorable jurisdiction |
| **Remotasks returns to Kenya** | Low | Medium | Workers burned by Remotasks won't trust them; speed to market (6+ months head start); niche focus (African languages) |
| **Points treasury overhang** | Medium | Low | Cap at 500K points outstanding; 12-month expiry; 20% monthly revenue redemption limit |

### 9.4 Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Solo founder bandwidth** | High | Medium | Focus ruthlessly on MVP; defer Phase 2 features; use no-code tools where possible |
| **Supabase outage** | Low | High | Daily backups; disaster recovery plan; manual restore to new project (4-hour RTO) |
| **Vercel outage** | Low | Medium | Status page monitoring; static fallback page; communicate downtime proactively |
| **Celo network outage** | Low | High | Monitor network status; queue payments for retry; communicate delays to workers |

---

## 10. Open Questions

### Resolved Questions (2026-01-28)

| Question | Resolution | Status | Action Items |
|----------|-----------|--------|--------------|
| **Self Protocol NFC support on Tecno/Infinix devices?** | ✅ **RESOLVED**: Self as default, phone verification as opt-down. Self users get full access ($50/day limit), phone users get limited access ($10/day, basic tasks only). Workers can upgrade anytime. | 🟢 Resolved | Week 1: Test Self SDK on 3 device models (Tecno, Infinix, Samsung A-series) to optimize default path |
| **Celo gas fees during network congestion?** | ✅ **RESOLVED**: Not a concern. Celo fees consistently sub-cent, MiniPay processes millions of transactions. Skip. | 🟢 Resolved | None - proceed with implementation |
| **Self Protocol pricing model?** | ✅ **RESOLVED**: Get quote but not blocking. Phone verification opt-down means Self pricing doesn't block launch. Factor into unit economics when quote received. | 🟢 Resolved | Week 1: Email Self Protocol for pricing (per-verification cost, volume discounts, startup programs) - nice-to-know, not blocking |
| **MiniPay deep linking for PWA install?** | ✅ **RESOLVED**: Web-first, PWA as enhancement. Don't block on this. | 🟢 Resolved | Sprint 1: Build web-first, add PWA install prompt as enhancement |
| **Supabase Realtime subscription pricing at scale?** | ✅ **RESOLVED**: Hybrid design (Realtime for active tasks, polling for dashboard), measure later. Not a launch concern. | 🟢 Resolved | Sprint 2: Design hybrid approach, monitor costs in production |
| **Kenya ODPC registration timeline?** | ✅ **RESOLVED**: File Week 1, operate during processing period. | 🟢 Resolved | Week 1: File ODPC registration, consult lawyer if needed |
| **Yellow Card API access for backup integration?** | ✅ **RESOLVED**: Defer to Month 3+. Only revisit if MiniPay restricts access. | 🟢 Resolved | None - deferred |

### Worker Verification Flow (Updated)

```
Sign up → "Verify with Self Protocol" (default, prominent CTA)
                    ↓
         [Can't scan passport?]
                    ↓
         "Continue with phone only" (smaller link)
                    ↓
    ┌─────────────┴─────────────┐
    │                           │
Self Path                  Phone Path
│                           │
├─ Full access              ├─ Limited access
├─ All task types           ├─ Basic tasks only
├─ $50/day limit            ├─ $10/day limit
├─ Premium rates            ├─ Standard rates
└─ Can refer friends        └─ Can upgrade to Self anytime
```

### No Blockers to Implementation

All critical questions resolved. No technical blockers remain. Ready to proceed with `/implement`.

---

## 11. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| **MiniPay** | Opera's stablecoin wallet (11M users), built on Celo blockchain |
| **Celo** | Ethereum L2 blockchain with fee abstraction (pay gas in stablecoins) |
| **Self Protocol** | Zero-knowledge identity verification using NFC passport scans |
| **cUSD** | Celo Dollar stablecoin (pegged to USD) |
| **Golden Task** | Pre-labeled test task (worker doesn't know it's a test) |
| **Consensus** | Agreement among multiple workers on same task (2+ out of 3) |
| **Sheng** | Nairobi street slang (~10M speakers, no NLP resources) |
| **PWA** | Progressive Web App (installable web app, works offline) |
| **RLS** | Row-Level Security (database-level authorization in Postgres) |
| **DID** | Decentralized Identifier (e.g., did:selfid:celo:0x...) |
| **ZK Proof** | Zero-knowledge proof (cryptographic proof without revealing underlying data) |

### B. References

**Technology Documentation:**
- Next.js 14: https://nextjs.org/docs
- Celo Developer Docs: https://docs.celo.org
- Self Protocol Docs: https://docs.selfprotocol.com
- Supabase Docs: https://supabase.com/docs
- viem (Ethereum library): https://viem.sh
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com

**Business Context:**
- PRD v2.0: `grimoires/loa/prd.md`
- Design Specification: `DESIGN.md`
- Business Plan: `grimoires/loa/context/business-plan.md`
- Cold Start Strategy: `grimoires/loa/context/cold-start-strategy.md`
- Why Now Thesis: `grimoires/loa/context/why-now.md`
- Prospecting List: `grimoires/loa/context/prospecting-list.md`

**Security Standards:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/

### C. Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-28 | Initial SDD based on PRD v2.0 and DESIGN.md | Architecture Designer Agent |

### D. Database Schema Diagram

```
┌─────────────┐         ┌─────────────┐
│   workers   │         │   clients   │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ wallet_addr │         │ email       │
│ self_did    │         │ company     │
│ tier        │         │ balance_usd │
│ accuracy    │         └──────┬──────┘
└──────┬──────┘                │
       │                       │
       │ 1:N                   │ 1:N
       │                       │
       ▼                       ▼
┌──────────────┐       ┌─────────────┐
│task_responses│       │  projects   │
├──────────────┤       ├─────────────┤
│ id (PK)      │       │ id (PK)     │
│ task_id (FK) │◀──┐   │ client_id(FK)
│ worker_id(FK)│   │   │ task_type   │
│ response     │   │   │ total_tasks │
│ is_correct   │   │   │ completed   │
└──────────────┘   │   └──────┬──────┘
                   │          │
       ┌───────────┘          │ 1:N
       │                      │
       │ N:1                  ▼
┌──────┴──────┐       ┌─────────────┐
│    tasks    │       │transactions │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ project_id  │       │ worker_id   │
│ content     │       │ client_id   │
│ status      │       │ amount_usd  │
│ assigned_to │       │ tx_hash     │
│ is_golden   │       └─────────────┘
│ final_label │
└─────────────┘
       ▲
       │ 1:N
       │
┌──────┴────────┐
│ points_ledger │
├───────────────┤
│ id (PK)       │
│ worker_id (FK)│
│ points_amount │
│ type          │
│ expires_at    │
└───────────────┘
```

### E. Tech Stack Summary

**Frontend:**
- Next.js 14 (React 18.2) + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand (state) + React Query (server state)
- viem (blockchain) + idb (IndexedDB)

**Backend:**
- Next.js API Routes (Node.js 20)
- Supabase (Postgres 15 + Auth + Realtime)
- Upstash Redis (queue + cache)
- Zod (validation)

**Infrastructure:**
- Vercel (hosting)
- Cloudflare (CDN + R2 storage)
- Celo (blockchain)
- Self Protocol (identity)

**Monitoring:**
- Axiom (logs)
- BetterStack (uptime)
- PostHog (analytics)

**Total Dependency Count (Estimated):** ~40 npm packages (kept minimal for bundle size)

---

**End of Software Design Document v1.0**

*This document serves as the definitive technical blueprint for Bawo. All engineering decisions during sprint planning and implementation should reference this SDD.*

**Next Steps:**
1. CEO Review & Approval
2. Technical Validation (Self Protocol SDK, Celo integration)
3. Sprint Planning (create tickets from Development Phases)
4. Begin Phase 1: Foundation
