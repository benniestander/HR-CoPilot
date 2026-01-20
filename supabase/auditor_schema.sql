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

-- SEED DATA for South African Law Modules
INSERT INTO law_modules (title, category, content, version) VALUES 
(
    'Basic Conditions of Employment Act (BCEA) - Key Provisions', 
    'Labor Law', 
    'BCEA Act 75 of 1997 regulates: 1. Working Hours (Max 45 hrs/week). 2. Annual Leave (21 days). 3. Sick Leave (30 days/cycle). 4. Maternity Leave (4 months). 5. Notice Periods (4 weeks for >1 year). 6. Section 34 Prohibited Deductions.', 
    'v1'
),
(
    'Labour Relations Act (LRA) - Dismissal Standards', 
    'Labor Law', 
    'LRA Act 66 of 1995: 1. Dismissals must be Substantively Fair (Valid Reason) and Procedurally Fair (Right to Hearing). 2. Schedule 8 Code of Good Practice is the standard for Conduct/Capacity. 3. Section 189 for Retrenchment.', 
    'v1'
),
(
    'POPIA - Compliance Fundamentals', 
    'Privacy', 
    'POPI Act of 2013 requires: 1. Lawfulness (Reasonable processing). 2. Consent for direct marketing. 3. Condition 7: Security Safeguards (Technical and organizational measures). 4. Data Subject rights to access/correction.', 
    'v1'
)
ON CONFLICT (title) DO NOTHING;