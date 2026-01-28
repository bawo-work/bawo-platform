# Sprint Plan: Bawo MVP

**Version:** 1.0.0
**Status:** Ready for Implementation
**Date:** 2026-01-27
**Author:** Claude (Loa Framework - Sprint Planner)
**Based on:** PRD v1.0.0, SDD v1.0.0

---

## Executive Summary

### Sprint Overview

| Attribute | Value |
|-----------|-------|
| **Total Sprints** | 6 sprints |
| **Sprint Duration** | 2 weeks each |
| **Total Timeline** | 12 weeks |
| **Team Size** | Solo developer + Claude Code/Codex |
| **Target Launch** | 2026-04-21 (Week 12) |
| **MVP Scope** | Extended (16 features vs 12 original) |

### Expanded MVP Features

**Original 12 Features:**
1. MiniPay Wallet Auto-Connect
2. Self Protocol Identity Verification (with fallback)
3. Sentiment Analysis Tasks
4. Text Classification Tasks
5. Instant Stablecoin Payments
6. Withdrawal to MiniPay
7. Golden Task QA System
8. Consensus Mechanism
9. Client Dashboard - Project Creation
10. Client Dashboard - Results Download
11. Offline Task Caching
12. Points Program (Cold Start)

**Added 4 Features (Post-MVP → MVP):**
13. Referral Program (two-sided bonuses)
14. Streak Rewards (7-day, 30-day)
15. Leaderboards (weekly, monthly)
16. RLHF Preference Ranking Tasks

### Sprint Goals

| Sprint | Duration | Primary Goal | Key Deliverables |
|--------|----------|--------------|------------------|
| **Sprint 1** | Weeks 1-2 | Foundation & Setup | Dev environment, database schema, basic Next.js app |
| **Sprint 2** | Weeks 3-4 | Core Worker Flow (Part 1) | MiniPay integration, Self Protocol, task UI |
| **Sprint 3** | Weeks 5-6 | Core Worker Flow (Part 2) | Task types, timer, submission, golden tasks |
| **Sprint 4** | Weeks 7-8 | Payment Infrastructure | Celo integration, consensus, earnings, withdrawal |
| **Sprint 5** | Weeks 9-10 | Client Dashboard | Project creation, CSV upload, results download |
| **Sprint 6** | Weeks 11-12 | Gamification & Polish | Referrals, streaks, leaderboards, RLHF, offline, testing |

### Milestones

| Milestone | Target Date | Deliverables |
|-----------|-------------|--------------|
| **M1: Foundation Complete** | Week 2 | Database, auth, basic UI |
| **M2: Worker Flow Alpha** | Week 6 | Workers can complete tasks (no payments yet) |
| **M3: Payment Integration** | Week 8 | End-to-end payment flow working |
| **M4: Client Dashboard** | Week 10 | Clients can create projects and download results |
| **M5: Full Feature Set** | Week 12 | All 16 features complete, tested |
| **M6: Beta Launch** | Week 12 | 50 beta workers onboarded, 1 pilot client |

---

## Table of Contents

1. [Sprint 1: Foundation & Setup](#sprint-1-foundation--setup)
2. [Sprint 2: Core Worker Flow (Part 1)](#sprint-2-core-worker-flow-part-1)
3. [Sprint 3: Core Worker Flow (Part 2)](#sprint-3-core-worker-flow-part-2)
4. [Sprint 4: Payment Infrastructure](#sprint-4-payment-infrastructure)
5. [Sprint 5: Client Dashboard](#sprint-5-client-dashboard)
6. [Sprint 6: Gamification & Polish](#sprint-6-gamification--polish)
7. [Testing Strategy](#testing-strategy)
8. [Risk Management](#risk-management)
9. [Success Metrics](#success-metrics)

---

## Sprint 1: Foundation & Setup

**Duration:** Weeks 1-2 (2026-01-27 to 2026-02-09)
**Goal:** Establish development environment, database, auth, and basic Next.js application
**Risk Level:** Low (mostly setup work)

### Sprint Objectives

- Set up development environment with all required services
- Create database schema in Supabase
- Build basic Next.js app structure with routing
- Implement wallet-based authentication skeleton
- Set up CI/CD pipeline

### Tasks

---

#### T1.1: Development Environment Setup

**Description:** Set up local development environment with all required tools and services.

**Acceptance Criteria:**
- [ ] Node.js 20+ and pnpm 8+ installed
- [ ] Docker installed and running for local Postgres/Redis
- [ ] Git repository initialized with proper .gitignore
- [ ] Environment variables configured (.env.local)
- [ ] Docker Compose running Postgres and Redis locally
- [ ] Supabase project created (production)
- [ ] Upstash Redis project created (production)
- [ ] Cloudflare R2 bucket created (bawo-production)
- [ ] AWS KMS key created for smart contract signing
- [ ] Vercel project created and linked

**Estimated Effort:** 1 day

**Dependencies:** None

**Testing:**
- [ ] Run `pnpm --version` (should show 8.x)
- [ ] Run `docker ps` (should show Postgres and Redis)
- [ ] Connect to Supabase from pgAdmin
- [ ] Test Redis connection with Upstash CLI

---

#### T1.2: Database Schema Implementation

**Description:** Create complete PostgreSQL schema in Supabase as defined in SDD Section 5.1.

**Acceptance Criteria:**
- [ ] All 7 tables created: workers, clients, projects, tasks, transactions, referrals, streaks (new)
- [ ] All indexes created (12 indexes total)
- [ ] Row Level Security (RLS) policies applied (6 policies)
- [ ] Triggers created (3 triggers: updated_at, project_completion, worker_stats)
- [ ] Database migrations tracked in `/db/migrations/`
- [ ] Seed data for development (10 workers, 5 clients, 100 tasks, 50 golden tasks)

**Estimated Effort:** 2 days

**Dependencies:** T1.1

**Files:**
- `db/migrations/001_initial_schema.sql`
- `db/migrations/002_rls_policies.sql`
- `db/migrations/003_triggers.sql`
- `db/seed.sql`

**Testing:**
- [ ] Run migrations in local Postgres
- [ ] Verify all tables exist with `\dt`
- [ ] Test RLS policies with test queries
- [ ] Verify triggers fire on INSERT/UPDATE
- [ ] Seed data loads successfully

---

#### T1.3: Next.js Project Scaffolding

**Description:** Create Next.js 14 project with App Router, TypeScript, Tailwind CSS, and basic routing structure.

**Acceptance Criteria:**
- [ ] Next.js 14 project initialized with `create-next-app`
- [ ] TypeScript configured with strict mode
- [ ] Tailwind CSS + shadcn/ui set up
- [ ] App Router structure created (see SDD 4.1)
  - [ ] `app/(worker)/` group with layout
  - [ ] `app/(client)/` group with layout
  - [ ] `app/api/` for API routes
- [ ] Basic layouts created (root, worker, client)
- [ ] Navigation components (bottom nav for worker, sidebar for client)
- [ ] 404 and 500 error pages

**Estimated Effort:** 1.5 days

**Dependencies:** T1.1

**Files:**
- `app/layout.tsx`
- `app/(worker)/layout.tsx`
- `app/(client)/layout.tsx`
- `app/(worker)/page.tsx` (placeholder dashboard)
- `app/(client)/dashboard/page.tsx` (placeholder)
- `components/ui/` (shadcn/ui components)

**Testing:**
- [ ] Dev server runs on http://localhost:3000
- [ ] Worker routes render correctly
- [ ] Client routes render correctly
- [ ] Navigation works
- [ ] Tailwind styles apply

---

#### T1.4: Supabase Client Integration

**Description:** Set up Supabase client for database queries and realtime subscriptions.

**Acceptance Criteria:**
- [ ] Supabase client initialized in `lib/supabase.ts`
- [ ] Environment variables configured (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Server-side client (service role) created
- [ ] Client-side client (anon key) created
- [ ] Realtime subscription example working
- [ ] React Query integration for server state

**Estimated Effort:** 0.5 days

**Dependencies:** T1.2, T1.3

**Files:**
- `lib/supabase.ts`
- `lib/supabase-server.ts`
- `app/providers.tsx` (React Query provider)

**Testing:**
- [ ] Fetch workers from Supabase (server-side)
- [ ] Fetch tasks from Supabase (client-side)
- [ ] Test realtime subscription (listen to INSERT on transactions)

---

#### T1.5: Wallet Authentication Skeleton

**Description:** Implement basic wallet signature authentication flow for workers (no Self Protocol yet).

**Acceptance Criteria:**
- [ ] Detect MiniPay wallet via `window.ethereum.isMiniPay`
- [ ] Request wallet address via `eth_requestAccounts`
- [ ] Generate challenge message for signing
- [ ] Verify signature on backend using viem
- [ ] Issue JWT token with wallet address claim
- [ ] Store JWT in localStorage
- [ ] Middleware to protect worker routes
- [ ] "Connect Wallet" button shows if not connected

**Estimated Effort:** 1.5 days

**Dependencies:** T1.3, T1.4

**Files:**
- `lib/wallet-auth.ts`
- `hooks/useWallet.ts`
- `app/api/auth/wallet/route.ts`
- `app/api/auth/verify-signature/route.ts`
- `middleware.ts` (Next.js middleware for route protection)

**Testing:**
- [ ] Connect wallet in browser (mock MiniPay)
- [ ] Sign challenge message
- [ ] Receive JWT token
- [ ] Access protected route with JWT
- [ ] Reject invalid signature

---

#### T1.6: CI/CD Pipeline Setup

**Description:** Configure GitHub Actions for automated testing and deployment to Vercel.

**Acceptance Criteria:**
- [ ] GitHub Actions workflow created (`.github/workflows/ci.yml`)
- [ ] Workflow runs on push to `main` and `develop`
- [ ] Workflow runs on pull requests
- [ ] Steps: install deps, lint, type-check, unit tests, build
- [ ] Deploy to Vercel staging on push to `develop`
- [ ] Deploy to Vercel production on push to `main`
- [ ] Slack notification on deployment success/failure

**Estimated Effort:** 1 day

**Dependencies:** T1.3

**Files:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

**Testing:**
- [ ] Push to `develop` triggers staging deployment
- [ ] Open PR triggers CI checks
- [ ] Merge to `main` triggers production deployment

---

### Sprint 1 Deliverables

- [x] Development environment fully configured
- [x] Database schema created in Supabase with RLS policies
- [x] Next.js app with routing structure
- [x] Wallet authentication skeleton working
- [x] CI/CD pipeline deploying to Vercel

### Sprint 1 Definition of Done

- [ ] All tasks completed and tested
- [ ] Code reviewed (if team >1)
- [ ] Documentation updated (README.md with setup instructions)
- [ ] Deployed to staging environment
- [ ] Sprint retrospective completed

---

## Sprint 2: Core Worker Flow (Part 1)

**Duration:** Weeks 3-4 (2026-02-10 to 2026-02-23)
**Goal:** Build worker onboarding flow with MiniPay integration and Self Protocol verification
**Risk Level:** Medium (external API dependencies: Self Protocol)

### Sprint Objectives

- Implement MiniPay wallet auto-connect
- Integrate Self Protocol for ZK identity verification
- Build worker onboarding UI
- Create worker profile page
- Implement training tutorial

### Tasks

---

#### T2.1: MiniPay Wallet Auto-Connect

**Description:** Implement MiniPay-specific wallet detection and auto-connect flow as defined in SDD Section 8.1.

**Acceptance Criteria:**
- [ ] Detect MiniPay browser via `window.ethereum.isMiniPay`
- [ ] Auto-connect wallet on page load (no "Connect Wallet" button)
- [ ] Show "Open in MiniPay" message if accessed outside MiniPay
- [ ] Deep link to MiniPay browser if on mobile web
- [ ] Handle wallet connection errors gracefully
- [ ] Display connected wallet address in header

**Estimated Effort:** 1 day

**Dependencies:** Sprint 1 (T1.5)

**Files:**
- `lib/minipay.ts`
- `hooks/useWallet.ts` (extend)
- `components/worker/WalletConnectBanner.tsx`
- `app/(worker)/layout.tsx` (add auto-connect logic)

**Testing:**
- [ ] Test in MiniPay browser (auto-connects)
- [ ] Test in Chrome (shows "Open in MiniPay" message)
- [ ] Test wallet rejection (user declines connection)
- [ ] Test network switch to Celo

---

#### T2.2: Self Protocol Integration

**Description:** Integrate Self Protocol SDK for NFC passport verification with fallback to phone verification.

**Acceptance Criteria:**
- [ ] Self Protocol SDK installed and configured
- [ ] Start verification flow generates challenge URL
- [ ] Worker opens Self app via deep link
- [ ] Backend receives ZK proof callback
- [ ] Verify proof and update worker verification_level to 2
- [ ] Fallback: Phone verification via MiniPay (verification_level 1)
- [ ] Store verification status in database
- [ ] Display verification badge in UI

**Estimated Effort:** 2 days

**Dependencies:** T2.1

**Files:**
- `lib/self-protocol.ts`
- `app/api/workers/verify/route.ts`
- `app/api/webhooks/self-protocol/route.ts` (callback)
- `app/(worker)/onboard/page.tsx`
- `components/worker/VerificationFlow.tsx`

**Testing:**
- [ ] Start Self Protocol verification (opens Self app)
- [ ] Mock successful verification callback
- [ ] Verify worker record updated in database
- [ ] Test fallback to phone verification
- [ ] Test verification failure handling

---

#### T2.3: Worker Onboarding UI

**Description:** Build complete onboarding flow UI from splash screen to dashboard.

**Acceptance Criteria:**
- [ ] Splash screen with Bawo logo and loading spinner
- [ ] Welcome screen with value proposition
- [ ] Step indicator (1. Verify → 2. Learn → 3. Earn)
- [ ] Verification screen with "Verify with Self" button
- [ ] "Why verify?" expandable FAQ
- [ ] Success screen with checkmark animation
- [ ] Auto-redirect to training tutorial after verification
- [ ] Mobile-first design (48px touch targets)
- [ ] Loading states for async operations

**Estimated Effort:** 2 days

**Dependencies:** T2.2

**Files:**
- `app/(worker)/onboard/page.tsx`
- `components/worker/SplashScreen.tsx`
- `components/worker/WelcomeScreen.tsx`
- `components/worker/VerificationScreen.tsx`
- `components/worker/SuccessScreen.tsx`

**Testing:**
- [ ] Test full onboarding flow on mobile device
- [ ] Test on slow 3G connection (should load <3s)
- [ ] Test accessibility (keyboard navigation, screen reader)
- [ ] Test loading states
- [ ] Test error states

---

#### T2.4: Worker Profile Page

**Description:** Build worker profile page showing stats, tier, languages, and settings.

**Acceptance Criteria:**
- [ ] Display worker info: wallet address, verification level, tier
- [ ] Display stats: tasks completed, accuracy rate, earnings lifetime
- [ ] Display verified languages (if Level 3)
- [ ] Tier badge (Newcomer/Bronze/Silver/Gold/Expert)
- [ ] "Log out" button (clears JWT and wallet connection)
- [ ] Profile settings (future placeholder)
- [ ] Mobile-optimized layout

**Estimated Effort:** 1 day

**Dependencies:** T2.1, T2.2

**Files:**
- `app/(worker)/profile/page.tsx`
- `components/worker/ProfileCard.tsx`
- `components/worker/StatsDisplay.tsx`
- `components/worker/TierBadge.tsx`

**Testing:**
- [ ] Fetch worker profile from Supabase
- [ ] Display correct tier badge based on accuracy
- [ ] Log out clears session and redirects to onboarding
- [ ] Profile updates when stats change

---

#### T2.5: Training Tutorial

**Description:** Build interactive 5-question training tutorial to teach workers how to complete tasks.

**Acceptance Criteria:**
- [ ] 5 sample sentiment analysis questions
- [ ] Progress indicator (1/5, 2/5, etc.)
- [ ] Interactive demo (worker selects answer)
- [ ] Immediate feedback (correct/incorrect)
- [ ] Explanation for incorrect answers
- [ ] "Continue" button after each question
- [ ] Completion screen with "Start Earning" CTA
- [ ] Award points for completing tutorial (500 points)
- [ ] Auto-redirect to task dashboard after completion

**Estimated Effort:** 1.5 days

**Dependencies:** T2.3

**Files:**
- `app/(worker)/tutorial/page.tsx`
- `components/worker/TutorialQuestion.tsx`
- `components/worker/ProgressIndicator.tsx`
- `data/tutorial-questions.ts` (5 sample questions)

**Testing:**
- [ ] Complete all 5 questions
- [ ] Test correct and incorrect answer feedback
- [ ] Verify points awarded after completion
- [ ] Test progress persistence (if user refreshes mid-tutorial)

---

### Sprint 2 Deliverables

- [x] MiniPay wallet auto-connect working
- [x] Self Protocol verification integrated (with fallback)
- [x] Complete worker onboarding flow UI
- [x] Worker profile page functional
- [x] Training tutorial completed by test users

### Sprint 2 Definition of Done

- [ ] All tasks completed and tested
- [ ] E2E test for onboarding flow created
- [ ] Code deployed to staging
- [ ] 5 test workers onboarded successfully
- [ ] Sprint retrospective completed

---

## Sprint 3: Core Worker Flow (Part 2)

**Duration:** Weeks 5-6 (2026-02-24 to 2026-03-09)
**Goal:** Implement task types, task UI, timer, submission, and golden task QA
**Risk Level:** Medium (complex task logic and QA system)

### Sprint Objectives

- Build task dashboard with available tasks
- Implement sentiment analysis task type
- Implement text classification task type
- Add task timer with auto-submit
- Build task submission flow
- Implement golden task QA system

### Tasks

---

#### T3.1: Task Dashboard (Home)

**Description:** Build main worker dashboard showing available tasks and earnings.

**Acceptance Criteria:**
- [ ] Header with earnings balance and "Withdraw" button
- [ ] Available tasks section with task cards
- [ ] Each card shows: task type icon, estimated pay, time limit
- [ ] "Start Task" button on each card
- [ ] Empty state: "No tasks right now. Check back soon!"
- [ ] Pull-to-refresh on mobile
- [ ] Loading state with skeleton cards
- [ ] Real-time task updates (new tasks appear without refresh)

**Estimated Effort:** 2 days

**Dependencies:** Sprint 2 completed

**Files:**
- `app/(worker)/page.tsx`
- `components/worker/TaskCard.tsx`
- `components/worker/EarningsDisplay.tsx`
- `hooks/useTasks.ts`

**Testing:**
- [ ] Fetch available tasks from API
- [ ] Display task cards correctly
- [ ] Tap "Start Task" navigates to task screen
- [ ] Pull-to-refresh fetches new tasks
- [ ] Empty state shows when no tasks available

---

#### T3.2: Sentiment Analysis Task UI

**Description:** Build sentiment analysis task screen with text display and 3-option selector.

**Acceptance Criteria:**
- [ ] Display task content (max 500 chars, overflow scrollable)
- [ ] Three equal-width buttons: Positive, Negative, Neutral
- [ ] Selected state: filled background + checkmark
- [ ] Disabled state during submission (all buttons grayed)
- [ ] "Submit" button (disabled until option selected)
- [ ] "Skip" button returns task to queue
- [ ] Timer at top (see T3.4)
- [ ] Mobile-optimized (48px touch targets)
- [ ] Accessible (radio group with keyboard navigation)

**Estimated Effort:** 1.5 days

**Dependencies:** T3.1

**Files:**
- `app/(worker)/task/[id]/page.tsx`
- `components/worker/SentimentSelector.tsx`
- `components/worker/TaskContent.tsx`

**Testing:**
- [ ] Display task content correctly
- [ ] Select sentiment option
- [ ] Submit button enables after selection
- [ ] Skip button returns to dashboard
- [ ] Disabled state during submission

---

#### T3.3: Text Classification Task UI

**Description:** Build text classification task screen with dynamic category list.

**Acceptance Criteria:**
- [ ] Display task content (max 500 chars)
- [ ] Display up to 10 category buttons (from task.options)
- [ ] Buttons stack vertically on mobile
- [ ] Selected state: filled background + checkmark
- [ ] "Submit" button (disabled until option selected)
- [ ] "Skip" button returns task to queue
- [ ] Timer at top
- [ ] Same accessibility standards as sentiment

**Estimated Effort:** 1 day

**Dependencies:** T3.2

**Files:**
- `app/(worker)/task/[id]/page.tsx` (extend)
- `components/worker/ClassificationSelector.tsx`

**Testing:**
- [ ] Display categories from task.options
- [ ] Select category
- [ ] Submit button enables
- [ ] Handle up to 10 categories gracefully

---

#### T3.4: Task Timer Component

**Description:** Build countdown timer with visual states and auto-submit on expiry.

**Acceptance Criteria:**
- [ ] Circular progress indicator
- [ ] Display time remaining (e.g., "0:45")
- [ ] Update every second
- [ ] Warning state: yellow when <10 seconds
- [ ] Critical state: red when <5 seconds with pulse animation
- [ ] Expired state: shows "0:00", triggers timeout handler
- [ ] Auto-submit task on expiry (returns to queue, no penalty)
- [ ] Timer pauses if page goes to background (visibility API)

**Estimated Effort:** 1.5 days

**Dependencies:** T3.2

**Files:**
- `components/worker/TaskTimer.tsx`
- `hooks/useTaskTimer.ts`

**Testing:**
- [ ] Timer counts down correctly
- [ ] Warning state at <10s
- [ ] Critical state at <5s
- [ ] Auto-submit on expiry
- [ ] Timer pauses when tab inactive

---

#### T3.5: Task Submission API

**Description:** Build backend API to handle task submissions, validate responses, and queue for consensus.

**Acceptance Criteria:**
- [ ] POST /api/tasks/:id/submit endpoint
- [ ] Validate submission (task exists, worker assigned, not expired)
- [ ] If golden task: validate answer immediately, update worker accuracy
- [ ] If consensus task: add response to responses array (JSONB)
- [ ] Check if 3rd submission (trigger consensus calculation)
- [ ] Calculate consensus (2/3 majority)
- [ ] Update task status to "completed" if consensus reached
- [ ] Return payment info if consensus reached (payment handled in Sprint 4)
- [ ] Deduplication: prevent double submission (Redis key)

**Estimated Effort:** 2 days

**Dependencies:** T3.2, T3.3

**Files:**
- `app/api/tasks/[id]/submit/route.ts`
- `lib/services/consensus-engine.ts`
- `lib/services/golden-task-validator.ts`

**Testing:**
- [ ] Submit task (golden): correct answer → accuracy updated
- [ ] Submit task (golden): wrong answer → accuracy updated
- [ ] Submit task (consensus): 1st submission → status "submitted"
- [ ] Submit task (consensus): 3rd submission → consensus calculated
- [ ] Test 2/3 majority consensus
- [ ] Test deduplication (submit same task twice)

---

#### T3.6: Golden Task QA System

**Description:** Implement golden task injection, validation, and worker accuracy tracking.

**Acceptance Criteria:**
- [ ] 10% of tasks marked as is_golden_task = true
- [ ] Golden tasks have pre-labeled golden_answer
- [ ] Workers cannot distinguish golden from real tasks
- [ ] On submission: validate answer against golden_answer
- [ ] Update worker accuracy_rate in real-time
- [ ] Accuracy formula: (correct golden tasks) / (total golden tasks) * 100
- [ ] Workers with <70% accuracy get warning banner
- [ ] Workers with <60% accuracy blocked from tasks (show message)
- [ ] Admin script to seed golden tasks from CSV

**Estimated Effort:** 2 days

**Dependencies:** T3.5

**Files:**
- `lib/services/golden-task-validator.ts` (extend)
- `scripts/seed-golden-tasks.ts`
- `data/golden-tasks.csv` (50 pre-labeled tasks)

**Testing:**
- [ ] Seed 50 golden tasks
- [ ] Submit correct answer → accuracy increases
- [ ] Submit wrong answer → accuracy decreases
- [ ] Worker with <70% accuracy sees warning
- [ ] Worker with <60% accuracy cannot access tasks

---

### Sprint 3 Deliverables

- [x] Task dashboard with task cards
- [x] Sentiment analysis task UI functional
- [x] Text classification task UI functional
- [x] Task timer with auto-submit
- [x] Task submission API working
- [x] Golden task QA system operational

### Sprint 3 Definition of Done

- [ ] All tasks completed and tested
- [ ] E2E test for task completion flow created
- [ ] 100 golden tasks seeded
- [ ] Test workers complete 10 tasks each
- [ ] Code deployed to staging
- [ ] Sprint retrospective completed

---

## Sprint 4: Payment Infrastructure

**Duration:** Weeks 7-8 (2026-03-10 to 2026-03-23)
**Goal:** Integrate Celo blockchain, implement payment flow, consensus, earnings, and withdrawal
**Risk Level:** High (blockchain integration, smart contract deployment, AWS KMS setup)

### Sprint Objectives

- Deploy smart contract to Celo Mainnet
- Set up AWS KMS for secure key management
- Implement payment processor
- Build earnings tracking
- Create withdrawal flow
- Implement consensus mechanism
- Handle points program

### Tasks

---

#### T4.1: Smart Contract Deployment

**Description:** Deploy PaymentDispatcher smart contract to Celo Mainnet as defined in SDD Section 4.3.

**Acceptance Criteria:**
- [ ] Smart contract code reviewed (PaymentDispatcher.sol from SDD)
- [ ] OpenZeppelin dependencies installed
- [ ] Hardhat/Foundry project configured for Celo
- [ ] Deploy to Celo Alfajores testnet first
- [ ] Test payment on testnet (send cUSD to test worker)
- [ ] Third-party audit completed (or use audited OpenZeppelin libraries)
- [ ] Deploy to Celo Mainnet
- [ ] Fund contract with 1000 cUSD for initial payments
- [ ] Verify contract on CeloScan
- [ ] Multi-sig wallet (Gnosis Safe) set up as owner
- [ ] Backend key added as signer

**Estimated Effort:** 3 days

**Dependencies:** None (can start in parallel with Sprint 4)

**Files:**
- `contracts/PaymentDispatcher.sol`
- `scripts/deploy.ts`
- `hardhat.config.ts` or `foundry.toml`
- `deployed-addresses.json` (contract address)

**Testing:**
- [ ] Deploy to testnet
- [ ] Send test payment (0.05 cUSD)
- [ ] Verify transaction on CeloScan
- [ ] Test batch payment function
- [ ] Test emergency withdrawal

---

#### T4.2: AWS KMS Key Setup

**Description:** Create and configure AWS KMS key for secure smart contract signing.

**Acceptance Criteria:**
- [ ] AWS KMS key created (FIPS 140-2 Level 3 HSM)
- [ ] Key policy configured (principle of least privilege)
- [ ] Backend IAM role granted KMS:Sign permission
- [ ] Test signing transaction with KMS key
- [ ] Key rotation policy configured (quarterly)
- [ ] CloudTrail logging enabled for all key usage
- [ ] Multi-factor auth required for AWS console access
- [ ] Backup recovery procedure documented

**Estimated Effort:** 1 day

**Dependencies:** T4.1

**Testing:**
- [ ] Sign test transaction with KMS key
- [ ] Verify signature with public key
- [ ] Test key rotation
- [ ] Verify CloudTrail logs

---

#### T4.3: Payment Processor Service

**Description:** Build payment processor service to send cUSD payments via smart contract.

**Acceptance Criteria:**
- [ ] Payment processor service (`lib/services/payment-processor.ts`)
- [ ] Connect to Celo RPC via viem
- [ ] Load KMS private key securely
- [ ] `sendPayment(workerAddress, amount, taskId)` function
- [ ] Estimate gas before sending
- [ ] Handle transaction errors (retry with exponential backoff)
- [ ] Wait for transaction confirmation (<5s)
- [ ] Return transaction hash
- [ ] Log all payments to database (transactions table)
- [ ] Emit event to frontend via Supabase realtime

**Estimated Effort:** 2 days

**Dependencies:** T4.1, T4.2

**Files:**
- `lib/services/payment-processor.ts`
- `lib/blockchain.ts` (viem utilities)
- `app/api/payments/send/route.ts`

**Testing:**
- [ ] Send test payment (0.05 cUSD) to test worker
- [ ] Verify transaction on CeloScan
- [ ] Test payment failure handling (insufficient balance)
- [ ] Test gas estimation
- [ ] Verify transaction record in database

---

#### T4.4: Consensus Mechanism

**Description:** Implement consensus calculation and payment trigger after 3 submissions.

**Acceptance Criteria:**
- [ ] Consensus engine service (`lib/services/consensus-engine.ts`)
- [ ] `recordSubmission(taskId, workerId, answer)` function
- [ ] `checkConsensus(taskId)` calculates 2/3 majority
- [ ] Consensus reached: set task.final_label, task.consensus_reached = true
- [ ] Call payment processor for all workers with majority answer
- [ ] Workers with minority answer receive no payment
- [ ] Update worker earnings_pending → earnings_lifetime after payment
- [ ] Log consensus result to database

**Estimated Effort:** 2 days

**Dependencies:** T4.3, Sprint 3 (T3.5)

**Files:**
- `lib/services/consensus-engine.ts` (extend)
- `app/api/tasks/[id]/submit/route.ts` (extend)

**Testing:**
- [ ] 3 workers submit same answer → consensus reached, all paid
- [ ] 2 workers submit A, 1 submits B → consensus reached, 2 paid
- [ ] 1 worker submits each option → no consensus, no payment
- [ ] Verify payments sent to correct workers
- [ ] Verify transaction records created

---

#### T4.5: Earnings Tracking UI

**Description:** Build earnings screen showing balance, history, and transaction details.

**Acceptance Criteria:**
- [ ] Display current balance (available, pending)
- [ ] Display lifetime earnings
- [ ] "Withdraw" button (navigates to withdrawal screen)
- [ ] Transaction history list (scrollable, paginated)
- [ ] Each transaction shows: date, task type, amount, status
- [ ] Filter by type (task_payment, withdrawal, referral, streak)
- [ ] Daily/weekly earnings chart (optional: use recharts)
- [ ] Real-time balance updates (Supabase realtime subscription)

**Estimated Effort:** 2 days

**Dependencies:** T4.4

**Files:**
- `app/(worker)/earnings/page.tsx`
- `components/worker/EarningsChart.tsx`
- `components/worker/TransactionHistory.tsx`
- `hooks/useEarnings.ts`

**Testing:**
- [ ] Fetch earnings history from API
- [ ] Display balance correctly
- [ ] Real-time update when new payment received
- [ ] Transaction history pagination works
- [ ] Filter by transaction type

---

#### T4.6: Withdrawal Flow

**Description:** Build withdrawal screen and API to send earnings to worker's MiniPay wallet.

**Acceptance Criteria:**
- [ ] Withdrawal form with amount input
- [ ] "Max" button fills available balance
- [ ] Wallet address pre-filled (read-only)
- [ ] Fee display ($0.00 or actual gas fee)
- [ ] "Withdraw Now" button
- [ ] Validation: amount >= $0.01, amount <= available balance
- [ ] POST /api/earnings/withdraw endpoint
- [ ] Call payment processor to send cUSD
- [ ] Update worker balance in database
- [ ] Create transaction record (status: confirmed)
- [ ] Show success message: "Withdrawal sent! Check your MiniPay."
- [ ] Link to "Cash out to M-PESA" (external MiniPay feature)

**Estimated Effort:** 1.5 days

**Dependencies:** T4.5

**Files:**
- `app/(worker)/withdraw/page.tsx`
- `components/worker/WithdrawForm.tsx`
- `app/api/earnings/withdraw/route.ts`

**Testing:**
- [ ] Withdraw full balance (Max button)
- [ ] Withdraw partial amount
- [ ] Verify cUSD sent to wallet
- [ ] Verify balance updated in database
- [ ] Test insufficient balance error
- [ ] Test minimum withdrawal ($0.01)

---

#### T4.7: Points Program Backend

**Description:** Implement points earning, tracking, and redemption for cold start phase.

**Acceptance Criteria:**
- [ ] Award 100 points per training task completion
- [ ] Award points for tasks during cold start (before paying clients)
- [ ] `points_balance` column tracks current points
- [ ] Redemption pool funded by 20% of monthly revenue
- [ ] POST /api/earnings/redeem-points endpoint
- [ ] Redemption ratio: 100 points = $1.00 cUSD
- [ ] Max redemption limited by pool balance
- [ ] Points expire after 12 months (cronjob checks monthly)
- [ ] Display points balance on earnings screen
- [ ] Display redemption pool availability

**Estimated Effort:** 1.5 days

**Dependencies:** T4.6

**Files:**
- `app/api/earnings/redeem-points/route.ts`
- `lib/services/points-manager.ts`
- `scripts/expire-points-cronjob.ts` (Vercel cron)

**Testing:**
- [ ] Complete training → 500 points awarded
- [ ] Complete task during cold start → points awarded
- [ ] Redeem 1000 points → $10 cUSD sent
- [ ] Test redemption when pool empty (show error)
- [ ] Test points expiry (after 12 months)

---

### Sprint 4 Deliverables

- [x] Smart contract deployed to Celo Mainnet
- [x] AWS KMS key configured for signing
- [x] Payment processor sending cUSD payments
- [x] Consensus mechanism operational
- [x] Earnings tracking UI complete
- [x] Withdrawal flow working end-to-end
- [x] Points program functional

### Sprint 4 Definition of Done

- [ ] All tasks completed and tested
- [ ] E2E test for payment flow created
- [ ] Test workers receive payments after task completion
- [ ] Smart contract audited (or using audited OpenZeppelin code)
- [ ] Code deployed to staging
- [ ] Sprint retrospective completed

---

## Sprint 5: Client Dashboard

**Duration:** Weeks 9-10 (2026-03-24 to 2026-04-06)
**Goal:** Build client dashboard for project creation, CSV upload, and results download
**Risk Level:** Medium (file uploads, CSV parsing, background jobs)

### Sprint Objectives

- Implement client authentication
- Build client dashboard UI
- Create project creation flow
- Implement CSV upload and parsing
- Build results download
- Add project progress tracking

### Tasks

---

#### T5.1: Client Authentication

**Description:** Implement email/password authentication for clients via Supabase Auth.

**Acceptance Criteria:**
- [ ] Login page at /client/login
- [ ] Sign up page at /client/signup
- [ ] Email/password validation (Supabase Auth)
- [ ] Email verification required before access
- [ ] Forgot password flow
- [ ] JWT token stored in httpOnly cookie
- [ ] Session duration: 24 hours
- [ ] Middleware protects /client/* routes
- [ ] Redirect to /client/dashboard after login

**Estimated Effort:** 1.5 days

**Dependencies:** Sprint 1 (T1.4)

**Files:**
- `app/(client)/login/page.tsx`
- `app/(client)/signup/page.tsx`
- `app/api/auth/client/login/route.ts`
- `app/api/auth/client/signup/route.ts`
- `middleware.ts` (extend for client routes)

**Testing:**
- [ ] Sign up with email/password
- [ ] Receive verification email
- [ ] Verify email and log in
- [ ] Access protected client routes
- [ ] Test forgot password flow

---

#### T5.2: Client Dashboard UI

**Description:** Build main client dashboard showing projects, balance, and quick actions.

**Acceptance Criteria:**
- [ ] Sidebar navigation (Dashboard, Projects, Deposit, Settings)
- [ ] Header with user menu (Account, Log Out)
- [ ] Balance display with "Deposit" button
- [ ] Active projects list (cards with progress bars)
- [ ] Completed projects list (link to results)
- [ ] "Create Project" button (prominent CTA)
- [ ] Recent activity feed (last 10 events)
- [ ] Desktop-optimized (max-width 1280px centered)

**Estimated Effort:** 2 days

**Dependencies:** T5.1

**Files:**
- `app/(client)/dashboard/page.tsx`
- `components/client/Sidebar.tsx`
- `components/client/ProjectCard.tsx`
- `components/client/BalanceDisplay.tsx`

**Testing:**
- [ ] Fetch projects from API
- [ ] Display active and completed projects
- [ ] Navigate to project detail page
- [ ] Click "Create Project" navigates to form

---

#### T5.3: Project Creation Form

**Description:** Build project creation form with task type selection, instructions, and pricing.

**Acceptance Criteria:**
- [ ] Project name input (required)
- [ ] Description textarea (optional)
- [ ] Task type selector: Sentiment Analysis, Text Classification
- [ ] Instructions textarea with template (based on task type)
- [ ] Price per task input (with minimum validation: $0.05)
- [ ] Total cost calculator (shows estimated cost based on uploaded tasks)
- [ ] "Upload CSV" button (navigates to upload step)
- [ ] Form validation with error messages
- [ ] Save as draft (status: 'draft')

**Estimated Effort:** 2 days

**Dependencies:** T5.2

**Files:**
- `app/(client)/projects/new/page.tsx`
- `components/client/ProjectForm.tsx`
- `app/api/projects/route.ts` (POST)

**Testing:**
- [ ] Fill out form and save as draft
- [ ] Validate required fields
- [ ] Test minimum price validation
- [ ] Test total cost calculator

---

#### T5.4: CSV Upload & Parsing

**Description:** Implement CSV file upload, parsing, and task creation.

**Acceptance Criteria:**
- [ ] File upload zone (drag-and-drop or click)
- [ ] Accept only .csv files (max 10MB, 10,000 rows)
- [ ] Upload to Cloudflare R2 (bawo-production bucket)
- [ ] Parse CSV in background job (Vercel serverless function)
- [ ] Validate CSV structure (must have 'text' column)
- [ ] Create task records (one per row)
- [ ] Inject 10% golden tasks randomly
- [ ] Push tasks to Upstash Redis queue
- [ ] Show progress bar during upload/parsing
- [ ] Error handling: invalid CSV, empty file, too large

**Estimated Effort:** 3 days

**Dependencies:** T5.3

**Files:**
- `app/(client)/projects/[id]/upload/page.tsx`
- `components/client/FileUploader.tsx`
- `app/api/projects/[id]/upload/route.ts`
- `lib/services/csv-parser.ts`
- `lib/services/task-queue.ts`
- `lib/storage.ts` (R2 upload utilities)

**Testing:**
- [ ] Upload valid CSV (1000 rows)
- [ ] Verify tasks created in database
- [ ] Verify 10% golden tasks injected
- [ ] Verify tasks pushed to Redis queue
- [ ] Test invalid CSV (missing 'text' column)
- [ ] Test file too large (>10MB)

---

#### T5.5: Project Progress Tracking

**Description:** Build project detail page showing real-time progress and task breakdown.

**Acceptance Criteria:**
- [ ] Project detail page at /client/projects/:id
- [ ] Display project info (name, description, task type, instructions)
- [ ] Progress bar (% complete)
- [ ] Task breakdown: completed/in-progress/pending counts
- [ ] Quality metrics: accuracy rate, consensus rate
- [ ] "Download Results" button (enabled when 100% complete)
- [ ] "Pause/Resume" buttons to control task distribution
- [ ] Activity log (last 50 events: task completed, payment sent)
- [ ] Real-time updates (Supabase realtime subscription)

**Estimated Effort:** 2 days

**Dependencies:** T5.4

**Files:**
- `app/(client)/projects/[id]/page.tsx`
- `components/client/ProjectProgress.tsx`
- `components/client/QualityMetrics.tsx`
- `components/client/ActivityLog.tsx`

**Testing:**
- [ ] View project with 50% completion
- [ ] Real-time progress updates as tasks complete
- [ ] Quality metrics display correctly
- [ ] Pause project (tasks stop distributing)
- [ ] Resume project (tasks resume)

---

#### T5.6: Results Download

**Description:** Implement results export as CSV with original text, labels, and confidence scores.

**Acceptance Criteria:**
- [ ] GET /api/projects/:id/results endpoint
- [ ] Generate CSV with columns: text, label, confidence, consensus, worker_ids
- [ ] Include metadata JSON (annotation guidelines, stats)
- [ ] Upload results CSV to Cloudflare R2
- [ ] Return signed download URL (expires in 1 hour)
- [ ] "Download Results" button triggers download
- [ ] Show download progress
- [ ] Partial download option (if <100% complete)
- [ ] Email notification when results ready

**Estimated Effort:** 2 days

**Dependencies:** T5.5

**Files:**
- `app/api/projects/[id]/results/route.ts`
- `lib/services/results-exporter.ts`
- `components/client/ResultsDownload.tsx`

**Testing:**
- [ ] Complete project (100%)
- [ ] Click "Download Results"
- [ ] Verify CSV contains all labeled tasks
- [ ] Verify metadata JSON included
- [ ] Test partial download (50% complete)
- [ ] Verify email notification sent

---

#### T5.7: Client Balance & Deposit

**Description:** Build balance management and deposit flow for clients.

**Acceptance Criteria:**
- [ ] Balance display on dashboard (available, spent)
- [ ] Deposit page at /client/deposit
- [ ] Two deposit methods:
  - [ ] Crypto: Show deposit address (cUSD on Celo), QR code
  - [ ] Card: Link to MoonPay (external)
- [ ] Transaction history (deposits, project costs)
- [ ] Minimum balance warning when creating project
- [ ] Auto-refresh balance when deposit detected (webhook)

**Estimated Effort:** 1.5 days

**Dependencies:** T5.2

**Files:**
- `app/(client)/deposit/page.tsx`
- `components/client/DepositOptions.tsx`
- `app/api/payments/balance/route.ts`
- `app/api/webhooks/celo-deposit/route.ts`

**Testing:**
- [ ] Display current balance
- [ ] Generate deposit address
- [ ] Test deposit detection (webhook)
- [ ] Balance updates after deposit
- [ ] Link to MoonPay opens correctly

---

### Sprint 5 Deliverables

- [x] Client authentication working
- [x] Client dashboard UI complete
- [x] Project creation and CSV upload functional
- [x] Project progress tracking with real-time updates
- [x] Results download working
- [x] Client balance and deposit flow complete

### Sprint 5 Definition of Done

- [ ] All tasks completed and tested
- [ ] E2E test for project creation flow created
- [ ] Test client creates project with 100 tasks
- [ ] Verify results download contains correct data
- [ ] Code deployed to staging
- [ ] Sprint retrospective completed

---

## Sprint 6: Gamification & Polish

**Duration:** Weeks 11-12 (2026-04-07 to 2026-04-20)
**Goal:** Add gamification features (referrals, streaks, leaderboards, RLHF), offline support, and polish for launch
**Risk Level:** Medium (complex features, offline sync, RLHF UI)

### Sprint Objectives

- Implement referral program
- Add streak rewards
- Build leaderboards
- Add RLHF preference ranking task type
- Implement offline support (Service Worker + IndexedDB)
- Polish UI and performance
- Comprehensive testing
- Beta launch preparation

### Tasks

---

#### T6.1: Referral Program

**Description:** Implement two-sided referral bonuses with unique referral links.

**Acceptance Criteria:**
- [ ] Worker profile shows unique referral link
- [ ] "Refer Friends" button in menu
- [ ] Share referral link via WhatsApp deep link
- [ ] Track referee signup via referral code (URL param)
- [ ] Referee must complete 10 tasks to qualify
- [ ] Referrer receives $1.00 bonus
- [ ] Referee receives $0.50 bonus
- [ ] Bonuses paid via smart contract (same as task payments)
- [ ] Display referral status on profile ("Pending", "Paid")
- [ ] Referral history list (referees, status, bonus amount)

**Estimated Effort:** 2 days

**Dependencies:** Sprint 4 (T4.6)

**Files:**
- `app/(worker)/refer/page.tsx`
- `components/worker/ReferralLink.tsx`
- `app/api/workers/referrals/route.ts`
- `app/api/workers/claim-referral/route.ts`

**Testing:**
- [ ] Copy referral link
- [ ] Share via WhatsApp
- [ ] New worker signs up via referral link
- [ ] Referee completes 10 tasks
- [ ] Verify both bonuses paid

---

#### T6.2: Streak Rewards

**Description:** Implement daily streak tracking with 7-day and 30-day bonuses.

**Acceptance Criteria:**
- [ ] Track worker login streaks (consecutive days with >=1 task completed)
- [ ] Display current streak on dashboard
- [ ] Streak indicator in header (e.g., "🔥 5 days")
- [ ] 7-day streak: $0.50 bonus
- [ ] 30-day streak: $5.00 bonus
- [ ] Bonuses paid automatically via smart contract
- [ ] Streak resets if worker misses a day
- [ ] Push notification reminder (if worker installed PWA)
- [ ] Streak history page showing past streaks

**Estimated Effort:** 2 days

**Dependencies:** Sprint 4 (T4.6)

**Files:**
- `app/api/workers/streaks/route.ts`
- `lib/services/streak-manager.ts`
- `components/worker/StreakIndicator.tsx`
- `app/(worker)/streaks/page.tsx`
- `scripts/check-streaks-cronjob.ts` (Vercel cron, daily)

**Testing:**
- [ ] Complete task on Day 1 (streak: 1)
- [ ] Complete task on Day 2 (streak: 2)
- [ ] Skip Day 3 (streak resets to 0)
- [ ] Complete 7 days consecutively (receive $0.50 bonus)
- [ ] Complete 30 days consecutively (receive $5.00 bonus)

---

#### T6.3: Leaderboards

**Description:** Build weekly and monthly leaderboards for top earners and quality performers.

**Acceptance Criteria:**
- [ ] Leaderboard page at /worker/leaderboard
- [ ] Two tabs: Weekly Top Earners, Monthly Quality Champions
- [ ] Weekly Top Earners: Top 10 workers by earnings this week
- [ ] Monthly Quality Champions: Top 10 workers by accuracy this month
- [ ] Display worker rank, earnings/accuracy, tier badge
- [ ] Anonymized display (show wallet prefix: 0x742d...bEb)
- [ ] Current worker's rank highlighted
- [ ] Prize pool info (optional: top 3 get bonus)
- [ ] Real-time updates (Supabase realtime)

**Estimated Effort:** 2 days

**Dependencies:** Sprint 4 (T4.5)

**Files:**
- `app/(worker)/leaderboard/page.tsx`
- `components/worker/LeaderboardTable.tsx`
- `app/api/workers/leaderboard/route.ts`

**Testing:**
- [ ] Fetch weekly top earners
- [ ] Fetch monthly quality champions
- [ ] Verify worker rank displayed correctly
- [ ] Test real-time updates (new leader appears)

---

#### T6.4: RLHF Preference Ranking Task Type

**Description:** Add RLHF preference ranking task type for higher-value work ($20-40/hour).

**Acceptance Criteria:**
- [ ] New task type: "preference_ranking"
- [ ] Display prompt and two AI-generated responses (Response A, Response B)
- [ ] Worker selects which response is better
- [ ] Optional: Provide reason for choice (textarea)
- [ ] Pay amount: $0.50 per task (10x sentiment tasks)
- [ ] Only available to Gold/Expert tier workers (verification_level >= 2)
- [ ] Consensus mechanism: 3 workers, 2/3 majority
- [ ] Golden tasks: 10% injection with known correct answers

**Estimated Effort:** 3 days

**Dependencies:** Sprint 3 (T3.5), Sprint 4 (T4.4)

**Files:**
- `components/worker/PreferenceRankingSelector.tsx`
- `app/api/tasks/[id]/submit/route.ts` (extend for new type)
- `data/rlhf-golden-tasks.csv` (50 pre-labeled examples)

**Testing:**
- [ ] Display RLHF task with two responses
- [ ] Select Response A
- [ ] Submit with optional reason
- [ ] Verify payment ($0.50)
- [ ] Test consensus (3 workers)
- [ ] Test golden task validation

---

#### T6.5: Offline Support (Service Worker + IndexedDB)

**Description:** Implement offline task caching and submission queue for workers.

**Acceptance Criteria:**
- [ ] Service Worker installed via next-pwa
- [ ] Precache static assets (HTML, CSS, JS, images)
- [ ] Cache available tasks in IndexedDB (up to 50 tasks)
- [ ] Worker can view cached tasks offline
- [ ] Worker can complete tasks offline
- [ ] Submissions queued in IndexedDB (offline_queue table)
- [ ] Auto-sync when connection restored (navigator.onLine)
- [ ] Show "Saved offline, will submit when connected" message
- [ ] Deduplication: prevent double submission (submission ID)
- [ ] Conflict resolution: Client Wins (as per SDD 8.3)
- [ ] Target: 95%+ sync success rate

**Estimated Effort:** 3 days

**Dependencies:** Sprint 3 (T3.5)

**Files:**
- `next.config.js` (enable next-pwa)
- `public/sw.js` (Service Worker, generated by Workbox)
- `lib/offline-sync.ts`
- `hooks/useOfflineQueue.ts`
- `lib/idb.ts` (IndexedDB wrapper)

**Testing:**
- [ ] Enable offline mode (DevTools)
- [ ] View cached tasks offline
- [ ] Complete task offline
- [ ] Verify submission queued in IndexedDB
- [ ] Restore connection
- [ ] Verify submission synced to server
- [ ] Test deduplication (submit same task twice)

---

#### T6.6: Performance Optimization

**Description:** Optimize bundle size, page load time, and runtime performance to meet targets.

**Acceptance Criteria:**
- [ ] Bundle analysis with `@next/bundle-analyzer`
- [ ] Code splitting: dynamic imports for non-critical routes
- [ ] Image optimization: WebP format, lazy loading
- [ ] Total JS bundle <150kb gzipped
- [ ] Total CSS <30kb gzipped
- [ ] PWA install size <2MB
- [ ] Initial load <3s on 3G (Lighthouse test)
- [ ] Time to Interactive <5s
- [ ] Remove unused dependencies (analyze with `depcheck`)
- [ ] Tree shaking enabled (Next.js default)

**Estimated Effort:** 2 days

**Dependencies:** All previous tasks

**Testing:**
- [ ] Run Lighthouse audit (target: 90+ performance score)
- [ ] Test on slow 3G (Chrome DevTools throttling)
- [ ] Verify bundle size with analyzer
- [ ] Measure page load with WebPageTest
- [ ] Test on low-end Android device

---

#### T6.7: UI Polish & Accessibility

**Description:** Polish UI with animations, improved error states, and accessibility audit.

**Acceptance Criteria:**
- [ ] Loading states: skeleton screens (not spinners)
- [ ] Success animations: checkmark for task completion, confetti for bonuses
- [ ] Error states: friendly messages with retry buttons
- [ ] Empty states: illustrations with CTAs
- [ ] WCAG AA compliance audit (use axe DevTools)
- [ ] Color contrast ratio 4.5:1 minimum
- [ ] Keyboard navigation tested (tab order)
- [ ] Screen reader tested (NVDA or VoiceOver)
- [ ] Touch targets 48x48px minimum
- [ ] Focus indicators visible (2px solid ring)

**Estimated Effort:** 2 days

**Dependencies:** All previous tasks

**Testing:**
- [ ] Run axe DevTools audit (0 violations)
- [ ] Test keyboard navigation (tab through all elements)
- [ ] Test screen reader (announce all content)
- [ ] Test color contrast (use Contrast Checker)
- [ ] Test touch targets on mobile device

---

#### T6.8: Comprehensive Testing

**Description:** Write E2E tests, integration tests, and perform manual QA for beta launch.

**Acceptance Criteria:**
- [ ] E2E tests (Playwright) for critical flows:
  - [ ] Worker onboarding (signup → verify → tutorial → task)
  - [ ] Task completion (start → complete → payment)
  - [ ] Withdrawal (earnings → withdraw → wallet)
  - [ ] Client project (create → upload → download results)
- [ ] Integration tests for API routes (Vitest)
- [ ] Manual QA checklist (50 scenarios)
- [ ] Test on real devices (Android, iOS)
- [ ] Test in MiniPay browser (Kenyan SIM required)
- [ ] Test with 10 beta workers (user acceptance testing)

**Estimated Effort:** 3 days

**Dependencies:** All previous tasks

**Files:**
- `tests/e2e/worker-onboarding.spec.ts`
- `tests/e2e/task-completion.spec.ts`
- `tests/e2e/withdrawal.spec.ts`
- `tests/e2e/client-project.spec.ts`
- `tests/integration/api/**/*.test.ts`

**Testing:**
- [ ] All E2E tests pass in CI
- [ ] All integration tests pass
- [ ] Manual QA checklist completed
- [ ] Beta workers complete onboarding successfully
- [ ] 0 critical bugs remaining

---

#### T6.9: Beta Launch Preparation

**Description:** Prepare for beta launch with monitoring, documentation, and marketing materials.

**Acceptance Criteria:**
- [ ] PostHog analytics configured (track key events)
- [ ] Axiom log aggregation set up
- [ ] BetterStack uptime monitoring active
- [ ] Sentry error tracking enabled
- [ ] Documentation updated (README.md, API docs)
- [ ] Landing page with "Join Beta" CTA
- [ ] WhatsApp group created for Kenyan beta workers
- [ ] Pilot client onboarding email template
- [ ] $200 credit for pilot client
- [ ] 50 beta workers recruited via WhatsApp
- [ ] Launch announcement (Twitter, ProductHunt)

**Estimated Effort:** 2 days

**Dependencies:** T6.8

**Testing:**
- [ ] Verify analytics tracking (PostHog)
- [ ] Verify logs collected (Axiom)
- [ ] Verify uptime alerts (BetterStack)
- [ ] Verify error tracking (Sentry)
- [ ] Test landing page on mobile
- [ ] Send test onboarding email

---

### Sprint 6 Deliverables

- [x] Referral program functional
- [x] Streak rewards operational
- [x] Leaderboards live
- [x] RLHF preference ranking tasks available
- [x] Offline support working (95%+ sync success)
- [x] Performance optimized (<3s load on 3G)
- [x] UI polished and accessible (WCAG AA)
- [x] Comprehensive testing completed (E2E + integration)
- [x] Beta launch ready (monitoring, docs, marketing)

### Sprint 6 Definition of Done

- [ ] All 16 MVP features completed and tested
- [ ] All E2E tests passing in CI
- [ ] 50 beta workers onboarded
- [ ] 1 pilot client project launched
- [ ] Code deployed to production
- [ ] Sprint retrospective completed
- [ ] **Beta launch announcement published**

---

## Testing Strategy

### Unit Tests

**Tool:** Vitest
**Coverage Target:** 80%

**Scope:**
- Utility functions (`lib/` directory)
- Service classes (consensus-engine, payment-processor, etc.)
- React hooks (useWallet, useTasks, useEarnings)

**Example:**
```typescript
// lib/consensus-engine.test.ts
describe('ConsensusEngine', () => {
  it('reaches consensus with 2/3 majority', async () => {
    // See SDD Section 11.3 for full test
  })
})
```

### Integration Tests

**Tool:** Vitest + Test Database
**Coverage Target:** All API routes

**Scope:**
- API routes (`app/api/**/route.ts`)
- Database operations (create, read, update)
- External API integrations (mocked)

**Example:**
```typescript
// app/api/tasks/submit/route.test.ts
describe('POST /api/tasks/:id/submit', () => {
  it('submits task and returns consensus status', async () => {
    // See SDD Section 11.3 for full test
  })
})
```

### E2E Tests

**Tool:** Playwright
**Coverage Target:** 5 critical flows

**Scope:**
1. Worker onboarding (signup → verify → tutorial → task)
2. Task completion (start → complete → payment)
3. Withdrawal (earnings → withdraw → wallet)
4. Client project (create → upload → download results)
5. Offline sync (task completion offline → sync when online)

**Example:**
```typescript
// tests/e2e/worker-task-flow.spec.ts
test('worker completes sentiment task and receives payment', async ({ page }) => {
  // See SDD Section 11.3 for full test
})
```

### Manual QA

**Checklist:** 50 scenarios across all features

**Priority:**
- Test on real MiniPay browser (Kenyan SIM required)
- Test on low-end Android device ($50 phone)
- Test on slow 3G connection
- Test all error states
- Test all edge cases (e.g., consensus tie, golden task failure)

---

## Risk Management

### High-Priority Risks

| Risk | Sprint | Mitigation | Owner |
|------|--------|------------|-------|
| **Self Protocol Integration Fails** | Sprint 2 | Built-in fallback to phone verification (Level 1). Test early with Self team. Accept Level 1 limitations. | Backend |
| **Smart Contract Vulnerability** | Sprint 4 | Use audited OpenZeppelin libraries. Third-party audit before mainnet. Multi-sig owner. Emergency pause. | Security |
| **AWS KMS Key Compromise** | Sprint 4 | HSM-backed keys. Rotate quarterly. Monitor via CloudTrail. MFA for AWS console. | Security |
| **Payment Confirmation Delays** | Sprint 4 | Monitor Celo network status. Queue payments during downtime. Auto-retry with backoff. | Backend |
| **Offline Sync Failures** | Sprint 6 | Client-wins strategy. Aggressive retry logic. Target 95%+ success. Monitor in production. | Frontend |
| **Bundle Size Exceeds 2MB** | Sprint 6 | Code splitting. Dynamic imports. Tree shaking. Monitor in CI. Use bundle analyzer. | Frontend |

### Medium-Priority Risks

| Risk | Sprint | Mitigation |
|------|--------|------------|
| **Database Connection Pool Exhaustion** | Sprint 4 | Supabase pgBouncer handles 10K+ connections. Monitor pool usage. Connection limits in client. |
| **CSV Upload Failures** | Sprint 5 | Retry logic. Temp storage in /tmp. Alert on repeated failures. |
| **Worker Churn (Trust Issues)** | Sprint 6 | Instant payment demo. Transparent pricing. WhatsApp community. Points program rewards early workers. |
| **RLHF Task Quality Issues** | Sprint 6 | Restrict to Gold/Expert tier. Golden tasks for validation. Consensus mechanism. |

---

## Success Metrics

### MVP Launch Criteria (Week 12)

- [ ] **Technical:**
  - [ ] All 16 features complete and tested
  - [ ] All E2E tests passing
  - [ ] <3s page load on 3G
  - [ ] <5s payment confirmation
  - [ ] 95%+ offline sync success
  - [ ] 0 critical bugs
  - [ ] 99.5%+ uptime (measured via BetterStack)

- [ ] **User:**
  - [ ] 50 beta workers onboarded
  - [ ] 10+ workers complete 10+ tasks each
  - [ ] 1 pilot client project completed (100+ tasks)
  - [ ] $3-6/hour median worker earnings
  - [ ] 90%+ task accuracy (golden tasks)

- [ ] **Business:**
  - [ ] Smart contract deployed to Celo Mainnet
  - [ ] $1K in cUSD funded for worker payments
  - [ ] $200 pilot client credit issued
  - [ ] Landing page live
  - [ ] WhatsApp group active (50+ members)

### 30-Day Post-Launch Metrics

- [ ] 500 verified workers (G-1 from PRD)
- [ ] 40%+ weekly retention
- [ ] 1 paying client (non-pilot)
- [ ] $1K MRR
- [ ] 90%+ golden task accuracy maintained

---

## Appendix A: Sprint Ledger Integration

This sprint plan will be registered in the Sprint Ledger (`grimoires/loa/ledger.json`) with global sprint numbers:

```json
{
  "current_cycle": "cycle-001",
  "cycles": [
    {
      "id": "cycle-001",
      "label": "MVP Development - Bawo",
      "sprints": [
        { "local_id": "sprint-1", "global_id": 1, "label": "Foundation & Setup" },
        { "local_id": "sprint-2", "global_id": 2, "label": "Core Worker Flow (Part 1)" },
        { "local_id": "sprint-3", "global_id": 3, "label": "Core Worker Flow (Part 2)" },
        { "local_id": "sprint-4", "global_id": 4, "label": "Payment Infrastructure" },
        { "local_id": "sprint-5", "global_id": 5, "label": "Client Dashboard" },
        { "local_id": "sprint-6", "global_id": 6, "label": "Gamification & Polish" }
      ]
    }
  ]
}
```

---

## Appendix B: Task Summary

| Sprint | Tasks | Total Effort (Days) |
|--------|-------|---------------------|
| Sprint 1 | 6 tasks | 7.5 days |
| Sprint 2 | 5 tasks | 8.0 days |
| Sprint 3 | 6 tasks | 11.0 days |
| Sprint 4 | 7 tasks | 14.5 days |
| Sprint 5 | 7 tasks | 14.5 days |
| Sprint 6 | 9 tasks | 19.0 days |
| **Total** | **40 tasks** | **74.5 days** |

**Note:** Solo developer working ~6 days/week = 12.4 weeks estimated, aligns with 12-week timeline.

---

## Appendix C: Feature Expansion Summary

| Feature | Original MVP | Expanded MVP | Effort Added |
|---------|--------------|--------------|--------------|
| Referral Program | ❌ Post-MVP | ✅ MVP | +2 days |
| Streak Rewards | ❌ Post-MVP | ✅ MVP | +2 days |
| Leaderboards | ❌ Post-MVP | ✅ MVP | +2 days |
| RLHF Preference Ranking | ❌ Post-MVP | ✅ MVP | +3 days |
| **Total Added** | — | — | **+9 days (~2 weeks)** |

**Adjusted Timeline:**
- Original: 10 weeks (12 features)
- Expanded: 12 weeks (16 features)

---

**End of Sprint Plan**

**Next Step:** Run `/implement sprint-1` to begin Sprint 1 implementation with Claude Code/Codex.
