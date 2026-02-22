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
      <div className="absolute inset-0 bg-white/70" />
      <div className="relative z-10 w-full max-w-md bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-4">Cadastrar Operador</h1>
        <RegisterForm role="operador" />
      </div>
    </div>
  );
}

