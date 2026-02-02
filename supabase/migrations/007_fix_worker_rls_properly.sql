-- Explicitly fix RLS policies for worker registration
-- Drop existing policies and recreate with correct permissions

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Anyone can create worker profile" ON workers;

-- Create explicit INSERT policy that allows public registration
CREATE POLICY "Public worker registration"
  ON workers
  FOR INSERT
  TO public, anon, authenticated
  WITH CHECK (true);

-- Verify other policies still work
-- Workers can view their own profile (existing)
-- Workers can update their own profile (existing)
