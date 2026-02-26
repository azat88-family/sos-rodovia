'use client';

import { useEffect, useState } from 'react';
import { FormData } from '@/app/register/motorista/page';
import { inputClass, labelClass, lgpdNote, sectionTitle, navButtons } from './styles';

function useObjectUrl(file: File | null) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) { setUrl(null); return; }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url;
}

type Props = {
  data: FormData;
  update: (f: Partial<FormData>) => void;
  onPrev: () => void;
  onFinish: () => void;
  loading?: boolean;
};

export default function Step5Documentos({ data, update, onPrev, onFinish, loading }: Props) {
  const cnhPhotoUrl = useObjectUrl(data.cnh_photo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={sectionTitle}>📄 <span className="text-[#FF6B00]">Documentos</span></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Número da CNH *</label>
          <input className={inputClass} required placeholder="00000000000"
            value={data.cnh_number} onChange={(e) => update({ cnh_number: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Categoria da CNH *</label>
          <select className={inputClass} required
            value={data.cnh_category} onChange={(e) => update({ cnh_category: e.target.value })}>
            <option value="">Selecione...</option>
            {['A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Validade da CNH *</label>
          <input type="date" className={inputClass} required
            value={data.cnh_expiry} onChange={(e) => update({ cnh_expiry: e.target.value })} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Foto da CNH *</label>
          <div className="w-full h-44 rounded-xl bg-white/10 border-2 border-dashed border-gray-600
            flex flex-col items-center justify-center gap-2 overflow-hidden relative cursor-pointer
            hover:border-[#FF6B00]/50 transition-all">
            {cnhPhotoUrl ? (
              <img src={cnhPhotoUrl}
                className="w-full h-full object-cover" alt="CNH" />
            ) : (
              <>
                <span className="text-5xl">🪪</span>
                <span className="text-gray-500 text-sm">Clique para enviar foto da CNH</span>
                <span className="text-gray-600 text-xs">Frente ou verso • JPG, PNG</span>
              </>
            )}
            <label className="absolute inset-0 cursor-pointer">
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => update({ cnh_photo: e.target.files?.[0] ?? null })} />
            </label>
          </div>
        </div>
      </div>

      <p className={lgpdNote}>
        🔒 Imagens e documentos são armazenados com <strong>criptografia</strong> e utilizados somente
        para validação de identidade, conforme <strong>Art. 46 da LGPD</strong>.
      </p>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input type="checkbox" required
          className="mt-1 w-4 h-4 accent-[#FF6B00] cursor-pointer" />
        <span className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
          Li e concordo com os{' '}
          <a href="/termos" className="text-[#FF6B00] underline">Termos de Uso</a> e a{' '}
          <a href="/privacidade" className="text-[#FF6B00] underline">Política de Privacidade</a> da
          plataforma SOS-Rodovias, em conformidade com a Lei nº 13.709/2018 (LGPD).
        </span>
      </label>

      <div className={navButtons}>
        <button type="button" onClick={onPrev} disabled={loading}
          className="flex-1 border-2 border-gray-600 hover:border-[#FF6B00] text-white font-black
          py-4 rounded-lg text-lg transition-all disabled:opacity-50"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          ← VOLTAR
        </button>
        <button type="submit" disabled={loading}
          className="flex-1 bg-[#003399] hover:bg-blue-800 text-white font-black
          py-4 rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-blue-900/30
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {loading ? '⏳ SALVANDO...' : '✅ FINALIZAR CADASTRO'}
        </button>
      </div>
    </form>
  );
}
