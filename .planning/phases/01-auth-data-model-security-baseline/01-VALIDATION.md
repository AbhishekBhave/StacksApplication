---
phase: 1
slug: auth-data-model-security-baseline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-18
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest + `jest-expo` (install in Wave 0 / Plan 01) |
| **Config file** | `expo/jest.config.js` (created with scaffold) |
| **Quick run command** | `cd expo && npm test` |
| **Full suite command** | `cd expo && npm test -- --ci` |
| **Estimated runtime** | ~30–90 seconds |

## Sampling Rate

- **After every task commit:** Run `cd expo && npm test`
- **After every plan wave:** Run `cd expo && npm test -- --ci`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | AUTH-02 | T-1-01 / — | Session stored via Supabase client only | unit | `cd expo && npm test` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 2 | SECU-03 | T-1-02 | RLS enabled + owner policies | manual SQL | `supabase db lint` or dashboard | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 3 | AUTH-01 | — | Sign-up creates auth user | integration / manual | `cd expo && npm test` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

## Wave 0 Requirements

- [ ] `expo/__tests__/example.test.ts` — stub test so `npm test` exits 0
- [ ] `jest-expo` + Jest config wired in Plan 01
- [ ] Document Supabase test project or local DB for RLS manual checks

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|---------------------|
| Session survives app restart | AUTH-02 | Simulator/device lifecycle | Sign in, force-quit, reopen, still on home |
| RLS blocks other user’s row | AUTH-04, SECU-03 | Needs second account or SQL as admin | Create user B; confirm cannot read user A’s `transactions` via client |
| Email gate before bank | AUTH-01 | Product flow | Unverified user sees gate on Connect bank |

## Validation Sign-Off

- [ ] All tasks have `<verify>` or manual map entries
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter when execution complete

**Approval:** pending
