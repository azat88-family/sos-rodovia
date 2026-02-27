#!/bin/bash

OUTPUT="/workspaces/sos-rodovia/AI_CONTEXT.txt"
PROJECT_ROOT="/workspaces/sos-rodovia"
CCO_WEB="$PROJECT_ROOT/apps/cco-web"

echo "🚀 Gerando contexto do projeto para IA..."

{
echo "# ========================================"
echo "# AI CONTEXT - SOS RODOVIA"
echo "# Cole todo este conteúdo no chat da IA"
echo "# ========================================"
echo ""
echo "**Gerado em:** $(date '+%d/%m/%Y %H:%M')"
echo ""

echo "## 1. ESTRUTURA DO PROJETO"
echo '```'
find $CCO_WEB/src -type f | sort
echo '```'

echo ""
echo "## 2. TYPES"
echo '```typescript'
cat $CCO_WEB/src/types/index.ts 2>/dev/null || echo "arquivo não encontrado"
echo '```'

echo ""
echo "## 3. LIB SUPABASE"
echo '```typescript'
cat $CCO_WEB/src/lib/supabase.ts 2>/dev/null || echo "arquivo não encontrado"
echo '```'

echo ""
echo "## 4. SCHEMA DO BANCO"
echo '```sql'
find $PROJECT_ROOT/supabase -name "*.sql" 2>/dev/null | sort | while read f; do
  echo "-- Arquivo: $f"
  cat "$f"
  echo ""
done
echo '```'

echo ""
echo "## 5. COMPONENTES"
find $CCO_WEB/src/components -name "*.tsx" 2>/dev/null | sort | while read f; do
  echo ""
  echo "### $f"
  echo '```tsx'
  cat "$f"
  echo '```'
done

echo ""
echo "## 6. PAGES"
find $CCO_WEB/src/app -name "*.tsx" -o -name "*.ts" 2>/dev/null | sort | while read f; do
  echo ""
  echo "### $f"
  echo '```tsx'
  cat "$f"
  echo '```'
done

echo ""
echo "## 7. PACKAGE.JSON"
echo '```json'
cat $CCO_WEB/package.json 2>/dev/null || echo "arquivo não encontrado"
echo '```'

} > $OUTPUT

LINES=$(wc -l < $OUTPUT)
SIZE=$(du -sh $OUTPUT | cut -f1)

echo ""
echo "✅ AI_CONTEXT.txt gerado!"
echo "📄 Linhas: $LINES"
echo "💾 Tamanho: $SIZE"
echo "👉 Cole o conteúdo no chat da IA para iniciar a sessão"
