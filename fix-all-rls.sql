-- Enable RLS on all tables

-- admin_settings (likely for app config)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access on admin_settings" 
ON admin_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

-- bitrix_contact_links (CRM integration)
ALTER TABLE bitrix_contact_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access on bitrix_contact_links" 
ON bitrix_contact_links FOR ALL TO service_role USING (true) WITH CHECK (true);

-- bitrix_order_links (CRM integration)
ALTER TABLE bitrix_order_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access on bitrix_order_links" 
ON bitrix_order_links FOR ALL TO service_role USING (true) WITH CHECK (true);

-- crm_outbox (outgoing messages)
ALTER TABLE crm_outbox ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow service role full access on crm_outbox" 
ON crm_outbox FOR ALL TO service_role USING (true) WITH CHECK (true);

-- order_events (order history)
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read on order_events" 
ON order_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service role full access on order_events" 
ON order_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- order_items (line items)
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read on order_items" 
ON order_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service role full access on order_items" 
ON order_items FOR ALL TO service_role USING (true) WITH CHECK (true);

-- orders (main orders table)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read on orders" 
ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow service role full access on orders" 
ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);

-- profiles (user profiles)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read on profiles" 
ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated update on own profile" 
ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow service role full access on profiles" 
ON profiles FOR ALL TO service_role USING (true) WITH CHECK (true);