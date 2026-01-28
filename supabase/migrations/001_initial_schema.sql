-- Initial Bawo database schema
-- Sprint 1: Foundation & Setup
-- Reference: SDD Section 3.3

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workers table
-- Stores worker profiles, verification levels, and reputation
CREATE TABLE workers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  self_protocol_did TEXT UNIQUE,
  verification_level INT DEFAULT 0 CHECK (verification_level BETWEEN 0 AND 3),
  language_skills TEXT[] DEFAULT '{}',
  reputation_score DECIMAL(5,2) DEFAULT 0.00 CHECK (reputation_score >= 0 AND reputation_score <= 100),
  total_tasks_completed INT DEFAULT 0 CHECK (total_tasks_completed >= 0),
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00 CHECK (accuracy_rate >= 0 AND accuracy_rate <= 100),
  tier TEXT DEFAULT 'newcomer' CHECK (tier IN ('newcomer', 'bronze', 'silver', 'gold', 'expert')),
  earnings_lifetime DECIMAL(10,2) DEFAULT 0.00 CHECK (earnings_lifetime >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE workers IS 'Worker profiles with verification and reputation tracking';
COMMENT ON COLUMN workers.verification_level IS '0=unverified, 1=phone, 2=Self Protocol, 3=language verified';
COMMENT ON COLUMN workers.tier IS 'Worker tier based on performance: newcomer/bronze/silver/gold/expert';

-- Clients table
-- Stores AI company accounts and balances
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  balance_usd DECIMAL(10,2) DEFAULT 0.00 CHECK (balance_usd >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE clients IS 'AI company client accounts';

-- Projects table
-- Client-created data labeling projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('sentiment', 'classification', 'rlhf', 'voice')),
  instructions TEXT NOT NULL,
  price_per_task DECIMAL(6,4) NOT NULL CHECK (price_per_task >= 0.05),
  total_tasks INT NOT NULL CHECK (total_tasks > 0),
  completed_tasks INT DEFAULT 0 CHECK (completed_tasks >= 0),
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE projects IS 'Client data labeling projects';
COMMENT ON COLUMN projects.price_per_task IS 'Client pays per task (minimum $0.05, typical $0.08)';

-- Tasks table
-- Individual labeling tasks within projects
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('sentiment', 'classification', 'rlhf', 'voice')),
  options TEXT[], -- For classification tasks
  time_limit_seconds INT DEFAULT 45 CHECK (time_limit_seconds > 0),
  is_golden BOOLEAN DEFAULT false,
  golden_answer TEXT, -- Pre-labeled answer for QA
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'completed', 'expired')),
  consensus_label TEXT,
  consensus_confidence DECIMAL(4,2) CHECK (consensus_confidence >= 0 AND consensus_confidence <= 1),
  assigned_count INT DEFAULT 0 CHECK (assigned_count >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE tasks IS 'Individual tasks to be completed by workers';
COMMENT ON COLUMN tasks.is_golden IS '10% of tasks are golden (pre-labeled for QA)';
COMMENT ON COLUMN tasks.consensus_confidence IS 'Confidence score from consensus (0-1)';

-- Task responses table
-- Worker submissions for tasks
CREATE TABLE task_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  response TEXT NOT NULL,
  response_time_seconds INT NOT NULL CHECK (response_time_seconds > 0),
  is_correct BOOLEAN, -- null if not golden, true/false if golden
  submitted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(task_id, worker_id)
);

COMMENT ON TABLE task_responses IS 'Worker responses to tasks';
COMMENT ON COLUMN task_responses.is_correct IS 'Only set for golden tasks';

-- Transactions table
-- Payment records for workers
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  amount_usd DECIMAL(10,6) NOT NULL,
  tx_type TEXT NOT NULL CHECK (tx_type IN ('task_payment', 'withdrawal', 'referral_bonus', 'streak_bonus', 'points_redemption')),
  tx_hash TEXT, -- Celo transaction hash
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  confirmed_at TIMESTAMPTZ
);

COMMENT ON TABLE transactions IS 'Payment transactions for workers';
COMMENT ON COLUMN transactions.tx_hash IS 'Celo blockchain transaction hash';

-- Points ledger table
-- Points program for cold start phase
CREATE TABLE points_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  points INT NOT NULL CHECK (points >= 0),
  activity_type TEXT NOT NULL CHECK (activity_type IN ('training_task', 'golden_bonus', 'referral', 'streak', 'quality_bonus')),
  description TEXT,
  issued_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + INTERVAL '12 months'),
  redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMPTZ
);

COMMENT ON TABLE points_ledger IS 'Points program for cold start (100 points = $1)';
COMMENT ON COLUMN points_ledger.expires_at IS 'Points expire after 12 months';

-- Referrals table
-- Referral tracking for viral growth
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES workers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'qualified', 'paid')),
  referrer_bonus_usd DECIMAL(6,2) DEFAULT 1.00,
  referee_bonus_usd DECIMAL(6,2) DEFAULT 0.50,
  created_at TIMESTAMPTZ DEFAULT now(),
  qualified_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  UNIQUE(referee_id)
);

COMMENT ON TABLE referrals IS 'Referral program tracking (Sprint 6)';
COMMENT ON COLUMN referrals.status IS 'pending -> qualified (10 tasks) -> paid';

-- Indexes for performance
CREATE INDEX idx_workers_wallet ON workers(wallet_address);
CREATE INDEX idx_workers_verification ON workers(verification_level);
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_task_responses_worker ON task_responses(worker_id);
CREATE INDEX idx_task_responses_task ON task_responses(task_id);
CREATE INDEX idx_transactions_worker ON transactions(worker_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_points_worker_redeemed ON points_ledger(worker_id, redeemed);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);

-- Row-Level Security (RLS)
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workers
CREATE POLICY "Workers can view own profile"
  ON workers FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Workers can update own profile"
  ON workers FOR UPDATE
  USING (auth.uid()::text = id::text);

-- RLS Policies for clients
CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Clients can update own profile"
  ON clients FOR UPDATE
  USING (auth.uid()::text = id::text);

-- RLS Policies for projects
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  USING (client_id::text = auth.uid()::text);

CREATE POLICY "Clients can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (client_id::text = auth.uid()::text);

CREATE POLICY "Clients can update own projects"
  ON projects FOR UPDATE
  USING (client_id::text = auth.uid()::text);

-- RLS Policies for tasks
CREATE POLICY "Workers can view available tasks"
  ON tasks FOR SELECT
  USING (status = 'pending' OR status = 'assigned');

-- RLS Policies for task_responses
CREATE POLICY "Workers can view own responses"
  ON task_responses FOR SELECT
  USING (worker_id::text = auth.uid()::text);

CREATE POLICY "Workers can insert own responses"
  ON task_responses FOR INSERT
  WITH CHECK (worker_id::text = auth.uid()::text);

-- RLS Policies for transactions
CREATE POLICY "Workers can view own transactions"
  ON transactions FOR SELECT
  USING (worker_id::text = auth.uid()::text);

-- RLS Policies for points_ledger
CREATE POLICY "Workers can view own points"
  ON points_ledger FOR SELECT
  USING (worker_id::text = auth.uid()::text);

-- RLS Policies for referrals
CREATE POLICY "Workers can view own referrals"
  ON referrals FOR SELECT
  USING (referrer_id::text = auth.uid()::text OR referee_id::text = auth.uid()::text);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
