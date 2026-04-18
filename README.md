# Stacks (prototype)

## Prerequisites

- Node.js 20+ and npm
- [Expo CLI](https://docs.expo.dev/) via `npx` (no global install required)
- A [Supabase](https://supabase.com/) project for auth and data (Phase 1)

## Setup

1. Clone the repository.
2. `cd expo && npm install`
3. Copy `expo/.env.example` to `expo/.env` and set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project (anon key only — never commit `service_role` or secrets).

**Session storage:** The mobile client uses `@react-native-async-storage/async-storage` with Supabase Auth so sessions persist across app restarts, per the [Supabase Expo guide](https://supabase.com/docs/guides/auth/quickstarts/react-native).

## Run

From `expo/`:

- `npx expo start` — start the dev server
- `npm run ios` / `npm run android` / `npm run web` — open on a platform

## Tests

From `expo/`:

- `npm test`
