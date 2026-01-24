-- COMPLIANCE ENGINE PATCH
-- Version: 3.2.0
-- Date: 2026-01-24
-- Purpose: Add versioning and fingerprinting to generated documents for dynamic compliance monitoring.

-- 1. Add versioning columns to track compliance
ALTER TABLE generated_documents 
ADD COLUMN IF NOT EXISTS brain_version TEXT;

ALTER TABLE generated_documents 
ADD COLUMN IF NOT EXISTS prompt_fingerprint TEXT;

-- 2. Add metadata columns for consultant tracking (future proofing)
ALTER TABLE generated_documents
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 3. Add documentation/comments
COMMENT ON COLUMN generated_documents.brain_version IS 'The version of LegislativeConstants.ts used during generation';
COMMENT ON COLUMN generated_documents.prompt_fingerprint IS 'A unique hash of the prompt instructions to detect logic drift';

ALTER TABLE auditor_reports 
ADD COLUMN IF NOT EXISTS content_hash TEXT;

COMMENT ON COLUMN auditor_reports.content_hash IS 'SHA-256 hash of the audited document content to prevent redundant AI calls and wording drift';

ALTER TABLE generated_documents 
ALTER COLUMN version TYPE TEXT USING version::TEXT;

COMMENT ON COLUMN generated_documents.version IS 'Semantic versioning: Major.Minor (e.g. 1.1, 2.0)';

-- 4. Speed up Cooldown & Duplicate checks
CREATE INDEX IF NOT EXISTS idx_auditor_reports_user_doc 
ON auditor_reports (user_id, document_name);

CREATE INDEX IF NOT EXISTS idx_auditor_reports_hash 
ON auditor_reports (content_hash);

-- 5. Reload PostgREST schema cache
NOTIFY pgrst, 'reload config';
