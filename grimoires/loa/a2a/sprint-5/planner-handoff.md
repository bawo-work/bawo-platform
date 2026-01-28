# Sprint 5 Planner Handoff: Client Dashboard

**Sprint ID:** sprint-5 (Global Sprint ID: 5)
**Duration:** 2-2.5 days
**Status:** Ready for Implementation
**Date:** 2026-01-28
**Planner:** Claude (Sonnet 4.5)

---

## Executive Summary

Sprint 5 delivers the **Client Dashboard** - a Stripe-like web interface for AI companies to create data labeling projects, upload CSV files with task data, monitor real-time progress, and download results. This completes the two-sided marketplace, enabling Bawo to onboard paying customers and generate revenue.

**What's New:**
- Email/password authentication for clients (vs wallet-based for workers)
- Desktop-optimized UI with sidebar navigation (vs mobile-first worker app)
- CSV upload with validation (max 10,000 rows, 50MB)
- Real-time progress monitoring via Supabase Realtime
- Results export as CSV with labels and confidence scores
- Deposit system (crypto address + MoonPay link)
- Balance validation before project launch

**Technical Approach:**
- Reuse Supabase Auth infrastructure (different flow than workers)
- Leverage existing database schema (`clients`, `projects`, `tasks`)
- Add CSV parsing dependencies (PapaParse, react-dropzone)
- Implement Supabase Realtime subscriptions for live updates
- Maintain separation from worker app (new `/client/*` routes)

---

## Current State Analysis

### ✅ What Exists (Sprints 1-4)

**Worker App (Complete):**
- `/dashboard` - Worker home with available tasks
- `/tasks/[id]` - Task completion UI
- `/earnings/withdraw` - Withdrawal flow
- `/onboard` - MiniPay + Self Protocol verification

**Database Schema (Ready):**
- `clients` table with `email`, `company_name`, `balance_usd`
- `projects` table with `task_type`, `instructions`, `price_per_task`
- `tasks` table with `content`, `status`, `consensus_label`
- `task_responses` table for worker submissions
- `transactions` table for payment tracking

**Auth Skeleton:**
- `/api/v1/auth/client/login` - Returns mock response (needs real integration)
- `/api/v1/auth/client/signup` - Returns mock response (needs real integration)

### ❌ What's Missing (Sprint 5 Scope)

**Client UI:**
- No client login/signup pages
- No client dashboard layout
- No project creation form
- No CSV upload component
- No project detail/progress pages
- No results download functionality
- No deposit page

**Backend:**
- Auth routes are mocks (need Supabase integration)
- No project creation API (`POST /api/v1/projects`)
- No results export API (`GET /api/v1/projects/:id/results`)
- No balance validation logic
- No database migration for `auth_user_id` link

**Dependencies:**
- CSV parsing libraries not installed

---

## Ticket Breakdown

Sprint 5 is divided into **5 batches** with **17 tickets total**.

### Batch 1: Client Authentication & Base Layout (5 tickets)

**Goal:** Enable clients to sign up, log in, and see dashboard skeleton.

**Tickets:**
- **T5.1** - Install CSV parsing dependencies (`papaparse`, `react-dropzone`, `qrcode.react`)
- **T5.2** - Implement `lib/auth/client.ts` utilities (signUp, signIn, signOut)
- **T5.3** - Create `/client/login` and `/client/signup` pages
- **T5.4** - Add route protection middleware (protect `/client/dashboard/*`)
- **T5.5** - Create dashboard layout with sidebar and balance display

**Deliverable:** Client can sign up, log in, and see empty dashboard.

**Time Estimate:** 4-6 hours

---

### Batch 2: Project Creation UI (3 tickets)

**Goal:** Enable clients to create projects with CSV upload.

**Tickets:**
- **T5.6** - Create project creation form with task type selector and price calculator
- **T5.7** - Implement CSV upload component with drag & drop, validation, and preview
- **T5.8** - Create `POST /api/v1/projects` endpoint (project + task creation)

**Deliverable:** Client can upload CSV, configure project settings, and launch project.

**Time Estimate:** 6-8 hours

---

### Batch 3: Progress Monitoring & Results (3 tickets)

**Goal:** Real-time progress tracking and results download.

**Tickets:**
- **T5.9** - Create project detail page with real-time progress (Supabase Realtime)
- **T5.10** - Implement results download API and button (CSV export)
- **T5.11** - Create projects list page with filtering and sorting

**Deliverable:** Client can monitor project progress live and download results.

**Time Estimate:** 5-7 hours

---

### Batch 4: Deposit System (3 tickets)

**Goal:** Enable clients to deposit funds and validate balance.

**Tickets:**
- **T5.12** - Create deposit page with crypto address (QR code) and MoonPay link
- **T5.13** - Add balance validation before project launch (escrow funds)
- **T5.14** - Add database migration for `auth_user_id` column in `clients` table

**Deliverable:** Client can deposit funds and only launch projects with sufficient balance.

**Time Estimate:** 3-5 hours

---

### Batch 5: Testing & Polish (3 tickets)

**Goal:** Ensure quality, performance, and documentation.

**Tickets:**
- **T5.15** - Add comprehensive unit tests (15+ tests for auth, CSV, projects)
- **T5.16** - Update README and create `docs/CLIENT_DASHBOARD.md`
- **T5.17** - Verify bundle size (<150kb) and performance (Lighthouse >90)

**Deliverable:** Sprint 5 complete, tested, documented.

**Time Estimate:** 3-4 hours

---

## Design Specifications

### Visual Identity: Worker vs Client

| Aspect | Worker App | Client App |
|--------|-----------|------------|
| **Palette** | Warm (amber `#F59E0B`, orange) | Cool (white, gray `#F9FAFB`) |
| **Primary Color** | Teal `#1A5F5A` (shared) | Teal `#1A5F5A` (shared) |
| **Tone** | Friendly, encouraging | Professional, technical |
| **Layout** | Mobile-first, bottom nav | Desktop-first, sidebar |
| **Typography** | Larger (16-18px base) | Standard (14-16px base) |
| **Components** | Card-heavy, touch-friendly | Data-dense, table-heavy |

### Client Dashboard Layout

```
┌─────────────────────────────────────────────┐
│  Logo    Balance: $250.00        User Menu  │
├──────────┬──────────────────────────────────┤
│          │                                   │
│ Sidebar  │  Main Content Area                │
│          │                                   │
│ Dashboard│  ┌─────────────────────────────┐  │
│ Projects │  │   Active Projects: 3        │  │
│ Deposit  │  │   Tasks Completed: 1,247    │  │
│ Settings │  │   Total Spent: $89.47       │  │
│          │  └─────────────────────────────┘  │
│          │                                   │
│          │  Recent Activity                  │
│          │  ┌─────────────────────────────┐  │
│          │  │ Project A - 87% complete    │  │
│          │  │ Project B - 100% complete   │  │
│          │  └─────────────────────────────┘  │
│          │                                   │
└──────────┴──────────────────────────────────┘
```

**Key UI Elements:**
- **Sidebar:** Fixed left navigation (150-200px wide)
- **Header:** Balance display (prominent), user menu
- **Main Content:** White background, gray cards (`bg-gray-50`)
- **Progress Bars:** Teal fill, gray background
- **Buttons:** Teal primary, gray secondary
- **Tables:** Striped rows, hover states

### CSV Format Requirements

**Required Columns:**
- At least one text column (common names: `text`, `content`, `message`, `comment`)

**Optional Columns:**
- `id` - Unique identifier (auto-generated if missing)
- `golden_answer` - Pre-labeled correct answer for QA (marks as golden task)
- `metadata` - JSON string with additional context

**Constraints:**
- Max file size: 50MB
- Max rows: 10,000 per project
- Headers required (first row)
- Empty rows skipped automatically
- UTF-8 encoding assumed

**Example CSV:**
```csv
id,text,golden_answer
1,"This product is amazing!",Positive
2,"Terrible experience, will not buy again.",Negative
3,"It's okay, nothing special.",Neutral
```

---

## Technical Implementation Notes

### Authentication Flow

**Client Signup:**
1. User enters email, password, company name
2. `signUpClient()` creates Supabase Auth user
3. Insert record in `clients` table with `auth_user_id` link
4. Redirect to `/client/dashboard`

**Client Login:**
1. User enters email, password
2. `signInClient()` calls `supabase.auth.signInWithPassword()`
3. Session stored in httpOnly cookie (automatic via Supabase Auth Helpers)
4. Redirect to `/client/dashboard`

**Session Management:**
- Use `createClientComponentClient()` for client-side auth checks
- Use `createMiddlewareClient()` for server-side route protection
- Session automatically refreshed by Supabase Auth Helpers

### CSV Processing Pipeline

**Upload Flow:**
1. User drags CSV file into upload zone
2. Client-side validation (extension, size)
3. PapaParse parses CSV to JSON (preview first 5 rows)
4. User maps columns (select which column is "text")
5. Submit entire JSON payload to API (no file upload to server)

**Backend Processing:**
```typescript
POST /api/v1/projects
{
  name: "Swahili Sentiment Q1",
  task_type: "sentiment",
  instructions: "Classify as Positive/Negative/Neutral",
  price_per_task: 0.08,
  csv_data: [
    { text: "This is great!", golden_answer: "Positive" },
    { text: "Bad product", golden_answer: "Negative" }
  ]
}

Response:
{
  projectId: "uuid",
  taskCount: 2,
  totalCost: 0.16
}
```

**Task Creation:**
- Batch insert into `tasks` table (use `INSERT INTO ... VALUES ...` for speed)
- Mark 10% as golden if `golden_answer` provided
- Set `is_golden = true` and copy `golden_answer` to `tasks.golden_answer`

### Real-time Progress Updates

**Supabase Realtime Subscription:**
```typescript
const channel = supabase
  .channel(`project-${projectId}`)
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'projects',
      filter: `id=eq.${projectId}`
    },
    (payload) => {
      setStats(payload.new)
    }
  )
  .subscribe()

// Cleanup
return () => supabase.removeChannel(channel)
```

**What Triggers Updates:**
- Worker completes task → `completed_tasks` increments
- Consensus reached → `status` may change to `completed`
- Project paused/resumed → `status` changes

**UI Updates:**
- Progress bar fills smoothly (CSS transition)
- Task counts update without flicker
- Quality metrics recalculate

### Results Export Format

**CSV Columns:**
```csv
task_id,text,label,confidence,consensus,worker_count,completed_at
abc-123,"This is great!",Positive,0.95,yes,3,2026-01-28T10:30:00Z
def-456,"Bad product",Negative,0.88,yes,3,2026-01-28T10:31:00Z
```

**Generation:**
```typescript
const tasks = await supabase
  .from('tasks')
  .select('*, task_responses(*)')
  .eq('project_id', projectId)
  .eq('status', 'completed')

const csv = Papa.unparse(tasks.map(task => ({
  task_id: task.id,
  text: task.content,
  label: task.consensus_label,
  confidence: task.consensus_confidence,
  consensus: task.consensus_confidence >= 0.67 ? 'yes' : 'no',
  worker_count: task.task_responses.length,
  completed_at: task.completed_at
})))
```

---

## Database Changes Required

### Migration 002: Client Auth Link

**File:** `supabase/migrations/002_client_auth_link.sql`

```sql
-- Add auth_user_id to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_auth_user ON clients(auth_user_id);

-- Update RLS policies
DROP POLICY IF EXISTS "Clients can view own profile" ON clients;
CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Clients can update own profile" ON clients;
CREATE POLICY "Clients can update own profile"
  ON clients FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Update projects RLS to use auth_user_id
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );
```

**Run After:** T5.2 (client auth utilities implemented)

---

## Dependencies to Install

**Production:**
```bash
npm install papaparse react-dropzone qrcode.react
```

**Development:**
```bash
npm install --save-dev @types/papaparse
```

**Already Installed:**
- `@supabase/supabase-js` (v2.45.0)
- `@supabase/auth-helpers-nextjs` (check if missing, add if needed)
- `viem` (for Celo blockchain, already in package.json)
- `zustand` (state management, already in package.json)

**Optional (Post-MVP):**
- `@tanstack/react-query` - For better server state management
- `recharts` - For quality metrics charts

---

## Testing Strategy

### Unit Tests (Minimum 15)

**Auth Tests (5):**
```typescript
describe('lib/auth/client', () => {
  it('should create client account on signup')
  it('should reject signup with invalid email')
  it('should reject signup with weak password')
  it('should login with valid credentials')
  it('should fail login with invalid credentials')
})
```

**CSV Tests (4):**
```typescript
describe('lib/csv/parser', () => {
  it('should parse valid CSV')
  it('should reject files over 50MB')
  it('should reject files over 10,000 rows')
  it('should handle missing headers gracefully')
})
```

**Project Tests (4):**
```typescript
describe('lib/api/projects', () => {
  it('should create project with valid data')
  it('should reject project with insufficient balance')
  it('should deduct balance on project creation')
  it('should mark 10% of tasks as golden')
})
```

**Results Tests (2):**
```typescript
describe('lib/api/results', () => {
  it('should export results as CSV')
  it('should include all required columns')
})
```

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with valid email/password
- [ ] Sign up fails with duplicate email
- [ ] Log in with valid credentials
- [ ] Log in fails with invalid credentials
- [ ] Protected routes redirect to login
- [ ] Session persists after page refresh

**Project Creation:**
- [ ] Upload valid CSV (100 rows)
- [ ] Upload fails with invalid file (not CSV)
- [ ] Upload fails with file >50MB
- [ ] Upload fails with >10,000 rows
- [ ] Price calculator updates dynamically
- [ ] Project creation fails with insufficient balance
- [ ] Project created successfully with sufficient balance

**Progress Monitoring:**
- [ ] Progress bar shows correct percentage
- [ ] Task counts update in real-time (simulate worker completions)
- [ ] Quality metrics display correctly
- [ ] Project detail page loads without errors

**Results Download:**
- [ ] Download button enabled when project complete
- [ ] CSV downloads with correct filename
- [ ] CSV contains all expected columns
- [ ] CSV data matches database records

**Deposit System:**
- [ ] Deposit page shows QR code
- [ ] MoonPay link opens in new tab
- [ ] Transaction history displays correctly

---

## Performance Targets

**Bundle Size:**
- Current (Sprint 4): ~180kb JS gzipped
- Target (Sprint 5): <150kb JS gzipped
- Strategy: Code splitting for client routes (`/client/*` lazy loaded)

**Load Times (3G):**
- Initial load: <3s
- Client login page: <2s
- Client dashboard: <2.5s
- Project detail page: <2s

**Lighthouse Scores:**
- Performance: >90
- Accessibility: >95
- Best Practices: >90
- SEO: >90

**Optimization Strategies:**
1. Lazy load CSV parsing libraries (only on project creation page)
2. Paginate projects list (show 20 per page)
3. Limit task preview in CSV upload (5 rows max)
4. Use Supabase CDN for static assets
5. Enable Next.js image optimization

---

## Error Handling

### Expected Errors

**Authentication:**
- `INVALID_EMAIL` - Email format invalid
- `WEAK_PASSWORD` - Password <8 characters
- `DUPLICATE_EMAIL` - Email already registered
- `INVALID_CREDENTIALS` - Wrong email/password

**CSV Upload:**
- `INVALID_FILE_TYPE` - Not a CSV file
- `FILE_TOO_LARGE` - >50MB
- `TOO_MANY_ROWS` - >10,000 rows
- `MISSING_HEADERS` - No header row
- `EMPTY_FILE` - No data rows

**Project Creation:**
- `INSUFFICIENT_BALANCE` - Balance < project cost
- `INVALID_PRICE` - Price below minimum
- `INVALID_TASK_TYPE` - Unknown task type

**Results Download:**
- `PROJECT_INCOMPLETE` - Can't download partial results (if option not enabled)
- `NO_COMPLETED_TASKS` - Project has no completed tasks

### Error Display Strategy

**Client-side:**
- Form validation errors: Inline below input field (red text)
- API errors: Toast notification (top-right corner, auto-dismiss in 5s)
- Critical errors: Modal dialog (requires user acknowledgment)

**Server-side:**
- Return consistent error format:
  ```json
  {
    "error": {
      "code": "INSUFFICIENT_BALANCE",
      "message": "You need $15.00 more to launch this project.",
      "details": {
        "required": 100.00,
        "current": 85.00,
        "shortfall": 15.00
      }
    }
  }
  ```

---

## Git Workflow

### Commit Strategy

**After Each Batch:**
```bash
git add .
git commit -m "feat(client): batch 1 - client authentication and layout"
git push
```

**Commit Message Format:**
- `feat(client): add email/password authentication`
- `feat(client): add project creation UI`
- `feat(client): add CSV upload with validation`
- `feat(client): add real-time progress monitoring`
- `feat(client): add results download`
- `feat(client): add deposit system`
- `test(client): add unit tests for auth and projects`
- `docs(client): update README with client dashboard info`

**Branch Strategy (if using):**
- Main: `master`
- Feature branch: `sprint-5/client-dashboard` (optional)
- Merge after all 5 batches complete and tested

---

## Acceptance Criteria Summary

### Core Functionality
- [x] Client can sign up and log in with email/password
- [x] Client can create projects by uploading CSV files
- [x] CSV files validated (max 10,000 rows, 50MB)
- [x] Progress updates in real-time via Supabase Realtime
- [x] Results downloadable as CSV with labels and confidence scores
- [x] Client can deposit funds (crypto address + MoonPay link)
- [x] Balance validated before project launch (escrow on creation)

### UI/UX
- [x] Stripe-like design (clean, professional)
- [x] Cool color palette (white/gray, not warm like worker app)
- [x] Desktop-optimized layout with sidebar navigation
- [x] Responsive on mobile (sidebar collapses to hamburger)
- [x] Loading states on all forms
- [x] Error messages clear and helpful

### Testing
- [x] 15+ unit tests passing
- [x] No TypeScript errors (`npm run type-check` passes)
- [x] Bundle size <150kb JS gzipped
- [x] All pages load successfully in production build

### Documentation
- [x] README.md updated with client dashboard section
- [x] `docs/CLIENT_DASHBOARD.md` created with user guide
- [x] CSV format requirements documented

---

## Risk Assessment

### High Risk
**Risk:** CSV parsing performance on large files (10,000 rows)
**Impact:** Slow UI, browser freezing
**Mitigation:** Parse in chunks, show progress indicator, consider web worker

**Risk:** Supabase Realtime subscription failures (network drops)
**Impact:** Progress not updating live
**Mitigation:** Fallback to polling every 10s, show "reconnecting" indicator

### Medium Risk
**Risk:** Client balance deduction race condition (concurrent project creation)
**Impact:** Overdraft, negative balance
**Mitigation:** Use database transaction with SELECT FOR UPDATE, check balance in transaction

**Risk:** Results CSV export memory issues (large projects)
**Impact:** API timeout, out-of-memory error
**Mitigation:** Stream CSV generation, paginate database queries (1000 rows at a time)

### Low Risk
**Risk:** MoonPay link outdated or broken
**Impact:** Card deposits fail
**Mitigation:** Store link in environment variable, test periodically, show fallback message

---

## Next Steps (Sprint 6 Preview)

After Sprint 5 completes, Sprint 6 will add:
- **Gamification:** Points system, referrals, streaks, leaderboards
- **RLHF Tasks:** Comparative ranking tasks for LLM training
- **Offline Support:** Service workers, IndexedDB caching
- **Performance Polish:** Bundle optimization, lazy loading
- **Launch Prep:** Error monitoring (Sentry), analytics (PostHog)

Sprint 6 is the final sprint before MVP launch.

---

## Appendix A: File Structure

```
/home/zoz/ai-workspace/projects/20260127-2230-bawo-work/
├── app/
│   ├── client/                      [NEW]
│   │   ├── login/
│   │   │   └── page.tsx             [T5.3]
│   │   ├── signup/
│   │   │   └── page.tsx             [T5.3]
│   │   ├── dashboard/
│   │   │   ├── layout.tsx           [T5.5]
│   │   │   └── page.tsx             [T5.5]
│   │   ├── projects/
│   │   │   ├── page.tsx             [T5.11]
│   │   │   ├── new/
│   │   │   │   └── page.tsx         [T5.6]
│   │   │   └── [id]/
│   │   │       └── page.tsx         [T5.9]
│   │   └── deposit/
│   │       └── page.tsx             [T5.12]
│   ├── api/
│   │   └── v1/
│   │       ├── auth/
│   │       │   └── client/
│   │       │       ├── login/
│   │       │       │   └── route.ts [T5.2 update]
│   │       │       └── signup/
│   │       │           └── route.ts [T5.2 update]
│   │       └── projects/
│   │           ├── route.ts         [T5.8]
│   │           └── [id]/
│   │               └── results/
│   │                   └── route.ts [T5.10]
├── components/
│   └── client/                      [NEW]
│       ├── AuthForm.tsx             [T5.3]
│       ├── Sidebar.tsx              [T5.5]
│       ├── BalanceDisplay.tsx       [T5.5]
│       ├── ProjectForm.tsx          [T5.6]
│       ├── TaskTypeSelector.tsx     [T5.6]
│       ├── PriceCalculator.tsx      [T5.6]
│       ├── CSVUpload.tsx            [T5.7]
│       ├── ProjectProgress.tsx      [T5.9]
│       ├── QualityMetrics.tsx       [T5.9]
│       ├── DownloadButton.tsx       [T5.10]
│       ├── ProjectCard.tsx          [T5.11]
│       ├── DepositOptions.tsx       [T5.12]
│       └── TransactionHistory.tsx   [T5.12]
├── lib/
│   ├── auth/
│   │   └── client.ts                [T5.2]
│   ├── api/
│   │   ├── projects.ts              [T5.8]
│   │   └── results.ts               [T5.10]
│   └── csv/
│       ├── parser.ts                [T5.7]
│       └── validator.ts             [T5.7]
├── hooks/
│   └── useProjectProgress.ts        [T5.9]
├── supabase/
│   └── migrations/
│       └── 002_client_auth_link.sql [T5.14]
├── test/
│   └── lib/
│       ├── auth/
│       │   └── client.test.ts       [T5.15]
│       ├── api/
│       │   ├── projects.test.ts     [T5.15]
│       │   └── results.test.ts      [T5.15]
│       └── csv/
│           └── parser.test.ts       [T5.15]
├── docs/
│   └── CLIENT_DASHBOARD.md          [T5.16]
├── middleware.ts                    [T5.4 update/create]
├── package.json                     [T5.1 update]
└── README.md                        [T5.16 update]
```

---

## Appendix B: Environment Variables

**Required:**
```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Client Deposit (new)
NEXT_PUBLIC_CLIENT_DEPOSIT_ADDRESS=0x1234...  # cUSD deposit address
```

**Optional:**
```env
# MoonPay (card on-ramp)
NEXT_PUBLIC_MOONPAY_API_KEY=pk_test_xxx  # For embedded widget (Phase 2)
```

---

## Appendix C: References

**Design Documents:**
- `DESIGN.md` - Complete design specification
- `grimoires/loa/prd.md` - Product requirements (Section 4.9, 4.10)
- `grimoires/loa/sdd.md` - Software design (Section 4.2, 5.5)
- `grimoires/loa/sprint.md` - Sprint 5 details (lines 500+)

**Code References:**
- Worker auth: `lib/identity/self-protocol.ts`
- Worker UI: `components/onboard/*.tsx`
- Task submission: `app/api/v1/tasks/[id]/submit/route.ts`

**External Documentation:**
- Supabase Auth: https://supabase.com/docs/guides/auth
- Supabase Realtime: https://supabase.com/docs/guides/realtime
- PapaParse: https://www.papaparse.com/docs
- React Dropzone: https://react-dropzone.js.org/

---

**Status:** Ready for Codex to implement. Start with Batch 1 (tickets T5.1 - T5.5).

**Estimated Total Time:** 21-30 hours (2-2.5 days at 12-15 hours/day)

**Contact Planner:** If any requirements are unclear or tickets need adjustment during implementation.
