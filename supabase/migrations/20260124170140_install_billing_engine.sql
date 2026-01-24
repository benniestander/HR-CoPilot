-- INVOICES TABLE: Tracking the official "Bill" sent on the 25th
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL, -- Format: INV-YYYYMM-001
    amount_due BIGINT NOT NULL, -- In Cents
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
    due_date TIMESTAMPTZ NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    pdf_url TEXT, -- Link to stored PDF
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICE ITEMS: Granular line items for the invoice
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount BIGINT NOT NULL,
    quantity INTEGER DEFAULT 1,
    type TEXT CHECK (type IN ('platform_fee', 'client_fee', 'credit_adjustment', 'other')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- LEDGER: Unbilled activity queue (The "Tab")
-- When a consultant adds a client, it goes here FIRST.
-- On the 25th, an aggregated invoice is created from these "pending" rows.
CREATE TABLE IF NOT EXISTS billing_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL, -- e.g. "Access Fee: ABC Corp"
    amount BIGINT NOT NULL, -- In Cents
    status TEXT NOT NULL CHECK (status IN ('pending', 'invoiced', 'cancelled')),
    related_invoice_id UUID REFERENCES invoices(id), -- Null until billed
    metadata JSONB DEFAULT '{}'::jsonb, -- Store clientId, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXING for Speed
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_ledger_user_pending ON billing_ledger(user_id) WHERE status = 'pending';

-- RLS: Security (Admins see all, Users see own)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own invoices" ON invoices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all invoices" ON invoices FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Users view own ledger" ON billing_ledger FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage ledger" ON billing_ledger FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true)
);
