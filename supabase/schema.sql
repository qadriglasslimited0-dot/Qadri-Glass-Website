-- Qadri Glass — Supabase schema, Row Level Security and storage
-- Run once in the Supabase SQL editor.

create extension if not exists "pgcrypto";

-- ---------- Staff (who may use the admin dashboard) ----------
create table if not exists public.staff (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- ---------- Content tables ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  kicker text default '',
  summary text default '',
  body text default '',
  applications jsonb not null default '[]',
  process jsonb not null default '[]',
  published boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text default '',
  image text default '',
  specs jsonb not null default '[]',
  applications jsonb not null default '[]',
  related_projects jsonb not null default '[]',
  published boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  location text default '',
  category text default '',
  year text default '',
  description text default '',
  applications jsonb not null default '[]',
  images jsonb not null default '[]',
  details jsonb not null default '[]',
  published boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text default '',
  image text default '',
  verified boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  category text,
  message text not null,
  attachments jsonb not null default '[]',
  status text not null default 'new' check (status in ('new','contacted','closed')),
  created_at timestamptz not null default now()
);


-- ---------- First-admin bootstrap ----------
-- The first signed-in user can claim admin access ONLY while the staff table is empty.
create or replace function public.claim_staff() returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.staff) then return false; end if;
  insert into public.staff (user_id) values (auth.uid());
  return true;
end;
$$;
revoke all on function public.claim_staff() from public, anon;
grant execute on function public.claim_staff() to authenticated;

-- ---------- Row Level Security ----------
alter table public.staff enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.certificates enable row level security;
alter table public.site_content enable row level security;
alter table public.enquiries enable row level security;

-- staff can see whether they are staff (the dashboard checks this); nobody can edit via the API
drop policy if exists "staff read self" on public.staff;
create policy "staff read self" on public.staff for select using (user_id = auth.uid());

-- public: published rows only
drop policy if exists "public read published" on public.services;
create policy "public read published" on public.services for select using (published);
drop policy if exists "public read published" on public.products;
create policy "public read published" on public.products for select using (published);
drop policy if exists "public read published" on public.projects;
create policy "public read published" on public.projects for select using (published);
drop policy if exists "public read verified" on public.certificates;
create policy "public read verified" on public.certificates for select using (verified);
drop policy if exists "public read content" on public.site_content;
create policy "public read content" on public.site_content for select using (true);

-- staff: full control of content
do $$
declare t text;
begin
  foreach t in array array['services','products','projects','certificates','site_content'] loop
    execute format('drop policy if exists "staff all" on public.%I', t);
    execute format('create policy "staff all" on public.%I for all using (public.is_staff()) with check (public.is_staff())', t);
  end loop;
end $$;

-- enquiries: inserted ONLY by the API (service role bypasses RLS). Staff may read/update/delete.
drop policy if exists "staff manage enquiries" on public.enquiries;
create policy "staff manage enquiries" on public.enquiries for all using (public.is_staff()) with check (public.is_staff());

-- ---------- Storage ----------
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit) values ('enquiry-files', 'enquiry-files', false, 10485760) on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media staff write" on storage.objects;
create policy "media staff write" on storage.objects for all using (bucket_id = 'media' and public.is_staff()) with check (bucket_id = 'media' and public.is_staff());
drop policy if exists "enquiry files staff read" on storage.objects;
create policy "enquiry files staff read" on storage.objects for select using (bucket_id = 'enquiry-files' and public.is_staff());
drop policy if exists "enquiry files staff delete" on storage.objects;
create policy "enquiry files staff delete" on storage.objects for delete using (bucket_id = 'enquiry-files' and public.is_staff());

-- ---------- After creating your first user in Authentication → Users ----------
-- insert into public.staff (user_id) values ('<that user''s UUID>');
