-- Fix RLS policy to allow worker registration
-- Workers table needs INSERT policy for onboarding

-- Allow anyone to insert their own worker profile during onboarding
-- This is safe because wallet_address must be unique
CREATE POLICY "Anyone can create worker profile"
  ON workers FOR INSERT
  WITH CHECK (true);

-- Note: In production, you might want to add additional checks here
-- such as verifying the wallet signature or rate limiting
