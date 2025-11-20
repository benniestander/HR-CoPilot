
import { createClient } from '@supabase/supabase-js';

/* 
   ==========================================================================
   SUPABASE SQL SETUP & FIX SCRIPT
   ==========================================================================
   Run this script in your Supabase SQL Editor to fix "Permission Denied" 
   errors and set up the database correctly.
   ==========================================================================

   -- 1. SECURITY DEFINER FUNCTIONS (The "Smooth" Fix)
   -- These functions bypass RLS to perform specific actions safely.

   -- Check if current user is admin
   create or replace function public.is_admin()
   returns boolean as $$
   begin
     return exists (
       select 1 from public.profiles
       where id = auth.uid() and is_admin = true
     );
   end;
   $$ language plpgsql security definer;

   -- Increment Coupon Uses (Safe for Users)
   create or replace function public.increment_coupon_uses(coupon_id uuid)
   returns void as $$
   begin
     update public.coupons
     set uses = uses + 1
     where id = coupon_id;
   end;
   $$ language plpgsql security definer;


   -- 2. TABLE SETUP & POLICIES

   -- PROFILES
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

   drop policy if exists "Public profiles are viewable by everyone" on profiles;
   drop policy if exists "Users can insert their own profile" on profiles;
   drop policy if exists "Users can update own profile" on profiles;
   drop policy if exists "Admins can update all profiles" on profiles;

   create policy "Public profiles are viewable by everyone" on profiles for select using (true);
   create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
   create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
   create policy "Admins can update all profiles" on profiles for update using (public.is_admin());


   -- COUPONS
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

   drop policy if exists "Coupons viewable by everyone" on coupons;
   drop policy if exists "Admins can manage coupons" on coupons;
   drop policy if exists "Admins can insert coupons" on coupons;
   drop policy if exists "Admins can update coupons" on coupons;
   drop policy if exists "Admins can delete coupons" on coupons;

   create policy "Coupons viewable by everyone" on coupons for select using (true);
   create policy "Admins can insert coupons" on coupons for insert with check (public.is_admin());
   create policy "Admins can update coupons" on coupons for update using (public.is_admin());
   create policy "Admins can delete coupons" on coupons for delete using (public.is_admin());


   -- ADMIN ACTION LOGS
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
   
   drop policy if exists "Admins access logs" on admin_action_logs;
   create policy "Admins access logs" on admin_action_logs for all using (public.is_admin());


   -- ADMIN NOTIFICATIONS
   create table if not exists public.admin_notifications (
     id uuid default gen_random_uuid() primary key,
     type text,
     message text,
     related_user_id text,
     is_read boolean default false,
     timestamp timestamptz default now()
   );
   alter table public.admin_notifications enable row level security;

   drop policy if exists "Admins manage notifications" on admin_notifications;
   drop policy if exists "Users create notifications" on admin_notifications;

   create policy "Admins manage notifications" on admin_notifications for all using (public.is_admin());
   create policy "Users create notifications" on admin_notifications for insert with check (auth.role() = 'authenticated');


   -- GENERATED DOCUMENTS
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

   drop policy if exists "Users view own documents" on generated_documents;
   drop policy if exists "Admins view all documents" on generated_documents;
   drop policy if exists "Users insert own documents" on generated_documents;
   drop policy if exists "Users update own documents" on generated_documents;

   create policy "Users view own documents" on generated_documents for select using (auth.uid() = user_id);
   create policy "Admins view all documents" on generated_documents for select using (public.is_admin());
   create policy "Users insert own documents" on generated_documents for insert with check (auth.uid() = user_id);
   create policy "Users update own documents" on generated_documents for update using (auth.uid() = user_id);


   -- TRANSACTIONS
   create table if not exists public.transactions (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references public.profiles(id) not null,
     description text,
     amount numeric,
     discount jsonb,
     date timestamptz default now()
   );
   alter table public.transactions enable row level security;

   drop policy if exists "Users view own transactions" on transactions;
   drop policy if exists "Admins view all transactions" on transactions;
   drop policy if exists "System insert transactions" on transactions;

   create policy "Users view own transactions" on transactions for select using (auth.uid() = user_id);
   create policy "Admins view all transactions" on transactions for select using (public.is_admin());
   create policy "System insert transactions" on transactions for insert with check (true);


   -- USER FILES
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
   
   drop policy if exists "Users manage own files" on user_files;
   drop policy if exists "Admins view all files" on user_files;

   create policy "Users manage own files" on user_files for all using (auth.uid() = user_id);
   create policy "Admins view all files" on user_files for select using (public.is_admin());

*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// Using the credentials provided.
const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
