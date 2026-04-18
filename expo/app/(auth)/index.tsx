import { AuthForm } from '@/components/AuthForm';
import { ScrollView, StyleSheet } from 'react-native';

export default function AuthScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <AuthForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center' },
});
