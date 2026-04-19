import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

function requireEnv(name: 'EXPO_PUBLIC_SUPABASE_URL' | 'EXPO_PUBLIC_SUPABASE_ANON_KEY') {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Set it in expo/.env, then restart Expo with "npm run start -- --clear".`
    );
  }
  return value;
}

function isServiceRoleJwt(key: string) {
  const segments = key.split('.');
  if (segments.length !== 3) return false;

  try {
    const normalized = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const decoded =
      typeof globalThis.atob === 'function'
        ? globalThis.atob(padded)
        : Buffer.from(padded, 'base64').toString('utf8');
    const payload = JSON.parse(decoded);
    return payload?.role === 'service_role';
  } catch {
    return false;
  }
}

function assertClientKeyIsSafe(key: string) {
  if (key.startsWith('sb_secret_') || key.includes('service_role') || isServiceRoleJwt(key)) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_ANON_KEY is using a secret/service key. Use the anon/publishable key in expo/.env and restart Expo with "npm run start -- --clear".'
    );
  }
}

const supabaseUrl = requireEnv('EXPO_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = requireEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY');
assertClientKeyIsSafe(supabaseAnonKey);

/** Require HTTPS Supabase endpoints only (TLS in transit). */
if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
  throw new Error('EXPO_PUBLIC_SUPABASE_URL must use https://');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // AsyncStorage's web adapter touches `window`, which is unavailable during SSR.
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
