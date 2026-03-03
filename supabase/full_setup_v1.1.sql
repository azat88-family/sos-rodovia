-- MIGRACAO COMPLETA SOS RODOVIA V1.1
-- Execute no SQL Editor do Supabase para garantir que o BD está 100% sincronizado.

-- 1) Tabela Profiles & Colunas de Controle
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS aprovado BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS cor_veiculo TEXT,
  ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;

-- Garante que admins existentes estejam aprovados
UPDATE public.profiles SET aprovado = true WHERE role = 'admin' OR role = 'administrador';

-- 2) Tabela Incidents - Aprimoramento
ALTER TABLE public.incidents
  ADD COLUMN IF NOT EXISTS cor_veiculo TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 3) Admin Alexandre Santos (Bootstrap Seguro)
CREATE EXTENSION IF NOT EXISTS pgcrypto;
DO $$
DECLARE
  new_id UUID := gen_random_uuid();
  admin_email TEXT := 'xe.04.01.1968@gmail.com';
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
    VALUES (new_id, '00000000-0000-0000-0000-000000000000', admin_email, crypt('1234567890', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Alexandre Santos", "role": "admin"}', now(), now(), 'authenticated');

    INSERT INTO public.profiles (id, nome_completo, email, role, aprovado, ativo)
    VALUES (new_id, 'Alexandre Santos', admin_email, 'admin', true, true);
  ELSE
    UPDATE public.profiles SET role = 'admin', aprovado = true WHERE email = admin_email;
  END IF;
END $$;

-- 4) Políticas de Segurança (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Drop de políticas antigas se necessário para evitar conflitos e recriação limpa
DROP POLICY IF EXISTS "authenticated_can_insert_incidents" ON public.incidents;
DROP POLICY IF EXISTS "authenticated_can_view_incidents" ON public.incidents;

CREATE POLICY "authenticated_can_insert_incidents" ON public.incidents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "authenticated_can_view_incidents" ON public.incidents FOR SELECT USING (auth.role() = 'authenticated');
