
-- INSTITUTIONAL BILLING SYSTEM SCHEMA
-- Handled via Supabase for HR CoPilot

-- 1. BILLING LEDGER (Pending Debt)
CREATE TABLE IF NOT EXISTS billing_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    amount INTEGER NOT NULL, -- In Cents
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invoiced')),
    related_invoice_id UUID, -- Links to invoices once generated
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. INVOICES (Aggregated Billing)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    amount_due INTEGER NOT NULL, -- In Cents
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date TIMESTAMPTZ NOT NULL,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. INVOICE ITEMS (Line items breakdown)
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amount INTEGER NOT NULL, -- In Cents
    type TEXT CHECK (type IN ('platform_fee', 'client_fee')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS POLICIES

-- Enable RLS
ALTER TABLE billing_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
DROP POLICY IF EXISTS "Admins can manage billing ledger" ON billing_ledger;
CREATE POLICY "Admins can manage billing ledger" ON billing_ledger TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can manage invoices" ON invoices;
CREATE POLICY "Admins can manage invoices" ON invoices TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can manage invoice items" ON invoice_items;
CREATE POLICY "Admins can manage invoice items" ON invoice_items TO authenticated USING (is_admin()) WITH CHECK (is_admin());


-- Users (Consultants) can view their own billing data
DROP POLICY IF EXISTS "Users can view own ledger items" ON billing_ledger;
CREATE POLICY "Users can view own ledger items" ON billing_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own invoices" ON invoices;
CREATE POLICY "Users can view own invoices" ON invoices FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own invoice items" ON invoice_items;
CREATE POLICY "Users can view own invoice items" ON invoice_items FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM invoices WHERE id = invoice_id AND user_id = auth.uid()
    )
);

-- Automatic Updated At for Invoices
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
