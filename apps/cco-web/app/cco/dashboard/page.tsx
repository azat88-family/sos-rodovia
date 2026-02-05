'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import ProfilePhotoCapture from '@/components/ProfilePhotoCapture';

interface Profile {
  id: string;
  nome_completo: string;
  matricula: string;
  foto_url?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.replace('/cco');
        return;
      }
      
      setUser(user);
      await loadProfile(user.id);
      setLoading(false);
    };
    
    checkUser();
  }, [router]);

  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile(data);
    }
  };

  const handlePhotoUploaded = async (url: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ foto_url: url })
      .eq('id', user.id);

    if (!error) {
      await loadProfile(user.id);
    }
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Coluna Principal - Informações */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Informações da Conta
              </h2>
              
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Última autenticação:</strong> {new Date(user?.last_sign_in_at).toLocaleString('pt-BR')}</p>
              </div>
            </div>

            {profile && (
              <div className="rounded-lg bg-white-6 shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Dados do Operador
                </h2>
                <div className="space-y-2 text-black-700">
                  <p><strong>Nome:</strong> {profile.nome_completo}</p>
                  <p><strong>Matrícula:</strong> {profile.matricula}</p>
                </div>
              </div>
            )}
          </div>

          {/* Coluna Lateral - Foto e Identificação */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-6 shadow sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Perfil do Operador
              </h2>

              {user && (
                <ProfilePhotoCapture
                  userId={user.id}
                  currentPhotoUrl={profile?.foto_url}
                  onPhotoUploaded={handlePhotoUploaded}
                />
              )}

              {profile && (
                <div className="mt-6 text-center border-t pt-4">
                  <h3 className="font-bold text-lg text-gray-900">
                    {profile.nome_completo}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Matrícula: {profile.matricula}
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
