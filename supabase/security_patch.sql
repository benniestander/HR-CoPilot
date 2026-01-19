
-- Enforce RLS on Critical Tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- 1. Transactions: View Own History
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
USING (auth.uid() = user_id);

-- 2. Documents: Insert / View Own
DROP POLICY IF EXISTS "Users can view own documents" ON generated_documents;
CREATE POLICY "Users can view own documents"
ON generated_documents FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own documents" ON generated_documents;
CREATE POLICY "Users can insert own documents"
ON generated_documents FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Profiles: Secure PII
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
