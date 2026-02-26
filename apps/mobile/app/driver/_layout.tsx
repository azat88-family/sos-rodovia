import { Stack } from 'expo-router';

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: '#E63946' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="new-incident" options={{ title: 'Novo Chamado' }} />
    </Stack>
  );
}
