# Phase 1 Research — Auth, Data Model, Security Baseline

**Phase:** 1 — Auth, Data Model, Security Baseline  
**Question:** What do we need to know to plan this phase well?

## Stack Alignment

- **Expo (React Native) + TypeScript:** Use Expo SDK current stable; `expo-router` for file-based navigation; `expo-secure-store` for sensitive local flags (not refresh tokens if avoidable — session via Supabase client).
- **Supabase Auth:** `signUp`, `signInWithPassword`, `signOut`, `resetPasswordForEmail`; session available via `getSession()`; persist session with AsyncStorage adapter from `@supabase/supabase-js` **or** recommended Expo pattern in Supabase docs (verify at implementation time).
- **RLS:** Every table `ENABLE ROW LEVEL SECURITY`; policies use `auth.uid()` compared to `user_id uuid REFERENCES auth.users(id)`.

## Schema Sketch (Postgres)

| Table | Purpose | Key notes |
|-------|---------|-----------|
| `profiles` | Thin profile row | `id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`, `display_name text` |
| `bank_links` | One link metadata per user (v1) | `user_id`, `status`, partial unique index: one **active** link per user |
| `transactions` | Normalized tx (empty in P1) | `user_id`, FK, RLS owner-only |
| `budgets` | Skeleton | `user_id`, RLS |
| `goals` | Skeleton | `user_id`, RLS |
| `insights` | Skeleton | `user_id`, RLS |

**No Plaid tokens** in client-readable tables in Phase 1; if a placeholder column exists for Phase 2, restrict via RLS so authenticated mobile role cannot SELECT/UPDATE token columns (or omit column until Phase 2).

## RLS Policy Pattern

- **SELECT/INSERT/UPDATE/DELETE:** `USING (auth.uid() = user_id)` / `WITH CHECK (auth.uid() = user_id)` as appropriate.
- **`anon`:** No policies granting access to financial tables for `anon` role — default deny after RLS enabled.

## Mobile Auth UX Patterns

- **Email verification gate:** Check `session.user.email_confirmed_at` (or equivalent) before enabling Connect bank CTA logic.
- **Forgot password:** `redirectTo` must match Supabase Auth redirect allow-list (configure in dashboard + `app.json` / deep link scheme for dev).

## Tooling

- **Local:** Supabase CLI `supabase init`, migrations in `supabase/migrations/*.sql`, `supabase db push` against linked project (or local) — **[BLOCKING]** before treating DB work as verified.
- **Env:** `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` only in client; service role key never in mobile.

## Pitfalls

- Enabling RLS without policies **locks** all access — ship policies in same migration wave as `ENABLE ROW LEVEL SECURITY`.
- Using `service_role` in the app bundle — **never**; violates SECU-01 posture for later secrets too.
- Unique constraint on bank link: use **partial** unique index `WHERE status = 'active'` (or enum) so historical rows don’t block.

## Validation Architecture

Phase 1 validation should combine:

1. **Static checks:** TypeScript `tsc --noEmit`, ESLint if configured.
2. **Unit tests (Wave 0 / incremental):** Auth helpers (email validation), RLS policy smoke tests via Supabase test project or SQL tests if adopted.
3. **Manual UAT:** Sign up, sign in, restart app (session persists), sign out (session cleared), attempt cross-user access blocked (second account or API probe).

**Nyquist dimensions to cover in plans:** functional coverage of AUTH-* and SECU-* acceptance paths, plus explicit migration/RLS verification and one manual “RLS isolation” check.

---

## RESEARCH COMPLETE
