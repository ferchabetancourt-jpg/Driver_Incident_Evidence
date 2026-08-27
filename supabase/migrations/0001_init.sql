-- Driver Incident Evidence App — Fase 0 schema
-- Hierarchy: profiles -> stations -> blocks -> (packages | block-level incidents)
--            incidents -> incident_packages (0..n) -> packages
--            incidents -> communications, evidence

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  language text not null default 'es' check (language in ('es', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles_select_own" on profiles for select using (id = auth.uid());
create policy "profiles_update_own" on profiles for update using (id = auth.uid());
create policy "profiles_insert_own" on profiles for insert with check (id = auth.uid());

-- auto-create a profile row when a new auth user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- stations
-- ---------------------------------------------------------------------
create table stations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  station_code text,
  address text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table stations enable row level security;

create policy "stations_owner_all" on stations for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index stations_user_id_idx on stations (user_id);

-- ---------------------------------------------------------------------
-- blocks
-- ---------------------------------------------------------------------
create table blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  station_id uuid not null references stations (id) on delete restrict,
  block_date date not null,
  start_time time not null,
  end_time time,
  duration_minutes integer,
  source text not null default 'manual' check (source in ('manual', 'screenshot')),
  created_at timestamptz not null default now()
);

alter table blocks enable row level security;

create policy "blocks_owner_all" on blocks for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create index blocks_user_id_idx on blocks (user_id);
create index blocks_date_idx on blocks (user_id, block_date desc);

-- ---------------------------------------------------------------------
-- packages (TBA records)
-- ---------------------------------------------------------------------
create table packages (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references blocks (id) on delete cascade,
  tba text,
  description text,
  delivery_location text,
  status text,
  created_at timestamptz not null default now()
);

alter table packages enable row level security;

create policy "packages_owner_all" on packages for all
  using (exists (select 1 from blocks b where b.id = packages.block_id and b.user_id = auth.uid()))
  with check (exists (select 1 from blocks b where b.id = packages.block_id and b.user_id = auth.uid()));

create index packages_block_id_idx on packages (block_id);
create index packages_tba_idx on packages (tba);

-- ---------------------------------------------------------------------
-- incidents
-- An incident always belongs to a block. It may additionally be linked
-- to zero, one, or many packages via incident_packages (see below):
-- a package-level incident links to the affected TBA(s); a block-level
-- incident (vehicle breakdown, weather, ran out of time) links to none,
-- or is enriched with affected TBAs later.
-- ---------------------------------------------------------------------
create table incidents (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references blocks (id) on delete cascade,
  category text not null check (category in (
    'no_access_code',
    'gate_locked',
    'customer_unavailable',
    'unsafe_location',
    'damaged_package',
    'missing_package',
    'wrong_address',
    'delivery_instructions',
    'vehicle_route_issue',
    'weather_or_external',
    'support_instruction',
    'other'
  )),
  occurred_at timestamptz not null default now(),
  transcript text,
  structured_summary text,
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table incidents enable row level security;

create policy "incidents_owner_all" on incidents for all
  using (exists (select 1 from blocks b where b.id = incidents.block_id and b.user_id = auth.uid()))
  with check (exists (select 1 from blocks b where b.id = incidents.block_id and b.user_id = auth.uid()));

create index incidents_block_id_idx on incidents (block_id);
create index incidents_category_idx on incidents (category);

-- ---------------------------------------------------------------------
-- incident_packages (join table: which TBAs an incident affects)
-- ---------------------------------------------------------------------
create table incident_packages (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references incidents (id) on delete cascade,
  package_id uuid not null references packages (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (incident_id, package_id)
);

alter table incident_packages enable row level security;

create policy "incident_packages_owner_all" on incident_packages for all
  using (exists (
    select 1 from incidents i
    join blocks b on b.id = i.block_id
    where i.id = incident_packages.incident_id and b.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from incidents i
    join blocks b on b.id = i.block_id
    where i.id = incident_packages.incident_id and b.user_id = auth.uid()
  ));

create index incident_packages_incident_id_idx on incident_packages (incident_id);
create index incident_packages_package_id_idx on incident_packages (package_id);

-- ---------------------------------------------------------------------
-- communications (support calls / emails tied to an incident)
-- ---------------------------------------------------------------------
create table communications (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references incidents (id) on delete cascade,
  type text not null check (type in ('support_call', 'support_email', 'driver_email', 'other')),
  occurred_at timestamptz not null default now(),
  summary text,
  reference text,
  created_at timestamptz not null default now()
);

alter table communications enable row level security;

create policy "communications_owner_all" on communications for all
  using (exists (
    select 1 from incidents i
    join blocks b on b.id = i.block_id
    where i.id = communications.incident_id and b.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from incidents i
    join blocks b on b.id = i.block_id
    where i.id = communications.incident_id and b.user_id = auth.uid()
  ));

create index communications_incident_id_idx on communications (incident_id);

-- ---------------------------------------------------------------------
-- evidence (audio, photos, screenshots attached to an incident)
-- ---------------------------------------------------------------------
create table evidence (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references incidents (id) on delete cascade,
  type text not null check (type in ('audio', 'photo', 'screenshot', 'other')),
  storage_path text not null,
  mime_type text,
  original_filename text,
  captured_at timestamptz not null default now(),
  ocr_text text,
  created_at timestamptz not null default now()
);

alter table evidence enable row level security;

create policy "evidence_owner_all" on evidence for all
  using (exists (
    select 1 from incidents i
    join blocks b on b.id = i.block_id
    where i.id = evidence.incident_id and b.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from incidents i
    join blocks b on b.id = i.block_id
    where i.id = evidence.incident_id and b.user_id = auth.uid()
  ));

create index evidence_incident_id_idx on evidence (incident_id);

-- ---------------------------------------------------------------------
-- storage: private bucket for evidence files
-- Objects are stored under `${auth.uid()}/...` so RLS can check the
-- first path segment against the requesting user.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing;

create policy "evidence_bucket_owner_select" on storage.objects for select
  using (bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "evidence_bucket_owner_insert" on storage.objects for insert
  with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "evidence_bucket_owner_delete" on storage.objects for delete
  using (bucket_id = 'evidence' and (storage.foldername(name))[1] = auth.uid()::text);
