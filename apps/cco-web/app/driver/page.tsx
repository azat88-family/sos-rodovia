'use client'
import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function DriverDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    supabase.auth.getUser().then(({data}) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      })
    }
  }, [])

  const handleSOS = async () => {
    if (!user || !location) {
      alert('Aguardando localização...')
      return
    }

    setLoading(true)
    setStatus('sending')

    // Buscar dados do perfil e veículo (corrigindo nomes de colunas conforme BD)
    const { data: profile } = await supabase.from('profiles').select('celular, telefone').eq('id', user.id).maybeSingle()
    const { data: vehicle } = await supabase.from('vehicles').select('*').eq('user_id', user.id).maybeSingle()

    const { error } = await supabase.from('incidents').insert({
      user_id: user.id,
      latitude: location.lat,
      longitude: location.lng,
      status: 'open',
      placa_veiculo: vehicle?.plate || vehicle?.placa || 'N/A',
      modelo_veiculo: vehicle?.model || vehicle?.modelo || 'N/A',
      cor_veiculo: vehicle?.color || vehicle?.cor || 'N/A',
      tipo_problema: 'EMERGÊNCIA SOS',
      descricao: 'Botão SOS pressionado via Web Dashboard',
      telefone: profile?.celular || profile?.telefone || user.phone || user.user_metadata?.telefone || 'N/A'
    })

    if (!error) {
      setStatus('sent')
      alert('SOS ENVIADO! A central foi notificada.')
    } else {
      setStatus('idle')
      alert('Erro ao enviar SOS: ' + error.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0B10] text-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0F1117] border border-white/5 rounded-[40px] p-10 shadow-2xl text-center relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 blur-[80px]" />

        <h1 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
          Área do <span className="text-orange-500">Motorista</span>
        </h1>
        <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-10">Central de Emergência</p>

        <div className="relative group mb-10">
          <div className={`absolute inset-0 bg-red-600 blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity ${status === 'sending' ? 'animate-ping' : ''}`} />
          <button
            onClick={handleSOS}
            disabled={loading}
            className={`relative w-48 h-48 rounded-full border-8 border-black shadow-2xl transition-all active:scale-95 flex flex-col items-center justify-center gap-2
              ${status === 'sending' ? 'bg-red-800' : 'bg-red-600 hover:bg-red-500'}
            `}
          >
            <span className="text-5xl">🆘</span>
            <span className="font-black text-2xl tracking-tighter uppercase italic">SOS</span>
          </button>
        </div>

        <div className="space-y-4 text-left">
           <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Localização Atual</p>
              <p className="text-xs font-mono">
                {location ? `LAT: ${location.lat.toFixed(4)} | LNG: ${location.lng.toFixed(4)}` : 'Buscando satélites...'}
              </p>
           </div>

           <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Usuário Conectado</p>
              <p className="text-xs font-bold text-gray-300">{user?.email}</p>
           </div>
        </div>

        <button
          onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
          className="mt-10 text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.3em] transition-colors"
        >
          Sair do Sistema
        </button>
      </div>

      <p className="mt-8 text-[10px] text-gray-600 font-mono">SISTEMA SOS RODOVIAS V1.1 • 2026</p>
    </div>
  )
}
