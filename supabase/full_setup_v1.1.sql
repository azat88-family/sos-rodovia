-- SOS RODOVIA V1.1 - MIGRACAO FINAL "RODANDO LISO"
-- 1) LIMPEZA TOTAL DA FUNÇÃO ANTES DE QUALQUER COISA
-- Isso evita o erro de "cannot change return type"
DROP FUNCTION IF EXISTS public.get_operator_stats(uuid) CASCADE;

-- 2) ATUALIZAÇÃO DA TABELA PROFILES
-- Remove trava antiga e adiciona colunas necessárias
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS aprovado BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cor_veiculo TEXT;

-- Reinstala a trava permitindo todos os roles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('operator', 'admin', 'driver'));

-- 3) ATUALIZAÇÃO DA TABELA INCIDENTS (SOS)
-- Garante que a tabela existe e tem todas as colunas para o SOS funcionar
CREATE TABLE IF NOT EXISTS public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS placa_veiculo TEXT;
ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS modelo_veiculo TEXT;
ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS cor_veiculo TEXT;
ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS telefone TEXT;
ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS tipo_problema TEXT;
ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE public.incidents ADD COLUMN IF NOT EXISTS relatorio_operador TEXT;

-- 4) CRIAÇÃO DA NOVA VERSÃO DA FUNÇÃO DE ESTATÍSTICAS
-- Agora com suporte a Dia, Semana e Mês
CREATE FUNCTION public.get_operator_stats(p_operator_id UUID)
RETURNS TABLE(ativos BIGINT, hoje BIGINT, semana BIGINT, mes BIGINT, tempo_medio_min INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT count(*) FROM public.incidents WHERE status = 'open'),
    (SELECT count(*) FROM public.incidents WHERE status = 'closed' AND updated_at::date = now()::date),
    (SELECT count(*) FROM public.incidents WHERE status = 'closed' AND updated_at >= now() - interval '7 days'),
    (SELECT count(*) FROM public.incidents WHERE status = 'closed' AND updated_at >= now() - interval '30 days'),
    15; -- Tempo médio mockado
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5) POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated_can_insert_incidents" ON public.incidents;
DROP POLICY IF EXISTS "authenticated_can_view_incidents" ON public.incidents;

CREATE POLICY "authenticated_can_insert_incidents" ON public.incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_can_view_incidents" ON public.incidents FOR SELECT USING (auth.role() = 'authenticated');
