'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Incident = {
  id: string
  status: string
  latitude: number
  longitude: number
  created_at: string
  driver: {
    nome_completo: string | null
    cpf: string | null
    foto_url: string | null
    email: string | null
  }
  placa_veiculo: string
  modelo_veiculo: string
  cor_veiculo?: string
  telefone: string
  tipo_problema: string
  descricao: string
}

export default function CCODashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selected, setSelected] = useState<Incident | null>(null)
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    // Busca inicial
    supabase
      .from('incidents')
      .select('*, driver:profiles!user_id(nome_completo, cpf, foto_url, email)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .then(({ data }) => setIncidents(data as any ?? []))

    // Realtime — escuta novos chamados
    const channel = supabase
      .channel('incidents-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'incidents',
      }, (payload) => {
        setIncidents(prev => [payload.new as Incident, ...prev])
        setHasNew(true)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <div className="flex h-screen bg-slate-900 text-white">

      {/* PAINEL ESQUERDO — lista chamados */}
      <div className={`${selected ? 'w-[30%]' : 'w-full'} transition-all border-r border-slate-700 overflow-y-auto`}>
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">Central de Operações</h1>
          {hasNew && (
            <span className="animate-pulse bg-red-500 text-white text-xs px-3 py-1 rounded-full">
              NOVO CHAMADO
            </span>
          )}
        </div>

        <div className="p-4 space-y-3">
          {incidents.map(incident => (
            <button
              key={incident.id}
              onClick={() => { setSelected(incident); setHasNew(false) }}
              className={`w-full text-left p-4 rounded-xl border transition-all
                ${incident.status === 'open'
                  ? 'border-red-500 bg-red-500/10 animate-pulse hover:animate-none hover:bg-red-500/20'
                  : 'border-slate-600 bg-slate-800 hover:bg-slate-700'
                }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${incident.status === 'open' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                <span className="font-semibold">{incident.driver?.nome_completo ?? 'Motorista'}</span>
              </div>
              <p className="text-slate-400 text-sm mt-1">
                {new Date(incident.created_at).toLocaleTimeString('pt-BR')}
              </p>
            </button>
          ))}

          {incidents.length === 0 && (
            <p className="text-slate-500 text-center mt-12">Nenhum chamado aberto</p>
          )}
        </div>
      </div>

      {/* PAINEL DIREITO — detalhes do chamado (Picture-in-Picture) */}
      {selected && (
        <div className="flex-1 p-6 overflow-y-auto bg-black/40">
          <div className="max-w-md mx-auto">
             <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#FF6B00] italic">ALERTA SOS</h2>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-2xl">✕</button>
            </div>

            {/* CARD ESTILO SOLICITADO */}
            <div className="bg-[#1A1A1A] border-2 border-red-600 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-red-600 p-3 text-center font-black tracking-widest text-white">
                🔴 ALERTA SOS EM TEMPO REAL
              </div>

              <div className="p-4 border-b border-white/10 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
                  {selected.driver?.foto_url ? (
                    <img src={selected.driver.foto_url} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-3xl">👤</div>
                  )}
                </div>
                <div>
                  <p className="text-xl font-black text-white">{selected.driver?.nome_completo || 'Motorista'}</p>
                  <p className="text-gray-400 font-mono text-sm">CPF: {selected.driver?.cpf || '---.---.---.--'}</p>
                </div>
              </div>

              <div className="p-4 border-b border-white/10 bg-black/20">
                <p className="text-xs font-bold text-[#FF6B00] uppercase mb-2">🚗 Informações do Veículo</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-500">Placa:</span> <span className="text-white font-bold">{selected.placa_veiculo}</span></p>
                  <p><span className="text-gray-500">Modelo:</span> <span className="text-white font-bold">{selected.modelo_veiculo}</span></p>
                  <p><span className="text-gray-500">Cor:</span> <span className="text-white font-bold">{selected.cor_veiculo || 'N/A'}</span></p>
                  <p><span className="text-gray-500">Tel:</span> <span className="text-white font-bold">{selected.telefone}</span></p>
                </div>
              </div>

              <div className="p-4 border-b border-white/10">
                <p className="text-xs font-bold text-[#FF6B00] uppercase mb-2">📍 Localização e Problema</p>
                <p className="text-sm text-white font-bold mb-1">{selected.tipo_problema}</p>
                <p className="text-xs text-gray-400 italic mb-3">"{selected.descricao}"</p>

                <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-1">
                  <p className="text-xs font-mono text-gray-300">Lat: {selected.latitude.toFixed(6)}</p>
                  <p className="text-xs font-mono text-gray-300">Lng: {selected.longitude.toFixed(6)}</p>
                </div>
              </div>

              <div className="p-3 bg-black/60 flex justify-between items-center px-4">
                <p className="text-xs font-mono text-gray-400">{new Date(selected.created_at).toLocaleTimeString('pt-BR')} • Agora</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span className="text-[10px] font-bold text-red-500">LIVE</span>
                </div>
              </div>

              <div className="p-4 flex gap-3">
                <button className="flex-1 bg-green-600 hover:bg-green-500 text-white font-black py-3 rounded-xl shadow-lg shadow-green-900/20 transition-all uppercase text-sm">
                  ✅ Assumir
                </button>
                <a href={`tel:${selected.telefone}`} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-black py-3 rounded-xl shadow-lg shadow-blue-900/20 transition-all text-center uppercase text-sm">
                  📞 Ligar
                </a>
              </div>
            </div>

            {/* Mapa (Iframe de apoio) */}
            <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 h-48">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}&z=15&output=embed`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
