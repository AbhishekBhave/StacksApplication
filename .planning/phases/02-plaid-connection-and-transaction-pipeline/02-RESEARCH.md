# Phase 2 Research — Plaid Connection and Transaction Pipeline

**Phase:** 2 — Plaid Connection and Transaction Pipeline  
**Question:** What do we need to know to plan this phase well?

## Stack alignment

- **Expo (React Native):** Use Plaid’s **official React Native / Expo-compatible** Link SDK (`react-native-plaid-link-sdk` — verify current package name and Expo config plugin in Plaid docs at implementation time). Link runs as native module / modal, not embedded Web credentials UI.
- **Supabase Edge Functions (Deno):** Hold `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` (sandbox|development|production) as **function secrets** only. Client calls `supabase.functions.invoke` with user JWT; functions verify JWT and derive `user_id` from claims.
- **Token exchange:** Mobile receives **public_token** after Link success → send to Edge Function → exchange for **access_token** via Plaid `/item/public_token/exchange` → store **access_token** only in a **server-side** store (Postgres table with **no** `SELECT`/`UPDATE` policies for `authenticated`, or Supabase Vault). **Never** return access_token in JSON responses to the client.
- **Transactions:** Prefer Plaid **`/transactions/sync`** (cursor-based) for incremental updates after initial `/transactions/get` or sync start — reduces duplicates and matches “manual refresh without drift” from roadmap. Persist `sync_cursor` per `item_id` (or per `bank_link`) in a table writable only by service role / Edge Function.

## Data model (extends Phase 1)

| Artifact | Purpose |
|----------|---------|
| `bank_links` (extend) | Non-secret metadata: `plaid_item_id` (optional on client reads — treat as opaque id), `institution_name`, `account_mask`, `last_successful_sync_at`, `status` continues `active`/`revoked`. |
| `plaid_credentials` (new) | `bank_link_id` PK/FK, `access_token` text. **RLS enabled; zero policies for `authenticated` and `anon`.** Inserts/updates only via **service role inside Edge Functions**. |
| `transactions` (extend) | Add columns for analysis + dedupe: `plaid_transaction_id` (text, **UNIQUE per user** or global unique with user scope), `authorized_date` / `posted_date`, `raw_name` (text), `merchant_name` (nullable), `amount` (numeric, Plaid signed convention documented in plan), `iso_currency_code`, `pending` (boolean), `bank_link_id` FK. Normalize for BANK-04 (budgeting later needs category placeholder — optional `personal_finance_category` JSON or text). |

**Disconnect / replace (CONTEXT):** Edge Function calls Plaid `/item/remove` (or equivalent) then sets `bank_links.status = 'revoked'`, deletes `plaid_credentials` row, **`DELETE FROM transactions WHERE user_id = …`** (or `bank_link_id`), respecting one-active-link constraint before new link.

## API surface (Edge Functions — illustrative names)

1. **`plaid-link-token`** — POST, auth required. Body optional metadata. Returns `{ link_token }` only.
2. **`plaid-exchange`** — POST, auth required. Body `{ public_token }`. Creates/updates `bank_links`, stores access token server-side, triggers initial sync (async or inline — planner decides).
3. **`plaid-sync`** — POST, auth required. Runs `/transactions/sync` with stored cursor; upserts transactions idempotently on `plaid_transaction_id` (+ `user_id`).
4. **`plaid-disconnect`** — POST, auth required. Revokes item, clears secrets and transactions per product CONTEXT.

**JWT:** Use `verify_jwt: true` in `config.toml` for these functions (or manual `Authorization` verification) so unauthenticated callers cannot mint link tokens.

## Client bundle & logs (SECU-01 / SECU-02)

- **Client:** No `PLAID_SECRET`, no `OPENAI_*`, no `SUPABASE_SERVICE_ROLE_KEY`. Grep CI check: extend `expo/scripts/check-env.js` or add `expo/scripts/check-plaid-client.js` if needed — only `EXPO_PUBLIC_*` allowed in Expo env validation for this phase.
- **Logging:** Centralize client logger wrapper — strip `access_token`, `public_token`, account numbers, full `link_token` from any `console.log` paths; prefer structured logs without PII on server.

## Pitfalls

- **RLS on secrets table:** If you add a policy by mistake exposing `access_token`, the app fails SECU-01 catastrophically — ship migration + policy review checklist.
- **Duplicate transactions:** Upsert on `(user_id, plaid_transaction_id)` (or Plaid’s unique id field) on every sync.
- **Pending hidden (CONTEXT):** Still **store** `pending` in DB for correctness on refresh; **filter** `pending = false` in API response or client query.
- **Expo Go vs dev client:** Plaid native modules may require **development build** — document in README (not a plan skip reason).

## Validation Architecture

Phase 2 validation should combine:

1. **Static:** `npx tsc --noEmit` in `expo/`, ESLint if configured; `grep` gates for forbidden secret strings in `expo/`.
2. **Unit / integration (where feasible):** Pure functions for dedupe keys, amount normalization; Edge Function tests optional (Deno test) if repo adopts them in Wave 0.
3. **Manual UAT (required for Plaid):** Sandbox institution link, see ≥1 transaction, pull-to-refresh adds/updates without duplicate rows, disconnect clears list and allows relink, verify Network tab shows **no** Plaid secret or access token in client responses.

**Nyquist dimensions:** Cover BANK-* flows end-to-end, explicit migration + `[BLOCKING] supabase db push`, one manual “secrets not in bundle” verification, and refresh/disconnect edge cases.

---

## RESEARCH COMPLETE
