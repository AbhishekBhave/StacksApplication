import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clears local persistence after sign-out: onboarding flag, Supabase auth keys,
 * and any `stacks.*` app keys. Adjust prefixes if new persisted keys are added.
 */
export async function clearLocalAuthStorage(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const toRemove = keys.filter(
    (k) => k.startsWith('@supabase') || k === 'onboarding_done' || k.startsWith('stacks.'),
  );
  await Promise.all(toRemove.map((k) => AsyncStorage.removeItem(k)));
}
