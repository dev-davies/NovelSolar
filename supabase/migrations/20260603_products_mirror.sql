-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    dealer_price NUMERIC,
    description TEXT,
    specs JSONB,
    gallery_urls JSONB,
    image_url TEXT,
    quantity NUMERIC,
    active BOOLEAN DEFAULT true,
    raw JSONB,
    synced_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create sync_meta table
CREATE TABLE IF NOT EXISTS sync_meta (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS products_active_idx ON products(active);
CREATE INDEX IF NOT EXISTS products_synced_at_idx ON products(synced_at);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_meta ENABLE ROW LEVEL SECURITY;

-- Explicitly allow service_role to do everything (anon and authenticated have no access by default)
CREATE POLICY "service_role_all_products" ON products
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "service_role_all_sync_meta" ON sync_meta
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
