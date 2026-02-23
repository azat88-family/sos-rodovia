import Link from 'next/link';

export default function HeroSection() {
  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0F0F0F 0%, #0F172A 50%, #0F0F0F 100%)',
      }}
    >
      {/* Linha de rodovia animada - background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-full bg-[#FF6B00]" />
        <div className="absolute bottom-0 left-[calc(50%-80px)] w-1 h-full bg-gray-500" />
        <div className="absolute bottom-0 left-[calc(50%+80px)] w-1 h-full bg-gray-500" />
      </div>

      {/* Glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF6B00]/10 rounded-full blur-[120px]" />

      <div className="relative z-10 text-center max-w-5xl mx-auto space-y-8">
        {/* Logo grande */}
        <div className="flex justify-center mb-4">
          <svg width="120" height="90" viewBox="0 0 200 150">
            <path d="M20 75 H60 L80 30 L180 75 L80 120 L60 75" fill="#003399" />
            <path
              d="M85 75 L170 75"
              stroke="#FF6B00"
              strokeDasharray="10 5"
              strokeWidth="6"
            />
            <path
              d="M40 55 L70 55 M40 95 L70 95"
              stroke="#FF6B00"
              strokeLinecap="butt"
              strokeWidth="12"
            />
          </svg>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-[#FF6B00] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest">
          🚨 EMERGÊNCIA 24H • RODOVIAS DO BRASIL
        </div>

        {/* Título */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          SOS-<span className="text-[#FF6B00]">RODOVIAS</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Plataforma inteligente de assistência ao motorista em rodovias.
          Conectamos <strong className="text-white">motoristas em emergência</strong> com{' '}
          <strong className="text-white">operadores do CCO</strong> em tempo real, com IA e rastreamento GPS.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-4">
          {[
            { value: '24/7', label: 'Monitoramento' },
            { value: 'IA', label: 'Classificação Auto.' },
            { value: 'GPS', label: 'Tempo Real' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-3xl font-black text-[#FF6B00]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link
            href="/login"
            className="w-full sm:w-auto bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-8 py-4 rounded-lg text-lg tracking-wide transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            🔐 ENTRAR NO SISTEMA
          </Link>
          <Link
            href="/register/operator"
            className="w-full sm:w-auto bg-[#003399] hover:bg-blue-800 text-white font-black px-8 py-4 rounded-lg text-lg tracking-wide transition-all hover:scale-105 shadow-lg shadow-blue-900/30"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            👤 CADASTRAR OPERADOR
          </Link>
          <Link
            href="/register/user"
            className="w-full sm:w-auto bg-transparent border-2 border-gray-600 hover:border-[#FF6B00] text-white font-black px-8 py-4 rounded-lg text-lg tracking-wide transition-all hover:scale-105"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            🚗 CADASTRAR MOTORISTA
          </Link>
        </div>
      </div>
    </section>
  );
}
