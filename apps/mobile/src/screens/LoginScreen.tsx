import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) Alert.alert('Erro', error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: '600' }}>SOS Rodovia</Text>

      <TextInput
        placeholder='Email'
        autoCapitalize='none'
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10 }}
      />

      <TextInput
        placeholder='Senha'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10 }}
      />

      <Button title={busy ? 'Entrando...' : 'Entrar'} onPress={signIn} disabled={busy} />
    </View>
  );
}