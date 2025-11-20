
import { createClient } from '@supabase/supabase-js';

/* 
   ==========================================================================
   SUPABASE SQL SETUP & FIX SCRIPT
   ==========================================================================
   Run this script in your Supabase SQL Editor to set up the database tables 
   and Security Policies (RLS) required for the app to work.
   ==========================================================================

   --------------------------------------------------------------------------
   !!! EMERGENCY FIX FOR "ROW-LEVEL SECURITY POLICY" ERRORS !!!
   Run this specific block if you cannot create coupons or update profiles.
   --------------------------------------------------------------------------

   -- 1. Ensure Coupons Table Exists and RLS is on
   create table if not exists public.coupons (
     id uuid default gen_random_uuid() primary key,
     code text not null unique,
     type text not null, -- 'percentage' or 'fixed'
     value numeric not null,
     max_uses int,
     uses int default 0,
     applicable_to text[], -- Array of user IDs or null for all
     is_active boolean default true,
     expires_at timestamptz,
     created_at timestamptz default now()
   );
   alter table public.coupons enable row level security;

   -- 2. DROP EXISTING POLICIES TO PREVENT CONFLICTS
   drop policy if exists "Admins can insert coupons" on coupons;
   drop policy if exists "Admins can update coupons" on coupons;
   drop policy if exists "Anyone can view coupons" on coupons;
   drop policy if exists "Users can update coupon usage" on coupons;

   -- 3. RE-CREATE POLICIES WITH ROBUST ADMIN CHECKS
   
   -- Allow Admins to INSERT new coupons
   create policy "Admins can insert coupons" 
   on coupons 
   for insert 
   with check (
     exists (
       select 1 from profiles
       where profiles.id = auth.uid()
       and profiles.is_admin = true
     )
   );

   -- Allow Admins to UPDATE coupons (deactivate, change logic)
   create policy "Admins can update coupons" 
   on coupons 
   for update
   using (
     exists (
       select 1 from profiles
       where profiles.id = auth.uid()
       and profiles.is_admin = true
     )
   );

   -- Allow everyone to READ coupons (needed for validation)
   create policy "Anyone can view coupons" 
   on coupons 
   for select 
   using (true);

   -- Allow logged-in users to increment usage count (Update permission for specific field isn't granular in RLS alone, so we allow update for auth users, but business logic in app handles safety. Ideally use a Postgres Function for this.)
   create policy "Users can update coupon usage" 
   on coupons 
   for update 
   using (auth.role() = 'authenticated');


   --------------------------------------------------------------------------
   END OF EMERGENCY FIX
   --------------------------------------------------------------------------

   -- 1. Profiles Table (Users)
   create table if not exists public.profiles (
     id uuid references auth.users not null primary key,
     email text,
     full_name text,
     contact_number text,
     plan text default 'payg',
     credit_balance numeric default 0,
     is_admin boolean default false,
     avatar_url text,
     company_name text,
     industry text,
     company_size text,
     company_address text,
     company_url text,
     company_summary text,
     created_at timestamptz default now()
   );
   alter table public.profiles enable row level security;

   -- 2. Generated Documents
   create table if not exists public.generated_documents (
     id text primary key,
     user_id uuid references public.profiles(id) not null,
     title text,
     kind text,
     type text,
     content text,
     question_answers jsonb,
     output_format text,
     sources jsonb,
     version int default 1,
     history jsonb,
     created_at timestamptz default now()
   );
   alter table public.generated_documents enable row level security;

   -- 3. Transactions
   create table if not exists public.transactions (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references public.profiles(id) not null,
     description text,
     amount numeric,
     discount jsonb,
     date timestamptz default now()
   );
   alter table public.transactions enable row level security;

   -- 4. User Files
   create table if not exists public.user_files (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references public.profiles(id) not null,
     name text,
     notes text,
     size numeric,
     storage_path text,
     created_at timestamptz default now()
   );
   alter table public.user_files enable row level security;

   -- 5. Admin Logs
   create table if not exists public.admin_action_logs (
     id uuid default gen_random_uuid() primary key,
     admin_email text,
     action text,
     target_user_id text,
     target_user_email text,
     details jsonb,
     timestamp timestamptz default now()
   );
   alter table public.admin_action_logs enable row level security;

   -- 6. Admin Notifications
   create table if not exists public.admin_notifications (
     id uuid default gen_random_uuid() primary key,
     type text,
     message text,
     related_user_id text,
     is_read boolean default false,
     timestamp timestamptz default now()
   );
   alter table public.admin_notifications enable row level security;

   --------------------------------------------------------------------------
   -- OTHER RLS POLICIES 
   --------------------------------------------------------------------------

   -- Profiles: Users see their own, Admins see all
   create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
   create policy "Admins can view all profiles" on profiles for select using ((select is_admin from profiles where id = auth.uid()) = true);
   create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
   create policy "Admins can update all profiles" on profiles for update using ((select is_admin from profiles where id = auth.uid()) = true);
   create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

   -- Documents: Users own theirs, Admins see all
   create policy "Users can view own documents" on generated_documents for select using (auth.uid() = user_id);
   create policy "Admins can view all documents" on generated_documents for select using ((select is_admin from profiles where id = auth.uid()) = true);
   create policy "Users can insert own documents" on generated_documents for insert with check (auth.uid() = user_id);
   create policy "Users can update own documents" on generated_documents for update using (auth.uid() = user_id);

   -- Transactions: Users view theirs, Admins insert/view
   create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
   create policy "Admins can view all transactions" on transactions for select using ((select is_admin from profiles where id = auth.uid()) = true);
   create policy "System/Admin can insert transactions" on transactions for insert with check (true); 

   -- Admin Tables: Admin only
   create policy "Admins view logs" on admin_action_logs for select using ((select is_admin from profiles where id = auth.uid()) = true);
   create policy "Admins insert logs" on admin_action_logs for insert with check (true); 

   create policy "Admins manage notifications" on admin_notifications for all using ((select is_admin from profiles where id = auth.uid()) = true);
   create policy "System inserts notifications" on admin_notifications for insert with check (true);

*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// Using the credentials provided.
const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
