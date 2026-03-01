'use client';

import { FormData } from '@/app/register/operator/page';
import { inputClass, labelClass, sectionTitle } from '../motorista/styles';

type Props = {
  data: FormData;
  update: (f: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Step3Endereco({ data, update, onNext, onPrev }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={sectionTitle}>📍 Localização <span className="text-[#FF6B00]">Residencial</span></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>CEP *</label>
          <input className={inputClass} required placeholder="00000-000"
            value={data.cep} onChange={(e) => update({ cep: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Logradouro *</label>
          <input className={inputClass} required placeholder="Rua das Palmeiras"
            value={data.logradouro} onChange={(e) => update({ logradouro: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Número *</label>
          <input className={inputClass} required placeholder="123"
            value={data.numero} onChange={(e) => update({ numero: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Complemento</label>
          <input className={inputClass} placeholder="Apto 42"
            value={data.complemento} onChange={(e) => update({ complemento: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Bairro *</label>
          <input className={inputClass} required placeholder="Centro"
            value={data.bairro} onChange={(e) => update({ bairro: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Cidade *</label>
          <input className={inputClass} required placeholder="São Paulo"
            value={data.cidade} onChange={(e) => update({ cidade: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Estado (UF) *</label>
          <input className={inputClass} required placeholder="SP"
            maxLength={2} value={data.estado} onChange={(e) => update({ estado: e.target.value })} />
        </div>
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={onPrev} className="flex-1 bg-white/10 hover:bg-white/20 text-white
          font-black py-4 rounded-lg text-lg transition-all"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          ← VOLTAR
        </button>
        <button type="submit" className="flex-[2] bg-[#FF6B00] hover:bg-orange-600 text-white font-black
          py-4 rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/20"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          PRÓXIMO →
        </button>
      </div>
    </form>
  );
}
