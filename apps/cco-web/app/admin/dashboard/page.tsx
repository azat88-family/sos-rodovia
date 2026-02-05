"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import OperatorCard from '@/components/OperatorCard';
import Link from 'next/link';

interface Operator {
  id: string;
  nome_completo?: string;
  matricula?: string;
  email?: string;
  foto_url?: string;
  ativo?: boolean;
}

export default function AdminDashboard() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOperators = async () => {
      setLoading(true);
      try {
        const { data, error, status } = await supabase
          .from('profiles')
          .select('id, nome_completo, matricula, email, foto_url, role, created_at, foto_url, ativo')
          .eq('role', 'operator');

        if (error) {
          console.error('Erro ao buscar operadores:', error, 'status:', status);
          setError('Erro ao carregar operadores. Verifique permissões/serviço.');
          return;
        }

        // map to Operator
        const ops = (data || []).map((d: any) => ({
          id: d.id,
          nome_completo: d.nome_completo,
          matricula: d.matricula,
          email: d.email,
          foto_url: d.foto_url,
          ativo: d.ativo ?? true,
        }));

        setOperators(ops);
      } catch (e: any) {
        console.error(e);
        setError('Falha na requisição');
      } finally {
        setLoading(false);
      }
    };

    loadOperators();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/register/operator" className="rounded bg-green-600 text-white px-4 py-2 shadow hover:bg-green-700">Cadastrar Operador</Link>
          <Link href="/register/admin" className="rounded bg-gray-800 text-white px-4 py-2 shadow hover:bg-gray-900">Cadastrar Admin</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-4 rounded bg-red-50 text-red-800 p-3">{error}</div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && <div>Carregando operadores...</div>}
          {!loading && operators.length === 0 && !error && (
            <div className="text-gray-500">Nenhum operador encontrado.</div>
          )}

          {operators.map((op) => (
            <OperatorCard key={op.id} operator={op} />
          ))}
        </section>
      </main>
    </div>
  );
}
