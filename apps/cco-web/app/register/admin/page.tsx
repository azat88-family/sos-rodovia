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
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 w-full max-w-md bg-black/60 p-6 rounded shadow-xl border border-yellow-400">
        <h1 className="text-xl font-bold mb-4 text-yellow-200">Cadastrar Admin</h1>
        <p className="text-sm text-lime-300 mb-4">
          Por segurança, admins são criados diretamente via SQL:
        </p>
        <pre className="bg-black/80 border border-yellow-200/40 p-3 rounded text-sm overflow-auto text-lime-300">
{`insert into public.profiles (id, nome_completo, matricula, role)
values ('00000000-...', 'Admin Name', '0001', 'admin');`}
        </pre>
      </div>
    </div>
  );
}
