-- Phase 2: Plaid metadata, normalized transactions, server-only credentials/sync cursors
-- server-only: Edge Functions use service role for plaid_credentials and plaid_sync_state

alter table public.bank_links add column if not exists plaid_item_id text;
alter table public.bank_links add column if not exists institution_name text;
alter table public.bank_links add column if not exists account_mask text;
alter table public.bank_links add column if not exists last_successful_sync_at timestamptz;

create table if not exists public.plaid_credentials (
  bank_link_id uuid primary key references public.bank_links (id) on delete cascade,
  access_token text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.plaid_sync_state (
  bank_link_id uuid primary key references public.bank_links (id) on delete cascade,
  transactions_cursor text,
  updated_at timestamptz not null default now()
);

alter table public.transactions add column if not exists bank_link_id uuid references public.bank_links (id) on delete cascade;
alter table public.transactions add column if not exists plaid_transaction_id text;
alter table public.transactions add column if not exists posted_date date;
alter table public.transactions add column if not exists raw_name text;
alter table public.transactions add column if not exists merchant_name text;
alter table public.transactions add column if not exists pending boolean not null default false;
alter table public.transactions add column if not exists iso_currency_code text default 'USD';

create unique index if not exists transactions_user_plaid_id_key
  on public.transactions (user_id, plaid_transaction_id)
  where plaid_transaction_id is not null;

alter table public.plaid_credentials enable row level security;
alter table public.plaid_sync_state enable row level security;

-- No policies for authenticated/anon on plaid_credentials or plaid_sync_state (server-only).

revoke all on public.plaid_credentials from anon, authenticated;
revoke all on public.plaid_sync_state from anon, authenticated;
