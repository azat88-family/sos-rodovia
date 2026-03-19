'use client';

import { FormData } from '@/app/register/motorista/page';
import { inputClass, labelClass, sectionTitle } from './styles';

type Props = {
  data: FormData;
  update: (f: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Step2Veiculo({ data, update, onNext, onPrev }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={sectionTitle}>🚗 Dados do <span className="text-[#FF6B00]">Veículo</span></h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Placa *</label>
          <input
            className={inputClass}
            required
            placeholder="ABC-1234"
            value={data.plate}
            onChange={(e) => {
              let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
              if (v.length > 3) v = v.slice(0, 3) + '-' + v.slice(3, 7);
              update({ plate: v });
            }}
          />
        </div>

        <div>
          <label className={labelClass}>Renavam *</label>
          <input
            className={inputClass}
            required
            placeholder="00000000000"
            type="text"
            pattern="\d*"
            maxLength={11}
            value={data.renavam}
            onChange={(e) => update({ renavam: e.target.value.replace(/\D/g, '') })}
          />
        </div>

        <div>
          <label className={labelClass}>Marca *</label>
          <input className={inputClass} required placeholder="Ex: Toyota"
            value={data.brand} onChange={(e) => update({ brand: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Modelo *</label>
          <input className={inputClass} required placeholder="Ex: Hilux"
            value={data.model} onChange={(e) => update({ model: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Ano *</label>
          <input className={inputClass} required placeholder="2024"
            type="text"
            pattern="\d{4}"
            maxLength={4}
            value={data.year} onChange={(e) => update({ year: e.target.value.replace(/\D/g, '') })} />
        </div>

        <div>
          <label className={labelClass}>Cor *</label>
          <input className={inputClass} required placeholder="Ex: Branco"
            value={data.color} onChange={(e) => update({ color: e.target.value })} />
        </div>
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={onPrev} className="flex-1 bg-gray-800 text-white font-bold py-4 rounded-lg">
          ← VOLTAR
        </button>
        <button type="submit" className="flex-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-black py-4 rounded-lg uppercase tracking-widest">
          PRÓXIMO PASSO →
        </button>
      </div>
    </form>
  );
}
