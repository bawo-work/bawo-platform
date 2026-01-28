-- Sprint 6: Gamification & Polish
-- Add points ledger, referral tracking, streak rewards

-- Points Ledger
CREATE TABLE points_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  points INTEGER NOT NULL CHECK (points > 0),
  activity_type TEXT NOT NULL CHECK (activity_type IN (
    'training_task',
    'golden_bonus',
    'referral_bonus',
    'streak_bonus',
    'quality_bonus'
  )),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  redeemed BOOLEAN NOT NULL DEFAULT FALSE,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_points_worker ON points_ledger(worker_id);
CREATE INDEX idx_points_redeemed ON points_ledger(worker_id, redeemed, expires_at);

-- Add referral tracking to workers table
ALTER TABLE workers ADD COLUMN referred_by UUID REFERENCES workers(id);
ALTER TABLE workers ADD COLUMN referral_bonus_paid BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX idx_workers_referred_by ON workers(referred_by);

-- Streak tracking (daily task completion)
CREATE TABLE streak_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  streak_date DATE NOT NULL,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(worker_id, streak_date)
);

CREATE INDEX idx_streak_worker_date ON streak_records(worker_id, streak_date DESC);

-- Revenue tracking for points redemption pool (20% of monthly revenue)
CREATE TABLE revenue_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  month TEXT NOT NULL, -- Format: YYYY-MM
  total_revenue_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  points_redeemed_usd DECIMAL(10, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(month)
);

-- Add tx_type for streak and referral bonuses to transactions enum
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_tx_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_tx_type_check
  CHECK (tx_type IN ('task_completion', 'consensus_bonus', 'withdrawal', 'referral_bonus', 'streak_reward', 'points_redemption', 'deposit'));

-- Row Level Security
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE streak_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_tracking ENABLE ROW LEVEL SECURITY;

-- Points: Workers can view their own points
CREATE POLICY "Workers can view their own points"
  ON points_ledger FOR SELECT
  USING (auth.uid() IN (
    SELECT auth_user_id FROM workers WHERE id = worker_id
  ));

-- Streaks: Workers can view their own streaks
CREATE POLICY "Workers can view their own streaks"
  ON streak_records FOR SELECT
  USING (auth.uid() IN (
    SELECT auth_user_id FROM workers WHERE id = worker_id
  ));

-- Revenue: Clients can view revenue tracking
CREATE POLICY "Clients can view revenue tracking"
  ON revenue_tracking FOR SELECT
  USING (auth.jwt()->>'user_type' = 'client');
