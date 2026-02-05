'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/cco');
        return;
      }
      
      setUser(user);
      setLoading(false);
    };
    
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/cco');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              CCO Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Bem-vindo(a)! 🎉
          </h2>
          
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Última autenticação:</strong> {new Date(user?.last_sign_in_at).toLocaleString('pt-BR')}</p>
          </div>

          <div className="mt-6 rounded bg-green-50 p-4 border border-green-200">
            <p className="text-green-800 font-medium">
              ✅ Autenticação funcionando perfeitamente!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
