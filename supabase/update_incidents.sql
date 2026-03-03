-- Script para aprimorar a tabela `incidents`
-- Execute no SQL Editor do Supabase

-- 1) Adiciona coluna 'cor_veiculo' se não existir
ALTER TABLE public.incidents
  ADD COLUMN IF NOT EXISTS cor_veiculo TEXT;

-- 2) Garante que a coluna 'created_at' exista para ordenação (já deve existir, mas por precaução)
ALTER TABLE public.incidents
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3) Criação do índice para buscas em tempo real
CREATE INDEX IF NOT EXISTS idx_incidents_status ON public.incidents(status) WHERE status = 'open';

-- 4) Habilitar RLS se não estiver
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- 5) Policies para incidentes
-- Qualquer usuário autenticado (motorista) pode criar incidente
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_can_insert_incidents') THEN
    CREATE POLICY authenticated_can_insert_incidents ON public.incidents
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
  END IF;
END$$;

-- Todos os usuários autenticados (CCO e Motoristas) podem ver incidentes abertos
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_can_view_incidents') THEN
    CREATE POLICY authenticated_can_view_incidents ON public.incidents
      FOR SELECT USING (auth.role() = 'authenticated');
  END IF;
END$$;

-- Somente o próprio usuário ou um admin/operador pode atualizar o incidente
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'users_and_operators_can_update_incidents') THEN
    CREATE POLICY users_and_operators_can_update_incidents ON public.incidents
      FOR UPDATE USING (auth.role() = 'authenticated');
  END IF;
END$$;
