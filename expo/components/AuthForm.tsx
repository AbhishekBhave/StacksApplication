import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type AuthMode = 'signup' | 'signin';

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Enter email and password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });
        if (signUpError) throw signUpError;
        router.replace('/(onboarding)');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (signInError) throw signInError;
        const onboardingDone = await AsyncStorage.getItem('onboarding_done');
        if (onboardingDone === 'true') {
          router.replace('/(app)/home');
        } else {
          router.replace('/(onboarding)');
        }
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stacks</Text>

      <View style={styles.segment}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('signup')}
          style={[styles.segmentItem, mode === 'signup' && styles.segmentItemActive]}
        >
          <Text style={[styles.segmentText, mode === 'signup' && styles.segmentTextActive]}>Sign up</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('signin')}
          style={[styles.segmentItem, mode === 'signin' && styles.segmentItemActive]}
        >
          <Text style={[styles.segmentText, mode === 'signin' && styles.segmentTextActive]}>Sign in</Text>
        </Pressable>
      </View>

      <TextInput
        accessibilityLabel="Email"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        value={email}
      />
      <TextInput
        accessibilityLabel="Password"
        autoCapitalize="none"
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        accessibilityRole="button"
        disabled={loading}
        onPress={onSubmit}
        style={[styles.primary, loading && styles.primaryDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>
            {mode === 'signup' ? 'Create account' : 'Sign in'}
          </Text>
        )}
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={() => router.push('/(auth)/forgot-password')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Forgot password?</Text>
      </Pressable>

      {mode === 'signup' ? (
        <Text style={styles.hint}>Verify email before connecting a bank.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, padding: 24, width: '100%' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  segment: { flexDirection: 'row', borderRadius: 10, overflow: 'hidden', marginBottom: 8 },
  segmentItem: { flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: '#eee' },
  segmentItemActive: { backgroundColor: '#111' },
  segmentText: { fontWeight: '600', color: '#333' },
  segmentTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: { color: '#b00020', fontSize: 14 },
  primary: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryDisabled: { opacity: 0.6 },
  primaryText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { alignItems: 'center', paddingVertical: 8 },
  linkText: { color: '#1565c0', fontSize: 15 },
  hint: { textAlign: 'center', color: '#555', fontSize: 13 },
});
