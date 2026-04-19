import type { TransactionRow } from '@/lib/transactions';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  data: TransactionRow[];
  loading: boolean;
  syncing: boolean;
  onRefresh: () => Promise<void>;
  successBanner?: string | null;
  onDismissSuccess?: () => void;
  errorMessage?: string | null;
  onDismissError?: () => void;
};

function SkeletonRows() {
  return (
    <View style={styles.skeletonWrap}>
      {[0, 1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.skeletonRow}>
          <View style={styles.skeletonLineWide} />
          <View style={styles.skeletonLineNarrow} />
        </View>
      ))}
    </View>
  );
}

export function TransactionList({
  data,
  loading,
  syncing,
  onRefresh,
  successBanner,
  onDismissSuccess,
  errorMessage,
  onDismissError,
}: Props) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh]);

  const showSkeleton = loading && data.length === 0;

  return (
    <FlatList
      style={{ flex: 1 }}
      data={data}
      keyExtractor={(item) => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing || syncing} onRefresh={() => void handleRefresh()} />
      }
      ListHeaderComponent={
        <View style={styles.headerBlock}>
          {successBanner ? (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>{successBanner}</Text>
              {onDismissSuccess ? (
                <Pressable onPress={onDismissSuccess} hitSlop={8}>
                  <Text style={styles.dismiss}>Dismiss</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{errorMessage}</Text>
              {onDismissError ? (
                <Pressable onPress={onDismissError} hitSlop={8}>
                  <Text style={styles.dismiss}>Dismiss</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
          {showSkeleton ? (
            <Text style={styles.loadingCopy}>Loading transactions…</Text>
          ) : null}
        </View>
      }
      ListEmptyComponent={
        showSkeleton ? (
          <SkeletonRows />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Still fetching your transactions</Text>
            <Text style={styles.emptySub}>Pull down to refresh in a moment.</Text>
          </View>
        )
      }
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.primaryLine} numberOfLines={2}>
            {item.raw_name ?? 'Transaction'}
          </Text>
          {item.merchant_name ? (
            <Text style={styles.secondaryLine} numberOfLines={1}>
              {item.merchant_name}
            </Text>
          ) : null}
          <Text style={styles.amount}>
            {item.amount != null ? `$${Number(item.amount).toFixed(2)}` : '—'}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  headerBlock: { gap: 8, marginBottom: 8 },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  successText: { flex: 1, fontSize: 15, fontWeight: '600' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  errorText: { flex: 1, fontSize: 15, color: '#b71c1c' },
  dismiss: { fontWeight: '700', color: '#1565c0' },
  loadingCopy: { fontSize: 14, color: '#555', marginTop: 4 },
  skeletonWrap: { gap: 10, marginTop: 8 },
  skeletonRow: { gap: 6 },
  skeletonLineWide: {
    height: 14,
    borderRadius: 4,
    backgroundColor: '#e0e0e0',
    width: '85%',
  },
  skeletonLineNarrow: {
    height: 12,
    borderRadius: 4,
    backgroundColor: '#eee',
    width: '50%',
  },
  row: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    gap: 4,
  },
  primaryLine: { fontSize: 16, fontWeight: '600' },
  secondaryLine: { fontSize: 14, color: '#555' },
  amount: { fontSize: 15, fontWeight: '600', marginTop: 4 },
  empty: { padding: 24, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptySub: { fontSize: 14, color: '#555' },
});
