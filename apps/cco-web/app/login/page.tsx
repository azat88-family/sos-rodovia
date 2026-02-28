'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError('Email ou senha inválidos.');
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role;
    if (role === 'administrador' || role === 'admin') {
      router.replace('/admin/dashboard');
    } else if (role === 'driver') {
      router.replace('/register/motorista'); // Or appropriate driver home if exists
    } else {
      router.replace('/cco/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative flex items-center justify-center overflow-hidden">

      {/* ── Background: imagem + overlay ── */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDH5J6ZKFrx3BKZ0E2bafiCUuWNf7Hg8GjSHfrGJ8G21A1XXU3-unPBkaqYEDmxtfEjeUQrL32uXhy98lrsA6Tv_Qyh-faISI-AuHJFFCZ7776-1fJT1MKDn4zZUaLe_nlStOZ14eqj4u4DqueEJsbC-JWnrqxFY7NtaB4Zn7yJkNHqdnGvPc_xURJUs11UibqCjWK3oiMx3V-jMQO2UYZAEhkhB02QXpmwDo5hU43GXyAKCj-AsUpY5IEYFNfmhVXc3KljRlUCy0A')`,
        }}
      />
      {/* Gradiente sobre a imagem */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F]/90 via-[#0F0F0F]/70 to-[#003399]/40" />

      {/* ── Chevrons decorativos (brand livery) ── */}
      <div className="absolute left-0 top-0 h-full w-32 flex flex-col justify-around -skew-x-6 opacity-20 pointer-events-none">
        <div className="h-12 bg-[#FF6B00]" />
        <div className="h-4 bg-[#003399]" />
        <div className="h-12 bg-[#FF6B00]" />
        <div className="h-4 bg-[#003399]" />
        <div className="h-12 bg-[#FF6B00]" />
      </div>
      <div className="absolute right-0 top-0 h-full w-32 flex flex-col justify-around skew-x-6 opacity-20 pointer-events-none">
        <div className="h-12 bg-[#FF6B00]" />
        <div className="h-4 bg-[#003399]" />
        <div className="h-12 bg-[#FF6B00]" />
        <div className="h-4 bg-[#003399]" />
        <div className="h-12 bg-[#FF6B00]" />
      </div>

      {/* ── Card central ── */}
      <div className="relative z-10 w-full max-w-md px-4">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3 mb-3">
            {/* SVG Icon do brand */}
            <svg width="48" height="48" viewBox="0 0 200 150" className="drop-shadow-lg">
              <path d="M20 75 H60 L80 30 L180 75 L80 120 L60 75" fill="#003399" />
              <path d="M85 75 L170 75" stroke="#FF6B00" strokeDasharray="10 5" strokeWidth="6" />
              <path d="M40 55 L70 55 M40 95 L70 95" stroke="#FF6B00" strokeLinecap="butt" strokeWidth="12" />
            </svg>
            <span
              className="text-3xl font-black italic tracking-tight text-white"
              style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '-0.02em' }}
            >
              SOS-<span className="text-[#FF6B00]">RODOVIAS</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-px w-12 bg-[#FF6B00]" />
            <p className="text-gray-400 text-xs tracking-[0.3em] uppercase font-semibold">
              Centro de Controle
            </p>
            <div className="h-px w-12 bg-[#FF6B00]" />
          </div>
        </div>

        {/* Card do formulário */}
        <div className="bg-[#0F0F0F]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Linha decorativa laranja no topo */}
          <div className="h-1 w-full bg-gradient-to-r from-[#FF6B00] via-[#003399] to-[#FF6B00] rounded-full mb-8" />

          <h1
            className="text-xl font-black text-white mb-6 text-center uppercase tracking-widest"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Acesso ao Sistema
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                Senha
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all placeholder-gray-600"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-400 text-xs rounded-lg px-4 py-3 flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B00] hover:bg-orange-500 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-3 rounded-lg transition-all text-sm tracking-[0.3em] uppercase shadow-lg shadow-orange-900/30 mt-2"
            >
              {loading ? 'Autenticando...' : 'Entrar'}
            </button>
          </form>

          {/* Rodapé do card */}
          <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
            <p className="text-gray-600 text-xs tracking-widest uppercase">
              Emergência 24h
            </p>
            <div className="w-2 h-2 rounded-full bg-[#003399] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
