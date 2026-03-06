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
clear()
