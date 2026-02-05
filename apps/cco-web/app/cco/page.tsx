'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('teste@teste.com');
  const [password, setPassword] = useState('test123');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace('/cco/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const signIn = async () => {
    setBusy(true);
    setError(null);
    
    console.log('🔍 Iniciando login...');
    console.log('📧 Email:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      console.log('✅ Data:', data);
      console.log('❌ Error:', error);
      
      setBusy(false);
      
      if (error) {
        console.error('🚨 Erro:', error.message);
        return setError(error.message);
      }
      
      console.log('🎉 Login bem-sucedido! Redirecionando...');
      router.replace('/cco/dashboard');
      
    } catch (err) {
      console.error('💥 Exception:', err);
      setBusy(false);
      setError('Erro inesperado ao fazer login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          CCO - Login
        </h2>
        
        {error && (
          <div className="rounded bg-red-50 p-3 text-red-600 text-sm">
            ❌ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
              disabled={busy}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-black focus:border-blue-500 focus:outline-none"
              disabled={busy}
            />
          </div>

          <button
            onClick={signIn}
            disabled={busy}
            className="w-full rounded bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
