# Architecture Research - Stacks

## Major Components

1. **Mobile Client (Expo React Native)**
   - Auth screens, Plaid Link flow, dashboard, affordability calculator, budget/goal setup.
   - Calls Supabase APIs/Edge Functions.

2. **Supabase Auth + Postgres**
   - User identity and session management.
   - User-scoped storage for accounts metadata, transactions, budgets, goals, and AI outputs.

3. **Plaid Integration Service (server-side)**
   - Exchange public token for access token.
   - Run `/transactions/sync` and normalize records for DB.

4. **AI Insight Service (server-side)**
   - Build safe prompt context from user spending/budget data.
   - Produce affordability rationale and roaster message with guardrails.

## Data Flow

1. User signs in -> Supabase Auth session created.
2. User links account via Plaid Link -> public token returned to app.
3. App sends token to secure backend function -> Plaid access token stored server-side.
4. Backend syncs transactions (last 30 days initially, then manual refresh).
5. Normalized transactions written to user-scoped tables.
6. User creates optional budgets/goals.
7. Affordability request computes decision from:
   - current balance proxy,
   - recent spend velocity,
   - active budgets/goals.
8. AI service returns:
   - decision (Yes/No/Yes-but),
   - reason,
   - max spend suggestion,
   - one actionable tip.
9. Dashboard shows spending and roaster insights.

## Boundary Rules

- Plaid/OpenAI secrets never in client.
- Client cannot bypass RLS for another user's data.
- Raw sensitive data retained minimally; derived summaries preferred.
- AI output must be constrained by tone/safety policy.

## Suggested Build Order

1. Auth + DB schema + RLS foundations.
2. Plaid Link + token exchange + transaction sync + manual refresh.
3. Budgets/goals CRUD and dashboard rendering.
4. Affordability engine deterministic baseline.
5. AI augmentation for roaster/insight text and explanations.
6. Hardening: telemetry, error paths, reconnection UX, PII redaction checks.

