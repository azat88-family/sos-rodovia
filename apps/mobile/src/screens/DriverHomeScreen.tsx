import React from 'react';
import { Button, Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function DriverHomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Área do Motorista</Text>
      <Button title='Abrir chamado (SOS)' onPress={() => navigation?.navigate ? navigation.navigate('NewIncident') : null} />
      <Button title='Sair' onPress={() => supabase.auth.signOut()} />
    </View>
  );
}