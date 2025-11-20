
import { createClient } from '@supabase/supabase-js';

/* 
   ==========================================================================
   SUPABASE MASTER FIX SCRIPT
   ==========================================================================
   Copy and Run this ENTIRE block in your Supabase SQL Editor to fix
   all permission denied errors for Coupons, Admins, and Transactions.
   ==========================================================================

   -- 1. SECURE FUNCTIONS (Bypass RLS safely)
   
   -- Function to check if user is admin (Prevents infinite recursion in policies)
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

   -- Function for Users to redeem coupons (Users can't update the coupon table directly)
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


   -- 2. COUPONS TABLE & POLICIES
   
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

   -- Drop old policies to ensure clean slate
   DROP POLICY IF EXISTS "Admins can insert coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can update coupons" ON coupons;
   DROP POLICY IF EXISTS "Admins can delete coupons" ON coupons;
   DROP POLICY IF EXISTS "Everyone can view coupons" ON coupons;

   -- Create correct policies using is_admin() function
   CREATE POLICY "Admins can insert coupons" ON coupons FOR INSERT WITH CHECK (is_admin());
   CREATE POLICY "Admins can update coupons" ON coupons FOR UPDATE USING (is_admin());
   CREATE POLICY "Admins can delete coupons" ON coupons FOR DELETE USING (is_admin());
   CREATE POLICY "Everyone can view coupons" ON coupons FOR SELECT USING (true);


   -- 3. TRANSACTIONS TABLE & POLICIES

   CREATE TABLE IF NOT EXISTS public.transactions (
     id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id uuid REFERENCES auth.users NOT NULL,
     description text,
     amount numeric,
     discount jsonb,
     date timestamptz DEFAULT now()
   );

   ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

   DROP POLICY IF EXISTS "Users can insert own transactions" ON transactions;
   DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;
   DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;

   CREATE POLICY "Users can insert own transactions" ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Admins can view all transactions" ON transactions FOR SELECT USING (is_admin());


   -- 4. PROFILES TABLE & POLICIES
   
   -- Ensure Users can update their own profile (needed for credit balance updates)
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
   DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
   CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
   
   DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
   CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE USING (is_admin());

*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// Using the credentials provided.
const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
