'use client';

import { useState } from 'react';
import { FormData } from '@/app/register/motorista/page';
import { inputClass, labelClass, sectionTitle, navButtons } from './styles';

type Props = {
  data: FormData;
  update: (f: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Step3Endereco({ data, update, onNext, onPrev }: Props) {
  const [loadingCep, setLoadingCep] = useState(false);

  const buscarCep = async (cep: string) => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const json = await res.json();
      if (!json.erro) {
        update({
          logradouro: json.logradouro,
          bairro: json.bairro,
          cidade: json.localidade,
          estado: json.uf,
        });
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
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
      <h2 className={sectionTitle}>📍 <span className="text-[#FF6B00]">Endereço</span> Residencial</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>CEP *</label>
          <div className="relative">
            <input
              className={inputClass}
              required
              placeholder="00000-000"
              value={data.cep}
              onChange={(e) => {
                let v = e.target.value.replace(/\D/g, '');
                if (v.length > 5) v = v.slice(0, 5) + '-' + v.slice(5, 8);
                update({ cep: v });
                if (v.replace(/\D/g, '').length === 8) buscarCep(v);
              }}
            />
            {loadingCep && <div className="absolute right-3 top-3 animate-spin text-orange-500">⏳</div>}
          </div>
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
          <label className={labelClass}>Estado (UF) *</label>
          <input className={inputClass} required placeholder="SP" maxLength={2}
            value={data.estado} onChange={(e) => update({ estado: e.target.value.toUpperCase() })} />
        </div>
      </div>

      <div className={navButtons}>
        <button type="button" onClick={onPrev} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-lg">
          ← VOLTAR
        </button>
        <button type="submit" className="flex-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-black py-4 rounded-lg uppercase tracking-widest shadow-lg shadow-orange-500/20">
          PRÓXIMO PASSO →
        </button>
      </div>
    </form>
  );
}
