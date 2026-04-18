---
phase: 01-auth-data-model-security-baseline
plan: 04
subsystem: mobile, auth, ui
tags: [session, async-storage, email-verification]

requires: [plan-01, plan-03]
provides:
  - Authenticated home shell with Connect bank CTA
  - Email verification gate before connect navigation
  - Sign-out clearing Supabase session and local AsyncStorage keys
  - Phase 2 placeholder screen for bank linking
affects: [phase-2-plaid]

tech-stack:
  added: []
  patterns: ["clearLocalAuthStorage for @supabase + onboarding_done + stacks.* keys"]

key-files:
  created:
    - expo/lib/auth-storage.ts
    - expo/app/(app)/connect-bank-placeholder.tsx
  modified:
    - expo/app/(app)/home.tsx

key-decisions:
  - "Combined implementation commit with plan 03 to keep navigation coherent."

patterns-established:
  - "Connect bank checks user.email_confirmed_at; resend uses supabase.auth.resend."

duration: 20min
completed: 2026-04-18
---

# Phase 1: Plan 04 Summary

**Home shell with verification-gated bank connect, Phase 2 placeholder route, and sign-out that clears Supabase plus targeted AsyncStorage keys.**

## Task Commits

- **Plans 03–04** — `9830ca9`

## Accomplishments

- `home.tsx` loads `getUser()`, shows greeting and Sign out; Connect bank disabled with copy until `email_confirmed_at` is set; Resend verification path.
- `connect-bank-placeholder.tsx` states Phase 2 bank linking.
- `clearLocalAuthStorage()` removes `@supabase*` keys, `onboarding_done`, and `stacks.*` prefixes after `signOut()`.

## Verification

- `grep -q email_confirmed_at expo/app/(app)/home.tsx` — yes.
- `grep -q signOut expo/app/(app)/home.tsx` — yes.
- `grep -q Phase 2 expo/app/(app)/connect-bank-placeholder.tsx` — yes.
