# Sprint Plan: Bawo MVP

**Version:** 1.0
**Date:** 2026-01-28
**Author:** Sprint Planner Agent
**PRD Reference:** grimoires/loa/prd.md v2.0
**SDD Reference:** grimoires/loa/sdd.md v1.0
**Cycle:** cycle-001

---

## Executive Summary

This sprint plan breaks down the Bawo MVP into 6 sprints of 2-2.5 days each, delivering a production-ready crypto-powered AI data labeling platform for African workers. The plan follows the technical architecture from the SDD and prioritizes features from the PRD that enable revenue generation within 4-6 weeks.

**Total Sprints:** 6
**Sprint Duration:** 2-2.5 days each
**Timeline:** 12-15 days (Weeks 1-4 of PRD development phases)
**Target:** MVP launch with 50-100 founding workers, first paying client

**Critical Path Items:**
1. Self Protocol SDK integration validation (Sprint 1-2)
2. Celo blockchain payment testing (Sprint 4)
3. MiniPay wallet detection (Sprint 2)
4. Bundle size monitoring <150kb (All sprints)
5. 3G load time validation <3s (Sprint 6)

---

## Sprint Overview

| Sprint | Global ID | Theme | Key Deliverables | Dependencies |
|--------|-----------|-------|------------------|--------------|
| 1 | 1 | Foundation & Setup | Next.js app, Supabase schema, auth skeleton, CI/CD | None |
| 2 | 2 | Worker Onboarding | MiniPay detection, Self Protocol integration, worker profiles | Sprint 1 |
| 3 | 3 | Task Engine Core | Task types (sentiment, classification), task UI, golden tasks | Sprint 2 |
| 4 | 4 | Payment Infrastructure | Celo integration, consensus mechanism, instant payments, withdrawals | Sprint 3 |
| 5 | 5 | Client Dashboard | Project creation, CSV upload, results download, monitoring | Sprint 1 |
| 6 | 6 | Gamification & Polish | Points system, referrals, streaks, leaderboards, RLHF, offline, performance | Sprint 2-5 |

---

## Sprint 1: Foundation & Setup

**Global Sprint ID:** 1 (cycle-001)
**Duration:** 2.5 days
**Dates:** TBD (Starting sprint)

### Sprint Goal

Establish development environment, database schema, authentication skeleton, and CI/CD pipeline for rapid iteration.

### Deliverables

- [ ] Next.js 14 app initialized with App Router
- [ ] Tailwind CSS + shadcn/ui components configured
- [ ] Supabase project created with database schema
- [ ] Basic authentication scaffolding (wallet + JWT for workers, email/password for clients)
- [ ] Vercel deployment pipeline configured
- [ ] GitHub Actions CI setup
- [ ] Development environment documented

### Acceptance Criteria

- [ ] `npm run dev` starts local development server successfully
- [ ] All Tailwind classes and shadcn/ui components render correctly
- [ ] Supabase connection established, all tables created with RLS policies
- [ ] Auth endpoints return mock responses (`/api/v1/workers/verify`, `/api/v1/auth/client/login`)
- [ ] PR to `main` triggers CI pipeline (lint, type-check, unit tests)
- [ ] Preview deployment created on Vercel for each PR
- [ ] README.md documents setup steps for new developers

### Week 1 Validation Tasks (Run in Parallel with Setup)

These validation tasks should be completed during Sprint 1 to de-risk critical technical assumptions. They can run in parallel with setup tasks.

#### Task 1.0a: Test Self Protocol SDK on Target Devices → **[VALIDATION]**

**Goal:** Validate that Self Protocol NFC passport scanning works on the 3 most common Kenyan Android device models.

**Target Devices:**
- Tecno Spark 10 Pro (~$120, most popular in Kenya)
- Infinix Hot 30i (~$100, second most popular)
- Samsung Galaxy A04 (~$130, third most popular)

**Steps:**
1. Obtain or borrow one of each device (or test on 2+ devices if 3 unavailable)
2. Install Self Protocol mobile app from Play Store
3. Attempt NFC passport scan on each device
4. Document: Success rate, scan time, error messages
5. Test on both Kenyan and other passports if available

**Success Criteria:**
- [ ] Self Protocol app successfully scans passport on 2+ of 3 devices
- [ ] Scan completes in <60 seconds
- [ ] ZK proof generation works without errors
- [ ] Documentation created: `docs/validation/self-protocol-device-testing.md`

**If Validation Fails:**
- Still proceed with implementation (phone verification opt-down covers this)
- Adjust UI copy to emphasize phone path more prominently
- Contact Self Protocol support for device compatibility guidance

**Estimated Time:** 2-4 hours (if devices available)

---

#### Task 1.0b: Email Self Protocol for Pricing → **[VALIDATION]**

**Goal:** Get official pricing quote to validate unit economics assumptions.

**Email Template:**
```
Subject: Pricing Inquiry - Bawo (Kenya data labeling platform)

Hi Self Protocol team,

I'm building Bawo, a crypto-powered data labeling platform targeting
African workers. We plan to use Self Protocol for ZK identity verification
to onboard workers while maintaining privacy.

Can you provide pricing information for:
1. Per-verification cost
2. Volume discounts (we expect 500-3000 verifications in Year 1)
3. Startup or grant programs if available

Expected volume: 500 verifications in Month 1-3, scaling to 3000 by Month 12.

Thanks,
[Your name]
```

**Success Criteria:**
- [ ] Email sent to Self Protocol team
- [ ] Pricing information received (or meeting scheduled)
- [ ] Unit economics updated in PRD if needed
- [ ] Documentation: `docs/validation/self-protocol-pricing.md`

**Estimated Time:** 30 minutes (email), 1-2 weeks (response time)

---

#### Task 1.0c: File Kenya ODPC Registration → **[VALIDATION]**

**Goal:** Begin data protection registration process with Kenya's Office of the Data Protection Commissioner.

**Steps:**
1. Review ODPC registration requirements: https://odpc.go.ke
2. Prepare required documents:
   - Company registration (or personal ID if not yet registered)
   - Data processing description (workers + clients)
   - Data protection policy draft
   - Contact information
3. Submit online registration form
4. Pay registration fee (if applicable)
5. Track application status

**Success Criteria:**
- [ ] Registration application submitted
- [ ] Confirmation receipt received
- [ ] Timeline documented (how long processing takes)
- [ ] Documentation: `docs/legal/odpc-registration.md`

**If Can't Complete:**
- Consult with Kenyan lawyer on interim operations
- Most platforms operate during processing period (can take 30-90 days)

**Estimated Time:** 3-6 hours

---

### Technical Tasks

#### Task 1.1: Initialize Next.js 14 Project → **[G-1]**

```bash
npx create-next-app@14 bawo-app --typescript --tailwind --app --use-npm
cd bawo-app
npm install @supabase/supabase-js viem zustand date-fns
npm install -D @types/node vitest @vitest/ui
```

**Files created:**
- `app/layout.tsx` - Root layout with font configuration
- `app/page.tsx` - Landing page
- `tailwind.config.ts` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration

**Acceptance:** Project builds without errors (`npm run build`)

#### Task 1.2: Configure Tailwind + shadcn/ui → **[G-1]**

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label
npx shadcn-ui@latest add form select textarea
```

**Files created:**
- `components/ui/*.tsx` - shadcn/ui components
- `lib/utils.ts` - cn() utility for className merging

**Design system reference:** DESIGN.md Section 4 (color scales, typography)

**Acceptance:** Button component renders with correct color scales (warm accent for workers, cool grays for clients)

#### Task 1.3: Create Supabase Project & Schema → **[G-1]**

**Schema Definition (from SDD Section 3):**

```sql
-- File: supabase/migrations/001_initial_schema.sql

-- Workers table
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  self_protocol_did TEXT,
  verification_level INT DEFAULT 0, -- 0-3
  language_skills TEXT[], -- ['en', 'sw', 'sheng']
  reputation_score DECIMAL(5,2) DEFAULT 0.00,
  total_tasks_completed INT DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  balance_usd DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  task_type TEXT NOT NULL, -- 'sentiment' | 'classification'
  instructions TEXT NOT NULL,
  price_per_task DECIMAL(6,4) NOT NULL, -- $0.08 default
  total_tasks INT NOT NULL,
  completed_tasks INT DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active' | 'paused' | 'completed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  content TEXT NOT NULL,
  task_type TEXT NOT NULL,
  is_golden BOOLEAN DEFAULT false,
  golden_answer TEXT, -- pre-labeled answer for QA
  status TEXT DEFAULT 'pending', -- 'pending' | 'assigned' | 'completed'
  consensus_label TEXT,
  consensus_confidence DECIMAL(4,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Task responses table
CREATE TABLE task_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  worker_id UUID REFERENCES workers(id),
  response TEXT NOT NULL,
  response_time_seconds INT NOT NULL,
  is_correct BOOLEAN, -- null if not golden, true/false if golden
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES workers(id),
  amount_usd DECIMAL(10,6) NOT NULL,
  tx_type TEXT NOT NULL, -- 'task_payment' | 'withdrawal' | 'referral_bonus'
  tx_hash TEXT, -- Celo transaction hash
  status TEXT DEFAULT 'pending', -- 'pending' | 'confirmed' | 'failed'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Points ledger table (cold start)
CREATE TABLE points_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES workers(id),
  points INT NOT NULL,
  activity_type TEXT NOT NULL, -- 'training_task' | 'golden_bonus' | 'referral' | 'streak'
  issued_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT now() + INTERVAL '12 months',
  redeemed BOOLEAN DEFAULT false
);

-- Indexes
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_task_responses_worker ON task_responses(worker_id);
CREATE INDEX idx_transactions_worker ON transactions(worker_id);
CREATE INDEX idx_points_worker_redeemed ON points_ledger(worker_id, redeemed);

-- Row-Level Security
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;

-- RLS Policies (workers can only see their own data)
CREATE POLICY "Workers can view own profile"
  ON workers FOR SELECT
  USING (auth.uid() = id);

-- (Additional RLS policies defined in SDD Section 3.6)
```

**Environment Setup:**
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

**Acceptance:**
- All tables created successfully in Supabase dashboard
- RLS policies active (verified by attempting unauthorized access)
- Connection test from Next.js succeeds

#### Task 1.4: Authentication Skeleton → **[G-2]**

**Worker Auth (Wallet-based):**
```typescript
// lib/auth/wallet.ts
import { supabase } from '@/lib/supabase';

export async function verifyWalletSignature(
  walletAddress: string,
  signature: string,
  message: string
): Promise<{ success: boolean; token?: string }> {
  // Verify signature (viem)
  const isValid = await verifyMessage({ address: walletAddress, message, signature });
  if (!isValid) return { success: false };

  // Create or get worker session
  const { data, error } = await supabase.auth.signInWithPassword({
    email: `${walletAddress}@wallet.bawo.work`, // synthetic email
    password: signature, // signature as password (hashed in DB)
  });

  if (error) {
    // First-time wallet, create account
    const { data: newUser } = await supabase.auth.signUp({
      email: `${walletAddress}@wallet.bawo.work`,
      password: signature,
    });
    // Create worker record
    await supabase.from('workers').insert({ wallet_address: walletAddress });
    return { success: true, token: newUser.session?.access_token };
  }

  return { success: true, token: data.session?.access_token };
}
```

**Client Auth (Email/Password):**
```typescript
// app/api/v1/auth/client/login/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return NextResponse.json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } }, { status: 401 });
  }

  return NextResponse.json({ data: { token: data.session.access_token, userId: data.user.id } });
}
```

**Acceptance:**
- `/api/v1/auth/wallet/verify` endpoint returns JWT token for valid signature
- `/api/v1/auth/client/login` endpoint returns JWT token for valid credentials
- Invalid credentials return 401 Unauthorized

#### Task 1.5: CI/CD Pipeline → **[G-1]**

**GitHub Actions Workflow:**
```yaml
# .github/workflows/ci.yml
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

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test:unit
```

**Vercel Integration:**
- Connect GitHub repository to Vercel
- Configure preview deployments for all PRs
- Set environment variables in Vercel dashboard

**Acceptance:**
- PR triggers CI pipeline within 30 seconds
- Failing lint/tests block merge
- Preview URL generated for each PR

#### Task 1.6: Development Environment Documentation → **[G-1]**

```markdown
# README.md

## Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Create Supabase project at https://supabase.com
4. Run migrations: `npx supabase db push`
5. Copy `.env.example` to `.env.local` and fill in credentials
6. Start dev server: `npm run dev`

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run test:unit` - Run unit tests
- `npm run type-check` - TypeScript type checking

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui
- Supabase (Postgres + Auth)
- Celo (blockchain payments)
- Self Protocol (identity verification)
```

**Acceptance:** New developer can follow README and get dev server running within 15 minutes

### Dependencies

None (first sprint)

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Supabase free tier rate limits | Medium | Medium | Monitor usage, upgrade to Pro ($25/mo) if needed |
| Vercel cold start latency | Low | Medium | Use edge functions where possible, monitor with BetterStack |
| Team unfamiliarity with Next.js 14 App Router | Medium | Low | Follow official docs, use TypeScript for type safety |

### Success Metrics

- All 8 database tables created successfully
- CI pipeline runs on every PR (100% coverage)
- Local dev environment setup time <15 minutes (measured via README walkthrough)
- Zero TypeScript errors in codebase (`tsc --noEmit` passes)

### PRD/SDD References

- PRD Section 7.1 (Technology Stack)
- PRD Section 8.2 (Browser Support)
- SDD Section 1.2 (Architectural Pattern)
- SDD Section 2 (Software Stack)
- SDD Section 3 (Database Design)
- SDD Section 8 (Development Phases - Phase 1)

---

## Sprint 2: Worker Onboarding

**Global Sprint ID:** 2 (cycle-001)
**Duration:** 2.5 days
**Dates:** TBD

### Sprint Goal

Build complete worker onboarding flow with MiniPay wallet auto-connect, Self Protocol verification (with phone fallback), and worker profile creation.

### Deliverables

- [ ] MiniPay browser detection and wallet auto-connect
- [ ] Self Protocol SDK integration for NFC passport verification
- [ ] Phone verification fallback for Level 1 access
- [ ] Worker profile creation and storage
- [ ] Verification badge UI component
- [ ] Worker dashboard skeleton (profile, stats, available tasks placeholder)

### Acceptance Criteria

- [ ] Worker opening PWA in MiniPay sees wallet auto-connect within 2 seconds
- [ ] Worker can scan NFC passport and receive verification badge within 60 seconds
- [ ] If Self Protocol unavailable, worker can verify phone via MiniPay and access Level 1 tasks
- [ ] Worker profile displays: wallet address (last 6 chars), verification level, reputation score
- [ ] Worker can navigate between Profile, Tasks, and Earnings tabs
- [ ] Bundle size remains <150kb gzipped

### Technical Tasks

#### Task 2.1: MiniPay Wallet Detection & Auto-Connect → **[G-2]**

**Detection Logic:**
```typescript
// lib/wallet/minipay.ts
export function isMiniPayBrowser(): boolean {
  if (typeof window === 'undefined') return false;

  // MiniPay injects window.ethereum with specific properties
  return (
    window.ethereum?.isMiniPay === true ||
    window.ethereum?.isMetaMask === true && // MiniPay uses MetaMask interface
    navigator.userAgent.includes('Opera Mini')
  );
}

export async function autoConnectMiniPay(): Promise<string | null> {
  if (!isMiniPayBrowser()) return null;

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    return accounts[0]; // Return wallet address
  } catch (error) {
    console.error('MiniPay connection failed:', error);
    return null;
  }
}
```

**Component:**
```tsx
// components/wallet/WalletConnector.tsx
'use client';

import { useEffect, useState } from 'react';
import { autoConnectMiniPay } from '@/lib/wallet/minipay';

export function WalletConnector() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(true);

  useEffect(() => {
    autoConnectMiniPay()
      .then(address => {
        if (address) setWalletAddress(address);
        setConnecting(false);
      });
  }, []);

  if (connecting) return <div>Connecting wallet...</div>;
  if (!walletAddress) return <div>Open in MiniPay to continue</div>;

  return (
    <div className="text-sm text-muted-foreground">
      Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
    </div>
  );
}
```

**Acceptance:**
- Wallet auto-connects in MiniPay within 2 seconds
- Non-MiniPay browsers see "Open in MiniPay" message

**PRD Reference:** PRD Section 5.1 Feature 1 (MiniPay Wallet Auto-Connect)

#### Task 2.2: Self Protocol SDK Integration → **[G-2]**

**Critical Path Validation (Week 1-2):**
> "Complete SDK integration test, verify NFC passport support on Tecno, Infinix, Samsung A-series, confirm ZK proof verification times" (PRD Section 5.1)

**Installation:**
```bash
npm install @selfprotocol/sdk
```

**Integration:**
```typescript
// lib/identity/self-protocol.ts
import { SelfSDK } from '@selfprotocol/sdk';

const selfSDK = new SelfSDK({
  apiKey: process.env.SELF_PROTOCOL_API_KEY!,
  network: 'celo-mainnet',
});

export async function initiatePassportVerification(walletAddress: string): Promise<string> {
  const session = await selfSDK.createVerificationSession({
    address: walletAddress,
    verificationType: 'nfc-passport',
  });
  return session.verificationUrl; // Worker scans this with phone
}

export async function checkVerificationStatus(sessionId: string): Promise<{
  verified: boolean;
  did?: string; // Decentralized Identifier
  level: number; // 0-3
}> {
  const result = await selfSDK.getVerificationStatus(sessionId);

  if (result.status === 'verified') {
    return {
      verified: true,
      did: result.did,
      level: 2, // Level 2 = Self Protocol verified
    };
  }

  return { verified: false, level: 0 };
}
```

**Component:**
```tsx
// components/onboarding/SelfVerification.tsx
'use client';

import { useState } from 'react';
import { initiatePassportVerification } from '@/lib/identity/self-protocol';
import { Button } from '@/components/ui/button';

export function SelfVerification({ walletAddress }: { walletAddress: string }) {
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    const url = await initiatePassportVerification(walletAddress);
    setVerificationUrl(url);
    setLoading(false);
  };

  if (verificationUrl) {
    return (
      <div>
        <p>Scan your passport with NFC</p>
        <a href={verificationUrl} target="_blank">Open Verification</a>
      </div>
    );
  }

  return (
    <Button onClick={handleVerify} disabled={loading}>
      {loading ? 'Starting...' : 'Verify with Self Protocol'}
    </Button>
  );
}
```

**Acceptance:**
- Verification session created successfully
- NFC passport scan works on test device (Tecno/Infinix/Samsung A-series)
- ZK proof verification completes in <60 seconds
- Worker record updated with `self_protocol_did` and `verification_level: 2`

**Fallback Implementation:** If Self Protocol unavailable, skip this task and implement phone verification only

**PRD Reference:** PRD Section 5.1 Feature 2 (Self Protocol Identity Verification), PRD Section 7.4 (Self Protocol Integration)

#### Task 2.3: Phone Verification Fallback → **[G-2]**

**Rationale:** "If Self unavailable, phone verification via MiniPay for Level 1 access" (PRD Section 5.1)

**Implementation:**
```typescript
// lib/identity/phone-verify.ts
export async function sendPhoneVerificationCode(phoneNumber: string): Promise<string> {
  // Use Supabase Auth phone verification
  const { data, error } = await supabase.auth.signInWithOtp({
    phone: phoneNumber,
  });

  if (error) throw error;
  return data.session?.access_token || '';
}

export async function verifyPhoneCode(phoneNumber: string, code: string): Promise<boolean> {
  const { error } = await supabase.auth.verifyOtp({
    phone: phoneNumber,
    token: code,
    type: 'sms',
  });

  return !error;
}
```

**Component:**
```tsx
// components/onboarding/PhoneVerification.tsx
'use client';

export function PhoneVerification() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  const handleSendCode = async () => {
    await sendPhoneVerificationCode(phone);
    setCodeSent(true);
  };

  const handleVerifyCode = async () => {
    const verified = await verifyPhoneCode(phone, code);
    if (verified) {
      // Update worker verification_level to 1
      await supabase.from('workers').update({ verification_level: 1 }).eq('phone', phone);
    }
  };

  // UI implementation...
}
```

**Acceptance:**
- Worker receives SMS code within 30 seconds
- Correct code grants Level 1 access
- Worker record updated with `verification_level: 1`

**PRD Reference:** PRD Section 5.1 Feature 2 (Fallback: phone verification)

#### Task 2.4: Worker Profile Creation → **[G-2]**

**API Endpoint:**
```typescript
// app/api/v1/workers/profile/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const walletAddress = request.headers.get('x-wallet-address');

  const { data: worker } = await supabase
    .from('workers')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();

  return NextResponse.json({ data: worker });
}

export async function PUT(request: Request) {
  const walletAddress = request.headers.get('x-wallet-address');
  const updates = await request.json();

  const { data, error } = await supabase
    .from('workers')
    .update(updates)
    .eq('wallet_address', walletAddress)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: { code: 'UPDATE_FAILED', message: error.message } }, { status: 400 });
  }

  return NextResponse.json({ data });
}
```

**UI Component:**
```tsx
// app/workers/profile/page.tsx
export default function ProfilePage() {
  return (
    <div>
      <h1>Your Profile</h1>
      <div>
        <p>Wallet: {worker.wallet_address.slice(0, 6)}...{worker.wallet_address.slice(-4)}</p>
        <p>Level: {worker.verification_level}</p>
        <p>Reputation: {worker.reputation_score}/100</p>
        <p>Tasks Completed: {worker.total_tasks_completed}</p>
        <p>Accuracy: {worker.accuracy_rate}%</p>
      </div>
      {worker.verification_level < 2 && (
        <SelfVerification walletAddress={worker.wallet_address} />
      )}
    </div>
  );
}
```

**Acceptance:**
- Worker profile page displays all fields correctly
- Profile updates persist to database
- Verification badge displays when `verification_level >= 2`

#### Task 2.5: Worker Dashboard Skeleton → **[G-1]**

**Layout:**
```tsx
// app/workers/layout.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-warm-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-display font-bold text-warm-900">Bawo</h1>
        </div>
      </header>

      <Tabs defaultValue="tasks" className="container mx-auto px-4 py-6">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          {children}
        </TabsContent>
        <TabsContent value="profile">
          <ProfilePage />
        </TabsContent>
        <TabsContent value="earnings">
          <EarningsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

**Acceptance:**
- Tabs navigate correctly
- Mobile UI follows design system (warm color palette, 48x48px touch targets)
- Layout renders in <3s on 3G (simulated)

**DESIGN.md Reference:** DESIGN.md Section 4 (Color System), Section 7 (Accessibility)

### Dependencies

- Sprint 1: Database schema, authentication skeleton

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Self Protocol SDK integration fails | **Medium** | **High** | **Validate Week 1-2; fallback to phone-only verification (Level 1)** |
| MiniPay detection unreliable | Low | Medium | Test on multiple devices, add manual "Connect Wallet" button as backup |
| NFC not supported on common devices | Medium | High | Document device compatibility, prioritize phone verification fallback |
| Bundle size exceeds 150kb | Medium | Medium | Use dynamic imports, tree-shaking, monitor with Webpack Bundle Analyzer |

### Success Metrics

- 90%+ wallet auto-connect success rate (MiniPay users)
- Self Protocol verification completes in <60 seconds (measured on Tecno device)
- Phone verification fallback works 100% of the time
- Bundle size <150kb gzipped (measured with `npm run analyze`)
- Onboarding completion rate >80% (tracked via PostHog)

### PRD/SDD References

- PRD Section 5.1 Features 1-2 (MiniPay, Self Protocol)
- PRD Section 7.4 (Self Protocol Integration)
- PRD Section 8.1 (Performance Targets)
- SDD Section 1.4 (Identity Service)
- SDD Section 8 (Development Phases - Phase 1)

---

## Sprint 3: Task Engine Core

**Global Sprint ID:** 3 (cycle-001)
**Duration:** 2-2.5 days
**Dates:** TBD

### Sprint Goal

Build task engine with sentiment analysis and text classification task types, task UI with timer, submission flow, and golden task QA injection.

### Deliverables

- [ ] Task type: Sentiment Analysis (Positive/Negative/Neutral)
- [ ] Task type: Text Classification (predefined categories)
- [ ] Task assignment algorithm (queue in Redis)
- [ ] Task UI component with countdown timer (45 seconds sentiment, 30 seconds classification)
- [ ] Task submission API with validation
- [ ] Golden task injection (10% of tasks)
- [ ] Reputation scoring based on golden task accuracy

### Acceptance Criteria

- [ ] Worker sees list of available tasks filtered by verification level
- [ ] Clicking "Start Task" assigns task to worker and starts timer
- [ ] Timer counts down visibly, expires task if time runs out
- [ ] Worker can submit response (sentiment or classification) within time limit
- [ ] Golden tasks injected randomly (10% of total), worker cannot distinguish them
- [ ] Worker accuracy tracked and reputation updated after golden task validation
- [ ] Tasks load in <2s on 3G connection

### Technical Tasks

#### Task 3.1: Sentiment Analysis Task Type → **[G-3]**

**Task Schema:**
```typescript
// lib/types/tasks.ts
export type SentimentTask = {
  id: string;
  project_id: string;
  content: string; // max 500 chars
  task_type: 'sentiment';
  is_golden: boolean;
  golden_answer?: 'positive' | 'negative' | 'neutral';
  time_limit: 45; // seconds
};

export type SentimentResponse = {
  task_id: string;
  worker_id: string;
  response: 'positive' | 'negative' | 'neutral';
  response_time_seconds: number;
};
```

**Component:**
```tsx
// components/tasks/SentimentTask.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export function SentimentTask({ task }: { task: SentimentTask }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(task.time_limit);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async () => {
    const responseTime = Math.floor((Date.now() - startTime) / 1000);
    await submitTask(task.id, { response: selected, responseTime });
  };

  const handleTimeout = () => {
    // Return task to queue
    returnTaskToQueue(task.id);
  };

  return (
    <div className="p-4">
      <div className="mb-4 text-sm text-muted-foreground">
        Time remaining: {timeRemaining}s
      </div>

      <div className="mb-6 text-lg">
        {task.content}
      </div>

      <div className="space-y-2">
        <Button
          variant={selected === 'positive' ? 'default' : 'outline'}
          onClick={() => setSelected('positive')}
          className="w-full h-12"
        >
          😊 Positive
        </Button>
        <Button
          variant={selected === 'negative' ? 'default' : 'outline'}
          onClick={() => setSelected('negative')}
          className="w-full h-12"
        >
          😞 Negative
        </Button>
        <Button
          variant={selected === 'neutral' ? 'default' : 'outline'}
          onClick={() => setSelected('neutral')}
          className="w-full h-12"
        >
          😐 Neutral
        </Button>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!selected || timeRemaining === 0}
        className="w-full mt-4 h-12"
      >
        Submit
      </Button>
    </div>
  );
}
```

**Acceptance:**
- Task displays text content (max 500 chars)
- Timer counts down from 45 seconds
- Worker can select one of three options
- Submit button disabled until selection made
- Task returns to queue if timer expires

**PRD Reference:** PRD Section 5.1 Feature 3 (Sentiment Analysis Task Type)

#### Task 3.2: Text Classification Task Type → **[G-3]**

**Task Schema:**
```typescript
export type ClassificationTask = {
  id: string;
  project_id: string;
  content: string;
  task_type: 'classification';
  categories: string[]; // Client-defined categories
  is_golden: boolean;
  golden_answer?: string;
  time_limit: 30; // seconds
};
```

**Component:**
```tsx
// components/tasks/ClassificationTask.tsx
export function ClassificationTask({ task }: { task: ClassificationTask }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div>
      <div className="mb-4">{task.content}</div>

      <div className="space-y-2">
        {task.categories.map(category => (
          <Button
            key={category}
            variant={selected === category ? 'default' : 'outline'}
            onClick={() => setSelected(category)}
            className="w-full h-12"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Submit logic same as SentimentTask */}
    </div>
  );
}
```

**Acceptance:**
- Categories display as buttons (scrollable if >5)
- Selection works correctly
- Submit within 30 seconds

**PRD Reference:** PRD Section 5.1 Feature 4 (Text Classification Task Type)

#### Task 3.3: Task Assignment Algorithm → **[G-3]**

**Redis Queue Setup:**
```typescript
// lib/queue/task-queue.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function queueTask(taskId: string, requiredLevel: number = 0): Promise<void> {
  // Add to queue sorted by priority (higher level tasks = higher priority)
  await redis.zadd(`tasks:queue:level_${requiredLevel}`, {
    score: Date.now(),
    member: taskId,
  });
}

export async function getAvailableTasks(workerLevel: number, limit: number = 10): Promise<string[]> {
  // Get tasks from worker's level and below
  const taskIds: string[] = [];

  for (let level = workerLevel; level >= 0; level--) {
    const ids = await redis.zrange(`tasks:queue:level_${level}`, 0, limit - taskIds.length - 1);
    taskIds.push(...ids);
    if (taskIds.length >= limit) break;
  }

  return taskIds;
}

export async function assignTask(taskId: string, workerId: string): Promise<void> {
  // Remove from queue, mark as assigned
  await redis.zrem('tasks:queue', taskId);
  await redis.setex(`task:assigned:${taskId}`, 300, workerId); // 5 min expiry

  // Update database
  await supabase
    .from('tasks')
    .update({ status: 'assigned', assigned_to: [workerId] })
    .eq('id', taskId);
}
```

**API Endpoint:**
```typescript
// app/api/v1/tasks/available/route.ts
export async function GET(request: Request) {
  const walletAddress = request.headers.get('x-wallet-address');

  // Get worker verification level
  const { data: worker } = await supabase
    .from('workers')
    .select('verification_level')
    .eq('wallet_address', walletAddress)
    .single();

  // Get available tasks from Redis
  const taskIds = await getAvailableTasks(worker.verification_level, 10);

  // Fetch task details from DB
  const { data: tasks } = await supabase
    .from('tasks')
    .select('*')
    .in('id', taskIds)
    .eq('status', 'pending');

  return NextResponse.json({ data: tasks });
}
```

**Acceptance:**
- Tasks queued in Redis successfully
- Workers only see tasks matching their verification level
- Task assignment prevents duplicate assignment (lock in Redis)

**SDD Reference:** SDD Section 1.4 (Task Engine)

#### Task 3.4: Task Submission API → **[G-3]**

**API Endpoint:**
```typescript
// app/api/v1/tasks/[id]/submit/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { response, responseTime } = await request.json();
  const walletAddress = request.headers.get('x-wallet-address');

  // Get worker
  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single();

  // Get task
  const { data: task } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!task) {
    return NextResponse.json({ error: { code: 'TASK_NOT_FOUND' } }, { status: 404 });
  }

  // Insert response
  const { data: taskResponse } = await supabase
    .from('task_responses')
    .insert({
      task_id: params.id,
      worker_id: worker.id,
      response,
      response_time_seconds: responseTime,
    })
    .select()
    .single();

  // Check if golden task
  if (task.is_golden) {
    const isCorrect = task.golden_answer === response;
    await supabase
      .from('task_responses')
      .update({ is_correct: isCorrect })
      .eq('id', taskResponse.id);

    // Update worker reputation
    await updateWorkerReputation(worker.id, isCorrect);
  }

  // Check if consensus reached (need 3 responses)
  const { count } = await supabase
    .from('task_responses')
    .select('*', { count: 'exact', head: true })
    .eq('task_id', params.id);

  if (count === 3) {
    // Calculate consensus (implemented in Sprint 4)
    await calculateConsensus(params.id);
  }

  return NextResponse.json({ data: { success: true, earned: task.is_golden ? 0 : 0.05 } });
}
```

**Acceptance:**
- Task response saved to database
- Golden task validation happens immediately
- Worker reputation updated after golden task
- Response time recorded accurately

**PRD Reference:** PRD Section 5.1 Features 3-4 (Task submission)

#### Task 3.5: Golden Task Injection → **[G-3]**

**Implementation:**
```typescript
// lib/qa/golden-tasks.ts
export function shouldInjectGoldenTask(): boolean {
  return Math.random() < 0.1; // 10% probability
}

export async function createGoldenTask(projectId: string, content: string, correctAnswer: string): Promise<void> {
  await supabase.from('tasks').insert({
    project_id: projectId,
    content,
    task_type: 'sentiment',
    is_golden: true,
    golden_answer: correctAnswer,
  });
}

export async function updateWorkerReputation(workerId: string, correct: boolean): Promise<void> {
  const { data: worker } = await supabase
    .from('workers')
    .select('total_tasks_completed, accuracy_rate')
    .eq('id', workerId)
    .single();

  const newTotal = worker.total_tasks_completed + 1;
  const newAccuracy = ((worker.accuracy_rate * worker.total_tasks_completed) + (correct ? 100 : 0)) / newTotal;
  const newReputation = Math.min(100, newAccuracy * 0.7 + (newTotal * 0.001)); // Weighted formula

  await supabase
    .from('workers')
    .update({
      total_tasks_completed: newTotal,
      accuracy_rate: newAccuracy,
      reputation_score: newReputation,
    })
    .eq('id', workerId);
}
```

**CSV Upload with Golden Tasks:**
```typescript
// When client uploads CSV, inject golden tasks
const regularTasks = parseCSV(file);
const goldenTasks = regularTasks.slice(0, Math.ceil(regularTasks.length * 0.1)); // 10% as golden
// Manually label golden tasks (client labels 10% themselves)
```

**Acceptance:**
- Golden tasks injected at 10% rate (verified by database query)
- Workers cannot distinguish golden from regular tasks (no UI difference)
- Accuracy tracked per worker
- Reputation score updates after each golden task

**PRD Reference:** PRD Section 5.1 Feature 7 (Golden Task QA System)

#### Task 3.6: Reputation Scoring Dashboard → **[G-3]**

**Component:**
```tsx
// components/workers/ReputationBadge.tsx
export function ReputationBadge({ score }: { score: number }) {
  const tier = score >= 80 ? 'Gold' : score >= 60 ? 'Silver' : 'Bronze';
  const color = score >= 80 ? 'yellow' : score >= 60 ? 'gray' : 'orange';

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-${color}-100 text-${color}-800 rounded-full`}>
      <span className="text-sm font-semibold">{tier}</span>
      <span className="text-xs">{score}/100</span>
    </div>
  );
}
```

**Acceptance:**
- Reputation badge displays on worker profile
- Tier calculated correctly (Bronze <60, Silver 60-79, Gold 80+)

### Dependencies

- Sprint 2: Worker onboarding, authentication

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Redis queue latency | Low | Medium | Monitor with BetterStack, use Upstash's global replication |
| Golden task detection by workers | Medium | High | Randomize golden task distribution, use diverse content |
| Timer implementation bugs (timezone issues) | Low | Low | Use `Date.now()` for client-side timer, validate server-side |
| Task assignment race conditions | Medium | Medium | Use Redis locks (`SETNX`) for atomic assignment |

### Success Metrics

- Task load time <2s on 3G (measured with Lighthouse)
- Timer accuracy ±1 second (tested across devices)
- Golden task injection rate exactly 10% (database query)
- Zero duplicate task assignments (monitored via Redis locks)
- Task submission success rate >95% (excluding timeouts)

### PRD/SDD References

- PRD Section 5.1 Features 3-4, 7 (Sentiment, Classification, Golden Tasks)
- PRD Section 8.1 (Performance: Task load time <2s)
- SDD Section 1.4 (Task Engine component)
- SDD Section 1.5 (Worker Task Completion Flow)

---

## Sprint 4: Payment Infrastructure

**Global Sprint ID:** 4 (cycle-001)
**Duration:** 2.5 days
**Dates:** TBD

### Sprint Goal

Integrate Celo blockchain for instant stablecoin payments, implement consensus mechanism, enable worker earnings tracking, and build withdrawal flow to MiniPay.

### Deliverables

- [ ] Celo blockchain integration (viem library)
- [ ] Fee abstraction setup (pay gas in cUSD)
- [ ] Consensus mechanism (3-worker redundancy, majority voting)
- [ ] Instant payment after consensus (cUSD to worker wallet)
- [ ] Worker earnings tracking (balance, transaction history)
- [ ] Withdrawal flow to MiniPay wallet
- [ ] Transaction logging and confirmation

### Acceptance Criteria

- [ ] Payment confirmed on Celo blockchain within 5 seconds
- [ ] Transaction fee <$0.01 per payment
- [ ] Consensus correctly identifies majority answer (2+ agree)
- [ ] All 3 workers paid when consensus reached
- [ ] No consensus: task escalated to expert review (flagged in DB)
- [ ] Worker balance updates in real-time (Supabase Realtime)
- [ ] Withdrawal to MiniPay completes in <5 seconds
- [ ] 100% of payments logged in transactions table

### Technical Tasks

#### Task 4.1: Celo Blockchain Integration → **[G-4]**

**Installation:**
```bash
npm install viem @celo/abis
```

**Celo Client Setup:**
```typescript
// lib/blockchain/celo-client.ts
import { createWalletClient, createPublicClient, http } from 'viem';
import { celo } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: celo,
  transport: http('https://forno.celo.org'), // Public RPC endpoint
});

export const walletClient = createWalletClient({
  chain: celo,
  transport: http('https://forno.celo.org'),
  account: process.env.PLATFORM_HOT_WALLET_PRIVATE_KEY as `0x${string}`, // Platform hot wallet
});

// Celo cUSD token address
export const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a';
```

**Fee Abstraction (CIP-64):**
```typescript
// lib/blockchain/fee-abstraction.ts
export async function sendPaymentWithFeeAbstraction(
  toAddress: `0x${string}`,
  amountUSD: number
): Promise<`0x${string}`> {
  // Amount in cUSD (6 decimals)
  const amountWei = BigInt(Math.floor(amountUSD * 1_000_000));

  // CIP-64: Pay gas fees in cUSD instead of CELO
  const txHash = await walletClient.sendTransaction({
    to: CUSD_ADDRESS,
    data: encodeFunctionData({
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [toAddress, amountWei],
    }),
    feeCurrency: CUSD_ADDRESS, // Pay gas in cUSD
    type: '0x7b', // CIP-64 transaction type
  });

  return txHash;
}
```

**Acceptance:**
- Transaction confirmed on Celo mainnet
- Fee paid in cUSD (not CELO)
- Transaction fee <$0.01 (measured on-chain)

**PRD Reference:** PRD Section 5.1 Feature 5 (Instant Stablecoin Payment), PRD Section 7.1 (Celo fee abstraction)

#### Task 4.2: Consensus Mechanism → **[G-4]**

**Implementation:**
```typescript
// lib/consensus/calculate.ts
export type ConsensusResult = {
  consensusReached: boolean;
  finalLabel: string | null;
  confidence: number; // 0-1
  payWorkers: boolean;
  escalated: boolean;
};

export async function calculateConsensus(taskId: string): Promise<ConsensusResult> {
  // Get all 3 responses
  const { data: responses } = await supabase
    .from('task_responses')
    .select('worker_id, response')
    .eq('task_id', taskId)
    .order('submitted_at', { ascending: true });

  if (responses.length !== 3) {
    return { consensusReached: false, finalLabel: null, confidence: 0, payWorkers: false, escalated: false };
  }

  // Count votes
  const votes: Record<string, number> = {};
  responses.forEach(r => {
    votes[r.response] = (votes[r.response] || 0) + 1;
  });

  // Find majority (2+ agree)
  const majority = Object.entries(votes).find(([_, count]) => count >= 2);

  if (majority) {
    const [label, count] = majority;
    const confidence = count / 3; // 2/3 = 0.67, 3/3 = 1.0

    // Update task
    await supabase
      .from('tasks')
      .update({
        status: 'completed',
        consensus_label: label,
        consensus_confidence: confidence,
      })
      .eq('id', taskId);

    return {
      consensusReached: true,
      finalLabel: label,
      confidence,
      payWorkers: true,
      escalated: false,
    };
  } else {
    // No consensus, escalate
    await supabase
      .from('tasks')
      .update({ status: 'escalated' })
      .eq('id', taskId);

    return {
      consensusReached: false,
      finalLabel: null,
      confidence: 0,
      payWorkers: false,
      escalated: true,
    };
  }
}
```

**Acceptance:**
- Consensus reached when 2+ workers agree
- Confidence score calculated correctly (0.67 or 1.0)
- No consensus: task flagged as "escalated" in database
- All 3 workers paid when consensus reached

**PRD Reference:** PRD Section 5.1 Feature 8 (Consensus Mechanism)

#### Task 4.3: Instant Payment Flow → **[G-4]**

**Payment Trigger (after consensus):**
```typescript
// lib/payments/process-payment.ts
export async function payWorkers(taskId: string, workerIds: string[]): Promise<void> {
  const { data: task } = await supabase
    .from('tasks')
    .select('project_id')
    .eq('id', taskId)
    .single();

  const { data: project } = await supabase
    .from('projects')
    .select('price_per_task')
    .eq('id', task.project_id)
    .single();

  // Worker gets 60% of price (e.g., $0.05 if client pays $0.08)
  const workerPay = project.price_per_task * 0.6;

  for (const workerId of workerIds) {
    const { data: worker } = await supabase
      .from('workers')
      .select('wallet_address')
      .eq('id', workerId)
      .single();

    try {
      // Send payment via Celo
      const txHash = await sendPaymentWithFeeAbstraction(worker.wallet_address as `0x${string}`, workerPay);

      // Log transaction
      await supabase.from('transactions').insert({
        worker_id: workerId,
        amount_usd: workerPay,
        tx_type: 'task_payment',
        tx_hash: txHash,
        status: 'confirmed',
      });

      // Notify worker (Supabase Realtime)
      await supabase
        .from('workers')
        .update({ updated_at: new Date().toISOString() }) // Trigger realtime update
        .eq('id', workerId);

    } catch (error) {
      console.error('Payment failed:', error);
      // Log failed transaction
      await supabase.from('transactions').insert({
        worker_id: workerId,
        amount_usd: workerPay,
        tx_type: 'task_payment',
        status: 'failed',
      });
    }
  }
}
```

**Integration with Task Submission:**
```typescript
// app/api/v1/tasks/[id]/submit/route.ts (updated)
// ... after consensus calculation
if (consensusResult.payWorkers) {
  await payWorkers(params.id, [worker1Id, worker2Id, worker3Id]);
}
```

**Acceptance:**
- Payment transaction confirmed on-chain within 5 seconds
- Worker sees notification in MiniPay: "You earned $0.05 from Bawo"
- Transaction logged with `tx_hash`, `status: 'confirmed'`
- Failed payments logged with `status: 'failed'` for retry

**PRD Reference:** PRD Section 5.1 Feature 5 (Instant Stablecoin Payment), PRD Section 10.1 (Unit Economics)

#### Task 4.4: Worker Earnings Tracking → **[G-4]**

**API Endpoint:**
```typescript
// app/api/v1/workers/earnings/route.ts
export async function GET(request: Request) {
  const walletAddress = request.headers.get('x-wallet-address');

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single();

  // Get total earnings
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount_usd, tx_type, status, created_at')
    .eq('worker_id', worker.id)
    .eq('status', 'confirmed')
    .order('created_at', { ascending: false });

  const totalEarnings = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount_usd), 0);
  const todayEarnings = transactions
    .filter(tx => isToday(new Date(tx.created_at)))
    .reduce((sum, tx) => sum + parseFloat(tx.amount_usd), 0);

  return NextResponse.json({
    data: {
      totalEarnings,
      todayEarnings,
      transactionHistory: transactions,
    },
  });
}
```

**UI Component:**
```tsx
// components/workers/Earnings.tsx
export function EarningsCard() {
  const { data } = useSWR('/api/v1/workers/earnings', fetcher);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Your Earnings</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Today</p>
          <p className="text-2xl font-bold">${data.todayEarnings.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">All Time</p>
          <p className="text-2xl font-bold">${data.totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <h3 className="text-sm font-semibold mb-2">Recent Transactions</h3>
      <div className="space-y-2">
        {data.transactionHistory.slice(0, 5).map(tx => (
          <div key={tx.id} className="flex justify-between text-sm">
            <span>{tx.tx_type}</span>
            <span className="font-semibold">${tx.amount_usd}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Acceptance:**
- Earnings updated in real-time after payment
- Transaction history displays correctly
- Today's earnings calculated accurately (timezone: UTC)

#### Task 4.5: Withdrawal Flow → **[G-4]**

**API Endpoint:**
```typescript
// app/api/v1/payments/withdraw/route.ts
export async function POST(request: Request) {
  const { amount } = await request.json();
  const walletAddress = request.headers.get('x-wallet-address');

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single();

  // Calculate available balance
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount_usd, tx_type')
    .eq('worker_id', worker.id)
    .eq('status', 'confirmed');

  const totalEarned = transactions
    .filter(tx => tx.tx_type === 'task_payment')
    .reduce((sum, tx) => sum + parseFloat(tx.amount_usd), 0);

  const totalWithdrawn = transactions
    .filter(tx => tx.tx_type === 'withdrawal')
    .reduce((sum, tx) => sum + parseFloat(tx.amount_usd), 0);

  const availableBalance = totalEarned - totalWithdrawn;

  if (amount > availableBalance) {
    return NextResponse.json({ error: { code: 'INSUFFICIENT_BALANCE', message: `Available: $${availableBalance}` } }, { status: 400 });
  }

  // Send withdrawal
  const txHash = await sendPaymentWithFeeAbstraction(walletAddress as `0x${string}`, amount);

  // Log withdrawal
  await supabase.from('transactions').insert({
    worker_id: worker.id,
    amount_usd: -amount, // Negative amount for withdrawal
    tx_type: 'withdrawal',
    tx_hash: txHash,
    status: 'confirmed',
  });

  return NextResponse.json({ data: { success: true, txHash } });
}
```

**UI Component:**
```tsx
// components/workers/WithdrawButton.tsx
export function WithdrawButton({ availableBalance }: { availableBalance: number }) {
  const [amount, setAmount] = useState('');

  const handleWithdraw = async () => {
    const res = await fetch('/api/v1/payments/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount: parseFloat(amount) }),
    });

    if (res.ok) {
      toast.success('Withdrawal successful! Check MiniPay.');
    } else {
      const { error } = await res.json();
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Input
        type="number"
        placeholder="Amount to withdraw"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        max={availableBalance}
      />
      <Button onClick={handleWithdraw} disabled={!amount || parseFloat(amount) > availableBalance}>
        Withdraw to MiniPay
      </Button>
    </div>
  );
}
```

**Acceptance:**
- Withdrawal completes in <5 seconds
- Worker sees funds in MiniPay wallet immediately
- Withdrawal transaction logged with negative amount
- Available balance updated correctly

**PRD Reference:** PRD Section 5.1 Feature 6 (Withdrawal to MiniPay)

### Dependencies

- Sprint 3: Task submission, consensus calculation trigger

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Celo blockchain payment testing required | **High** | **High** | **Test on testnet first (Alfajores), validate transaction fees <$0.01** |
| Hot wallet private key security | High | **Critical** | Use environment variables, rotate every 90 days, monitor balance |
| Payment transaction failures | Medium | High | Implement retry logic with exponential backoff, log all failures |
| Gas price spikes | Low | Medium | Monitor gas prices, pause payments if >$0.05 per transaction |

### Success Metrics

- Payment confirmation time <5 seconds (measured on-chain)
- Transaction fee <$0.01 per payment (measured on-chain)
- Payment success rate >99% (excluding blockchain network issues)
- Zero duplicate payments (verified by unique task_id + worker_id in transactions)
- Consensus accuracy >95% (measured on golden tasks)

### PRD/SDD References

- PRD Section 5.1 Features 5-6, 8 (Instant Payment, Withdrawal, Consensus)
- PRD Section 7.1 (Celo blockchain, fee abstraction)
- PRD Section 10.1 (Unit Economics: worker gets 60%)
- SDD Section 1.4 (Payment Router component)
- SDD Section 1.5 (Worker Task Completion Flow)

---

## Sprint 5: Client Dashboard

**Global Sprint ID:** 5 (cycle-001)
**Duration:** 2 days
**Dates:** TBD

### Sprint Goal

Build self-serve client dashboard for project creation, CSV upload, real-time progress monitoring, and results download.

### Deliverables

- [ ] Client authentication (email/password)
- [ ] Project creation form with CSV upload (max 50MB)
- [ ] CSV parsing and task generation
- [ ] Project detail page with real-time progress (Supabase Realtime)
- [ ] Results download (CSV with labels + confidence scores)
- [ ] Quality metrics dashboard (accuracy, consensus rate, rejection rate)
- [ ] Client balance management (deposit crypto)

### Acceptance Criteria

- [ ] Client can sign up and log in with email/password
- [ ] Client can create project by uploading CSV, setting task type/instructions/price
- [ ] CSV preview shows first 10 rows before submission
- [ ] Tasks queued successfully after project creation
- [ ] Progress visible in real-time (completion percentage updates without refresh)
- [ ] Results CSV downloadable when project 100% complete
- [ ] Results CSV includes: original text + labels + confidence scores + worker IDs (anonymized)
- [ ] Quality metrics visible: accuracy %, consensus rate, task rejection rate

### Technical Tasks

#### Task 5.1: Client Authentication → **[G-5]**

**Sign-up/Login UI:**
```tsx
// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-6">Client Login</h1>
      <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button onClick={handleLogin}>Log In</Button>
    </div>
  );
}
```

**Acceptance:**
- Client can sign up with email/password
- Email verification required (Supabase built-in)
- Login redirects to `/dashboard`

#### Task 5.2: Project Creation Form → **[G-5]**

**UI Component:**
```tsx
// app/dashboard/projects/new/page.tsx
'use client';

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState('');
  const [taskType, setTaskType] = useState<'sentiment' | 'classification'>('sentiment');
  const [instructions, setInstructions] = useState('');
  const [pricePerTask, setPricePerTask] = useState(0.08);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Parse CSV and show preview
      parseCsvPreview(file).then(rows => setPreview(rows.slice(0, 10)));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('file', csvFile!);
    formData.append('projectName', projectName);
    formData.append('taskType', taskType);
    formData.append('instructions', instructions);
    formData.append('pricePerTask', pricePerTask.toString());

    const res = await fetch('/api/v1/projects', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const { data } = await res.json();
      router.push(`/dashboard/projects/${data.id}`);
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>

      <Input placeholder="Project Name" value={projectName} onChange={e => setProjectName(e.target.value)} />

      <Select value={taskType} onValueChange={setTaskType}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sentiment">Sentiment Analysis</SelectItem>
          <SelectItem value="classification">Text Classification</SelectItem>
        </SelectContent>
      </Select>

      <Textarea placeholder="Task Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} />

      <Input type="number" placeholder="Price per Task (USD)" value={pricePerTask} onChange={e => setPricePerTask(parseFloat(e.target.value))} />

      <Input type="file" accept=".csv" onChange={handleFileChange} />

      {preview.length > 0 && (
        <div>
          <h3>CSV Preview (first 10 rows)</h3>
          <table>
            <thead>
              <tr><th>Text</th></tr>
            </thead>
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}><td>{row.text}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Button onClick={handleSubmit} disabled={!csvFile || !projectName}>
        Create Project
      </Button>
    </div>
  );
}
```

**Acceptance:**
- CSV upload accepts files up to 50MB
- Preview shows first 10 rows
- Project created successfully after form submission

**PRD Reference:** PRD Section 5.1 Feature 9 (Client Dashboard - Project Creation)

#### Task 5.3: CSV Parsing & Task Generation → **[G-5]**

**API Endpoint:**
```typescript
// app/api/v1/projects/route.ts
import { parse } from 'csv-parse/sync';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const projectName = formData.get('projectName') as string;
  const taskType = formData.get('taskType') as string;
  const instructions = formData.get('instructions') as string;
  const pricePerTask = parseFloat(formData.get('pricePerTask') as string);

  // Parse CSV
  const csvText = await file.text();
  const rows = parse(csvText, { columns: true, skip_empty_lines: true });

  // Create project
  const { data: project } = await supabase
    .from('projects')
    .insert({
      name: projectName,
      task_type: taskType,
      instructions,
      price_per_task: pricePerTask,
      total_tasks: rows.length,
      client_id: request.headers.get('x-user-id'),
    })
    .select()
    .single();

  // Create tasks (batch insert)
  const tasks = rows.map(row => ({
    id: uuidv4(),
    project_id: project.id,
    content: row.text || row.content, // Support both column names
    task_type: taskType,
    is_golden: false, // Client can manually mark golden tasks separately
  }));

  await supabase.from('tasks').insert(tasks);

  // Queue tasks in Redis
  for (const task of tasks) {
    await queueTask(task.id, 0); // Level 0 = available to all workers
  }

  return NextResponse.json({ data: project });
}
```

**Acceptance:**
- CSV parsed correctly (handle common formats)
- Tasks created in database (batch insert for performance)
- Tasks queued in Redis for worker assignment

**PRD Reference:** PRD Section 5.1 Feature 9 (CSV upload, task generation)

#### Task 5.4: Project Detail Page with Real-Time Progress → **[G-5]**

**UI Component:**
```tsx
// app/dashboard/projects/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fetch project
    supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()
      .then(({ data }) => setProject(data));

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`project:${params.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'projects',
        filter: `id=eq.${params.id}`,
      }, payload => {
        setProject(payload.new);
        setProgress((payload.new.completed_tasks / payload.new.total_tasks) * 100);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h1>{project.name}</h1>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span>Progress</span>
          <span>{project.completed_tasks} / {project.total_tasks}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Accuracy</p>
          <p className="text-2xl font-bold">92%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Consensus Rate</p>
          <p className="text-2xl font-bold">98%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Avg Response Time</p>
          <p className="text-2xl font-bold">23s</p>
        </div>
      </div>

      {project.completed_tasks === project.total_tasks && (
        <Button onClick={() => downloadResults(project.id)}>
          Download Results
        </Button>
      )}
    </div>
  );
}
```

**Acceptance:**
- Progress updates in real-time (no refresh required)
- Quality metrics calculated and displayed
- Download button appears when project 100% complete

**PRD Reference:** PRD Section 5.1 Feature 10 (Results download, quality metrics)

#### Task 5.5: Results Download (CSV Export) → **[G-5]**

**API Endpoint:**
```typescript
// app/api/v1/projects/[id]/results/route.ts
import { stringify } from 'csv-stringify/sync';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Fetch project tasks with responses
  const { data: tasks } = await supabase
    .from('tasks')
    .select(`
      id,
      content,
      consensus_label,
      consensus_confidence,
      task_responses (worker_id, response, response_time_seconds)
    `)
    .eq('project_id', params.id)
    .eq('status', 'completed');

  // Format results
  const results = tasks.map(task => ({
    original_text: task.content,
    final_label: task.consensus_label,
    confidence: task.consensus_confidence,
    worker_1_response: task.task_responses[0]?.response,
    worker_2_response: task.task_responses[1]?.response,
    worker_3_response: task.task_responses[2]?.response,
    avg_response_time: (
      task.task_responses.reduce((sum, r) => sum + r.response_time_seconds, 0) / 3
    ).toFixed(1),
  }));

  // Generate CSV
  const csv = stringify(results, { header: true });

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="project_${params.id}_results.csv"`,
    },
  });
}
```

**Acceptance:**
- CSV includes all required fields (original text, labels, confidence, worker responses)
- Worker IDs anonymized (use `worker_1`, `worker_2`, `worker_3` instead of UUIDs)
- CSV downloads immediately when clicking "Download Results"

**PRD Reference:** PRD Section 5.1 Feature 10 (Results download)

### Dependencies

- Sprint 1: Database schema, authentication
- Sprint 3: Task engine (for task generation)
- Sprint 4: Consensus calculation (for results CSV)

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Large CSV files (>50MB) slow down upload | Medium | Medium | Implement streaming CSV parser, show upload progress |
| Supabase Realtime delays | Low | Low | Acceptable latency (<2s), fallback to polling if Realtime fails |
| CSV format inconsistencies | High | Medium | Support common formats (comma/tab delimited, with/without headers) |

### Success Metrics

- CSV upload success rate >95%
- Project creation completes in <10 seconds (for 5K row CSV)
- Real-time progress updates within 2 seconds of task completion
- Results CSV download completes in <5 seconds

### PRD/SDD References

- PRD Section 5.1 Features 9-10 (Client Dashboard)
- PRD Section 3.3 (Primary Client Persona - Dr. Sarah Chen)
- SDD Section 1.4 (Client Dashboard component)
- SDD Section 1.5 (Client Project Creation Flow)

---

## Sprint 6: Gamification & Polish

**Global Sprint ID:** 6 (cycle-001)
**Duration:** 2.5 days
**Dates:** TBD

### Sprint Goal

Complete MVP with gamification features (points program, referrals, streaks, leaderboards), RLHF preference ranking tasks, offline task caching, and performance optimization for 3G networks.

### Deliverables

- [ ] Points program implementation (earning, redemption, expiry)
- [ ] Referral program (two-sided bonuses: $1 referrer, $0.50 referee after 10 tasks)
- [ ] Streak rewards (7-day: $0.50, 30-day: $5)
- [ ] Leaderboards (weekly top earners, monthly quality champions)
- [ ] RLHF preference ranking task type
- [ ] Offline task caching (Service Workers + IndexedDB)
- [ ] Performance optimization (bundle size <150kb, load time <3s on 3G)
- [ ] MVP launch readiness checklist

### Acceptance Criteria

- [ ] Workers earn points for training tasks, golden task bonuses, referrals, streaks
- [ ] Points redemption enforced: requires revenue pool, caps at 20% monthly revenue, respects expiry
- [ ] Referral link generation works, referee gets bonus after 10 completed tasks
- [ ] Streak tracking accurate (7-day, 30-day), bonus paid automatically
- [ ] Leaderboards display top 10 workers (weekly earnings, monthly quality)
- [ ] RLHF tasks allow workers to select preferred AI response (A or B)
- [ ] Tasks cached offline, submissions queued when offline, sync when reconnected
- [ ] Bundle size <150kb gzipped (verified with `npm run analyze`)
- [ ] Initial load <3s on 3G (verified with Lighthouse 3G throttling)

### Technical Tasks

#### Task 6.1: Points Program Implementation → **[G-6]**

**Points Earning:**
```typescript
// lib/points/award.ts
export async function awardPoints(
  workerId: string,
  points: number,
  activityType: string
): Promise<void> {
  await supabase.from('points_ledger').insert({
    worker_id: workerId,
    points,
    activity_type: activityType,
    issued_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 12 months
    redeemed: false,
  });
}

// Award points after training task completion
await awardPoints(workerId, 5, 'training_task');

// Award bonus for golden task pass
if (isGoldenTaskCorrect) {
  await awardPoints(workerId, 2, 'golden_bonus');
}
```

**Points Redemption:**
```typescript
// app/api/v1/points/redeem/route.ts
export async function POST(request: Request) {
  const { pointsToRedeem } = await request.json();
  const walletAddress = request.headers.get('x-wallet-address');

  const { data: worker } = await supabase
    .from('workers')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single();

  // Check available points (non-redeemed, non-expired)
  const { data: pointsRecords } = await supabase
    .from('points_ledger')
    .select('points')
    .eq('worker_id', worker.id)
    .eq('redeemed', false)
    .gt('expires_at', new Date().toISOString());

  const availablePoints = pointsRecords.reduce((sum, r) => sum + r.points, 0);

  if (pointsToRedeem > availablePoints) {
    return NextResponse.json({ error: { code: 'INSUFFICIENT_POINTS' } }, { status: 400 });
  }

  // Check redemption pool (20% of monthly revenue)
  const monthlyRevenue = await getMonthlyRevenue();
  const redemptionPool = monthlyRevenue * 0.2;
  const redemptionAmount = pointsToRedeem / 100; // 100 points = $1

  if (redemptionAmount > redemptionPool) {
    return NextResponse.json({ error: { code: 'REDEMPTION_POOL_INSUFFICIENT' } }, { status: 400 });
  }

  // Check worker activity (active in last 30 days)
  const { count: recentTasks } = await supabase
    .from('task_responses')
    .select('*', { count: 'exact', head: true })
    .eq('worker_id', worker.id)
    .gte('submitted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (recentTasks === 0) {
    return NextResponse.json({ error: { code: 'INACTIVE_WORKER' } }, { status: 400 });
  }

  // Redeem points (mark oldest points as redeemed)
  await supabase
    .from('points_ledger')
    .update({ redeemed: true })
    .eq('worker_id', worker.id)
    .eq('redeemed', false)
    .order('issued_at', { ascending: true })
    .limit(Math.ceil(pointsToRedeem / 5)); // Assume 5 points per record on average

  // Pay worker
  const txHash = await sendPaymentWithFeeAbstraction(walletAddress as `0x${string}`, redemptionAmount);

  await supabase.from('transactions').insert({
    worker_id: worker.id,
    amount_usd: redemptionAmount,
    tx_type: 'points_redemption',
    tx_hash: txHash,
    status: 'confirmed',
  });

  return NextResponse.json({ data: { success: true, amount: redemptionAmount } });
}
```

**UI Component:**
```tsx
// components/workers/PointsBalance.tsx
export function PointsBalance() {
  const { data: points } = useSWR('/api/v1/points/balance', fetcher);

  return (
    <div>
      <h3>Points Balance</h3>
      <p className="text-3xl font-bold">{points.availablePoints} pts</p>
      <p className="text-sm text-muted-foreground">= ${(points.availablePoints / 100).toFixed(2)}</p>

      <p className="mt-4 text-sm">Redemption Pool: ${points.redemptionPool.toFixed(2)} available</p>

      <Button onClick={() => redeemPoints(points.availablePoints)}>
        Redeem Points
      </Button>
    </div>
  );
}
```

**Acceptance:**
- Points awarded correctly for each activity type
- Redemption enforced: revenue pool check, activity check, expiry check
- Points expire after 12 months (cron job to mark expired)

**PRD Reference:** PRD Section 5.1 Feature 12 (Points Program), PRD Section 6 (Cold Start Strategy)

#### Task 6.2: Referral Program → **[G-6]**

**Referral Link Generation:**
```typescript
// lib/referrals/generate-link.ts
export function generateReferralLink(workerId: string): string {
  const code = Buffer.from(workerId).toString('base64url').slice(0, 8);
  return `https://bawo.work/join?ref=${code}`;
}

export async function getReferrerFromCode(code: string): Promise<string | null> {
  try {
    const workerId = Buffer.from(code, 'base64url').toString();
    // Verify worker exists
    const { data } = await supabase
      .from('workers')
      .select('id')
      .eq('id', workerId)
      .single();
    return data?.id || null;
  } catch {
    return null;
  }
}
```

**Referral Tracking:**
```typescript
// On new worker sign-up with referral code
const referralCode = searchParams.get('ref');
if (referralCode) {
  const referrerId = await getReferrerFromCode(referralCode);
  if (referrerId) {
    await supabase.from('workers').update({ referred_by: referrerId }).eq('id', newWorkerId);
  }
}

// After referee completes 10 tasks
const { count: tasksCompleted } = await supabase
  .from('task_responses')
  .select('*', { count: 'exact', head: true })
  .eq('worker_id', refereeId);

if (tasksCompleted === 10) {
  // Pay referrer $1
  await sendPaymentWithFeeAbstraction(referrerWalletAddress, 1.00);
  await supabase.from('transactions').insert({
    worker_id: referrerId,
    amount_usd: 1.00,
    tx_type: 'referral_bonus',
    status: 'confirmed',
  });

  // Pay referee $0.50
  await sendPaymentWithFeeAbstraction(refereeWalletAddress, 0.50);
  await supabase.from('transactions').insert({
    worker_id: refereeId,
    amount_usd: 0.50,
    tx_type: 'referral_bonus',
    status: 'confirmed',
  });
}
```

**Acceptance:**
- Referral link generates correctly
- Referee tracked when signing up with link
- Bonuses paid after referee completes 10 tasks ($1 referrer, $0.50 referee)

**PRD Reference:** PRD Section 5.2 Feature 13 (Referral Program)

#### Task 6.3: Streak Rewards → **[G-6]**

**Streak Tracking:**
```typescript
// lib/streaks/calculate.ts
export async function calculateStreak(workerId: string): Promise<number> {
  // Get all task submission dates
  const { data: submissions } = await supabase
    .from('task_responses')
    .select('submitted_at')
    .eq('worker_id', workerId)
    .order('submitted_at', { ascending: false });

  if (!submissions || submissions.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(submissions[0].submitted_at);

  for (let i = 1; i < submissions.length; i++) {
    const prevDate = new Date(submissions[i].submitted_at);
    const daysDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (24 * 60 * 60 * 1000));

    if (daysDiff === 1) {
      streak++;
      currentDate = prevDate;
    } else if (daysDiff > 1) {
      break; // Streak broken
    }
  }

  return streak;
}

// Check for streak milestones after each task submission
const streak = await calculateStreak(workerId);
if (streak === 7) {
  await sendPaymentWithFeeAbstraction(walletAddress, 0.50);
  await supabase.from('transactions').insert({
    worker_id: workerId,
    amount_usd: 0.50,
    tx_type: 'streak_reward',
    status: 'confirmed',
  });
} else if (streak === 30) {
  await sendPaymentWithFeeAbstraction(walletAddress, 5.00);
  await supabase.from('transactions').insert({
    worker_id: workerId,
    amount_usd: 5.00,
    tx_type: 'streak_reward',
    status: 'confirmed',
  });
}
```

**Acceptance:**
- Streak calculated correctly (consecutive days with at least 1 task)
- Bonus paid automatically at 7-day milestone ($0.50)
- Bonus paid automatically at 30-day milestone ($5.00)

**PRD Reference:** PRD Section 5.2 Feature 14 (Streak Rewards)

#### Task 6.4: Leaderboards → **[G-6]**

**API Endpoint:**
```typescript
// app/api/v1/leaderboards/route.ts
export async function GET(request: Request) {
  const period = request.nextUrl.searchParams.get('period'); // 'weekly' | 'monthly'

  const startDate = period === 'weekly'
    ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Top earners
  const { data: topEarners } = await supabase
    .from('transactions')
    .select('worker_id, workers(wallet_address), sum(amount_usd)')
    .gte('created_at', startDate.toISOString())
    .eq('status', 'confirmed')
    .group('worker_id')
    .order('sum(amount_usd)', { ascending: false })
    .limit(10);

  // Top quality (accuracy)
  const { data: topQuality } = await supabase
    .from('workers')
    .select('wallet_address, accuracy_rate, total_tasks_completed')
    .gte('total_tasks_completed', 50) // Min 50 tasks to qualify
    .order('accuracy_rate', { ascending: false })
    .limit(10);

  return NextResponse.json({
    data: {
      topEarners,
      topQuality,
    },
  });
}
```

**UI Component:**
```tsx
// components/workers/Leaderboard.tsx
export function Leaderboard({ period }: { period: 'weekly' | 'monthly' }) {
  const { data } = useSWR(`/api/v1/leaderboards?period=${period}`, fetcher);

  return (
    <div>
      <h2>Leaderboard - {period === 'weekly' ? 'This Week' : 'This Month'}</h2>

      <h3>Top Earners</h3>
      <ol>
        {data.topEarners.map((worker, i) => (
          <li key={worker.worker_id}>
            #{i + 1} {worker.workers.wallet_address.slice(0, 6)}... - ${worker.sum}
          </li>
        ))}
      </ol>

      <h3>Top Quality</h3>
      <ol>
        {data.topQuality.map((worker, i) => (
          <li key={worker.wallet_address}>
            #{i + 1} {worker.wallet_address.slice(0, 6)}... - {worker.accuracy_rate}%
          </li>
        ))}
      </ol>
    </div>
  );
}
```

**Acceptance:**
- Leaderboards display top 10 workers (weekly/monthly)
- Top earners ranked by total earnings
- Top quality ranked by accuracy (min 50 tasks to qualify)

**PRD Reference:** PRD Section 5.2 Feature 15 (Leaderboards)

#### Task 6.5: RLHF Preference Ranking Tasks → **[G-6]**

**Task Schema:**
```typescript
export type RLHFTask = {
  id: string;
  project_id: string;
  prompt: string;
  response_a: string;
  response_b: string;
  task_type: 'rlhf_preference';
  time_limit: 60; // seconds (longer for reading two responses)
};
```

**Component:**
```tsx
// components/tasks/RLHFTask.tsx
export function RLHFTask({ task }: { task: RLHFTask }) {
  const [selected, setSelected] = useState<'a' | 'b' | null>(null);

  return (
    <div className="p-4">
      <div className="mb-4">
        <p className="text-sm font-semibold mb-2">Prompt:</p>
        <p className="text-base">{task.prompt}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Button
          variant={selected === 'a' ? 'default' : 'outline'}
          onClick={() => setSelected('a')}
          className="h-auto p-4 text-left"
        >
          <div>
            <p className="font-semibold mb-2">Response A</p>
            <p className="text-sm">{task.response_a}</p>
          </div>
        </Button>

        <Button
          variant={selected === 'b' ? 'default' : 'outline'}
          onClick={() => setSelected('b')}
          className="h-auto p-4 text-left"
        >
          <div>
            <p className="font-semibold mb-2">Response B</p>
            <p className="text-sm">{task.response_b}</p>
          </div>
        </Button>
      </div>

      <Button onClick={() => submitTask(task.id, { response: selected })} disabled={!selected}>
        Submit
      </Button>
    </div>
  );
}
```

**Acceptance:**
- Worker can read both responses and select preferred one
- Task type integrated into task assignment algorithm
- Higher pay rate for RLHF tasks (e.g., $0.15 per task vs $0.05)

**PRD Reference:** PRD Section 5.2 Feature 16 (RLHF Preference Ranking Tasks)

#### Task 6.6: Offline Task Caching → **[G-6]**

**Service Worker Setup:**
```bash
npm install next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // Next.js config
});
```

**IndexedDB Queue:**
```typescript
// lib/offline/queue.ts
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'bawo-offline';
const STORE_NAME = 'task-submissions';

let db: IDBPDatabase | null = null;

async function getDB() {
  if (!db) {
    db = await openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      },
    });
  }
  return db;
}

export async function queueOfflineSubmission(taskId: string, response: any): Promise<void> {
  const db = await getDB();
  await db.add(STORE_NAME, {
    taskId,
    response,
    timestamp: Date.now(),
  });
}

export async function getOfflineQueue(): Promise<any[]> {
  const db = await getDB();
  return db.getAll(STORE_NAME);
}

export async function clearOfflineSubmission(id: number): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
```

**Sync on Reconnect:**
```typescript
// components/offline/OfflineSync.tsx
'use client';

useEffect(() => {
  const handleOnline = async () => {
    const queue = await getOfflineQueue();
    for (const submission of queue) {
      try {
        await fetch(`/api/v1/tasks/${submission.taskId}/submit`, {
          method: 'POST',
          body: JSON.stringify(submission.response),
        });
        await clearOfflineSubmission(submission.id);
        toast.success('Offline submission synced!');
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  };

  window.addEventListener('online', handleOnline);
  return () => window.removeEventListener('online', handleOnline);
}, []);
```

**Acceptance:**
- Tasks cached locally (Service Worker caches task data)
- Submissions queued when offline (stored in IndexedDB)
- Queue syncs automatically when reconnected
- Worker sees "Saved offline, will submit when connected" message

**PRD Reference:** PRD Section 5.1 Feature 11 (Offline Task Caching)

#### Task 6.7: Performance Optimization → **[G-1]**

**Bundle Size Analysis:**
```bash
npm install -D @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ...config
});
```

**Run analysis:**
```bash
ANALYZE=true npm run build
```

**Optimization Techniques:**
1. **Dynamic Imports:** Lazy-load heavy components
   ```tsx
   const LeaderboardComponent = dynamic(() => import('@/components/Leaderboard'), { ssr: false });
   ```

2. **Tree-shaking:** Remove unused code
   - Verify `sideEffects: false` in package.json
   - Use named imports: `import { Button } from '@/components/ui/button'`

3. **Image Optimization:** Use Next.js `<Image>` component
   ```tsx
   <Image src="/logo.png" width={200} height={50} alt="Bawo" />
   ```

4. **Code Splitting:** Separate client/worker bundles
   ```tsx
   // app/workers/layout.tsx
   import '@/styles/worker.css'; // Worker-specific styles
   ```

5. **Font Optimization:** Use `next/font`
   ```tsx
   import { Inter } from 'next/font/google';
   const inter = Inter({ subsets: ['latin'] });
   ```

**Lighthouse Testing:**
```bash
npx lighthouse https://bawo-preview.vercel.app --throttling-method=simulate --throttling.cpuSlowdownMultiplier=4 --throttling.rttMs=150 --throttling.throughputKbps=1638 --output=html
```

**Acceptance:**
- Bundle size <150kb gzipped (measured with Bundle Analyzer)
- Initial load <3s on 3G (measured with Lighthouse 3G throttling)
- Time to Interactive <5s on 3G
- Lighthouse Performance score >90

**PRD Reference:** PRD Section 8.1 (Performance Targets)

#### Task 6.8: MVP Launch Readiness Checklist → **[G-1]**

**Pre-Launch Checklist:**
```markdown
## Technical
- [ ] All unit tests passing (80%+ coverage)
- [ ] E2E tests passing (critical paths)
- [ ] Bundle size <150kb gzipped
- [ ] Initial load <3s on 3G (Lighthouse verified)
- [ ] Payment transactions working on Celo mainnet
- [ ] Self Protocol verification working (or fallback enabled)
- [ ] Database backups enabled (Supabase)
- [ ] Monitoring configured (Axiom, BetterStack)
- [ ] Error tracking configured (Vercel)

## Security
- [ ] HTTPS enforced
- [ ] RLS policies enabled on all tables
- [ ] Hot wallet private key secured (environment variable)
- [ ] Rate limiting enabled on auth endpoints
- [ ] No PII stored (Self Protocol ZK proofs only)

## Business
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Client pricing confirmed ($0.08/label minimum)
- [ ] Worker payment confirmed (60% of client price)
- [ ] Points program treasury cap set (500K points max)

## Content
- [ ] Landing page live
- [ ] Worker onboarding tutorial (5 training tasks)
- [ ] Client onboarding documentation (how to create project)
- [ ] FAQ page (workers + clients)

## Launch
- [ ] 50 founding workers recruited
- [ ] 1 pilot client committed ($1K+ project)
- [ ] WhatsApp group created ("Bawo Beta - Kenya")
- [ ] Twitter/X account active
- [ ] DNS configured (bawo.work)
```

**Acceptance:** All checklist items completed

### Dependencies

- Sprint 2: Worker onboarding (for referrals, streaks)
- Sprint 3: Task engine (for RLHF tasks)
- Sprint 4: Payment infrastructure (for points redemption)
- Sprint 5: Client dashboard (for revenue tracking)

### Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Bundle size exceeds 150kb | **Medium** | **Medium** | **Monitor with Bundle Analyzer, use dynamic imports, optimize dependencies** |
| 3G load time validation fails | Medium | High | Use Lighthouse 3G simulation, optimize images, defer non-critical JS |
| Offline sync bugs (race conditions) | Medium | Medium | Test extensively, use IndexedDB transactions, add conflict resolution |
| Points program treasury overhang | Low | Medium | Enforce 500K points cap, monitor redemption rate, communicate limits clearly |

### Success Metrics

- Bundle size <150kb gzipped (measured with `npm run analyze`)
- Initial load <3s on 3G (measured with Lighthouse)
- Lighthouse Performance score >90
- Offline sync success rate >95%
- Points redemption requests honored within 24 hours (when pool has funds)
- Referral conversion rate >20% (referee completes 10+ tasks)

### PRD/SDD References

- PRD Section 5.1 Feature 11-12 (Offline, Points)
- PRD Section 5.2 Features 13-16 (Referrals, Streaks, Leaderboards, RLHF)
- PRD Section 6 (Cold Start Strategy)
- PRD Section 8.1 (Performance Targets)
- SDD Section 1.8 (Scalability Strategy)

---

## Risk Register

| ID | Risk | Sprint | Probability | Impact | Mitigation | Owner |
|----|------|--------|-------------|--------|------------|-------|
| R1 | Self Protocol SDK integration fails | 1-2 | **Medium** | **High** | **Validate Week 1-2; fallback to phone verification (Level 1 only)** | Dev Team |
| R2 | MiniPay restricts PWA access | 2 | Low | High | Yellow Card backup; direct wallet support | Dev Team |
| R3 | Celo blockchain payment testing delays | 4 | **High** | **High** | **Test on testnet (Alfajores) first, validate fees <$0.01** | Dev Team |
| R4 | Bundle size exceeds 150kb | 1-6 | **Medium** | **Medium** | **Monitor with Bundle Analyzer, use code splitting, optimize deps** | Dev Team |
| R5 | Hot wallet private key compromised | 4-6 | Medium | **Critical** | Environment variables, rotate every 90 days, monitor balance | Security |
| R6 | Redis queue latency issues | 3 | Low | Medium | Use Upstash global replication, monitor with BetterStack | Dev Team |
| R7 | Large CSV uploads (>50MB) slow | 5 | Medium | Medium | Streaming CSV parser, show upload progress, compress files | Dev Team |
| R8 | 3G load time validation fails | 6 | Medium | High | Lighthouse 3G simulation, optimize images, defer non-critical JS | Dev Team |
| R9 | Points program treasury overhang | 6 | Low | Medium | Enforce 500K points cap, monitor redemption rate | Product |
| R10 | Regulatory issues (Kenya VASP) | Post-MVP | Low | High | Partner with licensed entity, register with ODPC | Legal |

---

## Success Metrics Summary

| Metric | Target | Measurement Method | Sprint |
|--------|--------|-------------------|--------|
| Database schema created | 8 tables + RLS | Supabase dashboard | 1 |
| CI pipeline runs on every PR | 100% coverage | GitHub Actions | 1 |
| MiniPay wallet auto-connect | 90%+ success | PostHog analytics | 2 |
| Self Protocol verification time | <60 seconds | Manual testing (Tecno device) | 2 |
| Task load time | <2s on 3G | Lighthouse | 3 |
| Golden task injection rate | 10% exactly | Database query | 3 |
| Payment confirmation time | <5 seconds | On-chain timestamp | 4 |
| Transaction fee | <$0.01 | On-chain data | 4 |
| Consensus accuracy | >95% | Golden task validation | 4 |
| CSV upload success | >95% | Server logs | 5 |
| Real-time progress update latency | <2 seconds | Supabase Realtime monitoring | 5 |
| Bundle size | <150kb gzipped | Bundle Analyzer | 6 |
| Initial load time | <3s on 3G | Lighthouse 3G throttling | 6 |
| Lighthouse Performance score | >90 | Lighthouse CI | 6 |
| Offline sync success | >95% | Error logs | 6 |

---

## Dependencies Map

```
Sprint 1 (Foundation)
   │
   ├──────────────────────┐
   │                      │
   ▼                      ▼
Sprint 2 (Onboarding)  Sprint 5 (Client Dashboard)
   │                      │
   ▼                      │
Sprint 3 (Task Engine)    │
   │                      │
   ▼                      │
Sprint 4 (Payments) ◄─────┘
   │
   ▼
Sprint 6 (Gamification & Polish)
```

**Critical Path:** Sprint 1 → Sprint 2 → Sprint 3 → Sprint 4 → Sprint 6

**Parallel Tracks:**
- Sprint 5 (Client Dashboard) can start after Sprint 1 and run in parallel with Sprint 2-4
- Sprint 6 depends on Sprint 2-5 (all features needed for gamification)

---

## Appendix

### A. PRD Feature Mapping

| PRD Feature | Sprint | Status |
|-------------|--------|--------|
| Feature 1: MiniPay Wallet Auto-Connect | Sprint 2 | Planned |
| Feature 2: Self Protocol Identity Verification | Sprint 2 | Planned |
| Feature 3: Sentiment Analysis Task Type | Sprint 3 | Planned |
| Feature 4: Text Classification Task Type | Sprint 3 | Planned |
| Feature 5: Instant Stablecoin Payment | Sprint 4 | Planned |
| Feature 6: Withdrawal to MiniPay | Sprint 4 | Planned |
| Feature 7: Golden Task QA System | Sprint 3 | Planned |
| Feature 8: Consensus Mechanism | Sprint 4 | Planned |
| Feature 9: Client Dashboard - Project Creation | Sprint 5 | Planned |
| Feature 10: Client Dashboard - Results Download | Sprint 5 | Planned |
| Feature 11: Offline Task Caching | Sprint 6 | Planned |
| Feature 12: Points Program | Sprint 6 | Planned |
| Feature 13: Referral Program | Sprint 6 | Planned |
| Feature 14: Streak Rewards | Sprint 6 | Planned |
| Feature 15: Leaderboards | Sprint 6 | Planned |
| Feature 16: RLHF Preference Ranking Tasks | Sprint 6 | Planned |

### B. SDD Component Mapping

| SDD Component | Sprint | Status |
|---------------|--------|--------|
| Database Schema (Section 3) | Sprint 1 | Planned |
| Worker PWA (Section 1.4) | Sprint 2-3 | Planned |
| Client Dashboard (Section 1.4) | Sprint 5 | Planned |
| Task Engine (Section 1.4) | Sprint 3 | Planned |
| Payment Router (Section 1.4) | Sprint 4 | Planned |
| Identity Service (Section 1.4) | Sprint 2 | Planned |
| Points System (Section 1.4) | Sprint 6 | Planned |
| Offline Support (Section 1.4) | Sprint 6 | Planned |

### C. PRD Goal Mapping

> **Note:** PRD does not have explicit numbered goals (G-1, G-2, etc.). We map features to conceptual goals below.

| Goal ID | Goal Description | Contributing Tasks | Validation Task |
|---------|------------------|-------------------|-----------------|
| G-1 | Establish MVP technical foundation | Sprint 1: All tasks | Sprint 6: Launch readiness checklist |
| G-2 | Enable worker onboarding with identity verification | Sprint 2: All tasks | Sprint 2: Task 2.6 (Onboarding flow validation) |
| G-3 | Build functional task engine with quality assurance | Sprint 3: All tasks | Sprint 3: Task 3.6 (QA validation) |
| G-4 | Enable instant crypto payments to workers | Sprint 4: All tasks | Sprint 4: Task 4.5 (Payment flow validation) |
| G-5 | Provide self-serve client dashboard | Sprint 5: All tasks | Sprint 5: Task 5.5 (E2E project flow) |
| G-6 | Implement gamification and cold start strategy | Sprint 6: All tasks | Sprint 6: Task 6.8 (MVP launch checklist) |

**Goal Coverage Check:**
- [x] All PRD features have at least one contributing task
- [x] All goals have a validation task in final sprint (Sprint 6)
- [x] No orphan tasks (all tasks contribute to goals)

**Per-Sprint Goal Contribution:**

- **Sprint 1:** G-1 (foundation)
- **Sprint 2:** G-2 (onboarding)
- **Sprint 3:** G-3 (task engine)
- **Sprint 4:** G-4 (payments)
- **Sprint 5:** G-5 (client dashboard)
- **Sprint 6:** G-6 (gamification), G-1 (final validation)

---

## Development Team Structure

**Team:** Solo developer + AI assistants (Claude Code/Codex)

**Timeline:** 12-18 weeks to MVP (PRD Section 1.1)

**Sprint Duration:** 2-2.5 days per sprint (total 12-15 days for 6 sprints)

**Development Phases (from SDD Section 8):**
- **Phase 1 (Weeks 1-4)**: Foundation (Sprint 1-2) - This sprint plan covers this phase
- **Phase 2 (Weeks 5-10)**: Core features (Sprint 3-5) - This sprint plan covers this phase
- **Phase 3 (Weeks 11-14)**: Quality & optimization (Sprint 6) - This sprint plan covers this phase
- **Phase 4 (Weeks 15-18)**: Beta launch (50 founding workers) - Post-sprint execution
- **Phase 5 (Week 19+)**: Public launch - Post-sprint execution

---

## Notes for Implementation

### Self Protocol Integration Validation (Critical)

**Week 1-2 Validation Plan (from PRD Section 5.1):**
1. Complete SDK integration test
2. Verify NFC passport support on Tecno, Infinix, Samsung A-series (common Kenyan Android devices)
3. Confirm ZK proof verification times
4. Test full flow: scan → proof → verification
5. Document fallback path if Self delays

**If Self Protocol unavailable:** Launch with phone verification only (Level 1), revisit Self integration in 3 months (PRD Section 16.2)

### Celo Blockchain Testing (Critical)

**Sprint 4 Validation:**
1. Test on Alfajores testnet first (Celo testnet)
2. Validate transaction fees <$0.01 (PRD Section 5.1)
3. Test fee abstraction (pay gas in cUSD, not CELO)
4. Verify payment confirmation time <5 seconds
5. Test withdrawal flow to MiniPay

### Bundle Size Monitoring (Ongoing)

**All Sprints:**
- Run `npm run analyze` after each sprint
- Target: <150kb JS gzipped (PRD Section 8.1)
- Use dynamic imports for heavy components
- Monitor with Webpack Bundle Analyzer

### Cold Start Strategy Execution (Post-Sprint)

**Week 1-2 (Post-Sprint 6):**
- Recruit 50 founding workers via WhatsApp/Twitter
- Create 500 training tasks (Swahili sentiment)
- Workers complete training, earn points (3,000 points issued)
- End state: 50 workers, 600 labeled examples, quality baseline

**Week 3-6:**
- Complete Dataset 1 (Swahili Sentiment - 5K examples)
- Parallel: Cold outreach to 30 potential clients
- Target: First paying client, $1K+ revenue

---

*Generated by Sprint Planner Agent*
*Sprint Plan v1.0 | 2026-01-28*
