# Roadmap: Stacks

**Created:** 2026-04-17  
**Project:** Stacks  
**Total phases:** 5  
**v1 requirements mapped:** 24/24

## Phase Table

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | Auth, Data Model, Security Baseline | Establish secure user identity, data model, and access controls | AUTH-01, AUTH-02, AUTH-03, AUTH-04, SECU-03, SECU-04 | 5 |
| 2 | Plaid Connection and Transaction Pipeline | Link one bank account and ingest reliable 30-day + manual refresh transaction data | BANK-01, BANK-02, BANK-03, BANK-04, SECU-01, SECU-02 | 5 |
| 3 | Budgets and Goals Experience | Enable optional budgets and goals tied to user spending context | BUDG-01, BUDG-02, BUDG-03, BUDG-04 | 4 |
| 4 | Affordability Decision Engine | Deliver actionable "Can I afford this?" outcomes grounded in user financial behavior | AFFD-01, AFFD-02, AFFD-03, AFFD-04, AFFD-05 | 5 |
| 5 | Stacky Insights and Product Hardening | Ship one-way roaster insights with safe tone and complete end-to-end readiness | ROST-01, ROST-02, ROST-03 | 5 |

## Phase Details

### Phase 1: Auth, Data Model, Security Baseline

**Goal:** Build trusted foundations for identity, authorization, and secure data boundaries.

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, SECU-03, SECU-04

**UI hint**: yes

**Success criteria:**
1. User can sign up, sign in, and sign out across iOS/Android builds.
2. Authenticated session persists securely across app restart.
3. User-scoped tables exist for accounts, transactions, budgets, goals, and insights.
4. Supabase RLS policies prevent cross-user reads/writes in protected tables.
5. Protected routes and APIs reject unauthenticated access.

### Phase 2: Plaid Connection and Transaction Pipeline

**Goal:** Reliably connect one bank account and maintain fresh transaction data.

**Requirements:** BANK-01, BANK-02, BANK-03, BANK-04, SECU-01, SECU-02

**UI hint**: yes

**Success criteria:**
1. User can complete Plaid Link flow for one account successfully.
2. Last 30 days of transactions are imported and visible after linking.
3. Manual refresh updates transactions without duplicates or data drift.
4. Plaid/OpenAI secrets remain server-side and absent from client bundle/logs.
5. Logging/telemetry pipeline avoids or redacts unnecessary PII fields.

### Phase 3: Budgets and Goals Experience

**Goal:** Provide optional planning tools that enrich user financial context.

**Requirements:** BUDG-01, BUDG-02, BUDG-03, BUDG-04

**UI hint**: yes

**Success criteria:**
1. User can create monthly category budgets or skip this feature entirely.
2. User can create savings goals or skip this feature entirely.
3. User can edit/delete budgets and goals without data inconsistency.
4. Dashboard shows accurate progress indicators for active budgets/goals.

### Phase 4: Affordability Decision Engine

**Goal:** Deliver explainable spending decisions users can immediately act on.

**Requirements:** AFFD-01, AFFD-02, AFFD-03, AFFD-04, AFFD-05

**UI hint**: yes

**Success criteria:**
1. User can submit purchase amount and receive fast result.
2. Decision logic uses balance, recent spend velocity, and budget/goal context.
3. Result always includes a clear reason statement.
4. Result always includes suggested max spend.
5. Result always includes one specific behavior adjustment tip.

### Phase 5: Stacky Insights and Product Hardening

**Goal:** Ship tone-safe AI insights and finalize reliable prototype readiness.

**Requirements:** ROST-01, ROST-02, ROST-03

**UI hint**: yes

**Success criteria:**
1. User receives one-way AI financial insight cards from current spending context.
2. Insight output adheres to sarcastic-but-safe tone policy.
3. Every insight contains at least one concrete action step.
4. Core user flow (auth -> link -> data -> budget/goal -> affordability -> roaster) works end-to-end.
5. Key failure states (link failure, sync failure, AI fallback) are handled with usable UX.

## Coverage Validation

Every v1 requirement from `.planning/REQUIREMENTS.md` maps to exactly one phase.

- Total v1 requirements: 24
- Requirements mapped: 24
- Unmapped: 0

---
*Last updated: 2026-04-17 after initial roadmap creation*
