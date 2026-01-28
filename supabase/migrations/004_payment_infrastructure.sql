-- Sprint 4: Payment Infrastructure Database Updates
-- Add columns needed for Celo blockchain payments

-- Add balance tracking to workers table
ALTER TABLE workers ADD COLUMN IF NOT EXISTS balance_usd DECIMAL(10, 2) DEFAULT 0.00;

-- Add fee tracking and task reference to transactions table
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS fee_usd DECIMAL(10, 4) DEFAULT 0.00;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS task_id UUID REFERENCES tasks(id);

-- Add consensus tracking to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS final_label TEXT;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS consensus_reached BOOLEAN DEFAULT false;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS confidence_score DECIMAL(5, 2);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS pay_amount DECIMAL(6, 4) DEFAULT 0.08;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS assigned_to UUID[] DEFAULT ARRAY[]::UUID[];

-- Create index for faster transaction lookups
CREATE INDEX IF NOT EXISTS idx_transactions_task_id ON transactions(task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_consensus ON tasks(consensus_reached, status);

-- Add check constraint to ensure valid amounts
ALTER TABLE transactions ADD CONSTRAINT check_positive_amount CHECK (amount_usd > 0 OR tx_type = 'withdrawal');

-- Add updated_at trigger for workers table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON workers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment documentation
COMMENT ON COLUMN workers.balance_usd IS 'Current cUSD balance available for withdrawal';
COMMENT ON COLUMN transactions.fee_usd IS 'Gas fee paid in cUSD (Celo fee abstraction)';
COMMENT ON COLUMN transactions.task_id IS 'Reference to task that triggered payment';
COMMENT ON COLUMN tasks.final_label IS 'Consensus result after 3 worker responses';
COMMENT ON COLUMN tasks.consensus_reached IS 'Whether 2/3 workers agreed on answer';
COMMENT ON COLUMN tasks.pay_amount IS 'Amount in USD paid per worker for this task';
COMMENT ON COLUMN tasks.assigned_to IS 'Array of worker IDs assigned to this task (for consensus)';
