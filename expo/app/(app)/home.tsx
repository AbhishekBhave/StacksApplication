import { clearLocalAuthStorage } from '@/lib/auth-storage';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [connectHint, setConnectHint] = useState<string | null>(null);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    setUser(u);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refreshUser();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  async function onSignOut() {
    setBusy(true);
    try {
      await supabase.auth.signOut();
      await clearLocalAuthStorage();
      router.replace('/(auth)');
    } finally {
      setBusy(false);
    }
  }

  function onConnectBank() {
    setResendMessage(null);
    if (!user) return;
    if (!user.email_confirmed_at) {
      setConnectHint('Verify your email to connect a bank');
      return;
    }
    setConnectHint(null);
    router.push('/(app)/connect-bank-placeholder');
  }

  async function onResendVerification() {
    if (!user?.email) return;
    setResendMessage(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: user.email });
      if (error) throw error;
      setResendMessage('Verification email sent.');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not resend.';
      setResendMessage(msg);
    } finally {
      setBusy(false);
    }
  }

  if (loading || !user) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  const greetingName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'there';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {greetingName}</Text>
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={onSignOut}
          style={styles.signOut}
        >
          <Text style={styles.signOutText}>{busy ? '…' : 'Sign out'}</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onConnectBank}
        style={styles.connectCard}
      >
        <Text style={styles.connectTitle}>Connect bank</Text>
        <Text style={styles.connectSub}>Link an account to unlock spending context.</Text>
      </Pressable>

      {connectHint ? (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>{connectHint}</Text>
          <Pressable accessibilityRole="button" onPress={onResendVerification} style={styles.resend}>
            <Text style={styles.resendText}>Resend email</Text>
          </Pressable>
        </View>
      ) : null}

      {resendMessage ? <Text style={styles.meta}>{resendMessage}</Text> : null}

      {!user.email_confirmed_at ? (
        <Text style={styles.meta}>Verify your email before connecting a bank.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 24, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greeting: { fontSize: 22, fontWeight: '700', flex: 1, paddingRight: 8 },
  signOut: { paddingVertical: 8, paddingHorizontal: 12 },
  signOutText: { color: '#1565c0', fontWeight: '600' },
  connectCard: {
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#111',
    gap: 6,
  },
  connectTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  connectSub: { color: '#e0e0e0', fontSize: 15 },
  banner: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  bannerText: { fontSize: 15, fontWeight: '600' },
  resend: { alignSelf: 'flex-start' },
  resendText: { color: '#1565c0', fontWeight: '600' },
  meta: { fontSize: 13, color: '#555' },
});
