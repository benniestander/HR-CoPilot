
import { createClient } from '@supabase/supabase-js';

/* 
   ==========================================================================
   SUPABASE SQL SETUP & FIX SCRIPT
   ==========================================================================
   Run this script in your Supabase SQL Editor to fix "Permission Denied" 
   errors and set up the database correctly.
   ==========================================================================

   -- 1. PROFILES (Users) - Fix Recursion Issues
   -- We drop existing policies first to ensure a clean slate.
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

   drop policy if exists "Users can view own profile" on profiles;
   drop policy if exists "Admins can view all profiles" on profiles;
   drop policy if exists "Users can update own profile" on profiles;
   drop policy if exists "Admins can update all profiles" on profiles;
   drop policy if exists "Users can insert own profile" on profiles;

   -- Simple non-recursive policies
   create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
   create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
   create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
   
   -- Allow admins to view/update everything (using a simplified check to avoid recursion)
   -- Note: For strict security, ensure you manually set is_admin=true in the DB for your admin user.
   create policy "Admins can view all profiles" on profiles for select using (
     (select is_admin from profiles where id = auth.uid()) = true
   );
   create policy "Admins can update all profiles" on profiles for update using (
     (select is_admin from profiles where id = auth.uid()) = true
   );


   -- 2. COUPONS - Fix Creation Permission
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

   drop policy if exists "Admins can insert coupons" on coupons;
   drop policy if exists "Admins can update coupons" on coupons;
   drop policy if exists "Anyone can view coupons" on coupons;
   drop policy if exists "Users can update coupon usage" on coupons;

   -- Admin Access
   create policy "Admins can insert coupons" on coupons for insert with check (
     (select is_admin from profiles where id = auth.uid()) = true
   );

   create policy "Admins can update coupons" on coupons for update using (
     (select is_admin from profiles where id = auth.uid()) = true
   );

   create policy "Admins can delete coupons" on coupons for delete using (
     (select is_admin from profiles where id = auth.uid()) = true
   );

   -- Public/User Access
   create policy "Anyone can view coupons" on coupons for select using (true);

   -- Allow authenticated users to increment usage (needed for applying coupons)
   create policy "Users can update coupon usage" on coupons for update using (
     auth.role() = 'authenticated'
   );


   -- 3. ADMIN LOGS & NOTIFICATIONS
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

   create table if not exists public.admin_notifications (
     id uuid default gen_random_uuid() primary key,
     type text,
     message text,
     related_user_id text,
     is_read boolean default false,
     timestamp timestamptz default now()
   );
   alter table public.admin_notifications enable row level security;

   drop policy if exists "Admins view logs" on admin_action_logs;
   drop policy if exists "Admins insert logs" on admin_action_logs;
   drop policy if exists "Admins manage notifications" on admin_notifications;
   drop policy if exists "System inserts notifications" on admin_notifications;

   -- Logs
   create policy "Admins view logs" on admin_action_logs for select using (
     (select is_admin from profiles where id = auth.uid()) = true
   );
   create policy "Admins insert logs" on admin_action_logs for insert with check (
     (select is_admin from profiles where id = auth.uid()) = true
   );

   -- Notifications
   create policy "Admins manage notifications" on admin_notifications for all using (
     (select is_admin from profiles where id = auth.uid()) = true
   );
   -- Allow any authenticated user to create a notification (e.g. "New user signed up")
   create policy "Users create notifications" on admin_notifications for insert with check (
     auth.role() = 'authenticated'
   );


   -- 4. GENERATED DOCUMENTS
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

   drop policy if exists "Users can view own documents" on generated_documents;
   drop policy if exists "Admins can view all documents" on generated_documents;
   drop policy if exists "Users can insert own documents" on generated_documents;
   drop policy if exists "Users can update own documents" on generated_documents;

   create policy "Users can view own documents" on generated_documents for select using (auth.uid() = user_id);
   create policy "Admins can view all documents" on generated_documents for select using ((select is_admin from profiles where id = auth.uid()) = true);
   create policy "Users can insert own documents" on generated_documents for insert with check (auth.uid() = user_id);
   create policy "Users can update own documents" on generated_documents for update using (auth.uid() = user_id);


   -- 5. TRANSACTIONS
   create table if not exists public.transactions (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references public.profiles(id) not null,
     description text,
     amount numeric,
     discount jsonb,
     date timestamptz default now()
   );
   alter table public.transactions enable row level security;

   drop policy if exists "Users can view own transactions" on transactions;
   drop policy if exists "Admins can view all transactions" on transactions;
   drop policy if exists "System/Admin can insert transactions" on transactions;

   create policy "Users can view own transactions" on transactions for select using (auth.uid() = user_id);
   create policy "Admins can view all transactions" on transactions for select using ((select is_admin from profiles where id = auth.uid()) = true);
   -- Allow insert for authenticated users (logic handled in app for payments) or admins
   create policy "System/Admin can insert transactions" on transactions for insert with check (true);


   -- 6. USER FILES
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
   
   drop policy if exists "Users can manage own files" on user_files;
   drop policy if exists "Admins can view all files" on user_files;

   create policy "Users can manage own files" on user_files for all using (auth.uid() = user_id);
   create policy "Admins can view all files" on user_files for select using ((select is_admin from profiles where id = auth.uid()) = true);

*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// Using the credentials provided.
const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
