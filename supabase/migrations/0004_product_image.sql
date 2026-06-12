-- ELEZON — per-product image.
-- Stores the image filename served from public/images/products/<file>. Empty
-- string means "no photo" → the frontend falls back to the category placeholder.

alter table products add column if not exists image_url text not null default '';
