'use client'
import { useEffect, useState, useRef } from 'react'
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
  relatorio_operador?: string
}

export default function CCODashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selected, setSelected] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [protocolText, setProtocolText] = useState('')
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({ ativos: 0, hoje: 0, semana: 0, mes: 0, tempo: '15m' })
  const [userId, setUserId] = useState<string | null>(null)

  // Audio Ref for Alert
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        fetchStats(user.id)
      }
      fetchIncidents()
    }

    setup()

    // Setup audio alert
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')

    // Realtime — escuta novos chamados
    const channel = supabase
      .channel('incidents-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'incidents',
      }, (payload) => {
        fetchIncidentDetails(payload.new.id)
        fetchStats()
        // Play alert sound
        audioRef.current?.play().catch(() => console.log('Audio play blocked by browser'))
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'incidents',
      }, () => {
        fetchIncidents()
        fetchStats()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    if (selected) {
      setProtocolText(selected.relatorio_operador || '')
    }
  }, [selected])

  const fetchIncidents = async () => {
    const { data, error } = await supabase
      .from('incidents')
      .select('*, driver:profiles!user_id(nome_completo, cpf, foto_url, email)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (!error) {
      setIncidents(data as any ?? [])
    }
    setLoading(false)
  }

  const fetchStats = async (uid?: string) => {
    const idToUse = uid || userId
    if (!idToUse) return

    const { data } = await supabase.rpc('get_operator_stats', { p_operator_id: idToUse })
    if (data && data[0]) {
      setStats({
        ativos: data[0].ativos,
        hoje: data[0].hoje,
        semana: data[0].semana,
        mes: data[0].mes,
        tempo: `${data[0].tempo_medio_min}m`
      })
    }
  }

  const fetchIncidentDetails = async (id: string) => {
    const { data } = await supabase
      .from('incidents')
      .select('*, driver:profiles!user_id(nome_completo, cpf, foto_url, email)')
      .eq('id', id)
      .single()

    if (data) {
      setIncidents(prev => {
        const exists = prev.find(i => i.id === id)
        if (exists) return prev
        return [data as any, ...prev]
      })
    }
  }

  const handleSaveProtocol = async () => {
    if (!selected) return
    setSaving(true)
    const { error } = await supabase
      .from('incidents')
      .update({ relatorio_operador: protocolText })
      .eq('id', selected.id)

    if (!error) {
      // Update local state
      setIncidents(prev => prev.map(i => i.id === selected.id ? { ...i, relatorio_operador: protocolText } : i))
      alert('Protocolo salvo com sucesso!')
    } else {
      alert('Erro ao salvar protocolo: ' + error.message)
    }
    setSaving(false)
  }

  const handleAssume = async () => {
    if (!selected || !userId) return
    setSaving(true)

    const { error } = await supabase
      .from('incidents')
      .update({
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', selected.id)

    if (!error) {
      alert('Chamado assumido! Agora ele está em progresso.')
      setSelected(null)
      fetchIncidents()
      fetchStats()
    } else {
      alert('Erro ao assumir chamado: ' + error.message)
    }
    setSaving(false)
  }

  return (
    <div className="flex h-screen bg-[#0A0B10] text-white font-sans selection:bg-orange-500/30">

      {/* BARRA LATERAL ESQUERDA - LISTA DE INCIDENTES */}
      <aside className={`${selected ? 'w-80' : 'w-96'} flex-shrink-0 flex flex-col border-r border-white/5 bg-[#0F1117] transition-all duration-500`}>
        <div className="p-6 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            <h1 className="text-lg font-black tracking-tight uppercase italic text-gray-200">
              CCO <span className="text-orange-500">Rodovias</span>
            </h1>
          </div>
          <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">Monitoramento em Tempo Real</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-40 space-y-3 opacity-50">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono uppercase tracking-widest">Sincronizando...</p>
             </div>
          ) : incidents.length > 0 ? (
            incidents.map(incident => (
              <button
                key={incident.id}
                onClick={() => setSelected(incident)}
                className={`group relative w-full text-left p-4 rounded-2xl border transition-all duration-300 overflow-hidden
                  ${selected?.id === incident.id
                    ? 'border-orange-500/50 bg-orange-500/5 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                  }`}
              >
                {/* Indicador Ativo */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all
                  ${selected?.id === incident.id ? 'bg-orange-500' : 'bg-transparent group-hover:bg-white/20'}`}
                />

                <div className="flex justify-between items-start mb-2">
                   <span className="text-[10px] font-mono text-gray-500">
                    {new Date(incident.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                   </span>
                   <span className="text-[9px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase">
                    SOS
                   </span>
                </div>

                <div className="font-bold text-gray-200 group-hover:text-white transition-colors">
                  {incident.driver?.nome_completo || 'Motorista não identificado'}
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded border border-white/5 text-gray-400 font-mono">
                    {incident.placa_veiculo}
                  </span>
                  <span className="text-[10px] text-gray-500 truncate">
                    {incident.tipo_problema}
                  </span>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full opacity-30 text-center p-8">
              <div className="text-4xl mb-4">📡</div>
              <p className="text-sm font-medium uppercase tracking-widest">Aguardando novos chamados</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-black/20 border-t border-white/5">
           <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
              <span>SISTEMA V1.1</span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> ONLINE
              </span>
           </div>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 relative flex flex-col overflow-hidden">

        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent">
             <div className="relative mb-8">
                <div className="absolute inset-0 bg-orange-500 blur-[100px] opacity-10 animate-pulse" />
                <div className="relative w-32 h-32 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent flex items-center justify-center text-5xl shadow-2xl">
                  🛰️
                </div>
             </div>
             <h2 className="text-3xl font-black italic tracking-tighter text-gray-100 mb-4 uppercase">
               Centro de Controle Operacional
             </h2>
             <p className="max-w-md text-gray-500 leading-relaxed font-medium">
               Selecione um chamado na lista lateral para visualizar os detalhes, localização exata e iniciar o protocolo de atendimento.
             </p>

             <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-16 w-full max-w-5xl">
                {[
                  { label: 'ATIVOS', val: stats.ativos, color: 'text-red-500' },
                  { label: 'HOJE', val: stats.hoje, color: 'text-blue-400' },
                  { label: 'SEMANA', val: stats.semana, color: 'text-blue-500' },
                  { label: 'MÊS', val: stats.mes, color: 'text-blue-600' },
                  { label: 'TEMPO MÉDIO', val: stats.tempo, color: 'text-green-500' }
                ].map(stat => (
                  <div key={stat.label} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all transform hover:-translate-y-1">
                    <div className={`text-2xl font-black mb-1 ${stat.color}`}>{stat.val}</div>
                    <div className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">{stat.label}</div>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="flex-1 flex animate-in fade-in slide-in-from-right-4 duration-500">
            {/* DETALHES DO INCIDENTE */}
            <div className="w-[450px] flex-shrink-0 overflow-y-auto border-r border-white/5 bg-[#0F1117]/50 backdrop-blur-xl p-8 custom-scrollbar">
               <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase">Detalhes do SOS</h2>
                    <p className="text-[10px] text-orange-500 font-bold tracking-widest uppercase">Protocolo: #{selected.id.slice(0,8)}</p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
               </div>

               {/* CARD MOTORISTA */}
               <div className="bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-6 mb-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <span className="text-4xl">👤</span>
                  </div>

                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gray-800 border-2 border-orange-500/30 overflow-hidden shadow-xl">
                      {selected.driver?.foto_url ? (
                        <img src={selected.driver.foto_url} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl bg-orange-500/10">👤</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white leading-tight">{selected.driver?.nome_completo || 'N/A'}</h3>
                      <p className="text-xs font-mono text-gray-500 mt-1">CPF: {selected.driver?.cpf || '---.---.---.--'}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20">VERIFICADO</span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500 text-[10px] font-bold border border-blue-500/20">MOTORISTA</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <p className="text-[9px] font-black text-orange-500 tracking-[0.2em] uppercase mb-3">Veículo Solicitante</p>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Placa</p>
                          <p className="text-sm font-black text-gray-200">{selected.placa_veiculo}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Modelo</p>
                          <p className="text-sm font-black text-gray-200">{selected.modelo_veiculo}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Cor</p>
                          <p className="text-sm font-black text-gray-200">{selected.cor_veiculo || 'Não informada'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-0.5">Telefone</p>
                          <p className="text-sm font-black text-gray-200">{selected.telefone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-500/5 rounded-2xl p-4 border border-red-500/10">
                      <p className="text-[9px] font-black text-red-500 tracking-[0.2em] uppercase mb-2">Relato do Problema</p>
                      <p className="text-sm font-bold text-gray-200 mb-1">{selected.tipo_problema}</p>
                      <p className="text-xs text-gray-400 italic leading-relaxed">"{selected.descricao}"</p>
                    </div>

                    {/* PROTOCOLO DE ATENDIMENTO */}
                    <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-500/10">
                      <p className="text-[9px] font-black text-blue-500 tracking-[0.2em] uppercase mb-2">Protocolo de Atendimento (Log)</p>
                      <textarea
                        value={protocolText}
                        onChange={(e) => setProtocolText(e.target.value)}
                        placeholder="Descreva as ações tomadas..."
                        className="w-full h-24 bg-black/30 border border-white/5 rounded-xl p-3 text-xs text-gray-300 focus:outline-none focus:border-blue-500/50 transition-colors resize-none mb-3"
                      />
                      <button
                        onClick={handleSaveProtocol}
                        disabled={saving}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-widest transition-all"
                      >
                        {saving ? 'Salvando...' : 'Salvar Protocolo'}
                      </button>
                    </div>
                  </div>
               </div>

               <div className="flex gap-4">
                  <button
                    onClick={handleAssume}
                    disabled={saving}
                    className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-[0_10px_20px_rgba(234,88,12,0.2)] transition-all uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                  >
                    <span>⚡</span> {saving ? 'Processando...' : 'Assumir Chamado'}
                  </button>
                  <a
                    href={`tel:${selected.telefone}`}
                    className="w-16 h-16 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 flex items-center justify-center text-xl transition-all"
                  >
                    📞
                  </a>
               </div>
            </div>

            {/* MAPA EM TELA CHEIA */}
            <div className="flex-1 relative bg-[#0A0B10]">
               <iframe
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(1.2) contrast(1.2)' }}
                src={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}&z=16&output=embed`}
              />

              {/* Overlay de coordenadas */}
              <div className="absolute bottom-8 left-8 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 font-mono text-[10px] text-gray-300">
                <div className="flex items-center gap-4">
                  <div>LAT: {selected.latitude.toFixed(6)}</div>
                  <div>LNG: {selected.longitude.toFixed(6)}</div>
                  <div className="text-orange-500 font-bold underline cursor-pointer">COPIAR COORDS</div>
                </div>
              </div>

              {/* Tag de Live */}
              <div className="absolute top-8 right-8 flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full shadow-2xl animate-pulse">
                <div className="w-2 h-2 rounded-full bg-white" />
                <span className="text-[10px] font-black tracking-widest">LIVE TRACKING</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}
