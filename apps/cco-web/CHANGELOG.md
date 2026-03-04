
## fix: triggers Supabase
- `handle_new_driver`: agora só insere em `drivers` se `role = 'driver'`
- `handle_new_profile`: removido campo `email` inexistente na tabela `profiles`
