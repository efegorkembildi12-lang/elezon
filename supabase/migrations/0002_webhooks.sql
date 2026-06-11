-- ELEZON — Faz 3: e-posta bildirimi için DB → Edge Function webhook'ları.
--
-- Bu migration, orders/stock_leads tablolarına yapılan INSERT'lerde ilgili
-- Edge Function'ı (notify-order / notify-lead) pg_net ile tetikler. Supabase
-- panelindeki "Database Webhooks" arayüzü yerine kod ile aynı işi yapar.
--
-- ÖNKOŞUL — webhook gizli anahtarını Vault'a bir kez yaz (SQL Editor'de):
--   select vault.create_secret('SECRET_DEGERIN', 'elezon_webhook_secret');
-- Aynı değeri Edge Function'lara da ver:
--   supabase secrets set WEBHOOK_SECRET=SECRET_DEGERIN
--
-- Not: Edge Function'lar yayınlanmış (deploy) olmalı, aksi halde POST 404 döner
-- ama INSERT yine başarılı olur (bildirim asenkron, siparişi bloklamaz).

create extension if not exists pg_net with schema extensions;

-- Tek noktadan Edge Function çağrısı. Gizli anahtarı Vault'tan okur ve
-- x-webhook-secret başlığıyla gönderir.
create or replace function public.elezon_notify(fn text, rec jsonb)
returns void
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  secret text;
begin
  select decrypted_secret into secret
    from vault.decrypted_secrets
    where name = 'elezon_webhook_secret'
    limit 1;

  perform net.http_post(
    url     := 'https://qynfoajwaamqgofqdzso.supabase.co/functions/v1/' || fn,
    headers := jsonb_build_object(
      'Content-Type',    'application/json',
      'x-webhook-secret', coalesce(secret, '')
    ),
    body    := jsonb_build_object('type', 'INSERT', 'record', rec)
  );
end;
$$;

create or replace function public.trg_notify_order()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.elezon_notify('notify-order', to_jsonb(new));
  return new;
end;
$$;

create or replace function public.trg_notify_lead()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.elezon_notify('notify-lead', to_jsonb(new));
  return new;
end;
$$;

drop trigger if exists on_order_created on public.orders;
create trigger on_order_created
  after insert on public.orders
  for each row execute function public.trg_notify_order();

drop trigger if exists on_lead_created on public.stock_leads;
create trigger on_lead_created
  after insert on public.stock_leads
  for each row execute function public.trg_notify_lead();
