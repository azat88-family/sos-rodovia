export type UserRole = 'driver' | 'operator' | 'admin';

export type UserProfile = {
  id: string;
  role: UserRole;
  nome_completo: string | null;
  telefone: string | null;
  matricula?: string | null;
};

export type IncidentStatus = 'open' | 'assigned' | 'en_route' | 'resolved' | 'cancelled';

export type IncidentInsert = {
  user_id: string;
  latitude: number;
  longitude: number;
  tipo_problema: string;
  descricao: string;
  data_hora: string; // ISO
  status: IncidentStatus;
  placa_veiculo: string;
  modelo_veiculo: string;
  telefone: string;
  nivel_urgencia: number; // 1..5
};