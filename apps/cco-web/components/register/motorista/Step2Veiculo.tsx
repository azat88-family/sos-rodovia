'use client';

import { FormData } from '@/app/register/motorista/page';
import { inputClass, labelClass, lgpdNote, sectionTitle, navButtons } from './styles';

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

      {/* Foto do veículo */}
      <div className="w-full h-40 rounded-xl bg-white/10 border-2 border-dashed border-gray-600
        flex flex-col items-center justify-center gap-2 overflow-hidden relative">
        {data.vehicle_photo ? (
          <img src={URL.createObjectURL(data.vehicle_photo)}
            className="w-full h-full object-cover" alt="veículo" />
        ) : (
          <>
            <span className="text-5xl">🚘</span>
            <span className="text-gray-500 text-sm">Foto do veículo</span>
          </>
        )}
        <label className="absolute inset-0 cursor-pointer">
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => update({ vehicle_photo: e.target.files?.[0] ?? null })} />
        </label>
      </div>
      <p className="text-center text-xs text-[#FF6B00] -mt-3 cursor-pointer font-bold">
        📷 Clique para adicionar foto do veículo
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Placa *</label>
          <input className={inputClass} required placeholder="ABC-1234"
            value={data.plate}
            onChange={(e) => update({ plate: e.target.value.toUpperCase() })} />
        </div>

        <div>
          <label className={labelClass}>Tipo de Veículo *</label>
          <select className={inputClass} required
            value={data.vehicle_type} onChange={(e) => update({ vehicle_type: e.target.value })}>
            <option value="">Selecione...</option>
            <option value="carro">🚗 Carro</option>
            <option value="moto">🏍️ Moto</option>
            <option value="caminhao">🚛 Caminhão</option>
            <option value="onibus">🚌 Ônibus</option>
            <option value="van">🚐 Van</option>
            <option value="outro">🚙 Outro</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Marca *</label>
          <input className={inputClass} required placeholder="Ex: Toyota"
            value={data.brand} onChange={(e) => update({ brand: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Modelo *</label>
          <input className={inputClass} required placeholder="Ex: Corolla"
            value={data.model} onChange={(e) => update({ model: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Ano *</label>
          <input className={inputClass} required placeholder="Ex: 2022" maxLength={4}
            value={data.year} onChange={(e) => update({ year: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Cor *</label>
          <input className={inputClass} required placeholder="Ex: Prata"
            value={data.color} onChange={(e) => update({ color: e.target.value })} />
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>RENAVAM *</label>
          <input className={inputClass} required placeholder="00000000000"
            value={data.renavam} onChange={(e) => update({ renavam: e.target.value })} />
        </div>
      </div>

      <p className={lgpdNote}>
        🔒 As informações do veículo e imagens são utilizadas para auxiliar operadores do CCO na
        identificação e no atendimento emergencial. Armazenadas com criptografia conforme Art. 46 da LGPD.
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
