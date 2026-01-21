-- Clean start for Audit System
DROP TABLE IF EXISTS law_modules CASCADE;
DROP TABLE IF EXISTS auditor_reports CASCADE;

-- Law Modules Table (Knowledge Base for RAG)
CREATE TABLE law_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    version TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Reports Table (Results)
CREATE TABLE auditor_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    document_name TEXT NOT NULL,
    audit_result JSONB NOT NULL,
    overall_score INTEGER,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE law_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Law Modules" ON law_modules FOR SELECT TO authenticated USING (true);

ALTER TABLE auditor_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own audits" ON auditor_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own audits" ON auditor_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- SEED DATA for South African Law Modules (Expanded for higher audit accuracy)
INSERT INTO law_modules (title, category, content, version) VALUES 
(
    'BCEA Comprehensive - Basic Entitlements', 
    'Labour Law', 
    'BCEA (Act 75 of 1997) thresholds: 
    1. WORKING HOURS: Max 45 normal hours. Overtime max 10 hours/week, paid at 1.5x. Sundays at 2x.
    2. LEAVE: Annual leave is 21 consecutive days (15 working days for 5-day week). Sick leave is 30/36 days per cycle. 
    3. MATERNITY: Minimum 4 consecutive months. Does not have to be paid by employer (UIF covers), but policy must guarantee job security (S25).
    4. FAMILY RESPONSIBILITY: 3 days per year (for child birth/illness or death of immediate family).
    5. DEDUCTIONS: S34 prohibits deductions unless for lost/damaged items with fair procedure AND written consent, or law/court order.', 
    'v2'
),
(
    'LRA - Procedural and Substantive Fairness', 
    'Labour Law', 
    'LRA (Act 66 of 1995) Code of Good Practice (Schedule 8):
    1. DISMISSAL: Must have a reason (Conduct, Capacity, Operational Req). 
    2. PROCEDURE: Employee must be notified of allegations, have time to prepare, and the right to a representative. 
    3. CONSISTENCY: Employers must apply rules consistently across all staff.
    4. INCAPACITY: Requires an inquiry to determine if work can be adapted before dismissal.', 
    'v2'
),
(
    'POPIA - Processing Personal Information', 
    'Privacy', 
    'POPI Act of 2013 Conditions:
    1. ACCOUNTABILITY: Responsible party ensures compliance.
    2. PROCESSING LIMITATION: Lawful, minimal, and with consent.
    3. SPECIFICATION: Purpose must be defined.
    4. DATA QUALITY: Info must be accurate/updated.
    5. SECURITY: S19 requires "appropriate, reasonable technical and organisational measures" to prevent loss/unauthorized access.', 
    'v2'
)
ON CONFLICT (title) DO UPDATE SET content = EXCLUDED.content, version = EXCLUDED.version;