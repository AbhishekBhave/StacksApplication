# Plan 01 summary — Plaid schema, secrets table, and RLS

## Delivered

- Added `supabase/migrations/20260419140000_phase2_plaid.sql` with `bank_links` Plaid metadata columns, `plaid_credentials`, `plaid_sync_state`, extended `transactions`, partial unique index `transactions_user_plaid_id_key`, RLS enabled on secret tables with **no** authenticated policies, and `REVOKE ALL` on `plaid_credentials` / `plaid_sync_state` for `anon` and `authenticated`.

## Verification

- `supabase db push` completed successfully from repo root (migration `20260419140000_phase2_plaid.sql` applied to linked project). Output included: `Applying migration 20260419140000_phase2_plaid.sql...` / `Finished supabase db push.`

## Notes

- No `access_token` column on `bank_links`; tokens live only in `plaid_credentials`.
