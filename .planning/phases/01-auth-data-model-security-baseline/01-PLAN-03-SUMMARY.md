---
phase: 01-auth-data-model-security-baseline
plan: 03
subsystem: mobile, auth, ui
tags: [expo-router, supabase-auth]

requires: [plan-01]
provides:
  - Auth route group with sign-up/in toggle and forgot-password screen
  - Session-aware root index and (app) layout guard
  - Onboarding carousel route (horizontal FlatList) with onboarding_done persistence
affects: [plan-04]

tech-stack:
  added: []
  patterns: ["expo-router groups (auth), (app), (onboarding)", "Supabase auth listeners at root"]

key-files:
  created:
    - expo/components/AuthForm.tsx
    - expo/app/(auth)/*
    - expo/app/(app)/_layout.tsx
    - expo/app/(onboarding)/*
    - expo/app/index.tsx
  modified:
    - expo/app/_layout.tsx
    - expo/.env.example

key-decisions:
  - "Onboarding carousel implemented in Wave 2 so sign-up navigation to /(onboarding) resolves without a missing route."

patterns-established:
  - "Password min length 8 client-side; Supabase errors surfaced as inline message."

duration: 45min
completed: 2026-04-18
---

# Phase 1: Plan 03 Summary

**Mobile auth surfaces with Supabase email/password, forgot-password flow, protected app group, and onboarding entry with AsyncStorage completion flag.**

## Task Commits

- **Plans 03–04 (combined commit)** — `9830ca9` — auth UI, onboarding, and home shell delivered together to avoid a broken intermediate home route.

## Accomplishments

- `AuthForm` with sign-up / sign-in modes, `signUp` + `signInWithPassword`, and forgot-password screen using `resetPasswordForEmail` with optional `EXPO_PUBLIC_AUTH_REDIRECT`.
- Root `app/index.tsx` routes by session + `onboarding_done`; `(app)/_layout.tsx` redirects unauthenticated users to `/(auth)`; root `onAuthStateChange` sends `SIGNED_OUT` users to auth stack.
- Onboarding: horizontal paged `FlatList`, Back/Continue on last slide sets `onboarding_done` and navigates home.

## Verification

- `npx tsc --noEmit` — pass.
- Grep: `signInWithPassword`, `signUp`, `resetPasswordForEmail`, `HOME_PLACEHOLDER` removed in final tree (home replaced in plan 04 in same commit).
