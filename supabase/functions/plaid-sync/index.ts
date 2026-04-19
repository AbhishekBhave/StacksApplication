import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getUserId, supabaseServiceClient } from '../_shared/auth.ts';
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

  let body: { bank_link_id?: string } = {};
  try {
    const t = await req.text();
    if (t.trim()) body = JSON.parse(t);
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const admin = supabaseServiceClient();

  let bankLinkId = body.bank_link_id;
  if (!bankLinkId) {
    const { data: active } = await admin
      .from('bank_links')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();
    bankLinkId = active?.id;
  }

  if (!bankLinkId) {
    return jsonResponse({ error: 'No active bank link' }, 400);
  }

  const { data: link, error: le } = await admin
    .from('bank_links')
    .select('id, user_id, status')
    .eq('id', bankLinkId)
    .eq('user_id', userId)
    .maybeSingle();

  if (le || !link || link.status !== 'active') {
    return jsonResponse({ error: 'Bank link not found' }, 404);
  }

  const { data: cred, error: ce } = await admin
    .from('plaid_credentials')
    .select('access_token')
    .eq('bank_link_id', link.id)
    .maybeSingle();

  if (ce || !cred?.access_token) {
    return jsonResponse({ error: 'Missing credentials for link' }, 500);
  }

  try {
    const { insertedOrUpdated } = await runTransactionsSync(
      admin,
      userId,
      link.id,
      cred.access_token,
    );
    return jsonResponse({ ok: true, inserted_or_updated: insertedOrUpdated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Sync failed';
    return jsonResponse({ error: msg }, 500);
  }
});
