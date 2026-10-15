-- BASHIR FURNITURE SUPABASE SETUP & RLS MIGRATION
-- Run this SQL in your Supabase SQL Editor (https://app.supabase.com -> Project efdtxbbhggdcohigelmw -> SQL Editor)

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  discount_price NUMERIC,
  images TEXT[] NOT NULL,
  category TEXT NOT NULL,
  availability TEXT CHECK (availability IN ('In Stock', 'Made to Order', 'Out of Stock')) DEFAULT 'In Stock',
  dimensions TEXT,
  materials TEXT,
  colours TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'main',
  hero_title TEXT NOT NULL,
  hero_subtitle TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  about_text TEXT NOT NULL,
  social_links JSONB DEFAULT '{}'::jsonb
);

-- 4. CUSTOMER ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id TEXT PRIMARY KEY,
  product_id TEXT,
  product_name TEXT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('New', 'Contacted', 'Completed')) DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Categories: Public read, Authenticated admin write
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- Products: Public read, Authenticated admin write
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin manage products" ON products FOR ALL USING (auth.role() = 'authenticated');

-- Site Settings: Public read, Authenticated admin write
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- Enquiries: Anyone can insert (submit an enquiry/order), Only authenticated admin can read/update
CREATE POLICY "Public insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage enquiries" ON enquiries FOR ALL USING (auth.role() = 'authenticated');

-- STORAGE BUCKET SETUP
-- 1. Create a public storage bucket named 'site-media' via Supabase Dashboard -> Storage -> New Bucket -> 'site-media' (Public: true)
-- 2. Storage RLS policies for 'site-media':
-- CREATE POLICY "Public Access Storage" ON storage.objects FOR SELECT USING ( bucket_id = 'site-media' );
-- CREATE POLICY "Admin Upload Storage" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'site-media' AND auth.role() = 'authenticated' );
-- CREATE POLICY "Admin Delete Storage" ON storage.objects FOR DELETE USING ( bucket_id = 'site-media' AND auth.role() = 'authenticated' );
