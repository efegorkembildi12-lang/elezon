-- ELEZON — initial schema + Row-Level-Security.
-- Run in Supabase SQL editor (or `supabase db push`). Safe to re-run.

create extension if not exists pgcrypto;

-- ---------- tables ----------
create table if not exists categories (
  id    text primary key,
  name  text not null,
  short text not null default '',
  code  text not null default '',
  count integer not null default 0,
  "desc" text not null default '',
  sub   text[] not null default '{}',
  pos   integer not null default 0
);

create table if not exists brands (
  id      text primary key,
  name    text not null,
  country text not null default '',
  slug    text not null default '',
  count   integer not null default 0,
  pos     integer not null default 0
);

create table if not exists products (
  id      text primary key,
  name    text not null,
  cat     text not null references categories(id) on delete restrict,
  brand   text not null default '',
  type    text not null default '',
  article text not null default '',
  price   numeric,
  stock   text not null default 'in' check (stock in ('in','order')),
  qty     integer not null default 0,
  specs   jsonb not null default '[]',
  pos     integer not null default 0
);

create table if not exists customers (
  id        uuid primary key default gen_random_uuid(),
  company   text not null default '',
  inn       text not null default '',
  contact   text not null default '',
  phone     text not null default '',
  email     text not null default '',
  city      text not null default '',
  status    text not null default 'lead' check (status in ('active','lead','inactive')),
  requests  integer not null default 0,
  turnover  numeric not null default 0,
  last_date text not null default ''
);

create table if not exists orders (
  id         uuid primary key default gen_random_uuid(),
  num        text not null default '',
  date       text not null default '',
  company    text not null default '',
  contact    text not null default '',
  phone      text not null default '',
  email      text not null default '',
  status     text not null default 'new' check (status in ('new','work','ship','done','lost')),
  channel    text not null default 'form' check (channel in ('form','email','phone')),
  manager    text not null default '',
  items      jsonb not null default '[]',
  total      numeric not null default 0,
  comment    text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists content (
  id              smallint primary key default 1,
  home_sub        text not null default '',
  about_heading   text not null default '',
  about_body      text not null default '',
  delivery_body   text not null default '',
  contact_address text not null default '',
  contact_phone   text not null default '',
  contact_email   text not null default '',
  requisites      text not null default '',
  constraint content_singleton check (id = 1)
);

create table if not exists settings (
  id           smallint primary key default 1,
  store_name   text not null default 'ELEZON',
  email        text not null default '',
  phone        text not null default '',
  accent       text not null default 'lime',
  default_lang text not null default 'ru',
  notify_new   boolean not null default true,
  price_no_vat boolean not null default false,
  auto_publish boolean not null default true,
  constraint settings_singleton check (id = 1)
);

create table if not exists site_stats (
  idx  integer primary key,
  v    text not null default '',
  l    text not null default '',
  v_en text not null default '',
  l_en text not null default ''
);

create table if not exists stock_leads (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  product_id   text not null default '',
  product_name text not null default '',
  article      text not null default '',
  created_at   timestamptz not null default now()
);

-- ---------- RLS ----------
alter table categories  enable row level security;
alter table brands      enable row level security;
alter table products    enable row level security;
alter table customers   enable row level security;
alter table orders      enable row level security;
alter table content     enable row level security;
alter table settings    enable row level security;
alter table site_stats  enable row level security;
alter table stock_leads enable row level security;

-- public (anon + authenticated) read of catalog/content/settings/stats
create policy "read categories" on categories for select using (true);
create policy "read brands"     on brands     for select using (true);
create policy "read products"   on products   for select using (true);
create policy "read content"    on content    for select using (true);
create policy "read settings"   on settings   for select using (true);
create policy "read site_stats" on site_stats for select using (true);

-- public lead capture: insert only, no read
create policy "insert orders"      on orders      for insert with check (true);
create policy "insert stock_leads" on stock_leads for insert with check (true);

-- admin (any authenticated user) full CRUD
create policy "admin categories"  on categories  for all to authenticated using (true) with check (true);
create policy "admin brands"      on brands      for all to authenticated using (true) with check (true);
create policy "admin products"    on products    for all to authenticated using (true) with check (true);
create policy "admin customers"   on customers   for all to authenticated using (true) with check (true);
create policy "admin orders"      on orders      for all to authenticated using (true) with check (true);
create policy "admin content"     on content     for all to authenticated using (true) with check (true);
create policy "admin settings"    on settings    for all to authenticated using (true) with check (true);
create policy "admin site_stats"  on site_stats  for all to authenticated using (true) with check (true);
create policy "admin stock_leads" on stock_leads for all to authenticated using (true) with check (true);
