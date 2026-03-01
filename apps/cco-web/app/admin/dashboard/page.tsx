'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface UserProfile {
  id: string;
  nome_completo: string | null;
  matricula: string | null;
  email: string | null;
  foto_url: string | null;
  role: string;
  aprovado: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/login'); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'admin') { router.replace('/'); return; }

      const { data, error: fErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fErr) throw fErr;
      setUsers(data as UserProfile[]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error: uErr } = await supabase
        .from('profiles')
        .update({ aprovado: !currentStatus })
        .eq('id', id);
      if (uErr) throw uErr;
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const pendingUsers = users.filter(u => !u.aprovado && u.role !== 'admin');
  const approvedUsers = users.filter(u => u.aprovado && u.role !== 'admin');

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6">
      <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Painel do <span className="text-[#FF6B00]">Administrador</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Bem-vindo, Alexandre Santos</p>
        </div>
        <div className="flex gap-3">
           <Link href="/" className="px-4 py-2 bg-gray-800 rounded font-bold text-sm hover:bg-gray-700 transition-all">
            🏠 IR PARA HOME
          </Link>
          <button onClick={() => supabase.auth.signOut().then(() => router.replace('/login'))}
            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/40 rounded font-bold text-sm hover:bg-red-600 hover:text-white transition-all">
            SAIR
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-12">
        {/* PENDENTES DE APROVAÇÃO */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
            <h2 className="text-xl font-black uppercase tracking-widest text-yellow-500">
              Aguardando Aprovação ({pendingUsers.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingUsers.map(u => (
              <div key={u.id} className="bg-white/5 border border-yellow-500/30 rounded-xl p-5 flex items-center gap-4 hover:bg-white/10 transition-all">
                <div className="w-16 h-16 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden border border-gray-700">
                  {u.foto_url ? <img src={u.foto_url} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-2xl">👤</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white truncate">{u.nome_completo}</h3>
                  <p className="text-xs text-gray-400 font-mono">{u.role.toUpperCase()} • {u.matricula || 'Sem mat'}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                </div>
                <button onClick={() => toggleApproval(u.id, u.aprovado)}
                  className="bg-green-600 hover:bg-green-500 text-white text-xs font-black px-4 py-2 rounded-lg transition-all shadow-lg shadow-green-900/20">
                  APROVAR
                </button>
              </div>
            ))}
            {pendingUsers.length === 0 && <p className="text-gray-600 text-sm">Nenhuma solicitação pendente.</p>}
          </div>
        </section>

        {/* JÁ APROVADOS */}
        <section>
           <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h2 className="text-xl font-black uppercase tracking-widest text-green-500">
              Usuários Ativos ({approvedUsers.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {approvedUsers.map(u => (
              <div key={u.id} className="bg-white/5 border border-gray-800 rounded-xl p-4 flex items-center gap-3 opacity-80 hover:opacity-100 transition-all">
                <div className="w-12 h-12 rounded-full bg-gray-800 flex-shrink-0 overflow-hidden">
                  {u.foto_url ? <img src={u.foto_url} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xl">👤</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm text-white truncate">{u.nome_completo}</h3>
                  <p className="text-[10px] text-gray-500 font-mono uppercase">{u.role} • {u.matricula}</p>
                </div>
                <button onClick={() => toggleApproval(u.id, u.aprovado)}
                  className="bg-red-900/20 text-red-400 border border-red-900/40 hover:bg-red-600 hover:text-white text-[10px] font-bold px-3 py-1.5 rounded transition-all">
                  REVOGAR
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
