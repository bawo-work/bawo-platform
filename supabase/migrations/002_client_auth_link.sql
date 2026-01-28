-- Sprint 5: Client Authentication Link
-- Add auth_user_id to clients table and update RLS policies

-- Add auth_user_id column to link clients to Supabase Auth
ALTER TABLE clients ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create unique index on auth_user_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_clients_auth_user ON clients(auth_user_id);

-- Update RLS policies to use auth_user_id instead of id

-- Drop old client policies
DROP POLICY IF EXISTS "Clients can view own profile" ON clients;
DROP POLICY IF EXISTS "Clients can update own profile" ON clients;

-- Create new client policies using auth_user_id
CREATE POLICY "Clients can view own profile"
  ON clients FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Clients can update own profile"
  ON clients FOR UPDATE
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Clients can insert own profile"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

-- Update projects RLS policies to use auth_user_id lookup

-- Drop old project policies
DROP POLICY IF EXISTS "Clients can view own projects" ON projects;
DROP POLICY IF EXISTS "Clients can insert own projects" ON projects;
DROP POLICY IF EXISTS "Clients can update own projects" ON projects;

-- Create new project policies with proper client_id check
CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update own projects"
  ON projects FOR UPDATE
  USING (
    client_id IN (
      SELECT id FROM clients WHERE auth_user_id = auth.uid()
    )
  );

-- Add policy for clients to view their project tasks
CREATE POLICY "Clients can view own project tasks"
  ON tasks FOR SELECT
  USING (
    project_id IN (
      SELECT p.id FROM projects p
      JOIN clients c ON p.client_id = c.id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- Add policy for clients to view task responses for their projects
CREATE POLICY "Clients can view task responses for own projects"
  ON task_responses FOR SELECT
  USING (
    task_id IN (
      SELECT t.id FROM tasks t
      JOIN projects p ON t.project_id = p.id
      JOIN clients c ON p.client_id = c.id
      WHERE c.auth_user_id = auth.uid()
    )
  );

-- Add comment
COMMENT ON COLUMN clients.auth_user_id IS 'Link to Supabase Auth user (auth.users.id)';
