# Plan 05 summary — Client logging hygiene and secret grep gates

## Delivered

- `expo/scripts/check-env.js` — fails if `expo/.env` defines forbidden keys: `PLAID_SECRET`, `PLAID_ACCESS_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY` (case-insensitive; treats `EXPO_PUBLIC_`-prefixed variants as forbidden for the secret names).
- `expo/lib/logger.ts` — `devLog` shallow redaction to `[REDACTED]` for sensitive key names in `__DEV__`.
- `README.md` — **Security — Plaid prototype** subsection stating Plaid secrets belong in Supabase Edge secrets only.

## Optional check

- Creating a temporary `expo/.env` line `PLAID_SECRET=x` causes `node scripts/check-env.js` to exit non-zero (matches plan intent); avoid committing that line.
