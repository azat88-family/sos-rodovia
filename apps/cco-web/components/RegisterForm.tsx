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
      // Tenta realizar o signUp. Se falhar com 500, pode ser trigger no banco.
      const { data, error: signError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome_completo: nome,
            role: role,
          },
        },
      });

      if (signError) throw signError;

      const user = data?.user;

      // Se o usuário foi criado mas não temos perfil (talvez o trigger falhou ou não existe)
      if (user) {
        // Verifica se o perfil já foi criado pelo trigger (caso exista)
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!existingProfile) {
          const { error: insertError } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              nome_completo: nome,
              matricula,
              role,
              email: email // opcional, mas ajuda a manter sincronizado
            })
            .select();

          if (insertError) {
            console.error('Erro ao inserir perfil manualmente:', insertError);
            // Não jogamos erro aqui se o signUp funcionou, para não confundir o usuário,
            // mas o ideal é que o perfil exista.
          }
        }
      }

      setSuccess(true);
      setEmail('');
      setPassword('');
      setNome('');
      setMatricula('');
    } catch (err: unknown) {
      console.error('Erro no cadastro:', err);
      const message = err instanceof Error ? err.message : 'Erro inesperado no cadastro.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "mt-1 block w-full rounded border border-yellow-200 bg-black/40 px-3 py-2 text-white placeholder-lime-300 focus:border-yellow-200 focus:outline-none focus:ring-1 focus:ring-yellow-200";
  const labelClass = "block text-sm font-medium text-yellow-200";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {error && (
        <div className="rounded bg-red-900/70 p-3 text-red-300 text-sm border border-red-500">
          ❌ {error}
        </div>
      )}

      {success && (
        <div className="rounded bg-lime-900/70 p-3 text-lime-300 text-sm border border-lime-500">
          ✅ Cadastro realizado com sucesso! Verifique seu e-mail se necessário.
        </div>
      )}

      <div>
        <label className={labelClass}>Nome completo</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className={inputClass}
          disabled={loading}
          placeholder="Nome completo"
        />
      </div>

      <div>
        <label className={labelClass}>Matrícula</label>
        <input
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          required
          className={inputClass}
          disabled={loading}
          placeholder="Ex: 0042"
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          className={inputClass}
          disabled={loading}
          placeholder="operador@email.com"
        />
      </div>

      <div>
        <label className={labelClass}>Senha</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          className={inputClass}
          disabled={loading}
          placeholder="••••••••"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-yellow-400 px-4 py-2 text-black font-bold disabled:opacity-50 hover:bg-yellow-300 transition-colors"
        >
          {loading ? 'Cadastrando...' : `Cadastrar ${role === 'admin' ? 'Admin' : 'Operador'}`}
        </button>
      </div>
    </form>
  );
}
