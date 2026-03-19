'use client';

import { useState } from 'react';
import { FormData } from '@/app/register/motorista/page';
import { inputClass, labelClass, sectionTitle, navButtons } from './styles';
import InputMask from 'react-input-mask';

type Props = {
  data: FormData;
  update: (f: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Step4Emergencia({ data, update, onNext, onPrev }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={sectionTitle}>🆘 Contato de <span className="text-[#FF6B00]">Emergência</span></h2>

      <div className="border border-[#FF6B00]/30 rounded-xl p-6 space-y-4 bg-white/5">
        <p className="text-[#FF6B00] font-black text-xs tracking-[0.2em] uppercase">Contato Principal</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Nome Completo *</label>
            <input className={inputClass} required placeholder="Ex: Maria da Silva"
              value={data.ec1_name} onChange={(e) => update({ ec1_name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Parentesco *</label>
            <select className={inputClass} required
              value={data.ec1_relationship} onChange={(e) => update({ ec1_relationship: e.target.value })}>
              <option value="">Selecione...</option>
              <option value="conjuge">Cônjuge</option>
              <option value="pai_mae">Pai / Mãe</option>
              <option value="filho">Filho(a)</option>
              <option value="irmao">Irmão / Irmã</option>
              <option value="amigo">Amigo(a)</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Telefone *</label>
            <InputMask
              mask="(99) 99999-9999"
              value={data.ec1_phone}
              onChange={(e) => update({ ec1_phone: e.target.value })}
              className={inputClass}
              required
              placeholder="(11) 99999-9999"
            />
          </div>
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
