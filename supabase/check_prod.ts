import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function checkProductionData() {
  console.log('--- VERIFICANDO DADOS REAIS ---')

  // 1. Verificando o motorista motorista@sos.com.br
  const { data: profiles } = await supabase.from('profiles').select('*, vehicles(*)').eq('email', 'motorista@sos.com.br')
  console.log('Perfil Motorista:', JSON.stringify(profiles, null, 2))

  // 2. Verificando incidentes recentes
  const { data: incidents } = await supabase.from('incidents').select('*, driver:profiles!user_id(*)').order('created_at', { ascending: false }).limit(3)
  console.log('Incidentes Recentes:', JSON.stringify(incidents, null, 2))
}

checkProductionData()
