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

      if (profile?.role === 'administrador') {        // ✅ linha 24 - corrigido
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

      if (error) {                                    // ✅ linha 43 - verificação de erro primeiro
        setError(error.message);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role === 'administrador') {        // ✅ linha 53 - corrigido
        setEmail('');                                 // ✅ limpa email
        setPassword('');                              // ✅ limpa senha
        router.replace('/admin/dashboard');
      } else {
        setEmail('');                                 // ✅ limpa email
        setPassword('');                              // ✅ limpa senha
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
      <div className="relative z-10 w-full max-w-md space-y-8 rounded-lg bg-black/60 p-8 shadow-xl border border-yellow-200">
        <h2 className="text-center text-3xl font-bold text-yellow-200">
          CCO - Login
        </h2>

        {error && (
          <div className="rounded bg-red-900/70 p-3 text-red-300 text-sm border border-red-500">
            ❌ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-yellow-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-yellow-400 bg-black/40 px-3 py-2 text-white placeholder-lime-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              placeholder="seu@email.com"
              disabled={busy}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-yellow-300">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-yellow-400 bg-black/40 px-3 py-2 text-white placeholder-lime-300 focus:border-yellow-300 focus:outline-none focus:ring-1 focus:ring-yellow-300"
              placeholder="••••••••"
              disabled={busy}
            />
          </div>

          <button
            onClick={signIn}
            disabled={busy}
            className="w-full rounded bg-yellow-200 py-2 text-black font-bold hover:bg-yellow-300 disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
          >
            {busy ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
