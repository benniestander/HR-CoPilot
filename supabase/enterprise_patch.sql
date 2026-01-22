
-- 0. SCHEMA PREPARATION (Ensuring all consultant columns exist)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_consultant BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consultant_platform_fee_paid_until TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS consultant_client_limit INTEGER DEFAULT 10;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_seen_consultant_welcome BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clients JSONB DEFAULT '[]'::jsonb;

-- 1. MAKE LOGS IMMUTABLE (Append-only)
-- Prevent any UPDATE or DELETE on transactions and admin_action_logs
DROP POLICY IF EXISTS "No updates on transactions" ON transactions;
CREATE POLICY "No updates on transactions" ON transactions FOR UPDATE USING (false);

DROP POLICY IF EXISTS "No deletes on transactions" ON transactions;
CREATE POLICY "No deletes on transactions" ON transactions FOR DELETE USING (false);

DROP POLICY IF EXISTS "No updates on logs" ON admin_action_logs;
CREATE POLICY "No updates on logs" ON admin_action_logs FOR UPDATE USING (false);

DROP POLICY IF EXISTS "No deletes on logs" ON admin_action_logs;
CREATE POLICY "No deletes on logs" ON admin_action_logs FOR DELETE USING (false);


-- 2. ENHANCE LOGS STORAGE
-- Add columns for extra context if they don't exist
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

ALTER TABLE admin_action_logs
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT;


-- 3. CONSULTANT CROSS-TENANT ACCESS POLICIES
-- Allow consultants to VIEW their clients' documents
DROP POLICY IF EXISTS "Consultants can view client documents" ON generated_documents;
CREATE POLICY "Consultants can view client documents"
ON generated_documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND is_consultant = true
        AND (
            -- Check if the document's user_id is in the consultant's clients list
            clients @> jsonb_build_array(jsonb_build_object('id', user_id))
        )
    )
);

-- Allow consultants to INSERT documents for their clients
DROP POLICY IF EXISTS "Consultants can insert client documents" ON generated_documents;
CREATE POLICY "Consultants can insert client documents"
ON generated_documents FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND is_consultant = true
        AND (
            clients @> jsonb_build_array(jsonb_build_object('id', user_id))
        )
    )
);

-- Allow consultants to VIEW their clients' transactions
DROP POLICY IF EXISTS "Consultants can view client transactions" ON transactions;
CREATE POLICY "Consultants can view client transactions"
ON transactions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND is_consultant = true
        AND (
            clients @> jsonb_build_array(jsonb_build_object('id', user_id))
        )
    )
);

-- 4. ENSURE ADMINS CAN STILL DO EVERYTHING
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles;
CREATE POLICY "Admins can do everything on profiles" ON profiles TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can view all documents" ON generated_documents;
CREATE POLICY "Admins can view all documents" ON generated_documents FOR SELECT USING (is_admin());

DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (is_admin());
