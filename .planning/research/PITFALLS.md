# Pitfalls Research - Stacks

## 1) Weak Plaid Sync Semantics

- **Pitfall:** Using one-off fetch patterns and not implementing robust `/transactions/sync` pagination/retry behavior.
- **Warning signs:** Duplicate/missing transactions, stale balances, drift between screens.
- **Prevention:** Centralize sync logic server-side, handle mutation-during-pagination errors by restarting loop, use idempotent upserts.
- **Phase mapping:** Foundation + Plaid integration phase.

## 2) Over-Permissive Data Access

- **Pitfall:** Missing or weak Supabase RLS policies exposing cross-user finance data.
- **Warning signs:** Queries work unexpectedly without strict user filters; "quick fix" service role use in client code.
- **Prevention:** Enable RLS on every user table, test policies per role, never expose service role in mobile app.
- **Phase mapping:** Data model/auth phase.

## 3) Secret Leakage

- **Pitfall:** Logging tokens or embedding API secrets in client bundle.
- **Warning signs:** Keys in app source, verbose logs containing auth/token payloads.
- **Prevention:** Keep Plaid/OpenAI secrets in server environment only, scrub logs, rotate keys regularly.
- **Phase mapping:** Infrastructure/security phase.

## 4) AI Tone/Safety Regression

- **Pitfall:** Roaster output becomes insulting, non-actionable, or unsafe.
- **Warning signs:** User reports tone feels hostile; recommendations are generic or contradictory.
- **Prevention:** Prompt guardrails, banned content checks, deterministic fallback text, explicit "sarcastic but safe" evaluation samples.
- **Phase mapping:** AI insights phase.

## 5) Scope Creep from Adjacent Finance Features

- **Pitfall:** Pulling in payments, investing, credit tools, and notifications too early.
- **Warning signs:** Roadmap swelling, unstable MVP, delayed core loop delivery.
- **Prevention:** Enforce out-of-scope list and gate additions behind post-v1 validation.
- **Phase mapping:** Requirements and roadmap governance.

## 6) Low User Trust Due to Opaque Calculations

- **Pitfall:** "Can I afford this?" answers feel arbitrary.
- **Warning signs:** Users ignore recommendations or question reliability.
- **Prevention:** Always show reason + max spend guidance + one specific adjustment tip.
- **Phase mapping:** Affordability feature phase.

