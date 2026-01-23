
-- 1. APP SETTINGS (Global Config)
CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT
);

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
DROP POLICY IF EXISTS "Admins can manage app settings" ON app_settings;
CREATE POLICY "Admins can manage app settings" ON app_settings TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Everyone (authenticated) can view settings (for pricing, etc)
DROP POLICY IF EXISTS "Everyone can view app settings" ON app_settings;
CREATE POLICY "Everyone can view app settings" ON app_settings FOR SELECT TO authenticated USING (true);


-- 2. DOCUMENT PRICES (Dynamic Pricing)
CREATE TABLE IF NOT EXISTS document_prices (
    doc_type TEXT PRIMARY KEY,
    price INTEGER NOT NULL DEFAULT 0, -- In Cents
    category TEXT CHECK (category IN ('policy', 'form'))
);

ALTER TABLE document_prices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage prices" ON document_prices;
CREATE POLICY "Admins can manage prices" ON document_prices TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Everyone can view prices" ON document_prices;
CREATE POLICY "Everyone can view prices" ON document_prices FOR SELECT TO authenticated USING (true);


-- 3. ADMIN NOTIFICATIONS
CREATE TABLE IF NOT EXISTS admin_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'new_user', 'payment_failed', 'important_update'
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_user_id UUID,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage notifications" ON admin_notifications;
CREATE POLICY "Admins can manage notifications" ON admin_notifications TO authenticated USING (is_admin()) WITH CHECK (is_admin()); 


-- 4. COUPONS
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value INTEGER NOT NULL,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    applicable_to TEXT, -- 'all', 'plan:pro', etc
    expiry_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage coupons" ON coupons;
CREATE POLICY "Admins can manage coupons" ON coupons TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Everyone can view active coupons" ON coupons;
CREATE POLICY "Everyone can view active coupons" ON coupons FOR SELECT TO authenticated USING (true); -- Needed for validation


-- 5. POLICY DRAFTS
CREATE TABLE IF NOT EXISTS policy_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    original_doc_id UUID,
    original_doc_title TEXT,
    original_content TEXT,
    update_result JSONB,
    selected_indices JSONB,
    manual_instructions TEXT,
    updated_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE policy_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own drafts" ON policy_drafts;
CREATE POLICY "Users can manage own drafts" ON policy_drafts 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- 6. USER FILES (Uploads)
CREATE TABLE IF NOT EXISTS user_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    notes TEXT,
    size INTEGER,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own files" ON user_files;
CREATE POLICY "Users can manage own files" ON user_files 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
