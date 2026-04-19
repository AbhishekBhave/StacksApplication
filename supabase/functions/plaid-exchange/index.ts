import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getUserId, supabaseServiceClient } from '../_shared/auth.ts';
import { plaidPost } from '../_shared/plaid.ts';
import { runTransactionsSync } from '../_shared/sync.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(req);
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);

  let body: { public_token?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }
  const public_token = body.public_token;
  if (!public_token || typeof public_token !== 'string') {
    return jsonResponse({ error: 'public_token required' }, 400);
  }

  const admin = supabaseServiceClient();

  const { data: activeLinks } = await admin
    .from('bank_links')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active');

  for (const row of activeLinks ?? []) {
    const { data: cred } = await admin
      .from('plaid_credentials')
      .select('access_token')
      .eq('bank_link_id', row.id)
      .maybeSingle();

    if (cred?.access_token) {
      try {
        await plaidPost('/item/remove', { access_token: cred.access_token });
      } catch {
        // Continue teardown even if Plaid already revoked the item.
      }
    }

    await admin.from('transactions').delete().eq('bank_link_id', row.id);
    await admin.from('plaid_credentials').delete().eq('bank_link_id', row.id);
    await admin.from('plaid_sync_state').delete().eq('bank_link_id', row.id);
    await admin.from('bank_links').delete().eq('id', row.id);
  }

  const exchange = await plaidPost<{ access_token: string; item_id: string }>(
    '/item/public_token/exchange',
    { public_token },
  );

  const accounts = await plaidPost<{
    accounts: { mask?: string | null; name?: string | null; official_name?: string | null }[];
    item?: { institution_id?: string | null };
  }>('/accounts/get', { access_token: exchange.access_token });

  const primary = accounts.accounts?.[0];
  const institutionName =
    primary?.official_name ?? primary?.name ?? 'Linked account';
  const accountMask = primary?.mask ?? '';

  const { data: link, error: linkErr } = await admin
    .from('bank_links')
    .insert({
      user_id: userId,
      status: 'active',
      plaid_item_id: exchange.item_id,
      institution_name: institutionName,
      account_mask: accountMask,
    })
    .select('id')
    .single();

  if (linkErr || !link) {
    return jsonResponse({ error: linkErr?.message ?? 'Failed to create bank link' }, 500);
  }

  const { error: credErr } = await admin.from('plaid_credentials').insert({
    bank_link_id: link.id,
    access_token: exchange.access_token,
  });

  if (credErr) {
    await admin.from('bank_links').delete().eq('id', link.id);
    return jsonResponse({ error: credErr.message }, 500);
  }

  try {
    await runTransactionsSync(admin, userId, link.id, exchange.access_token);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'sync failed';
    return jsonResponse({ ok: true, bank_link_id: link.id, sync_warning: msg });
  }

  return jsonResponse({ ok: true, bank_link_id: link.id });
});
