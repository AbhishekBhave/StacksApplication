# Plan 04 summary — Transactions UI, refresh, disconnect

## Delivered

- `expo/lib/transactions.ts` — `fetchTransactionsForUser` queries `from('transactions')` with `pending` filtered to `false`, ordered newest-first.
- `expo/components/TransactionList.tsx` — `FlatList`, `RefreshControl`, skeleton rows, “Loading transactions…”, dismissible success + error banners, empty “still fetching” copy.
- `expo/app/(app)/transactions.tsx` — last-updated header from `bank_links.last_successful_sync_at`, pull-to-refresh invokes `plaid-sync`, `justLinked` success banner.
- `expo/app/(app)/bank.tsx` — **Disconnect bank** and **Replace bank** with confirmation; calls `plaid-disconnect`; replace routes to `pre-plaid`.

## Tests

- `cd expo && npm test -- --ci` — pass.
