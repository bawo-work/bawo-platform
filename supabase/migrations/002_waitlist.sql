-- Waitlist signups for landing page
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('worker', 'company')),
  source text,
  created_at timestamptz DEFAULT now()
);

-- Allow anonymous inserts (from the landing page)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Only authenticated (you) can read
CREATE POLICY "Allow authenticated reads" ON waitlist
  FOR SELECT TO authenticated
  USING (true);
