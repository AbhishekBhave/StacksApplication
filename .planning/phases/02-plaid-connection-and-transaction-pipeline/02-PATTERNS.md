# Phase 2 — Pattern Map

**Phase:** 02 — Plaid Connection and Transaction Pipeline  
**Output:** Closest analogs in-repo for planners/executors.

## Existing files to mirror

| Role | File | Pattern to reuse |
|------|------|-------------------|
| Authenticated shell + CTA | `expo/app/(app)/home.tsx` | `supabase.auth.getUser()`, email verification gate before sensitive action, `router.push` navigation. |
| Placeholder route to replace | `expo/app/(app)/connect-bank-placeholder.tsx` | Simple centered `View` + `Text`; replace with real flow entry or redirect. |
| Supabase client | `expo/lib/supabase.ts` | `createClient`, session persistence — use for `functions.invoke`. |
| Env fail-fast | `expo/scripts/check-env.js` | Extend with **deny-list** for forbidden secret names in client env. |
| Phase 1 schema / RLS | `supabase/migrations/20260418120000_phase1_core.sql` | `bank_links`, `transactions`, RLS owner-only pattern; extend with new tables/columns in **new** migration. |
| Plan / task XML shape | `.planning/phases/01-auth-data-model-security-baseline/01-PLAN-01.md` | YAML frontmatter, `<threat_model>`, `<tasks>` with `<read_first>`, `<action>`, `<acceptance_criteria>`, `<verify>`. |

## Code excerpts (reference)

**Home — connect gate (email verification):**

```48:57:expo/app/(app)/home.tsx
  function onConnectBank() {
    setResendMessage(null);
    if (!user) return;
    if (!user.email_confirmed_at) {
      setConnectHint('Verify your email to connect a bank');
      return;
    }
    setConnectHint(null);
    router.push('/(app)/connect-bank-placeholder');
  }
```

**Phase 1 `bank_links` + partial unique index:**

```9:17:supabase/migrations/20260418120000_phase1_core.sql
create table public.bank_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null check (status in ('active', 'revoked')),
  created_at timestamptz not null default now()
);

create unique index one_active_bank_link_per_user on public.bank_links (user_id)
  where status = 'active';
```

## New integrations (no in-repo analog)

- **Plaid Link SDK** — follow Plaid official React Native installation (pod / gradle / Expo dev client).
- **Supabase Edge Functions** — create under `supabase/functions/*` with shared CORS + JWT verification pattern from Supabase docs.

---

## PATTERN MAPPING COMPLETE
