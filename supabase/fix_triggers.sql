-- FIX FINAL - REMOVENDO TRIGGERS PROBLEMATICOS
-- Este script limpa triggers que podem estar impedindo a criação de usuários drivers.

-- 1) Lista e remove triggers na tabela auth.users se existirem (comum em Supabase para sync de profiles)
DO $$
DECLARE
    trig_name RECORD;
BEGIN
    FOR trig_name IN
        SELECT trigger_name
        FROM information_schema.triggers
        WHERE event_object_schema = 'auth' AND event_object_table = 'users'
    LOOP
        EXECUTE 'DROP TRIGGER ' || trig_name.trigger_name || ' ON auth.users';
    END LOOP;
END $$;

-- 2) Cria um NOVO trigger limpo e resiliente para sincronizar perfis
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, role, email, aprovado)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'operator'),
    new.email,
    CASE WHEN (new.raw_user_meta_data->>'role') = 'admin' THEN true ELSE false END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplica o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3) Garante que a coluna role permite 'driver'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('operator', 'admin', 'driver'));
