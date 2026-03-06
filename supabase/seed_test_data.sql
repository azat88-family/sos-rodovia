-- SCRIPT DE DADOS DE TESTE INTEGRADO SOS RODOVIAS V1.1
-- Cria Admin, Operador (com dados completos) e Motorista (com veículo)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin_id UUID := gen_random_uuid();
  operator_id UUID := gen_random_uuid();
  driver_id UUID := gen_random_uuid();
  vehicle_id UUID := gen_random_uuid();

  -- Senha padrão para todos: 1234567890
  pass_hash TEXT := crypt('1234567890', gen_salt('bf'));
BEGIN

  -- 1. LIMPEZA DE DADOS ANTIGOS (OPCIONAL/OPORTUNISTA)
  -- Para evitar conflito de email se rodar 2x
  DELETE FROM auth.users WHERE email IN ('admin@sos.com.br', 'operador@sos.com.br', 'motorista@sos.com.br', 'xe.04.01.1968@gmail.com');

  -- 2. CRIAR ADMIN (Alexandre Santos)
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
  VALUES (admin_id, '00000000-0000-0000-0000-000000000000', 'xe.04.01.1968@gmail.com', pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Alexandre Santos", "role": "admin"}', now(), now(), 'authenticated');

  INSERT INTO public.profiles (id, nome_completo, email, role, aprovado, ativo)
  VALUES (admin_id, 'Alexandre Santos', 'xe.04.01.1968@gmail.com', 'admin', true, true);

  -- 3. CRIAR OPERADOR (Carlos Operacional)
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
  VALUES (operator_id, '00000000-0000-0000-0000-000000000000', 'operador@sos.com.br', pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name": "Carlos Operador", "role": "operator"}', now(), now(), 'authenticated');

  INSERT INTO public.profiles (id, nome_completo, email, role, aprovado, ativo, matricula)
  VALUES (operator_id, 'Carlos Operador', 'operador@sos.com.br', 'operator', true, true, 'OP-2026-001');

  -- Dados extras do Operador (Endereço e Contato)
  INSERT INTO public.addresses (id, user_id, cep, logradouro, numero, bairro, cidade, estado)
  VALUES (gen_random_uuid(), operator_id, '01001-000', 'Praça da Sé', '100', 'Sé', 'São Paulo', 'SP');

  INSERT INTO public.emergency_contacts (id, user_id, nome, parentesco, telefone)
  VALUES (gen_random_uuid(), operator_id, 'Maria Socorro', 'Esposa', '(11) 99999-8888');

  -- 4. CRIAR MOTORISTA (João Estrada)
  INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role)
  VALUES (driver_id, '00000000-0000-0000-0000-000000000000', 'motorista@sos.com.br', pass_hash, now(), '{"provider":"email","providers":["email"]}', '{"full_name": "João Estrada", "role": "driver"}', now(), now(), 'authenticated');

  INSERT INTO public.profiles (id, nome_completo, email, role, aprovado, ativo, cpf)
  VALUES (driver_id, 'João Estrada', 'motorista@sos.com.br', 'driver', true, true, '123.456.789-00');

  -- Criar Veículo para o Motorista
  INSERT INTO public.vehicles (id, user_id, placa, modelo, cor, ano)
  VALUES (vehicle_id, driver_id, 'ABC-1234', 'Toyota Hilux', 'Branco', 2024);

END $$;
