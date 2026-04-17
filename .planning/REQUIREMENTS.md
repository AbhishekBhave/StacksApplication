# Requirements: Stacks

**Defined:** 2026-04-17
**Core Value:** Help young adults make better day-to-day spending decisions from real account data in a way that feels useful, engaging, and immediately actionable.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Authentication & Access

- [ ] **AUTH-01**: User can create an account with email and password.
- [ ] **AUTH-02**: User can sign in and maintain a secure session across app restarts.
- [ ] **AUTH-03**: User can sign out from within the app.
- [ ] **AUTH-04**: User can access only their own financial data through enforced per-user authorization.

### Bank Connection & Data

- [ ] **BANK-01**: User can link exactly one bank account through Plaid Link.
- [ ] **BANK-02**: App imports the last 30 days of transactions after successful account linking.
- [ ] **BANK-03**: User can manually refresh linked account data and transactions.
- [ ] **BANK-04**: App stores normalized transaction data needed for spending analysis and budgeting.

### Budgets & Goals

- [ ] **BUDG-01**: User can optionally create monthly category budgets.
- [ ] **BUDG-02**: User can optionally create savings goals with target amount.
- [ ] **BUDG-03**: User can edit and delete existing budgets and goals.
- [ ] **BUDG-04**: App shows progress indicators for active budgets and goals.

### Affordability Calculator

- [ ] **AFFD-01**: User can enter a prospective purchase amount in the affordability calculator.
- [ ] **AFFD-02**: App returns a decision of "Yes", "No", or "Yes, but..." using balance, recent spending velocity, and active budget/goal context.
- [ ] **AFFD-03**: App provides a plain-language reason for the affordability decision.
- [ ] **AFFD-04**: App provides a suggested maximum spend amount for the user at the decision point.
- [ ] **AFFD-05**: App provides one actionable adjustment tip tied to the user's recent spending behavior.

### Financial Roaster Insights

- [ ] **ROST-01**: App generates one-way AI financial insight cards from recent spending behavior.
- [ ] **ROST-02**: Insight tone is sarcastic-but-safe (Duolingo-like) and avoids abusive or harmful language.
- [ ] **ROST-03**: Each insight includes at least one concrete, actionable improvement step.

### Security & Data Protection

- [ ] **SECU-01**: Plaid and OpenAI secrets are stored server-side only and never exposed in mobile client code.
- [ ] **SECU-02**: Application logging and telemetry redact or avoid unnecessary PII.
- [ ] **SECU-03**: Supabase Row Level Security policies are enabled for all user financial data tables.
- [ ] **SECU-04**: Data access paths enforce authenticated requests for protected resources.

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Advanced Product Expansion

- **V2-01**: User can link and manage multiple bank accounts.
- **V2-02**: User can receive push notifications for budget risk and savings milestones.
- **V2-03**: User can chat conversationally with Stacky (two-way AI assistant).
- **V2-04**: User can access a web client with feature parity to mobile.
- **V2-05**: User can track investment holdings and net worth.
- **V2-06**: User can view credit score and related trend insights.
- **V2-07**: Users can create and manage shared/family budgets.
- **V2-08**: User can manage bill payments and reminders directly within app flows.

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Multi-bank account linking | Deferred to v2 to reduce v1 model and UX complexity |
| Push notifications | Deferred until baseline utility and retention loops are validated |
| Two-way AI chat assistant | v1 focuses on one-way insights to control scope and safety |
| Web application | Mobile-first prototype for fastest validation on target audience |
| Investing features | Not essential to core affordability and budgeting prototype |
| Credit score features | Additional integration complexity outside core v1 loop |
| Shared/family budgets | v1 targets single student user workflows |
| Bill payment workflows | Not required to validate spending-decision product value |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase TBD | Pending |
| AUTH-02 | Phase TBD | Pending |
| AUTH-03 | Phase TBD | Pending |
| AUTH-04 | Phase TBD | Pending |
| BANK-01 | Phase TBD | Pending |
| BANK-02 | Phase TBD | Pending |
| BANK-03 | Phase TBD | Pending |
| BANK-04 | Phase TBD | Pending |
| BUDG-01 | Phase TBD | Pending |
| BUDG-02 | Phase TBD | Pending |
| BUDG-03 | Phase TBD | Pending |
| BUDG-04 | Phase TBD | Pending |
| AFFD-01 | Phase TBD | Pending |
| AFFD-02 | Phase TBD | Pending |
| AFFD-03 | Phase TBD | Pending |
| AFFD-04 | Phase TBD | Pending |
| AFFD-05 | Phase TBD | Pending |
| ROST-01 | Phase TBD | Pending |
| ROST-02 | Phase TBD | Pending |
| ROST-03 | Phase TBD | Pending |
| SECU-01 | Phase TBD | Pending |
| SECU-02 | Phase TBD | Pending |
| SECU-03 | Phase TBD | Pending |
| SECU-04 | Phase TBD | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 0
- Unmapped: 24 ⚠

---
*Requirements defined: 2026-04-17*
*Last updated: 2026-04-17 after initial definition*
