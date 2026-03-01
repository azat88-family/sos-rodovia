'use client';

import { useEffect, useState } from 'react';
import { FormData } from '@/app/register/operator/page';
import { inputClass, selectClass, labelClass, lgpdNote, sectionTitle } from '../motorista/styles';

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
  onNext: () => void;
};

export default function Step1DadosPessoais({ data, update, onNext }: Props) {
  const photoUrl = useObjectUrl(data.photo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.password !== data.confirm_password) {
      alert("As senhas não coincidem!");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={sectionTitle}>👤 Dados <span className="text-[#FF6B00]">Pessoais</span></h2>

      {/* Foto de perfil */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-dashed border-gray-600
          flex items-center justify-center text-4xl overflow-hidden">
          {photoUrl
            ? <img src={photoUrl} className="w-full h-full object-cover" alt="foto" />
            : '📷'}
        </div>
        <label className="cursor-pointer text-sm text-[#FF6B00] font-bold hover:underline">
          Adicionar foto 3x4 (Perfil)
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => update({ photo: e.target.files?.[0] ?? null })} />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className={labelClass}>Nome Completo *</label>
          <input className={inputClass} required placeholder="João da Silva"
            value={data.full_name} onChange={(e) => update({ full_name: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>CPF *</label>
          <input className={inputClass} required placeholder="000.000.000-00"
            value={data.cpf} onChange={(e) => update({ cpf: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Telefone *</label>
          <input className={inputClass} required placeholder="(11) 99999-9999"
            value={data.phone} onChange={(e) => update({ phone: e.target.value })} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>E-mail *</label>
          <input type="email" className={inputClass} required placeholder="joao@email.com"
            value={data.email} onChange={(e) => update({ email: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Senha *</label>
          <input type="password" minLength={6} className={inputClass} required placeholder="••••••••"
            value={data.password} onChange={(e) => update({ password: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Confirmar Senha *</label>
          <input type="password" minLength={6} className={inputClass} required placeholder="••••••••"
            value={data.confirm_password} onChange={(e) => update({ confirm_password: e.target.value })} />
        </div>
      </div>

      <p className={lgpdNote}>
        🔒 Seus dados pessoais são protegidos pela <strong>Lei nº 13.709/2018 (LGPD)</strong>.
      </p>

      <button type="submit" className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-black
        py-4 rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
        style={{ fontFamily: 'Montserrat, sans-serif' }}>
        PRÓXIMO →
      </button>
    </form>
  );
}
