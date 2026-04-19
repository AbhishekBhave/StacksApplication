import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

export function supabaseUserClient(req: Request) {
  const url = Deno.env.get('SUPABASE_URL');
  const anon = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anon) throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');

  return createClient(url, anon, {
    global: {
      headers: { Authorization: req.headers.get('Authorization') ?? '' },
    },
  });
}

export function supabaseServiceClient() {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key);
}

export async function getUserId(req: Request): Promise<string | null> {
  const supabase = supabaseUserClient(req);
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user?.id) return null;
  return user.id;
}
