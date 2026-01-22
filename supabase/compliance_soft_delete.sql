
-- COMPLIANCE: POPIA Right to be Forgotten & Soft-Delete Implementation

-- 1. Add deleted_at columns to core tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE generated_documents ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Update RLS Policies to respect soft-delete
-- Profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id AND deleted_at IS NULL);

-- Documents
DROP POLICY IF EXISTS "Users can view own documents" ON generated_documents;
CREATE POLICY "Users can view own documents"
ON generated_documents FOR SELECT
USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Consultants can view client documents" ON generated_documents;
CREATE POLICY "Consultants can view client documents"
ON generated_documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND is_consultant = true
        AND deleted_at IS NULL
        AND (
            clients @> jsonb_build_array(jsonb_build_object('id', user_id))
        )
    )
    AND deleted_at IS NULL
);

-- Transactions
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Consultants can view client transactions" ON transactions;
CREATE POLICY "Consultants can view client transactions"
ON transactions FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND is_consultant = true
        AND deleted_at IS NULL
        AND (
            clients @> jsonb_build_array(jsonb_build_object('id', user_id))
        )
    )
    AND deleted_at IS NULL
);

-- 3. Automatic PII Scrubbing Trigger
-- When a consultant is marked as deleted, mark all their client-specific associations as retracted
-- Note: We don't hard-delete other users (clients) if they are independent HR CoPilot users.
-- But if THEY delete their own profile, we should scrub their documents.

CREATE OR REPLACE FUNCTION scrub_user_data()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.deleted_at IS NOT NULL THEN
        -- Scrub documents
        UPDATE generated_documents SET deleted_at = NEW.deleted_at WHERE user_id = NEW.id;
        -- Anonymize transaction history (POPIA allows keeping financial records for audit, but we can redact PII)
        -- Keep amount and date for tax compliance, but nullify metadata if it contains sensitive info
        UPDATE transactions SET metadata = '{}'::jsonb, ip_address = NULL, user_agent = NULL WHERE user_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_scrub ON profiles;
CREATE TRIGGER on_user_scrub
    AFTER UPDATE OF deleted_at ON profiles
    FOR EACH ROW
    WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
    EXECUTE FUNCTION scrub_user_data();

-- 4. PII Scrubbing for Consultant Account Closure
-- If a consultant closes their account, we should retraction-period their clients if the clients were added purely for this consultant.
-- (Complexity omitted for now, assuming standard soft-delete trigger on associated documents is enough for first pass).
