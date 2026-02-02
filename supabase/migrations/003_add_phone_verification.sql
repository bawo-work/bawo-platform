-- Add phone verification support to workers table
-- Fixes: "Could not find the 'phone_number' column of 'workers' in the schema cache"

-- Add phone_number column for phone verification fallback
ALTER TABLE workers
ADD COLUMN IF NOT EXISTS phone_number TEXT UNIQUE;

COMMENT ON COLUMN workers.phone_number IS 'Phone number for Level 1 verification fallback';

-- Rename self_protocol_did to self_did for consistency with API
ALTER TABLE workers
RENAME COLUMN self_protocol_did TO self_did;

COMMENT ON COLUMN workers.self_did IS 'Self Protocol DID for Level 2 verification';

-- Update verification level comments
COMMENT ON COLUMN workers.verification_level IS '0=unverified, 1=phone verified, 2=Self Protocol verified, 3=language verified';
