-- Tabela de funcionários recomendada para Supabase (Postgres)
-- Execute no SQL Editor do Supabase

-- 1) Habilitar extensão para gen_random_uuid (pgcrypto)
create extension if not exists pgcrypto;

-- 2) Criar tabela
create table if not exists public.funcionarios (
  id uuid primary key default gen_random_uuid(),
  -- opcional: vincular ao auth.users
  auth_user_id uuid references auth.users(id) on delete set null,

  -- DADOS PESSOAIS
  nome_completo varchar(150) not null,
  nome_social varchar(150),
  data_nascimento date not null,
  sexo varchar(20),
  estado_civil varchar(30),
  nacionalidade varchar(50),

  -- DOCUMENTOS
  cpf varchar(14) unique not null,
  rg varchar(20),
  orgao_emissor varchar(20),
  data_emissao_rg date,
  pis_pasep varchar(20),
  ctps_numero varchar(20),
  ctps_serie varchar(20),

  -- CONTATO
  email varchar(150) unique,
  telefone varchar(20),
  telefone_emergencia varchar(20),
  contato_emergencia varchar(150),

  -- ENDEREÇO
  cep varchar(10),
  endereco varchar(150),
  numero varchar(10),
  complemento varchar(50),
  bairro varchar(100),
  cidade varchar(100),
  estado varchar(50),
  pais varchar(50) default 'Brasil',

  -- DADOS PROFISSIONAIS
  cargo varchar(100) not null,
  departamento varchar(100),
  tipo_contrato varchar(50), -- CLT, PJ, Estágio, Temporário
  data_admissao date not null,
  data_demissao date,
  salario numeric(12,2),
  carga_horaria varchar(50),
  turno varchar(50),

  -- DADOS BANCÁRIOS (sensiveis)
  banco varchar(100),
  agencia varchar(20),
  conta varchar(30),
  tipo_conta varchar(20),
  chave_pix varchar(150),

  -- FOTO
  foto_url text,

  -- STATUS
  ativo boolean default true,
  observacoes text,

  -- AUDITORIA
  criado_em timestamptz default now(),
  atualizado_em timestamptz default now()
);

-- 3) Trigger para atualizar `atualizado_em`
create or replace function public.fn_update_timestamp()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_update_timestamp
before update on public.funcionarios
for each row
execute function public.fn_update_timestamp();

-- 4) Indexes úteis
create index if not exists idx_funcionarios_cpf on public.funcionarios (cpf);
create index if not exists idx_funcionarios_email on public.funcionarios (email);
create index if not exists idx_funcionarios_cargo on public.funcionarios (cargo);

-- 5) Row Level Security (RLS) e policies básicas
alter table public.funcionarios enable row level security;

-- Permitimos que usuários autenticados leiam seu próprio registro caso `auth_user_id` esteja preenchido
create policy "funcionarios_select_own" on public.funcionarios
  for select using (
    (auth.role() = 'authenticated' and auth.uid() = auth_user_id)
  );

-- Permitimos que usuários autenticados atualizem seu próprio registro (menos campos sensíveis)
-- Para maior segurança, recomenda-se usar uma função/stored procedure para updates que valida quais campos podem ser alterados.
create policy "funcionarios_update_own" on public.funcionarios
  for update using (
    (auth.role() = 'authenticated' and auth.uid() = auth_user_id)
  );

-- Admin (server-side/service) policies devem ser feitas com service_role key ou uma claim específica
-- Aqui apenas um exemplo: permitir seleção/insert/update via service role (server trusted)
create policy "funcionarios_manage_service_role" on public.funcionarios
  for all using (true) with check (true);

-- NOTE: The above policy "funcionarios_manage_service_role" is permissive; in production
-- you should NOT attach a permissive policy for clients. Use the service_role key on server-side only.

-- 6) Recomendações de segurança e modelagem:
-- - Separe dados sensíveis (dados bancários, CPF) em tabela com acesso restrito se necessário.
-- - Valide CPF/telefone/email no client/server antes de inserir.
-- - Para auditoria mais rica, mantenha uma tabela de histórico (logs) em vez de sobrescrever.
-- - Considere normalizar endereço em tabela separada se houver muitos endereços por funcionário.
-- - Para integração com Auth do Supabase, use `auth_user_id` referenciando `auth.users(id)`.

-- 7) Exemplo de insert (teste):
-- insert into public.funcionarios (nome_completo, data_nascimento, cpf, cargo, data_admissao)
-- values ('Fulano de Tal', '1990-01-01', '000.000.000-00', 'Operador', '2024-01-01');
