---
phase: 01-auth-data-model-security-baseline
plan: 05
subsystem: auth, mobile, config
tags: [supabase, expo, env-validation, auth-errors]

requires: [plan-01, plan-03, plan-04]
provides:
  - Supabase env fail-fast checks before client initialization
  - Secret/service-role key rejection in Expo client runtime
  - Prestart/pretest env validation script for local development
  - Friendly auth error mapping for key misconfiguration in sign-in/sign-up and forgot-password
  - Updated operator guidance for anon key usage and secret rotation
affects: [phase-1-verification, phase-2-plaid]

tech-stack:
  added: []
  patterns:
    - "Guard EXPO_PUBLIC_SUPABASE_* at boot with explicit required-key checks."
    - "Reject secret/service-role keys in Expo client code."
    - "Map backend key misconfiguration errors to actionable user-facing copy."

key-files:
  created:
    - expo/scripts/check-env.js
  modified:
    - expo/lib/supabase.ts
    - expo/package.json
    - expo/components/AuthForm.tsx
    - expo/app/(auth)/forgot-password.tsx
    - expo/.env.example
    - README.md

key-decisions:
  - "Run env checks in both prestart and pretest to catch misconfiguration before runtime and CI tests."
  - "Treat secret/service-role keys in client runtime as hard failures with remediation text."

patterns-established:
  - "Auth-facing screens should translate provider key misconfiguration errors into setup instructions."

duration: 39min
completed: 2026-04-19
---

# Phase 1: Plan 05 Summary

**Expo auth/env bootstrap now fails fast on missing or unsafe Supabase keys, with preflight env checks and user-facing error guidance that unblocks sign-in, sign-up, and password reset troubleshooting.**

## Performance

- **Duration:** 39 min
- **Completed tasks:** 5/5
- **Files created/modified:** 7

## Task Commits

1. **Task 1: Harden Supabase client env bootstrap** - `5d27a92` (fix)
2. **Task 2: Block secret/service keys in client runtime** - `638a6b5` (fix)
3. **Task 3: Add startup env precheck for local dev** - `0bc092a` (chore)
4. **Task 4: Improve auth flow error mapping** - `a05cccd` (fix)
5. **Task 5: Update local env guidance and operator actions** - `ef11388` (docs)

## Accomplishments

- Added explicit `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` checks in `expo/lib/supabase.ts` before `createClient`.
- Added guard logic in `expo/lib/supabase.ts` and `expo/scripts/check-env.js` to reject `sb_secret_*` and service-role-like keys in Expo client configuration.
- Wired `expo/scripts/check-env.js` into `prestart` and `pretest` in `expo/package.json`.
- Added user-friendly auth misconfiguration messaging in `expo/components/AuthForm.tsx` and `expo/app/(auth)/forgot-password.tsx`.
- Updated `expo/.env.example` and `README.md` with anon/publishable-key guidance, cache-clear restart instruction, and secret key rotation/revocation action.

## Verification

- `cd expo && node scripts/check-env.js` — **fails as expected** in current environment: missing `EXPO_PUBLIC_SUPABASE_URL`.
- `cd expo && npm run start -- --clear` — **fails as expected** at prestart env gate for missing `EXPO_PUBLIC_SUPABASE_URL`.
- `cd expo && npm test -- --ci` — **fails as expected** because `pretest` env check blocks missing `EXPO_PUBLIC_SUPABASE_URL`.
- Manual UAT (`sign up/sign in`, `forgot password`) — **not run** in this session because local `expo/.env` is not configured with required Supabase values.

## Decisions Made

- Enforced fail-fast behavior for missing/misconfigured Supabase env values to avoid ambiguous runtime auth failures.
- Kept auth-flow validation behavior intact for non-key errors while providing actionable key-specific remediation copy.

## Deviations from Plan

None - plan executed as written.

## Issues Encountered

- Local verification environment did not have required `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` values available to this CLI session, so runtime/UAT checks were blocked by the new preflight gate.

## Next Phase Readiness

- Code changes for auth/env gap closure are complete and committed.
- Remaining verification requires a valid local `expo/.env` (anon/publishable key) and rerunning `npm run start -- --clear` plus manual auth UAT.

