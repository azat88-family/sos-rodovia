export default function Footer() {
  return (
    <footer className="bg-[#0F0F0F] border-t border-gray-800 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 100 100">
            <path
              d="M10 50 L40 50 L55 20 L90 50 L55 80 L40 50"
              fill="none"
              stroke="#FF6B00"
              strokeLinejoin="round"
              strokeWidth="8"
            />
            <path
              d="M30 40 L85 40 M30 60 L85 60"
              stroke="#003399"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>
          <span
            className="text-xl font-black italic text-white"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            SOS-<span className="text-[#FF6B00]">RODOVIAS</span>
          </span>
        </div>

        {/* Cores da marca */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#FF6B00]" title="Electric Orange #FF6B00" />
          <div className="w-6 h-6 rounded-full bg-[#003399]" title="Deep Cobalt #003399" />
          <div className="w-6 h-6 rounded-full bg-[#0F0F0F] border border-gray-600" title="Onyx Black #0F0F0F" />
          <span className="text-gray-600 text-xs ml-2">Brand Colors</span>
        </div>

        <p className="text-gray-600 text-sm text-center">
          © {new Date().getFullYear()} SOS-Rodovias. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
