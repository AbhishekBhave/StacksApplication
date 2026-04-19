const PLAID_VERSION = '2020-09-14';

function plaidBaseUrl(): string {
  const env = (Deno.env.get('PLAID_ENV') ?? 'sandbox').toLowerCase();
  if (env === 'production') return 'https://production.plaid.com';
  if (env === 'development') return 'https://development.plaid.com';
  return 'https://sandbox.plaid.com';
}

export async function plaidPost<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const clientId = Deno.env.get('PLAID_CLIENT_ID');
  const secret = Deno.env.get('PLAID_SECRET');
  if (!clientId || !secret) {
    throw new Error('Missing PLAID_CLIENT_ID or PLAID_SECRET');
  }

  const payload = { ...body, client_id: clientId, secret };
  const res = await fetch(`${plaidBaseUrl()}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'PLAID-CLIENT-ID': clientId,
      'PLAID-SECRET': secret,
      'Plaid-Version': PLAID_VERSION,
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Plaid non-JSON response (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    const err = json as { error_message?: string; display_message?: string };
    const msg = err.error_message ?? err.display_message ?? `Plaid HTTP ${res.status}`;
    throw new Error(msg);
  }
  return json as T;
}
