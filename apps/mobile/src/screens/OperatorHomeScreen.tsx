import React from 'react';
import { Button, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function OperatorHomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>CCO (Operador/Admin)</Text>
      <Text>O painel completo fica no Web (Next.js).</Text>
      <Button title='Sair' onPress={() => supabase.auth.signOut()} />
    </View>
  );
}