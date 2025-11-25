
import { createClient } from '@supabase/supabase-js';

/* 
   ==========================================================================
   SUPABASE MASTER FIX SCRIPT (RUN THIS IN SQL EDITOR)
   ==========================================================================
   
   1. Copy this entire block (between the start/end comments).
   2. Paste into Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql).
   3. Run it.
   4. IMPORTANT: After running, execute this command to make yourself admin:
      UPDATE profiles SET is_admin = true WHERE email = 'YOUR_EMAIL_ADDRESS_HERE';

   ==========================================================================

   -- 1. Reset & Cleanup (Drop old policies to prevent conflicts)
   DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
   DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
   DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
   DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
   DROP POLICY IF EXISTS "Users can read own documents" ON generated_documents;
   DROP POLICY IF EXISTS "Users can create documents" ON generated_documents;
   DROP POLICY IF EXISTS "Users can update own documents" ON generated_documents;
   DROP POLICY IF EXISTS "Admins can read all documents" ON generated_documents;
   DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
   DROP POLICY IF EXISTS "Admins can read all transactions" ON transactions;
   DROP POLICY IF EXISTS "Admins can create transactions" ON transactions;
   DROP POLICY IF EXISTS "Users can read own files" ON user_files;
   DROP POLICY IF EXISTS "Users can upload own files" ON user_files;
   DROP POLICY IF EXISTS "Users can delete own files" ON user_files;
   DROP POLICY IF EXISTS "Admins can read all files" ON user_files;
   DROP POLICY IF EXISTS "Admins can read logs" ON admin_action_logs;
   DROP POLICY IF EXISTS "Admins can create logs" ON admin_action_logs;
   DROP POLICY IF EXISTS "Admins can read notifications" ON admin_notifications;
   DROP POLICY IF EXISTS "Admins can update notifications" ON admin_notifications;
   DROP POLICY IF EXISTS "Admins can create notifications" ON admin_notifications; -- Fix for user signup
   DROP FUNCTION IF EXISTS is_admin() CASCADE;
   DROP FUNCTION IF EXISTS increment_balance(uuid, int) CASCADE;

   -- 2. Create Secure Admin Check Function
   CREATE OR REPLACE FUNCTION is_admin()
   RETURNS boolean
   LANGUAGE sql
   SECURITY DEFINER -- Runs with superuser privileges to avoid RLS recursion
   AS $$
     SELECT COALESCE(
       (SELECT is_admin FROM profiles WHERE id = auth.uid()), 
       false
     );
   $$;

   -- 3. Create Atomic Balance Update Function (Prevents Race Conditions)
   CREATE OR REPLACE FUNCTION increment_balance(user_id uuid, amount int)
   RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     UPDATE profiles
     SET credit_balance = COALESCE(credit_balance, 0) + amount
     WHERE id = user_id;
   END;
   $$;

   -- Grant execute to authenticated users so the API can call it
   GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_balance TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_balance TO service_role;

   -- 4. Enable RLS on All Tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_action_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

   -- 5. PROFILES Policies
   CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
   CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin());

   -- 6. GENERATED DOCUMENTS Policies
   CREATE POLICY "Users can read own documents" ON generated_documents FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create documents" ON generated_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own documents" ON generated_documents FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all documents" ON generated_documents FOR SELECT USING (is_admin());

   -- 7. TRANSACTIONS Policies
   CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all transactions" ON transactions FOR SELECT USING (is_admin());
   -- Admins need to insert transactions (e.g. Adjust Credit)
   CREATE POLICY "Admins can create transactions" ON transactions FOR INSERT WITH CHECK (is_admin());
   -- Allow users to insert transactions? Generally NO, backend/edge function does it. 
   -- But for 'Service Role' (Edge Function), it bypasses RLS. 
   -- The frontend currently uses `addTransactionToUser` which runs as the user. 
   -- Ideally, ALL financial writes should be RLS blocked for users and done via RPC or Edge Function.
   -- For now, to support the legacy flow if any:
   CREATE POLICY "Users can create transactions (Legacy)" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id); 

   -- 8. USER FILES Policies
   CREATE POLICY "Users can read own files" ON user_files FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can upload own files" ON user_files FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own files" ON user_files FOR DELETE USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all files" ON user_files FOR SELECT USING (is_admin());

   -- 9. ADMIN LOGS & NOTIFICATIONS Policies
   CREATE POLICY "Admins can read logs" ON admin_action_logs FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can create logs" ON admin_action_logs FOR INSERT WITH CHECK (is_admin());
   
   CREATE POLICY "Admins can read notifications" ON admin_notifications FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can update notifications" ON admin_notifications FOR UPDATE USING (is_admin());
   -- Allow ANY authenticated user to create a notification (e.g. "New User Signed Up")
   CREATE POLICY "Anyone can create notifications" ON admin_notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
