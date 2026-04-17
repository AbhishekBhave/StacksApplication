# Stack Research - Stacks

## Recommended Stack (2026)

### Mobile App
- **React Native + Expo (TypeScript)**  
  **Why:** Fast cross-platform shipping for iOS/Android, strong DX for prototype velocity.  
  **Confidence:** High

### Backend + Data
- **Supabase (Postgres, Auth, Storage, Edge Functions, RLS)**  
  **Why:** Fast secure backend setup with strong PostgreSQL primitives and access control policies.  
  **Confidence:** High

### Banking Data
- **Plaid Link + Plaid Transactions API (`/transactions/sync`)**  
  **Why:** Standard US bank-linking integration with incremental transaction sync semantics.  
  **Confidence:** High

### AI Logic
- **OpenAI API (server-side invocation only)**  
  **Why:** Personalized affordability and roaster insight generation from normalized transaction/budget context.  
  **Confidence:** High

### Client State + Local Cache
- **Zustand + Expo SecureStore (+ optional local SQLite cache)**  
  **Why:** Lightweight state management and secure handling of local session/token metadata.  
  **Confidence:** Medium

### Observability
- **Sentry (errors/performance) + PostHog (product analytics, optional)**  
  **Why:** Needed to verify prototype reliability and usefulness.  
  **Confidence:** Medium

## Version Guidance

- Expo SDK: latest stable compatible with React Native version in Expo release notes.
- Supabase JS: latest stable.
- Plaid SDK/Link: latest stable mobile-compatible version.
- OpenAI SDK: latest stable server-side SDK.

Use current official docs at implementation time to pin exact versions.

## What Not To Use (For v1)

- **Custom backend from scratch** for auth/data: slower and unnecessary for prototype.
- **Client-side OpenAI calls** with secret keys: security risk.
- **`/transactions/get` first approach** when sync is needed: higher reconciliation complexity than `/transactions/sync`.
- **Multi-bank/multi-ledger model in v1:** adds avoidable product and data model complexity.
- **Two-way AI chat in v1:** distracts from core affordability loop and budget utility.

## Security Baseline

- Keep Plaid access tokens and OpenAI keys server-side only.
- Enforce Supabase RLS on all user data tables.
- Redact or avoid storing unnecessary PII in logs and analytics.
- Store only required fields for transaction analysis and budgeting.

