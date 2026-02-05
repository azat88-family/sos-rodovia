-- Script seguro e idempotente para ajustar a tabela `profiles` e policies
-- Execute no SQL Editor do Supabase **após** fazer backup do banco (Export > SQL dump).
-- Este script tenta criar a tabela se não existir e acrescentar colunas sem remover nada.

-- 1) Cria tabela `profiles` caso não exista (não sobrescreve)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo text,
  matricula text,
  foto_url text,
  role text default 'operator' check (role in ('operator','admin')),
  created_at timestamptz default now()
);

-- 2) Adiciona colunas extras se estiverem faltando (ex.: foto_url, role)
alter table public.profiles
  add column if not exists foto_url text,
  add column if not exists role text default 'operator',
  add column if not exists created_at timestamptz default now();

-- 3) Garante RLS habilitado (no Postgres não há IF NOT EXISTS para ENABLE RLS,
-- mas isso é idempotente: habilitar se já estiver habilitado não altera).
alter table public.profiles enable row level security;

-- 4) Cria policies básicas somente se ainda não existirem.
-- PostgreSQL não tem CREATE POLICY IF NOT EXISTS em versões mais antigas,
-- portanto usamos DO blocks para verificar antes de criar.

-- Allow insert by authenticated users but only as operator (prevenção de elevação de privilégio)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p WHERE p.policyname = 'allow_insert_authenticated'
  ) THEN
    CREATE POLICY allow_insert_authenticated ON public.profiles
      FOR INSERT USING (auth.role() = 'authenticated')
      WITH CHECK (auth.role() = 'authenticated' AND (role = 'operator' OR role IS NULL));
  END IF;
END$$;

-- Allow users to select/update their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p WHERE p.policyname = 'users_can_select_own_profile'
  ) THEN
    CREATE POLICY users_can_select_own_profile ON public.profiles
      FOR SELECT USING (auth.role() = 'authenticated' AND id = auth.uid());
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies p WHERE p.policyname = 'users_can_update_own_profile'
  ) THEN
    CREATE POLICY users_can_update_own_profile ON public.profiles
      FOR UPDATE USING (auth.role() = 'authenticated' AND id = auth.uid());
  END IF;
END$$;

-- 5) Index simples (id já é PK). Adiciona índice na matrícula se necessário.
create index if not exists idx_profiles_matricula on public.profiles (matricula);

-- 6) Observações: este script é conservador e não remove colunas/policies.
-- Antes de executar, faça backup completo do projeto Supabase (Project > Settings > Database > Backups).

-- 7) Se detectar triggers/funções que causam recursão (erro 42P17), investigue com:
-- SELECT t.tgname, pg_get_triggerdef(t.oid) AS definition
-- FROM pg_trigger t
-- JOIN pg_class c ON t.tgrelid = c.oid
-- WHERE c.relname = 'profiles';

-- Também verifique funções que referenciam 'profiles':
-- SELECT proname, pg_get_functiondef(p.oid) AS source
-- FROM pg_proc p
-- WHERE pg_get_functiondef(p.oid) ILIKE '%profiles%';

-- Cole os resultados acima e eu ajudo a revisar as funções/triggers para remover recursão.
