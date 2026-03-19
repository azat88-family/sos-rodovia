import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://wfhqjswnpuvgnhrjrnom.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaHFqc3ducHV2Z25ocmpybm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjk2ODAsImV4cCI6MjA4NTY0NTY4MH0.jJ82i0JgqeADvIRk1XB6rdrPm02L6rjBc5FQX-3rPuA')

async function run() {
  const { data: v } = await supabase.from('vehicles').select().limit(1)
  const { data: p } = await supabase.from('profiles').select().limit(1)
  const { data: i } = await supabase.from('incidents').select().limit(1)

  const result = {
    vehicles: v && v[0] ? Object.keys(v[0]) : 'no_data',
    profiles: p && p[0] ? Object.keys(p[0]) : 'no_data',
    incidents: i && i[0] ? Object.keys(i[0]) : 'no_data'
  }
  require('fs').writeFileSync('schema_dump.json', JSON.stringify(result, null, 2))
}
run()
