# Product Requirements Document: Bawo
## Crypto-Powered AI Data Labeling for Africa

**Version:** 2.0
**Date:** 2026-01-28
**Status:** Active
**Owner:** Zoz
**Cycle:** 001

---

## Document Control

### Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-01-27 | Initial PRD (archived) | Loa Discovery |
| 2.0 | 2026-01-28 | Comprehensive regeneration with full business context | Loa Discovery |

### Change Summary (v2.0)

This PRD has been regenerated from comprehensive business context sources to incorporate:
- Complete market analysis from AgentWork research (payment rail economics, competitor failures, MiniPay infrastructure)
- Cold start strategy with points program and benchmark datasets
- Technology convergence thesis (MiniPay, Celo, Self Protocol, x402)
- Detailed client personas beyond Dr. Chen (28 prospecting targets)
- Full product design specification (1700+ lines from DESIGN.md)

All previous discovery work has been preserved in `/grimoires/loa/archive/cycle-001/`.

---

## Executive Summary

**Bawo** (Yoruba: "how are you?") is a crypto-powered platform where AI companies pay African workers for data labeling tasks via instant stablecoin micropayments on Celo.

### The Opportunity

We connect **insatiable demand** from AI labs ($37B spent on GenAI in 2025, data labeling market growing 28.4% CAGR) with **11M MiniPay wallet holders** who can earn 2-4x more than existing platforms ($3-6/hour vs $1-2) while receiving instant payment.

**One-line pitch:** High-trust, low-latency human feedback loops for underserved language domains, paid instantly via stablecoins.

### Why Now?

A rare convergence of infrastructure that enables what was previously impossible:

| Technology | Ready Date | What It Solves | MVP Essential? |
|------------|------------|----------------|----------------|
| **MiniPay** (11M wallets) | Sept 2025 | Distribution—no user acquisition needed | ✅ Yes |
| **Celo Fee Abstraction** | Live | Workers pay gas in stablecoins—no "buy ETH" friction | ✅ Yes |
| **Celo Sub-Cent Fees** | Live | $0.05 payments with $0.0002 fees—micropayments work | ✅ Yes |
| **Self Protocol** | 2025 | ZK identity—$0 KYC, Sybil resistance, portable reputation | ✅ Yes |
| **x402 Protocol** | 2025 | AI agents pay directly via HTTP | ❌ Phase 2 |
| **Regulatory Clarity** | 2025 | Kenya/Ghana/Nigeria VASP frameworks passed | ✅ Yes |

> **Sources:** [why-now.md](grimoires/loa/context/why-now.md), [business-plan.md](grimoires/loa/context/business-plan.md), [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf)

### Year 1 Target

- **Revenue:** $200K (base case), $100K (pessimistic)
- **Workers:** 3,000 active (base), 1,500 (pessimistic)
- **Clients:** 28 paying (base), 15 (pessimistic)
- **Geography:** Kenya focus (Month 1-6), then Nigeria/Ghana expansion

---

## 1. Problem Statement

### 1.1 The Core Problem

Traditional payment rails fail catastrophically for micropayments to African workers:

| Method | $0.05 Payment | $1 Payment | $10 Payment | Why It Fails |
|--------|---------------|------------|-------------|--------------|
| **PayPal** | $0.30 fee (600%) | Impossible | $25-50 fee | Non-functional in Nigeria |
| **Payoneer** | Impossible | Impossible | $50 minimum | Workers need 1,000 tasks before payout |
| **Bank Transfer** | Impossible | Impossible | $25-50 flat fee | 250-500% effective fee rate |
| **M-PESA** | ~50% fee | ~10% fee | ~3-5% fee | Prohibitive for small amounts |
| **Celo/MiniPay** | <10% fee | <5% fee | 2-3% fee | ✅ **Viable** |

**Result of traditional rails:**
- Platforms batch payments 30-60 days to amortize fees
- Workers get burned when platforms exit (Remotasks, March 2024)
- Workers earn $1-2/hour with 84% platform take (Sama)
- African language data remains severely undersupplied

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.3-4, [business-plan.md](grimoires/loa/context/business-plan.md) Section 1.4

### 1.2 Competitor Failures Create Opportunity

**Remotasks (Scale AI):**
- Abruptly exited Kenya, Nigeria, Pakistan (March 2024)
- Workers blocked with earnings trapped
- One Kenyan earned $284 in 3 weeks—then account frozen
- Pay dropped below $1/hour before exit
- DOL investigation + class action lawsuits for FLSA violations

**Amazon Mechanical Turk:**
- Pays African workers exclusively in Amazon gift cards
- 15-30% loss to convert to cash
- Median ~$2/hour across all tasks
- 70,000+ HITs rejected without pay (2024 incident)

**Sama (OpenAI's Former Partner):**
- OpenAI paid $12.50/hour per worker
- Workers received $2/hour (**84% platform take**)
- Content moderators reviewing 150-250 toxic passages daily
- Workers reported being "mentally scarred"
- African Content Moderators Union formed (2023)

**Worker Survey Data (Data Labelers Association):**
- 68% cannot afford housing
- 47% cannot afford food
- 50%+ reported not being paid properly

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.3, [business-plan.md](grimoires/loa/context/business-plan.md) Section 1.4

### 1.3 The Opportunity Gap

**What workers need:**
- Instant payment (not 30-60 day delays)
- No minimum withdrawal (not $50 thresholds)
- Fair pay ($3-6/hour, not $1-2)
- Dollar-denominated earnings (hedge against currency volatility)
- Portable reputation they own (not trapped on one platform)

**What AI companies need:**
- Native speakers of African languages (unavailable elsewhere)
- Local knowledge verification (addresses, businesses, cultural context)
- Ethical labor practices (differentiation from Sama controversy)
- Neutral provider (not conflicted like Scale AI/Meta)
- Fast turnaround (48 hours on standard tasks)

**What traditional platforms cannot deliver:**
- Micropayments under $10 (fees destroy economics)
- Instant payment (requires fee amortization)
- Worker reputation portability (lock-in is the business model)

---

## 2. Market Analysis

### 2.1 Demand Side: AI Data Labeling Market

**Market Size & Growth:**
- Conservative: $3.77B (2024) → $17.1B (2030) at 28.4% CAGR
- Broad definition: $18.66B (2024) → $118.85B (2034)
- Manual annotation: 75-79% of all labeling work (despite automation)
- RLHF for LLMs: Essential for frontier AI development

**AI Industry Spending (2025):**
| Metric | Value | Growth |
|--------|-------|--------|
| Big Tech AI capex | $405B | +62% YoY |
| Enterprise GenAI spend | $37B | +3.2x YoY |
| Data labeling market | $3.77B | +28.4% CAGR |
| OpenAI infrastructure commitment | $1.15T | 2025-2035 |

**Key Market Event:** Scale AI's $14.3B Meta acquisition (2024) triggered customer flight. OpenAI and Google cut ties. Labs actively seeking neutral alternatives.

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.2, [business-plan.md](grimoires/loa/context/business-plan.md) Section 1.1

### 2.2 Supply Side: African Workforce Readiness

**Target Market Characteristics (Kenya Focus, Phase 1):**

| Factor | Kenya | Notes |
|--------|-------|-------|
| Population | 55M | |
| Internet penetration | 68% | Critical mass reached |
| Smartphone penetration | 68.3% | 86%+ web traffic via mobile |
| Min monthly wage | ~$117 | $1 = 0.85% of monthly income |
| Crypto adoption rank | #21-28 globally | |
| Mobile money | 91% adult M-PESA penetration | 70% of GDP flows through M-PESA |
| MiniPay presence | Strong | Part of 11M wallet base |
| Regulatory clarity | VASP Bill 2025 passed | Dual-regulator model |

**Phase 2 Expansion (Month 6+):**

| Factor | Nigeria | Ghana |
|--------|---------|-------|
| Population | 230M | 34M |
| Min monthly wage | ~$43-50 | ~$30-38 |
| What $1 buys | 2.3% of monthly income | 2.6% of monthly income |
| Crypto adoption rank | #2 globally | #29 |
| Regulatory | Complex but improving | VASP Bill passed Dec 2025 |

**Gig Economy Participation:**
- 17.5M existing gig workers across the three countries
- 80.6% of Africa's gig platform traffic
- Kenya: 216% increase in online freelancers (5 years)
- Nigeria: 35%+ of young people in freelance work
- Demographic: 18-35 years old, often university-educated

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.1-2, [business-plan.md](grimoires/loa/context/business-plan.md) Section 1.2

### 2.3 The African Language Opportunity

**Phase 1 Languages (Kenya):**

| Language | Speakers | AI Performance | Premium Potential |
|----------|----------|----------------|-------------------|
| **Swahili** | 115M | Moderate | High |
| **English** (Kenyan) | 55M+ | Good | Moderate |
| **Sheng** | 10M+ | Very Poor | Very High |

**Phase 2 Languages (Nigeria/Ghana):**

| Language | Speakers | AI Performance | Premium Potential |
|----------|----------|----------------|-------------------|
| **Hausa** | 150M | Poor | Very High |
| **Yoruba** | 50M | Poor | Very High |
| **Pidgin English** | 100M+ | Very Poor | High |
| **Igbo** | 45M | Very Poor | Very High |
| **Twi** | 10M+ | Very Poor | High |

**Why This Matters:**
- Meta's NLLB had issues with medical translations in Swahili
- Google conducting ASR research for only 15 African languages
- Masakhane maintains 30+ datasets but demand exceeds supply
- Voice diversity needs acute—minimal recorded training data exists

**Pricing Power:** Native African language speakers command premium rates because supply is severely constrained. No amount of US/India outsourcing can replicate this.

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 1.5, [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.2-3

### 2.4 MiniPay Infrastructure Validation

**Traction Data (Sept 2025):**
- **11M+ wallets** activated (from 1M in Feb 2024)
- **271M+ transactions** processed
- **$270M+ volume**
- **Sub-cent fees** (<$0.01 per transaction)
- **55-second** average cash-in time
- **17 fiat partners** for off-ramps (M-PESA, bank transfers, mobile money)

**Why MiniPay Solves Distribution:**
- No need to build wallet infrastructure
- No app store approval needed (PWA in MiniPay browser)
- No user acquisition cost ($10-50 CAC eliminated)
- Workers already have funded wallets
- Off-ramps to M-PESA work (55 seconds)
- 2MB footprint works on $50 Android phones

**Dependency Management:** MiniPay is primary but not exclusive. We also support direct wallet connections (any Celo-compatible wallet), Yellow Card integration (backup), and direct M-PESA integration if MiniPay restricts access.

> **Source:** [why-now.md](grimoires/loa/context/why-now.md), [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.2, [business-plan.md](grimoires/loa/context/business-plan.md) Section 1.3

---

## 3. User Personas

### 3.1 Primary Worker Persona

**Amara — The Kenyan University Student**

- **Age:** 22
- **Location:** Nairobi, Kenya
- **Background:** Computer science student at University of Nairobi, earns side income from gig work
- **Device:** $50 Android phone (Tecno or Infinix) with MiniPay installed
- **Languages:** English and Swahili (bilingual), some Sheng (Nairobi slang)
- **Technical Skill:** Comfortable with mobile apps, uses MiniPay for daily transactions
- **Income Need:** $10-25/month supplemental in dollars (hedge against shilling volatility)

**Goals:**
- Earn dollar-denominated income (hedge against currency volatility)
- Build portable reputation (after Remotasks burned her)
- Flexible hours around university classes
- No minimum withdrawal (needs access to earnings immediately)

**Frustrations:**
- Remotasks paid $1/hour then exited Kenya without paying out
- MTurk pays in Amazon gift cards (15-30% loss to convert)
- Payoneer requires $50 minimum withdrawal
- Sama's $2/hour for traumatic content moderation

**Quote:** *"I earned ₦284 in three weeks on Remotasks, then they blocked me. The money is still trapped. I need something I can trust."*

> **Source:** [DESIGN.md](DESIGN.md) Section 2, [business-plan.md](grimoires/loa/context/business-plan.md) Section 1.4

### 3.2 Secondary Worker Persona

**Kofi — The Ghanaian Freelancer**

- **Age:** 28
- **Location:** Accra, Ghana
- **Background:** Degree in linguistics, does translation work
- **Languages:** Native Twi speaker, fluent in English, some Ga
- **Technical Skill:** Power user, manages multiple gig platforms
- **Income Need:** Premium rates for African language expertise

**Goals:**
- Get paid for Twi language skills (no platform values this)
- Instant payment to M-PESA (not 30-60 day delays)
- Professional credentials (portable reputation)

**Frustrations:**
- No platform values his Twi language skills
- Payment delays of 30-60 days standard
- 84% platform take at Sama

> **Source:** [DESIGN.md](DESIGN.md) Section 2

### 3.3 Primary Client Persona (AI Buyer)

**Dr. Sarah Chen — ML Research Lead at AI Startup**

- **Age:** 34
- **Location:** San Francisco, CA
- **Company:** Seed-stage AI company building for African markets
- **Background:** Stanford PhD, leads data quality team
- **Budget:** $5-25K per project
- **Technical Skill:** Technical, comfortable with APIs and Python

**Goals:**
- High-quality Swahili sentiment data (5K+ examples, 90%+ accuracy)
- 48-hour turnaround (not weeks/months)
- Neutral vendor (Scale AI/Meta conflict is problem)
- Ethical labor practices (Sama controversy is PR risk)

**Frustrations:**
- Scale AI's Meta acquisition created conflict of interest (we also work with Meta competitors)
- Offshore BPOs don't have actual native speakers (they claim "Swahili proficient")
- Sama controversy creates PR risk for our company
- Need to move fast—can't wait 4+ weeks for Scale's Kenya office to spin up

**Decision Criteria:**
1. Quality (accuracy metrics on golden tasks)
2. Speed (days not weeks)
3. Not getting fired (no PR blowback, ethical practices)

**Quote:** *"After Scale sold to Meta, our board asked us to diversify vendors. We need Swahili data from actual Kenyans, not someone in India who took a Swahili course."*

> **Source:** [DESIGN.md](DESIGN.md) Section 2, [prospecting-list.md](grimoires/loa/context/prospecting-list.md)

### 3.4 Secondary Client Persona

**Prof. James Okonkwo — NLP Researcher at University**

- **Age:** 42
- **Location:** Lagos, Nigeria / Academic institution
- **Background:** Principal Investigator, grant-funded research on low-resource languages
- **Budget:** $10-50K per project (NSF/Google/academic grants)
- **Technical Skill:** Research-focused, needs clean datasets with documentation

**Goals:**
- Publishable Igbo/Yoruba datasets with annotation guidelines
- Academic licensing (cite in papers)
- High-quality labels suitable for model training

**Frustrations:**
- Masakhane datasets are limited
- No good Sheng corpus exists
- Building own annotation pipeline is expensive and time-consuming

> **Source:** [DESIGN.md](DESIGN.md) Section 2, [prospecting-list.md](grimoires/loa/context/prospecting-list.md)

### 3.5 Additional Client Personas (28 Total)

We have identified 28 specific prospecting targets across 8 categories:

**Category A: African Fintech (8 targets)**
- M-Pesa/Safaricom, Equity Bank Kenya, Branch International, Chipper Cash, Flutterwave, etc.
- **Use case:** Customer service automation, fraud detection, sentiment analysis

**Category B: E-commerce & Marketplaces (3 targets)**
- Jumia, Copia Global, Twiga Foods
- **Use case:** Product review sentiment, search relevance, vendor communication

**Category C: Translation & Language Tech (3 targets)**
- Lesan AI, Lelapa AI, Jacaranda Health
- **Use case:** African language models, health communication sentiment

**Category D: Academic Researchers (5 targets)**
- Masakhane Community, Google Research Africa, Microsoft Research Africa, Mozilla Common Voice, AI2
- **Use case:** Low-resource language research, publishable datasets

**Category E: Big Tech AI Teams (4 targets)**
- Meta AI (NLLB), OpenAI, Anthropic, Cohere
- **Use case:** RLHF data, multilingual model improvement, African language coverage

**Category F: Voice & Speech Companies (3 targets)**
- Sanas AI, AssemblyAI, Deepgram
- **Use case:** African accent data, speech-to-text training

**Category G: Content Moderation (2 targets)**
- Sama, Teleperformance
- **Use case:** African language moderation training data

**Category H: Celo Ecosystem (3 targets, warm leads)**
- Valora, Celo Foundation, Opera/MiniPay
- **Use case:** Swahili support data, ecosystem showcase

> **Source:** [prospecting-list.md](grimoires/loa/context/prospecting-list.md) (complete with research hooks and outreach templates for all 28)

---

## 4. Product Vision & Strategy

### 4.1 Core Value Proposition

**For Workers:**
- Earn **$3-6/hour median** on active task time (vs $1-2 on competitors)
- **Instant payment** after task completion (vs 30-60 day delays)
- **No minimum withdrawal** (vs $50 minimums)
- **Own your reputation** via Self Protocol (portable across platforms)
- **Dollar-denominated** earnings (hedge against currency volatility)

*Note: Earnings depend on task availability. $3-6/hour represents median during active work periods. Task availability varies based on client demand.*

**For AI Companies:**
- Access to **native speakers** of African languages (unavailable elsewhere)
- **Local knowledge verification** (addresses, businesses, cultural context)
- **Neutral provider** (not conflicted like Scale AI/Meta)
- **Ethical labor practices** (differentiation from Sama controversy)
- **48-hour turnaround** on standard tasks

**Key Differentiators:**
- First-mover in African language AI data with crypto micropayments
- MiniPay distribution (11M wallets) — no user acquisition cost
- Self Protocol portable reputation — workers keep credentials if we disappear
- 40% platform take vs 60-84% at competitors

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 2.1, [DESIGN.md](DESIGN.md) Section 3

### 4.2 Why Bawo Is Lower Risk Than Competitors

AI labs don't buy because something is *possible*. They buy because **risk is lower than alternatives**.

| Risk Type | Scale AI | Appen/Sama | Bawo |
|-----------|----------|------------|------|
| **Vendor lock-in** | High (proprietary) | High | Low (Self Protocol = portable) |
| **Conflict of interest** | High (Meta investor) | Moderate | None (independent) |
| **Reputational** | Moderate | High (Sama controversy) | Low (ethical pay, transparency) |
| **Worker quality variance** | Moderate | High | Lower (instant feedback loop) |
| **Payment delays to workers** | 30-60 days | 30-60 days | Instant (keeps workers engaged) |
| **African language expertise** | Offshore BPO | Kenya offices | Native speakers in-country |

> **Source:** [why-now.md](grimoires/loa/context/why-now.md) Section: "Why Bawo Is Lower Risk"

### 4.3 Product Roadmap by Phase

**Phase 1: Kenya Focus (Month 1-6)**

- **Geography:** Kenya only
- **Languages:** Swahili, English, Sheng
- **Task Types:** Sentiment analysis, text classification
- **Buyers:** Human clients (API + dashboard)
- **Target:** 500 workers (Week 8) → 3,000 workers (Month 12)
- **Revenue Target:** $1K MRR (Month 3) → $43K MRR (Month 12)

**Phase 2: Expansion (Month 7-12)**

- **Geography:** + Nigeria, Ghana
- **Languages:** + Yoruba, Hausa, Pidgin English
- **Task Types:** + RLHF preference ranking, translation, voice collection
- **Buyers:** + AI agents (x402 protocol)
- **Target:** 5,000+ workers, $100K+ MRR

**Phase 3: Scale (Year 2)**

- **Task Types:** + Content moderation (with mental health protocol), expert domain annotation
- **Buyers:** Enterprise clients (Scale-up AI companies, Frontier labs)
- **Target:** SOC 2 compliance, enterprise sales motion

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 2.3, Part 6

---

## 5. Functional Requirements

### 5.1 MVP Features (Phase 1 - Must Ship)

#### Feature 1: MiniPay Wallet Detection & Auto-Connect
- **Description:** Detect if user is in MiniPay browser, auto-connect wallet without "Connect Wallet" button
- **User Value:** Zero friction onboarding for MiniPay's 11M users
- **Acceptance Criteria:**
  - Wallet connects automatically on page load in MiniPay
  - Shows "Open in MiniPay" message on other browsers
  - No manual wallet address input required

#### Feature 2: Self Protocol Identity Verification
- **Description:** Workers verify humanity via NFC passport scan, ZK proof generated, no PII stored
- **User Value:** Sybil resistance (1 passport = 1 account), portable reputation workers own
- **Acceptance Criteria:**
  - Worker scans passport with phone (NFC)
  - Verification completes in <60 seconds
  - Verification badge appears immediately
  - Worker can start tasks within 60 seconds of verification
  - **Fallback:** If Self unavailable, phone verification via MiniPay for Level 1 access

**Validation Plan (Week 1-2):**
1. Complete SDK integration test
2. Verify NFC passport support on Tecno, Infinix, Samsung A-series (common Kenyan Android devices)
3. Confirm ZK proof verification times
4. Test full flow: scan → proof → verification
5. Document fallback path if Self delays

> **Source:** [why-now.md](grimoires/loa/context/why-now.md) Section: Self Protocol, [business-plan.md](grimoires/loa/context/business-plan.md) Section 3.3

#### Feature 3: Sentiment Analysis Task Type
- **Description:** Display text (max 500 chars), worker selects Positive/Negative/Neutral, submits
- **User Value:** Core task type with broad demand
- **Acceptance Criteria:**
  - Tasks load in <2s on 3G
  - Timer displays countdown (45 seconds)
  - Selection submits successfully
  - Earnings credited immediately after QA

#### Feature 4: Text Classification Task Type
- **Description:** Display text, worker selects from predefined category list
- **User Value:** Second core task type, flexible for client needs
- **Acceptance Criteria:**
  - Categories display correctly (scrollable list if >5)
  - Selection submits successfully
  - Earnings credited immediately after QA

#### Feature 5: Instant Stablecoin Payment
- **Description:** After task submission (post-QA), send cUSD to worker's MiniPay wallet
- **User Value:** Instant payment (not 30-60 days), visible in MiniPay immediately
- **Acceptance Criteria:**
  - Payment confirmed on Celo within 5 seconds
  - Worker sees balance update in app
  - Worker sees notification in MiniPay: "You earned $X from Bawo"
  - Transaction fee <$0.01 (Celo sub-cent fees)

**Technical Implementation:**
```javascript
// Celo fee abstraction - pay gas in cUSD
const tx = {
  to: workerAddress,
  value: parseUnits("0.05", 6), // USDC 6 decimals
  feeCurrency: "0x2f25deb3848c207fc8e0c34035b3ba7fc157602b", // USDC adapter
  type: "0x7b", // CIP-64 transaction type
};
```

> **Source:** [why-now.md](grimoires/loa/context/why-now.md) Section: Celo Features

#### Feature 6: Withdrawal to MiniPay
- **Description:** Worker initiates withdrawal, funds sent to their MiniPay wallet
- **User Value:** No minimum withdrawal, instant access to earnings
- **Acceptance Criteria:**
  - Any amount withdrawable (including $0.01)
  - Transaction completes in <5s
  - Fee <$0.01 (Celo sub-cent fees)
  - Worker can off-ramp to M-PESA in 55 seconds

#### Feature 7: Golden Task QA System
- **Description:** 10% of tasks are pre-labeled tests, workers don't know which
- **User Value:** Quality assurance without manual review
- **Acceptance Criteria:**
  - Golden tasks injected randomly (10% of total)
  - Workers cannot identify golden tasks
  - Accuracy tracked per worker
  - Reputation updated based on golden task performance
  - Client can see golden task accuracy metrics in dashboard

#### Feature 8: Consensus Mechanism
- **Description:** Same task sent to 3 workers, agreement required for payment
- **User Value:** Higher quality labels through redundancy
- **Acceptance Criteria:**
  - Tasks assigned to exactly 3 workers
  - Consensus calculated (majority wins, or flagged if no majority)
  - Majority answer used as final label
  - All 3 workers paid if consensus reached
  - Escalated to expert review if no consensus

#### Feature 9: Client Dashboard - Project Creation
- **Description:** Client uploads CSV, sets task type/instructions/price, launches project
- **User Value:** Self-serve project creation without manual onboarding
- **Acceptance Criteria:**
  - CSV upload accepts files up to 50MB
  - Preview shows first 10 rows before submission
  - Tasks queued successfully after validation
  - Progress visible in real-time (completion percentage)
  - Client can pause/resume project

#### Feature 10: Client Dashboard - Results Download
- **Description:** Client downloads labeled data as CSV when project completes
- **User Value:** Easy access to completed work
- **Acceptance Criteria:**
  - CSV includes: original text + labels + confidence scores + worker IDs (anonymized)
  - Download available immediately when project 100% complete
  - Partial download available (export completed subset)
  - Quality metrics visible: accuracy %, consensus rate, task rejection rate

#### Feature 11: Offline Task Caching (Worker App)
- **Description:** Tasks cached locally via Service Workers + IndexedDB, submissions queued when offline
- **User Value:** Work continues despite intermittent connectivity (86%+ mobile traffic, expensive data plans)
- **Acceptance Criteria:**
  - Tasks viewable offline (cached locally)
  - Submissions queued when offline
  - Sync automatically when reconnected
  - Worker sees "Saved offline, will submit when connected" message
  - All queued tasks submit successfully on reconnect

> **Source:** [DESIGN.md](DESIGN.md) Section 6, [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.1

#### Feature 12: Points Program (Cold Start Strategy)
- **Description:** Workers earn points during training/low-volume periods, redeem when revenue pool has funds
- **User Value:** Keep workers engaged before paying clients; aligned incentives
- **Acceptance Criteria:**
  - Points awarded for training tasks (5 points/task)
  - Conversion rate: 100 points = $1
  - Redemption requires: (1) revenue pool has funds, (2) worker active in last 30 days
  - Monthly redemption capped at 20% of platform revenue
  - Points expire 12 months from issuance
  - Workers see "Points Balance: X (=$Y)" and "Redemption Pool: $Z available"

**Points Treasury Management:**

| Rule | Implementation |
|------|----------------|
| Cap total points issued | Max 500,000 points outstanding (~$5K liability) |
| Redemption requires revenue | Workers can only redeem when monthly revenue > requests |
| Monthly redemption cap | Max 20% of monthly revenue |
| Points expire | 12 months from issuance |
| Transparency | Workers see total points vs. redemption pool |

**Earning Points:**

| Activity | Points | Notes |
|----------|--------|-------|
| Complete training task | 5 | Benchmark dataset work |
| Pass golden task (QA) | +2 bonus | Quality incentive |
| Referral (after 10 tasks) | 50 | Growth driver |
| 7-day streak | 25 | Retention |
| 30-day streak | 150 | Retention |
| Language verification | 100 | One-time per language |

**Spending Points:**

| Redemption | Points Cost | Notes |
|------------|-------------|-------|
| $1 cUSD to wallet | 100 | Base conversion rate |
| Priority task access | 500/week | See paid tasks first |

> **Source:** [cold-start-strategy.md](grimoires/loa/context/cold-start-strategy.md) Part 2, [DESIGN.md](DESIGN.md) Feature 12

### 5.2 Post-MVP Features (Phase 2)

#### Feature 13: Referral Program
- **Description:** Two-sided referral bonuses ($1 referrer, $0.50 referee after 10 tasks)
- **User Value:** Viral growth, worker acquisition
- **Why Not MVP:** Focus on core task flow first; proven in Nigerian fintech (OPay, PiggyVest)

**Benchmarks:**
| App | Referral Bonus | Requirements |
|-----|----------------|--------------|
| Kuda Bank | ₦200-1,000 | BVN + ₦500 airtime |
| PiggyVest | ₦1,000 both | Fund ₦100 + invest |
| OPay | ₦800/₦1,200 | Deposit ₦1,000+ |
| Chipper Cash | ₦500-600 | Complete setup |

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.6-7

#### Feature 14: Streak Rewards
- **Description:** 7-day streak = $0.50 bonus, 30-day streak = $5 bonus
- **User Value:** Retention, engagement
- **Why Not MVP:** Optimize retention after acquisition works

Proven in African fintech:
- PiggyVest: Streak-based savings with celebratory notifications
- Safaricom Bonga Points: 45M customers with "Spin and Win" campaigns

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.5-6

#### Feature 15: Leaderboards
- **Description:** Weekly top earners, monthly quality champions
- **User Value:** Competition, status, engagement
- **Why Not MVP:** Nice-to-have gamification
- **Prize pool:** Top 10 split $100/week

#### Feature 16: RLHF Preference Ranking Tasks
- **Description:** Show two AI responses (e.g., GPT vs Claude), worker picks better one
- **User Value:** Higher-value task type ($20-40/hour for workers, premium pricing for clients)
- **Why Not MVP:** Requires more complex UI, training, and QA mechanisms

#### Feature 17: Voice Data Collection Tasks
- **Description:** Worker records spoken phrases (10 phrases per session)
- **User Value:** Access to African accent ASR training data (severely undersupplied)
- **Why Not MVP:** Requires audio handling, storage (more complex)

**Dataset Opportunity (Phase 2):**
- 1,000 speakers × 10 phrases = 10,000 clips
- Metadata: Age, gender, region, native language
- Client appeal: "Diverse East African voice data for ASR training"

> **Source:** [cold-start-strategy.md](grimoires/loa/context/cold-start-strategy.md) Part 1

#### Feature 18: x402 Protocol Integration (Phase 2)
- **Description:** AI agents pay directly via HTTP 402 responses (programmatic payments)
- **User Value:** Autonomous AI agent buyers, no human in the loop
- **Why Not MVP:** x402 adoption still early (2025-2026), human buyers are primary market initially

**When Ready (Phase 2, Month 5-6):**
```
AI Agent → POST /tasks → 402 Payment Required
→ Agent signs payment → Payment verified → Tasks queued
→ Workers complete → Results returned
Total time: Hours (vs weeks with traditional contracts)
```

> **Source:** [why-now.md](grimoires/loa/context/why-now.md) Section: x402 Protocol, [business-plan.md](grimoires/loa/context/business-plan.md) Section 3.4

---

## 6. Cold Start Strategy

### 6.1 The Chicken-and-Egg Problem

**Problem:** Workers leave if no tasks; clients won't commit without proven capacity.

**Solution:** Build demonstrable benchmark datasets using points-based incentive system. Workers earn points during low-volume, points convert to cash as revenue grows. Datasets become sales collateral and proof of quality.

### 6.2 Benchmark Datasets to Build

#### Dataset 1: Swahili Sentiment Analysis
**Why valuable:** 115M speakers, poor AI model performance, high demand from African market AI companies

| Attribute | Specification |
|-----------|---------------|
| Size | 5,000 labeled examples |
| Source | Kenyan Twitter, news comments, product reviews |
| Labels | Positive/Negative/Neutral + confidence |
| Consensus | 3 workers per example |
| Total annotations | 15,000 |
| Time | 2-3 weeks with 50 workers |
| Points cost | ~75,000 points |

**Client appeal:** "Here's 5,000 labeled Swahili sentiment examples. Test our quality. If it works, we can do 50,000 more."

#### Dataset 2: Kenyan Code-Switching Detection
**Why valuable:** Unique dataset; no good public alternative; critical for Kenya-focused NLP

| Attribute | Specification |
|-----------|---------------|
| Size | 3,000 labeled examples |
| Source | Social media, chat messages |
| Labels | Language tags per segment (EN/SW/Sheng/Mixed) |
| Task type | Span annotation |
| Consensus | 3 workers per example |
| Total annotations | 9,000 |
| Time | 2 weeks with 30 workers |
| Points cost | ~54,000 points |

**Client appeal:** "Code-switching is the hardest problem in African NLP. We have ground-truth data."

#### Dataset 3: Sheng Lexicon + Sentiment
**Why valuable:** Sheng is Nairobi street slang; ~10M speakers; virtually zero NLP resources exist

| Attribute | Specification |
|-----------|---------------|
| Size | 2,000 examples + 500-word lexicon |
| Source | Nairobi social media, music lyrics |
| Labels | Sentiment + Sheng word ID + meaning |
| Task type | Multi-label |
| Consensus | 5 workers (higher for novel vocab) |
| Total annotations | 10,000 |
| Time | 3 weeks with 40 workers |
| Points cost | ~70,000 points |

**Client appeal:** "The only Sheng sentiment dataset in existence. If you're building for Kenya, you need this."

### 6.3 Dataset Monetization

| Option | Price Point | Target Buyer |
|--------|-------------|--------------|
| Free sample | 100 examples | Lead generation |
| Academic license | $500-2,000 | Researchers, citations |
| Commercial license | $5,000-20,000 | Startups, per-dataset |
| Exclusive license | $25,000+ | One buyer owns it |
| Custom extension | $0.50-2/label | "We want 50K more" |

> **Source:** [cold-start-strategy.md](grimoires/loa/context/cold-start-strategy.md) Part 1

### 6.4 Cold Start Sequencing

**Phase 0: Seed (Week 1-2)**
- Goal: 30 founding workers, systems working
- Recruit via WhatsApp/Twitter (50 sign-ups → 30 verified)
- Create 500 training tasks (Swahili sentiment)
- Workers complete training, earn points (3,000 points issued)
- End state: 30 workers, 600 labeled examples, quality baseline

**Phase 1: Dataset Build (Week 3-6)**
- Goal: Complete Dataset 1 (Swahili Sentiment), 100 workers
- Week 3: 50 workers, 3,000 annotations, 15,000 points (20% complete)
- Week 4: 70 workers, 5,000 annotations, 25,000 points (53% complete)
- Week 5: 90 workers, 5,000 annotations, 25,000 points (87% complete)
- Week 6: 100 workers, 2,000 annotations, 10,000 points (100% complete)
- **Parallel:** Cold outreach to 30 potential clients, share sample data

**Phase 2: First Revenue (Week 7-10)**
- Goal: Convert dataset interest to paying pilot
- Client wants custom labels: "$0.50/label, 48hr turnaround"
- Client wants different task: "100 free, then $X for more"
- Client wants to buy dataset: License negotiation ($2-10K)
- **Points transition:** Open redemption pool (20% of revenue)

**Phase 3: Sustainable Growth (Week 11+)**
- Balance paid work and points-based training
- $0-1K/mo: 20% paid, 80% training
- $1-5K/mo: 50% paid, 50% training
- $5-20K/mo: 70% paid, 30% training
- $20K+/mo: 85% paid, 15% training

> **Source:** [cold-start-strategy.md](grimoires/loa/context/cold-start-strategy.md) Part 3

### 6.5 Founding Worker Program

**Goal:** Lock in 50-100 committed early workers who understand the vision.

**Benefits (first 100 sign-ups who complete 50+ tasks):**

| Benefit | Value |
|---------|-------|
| 2x points multiplier | First 3 months |
| "Founding Worker" badge | Permanent, visible on profile |
| Priority access to paid tasks | Forever |
| Direct Slack/WhatsApp access to founder | Feedback channel |
| Revenue share bonus | 0.1% of first $100K GMV split |

**Revenue share math:**
- First $100K GMV = $1,000 bonus pool
- Split among ~50 active founding workers = ~$20 each
- Small but meaningful; aligns incentives

**Commitment required:**
- Complete 50 training tasks in first 2 weeks
- Maintain 85%+ accuracy
- Stay active (10+ tasks/week) for first 3 months

> **Source:** [cold-start-strategy.md](grimoires/loa/context/cold-start-strategy.md) Part 2

---

## 7. Technical Architecture

### 7.1 Technology Stack

**Frontend (Worker App - Mobile PWA):**
- Framework: Next.js 14 (PWA)
- UI: Tailwind CSS + shadcn/ui
- State: Zustand (lightweight)
- Offline: Service Workers + IndexedDB
- Mobile: PWA-first (2MB target), Capacitor for app store if needed later

**Backend:**
- Runtime: Node.js + Bun
- Framework: Hono (lightweight, fast)
- Database: Supabase (Postgres + Auth + Realtime)
- Queue: Upstash Redis (serverless)
- Storage: Cloudflare R2 (S3-compatible, cheap)

**Blockchain/Identity:**
- Chain: Celo L2 (Ethereum compatible)
- Payments: viem + Celo fee abstraction
- Identity: Self Protocol SDK
- Wallet: MiniPay integration (primary), direct Celo wallets (backup)

**Infrastructure:**
- Hosting: Vercel (frontend) + Railway (backend)
- CDN: Cloudflare (Africa edge nodes)
- Monitoring: Axiom (logs) + BetterStack (uptime)
- Analytics: PostHog

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 3.2

### 7.2 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │   AI Labs    │    │  Researchers │    │  AI Agents   │      │
│  │  Dashboard   │    │     API      │    │  (Phase 2)   │      │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘      │
│         └───────────────────┴───────────────────┘               │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Bawo API                             │  │
│  │  • Task submission      • Quality metrics                 │  │
│  │  • Batch operations     • x402 hooks (Phase 2)            │  │
│  └──────────────────────────┬───────────────────────────────┘  │
└─────────────────────────────┼────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                        CORE LAYER                                │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     Task Engine                           │  │
│  │  • Task queue (Redis)   • Matching algorithm              │  │
│  │  • Quality control      • Consensus engine                │  │
│  │  • Golden task injection • Reputation updates             │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│         ┌───────────────────┼───────────────────┐               │
│         ▼                   ▼                   ▼               │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐         │
│  │  Supabase  │     │   Redis    │     │    R2      │         │
│  │ (Postgres) │     │  (Queue)   │     │  (Assets)  │         │
│  └────────────┘     └────────────┘     └────────────┘         │
└─────────────────────────────┬────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                      IDENTITY LAYER                              │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Self Protocol                          │  │
│  │  • ZK identity verification  • Portable reputation        │  │
│  │  • KYC verification levels   • Skill credentials          │  │
│  │  • Cross-platform history    • Privacy-preserving         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                      PAYMENT LAYER                               │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Payment Router                          │  │
│  │  • Celo transactions        • Escrow management           │  │
│  │  • Fee abstraction          • MiniPay integration         │  │
│  │  • x402 handler (Phase 2)   • Yellow Card backup          │  │
│  └──────────────────────────┬───────────────────────────────┘  │
│         ┌───────────────────┼───────────────────┐               │
│         ▼                   ▼                   ▼               │
│  ┌────────────┐     ┌────────────┐     ┌────────────┐         │
│  │   Celo     │     │  MiniPay   │     │  Yellow    │         │
│  │   L2       │     │  Wallets   │     │   Card     │         │
│  └────────────┘     └────────────┘     └────────────┘         │
└─────────────────────────────┬────────────────────────────────────┘
                              │
┌─────────────────────────────┼────────────────────────────────────┐
│                      WORKER LAYER                                │
│                             ▼                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   Worker Interface (PWA)                  │  │
│  │  • Mobile-first            • Offline task caching         │  │
│  │  • Low bandwidth mode      • Service Workers              │  │
│  │  • MiniPay deep links      • Sub-2MB footprint            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Phase 1: Kenya MiniPay Users                                   │
│  Phase 2: + Nigeria, Ghana                                      │
└──────────────────────────────────────────────────────────────────┘
```

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 3.1

### 7.3 Quality Control System

**Multi-Layer QA:**

```
Task Submitted
     │
     ▼
┌─────────────────┐
│  Golden Tasks   │ ← 10% pre-labeled tests
│  (Hidden QA)    │   Workers don't know which
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Consensus     │ ← 3 workers, agreement required
│   Matching      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Spot Checks    │ ← 5% random expert review
│  (Human QA)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Reputation     │ ← Self Protocol score updated
│  Update         │   Affects future task access
└─────────────────┘
```

**Gaming Prevention:**

| Threat | Mitigation |
|--------|------------|
| Answer sharing on WhatsApp | Randomized task variants |
| Coordinated fraud rings | Device fingerprinting + IP analysis |
| Speed gaming (random clicks) | Minimum time thresholds |
| Multi-account abuse | Self Protocol = 1 passport = 1 account |
| Language spoofing | Language verification tasks first |

**Language Verification Protocol:**
- Complete 10 verification tasks (known-correct Swahili/Yoruba/etc.)
- 90%+ accuracy required
- Voice verification for speech tasks
- Native speaker spot-checks

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 2.4

### 7.4 Self Protocol Integration

**Identity Creation Flow:**
```
Worker Downloads App (opens link in MiniPay)
        │
        ▼
┌─────────────────┐
│  Phone Verify   │ ← Via MiniPay (Level 1 access)
└────────┬────────┘
        │
        ▼
┌─────────────────┐
│  Self Protocol  │ ← NFC passport scan (Level 2+)
│  ZK Verification│   did:selfid:celo:0x...
└────────┬────────┘
        │
        ▼
┌─────────────────┐
│  Wallet Link    │ ← MiniPay address linked
│  (Payment)      │
└────────┬────────┘
        │
        ▼
┌─────────────────┐
│  Ready to Work  │ ← Can start tasks
└─────────────────┘
```

**KYC Verification Levels:**

| Level | Requirements | Tasks Unlocked | Daily Limit |
|-------|-------------|----------------|-------------|
| Level 0 | Phone only | Training tasks | $0 |
| Level 1 | Phone + Email | Basic English tasks | $10/day |
| Level 2 | + Self Protocol | All standard tasks | $50/day |
| Level 3 | + Language verification | Premium language tasks | $200/day |

**Validation Plan (Week 1-2):**
1. Complete SDK integration test
2. Verify NFC passport support on Tecno, Infinix, Samsung A-series
3. Confirm ZK proof verification times
4. Test full flow: scan → proof → verification

**Fallback (if Self delays):**
- Level 1 phone verification only via MiniPay
- Revisit Self integration in 3 months
- Level 2+ requires traditional KYC (higher cost but viable)

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 3.3, [why-now.md](grimoires/loa/context/why-now.md)

---

## 8. Non-Functional Requirements

### 8.1 Performance Targets

| Metric | Target | Critical For |
|--------|--------|--------------|
| **Initial Load** | <3s on 3G | Target market (expensive data) |
| **Time to Interactive** | <5s | Worker engagement |
| **Task Load Time** | <2s | Task completion flow |
| **Payment Confirmation** | <5s | Trust, instant payment UX |
| **PWA Install Size** | <2MB | MiniPay constraint, $50 phones |

**Bundle Size Limits:**
- Total JS: <150kb gzipped (aggressive for mobile)
- Total CSS: <30kb gzipped
- Images: WebP format, lazy loaded, <50kb each

> **Source:** [DESIGN.md](DESIGN.md) Section 11

### 8.2 Browser Support

- **Primary:** MiniPay browser (Chromium-based)
- **Secondary:** Chrome Mobile, Safari Mobile (iOS)
- **Desktop:** Chrome, Firefox, Safari, Edge (last 2 versions) — client dashboard only
- **No Support:** IE11, Opera Mini (non-MiniPay)

**Mobile-First Constraints:**
- 86%+ web traffic via mobile in target markets
- Cheap Android phones ($50 Tecno, Infinix)
- Expensive data plans (optimize for low bandwidth)
- Intermittent connectivity (offline support critical)

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.1, [DESIGN.md](DESIGN.md)

### 8.3 Accessibility Requirements

- WCAG AA compliance (target)
- Keyboard navigation support
- Screen reader support (ARIA labels)
- Color contrast ratios: 4.5:1 minimum
- Focus indicators: 2px solid ring visible
- Touch targets: 48x48px minimum (thick fingers on cracked screens)
- No color-only information (always include text/icon)

> **Source:** [DESIGN.md](DESIGN.md) Section 7

### 8.4 Security Requirements

- HTTPS only
- CSRF protection (Supabase handles)
- XSS prevention (React escaping, CSP headers)
- SQL injection prevention (Supabase parameterized queries)
- Rate limiting on auth endpoints (Supabase built-in)
- Wallet signature verification for sensitive operations
- **No PII stored** (Self Protocol ZK proofs only)

---

## 9. Regulatory & Compliance

### 9.1 Regulatory Framework by Country

**Kenya (Phase 1):**
- Virtual Asset Service Providers Bill 2025: Dual regulator (Central Bank licenses stablecoins, CMA supervises exchanges)
- Requirements: Physical office in Kenya, board of 3+ natural persons, KYC/AML compliance
- Penalties: KES 25M ($193,500) or 5 years imprisonment
- Digital assets tax: 1.5% on transactions
- Data protection: ODPC registration required (all controllers/processors)

**Nigeria (Phase 2):**
- Investment and Securities Act 2025: Recognizes digital assets, SEC licenses VASPs
- CBN reversed 2021 banking ban (banks can serve licensed VASPs)
- **P2P crypto trading for Naira pairing banned** (forex manipulation prevention)
- Paying workers in stablecoins: Legal via licensed exchanges (Quidax, Busha)
- Crypto gains tax: Up to 25% for individuals (starting 2026)
- Data protection: NDPC registration (200+ data subjects in 6 months)

**Ghana (Phase 2):**
- VASP Bill 2025 (passed Dec 2025): Virtual Assets Regulatory Office
- Bank of Ghana: Payments, custody
- SEC: Trading, investment
- Commercial banks cannot directly engage with virtual assets but can bank registered VASPs
- Data protection: DPC registration (all data controllers)

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.8-9, [business-plan.md](grimoires/loa/context/business-plan.md) Section 7.2

### 9.2 Worker Classification

**Independent Contractors (all three countries):**
- No fixed hours or exclusivity
- Task-based compensation only
- Worker provides own equipment
- No employment benefits promised
- Clear terms of service
- Favorable classification: All three countries treat gig workers as independent contractors

**Nigeria Labour Act:** Silent on gig workers; courts use control tests favoring contractor classification
**Kenya Employment Act 2007:** Incorporates ILO guidance with similar outcomes
**Ghana Labour Act:** Distinguishes employees (contract of service) from contractors (contract for service)

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.9, [business-plan.md](grimoires/loa/context/business-plan.md) Section 7.2

### 9.3 Compliance Path

**Practical Implementation:**
1. Incorporate locally or partner with licensed entities in each market
2. Register with data protection authorities (ODPC Kenya, NDPC Nigeria, DPC Ghana)
3. Partner with licensed VASPs for stablecoin handling (Yellow Card, MiniPay ecosystem partners)
4. Structure worker relationships as independent contractor agreements
5. Build mental health safeguards before offering content moderation (Phase 3)

**Data Protection Compliance:**

| Country | Authority | Threshold | Penalties |
|---------|-----------|-----------|-----------|
| Nigeria | NDPC | 200+ data subjects in 6 months | ₦10M or 2% revenue |
| Kenya | ODPC | All controllers/processors | KES 5M or 1% turnover |
| Ghana | DPC | All data controllers | Fines + imprisonment |

> **Source:** [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.9, [business-plan.md](grimoires/loa/context/business-plan.md) Section 7.2

---

## 10. Business Model & Economics

### 10.1 Unit Economics

**Per-Task Economics (Sentiment Analysis Example):**
```
Client pays:           $0.08 per label
Worker receives:       $0.05 per label (60%)
Platform revenue:      $0.03 per label (40%)
Celo transaction fee:  $0.0002 (<1%)
Net margin:            $0.028 per label (35%)
```

**Per-Worker Economics (Monthly):**
```
Active worker: 10+ tasks/week

Average tasks/worker/month:     150 tasks
Average earnings/worker/month:  $10-25 (median ~$15)
Platform revenue/worker/month:  $7-17
Worker acquisition cost:        $1-3 (via referrals)
Worker LTV (6 months):          $40-100
LTV:CAC ratio:                  15-35x
```

**Per-Client Economics (Monthly):**
```
Starter client (self-serve):
- Monthly spend: $500-1,000
- Platform revenue: $175-350 (35% net)
- Support cost: ~$0 (automated)
- Net margin: ~$175-350

Growth client:
- Monthly spend: $2,000-5,000
- Platform revenue: $700-1,750
- Support cost: ~$100 (Slack)
- Net margin: ~$600-1,650
```

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 5.1

### 10.2 Pricing Strategy

**Worker Payment Philosophy:**
- Pay 2-3x industry rates (median $3-6/hour vs $1-2)
- Instant payment (not 30-60 days)
- No minimums (withdraw $0.01 if desired)
- Transparent: Worker always sees what client paid

**Client Pricing Formula:**
```
Client Price = (Worker Pay × 1.67) + Platform Fee

Example:
- Worker earns: $5.00/hour
- Platform margin: 40%
- Client pays: $5.00 × 1.67 = $8.35/hour
- Platform revenue: $3.35/hour
```

**Competitive Positioning:**

| Provider | Client Pays | Worker Gets | Platform Take |
|----------|-------------|-------------|---------------|
| Scale AI | $15-25/hr | $5-8/hr | 60-70% |
| Appen | $12-20/hr | $4-7/hr | 60-65% |
| Sama | $12.50/hr | $2/hr | **84%** |
| **Bawo** | $8-15/hr | $4-7/hr | **40%** |

**Task Pricing by Type (Phase 1):**

| Task Type | Client Pays | Worker Gets | Platform | Notes |
|-----------|-------------|-------------|----------|-------|
| Sentiment analysis | $8-12/hour | $4-7/hour | 40% | English, Swahili |
| Text classification | $8-15/hour | $5-9/hour | 40% | English, Swahili |

**Phase 2 Tasks (Higher Value):**

| Task Type | Client Pays | Worker Gets | Platform | Notes |
|-----------|-------------|-------------|----------|-------|
| RLHF preference | $20-40/hour | $12-24/hour | 40% | Requires training |
| Translation | $25-50/hour | $15-30/hour | 40% | Swahili ↔ English |
| Voice collection | $20-40/hour | $12-24/hour | 40% | African accents |

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Sections 2.3, 4.3, [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.7

### 10.3 Revenue Projections

**Year 1 Monthly Progression (Kenya Focus, Base Case):**

| Month | Workers | Clients | Tasks/Mo | Revenue | Costs | Net |
|-------|---------|---------|----------|---------|-------|-----|
| 1 | 50 | 0 | 1,000 | $0 | $500 | -$500 |
| 2 | 100 | 1 | 3,000 | $300 | $700 | -$400 |
| 3 | 200 | 2 | 8,000 | $1,000 | $1,200 | -$200 |
| 4 | 400 | 4 | 20,000 | $3,000 | $2,000 | $1,000 |
| 5 | 700 | 6 | 40,000 | $6,000 | $3,500 | $2,500 |
| 6 | 1,000 | 10 | 70,000 | $12,000 | $5,500 | $6,500 |
| 12 | 3,000 | 28 | 260,000 | $43,000 | $18,000 | $25,000 |

**Year 1 Summary (Base Case):**
- Total Revenue: ~$200K
- Total Costs: ~$89K
- Net Profit: ~$111K
- End State: 3,000 workers, 28 clients, $43K MRR

**Pessimistic Scenario:**
- Assumptions: 40% monthly worker churn, 25% margin, 50% slower client acquisition, 10% rejection rate
- Total Revenue: ~$100K
- Total Costs: ~$85K
- Net Profit: ~$15K
- End State: 1,500 workers, 15 clients, $20K MRR
- **Still viable at pessimistic assumptions**

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 5.2-5.3

### 10.4 Cost Structure

**Monthly Fixed Costs:**

| Category | Month 1-3 | Month 4-6 | Month 7-12 |
|----------|-----------|-----------|------------|
| Infrastructure | $100 | $300 | $800 |
| Tools | $50 | $100 | $200 |
| Domains, misc | $20 | $20 | $50 |
| **Total Fixed** | **$170** | **$420** | **$1,050** |

**Variable Costs:**

| Category | Rate | Notes |
|----------|------|-------|
| Payment processing | ~2% | MoonPay for fiat on-ramp |
| Celo gas fees | <$0.01/tx | Negligible |
| Referral bonuses | $1.50/user | $1 referrer + $0.50 referee |
| QA spot checks | $0.03/task | 5% manual review (higher early) |

**Startup Budget (First 90 Days):**

| Item | Cost |
|------|------|
| Legal (incorporation, terms) | $1,000 |
| Design (logo, basic branding) | $500 |
| Initial infrastructure | $500 |
| Referral seed budget | $1,000 |
| Marketing experiments | $500 |
| Buffer | $1,500 |
| **Total** | **$5,000** |

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 5.4

---

## 11. Go-To-Market Strategy

### 11.1 Worker Acquisition

**Phase 0: Manual Validation (Week 1-4)**

Goal: Validate Kenyan workers will do tasks and accept crypto payment

Actions:
1. Create WhatsApp group "Bawo Beta - Kenya"
2. Recruit 50 workers via:
   - University CS/IT posts (UoN, Strathmore, JKUAT)
   - Existing MiniPay community groups
   - Twitter/X outreach to Kenyan tech community
3. Distribute tasks manually via Google Forms
4. Pay via direct MiniPay transfers
5. Document friction points, completion rates, quality

Success Metrics:
- 50 workers recruited
- 80%+ task completion rate
- <5% payment issues
- Qualitative feedback collected

**Phase 1: MVP Launch (Month 2-3)**

Goal: 500 active workers in Kenya

| Channel | Target | Cost | Expected Users |
|---------|--------|------|----------------|
| WhatsApp groups | University students | $0 | 150 |
| Twitter/X | Kenyan tech community | $0 | 100 |
| Reddit r/beermoney | Side income seekers | $0 | 50 |
| Referral program | Viral growth | $500 | 200 |

**Phase 2: Scale Kenya (Month 4-6)**

Goal: 2,000 active workers

**University Ambassador Program:**
- Partner with 5 Kenyan universities
- Recruit 1 ambassador per university
- Ambassador benefits:
  - 5% of referrals' earnings (first 3 months)
  - $50/month stipend for hitting targets
  - Early access to premium tasks
- Target: 200 workers per university = 1,000 workers

**WhatsApp as Primary Channel:**
- 73% penetration in Kenya
- Organic distribution via groups
- Data efficient (1KB per message—critical for expensive data plans)

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 4.1, [agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf) p.6-7

### 11.2 Client Acquisition

**Ideal Customer Profile (Phase 1):**

| Segment | Company Profile | Budget | Decision Maker |
|---------|----------------|--------|----------------|
| **Primary** | AI startups (Seed-A) | $5-25K/project | CTO, ML Lead |
| **Secondary** | Research labs | $10-50K/project | PI, Research Lead |
| **Tertiary** | African market AI | $5-25K/project | Technical founder |

*Enterprise clients (Scale-up AI companies, Frontier labs) are Phase 2 targets after case studies and SOC 2.*

**Phase 0: First Revenue (Week 3-4)**

Goal: 1 paying client, $1,000+ revenue

**Manual Outreach (30 targets identified):**
1. AI startups building for African markets
2. NLP researchers on low-resource languages
3. Academic labs (Stanford HAI, MIT, CMU - African language projects)
4. Celo ecosystem projects needing data

**Cold Outreach Template:**
```
Subject: Native Swahili speakers for your AI model

Hi [Name],

I noticed [Company] is working on [specific project/model].

We're building Bawo—access to native speakers of Swahili,
English, and Sheng (Kenyan slang) for AI training data.

Unlike Scale AI (now conflicted via Meta) or offshore BPOs,
our workers are actual native speakers in Kenya, paid fairly
via instant crypto micropayments.

Would you have 15 minutes this week to discuss your data needs?

I can offer a free pilot: 100 labeled samples in Swahili
to test quality.

Best,
[Name]
```

**Free Pilot Offer:**
- 100 labeled samples, any task type
- 48-hour turnaround
- No commitment
- Purpose: Prove quality, get foot in door

> **Source:** [prospecting-list.md](grimoires/loa/context/prospecting-list.md) Part 4, [business-plan.md](grimoires/loa/context/business-plan.md) Section 4.2

**Phase 1: Productized Service (Month 2-4)**

**Pricing Tiers:**

| Tier | Price | Volume | Support | Turnaround |
|------|-------|--------|---------|------------|
| Starter | Pay-as-you-go | No minimum | Email | 72 hours |
| Growth | $500/mo + usage | $200 credits | Slack | 48 hours |

**Self-Serve Flow:**
1. Sign up with email
2. Deposit funds (crypto or card via MoonPay)
3. Create project, upload data
4. Define task instructions
5. Launch, monitor, download results

**28 Specific Targets (with research hooks):**

See full prospecting list for detailed outreach strategy:
- [prospecting-list.md](grimoires/loa/context/prospecting-list.md)

Includes:
- Company-specific research hooks
- Decision-maker names/titles
- Custom email templates by category
- Validation criteria (3+ "yes we'd pay" = validated)

> **Source:** [prospecting-list.md](grimoires/loa/context/prospecting-list.md) complete with all 28 targets

---

## 12. Success Metrics & KPIs

### 12.1 Key Performance Indicators

**Worker Acquisition:**
- Metric: 500 workers by Week 8, 3,000 by Month 12
- How Measured: Verified wallet count in Supabase

**Worker Retention:**
- Metric: 40%+ weekly retention (10+ tasks/week)
- How Measured: Task completion cohort analysis

**Worker Earnings:**
- Metric: $3-6/hour median active earnings
- How Measured: Earnings / active task time

**Client Acquisition:**
- Metric: 1 paying client by Week 4, 28 by Month 12
- How Measured: Clients with completed paid projects

**Revenue:**
- Metric: $1K MRR by Month 3, $43K MRR by Month 12
- How Measured: Platform fees collected

**Task Quality:**
- Metric: 90%+ accuracy on golden tasks
- How Measured: Golden task validation results

**Payment Speed:**
- Metric: <5 seconds from task submission to wallet credit
- How Measured: Transaction confirmation timestamps

### 12.2 Technical Metrics

- Uptime: 99.5%+
- Error rate: <1% of requests
- Page load time: <3s on 3G
- PWA install success: >90%
- Offline sync success: >95%

### 12.3 Key Milestones

| Milestone | Target Date | Success Criteria |
|-----------|-------------|------------------|
| First worker paid | Week 2 | 1 worker, $1+ paid via MiniPay |
| First client revenue | Week 4 | $500+ committed |
| MVP live | Week 8 | 100 workers on platform |
| Product-market fit signal | Month 3 | 40%+ weekly retention |
| Break-even | Month 5-6 | Revenue > costs |
| x402 live | Month 6 | First AI agent payment |
| Scale ready | Month 8 | 2,000 workers, $25K MRR |

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 6.3, [DESIGN.md](DESIGN.md) Section 12

---

## 13. Risk Analysis & Mitigation

### 13.1 Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Self Protocol integration issues** | Medium | High | Validate Week 1-2; fallback to tiered KYC |
| **MiniPay restricts access** | Low | High | Yellow Card backup; direct wallet support |
| **Regulatory (Kenya)** | Low | High | VASP Bill passed; partner with licensed entity |
| **Worker fraud** | High | Medium | Self Protocol; golden tasks; device fingerprinting |
| **Client concentration** | Medium | High | Diversify early; no client >30% revenue |
| **Quality at scale** | Medium | High | Quality Contract; consensus; spot checks |
| **Remotasks returns** | Low | Medium | Differentiate on payment speed + ethics |
| **Worker churn** | High | Medium | Gamification; competitive pay; reputation portability |
| **Competitor copies** | Medium | Low | Network effects; first-mover in African languages |

### 13.2 Contingency Plans

**If Self Protocol integration fails:**
- Launch with phone verification only (Level 1)
- Traditional KYC for Level 2+ (higher cost but viable)
- Revisit Self integration in 3 months

**If worker supply insufficient:**
- Increase referral bonuses temporarily
- Partner with universities for course credit
- Run paid acquisition campaign (Facebook, last resort)

**If client demand slow:**
- Offer extended free pilots
- Create benchmark datasets to sell directly
- Partner with AI bootcamps/courses

**If quality issues arise:**
- Increase consensus requirements (3 → 5)
- Add human QA layer (hire contractors)
- Reduce task complexity temporarily

**If regulatory issues emerge:**
- Pivot to M-PESA direct (non-crypto)
- Partner with compliant local entity
- Focus on most favorable jurisdiction

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 7.1, 7.3

---

## 14. Competitive Defense

### 14.1 What Happens When Scale AI Notices?

Scale AI could:
- Re-enter Kenya within 6 months
- Undercut pricing
- Partner with MiniPay directly

**Our Defense:**
1. **Worker trust** - Workers burned by Remotasks won't trust Scale again
2. **Speed to market** - 6+ months head start with reputation data
3. **Niche focus** - African languages small market for Scale; we specialize
4. **Cost structure** - No offices, no middle management = sustainably lower prices

### 14.2 Defensibility Over Time

**Year 1 Moats:**
1. First-mover in African language AI data
2. MiniPay integration (distribution advantage)
3. Self Protocol reputation (portable)
4. Ethical positioning (vs Sama controversy)

**Year 2+ Moats:**
1. Network effects (more workers → faster turnaround → more clients)
2. Data flywheel (better quality → better results → premium pricing)
3. Worker loyalty (reputation built on platform is valuable)
4. Language specialization (deep expertise in underserved languages)

### 14.3 Why Not Easily Copied

1. **Trust** - African workers burned by Remotasks won't trust new entrants
2. **Quality systems** - Consensus + golden tasks + reputation takes iteration
3. **Language expertise** - Understanding Swahili vs Sheng vs Kenyan English is nuanced
4. **Payment rails** - Crypto micropayments in Africa requires local knowledge
5. **First-mover reputation** - Workers' Self Protocol credentials are ours

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Part 8

---

## 15. Out of Scope (Explicit)

### 15.1 Not Included in MVP

- x402 protocol integration (AI agent buyers) → Phase 2 (Month 5-6)
- RLHF preference ranking tasks → Phase 2
- Voice data collection tasks → Phase 2
- Content moderation tasks → Phase 3 (requires mental health safeguards)
- Translation tasks → Phase 2
- Nigeria/Ghana expansion → Month 6+
- University ambassador program → Month 4+
- Agent networks (physical) → Not planned
- Native mobile apps → PWA only

**Why Not:**
- Focus on core task flow with 2 task types before expanding
- x402 adoption still early; human buyers sufficient initially
- Kenya-first reduces operational complexity
- Content moderation requires mental health protocol

**Maybe Later (Phase 2+):**
- x402 for autonomous AI agent payments
- Premium language tasks (Yoruba, Hausa after Nigeria expansion)
- Voice collection for ASR training
- Dataset marketplace (sell benchmark datasets directly)

> **Source:** [DESIGN.md](DESIGN.md) Section 14, [business-plan.md](grimoires/loa/context/business-plan.md)

---

## 16. Open Questions & Decisions

### 16.1 Resolved Questions

- [x] **Q1: Phase 1 geography?**
  - **Decision:** Kenya first (clearest regulations, M-PESA integration)
  - **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 1.2

- [x] **Q2: Which task types for MVP?**
  - **Decision:** Sentiment analysis + Text classification only
  - **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 2.3

- [x] **Q3: What if Self Protocol integration fails?**
  - **Decision:** Fallback to phone verification via MiniPay for Level 1, revisit in 3 months
  - **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 7.3

- [x] **Q4: Platform take rate?**
  - **Decision:** 40% (vs 60-84% at competitors)
  - **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 4.3

- [x] **Q5: Content moderation tasks — include in MVP?**
  - **Decision:** NO — requires mental health safeguards not yet built
  - **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Section 2.7

- [x] **Q6: Points program — include in MVP?**
  - **Decision:** YES — include full points program for cold start strategy
  - **Source:** [cold-start-strategy.md](grimoires/loa/context/cold-start-strategy.md)

### 16.2 Outstanding Questions

None. All major decisions resolved via business context documents.

---

## 17. Next Steps

### 17.1 Immediate Actions (Week 1)

1. **Legal & Infrastructure**
   - [ ] Set up legal entity (Kenya registration)
   - [ ] Create landing page (bawo.work)
   - [ ] Set up Twitter/X account
   - [ ] Create WhatsApp group "Bawo Beta - Kenya"

2. **Self Protocol Validation**
   - [ ] Complete SDK integration test
   - [ ] Test NFC passport scanning on Tecno, Infinix, Samsung A-series
   - [ ] Confirm ZK proof verification times
   - [ ] Document fallback plan if issues

3. **First Outreach**
   - [ ] Research first 10 client targets (African fintech)
   - [ ] Write first 5 cold outreach emails
   - [ ] Prepare free pilot offer (100 labels)

### 17.2 Week 2-4: First Workers & Revenue

- [ ] Recruit first 20 workers via personal network + WhatsApp
- [ ] Create Google Form for task submission (MVP)
- [ ] Design first task type: Simple text sentiment (English)
- [ ] Test MiniPay payment flow manually
- [ ] Run first batch of 100 tasks
- [ ] Close first pilot client ($1K+ committed)
- [ ] Reach 50 workers in WhatsApp group

### 17.3 Week 5-8: MVP Development

- [ ] Build core task engine (queue, assignment, completion)
- [ ] Integrate Supabase auth
- [ ] Build worker mobile UI (task list, submit, earnings)
- [ ] Build client dashboard (create project, upload data)
- [ ] Integrate MiniPay for payments
- [ ] Self Protocol integration (basic)
- [ ] Deploy MVP to production
- [ ] Reach 100 active workers, $1K MRR

### 17.4 Month 3-6: Scale & Quality

- [ ] Implement golden task injection
- [ ] Build consensus mechanism
- [ ] Create reputation scoring
- [ ] Launch referral program
- [ ] Implement streak rewards
- [ ] Launch university ambassador pilot (2 universities)
- [ ] Reach 1,000 workers, $12K MRR

### 17.5 Month 7-12: Expansion

- [ ] Begin x402 integration planning (Phase 2)
- [ ] Add Swahili language tasks
- [ ] Nigeria expansion prep (regulatory review)
- [ ] Reach 3,000 workers, $43K MRR

---

## 18. Appendices

### 18.1 Source Documents

All claims in this PRD are grounded in the following source documents:

1. **[DESIGN.md](DESIGN.md)** - Complete product design specification (1700+ lines)
2. **[business-plan.md](grimoires/loa/context/business-plan.md)** - Full business plan (v2.0, 1260 lines)
3. **[cold-start-strategy.md](grimoires/loa/context/cold-start-strategy.md)** - Points program + benchmark datasets (397 lines)
4. **[why-now.md](grimoires/loa/context/why-now.md)** - Technology convergence thesis (630 lines)
5. **[prospecting-list.md](grimoires/loa/context/prospecting-list.md)** - 28 client targets with research hooks (681 lines)
6. **[agentwork-analysis.pdf](grimoires/loa/context/agentwork-analysis.pdf)** - Market research (10 pages)

### 18.2 Task Type Specifications

**Sentiment Analysis:**
```yaml
task_type: sentiment_analysis
input: text string (max 500 chars)
output: {sentiment: positive|negative|neutral, confidence: 0-1}
instructions: |
  Determine the emotional tone of the text.
  Consider cultural context for Swahili/Sheng text.
consensus: 3
time_limit: 45 seconds
price: $0.03-0.08 per item
```

**Text Classification:**
```yaml
task_type: text_classification
input: text string (max 500 chars)
output: category label from provided list
instructions: |
  Read the text and select the most appropriate category.
  If unsure, select "unsure" - do not guess.
consensus: 3
time_limit: 30 seconds
price: $0.02-0.05 per item
```

> **Source:** [business-plan.md](grimoires/loa/context/business-plan.md) Appendix A

### 18.3 Cold Email Templates by Category

See [prospecting-list.md](grimoires/loa/context/prospecting-list.md) Part 4 for complete templates:
- Template A: African Fintech
- Template B: Academic/Research
- Template C: Big Tech AI
- Template D: Voice/Speech Companies
- Template E: Celo Ecosystem (Warm)

### 18.4 Glossary

| Term | Definition |
|------|------------|
| **MiniPay** | Opera's stablecoin wallet (11M users), built on Celo |
| **Celo** | Ethereum L2 with fee abstraction (pay gas in stablecoins) |
| **Self Protocol** | Zero-knowledge identity verification (portable reputation) |
| **x402** | HTTP 402 protocol for programmatic payments (AI agents) |
| **cUSD** | Celo Dollar stablecoin (pegged to USD) |
| **VASP** | Virtual Asset Service Provider (crypto regulatory term) |
| **RLHF** | Reinforcement Learning from Human Feedback |
| **Golden task** | Pre-labeled test task (worker doesn't know it's a test) |
| **Consensus** | Agreement among multiple workers on same task |
| **Sheng** | Nairobi street slang (~10M speakers, no NLP resources) |

---

## Document Approval

**Status:** ✅ Ready for Review

**Pending Approvals:**
- [ ] CEO (Zoz) - Final approval on PRD
- [ ] Technical review - Validate Self Protocol integration plan
- [ ] Regulatory review - Confirm Kenya compliance path

**Next Document:** Software Design Document (SDD)
**Command to generate:** `/architect`

---

**End of PRD v2.0**
