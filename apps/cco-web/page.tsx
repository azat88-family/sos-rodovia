'use client';

import { supabase } from '../../lib/supabase';

export default function TestPage() {
  
  const testar = async () => {
    console.log('🧪 TESTE INICIADO');
    console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Key existe?', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'teste@teste.com',
      password: 'test123'
    });
    
    console.log('Data:', data);
    console.log('Error:', error);
    alert(error ? 'ERRO: ' + error.message : 'SUCESSO!');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4 text-black">Teste Supabase</h1>
      <button 
        onClick={testar}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Testar Login
      </button>
    </div>
  );
}
