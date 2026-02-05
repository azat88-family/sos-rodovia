import RegisterForm from '@/components/RegisterForm';

export default function AdminRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Cadastrar Admin</h1>
        <p className="text-sm text-gray-700 mb-4">Por segurança, a criação de administradores deve ser feita a partir do painel do Supabase ou via script de administração (server-side). Copie e execute o comando SQL abaixo no SQL Editor do seu projeto Supabase, substituindo o UUID pelo `id` do usuário do Auth:</p>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`-- Exemplo (substitua o UUID pelo id do usuário do Auth):
insert into public.profiles (id, nome_completo, matricula, role)
values ('00000000-0000-0000-0000-000000000000', 'Admin Name', '0001', 'admin');`}
        </pre>
      </div>
    </div>
  );
}
