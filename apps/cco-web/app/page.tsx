'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/cco/dashboard');
      }
    };
    checkUser();
  }, [router]);

  const signIn = async () => {
    setBusy(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/cco/dashboard');
      }
    } catch {
      setError('Erro inesperado ao fazer login');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center relative"
      style={{
        backgroundImage: "url('/login.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Card de login */}
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-lg bg-blue p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold text-black-900">
          CCO - Login
        </h2>

        {error && (
          <div className="rounded bg-red-50 p-3 text-red-600 text-sm">
            ❌ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-yellow-300 px-3 py-2 text-limon green focus:border-blue-500 focus:outline-none"
              disabled={busy}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-limon-700">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-yellow-300 px-3 py-2 text-lime green focus:border-blue-500 focus:outline-none"
              disabled={busy}
            />
          </div>

          <button
            onClick={signIn}
            disabled={busy}
            className="w-full rounded bg-blue-600 py-2 text-black font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}