-- ELEZON — product image storage.
-- A public bucket for admin-uploaded product photos (manual entries going
-- forward). Bulk-imported photos stay in the repo (public/images/products);
-- admin uploads land here and products.image_url holds the full public URL.
-- Public read; only admins (is_admin()) may upload / change / delete.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product-images public read"   on storage.objects;
drop policy if exists "product-images admin insert"   on storage.objects;
drop policy if exists "product-images admin update"   on storage.objects;
drop policy if exists "product-images admin delete"   on storage.objects;

create policy "product-images public read"
  on storage.objects for select
  to public
  using (bucket_id = 'product-images');

create policy "product-images admin insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "product-images admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

create policy "product-images admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin());
