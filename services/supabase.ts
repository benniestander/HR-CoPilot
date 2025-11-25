
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
   DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
   DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
   DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
   
   DROP POLICY IF EXISTS "Users can read own documents" ON generated_documents;
   DROP POLICY IF EXISTS "Users can create documents" ON generated_documents;
   DROP POLICY IF EXISTS "Users can update own documents" ON generated_documents;
   DROP POLICY IF EXISTS "Admins can read all documents" ON generated_documents;
   
   DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
   DROP POLICY IF EXISTS "Admins can read all transactions" ON transactions;
   DROP POLICY IF EXISTS "Admins can create transactions" ON transactions;
   DROP POLICY IF EXISTS "Users can create transactions (Legacy)" ON transactions;
   
   DROP POLICY IF EXISTS "Users can read own files" ON user_files;
   DROP POLICY IF EXISTS "Users can upload own files" ON user_files;
   DROP POLICY IF EXISTS "Users can delete own files" ON user_files;
   DROP POLICY IF EXISTS "Admins can read all files" ON user_files;
   
   DROP POLICY IF EXISTS "Admins can read logs" ON admin_action_logs;
   DROP POLICY IF EXISTS "Admins can create logs" ON admin_action_logs;
   
   DROP POLICY IF EXISTS "Admins can read notifications" ON admin_notifications;
   DROP POLICY IF EXISTS "Admins can update notifications" ON admin_notifications;
   DROP POLICY IF EXISTS "Anyone can create notifications" ON admin_notifications;

   -- Coupon Policies
   DROP POLICY IF EXISTS "Admins can read coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can insert coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can update coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can delete coupons" ON coupons;
   DROP POLICY IF EXISTS "Anyone can read coupons" ON coupons;
   
   DROP FUNCTION IF EXISTS is_admin() CASCADE;
   DROP FUNCTION IF EXISTS increment_balance(uuid, int) CASCADE;
   DROP FUNCTION IF EXISTS increment_coupon_uses(text) CASCADE;

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

   -- 4. Create Coupon Increment Function (Allows usage tracking without write access)
   CREATE OR REPLACE FUNCTION increment_coupon_uses(coupon_code text)
   RETURNS void
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     UPDATE coupons
     SET used_count = used_count + 1
     WHERE code = coupon_code;
   END;
   $$;

   -- Grant execute to authenticated users so the API can call it
   GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_balance TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_balance TO service_role;
   GRANT EXECUTE ON FUNCTION increment_coupon_uses TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_coupon_uses TO service_role;

   -- 5. Enable RLS on All Tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_action_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
   
   -- Create Coupons Table if not exists
   CREATE TABLE IF NOT EXISTS coupons (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     code text UNIQUE NOT NULL,
     discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
     discount_value int NOT NULL,
     max_uses int,
     used_count int DEFAULT 0,
     expiry_date timestamptz,
     active boolean DEFAULT true,
     applicable_to text, -- 'all', 'plan:pro', 'plan:payg'
     created_at timestamptz DEFAULT now()
   );
   ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

   -- 6. PROFILES Policies
   CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
   CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin());

   -- 7. GENERATED DOCUMENTS Policies
   CREATE POLICY "Users can read own documents" ON generated_documents FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create documents" ON generated_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own documents" ON generated_documents FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all documents" ON generated_documents FOR SELECT USING (is_admin());

   -- 8. TRANSACTIONS Policies
   CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all transactions" ON transactions FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can create transactions" ON transactions FOR INSERT WITH CHECK (is_admin());
   CREATE POLICY "Users can create transactions (Legacy)" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id); 

   -- 9. USER FILES Policies
   CREATE POLICY "Users can read own files" ON user_files FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can upload own files" ON user_files FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own files" ON user_files FOR DELETE USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all files" ON user_files FOR SELECT USING (is_admin());

   -- 10. ADMIN LOGS & NOTIFICATIONS Policies
   CREATE POLICY "Admins can read logs" ON admin_action_logs FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can create logs" ON admin_action_logs FOR INSERT WITH CHECK (is_admin());
   
   CREATE POLICY "Admins can read notifications" ON admin_notifications FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can update notifications" ON admin_notifications FOR UPDATE USING (is_admin());
   CREATE POLICY "Anyone can create notifications" ON admin_notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

   -- 11. COUPON Policies
   -- Admins can do everything
   CREATE POLICY "Admins can read coupons" ON coupons FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can insert coupons" ON coupons FOR INSERT WITH CHECK (is_admin());
   CREATE POLICY "Admins can update coupons" ON coupons FOR UPDATE USING (is_admin());
   CREATE POLICY "Admins can delete coupons" ON coupons FOR DELETE USING (is_admin());
   -- Users can only Read (to validate)
   CREATE POLICY "Anyone can read coupons" ON coupons FOR SELECT USING (true);

*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);