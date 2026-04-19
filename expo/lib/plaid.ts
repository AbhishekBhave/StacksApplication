import { supabase } from '@/lib/supabase';

export async function fetchLinkToken(): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ link_token?: string }>(
    'plaid-link-token',
    { body: {} },
  );
  if (error) throw new Error(error.message);
  const token = data?.link_token;
  if (!token || typeof token !== 'string') {
    throw new Error('Missing link_token from server');
  }
  return token;
}
