const steps = [
  {
    num: '01',
    color: '#FF6B00',
    title: 'Motorista aciona o SOS',
    desc: 'Com um toque no app, o motorista envia localização GPS e abre o chamado automaticamente.',
    icon: '📱',
  },
  {
    num: '02',
    color: '#003399',
    title: 'IA classifica o problema',
    desc: 'O GPT analisa a descrição por texto ou áudio (via Whisper) e gera um resumo para o operador.',
    icon: '🤖',
  },
  {
    num: '03',
    color: '#FF6B00',
    title: 'Operador visualiza no CCO',
    desc: 'O chamado aparece no painel web com mapa, dados do motorista e resumo da IA em tempo real.',
    icon: '🖥️',
  },
  {
    num: '04',
    color: '#003399',
    title: 'Chat e acompanhamento',
    desc: 'Operador e motorista conversam via chat. O motorista vê o status do atendimento no mapa.',
    icon: '💬',
  },
  {
    num: '05',
    color: '#FF6B00',
    title: 'Despacho do socorro',
    desc: 'Operador aciona guincho, ambulância, viatura ou mecânico conforme a classificação.',
    icon: '🚑',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-[#0F0F0F]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#FF6B00] font-bold tracking-widest text-sm uppercase">
            Fluxo do Sistema
          </span>
          <h2
            className="text-4xl md:text-5xl font-black text-white mt-2 uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Como <span className="text-[#FF6B00]">Funciona</span>
          </h2>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto mt-4" />
        </div>

        <div className="relative">
          {/* Linha vertical conectora */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#FF6B00] via-[#003399] to-[#FF6B00] hidden md:block" />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6 items-start group">
                {/* Número */}
                <div
                  className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center font-black text-white text-lg shrink-0 shadow-lg"
                  style={{
                    backgroundColor: step.color,
                    fontFamily: 'Montserrat, sans-serif',
                    boxShadow: `0 0 20px ${step.color}40`,
                  }}
                >
                  {step.icon}
                </div>

                {/* Conteúdo */}
                <div className="bg-white/5 border border-white/10 hover:border-white/20 rounded-2xl p-6 flex-1 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-xs font-black tracking-widest"
                      style={{ color: step.color, fontFamily: 'Montserrat, sans-serif' }}
                    >
                      PASSO {step.num}
                    </span>
                  </div>
                  <h3
                    className="text-white font-black text-xl mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
