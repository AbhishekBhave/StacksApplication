# Stacks

## What This Is

Stacks is a cross-platform mobile app for college students and young adults to manage money with less stress and more clarity. It connects one real bank account via Plaid, helps users build optional budgets and savings goals, and delivers practical one-way financial insights through Stacky the Raccoon. The v1 prototype focuses on actionable affordability decisions and behavior change, not full personal-finance feature breadth.

## Core Value

Help young adults make better day-to-day spending decisions from real account data in a way that feels useful, engaging, and immediately actionable.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet -- ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] Users can securely sign in and connect one real bank account through Plaid Link.
- [ ] Users can import the last 30 days of transactions and manually refresh account data.
- [ ] Users can create optional monthly category budgets and optional savings goals.
- [ ] Users can run a "Can I afford this?" check using balance, spending velocity, and budget/goal context.
- [ ] Users receive "Yes", "No", or "Yes, but..." affordability output with reason, max spend guidance, and one action tip.
- [ ] Users receive one-way AI "Financial Roaster" insights in a sarcastic-but-safe tone similar to Duolingo.
- [ ] Sensitive personal data is protected with authentication, PII redaction practices, and secure Supabase data handling.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Bill payments -- not required for initial prototype validation.
- Investing tools -- outside core v1 spending-decision value.
- Credit score features -- adds complexity without supporting immediate prototype goal.
- Shared/family budgets -- single-user student focus first.
- Web application -- mobile-only prototype for faster validation.
- Push notifications -- defer until engagement loops are validated.
- Multi-bank account linking -- one linked account per user in v1.
- Two-way AI chat assistant -- one-way insights only for initial scope control.

## Context

The prototype is designed for iOS and Android using React Native with Expo to ship quickly across both platforms from one codebase. Supabase provides authentication, PostgreSQL storage, and row-level security, while Plaid provides bank connectivity and transaction ingestion. OpenAI powers affordability and roaster insight generation. The product voice should feel direct and playful (sarcastic but not harmful), while still delivering practical recommendations users can act on.

The success bar is functional usefulness: the app should be demonstrably usable and beneficial for real users by helping them make better spending choices with trustworthy financial context.

## Constraints

- **Platform**: iOS and Android (Expo React Native) -- prototype must run natively on both mobile platforms.
- **Bank Integration Scope**: One linked bank account per user -- reduces onboarding and data-model complexity for v1.
- **Data Window**: Last 30 days + manual refresh -- enough context for decisions without building full sync infrastructure.
- **AI Interaction Mode**: One-way insights only -- avoids conversational assistant complexity in prototype stage.
- **Security**: Authentication, PII redaction, and secure Supabase storage/RLS -- required baseline for handling financial data.
- **Scope Discipline**: Strictly three core value loops plus budgets/goals connection -- prevents feature creep.

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Target user is college students/young adults | Strongly defined initial audience improves product decisions and messaging | -- Pending |
| Support one linked bank account in v1 | Reduces integration and UX complexity for prototype speed | -- Pending |
| Affordability logic uses balance + spending velocity + budget/goal context | Produces more realistic decisions than balance-only checks | -- Pending |
| Budgets and savings goals are both supported but optional | Users have different planning preferences; optionality improves usability | -- Pending |
| Financial Roaster tone is sarcastic-but-safe (Duolingo-like) | Keeps feature engaging while avoiding harmful or abusive output | -- Pending |
| AI assistant is one-way insights only in v1 | Maintains scope focus and lowers implementation risk | -- Pending |
| Out-of-scope set includes payments, investing, credit score, shared budgets, web app, and push | Preserves focus on validating the core spending-decision experience | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check -- still the right priority?
3. Audit Out of Scope -- reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-17 after initialization*
