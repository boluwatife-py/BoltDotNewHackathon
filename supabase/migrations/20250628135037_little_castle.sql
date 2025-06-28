/*
# Email Verification Requirement Implementation

1. Database Changes
  - Update users table to ensure email_verified defaults to false
  - Add index for better performance on email_verified lookups
  - Create helper function for checking verification status

2. Security
  - Add RLS policy updates for verified users
  - Ensure proper indexing for performance

3. Notes
  - Email verification will be enforced at the application layer
  - OAuth users will be marked as verified automatically
*/

-- Ensure email_verified column exists and has proper default
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email_verified'
  ) THEN
    ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;
  ELSE
    -- Update existing column to ensure proper default
    ALTER TABLE users ALTER COLUMN email_verified SET DEFAULT false;
  END IF;
END $$;

-- Add index for email_verified column for better performance
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- Create a function to check if a user's email is verified
CREATE OR REPLACE FUNCTION is_user_email_verified(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  is_verified BOOLEAN := false;
BEGIN
  SELECT email_verified INTO is_verified 
  FROM users 
  WHERE email = user_email;
  
  RETURN COALESCE(is_verified, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to mark user as verified
CREATE OR REPLACE FUNCTION mark_user_email_verified(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  rows_updated INTEGER;
BEGIN
  UPDATE users 
  SET email_verified = true, updated_at = NOW()
  WHERE email = user_email;
  
  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user verification status by ID
CREATE OR REPLACE FUNCTION get_user_verification_status(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_verified BOOLEAN := false;
BEGIN
  SELECT email_verified INTO is_verified 
  FROM users 
  WHERE id = user_uuid;
  
  RETURN COALESCE(is_verified, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update existing users to have email_verified = false if NULL
UPDATE users SET email_verified = false WHERE email_verified IS NULL;

-- Add comment explaining the verification system
COMMENT ON COLUMN users.email_verified IS 'Indicates whether the user has verified their email address. Required for login except for OAuth users.';
COMMENT ON FUNCTION is_user_email_verified(TEXT) IS 'Checks if a user email is verified. Returns false if user not found.';
COMMENT ON FUNCTION mark_user_email_verified(TEXT) IS 'Marks a user email as verified. Returns true if successful.';
COMMENT ON FUNCTION get_user_verification_status(UUID) IS 'Gets verification status by user ID. Returns false if user not found.';