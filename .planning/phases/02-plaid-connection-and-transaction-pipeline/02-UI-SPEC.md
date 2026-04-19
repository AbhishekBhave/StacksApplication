---
phase: 2
slug: plaid-connection-and-transaction-pipeline
artifact: ui-spec
status: draft
created: 2026-04-19
---

# Phase 2 — UI Design Contract (Plaid Connection and Transaction Pipeline)

Design contract for bank linking and transaction surfaces. Aligned with `02-CONTEXT.md`, `01-CONTEXT.md` (gates and pre-Plaid password), and `.planning/REQUIREMENTS.md` (BANK-01…04, SECU-01…02).

## Design Principles

- **Trust-forward / student-friendly:** Same tone as Phase 1 — short, plain language; calm errors; no blamey copy.
- **Immediate value:** After a successful link, land users on **data** (transaction list), not an extra celebration step.
- **Honest states:** Distinguish “nothing yet”, “still fetching”, and “empty after sync” without fake data.

## Information Architecture

| Route / surface | Purpose |
|-----------------|---------|
| `(app)/home` | Existing home; **Connect bank** remains primary path into linking (replaces placeholder when linked: entry to bank area or transactions). |
| `(app)/bank` (or `linked-account`) | **Dedicated bank hub:** link status, institution display, **Disconnect**, path to **Replace bank**, navigation to **Transactions**. |
| `(app)/transactions` | Default **post-link landing:** flat list, pull-to-refresh, banners, last updated. |
| `(app)/pre-plaid` (or modal flow) | **Password re-entry** immediately before opening Plaid Link (per Phase 1). |
| Plaid Link | Native Plaid modal — **no custom WebView** for institution credentials. |

**Entry rule (CONTEXT):** Plaid is reachable from **both** home **Connect bank** and the **Bank / linked account** screen (after link, home may deep-link to transactions or bank hub — planner picks one default as long as both entry points exist).

## Screen Specifications

### 1. Pre-Plaid password gate

- Full-screen or modal: short explanation (“Confirm it’s you before connecting your bank”).
- Secure password field + primary **Continue** (calls Supabase `signInWithPassword` or reauth pattern chosen in implementation — must validate password before Link token fetch).
- **Cancel** returns to previous screen **without** starting Link.
- Inline error on bad password.

### 2. Plaid Link launch

- After password success: fetch link token from **server**, then open Plaid Link SDK.
- **Loading:** disable double-start; show spinner while token loads.
- **User cancels Link:** navigate back with **short friendly message** (SnackBar / toast): e.g. “Bank not linked yet — you can try anytime.”

### 3. Link error (institution down, item error, etc.)

- **Modal or full-screen** error (per CONTEXT).
- Primary **Retry** (re-run token + Link).
- Secondary **Close** returns to bank hub or home.
- Copy: calm, no technical Plaid error codes exposed by default.

### 4. Post-link — Transactions (default landing)

- **Dismissible success banner** at top: “Bank connected” (or similar).
- **Flat list**, **newest first**; **no** day section headers for v1.
- **Row:** primary line = **raw bank description**; secondary = merchant / cleaned name when available.
- **Pending:** do **not** render pending rows (filter client-side or server-side per implementation).
- **Skeleton + “Loading transactions…”** on first load.
- **Last updated** label (relative time) in header area once sync timestamps exist.
- **Pull-to-refresh only** — no separate refresh button.

### 5. Refresh failure

- **Inline banner** above list until user **dismisses** or a **later successful** sync clears it.

### 6. Link success but no transactions yet

- Empty list area with **“Still fetching your transactions”** + hint to **pull to refresh**.

### 7. Bank hub — Linked account

- Shows institution / account mask (non-sensitive metadata only).
- **Disconnect bank** → confirmation dialog (destructive): warns that **local history will be removed** (per CONTEXT: delete stored transactions on disconnect).
- **Replace bank** (optional secondary): confirm → server revokes old item → user runs Link again (same flows as first link).

### 8. Home — Connect bank (linked vs not)

- **Not linked:** existing verification gate; after verified, CTA starts **pre-Plaid → Link** (no placeholder copy).
- **Linked:** CTA may read **View transactions** or **Manage bank** — must still satisfy “entry from home” (CONTEXT); primary navigation should not hide access to transactions.

## Components (Phase 2)

| Component | Behavior |
|-----------|----------|
| `PrePlaidPasswordGate` | Password re-entry; success emits “proceed to link token”. |
| `PlaidLinkLauncher` | Orchestrates token fetch + open Link + result routing. |
| `TransactionList` | FlatList, skeleton, empty states, pull-to-refresh. |
| `DismissibleBanner` | Success + generic info; accessible close control. |
| `SyncErrorBanner` | Dismissible; sync with refresh success. |
| `DisconnectBankDialog` | Confirm + destructive styling. |
| `LastUpdatedHeader` | Relative time from last successful server sync timestamp. |

## Motion & Feedback

- **Link token fetch:** button/CTA disabled + spinner.
- **Pull-to-refresh:** native refresh control animation (no full-screen blocking overlay).
- **Disconnect:** brief loading on confirm until server + local cache cleared.

## Accessibility

- Tap targets ≥ 44pt; banner close buttons labeled; list rows expose combined label (description + amount + date).

## Out of Scope (Phase 2 UI)

- Budgets, goals, affordability UI, AI insights, multi-account pickers, category editing, search/filter.

---

## UI-SPEC COMPLETE

*Ready for planning and implementation.*
