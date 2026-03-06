import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function forceCreateDriver() {
  const email = 'motorista@sos.com.br'
  console.log(`Forçando criação do motorista: ${email}...`)

  // Limpar qualquer rastro
  const { data: list } = await supabase.auth.admin.listUsers()
  const existing = list?.users.find(u => u.email === email)
  if (existing) {
    await supabase.auth.admin.deleteUser(existing.id)
    await supabase.from('profiles').delete().eq('id', existing.id)
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: '1234567890',
    email_confirm: true,
    user_metadata: { full_name: 'João Estrada', role: 'driver' }
  })

  if (error) {
    console.error('Erro na criação:', error.message)
    return
  }

  const userId = data.user.id
  console.log('Usuário Auth criado:', userId)

  // Criar perfil - Usamos apenas colunas que sabemos que existem
  const { error: pError } = await supabase.from('profiles').upsert({
    id: userId,
    nome_completo: 'João Estrada',
    role: 'driver'
  })

  if (pError) console.error('Erro no Profile:', pError.message)

  // Veículo
  await supabase.from('vehicles').upsert({
    user_id: userId,
    placa: 'ABC-1234',
    modelo: 'Toyota Hilux',
    cor: 'Branco',
    ano: 2024
  })

  console.log('Motorista criado e configurado com sucesso!')
}
forceCreateDriver()
