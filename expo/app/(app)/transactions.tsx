import { TransactionList } from '@/components/TransactionList';
import { supabase } from '@/lib/supabase';
import { fetchTransactionsForUser, type TransactionRow } from '@/lib/transactions';
import { useFocusEffect, useLocalSearchParams, router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function formatRelative(iso: string | null | undefined) {
  if (!iso) return 'Not synced yet';
  const then = new Date(iso).getTime();
  const diffMin = Math.round((Date.now() - then) / 60000);
  if (diffMin < 1) return 'Updated just now';
  if (diffMin < 60) return `Updated ${diffMin} min ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `Updated ${diffHr} hr ago`;
  return `Updated ${Math.round(diffHr / 24)} day(s) ago`;
}

export default function TransactionsScreen() {
  const { justLinked } = useLocalSearchParams<{ justLinked?: string }>();
  const [rows, setRows] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(justLinked === '1');
  const [syncError, setSyncError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setRows([]);
      setLoading(false);
      return;
    }
    const { data: link } = await supabase
      .from('bank_links')
      .select('last_successful_sync_at')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    setLastSync(link?.last_successful_sync_at ?? null);
    const list = await fetchTransactionsForUser(user.id);
    setRows(list);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setLoading(true);
      void (async () => {
        await load();
        if (!cancelled) setLoading(false);
      })();
      return () => {
        cancelled = true;
      };
    }, [load]),
  );

  async function onRefresh() {
    setSyncing(true);
    setSyncError(null);
    try {
      const { error } = await supabase.functions.invoke('plaid-sync', { body: {} });
      if (error) {
        setSyncError(error.message);
        return;
      }
      await load();
    } catch (e) {
      setSyncError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.title}>Transactions</Text>
        <View style={styles.spacer} />
      </View>
      <Text style={styles.lastUpdated}>{formatRelative(lastSync)}</Text>
      <View style={styles.listWrap}>
        <TransactionList
          data={rows}
          loading={loading}
          syncing={syncing}
          onRefresh={onRefresh}
          successBanner={showSuccess ? 'Bank connected' : null}
          onDismissSuccess={() => setShowSuccess(false)}
          errorMessage={syncError}
          onDismissError={() => setSyncError(null)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16, paddingTop: 48 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  back: { color: '#1565c0', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700' },
  spacer: { width: 48 },
  lastUpdated: { fontSize: 13, color: '#555', marginBottom: 8 },
  listWrap: { flex: 1 },
});
