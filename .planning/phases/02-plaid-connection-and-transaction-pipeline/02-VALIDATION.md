---
phase: 02
slug: plaid-connection-and-transaction-pipeline
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-19
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest (`jest-expo`) |
| **Config file** | `expo/jest.config.js` |
| **Quick run command** | `cd expo && npm test -- --ci` |
| **Full suite command** | `cd expo && npm test -- --ci` |
| **Estimated runtime** | ~30–90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd expo && npm test -- --ci`
- **After every plan wave:** Run `cd expo && npm test -- --ci` plus grep secret checks where plans add scripts
- **Before `/gsd-verify-work`:** Full suite green + manual Plaid sandbox UAT complete
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | BANK-04 | T-2-01 | RLS unchanged for user data | grep | `rg plaid_access_tokens supabase/migrations` | ✅ | ⬜ pending |
| 2-02-01 | 02 | 1 | SECU-01 | T-2-02 | No secret in function response types | manual+grep | `rg PLAID_SECRET expo/` | ✅ | ⬜ pending |
| 2-03-01 | 03 | 2 | BANK-01 | T-2-03 | JWT required before link token | manual | Plaid sandbox link | ❌ manual | ⬜ pending |
| 2-04-01 | 04 | 2 | BANK-02,03 | — | Refresh idempotent | manual | pull refresh twice | ❌ manual | ⬜ pending |
| 2-05-01 | 05 | 2 | SECU-02 | T-2-04 | Logs redact tokens | grep | `rg console.log expo/lib` optional | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Existing `expo/__tests__/` smoke tests remain green after dependency adds.
- [ ] If Edge Function tests are not introduced, document **manual** Plaid sandbox checklist in `02-VERIFICATION.md` during execution.

*Edge Function automated tests optional for prototype velocity.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Plaid Link sandbox | BANK-01 | Requires Plaid UI + device | Use Plaid sandbox credentials; complete Link; land on transactions. |
| No access_token in client traffic | SECU-01 | Network inspection | Charles/Flipper/React Native network inspector: confirm responses contain only `link_token` / public data. |
| Disconnect wipes rows | BANK-03, CONTEXT | DB + UX | After disconnect, transactions empty; relink allowed. |

---

## Validation Sign-Off

- [ ] All tasks have `<verify>` or documented manual steps
- [ ] Sampling continuity maintained across waves
- [ ] `[BLOCKING] supabase db push` executed after schema migration tasks
- [ ] `nyquist_compliant: true` set after execution wave

**Approval:** pending
