-- 1) Create profiles table (if not exists)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo text,
  matricula text,
  foto_url text,
  role text default 'operator' check (role in ('operator', 'admin', 'driver')),
  cpf text,
  celular text,
  data_nascimento date,
  gender text,
  email text,
  cnh_number text,
  cnh_category text,
  cnh_expiry date,
  cnh_photo_url text,
  ativo boolean default true,
  created_at timestamptz default now()
);

-- 2) Vehicles Table
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  plate text not null,
  brand text,
  model text,
  year integer,
  color text,
  vehicle_type text,
  renavam text,
  photo_url text,
  created_at timestamptz default now()
);

-- 3) Addresses Table
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  cep text,
  logradouro text,
  numero text,
  complemento text,
  bairro text,
  cidade text,
  estado text,
  created_at timestamptz default now()
);

-- 4) Emergency Contacts Table
create table if not exists public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text,
  relationship text,
  phone text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.addresses enable row level security;
alter table public.emergency_contacts enable row level security;

-- Policies for profiles
create policy "Allow insert for authenticated" on public.profiles
  for insert using (auth.role() = 'authenticated') with check (auth.uid() = id and (role in ('operator', 'driver') or role is null));

create policy "Users can select their profile" on public.profiles
  for select using (auth.role() = 'authenticated' and id = auth.uid());

create policy "Users can update their profile" on public.profiles
  for update using (auth.role() = 'authenticated' and id = auth.uid());

-- Policies for vehicles
create policy "Users can manage their own vehicles" on public.vehicles
  for all using (auth.role() = 'authenticated' and user_id = auth.uid());

-- Policies for addresses
create policy "Users can manage their own addresses" on public.addresses
  for all using (auth.role() = 'authenticated' and user_id = auth.uid());

-- Policies for emergency_contacts
create policy "Users can manage their own emergency contacts" on public.emergency_contacts
  for all using (auth.role() = 'authenticated' and user_id = auth.uid());
