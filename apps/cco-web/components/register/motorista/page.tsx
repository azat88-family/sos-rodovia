'use client';

import { useState } from 'react';
import Step1DadosPessoais from '@/components/register/motorista/Step1DadosPessoais';
import Step2Veiculo from '@/components/register/motorista/Step2Veiculo';
import Step3Endereco from '@/components/register/motorista/Step3Endereco';
import Step4Emergencia from '@/components/register/motorista/Step4Emergencia';
import Step5Documentos from '@/components/register/motorista/Step5Documentos';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const STEPS = [
  { id: 1, label: 'Dados Pessoais', icon: '👤' },
  { id: 2, label: 'Veículo',        icon: '🚗' },
  { id: 3, label: 'Endereço',       icon: '📍' },
  { id: 4, label: 'Emergência',     icon: '🆘' },
  { id: 5, label: 'Documentos',     icon: '📄' },
];

export type FormData = {
  full_name: string; cpf_cnpj: string; phone: string; birth_date: string;
  gender: string; email: string; password: string; confirm_password: string;
  photo: File | null;
  plate: string; brand: string; model: string; year: string; color: string;
  vehicle_type: string; renavam: string; vehicle_photo: File | null;
  cep: string; logradouro: string; numero: string; complemento: string;
  bairro: string; cidade: string; estado: string;
  ec1_name: string; ec1_relationship: string; ec1_phone: string;
  ec2_name: string; ec2_relationship: string; ec2_phone: string;
  cnh_number: string; cnh_category: string; cnh_expiry: string; cnh_photo: File | null;
};

const initialData: FormData = {
  full_name: '', cpf_cnpj: '', phone: '', birth_date: '', gender: '',
  email: '', password: '', confirm_password: '', photo: null,
  plate: '', brand: '', model: '', year: '', color: '',
  vehicle_type: '', renavam: '', vehicle_photo: null,
  cep: '', logradouro: '', numero: '', complemento: '',
  bairro: '', cidade: '', estado: '',
  ec1_name: '', ec1_relationship: '', ec1_phone: '',
  ec2_name: '', ec2_relationship: '', ec2_phone: '',
  cnh_number: '', cnh_category: '', cnh_expiry: '', cnh_photo: null,
};

async function uploadFile(file: File, bucket: string, path: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) { console.error('Upload error:', error); return null; }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return urlData.publicUrl;
}

export default function MotoristaRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData]       = useState<FormData>(initialData);
  const [completed, setCompleted]     = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const updateData = (fields: Partial<FormData>) =>
    setFormData((prev) => ({ ...prev, ...fields }));

  const next = () => setCurrentStep((s) => Math.min(s + 1, 5));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  // ✅ finish CORRIGIDO
  const finish = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.full_name, role: 'driver' } },
      });
      if (authError) throw new Error(`Erro ao criar conta: ${authError.message}`);
      const userId = authData.user?.id;
      if (!userId) throw new Error('Erro ao obter ID do usuário.');

      // 2. Login imediato para ativar sessão (necessário para RLS + Storage)
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (loginError) throw new Error(`Erro ao autenticar: ${loginError.message}`);

      const timestamp = Date.now();

      // 3. Upload fotos (agora com sessão ativa)
      const avatarUrl = formData.photo
        ? await uploadFile(formData.photo, 'avatars', `${userId}/avatar_${timestamp}`)
        : null;

      const vehiclePhotoUrl = formData.vehicle_photo
        ? await uploadFile(formData.vehicle_photo, 'vehicles', `${userId}/vehicle_${timestamp}`)
        : null;

      const cnhPhotoUrl = formData.cnh_photo
        ? await uploadFile(formData.cnh_photo, 'documents', `${userId}/cnh_${timestamp}`)
        : null;

      // 4. Insert → drivers (tabela correta para motoristas!)
      const { error: driverError } = await supabase.from('drivers').insert({
        id:         userId,
        full_name:  formData.full_name,
        cpf_cnpj:   formData.cpf_cnpj,
        phone:      formData.phone,
        birth_date: formData.birth_date || null,
        avatar_url: avatarUrl,
        status:     'active',
      });
      if (driverError) throw new Error(`Erro ao salvar motorista: ${driverError.message}`);

      // 5. Insert → users (tabela pública de referência)
      const { error: userError } = await supabase.from('users').insert({
        id:        userId,
        role:      'driver',
        full_name: formData.full_name,
        phone:     formData.phone,
        cpf_cnpj:  formData.cpf_cnpj,
      });
      if (userError) throw new Error(`Erro ao salvar usuário: ${userError.message}`);

      // 6. Insert → vehicles
      const { error: vehicleError } = await supabase.from('vehicles').insert({
        user_id:      userId,
        plate:        formData.plate,
        brand:        formData.brand,
        model:        formData.model,
        year:         parseInt(formData.year) || null,
        color:        formData.color,
        vehicle_type: formData.vehicle_type,
        renavam:      formData.renavam,
        photo_url:    vehiclePhotoUrl,
      });
      if (vehicleError) throw new Error(`Erro ao salvar veículo: ${vehicleError.message}`);

      // 7. Insert → addresses
      const { error: addressError } = await supabase.from('addresses').insert({
        user_id:     userId,
        cep:         formData.cep,
        logradouro:  formData.logradouro,
        numero:      formData.numero,
        complemento: formData.complemento || null,
        bairro:      formData.bairro,
        cidade:      formData.cidade,
        estado:      formData.estado,
      });
      if (addressError) throw new Error(`Erro ao salvar endereço: ${addressError.message}`);

      // 8. Insert → emergency_contacts
      const contacts = [
        { user_id: userId, name: formData.ec1_name, relationship: formData.ec1_relationship, phone: formData.ec1_phone },
        { user_id: userId, name: formData.ec2_name, relationship: formData.ec2_relationship, phone: formData.ec2_phone },
      ].filter((c) => c.name && c.phone);

      if (contacts.length > 0) {
        const { error: ecError } = await supabase.from('emergency_contacts').insert(contacts);
        if (ecError) throw new Error(`Erro ao salvar contatos de emergência: ${ecError.message}`);
      }

      setCompleted(true);

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro no cadastro:', err);
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;

  if (completed) {
    return (
      <main className="bg-[#0F0F0F] min-h-screen flex items-center justify-center px-6">
        <div className="text-center space-y-6 max-w-lg">
          <div className="text-7xl">🎉</div>
          <h1 className="text-4xl font-black text-white uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Cadastro <span className="text-[#FF6B00]">Concluído!</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Seus dados foram enviados com sucesso. Em breve você receberá um e-mail de confirmação.
          </p>
          <Link href="/login"
            className="inline-block bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-10 py-4
            rounded-lg text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            🔐 ENTRAR NO SISTEMA
          </Link>
          <div>
            <Link href="/" className="text-gray-500 hover:text-gray-300 text-sm underline">
              Voltar ao início
            </Link>
          </div>
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
            🚗 CADASTRO DE MOTORISTA
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Crie sua <span className="text-[#FF6B00]">conta</span>
          </h1>
          <p className="text-gray-400 mt-2">Preencha os dados abaixo para se cadastrar na plataforma</p>
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
          <div className="text-right text-xs text-gray-500 mt-1">
            Step {currentStep} de {STEPS.length}
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/40 text-red-400
            rounded-xl px-5 py-4 text-sm font-medium">
            ❌ {error}
          </div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-sm">
          {currentStep === 1 && <Step1DadosPessoais data={formData} update={updateData} onNext={next} />}
          {currentStep === 2 && <Step2Veiculo       data={formData} update={updateData} onNext={next} onPrev={prev} />}
          {currentStep === 3 && <Step3Endereco      data={formData} update={updateData} onNext={next} onPrev={prev} />}
          {currentStep === 4 && <Step4Emergencia    data={formData} update={updateData} onNext={next} onPrev={prev} />}
          {currentStep === 5 && (
            <Step5Documentos data={formData} update={updateData}
              onPrev={prev} onFinish={finish} loading={loading} />
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-6 leading-relaxed max-w-xl mx-auto">
          🔒 Seus dados são protegidos pela <strong className="text-gray-500">Lei nº 13.709/2018 (LGPD)</strong>.
          Ao se cadastrar, você concorda com nossa{' '}
          <a href="#" className="underline hover:text-gray-400">Política de Privacidade</a> e{' '}
          <a href="#" className="underline hover:text-gray-400">Termos de Uso</a>.
        </p>
      </div>
    </main>
  );
}
