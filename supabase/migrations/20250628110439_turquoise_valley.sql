/*
  # Require Email Verification for Login

  1. Changes
    - Add a trigger function to check email verification status during login
    - Add a trigger to the auth.users table to enforce email verification

  2. Security
    - Users must verify their email before they can log in
    - Exception for OAuth users who are pre-verified
*/

-- Create a function to check email verification status
CREATE OR REPLACE FUNCTION check_email_verification()
RETURNS TRIGGER AS $$
DECLARE
  is_verified BOOLEAN;
  is_oauth BOOLEAN;
BEGIN
  -- Check if the user is logging in via OAuth (these users are pre-verified)
  is_oauth := NEW.app_metadata->>'provider' IS NOT NULL AND NEW.app_metadata->>'provider' != 'email';
  
  -- Skip verification check for OAuth users
  IF is_oauth THEN
    RETURN NEW;
  END IF;
  
  -- Get verification status from the users table
  SELECT email_verified INTO is_verified FROM public.users WHERE id = NEW.id;
  
  -- If user is not verified, prevent login
  IF NOT is_verified THEN
    RAISE EXCEPTION 'Email not verified. Please check your email for verification link.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a trigger to the auth.users table
DROP TRIGGER IF EXISTS check_email_verification_trigger ON auth.users;
CREATE TRIGGER check_email_verification_trigger
BEFORE UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW
EXECUTE FUNCTION check_email_verification();

-- Add a comment to explain the trigger
COMMENT ON TRIGGER check_email_verification_trigger ON auth.users IS 
'Checks if a user has verified their email before allowing login. OAuth users are exempt.';