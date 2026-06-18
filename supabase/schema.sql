-- ============================================================
-- NAQSH Marketplace — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────
create table if not exists products (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  slug              text unique not null,
  description       text,
  price             decimal(10,2) not null,
  category          text,
  images            text[] default '{}',
  model_url         text,                       -- .glb file URL for 3D viewer
  weight_grams      integer default 100,
  dimensions        jsonb,                       -- {l, w, h} in cm
  stock             integer default 0,
  available_colors  text[] default '{}',
  available_sizes   text[] default '{}',
  is_active         boolean default true,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────
create table if not exists orders (
  id                      uuid primary key default gen_random_uuid(),
  order_number            text unique not null,   -- "NQS-0001"
  customer_name           text not null,
  customer_email          text not null,
  customer_phone          text not null,
  shipping_address        jsonb not null,          -- {line1, line2, city, emirate, country}
  items                   jsonb not null,          -- [{id, name, price, quantity, image, selectedColor, selectedSize}]
  subtotal                decimal(10,2) not null,
  shipping_cost           decimal(10,2) not null default 30,
  total                   decimal(10,2) not null,
  payment_status          text not null default 'pending',     -- pending|paid|failed|refunded
  ziina_payment_id        text,
  ziina_payment_url       text,
  fulfillment_status      text not null default 'pending',     -- pending|processing|shipped|delivered|cancelled
  aramex_shipment_id      text,
  aramex_tracking_number  text,
  customization_notes     text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Index for common queries
create index if not exists orders_payment_status_idx on orders(payment_status);
create index if not exists orders_fulfillment_status_idx on orders(fulfillment_status);
create index if not exists orders_created_at_idx on orders(created_at desc);
create index if not exists orders_ziina_payment_id_idx on orders(ziina_payment_id);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────

-- Products: public read, service role write
alter table products enable row level security;

create policy "Public can read active products"
  on products for select
  using (is_active = true);

create policy "Service role can do everything on products"
  on products for all
  using (auth.role() = 'service_role');

-- Orders: no public read (only via service role / API routes)
alter table orders enable row level security;

create policy "Service role can do everything on orders"
  on orders for all
  using (auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- STORAGE BUCKETS
-- Run these in Supabase Dashboard → Storage
-- ─────────────────────────────────────────

-- Create storage buckets (run in Supabase SQL editor or dashboard UI):
/*
  Bucket: product-images
    - Public: true
    - Allowed MIME types: image/jpeg, image/png, image/webp, image/avif

  Bucket: product-models
    - Public: true
    - Allowed MIME types: model/gltf-binary, application/octet-stream
*/

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-models', 'product-models', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Service role upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'service_role');

create policy "Public read product models"
  on storage.objects for select
  using (bucket_id = 'product-models');

create policy "Service role upload product models"
  on storage.objects for insert
  with check (bucket_id = 'product-models' and auth.role() = 'service_role');

-- ─────────────────────────────────────────
-- SEED: Sample product (optional)
-- ─────────────────────────────────────────
/*
insert into products (name, slug, description, price, category, stock, available_colors, available_sizes, is_active)
values (
  'Geometric Vase No. 1',
  'geometric-vase-no-1',
  'A minimalist vase with clean geometric lines. Designed for single-stem flowers or as a standalone decorative object.',
  149.00,
  'home-decor',
  10,
  array['White', 'Black', 'Gold', 'Terracotta'],
  array['Small', 'Medium', 'Large'],
  true
);
*/
