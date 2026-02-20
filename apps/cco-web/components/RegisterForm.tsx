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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signError) throw signError;

      const userId = data?.user?.id;

      if (userId) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, nome_completo: nome, matricula, role })
          .select();

        if (insertError) throw insertError;
      }

      setSuccess(true);
      setEmail('');
      setPassword('');
      setNome('');
      setMatricula('');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado no cadastro.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="rounded bg-red-50 p-3 text-red-600 text-sm">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-green-50 p-3 text-green-600 text-sm">
          ✅ Cadastro realizado com sucesso!
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome completo
        </label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Matrícula
        </label>
        <input
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
        >
          {loading ? 'Cadastrando...' : `Cadastrar ${role === 'admin' ? 'Admin' : 'Operador'}`}
        </button>
      </div>
    </form>
  );
}
