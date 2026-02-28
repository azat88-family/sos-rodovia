'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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

interface ProfileRow {
  id: string;
  nome_completo: string | null;
  matricula: string | null;
  email: string | null;
  foto_url: string | null;
  ativo: boolean | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOperators = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile?.role !== 'admin' && profile?.role !== 'administrador') {
          router.replace('/');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('id, nome_completo, matricula, email, foto_url, ativo')
          .eq('role', 'operator');

        if (fetchError) {
          setError('Erro ao carregar operadores. Verifique as permissões.');
          return;
        }

        const ops = (data as ProfileRow[]).map((d) => ({
          id: d.id,
          nome_completo: d.nome_completo ?? undefined,
          matricula: d.matricula ?? undefined,
          email: d.email ?? undefined,
          foto_url: d.foto_url ?? undefined,
          ativo: d.ativo ?? true,
        }));

        setOperators(ops);
      } catch {
        setError('Falha inesperada ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    loadOperators();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <header className="max-w-6xl mx-auto mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-3">
          <Link
            href="/register/operator"
            className="rounded bg-green-600 text-white px-4 py-2 shadow hover:bg-green-700 transition-colors"
          >
            Cadastrar Operador
          </Link>
          <Link
            href="/register/admin"
            className="rounded bg-gray-800 text-white px-4 py-2 shadow hover:bg-gray-900 transition-colors"
          >
            Cadastrar Admin
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-4 rounded bg-red-50 text-red-800 p-3 text-sm">
            ❌ {error}
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && (
            <div className="text-gray-500 col-span-full">
              Carregando operadores...
            </div>
          )}

          {!loading && operators.length === 0 && !error && (
            <div className="text-gray-500 col-span-full">
              Nenhum operador encontrado.
            </div>
          )}

          {operators.map((op) => (
            <OperatorCard key={op.id} operator={op} />
          ))}
        </section>
      </main>
    </div>
  );
}
