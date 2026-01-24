-- 1. EXPAND PLAN PERMISSIONS
-- This ensures 'agency' is a valid plan type in your profiles table.
-- If you use a CHECK constraint:
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_plan_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_plan_check 
CHECK (plan IN ('payg', 'pro', 'consultant', 'agency'));

-- 2. ENSURE AUDIT READINESS
-- Creating an index on the 'plan' column makes institutional reporting 
-- much faster as you scale to hundreds of agencies.
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON profiles(plan);

-- 3. BULK IMPORT OPTIMIZATION
-- Ensure the clients JSONB column is optimized for the new Bulk Ingestion feature.
-- GIN indexing allows for fast searching within the client list.
CREATE INDEX IF NOT EXISTS idx_profiles_clients_gin ON profiles USING GIN (clients);
