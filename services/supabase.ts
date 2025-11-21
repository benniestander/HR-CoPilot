
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

   -- 1. CLEANUP (Remove old functions/policies to prevent conflicts)
   DROP FUNCTION IF EXISTS public.is_admin();

   -- 2. CREATE SECURE FUNCTIONS
   
   -- Function to check if the current user is an admin
   -- SECURITY DEFINER = runs with the privileges of the creator (bypassing RLS on profiles)
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

   -- 3. GRANT PERMISSIONS
   -- Essential for the API to actually call these functions
   GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
   GRANT EXECUTE ON FUNCTION public.is_admin TO service_role;
   GRANT EXECUTE ON FUNCTION public.is_admin TO anon;

   -- 4. FIX PROFILES RLS
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   
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
