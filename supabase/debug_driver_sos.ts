import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

async function debugDriverData() {
  const userId = '3b04909b-9d14-4f88-9e60-5a900af3db63'
  console.log(`--- DEBUG DADOS MOTORISTA (ID: ${userId}) ---`)

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single()
  console.log('Profile:', profile)

  const { data: vehicle } = await supabase.from('vehicles').select('*').eq('user_id', userId).maybeSingle()
  console.log('Vehicle:', vehicle)
}

debugDriverData()
