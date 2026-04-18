-- Phase 1 core schema: user-scoped tables + RLS + profile bootstrap trigger

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table public.bank_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null check (status in ('active', 'revoked')),
  created_at timestamptz not null default now()
);

create unique index one_active_bank_link_per_user on public.bank_links (user_id)
  where status = 'active';

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  amount numeric,
  category text,
  created_at timestamptz not null default now()
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text,
  amount numeric,
  created_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text,
  target_amount numeric,
  created_at timestamptz not null default now()
);

create table public.insights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  body text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.bank_links enable row level security;
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.goals enable row level security;
alter table public.insights enable row level security;

-- profiles: users manage their own row (id = auth user)
create policy profiles_select_own on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy profiles_update_own on public.profiles
  for update to authenticated using (auth.uid() = id)
  with check (auth.uid() = id);

-- bank_links
create policy bank_links_select_own on public.bank_links
  for select to authenticated using (auth.uid() = user_id);

create policy bank_links_insert_own on public.bank_links
  for insert to authenticated with check (auth.uid() = user_id);

create policy bank_links_update_own on public.bank_links
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy bank_links_delete_own on public.bank_links
  for delete to authenticated using (auth.uid() = user_id);

-- transactions
create policy transactions_select_own on public.transactions
  for select to authenticated using (auth.uid() = user_id);

create policy transactions_insert_own on public.transactions
  for insert to authenticated with check (auth.uid() = user_id);

create policy transactions_update_own on public.transactions
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy transactions_delete_own on public.transactions
  for delete to authenticated using (auth.uid() = user_id);

-- budgets
create policy budgets_select_own on public.budgets
  for select to authenticated using (auth.uid() = user_id);

create policy budgets_insert_own on public.budgets
  for insert to authenticated with check (auth.uid() = user_id);

create policy budgets_update_own on public.budgets
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy budgets_delete_own on public.budgets
  for delete to authenticated using (auth.uid() = user_id);

-- goals
create policy goals_select_own on public.goals
  for select to authenticated using (auth.uid() = user_id);

create policy goals_insert_own on public.goals
  for insert to authenticated with check (auth.uid() = user_id);

create policy goals_update_own on public.goals
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy goals_delete_own on public.goals
  for delete to authenticated using (auth.uid() = user_id);

-- insights
create policy insights_select_own on public.insights
  for select to authenticated using (auth.uid() = user_id);

create policy insights_insert_own on public.insights
  for insert to authenticated with check (auth.uid() = user_id);

create policy insights_update_own on public.insights
  for update to authenticated using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy insights_delete_own on public.insights
  for delete to authenticated using (auth.uid() = user_id);

-- Ensure a profile row exists when a new auth user is created
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(split_part(new.email, '@', 1), ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
