# Local Testing Checklist for Bawo MVP

**Created:** 2026-01-30
**Status:** Ready for Testing
**Sprints Completed:** 1-6 (all complete ✓)

---

## Quick Start

Run these commands first:
```bash
npm run dev           # Start local dev server
npm run build         # Verify production build works
npm run analyze       # Check bundle size
npm run lighthouse    # Check performance
```

---

## Part 1: Week 1 Validation Tasks

These de-risk critical technical assumptions.

### 1.0a: Test Self Protocol SDK on Target Devices

**Goal:** Validate NFC passport scanning works on common Kenyan Android devices.

**Target Devices:**
- [ ] Tecno Spark 10 Pro (~$120, most popular in Kenya)
- [ ] Infinix Hot 30i (~$100, second most popular)
- [ ] Samsung Galaxy A04 (~$130, third most popular)

**Steps:**
1. Obtain or borrow 2+ devices from the list
2. Install Self Protocol mobile app from Play Store
3. Attempt NFC passport scan on each device
4. Document: Success rate, scan time, error messages
5. Test on both Kenyan and other passports if available

**Success Criteria:**
- [ ] Self Protocol app successfully scans passport on 2+ of 3 devices
- [ ] Scan completes in <60 seconds
- [ ] ZK proof generation works without errors
- [ ] Document results in `docs/validation/self-protocol-device-testing.md`

**If Validation Fails:**
- Still proceed with implementation (phone verification fallback covers this)
- Adjust UI copy to emphasize phone path more prominently
- Contact Self Protocol support for device compatibility guidance

**Estimated Time:** 2-4 hours (if devices available)

---

### 1.0b: Email Self Protocol for Pricing

**Goal:** Get official pricing quote to validate unit economics.

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
- [ ] Document in `docs/validation/self-protocol-pricing.md`

**Estimated Time:** 30 minutes (email), 1-2 weeks (response time)

---

### 1.0c: File Kenya ODPC Registration

**Goal:** Begin data protection registration with Kenya's Office of the Data Protection Commissioner.

**Steps:**
1. [ ] Review ODPC registration requirements: https://odpc.go.ke
2. [ ] Prepare required documents:
   - Company registration (or personal ID if not yet registered)
   - Data processing description (workers + clients)
   - Data protection policy draft
   - Contact information
3. [ ] Submit online registration form
4. [ ] Pay registration fee (if applicable)
5. [ ] Track application status

**Success Criteria:**
- [ ] Registration application submitted
- [ ] Confirmation receipt received
- [ ] Timeline documented (how long processing takes)
- [ ] Document in `docs/legal/odpc-registration.md`

**If Can't Complete:**
- Consult with Kenyan lawyer on interim operations
- Most platforms operate during processing period (can take 30-90 days)

**Estimated Time:** 3-6 hours

---

## Part 2: Technical Testing

### 2.1 Build & Bundle Analysis

```bash
# Verify production build
npm run build

# Analyze bundle size
npm run analyze
```

**Expected Results:**
- [ ] Build completes without errors
- [ ] Main bundle: <100kb gzipped
- [ ] Client dashboard bundle: <30kb gzipped
- [ ] Worker app bundle: <50kb gzipped
- [ ] **Total JS: <150kb gzipped** ⚠️ CRITICAL

**If bundle too large:**
- Check webpack-bundle-analyzer output
- Look for duplicate dependencies
- Move heavy libs to dynamic imports

---

### 2.2 Performance Testing

```bash
# Run Lighthouse analysis
npm run lighthouse
```

**Expected Metrics:**
- [ ] First Contentful Paint: <2s
- [ ] Time to Interactive: <5s
- [ ] Total Blocking Time: <300ms
- [ ] Lighthouse Performance Score: >90
- [ ] **3G Load Time: <3s** ⚠️ CRITICAL

**If performance issues:**
- Enable code splitting for heavy components
- Optimize images (WebP, lazy loading)
- Check for render-blocking resources

---

### 2.3 Database Testing

**Supabase Connection:**
- [ ] Test connection to Supabase (check env vars)
- [ ] Verify all tables created: `workers`, `tasks`, `projects`, `transactions`, `points_ledger`, `streak_records`, `revenue_tracking`
- [ ] Test RLS policies (try accessing data without auth)
- [ ] Verify backups enabled in Supabase dashboard

**Migration Status:**
```bash
# Check which migrations have been applied
# (In Supabase dashboard: Database > Migrations)
```

- [ ] Migration 001: Initial schema
- [ ] Migration 002: Worker onboarding
- [ ] Migration 003: Task types
- [ ] Migration 004: Payments
- [ ] Migration 005: Client dashboard
- [ ] Migration 006: Gamification

---

### 2.4 Blockchain Testing (Celo)

**⚠️ Use Celo Testnet First (Alfajores)**

- [ ] Connect to Celo testnet via RPC
- [ ] Test wallet detection (MiniPay or MetaMask)
- [ ] Test balance query (worker wallet)
- [ ] Test payment transaction (send 0.01 cUSD to test address)
- [ ] Verify transaction confirmation (<5 seconds)
- [ ] Test withdrawal flow (request withdrawal, check wallet)

**Environment Variables to Check:**
```bash
NEXT_PUBLIC_CELO_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_PRIVATE_KEY=<hot_wallet_key>  # Testnet key only!
```

**Mainnet Testing (After testnet passes):**
- [ ] Switch to Celo mainnet RPC
- [ ] Use production hot wallet (with minimal funds)
- [ ] Test micropayment ($0.05)
- [ ] Verify gas fees (<$0.01)

---

### 2.5 MiniPay Wallet Testing

**⚠️ Two Testing Modes Available:**

#### Mode 1: Local Development with MetaMask (Fast Iteration)

**Requirements:**
- MetaMask browser extension installed
- NODE_ENV=development (default for `npm run dev`)
- No Android device needed

**Steps:**
1. [ ] Start dev server: `npm run dev`
2. [ ] Install MetaMask if not already installed
3. [ ] Navigate to `http://localhost:3000/onboard`
4. [ ] **Expected:** Dev mode badge shows "Using MetaMask for testing"
5. [ ] Click through onboarding flow
6. [ ] Verify wallet address displays correctly
7. [ ] Complete a test task
8. [ ] Test withdrawal flow

**What This Tests:**
- UI flow and navigation
- Wallet connection logic
- Payment transaction structure
- Error handling

**What This DOESN'T Test:**
- Real MiniPay browser behavior
- Zero-click auto-connection
- MiniPay-specific features
- Mobile device performance

---

#### Mode 2: Real MiniPay Testing (Before Production Deploy)

**Requirements:**
- Real Android device (Tecno, Infinix, Samsung A-series)
- MiniPay app installed from Play Store
- ngrok installed: `npm install -g ngrok`
- Test wallet with Alfajores cUSD

**Steps:**
1. [ ] Start dev server: `npm run dev`
2. [ ] In another terminal, start ngrok: `ngrok http 3000`
3. [ ] Copy ngrok URL (e.g., `https://abc123.ngrok-free.app`)
4. [ ] Open MiniPay app on Android device
5. [ ] Navigate to ngrok URL in MiniPay browser
6. [ ] **Expected:** Wallet auto-connects without user prompt (zero-click)
7. [ ] No "Connect Wallet" button needed
8. [ ] Complete full worker flow: onboard → task → withdraw
9. [ ] Verify payment arrives in MiniPay wallet in <5 seconds
10. [ ] Test offline mode (turn off WiFi, queue tasks)
11. [ ] Test PWA installation (Add to Home Screen)

**What This Tests:**
- Real MiniPay browser detection (`window.ethereum.isMiniPay`)
- Zero-click wallet connection
- MiniPay-specific payment flow
- Mobile device performance
- Actual blockchain transactions

**Verification Checklist:**
- [ ] `window.ethereum.isMiniPay === true` (check in dev console)
- [ ] No "Open in MiniPay" error message
- [ ] Wallet address captured automatically
- [ ] Payment transaction confirmed on Celo blockchain
- [ ] Withdrawal arrives in MiniPay wallet balance
- [ ] 3G load time <3 seconds
- [ ] Touch targets 48x48px minimum

**Troubleshooting:**
- If ngrok shows "Visit Site" warning: Click through to continue
- If wallet doesn't auto-connect: Check MiniPay version is latest
- If payment fails: Verify Alfajores testnet RPC is accessible
- If slow on device: Check bundle size with `npm run analyze`

**Developer Mode in MiniPay (Optional):**
- Tap "Version" number 10 times in MiniPay settings
- Enable "Developer Settings" → "Use Testnet" (Alfajores)
- Access "Load Test Page" to test custom URLs without ngrok

---

**Production Verification (Final Step):**
1. [ ] Deploy to Vercel production: `NODE_ENV=production`
2. [ ] Open production URL in Chrome desktop
3. [ ] **Expected:** Shows "Open in MiniPay" message (correct behavior)
4. [ ] Open production URL in MiniPay on Android
5. [ ] **Expected:** Wallet auto-connects, full flow works
6. [ ] No dev mode badge visible
7. [ ] Test with real mainnet cUSD (small amounts only)

**Critical Rule:**
Production MUST enforce MiniPay-only. Desktop browsers MUST see the "Open in MiniPay" message.

---

## Part 3: Worker Flow Testing

Test the complete worker journey from onboarding to payout.

### 3.1 Worker Onboarding

**Test URL:** `http://localhost:3000/onboard`

- [ ] Page loads in <2 seconds
- [ ] MiniPay wallet auto-detection works (or shows "Open in MiniPay" message)
- [ ] "Verify with Self" button visible
- [ ] Clicking button opens Self Protocol flow (or shows modal)
- [ ] After verification, redirects to `/dashboard`
- [ ] Worker profile created in database

**Fallback Testing:**
- [ ] If Self Protocol unavailable, phone verification option shown
- [ ] Phone verification creates Level 1 worker account
- [ ] $10/day limit enforced for Level 1 workers

---

### 3.2 Task Dashboard

**Test URL:** `http://localhost:3000/dashboard`

- [ ] Earnings balance displayed prominently
- [ ] Available tasks shown (if any tasks in database)
- [ ] Task cards show: type, pay amount, time estimate
- [ ] "Start Task" button on each card
- [ ] Empty state shows: "No tasks right now. Check back soon!"
- [ ] Pull to refresh works (mobile)

---

### 3.3 Task Completion Flow

**Test Sentiment Analysis Task:**

1. [ ] Click "Start Task" on a sentiment task
2. [ ] Task screen loads with text and timer (45 seconds)
3. [ ] Three options visible: Positive / Negative / Neutral
4. [ ] Select an option → Submit button becomes active
5. [ ] Click "Submit"
6. [ ] Brief loading (<1 second)
7. [ ] "Earned $0.05" notification appears
8. [ ] Balance updates immediately
9. [ ] Next task auto-loads OR "No more tasks" shown

**Test Classification Task:**
- [ ] Similar flow to sentiment
- [ ] Category options match task definition
- [ ] Submission works correctly

**Test RLHF Task:**
- [ ] Two AI responses shown side-by-side
- [ ] "Choose A" or "Choose B" buttons work
- [ ] Higher pay shown ($0.15 vs $0.05)
- [ ] 60-second timer

**Golden Task Testing:**
- [ ] Golden tasks injected randomly (not identifiable)
- [ ] Wrong answer on golden task reduces accuracy score
- [ ] Accuracy score visible in profile

---

### 3.4 Earnings & Withdrawal

**Earnings Screen:**
- [ ] Current balance shown (large, prominent)
- [ ] "Withdraw" button visible
- [ ] Transaction history scrollable
- [ ] Each transaction shows: date, type, amount, status

**Withdrawal Flow:**
1. [ ] Click "Withdraw"
2. [ ] Amount input shown with pre-filled wallet address
3. [ ] Enter amount (or tap "Withdraw All")
4. [ ] Fee shown ($0.00 for cUSD)
5. [ ] Click "Withdraw Now"
6. [ ] Transaction submits (<5 seconds)
7. [ ] Success message: "Sent! Check your MiniPay wallet"
8. [ ] Balance updates
9. [ ] Transaction appears in history

**Edge Cases:**
- [ ] Insufficient balance: Shows error "Not enough funds. You have $X available."
- [ ] Below minimum ($0.01): Shows error or allows (no minimum)
- [ ] Network error: Shows "Couldn't send. Try again."

---

### 3.5 Gamification Features

**Points System:**
- [ ] Points awarded after task completion (5 pts base)
- [ ] Golden task bonus (+2 pts)
- [ ] Points balance visible on dashboard
- [ ] Redemption available when balance ≥1000 points
- [ ] Redemption converts at 100:1 ratio (100 pts = $1)
- [ ] 20% monthly revenue pool cap enforced
- [ ] 12-month expiry warning shown

**Referral Program:**
- [ ] Referral link generated on profile page
- [ ] Link can be copied and shared
- [ ] Referee completing 10 tasks triggers bonuses
- [ ] Referrer receives $1, referee receives $0.50
- [ ] Stats show: total referrals, active referrals, earnings

**Streak Tracking:**
- [ ] Current streak shown on dashboard
- [ ] Completes task → streak increments (if within 24 hours of last task)
- [ ] 7-day milestone → $0.50 bonus paid automatically
- [ ] 30-day milestone → $5.00 bonus paid automatically
- [ ] Longest streak tracked

**Leaderboard:**
- [ ] Weekly and monthly tabs work
- [ ] Top 10 earners displayed
- [ ] Top 10 quality (accuracy) displayed
- [ ] Worker's own rank shown
- [ ] Updates in real-time

---

### 3.6 Offline Mode

**Test Offline Functionality:**

1. [ ] Start dev server, load worker dashboard
2. [ ] Open DevTools → Network tab → Set "Offline"
3. [ ] Verify offline indicator appears
4. [ ] Start a task while offline
5. [ ] Submit task → Should queue locally
6. [ ] Check queue indicator shows "1 pending"
7. [ ] Go back online
8. [ ] Task auto-syncs within 10 seconds
9. [ ] Queue clears, earnings update

**Service Worker:**
- [ ] PWA install prompt appears (mobile)
- [ ] Assets cached for offline use
- [ ] Offline page shown when no connection

---

## Part 4: Client Dashboard Testing

Test the complete client journey from sign-up to results download.

### 4.1 Client Authentication

**Sign Up Flow:**
- [ ] Navigate to `/client/signup`
- [ ] Enter email, password, company name
- [ ] Accept terms checkbox
- [ ] Click "Create Account"
- [ ] Email verification sent (check inbox)
- [ ] Click verification link
- [ ] Redirects to `/client/dashboard`

**Login Flow:**
- [ ] Navigate to `/client/login`
- [ ] Enter email and password
- [ ] Click "Log In"
- [ ] Redirects to dashboard
- [ ] Session persists (refresh page, still logged in)

---

### 4.2 Client Dashboard

**Test URL:** `http://localhost:3000/client/dashboard`

- [ ] Balance displayed prominently
- [ ] "Deposit" button visible
- [ ] Active projects list shown (empty if none)
- [ ] Completed projects list shown
- [ ] "Create Project" button visible
- [ ] Recent activity feed

---

### 4.3 Project Creation Flow

1. [ ] Click "Create Project"
2. [ ] Form loads with fields:
   - Project name
   - Task type selector (Sentiment / Classification / RLHF)
   - File upload zone (CSV)
   - Instructions textarea
   - Price per task input (with minimum)
   - Total cost calculator
3. [ ] Upload a test CSV file (format: `text,label` columns)
4. [ ] Enter project name and instructions
5. [ ] Set price per task (e.g., $0.08)
6. [ ] Total cost calculates correctly (num_rows × price)
7. [ ] Click "Launch Project"
8. [ ] Project created successfully
9. [ ] Redirects to project detail page

**Test File Upload:**
- [ ] Valid CSV accepted
- [ ] Invalid format rejected: "Please upload a CSV file"
- [ ] Empty file rejected: "No data found. Check your file."

**Test Insufficient Balance:**
- [ ] If balance < total cost, shows: "Deposit $X more to launch this project"

---

### 4.4 Project Monitoring

**Project Detail Page:** `/client/projects/:id`

- [ ] Project name and status displayed
- [ ] Progress bar showing % complete
- [ ] Quality metrics: accuracy %, consensus rate
- [ ] Task breakdown: completed / in-progress / pending
- [ ] Activity log with timestamps
- [ ] "Download Results" button (when 100% complete)

**Real-Time Updates:**
- [ ] Progress bar updates as workers complete tasks
- [ ] Activity log shows new submissions
- [ ] Quality metrics update

---

### 4.5 Results Download

**When Project is 100% Complete:**

1. [ ] Email notification sent: "Your project is complete"
2. [ ] Open project detail page
3. [ ] "Download Results" button enabled
4. [ ] Click button
5. [ ] CSV file downloads immediately
6. [ ] CSV contains:
   - Original text column
   - Label column
   - Confidence score
   - Worker ID (anonymized)

**Partial Results:**
- [ ] If 87% complete, option to "Download partial results or wait?"
- [ ] Partial download includes only completed tasks

---

### 4.6 Deposit Flow

**Test URL:** `/client/deposit`

- [ ] Current balance shown
- [ ] Deposit amount input
- [ ] Payment options:
   - Crypto (send to address) - QR code shown
   - Card via MoonPay (external link)
- [ ] Copy deposit address button works
- [ ] Transaction history displayed

**Test Crypto Deposit:**
1. [ ] Copy deposit address
2. [ ] Send cUSD from test wallet
3. [ ] Balance updates within 1-2 minutes
4. [ ] Transaction appears in history

---

## Part 5: Security Testing

### 5.1 Authentication & Authorization

**Protected Routes:**
- [ ] `/dashboard` redirects to `/onboard` if not authenticated (worker)
- [ ] `/client/dashboard` redirects to `/client/login` if not authenticated
- [ ] API routes return 401 for unauthenticated requests
- [ ] Workers cannot access client-only endpoints
- [ ] Clients cannot access worker-only endpoints

**Session Management:**
- [ ] Worker session persists for 7 days
- [ ] Client session persists for 24 hours
- [ ] Logout clears session correctly
- [ ] Refresh token works if supported

---

### 5.2 Row-Level Security (RLS)

**Test in Supabase SQL Editor:**

```sql
-- Try to access another worker's data
SET ROLE authenticated;
SET request.jwt.claims ->> 'sub' = '<worker_id_1>';
SELECT * FROM workers WHERE id = '<worker_id_2>';
-- Should return 0 rows
```

- [ ] Workers can only see their own profile
- [ ] Workers can only see their own transactions
- [ ] Clients can only see their own projects
- [ ] Clients can only see their own balance

---

### 5.3 Environment Variables

**Critical Secrets:**
- [ ] `CELO_PRIVATE_KEY` not committed to git (check `.gitignore`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` stored in Vercel only
- [ ] No API keys in frontend code
- [ ] `.env.local` in `.gitignore`

**Verify:**
```bash
git log --all -- .env.local  # Should return nothing
grep -r "CELO_PRIVATE_KEY" ./  # Should only show .env.example
```

---

### 5.4 Rate Limiting

**Test Auth Endpoints:**
```bash
# Try 10 failed login attempts in 1 minute
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/v1/auth/client/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
```

- [ ] After 5-10 attempts, should return 429 "Too Many Requests"
- [ ] Rate limit resets after 1 minute

---

### 5.5 Input Validation

**Test API Endpoints:**

**Worker API:**
```bash
# Test task submission with invalid data
curl -X POST http://localhost:3000/api/v1/tasks/abc123/submit \
  -H "Content-Type: application/json" \
  -d '{"response": "'; DROP TABLE tasks;--"}'
```
- [ ] Returns 400 Bad Request
- [ ] No SQL injection
- [ ] Error message doesn't leak info

**Client API:**
```bash
# Test project creation with XSS payload
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>","taskType":"sentiment"}'
```
- [ ] Script tags escaped or rejected
- [ ] No XSS vulnerability

---

## Part 6: Mobile Testing (Critical!)

**⚠️ Bawo is mobile-first. Desktop testing is secondary.**

### 6.1 MiniPay Browser Testing

**Requirements:**
- Real Android device (Tecno, Infinix, or Samsung A-series)
- MiniPay app installed from Play Store
- Test wallet with cUSD

**Test in MiniPay:**
1. [ ] Deploy to Vercel staging: `vercel --prod`
2. [ ] Copy staging URL
3. [ ] Open URL in MiniPay browser (not Chrome)
4. [ ] Wallet auto-detects (no "Connect Wallet" button needed)
5. [ ] Complete full worker flow (onboard → task → withdraw)
6. [ ] Check payment in wallet (should arrive in <5 seconds)

**Performance on Device:**
- [ ] Load time <3 seconds on 3G
- [ ] No layout shift (CLS score <0.1)
- [ ] Touch targets 48x48px minimum
- [ ] Text readable (16px minimum)
- [ ] No horizontal scroll

---

### 6.2 Responsive Design

**Test Breakpoints:**

**Mobile (<768px):**
- [ ] Single column layout
- [ ] Bottom navigation bar (4 tabs)
- [ ] Full-width cards
- [ ] Readable text (16px base)

**Tablet (768-1024px):**
- [ ] Two-column layout where appropriate
- [ ] Navigation bar or sidebar

**Desktop (>1024px):**
- [ ] Client dashboard optimized
- [ ] Max-width 1280px, centered
- [ ] Sidebar navigation
- [ ] Worker app still usable but mobile-optimized

---

### 6.3 PWA Installation

**Test PWA Install:**
1. [ ] Open app in mobile browser
2. [ ] Install prompt appears after 30 seconds
3. [ ] Tap "Install" or "Add to Home Screen"
4. [ ] App icon appears on home screen
5. [ ] Open from home screen (full screen, no browser UI)
6. [ ] Splash screen appears on launch

**Offline Functionality:**
- [ ] Close app, turn off WiFi
- [ ] Reopen app from home screen
- [ ] Cached pages load immediately
- [ ] Offline indicator shows connection status
- [ ] Tasks queue locally when submitted offline

---

## Part 7: Monitoring & Logging

### 7.1 Error Tracking

**Vercel Dashboard:**
- [ ] Navigate to Vercel project → Logs
- [ ] Trigger an error in the app (e.g., submit invalid data)
- [ ] Error appears in logs within 10 seconds
- [ ] Stack trace visible
- [ ] User context captured (worker/client ID)

---

### 7.2 Axiom Logs

**If Axiom configured:**
- [ ] Custom events logging correctly
- [ ] Payment transactions logged
- [ ] Task submissions logged
- [ ] Error rates visible in dashboard

---

### 7.3 BetterStack Uptime Monitoring

- [ ] Production URL monitored (5-minute checks)
- [ ] Status page accessible
- [ ] Alerts configured (email/SMS)
- [ ] Test alert by stopping server briefly

---

## Part 8: Content & Legal

### 8.1 Landing Page

**Test URL:** `http://localhost:3000/`

- [ ] Value proposition clear: "Earn money labeling AI data, get paid instantly"
- [ ] CTA buttons work: "Start Earning" (worker), "Start Labeling" (client)
- [ ] Worker benefits listed: 2-4x rates, instant payment, no minimum
- [ ] Client benefits listed: African languages, neutral provider, 48hr turnaround
- [ ] Testimonials/social proof (if applicable)

---

### 8.2 Legal Pages

- [ ] Terms of Service published at `/terms`
- [ ] Privacy Policy published at `/privacy`
- [ ] Cookie consent banner (if using cookies beyond essential)
- [ ] Data protection notice references ODPC registration

---

### 8.3 Help & Documentation

**Worker FAQ:**
- [ ] How to get started
- [ ] How payment works
- [ ] How to increase earnings
- [ ] How to cash out to M-PESA

**Client Documentation:**
- [ ] How to create a project
- [ ] CSV format requirements
- [ ] Quality guarantees
- [ ] Pricing structure

---

## Part 9: Pre-Launch Checklist

### 9.1 Technical Go/No-Go

**MUST PASS:**
- [ ] All unit tests passing (`npm test`)
- [ ] Bundle size <150kb gzipped
- [ ] 3G load time <3s
- [ ] Payments working on Celo mainnet
- [ ] Database backups enabled
- [ ] HTTPS enforced
- [ ] RLS policies enabled

**SHOULD PASS:**
- [ ] E2E tests passing (if written)
- [ ] Lighthouse score >90
- [ ] Error tracking configured
- [ ] Monitoring configured

---

### 9.2 Business Go/No-Go

**MUST HAVE:**
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Client pricing confirmed
- [ ] Worker payment rates confirmed

**SHOULD HAVE:**
- [ ] 10+ founding workers recruited
- [ ] 1 pilot client committed ($1K+ project)
- [ ] WhatsApp group created
- [ ] Domain configured (bawo.work)

---

## Summary: Critical Path

If you have limited time, prioritize these:

### Priority 1 (Must Test):
1. [ ] Build passes (`npm run build`)
2. [ ] Bundle size <150kb (`npm run analyze`)
3. [ ] Worker onboarding flow works end-to-end
4. [ ] Task submission works
5. [ ] Payment transaction works on Celo testnet
6. [ ] Withdrawal works
7. [ ] Client project creation works
8. [ ] Security: RLS policies enabled

### Priority 2 (Should Test):
1. [ ] Performance: 3G load <3s (`npm run lighthouse`)
2. [ ] MiniPay browser testing (real device)
3. [ ] Offline mode works
4. [ ] Gamification features work
5. [ ] Client results download works

### Priority 3 (Nice to Test):
1. [ ] Self Protocol device testing
2. [ ] Edge cases (errors, timeouts)
3. [ ] Mobile responsiveness
4. [ ] PWA installation

---

## Notes

- **Mark items as you complete them** by changing `[ ]` to `[x]`
- **Document blockers** in a separate file or GitHub issues
- **Get help from CEO** if validation tasks fail or you're unsure
- **Focus on mobile testing** - this is a mobile-first app for African workers

---

**Last Updated:** 2026-01-30
**Next Review:** After local testing complete, before production deploy
