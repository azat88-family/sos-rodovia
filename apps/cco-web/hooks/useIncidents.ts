'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Incident } from '@/types';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('incidents')
      .select('*, driver:drivers(*), vehicle:vehicles(*)')
      .order('created_at', { ascending: false });

    if (error) setError(error.message);
    else setIncidents(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIncidents();

    const channel = supabase
      .channel('incidents-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        () => fetchIncidents()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchIncidents]);

  return { incidents, loading, error, refetch: fetchIncidents };
}
