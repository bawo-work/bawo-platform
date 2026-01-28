# Supabase Setup Guide

## Sprint 1: Database Schema Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project:
   - Organization: Your organization
   - Project name: `bawo-mvp`
   - Database password: (save securely)
   - Region: Choose closest to target users (Kenya/South Africa if available, otherwise EU)
   - Pricing plan: Free tier for MVP

### 2. Apply Database Schema

#### Option A: Using Supabase Dashboard (Recommended for MVP)

1. Open your Supabase project
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into SQL Editor
5. Click "Run" to execute

#### Option B: Using Supabase CLI (For Production)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these values:**
- Go to Project Settings > API
- URL: `Project URL`
- Anon Key: `anon` `public` key
- Service Role Key: `service_role` key (keep secret!)

### 4. Verify Setup

Run this test query in Supabase SQL Editor:

```sql
SELECT
  table_name,
  COUNT(*) as column_count
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('workers', 'clients', 'projects', 'tasks', 'task_responses', 'transactions', 'points_ledger', 'referrals')
GROUP BY table_name
ORDER BY table_name;
```

**Expected result:** 8 tables listed

### 5. Test Connection from Next.js

```bash
npm run dev
```

Check that the app starts without database connection errors.

## Database Schema Overview

### 8 Core Tables

1. **workers** - Worker profiles, verification levels, reputation
2. **clients** - AI company accounts and balances
3. **projects** - Client data labeling projects
4. **tasks** - Individual labeling tasks
5. **task_responses** - Worker submissions
6. **transactions** - Payment records (Celo blockchain)
7. **points_ledger** - Points program for cold start
8. **referrals** - Referral tracking for growth

### Verification Levels

- **Level 0**: Unverified (training tasks only)
- **Level 1**: Phone verified (basic tasks, $10/day limit)
- **Level 2**: Self Protocol verified (all tasks, $50/day limit)
- **Level 3**: Language verified (premium tasks, $200/day limit)

### Row-Level Security (RLS)

All tables have RLS enabled:
- Workers can only see their own data
- Clients can only see their own projects
- Service role bypasses RLS for admin operations

## Troubleshooting

### Connection Errors

If you see "Invalid Supabase URL":
1. Check `.env.local` exists (not `.env.example`)
2. Verify URL format: `https://xxx.supabase.co`
3. Restart dev server: `npm run dev`

### Missing Tables

If tables don't exist:
1. Re-run migration SQL in Supabase dashboard
2. Check for SQL errors in the response
3. Verify UUID extension is enabled

### RLS Policy Issues

If queries fail with permission errors:
1. Verify you're using the service role key for admin operations
2. Check RLS policies match the query pattern
3. Test queries in Supabase SQL Editor with "RLS disabled" for debugging

## Next Steps

- Sprint 2: Add Self Protocol verification
- Sprint 3: Implement task engine
- Sprint 4: Integrate Celo payments
