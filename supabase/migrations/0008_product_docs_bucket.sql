-- ELEZON — product document storage.
-- A public bucket for admin-uploaded product documents (datasheets going forward).
-- Bulk-imported docs stay in the repo (public/docs/products); admin uploads land
-- here and products.documents[].file holds the full public URL.
-- Public read; only admins (is_admin()) may upload / change / delete.

insert into storage.buckets (id, name, public)
values ('product-docs', 'product-docs', true)
on conflict (id) do nothing;

drop policy if exists "product-docs public read"  on storage.objects;
drop policy if exists "product-docs admin insert"  on storage.objects;
drop policy if exists "product-docs admin update"  on storage.objects;
drop policy if exists "product-docs admin delete"  on storage.objects;

create policy "product-docs public read"
  on storage.objects for select
  to public
  using (bucket_id = 'product-docs');

create policy "product-docs admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-docs' and public.is_admin());

create policy "product-docs admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-docs' and public.is_admin());

create policy "product-docs admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-docs' and public.is_admin());
