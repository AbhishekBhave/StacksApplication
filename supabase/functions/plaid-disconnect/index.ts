import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getUserId, supabaseServiceClient } from '../_shared/auth.ts';
import { plaidPost } from '../_shared/plaid.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const userId = await getUserId(req);
  if (!userId) return jsonResponse({ error: 'Unauthorized' }, 401);

  const admin = supabaseServiceClient();

  const { data: link } = await admin
    .from('bank_links')
    .select('id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (!link) {
    return jsonResponse({ ok: true, message: 'No active link' });
  }

  const { data: cred } = await admin
    .from('plaid_credentials')
    .select('access_token')
    .eq('bank_link_id', link.id)
    .maybeSingle();

  if (cred?.access_token) {
    try {
      await plaidPost('/item/remove', { access_token: cred.access_token });
    } catch {
      // Proceed with local cleanup even if Plaid returns an error.
    }
  }

  await admin.from('transactions').delete().eq('bank_link_id', link.id);
  await admin.from('plaid_credentials').delete().eq('bank_link_id', link.id);
  await admin.from('plaid_sync_state').delete().eq('bank_link_id', link.id);

  const { error } = await admin
    .from('bank_links')
    .update({ status: 'revoked' })
    .eq('id', link.id);

  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ ok: true });
});
