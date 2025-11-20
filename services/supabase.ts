
import { createClient } from '@supabase/supabase-js';

// ------------------------------------------------------------------
// IMPORTANT: SETUP YOUR DATABASE
// ------------------------------------------------------------------
// Run the following SQL in your Supabase SQL Editor to set up the tables:
/*
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  contact_number text,
  company_name text,
  industry text,
  company_size text,
  company_address text,
  company_url text,
  company_summary text,
  plan text default 'payg',
  credit_balance bigint default 0,
  is_admin boolean default false,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
-- Enable RLS
alter table public.profiles enable row level security;
-- Policies
create policy "Public profiles are viewable by everyone." on profiles for select using ( true );
create policy "Users can insert their own profile." on profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on profiles for update using ( auth.uid() = id );

-- GENERATED DOCUMENTS TABLE
create table public.generated_documents (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  kind text not null,
  type text not null,
  content text,
  question_answers jsonb,
  output_format text,
  sources jsonb,
  version int default 1,
  history jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);
alter table public.generated_documents enable row level security;
create policy "Users can CRUD own docs" on generated_documents for all using (auth.uid() = user_id);

-- TRANSACTIONS TABLE
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  amount bigint not null, -- in cents
  description text not null,
  date timestamptz default now(),
  discount jsonb
);
alter table public.transactions enable row level security;
create policy "Users can read own transactions" on transactions for select using (auth.uid() = user_id);

-- USER FILES TABLE
create table public.user_files (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  notes text,
  size bigint,
  storage_path text,
  created_at timestamptz default now()
);
alter table public.user_files enable row level security;
create policy "Users can CRUD own files" on user_files for all using (auth.uid() = user_id);

-- ADMIN ACTION LOGS
create table public.admin_action_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_email text,
  action text,
  target_user_id uuid,
  target_user_email text,
  details jsonb,
  timestamp timestamptz default now()
);
alter table public.admin_action_logs enable row level security;
create policy "Admins can view logs" on admin_action_logs for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- ADMIN NOTIFICATIONS
create table public.admin_notifications (
  id uuid default uuid_generate_v4() primary key,
  type text,
  message text,
  is_read boolean default false,
  related_user_id uuid,
  timestamp timestamptz default now()
);
alter table public.admin_notifications enable row level security;
create policy "Admins can view notifications" on admin_notifications for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Users can insert notifications" on admin_notifications for insert with check (true);

-- COUPONS
create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  type text not null, -- 'percentage' or 'fixed'
  value int not null,
  uses int default 0,
  max_uses int,
  applicable_to jsonb, -- array of user ids or 'all'
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz default now()
);
alter table public.coupons enable row level security;
create policy "Anyone can read coupons" on coupons for select using (true);

-- STORAGE BUCKETS (Create these in Storage section)
-- 'user-files': Public or Private (Authenticated)
-- 'avatars': Public
*/

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------

// REPLACE THESE WITH YOUR ACTUAL PROJECT CREDENTIALS FROM SUPABASE SETTINGS
// Using a valid dummy URL to prevent initialization crash if env vars aren't set
const SUPABASE_URL = "https://cljhzqmssrgynlpgpogi.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk";

if (SUPABASE_URL === "https://cljhzqmssrgynlpgpogi.supabase.co") {
    console.warn("⚠️ Supabase credentials not set. The app will load but database features will not work. Please update services/supabase.ts with your project URL and Anon Key.");
}

export const supabase = createClient(https://cljhzqmssrgynlpgpogi.supabase.co, eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsamh6cW1zc3JneW5scGdwb2dpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mzg4NTksImV4cCI6MjA3OTIxNDg1OX0.Qj91RwqFJhvnFpT9g4b69pVoVMPb1z4pLX5a9nJmzTk);
