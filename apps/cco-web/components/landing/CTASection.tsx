import Link from 'next/link';

export default function CTASection() {
  return (
    <section id="sobre" className="py-24 px-6 bg-[#0F172A]">
      <div className="max-w-6xl mx-auto">
        {/* Tech Stack */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl md:text-4xl font-black text-white uppercase mb-4"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Tecnologias <span className="text-[#FF6B00]">Utilizadas</span>
          </h2>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto mb-10" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { name: 'React Native', icon: '📱', desc: 'App Mobile' },
              { name: 'Next.js', icon: '🌐', desc: 'Painel CCO' },
              { name: 'Supabase', icon: '🗄️', desc: 'Backend & DB' },
              { name: 'GPT', icon: '🤖', desc: 'IA & Resumos' },
              { name: 'Whisper', icon: '🎙️', desc: 'Transcrição' },
              { name: 'Leaflet', icon: '🗺️', desc: 'Mapas Web' },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-[#FF6B00]/40 transition-all"
              >
                <div className="text-3xl mb-2">{tech.icon}</div>
                <div className="text-white font-bold text-sm">{tech.name}</div>
                <div className="text-gray-500 text-xs mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="relative bg-gradient-to-r from-[#FF6B00]/20 via-[#003399]/20 to-[#FF6B00]/20 border border-[#FF6B00]/30 rounded-3xl p-10 md:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[#FF6B00]/5 blur-3xl" />
          <div className="relative z-10">
            <div className="text-5xl mb-4">🚨</div>
            <h2
              className="text-3xl md:text-5xl font-black text-white uppercase mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Pronto para <span className="text-[#FF6B00]">começar</span>?
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
              Acesse o painel CCO, cadastre operadores ou registre motoristas na plataforma SOS-Rodovias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-10 py-4 rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                🔐 ENTRAR NO CCO
              </Link>
              <Link
                href="/register/operator"
                className="bg-[#003399] hover:bg-blue-800 text-white font-black px-10 py-4 rounded-lg text-lg transition-all hover:scale-105"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                👤 CADASTRAR OPERADOR
              </Link>
              <Link
                href="/register/user"
                className="border-2 border-gray-600 hover:border-[#FF6B00] text-white font-black px-10 py-4 rounded-lg text-lg transition-all hover:scale-105"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                🚗 CADASTRAR MOTORISTA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
