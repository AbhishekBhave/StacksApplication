import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

type Gate = 'loading' | 'auth' | 'onboarding' | 'home';

export default function Index() {
  const [gate, setGate] = useState<Gate>('loading');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session) {
        setGate('auth');
        return;
      }
      const done = await AsyncStorage.getItem('onboarding_done');
      if (done === 'true') setGate('home');
      else setGate('onboarding');
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (gate === 'loading') return null;
  if (gate === 'auth') return <Redirect href="/(auth)" />;
  if (gate === 'onboarding') return <Redirect href="/(onboarding)" />;
  return <Redirect href="/(app)/home" />;
}
