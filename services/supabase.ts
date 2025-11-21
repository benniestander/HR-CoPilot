
import { createClient } from '@supabase/supabase-js';

/* 
   ==========================================================================
   SUPABASE MASTER FIX SCRIPT (RUN THIS IN SQL EDITOR)
   ==========================================================================
   
   1. Copy this entire block.
   2. Paste into Supabase SQL Editor.
   3. Run it.
   4. AFTER RUNNING: Execute this separate command to make yourself admin:
      UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';

   ==========================================================================

   -- 1. CLEANUP (Start Fresh)
   DROP POLICY IF EXISTS "Admins can insert coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can update coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can delete coupons" ON coupons;
   DROP POLICY IF EXISTS "Everyone can view coupons" ON coupons;
   
   DROP FUNCTION IF EXISTS public.is_admin();
   DROP FUNCTION IF EXISTS public.increment_coupon_uses(uuid);

   -- 2. SECURE FUNCTIONS
   
   -- Check Admin Status (Bypass RLS)
   CREATE OR REPLACE FUNCTION public.is_admin() 
   RETURNS boolean 
   LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = public 
   AS $$ 
   BEGIN 
     RETURN EXISTS (
       SELECT 1 FROM profiles 
       WHERE id = auth.uid() AND is_admin = true
     ); 
   END; 
   $$;

   -- Increment Coupon Uses (Bypass RLS for Users)
   CREATE OR REPLACE FUNCTION public.increment_coupon_uses(coupon_id uuid) 
   RETURNS void 
   LANGUAGE plpgsql 
   SECURITY DEFINER 
   SET search_path = public 
   AS $$ 
   BEGIN 
     UPDATE coupons 
     SET uses = uses + 1 
     WHERE id = coupon_id; 
   END; 
   $$;

   -- 3. PERMISSIONS (Crucial for "Permission Denied" errors)
   GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
   GRANT EXECUTE ON FUNCTION public.is_admin TO service_role;
   GRANT EXECUTE ON FUNCTION public.increment_coupon_uses TO authenticated;
   GRANT EXECUTE ON FUNCTION public.increment_coupon_uses TO service_role;

   -- 4. COUPONS TABLE & POLICIES
   CREATE TABLE IF NOT EXISTS public.coupons (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     code text NOT NULL UNIQUE,
     type text NOT NULL,
     value numeric NOT NULL,
     max_uses int,
     uses int DEFAULT 0,
     applicable_to text[],
     is_active boolean DEFAULT true,
     expires_at timestamptz,
     created_at timestamptz DEFAULT now()
   );
   
   ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "Admins can insert coupons" ON coupons FOR INSERT WITH CHECK (is_admin());
   CREATE POLICY "Admins can update coupons" ON coupons FOR UPDATE USING (is_admin());
   CREATE POLICY "Admins can delete coupons" ON coupons FOR DELETE USING (is_admin());
   CREATE POLICY "Everyone can view coupons" ON coupons FOR SELECT USING (true);

   -- 5. PROFILES TABLE FIXES
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   -- Allow admins to view/edit all profiles (for dashboard)
   DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
   CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (is_admin() OR auth.uid() = id);
   
   DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
   CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin() OR auth.uid() = id);

*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
