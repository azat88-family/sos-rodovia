# SOS Rodovia (Monorepo)

## Apps
- apps/mobile (Expo React Native) - app único (driver/operator)
- apps/cco-web (Next.js) - painel CCO

fix/project-structure-and-db-schema-10268939602649582141
## Setup
Crie:
- apps/mobile/.env
- apps/cco-web/.env.local

---

# 🏗️ SOS-Rodovias — Arquitetura do Sistema

> **Versão atual: 1.1** | Stack: Next.js + Expo + Supabase

---

## 📁 Estrutura Real do Projeto

```
sos-rodovia/
│
├── apps/
│   │
│   ├── cco-web/                              # ✅ Painel Web (Next.js)
│   │   ├── app/
│   │   │   ├── page.tsx                      # ✅ Landing Page — 🔴 28/02/2026
│   │   │   ├── layout.tsx                    # ✅ Layout global
│   │   │   ├── globals.css                   # ✅ Estilos globais
│   │   │   ├── admin/
│   │   │   │   └── dashboard/page.tsx        # ✅ Dashboard Admin (Aprovações) — 🔴 28/02/2026
│   │   │   ├── cco/
│   │   │   │   └── dashboard/page.tsx        # ✅ Dashboard Operador CCO (Alerta SOS) — 🔴 28/02/2026
│   │   │   └── register/
│   │   │       ├── admin/page.tsx            # ✅ Cadastro Admin
│   │   │       ├── operator/page.tsx         # ✅ Cadastro Operador (Aprovação Admin) — 🔴 28/02/2026
│   │   │       └── motorista/page.tsx        # ✅ Cadastro Motorista (5 steps) — 🔴 24/02/2026
│   │   │
│   │   ├── components/
│   │   │   ├── IncidentsMap.tsx              # ✅ Mapa de Incidentes
│   │   │   ├── OperatorCard.tsx              # ✅ Card do Operador
│   │   │   ├── ProfilePhotoCapture.tsx       # ✅ Captura de Foto
│   │   │   ├── RegisterForm.tsx              # ✅ Formulário de Cadastro — 🔴 28/02/2026
│   │   │   ├── landing/
│   │   │   │   ├── Header.tsx                # ✅ Cabeçalho Landing
│   │   │   │   ├── HeroSection.tsx           # ✅ Seção Hero
│   │   │   │   ├── FeaturesSection.tsx       # ✅ Seção Features
│   │   │   │   ├── HowItWorkSection.tsx      # ✅ Como Funciona
│   │   │   │   ├── CTASection.tsx            # ✅ Call to Action
│   │   │   │   └── Footer.tsx                # ✅ Rodapé
│   │   │   └── register/
│   │   │       ├── motorista/
│   │   │       │   ├── Step1DadosPessoais.tsx  # ✅ Step 1 — 🔴 24/02/2026
│   │   │       │   ├── Step2Veiculo.tsx        # ✅ Step 2 — 🔴 24/02/2026
│   │   │       │   ├── Step3Endereco.tsx       # ✅ Step 3 — 🔴 24/02/2026
│   │   │       │   ├── Step4Emergencia.tsx     # ✅ Step 4 — 🔴 24/02/2026
│   │   │       │   ├── Step5Documentos.tsx     # ✅ Step 5 — 🔴 24/02/2026
│   │   │       │   └── styles.ts               # ✅ Estilos Steps — 🔴 24/02/2026
│   │   │       └── operator/
│   │   │           ├── Step1DadosPessoais.tsx  # ✅ Step 1 Operador — 🔴 28/02/2026
│   │   │           ├── Step2MatriculaFoto.tsx  # ✅ Step 2 Operador — 🔴 28/02/2026
│   │   │           ├── Step3Endereco.tsx       # ✅ Step 3 Operador — 🔴 28/02/2026
│   │   │           └── Step4Contato.tsx        # ✅ Step 4 Operador — 🔴 28/02/2026
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase.ts                   # ✅ Client Supabase
│   │   │   └── incidents.ts                  # ✅ Funções de Incidentes
│   │   │
│   │   ├── public/
│   │   │   ├── login.png                     # ✅ Imagem login
│   │   │   └── fundo login.png               # ✅ Fundo login
│   │   │
│   │   └── types.ts                          # ✅ Types globais — 🔴 28/02/2026
│   │
│   └── mobile/                               # ✅ App Mobile (Expo)
│       ├── src/
│       │   ├── screens/
│       │   │   ├── LoginScreen.tsx           # ✅ Login Motorista/Operador
│       │   │   ├── DriverHomeScreen.tsx      # ✅ Home do Motorista
│       │   │   ├── OperatorHomeScreen.tsx    # ✅ Home do Operador
│       │   │   └── NewIncidentScreen.tsx     # ✅ Novo Incidente/SOS — 🔴 28/02/2026
│       │   ├── lib/
│       │   │   └── supabase.ts               # ✅ Client Supabase Mobile
│       │   └── types.ts                      # ✅ Types Mobile — 🔴 28/02/2026
│       │
│       ├── app/
│       │   ├── (tabs)/
│       │   │   ├── index.tsx                 # ✅ Tab Home
│       │   │   └── explore.tsx               # ✅ Tab Explorar
│       │   ├── _layout.tsx                   # ✅ Layout Root — 🔴 28/02/2026
│       │   └── modal.tsx                     # ✅ Modal
│       │
│       └── constants/
│           └── theme.ts                      # ✅ Tema/Cores
│
├── supabase/
│   ├── init.sql                              # ✅ Schema inicial
│   ├── funcionarios.sql                      # ✅ Tabela funcionários
│   ├── update_profiles_safe.sql              # ✅ Migração segura profiles — 🔴 28/02/2026
│   ├── create_admin.sql                      # ✅ Criação admin Alexandre — 🔴 28/02/2026
│   ├── update_incidents.sql                  # ✅ Migração incidents (cor_veiculo) — 🔴 28/02/2026
│   ├── full_setup_v1.1.sql                   # ✅ Setup Completo (Profiles, Incidents, Admin) — 🔴 28/02/2026
│   └── drivers.sql                           # 🔧 Tabela drivers/veículos/endereços — 🔴 24/02/2026
│
└── package.json                              # ✅ Monorepo root
```

---

## 🗺️ Roadmap de Versões

### 🟢 Versão 1.0 — atual (MVP)
> Base funcional do sistema com cadastro, login e painel CCO

- ✅ Landing Page completa — 🔴 28/02/2026
- ✅ Cadastro de Operador e Admin (Web) — 🔴 28/02/2026
- ✅ Dashboard CCO e Admin (Web) — 🔴 28/02/2026
- ✅ Mapa de Incidentes (Web) — 🔴 28/02/2026
- ✅ Telas Mobile: Login, Home Motorista, Home Operador, Novo Incidente — 🔴 28/02/2026
- ✅ Integração Supabase (Auth + Database) — 🔴 28/02/2026
- ✅ Schema SQL base

---

### 🟡 Versão 1.1 — próxima entrega
> Correções e páginas faltantes identificadas

- ✅ `app/register/motorista/page.tsx` — Cadastro de Motorista Web (5 steps) — 🔴 24/02/2026
- 🔧 Salvar dados do Motorista no Supabase (drivers, vehicles, addresses, emergency_contacts) — 🔴 24/02/2026
- ✅ `app/login/page.tsx` — Tela de login Web (Trava de Aprovação) — 🔴 28/02/2026
- ✅ Corrigir `Page.tsx` fora do lugar (`apps/cco-web/Page.tsx`) — 🔴 28/02/2026
- ✅ Conectar navegação real no `App.tsx` Mobile — 🔴 28/02/2026
- ✅ Conectar `app/(tabs)` com `src/screens/` — 🔴 28/02/2026
- ✅ Fluxo de Aprovação de Operadores (Admin Dashboard) — 🔴 28/02/2026
- ✅ Geolocalização em Tempo Real (Pin SOS Detalhado: Foto, CPF, Placa, Modelo, Cor) — 🔴 28/02/2026

---

### 🔵 Versão 2.0 — Chat em Tempo Real
> Comunicação direta entre Motorista e Operador CCO

- ( Chat Realtime via Supabase Realtime )
- ( Componente `ChatPanel.tsx` no Dashboard CCO )
- ( Tela `ChatScreen.tsx` no Mobile )
- ( Mensagens de texto e sistema )
- ( Indicador de digitando / lido )
- ( Histórico de mensagens por incidente )

---

### 🟠 Versão 2.1 — GPS & Rastreamento
> Localização em tempo real do motorista

- ( Rastreamento GPS contínuo no Mobile )
- ( Envio de coordenadas ao Supabase em tempo real )
- ( Mapa atualizado ao vivo no Painel CCO )
- ( Componente `LocationTracker.tsx` )
- ( Tabela `locations` no banco de dados )
- ( Histórico de trajeto por incidente )

---

### 🔴 Versão 2.2 — Inteligência Artificial
> Resumo e classificação automática de incidentes via IA

- ( Edge Function: `ai-summary` com GPT-4o )
- ( Resumo automático ao criar chamado )
- ( Classificação do tipo de incidente pela IA )
- ( Sugestão de prioridade automática )
- ( Componente `AISummaryCard.tsx` no Dashboard )

---

### 🟣 Versão 2.3 — Áudio & Transcrição
> Comunicação por voz e transcrição automática

- ( Gravação de áudio no Mobile )
- ( Upload do áudio para Supabase Storage )
- ( Edge Function: `transcribe-audio` com Whisper )
- ( Exibição da transcrição no Chat CCO )
- ( Componente `VoiceRecorder.tsx` no Mobile )

---

### ⚫ Versão 3.0 — Despacho & Integrações
> Integração com guincho, ambulância e serviços externos

- ( Edge Function: `dispatch-rescue` )
- ( Integração com API de guinchos parceiros )
- ( Notificações Push (Expo Notifications) )
- ( Painel de status de despacho )
- ( Relatórios e métricas de atendimento )
- ( App Admin Mobile )

---

## 🔄 Fluxo do Sistema (v1.1 atual)

```
MOTORISTA (App Mobile)
        │
        │ 1. Login / Cadastro (Pendente Aprovação)
        │ 2. Aciona Novo Incidente (SOS)
        ▼
SUPABASE
        │
        ├─── Salva incidente no DB (Latitude, Longitude, Veículo)
        └─── Notifica via Realtime (Broadcast para CCO)
                │
                ▼
OPERADOR (Painel CCO Web)
        │
        └─── Visualiza Pin SOS Detalhado (Foto, CPF, Placa, Modelo, Cor)
```

---

## 🗄️ Banco de Dados (atual)

```sql
-- Já existente em supabase/
profiles / funcionarios                                        ✅
incidents (via incidents.ts)                                   ✅
create_admin (Alexandre Santos)                                🔴 28/02/2026
full_setup_v1.1.sql                                            🔴 28/02/2026

-- (v1.1) drivers / vehicles / addresses / emergency_contacts  🔴 24/02/2026
-- (v1.1) cor_veiculo (incidents table)                        🔴 28/02/2026
-- (v1.1) aprovado (profiles table)                            🔴 28/02/2026
-- (v2.1) locations                                            🔵
-- (v2.2) ai_summaries                                         🔴
-- (v2.3) audio_messages                                       🟣
```

---

## 🔐 Autenticação

| Perfil     | Plataforma | Status                       |
|------------|------------|------------------------------|
| Admin      | Web        | ✅ v1.0                      |
| Operador   | Web        | ✅ v1.1 — 🔴 28/02/2026     |
| Motorista  | Mobile     | ✅ v1.1 — 🔴 28/02/2026     |
| Motorista  | Web        | 🔧 v1.1 — 🔴 24/02/2026     |

---

## 🌐 Stack Tecnológico

| Camada        | Tecnologia            | Status      |
|---------------|-----------------------|-------------|
| App Mobile    | React Native + Expo   | ✅ v1.0     |
| Painel Web    | Next.js 14 + Tailwind | ✅ v1.0     |
| Backend       | Supabase              | ✅ v1.0     |
| Mapas Web     | Leaflet.js            | ✅ v1.0     |
| Chat Realtime | Supabase Realtime     | 🔵 v2.0     |
| Mapas Mobile  | React Native Maps     | 🟠 v2.1     |
| IA Resumo     | OpenAI GPT-4o         | 🔴 v2.2     |
| Transcrição   | OpenAI Whisper        | 🟣 v2.3     |
| Deploy Web    | Vercel                | ⚫ v3.0     |
| Deploy Mobile | Expo EAS              | ⚫ v3.0     |
