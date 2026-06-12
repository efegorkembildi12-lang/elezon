-- ELEZON — homepage feature flag.
-- Lets the admin pick which products appear in the homepage "Popular" rail,
-- independent of stock status (most of the real catalogue is "on order", so the
-- in-stock-only rail was empty). Defaults to false → existing rows unaffected.

alter table products add column if not exists featured boolean not null default false;
