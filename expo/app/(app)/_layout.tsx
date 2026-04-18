import { supabase } from '@/lib/supabase';
import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

export default function AppGroupLayout() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!cancelled) {
        setSession(s);
        setReady(true);
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!ready) return null;
  if (!session) return <Redirect href="/(auth)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
