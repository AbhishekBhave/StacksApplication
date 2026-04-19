import type { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { plaidPost } from './plaid.ts';

type PlaidTxn = {
  transaction_id: string;
  amount: number;
  date?: string;
  name?: string;
  merchant_name?: string | null;
  pending?: boolean;
  iso_currency_code?: string | null;
};

type SyncResponse = {
  added: PlaidTxn[];
  modified: PlaidTxn[];
  removed: { transaction_id: string }[];
  next_cursor: string | null;
  has_more: boolean;
};

/** Runs Plaid /transactions/sync until caught up; persists rows and cursor. */
export async function runTransactionsSync(
  admin: SupabaseClient,
  userId: string,
  bankLinkId: string,
  accessToken: string,
): Promise<{ insertedOrUpdated: number }> {
  const { data: stateRow } = await admin
    .from('plaid_sync_state')
    .select('transactions_cursor')
    .eq('bank_link_id', bankLinkId)
    .maybeSingle();

  let cursor: string | undefined = stateRow?.transactions_cursor ?? undefined;
  let total = 0;

  // We store pending rows for correctness; the mobile client filters pending=false for display.
  for (;;) {
    const body: Record<string, unknown> = { access_token: accessToken };
    if (cursor) body.cursor = cursor;

    const sync = await plaidPost<SyncResponse>('/transactions/sync', body);

    const upsertRows = [...(sync.added ?? []), ...(sync.modified ?? [])].map((t) => ({
      user_id: userId,
      bank_link_id: bankLinkId,
      plaid_transaction_id: t.transaction_id,
      amount: t.amount,
      posted_date: t.date ?? null,
      raw_name: t.name ?? '',
      merchant_name: t.merchant_name ?? null,
      pending: t.pending ?? false,
      iso_currency_code: t.iso_currency_code ?? 'USD',
    }));

    if (upsertRows.length > 0) {
      const { error } = await admin.from('transactions').upsert(upsertRows, {
        onConflict: 'user_id,plaid_transaction_id',
      });
      if (error) throw new Error(error.message);
      total += upsertRows.length;
    }

    const removedIds = (sync.removed ?? []).map((r) => r.transaction_id).filter(Boolean);
    if (removedIds.length > 0) {
      const { error: delErr } = await admin
        .from('transactions')
        .delete()
        .eq('user_id', userId)
        .in('plaid_transaction_id', removedIds);
      if (delErr) throw new Error(delErr.message);
    }

    cursor = sync.next_cursor ?? undefined;
    await admin.from('plaid_sync_state').upsert({
      bank_link_id: bankLinkId,
      transactions_cursor: cursor ?? null,
      updated_at: new Date().toISOString(),
    });

    if (!sync.has_more) break;
  }

  await admin
    .from('bank_links')
    .update({ last_successful_sync_at: new Date().toISOString() })
    .eq('id', bankLinkId);

  return { insertedOrUpdated: total };
}
