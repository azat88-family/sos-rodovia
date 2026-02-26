import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import type { UserProfile } from '@/src/types';
import { useColorScheme } from 'react-native';

async function fetchMyProfile(): Promise<UserProfile | null> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, nome_completo, matricula')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  return (data as UserProfile | null) ?? null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user?.id ?? null;
        if (!mounted) return;
        setSessionUserId(userId);
        if (userId) {
          const p = await fetchMyProfile();
          if (!mounted) return;
          setProfile(p);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userId = session?.user?.id ?? null;
      setSessionUserId(userId);
      setProfile(null);
      if (userId) {
        const p = await fetchMyProfile();
        setProfile(p);
      } else {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const inLogin = segments[0] === 'login';
    if (!sessionUserId) {
      if (!inLogin) router.replace('/login');
    } else if (profile) {
      if (profile.role === 'driver') {
        router.replace('/driver');
      } else {
        router.replace('/operator');
      }
    }
  }, [loading, sessionUserId, profile]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#E63946" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
