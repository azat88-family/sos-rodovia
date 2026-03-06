import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function debugUser() {
  const email = 'motorista@sos.com.br'
  console.log(`Buscando usuário: ${email}...`)
  const { data: list } = await supabase.auth.admin.listUsers()
  const user = list?.users.find(u => u.email === email)

  if (user) {
    console.log('Usuário encontrado:', user.id)
    console.log('Metadados:', user.user_metadata)

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    console.log('Perfil:', profile)
  } else {
    console.log('Usuário NÃO encontrado.')
  }
}
debugUser()
