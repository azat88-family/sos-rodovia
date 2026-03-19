import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://wfhqjswnpuvgnhrjrnom.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmaHFqc3ducHV2Z25ocmpybm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNjk2ODAsImV4cCI6MjA4NTY0NTY4MH0.jJ82i0JgqeADvIRk1XB6rdrPm02L6rjBc5FQX-3rPuA')

async function run() {
  console.log('--- DIAGNOSTIC START ---');

  const { data: p } = await supabase.from('profiles').select().limit(1);
  console.log('PROFILES COLS:', p && p[0] ? Object.keys(p[0]) : 'empty');

  const { data: v } = await supabase.from('vehicles').select().limit(1);
  console.log('VEHICLES COLS:', v && v[0] ? Object.keys(v[0]) : 'empty');

  const userId = '3b04909b-9d14-4f88-9e60-5a900af3db63';
  const { data: userData } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  const { data: userVehicle } = await supabase.from('vehicles').select('*').eq('user_id', userId).maybeSingle();

  console.log('USER_ID:', userId);
  console.log('USER_PROFILE:', userData);
  console.log('USER_VEHICLE:', userVehicle);
  console.log('--- DIAGNOSTIC END ---');
}
run()
