-- Policy Auditor Schema

-- 1. Table for storing the actual audit results
CREATE TABLE IF NOT EXISTS auditor_reports (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    document_name text NOT NULL,
    audit_result jsonb NOT NULL, -- Detailed red flags, suggestions, and corrections
    overall_score float, -- Optional health score 0-100
    status text DEFAULT 'completed',
    created_at timestamptz DEFAULT now()
);

-- 2. Table for storing South African Law Modules for RAG
CREATE TABLE IF NOT EXISTS law_modules (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text UNIQUE NOT NULL, -- e.g. 'Basic Conditions of Employment Act', 'Labor Relations Act'
    content text NOT NULL, -- The specific sections or summaries
    category text, -- e.g. 'BCEA', 'LRA', 'POPIA'
    version text,
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auditor_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE law_modules ENABLE ROW LEVEL SECURITY;

-- Policies for auditor_reports
DROP POLICY IF EXISTS "Users can view own audit reports" ON auditor_reports;
CREATE POLICY "Users can view own audit reports" 
ON auditor_reports FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own audit reports" ON auditor_reports;
CREATE POLICY "Users can create own audit reports" 
ON auditor_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policies for law_modules (Read-only for all authenticated users)
DROP POLICY IF EXISTS "Anyone can read law modules" ON law_modules;
CREATE POLICY "Anyone can read law modules" 
ON law_modules FOR SELECT 
USING (auth.role() = 'authenticated');

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_auditor_reports_user_id ON auditor_reports(user_id);

-- SEED DATA for South African Law Modules
INSERT INTO law_modules (title, category, content, version) VALUES 
('Basic Conditions of Employment Act (BCEA) Summary', 'BCEA', 'The South Africa Basic Conditions of Employment Act (BCEA), Act 75 of 1997... [Summary of working hours, leave, remuneration, and termination notice periods]', '2024.1'),
('Labour Relations Act (LRA) Summary', 'LRA', 'The South African Labour Relations Act (LRA) 66 of 1995... [Summary of freedom of association, collective bargaining, unfair dismissals, and dispute resolution]', '2024.1'),
('Protection of Personal Information Act (POPIA) Summary', 'POPIA', 'The POPIA Act of 2013... [Summary of data processing principles, consent requirements, and operator responsibilities]', '2024.1')
ON CONFLICT (title) DO NOTHING;

