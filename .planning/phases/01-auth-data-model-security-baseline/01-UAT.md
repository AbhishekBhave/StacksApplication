---
status: complete
phase: 01-auth-data-model-security-baseline
source:
  - 01-PLAN-01-SUMMARY.md
  - 01-PLAN-02-SUMMARY.md
  - 01-PLAN-03-SUMMARY.md
  - 01-PLAN-04-SUMMARY.md
started: 2026-04-19T14:43:59Z
updated: 2026-04-19T20:49:22Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Expo app boots with Supabase env configured
expected: `expo/` runs with `.env` set (URL + anon key) and no missing-env / Supabase URL red-screen errors.
result: issue
reported: "The @expo/lib/supabase.ts calls on the .env file's URLs but it isn't processing"
severity: major

### 2. Jest smoke test passes
expected: `cd expo && npm test -- --ci` completes successfully (green) with the smoke test.
result: pass

### 3. Sign up and sign in (email/password)
expected: In `/(auth)`, switching modes works; sign-up creates an account and sign-in establishes a session that routes you into the authenticated app flow.
result: issue
reported: "The sign up section says the following error no matter what my password is: 'Forbidden use of secret API key' and doesn't let me sign up"
severity: major

### 4. Forgot password sends reset email
expected: On the forgot-password screen, submitting a valid email triggers Supabase password reset email (or a clear success message), without app errors.
result: issue
reported: "In the forgot password tab, it still says 'Forbidden use of secret API key'"
severity: major

### 5. Route guarding works (auth vs app vs onboarding)
expected: If signed out, navigating into `/(app)` bounces you to `/(auth)`. If signed in and onboarding not done, the app routes you into `/(onboarding)` until completed.
result: skipped
reason: "can't test because sign in/sign up is blocked"

### 6. Onboarding completion persists
expected: Completing onboarding sets the local `onboarding_done` flag and you land on the home screen; restarting the app does not show onboarding again (while signed in).
result: skipped

### 7. Home: Connect bank gated on email verification
expected: On home, Connect bank is disabled (with copy) until the user’s `email_confirmed_at` is set; tapping resend triggers verification resend without crashing.
result: skipped

### 8. Sign out clears session and local keys
expected: Signing out returns you to auth flow and clears Supabase session; relaunching the app should not consider you authenticated, and onboarding/auth storage keys are cleared.
result: skipped

### 9. DB migration present for Phase 1 schema + RLS policies
expected: `supabase/migrations/20260418120000_phase1_core.sql` exists and includes Phase 1 tables with RLS enabled and user-scoped policies (profiles, bank_links, transactions, budgets, goals, insights).
result: pass

## Summary

total: 9
passed: 2
issues: 3
pending: 0
skipped: 4

## Gaps

- truth: "Expo app boots with Supabase env configured (EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY are processed and Supabase client does not fail due to missing env values)."
  status: failed
  reason: "User reported: The @expo/lib/supabase.ts calls on the .env file's URLs but it isn't processing"
  severity: major
  test: 1
  artifacts: []
  missing: []

- truth: "Sign up and sign in with email/password works from `/(auth)` without provider key errors."
  status: failed
  reason: "User reported: The sign up section says the following error no matter what my password is: 'Forbidden use of secret API key' and doesn't let me sign up"
  severity: major
  test: 3
  artifacts: []
  missing: []

- truth: "Forgot password works and sends reset flow feedback without forbidden secret-key errors."
  status: failed
  reason: "User reported: In the forgot password tab, it still says 'Forbidden use of secret API key'"
  severity: major
  test: 4
  artifacts: []
  missing: []

