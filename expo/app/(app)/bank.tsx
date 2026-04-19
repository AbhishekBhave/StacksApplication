import { supabase } from '@/lib/supabase';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

type LinkRow = {
  id: string;
  institution_name: string | null;
  account_mask: string | null;
  status: string;
};

export default function BankScreen() {
  const [link, setLink] = useState<LinkRow | null | 'pending'>('pending');
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLink(null);
      return;
    }

    const { data } = await supabase
      .from('bank_links')
      .select('id, institution_name, account_mask, status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    setLink(data ?? null);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  async function runDisconnect() {
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke('plaid-disconnect', { body: {} });
      if (error) throw new Error(error.message);
      await refresh();
      router.replace('/(app)/home');
    } catch (e) {
      Alert.alert('Disconnect failed', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  function confirmDisconnect() {
    Alert.alert(
      'Disconnect bank',
      'This removes linked data from this device and our servers for this prototype.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Disconnect', style: 'destructive', onPress: () => void runDisconnect() },
      ],
    );
  }

  function confirmReplace() {
    Alert.alert(
      'Replace bank',
      'We will revoke your current bank connection so you can link a different one.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', style: 'destructive', onPress: () => void replaceFlow() },
      ],
    );
  }

  async function replaceFlow() {
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke('plaid-disconnect', { body: {} });
      if (error) throw new Error(error.message);
      router.replace('/(app)/pre-plaid');
    } catch (e) {
      Alert.alert('Could not replace', e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setBusy(false);
    }
  }

  if (link === 'pending') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank</Text>
      {!link ? (
        <>
          <Text style={styles.body}>No bank linked yet.</Text>
          <Pressable style={styles.primary} onPress={() => router.push('/(app)/pre-plaid')}>
            <Text style={styles.primaryText}>Connect bank</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.institution}>{link.institution_name ?? 'Linked account'}</Text>
          <Text style={styles.mask}>Account ending in {link.account_mask || '••••'}</Text>
          <Pressable style={styles.secondary} onPress={() => router.push('/(app)/transactions')}>
            <Text style={styles.secondaryText}>View transactions</Text>
          </Pressable>
          <Pressable
            style={[styles.danger, busy && styles.disabled]}
            disabled={busy}
            onPress={confirmReplace}
          >
            <Text style={styles.dangerText}>Replace bank</Text>
          </Pressable>
          <Pressable
            style={[styles.dangerOutline, busy && styles.disabled]}
            disabled={busy}
            onPress={confirmDisconnect}
          >
            <Text style={styles.dangerTextOutline}>Disconnect bank</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  container: { flex: 1, padding: 24, gap: 12, paddingTop: 56 },
  title: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 15, color: '#444' },
  institution: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  mask: { fontSize: 15, color: '#555' },
  primary: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondary: { paddingVertical: 12, alignItems: 'center' },
  secondaryText: { color: '#1565c0', fontWeight: '600', fontSize: 16 },
  danger: {
    marginTop: 24,
    backgroundColor: '#b00020',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  dangerOutline: {
    borderWidth: 1,
    borderColor: '#b00020',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  dangerText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  dangerTextOutline: { color: '#b00020', fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.5 },
});
