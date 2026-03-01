'use client';

import { FormData } from '@/app/register/operator/page';
import { inputClass, labelClass, sectionTitle } from '../motorista/styles';

type Props = {
  data: FormData;
  update: (f: Partial<FormData>) => void;
  onFinish: () => void;
  onPrev: () => void;
  loading: boolean;
};

export default function Step4Contato({ data, update, onFinish, onPrev, loading }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinish();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className={sectionTitle}>🆘 Contato de <span className="text-[#FF6B00]">Emergência</span></h2>

      <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-4">
        <div>
          <label className={labelClass}>Nome do Contato *</label>
          <input className={inputClass} required placeholder="Maria Souza"
            value={data.contact_name} onChange={(e) => update({ contact_name: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Parentesco / Vínculo *</label>
          <input className={inputClass} required placeholder="Esposa, Mãe, Irmão..."
            value={data.contact_relation} onChange={(e) => update({ contact_relation: e.target.value })} />
        </div>

        <div>
          <label className={labelClass}>Telefone do Contato *</label>
          <input className={inputClass} required placeholder="(11) 98888-7777"
            value={data.contact_phone} onChange={(e) => update({ contact_phone: e.target.value })} />
        </div>
      </div>

      <div className="flex gap-4">
        <button type="button" onClick={onPrev} disabled={loading} className="flex-1 bg-white/10 hover:bg-white/20 text-white
          font-black py-4 rounded-lg text-lg transition-all disabled:opacity-50"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          ← VOLTAR
        </button>
        <button type="submit" disabled={loading} className="flex-[2] bg-[#FF6B00] hover:bg-orange-600 text-white font-black
          py-4 rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/20 disabled:opacity-50"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {loading ? 'CADASTRANDO...' : 'FINALIZAR CADASTRO ✓'}
        </button>
      </div>
    </form>
  );
}
