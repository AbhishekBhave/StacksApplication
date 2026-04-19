# Plan 02 summary — Supabase Edge Functions for Plaid

## Delivered

- Edge Functions: `plaid-link-token`, `plaid-exchange`, `plaid-sync`, `plaid-disconnect` under `supabase/functions/` with shared modules `_shared/` (CORS, auth, Plaid REST helper, cursor sync).
- `supabase/config.toml` entries with `verify_jwt = true` for all four functions.
- `plaid-exchange` calls Plaid `/item/public_token/exchange` and accepts JSON `{ "public_token": "..." }`.
- `plaid-sync` uses Plaid `/transactions/sync` (via `_shared/plaid.ts` `plaidPost`).

## Deploy

- Ran: `supabase functions deploy plaid-link-token plaid-exchange plaid-sync plaid-disconnect`
- Result: success — `Deployed Functions on project kergvsckppioovgehnde: plaid-link-token, plaid-exchange, plaid-sync, plaid-disconnect`

## Operator follow-up

- Set remote secrets before first link (sandbox example):

  `supabase secrets set PLAID_CLIENT_ID=<id> PLAID_SECRET=<secret> PLAID_ENV=sandbox`
