-- SOS RODOVIA V1.1 - MIGRACAO RESILIENTE
-- Execute este script para garantir que o BD está 100% pronto.

-- 1) ATUALIZAÇÃO DA TABELA PROFILES (Adicionando colunas uma a uma para evitar erros)
-- 1) ATUALIZAÇÃO DA TABELA PROFILES
-- Remove restrição antiga se existir
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

DO $$
BEGIN
    BEGIN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN aprovado BOOLEAN DEFAULT false;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN ativo BOOLEAN DEFAULT true;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;

    BEGIN
        ALTER TABLE public.profiles ADD COLUMN cor_veiculo TEXT;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;
END $$;

-- Atualiza a restrição de role para incluir 'driver'
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('operator', 'admin', 'driver'));

-- 2) TABELA DE INCIDENTES (SOS)
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

-- Adiciona colunas extras se a tabela já existia mas estava incompleta
DO $$
BEGIN
    BEGIN
        ALTER TABLE public.incidents ADD COLUMN relatorio_operador TEXT;
    EXCEPTION WHEN duplicate_column THEN NULL;
    END;
END $$;

-- 3) BOOTSTRAP DO ADMIN (Alexandre Santos)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  v_user_id UUID;
  v_admin_email TEXT := 'xe.04.01.1968@gmail.com';
BEGIN
  -- Verifica se o usuário já existe no auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = v_admin_email;

  IF v_user_id IS NULL THEN
    -- Cria novo usuário se não existir
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
    VALUES (v_user_id, '00000000-0000-0000-0000-000000000000', v_admin_email, crypt('1234567890', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Alexandre Santos", "role": "admin"}', now(), now(), 'authenticated');
  END IF;

  -- Garante que o perfil existe e está como admin aprovado
  INSERT INTO public.profiles (id, nome_completo, email, role, aprovado, ativo)
  VALUES (v_user_id, 'Alexandre Santos', v_admin_email, 'admin', true, true)
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin', aprovado = true, email = v_admin_email;

END $$;

-- 4) Função para Estatísticas do Operador (Dashboard Stats)
CREATE OR REPLACE FUNCTION public.get_operator_stats(p_operator_id UUID)
RETURNS TABLE(ativos BIGINT, concluidos_dia BIGINT, tempo_medio_min INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.incidents WHERE status = 'open'),
    (SELECT count(*) FROM public.incidents WHERE status = 'closed' AND updated_at::date = now()::date),
    15; -- Mock de tempo médio
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5) Políticas de Segurança (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_can_insert_incidents" ON public.incidents;
DROP POLICY IF EXISTS "authenticated_can_view_incidents" ON public.incidents;

CREATE POLICY "authenticated_can_insert_incidents" ON public.incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_can_view_incidents" ON public.incidents FOR SELECT USING (auth.role() = 'authenticated');
