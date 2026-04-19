import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getUserId } from '../_shared/auth.ts';
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

  const res = await plaidPost<{ link_token: string }>('/link/token/create', {
    user: { client_user_id: userId },
    client_name: 'Stacks',
    language: 'en',
    country_codes: ['US'],
    products: ['transactions'],
  });

  return jsonResponse({ link_token: res.link_token });
});
