# Feature Research - Stacks

## Table Stakes (Must-Have for v1)

1. **Secure account auth + one bank connection**
   - Email/password auth.
   - Link one bank account via Plaid.
   - Clear connection status and reconnect flow.
   - Complexity: Medium

2. **Transaction ingestion and categorization**
   - Import last 30 days at onboarding.
   - Manual refresh on demand.
   - Basic categorization for spending summaries.
   - Complexity: Medium

3. **Budgeting and savings goal setup**
   - Optional monthly category budgets.
   - Optional savings goals.
   - Progress visibility and over/under budget indicators.
   - Complexity: Medium

4. **Affordability decision flow**
   - Input purchase amount.
   - Compute decision from balance + spending velocity + budget/goal context.
   - Return Yes/No/Yes-but with explanation and guidance.
   - Complexity: Medium-High

5. **Trust/safety baseline**
   - Data access transparency.
   - User auth and secure storage patterns.
   - PII-aware handling and redaction in app telemetry/logs.
   - Complexity: Medium

## Differentiators (High Value for This Product)

1. **Financial Roaster insights (one-way)**
   - Humorous, sarcastic-but-safe weekly or on-demand insight card.
   - Actionable follow-up suggestion included.
   - Complexity: Medium

2. **Tone-consistent assistant personality (Stacky)**
   - Distinct style that keeps users engaged without being abusive.
   - Complexity: Medium

3. **Decision framing that is behaviorally useful**
   - "Yes, but..." output includes tradeoff and specific adjustment tip.
   - Complexity: Medium

## Anti-Features (Deliberately Excluded)

- Bill pay and payment initiation.
- Investment portfolio and brokerage connectivity.
- Credit score and credit simulation.
- Shared/family budgets.
- Web client.
- Push notifications.
- Multi-bank linking.
- Two-way chat assistant.

## Dependencies Between Features

- Auth is prerequisite for all user-scoped data.
- Plaid linking is prerequisite for transaction ingestion and affordability logic.
- Transaction ingestion is prerequisite for velocity/spending analysis.
- Budgets/goals enhance affordability quality but remain optional.
- AI insights depend on normalized transaction + budget context and safety prompt design.

