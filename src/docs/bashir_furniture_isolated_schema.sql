-- Bashir Furniture isolated schema
-- IMPORTANT: This migration creates Bashir-prefixed tables so it does not alter
-- the existing shared products/categories/site_settings/enquiries tables.
-- Review before running in the Supabase SQL Editor.

create table if not exists public.bashir_categories (
  id text primary key,
  name text not null,
  slug text unique not null,
  image text not null default '',
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.bashir_products (
  id text primary key,
  name text not null,
  description text,
  price numeric not null default 0 check (price >= 0),
  discount_price numeric check (discount_price is null or discount_price >= 0),
  images text[] not null default '{}',
  category text not null,
  availability text not null default 'In Stock'
    check (availability in ('In Stock', 'Made to Order', 'Out of Stock')),
  dimensions text,
  materials text,
  colours text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.bashir_site_settings (
  id text primary key default 'main',
  hero_title text not null default '',
  hero_subtitle text not null default '',
  hero_image text not null default '',
  company_name text not null default 'Bashir Furniture',
  phone text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  address text not null default '',
  about_text text not null default '',
  social_links jsonb not null default '{}'::jsonb,
  constraint bashir_site_settings_main_only check (id = 'main')
);

create table if not exists public.bashir_enquiries (
  id text primary key,
  product_id text,
  product_name text,
  customer_name text not null,
  phone text not null,
  email text,
  message text not null,
  status text not null default 'New'
    check (status in ('New', 'Contacted', 'Completed')),
  created_at timestamptz not null default now()
);

alter table public.bashir_categories enable row level security;
alter table public.bashir_products enable row level security;
alter table public.bashir_site_settings enable row level security;
alter table public.bashir_enquiries enable row level security;

drop policy if exists "Bashir public read categories" on public.bashir_categories;
create policy "Bashir public read categories"
  on public.bashir_categories for select to anon, authenticated using (true);
drop policy if exists "Bashir authenticated manage categories" on public.bashir_categories;
create policy "Bashir authenticated manage categories"
  on public.bashir_categories for all to authenticated
  using (true) with check (true);

drop policy if exists "Bashir public read products" on public.bashir_products;
create policy "Bashir public read products"
  on public.bashir_products for select to anon, authenticated using (true);
drop policy if exists "Bashir authenticated manage products" on public.bashir_products;
create policy "Bashir authenticated manage products"
  on public.bashir_products for all to authenticated
  using (true) with check (true);

drop policy if exists "Bashir public read settings" on public.bashir_site_settings;
create policy "Bashir public read settings"
  on public.bashir_site_settings for select to anon, authenticated using (true);
drop policy if exists "Bashir authenticated manage settings" on public.bashir_site_settings;
create policy "Bashir authenticated manage settings"
  on public.bashir_site_settings for all to authenticated
  using (true) with check (true);

drop policy if exists "Bashir public insert enquiries" on public.bashir_enquiries;
create policy "Bashir public insert enquiries"
  on public.bashir_enquiries for insert to anon, authenticated with check (true);
drop policy if exists "Bashir authenticated read enquiries" on public.bashir_enquiries;
create policy "Bashir authenticated read enquiries"
  on public.bashir_enquiries for select to authenticated using (true);
drop policy if exists "Bashir authenticated update enquiries" on public.bashir_enquiries;
create policy "Bashir authenticated update enquiries"
  on public.bashir_enquiries for update to authenticated using (true) with check (true);
drop policy if exists "Bashir authenticated delete enquiries" on public.bashir_enquiries;
create policy "Bashir authenticated delete enquiries"
  on public.bashir_enquiries for delete to authenticated using (true);

grant select on public.bashir_categories, public.bashir_products, public.bashir_site_settings to anon, authenticated;
grant insert on public.bashir_enquiries to anon, authenticated;
grant insert, update, delete on public.bashir_categories, public.bashir_products, public.bashir_site_settings to authenticated;
grant select, update, delete on public.bashir_enquiries to authenticated;
