import { fetchLinkToken } from '@/lib/plaid';
import { devLog } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  LinkIOSPresentationStyle,
  LinkLogLevel,
  create,
  dismissLink,
  open,
} from 'react-native-plaid-link-sdk';

export default function PrePlaidScreen() {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [linkErrorTitle, setLinkErrorTitle] = useState<string | null>(null);
  const [linkErrorBody, setLinkErrorBody] = useState<string | null>(null);

  const startLinkAfterAuth = useCallback(async () => {
    setBusy(true);
    setInlineError(null);
    try {
      const token = await fetchLinkToken();
      create({
        token,
        noLoadingState: false,
        logLevel: LinkLogLevel.ERROR,
      });
      await open({
        iOSPresentationStyle: LinkIOSPresentationStyle.MODAL,
        logLevel: LinkLogLevel.ERROR,
        onSuccess: async (success) => {
          const { error } = await supabase.functions.invoke('plaid-exchange', {
            body: { public_token: success.publicToken },
          });
          if (error) {
            setLinkErrorTitle('Could not finish linking');
            setLinkErrorBody(error.message);
            return;
          }
          router.replace({ pathname: '/(app)/transactions', params: { justLinked: '1' } });
        },
        onExit: (exit) => {
          dismissLink();
          if (exit.error) {
            setLinkErrorTitle('Link was interrupted');
            setLinkErrorBody(
              exit.error.displayMessage ?? 'Something went wrong. You can try again later.',
            );
          } else {
            router.back();
          }
        },
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Something went wrong';
      setInlineError(msg);
      devLog('pre-plaid link start error', { message: msg });
    } finally {
      setBusy(false);
    }
  }, []);

  async function onContinue() {
    setInlineError(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      setInlineError('You need to be signed in.');
      return;
    }
    if (!password.trim()) {
      setInlineError('Enter your password to continue.');
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });
      if (error) {
        setInlineError(error.message);
        return;
      }
      await startLinkAfterAuth();
    } catch (e) {
      setInlineError(e instanceof Error ? e.message : 'Sign-in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm it’s you</Text>
      <Text style={styles.subtitle}>
        Enter your password before we open the secure bank connection.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
        editable={!busy}
      />
      {inlineError ? <Text style={styles.error}>{inlineError}</Text> : null}
      <Pressable
        style={[styles.primary, busy && styles.disabled]}
        onPress={onContinue}
        disabled={busy}
      >
        {busy ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Continue</Text>}
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => router.back()} disabled={busy}>
        <Text style={styles.secondaryText}>Cancel</Text>
      </Pressable>

      <Modal visible={!!linkErrorTitle} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{linkErrorTitle}</Text>
            <Text style={styles.modalBody}>{linkErrorBody}</Text>
            <Pressable
              style={styles.primary}
              onPress={() => {
                setLinkErrorTitle(null);
                setLinkErrorBody(null);
                void startLinkAfterAuth();
              }}
            >
              <Text style={styles.primaryText}>Retry</Text>
            </Pressable>
            <Pressable
              style={styles.secondary}
              onPress={() => {
                setLinkErrorTitle(null);
                setLinkErrorBody(null);
                router.back();
              }}
            >
              <Text style={styles.secondaryText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', gap: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { fontSize: 15, color: '#444', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  error: { color: '#b00020', fontSize: 14 },
  primary: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  secondary: { paddingVertical: 12, alignItems: 'center' },
  secondaryText: { color: '#333', fontSize: 16 },
  disabled: { opacity: 0.6 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalBody: { fontSize: 15, color: '#333' },
});
