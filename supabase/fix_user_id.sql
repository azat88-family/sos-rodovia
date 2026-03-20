-- SOS RODOVIA V1.2 - CORREÇÃO DE COLUNAS DE IDENTIFICAÇÃO (user_id)
-- Este script garante que a coluna 'user_id' exista nas tabelas onde ela é necessária para o funcionamento do sistema.

-- 1) TABELA VEHICLES
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vehicles' AND column_name = 'user_id') THEN
        ALTER TABLE public.vehicles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 2) TABELA ADDRESSES (Se não existir, cria; se existir, garante user_id)
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  cep TEXT,
  logradouro TEXT,
  numero TEXT,
  complemento TEXT,
  bairro TEXT,
  cidade TEXT,
  estado TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'addresses' AND column_name = 'user_id') THEN
        ALTER TABLE public.addresses ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3) TABELA EMERGENCY_CONTACTS
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  relationship TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'emergency_contacts' AND column_name = 'user_id') THEN
        ALTER TABLE public.emergency_contacts ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 4) TABELA INCIDENTS (Garantir que user_id aponta para profiles.id ou auth.users.id)
-- No CCO Dashboard, usamos: select('*, driver:profiles!user_id(...)')
-- Isso exige que incidents.user_id seja uma FK para profiles.id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'incidents' AND column_name = 'user_id') THEN
        ALTER TABLE public.incidents ADD COLUMN user_id UUID REFERENCES public.profiles(id);
    END IF;
END $$;

-- 5) SINCRONIZAÇÃO DE POLÍTICAS (RLS)
-- Garante que as políticas usem 'user_id' onde aplicável

DROP POLICY IF EXISTS "users_manage_own_vehicles" ON public.vehicles;
CREATE POLICY "users_manage_own_vehicles" ON public.vehicles FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_manage_own_addresses" ON public.addresses;
CREATE POLICY "users_manage_own_addresses" ON public.addresses FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_manage_own_contacts" ON public.emergency_contacts;
CREATE POLICY "users_manage_own_contacts" ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id);

-- 6) TABELAS LEGADAS (DRIVERS/OPERATORS)
-- Se o sistema ainda usa essas tabelas separadas de profiles, garantir user_id também
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'drivers') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'drivers' AND column_name = 'user_id') THEN
            ALTER TABLE public.drivers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'operators') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'operators' AND column_name = 'user_id') THEN
            ALTER TABLE public.operators ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- 7) TABELA PROFILES (Garantir que ID é UUID)
-- Normalmente profiles.id já é UUID e refere-se a auth.users.id
