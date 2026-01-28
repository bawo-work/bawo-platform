# TICKETS — Sprint 5: Client Dashboard

## Batching rule
- 2–3 tickets max, then stop and report.
- Commit after each batch to keep changes readable.
- After completion, archive `logs/verify.log` into `logs/archive/` and ticket snapshots into `docs/archive/tickets/`.

## Sprint 5 Context

**Goal:** Build client dashboard for AI companies to create projects, upload task data, monitor progress, and download results.

**Key Files to Reference:**
- `grimoires/loa/sprint.md` (Sprint 5 details, lines 500+)
- `DESIGN.md` (Client dashboard design, Stripe-like UI)
- `grimoires/loa/sdd.md` (Section 4.2: Client Authentication)
- `supabase/migrations/001_initial_schema.sql` (Database schema already exists)

**Design Principles for Client Dashboard:**
- Stripe-like UI (clean, professional, efficient)
- Cool palette (white background, cool grays, not warm like worker app)
- Desktop-optimized (sidebar navigation)
- Technical tone (not warm/encouraging like worker app)

---

## Batch 1: Client Authentication & Base Layout

### T5.1: Install CSV parsing dependencies
**Files/folders:**
- `package.json`

**Acceptance:**
- [ ] `papaparse` installed for CSV parsing (worker-side parsing)
- [ ] `react-dropzone` installed for drag & drop file uploads
- [ ] `@supabase/auth-helpers-nextjs` installed (if not already present)
- [ ] `qrcode.react` installed for deposit QR codes
- [ ] `npm install` runs successfully
- [ ] No version conflicts

**Commands:**
```bash
npm install papaparse react-dropzone qrcode.react
npm install --save-dev @types/papaparse
```

---

### T5.2: Implement client authentication utilities
**Files/folders:**
- `lib/auth/client.ts` (new)
- `app/api/v1/auth/client/login/route.ts` (update)
- `app/api/v1/auth/client/signup/route.ts` (update)

**Acceptance:**
- [ ] `lib/auth/client.ts` exports:
  - `signUpClient(email, password, companyName)` - Creates auth user + client record
  - `signInClient(email, password)` - Returns session token
  - `signOutClient()` - Signs out
  - `getClientSession()` - Gets current session
- [ ] `/api/v1/auth/client/login` integrated with Supabase Auth (replace mock)
- [ ] `/api/v1/auth/client/signup` creates both auth user and `clients` table record
- [ ] Client record includes: `email`, `company_name`, `balance_usd` (default 0)
- [ ] Error handling for invalid credentials, duplicate emails
- [ ] Unit tests for auth utilities (5+ tests)

**Implementation notes:**
- Use `createClientComponentClient` from `@supabase/auth-helpers-nextjs`
- Store session via httpOnly cookies (handled by Supabase Auth)
- Link auth user to client record via `auth_user_id` field (add to migration if missing)

**Output shape:**
```typescript
// lib/auth/client.ts
export async function signUpClient(
  email: string,
  password: string,
  companyName: string
): Promise<{ user: User; session: Session }> {
  // Implementation
}
```

---

### T5.3: Create client login and signup pages
**Files/folders:**
- `app/client/login/page.tsx` (new)
- `app/client/signup/page.tsx` (new)
- `components/client/AuthForm.tsx` (new)

**Acceptance:**
- [ ] `/client/login` page with email/password form
- [ ] `/client/signup` page with email/password/company name form
- [ ] Form validation (email format, password min 8 chars)
- [ ] Loading states during submission
- [ ] Error messages displayed inline
- [ ] Link to switch between login/signup
- [ ] Successful login redirects to `/client/dashboard`
- [ ] Clean Stripe-like design (white background, cool grays)
- [ ] Responsive (desktop-first, mobile-friendly)

**Design reference:**
- DESIGN.md Section 4 (Client Dashboard)
- Use same `Input`, `Button` components from shadcn/ui
- Cool gray surfaces (`bg-gray-50` for secondary areas)
- Teal accent (`#1A5F5A`) for primary buttons

**Output shape:**
```tsx
// app/client/login/page.tsx
export default function ClientLoginPage() {
  // Form with email/password
  // Submit to signInClient()
  // Redirect to dashboard on success
}
```

---

### T5.4: Add route protection middleware
**Files/folders:**
- `middleware.ts` (update or create)

**Acceptance:**
- [ ] Middleware protects `/client/dashboard/*` and `/client/projects/*` routes
- [ ] Redirects to `/client/login` if no session
- [ ] Uses `createMiddlewareClient` from Supabase Auth Helpers
- [ ] Session check happens on server (not client)
- [ ] Does NOT interfere with worker routes (`/dashboard`, `/tasks`, `/earnings`)

**Implementation notes:**
- Use Next.js middleware with `createMiddlewareClient`
- Check `auth.getSession()` for protected routes
- Allow public routes: `/`, `/client/login`, `/client/signup`

**Output shape:**
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  // Check session for /client/* routes
  // Redirect to login if unauthorized
}

export const config = {
  matcher: ['/client/dashboard/:path*', '/client/projects/:path*']
};
```

---

### T5.5: Create client dashboard layout with sidebar
**Files/folders:**
- `app/client/dashboard/layout.tsx` (new)
- `app/client/dashboard/page.tsx` (new)
- `components/client/Sidebar.tsx` (new)
- `components/client/BalanceDisplay.tsx` (new)

**Acceptance:**
- [ ] Sidebar navigation with links:
  - Dashboard (overview)
  - Projects
  - Deposit Funds
  - Settings
- [ ] Balance display in header (current cUSD balance)
- [ ] Main content area (right of sidebar)
- [ ] Desktop-optimized layout (sidebar fixed, content scrollable)
- [ ] Responsive: collapses to hamburger menu on mobile
- [ ] Clean Stripe-like design (cool grays, white surfaces)
- [ ] Dashboard home shows: total projects, active tasks, completed tasks, total spent

**Design reference:**
```
┌─────────────────────────────────────────────┐
│  Sidebar     │  Main Content                │
│              │                               │
│  Dashboard   │  Project Stats               │
│  Projects    │  Recent Activity             │
│  Deposit     │  Quick Actions               │
│  Settings    │                               │
│              │                               │
└─────────────────────────────────────────────┘
```

**Output shape:**
```tsx
// app/client/dashboard/page.tsx
export default function ClientDashboardPage() {
  // Fetch client stats
  // Display overview cards
  // "Create Project" CTA button
}
```

---

## Batch 2: Project Creation UI

### T5.6: Create project creation form component
**Files/folders:**
- `app/client/projects/new/page.tsx` (new)
- `components/client/ProjectForm.tsx` (new)
- `components/client/TaskTypeSelector.tsx` (new)
- `components/client/PriceCalculator.tsx` (new)

**Acceptance:**
- [ ] Form fields:
  - Project name (text input)
  - Task type selector (Sentiment Analysis / Text Classification)
  - Instructions textarea (with template suggestions)
  - Price per task (number input with min validation)
  - CSV file upload area (handled in T5.7)
- [ ] Task type templates:
  - Sentiment: "Classify the sentiment of the following text as Positive, Negative, or Neutral..."
  - Classification: "Classify the following text into one of these categories: [categories]..."
- [ ] Minimum price per task type:
  - Sentiment: $0.05
  - Classification: $0.08
- [ ] Real-time price calculator showing:
  - Price per task × task count = Subtotal
  - Platform fee (40%)
  - Worker payment (60%)
  - Total cost
- [ ] Form validation before submission
- [ ] Clean, Stripe-like design

**Design reference:**
- DESIGN.md Section 4 (Client Dashboard - Create Project Page)
- SDD Section 5.5 (POST /api/v1/projects)

**Output shape:**
```tsx
// components/client/ProjectForm.tsx
export function ProjectForm() {
  const [projectName, setProjectName] = useState('');
  const [taskType, setTaskType] = useState<'sentiment' | 'classification'>('sentiment');
  const [instructions, setInstructions] = useState('');
  const [pricePerTask, setPricePerTask] = useState(0.05);

  // Total cost calculation
  // Form submission
}
```

---

### T5.7: Implement CSV upload with preview
**Files/folders:**
- `components/client/CSVUpload.tsx` (new)
- `lib/csv/parser.ts` (new)
- `lib/csv/validator.ts` (new)

**Acceptance:**
- [ ] Drag & drop zone for CSV files
- [ ] File validation:
  - Must be .csv extension
  - Max file size: 50MB
  - Max rows: 10,000 per project
- [ ] CSV parsing with PapaParse
- [ ] Preview table showing first 5 rows
- [ ] Column mapping UI (select which column contains text)
- [ ] Error messages for:
  - Invalid file format
  - File too large
  - Too many rows
  - Missing required columns
- [ ] Progress indicator during parsing
- [ ] Parsed data passed to parent form

**CSV requirements:**
- Must have at least one text column (content/text/message)
- Headers required
- Empty rows skipped

**Output shape:**
```tsx
// components/client/CSVUpload.tsx
export function CSVUpload({ onDataParsed }: {
  onDataParsed: (data: any[], columns: string[]) => void
}) {
  // Drag & drop zone
  // File validation
  // CSV parsing
  // Preview table
}
```

---

### T5.8: Create project API endpoint
**Files/folders:**
- `app/api/v1/projects/route.ts` (new)
- `lib/api/projects.ts` (new)

**Acceptance:**
- [ ] `POST /api/v1/projects` endpoint creates project and tasks
- [ ] Request validation:
  - Required: name, task_type, instructions, price_per_task, csv_data
  - Price >= minimum for task type
  - Client has sufficient balance
- [ ] Process:
  1. Create `projects` record
  2. Parse CSV data
  3. Create `tasks` records (batch insert)
  4. Mark 10% as golden tasks (if golden answers provided)
  5. Escrow funds from client balance
- [ ] Returns: project ID, task count, total cost
- [ ] Error handling:
  - Insufficient balance → 402 Payment Required
  - Invalid CSV → 400 Bad Request
  - Database errors → 500
- [ ] Unit tests for project creation logic

**SDD reference:**
- SDD Section 5.5 (POST /api/v1/projects)

**Output shape:**
```typescript
// lib/api/projects.ts
export async function createProject(
  clientId: string,
  data: {
    name: string;
    task_type: 'sentiment' | 'classification';
    instructions: string;
    price_per_task: number;
    csv_data: any[];
  }
): Promise<{ projectId: string; taskCount: number; totalCost: number }> {
  // Implementation
}
```

---

## Batch 3: Progress Monitoring & Results

### T5.9: Create project detail page with real-time progress
**Files/folders:**
- `app/client/projects/[id]/page.tsx` (new)
- `components/client/ProjectProgress.tsx` (new)
- `components/client/QualityMetrics.tsx` (new)
- `hooks/useProjectProgress.ts` (new)

**Acceptance:**
- [ ] Project detail page shows:
  - Project name, task type, instructions
  - Progress bar (% complete)
  - Task counts: Total / Completed / In Progress / Pending
  - Quality metrics: Accuracy %, Consensus rate
  - Worker activity feed (recent completions)
- [ ] Real-time updates via Supabase Realtime
- [ ] `useProjectProgress` hook subscribes to project changes
- [ ] Updates without page refresh
- [ ] Clean data visualization (progress bars, stat cards)

**Supabase Realtime setup:**
- Subscribe to `projects` table updates (filter by project ID)
- Update local state when `completed_tasks` changes
- Calculate percentage: `(completed / total) * 100`

**Output shape:**
```tsx
// hooks/useProjectProgress.ts
export function useProjectProgress(projectId: string) {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });

  // Supabase Realtime subscription
  // Returns stats and percentComplete
}
```

---

### T5.10: Implement results download
**Files/folders:**
- `app/api/v1/projects/[id]/results/route.ts` (new)
- `components/client/DownloadButton.tsx` (new)
- `lib/api/results.ts` (new)

**Acceptance:**
- [ ] `GET /api/v1/projects/:id/results` endpoint generates CSV
- [ ] CSV format:
  - `task_id` - Task UUID
  - `text` - Original text content
  - `label` - Final consensus label
  - `confidence` - Confidence score (0-1)
  - `consensus` - yes/no (2+ workers agreed?)
  - `worker_count` - Number of workers who labeled
  - `completed_at` - Timestamp
- [ ] Download button shows when project complete
- [ ] Partial results option (download before 100% complete)
- [ ] File downloads with project name: `{projectName}-results-{timestamp}.csv`
- [ ] Error handling for incomplete projects

**Implementation notes:**
- Use PapaParse to generate CSV from JSON
- Stream large results (don't load all into memory)
- Set proper headers: `Content-Type: text/csv`, `Content-Disposition: attachment`

**Output shape:**
```typescript
// lib/api/results.ts
export async function exportProjectResults(
  projectId: string
): Promise<string> {
  // Fetch tasks with responses
  // Format as CSV
  // Return CSV string
}
```

---

### T5.11: Create projects list page
**Files/folders:**
- `app/client/projects/page.tsx` (new)
- `components/client/ProjectCard.tsx` (new)

**Acceptance:**
- [ ] List all client's projects
- [ ] Each project card shows:
  - Project name
  - Task type
  - Progress (% complete)
  - Status (Active / Paused / Completed)
  - Total tasks / Completed tasks
  - Created date
- [ ] Filter by status (All / Active / Completed)
- [ ] Sort by: Created date, Completion %
- [ ] "Create New Project" button
- [ ] Click project → navigate to detail page
- [ ] Empty state when no projects

**Design:**
- Grid layout (2-3 columns on desktop)
- Card-based UI
- Status badges with colors (green=complete, yellow=active, gray=paused)

**Output shape:**
```tsx
// app/client/projects/page.tsx
export default function ProjectsListPage() {
  // Fetch client's projects
  // Filter and sort
  // Render project cards
}
```

---

## Batch 4: Deposit System

### T5.12: Create deposit page with crypto and card options
**Files/folders:**
- `app/client/deposit/page.tsx` (new)
- `components/client/DepositOptions.tsx` (new)
- `components/client/TransactionHistory.tsx` (new)

**Acceptance:**
- [ ] Deposit page shows:
  - Current balance (cUSD)
  - Two deposit methods:
    1. **Crypto Deposit**: Display cUSD deposit address with QR code
    2. **Card Payment**: Link to MoonPay (external)
  - Transaction history (deposits and project spending)
- [ ] Crypto deposit:
  - Show static deposit address (from env var)
  - QR code for easy mobile scanning
  - Instructions: "Send cUSD (Celo Dollar) to this address"
  - Note: "Deposits confirmed after 1 block (~5 seconds)"
- [ ] Card payment:
  - Button: "Buy cUSD with Card →"
  - Opens MoonPay in new tab
  - Note: "External service. 3-5% card processing fee."
- [ ] Transaction history table:
  - Date, Type (Deposit / Project), Amount, Status

**Environment variables:**
- `NEXT_PUBLIC_CLIENT_DEPOSIT_ADDRESS` - Static cUSD address for deposits

**Output shape:**
```tsx
// app/client/deposit/page.tsx
export default function DepositPage() {
  // Show balance
  // Crypto deposit address with QR
  // MoonPay link
  // Transaction history
}
```

---

### T5.13: Add balance validation before project launch
**Files/folders:**
- `lib/api/projects.ts` (update)
- `components/client/ProjectForm.tsx` (update)

**Acceptance:**
- [ ] Before project creation, check:
  - `client.balance_usd >= total_project_cost`
- [ ] If insufficient balance:
  - Show error: "Insufficient balance. You need $X more to launch this project."
  - Show "Deposit Funds" button → redirect to `/client/deposit`
- [ ] On successful project creation:
  - Deduct `total_project_cost` from `client.balance_usd`
  - Create transaction record (type: `project_escrow`)
- [ ] Show loading state during balance check

**Database updates:**
- Add `project_escrow` to `tx_type` enum (if not present)
- Consider adding `client_transactions` table (or reuse `transactions`)

**Output shape:**
```typescript
// lib/api/projects.ts (updated)
export async function createProject(...) {
  // 1. Check client balance
  // 2. If insufficient, throw error
  // 3. Deduct funds
  // 4. Create project
}
```

---

### T5.14: Add database migration for client auth link
**Files/folders:**
- `supabase/migrations/002_client_auth_link.sql` (new)

**Acceptance:**
- [ ] Add `auth_user_id` column to `clients` table
- [ ] Link to Supabase Auth users
- [ ] Update RLS policies to use `auth_user_id` instead of `id`
- [ ] Add index on `auth_user_id`

**Migration SQL:**
```sql
-- Link clients to Supabase Auth
ALTER TABLE clients ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX idx_clients_auth_user ON clients(auth_user_id);

-- Update RLS policies
DROP POLICY "Clients can view own profile" ON clients;
CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  USING (auth.uid() = auth_user_id);
```

---

## Batch 5: Testing & Polish

### T5.15: Add comprehensive unit tests
**Files/folders:**
- `test/lib/auth/client.test.ts` (new)
- `test/lib/api/projects.test.ts` (new)
- `test/lib/csv/parser.test.ts` (new)
- `test/lib/api/results.test.ts` (new)

**Acceptance:**
- [ ] Minimum 15 unit tests covering:
  - Client signup/login/logout
  - Project creation with balance validation
  - CSV parsing and validation
  - Results export formatting
  - Balance deduction logic
- [ ] All tests pass: `npm run test:unit`
- [ ] Test coverage for critical paths (auth, payments, CSV)

**Test structure:**
```typescript
// test/lib/auth/client.test.ts
describe('Client Authentication', () => {
  it('should create client account on signup', async () => {
    // Test signup flow
  });

  it('should reject signup with invalid email', async () => {
    // Test validation
  });

  // ... more tests
});
```

---

### T5.16: Add client dashboard to README and update docs
**Files/folders:**
- `README.md` (update)
- `docs/CLIENT_DASHBOARD.md` (new)

**Acceptance:**
- [ ] README.md updated with:
  - Client dashboard section
  - How to access: `/client/login`
  - Environment variables needed
- [ ] `docs/CLIENT_DASHBOARD.md` created with:
  - Overview of client features
  - Project creation guide
  - CSV format requirements
  - Deposit instructions
  - Troubleshooting

**Output shape:**
```markdown
# CLIENT_DASHBOARD.md

## Features
- Create projects with CSV upload
- Monitor progress in real-time
- Download results
- Manage deposits

## CSV Format
...
```

---

### T5.17: Verify bundle size and performance
**Files/folders:**
- N/A (verification only)

**Acceptance:**
- [ ] Bundle size still <150kb JS gzipped (check with `npm run build`)
- [ ] Client dashboard loads in <3s on 3G
- [ ] No console errors in production build
- [ ] All pages responsive (test on mobile)
- [ ] Lighthouse score >90 for performance

**Commands:**
```bash
npm run build
npm run start
# Test in browser with Chrome DevTools throttling (Fast 3G)
```

---

## Sprint 5 Completion Checklist

**Core Functionality:**
- [ ] Client can sign up and log in
- [ ] Client can create projects with CSV upload
- [ ] CSV parsed and validated (max 10,000 rows)
- [ ] Progress updates in real-time (via Supabase)
- [ ] Results downloadable as CSV
- [ ] Client can deposit funds (crypto or card link)
- [ ] Balance validated before project launch

**UI/UX:**
- [ ] Stripe-like UI (clean, professional)
- [ ] Cool palette (white/gray, not warm)
- [ ] Desktop-optimized layout
- [ ] Responsive on mobile
- [ ] Loading states on all forms
- [ ] Error messages clear and helpful

**Testing:**
- [ ] 15+ unit tests passing
- [ ] No TypeScript errors
- [ ] Bundle size <150kb
- [ ] All pages load successfully

**Documentation:**
- [ ] README.md updated
- [ ] CLIENT_DASHBOARD.md created
- [ ] CSV format documented

---

## Notes for Codex

**Important Context:**
1. Worker app already exists (`/dashboard`, `/tasks`, `/earnings`) - DO NOT modify
2. Client app is completely new (`/client/*`) - all new code
3. Database schema exists - `clients`, `projects`, `tasks` tables ready
4. Auth skeleton exists in `/api/v1/auth/client/*` - replace mock with real Supabase

**Design Differences (Worker vs Client):**
| Aspect | Worker App | Client App |
|--------|-----------|------------|
| Palette | Warm (amber/orange) | Cool (white/gray) |
| Tone | Friendly, encouraging | Professional, technical |
| Layout | Mobile-first, bottom nav | Desktop-first, sidebar |
| Style | Card-heavy, touch-friendly | Data-dense, Stripe-like |

**Key Dependencies to Install:**
- `papaparse` - CSV parsing
- `react-dropzone` - File uploads
- `qrcode.react` - QR codes for deposit address

**Testing Strategy:**
- Unit tests for critical business logic (auth, payments, CSV)
- Integration tests not required for MVP
- Manual testing for UI flows

**Git Commit Messages:**
- `feat(client): add email/password authentication`
- `feat(client): add project creation UI`
- `feat(client): add CSV upload with validation`
- `feat(client): add real-time progress monitoring`
- `feat(client): add results download`
- `feat(client): add deposit system`

---

**Ready for implementation. Start with Batch 1.**
