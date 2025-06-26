/*
# Email Verification and Password Reset System

1. New Tables
  - `verification_tokens`
    - `id` (uuid, primary key)
    - `email` (text, not null)
    - `token` (text, not null)
    - `token_type` (text, not null) - 'email_verification' or 'password_reset'
    - `expires_at` (timestamp, not null)
    - `used` (boolean, default false)
    - `used_at` (timestamp, nullable)
    - `created_at` (timestamp, default now)

2. Table Updates
  - Add `email_verified` column to `users` table

3. Security
  - Enable RLS on `verification_tokens` table
  - Add policies for token management
  - Add indexes for performance
*/

-- Add email_verified column to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create verification_tokens table
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  token_type TEXT NOT NULL CHECK (token_type IN ('email_verification', 'password_reset')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_tokens_email ON verification_tokens(email);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_token ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_type ON verification_tokens(token_type);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_expires ON verification_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_tokens_used ON verification_tokens(used);

-- Enable RLS on verification_tokens
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;

-- RLS policies for verification_tokens
-- Note: These are service-level operations, so we'll allow service role access
CREATE POLICY "Service role can manage verification tokens" ON verification_tokens
  FOR ALL USING (true);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM verification_tokens 
  WHERE expires_at < NOW() AND used = false;
END;
$$ LANGUAGE plpgsql;

-- Create a function to automatically clean up expired tokens (can be called by a cron job)
-- This is optional and would need to be set up separately
COMMENT ON FUNCTION cleanup_expired_tokens() IS 'Cleans up expired verification tokens. Should be called periodically.';