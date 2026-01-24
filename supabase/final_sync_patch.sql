
-- HR COPILOT: SUPABASE SYNCHRONIZATION PATCH
-- Run this in the Supabase SQL Editor to ensure all recent features are fully backed by the database.

-- 1. PROFILE INFRASTRUCTURE
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_consultant BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS branding JSONB DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clients JSONB DEFAULT '[]'::jsonb;

-- 2. ADMIN HELPER FUNCTIONS
-- This function is used throughout the RLS policies to identify system administrators.
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND (is_admin = true OR email = 'bennie.stander@gmail.com')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. MARKETING & LEADS (SEO Support)
CREATE TABLE IF NOT EXISTS marketing_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    event_type TEXT NOT NULL, -- e.g., 'seo_landing_view', 'cta_click'
    metadata JSONB DEFAULT '{}'::jsonb,
    timestamp TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS assessment_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT,
    email TEXT UNIQUE,
    source TEXT, -- e.g., 'template_page', 'main_landing'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for SEO Leads
ALTER TABLE assessment_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can insert leads" ON assessment_leads;
CREATE POLICY "Anyone can insert leads" ON assessment_leads FOR INSERT WITH CHECK (true);

-- 4. INSTITUTIONAL BILLING SYSTEM (Verification)
-- These tables are likely created via migrations, but this ensures they exist and match the code.
CREATE TABLE IF NOT EXISTS billing_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount BIGINT NOT NULL, -- In Cents
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invoiced', 'cancelled')),
    related_invoice_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    amount_due BIGINT NOT NULL, -- In Cents
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date TIMESTAMPTZ NOT NULL,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount BIGINT NOT NULL,
    type TEXT CHECK (type IN ('platform_fee', 'client_fee', 'credit_adjustment')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for Billing
ALTER TABLE billing_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Consultants view own billing" ON billing_ledger;
CREATE POLICY "Consultants view own billing" ON billing_ledger FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Consultants view own invoices" ON invoices;
CREATE POLICY "Consultants view own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage all billing" ON billing_ledger;
CREATE POLICY "Admins manage all billing" ON billing_ledger TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins manage all invoices" ON invoices;
CREATE POLICY "Admins manage all invoices" ON invoices TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- 5. REFRESH LAW MODULES (V2 Content)
-- Ensures the Compliance Auditor is using the most relevant benchmarks.
INSERT INTO law_modules (title, category, content, version) VALUES 
(
    'BCEA Comprehensive - Basic Entitlements', 
    'Labour Law', 
    'BCEA (Act 75 of 1997) thresholds: 1. Max 45h/week. 2. Overtime 1.5x. 3. 21 days annual leave. 4. 4 months maternity. 5. S34 Deductions restricted.', 
    'v2'
),
(
    'POPIA - Processing Personal Information', 
    'Privacy', 
    'POPI Act conditions: 1. Accountability. 2. Processing Limitation. 3. Purpose Specification. 4. Data Quality. 5. Security Safeguards (S19).', 
    'v2'
)
ON CONFLICT (title) DO UPDATE SET content = EXCLUDED.content, version = EXCLUDED.version;
