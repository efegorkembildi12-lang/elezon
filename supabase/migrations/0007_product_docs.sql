-- ELEZON — per-product documents (datasheets / PDFs).
-- A list of {title, file} objects. `file` is a bare filename served from the repo
-- (public/docs/products/<file>) for the bulk import, or a full Storage URL for
-- admin-uploaded documents. Defaults to [] so existing rows stay valid.

alter table products add column if not exists documents jsonb not null default '[]';
