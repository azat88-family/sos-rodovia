import { supabase } from './supabase';
import type { IncidentStatus } from '../types';

export async function assignIncidentToMe(params: { incidentId: string }) {
  const { incidentId } = params;
  const { data, error } = await supabase.rpc('assign_incident_to_me', { p_incident_id: incidentId });
  if (error) throw error;
  return data;
}

export async function setIncidentStatus(params: { incidentId: string; status: IncidentStatus }) {
  const { incidentId, status } = params;
  const { data, error } = await supabase.rpc('set_incident_status', {
    p_incident_id: incidentId,
    p_status: status,
  });
  if (error) throw error;
  return data;
}