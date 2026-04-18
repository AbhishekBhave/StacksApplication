# Phase 1: Auth, Data Model, Security Baseline - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver secure authentication, a durable per-user data model, and strict access controls so every subsequent feature can assume: users are real accounts, data is partitioned by user, and unauthenticated access to financial tables is impossible.

This phase implements AUTH-01 through AUTH-04 and SECU-03 through SECU-04 as defined in `.planning/REQUIREMENTS.md`. It does not implement Plaid linking, transaction sync, budgeting UX, affordability logic, or AI insights — those are later phases.

</domain>

<decisions>
## Implementation Decisions

### Authentication UX flow
- Use a **single auth screen** with a **toggle** between **Sign up** and **Sign in** (not separate entry flows).
- After account creation, show a **short onboarding carousel**, then land users on a **home shell** with a **prominent Connect bank** call-to-action. **Do not** force Plaid immediately after carousel completion.
- **Email verification** is **not** required to browse the app, but is **required before starting bank linking** (hard gate on Connect bank / Plaid entry).
- Include **Forgot password** in Phase 1 using Supabase’s **email reset link** flow.

### Session and account security behavior
- **Session persistence:** keep the user signed in until they explicitly **Sign out** (no automatic time-based logout in v1 unless a platform constraint forces it).
- **Pre-Plaid re-auth:** require **password re-entry** immediately before launching Plaid Link / bank connection. If optional device biometrics are enabled later, allow biometrics to satisfy this re-auth step when available.
- **Sign-out local data:** on Sign out, **clear the Supabase session** and **clear any on-device cached data** that could reveal balances, transactions, or other financial context (aggressive clear for prototype trust).

### User data model boundaries
- Maintain a **thin `profiles` table** keyed to the auth user, holding **display name** (and only other fields if strictly necessary for app function in Phase 1).
- Create a **full skeleton** of user-scoped finance tables in Phase 1 (may remain empty until later phases): **link metadata**, **transactions**, **budgets**, **goals**, **insights** — each row must be attributable to exactly one user.
- **One linked bank account (v1 constraint):** enforce **at most one active bank link per user** at the database level (prefer a uniqueness constraint / partial unique index on the user’s active link record rather than relying on app logic alone).

### RLS and authorization policy design
- **Default deny:** enable **RLS on all user data tables** and do not rely on implicit access; every table gets explicit policies.
- **Owner-only writes:** authenticated users may **INSERT/UPDATE/DELETE** only their own rows (policies anchored on **`auth.uid()`** matching a stable **`user_id`** / ownership column).
- **`anon` posture:** **no** read/write policies for financial tables for the **`anon`** role; only authenticated flows access finance data.
- **Service role usage:** keep **`service_role`** off the mobile client entirely; reserve it for **trusted server-side** code paths (e.g., Supabase Edge Functions) that handle secret-bearing integrations — still minimize bypass of RLS and prefer writing through tightly scoped, audited functions.

### Claude's Discretion
- **Optional app lock (biometrics / device PIN):** implement **optional biometric unlock** when the device supports it and Expo integration is straightforward; if not, ship without mandatory app-level lock for prototype velocity (OS protections + session + pre-Plaid password still apply).
- **Plaid token storage posture:** do **not** store Plaid **access tokens** in tables that are directly writable/readable by the mobile app under normal `authenticated` policies; treat tokens as **server-side secret material** (implementation detail for Phase 2, but Phase 1 schema and RLS should not assume “token in plain client-visible rows”).

</decisions>

<specifics>
## Specific Ideas

- Onboarding should feel **student-friendly** and **trust-forward** (clear why bank connection exists) before users see the home shell.
- Home shell should make **Connect bank** the obvious next step without trapping users in a dead-end modal flow.

</specifics>

<deferred>
## Deferred Ideas

- **Multi-bank linking**, **push notifications**, **2FA beyond email verification**, **chat assistant**, and **web app** remain out of scope per `.planning/PROJECT.md` — not part of Phase 1 boundary.

</deferred>

---

*Phase: 01-auth-data-model-security-baseline*
*Context gathered: 2026-04-18*
