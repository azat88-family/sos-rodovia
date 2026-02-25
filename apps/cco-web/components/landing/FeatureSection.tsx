const motoristFeatures = [
  {
    icon: '🆘',
    title: 'Botão SOS',
    desc: 'Um toque e o socorro é acionado automaticamente com sua localização.',
  },
  {
    icon: '📍',
    title: 'GPS em Tempo Real',
    desc: 'Localização enviada continuamente ao operador enquanto aguarda o socorro.',
  },
  {
    icon: '💬',
    title: 'Chat com Operador',
    desc: 'Comunicação direta por texto ou áudio com o CCO da rodovia.',
  },
  {
    icon: '🎙️',
    title: 'Descrição por Voz',
    desc: 'Grave um áudio descrevendo o problema. A IA transcreve automaticamente.',
  },
  {
    icon: '🗺️',
    title: 'Mapa de Atendimento',
    desc: 'Acompanhe em tempo real o status e a chegada do socorro.',
  },
  {
    icon: '🔒',
    title: 'LGPD & Privacidade',
    desc: 'Dados protegidos com consentimento explícito e criptografia HTTPS.',
  },
];

const operatorFeatures = [
  {
    icon: '📊',
    title: 'Painel de Chamados',
    desc: 'Visão geral de todos os incidentes ativos em tempo real.',
  },
  {
    icon: '🗺️',
    title: 'Mapa com Leaflet',
    desc: 'Posição de todos os motoristas no mapa com atualização automática.',
  },
  {
    icon: '🤖',
    title: 'Resumo por IA',
    desc: 'GPT classifica e resume o problema automaticamente para o operador.',
  },
  {
    icon: '🚑',
    title: 'Despacho de Socorro',
    desc: 'Acione guincho, ambulância, viatura ou mecânico com um clique.',
  },
  {
    icon: '💬',
    title: 'Chat com Motorista',
    desc: 'Converse em tempo real com o motorista via Supabase Realtime.',
  },
  {
    icon: '📋',
    title: 'Dados do Veículo',
    desc: 'Placa, modelo, ano e cor do veículo do motorista em um só lugar.',
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="funcionalidades"
      className="py-24 px-6 bg-[#0F172A]"
    >
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Motorista */}
        <div>
          <div className="text-center mb-12">
            <span className="text-[#FF6B00] font-bold tracking-widest text-sm uppercase">
              App Mobile
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-white mt-2 uppercase"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Para o <span className="text-[#FF6B00]">Motorista</span>
            </h2>
            <div className="w-16 h-1 bg-[#FF6B00] mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {motoristFeatures.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 hover:border-[#FF6B00]/50 rounded-2xl p-6 transition-all hover:-translate-y-1 group"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3
                  className="text-white font-black text-lg mb-2 group-hover:text-[#FF6B00] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Operador */}
        <div>
          <div className="text-center mb-12">
            <span className="text-[#003399] font-bold tracking-widest text-sm uppercase">
              Painel Web CCO
            </span>
            <h2
              className="text-4xl md:text-5xl font-black text-white mt-2 uppercase"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Para o <span className="text-[#003399]">Operador</span>
            </h2>
            <div className="w-16 h-1 bg-[#003399] mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {operatorFeatures.map((f) => (
              <div
                key={f.title}
                className="bg-white/5 border border-white/10 hover:border-[#003399]/60 rounded-2xl p-6 transition-all hover:-translate-y-1 group"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3
                  className="text-white font-black text-lg mb-2 group-hover:text-[#003399] transition-colors"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {f.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
