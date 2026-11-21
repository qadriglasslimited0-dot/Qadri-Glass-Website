-- Qadri Glass: customer reviews (run once in the Supabase SQL editor, after schema.sql)
-- Anyone may SUBMIT a review, but it is stored as 'pending'. Only 'approved' reviews are readable by the public.
-- Staff approve or reject reviews in the admin dashboard (Reviews tab).

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  company text check (company is null or char_length(company) <= 120),
  rating int not null check (rating between 1 and 5),
  message text not null check (char_length(message) between 10 and 600),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

drop policy if exists "public submit pending review" on public.reviews;
create policy "public submit pending review" on public.reviews
  for insert to anon, authenticated with check (status = 'pending');

drop policy if exists "public read approved reviews" on public.reviews;
create policy "public read approved reviews" on public.reviews
  for select using (status = 'approved');

drop policy if exists "staff manage reviews" on public.reviews;
create policy "staff manage reviews" on public.reviews
  for all using (public.is_staff()) with check (public.is_staff());
