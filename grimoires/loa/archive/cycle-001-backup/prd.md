# Product Requirements Document: Bawo

**Version:** 1.0.0
**Status:** Draft
**Date:** 2026-01-27
**Author:** Claude (Loa Framework)
**Sources:** DESIGN.md (1405 lines)

---

## 1. Problem Statement

Traditional payment rails fail catastrophically for micropayments to African workers, creating a systemic barrier to fair compensation in the global AI data labeling market.

**The Core Problem:**

When AI companies need to pay African workers for data labeling tasks, existing payment systems make micropayments economically impossible:

- **$0.05 payment via PayPal = $0.30 fee** (600% overhead — completely unviable)
- **Payoneer = $50 minimum withdrawal** (forces workers to wait months)
- **Bank transfer = $25-50 flat fees** (eliminates micropayment viability)
- **M-PESA small amounts = ~10% fee** (eats into already-low earnings)

**Consequences:**

1. **Payment Batching (30-60 days)**: Platforms must batch payments to amortize fees, creating trust issues and cash flow problems for workers
2. **Platform Exits Burn Workers**: Remotasks exited Kenya without paying out batched earnings, destroying worker trust
3. **Exploitative Platform Economics**: Sama takes 84% platform cut, paying workers $1-2/hour for work clients pay $12.50/hour for
4. **African Language Data Scarcity**: No platform prioritizes African languages because payment infrastructure doesn't support the economics

**Market Evidence:**

- $37B spent on GenAI in 2025, yet African workers earn $1-2/hour (AgentWork.ai research)
- Scale AI acquisition by Meta creates conflict of interest for African market data
- Sama controversy over mental health and labor practices creates PR risk for ethical AI companies
- MTurk pays in Amazon gift cards (15-30% conversion loss), excluding workers from real money

> **Sources:** DESIGN.md:60-107 (Problem Statement), DESIGN.md:102-107 (Market Comparison)

---

## 2. Vision

**Product Vision:**

Bawo (Yoruba: "how are you?") is a crypto-powered platform where AI companies pay African workers for data labeling tasks via instant stablecoin micropayments on Celo. We connect insatiable demand from AI labs with MiniPay wallet holders who can earn 2-4x more than existing platforms while receiving instant payment.

**One-Liner:**
High-trust, low-latency human feedback loops for underserved language domains, paid instantly via stablecoins.

**Why Now?**

1. **MiniPay Distribution**: 11M wallets in Africa (no user acquisition cost)
2. **Celo L2 Economics**: $0.0002 transaction fees (<1% vs 600% on PayPal)
3. **AI Data Demand**: $37B GenAI spend, underserved African language market
4. **Competitor Failures**: Remotasks exit, Sama controversy, Scale AI conflict of interest
5. **Self Protocol Maturity**: ZK identity verification enables Sybil-resistant portable reputation

**Why Us?**

- **First-mover** in African language AI data + crypto micropayments
- **MiniPay-native** (no wallet onboarding friction for 11M users)
- **Ethical differentiation** from Sama/Scale AI (transparent pricing, fair pay, portable reputation)
- **Self Protocol integration** (workers own their reputation credentials)

> **Sources:** DESIGN.md:20-27 (Vision), DESIGN.md:bawo-why-now-v2.md reference

---

## 3. Goals & Success Metrics

### Business Goals

**G-1: Worker Acquisition**
**Priority:** P0
**Description:** Build trusted worker base in Kenya
**Success Criteria:**
- 500 verified workers by Week 8
- 3,000 verified workers by Month 12
- 40%+ weekly retention (workers completing 10+ tasks/week)

**G-2: Worker Earnings Quality**
**Priority:** P0
**Description:** Deliver 2-4x competitor earnings with instant payment
**Success Criteria:**
- $3-6/hour median active earnings (vs $1-2 at competitors)
- <5 seconds payment confirmation after task completion
- 90%+ task accuracy on golden tasks

**G-3: Client Acquisition**
**Priority:** P0
**Description:** Acquire paying AI companies and research labs
**Success Criteria:**
- 1 paying client by Week 4
- 28 paying clients by Month 12
- 48-hour turnaround on standard projects

**G-4: Revenue Growth**
**Priority:** P0
**Description:** Achieve sustainable revenue at 40% platform take
**Success Criteria:**
- $1K MRR by Month 3
- $43K MRR by Month 12
- 40% platform take (vs 60-84% at competitors)

**G-5: Platform Quality**
**Priority:** P1
**Description:** Maintain high quality and reliability
**Success Criteria:**
- 99.5%+ uptime
- <1% error rate
- <3s page load on 3G
- 90%+ accuracy on golden tasks

> **Sources:** DESIGN.md:1249-1285 (Success Metrics)

---

## 4. Users & Personas

### Primary User Persona (Worker)

**Name/Role:** Amara — The Kenyan University Student

**Background:**
- 22-year-old computer science student at University of Nairobi
- Earns side income from gig work
- $50 Android phone with MiniPay installed
- Bilingual in English and Swahili, speaks some Sheng (Nairobi slang)

**Technical Skill Level:**
Comfortable with mobile apps, uses MiniPay for daily transactions

**Goals:**
- Earn $10-25/month supplemental income in dollars (hedge against currency volatility)
- Build portable reputation that transfers across platforms
- Flexible hours around university classes

**Pain Points:**
- Remotasks paid $1/hour then exited Kenya without paying out
- MTurk pays in Amazon gift cards (15-30% loss to convert)
- Payoneer requires $50 minimum withdrawal (must wait months)

**Needs:**
- Instant payment after task completion
- Dollar-denominated earnings (not volatile local currency)
- No minimum withdrawal thresholds
- Clear task instructions in English/Swahili

---

### Secondary Persona (Worker)

**Name/Role:** Kofi — The Ghanaian Freelancer

**Background:**
- 28-year-old with degree in linguistics
- Does translation work professionally
- Native Twi speaker, fluent in English

**Technical Skill Level:**
Power user, manages multiple gig platforms

**Goals:**
- Premium rates for African language expertise
- Instant payment to M-PESA
- Professional credentials and reputation

**Pain Points:**
- No platform values his Twi language skills
- Payment delays of 30-60 days
- 84% platform take at Sama (earns $2 when client pays $12.50)

**Needs:**
- African language task opportunities
- Instant micropayment infrastructure
- Portable reputation credentials

---

### Primary User Persona (Client - AI Buyer)

**Name/Role:** Dr. Chen — ML Research Lead at AI Startup

**Background:**
- Leads data quality at Seed-stage AI company building for African markets
- $5-25K/project budget
- Technical background

**Technical Skill Level:**
Technical, comfortable with APIs

**Goals:**
- High-quality Swahili sentiment data
- 48-hour turnaround on projects
- Neutral vendor (not conflicted like Scale AI/Meta)

**Pain Points:**
- Scale AI's Meta acquisition created conflict of interest
- Offshore BPOs don't have native African language speakers
- Sama controversy creates PR risk for ethical AI positioning

**Needs:**
- Self-serve project creation (CSV upload → labeled results)
- Quality guarantees (golden tasks, consensus)
- Transparent pricing and ethical labor practices

---

### Secondary Persona (Client)

**Name/Role:** Prof. Okonkwo — NLP Researcher at University

**Background:**
- Principal Investigator working on low-resource language models
- Grant-funded budget ($5-15K projects)
- Research-focused

**Technical Skill Level:**
Research-focused, needs clean datasets with documentation

**Goals:**
- Publishable Swahili/Sheng datasets with annotation guidelines
- Academic licensing and proper attribution
- Reproducible data collection methods

**Pain Points:**
- Masakhane datasets are limited
- No good Sheng corpus exists
- Building own annotation pipeline is expensive

**Needs:**
- Dataset downloads with metadata and annotation guidelines
- Academic pricing and licensing
- Citation-ready documentation

> **Sources:** DESIGN.md:29-56 (User Personas)

---

## 5. Functional Requirements

### FR-1: MiniPay Wallet Detection & Auto-Connect
**Priority:** P0
**Description:** Detect if user is in MiniPay browser, auto-connect wallet without manual "Connect Wallet" button
**User Value:** Zero friction onboarding for MiniPay's 11M users
**Acceptance Criteria:**
- Wallet connects automatically on page load in MiniPay browser
- Shows "Open in MiniPay" message on other browsers
- No manual wallet connection step required

---

### FR-2: Self Protocol Identity Verification
**Priority:** P0
**Description:** Workers verify humanity via NFC passport scan, ZK proof generated, no PII stored
**User Value:** Sybil resistance (1 passport = 1 account), portable reputation workers own
**Acceptance Criteria:**
- Worker scans passport NFC chip (10 seconds)
- ZK proof sent to Bawo (no PII transmitted)
- Worker receives verification badge
- Can start tasks within 60 seconds of verification success
- **Fallback:** If Self Protocol unavailable, use phone verification via MiniPay (Level 1 access only, $10/day limit)

---

### FR-3: Sentiment Analysis Task Type
**Priority:** P0
**Description:** Display text (max 500 chars), worker selects Positive/Negative/Neutral, submit
**User Value:** Core task type with broad client demand
**Acceptance Criteria:**
- Tasks load in <2s
- Timer countdown works (45s limit)
- Selection buttons accessible (48px touch targets)
- Submission credits earnings instantly

---

### FR-4: Text Classification Task Type
**Priority:** P0
**Description:** Display text, worker selects from predefined category list (client-defined)
**User Value:** Second core task type, flexible for client needs
**Acceptance Criteria:**
- Categories display correctly (up to 10 options)
- Selection submits successfully
- Earnings credited after QA validation

---

### FR-5: Instant Stablecoin Payment
**Priority:** P0
**Description:** After task submission (post-QA), send cUSD to worker's wallet
**User Value:** Instant payment (not 30-60 days), visible in MiniPay immediately
**Acceptance Criteria:**
- Payment confirmed on Celo within 5 seconds
- Worker sees balance update in UI
- Transaction hash visible in earnings history
- Fee <$0.01 (<1% of typical $0.05 task)

---

### FR-6: Withdrawal to MiniPay
**Priority:** P0
**Description:** Worker initiates withdrawal, funds sent to their MiniPay wallet
**User Value:** No minimum withdrawal, instant access to earnings
**Acceptance Criteria:**
- Any amount withdrawable (even $0.01)
- Transaction completes in <5s
- Fee <$0.01
- Worker can off-ramp to M-PESA in 55 seconds (external MiniPay feature)

---

### FR-7: Golden Task QA System
**Priority:** P0
**Description:** 10% of tasks are pre-labeled tests, workers don't know which
**User Value:** Quality assurance without manual review overhead
**Acceptance Criteria:**
- Golden tasks injected randomly into task queue
- Workers cannot distinguish golden from real tasks
- Accuracy tracked per worker (running percentage)
- Worker reputation updated based on golden task performance
- Workers with <70% golden accuracy receive warning
- Workers with <60% golden accuracy blocked from tasks

---

### FR-8: Consensus Mechanism
**Priority:** P0
**Description:** Same task sent to 3 workers, majority agreement required for payment
**User Value:** Higher quality labels through redundancy
**Acceptance Criteria:**
- Tasks assigned to 3 workers randomly
- Consensus calculated (2/3 majority)
- All workers with majority answer receive payment
- Workers with minority answer do not receive payment (task returned to queue)
- Consensus rate tracked per worker

---

### FR-9: Client Dashboard - Project Creation
**Priority:** P0
**Description:** Client uploads CSV, sets task type/instructions/price, launches project
**User Value:** Self-serve project creation without manual onboarding sales call
**Acceptance Criteria:**
- CSV file upload works (max 10MB, 10,000 rows)
- Task type selection (Sentiment, Classification)
- Instructions textarea with template provided
- Price per task input (minimum shown based on task type)
- Total cost calculator updates in real-time
- Project queues successfully to workers
- Progress bar visible on project dashboard

---

### FR-10: Client Dashboard - Results Download
**Priority:** P0
**Description:** Client downloads labeled data as CSV when project completes
**User Value:** Easy access to completed work
**Acceptance Criteria:**
- CSV includes: original text, worker labels, consensus label, confidence score
- Download triggers when project 100% complete
- Partial download available (shows % complete)
- Quality metrics included in download metadata

---

### FR-11: Offline Task Caching (Worker App)
**Priority:** P0
**Description:** Tasks cached locally via IndexedDB, submissions queued when offline
**User Value:** Work continues despite intermittent connectivity (common in target markets)
**Acceptance Criteria:**
- Tasks viewable offline after initial cache
- Submissions queue locally when offline
- Sync happens automatically when reconnected
- UI shows "Saved offline, will submit when connected" message
- 95%+ offline sync success rate

---

### FR-12: Points Program (Cold Start)
**Priority:** P0
**Description:** Workers earn points during training/low-volume phase, redeem when revenue pool has funds
**User Value:** Keep workers engaged before paying clients; aligned incentives
**Acceptance Criteria:**
- Points awarded for training tasks (100 points = $1.00 equivalent)
- Redemption pool funded by 20% of monthly revenue
- Workers see points balance and redemption pool availability
- Points convertible to cUSD at 100:1 ratio
- 12-month expiry on unredeemed points
- Treasury management per cold-start-strategy.md

> **Sources:** DESIGN.md:636-698 (MVP Features)

---

## 6. Non-Functional Requirements

### NFR-1: Performance - Initial Load
**Category:** Performance
**Description:** Page load time on 3G networks
**Target:** <3 seconds on 3G (critical for target market)

---

### NFR-2: Performance - Time to Interactive
**Category:** Performance
**Description:** App becomes interactive
**Target:** <5 seconds

---

### NFR-3: Performance - Task Load Time
**Category:** Performance
**Description:** Task content loads and displays
**Target:** <2 seconds

---

### NFR-4: Performance - Payment Confirmation
**Category:** Performance
**Description:** Time from task submission to wallet credit
**Target:** <5 seconds

---

### NFR-5: Performance - Bundle Size
**Category:** Performance
**Description:** PWA install size (MiniPay constraint)
**Target:** <2MB total, <150kb JS gzipped, <30kb CSS gzipped

---

### NFR-6: Security - HTTPS Only
**Category:** Security
**Description:** All traffic encrypted
**Target:** 100% HTTPS, HSTS headers enabled

---

### NFR-7: Security - Wallet Signature Verification
**Category:** Security
**Description:** Sensitive operations require wallet signature
**Target:** All withdrawals and profile changes require signature

---

### NFR-8: Security - No PII Storage
**Category:** Security
**Description:** Self Protocol ZK proofs only, no personally identifiable information stored
**Target:** Zero PII in database (wallet address + DID only)

---

### NFR-9: Security - XSS Prevention
**Category:** Security
**Description:** Prevent cross-site scripting
**Target:** React escaping + CSP headers, zero XSS vulnerabilities

---

### NFR-10: Security - SQL Injection Prevention
**Category:** Security
**Description:** Prevent SQL injection
**Target:** Supabase parameterized queries, zero SQL injection vulnerabilities

---

### NFR-11: Reliability - Uptime
**Category:** Reliability
**Description:** Platform availability
**Target:** 99.5%+ uptime

---

### NFR-12: Reliability - Error Rate
**Category:** Reliability
**Description:** API error rate
**Target:** <1% of requests

---

### NFR-13: Reliability - Offline Sync
**Category:** Reliability
**Description:** Offline submission sync success
**Target:** >95% success rate

---

### NFR-14: Usability - Accessibility
**Category:** Usability
**Description:** WCAG AA compliance
**Target:**
- Color contrast 4.5:1 minimum
- Keyboard navigation support
- Screen reader support (ARIA labels)
- Touch targets 48x48px minimum
- No color-only information

---

### NFR-15: Scalability - Concurrent Workers
**Category:** Scalability
**Description:** Support target worker base
**Target:** 3,000 concurrent workers by Month 12

---

### NFR-16: Scalability - Task Throughput
**Category:** Scalability
**Description:** Task assignment and completion rate
**Target:** 10,000 tasks/day by Month 6

> **Sources:** DESIGN.md:1149-1186 (Performance & Technical Constraints), DESIGN.md:1059-1067 (Security Requirements)

---

## 7. User Stories

### US-1: Worker Onboarding
**Persona:** Amara (Kenyan Student)
**Priority:** P0
**Story:** As a new worker, I want to verify my identity quickly via Self Protocol so that I can start earning money within 60 seconds
**Acceptance Criteria:**
- Click link in WhatsApp group
- MiniPay browser auto-detects wallet
- Self app opens for passport NFC scan (10 seconds)
- Verification success, account created
- Complete 5-question training tutorial
- See available tasks on dashboard

---

### US-2: Task Completion
**Persona:** Amara (Kenyan Student)
**Priority:** P0
**Story:** As a worker, I want to complete sentiment analysis tasks quickly so that I can earn money during my lunch break
**Acceptance Criteria:**
- Tap "Start Task" on available task card
- See text to classify (max 500 chars)
- Select Positive/Negative/Neutral
- Tap "Submit"
- See "Earned $0.05" notification within 1 second
- Next task auto-loads

---

### US-3: Instant Withdrawal
**Persona:** Amara (Kenyan Student)
**Priority:** P0
**Story:** As a worker, I want to withdraw my earnings instantly with no minimum so that I can cash out to M-PESA whenever I need money
**Acceptance Criteria:**
- Tap "Withdraw" on earnings screen
- Enter amount (or tap "Withdraw All")
- Confirm wallet address (pre-filled)
- Tap "Withdraw Now"
- See funds in MiniPay wallet within 5 seconds
- Tap "Cash out to M-PESA" link (55-second off-ramp)

---

### US-4: Offline Task Work
**Persona:** Kofi (Ghanaian Freelancer)
**Priority:** P0
**Story:** As a worker with intermittent internet, I want to complete tasks offline so that I can work during my commute without connectivity
**Acceptance Criteria:**
- Tasks cached locally when online
- Can view and complete tasks offline
- Submissions queue locally
- See "Saved offline, will submit when connected" message
- Auto-sync when reconnected

---

### US-5: Client Project Creation
**Persona:** Dr. Chen (AI Startup)
**Priority:** P0
**Story:** As an AI company client, I want to upload my CSV and launch a labeling project self-service so that I can get results in 48 hours without sales calls
**Acceptance Criteria:**
- Click "Create Project"
- Upload CSV (10,000 rows of Swahili tweets)
- Select "Sentiment Analysis"
- Set price per task ($0.05)
- Review total cost estimate ($500 for 10K tasks)
- Confirm balance, click "Launch Project"
- See project dashboard with real-time progress

---

### US-6: Client Results Download
**Persona:** Prof. Okonkwo (NLP Researcher)
**Priority:** P0
**Story:** As a research client, I want to download labeled data with quality metrics so that I can use it in my publication
**Acceptance Criteria:**
- Receive email: "Your project is complete"
- Open project dashboard
- See quality metrics (92% accuracy, 88% consensus rate)
- Click "Download Results"
- Receive CSV with original text, labels, confidence scores
- Include metadata file with annotation guidelines

---

### US-7: Points Redemption (Cold Start)
**Persona:** Amara (Kenyan Student)
**Priority:** P1
**Story:** As a worker during the cold start phase, I want to redeem my earned points for real cUSD so that my early work is rewarded when the platform has revenue
**Acceptance Criteria:**
- See "Points Balance: 5,000 (=$50)"
- See "Redemption Pool: $400 available"
- Tap "Redeem Points"
- Enter amount (max limited by pool and balance)
- Points convert to cUSD at 100:1 ratio
- cUSD sent to wallet

---

### US-8: Referral Program
**Persona:** Kofi (Ghanaian Freelancer)
**Priority:** P2
**Story:** As a worker, I want to refer friends and earn bonuses so that I can help grow the platform and earn extra income
**Acceptance Criteria:**
- Tap "Refer Friends" in menu
- See unique referral link
- Share via WhatsApp deep link
- Referee signs up and completes 10 tasks
- Both referrer and referee receive $1.00/$0.50 bonus
- Bonus appears in earnings with "Referral" label

> **Sources:** DESIGN.md:112-245 (User Flows)

---

## 8. Scope

### In Scope (MVP)

**Worker Features:**
- MiniPay wallet auto-connect
- Self Protocol identity verification (with phone fallback)
- Sentiment analysis tasks
- Text classification tasks
- Instant cUSD payments (<5s)
- Withdrawal to MiniPay (no minimum)
- Offline task caching and sync
- Points program for cold start
- Worker dashboard with earnings history
- Training tutorial (5 questions)

**Client Features:**
- Email/password authentication
- Project creation (CSV upload)
- Task type selection (sentiment, classification)
- Results download (CSV with metadata)
- Balance management and deposits
- Project progress dashboard

**Quality Assurance:**
- Golden task QA system (10% injection rate)
- Consensus mechanism (3 workers, majority rule)
- Worker accuracy tracking
- Reputation tiers (Bronze/Silver/Gold)

**Technical:**
- PWA (Progressive Web App) for workers
- Web dashboard for clients
- Celo blockchain integration (cUSD payments)
- Supabase (database, auth, realtime)
- Next.js 14 (SSR + PWA)
- IndexedDB (offline storage)
- Service Workers (offline support)

**Geography:**
- Kenya only (Phase 1)
- English + Swahili languages

---

### Out of Scope (Explicitly Excluded from MVP)

**Task Types:**
- Content moderation (requires mental health safeguards — deferred to Phase 2+)
- RLHF preference ranking (complex UI — Phase 2)
- Voice data collection (requires audio handling — Phase 2)
- Translation tasks (Phase 2)

**Features:**
- x402 Protocol integration (AI agent buyers — Phase 2, adoption still early)
- Referral program (nice-to-have, not critical for MVP)
- Streak rewards (retention optimization for post-MVP)
- Leaderboards (gamification for post-MVP)
- Native mobile apps (PWA sufficient for MVP)

**Geography:**
- Nigeria expansion (Month 6+)
- Ghana expansion (Month 6+)
- Other African markets (Phase 2+)

**Programs:**
- University ambassador program (Month 4+)
- Agent networks (physical hubs — not planned)

---

### Future Considerations (Phase 2+)

- x402 protocol for autonomous AI agent payments
- Premium language tasks (Yoruba, Hausa, Igbo after Nigeria expansion)
- Voice collection for ASR training data (African accents)
- Dataset marketplace (sell benchmark datasets directly)
- Translation tasks (bidirectional, African languages ↔ English)
- RLHF tasks (preference ranking for model alignment)
- Content moderation with mental health safeguards
- Multi-country expansion (Nigeria, Ghana, Uganda, Tanzania)

> **Sources:** DESIGN.md:636-698 (Scope), DESIGN.md:1322-1344 (Out of Scope)

---

## 9. Risks & Dependencies

### Risks

**R-1: Self Protocol Integration Failure**
**Impact:** High
**Probability:** Medium
**Description:** Self Protocol SDK may not integrate smoothly or may have availability issues
**Mitigation:**
- Built fallback to phone verification via MiniPay (Level 1 access)
- Test integration early in sprint planning
- Contact Self Protocol team for technical support
- Accept Level 1 limitations ($10/day cap) as acceptable MVP fallback

---

**R-2: MiniPay API Changes**
**Impact:** Critical
**Probability:** Low
**Description:** MiniPay browser or wallet provider API changes could break auto-connect
**Mitigation:**
- Use standard Web3 provider detection (window.ethereum)
- Monitor MiniPay developer announcements
- Build graceful fallback to manual wallet connection
- Test across MiniPay versions

---

**R-3: Celo Network Downtime**
**Impact:** High
**Probability:** Low
**Description:** Celo blockchain downtime would prevent payments
**Mitigation:**
- Monitor Celo network status via API
- Queue payments locally during downtime
- Auto-retry with exponential backoff
- Communicate transparently to workers about delays

---

**R-4: Worker Churn (Trust Issues)**
**Impact:** High
**Probability:** Medium
**Description:** Workers may not trust new platform after Remotasks exit
**Mitigation:**
- Instant payment demonstration (no batching)
- Self Protocol portable reputation (workers own credentials)
- Transparent pricing and terms
- WhatsApp community for support and trust-building
- Points program ensures early workers are rewarded

---

**R-5: Client Acquisition Failure**
**Impact:** Critical
**Probability:** Medium
**Description:** May not reach 1 paying client by Week 4
**Mitigation:**
- Direct outreach to prospecting list (bawo-prospecting-list.md)
- Offer pilot pricing ($200 credit for first project)
- Leverage founder network for warm intros
- Focus on AI startups building for African markets (natural fit)
- Use points program to build worker base before clients arrive

---

**R-6: Payment Fee Spike**
**Impact:** Medium
**Probability:** Low
**Description:** Celo transaction fees could spike during network congestion
**Mitigation:**
- Monitor gas prices via API
- Set max gas price threshold
- Batch small payments if fees exceed threshold
- Communicate fee policy to workers

---

**R-7: Regulatory Changes (Kenya)**
**Impact:** High
**Probability:** Low
**Description:** Kenya could change crypto regulations or MiniPay licensing
**Mitigation:**
- Monitor regulatory developments
- Legal counsel on crypto labor platforms
- Plan expansion to Ghana/Nigeria (diversification)
- Build relationship with Kenyan fintech regulators

---

**R-8: Data Quality Issues (Low Accuracy)**
**Impact:** High
**Probability:** Medium
**Description:** Workers may not achieve 90% accuracy target on golden tasks
**Mitigation:**
- Comprehensive training tutorial (5 questions minimum)
- Clear task instructions with examples
- Golden task feedback loop (show correct answers after threshold)
- Tier system (Bronze/Silver/Gold) restricts complex tasks to high performers

---

**R-9: Offline Sync Failures**
**Impact:** Medium
**Probability:** Medium
**Description:** IndexedDB sync may fail, causing lost work
**Mitigation:**
- Aggressive retry logic with exponential backoff
- Persist submissions until confirmed by server
- Show clear status indicators ("Syncing...", "Synced")
- Target >95% sync success rate, monitor in production

---

### Dependencies

**D-1: MiniPay**
**Type:** External
**Status:** Pending
**Description:** MiniPay browser and wallet infrastructure must remain available and stable. 11M wallet distribution is core to go-to-market strategy.
**Risk:** If MiniPay deprecates or changes APIs, affects entire worker onboarding flow.

---

**D-2: Self Protocol**
**Type:** External
**Status:** Pending
**Description:** Self Protocol SDK must work for NFC passport scanning and ZK proof generation. Core to Sybil resistance and portable reputation.
**Risk:** If unavailable, fallback to phone verification reduces verification quality.

---

**D-3: Celo Blockchain**
**Type:** Technical
**Status:** Resolved (live network)
**Description:** Celo mainnet must be stable for cUSD payments. Transaction finality <5s and fees <$0.01 are critical.
**Risk:** Network congestion or downtime delays payments.

---

**D-4: Supabase**
**Type:** Technical
**Status:** Resolved (production-ready SaaS)
**Description:** Supabase provides database, auth, and realtime subscriptions. Core infrastructure dependency.
**Risk:** Supabase outage affects entire platform. Mitigation: Monitor uptime, plan migration path if needed.

---

**D-5: Vercel**
**Type:** Technical
**Status:** Resolved (production-ready)
**Description:** Hosting for Next.js PWA and client dashboard.
**Risk:** Deployment issues could affect uptime. Mitigation: Use Vercel Pro tier with SLA.

---

**D-6: Worker Acquisition (WhatsApp Groups)**
**Type:** Resource
**Status:** In Progress
**Description:** Depends on WhatsApp group access for Kenyan university students and MiniPay users.
**Risk:** If group access denied, slows worker acquisition. Mitigation: Multi-channel approach (Telegram, Twitter, campus ambassadors).

---

**D-7: Client Prospecting List**
**Type:** Resource
**Status:** Resolved
**Description:** bawo-prospecting-list.md provides 28 target clients (AI startups, research labs).
**Risk:** If list is outdated or contacts unresponsive, slows client acquisition. Mitigation: Regular list updates, warm intros via network.

> **Sources:** Inferred from DESIGN.md:1170-1186 (Technical Stack), DESIGN.md:636-698 (Feature Dependencies), DESIGN.md:1289-1317 (Open Questions — resolved)

---

## 10. Timeline & Milestones

**Start Date:** 2026-01-27
**Target MVP Launch:** 2026-04-07 (10 weeks)

### Milestone 1: PRD & Architecture (Week 1)
**Target Date:** 2026-02-03
**Deliverables:**
- PRD complete (this document)
- SDD complete (via /architect)
- Sprint plan complete (via /sprint-plan)
- Development environment set up

---

### Milestone 2: Core Worker Flow (Weeks 2-4)
**Target Date:** 2026-02-24
**Deliverables:**
- MiniPay wallet auto-connect working
- Self Protocol verification integrated (with fallback)
- Sentiment analysis task type functional
- Text classification task type functional
- Training tutorial (5 questions)
- Worker dashboard UI complete

---

### Milestone 3: Payment Infrastructure (Weeks 5-6)
**Target Date:** 2026-03-10
**Deliverables:**
- Celo cUSD payment integration
- Withdrawal flow working
- Golden task QA system functional
- Consensus mechanism working
- Earnings tracking and history

---

### Milestone 4: Client Dashboard (Weeks 7-8)
**Target Date:** 2026-03-24
**Deliverables:**
- Client authentication (email/password)
- Project creation flow (CSV upload)
- Results download (CSV export)
- Balance management and deposits
- Project progress dashboard

---

### Milestone 5: Offline Support & Polish (Week 9)
**Target Date:** 2026-03-31
**Deliverables:**
- Service Workers + IndexedDB offline caching
- PWA manifest and install prompts
- Performance optimization (<3s load on 3G)
- Accessibility audit (WCAG AA)
- Error handling and edge cases

---

### Milestone 6: Beta Launch (Week 10)
**Target Date:** 2026-04-07
**Deliverables:**
- 50 beta workers onboarded (Kenyan university WhatsApp groups)
- 1 pilot client project ($200 credit)
- Monitoring and analytics (PostHog, Axiom)
- Security audit complete
- Public beta announcement

---

## 11. Sources & Traceability

All requirements in this PRD are derived from the following source:

| Section | Source File | Line Range | Notes |
|---------|-------------|------------|-------|
| Problem Statement | DESIGN.md | 60-107 | Problem definition, competitor failures |
| Vision | DESIGN.md | 20-27 | Product vision, one-liner, why now |
| Goals | DESIGN.md | 1249-1285 | Success metrics, KPIs |
| Users & Personas | DESIGN.md | 29-56 | 4 personas with backgrounds, goals, pain points |
| Functional Requirements | DESIGN.md | 636-698 | 12 MVP features with acceptance criteria |
| Non-Functional Requirements | DESIGN.md | 1149-1186 | Performance targets, browser support, stack |
| User Stories | DESIGN.md | 112-245 | 5 primary flows documented |
| Scope | DESIGN.md | 636-732, 1322-1344 | MVP vs Post-MVP, explicit exclusions |
| Risks | Inferred | N/A | Derived from technical stack and business model |
| Dependencies | DESIGN.md | 1170-1186 | External APIs and technical stack |
| Timeline | Inferred | N/A | Based on MVP scope and team capacity assumptions |

---

## 12. Approval & Next Steps

**PRD Status:** Draft (Awaiting CEO Approval)

**Recommended Next Steps:**

1. **CEO Review**: Approve or request changes to this PRD
2. **Run /architect**: Generate Software Design Document (SDD) based on this PRD
3. **Run /sprint-plan**: Break down MVP into 2-week sprints with tasks
4. **Run /implement**: Begin Sprint 1 implementation
5. **Run /review-sprint**: Code review after each sprint
6. **Run /audit-sprint**: Security and quality audit before completion

**Questions for CEO:**

- Does the 10-week timeline to MVP seem reasonable?
- Are there any features in the MVP scope you'd like to move to Post-MVP?
- Are there any Post-MVP features you'd like to move into MVP?
- Should we add any additional risks or dependencies?

---

**End of PRD**
