# Software Design Document: Bawo

**Version:** 1.0.0
**Status:** Draft
**Date:** 2026-01-27
**Author:** Claude (Loa Framework - Architect Agent)
**Based on:** PRD v1.0.0

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Component Design](#component-design)
5. [Data Architecture](#data-architecture)
6. [API Design](#api-design)
7. [Security Architecture](#security-architecture)
8. [Integration Points](#integration-points)
9. [Scalability & Performance](#scalability--performance)
10. [Deployment Architecture](#deployment-architecture)
11. [Development Workflow](#development-workflow)
12. [Technical Risks & Mitigation](#technical-risks--mitigation)
13. [Future Considerations](#future-considerations)

---

## 1. Executive Summary

### Purpose

This Software Design Document defines the technical architecture for Bawo, a crypto-powered AI data labeling platform that enables instant stablecoin micropayments to African workers via MiniPay and Celo blockchain.

### System Overview

Bawo consists of three primary applications:

1. **Worker PWA** (Mobile-first): Progressive Web App for MiniPay users to complete tasks and receive instant payments
2. **Client Dashboard** (Web): Admin portal for AI companies to create projects and download results
3. **Backend API** (Serverless): Next.js API routes + Supabase for business logic, task orchestration, and payments

### Key Technical Requirements

| Requirement | Target | Strategy |
|-------------|--------|----------|
| Payment Speed | <5s from task completion to wallet credit | Direct smart contract transfers, no escrow delay |
| Page Load (3G) | <3s initial load | Code splitting, <150kb JS bundle, aggressive caching |
| Offline Support | 95%+ sync success | Service Workers + IndexedDB + client-wins conflict resolution |
| Task Throughput | 10,000 tasks/day by Month 6 | Upstash Redis queue, horizontal scaling |
| Worker Capacity | 3,000 concurrent workers | Supabase connection pooling, realtime subscriptions |
| Bundle Size | <2MB PWA | Tree shaking, dynamic imports, WebP images |

### Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Payment Architecture | Direct Transfers via AWS KMS | <5s requirement, zero gas for workers |
| Task Queue | Upstash Redis | High throughput, serverless, auto-scaling |
| Offline Sync | Client Wins | Never lose worker's work, builds trust |
| Frontend Framework | Next.js 14 (App Router) | SSR for SEO, PWA support, API routes |
| Database | Supabase (PostgreSQL) | Auth + DB + Realtime in one, RLS for security |
| Blockchain | Celo L2 via viem | Low fees ($0.0002), fast finality (<5s) |
| Identity | Self Protocol (with fallback) | ZK proofs, portable reputation, Sybil resistance |

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         WORKER PWA (Mobile)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  MiniPay     │  │  Task UI     │  │  Earnings    │          │
│  │  Integration │  │  Components  │  │  Dashboard   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
│                   ┌────────▼────────┐                           │
│                   │  Service Worker │                           │
│                   │  + IndexedDB    │                           │
│                   └────────┬────────┘                           │
└────────────────────────────┼──────────────────────────────────┘
                             │
                             │ HTTPS / WebSocket
                             │
┌────────────────────────────▼──────────────────────────────────┐
│                      NEXT.JS BACKEND (Vercel)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  API Routes  │  │  Middleware  │  │  Background  │        │
│  │  /api/*      │  │  Auth/CORS   │  │  Jobs        │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│         │                  │                  │                │
│         └──────────────────┴──────────────────┘                │
└────────────────────────────┬──────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
┌─────────▼─────────┐ ┌─────▼──────┐ ┌────────▼─────────┐
│   SUPABASE        │ │  UPSTASH   │ │  CELO BLOCKCHAIN │
│   (PostgreSQL)    │ │  REDIS     │ │  (Smart Contract)│
│                   │ │            │ │                  │
│  - Workers        │ │  - Task    │ │  - cUSD Payments │
│  - Projects       │ │    Queue   │ │  - Wallet State  │
│  - Tasks          │ │  - Session │ │                  │
│  - Transactions   │ │    Cache   │ │                  │
└───────────────────┘ └────────────┘ └──────────────────┘
          │
┌─────────▼─────────┐
│   CLOUDFLARE R2   │
│   (Object Store)  │
│                   │
│  - CSV Files      │
│  - Task Data      │
│  - Results Export │
└───────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT DASHBOARD (Web)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Project     │  │  Results     │  │  Billing     │          │
│  │  Management  │  │  Download    │  │  Dashboard   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     EXTERNAL INTEGRATIONS                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Self        │  │  MiniPay     │  │  PostHog     │          │
│  │  Protocol    │  │  Wallet API  │  │  Analytics   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow Diagrams

#### Worker Task Completion Flow

```
┌──────────┐
│ Worker   │
│ Opens    │
│ Task     │
└─────┬────┘
      │
      ▼
┌─────────────────┐
│ Check IndexedDB │  ← Offline-first
│ for cached task │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Display Task    │
│ Start Timer     │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Worker Selects  │
│ Answer          │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Submit to API   │  ← POST /api/tasks/:id/submit
│ (or queue if    │
│  offline)       │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ API validates   │
│ submission      │
└─────┬───────────┘
      │
      ├─────────── Golden Task? ──────┐
      │                               │
      ▼ YES                           ▼ NO
┌─────────────────┐           ┌──────────────────┐
│ Validate answer │           │ Add to consensus │
│ immediately     │           │ pool (2/3 votes) │
└─────┬───────────┘           └─────┬────────────┘
      │                             │
      ▼                             ▼
┌─────────────────┐           ┌──────────────────┐
│ Update worker   │           │ Check if 3rd     │
│ accuracy stats  │           │ submission       │
└─────┬───────────┘           └─────┬────────────┘
      │                             │
      ▼                             ▼
┌─────────────────┐           ┌──────────────────┐
│ Calculate       │◄──────────│ Calculate        │
│ payment amount  │           │ consensus        │
└─────┬───────────┘           └──────────────────┘
      │
      ▼
┌─────────────────┐
│ Call Celo smart │
│ contract via    │
│ backend wallet  │
│ (AWS KMS key)   │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Wait for tx     │  ← <5s finality
│ confirmation    │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Update Supabase │
│ transaction     │
│ record          │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Push realtime   │
│ update to       │
│ worker client   │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Worker sees     │
│ "Earned $0.05!" │
│ notification    │
└─────────────────┘
```

#### Client Project Creation Flow

```
┌──────────┐
│ Client   │
│ Uploads  │
│ CSV File │
└─────┬────┘
      │
      ▼
┌─────────────────┐
│ Upload to       │  ← POST /api/projects/:id/upload
│ Cloudflare R2   │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Parse CSV       │  ← Background job
│ Validate rows   │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Create Project  │
│ record in       │
│ Supabase        │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Generate Task   │  ← One row = one task
│ records (bulk)  │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Inject 10%      │  ← Golden tasks for QA
│ golden tasks    │
│ with known      │
│ answers         │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Push tasks to   │
│ Upstash Redis   │
│ queue           │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Workers pull    │  ← GET /api/tasks/available
│ from queue      │
└─────────────────┘
```

### 2.3 Component Interactions

#### Worker PWA ↔ Backend

```
Worker PWA                    Backend API                   Supabase
    │                             │                            │
    ├─ GET /api/tasks/available ──►                           │
    │                             ├─ Query available tasks ──►│
    │                             │◄─ Return tasks ───────────┤
    │◄─ Return task list ─────────┤                           │
    │                             │                            │
    ├─ POST /api/tasks/123/start ►                            │
    │                             ├─ Mark as assigned ───────►│
    │◄─ OK ───────────────────────┤                           │
    │                             │                            │
    ├─ POST /api/tasks/123/submit►                            │
    │                             ├─ Validate submission ────►│
    │                             ├─ Check consensus ─────────►│
    │                             │◄─ Consensus reached ──────┤
    │                             │                            │
    │                             ├─ Call Celo contract ───────► (Blockchain)
    │                             │◄─ TX confirmed ────────────┘
    │                             │                            │
    │                             ├─ Update transaction ──────►│
    │◄─ Payment sent ─────────────┤                           │
    │                             │                            │
    │◄─ Realtime update ──────────┼◄─ Postgres NOTIFY ────────┤
```

---

## 3. Technology Stack

### 3.1 Frontend (Worker PWA)

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| Next.js | 14.x | React framework with PWA support | App Router for SSR, built-in API routes, excellent PWA support via next-pwa |
| React | 18.x | UI library | Industry standard, huge ecosystem, concurrent features |
| TypeScript | 5.x | Type safety | Catch bugs at compile time, better DX, self-documenting |
| Tailwind CSS | 3.x | Utility-first CSS | Fast development, <30kb gzipped, no naming conflicts |
| shadcn/ui | latest | Component library | Accessible, customizable, copy-paste (no package bloat) |
| Zustand | 4.x | State management | Lightweight (1kb), simpler than Redux, perfect for PWA |
| viem | 2.x | Ethereum/Celo client | TypeScript-first, tree-shakeable, smaller than ethers.js |
| @tanstack/react-query | 5.x | Server state | Caching, auto-refetch, optimistic updates, offline support |
| Workbox | 7.x | Service Worker | Google's PWA toolkit, offline caching strategies |
| idb | 8.x | IndexedDB wrapper | Promise-based, simple API for offline storage |

**Bundle Size Budget:**
- **JS (gzipped):** <150kb initial, <50kb per route
- **CSS (gzipped):** <30kb
- **Total PWA:** <2MB (MiniPay constraint)

### 3.2 Frontend (Client Dashboard)

Same stack as Worker PWA, optimized for desktop:
- No Service Worker/offline support needed
- Larger bundle acceptable (no 2MB constraint)
- Additional libraries: `recharts` (data viz), `react-dropzone` (CSV upload)

### 3.3 Backend

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| Next.js API Routes | 14.x | REST API | Co-located with frontend, serverless-ready, Edge Runtime support |
| Supabase | latest | Database + Auth + Realtime | PostgreSQL with built-in auth, RLS, and realtime subscriptions |
| Upstash Redis | latest | Task queue + session cache | Serverless Redis, pay-per-request, auto-scaling |
| Cloudflare R2 | latest | Object storage | S3-compatible, no egress fees, fast global CDN |
| AWS KMS | latest | Key management | Secure smart contract key storage, HSM-backed |
| Vercel Cron Jobs | latest | Scheduled tasks | Native to Vercel, simple config in vercel.json |

### 3.4 Blockchain

| Technology | Version | Purpose | Justification |
|------------|---------|---------|---------------|
| Celo L2 | Mainnet | Payment blockchain | Low fees ($0.0002), fast finality (<5s), mobile-first |
| viem | 2.x | Blockchain client | TypeScript-first, smaller than web3.js/ethers.js |
| Solidity | 0.8.x | Smart contract language | Industry standard for EVM contracts |

**Smart Contract:**
```solidity
// PaymentDispatcher.sol - Simple direct transfer contract
contract PaymentDispatcher {
    address public owner;
    IERC20 public cUSD;

    event PaymentSent(address indexed worker, uint256 amount, string taskId);

    function payWorker(address worker, uint256 amount, string memory taskId)
        external
        onlyOwner
    {
        require(cUSD.transfer(worker, amount), "Transfer failed");
        emit PaymentSent(worker, amount, taskId);
    }
}
```

### 3.5 External Services

| Service | Purpose | Why This Choice |
|---------|---------|-----------------|
| Self Protocol | ZK identity verification | Portable reputation, Sybil resistance, no PII storage |
| MiniPay | Wallet integration | 11M users, zero onboarding friction, target distribution |
| PostHog | Product analytics | Open source alternative to Mixpanel, event tracking |
| Axiom | Log aggregation | Serverless-native, fast search, affordable |
| BetterStack | Uptime monitoring | Simple, reliable, Slack alerts |
| Resend | Transactional email | Modern API, great DX, affordable |

### 3.6 Development Tools

| Tool | Purpose |
|------|---------|
| pnpm | Package manager (faster than npm, saves disk space) |
| Vitest | Unit testing (faster than Jest, Vite-powered) |
| Playwright | E2E testing (cross-browser, reliable) |
| ESLint + Prettier | Code formatting and linting |
| Husky | Git hooks (pre-commit linting) |
| Changesets | Version management and changelogs |

---

## 4. Component Design

### 4.1 Frontend Components (Worker PWA)

#### Core Components

```
src/
├── app/                          # Next.js App Router
│   ├── (worker)/                 # Worker routes (grouped)
│   │   ├── page.tsx              # Dashboard (/)
│   │   ├── task/[id]/page.tsx    # Active task
│   │   ├── earnings/page.tsx     # Earnings history
│   │   ├── withdraw/page.tsx     # Withdrawal form
│   │   └── profile/page.tsx      # Worker profile
│   ├── (client)/                 # Client routes (grouped)
│   │   ├── login/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── projects/
│   │   │   ├── page.tsx          # Project list
│   │   │   ├── new/page.tsx      # Create project
│   │   │   └── [id]/page.tsx     # Project detail
│   │   └── settings/page.tsx
│   ├── api/                      # API routes
│   │   ├── workers/
│   │   ├── tasks/
│   │   ├── earnings/
│   │   └── projects/
│   ├── layout.tsx                # Root layout
│   └── providers.tsx             # React Query, Zustand providers
├── components/
│   ├── worker/
│   │   ├── TaskCard.tsx          # Display available task
│   │   ├── SentimentSelector.tsx # Sentiment selection UI
│   │   ├── TaskTimer.tsx         # Countdown timer
│   │   ├── EarningsDisplay.tsx   # Balance display
│   │   └── WithdrawForm.tsx      # Withdrawal flow
│   ├── client/
│   │   ├── ProjectForm.tsx       # Create/edit project
│   │   ├── FileUploader.tsx      # CSV upload
│   │   └── ResultsDownload.tsx   # Download button with progress
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ...
├── lib/
│   ├── supabase.ts               # Supabase client
│   ├── blockchain.ts             # Celo/viem utilities
│   ├── offline-sync.ts           # IndexedDB queue manager
│   └── self-protocol.ts          # Self Protocol SDK wrapper
├── hooks/
│   ├── useWallet.ts              # MiniPay wallet hook
│   ├── useTasks.ts               # Task fetching/submission
│   ├── useEarnings.ts            # Earnings queries
│   └── useOfflineQueue.ts        # Offline submission queue
└── store/
    ├── worker-store.ts           # Zustand store for worker state
    └── client-store.ts           # Zustand store for client state
```

#### Component Specifications

**TaskCard Component**
```typescript
// components/worker/TaskCard.tsx
interface TaskCardProps {
  task: {
    id: string
    type: 'sentiment' | 'classification'
    payAmount: number
    timeLimit: number
    estimatedTime?: number
  }
  onStart: (taskId: string) => void
}

export function TaskCard({ task, onStart }: TaskCardProps) {
  // Visual states: default, hover, loading
  // Touch target: 48x48px minimum
  // Shows: task type icon, pay amount ($0.05), time estimate
  // Action: onStart(task.id) on tap
}
```

**SentimentSelector Component**
```typescript
// components/worker/SentimentSelector.tsx
interface SentimentSelectorProps {
  value?: 'positive' | 'negative' | 'neutral'
  onChange: (sentiment: string) => void
  disabled?: boolean
}

export function SentimentSelector({ value, onChange, disabled }: SentimentSelectorProps) {
  // Three equal-width buttons in row
  // Selected state: filled background + checkmark
  // Disabled state: all buttons grayed during submission
  // Accessible: radio group with keyboard navigation
}
```

**WithdrawForm Component**
```typescript
// components/worker/WithdrawForm.tsx
interface WithdrawFormProps {
  balance: number
  walletAddress: string
  onSubmit: (amount: number) => Promise<void>
}

export function WithdrawForm({ balance, walletAddress, onSubmit }: WithdrawFormProps) {
  // Amount input with "Max" button
  // Validation: min $0.01, max = balance - fees
  // Shows: estimated fee ($0.00), arrival time (<5s)
  // Error handling: insufficient balance, network errors
}
```

### 4.2 Backend Components

#### API Route Structure

```
src/app/api/
├── workers/
│   ├── verify/route.ts           # POST - Start Self Protocol verification
│   ├── profile/route.ts          # GET/PUT - Worker profile
│   └── stats/route.ts            # GET - Worker statistics
├── tasks/
│   ├── available/route.ts        # GET - List available tasks for worker
│   ├── [id]/
│   │   ├── start/route.ts        # POST - Claim task
│   │   ├── submit/route.ts       # POST - Submit answer
│   │   └── skip/route.ts         # POST - Return to queue
├── earnings/
│   ├── route.ts                  # GET - Earnings history
│   ├── balance/route.ts          # GET - Current balance
│   └── withdraw/route.ts         # POST - Initiate withdrawal
├── projects/
│   ├── route.ts                  # GET/POST - List/create projects
│   ├── [id]/
│   │   ├── route.ts              # GET/PUT - Project detail/update
│   │   ├── upload/route.ts       # POST - Upload CSV
│   │   └── results/route.ts      # GET - Download results
└── payments/
    ├── balance/route.ts          # GET - Client balance
    ├── deposit/route.ts          # POST - Generate deposit address
    └── history/route.ts          # GET - Payment history
```

#### Core Backend Services

```typescript
// lib/services/task-queue.ts
export class TaskQueue {
  private redis: Redis

  async enqueueTask(task: Task): Promise<void>
  async dequeueTask(workerId: string): Promise<Task | null>
  async returnTaskToQueue(taskId: string): Promise<void>
  async getQueueDepth(): Promise<number>
}

// lib/services/payment-processor.ts
export class PaymentProcessor {
  private wallet: PrivateKeyAccount  // From AWS KMS
  private contract: Contract

  async sendPayment(workerId: string, amount: number, taskId: string): Promise<string>
  async getTransactionStatus(txHash: string): Promise<TransactionStatus>
  async estimateGas(workerId: string, amount: number): Promise<bigint>
}

// lib/services/consensus-engine.ts
export class ConsensusEngine {
  async recordSubmission(taskId: string, workerId: string, answer: string): Promise<void>
  async checkConsensus(taskId: string): Promise<ConsensusResult | null>
  async finalizeTask(taskId: string, consensusAnswer: string): Promise<void>
}

// lib/services/golden-task-validator.ts
export class GoldenTaskValidator {
  async validateSubmission(taskId: string, answer: string): Promise<boolean>
  async updateWorkerAccuracy(workerId: string, correct: boolean): Promise<void>
  async getWorkerAccuracy(workerId: string): Promise<number>
}
```

### 4.3 Smart Contract Design

```solidity
// contracts/PaymentDispatcher.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract PaymentDispatcher is Ownable, ReentrancyGuard {
    IERC20 public immutable cUSD;

    event PaymentSent(
        address indexed worker,
        uint256 amount,
        string taskId,
        uint256 timestamp
    );

    event FundsDeposited(
        address indexed depositor,
        uint256 amount
    );

    constructor(address _cUSD) {
        cUSD = IERC20(_cUSD);
    }

    /// @notice Pay a worker for completed task
    /// @param worker Worker's wallet address
    /// @param amount Payment amount in cUSD (18 decimals)
    /// @param taskId Task identifier for tracking
    function payWorker(
        address worker,
        uint256 amount,
        string memory taskId
    ) external onlyOwner nonReentrant {
        require(worker != address(0), "Invalid worker address");
        require(amount > 0, "Amount must be > 0");
        require(cUSD.balanceOf(address(this)) >= amount, "Insufficient contract balance");

        require(cUSD.transfer(worker, amount), "Transfer failed");

        emit PaymentSent(worker, amount, taskId, block.timestamp);
    }

    /// @notice Batch payment to multiple workers (gas optimization)
    function payWorkersBatch(
        address[] memory workers,
        uint256[] memory amounts,
        string[] memory taskIds
    ) external onlyOwner nonReentrant {
        require(
            workers.length == amounts.length && amounts.length == taskIds.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < workers.length; i++) {
            require(workers[i] != address(0), "Invalid worker address");
            require(amounts[i] > 0, "Amount must be > 0");
            require(cUSD.transfer(workers[i], amounts[i]), "Transfer failed");
            emit PaymentSent(workers[i], amounts[i], taskIds[i], block.timestamp);
        }
    }

    /// @notice Deposit cUSD to contract for future payments
    function deposit(uint256 amount) external {
        require(cUSD.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        emit FundsDeposited(msg.sender, amount);
    }

    /// @notice Get contract's cUSD balance
    function getBalance() external view returns (uint256) {
        return cUSD.balanceOf(address(this));
    }

    /// @notice Emergency withdrawal (only owner)
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = cUSD.balanceOf(address(this));
        require(balance > 0, "No balance");
        require(cUSD.transfer(owner(), balance), "Transfer failed");
    }
}
```

**Contract Deployment:**
- **Network:** Celo Mainnet
- **cUSD Token Address:** `0x765DE816845861e75A25fCA122bb6898B8B1282a`
- **Owner:** Multi-sig wallet (Gnosis Safe) with 2/3 threshold
- **Backend Key:** AWS KMS-managed key added as owner

---

## 5. Data Architecture

### 5.1 Database Schema (Supabase PostgreSQL)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- ============================================
-- WORKERS TABLE
-- ============================================
CREATE TABLE workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address TEXT UNIQUE NOT NULL,
    did TEXT UNIQUE,  -- Self Protocol DID
    verification_level SMALLINT NOT NULL DEFAULT 0,  -- 0=unverified, 1=phone, 2=Self, 3=language
    languages TEXT[] DEFAULT '{}',

    -- Stats (denormalized for performance)
    tasks_completed INTEGER DEFAULT 0,
    accuracy_rate NUMERIC(5,2) DEFAULT 0.00,  -- 0-100
    tier TEXT DEFAULT 'newcomer',  -- newcomer, bronze, silver, gold, expert
    earnings_lifetime NUMERIC(20,2) DEFAULT 0.00,  -- USD
    earnings_pending NUMERIC(20,2) DEFAULT 0.00,  -- Awaiting consensus

    -- Points (cold start program)
    points_balance INTEGER DEFAULT 0,
    points_redeemed INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_verification_level CHECK (verification_level BETWEEN 0 AND 3),
    CONSTRAINT valid_accuracy CHECK (accuracy_rate BETWEEN 0 AND 100),
    CONSTRAINT valid_tier CHECK (tier IN ('newcomer', 'bronze', 'silver', 'gold', 'expert'))
);

CREATE INDEX idx_workers_wallet ON workers(wallet_address);
CREATE INDEX idx_workers_tier ON workers(tier);
CREATE INDEX idx_workers_accuracy ON workers(accuracy_rate DESC);

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    company_name TEXT,
    wallet_address TEXT,  -- For crypto deposits

    balance NUMERIC(20,2) DEFAULT 0.00,  -- USD
    total_spent NUMERIC(20,2) DEFAULT 0.00,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_email ON clients(email);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

    name TEXT NOT NULL,
    description TEXT,
    task_type TEXT NOT NULL,  -- sentiment, classification
    instructions TEXT NOT NULL,
    price_per_task NUMERIC(10,2) NOT NULL,

    total_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,

    status TEXT DEFAULT 'draft',  -- draft, active, paused, completed

    -- File storage
    input_file_url TEXT,  -- Cloudflare R2 URL
    output_file_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    CONSTRAINT valid_task_type CHECK (task_type IN ('sentiment', 'classification')),
    CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'paused', 'completed'))
);

CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

    type TEXT NOT NULL,  -- sentiment, classification
    content TEXT NOT NULL,  -- Text to label
    options JSONB,  -- For classification: ["Option 1", "Option 2"]

    time_limit INTEGER DEFAULT 45,  -- Seconds
    pay_amount NUMERIC(10,2) NOT NULL,

    status TEXT DEFAULT 'pending',  -- pending, assigned, completed, expired

    -- Consensus tracking
    assigned_to UUID[],  -- Array of worker IDs
    responses JSONB DEFAULT '[]',  -- [{workerId, response, timestamp}]
    consensus_reached BOOLEAN DEFAULT FALSE,
    final_label TEXT,

    -- Golden tasks (QA)
    is_golden_task BOOLEAN DEFAULT FALSE,
    golden_answer TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    CONSTRAINT valid_task_type CHECK (type IN ('sentiment', 'classification')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'assigned', 'completed', 'expired'))
);

CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_pending ON tasks(status) WHERE status = 'pending';  -- Optimization for queue
CREATE INDEX idx_tasks_is_golden ON tasks(is_golden_task);

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,

    amount NUMERIC(20,2) NOT NULL,
    type TEXT NOT NULL,  -- task_payment, withdrawal, referral_bonus, streak_bonus, points_redemption

    -- Blockchain details
    tx_hash TEXT,  -- Celo transaction hash
    block_number BIGINT,

    status TEXT DEFAULT 'pending',  -- pending, confirmed, failed

    -- References
    task_id UUID REFERENCES tasks(id),
    project_id UUID REFERENCES projects(id),

    created_at TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,

    CONSTRAINT valid_transaction_type CHECK (type IN ('task_payment', 'withdrawal', 'referral_bonus', 'streak_bonus', 'points_redemption')),
    CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'failed'))
);

CREATE INDEX idx_transactions_worker ON transactions(worker_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_tx_hash ON transactions(tx_hash);
CREATE INDEX idx_transactions_created ON transactions(created_at DESC);

-- ============================================
-- REFERRALS TABLE (Post-MVP)
-- ============================================
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES workers(id),
    referee_id UUID NOT NULL REFERENCES workers(id),

    referrer_bonus NUMERIC(10,2) DEFAULT 1.00,
    referee_bonus NUMERIC(10,2) DEFAULT 0.50,

    status TEXT DEFAULT 'pending',  -- pending, paid

    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,

    CONSTRAINT valid_referral_status CHECK (status IN ('pending', 'paid')),
    UNIQUE(referrer_id, referee_id)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Workers can only read their own data
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
CREATE POLICY workers_select_own ON workers
    FOR SELECT
    USING (wallet_address = current_setting('request.jwt.claim.wallet_address', true));

-- Workers can update their own profile (except stats)
CREATE POLICY workers_update_own ON workers
    FOR UPDATE
    USING (wallet_address = current_setting('request.jwt.claim.wallet_address', true));

-- Clients can only read their own data
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY clients_select_own ON clients
    FOR SELECT
    USING (id = current_setting('request.jwt.claim.client_id', true)::UUID);

-- Clients can only see their own projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY projects_select_own ON projects
    FOR SELECT
    USING (client_id = current_setting('request.jwt.claim.client_id', true)::UUID);

CREATE POLICY projects_insert_own ON projects
    FOR INSERT
    WITH CHECK (client_id = current_setting('request.jwt.claim.client_id', true)::UUID);

-- Workers can only see available tasks (not responses from others)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY tasks_select_available ON tasks
    FOR SELECT
    USING (status IN ('pending', 'assigned'));

-- Workers can only see their own transactions
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY transactions_select_own ON transactions
    FOR SELECT
    USING (worker_id = current_setting('request.jwt.claim.worker_id', true)::UUID);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update project completion count when task completes
CREATE OR REPLACE FUNCTION update_project_completion()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE projects
        SET completed_tasks = completed_tasks + 1
        WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_completed_update_project AFTER UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_project_completion();

-- Update worker stats after task completion
CREATE OR REPLACE FUNCTION update_worker_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE workers
        SET
            tasks_completed = tasks_completed + 1,
            earnings_lifetime = earnings_lifetime + NEW.amount
        WHERE id = NEW.worker_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_confirmed_update_worker AFTER UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_worker_stats();
```

### 5.2 Redis Data Structures (Upstash)

```
# Task Queue (Sorted Set - priority by task creation time)
bawo:queue:tasks
  ZADD bawo:queue:tasks <timestamp> <task_id>
  ZPOPMIN bawo:queue:tasks 1  # Get oldest task

# Task Assignment Lock (to prevent double-assignment)
bawo:lock:task:<task_id>
  SET bawo:lock:task:123 <worker_id> EX 60  # 60s lock

# Worker Session Cache
bawo:session:<worker_id>
  SET bawo:session:abc123 '{"walletAddress":"0x...","tier":"bronze"}' EX 3600

# Task Submission Deduplication (prevent double submit)
bawo:submitted:<task_id>:<worker_id>
  SET bawo:submitted:123:abc "done" EX 300  # 5min TTL

# Consensus Tracking (Hash)
bawo:consensus:<task_id>
  HSET bawo:consensus:123 worker1 "positive"
  HSET bawo:consensus:123 worker2 "positive"
  HGETALL bawo:consensus:123  # Get all submissions

# Rate Limiting (per worker)
bawo:ratelimit:<worker_id>
  INCR bawo:ratelimit:abc123
  EXPIRE bawo:ratelimit:abc123 60  # 1 task per second max
```

### 5.3 File Storage (Cloudflare R2)

```
bawo-production/
├── projects/
│   ├── <project_id>/
│   │   ├── input.csv          # Original CSV upload
│   │   ├── output.csv         # Labeled results
│   │   └── metadata.json      # Annotation guidelines, stats
├── golden-tasks/
│   └── <task_type>/
│       └── samples.json       # Pre-labeled test cases
└── exports/
    └── <export_id>/
        └── results-<date>.csv
```

---

## 6. API Design

### 6.1 API Standards

**Base URL:** `https://bawo.app/api`

**Authentication:**
- Workers: Wallet signature via `Authorization: Bearer <signed_message>`
- Clients: JWT token via `Authorization: Bearer <jwt>`

**Request/Response Format:** JSON

**Error Format:**
```json
{
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Not enough funds. You have $12.47 available.",
    "details": { "available": 12.47, "requested": 15.00 }
  }
}
```

**Success Format:**
```json
{
  "data": { ... },
  "meta": { "timestamp": "2026-01-27T..." }
}
```

### 6.2 Worker Endpoints

#### POST /api/workers/verify
Start Self Protocol verification.

**Request:**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "data": {
    "verificationUrl": "selfprotocol://verify?challenge=...",
    "sessionId": "abc123"
  }
}
```

---

#### GET /api/workers/profile
Get worker profile.

**Headers:**
```
Authorization: Bearer <signed_message>
```

**Response:**
```json
{
  "data": {
    "id": "uuid",
    "walletAddress": "0x...",
    "verificationLevel": 2,
    "languages": ["en", "sw"],
    "stats": {
      "tasksCompleted": 150,
      "accuracy": 92.5,
      "tier": "silver",
      "earningsLifetime": 47.50
    }
  }
}
```

---

#### GET /api/tasks/available
List available tasks for worker.

**Query Params:**
- `limit` (default: 10)
- `taskType` (optional: sentiment, classification)

**Response:**
```json
{
  "data": [
    {
      "id": "task-123",
      "type": "sentiment",
      "content": "This phone is amazing! Love the camera quality.",
      "timeLimit": 45,
      "payAmount": 0.05
    }
  ],
  "meta": {
    "total": 245,
    "queueDepth": 245
  }
}
```

---

#### POST /api/tasks/:id/start
Claim a task.

**Request:** (empty body)

**Response:**
```json
{
  "data": {
    "id": "task-123",
    "type": "sentiment",
    "content": "This phone is amazing! Love the camera quality.",
    "options": ["Positive", "Negative", "Neutral"],
    "timeLimit": 45,
    "payAmount": 0.05,
    "startedAt": "2026-01-27T12:00:00Z",
    "expiresAt": "2026-01-27T12:00:45Z"
  }
}
```

---

#### POST /api/tasks/:id/submit
Submit task response.

**Request:**
```json
{
  "response": "Positive",
  "timeSpent": 12  // seconds
}
```

**Response:**
```json
{
  "data": {
    "status": "submitted",
    "consensusPending": true,
    "message": "Waiting for consensus (1/3 submissions)"
  }
}
```

**Or (if consensus reached):**
```json
{
  "data": {
    "status": "paid",
    "amount": 0.05,
    "txHash": "0x...",
    "balanceNew": 12.52
  }
}
```

---

#### GET /api/earnings/balance
Get current balance.

**Response:**
```json
{
  "data": {
    "available": 12.47,
    "pending": 0.15,  // Awaiting consensus
    "lifetime": 47.50
  }
}
```

---

#### POST /api/earnings/withdraw
Withdraw earnings to wallet.

**Request:**
```json
{
  "amount": 10.00,
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
}
```

**Response:**
```json
{
  "data": {
    "txHash": "0x...",
    "amount": 10.00,
    "fee": 0.0002,
    "status": "confirmed",
    "balanceNew": 2.47
  }
}
```

### 6.3 Client Endpoints

#### POST /api/projects
Create a new project.

**Request:**
```json
{
  "name": "Swahili Sentiment Analysis",
  "description": "Label tweets about mobile payments",
  "taskType": "sentiment",
  "instructions": "Read the tweet and classify the sentiment...",
  "pricePerTask": 0.05
}
```

**Response:**
```json
{
  "data": {
    "id": "project-abc",
    "name": "Swahili Sentiment Analysis",
    "status": "draft",
    "totalTasks": 0,
    "createdAt": "2026-01-27T..."
  }
}
```

---

#### POST /api/projects/:id/upload
Upload CSV with task data.

**Request:**
```
Content-Type: multipart/form-data

file: tasks.csv
```

**Response:**
```json
{
  "data": {
    "tasksCreated": 10000,
    "goldenTasksInjected": 1000,
    "status": "active"
  }
}
```

---

#### GET /api/projects/:id/results
Download labeled results.

**Response:**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="results-2026-01-27.csv"

text,label,confidence,consensus
"This phone is amazing!",positive,1.0,true
...
```

### 6.4 Rate Limiting

| Endpoint | Rate Limit | Window |
|----------|------------|--------|
| /api/tasks/available | 60 requests | per minute |
| /api/tasks/:id/start | 30 requests | per minute |
| /api/tasks/:id/submit | 30 requests | per minute |
| /api/earnings/withdraw | 10 requests | per hour |
| /api/projects (POST) | 10 requests | per hour |

**Implementation:** Upstash Redis rate limiter with sliding window.

---

## 7. Security Architecture

### 7.1 Authentication & Authorization

#### Worker Authentication

**Method:** Wallet Signature (EIP-191)

**Flow:**
1. Worker opens app in MiniPay
2. App detects wallet via `window.ethereum`
3. App generates challenge message: `"Sign this message to authenticate: <timestamp>"`
4. Worker signs message with private key (MiniPay prompt)
5. App sends `{ walletAddress, signature, message }` to backend
6. Backend verifies signature using `viem.verifyMessage()`
7. Backend issues JWT token with `walletAddress` claim
8. JWT stored in `localStorage` (PWA), sent in `Authorization` header

**Session Duration:** 7 days

**Refresh:** Auto-refresh before expiry

---

#### Client Authentication

**Method:** Email/Password (Supabase Auth)

**Flow:**
1. Client enters email/password on `/login`
2. Supabase Auth validates credentials
3. Supabase issues JWT token
4. Token stored in `httpOnly` cookie
5. Backend validates token on each request

**Session Duration:** 24 hours

**MFA:** Optional (TOTP via Supabase Auth)

---

### 7.2 Authorization Matrix

| Role | Workers Table | Projects Table | Tasks Table | Transactions Table | Smart Contract |
|------|---------------|----------------|-------------|-------------------|----------------|
| Worker | Read own | - | Read available | Read own | - |
| Client | - | Read/Write own | Read own project's | - | Deposit only |
| Backend (Service Account) | Read/Write all | Read/Write all | Read/Write all | Read/Write all | Owner (payments) |

**Implementation:** Supabase Row Level Security (RLS) policies (see Data Architecture section)

---

### 7.3 Data Security

#### Sensitive Data Handling

| Data Type | Storage | Encryption | Access |
|-----------|---------|------------|--------|
| Wallet Private Key (Backend) | AWS KMS | HSM-backed | Backend service only |
| Worker PII | NOT STORED | N/A | Self Protocol ZK proofs only |
| Worker Wallet Address | Supabase | At rest (AES-256) | Worker + Backend |
| Client Email | Supabase | At rest (AES-256) | Client + Backend |
| Task Content | Supabase | At rest (AES-256) | All authenticated users |
| Transaction Hashes | Supabase | At rest (AES-256) | Worker + Backend |

**PII Policy:** Zero PII storage. Self Protocol provides ZK proofs of humanity without revealing passport data.

---

#### Encryption Standards

- **In Transit:** TLS 1.3 (HTTPS everywhere)
- **At Rest:** AES-256 (Supabase default)
- **Keys:** AWS KMS (FIPS 140-2 Level 3 HSM)
- **Passwords:** bcrypt (cost factor 12) via Supabase Auth

---

### 7.4 Smart Contract Security

**Security Measures:**

1. **Access Control:**
   - `onlyOwner` modifier on payment functions
   - Owner = Multi-sig wallet (Gnosis Safe 2/3)
   - Backend key added as signer

2. **Reentrancy Protection:**
   - `ReentrancyGuard` from OpenZeppelin
   - Checks-Effects-Interactions pattern

3. **Input Validation:**
   - Require non-zero amounts
   - Require non-zero addresses
   - Check contract balance before transfer

4. **Emergency Controls:**
   - `emergencyWithdraw()` to recover funds
   - Pause functionality (OpenZeppelin Pausable)

5. **Audit:**
   - Third-party audit before mainnet deployment
   - Post-deployment monitoring via Tenderly

---

### 7.5 API Security

**Headers:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

**CORS Policy:**
```javascript
// Only allow worker PWA and client dashboard origins
const allowedOrigins = [
  'https://bawo.app',
  'https://worker.bawo.app',
  'https://client.bawo.app'
]
```

**Input Validation:**
- All inputs validated with `zod` schemas
- SQL injection prevention via Supabase parameterized queries
- XSS prevention via React escaping + CSP headers

**Rate Limiting:**
- Per-IP: 100 requests/minute (global)
- Per-User: Endpoint-specific limits (see API Design section)
- Implementation: Upstash Redis sliding window

---

### 7.6 Vulnerability Mitigation

| Vulnerability | Risk Level | Mitigation |
|---------------|------------|------------|
| SQL Injection | High | Supabase parameterized queries, no raw SQL |
| XSS | High | React auto-escaping, CSP headers |
| CSRF | Medium | SameSite cookies, CSRF tokens |
| Clickjacking | Medium | X-Frame-Options: DENY |
| Replay Attacks | Medium | Timestamp + nonce in signature challenges |
| Man-in-the-Middle | High | TLS 1.3, HSTS headers |
| Sybil Attacks | High | Self Protocol NFC passport verification |
| Smart Contract Reentrancy | Critical | ReentrancyGuard, Checks-Effects-Interactions |
| Private Key Theft | Critical | AWS KMS (never exposed), multi-sig owner |

---

## 8. Integration Points

### 8.1 MiniPay Integration

**Purpose:** Wallet auto-detection and auto-connect for 11M users.

**Integration Method:**
```typescript
// lib/minipay.ts
export function detectMiniPay(): boolean {
  return typeof window !== 'undefined' &&
         window.ethereum?.isMiniPay === true
}

export async function connectWallet(): Promise<string> {
  if (!detectMiniPay()) {
    throw new Error('MiniPay not detected. Please open in MiniPay browser.')
  }

  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  })

  return accounts[0]  // Celo address
}
```

**Fallback:** Show "Open in MiniPay" message with deep link if accessed outside MiniPay.

---

### 8.2 Self Protocol Integration

**Purpose:** ZK identity verification for Sybil resistance and portable reputation.

**Integration Method:**
```typescript
// lib/self-protocol.ts
import { SelfSDK } from '@selfprotocol/sdk'

const sdk = new SelfSDK({
  environment: 'production',
  appId: process.env.SELF_APP_ID
})

export async function startVerification(walletAddress: string): Promise<string> {
  const challenge = await sdk.createChallenge({
    type: 'passport-nfc',
    metadata: { walletAddress }
  })

  return challenge.verificationUrl  // Deep link to Self app
}

export async function checkVerification(sessionId: string): Promise<boolean> {
  const result = await sdk.getVerificationResult(sessionId)

  // ZK proof verified, no PII received
  return result.verified && result.proofType === 'passport-nfc'
}
```

**Fallback:** If Self Protocol unavailable, use phone verification via MiniPay (Level 1 access, $10/day limit).

---

### 8.3 Celo Blockchain Integration

**Purpose:** Instant cUSD micropayments with <$0.01 fees.

**Integration Method:**
```typescript
// lib/blockchain.ts
import { createWalletClient, http, parseUnits } from 'viem'
import { celo } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

const account = privateKeyToAccount(await getKMSPrivateKey())

const walletClient = createWalletClient({
  account,
  chain: celo,
  transport: http('https://forno.celo.org')
})

export async function sendPayment(
  workerAddress: string,
  amountUSD: number,
  taskId: string
): Promise<string> {
  const amount = parseUnits(amountUSD.toString(), 18)  // cUSD has 18 decimals

  const hash = await walletClient.writeContract({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PaymentDispatcherABI,
    functionName: 'payWorker',
    args: [workerAddress, amount, taskId]
  })

  // Wait for confirmation (<5s on Celo)
  await walletClient.waitForTransactionReceipt({ hash })

  return hash
}
```

**Gas Estimation:**
```typescript
export async function estimateGas(): Promise<bigint> {
  return walletClient.estimateContractGas({
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: PaymentDispatcherABI,
    functionName: 'payWorker',
    args: [DUMMY_ADDRESS, parseUnits('0.05', 18), 'test']
  })
}
```

---

### 8.4 Supabase Integration

**Purpose:** Database, auth, and realtime subscriptions.

**Integration Method:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Realtime subscription example
export function subscribeToTransactions(
  workerId: string,
  callback: (tx: Transaction) => void
) {
  return supabase
    .channel('transactions')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'transactions',
        filter: `worker_id=eq.${workerId}`
      },
      (payload) => callback(payload.new as Transaction)
    )
    .subscribe()
}
```

**Auth Integration:**
```typescript
// Workers: Custom JWT from wallet signature
export async function signInWithWallet(
  walletAddress: string,
  signature: string,
  message: string
) {
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'custom',
    token: generateJWT({ walletAddress, signature, message })
  })

  return { data, error }
}

// Clients: Email/password
export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password })
}
```

---

### 8.5 Upstash Redis Integration

**Purpose:** Task queue and session caching.

**Integration Method:**
```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

// Task queue operations
export async function enqueueTask(taskId: string, priority: number = Date.now()) {
  await redis.zadd('bawo:queue:tasks', { score: priority, member: taskId })
}

export async function dequeueTask(): Promise<string | null> {
  const result = await redis.zpopmin('bawo:queue:tasks', 1)
  return result.length > 0 ? result[0].member : null
}

// Session caching
export async function cacheWorkerSession(workerId: string, data: object) {
  await redis.set(`bawo:session:${workerId}`, JSON.stringify(data), { ex: 3600 })
}
```

---

### 8.6 Cloudflare R2 Integration

**Purpose:** CSV file storage with no egress fees.

**Integration Method:**
```typescript
// lib/storage.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
  }
})

export async function uploadCSV(
  projectId: string,
  file: Buffer,
  filename: string
): Promise<string> {
  const key = `projects/${projectId}/${filename}`

  await r2.send(new PutObjectCommand({
    Bucket: 'bawo-production',
    Key: key,
    Body: file,
    ContentType: 'text/csv'
  }))

  return `https://storage.bawo.app/${key}`
}

export async function generateDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: 'bawo-production',
    Key: key
  })

  return getSignedUrl(r2, command, { expiresIn: 3600 })
}
```

---

## 9. Scalability & Performance

### 9.1 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Initial Load (3G) | <3s | Code splitting, <150kb bundle, aggressive caching |
| Time to Interactive | <5s | SSR for critical content, lazy load non-critical |
| Task Load Time | <2s | Redis cache + CDN, prefetch next task |
| Payment Confirmation | <5s | Celo fast finality, realtime subscriptions |
| API Response Time (p95) | <500ms | Database indexes, connection pooling |
| Concurrent Workers | 3,000 | Supabase connection pooling, horizontal scaling |
| Task Throughput | 10,000/day | Upstash Redis queue, batch processing |

### 9.2 Caching Strategy

#### Browser Caching (Service Worker)

```javascript
// public/sw.js (generated by Workbox)
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST)

// Cache images (Cache First)
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60  // 30 days
      })
    ]
  })
)

// Cache API calls (Network First with fallback)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 5 * 60  // 5 minutes
      })
    ]
  })
)

// Cache tasks for offline (Stale While Revalidate)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/tasks/'),
  new StaleWhileRevalidate({
    cacheName: 'tasks-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 10 * 60  // 10 minutes
      })
    ]
  })
)
```

#### Redis Caching

```typescript
// Frequently accessed data cached in Redis
async function getWorkerProfile(workerId: string): Promise<Worker> {
  const cached = await redis.get(`bawo:worker:${workerId}`)

  if (cached) {
    return JSON.parse(cached)
  }

  const worker = await supabase
    .from('workers')
    .select('*')
    .eq('id', workerId)
    .single()

  await redis.set(`bawo:worker:${workerId}`, JSON.stringify(worker.data), { ex: 300 })

  return worker.data
}
```

#### CDN Caching

- **Static Assets:** Cached at edge (Vercel CDN)
- **Cache Headers:** `Cache-Control: public, max-age=31536000, immutable`
- **Dynamic Content:** `Cache-Control: no-cache` (rely on Service Worker)

### 9.3 Database Optimization

**Indexes:**
- See Data Architecture section for index definitions
- Critical indexes:
  - `tasks(status)` WHERE `status = 'pending'` (partial index for queue)
  - `workers(wallet_address)` (unique, for auth)
  - `transactions(worker_id, created_at DESC)` (for earnings history)

**Connection Pooling:**
```typescript
// Supabase connection pool configuration
const supabase = createClient(url, key, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: false  // Serverless, no session persistence
  },
  global: {
    headers: {
      'x-connection-pool-size': '10'
    }
  }
})
```

**Query Optimization:**
- Use `select()` to fetch only needed columns
- Pagination with `range()` (limit/offset)
- Batch inserts for task creation (100 tasks per batch)

### 9.4 Horizontal Scaling

**Frontend:**
- Vercel auto-scales based on traffic
- Edge Functions for API routes (globally distributed)

**Database:**
- Supabase auto-scales read replicas
- Connection pooler (pgBouncer) handles 10K+ connections

**Queue:**
- Upstash Redis auto-scales
- Multiple consumer instances can poll queue concurrently

**Smart Contract:**
- Celo blockchain scales to 10K TPS
- If needed, batch payments (100 workers per tx) for gas optimization

### 9.5 Load Testing Plan

**Tools:** k6, Playwright

**Scenarios:**

1. **Worker Load Test:**
   - 100 concurrent workers
   - Each worker: fetch tasks → start task → submit → repeat
   - Target: 500 task submissions/minute
   - Success: p95 latency <2s, 0% error rate

2. **Client Load Test:**
   - 10 concurrent clients
   - Each client: create project → upload 1000 tasks → wait for completion
   - Target: 10K tasks created/minute
   - Success: p95 latency <5s, 0% error rate

3. **Payment Load Test:**
   - Simulate 100 simultaneous payment transactions
   - Target: All confirmed within 10s
   - Success: 100% confirmation rate

---

## 10. Deployment Architecture

### 10.1 Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL (Frontend + API)              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  Worker PWA      │  │  Client Dashboard │                │
│  │  (Edge Runtime)  │  │  (Edge Runtime)   │                │
│  └──────────────────┘  └──────────────────┘                │
│  ┌──────────────────────────────────────────┐              │
│  │  API Routes (Serverless Functions)       │              │
│  └──────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
┌─────────▼─────────┐ ┌───▼────────┐ ┌─────▼────────┐
│  SUPABASE         │ │  UPSTASH   │ │  AWS KMS     │
│  (Database+Auth)  │ │  REDIS     │ │  (Key Mgmt)  │
│                   │ │            │ │              │
│  - us-east-1      │ │  - Global  │ │  - us-east-1 │
└───────────────────┘ └────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE R2 (Storage)                 │
│  - Global CDN, No Egress Fees                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   CELO BLOCKCHAIN (Mainnet)                 │
│  - Smart Contract: 0x...                                    │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Environments

| Environment | URL | Purpose | Deployment |
|-------------|-----|---------|------------|
| **Development** | http://localhost:3000 | Local dev | Manual (`pnpm dev`) |
| **Staging** | https://staging.bawo.app | Pre-production testing | Auto-deploy from `develop` branch |
| **Production** | https://bawo.app | Live production | Auto-deploy from `main` branch |

**Environment Variables:**
```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

R2_ENDPOINT=https://...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...

CELO_RPC_URL=https://forno.celo.org
PAYMENT_CONTRACT_ADDRESS=0x...

AWS_KMS_KEY_ID=arn:aws:kms:...

SELF_PROTOCOL_APP_ID=...
SELF_PROTOCOL_API_KEY=...

NEXT_PUBLIC_POSTHOG_KEY=...
AXIOM_TOKEN=...
```

### 10.3 CI/CD Pipeline

**Tool:** GitHub Actions

**Workflow:**

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm type-check

      - name: Unit tests
        run: pnpm test

      - name: E2E tests
        run: pnpm test:e2e

      - name: Build
        run: pnpm build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--env=staging'

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v2
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Deployment Triggers:**
- **Staging:** Auto-deploy on push to `develop`
- **Production:** Auto-deploy on push to `main` (after PR merge)

**Pre-deployment Checks:**
- ✅ All tests pass
- ✅ Lint and type-check pass
- ✅ Build succeeds
- ✅ E2E tests pass in staging

### 10.4 Monitoring & Observability

#### Application Monitoring

**Tool:** PostHog

**Tracked Events:**
```typescript
// lib/analytics.ts
import posthog from 'posthog-js'

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
  api_host: 'https://app.posthog.com'
})

// Event tracking examples
posthog.capture('task_completed', {
  task_id: '123',
  task_type: 'sentiment',
  time_spent: 12,
  worker_tier: 'silver'
})

posthog.capture('payment_sent', {
  amount: 0.05,
  tx_hash: '0x...',
  confirmation_time: 3.2  // seconds
})
```

#### Log Aggregation

**Tool:** Axiom

**Log Format:**
```json
{
  "level": "info",
  "timestamp": "2026-01-27T12:00:00Z",
  "message": "Payment sent to worker",
  "workerId": "abc123",
  "amount": 0.05,
  "txHash": "0x...",
  "duration": 3200  // ms
}
```

**Critical Logs:**
- Payment failures
- Task submission errors
- Smart contract errors
- Authentication failures

#### Uptime Monitoring

**Tool:** BetterStack

**Monitored Endpoints:**
- `https://bawo.app` (200 OK)
- `https://bawo.app/api/health` (200 OK)
- `https://bawo.app/api/tasks/available` (<2s response time)

**Alerts:**
- Email + Slack on downtime
- Escalation to PagerDuty if unresolved in 5 minutes

#### Error Tracking

**Tool:** Sentry (via Vercel integration)

**Tracked Errors:**
- Frontend exceptions
- API route errors
- Unhandled promise rejections
- Smart contract transaction failures

### 10.5 Backup & Disaster Recovery

#### Database Backups

**Supabase:**
- **Automatic:** Daily backups (retained 7 days)
- **Manual:** Before major migrations
- **Recovery Time Objective (RTO):** 1 hour
- **Recovery Point Objective (RPO):** 24 hours

#### Smart Contract Recovery

**Scenario:** Contract compromised or needs upgrade

**Recovery Plan:**
1. Pause contract (owner action via multi-sig)
2. Deploy new contract
3. Transfer cUSD balance to new contract
4. Update backend to use new contract address
5. Update frontend to display migration notice

**Backup Wallet:**
- Multi-sig wallet with 2/3 threshold
- Signers: CEO, CTO, External Auditor

#### Data Export

**Client Data:**
- Clients can export project data at any time (CSV download)
- Automated monthly exports to client's email

**Worker Data:**
- Workers can export earnings history (CSV)
- Self Protocol credentials portable (owned by worker)

---

## 11. Development Workflow

### 11.1 Git Strategy

**Branching Model:** Git Flow

```
main           (production)
  ↑
develop        (staging)
  ↑
feature/*      (feature branches)
  ↑
hotfix/*       (emergency fixes)
```

**Branch Naming:**
- `feature/task-timer-component`
- `fix/payment-confirmation-bug`
- `hotfix/critical-consensus-issue`

**Commit Convention:** Conventional Commits
```
feat(worker): add sentiment selector component
fix(api): resolve payment confirmation race condition
docs(readme): update deployment instructions
test(e2e): add withdrawal flow test
```

### 11.2 Code Review Process

**Requirements:**
- All PRs require 1 approval
- CI must pass (tests, lint, type-check)
- No merge conflicts with target branch

**Review Checklist:**
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log/debugger statements
- [ ] Security considerations addressed
- [ ] Performance impact considered

### 11.3 Testing Strategy

#### Unit Tests (Vitest)

**Coverage Target:** 80%

**Example:**
```typescript
// lib/consensus-engine.test.ts
import { describe, it, expect } from 'vitest'
import { ConsensusEngine } from './consensus-engine'

describe('ConsensusEngine', () => {
  it('reaches consensus with 2/3 majority', async () => {
    const engine = new ConsensusEngine()

    await engine.recordSubmission('task-123', 'worker1', 'positive')
    await engine.recordSubmission('task-123', 'worker2', 'positive')
    await engine.recordSubmission('task-123', 'worker3', 'negative')

    const result = await engine.checkConsensus('task-123')

    expect(result).toEqual({
      consensusReached: true,
      finalLabel: 'positive',
      winners: ['worker1', 'worker2']
    })
  })
})
```

#### Integration Tests (Vitest + Test Database)

**Example:**
```typescript
// app/api/tasks/submit/route.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { createMocks } from 'node-mocks-http'
import { POST } from './route'

describe('POST /api/tasks/:id/submit', () => {
  beforeEach(async () => {
    // Reset test database
    await resetTestDB()
  })

  it('submits task and returns consensus status', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { response: 'positive', timeSpent: 12 }
    })

    await POST(req, res)

    expect(res._getStatusCode()).toBe(200)
    expect(res._getJSONData()).toEqual({
      data: {
        status: 'submitted',
        consensusPending: true
      }
    })
  })
})
```

#### E2E Tests (Playwright)

**Example:**
```typescript
// tests/e2e/worker-task-flow.spec.ts
import { test, expect } from '@playwright/test'

test('worker completes sentiment task and receives payment', async ({ page }) => {
  // Navigate to app
  await page.goto('https://staging.bawo.app')

  // Auto-connect wallet (mock MiniPay)
  await page.evaluate(() => {
    window.ethereum = {
      isMiniPay: true,
      request: async ({ method }) => {
        if (method === 'eth_requestAccounts') {
          return ['0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb']
        }
      }
    }
  })

  // Start task
  await page.click('text=Start Task')

  // Select sentiment
  await page.click('button:has-text("Positive")')

  // Submit
  await page.click('button:has-text("Submit")')

  // Wait for payment notification
  await expect(page.locator('text=Earned $0.05!')).toBeVisible({ timeout: 10000 })

  // Verify balance updated
  const balance = await page.locator('[data-testid="balance"]').textContent()
  expect(parseFloat(balance!)).toBeGreaterThan(0)
})
```

**E2E Test Coverage:**
- Worker onboarding flow
- Task completion flow
- Withdrawal flow
- Client project creation flow
- Offline sync recovery

### 11.4 Local Development Setup

**Prerequisites:**
- Node.js 20+
- pnpm 8+
- Docker (for local Postgres/Redis)

**Setup:**
```bash
# Clone repo
git clone https://github.com/bawo/bawo-app.git
cd bawo-app

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start local Postgres + Redis
docker-compose up -d

# Run database migrations
pnpm db:migrate

# Seed database
pnpm db:seed

# Start dev server
pnpm dev
```

**Dev Server URLs:**
- Worker PWA: http://localhost:3000
- Client Dashboard: http://localhost:3000/client
- API: http://localhost:3000/api

---

## 12. Technical Risks & Mitigation

### 12.1 High-Priority Risks

| Risk | Impact | Probability | Mitigation | Owner |
|------|--------|-------------|------------|-------|
| **Self Protocol Integration Failure** | High | Medium | Built-in fallback to phone verification (Level 1 access). Test integration early with Self team support. Accept Level 1 limitations ($10/day cap) as acceptable MVP fallback. | Backend Lead |
| **Celo Network Downtime** | High | Low | Monitor network status via API. Queue payments locally during downtime. Auto-retry with exponential backoff. Communicate transparently to workers about delays. Set up alerts for block production delays. | Blockchain Lead |
| **Smart Contract Vulnerability** | Critical | Low | Third-party audit before mainnet deployment. Use OpenZeppelin battle-tested libraries. Multi-sig wallet (2/3) as owner. Emergency pause functionality. Post-deployment monitoring via Tenderly. | Security Lead |
| **AWS KMS Key Compromise** | Critical | Very Low | HSM-backed keys (FIPS 140-2 Level 3). Rotate keys quarterly. Monitor all key usage via CloudTrail. Multi-factor auth for AWS console access. Principle of least privilege. | Security Lead |
| **Database Connection Pool Exhaustion** | High | Medium | Supabase connection pooler (pgBouncer) handles 10K+ connections. Monitor pool usage via Supabase dashboard. Implement connection pool size limits in client code. Auto-scaling read replicas if needed. | Backend Lead |
| **Offline Sync Conflicts** | Medium | Medium | Client-wins strategy (never lose worker's work). Use submission IDs for deduplication. Aggressive retry logic with exponential backoff. Show clear status indicators to workers. Target >95% sync success rate. | Frontend Lead |
| **Bundle Size Exceeds 2MB** | High | Low | Aggressive code splitting. Tree shaking. Dynamic imports for non-critical routes. WebP images. Monitor bundle size in CI (<2MB enforced). Use Next.js bundle analyzer. | Frontend Lead |
| **Payment Gas Fees Spike** | Medium | Low | Monitor Celo gas prices via API. Set max gas price threshold. Batch small payments if fees exceed threshold (100 workers per tx). Communicate fee policy to workers. Celo typically stable at $0.0002. | Blockchain Lead |

### 12.2 Medium-Priority Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **Supabase Rate Limiting** | Medium | Low | Monitor API usage. Cache frequently accessed data in Redis. Use read replicas for read-heavy operations. Upgrade plan if needed. |
| **Cloudflare R2 Upload Failures** | Medium | Low | Implement retry logic. Store failed uploads temporarily in Vercel's /tmp. Alert on repeated failures. |
| **MiniPay API Changes** | Medium | Low | Use standard Web3 provider detection (window.ethereum). Monitor MiniPay developer announcements. Build graceful fallback to manual wallet connection. |
| **Worker Churn (Trust Issues)** | High | Medium | Instant payment demonstration (no batching). Self Protocol portable reputation (workers own credentials). Transparent pricing and terms. WhatsApp community for support. Points program rewards early workers. |
| **Consensus Manipulation** | Medium | Low | Random task assignment prevents collusion. Golden tasks detect low-quality workers. Worker reputation tiers restrict access. Monitor consensus patterns for anomalies. |

### 12.3 Monitoring & Alerts

**Critical Alerts (PagerDuty):**
- Smart contract payment failures (>3 in 5 minutes)
- Database connection pool exhausted
- Celo RPC errors (>10% of requests)
- AWS KMS key access denied

**Warning Alerts (Slack):**
- Payment confirmation >10s (should be <5s)
- Task queue depth >1000 tasks
- API error rate >1%
- Offline sync failures >10% rate

**Daily Reports (Email):**
- Platform health summary
- Task throughput and queue depth
- Payment volume and gas fees
- Worker acquisition and retention

---

## 13. Future Considerations

### 13.1 Technical Debt Management

**Known Tech Debt:**

1. **Direct Transfer via Backend Key**
   - **Debt:** Backend holds private key (centralization risk)
   - **Future:** Migrate to meta-transactions (gasless for workers)
   - **Timeline:** Q3 2026 (after MVP proves product-market fit)
   - **Effort:** 2 weeks (smart contract rewrite + backend changes)

2. **Single-Region Database**
   - **Debt:** Supabase us-east-1 only (higher latency for African workers)
   - **Future:** Multi-region read replicas (edge functions + regional DB)
   - **Timeline:** Q4 2026 (when worker base >5K)
   - **Effort:** 1 week (Supabase configuration)

3. **Manual Golden Task Creation**
   - **Debt:** Admin manually creates golden tasks
   - **Future:** ML model auto-generates golden tasks from consensus data
   - **Timeline:** Q2 2026 (when task volume >100K)
   - **Effort:** 3 weeks (ML pipeline + integration)

### 13.2 Phase 2 Features

**Q2 2026:**
- Referral program (two-sided bonuses)
- Streak rewards (7-day, 30-day)
- Leaderboards (weekly top earners)
- RLHF preference ranking tasks
- Language verification (Level 3 access)

**Q3 2026:**
- Voice data collection tasks
- Multi-country expansion (Nigeria, Ghana)
- Translation tasks (bidirectional)
- Dataset marketplace

**Q4 2026:**
- x402 Protocol integration (AI agent buyers)
- Native mobile apps (iOS, Android)
- University ambassador program
- Premium enterprise clients

### 13.3 Scalability Roadmap

**Current Capacity (MVP):**
- 3,000 concurrent workers
- 10,000 tasks/day
- 100 TPS (blockchain limited, but Celo supports 10K TPS)

**6-Month Targets:**
- 10,000 concurrent workers
- 50,000 tasks/day
- Batch payments (100 workers per tx) for gas optimization

**12-Month Targets:**
- 50,000 concurrent workers
- 250,000 tasks/day
- Multi-region deployment (US, EU, Africa)
- Dedicated Celo validator for gas savings

### 13.4 Open Technical Questions

1. **Should we implement a reputation NFT for workers?**
   - Pro: Workers own credentials on-chain, portable across platforms
   - Con: Added complexity, gas fees for minting
   - Decision: Deferred to Q3 2026, revisit after Self Protocol integration is stable

2. **Should we support other stablecoins (USDC, USDT)?**
   - Pro: More client flexibility, easier onboarding
   - Con: Added smart contract complexity, multiple token approvals
   - Decision: Deferred to Q2 2026, focus on cUSD for MVP

3. **Should we build a native mobile app or stick with PWA?**
   - Pro: Better offline support, push notifications, app store presence
   - Con: 2x development effort (iOS + Android), distribution friction
   - Decision: Deferred to Q4 2026, PWA sufficient for MVP given MiniPay distribution

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Bawo** | Yoruba for "how are you?"; the platform name |
| **Celo** | Layer 2 blockchain optimized for mobile payments |
| **cUSD** | Celo-native stablecoin (1:1 USD peg) |
| **Consensus** | Agreement among 3 workers (2/3 majority) on task label |
| **Golden Task** | Pre-labeled test task for quality assurance (10% of tasks) |
| **MiniPay** | Mobile wallet app with 11M users in Africa |
| **Self Protocol** | ZK identity verification via NFC passport scan |
| **PWA** | Progressive Web App (installable web app with offline support) |
| **RLS** | Row Level Security (Supabase feature for auth) |
| **Sybil Attack** | Creating multiple fake accounts to game the system |
| **ZK Proof** | Zero-Knowledge Proof (prove identity without revealing PII) |

---

## Appendix B: Decision Log

| Date | Decision | Rationale | Alternatives Considered |
|------|----------|-----------|-------------------------|
| 2026-01-27 | Use Direct Transfers for payments | <5s requirement, zero gas for workers | Escrow (slower), Meta-transactions (complex) |
| 2026-01-27 | Use Upstash Redis for task queue | High throughput, serverless, auto-scaling | Supabase (not ideal for queues), BullMQ (overkill) |
| 2026-01-27 | Use Client-Wins offline sync | Never lose worker's work, builds trust | Last-Write-Wins (risky), Versioned Merge (overkill) |
| 2026-01-27 | Use Next.js App Router | SSR for SEO, PWA support, API routes | Remix (less mature), Vite+React (no SSR) |
| 2026-01-27 | Use Supabase (not custom backend) | Auth + DB + Realtime in one, RLS for security | Custom Express API (more work), Firebase (vendor lock-in) |
| 2026-01-27 | Use shadcn/ui (not component library) | Copy-paste (no bloat), customizable | Material-UI (heavy), Chakra UI (heavy) |

---

**End of Software Design Document**

**Next Step:** Run `/sprint-plan` to break down MVP into 2-week sprints with detailed tasks.
