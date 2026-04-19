# Phase 2: Plaid Connection and Transaction Pipeline - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Reliably connect **one** bank account via Plaid Link, ingest roughly the **last 30 days** of transactions, support **manual refresh** without duplicates or drift, and persist **normalized** transaction rows for downstream budgeting and affordability (BANK-01 through BANK-04, SECU-01, SECU-02). Inherits Phase 1 gates: **verified email** and **password re-entry** immediately before launching Link; **one active link per user**; Plaid **access tokens** remain **server-side** only.

This phase does **not** ship budgets, goals, affordability, or AI insights.

</domain>

<decisions>
## Implementation Decisions

### Plaid Link entry and post-link journey
- Offer Plaid from **both** the home **Connect bank** CTA and a **dedicated Bank / linked account** screen.
- If the user **cancels or abandons** Link, return to the prior screen with a **short friendly message** (e.g. bank not linked yet; can try again anytime).
- On **success**, go **straight to the transaction list** with a **dismissible banner** confirming the bank is connected.
- On **Link-level errors** (institution issues, Plaid errors, etc.), use a **modal or full-screen** error with a **Retry** action and calm copy that it may work later (no real support channel required).

### Transaction list UX
- **Single flat list**, **newest first** (no section grouping by day for v1).
- **Primary row title:** **raw bank description** first; when helpful, a **secondary** line can show merchant or cleaned name when Plaid provides it.
- **Pending transactions:** **hidden until posted** so the list stays simple; updates appear when items settle.
- **Initial load / empty while fetching:** **skeleton list** plus subtle **“Loading transactions…”** copy.

### Manual refresh behavior
- **Pull-to-refresh only** for sync refresh (no separate refresh button).
- Rely on the **standard pull-to-refresh** control and its **built-in** loading affordance; do not block the whole screen with an extra overlay.
- Show **relative last updated** (e.g. “2 min ago”) in a **sensible persistent** place once syncing is meaningful.
- On **refresh failure**, show an **inline banner above the list** until the user **dismisses** it or a **later sync succeeds**.

### Account lifecycle and mistakes
- Users can **disconnect** the linked bank via an explicit **Disconnect bank** action with **confirmation**; after disconnect, UX returns to the **pre-link** state.
- On disconnect (and when replacing a link), **delete stored transactions** for that user’s link for a **clean slate** (prototype simplicity).
- **Replace / switch banks:** **revoke** the old Plaid item (server-side), then run **Link again** while preserving the **one active account** rule.
- If link succeeds but **transactions are not ready yet**, show the **list empty state** with copy like **still fetching** and encourage **pull to refresh** (aligned with refresh-only pattern).

### Claude's Discretion
- Exact **Plaid product** calls and **idempotency** keys, **Edge Function** shape, and **sync scheduling** after initial link.
- **Row layout** details (typography, truncation rules), **banner** visuals, and **skeleton** count or animation.
- Whether to show **amount** left vs right, **sign** conventions, and **category** placeholder columns if not required for BANK-04 minimum.

</decisions>

<specifics>
## Specific Ideas

- Error and cancel copy should stay **student-friendly** and **trust-forward**, consistent with Phase 1 onboarding tone.
- Post-link experience should feel **immediate** (land on data) rather than an extra celebration screen.

</specifics>

<deferred>
## Deferred Ideas

None captured during this discussion — ideas stayed within Phase 2 scope.

</deferred>

---

*Phase: 02-plaid-connection-and-transaction-pipeline*
*Context gathered: 2026-04-19*
