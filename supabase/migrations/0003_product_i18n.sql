-- ELEZON — bilingual product fields.
-- EN name, RU + EN description, and a per-product EN specs set (the RU specs stay
-- in the existing `specs` column). All default to empty so existing rows are valid.

alter table products add column if not exists name_en       text  not null default '';
alter table products add column if not exists description    text  not null default '';
alter table products add column if not exists description_en text  not null default '';
alter table products add column if not exists specs_en       jsonb not null default '[]';
