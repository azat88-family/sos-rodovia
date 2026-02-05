import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import { supabase } from './src/lib/supabase';
import type { UserProfile } from './src/types';

import LoginScreen from './src/screens/LoginScreen';
import DriverHomeScreen from './src/screens/DriverHomeScreen';
import NewIncidentScreen from './src/screens/NewIncidentScreen';
import OperatorHomeScreen from './src/screens/OperatorHomeScreen';

type RootStackParamList = {
  Login: undefined;
  DriverHome: undefined;
  OperatorHome: undefined;
  NewIncident: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

async function fetchMyProfile(): Promise<UserProfile | null> {
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from('users')
    .select('id, role, full_name, phone')
    .eq('id', user.id)
    .maybeSingle();

  if (error) throw error;
  const profileData = data as UserProfile | null;
  return profileData ?? null;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
      if (userId) setProfile(await fetchMyProfile());
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const initialRoute = useMemo<keyof RootStackParamList>(() => {
    if (!sessionUserId) return 'Login';
    if (!profile) return 'Login';
    return profile.role === 'driver' ? 'DriverHome' : 'OperatorHome';
  }, [sessionUserId, profile]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name='Login' component={LoginScreen} options={{ title: 'Entrar' }} />
        <Stack.Screen name='DriverHome' component={DriverHomeScreen} options={{ title: 'Motorista' }} />
        <Stack.Screen name='OperatorHome' component={OperatorHomeScreen} options={{ title: 'CCO' }} />
        <Stack.Screen name='NewIncident' component={NewIncidentScreen} options={{ title: 'Novo chamado' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}