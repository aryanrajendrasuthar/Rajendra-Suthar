-- SmartQuote Jayraj Fabrication - schema + RLS (admin-only)

create table if not exists public.app_settings (
  id bigint generated always as identity primary key,
  admin_email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.company_profile (
  id bigint generated always as identity primary key,
  company_name text not null,
  address_lines text[] not null default '{}',
  email text,
  phone text,
  signature_name text,
  logo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id bigint generated always as identity primary key,
  name text not null,
  address_lines text[] not null default '{}',
  city text,
  contact_person text,
  phone text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id bigint generated always as identity primary key,
  quote_no text not null, -- e.g. F-08, F-030(A)
  quote_date date not null default current_date,
  client_id bigint references public.clients(id) on delete set null,
  to_name text, -- optional override
  to_address_lines text[] not null default '{}',
  kind_attn text,
  subject text not null,
  status text not null default 'DRAFT',
  validity_days int not null default 7,
  notes_lines text[] not null default '{}',
  terms_lines text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quote_items (
  id bigint generated always as identity primary key,
  quote_id bigint not null references public.quotes(id) on delete cascade,
  line_no int not null,
  title text not null,
  include_lines text[] not null default '{}', -- bullet lines shown under "Including:"
  qty numeric(12,3) not null default 0,
  unit text not null default 'SQFT',
  rate numeric(12,2) not null default 0,
  amount numeric(14,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quote_id, line_no)
);

create table if not exists public.quote_extras (
  id bigint generated always as identity primary key,
  quote_id bigint not null references public.quotes(id) on delete cascade,
  line_no int not null,
  label text not null, -- e.g. GST 18%, Transportation
  extra_type text not null check (extra_type in ('EXTRA_TEXT','AMOUNT')),
  amount numeric(14,2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quote_id, line_no)
);

create table if not exists public.quote_exports (
  id bigint generated always as identity primary key,
  quote_id bigint not null references public.quotes(id) on delete cascade,
  storage_path text not null, -- exports/<file>.pdf
  public_url text,
  created_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_company_profile_updated on public.company_profile;
create trigger trg_company_profile_updated before update on public.company_profile
for each row execute function public.set_updated_at();

drop trigger if exists trg_clients_updated on public.clients;
create trigger trg_clients_updated before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists trg_quotes_updated on public.quotes;
create trigger trg_quotes_updated before update on public.quotes
for each row execute function public.set_updated_at();

drop trigger if exists trg_quote_items_updated on public.quote_items;
create trigger trg_quote_items_updated before update on public.quote_items
for each row execute function public.set_updated_at();

drop trigger if exists trg_quote_extras_updated on public.quote_extras;
create trigger trg_quote_extras_updated before update on public.quote_extras
for each row execute function public.set_updated_at();

-- Admin-only helper based on JWT email
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(
    (auth.jwt() ->> 'email') = (select admin_email from public.app_settings order by id asc limit 1),
    false
  );
$$;

-- RLS enabled
alter table public.app_settings enable row level security;
alter table public.company_profile enable row level security;
alter table public.clients enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;
alter table public.quote_extras enable row level security;
alter table public.quote_exports enable row level security;

-- Policies: admin can do everything
create policy "admin_all_app_settings" on public.app_settings
for all using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_company_profile" on public.company_profile
for all using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_clients" on public.clients
for all using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_quotes" on public.quotes
for all using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_quote_items" on public.quote_items
for all using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_quote_extras" on public.quote_extras
for all using (public.is_admin()) with check (public.is_admin());

create policy "admin_all_quote_exports" on public.quote_exports
for all using (public.is_admin()) with check (public.is_admin());