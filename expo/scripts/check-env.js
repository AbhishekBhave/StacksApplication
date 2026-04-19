#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

function loadDotEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/\r$/, '');
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
}

// `npm run` runs `prestart` before `expo start`; Expo loads `.env` only for the Expo process.
loadDotEnvFile(path.join(__dirname, '..', '.env'));

const FORBIDDEN_CLIENT_ENV_KEYS = [
  /^PLAID_SECRET$/i,
  /^PLAID_ACCESS_TOKEN$/i,
  /^SUPABASE_SERVICE_ROLE_KEY$/i,
  /^OPENAI_API_KEY$/i,
];

function assertNoForbiddenEnvKeys() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, 'utf8');
  for (const rawLine of text.split('\n')) {
    const line = rawLine.replace(/\r$/, '').trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const normalized = key.replace(/^EXPO_PUBLIC_/i, '');
    for (const re of FORBIDDEN_CLIENT_ENV_KEYS) {
      if (re.test(key) || re.test(normalized)) {
        fail(
          `Forbidden env key "${key}" in expo/.env. Plaid secrets and service keys must not ship in the client bundle — use Supabase Edge secrets instead.`,
        );
      }
    }
  }
}

assertNoForbiddenEnvKeys();

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
