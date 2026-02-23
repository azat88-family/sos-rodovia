'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-[#0F0F0F] border-b border-gray-800 py-4 px-6 md:px-10 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <svg width="36" height="36" viewBox="0 0 100 100">
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
          className="brand-font text-xl font-black italic text-white"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          SOS-<span className="text-[#FF6B00]">RODOVIAS</span>
        </span>
      </div>

      {/* Nav Desktop */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-bold tracking-widest text-gray-300">
        <a href="#funcionalidades" className="hover:text-[#FF6B00] transition-colors">
          FUNCIONALIDADES
        </a>
        <a href="#como-funciona" className="hover:text-[#FF6B00] transition-colors">
          COMO FUNCIONA
        </a>
        <a href="#sobre" className="hover:text-[#FF6B00] transition-colors">
          SOBRE
        </a>
        <Link
          href="/login"
          className="bg-[#FF6B00] text-white px-5 py-2 rounded font-bold hover:bg-orange-600 transition-colors"
        >
          ENTRAR
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {menuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#0F0F0F] border-t border-gray-800 flex flex-col items-center gap-4 py-6 md:hidden">
          <a href="#funcionalidades" className="text-gray-300 hover:text-[#FF6B00] font-bold tracking-widest text-sm">
            FUNCIONALIDADES
          </a>
          <a href="#como-funciona" className="text-gray-300 hover:text-[#FF6B00] font-bold tracking-widest text-sm">
            COMO FUNCIONA
          </a>
          <a href="#sobre" className="text-gray-300 hover:text-[#FF6B00] font-bold tracking-widest text-sm">
            SOBRE
          </a>
          <Link href="/login" className="bg-[#FF6B00] text-white px-6 py-2 rounded font-bold">
            ENTRAR
          </Link>
        </div>
      )}
    </header>
  );
}
