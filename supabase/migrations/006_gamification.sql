-- Sprint 6: Gamification & Polish
-- Add streak tracking and revenue tracking
-- Note: points_ledger and referrals tables already exist from migration 001

-- Add referral tracking columns to workers table
ALTER TABLE workers ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES workers(id);
ALTER TABLE workers ADD COLUMN IF NOT EXISTS referral_bonus_paid BOOLEAN DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_workers_referred_by ON workers(referred_by);

-- Streak tracking (daily task completion)
CREATE TABLE IF NOT EXISTS streak_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  streak_date DATE NOT NULL,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(worker_id, streak_date)
);

CREATE INDEX IF NOT EXISTS idx_streak_worker_date ON streak_records(worker_id, streak_date DESC);

-- Revenue tracking for points redemption pool (20% of monthly revenue)
CREATE TABLE IF NOT EXISTS revenue_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL, -- Format: YYYY-MM
  total_revenue_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  points_redeemed_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(month)
);

-- Update tx_type constraint to include new transaction types
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_tx_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_tx_type_check
  CHECK (tx_type IN ('task_payment', 'withdrawal', 'referral_bonus', 'streak_bonus', 'points_redemption'));

-- Row Level Security for new tables
ALTER TABLE streak_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_tracking ENABLE ROW LEVEL SECURITY;

-- Streaks: Workers can view their own streaks
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'streak_records' AND policyname = 'Workers can view their own streaks'
    ) THEN
        CREATE POLICY "Workers can view their own streaks"
          ON streak_records FOR SELECT
          USING (worker_id::text = auth.uid()::text);
    END IF;
END $$;

-- Revenue: Admins can view revenue tracking (simplified for now)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'revenue_tracking' AND policyname = 'Public can view revenue tracking'
    ) THEN
        CREATE POLICY "Public can view revenue tracking"
          ON revenue_tracking FOR SELECT
          USING (true);
    END IF;
END $$;
