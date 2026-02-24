'use client';

import { FormData } from '@/app/register/motorista/page';
import { inputClass, labelClass, lgpdNote, sectionTitle, navButtons } from './styles';

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

      {/* Contato 1 */}
      <div className="border border-[#FF6B00]/30 rounded-xl p-4 space-y-4">
        <p className="text-[#FF6B00] font-bold text-sm tracking-widest">CONTATO PRINCIPAL</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Nome Completo *</label>
            <input className={inputClass} required placeholder="Maria da Silva"
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
            <input className={inputClass} required placeholder="(11) 99999-9999"
              value={data.ec1_phone} onChange={(e) => update({ ec1_phone: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Contato 2 */}
      <div className="border border-gray-700 rounded-xl p-4 space-y-4">
        <p className="text-gray-400 font-bold text-sm tracking-widest">CONTATO SECUNDÁRIO (opcional)</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Nome Completo</label>
            <input className={inputClass} placeholder="Carlos da Silva"
              value={data.ec2_name} onChange={(e) => update({ ec2_name: e.target.value })} />
          </div>
          <div>
            <label className={labelClass}>Parentesco</label>
            <select className={inputClass}
              value={data.ec2_relationship} onChange={(e) => update({ ec2_relationship: e.target.value })}>
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
            <label className={labelClass}>Telefone</label>
            <input className={inputClass} placeholder="(11) 99999-9999"
              value={data.ec2_phone} onChange={(e) => update({ ec2_phone: e.target.value })} />
          </div>
        </div>
      </div>

      <p className={lgpdNote}>
        🔒 Ao informar dados de terceiros, você declara ter autorização do titular para compartilhá-los,
        conforme <strong>Art. 7º, IX da LGPD</strong>. Esses contatos serão acionados apenas em situações
        de emergência.
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
