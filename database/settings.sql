create table public.settings (
  id bigint generated always as identity not null,
  society_name text null,
  society_address text null,
  maintenance_amount numeric null,
  admin_name text null,
  admin_phone text null,
  constraint settings_pkey primary key (id)
) TABLESPACE pg_default;