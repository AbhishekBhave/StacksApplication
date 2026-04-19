---
status: testing
phase: 01-auth-data-model-security-baseline
source:
  - 01-PLAN-01-SUMMARY.md
  - 01-PLAN-02-SUMMARY.md
  - 01-PLAN-03-SUMMARY.md
  - 01-PLAN-04-SUMMARY.md
  - 01-PLAN-05-SUMMARY.md
started: 2026-04-19T14:43:59Z
updated: 2026-04-19T22:15:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Expo app boots with Supabase env configured
expected: |
  From `expo/` with `.env` containing valid `EXPO_PUBLIC_SUPABASE_URL` and anon/publishable `EXPO_PUBLIC_SUPABASE_ANON_KEY`: `node scripts/check-env.js` exits 0; `npm run start -- --clear` runs past prestart and reaches the Expo dev UI without missing-env red-screen or immediate Supabase URL/key failure.
awaiting: user response

## Tests

### 1. Expo app boots with Supabase env configured
expected: From `expo/` with `.env` containing valid `EXPO_PUBLIC_SUPABASE_URL` and anon/publishable `EXPO_PUBLIC_SUPABASE_ANON_KEY`: `node scripts/check-env.js` exits 0; `npm run start -- --clear` runs past prestart and reaches the Expo dev UI without missing-env red-screen or immediate Supabase URL/key failure.
result: pending

### 2. Jest smoke test passes
expected: `cd expo && npm test -- --ci` completes successfully (green) with the smoke test.
result: pass

### 3. Sign up and sign in (email/password)
expected: In `/(auth)`, switching modes works; sign-up creates an account and sign-in establishes a session that routes you into the authenticated app flow.
result: pending

### 4. Forgot password sends reset email
expected: On the forgot-password screen, submitting a valid email triggers Supabase password reset email (or a clear success message), without app errors.
result: pending

### 5. Route guarding works (auth vs app vs onboarding)
expected: If signed out, navigating into `/(app)` bounces you to `/(auth)`. If signed in and onboarding not done, the app routes you into `/(onboarding)` until completed.
result: pending

### 6. Onboarding completion persists
expected: Completing onboarding sets the local `onboarding_done` flag and you land on the home screen; restarting the app does not show onboarding again (while signed in).
result: pending

### 7. Home: Connect bank gated on email verification
expected: On home, Connect bank is disabled (with copy) until the user’s `email_confirmed_at` is set; tapping resend triggers verification resend without crashing.
result: pending

### 8. Sign out clears session and local keys
expected: Signing out returns you to auth flow and clears Supabase session; relaunching the app should not consider you authenticated, and onboarding/auth storage keys are cleared.
result: pending

### 9. DB migration present for Phase 1 schema + RLS policies
expected: `supabase/migrations/20260418120000_phase1_core.sql` exists and includes Phase 1 tables with RLS enabled and user-scoped policies (profiles, bank_links, transactions, budgets, goals, insights).
result: pass

## Summary

total: 9
passed: 2
issues: 0
pending: 7
skipped: 0

## Gaps

*Below: historical gaps from UAT round 1 (before Plan 05 closure). New issues from this round append under separate YAML entries.*

- truth: "Expo app boots with Supabase env configured (EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY are processed and Supabase client does not fail due to missing env values)."
  status: failed
  reason: "User reported: The @expo/lib/supabase.ts calls on the .env file's URLs but it isn't processing"
  severity: major
  test: 1
  root_cause: "Supabase client initializes at import time with EXPO_PUBLIC vars but missing-env is not validated before createClient; when Expo env injection is absent/stale, runtime crashes with 'supabaseUrl is required'."
  artifacts:
    - path: "expo/lib/supabase.ts"
      issue: "Top-level createClient uses process.env values without explicit required-var guard."
    - path: "expo/package.json"
      issue: "No startup env validation script to fail fast when required EXPO_PUBLIC vars are absent."
  missing:
    - "Add explicit required env checks before createClient and show actionable config errors."
    - "Document and enforce Expo start from expo/ and cache-cleared restart after env changes."
    - "Add optional prestart env-check command to detect missing keys early."

- truth: "Sign up and sign in with email/password works from `/(auth)` without provider key errors."
  status: failed
  reason: "User reported: The sign up section says the following error no matter what my password is: 'Forbidden use of secret API key' and doesn't let me sign up"
  severity: major
  test: 3
  root_cause: "Client auth uses EXPO_PUBLIC_SUPABASE_ANON_KEY, but local env was configured with a secret key (sb_secret_...) instead of an anon/publishable key, so Supabase rejects mobile auth requests."
  artifacts:
    - path: "expo/.env"
      issue: "EXPO_PUBLIC_SUPABASE_ANON_KEY set to secret key rather than anon/publishable key."
    - path: "expo/lib/supabase.ts"
      issue: "No guard to block secret/service-role key prefixes in client runtime config."
    - path: "expo/components/AuthForm.tsx"
      issue: "signUp/signIn path surfaces backend forbidden-key error directly."
  missing:
    - "Replace EXPO_PUBLIC_SUPABASE_ANON_KEY with project anon/publishable key."
    - "Rotate/revoke leaked secret key in Supabase dashboard."
    - "Add runtime key-format guard (reject sb_secret/service-role values)."
    - "Restart Expo after env fix and re-test sign up/sign in."

- truth: "Forgot password works and sends reset flow feedback without forbidden secret-key errors."
  status: failed
  reason: "User reported: In the forgot password tab, it still says 'Forbidden use of secret API key'"
  severity: major
  test: 4
  root_cause: "Forgot-password flow shares the same misconfigured client key (secret instead of anon), so resetPasswordForEmail requests are rejected with forbidden-key error."
  artifacts:
    - path: "expo/.env"
      issue: "Client-exposed env key is secret key."
    - path: "expo/lib/supabase.ts"
      issue: "Shared client initialization has no key-type validation."
    - path: "expo/app/(auth)/forgot-password.tsx"
      issue: "resetPasswordForEmail uses shared client and inherits bad key configuration."
  missing:
    - "Use anon/publishable key for EXPO_PUBLIC_SUPABASE_ANON_KEY."
    - "Add client-side guard against secret key prefixes."
    - "Re-run forgot-password UAT after env correction."

