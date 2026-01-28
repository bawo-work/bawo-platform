# DESIGN — Bawo

> Complete design specification for Bawo. Fill this out BEFORE creating tickets.

**Last Updated:** 2026-01-27
**Import Source:** bawo-business-plan-v2.md, bawo-why-now-v2.md, bawo-cold-start-strategy.md, bawo-prospecting-list.md, AgentWork PDF

---

## Design Principles

1. **Mobile-First**: Target MiniPay users on cheap Android phones with limited storage (2MB footprint target)
2. **Offline-Tolerant**: Service workers + IndexedDB for task caching in areas with intermittent connectivity
3. **Low Bandwidth**: Optimize for expensive data plans (~86% web traffic via mobile in target markets)
4. **Instant Feedback**: Sub-second UI responses, instant payment visibility after task completion
5. **Dollar-Denominated**: All values shown in USD/stablecoins, not volatile local currencies

---

## Product Vision

### 1. What is this application?

Bawo (Yoruba: "how are you?") is a crypto-powered platform where AI companies pay African workers for data labeling tasks via instant stablecoin micropayments on Celo. We connect insatiable demand from AI labs ($37B spent on GenAI in 2025) with MiniPay wallet holders who can earn 2-4x more than existing platforms while receiving instant payment.

**One-liner:** High-trust, low-latency human feedback loops for underserved language domains, paid instantly via stablecoins.

### 2. Who are the users?

**Primary User Persona (Worker):**
- **Name/Role:** Amara — The Kenyan University Student
- **Background:** 22-year-old computer science student at University of Nairobi, earns side income from gig work. Has a $50 Android phone with MiniPay installed. Bilingual in English and Swahili, speaks some Sheng (Nairobi slang).
- **Technical Skill Level:** Comfortable with mobile apps, uses MiniPay for daily transactions
- **Goals:** Earn $10-25/month supplemental income in dollars (hedge against currency volatility), build portable reputation, flexible hours around classes
- **Frustrations:** Remotasks paid $1/hour then exited Kenya without paying out; MTurk pays in Amazon gift cards (15-30% loss to convert); Payoneer requires $50 minimum withdrawal

**Secondary Persona (Worker):**
- **Name/Role:** Kofi — The Ghanaian Freelancer
- **Background:** 28-year-old with degree in linguistics, does translation work. Native Twi speaker, fluent in English
- **Technical Skill Level:** Power user, manages multiple gig platforms
- **Goals:** Premium rates for African language expertise, instant payment to M-PESA, professional credentials
- **Frustrations:** No platform values his Twi language skills; payment delays of 30-60 days; 84% platform take at Sama

**Primary User Persona (Client - AI Buyer):**
- **Name/Role:** Dr. Chen — ML Research Lead at AI Startup
- **Background:** Leads data quality at Seed-stage AI company building for African markets, $5-25K/project budget
- **Technical Skill Level:** Technical, comfortable with APIs
- **Goals:** High-quality Swahili sentiment data, 48-hour turnaround, neutral vendor (not conflicted like Scale AI/Meta)
- **Frustrations:** Scale AI's Meta acquisition created conflict of interest; offshore BPOs don't have native speakers; Sama controversy creates PR risk

**Secondary Persona (Client):**
- **Name/Role:** Prof. Okonkwo — NLP Researcher at University
- **Background:** Principal Investigator working on low-resource language models, grant-funded budget
- **Technical Skill Level:** Research-focused, needs clean datasets with documentation
- **Goals:** Publishable Swahili/Sheng datasets with annotation guidelines, academic licensing
- **Frustrations:** Masakhane datasets are limited; no good Sheng corpus exists; building own annotation pipeline is expensive

### 3. What problem does this solve?

**The Problem:**

Traditional payment rails fail for micropayments to African workers:
- $0.05 payment via PayPal = $0.30 fee (600% — impossible)
- Payoneer = $50 minimum withdrawal
- Bank transfer = $25-50 flat fees
- M-PESA small amounts = ~10% fee

Result: Platforms batch payments 30-60 days, workers get burned (Remotasks exit), workers earn $1-2/hour with 84% platform take (Sama), and African language data remains scarce.

**Our Solution:**

Instant stablecoin micropayments via MiniPay + Celo:
- $0.05 payment costs $0.0002 in fees (<1%)
- Worker sees payment in wallet within 1 second of task completion
- No minimum withdrawal — cash out $0.01 if desired
- 55-second off-ramp to M-PESA
- Workers earn $3-6/hour median (2-4x competitors)
- Workers own their reputation via Self Protocol (portable across platforms)

### 4. What is the value proposition?

**For Workers:**
- Earn 2-4x industry rates ($3-6/hour vs $1-2)
- Instant payment after task completion (not 30-60 days)
- No minimum withdrawal (vs $50 minimums)
- Own your reputation via Self Protocol (portable)
- Dollar-denominated earnings (hedge against currency volatility)

**For AI Companies:**
- Access to African language native speakers (unavailable elsewhere)
- Local knowledge verification (addresses, businesses, cultural context)
- Neutral provider (not conflicted like Scale AI/Meta)
- Ethical labor practices (differentiation from Sama controversy)
- 48-hour turnaround on standard tasks

**Key Differentiators:**
- First-mover in African language AI data with crypto micropayments
- MiniPay distribution (11M wallets) — no user acquisition cost
- Self Protocol portable reputation — workers keep credentials if we disappear
- 40% platform take vs 60-84% at competitors

**Compared to Alternatives:**
- vs Scale AI: Not conflicted (Meta investor), fair pay to workers, African language expertise
- vs Sama: Ethical practices (no $2/hour for $12.50 work), transparent pricing, mental health safeguards
- vs MTurk: Real money (not gift cards), no 15-30% conversion loss, instant payment
- vs Remotasks: Won't suddenly exit and trap earnings, instant payment not monthly batches

---

## User Flows

### Primary Flows (Must-Have for MVP)

#### Flow 1: Worker Onboarding

**Trigger:** Worker clicks link in WhatsApp group "Bawo Beta - Kenya"

**Steps:**
1. Link opens in MiniPay browser
2. Bawo detects MiniPay wallet, auto-connects (no "Connect Wallet" button)
3. Worker sees "Verify you're human" prompt
4. Worker opens Self app, scans passport NFC (10 seconds)
5. ZK proof sent to Bawo (no PII transmitted)
6. Worker sees verification success, account created
7. Worker completes 5-question training tutorial
8. Worker sees task dashboard with available tasks

**Success Outcome:** Worker is verified (Level 1+), can see and accept tasks
**Error Cases:**
- MiniPay not detected: "Please open this link in MiniPay app"
- Self verification fails: "Couldn't verify. Try again or contact support."
- Network error: "Can't connect. Check your internet."

**Fallback (if Self Protocol unavailable):**
- Worker verifies phone number via MiniPay (Level 1 access only)
- Limited to basic tasks, $10/day limit
- Can upgrade to Level 2+ when Self becomes available

#### Flow 2: Task Completion (Sentiment Analysis)

**Trigger:** Worker taps "Start Task" on available task

**Steps:**
1. Worker sees text to classify (max 500 chars)
2. Worker reads text, selects sentiment: Positive / Negative / Neutral
3. Worker taps "Submit"
4. System shows brief loading (< 1 second)
5. If consensus task: System queues for consensus check
6. If golden task: System validates immediately
7. Worker sees "Earned $0.05" notification with running total
8. Next task auto-loads, or worker sees "No more tasks" if queue empty

**Success Outcome:** Task submitted, earnings credited instantly
**Error Cases:**
- Network error during submit: Queue locally, retry when connected, show "Saved offline, will submit when connected"
- Task timeout (45s): "Time's up. Task returned to queue."
- Duplicate submission: "Already submitted. Moving to next task."

#### Flow 3: Worker Payout

**Trigger:** Worker taps "Withdraw" on earnings screen

**Steps:**
1. Worker sees current balance (e.g., "$12.47 cUSD")
2. Worker enters amount to withdraw (or taps "Withdraw All")
3. Worker confirms wallet address (pre-filled from MiniPay)
4. Worker taps "Withdraw Now"
5. Transaction submits to Celo (< 1 second finality)
6. Worker sees "Sent! Check your MiniPay wallet"
7. Worker can tap "Cash out to M-PESA" link to off-ramp

**Success Outcome:** Funds in worker's MiniPay wallet, can off-ramp to M-PESA in 55 seconds
**Error Cases:**
- Insufficient balance: "Not enough funds. You have $X available."
- Network error: "Couldn't send. Try again."
- Below minimum (if any): "Minimum withdrawal is $0.01"

#### Flow 4: Client Task Submission (Dashboard)

**Trigger:** Client clicks "Create Project" on dashboard

**Steps:**
1. Client enters project name and description
2. Client selects task type (Sentiment Analysis, Text Classification)
3. Client uploads data file (CSV with text column)
4. Client sets task instructions (template provided)
5. Client sets price per task (minimum shown based on task type)
6. Client reviews total cost estimate
7. Client confirms sufficient balance (or deposits more)
8. Client clicks "Launch Project"
9. System validates data, queues tasks to workers
10. Client sees project dashboard with progress bar

**Success Outcome:** Tasks distributed to workers, client sees real-time progress
**Error Cases:**
- Invalid file format: "Please upload a CSV file"
- Insufficient balance: "Deposit $X more to launch this project"
- Empty file: "No data found. Check your file."

#### Flow 5: Client Results Download

**Trigger:** Client project reaches 100% completion

**Steps:**
1. Client receives email notification: "Your project is complete"
2. Client opens project dashboard
3. Client sees quality metrics (accuracy %, consensus rate)
4. Client clicks "Download Results"
5. System generates CSV with original text + labels + confidence
6. File downloads to client's device

**Success Outcome:** Client has labeled dataset ready for use
**Error Cases:**
- Partial completion: "87% complete. Download partial results or wait?"
- Quality below threshold: "Some tasks flagged for review. Download anyway or request re-labeling?"

### Secondary Flows (Nice-to-Have / Post-MVP)

#### Flow 6: Referral Program

**Trigger:** Worker taps "Refer Friends" in menu

**Steps:**
1. Worker sees unique referral link
2. Worker shares via WhatsApp (deep link to share)
3. Referee signs up and completes 10 tasks
4. Both referrer and referee receive $1.00 / $0.50 bonus
5. Worker sees bonus in earnings with "Referral" label

**Success Outcome:** Both parties receive bonus, paid in cUSD

#### Flow 7: Points Redemption (Cold Start Phase)

**Trigger:** Worker has points balance, revenue pool has funds

**Steps:**
1. Worker sees "Points Balance: 5,000 (=$50)"
2. Worker sees "Redemption Pool: $400 available"
3. Worker taps "Redeem Points"
4. Worker enters amount (max limited by pool and their balance)
5. Points convert to cUSD at 100:1 ratio
6. cUSD sent to wallet

**Success Outcome:** Points converted to real money

---

## Pages & Screens (Complete Inventory)

### Worker App (Mobile PWA)

### 1. Splash / Loading Screen

**Purpose:** Show while MiniPay detection and wallet connection happens
**Who Sees It:** All workers on first load
**Content/Sections:**
- Bawo logo
- Loading spinner
- "Connecting wallet..."

**Actions Available:**
- None (auto-advances)

### 2. Onboarding / Verification Screen

**Purpose:** Guide new workers through identity verification
**Who Sees It:** New workers without verified account
**Content/Sections:**
- Welcome message: "Welcome to Bawo"
- Value prop: "Earn money labeling AI data, get paid instantly"
- Step indicator: 1. Verify Identity → 2. Learn → 3. Earn
- "Verify with Self" button
- "Why verify?" expandable FAQ

**Actions Available:**
- Tap "Verify with Self" → Opens Self app
- Tap "Why verify?" → Expand explanation

### 3. Tutorial / Training Screen

**Purpose:** Teach workers how to complete tasks correctly
**Who Sees It:** New workers after verification, before first task
**Content/Sections:**
- Progress indicator (1/5, 2/5, etc.)
- Sample task with explanation
- "Try it" interactive demo
- Correct/incorrect feedback
- "Continue" button

**Actions Available:**
- Complete training tasks
- Tap "Continue" after each

### 4. Task Dashboard (Home)

**Purpose:** Main hub showing available tasks and earnings
**Who Sees It:** Verified workers
**Content/Sections:**
- Header with earnings balance ("$12.47")
- "Withdraw" button
- Available tasks section with task cards
- Each card: Task type, estimated pay, time limit
- "Start Task" button on each card
- Empty state if no tasks: "No tasks right now. Check back soon!"

**Actions Available:**
- Tap "Withdraw" → Payout flow
- Tap task card → Task detail
- Tap "Start Task" → Begin task
- Pull to refresh

### 5. Active Task Screen

**Purpose:** Display task content and collect worker response
**Who Sees It:** Worker who started a task
**Content/Sections:**
- Timer (countdown from time limit, e.g., 45s)
- Task content (text to classify)
- Response options (buttons for Positive/Negative/Neutral)
- Submit button
- "Skip" option (returns task to queue, no penalty)

**Actions Available:**
- Select response option
- Tap "Submit"
- Tap "Skip"

### 6. Task Result Screen (Brief)

**Purpose:** Confirm submission and show earnings
**Who Sees It:** Worker after submitting task
**Content/Sections:**
- Checkmark animation
- "Earned $0.05"
- Running total: "Total today: $1.25"
- Auto-advances to next task in 2 seconds
- "View Dashboard" link

**Actions Available:**
- Wait for auto-advance
- Tap "View Dashboard" to return home

### 7. Earnings Screen

**Purpose:** Detailed view of earnings history
**Who Sees It:** Workers from dashboard
**Content/Sections:**
- Current balance (large)
- "Withdraw" button
- Earnings chart (daily/weekly)
- Transaction history (scrollable list)
- Each row: Date, task type, amount, status

**Actions Available:**
- Tap "Withdraw" → Payout flow
- Scroll history
- Tap transaction for detail

### 8. Withdraw Screen

**Purpose:** Initiate payout to MiniPay wallet
**Who Sees It:** Workers initiating withdrawal
**Content/Sections:**
- Available balance
- Amount input (with "Max" button)
- Wallet address (pre-filled, read-only)
- Fee display ($0.00)
- "Withdraw Now" button
- "Cash out to M-PESA" link (external to MiniPay)

**Actions Available:**
- Enter amount
- Tap "Max"
- Tap "Withdraw Now"
- Tap M-PESA link

### 9. Profile / Settings Screen

**Purpose:** Manage account settings and view stats
**Who Sees It:** All verified workers
**Content/Sections:**
- Profile info (wallet address, verification level)
- Stats: Tasks completed, accuracy rate, tier (Bronze/Silver/Gold)
- Language skills (verified languages)
- Referral section with link
- "Log out" option

**Actions Available:**
- Copy referral link
- Share referral link
- Log out

### 10. Leaderboard Screen (Post-MVP)

**Purpose:** Show top earners and quality performers
**Who Sees It:** All workers
**Content/Sections:**
- Weekly top earners (top 10)
- Monthly quality champions
- Worker's own rank
- Prize pool info

**Actions Available:**
- View rankings
- Tap user for profile (anonymized)

### Client Dashboard (Web App)

### 11. Client Login Page (/login)

**Purpose:** Authenticate clients
**Who Sees It:** Unauthenticated clients
**Content/Sections:**
- Email input
- Password input
- "Log In" button
- "Sign Up" link
- "Forgot Password" link

**Actions Available:**
- Enter credentials
- Submit login
- Navigate to sign up
- Request password reset

### 12. Client Sign Up Page (/signup)

**Purpose:** Register new client accounts
**Who Sees It:** New clients
**Content/Sections:**
- Email input
- Password input
- Company name input
- "Create Account" button
- Terms acceptance checkbox

**Actions Available:**
- Enter details
- Accept terms
- Create account

### 13. Client Dashboard (/dashboard)

**Purpose:** Overview of all projects and balance
**Who Sees It:** Authenticated clients
**Content/Sections:**
- Balance display with "Deposit" button
- Active projects list
- Completed projects list
- "Create Project" button
- Recent activity feed

**Actions Available:**
- Deposit funds
- Create new project
- Click project to view details

### 14. Create Project Page (/projects/new)

**Purpose:** Set up a new labeling project
**Who Sees It:** Authenticated clients
**Content/Sections:**
- Project name input
- Task type selector (Sentiment, Classification)
- File upload zone (CSV)
- Instructions textarea (with template)
- Price per task input (with minimum guidance)
- Total cost calculator
- "Launch Project" button

**Actions Available:**
- Fill form fields
- Upload data file
- Preview tasks
- Launch project

### 15. Project Detail Page (/projects/:id)

**Purpose:** Monitor project progress and results
**Who Sees It:** Clients viewing their project
**Content/Sections:**
- Project name and status
- Progress bar (% complete)
- Quality metrics (accuracy, consensus rate)
- Task breakdown (completed/in-progress/pending)
- "Download Results" button (when complete)
- Activity log

**Actions Available:**
- Download results
- Pause/resume project
- View individual task samples

### 16. Deposit Page (/deposit)

**Purpose:** Add funds to client account
**Who Sees It:** Clients adding balance
**Content/Sections:**
- Current balance
- Deposit amount input
- Payment options:
  - Crypto (send to address)
  - Card via MoonPay (external)
- Deposit address QR code
- Transaction history

**Actions Available:**
- Copy deposit address
- Initiate card payment
- View history

### 17. Settings Page (/settings)

**Purpose:** Manage client account settings
**Who Sees It:** Authenticated clients
**Content/Sections:**
- Account info
- API keys section
- Webhook configuration
- Notification preferences
- Team members (if applicable)

**Actions Available:**
- Generate API key
- Configure webhooks
- Update preferences

### Error Pages

### 18. 404 Not Found

**Purpose:** Handle missing pages gracefully
**Content:** "Page not found. Go back to dashboard."

### 19. 500 Error Page

**Purpose:** Handle server errors
**Content:** "Something went wrong. Try again or contact support."

### 20. Offline Page

**Purpose:** Handle offline state (PWA)
**Content:** "You're offline. Tasks saved locally will submit when you reconnect."

---

## Information Architecture

### Navigation Structure (Worker App)

```
Bottom Navigation:
├── Home (Task Dashboard)
├── Earnings
├── Leaderboard (Post-MVP)
└── Profile

Profile Menu:
├── Settings
├── Refer Friends
├── Help / FAQ
└── Log Out
```

### Navigation Structure (Client Dashboard)

```
Sidebar Navigation:
├── Dashboard
├── Projects
│   ├── Active
│   └── Completed
├── Deposit
├── API Docs
└── Settings

User Menu (top right):
├── Account Settings
└── Log Out
```

### URL Structure

```
Worker App (PWA):
  /                     Task dashboard (home)
  /onboard              Onboarding/verification
  /task/:id             Active task
  /earnings             Earnings history
  /withdraw             Withdrawal screen
  /profile              Profile/settings
  /leaderboard          Leaderboard (post-MVP)
  /refer                Referral screen

Client Dashboard:
  /login                Login page
  /signup               Registration
  /dashboard            Main dashboard
  /projects             Project list
  /projects/new         Create project
  /projects/:id         Project detail
  /deposit              Add funds
  /settings             Account settings
  /docs                 API documentation
```

### User Permissions

**Anonymous Users (Worker App):**
- Can: View landing/marketing content
- Cannot: Access tasks, view earnings, withdraw

**Level 1 Workers (Phone verified only):**
- Can: Access basic English tasks, earn up to $10/day
- Cannot: Access premium language tasks, higher limits

**Level 2+ Workers (Self Protocol verified):**
- Can: Access all standard tasks, earn up to $50/day
- Cannot: Access expert tasks (requires Gold tier)

**Level 3 Workers (Language verified):**
- Can: Access premium African language tasks, earn up to $200/day
- Cannot: Nothing (full access)

**Anonymous Clients:**
- Can: View pricing, sign up
- Cannot: Create projects, access dashboard

**Authenticated Clients:**
- Can: Create projects, deposit funds, download results
- Cannot: Admin functions

---

## Feature Requirements

### MVP Features (Must Ship for Launch)

- [ ] **Feature 1:** MiniPay Wallet Detection & Auto-Connect
  - Description: Detect if user is in MiniPay browser, auto-connect wallet without "Connect Wallet" button
  - User value: Zero friction onboarding for MiniPay's 11M users
  - Acceptance criteria: Wallet connects automatically on page load in MiniPay; shows "Open in MiniPay" message on other browsers

- [ ] **Feature 2:** Self Protocol Identity Verification
  - Description: Workers verify humanity via NFC passport scan, ZK proof generated, no PII stored
  - User value: Sybil resistance (1 passport = 1 account), portable reputation workers own
  - Acceptance criteria: Worker scans passport, receives verification badge, can start tasks within 60 seconds

- [ ] **Feature 3:** Sentiment Analysis Task Type
  - Description: Display text, worker selects Positive/Negative/Neutral, submit
  - User value: Core task type with broad demand
  - Acceptance criteria: Tasks load in <2s, timer works, selection submits, earnings credited

- [ ] **Feature 4:** Text Classification Task Type
  - Description: Display text, worker selects from predefined category list
  - User value: Second core task type, flexible for client needs
  - Acceptance criteria: Categories display correctly, selection submits, earnings credited

- [ ] **Feature 5:** Instant Stablecoin Payment
  - Description: After task submission (post-QA), send cUSD to worker's wallet
  - User value: Instant payment (not 30-60 days), visible in MiniPay immediately
  - Acceptance criteria: Payment confirmed on Celo within 5 seconds, worker sees balance update

- [ ] **Feature 6:** Withdrawal to MiniPay
  - Description: Worker initiates withdrawal, funds sent to their MiniPay wallet
  - User value: No minimum withdrawal, instant access to earnings
  - Acceptance criteria: Any amount withdrawable, transaction completes in <5s, fee <$0.01

- [ ] **Feature 7:** Golden Task QA System
  - Description: 10% of tasks are pre-labeled tests, workers don't know which
  - User value: Quality assurance without manual review
  - Acceptance criteria: Golden tasks injected randomly, accuracy tracked per worker, reputation updated

- [ ] **Feature 8:** Consensus Mechanism
  - Description: Same task sent to 3 workers, agreement required for payment
  - User value: Higher quality labels through redundancy
  - Acceptance criteria: Tasks assigned to 3 workers, consensus calculated, majority answer used

- [ ] **Feature 9:** Client Dashboard - Project Creation
  - Description: Client uploads CSV, sets task type/instructions/price, launches project
  - User value: Self-serve project creation without manual onboarding
  - Acceptance criteria: File uploads successfully, tasks queued, progress visible

- [ ] **Feature 10:** Client Dashboard - Results Download
  - Description: Client downloads labeled data as CSV when project completes
  - User value: Easy access to completed work
  - Acceptance criteria: CSV includes original data + labels + confidence scores

- [ ] **Feature 11:** Offline Task Caching (Worker App)
  - Description: Tasks cached locally, submissions queued when offline
  - User value: Work continues despite intermittent connectivity
  - Acceptance criteria: Tasks viewable offline, submissions sync when reconnected

- [ ] **Feature 12:** Points Program (Cold Start)
  - Description: Workers earn points during training/low-volume, redeem when revenue pool has funds
  - User value: Keep workers engaged before paying clients; aligned incentives
  - Acceptance criteria: Points awarded for training tasks, 100:1 redemption ratio, 20% monthly revenue cap, 12-month expiry
  - Note: Full system per cold-start-strategy.md including treasury management

### Post-MVP Features (Nice to Have)

- [ ] **Feature 13:** Referral Program
  - Description: Two-sided referral bonuses ($1 referrer, $0.50 referee)
  - User value: Viral growth, worker acquisition
  - Why not MVP: Focus on core task flow first

- [ ] **Feature 14:** Streak Rewards
  - Description: 7-day streak = $0.50 bonus, 30-day streak = $5 bonus
  - User value: Retention, engagement
  - Why not MVP: Optimize retention after acquisition works

- [ ] **Feature 15:** Leaderboards
  - Description: Weekly top earners, monthly quality champions
  - User value: Competition, status, engagement
  - Why not MVP: Nice-to-have gamification

- [ ] **Feature 16:** RLHF Preference Ranking Tasks
  - Description: Show two AI responses, worker picks better one
  - User value: Higher-value task type ($20-40/hour)
  - Why not MVP: Requires more complex UI, training

- [ ] **Feature 17:** Voice Data Collection Tasks
  - Description: Worker records spoken phrases
  - User value: Access to African accent ASR training data
  - Why not MVP: Requires audio handling, more complex

- [ ] **Feature 18:** x402 Protocol Integration
  - Description: AI agents pay directly via HTTP 402 responses
  - User value: Autonomous AI agent buyers, no human in the loop
  - Why not MVP: x402 adoption still early, human buyers are primary market

---

## UI Specifications

### Visual Design

**Design Tokens:**
- Location: `src/styles/tokens.css`
- Primary Color: Celo green (#35D07F) — trust, crypto association
- Secondary Color: Deep purple (#3C1E5B) — professionalism
- Success: Green (#22C55E)
- Error: Red (#EF4444)
- Warning: Amber (#F59E0B)
- Text Primary: #1F2937
- Text Secondary: #6B7280
- Background: #FFFFFF
- Surface: #F9FAFB

**Typography:**
- Font Family: Inter (system fallback: -apple-system, BlinkMacSystemFont, sans-serif)
- Headings: 600 weight
- Body: 400 weight
- Sizes: 12/14/16/18/24/32px scale

**Spacing:**
- Base unit: 4px
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px

**Design System:**
- Using: Tailwind CSS + shadcn/ui components
- Reason: Fast development, accessible components, small bundle
- No Figma — design in code

### Responsive Behavior

**Mobile-First (Primary) (<768px):**
- Layout: Single column, full-width cards
- Navigation: Bottom tab bar (4 items max)
- Touch targets: Minimum 48x48px (larger than standard 44px for thick fingers)
- Font size: Minimum 16px to prevent zoom on iOS

**Tablet (768px - 1024px):**
- Layout: Two-column where appropriate
- Navigation: Bottom bar or sidebar (context-dependent)

**Desktop (>1024px):**
- Layout: Client dashboard only, max-width 1280px centered
- Navigation: Sidebar
- Worker app still works but optimized for mobile

### Accessibility Requirements

- [x] WCAG AA compliance (target)
- [x] Keyboard navigation support
- [x] Screen reader support (ARIA labels)
- [x] Color contrast ratios meet standards (4.5:1 minimum)
- [x] Focus indicators visible (2px solid ring)
- [x] Alt text for all images
- [x] Touch targets 48x48px minimum
- [x] No color-only information (always include text/icon)

---

## Component Behavior Specifications

### TaskCard Component

**Purpose:** Display available task in dashboard list

**Visual States:**
- **Default:** White card with task type icon, description, pay amount, time estimate
- **Hover:** Slight elevation shadow (desktop only)
- **Active/Pressed:** Scale down 2%, darker background
- **Disabled:** Grayed out, "Coming Soon" badge if task type not available
- **Loading:** Skeleton placeholder while fetching

**User Interactions:**
- **Tap:** Navigate to task detail/start task

**Implementation Guidance:**
- Start With: Plain `<button>` with card styling
- Avoid: Complex animations, heavy shadows on mobile

### SentimentSelector Component

**Purpose:** Allow worker to select sentiment for text

**Visual States:**
- **Default:** Three buttons (Positive/Negative/Neutral) in row, equal size
- **Hover:** Background color hint (desktop)
- **Selected:** Filled background with checkmark, other options dimmed
- **Disabled:** During submission, all buttons grayed

**User Interactions:**
- **Tap option:** Selects that option, highlights it
- **Tap different option:** Switches selection
- **Submit:** Disabled until option selected

**Error Handling:**
- No selection on submit: "Please select an option"

**Implementation Guidance:**
- Start With: Radio button group styled as buttons
- Avoid: Custom gesture handlers, swipe interfaces

### WithdrawForm Component

**Purpose:** Input withdrawal amount and initiate transfer

**Visual States:**
- **Default:** Amount input, wallet display (read-only), withdraw button
- **Loading:** Button shows spinner, inputs disabled
- **Error:** Error message above form, red border on invalid input
- **Success:** Redirect to confirmation, brief "Sent!" toast

**User Interactions:**
- **Type amount:** Updates value, validates against balance
- **Tap Max:** Fills available balance
- **Tap Withdraw:** Validates, submits transaction

**Behavior Requirements:**
- Validation: On blur and on submit
- Max amount: Available balance minus estimated fee
- Minimum: $0.01 (no practical minimum)

**Error Handling:**
- Insufficient balance: "Not enough funds. You have $X available."
- Network error: "Couldn't send. Try again."
- Invalid amount: "Enter a valid amount"

**Implementation Guidance:**
- Start With: `<input type="number">` with controlled value
- Add Complexity Only If: Need custom decimal handling
- Avoid: Crypto-specific number input libraries

### Timer Component

**Purpose:** Show countdown for task time limit

**Visual States:**
- **Default:** Circular progress with time remaining (e.g., "0:45")
- **Warning:** Yellow when <10 seconds
- **Critical:** Red when <5 seconds, pulse animation
- **Expired:** Shows "0:00", triggers timeout handler

**Behavior Requirements:**
- Accuracy: Update every second
- On expire: Auto-submit or return task to queue

**Implementation Guidance:**
- Start With: `setInterval` with cleanup in useEffect
- Avoid: requestAnimationFrame for second-level precision

### EarningsDisplay Component

**Purpose:** Show current balance prominently

**Visual States:**
- **Default:** Large dollar amount with cUSD label
- **Updating:** Brief pulse animation when amount changes
- **Loading:** Skeleton while fetching

**User Interactions:**
- **Tap:** Navigate to full earnings screen

**Implementation Guidance:**
- Start With: Simple formatted number display
- Format: Always 2 decimal places ($12.47, not $12.4723)

---

## Data & State Management

### Data Models

**Worker:**
```typescript
{
  id: string                    // Self Protocol DID or generated UUID
  walletAddress: string         // Celo address from MiniPay
  verificationLevel: 0 | 1 | 2 | 3
  languages: string[]           // Verified languages ["en", "sw", "sheng"]
  stats: {
    tasksCompleted: number
    accuracy: number            // 0-100
    tier: "newcomer" | "bronze" | "silver" | "gold" | "expert"
    earningsLifetime: number    // in USD
  }
  createdAt: timestamp
}
```

**Task:**
```typescript
{
  id: string
  projectId: string
  type: "sentiment" | "classification"
  content: string               // Text to label
  options?: string[]            // For classification tasks
  timeLimit: number             // Seconds
  payAmount: number             // USD
  status: "pending" | "assigned" | "completed" | "expired"
  assignedTo?: string[]         // Worker IDs (for consensus)
  responses?: {
    workerId: string
    response: string
    timestamp: timestamp
  }[]
  finalLabel?: string
  consensusReached: boolean
  isGoldenTask: boolean
  goldenAnswer?: string         // Only set if golden task
}
```

**Project:**
```typescript
{
  id: string
  clientId: string
  name: string
  taskType: "sentiment" | "classification"
  instructions: string
  pricePerTask: number
  totalTasks: number
  completedTasks: number
  status: "draft" | "active" | "paused" | "completed"
  createdAt: timestamp
}
```

**Transaction:**
```typescript
{
  id: string
  workerId: string
  amount: number
  type: "task_payment" | "withdrawal" | "referral_bonus" | "streak_bonus"
  txHash?: string               // Celo transaction hash
  status: "pending" | "confirmed" | "failed"
  createdAt: timestamp
}
```

### Where Data Lives

**Client State (React/Zustand):**
- Current task being worked on
- UI state (modals, selections)
- Optimistic balance updates
- Offline task queue

**Server State (Supabase):**
- Worker profiles
- Projects and tasks
- Transaction history
- Quality scores

**Blockchain State (Celo):**
- Wallet balances
- Payment transactions
- Self Protocol credentials

### Data Flow

1. Worker opens app → Fetch profile + available tasks from Supabase
2. Worker starts task → Mark task as "assigned" in Supabase
3. Worker submits → Update task response, check consensus
4. Consensus reached → Calculate payment, call Celo contract
5. Payment confirmed → Update transaction record, refresh balance

### Persistence Strategy

- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Caching:** React Query for server state, IndexedDB for offline
- **Offline Support:** Yes — tasks cached, submissions queued, sync on reconnect

---

## Authentication & Security

### Authentication Method

- [x] Wallet-based (MiniPay auto-connect)
- [x] Self Protocol (ZK identity verification)
- [ ] Email/Password (clients only, via Supabase Auth)
- [ ] Magic Link (potential future option for clients)

### Worker Authentication Flow

1. MiniPay injects wallet provider
2. App requests wallet address (no signature needed for read)
3. For write operations: Request signature
4. Self Protocol verifies humanity, links to wallet
5. Session persisted via Supabase Auth with wallet as identifier

### Client Authentication Flow

1. Traditional email/password via Supabase Auth
2. Email verification required
3. Session token stored in httpOnly cookie

### Protected Routes

**Worker App:**
- `/task/*` — Requires verified wallet
- `/earnings` — Requires verified wallet
- `/withdraw` — Requires Level 1+ verification

**Client Dashboard:**
- `/dashboard/*` — Requires authenticated client
- `/projects/*` — Requires authenticated client
- `/settings` — Requires authenticated client

**Redirect Behavior:**
- Unauthenticated worker → Onboarding flow
- Unauthenticated client → /login
- After login → /dashboard (clients), /tasks (workers)

### Session Management

- **Session Duration:** 7 days (workers), 24 hours (clients)
- **Remember Me:** Always for workers (wallet-based), optional for clients
- **Session Storage:** httpOnly cookies (clients), localStorage (workers with wallet signature)

### Security Requirements

- [x] HTTPS only
- [x] CSRF protection (Supabase handles)
- [x] XSS prevention (React escaping, CSP headers)
- [x] SQL injection prevention (Supabase parameterized queries)
- [x] Rate limiting on auth endpoints (Supabase built-in)
- [x] Wallet signature verification for sensitive operations
- [x] No PII stored (Self Protocol ZK proofs only)

---

## API & Backend Integration

### External APIs

**Celo Blockchain:**
- Purpose: Payment transactions, balance queries
- Endpoints: JSON-RPC via viem
- Authentication: Wallet signatures
- Error handling: Retry with exponential backoff, gas estimation

**Self Protocol:**
- Purpose: ZK identity verification
- SDK: @selfprotocol/sdk
- Authentication: DID-based
- Error handling: Fallback to Level 1 (phone-only) if unavailable

**MiniPay:**
- Purpose: Wallet detection, auto-connect
- Integration: window.ethereum provider injection
- Error handling: "Open in MiniPay" message if not detected

**Supabase:**
- Purpose: Database, auth, realtime subscriptions
- Endpoints: REST API + Realtime WebSocket
- Authentication: JWT tokens
- Error handling: Standard HTTP error codes

### Backend Endpoints

```
Workers:
POST   /api/workers/verify        Start Self Protocol verification
GET    /api/workers/profile       Get worker profile
PUT    /api/workers/profile       Update worker profile
GET    /api/workers/stats         Get worker statistics

Tasks:
GET    /api/tasks/available       List available tasks for worker
POST   /api/tasks/:id/start       Claim task
POST   /api/tasks/:id/submit      Submit task response
POST   /api/tasks/:id/skip        Return task to queue

Earnings:
GET    /api/earnings              Get earnings history
POST   /api/earnings/withdraw     Initiate withdrawal
GET    /api/earnings/balance      Get current balance

Projects (Client):
GET    /api/projects              List client projects
POST   /api/projects              Create project
GET    /api/projects/:id          Get project detail
PUT    /api/projects/:id          Update project
GET    /api/projects/:id/results  Download results
POST   /api/projects/:id/upload   Upload task data

Payments (Client):
GET    /api/payments/balance      Get client balance
POST   /api/payments/deposit      Generate deposit address
GET    /api/payments/history      Get payment history
```

### Error Handling

**Network Errors:**
- Display: "Can't connect. Check your internet."
- Retry: Automatic with exponential backoff (3 attempts)

**API Errors:**
- 400 Bad Request → Show field-specific validation error
- 401 Unauthorized → Redirect to login/onboarding
- 403 Forbidden → "You don't have access to this"
- 404 Not Found → "Not found. Go back to dashboard."
- 429 Too Many Requests → "Too many requests. Wait a moment."
- 500 Server Error → "Something went wrong. Try again."

---

## Performance & Technical Constraints

### Performance Targets

- **Initial Load:** <3s on 3G (critical for target market)
- **Time to Interactive:** <5s
- **Task Load Time:** <2s
- **Payment Confirmation:** <5s
- **PWA Install Size:** <2MB (MiniPay constraint)

### Bundle Size Limits

- **Total JS:** <150kb gzipped (aggressive for mobile)
- **Total CSS:** <30kb gzipped
- **Images:** WebP format, lazy loaded, <50kb each

### Browser Support

- **Primary:** MiniPay browser (Chromium-based)
- **Secondary:** Chrome Mobile, Safari Mobile (iOS)
- **Desktop:** Chrome, Firefox, Safari, Edge (last 2 versions) — client dashboard only
- **No Support:** IE11, Opera Mini (non-MiniPay)

### Technical Stack

- **Framework:** Next.js 14 (PWA)
- **UI:** Tailwind CSS + shadcn/ui
- **State:** Zustand (lightweight)
- **Offline:** Service Workers + IndexedDB
- **TypeScript:** Yes
- **Testing:** Vitest (unit), Playwright (E2E)
- **Deployment:** Vercel (frontend), Railway (backend if needed)
- **Database:** Supabase (PostgreSQL)
- **Queue:** Upstash Redis (serverless)
- **Storage:** Cloudflare R2 (task data files)
- **Blockchain:** Celo L2 via viem
- **Identity:** Self Protocol SDK
- **Monitoring:** Axiom (logs), BetterStack (uptime)
- **Analytics:** PostHog

---

## Content Strategy

### Microcopy

**Buttons:**
- Primary action: "Start Task", "Submit", "Withdraw Now", "Get Started"
- Secondary action: "Skip", "View Dashboard", "Learn More"
- Destructive action: "Cancel Task", "Log Out"

**Form Labels:**
- Clear and concise
- Examples: "Amount to withdraw", "Email address", "Project name"

**Error Messages:**
- Friendly, not technical
- Actionable
- Examples:
  - "Can't connect. Check your internet." (not "Network error")
  - "Not enough funds. You have $X available." (not "Insufficient balance")
  - "Please select an option" (not "Required field")
  - "Time's up. Task returned to queue." (not "Timeout")

**Empty States:**
- Encouraging, actionable
- "No tasks right now. Check back soon!" (with pull-to-refresh hint)
- "No earnings yet. Complete your first task to start earning!"
- "No projects yet. Create your first one!"

**Loading Messages:**
- "Loading tasks..."
- "Submitting..."
- "Sending payment..."
- "Connecting wallet..."

**Success Messages:**
- "Earned $0.05!" (with running total)
- "Withdrawal sent! Check your MiniPay."
- "Project launched!"
- "Verified!"

### Tone

- **For Workers:** Friendly, encouraging, clear. Avoid jargon. Use "you" language.
- **For Clients:** Professional, efficient, trustworthy. Technical where appropriate.
- **Both:** Dollar amounts always shown (not crypto jargon like "cUSD" in UI — use "$" symbol)

### Help Text

- Appears: Below inputs or in expandable sections
- Style: Muted text (text-gray-500), smaller font (text-sm)
- Examples:
  - "You'll receive this in your MiniPay wallet"
  - "Tasks with 90%+ agreement qualify for instant payment"
  - "Complete 50 tasks to unlock higher-paying work"

---

## Success Metrics

### Key Performance Indicators (KPIs)

**Worker Acquisition:**
- Metric: 500 workers by Week 8, 3,000 by Month 12
- How Measured: Verified wallet count in database

**Worker Retention:**
- Metric: 40%+ weekly retention (workers completing 10+ tasks/week)
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

### Technical Metrics

- Uptime: 99.5%+
- Error rate: <1% of requests
- Page load time: <3s on 3G
- PWA install success: >90%
- Offline sync success: >95%

---

## Open Questions

> All questions resolved from source documents or marked for CEO input.

- [x] **Q1: Phase 1 geography?**
  - Decision: Kenya first (clearest regulations, M-PESA integration, English + Swahili)
  - Source: Business plan explicitly states this

- [x] **Q2: Which task types for MVP?**
  - Decision: Sentiment analysis + Text classification only
  - Source: Business plan Phase 1 tasks section

- [x] **Q3: What if Self Protocol integration fails?**
  - Decision: Fallback to phone verification via MiniPay for Level 1, revisit Self in 3 months
  - Source: Business plan contingency section

- [x] **Q4: Platform take rate?**
  - Decision: 40% (vs 60-84% at competitors)
  - Source: Business plan pricing strategy

- [x] **Q5: Content moderation tasks — include in MVP?**
  - Decision: NO — requires mental health safeguards not yet built
  - Source: Business plan Section 2.7 explicitly defers
  - **CEO Confirmed: 2026-01-27**

- [x] **Q6: Points program — include in MVP?**
  - Decision: YES — include full points program for cold start strategy
  - Rationale: Keep workers engaged during cold start, per cold-start-strategy.md
  - **CEO Confirmed: 2026-01-27**

---

## Out of Scope

**Not Included in MVP:**
- x402 protocol integration (AI agent buyers) — Phase 2
- RLHF preference ranking tasks — Phase 2
- Voice data collection tasks — Phase 2
- Content moderation tasks — Requires mental health safeguards
- Translation tasks — Phase 2
- Nigeria/Ghana expansion — Month 6+
- University ambassador program — Month 4+
- Agent networks (physical) — Not planned
- Native mobile apps — PWA only

**Why Not:**
- Focus on core task flow with 2 task types before expanding
- x402 adoption still early; human buyers are sufficient market
- Kenya-first reduces operational complexity
- Content moderation requires significant safeguards

**Maybe Later (Phase 2+):**
- x402 for autonomous AI agent payments
- Premium language tasks (Yoruba, Hausa after Nigeria expansion)
- Voice collection for ASR training data
- Dataset marketplace (sell benchmark datasets directly)

---

## Design Review Checklist

- [x] **Product vision is clear:** Crypto-powered AI data labeling with instant stablecoin payments to African workers
- [x] **Users are defined:** Amara (Kenyan student worker), Dr. Chen (AI startup client)
- [x] **Problem is validated:** Competitor failures documented, payment rail problems quantified
- [x] **Primary flows are mapped:** Onboarding, task completion, payout, client project creation
- [x] **Every page is listed:** 20 screens across worker app and client dashboard
- [x] **Every component has behavior spec:** Key components specified (TaskCard, SentimentSelector, WithdrawForm, Timer, EarningsDisplay)
- [x] **Error states are defined:** For every flow
- [x] **Loading states are defined:** For every async operation
- [x] **Empty states are defined:** For every list
- [x] **Mobile behavior is clear:** Mobile-first, 48px touch targets, offline support
- [x] **Accessibility requirements noted:** WCAG AA target
- [x] **All open questions resolved:** CEO confirmed all decisions 2026-01-27
- [x] **Scope is clear:** MVP vs Phase 2 explicitly defined
- [x] **Success metrics defined:** KPIs with specific targets
- [ ] **CEO approval obtained:** Pending review

---

## Notes & Decisions

### 2026-01-27 — Import Mode Extraction

**Decision:** Populated DESIGN.md from 5 source documents in import mode
**Rationale:** Comprehensive business plan and supporting docs provided extensive detail
**Sources Used:**
- bawo-business-plan-v2.md (primary)
- bawo-why-now-v2.md (technology rationale)
- bawo-cold-start-strategy.md (points program, datasets)
- bawo-prospecting-list.md (client personas)
- AgentWork PDF (market research)

**Coverage Achieved:** 15/15 sections filled with high confidence
**Gaps Resolved:** CEO confirmed all decisions

### 2026-01-27 — CEO Decision: Content Moderation

**Decision:** Exclude content moderation tasks from MVP
**Rationale:** Requires mental health safeguards not yet operational
**Impact:** MVP scope reduced; content moderation deferred to Phase 2+

### 2026-01-27 — CEO Decision: Points Program

**Decision:** Include full points program in MVP
**Rationale:** Cold start strategy requires worker engagement before paying clients
**Impact:** MVP scope increased; points treasury management required

---

## Brand Strategy

> Full strategy documents: `design/strategy/POSITIONING.md`, `design/strategy/AUDIENCE.md`, `design/strategy/PERSONALITY.md`

### Positioning Statement

**Bawo is what fair looks like when someone actually builds it.**

For AI companies that need African language data, Bawo is the data labeling platform that delivers native-speaker quality with instant worker payment, because we built the infrastructure to do micropayments right — proving ethical AI data doesn't require compromise.

**Core differentiator:** You get paid the moment you finish. Five seconds.

### Target Audience

**Primary Worker (Grace):** 24-year-old Kenyan graduate. First in family to finish university. Did everything right and the system shrugged. Wants dignified work that uses her skills and pays reliably — not charity, fair exchange. Aesthetic expectations set by M-Pesa, WhatsApp, Safaricom, Java House.

**Primary Client (Dr. Chen):** ML Research Lead at AI startup. Evaluates vendors in 10 seconds. Wants Swahili data, 48-hour turnaround, no PR risk. Aesthetic expectations set by Stripe, Hugging Face, Weights & Biases.

**Two-audience solution:** Same brand, two expressions.
- Worker-facing: Warm palette, M-Pesa simplicity, mobile-first
- Client-facing: Sparse, Stripe documentation clarity, desktop-optimized

### Brand Personality

**Archetype:** The Competent Caregiver (not benefactor)
- The doctor who tells you the truth and fixes the problem
- Care expressed through action (instant payment), not words
- Caregiver, not benefactor — this is dignified commerce, not aid

**Traits:**
| Spectrum | Position |
|----------|----------|
| Confident ↔ Humble | 50% — fact, not boast |
| Formal ↔ Casual | 40% Formal — professional, not stiff |
| Enthusiastic ↔ Reserved | 60% Reserved — warm, not excitable |
| Direct ↔ Subtle | 80% Direct — no hedging, no jargon |

**Core emotion:** Calm competence — the absence of anxiety

### Voice & Tone

**For Workers:**
| Do | Don't |
|----|-------|
| "Task complete. $0.05 paid." | "You did it! Great job!" |
| "No tasks right now. Check back soon." | "Oops! Looks like we're all out!" |
| "Paid to your MiniPay." | "Paid via Celo L2 stablecoin." |

**For Clients:**
| Do | Don't |
|----|-------|
| "92.4% accuracy across 10,000 Swahili labels." | "World-class quality powered by AI." |
| "Native speakers. Instant payment. No PR risk." | "Empowering communities through ethical AI." |
| "$0.08/label. Volume discounts available." | "Contact us for pricing." |

### Visual Direction

**Colors:**
- Base: Warm neutrals (cream, sand, warm white)
- Primary accent: Deep teal or warm green (Safaricom confidence)
- Secondary accent: Terracotta or warm gold (subtle success)
- Avoid: Charity blue, crypto purple, betting neon, pastels

**Typography:**
- Clean, modern, rounded sans-serif (Inter, Plus Jakarta Sans, or similar)
- Generous spacing — readable on cracked Tecno screen in Nairobi sunlight
- 16px minimum body text

**Imagery:**
- Real Kenyan faces (not stock)
- Urban, contemporary Nairobi
- Workers looking competent, not grateful
- Never: poverty imagery, stock "diverse teams," abstract AI visuals

**Overall feel:** Java House warmth + M-Pesa simplicity + Stripe clarity

### What We Never Do

1. **Gamify** — Income isn't a game
2. **Patronize** — Grace has a degree, Dr. Chen reviews code
3. **Hedge** — "We pay $3-6/hour, instantly" not "We believe in fair pay"
4. **Use buzzwords** — No "leveraging," "empowering," "disrupting"
5. **Show poverty imagery** — Workers are professionals
6. **Talk about blockchain unprompted** — Tech is invisible
7. **Position as charity** — This is commerce

### The Proof Principle

Everything we claim, we prove.

| Claim | Proof |
|-------|-------|
| "Instant payment" | Payment arrives in 5 seconds. Every time. |
| "Native speakers" | Accuracy data by language. Worker verification. |
| "Ethical" | Published pay rates vs. competitors. |
| "Quality" | Golden task metrics. Client-visible accuracy. |

---

## Visual Identity

> Full identity documents: `design/identity/LOGO.md`, `design/identity/COLORS.md`, `design/identity/TYPOGRAPHY.md`

### Logo Concept

**Primary:** Clean wordmark "BAWO" in custom-lettered Plus Jakarta Sans Display
- Weight: SemiBold (600)
- Slightly rounded terminals for warmth
- Subtle letter-spacing (+2%)

**Color applications:**
- Primary: Deep Teal (#1A5F5A) on warm white
- Reversed: Warm White (#FEFDFB) on Deep Teal
- Monochrome: Warm Black (#2C2925)

**Symbol (optional):** Abstract mark of two curves meeting — suggests greeting/exchange/cycle. Used for app icon and favicon only.

### Color Palette

**Neutrals (Warm Base):**
| Name | Hex | Usage |
|------|-----|-------|
| Warm White | `#FEFDFB` | Primary background (worker app) |
| Cream | `#FAF7F2` | Surface/cards |
| Sand | `#F0EBE3` | Dividers, disabled states |
| Warm Gray 600 | `#6B665C` | Secondary text |
| Warm Gray 800 | `#3D3935` | Primary text |
| Warm Black | `#2C2925` | Headlines, emphasis |

**Primary (Deep Teal):**
| Name | Hex | Usage |
|------|-----|-------|
| Teal 100 | `#C7E6E4` | Hover states, highlights |
| Teal 500 | `#2D8A83` | Links, active states |
| Teal 600 | `#1A7068` | Primary buttons |
| Teal 700 | `#1A5F5A` | Primary brand color |

**Secondary (Terracotta):**
| Name | Hex | Usage |
|------|-----|-------|
| Terracotta 500 | `#C45D3A` | Secondary actions, emphasis |
| Terracotta 600 | `#A84E31` | Hover states |

**Semantic:**
| State | Hex | Usage |
|-------|-----|-------|
| Success | `#2D8A3D` | Payment confirmed, task complete |
| Warning | `#C4883A` | Cautions, time warnings |
| Error | `#C43A3A` | Failures, validation errors |
| Money Gold | `#C4A23A` | Earnings display, payments |

**Two-Audience Application:**
- **Worker App:** Warm White background, Cream cards, Teal 700 primary, warm tones
- **Client Dashboard:** White (#FFFFFF) background acceptable, cooler gray surfaces, same Teal 700 primary

### Typography

**Primary Font:** Plus Jakarta Sans (Google Fonts, variable)
- Clean, modern sans-serif with slightly rounded terminals
- Warm and approachable without being childish
- Excellent weight range (400-700)

**Fallback Stack:**
```
'Plus Jakarta Sans', Inter, system-ui, -apple-system, sans-serif
```

**Type Scale:**
| Name | Size | Weight | Usage |
|------|------|--------|-------|
| xs | 12px | 400 | Timestamps, fine print |
| sm | 14px | 400 | Labels, secondary text |
| base | 16px | 400 | Body text (mobile minimum) |
| lg | 18px | 400 | Emphasized body |
| xl | 20px | 500 | Section headers |
| 2xl | 24px | 600 | Page titles |
| 3xl | 30px | 600 | Hero text, large earnings |

**Weight Usage:**
- 400 Regular: Body text
- 500 Medium: Links, emphasis
- 600 SemiBold: Headings, buttons
- 700 Bold: Headlines, earnings amounts

### Design Direction Summary

**Overall feel:** Java House warmth + M-Pesa simplicity + Stripe clarity

| Aspect | Worker Expression | Client Expression |
|--------|-------------------|-------------------|
| Background | Warm White (#FEFDFB) | White (#FFFFFF) |
| Personality | Warm, encouraging | Sparse, technical |
| Accent | Terracotta for warmth | Teal only for focus |
| Density | Generous spacing | Efficient layouts |

---

**This design document is the source of truth. If tickets conflict with this doc, this doc wins.**

**Next Steps After CEO Review:**
1. Resolve 2 open questions
2. Get CEO approval on this design
3. Create system plan: Document architecture decisions
4. Generate tickets: Based on this design
5. Build: With confidence knowing what to build

---

## Design System

> Full design system: `design/system/` | Tokens: `design/system/tokens/tokens.json`

### Color Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `color.neutral.warmWhite` | `#FEFDFB` | Background (worker app) |
| `color.neutral.cream` | `#FAF7F2` | Cards, surfaces |
| `color.neutral.sand` | `#F0EBE3` | Dividers, disabled |
| `color.neutral.warmGray600` | `#6B665C` | Secondary text |
| `color.neutral.warmGray800` | `#3D3935` | Primary text |
| `color.neutral.warmBlack` | `#2C2925` | Headlines |
| `color.primary.600` | `#1A7068` | Primary buttons |
| `color.primary.700` | `#1A5F5A` | Brand color, links |
| `color.secondary.500` | `#C45D3A` | Terracotta accent |
| `color.semantic.success` | `#2D8A3D` | Task complete |
| `color.semantic.warning` | `#C4883A` | Time warnings |
| `color.semantic.error` | `#C43A3A` | Errors |
| `color.money.gold` | `#C4A23A` | Earnings display |

### Typography Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `typography.fontFamily.primary` | Plus Jakarta Sans | All text |
| `typography.fontSize.base` | 16px (1rem) | Body text |
| `typography.fontSize.2xl` | 24px | Page titles |
| `typography.fontSize.3xl` | 30px | Earnings display |
| `typography.fontWeight.regular` | 400 | Body |
| `typography.fontWeight.semibold` | 600 | Buttons, headings |
| `typography.fontWeight.bold` | 700 | Headlines, amounts |

### Spacing Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `spacing.2` | 8px | Tight spacing |
| `spacing.4` | 16px | Standard spacing |
| `spacing.6` | 24px | Generous spacing |
| `spacing.8` | 32px | Section spacing |
| `spacing.12` | 48px | Touch target min |

### Component Summary

| Component | Variants | Priority |
|-----------|----------|----------|
| Button | primary, secondary, ghost, destructive | MVP |
| Input | text, number, search | MVP |
| Card | default, elevated, interactive | MVP |
| TaskCard | standard, disabled | MVP |
| SentimentSelector | 3-option radio | MVP |
| Timer | countdown circle | MVP |
| EarningsDisplay | amount + currency | MVP |
| Toast | success, error, info | MVP |
| BottomNav | home, earnings, profile | MVP |
| Modal | standard overlay | MVP |

### Two-Audience Application

| Aspect | Worker App | Client Dashboard |
|--------|------------|------------------|
| Background | `#FEFDFB` (Warm White) | `#FFFFFF` (White) |
| Surface | `#FAF7F2` (Cream) | `#F9FAFB` (Cool Gray) |
| Accent | Terracotta for warmth | Teal only |
| Density | Generous | Efficient |
| Feel | M-Pesa simplicity | Stripe clarity |

### Implementation

```js
// tailwind.config.js (excerpt)
colors: {
  'warm-white': '#FEFDFB',
  'cream': '#FAF7F2',
  'teal': { 600: '#1A7068', 700: '#1A5F5A' },
  'terracotta': { 500: '#C45D3A' },
  'money-gold': '#C4A23A',
}
```

```css
/* CSS Custom Properties */
:root {
  --color-background: #FEFDFB;
  --color-surface: #FAF7F2;
  --color-primary: #1A5F5A;
  --color-money: #C4A23A;
  --font-family: 'Plus Jakarta Sans', sans-serif;
  --touch-target: 48px;
}
```

---

**Design System Status:** Complete | **Last Updated:** 2026-01-28
