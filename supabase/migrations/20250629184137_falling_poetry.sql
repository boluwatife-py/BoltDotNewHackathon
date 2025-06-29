/*
# Supplement Logs System

1. New Tables
  - `supplement_logs`
    - `id` (uuid, primary key)
    - `user_id` (uuid, references users)
    - `supplement_id` (integer, references supplements)
    - `scheduled_time` (time, when supplement should be taken)
    - `taken_at` (timestamp, when supplement was marked as taken)
    - `status` (text, one of: 'pending', 'taken', 'missed', 'skipped')
    - `notes` (text, optional notes)
    - `created_at` (timestamp, when log was created)

2. Security
  - Enable RLS on `supplement_logs` table
  - Add policies for log management
  - Add indexes for performance
*/

-- Create supplement_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS supplement_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    supplement_id INTEGER NOT NULL REFERENCES supplements(id) ON DELETE CASCADE,
    scheduled_time TIME WITHOUT TIME ZONE NOT NULL,
    taken_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'missed', 'skipped')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_supplement_logs_user_id ON supplement_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_supplement_logs_supplement_id ON supplement_logs(supplement_id);
CREATE INDEX IF NOT EXISTS idx_supplement_logs_scheduled_time ON supplement_logs(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_supplement_logs_created_at ON supplement_logs(created_at);

-- Enable Row Level Security
ALTER TABLE supplement_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for supplement_logs - added IF NOT EXISTS to fix the error
CREATE POLICY IF NOT EXISTS "Users can view own supplement logs" ON supplement_logs
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY IF NOT EXISTS "Users can insert own supplement logs" ON supplement_logs
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY IF NOT EXISTS "Users can update own supplement logs" ON supplement_logs
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY IF NOT EXISTS "Users can delete own supplement logs" ON supplement_logs
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Function to get today's logs for a user
CREATE OR REPLACE FUNCTION get_todays_logs(user_uuid UUID)
RETURNS SETOF supplement_logs AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM supplement_logs
    WHERE user_id = user_uuid
    AND created_at >= CURRENT_DATE
    AND created_at < CURRENT_DATE + INTERVAL '1 day'
    ORDER BY scheduled_time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark a supplement as taken
CREATE OR REPLACE FUNCTION mark_supplement_taken(
    p_user_id UUID,
    p_supplement_id INTEGER,
    p_scheduled_time TIME WITHOUT TIME ZONE,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
    existing_log_id UUID;
BEGIN
    -- Check if log already exists for today
    SELECT id INTO existing_log_id
    FROM supplement_logs
    WHERE user_id = p_user_id
    AND supplement_id = p_supplement_id
    AND scheduled_time = p_scheduled_time
    AND created_at >= CURRENT_DATE
    AND created_at < CURRENT_DATE + INTERVAL '1 day';
    
    IF existing_log_id IS NOT NULL THEN
        -- Update existing log
        UPDATE supplement_logs
        SET status = 'taken',
            taken_at = NOW(),
            notes = COALESCE(p_notes, notes)
        WHERE id = existing_log_id;
        
        RETURN existing_log_id;
    ELSE
        -- Create new log
        INSERT INTO supplement_logs (
            user_id,
            supplement_id,
            scheduled_time,
            taken_at,
            status,
            notes,
            created_at
        ) VALUES (
            p_user_id,
            p_supplement_id,
            p_scheduled_time,
            NOW(),
            'taken',
            p_notes,
            NOW()
        ) RETURNING id INTO log_id;
        
        RETURN log_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE supplement_logs IS 'Tracks when supplements are taken, missed, or skipped';
COMMENT ON FUNCTION get_todays_logs(UUID) IS 'Gets all supplement logs for a user for the current day';
COMMENT ON FUNCTION mark_supplement_taken(UUID, INTEGER, TIME, TEXT) IS 'Marks a supplement as taken for today, creating or updating a log entry';