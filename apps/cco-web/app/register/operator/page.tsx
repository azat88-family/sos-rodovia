import RegisterForm from '@/components/RegisterForm';

export default function OperatorRegister() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage: "url('/login.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 w-full max-w-md bg-black/60 p-6 rounded shadow-xl border border-yellow-400">
        <h1 className="text-xl font-bold mb-4 text-yellow-200">Cadastrar Operador</h1>
        <RegisterForm role="operator" />
      </div>
    </div>
  );
}
