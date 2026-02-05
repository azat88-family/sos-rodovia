-- Supabase initialization SQL for sos-rodovia
-- Run this in Supabase SQL editor (Project > SQL)

-- 1) Create profiles table (if not exists)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome_completo text,
  matricula text,
  foto_url text,
  role text default 'operator' check (role in ('operator','admin')),
  created_at timestamptz default now()
);

-- 2) Enable Row Level Security and add simple policies
alter table public.profiles enable row level security;

-- allow users to insert their own profile row (from client) when authenticated
create policy "Allow insert for authenticated" on public.profiles
  for insert using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated' and (role = 'operator' or role is null));

-- allow users to select/update their own profile
create policy "Users can select their profile" on public.profiles
  for select using (auth.role() = 'authenticated' and id = auth.uid());

create policy "Users can update their profile" on public.profiles
  for update using (auth.role() = 'authenticated' and id = auth.uid());

-- allow admins (service accounts) to select/update/insert for management
-- Note: service_role should be used only from server side
create policy "Admins can manage profiles" on public.profiles
  for all using (exists (select 1 from auth.roles r where r.role = 'supabase_admin'));

-- 3) Optional: index on matricula
create index if not exists idx_profiles_matricula on public.profiles (matricula);

-- 4) Example insert: create a manual admin profile (only for testing via SQL editor)
-- replace the UUID with the auth.users id of the admin user created via Supabase Auth
-- insert into public.profiles (id, nome_completo, matricula, role) values ('00000000-0000-0000-0000-000000000000','Admin Test','0001','admin');

-- Notes:
-- - The policies above are conservative: client can insert/select/update their own rows.
-- - Admin-level management should be done from a trusted server using the service_role key.
-- - If you need admins with elevated DB permissions, store a separate admin table or use custom claims in JWT.

