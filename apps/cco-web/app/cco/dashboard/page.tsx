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
    nome: string
    email: string
    telefone?: string
  }
}

export default function CCODashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selected, setSelected] = useState<Incident | null>(null)
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    // Busca inicial
    supabase
      .from('incidents')
      .select('*, driver:profiles!driver_id(nome, email)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .then(({ data }) => setIncidents(data ?? []))

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
                <span className="font-semibold">{incident.driver?.nome ?? 'Motorista'}</span>
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
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">🚨 Chamado em Atendimento</h2>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-2xl">✕</button>
          </div>

          {/* Dados do motorista */}
          <div className="bg-slate-800 rounded-2xl p-6 mb-4 space-y-3">
            <h3 className="text-lg font-semibold text-red-400">👤 Dados do Motorista</h3>
            <p><span className="text-slate-400">Nome:</span> {selected.driver?.nome}</p>
            <p><span className="text-slate-400">Email:</span> {selected.driver?.email}</p>
            <p><span className="text-slate-400">Localização:</span> {selected.latitude.toFixed(6)}, {selected.longitude.toFixed(6)}</p>
            <p><span className="text-slate-400">Chamado em:</span> {new Date(selected.created_at).toLocaleString('pt-BR')}</p>
          </div>

          {/* Mapa (iframe Google Maps) */}
          <div className="rounded-2xl overflow-hidden mb-4">
            <iframe
              width="100%"
              height="300"
              style={{ border: 0 }}
              src={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}&z=15&output=embed`}
            />
          </div>

          {/* Ações */}
          <div className="flex gap-3">
            <button
              onClick={async () => {
                await supabase.from('incidents').update({ status: 'in_progress' }).eq('id', selected.id)
                setSelected(prev => prev ? { ...prev, status: 'in_progress' } : null)
              }}
              className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl"
            >
              ▶ Iniciar Atendimento
            </button>
            <button
              onClick={async () => {
                await supabase.from('incidents').update({ status: 'closed' }).eq('id', selected.id)
                setIncidents(prev => prev.filter(i => i.id !== selected.id))
                setSelected(null)
              }}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl"
            >
              ✅ Encerrar Chamado
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
