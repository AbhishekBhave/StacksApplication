# Research Summary - Stacks

## Stack

React Native (Expo) + Supabase + Plaid + OpenAI is a strong prototype stack for this product: fast to ship on iOS/Android, secure enough for finance-adjacent workloads when RLS and secret handling are done correctly, and flexible for AI-assisted insights.

## Table Stakes

- Secure auth and one-account bank linking.
- Reliable transaction ingestion (30-day pull + manual refresh).
- Optional budgets and savings goals.
- Transparent affordability output that explains the decision.

## Differentiators

- Stacky-style one-way "Financial Roaster" insights with safe sarcasm.
- "Yes, but..." advice that includes practical behavior adjustments.

## Watch Out For

- Plaid sync correctness and idempotency.
- Supabase RLS misconfigurations.
- Secret leakage into client/logs.
- AI tone drifting from sarcastic-but-safe.
- Scope creep into non-v1 finance features.

## Recommendations for Requirements Phase

1. Keep one-bank-account limit explicit in v1 requirements.
2. Make affordability output structure mandatory: decision + reason + max spend + one action tip.
3. Make budgets/goals optional but first-class.
4. Define security requirements as testable behaviors (not only implementation notes).

---
*Synthesized from stack, features, architecture, and pitfalls research.*

