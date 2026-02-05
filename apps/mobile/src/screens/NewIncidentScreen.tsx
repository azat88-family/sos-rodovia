import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import * as Location from 'expo-location';
import { supabase } from '../lib/supabase';
import type { IncidentInsert } from '../types';

export default function NewIncidentScreen({ navigation }: any) {
  const [tipoProblema, setTipoProblema] = useState('');
  const [descricao, setDescricao] = useState('');
  const [placa, setPlaca] = useState('');
  const [modelo, setModelo] = useState('');
  const [telefone, setTelefone] = useState('');
  const [nivelUrgencia, setNivelUrgencia] = useState('3');
  const [busy, setBusy] = useState(false);

  const createIncident = async () => {
    setBusy(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      if (!user) throw new Error('Sessão expirada. Faça login novamente.');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('Permissão de localização negada.');

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const latitude = pos.coords.latitude;
      const longitude = pos.coords.longitude;

      const payload: IncidentInsert = {
        user_id: user.id,
        latitude,
        longitude,
        tipo_problema: tipoProblema.trim(),
        descricao: descricao.trim(),
        data_hora: new Date().toISOString(),
        status: 'open',
        placa_veiculo: placa.trim().toUpperCase(),
        modelo_veiculo: modelo.trim(),
        telefone: telefone.trim(),
        nivel_urgencia: Math.max(1, Math.min(5, Number(nivelUrgencia) || 3)),
      };

      const { error } = await supabase.from('incidents').insert(payload as any);
      if (error) throw error;

      Alert.alert('OK', 'Chamado aberto com sucesso.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erro', e?.message ?? 'Falha ao abrir chamado');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Abrir chamado</Text>

      <TextInput placeholder='Tipo do problema' value={tipoProblema} onChangeText={setTipoProblema}
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10 }} />

      <TextInput placeholder='Descrição' value={descricao} onChangeText={setDescricao} multiline
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10, minHeight: 80 }} />

      <TextInput placeholder='Placa do veículo' value={placa} onChangeText={setPlaca}
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10 }} />

      <TextInput placeholder='Modelo do veículo' value={modelo} onChangeText={setModelo}
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10 }} />

      <TextInput placeholder='Telefone' value={telefone} onChangeText={setTelefone} keyboardType='phone-pad'
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10 }} />

      <TextInput placeholder='Nível urgência (1-5)' value={nivelUrgencia} onChangeText={setNivelUrgencia} keyboardType='numeric'
        style={{ borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 10 }} />

      <Button title={busy ? 'Enviando...' : 'Confirmar SOS'} onPress={createIncident} disabled={busy} />
    </View>
  );
}