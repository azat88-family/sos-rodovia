-- Script para adicionar coluna de aprovação e criar admin Alexandre Santos
-- Execute no SQL Editor do Supabase

-- 1) Adiciona coluna 'aprovado' na tabela profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS aprovado BOOLEAN DEFAULT false;

-- 2) Atualiza admins existentes para aprovado = true
UPDATE public.profiles SET aprovado = true WHERE role = 'admin' OR role = 'administrador';

-- 3) Criação do admin Alexandre Santos no auth.users (se não existir)
-- Nota: Senha '1234567890' deve ser criptografada. O Supabase cuida disso via UI ou Edge Functions.
-- Mas via SQL, podemos usar uma função ou apenas preparar o perfil.
-- Como não podemos gerar o hash de senha exato facilmente via SQL puro sem extensões pgcrypto específicas configuradas,
-- o ideal é que o usuário se cadastre ou use o script abaixo se o pgcrypto estiver ativo.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'xe.04.01.1968@gmail.com';
  admin_name TEXT := 'Alexandre Santos';
BEGIN
  -- Verifica se o usuário já existe
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    )
    VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      admin_email,
      crypt('1234567890', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      format('{"full_name": "%s", "role": "admin"}', admin_name)::jsonb,
      now(),
      now(),
      'authenticated',
      '',
      '',
      '',
      ''
    );

    -- Insere no public.profiles
    INSERT INTO public.profiles (id, nome_completo, email, role, aprovado, ativo)
    VALUES (new_user_id, admin_name, admin_email, 'admin', true, true);
  ELSE
    -- Se já existe, garante que é admin e aprovado
    UPDATE public.profiles
    SET role = 'admin', aprovado = true, nome_completo = admin_name
    WHERE email = admin_email;
  END IF;
END $$;
