-- ============================================
-- Tặng — Gift Registry Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- 1. Users (extends Supabase auth.users)
-- ============================================
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  preferred_language text default 'vi' check (preferred_language in ('vi', 'en')),
  created_at timestamptz default now()
);

alter table public.users enable row level security;

-- Anyone can read user profiles (for registry pages)
create policy "Public profiles are viewable by everyone"
  on public.users for select using (true);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

-- Users can insert their own profile (on signup)
create policy "Users can insert own profile"
  on public.users for insert with check (auth.uid() = id);

-- ============================================
-- 2. Payment Methods
-- ============================================
create table public.payment_methods (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  bank_name text,
  bank_id text,
  account_number text,
  account_name text,
  momo_phone text,
  zalopay_phone text,
  is_primary boolean default true,
  created_at timestamptz default now()
);

alter table public.payment_methods enable row level security;

-- Anyone can read payment methods (needed for contribution flow)
create policy "Payment methods are viewable by everyone"
  on public.payment_methods for select using (true);

-- Users can manage their own payment methods
create policy "Users can insert own payment methods"
  on public.payment_methods for insert with check (auth.uid() = user_id);

create policy "Users can update own payment methods"
  on public.payment_methods for update using (auth.uid() = user_id);

create policy "Users can delete own payment methods"
  on public.payment_methods for delete using (auth.uid() = user_id);

-- ============================================
-- 3. Registries
-- ============================================
create table public.registries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users on delete cascade not null,
  title text not null,
  type text not null check (type in ('pregnancy', 'birthday', 'wedding', 'graduation', 'housewarming', 'thoi_noi')),
  slug text unique not null,
  description text,
  event_date date,
  is_public boolean default true,
  theme text,
  created_at timestamptz default now()
);

alter table public.registries enable row level security;

-- Public registries are viewable by everyone
create policy "Public registries are viewable by everyone"
  on public.registries for select using (is_public = true or auth.uid() = user_id);

-- Users can manage their own registries
create policy "Users can insert own registries"
  on public.registries for insert with check (auth.uid() = user_id);

create policy "Users can update own registries"
  on public.registries for update using (auth.uid() = user_id);

create policy "Users can delete own registries"
  on public.registries for delete using (auth.uid() = user_id);

-- ============================================
-- 4. Registry Items
-- ============================================
create table public.registry_items (
  id uuid default uuid_generate_v4() primary key,
  registry_id uuid references public.registries on delete cascade not null,
  name text not null,
  photo_url text,
  price_estimate numeric,
  buy_url text,
  is_group_gift boolean default false,
  target_amount numeric,
  current_amount numeric default 0,
  is_fully_funded boolean default false,
  is_purchased boolean default false,
  purchased_by_name text,
  purchased_message text,
  purchased_at timestamptz,
  position integer default 0,
  created_at timestamptz default now()
);

alter table public.registry_items enable row level security;

-- Items of public registries are viewable by everyone
create policy "Registry items are viewable if registry is public"
  on public.registry_items for select using (
    exists (
      select 1 from public.registries
      where registries.id = registry_items.registry_id
      and (registries.is_public = true or registries.user_id = auth.uid())
    )
  );

-- Registry owner can manage items
create policy "Users can insert items in own registries"
  on public.registry_items for insert with check (
    exists (
      select 1 from public.registries
      where registries.id = registry_items.registry_id
      and registries.user_id = auth.uid()
    )
  );

create policy "Users can update items in own registries"
  on public.registry_items for update using (
    exists (
      select 1 from public.registries
      where registries.id = registry_items.registry_id
      and registries.user_id = auth.uid()
    )
  );

create policy "Users can delete items in own registries"
  on public.registry_items for delete using (
    exists (
      select 1 from public.registries
      where registries.id = registry_items.registry_id
      and registries.user_id = auth.uid()
    )
  );

-- Anyone can update is_purchased (for claiming items without auth)
create policy "Anyone can claim an item"
  on public.registry_items for update using (
    exists (
      select 1 from public.registries
      where registries.id = registry_items.registry_id
      and registries.is_public = true
    )
  );

-- ============================================
-- 5. Contributions
-- ============================================
create table public.contributions (
  id uuid default uuid_generate_v4() primary key,
  registry_item_id uuid references public.registry_items on delete cascade not null,
  contributor_name text not null,
  contributor_email text,
  contributor_message text,
  amount numeric not null,
  payment_method text not null check (payment_method in ('bank_transfer', 'momo', 'zalopay')),
  transfer_note text,
  status text default 'pledged' check (status in ('pledged', 'confirmed')),
  created_at timestamptz default now()
);

alter table public.contributions enable row level security;

-- Anyone can insert contributions (no auth needed)
create policy "Anyone can create a contribution"
  on public.contributions for insert with check (true);

-- Registry owner can view contributions for their items
create policy "Registry owners can view contributions"
  on public.contributions for select using (
    exists (
      select 1 from public.registry_items
      join public.registries on registries.id = registry_items.registry_id
      where registry_items.id = contributions.registry_item_id
      and registries.user_id = auth.uid()
    )
  );

-- Registry owner can update contribution status
create policy "Registry owners can update contribution status"
  on public.contributions for update using (
    exists (
      select 1 from public.registry_items
      join public.registries on registries.id = registry_items.registry_id
      where registry_items.id = contributions.registry_item_id
      and registries.user_id = auth.uid()
    )
  );

-- ============================================
-- 6. Auto-create user profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- 7. Auto-set theme based on registry type
-- ============================================
create or replace function public.set_registry_theme()
returns trigger as $$
begin
  new.theme := case new.type
    when 'pregnancy' then '#FDE8F0'
    when 'birthday' then '#FEF3C7'
    when 'wedding' then '#FFFBEB'
    when 'graduation' then '#1E3A5F'
    when 'housewarming' then '#FEF2E8'
    when 'thoi_noi' then '#ECFDF5'
    else '#FEF3C7'
  end;
  return new;
end;
$$ language plpgsql;

create trigger on_registry_set_theme
  before insert or update of type on public.registries
  for each row execute procedure public.set_registry_theme();

-- ============================================
-- 8. Storage bucket for item photos
-- ============================================
insert into storage.buckets (id, name, public)
values ('registry-photos', 'registry-photos', true);

create policy "Anyone can view registry photos"
  on storage.objects for select
  using (bucket_id = 'registry-photos');

create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (bucket_id = 'registry-photos' and auth.role() = 'authenticated');

create policy "Users can delete own photos"
  on storage.objects for delete
  using (bucket_id = 'registry-photos' and auth.uid()::text = (storage.foldername(name))[1]);
