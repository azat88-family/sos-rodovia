import { Stack } from 'expo-router';

export default function OperatorLayout() {
  return (
    <Stack screenOptions={{ headerTintColor: '#E63946' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
