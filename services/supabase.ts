
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

   -- 0. REPAIR SCHEMA (Fix column mismatches)
   DO $$
   BEGIN
     -- Rename 'type' to 'discount_type' if 'type' exists and 'discount_type' does not
     -- This fixes the "null value in column type" error
     IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'type') AND 
        NOT EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'discount_type') THEN
       ALTER TABLE coupons RENAME COLUMN "type" TO discount_type;
     END IF;

     -- If 'type' still exists (e.g., both existed), make it nullable to prevent insert errors
     IF EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'type') THEN
       ALTER TABLE coupons ALTER COLUMN "type" DROP NOT NULL;
     END IF;
   END $$;

   -- 1. Create Tables (IF NOT EXISTS)
   CREATE TABLE IF NOT EXISTS coupons (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     code text UNIQUE NOT NULL,
     discount_type text, -- Constraint added later
     discount_value int NOT NULL DEFAULT 0,
     max_uses int,
     used_count int DEFAULT 0,
     expiry_date timestamptz,
     active boolean DEFAULT true,
     applicable_to text, -- 'all', 'plan:pro', 'plan:payg'
     created_at timestamptz DEFAULT now()
   );
   
   CREATE TABLE IF NOT EXISTS policy_drafts (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES auth.users(id) NOT NULL,
     original_doc_id text,
     original_doc_title text,
     original_content text,
     update_result jsonb,
     selected_indices jsonb,
     manual_instructions text,
     updated_at timestamptz DEFAULT now(),
     created_at timestamptz DEFAULT now()
   );

   -- 2. ENSURE COLUMNS EXIST & FIX TYPES
   ALTER TABLE coupons ADD COLUMN IF NOT EXISTS code text;
   ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_type text;
   ALTER TABLE coupons ADD COLUMN IF NOT EXISTS discount_value int DEFAULT 0;
   ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_uses int;
   ALTER TABLE coupons ADD COLUMN IF NOT EXISTS used_count int DEFAULT 0;
   ALTER TABLE coupons ADD COLUMN IF NOT EXISTS expiry_date timestamptz;
   ALTER TABLE coupons ADD COLUMN IF NOT EXISTS active boolean DEFAULT true;
   ALTER TABLE coupons ADD COLUMN IF NOT EXISTS applicable_to text;

   -- Fix potential nulls in discount_type before applying constraint
   UPDATE coupons SET discount_type = 'fixed' WHERE discount_type IS NULL;
   ALTER TABLE coupons ALTER COLUMN discount_type SET NOT NULL;
   
   -- Re-apply check constraint
   ALTER TABLE coupons DROP CONSTRAINT IF EXISTS coupons_discount_type_check;
   ALTER TABLE coupons ADD CONSTRAINT coupons_discount_type_check CHECK (discount_type IN ('percentage', 'fixed'));

   -- 3. Enable RLS on All Tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_action_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
   ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
   ALTER TABLE policy_drafts ENABLE ROW LEVEL SECURITY;

   -- 4. Cleanup Old Policies
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

   DROP POLICY IF EXISTS "Admins can read coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can insert coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can update coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can delete coupons" ON coupons;
   DROP POLICY IF EXISTS "Anyone can read coupons" ON coupons;

   DROP POLICY IF EXISTS "Users can manage own drafts" ON policy_drafts;
   
   -- 5. Functions
   DROP FUNCTION IF EXISTS is_admin() CASCADE;
   DROP FUNCTION IF EXISTS increment_balance(uuid, int) CASCADE;
   DROP FUNCTION IF EXISTS increment_coupon_uses(text) CASCADE;

   -- Create Secure Admin Check Function
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

   -- Create Atomic Balance Update Function (Prevents Race Conditions)
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

   -- Create Coupon Increment Function
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

   -- Grant execute to authenticated users
   GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_balance TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_balance TO service_role;
   GRANT EXECUTE ON FUNCTION increment_coupon_uses TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_coupon_uses TO service_role;

   -- 6. Create Policies

   -- PROFILES
   CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
   CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin());

   -- GENERATED DOCUMENTS
   CREATE POLICY "Users can read own documents" ON generated_documents FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create documents" ON generated_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can update own documents" ON generated_documents FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all documents" ON generated_documents FOR SELECT USING (is_admin());

   -- TRANSACTIONS
   CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all transactions" ON transactions FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can create transactions" ON transactions FOR INSERT WITH CHECK (is_admin());
   CREATE POLICY "Users can create transactions (Legacy)" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id); 

   -- USER FILES
   CREATE POLICY "Users can read own files" ON user_files FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can upload own files" ON user_files FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can delete own files" ON user_files FOR DELETE USING (auth.uid() = user_id);
   CREATE POLICY "Admins can read all files" ON user_files FOR SELECT USING (is_admin());

   -- ADMIN LOGS & NOTIFICATIONS
   CREATE POLICY "Admins can read logs" ON admin_action_logs FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can create logs" ON admin_action_logs FOR INSERT WITH CHECK (is_admin());
   
   CREATE POLICY "Admins can read notifications" ON admin_notifications FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can update notifications" ON admin_notifications FOR UPDATE USING (is_admin());
   CREATE POLICY "Anyone can create notifications" ON admin_notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

   -- COUPONS
   CREATE POLICY "Admins can read coupons" ON coupons FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can insert coupons" ON coupons FOR INSERT WITH CHECK (is_admin());
   CREATE POLICY "Admins can update coupons" ON coupons FOR UPDATE USING (is_admin());
   CREATE POLICY "Admins can delete coupons" ON coupons FOR DELETE USING (is_admin());
   CREATE POLICY "Anyone can read coupons" ON coupons FOR SELECT USING (true);
   
   -- DRAFTS
   CREATE POLICY "Users can manage own drafts" ON policy_drafts FOR ALL USING (auth.uid() = user_id);
   
   -- Force Schema Cache Reload
   NOTIFY pgrst, 'reload config';

*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// Using Vite env var for secure configuration (fallback to placeholder if needed for local dev without env)
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
