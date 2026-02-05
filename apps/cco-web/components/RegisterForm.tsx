'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Props {
  role: 'admin' | 'operator';
}

export default function RegisterForm({ role }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1) create auth user
      const { data, error: signError } = await supabase.auth.signUp({ email, password });
      if (signError) throw signError;

      const userId = data?.user?.id;

      // 2) insert profile row (will be allowed by RLS for authenticated users)
      if (userId) {
        // For security, client-side registration only creates operator profiles.
        const clientRole = 'operator';
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, nome_completo: nome, matricula, role: clientRole })
          .select();

        if (insertError) {
          console.error('Erro ao criar profile:', insertError);
        }
      }

      alert('Cadastro realizado. Verifique seu email para confirmação (se configurado).');
    } catch (err: any) {
      console.error(err);
      alert('Erro no cadastro: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome completo</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Matrícula</label>
        <input value={matricula} onChange={(e) => setMatricula(e.target.value)} required className="mt-1 block w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-1 block w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-1 block w-full rounded border px-3 py-2" />
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {loading ? 'Cadastrando...' : `Cadastrar ${role}`}
        </button>
      </div>
    </form>
  );
}
