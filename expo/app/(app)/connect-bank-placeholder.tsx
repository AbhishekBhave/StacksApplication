import { StyleSheet, Text, View } from 'react-native';

export default function ConnectBankPlaceholderScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bank linking</Text>
      <Text style={styles.body}>Bank linking ships in Phase 2.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 8 },
  title: { fontSize: 22, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 22 },
});
