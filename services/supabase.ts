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

   -- 0. REPAIR SCHEMA (CRITICAL FIXES - RENAMING TIMESTAMP TO CREATED_AT)
   
   DO $$
   BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_notifications' AND column_name = 'timestamp') THEN
          ALTER TABLE admin_notifications RENAME COLUMN "timestamp" TO created_at;
      END IF;
      
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admin_action_logs' AND column_name = 'timestamp') THEN
          ALTER TABLE admin_action_logs RENAME COLUMN "timestamp" TO created_at;
      END IF;
   END $$;

   -- 1. Create Tables (IF NOT EXISTS) with Correct Columns
   CREATE TABLE IF NOT EXISTS coupons (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     code text UNIQUE NOT NULL,
     discount_type text CHECK (discount_type IN ('percentage', 'fixed')),
     discount_value int NOT NULL DEFAULT 0,
     max_uses int,
     used_count int DEFAULT 0,
     expiry_date timestamptz,
     active boolean DEFAULT true,
     applicable_to text,
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

   CREATE TABLE IF NOT EXISTS admin_notifications (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at timestamptz DEFAULT now(),
     type text,
     message text,
     is_read boolean DEFAULT false,
     related_user_id uuid
   );

   CREATE TABLE IF NOT EXISTS admin_action_logs (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     created_at timestamptz DEFAULT now(),
     admin_email text,
     action text,
     target_user_id uuid,
     target_user_email text,
     details jsonb
   );

   -- 2. ENSURE OTHER TABLES EXIST
   CREATE TABLE IF NOT EXISTS generated_documents (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES auth.users(id) NOT NULL,
     title text,
     content text,
     created_at timestamptz DEFAULT now(),
     kind text, type text, output_format text,
     sources jsonb, version int, history jsonb,
     company_profile jsonb, question_answers jsonb
   );

   CREATE TABLE IF NOT EXISTS profiles (
     id uuid REFERENCES auth.users(id) PRIMARY KEY,
     email text, full_name text, created_at timestamptz DEFAULT now(),
     plan text DEFAULT 'payg', credit_balance int DEFAULT 0, is_admin boolean DEFAULT false,
     contact_number text, avatar_url text, company_name text, industry text, 
     address text, website text, summary text, company_size text
   );

   -- 3. Enable RLS on All Tables
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;
   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_action_logs ENABLE ROW LEVEL SECURITY;
   ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
   ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
   ALTER TABLE policy_drafts ENABLE ROW LEVEL SECURITY;
   ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
   ALTER TABLE document_prices ENABLE ROW LEVEL SECURITY;

   -- 4. RE-APPLY POLICIES
   DROP POLICY IF EXISTS "Admins can read notifications" ON admin_notifications;
   DROP POLICY IF EXISTS "Admins can update notifications" ON admin_notifications;
   DROP POLICY IF EXISTS "Anyone can create notifications" ON admin_notifications;

   CREATE POLICY "Admins can read notifications" ON admin_notifications FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can update notifications" ON admin_notifications FOR UPDATE USING (is_admin());
   CREATE POLICY "Anyone can create notifications" ON admin_notifications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

   DROP POLICY IF EXISTS "Admins can read logs" ON admin_action_logs;
   DROP POLICY IF EXISTS "Admins can create logs" ON admin_action_logs;
   CREATE POLICY "Admins can read logs" ON admin_action_logs FOR SELECT USING (is_admin());
   CREATE POLICY "Admins can create logs" ON admin_action_logs FOR INSERT WITH CHECK (is_admin());

   -- 5. Functions
   CREATE OR REPLACE FUNCTION is_admin()
   RETURNS boolean
   LANGUAGE sql
   SECURITY DEFINER 
   AS $$
     SELECT COALESCE(
       (SELECT is_admin FROM profiles WHERE id = auth.uid()), 
       false
     );
   $$;

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

   GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_balance TO authenticated;
   GRANT EXECUTE ON FUNCTION increment_balance TO service_role;

   -- Force Schema Cache Reload
   NOTIFY pgrst, 'reload config';
*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// Fallback credentials if environment variables are missing
const FALLBACK_URL = "https://cljhzqmssrgynlpgpogi.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

// Helper to safely get env vars checking multiple naming conventions
const getEnvVar = (keys: string[]): string | undefined => {
    for (const key of keys) {
        try {
            // @ts-ignore
            if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
                // @ts-ignore
                return import.meta.env[key];
            }
        } catch (e) {}
        try {
            // @ts-ignore
            if (typeof process !== 'undefined' && process.env && process.env[key]) return process.env[key];
        } catch (e) {}
    }
    return undefined;
}

const SUPABASE_URL = getEnvVar(['VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL']) || FALLBACK_URL;
const SUPABASE_ANON_KEY = getEnvVar(['VITE_SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_KEY']) || FALLBACK_KEY;

export const isSupabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.startsWith('http') && SUPABASE_URL !== "https://placeholder.supabase.co");

if (!isSupabaseConfigured) {
    console.warn("WARNING: Supabase Environment Variables are missing or invalid. The app is running in placeholder mode.");
}

export const supabase = createClient(
    (isSupabaseConfigured && SUPABASE_URL) ? SUPABASE_URL : "https://placeholder.supabase.co", 
    (isSupabaseConfigured && SUPABASE_ANON_KEY) ? SUPABASE_ANON_KEY : "placeholder-key"
);