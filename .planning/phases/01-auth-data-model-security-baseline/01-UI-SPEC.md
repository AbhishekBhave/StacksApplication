---
phase: 1
slug: auth-data-model-security-baseline
artifact: ui-spec
status: draft
created: 2026-04-18
---

# Phase 1 — UI Design Contract (Auth, Data Model, Security Baseline)

Design contract for screens and flows in Phase 1. Aligned with `01-CONTEXT.md` and `.planning/REQUIREMENTS.md` (AUTH-01…04, SECU-03…04).

## Design Principles

- **Trust-forward:** Copy explains why bank connection exists before users commit.
- **Student-friendly:** Short, plain language; no finance jargon without explanation.
- **Single auth surface:** One screen with mode toggle, not separate “signup app” vs “login app”.

## Information Architecture

| Route group | Purpose |
|-------------|---------|
| `(auth)` | Sign up / Sign in / Forgot password (unauthenticated) |
| `(onboarding)` | Post-signup carousel only |
| `(app)` | Home shell (authenticated) |

## Screen Specifications

### 1. Auth screen (`(auth)/index` or equivalent)

**Layout**

- App logo / title “Stacks” (or project name).
- Segmented control or pill toggle: **Sign up** | **Sign in** (single screen).
- Email field (keyboard: email).
- Password field (secure entry; optional show/hide).
- Primary CTA: **Create account** (sign-up mode) or **Sign in** (sign-in mode).
- Secondary text button: **Forgot password?** (both modes).
- Inline error region below form (API errors, validation).

**Sign-up mode**

- On success: navigate to onboarding carousel (do not block on email verification for navigation).
- Show non-blocking notice if applicable: “Verify email before connecting a bank.”

**Sign-in mode**

- On success: if onboarding not completed → carousel; else → home shell.

**Forgot password**

- Modal or dedicated sub-screen: email + **Send reset link**.
- Success: confirm “Check your email” (no email enumeration messaging).

### 2. Onboarding carousel (`(onboarding)`)

- **3–4 full-width slides** with illustration placeholder, title, one-line body.
- Themes: (1) why link a bank, (2) privacy / control, (3) what Stacks helps with (decisions), (4) optional “you’re ready”.
- **Primary CTA on last slide:** **Continue** → `(app)/home`.
- **Skip** not required; **Back** on slides after first.

### 3. Home shell (`(app)/home`)

**Authenticated only** (redirect to auth if no session).

**Layout**

- Header: greeting + **Sign out** (overflow or text button).
- Main **Connect bank** card/button (primary visual weight).
- If email unverified: banner or inline state on Connect bank: **Verify your email to connect** + **Resend email** (calls Supabase resend if available).

**Connect bank**

- Phase 1: tapping opens an **interstitial** or alert: “Bank linking arrives in the next build” OR navigates to placeholder screen — **must not** start Plaid. Copy references upcoming phase.

**Sign out**

- Confirm dialog optional; on confirm: clear session + clear local secure storage per CONTEXT.

## Components (Phase 1)

| Component | Behavior |
|-----------|----------|
| `AuthForm` | Toggle mode; validation (non-empty email, password min length 8). |
| `OnboardingCarousel` | Horizontal paging, progress dots. |
| `HomeShell` | Layout + CTA + verification gate UI. |
| `EmailVerificationBanner` | Shown when `user.email_confirmed_at` is null and user taps Connect bank. |

## Motion & Feedback

- **Loading:** Disable CTAs + spinner on auth submit and password reset.
- **Errors:** Supabase messages mapped to short user-facing strings where needed (avoid raw codes).

## Accessibility

- Tap targets ≥ 44pt; labels on text fields; error text associated with fields.

## Out of Scope (Phase 1 UI)

- Plaid Link UI, budgets, goals, affordability, insights, settings beyond sign-out.

---

## UI-SPEC COMPLETE

*Ready for planning and implementation.*
