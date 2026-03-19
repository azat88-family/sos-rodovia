-- SOS RODOVIA V1.1 - MIGRACAO FINAL "RODANDO LISO" - VERSAO ULTRA RESILIENTE
-- 1) LIMPEZA TOTAL DA FUNÇÃO (Evita erro 42P13)
DROP FUNCTION IF EXISTS public.get_operator_stats(uuid) CASCADE;

-- 2) ATUALIZAÇÃO DA TABELA PROFILES
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

DO $$
BEGIN
    BEGIN ALTER TABLE public.profiles ADD COLUMN email TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN aprovado BOOLEAN DEFAULT false; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN ativo BOOLEAN DEFAULT true; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN cor_veiculo TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN cpf TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN rg TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN foto_url TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;

ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('operator', 'admin', 'driver'));

-- 3) ATUALIZAÇÃO DA TABELA INCIDENTS
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$
BEGIN
    BEGIN ALTER TABLE public.incidents ADD COLUMN user_id UUID REFERENCES public.profiles(id); EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.incidents ADD COLUMN placa_veiculo TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.incidents ADD COLUMN modelo_veiculo TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.incidents ADD COLUMN cor_veiculo TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.incidents ADD COLUMN telefone TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.incidents ADD COLUMN tipo_problema TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.incidents ADD COLUMN descricao TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.incidents ADD COLUMN relatorio_operador TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;

-- 4) BOOTSTRAP DO ADMIN (USANDO ON CONFLICT PARA EVITAR ERRO 23505)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_admin_email TEXT := 'xe.04.01.1968@gmail.com';
  v_user_id UUID;
BEGIN
  -- Tenta pegar o ID se o usuário já existe no auth
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_admin_email;

  IF v_user_id IS NULL THEN
    -- Cria no Auth se não existir
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
    VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', v_admin_email, crypt('1234567890', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Alexandre Santos", "role": "admin"}', now(), now(), 'authenticated');
  END IF;

  -- Insere ou Atualiza o Perfil (Blindado contra erro de duplicata)
  INSERT INTO public.profiles (id, nome_completo, email, role, aprovado, ativo)
  VALUES (v_user_id, 'Alexandre Santos', v_admin_email, 'admin', true, true)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin', aprovado = true, email = v_admin_email, ativo = true;

END $$;

-- 5) FUNÇÃO DE ESTATÍSTICAS
CREATE FUNCTION public.get_operator_stats(p_operator_id UUID)
RETURNS TABLE(ativos BIGINT, hoje BIGINT, semana BIGINT, mes BIGINT, tempo_medio_min INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.incidents WHERE status = 'open'),
    (SELECT count(*) FROM public.incidents WHERE status = 'closed' AND updated_at::date = now()::date),
    (SELECT count(*) FROM public.incidents WHERE status = 'closed' AND updated_at >= now() - interval '7 days'),
    (SELECT count(*) FROM public.incidents WHERE status = 'closed' AND updated_at >= now() - interval '30 days'),
    15;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6) POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Políticas para PROFILES (Permitir que operadores vejam dados dos motoristas para o Sidebar)
DROP POLICY IF EXISTS "Users can select their profile" ON public.profiles;
DROP POLICY IF EXISTS "authenticated_view_profiles" ON public.profiles;
CREATE POLICY "authenticated_view_profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para INCIDENTS
DROP POLICY IF EXISTS "authenticated_can_insert_incidents" ON public.incidents;
DROP POLICY IF EXISTS "authenticated_can_view_incidents" ON public.incidents;

CREATE POLICY "authenticated_can_insert_incidents" ON public.incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_can_view_incidents" ON public.incidents FOR SELECT USING (auth.role() = 'authenticated');
