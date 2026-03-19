import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://wfhqjswnpuvgnhrjrnom.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaHFqc3ducHV2Z25ocmpybm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjk2ODAsImV4cCI6MjA4NTY0NTY4MH0.jJ82i0JgqeADvIRk1XB6rdrPm02L6rjBc5FQX-3rPuA')

async function run() {
  const uid = '3b04909b-9d14-4f88-9e60-5a900af3db63'
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).single()
  const { data: vehicle } = await supabase.from('vehicles').select('*').eq('user_id', uid).single()

  console.log('PROFILE:', profile)
  console.log('VEHICLE:', vehicle)
}
run()
