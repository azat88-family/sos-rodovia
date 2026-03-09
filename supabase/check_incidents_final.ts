import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

async function checkIncidents() {
  const { data: inc, error } = await supabase
    .from('incidents')
    .select('*, driver:profiles!user_id(*)')
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('ERRO:', error)
  } else {
    console.log('DADOS DO ÚLTIMO SOS:', JSON.stringify(inc, null, 2))
  }
}

checkIncidents()
