-- Run in the Supabase SQL editor. Never place a service-role key in frontend code.
create extension if not exists pgcrypto;
create table if not exists public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 category text not null check(category in ('whisky','vodka','gin','rum','tequila','spirits','brandy-cognac','wine','beer-cider','champagne-sparkling','liqueurs','rtd-cocktails','mixers')),
 price_kes numeric(12,2) not null check(price_kes>=0),
 size_label text,
 stock_quantity integer not null default 0 check(stock_quantity>=0),
 image_url text,
 description text,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.products enable row level security;
alter table public.admin_users enable row level security;
create policy "Active catalog visible to all" on public.products for select to anon,authenticated using (active=true or exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
create policy "Admin manages products" on public.products for all to authenticated using (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid()))) with check (exists(select 1 from public.admin_users a where a.user_id=(select auth.uid())));
create policy "Admin can see their own membership" on public.admin_users for select to authenticated using (user_id=(select auth.uid()));
-- After creating the owner's user in Supabase Authentication > Users, authorize them in SQL editor:
-- insert into public.admin_users(user_id) values ('REPLACE-WITH-AUTH-USER-UUID');
