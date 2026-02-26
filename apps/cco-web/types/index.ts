export type UserRole = 'motorista' | 'operador' | 'admin';

export type IncidentStatus =
  | 'aberto'
  | 'em_atendimento'
  | 'encerrado'
  | 'cancelado';

export type VehicleType =
  | 'carro'
  | 'moto'
  | 'caminhao'
  | 'onibus'
  | 'van'
  | 'outro';

export interface Driver {
  id: string;
  full_name: string;
  cpf_cnpj: string;
  phone: string;
  email: string;
  birth_date: string;
  gender: string;
  photo_url?: string;
  created_at: string;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  plate: string;
  type: VehicleType;
  brand: string;
  model: string;
  year: string;
  color: string;
  renavam: string;
  photo_url?: string;
}

export interface Incident {
  id: string;
  driver_id: string;
  vehicle_id: string;
  status: IncidentStatus;
  lat: number;
  lng: number;
  description?: string;
  ai_summary?: string;
  created_at: string;
  updated_at: string;
  driver?: Driver;
  vehicle?: Vehicle;
}

export interface Operator {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
}

export interface ChatMessage {
  id: string;
  incident_id: string;
  sender_id: string;
  sender_role: UserRole;
  content: string;
  created_at: string;
}
