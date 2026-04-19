import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

function mapAuthError(message: string) {
  const normalized = message.toLowerCase();
  const looksLikeKeyError =
    normalized.includes('secret api key') ||
    normalized.includes('invalid api key') ||
    normalized.includes('service_role') ||
    normalized.includes('forbidden');

  if (looksLikeKeyError) {
    return 'Client is using a secret/service key. Set EXPO_PUBLIC_SUPABASE_ANON_KEY to the anon/publishable key in expo/.env, then restart Expo with "npm run start -- --clear".';
  }

  return message;
}

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSend() {
    setError(null);
    setMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Enter your email.');
      return;
    }
    setLoading(true);
    try {
      const redirect = process.env.EXPO_PUBLIC_AUTH_REDIRECT;
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
        ...(redirect ? { redirectTo: redirect } : {}),
      });
      if (resetError) throw resetError;
      setMessage('Check your email');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Request failed.';
      setError(mapAuthError(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        accessibilityLabel="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="you@example.com"
        style={styles.input}
        value={email}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.success}>{message}</Text> : null}
      <Pressable
        accessibilityRole="button"
        disabled={loading}
        onPress={onSend}
        style={[styles.button, loading && styles.buttonDisabled]}
      >
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send reset link</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 12, justifyContent: 'center' },
  label: { fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: { color: '#b00020' },
  success: { color: '#1b5e20' },
  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
