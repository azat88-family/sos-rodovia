import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function testCreate() {
  const email = `test_${Date.now()}@test.com`
  console.log(`Testando criação de: ${email}...`)
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: '1234567890',
    email_confirm: true
  })
  if (error) {
    console.error('Erro:', error.message)
  } else {
    console.log('Sucesso! ID:', data.user.id)
    await supabase.auth.admin.deleteUser(data.user.id)
  }
}
testCreate()
