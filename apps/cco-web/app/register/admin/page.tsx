export default function AdminRegister() {
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
        <h1 className="text-xl font-bold mb-4">Cadastrar Admin</h1>
        <p className="text-sm text-gray-700 mb-4">Por segurança...</p>
        <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
{`insert into public.profiles (id, nome_completo, matricula, role)
values ('00000000-...', 'Admin Name', '0001', 'admin');`}
        </pre>
      </div>
    </div>
  );
}

