import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: 'apps/.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl!, supabaseServiceKey!)

async function clear() {
    console.log('Limpando usuários...')
    const { data: list } = await supabase.auth.admin.listUsers()
    if (list?.users) {
        for (const user of list.users) {
            console.log(`Deletando ${user.email}...`)
            await supabase.auth.admin.deleteUser(user.id)
            await supabase.from('profiles').delete().eq('id', user.id)
        }
    }
    console.log('Limpeza concluída.')
}

async function seed() {
  await clear()

  const users = [
    { email: 'xe.04.01.1968@gmail.com', name: 'Alexandre Santos', role: 'admin' },
    { email: 'operador@sos.com.br', name: 'Carlos Operador', role: 'operator', matricula: 'OP-2026-001' },
    { email: 'motorista_v2@sos.com.br', name: 'João Estrada', role: 'driver', cpf: '123.456.789-00' }
  ]

  for (const u of users) {
    console.log(`Criando usuário: ${u.email}...`)
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: u.email,
      password: '1234567890',
      email_confirm: true,
      user_metadata: { full_name: u.name, role: u.role }
    })

    if (userError) {
      console.error(`Erro ao criar auth user ${u.email}:`, userError.message)
      continue
    }

    const newId = userData.user.id
    console.log(`Usuário criado ID: ${newId}. Verificando Perfil...`)

    // O trigger deve ter criado o perfil. Vamos atualizar.
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        nome_completo: u.name,
        role: u.role,
        matricula: u.role === 'operator' ? u.matricula : '',
        email: u.email,
        aprovado: true,
        ativo: true
      })
      .eq('id', newId)

    if (profileError) console.error(`Erro ao atualizar profile ${u.email}:`, profileError.message)

    if (u.role === 'operator') {
      console.log('Inserindo dados extras do Operador...')
      await supabase.from('addresses').upsert({
        user_id: newId,
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        numero: '100',
        bairro: 'Sé',
        cidade: 'São Paulo',
        estado: 'SP'
      })

      await supabase.from('emergency_contacts').upsert({
        user_id: newId,
        nome: 'Maria Socorro',
        parentesco: 'Esposa',
        telefone: '(11) 99999-8888'
      })
    }

    if (u.role === 'driver') {
      console.log('Inserindo veículo do Motorista...')
      await supabase.from('vehicles').upsert({
        user_id: newId,
        placa: 'ABC-1234',
        modelo: 'Toyota Hilux',
        cor: 'Branco',
        ano: 2024
      })
    }
  }

  console.log('Seed finalizado!')
}

seed()
