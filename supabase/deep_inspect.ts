import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function deepInspect() {
  console.log('--- INSPEÇÃO PROFUNDA ---')

  // Listar colunas e restrições de profiles
  const { data: cols, error: colsErr } = await supabase.rpc('get_table_info', { t_name: 'profiles' })
  // Como o RPC pode não existir, vamos usar uma query direta no pg_catalog via rpc se possível,
  // ou apenas tentar inserir e ver o erro detalhado.

  console.log('Tentando criar um driver de teste diretamente...')
  const testId = '00000000-0000-0000-0000-000000000001'
  const { error: insertErr } = await supabase.from('profiles').insert({
    id: testId,
    nome_completo: 'Teste Driver',
    role: 'driver',
    email: 'teste_driver@sos.com.br'
  })

  if (insertErr) {
    console.log('ERRO AO INSERIR PROFILE DRIVER:', insertErr)
  } else {
    console.log('Sucesso ao inserir profile driver diretamente.')
    await supabase.from('profiles').delete().eq('id', testId)
  }

  // Verificar Triggers
  const { data: triggers, error: trigErr } = await supabase.from('pg_trigger').select('tgname').limit(20)
  console.log('Triggers (parcial):', triggers?.map(t => t.tgname))
}

deepInspect()
