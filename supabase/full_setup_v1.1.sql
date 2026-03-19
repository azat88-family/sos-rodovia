-- SOS RODOVIA V1.1 - SINCRONIZAÇÃO TOTAL DE NOMES E ESTRUTURA
-- 1) LIMPEZA DE FUNÇÕES ANTIGAS
DROP FUNCTION IF EXISTS public.get_operator_stats(uuid) CASCADE;

-- 2) PADRONIZAÇÃO DA TABELA PROFILES (NOMES EM PORTUGUÊS)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
DO $$
BEGIN
    BEGIN ALTER TABLE public.profiles ADD COLUMN email TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN nome_completo TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN telefone TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN celular TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN cpf TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN rg TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN matricula TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN foto_url TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'driver'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN aprovado BOOLEAN DEFAULT false; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.profiles ADD COLUMN ativo BOOLEAN DEFAULT true; EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('operator', 'admin', 'driver'));

-- 3) PADRONIZAÇÃO DA TABELA VEHICLES
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  placa TEXT,
  marca TEXT,
  modelo TEXT,
  ano INTEGER,
  cor TEXT,
  renavam TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Adiciona colunas se a tabela já existia com nomes em inglês
DO $$
BEGIN
    BEGIN ALTER TABLE public.vehicles ADD COLUMN placa TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.vehicles ADD COLUMN marca TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.vehicles ADD COLUMN modelo TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.vehicles ADD COLUMN cor TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE public.vehicles ADD COLUMN renavam TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
END $$;

-- 4) PADRONIZAÇÃO DA TABELA INCIDENTS
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'open',
  placa_veiculo TEXT,
  modelo_veiculo TEXT,
  cor_veiculo TEXT,
  telefone TEXT,
  tipo_problema TEXT,
  descricao TEXT,
  relatorio_operador TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5) FUNÇÃO DE ESTATÍSTICAS
CREATE OR REPLACE FUNCTION public.get_operator_stats(p_operator_id UUID)
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
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_view_profiles" ON public.profiles;
CREATE POLICY "authenticated_view_profiles" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "authenticated_manage_own_vehicles" ON public.vehicles;
CREATE POLICY "authenticated_manage_own_vehicles" ON public.vehicles FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "authenticated_manage_incidents" ON public.incidents;
CREATE POLICY "authenticated_manage_incidents" ON public.incidents FOR ALL USING (auth.role() = 'authenticated');

-- 7) EMERGENCY CONTACTS RLS
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "authenticated_view_contacts" ON public.emergency_contacts;
CREATE POLICY "authenticated_view_contacts" ON public.emergency_contacts FOR SELECT USING (auth.role() = 'authenticated');
DROP POLICY IF EXISTS "users_manage_own_contacts" ON public.emergency_contacts;
CREATE POLICY "users_manage_own_contacts" ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- 8) BOOTSTRAP DO ADMIN ALEXANDRE
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'xe.04.01.1968@gmail.com';
  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, nome_completo, email, role, aprovado, ativo)
    VALUES (v_user_id, 'Alexandre Santos', 'xe.04.01.1968@gmail.com', 'admin', true, true)
    ON CONFLICT (id) DO UPDATE SET role = 'admin', aprovado = true;
  END IF;
END $$;
