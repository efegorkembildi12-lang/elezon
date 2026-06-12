-- ELEZON — team metadata on the admin allow-list.
-- The `admins` table only held user_id. Add email/name/role so the admin panel
-- can list and manage team members. Populated by the `team` Edge Function (which
-- creates/removes the matching Supabase Auth user with the service role).

alter table admins add column if not exists email text;
alter table admins add column if not exists name  text not null default '';
alter table admins add column if not exists role  text not null default 'Менеджер';

-- Backfill email for the bootstrap admin(s) created before this migration.
update admins a
set email = u.email
from auth.users u
where a.user_id = u.id and (a.email is null or a.email = '');
