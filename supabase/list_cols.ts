import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function getColumns() {
  const { data, error } = await supabase.rpc('get_columns', { table_name: 'profiles' })
  // If RPC doesn't exist, use a simple select
  const { data: sample } = await supabase.from('profiles').select('*').limit(1)
  if (sample && sample.length > 0) {
    console.log('Columns:', Object.keys(sample[0]))
  } else {
    // Try to get from a query that doesn't depend on data
    const { data: cols, error: err } = await supabase.from('profiles').select().limit(0)
    console.log('Error or Columns:', err || cols)
  }
}
getColumns()
