'use client';

import { FormData } from '@/app/register/operator/page';
import { inputClass, labelClass, sectionTitle } from '../motorista/styles';

type Props = {
  data: FormData;
  update: (f: Partial<FormData>) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Step2MatriculaFoto({ data, update, onNext, onPrev }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={sectionTitle}>🆔 Matrícula e <span className="text-[#FF6B00]">Acesso</span></h2>

      <div className="space-y-4">
        <div>
          <label className={labelClass}>Número de Matrícula *</label>
          <input className={inputClass} required placeholder="Ex: 2024.1234"
            value={data.registration} onChange={(e) => update({ registration: e.target.value })} />
          <p className="text-gray-500 text-xs mt-1">Este número será usado para sua identificação oficial no CCO.</p>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl">
          <p className="text-orange-300 text-sm font-bold flex items-center gap-2">
            ⚠️ Atenção
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Após o cadastro, sua conta ficará <strong>pendente de aprovação</strong> pelo administrador do sistema.
            Você só poderá acessar o painel CCO após a autorização do Sr. Alexandre Santos.
          </p>
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
