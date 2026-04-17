<!-- gsd-project-start source:PROJECT.md -->
## Project

**Stacks**

Stacks is a cross-platform mobile app for college students and young adults to manage money with less stress and more clarity. It connects one real bank account via Plaid, helps users build optional budgets and savings goals, and delivers practical one-way financial insights through Stacky the Raccoon. The v1 prototype focuses on actionable affordability decisions and behavior change, not full personal-finance feature breadth.

**Core Value:** Help young adults make better day-to-day spending decisions from real account data in a way that feels useful, engaging, and immediately actionable.

### Constraints

- **Platform**: iOS and Android (Expo React Native) -- prototype must run natively on both mobile platforms.
- **Bank Integration Scope**: One linked bank account per user -- reduces onboarding and data-model complexity for v1.
- **Data Window**: Last 30 days + manual refresh -- enough context for decisions without building full sync infrastructure.
- **AI Interaction Mode**: One-way insights only -- avoids conversational assistant complexity in prototype stage.
- **Security**: Authentication, PII redaction, and secure Supabase storage/RLS -- required baseline for handling financial data.
- **Scope Discipline**: Strictly three core value loops plus budgets/goals connection -- prevents feature creep.
<!-- gsd-project-end -->

<!-- gsd-stack-start source:research/STACK.md -->
## Technology Stack

## Recommended Stack (2026)
### Mobile App
- **React Native + Expo (TypeScript)**  
### Backend + Data
- **Supabase (Postgres, Auth, Storage, Edge Functions, RLS)**  
### Banking Data
- **Plaid Link + Plaid Transactions API (`/transactions/sync`)**  
### AI Logic
- **OpenAI API (server-side invocation only)**  
### Client State + Local Cache
- **Zustand + Expo SecureStore (+ optional local SQLite cache)**  
### Observability
- **Sentry (errors/performance) + PostHog (product analytics, optional)**  
## Version Guidance
- Expo SDK: latest stable compatible with React Native version in Expo release notes.
- Supabase JS: latest stable.
- Plaid SDK/Link: latest stable mobile-compatible version.
- OpenAI SDK: latest stable server-side SDK.
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
<!-- gsd-stack-end -->

<!-- gsd-conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- gsd-conventions-end -->

<!-- gsd-architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- gsd-architecture-end -->

<!-- gsd-skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.cursor/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- gsd-skills-end -->

<!-- gsd-workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- gsd-workflow-end -->



<!-- gsd-profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- gsd-profile-end -->
