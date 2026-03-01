'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Step1DadosPessoais from '@/components/register/operator/Step1DadosPessoais';
import Step2MatriculaFoto from '@/components/register/operator/Step2MatriculaFoto';
import Step3Endereco from '@/components/register/operator/Step3Endereco';
import Step4Contato from '@/components/register/operator/Step4Contato';

const STEPS = [
  { id: 1, label: 'Pessoais', icon: '👤' },
  { id: 2, label: 'Matrícula', icon: '🆔' },
  { id: 3, label: 'Endereço',  icon: '📍' },
  { id: 4, label: 'Contato',   icon: '🆘' },
];

export type FormData = {
  full_name: string; cpf: string; phone: string; email: string;
  password: string; confirm_password: string; photo: File | null;
  registration: string;
  cep: string; logradouro: string; numero: string; complemento: string;
  bairro: string; cidade: string; estado: string;
  contact_name: string; contact_relation: string; contact_phone: string;
};

const initialData: FormData = {
  full_name: '', cpf: '', phone: '', email: '', password: '', confirm_password: '', photo: null,
  registration: '',
  cep: '', logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
  contact_name: '', contact_relation: '', contact_phone: '',
};

async function uploadFile(file: File, bucket: string, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) { console.error('Upload error:', error); return null; }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export default function OperatorRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData]       = useState<FormData>(initialData);
  const [completed, setCompleted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const updateData = (fields: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const next = () => setCurrentStep((s) => Math.min(s + 1, 4));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const finish = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.full_name, role: 'operator', aprovado: false } },
      });

      if (authError) throw new Error(authError.message);
      const userId = authData.user?.id;
      if (!userId) throw new Error('Usuário não criado.');

      const avatarUrl = formData.photo
        ? await uploadFile(formData.photo, 'avatars', `${userId}/avatar_${Date.now()}`)
        : null;

      // 1. Salvar perfil
      const { error: pErr } = await supabase.from('profiles').insert({
        id: userId,
        nome_completo: formData.full_name,
        email: formData.email,
        role: 'operator',
        matricula: formData.registration,
        foto_url: avatarUrl,
        celular: formData.phone,
        cpf: formData.cpf,
        aprovado: false, // Inicia como falso para aprovação do admin
        ativo: true
      });
      if (pErr) throw pErr;

      // 2. Salvar endereço
      await supabase.from('addresses').insert({
        user_id: userId,
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado
      });

      // 3. Salvar contato emergência
      await supabase.from('emergency_contacts').insert({
        user_id: userId,
        name: formData.contact_name,
        relationship: formData.contact_relation,
        phone: formData.contact_phone
      });

      setCompleted(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar.');
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  if (completed) {
    return (
      <main className="bg-[#0F0F0F] min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-lg">
          <div className="text-7xl">⏳</div>
          <h1 className="text-4xl font-black text-white uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Cadastro <span className="text-[#FF6B00]">Enviado!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Sua conta de Operador CCO foi criada com sucesso. <br/>
            <strong>Atenção:</strong> O acesso só será liberado após a aprovação do administrador <strong>Alexandre Santos</strong>.
          </p>
          <Link href="/login"
            className="inline-block bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-10 py-4
            rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            IR PARA LOGIN
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#0F0F0F] min-h-screen">
      <header className="bg-[#0F0F0F] border-b border-gray-800 py-4 px-6 md:px-10
        flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
           <svg width="36" height="36" viewBox="0 0 100 100">
            <path d="M10 50 L40 50 L55 20 L90 50 L55 80 L40 50"
              fill="none" stroke="#FF6B00" strokeLinejoin="round" strokeWidth="8" />
            <path d="M30 40 L85 40 M30 60 L85 60"
              stroke="#003399" strokeLinecap="round" strokeWidth="4" />
          </svg>
          <span className="text-xl font-black italic text-white"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            SOS-<span className="text-[#FF6B00]">RODOVIAS</span>
          </span>
        </Link>
        <Link href="/login"
          className="bg-[#FF6B00] text-white px-5 py-2 rounded font-bold
          hover:bg-orange-600 transition-colors text-sm">
          ENTRAR
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/40
            text-[#FF6B00] px-4 py-1.5 rounded-full text-sm font-bold tracking-widest mb-4">
            🏢 CADASTRO DE OPERADOR CCO
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Portal do <span className="text-[#FF6B00]">Operador</span>
          </h1>
          <p className="text-gray-400 mt-2">Preencha os dados abaixo para submeter sua conta à aprovação</p>
        </div>

        {/* Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            {STEPS.map((step) => (
              <div key={step.id} className="flex flex-col items-center gap-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                  font-black border-2 transition-all
                  ${currentStep === step.id
                    ? 'bg-[#FF6B00] border-[#FF6B00] text-white scale-110'
                    : currentStep > step.id
                    ? 'bg-[#003399] border-[#003399] text-white'
                    : 'bg-transparent border-gray-700 text-gray-500'}`}>
                  {currentStep > step.id ? '✓' : step.icon}
                </div>
                <span className={`text-xs font-bold hidden sm:block
                  ${currentStep === step.id ? 'text-[#FF6B00]' : 'text-gray-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-gradient-to-r from-[#FF6B00] to-orange-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-400
            rounded-xl px-5 py-4 text-sm font-medium">
            ❌ {error}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-sm shadow-2xl">
          {currentStep === 1 && <Step1DadosPessoais data={formData} update={updateData} onNext={next} />}
          {currentStep === 2 && <Step2MatriculaFoto data={formData} update={updateData} onNext={next} onPrev={prev} />}
          {currentStep === 3 && <Step3Endereco       data={formData} update={updateData} onNext={next} onPrev={prev} />}
          {currentStep === 4 && <Step4Contato        data={formData} update={updateData} onFinish={finish} onPrev={prev} loading={loading} />}
        </div>
      </div>
    </main>
  );
}
