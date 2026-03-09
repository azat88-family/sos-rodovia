import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function checkRLS() {
  console.log('--- VERIFICAÇÃO DE DADOS ---')

  // Total de incidentes
  const { count: totalIncidents } = await supabase.from('incidents').select('*', { count: 'exact', head: true })
  console.log('Total de Incidentes no Banco:', totalIncidents)

  // Incidentes abertos
  const { data: incidents, error: err } = await supabase
    .from('incidents')
    .select('*, driver:profiles!user_id(*)')
    .eq('status', 'open')

  console.log('Incidentes Abertos Encontrados:', incidents?.length || 0)
  if (incidents && incidents.length > 0) {
    console.log('Primeiro Incidente:', JSON.stringify(incidents[0], null, 2))
  }
  if (err) console.error('Erro na consulta:', err)

  // Perfis
  const { data: profiles } = await supabase.from('profiles').select('*').limit(5)
  console.log('Exemplos de Perfis:', profiles?.map(p => ({ id: p.id, email: p.email, role: p.role })))
}

checkRLS()
