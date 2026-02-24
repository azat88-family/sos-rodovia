'use client';

import { useState } from 'react';
import { FormData } from '@/app/register/motorista/page';
import { inputClass, labelClass, lgpdNote, sectionTitle, navButtons } from './styles';

type Props = {
  data: FormData;
  update: (f: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Step3Endereco({ data, update, onNext, onPrev }: Props) {
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');

  const buscarCep = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    setLoadingCep(true);
    setCepError('');
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const json = await res.json();
      if (json.erro) {
        setCepError('CEP não encontrado.');
      } else {
        update({
          logradouro: json.logradouro,
          bairro: json.bairro,
          cidade: json.localidade,
          estado: json.uf,
        });
      }
    } catch {
      setCepError('Erro ao buscar CEP.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={sectionTitle}>📍 <span className="text-[#FF6B00]">Endereço</span></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CEP */}
        <div className="md:col-span-2">
          <label className={labelClass}>CEP *</label>
          <div className="relative">
            <input className={inputClass} required placeholder="00000-000" maxLength={9}
              value={data.cep}
              onChange={(e) => {
                update({ cep: e.target.value });
                buscarCep(e.target.value);
              }} />
            {loadingCep && (
              <span className="absolute right-3 top-3 text-[#FF6B00] text-sm animate-pulse">
                🔍 Buscando...
              </span>
            )}
          </div>
          {cepError && <p className="text-red-500 text-xs mt-1">{cepError}</p>}
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Logradouro *</label>
          <input className={inputClass} required placeholder="Rua, Avenida..."
            value={data.logradouro} onChange={(e) => update({ logradouro: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Número *</label>
          <input className={inputClass} required placeholder="123"
            value={data.numero} onChange={(e) => update({ numero: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Complemento</label>
          <input className={inputClass} placeholder="Apto, Bloco..."
            value={data.complemento} onChange={(e) => update({ complemento: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Bairro *</label>
          <input className={inputClass} required placeholder="Bairro"
            value={data.bairro} onChange={(e) => update({ bairro: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Cidade *</label>
          <input className={inputClass} required placeholder="Cidade"
            value={data.cidade} onChange={(e) => update({ cidade: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Estado *</label>
          <select className={inputClass} required
            value={data.estado} onChange={(e) => update({ estado: e.target.value })}>
            <option value="">UF</option>
            {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
              'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO']
              .map(uf => <option key={uf} value={uf}>{uf}</option>)}
          </select>
        </div>
      </div>

      <p className={lgpdNote}>
        🔒 Seu endereço é armazenado de forma segura e não será compartilhado com terceiros,
        conforme <strong>Art. 7º da LGPD</strong>. Utilizado apenas para localização em casos de emergência.
      </p>

      <div className={navButtons}>
        <button type="button" onClick={onPrev}
          className="flex-1 border-2 border-gray-600 hover:border-[#FF6B00] text-white font-black
          py-4 rounded-lg text-lg transition-all"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          ← VOLTAR
        </button>
        <button type="submit"
          className="flex-1 bg-[#FF6B00] hover:bg-orange-600 text-white font-black
          py-4 rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          PRÓXIMO →
        </button>
      </div>
    </form>
  );
}
