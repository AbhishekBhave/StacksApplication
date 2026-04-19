#!/usr/bin/env node

const REQUIRED_KEYS = ['EXPO_PUBLIC_SUPABASE_URL', 'EXPO_PUBLIC_SUPABASE_ANON_KEY'];

function isServiceRoleJwt(key) {
  const segments = key.split('.');
  if (segments.length !== 3) return false;

  try {
    const normalized = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const payload = JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
    return payload?.role === 'service_role';
  } catch {
    return false;
  }
}

function fail(message) {
  console.error(`\n[check-env] ${message}\n`);
  process.exit(1);
}

function assertRequired(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    fail(`Missing ${name}. Add it in expo/.env, then restart with "npm run start -- --clear".`);
  }
  return value;
}

const supabaseUrl = assertRequired(REQUIRED_KEYS[0]);
const supabaseAnonKey = assertRequired(REQUIRED_KEYS[1]);

if (!supabaseUrl.startsWith('https://')) {
  fail('EXPO_PUBLIC_SUPABASE_URL must use https://');
}

if (
  supabaseAnonKey.startsWith('sb_secret_') ||
  supabaseAnonKey.includes('service_role') ||
  isServiceRoleJwt(supabaseAnonKey)
) {
  fail(
    'EXPO_PUBLIC_SUPABASE_ANON_KEY is configured with a secret/service key. Use anon/publishable key only in Expo client runtime.'
  );
}

console.log('[check-env] OK: Supabase env vars look valid for Expo client runtime.');
