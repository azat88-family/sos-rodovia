import RegisterForm from '@/components/RegisterForm';

export default function OperatorRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Cadastrar Operador</h1>
        <RegisterForm role="operator" />
      </div>
    </div>
  );
}
