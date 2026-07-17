# FlowBook — Plano de Implementação Completo do SaaS de Agendamento

## Contexto e Objetivo

Transformar o protótipo atual (páginas estáticas com dados hardcoded) em um **SaaS profissional de agendamento multi-ramo**, mantendo o design visual existente (paleta violet/purple, Tailwind CSS 4, Radix UI, Framer Motion, Recharts) e implementando toda a lógica de negócio, autenticação, banco de dados e segurança.

---

## Padrões Visuais Absorvidos (Preservados)

| Elemento | Padrão |
|---|---|
| Cor primária | `violet-600` → `purple-700` (gradient) |
| Cards | `rounded-xl border border-gray-200 bg-white shadow-sm` |
| Botões | CVA variants (primary, outline, ghost, destructive) |
| Animações | Framer Motion `initial/animate/whileInView` com delays escalonados |
| Tipografia | `font-extrabold` títulos, `font-semibold` subtítulos, `text-gray-500` descrições |
| Ícones | Lucide React |
| Badges | CVA com variantes semânticas (success, warning, danger, primary) |
| Layout Dashboard | Sidebar colapsável + Navbar + Main com padding responsivo |

---

## Arquitetura de Pastas (Reestruturação Senior)

```
src/
├── app/
│   ├── (public)/                    # Rotas públicas (landing, termos, privacidade)
│   │   ├── page.tsx                 # Landing page (preservada)
│   │   ├── layout.tsx
│   │   ├── termos/page.tsx
│   │   └── privacidade/page.tsx
│   ├── (auth)/                      # Fluxo de autenticação
│   │   ├── layout.tsx
│   │   ├── login/page.tsx           # Login (preservado + integração real)
│   │   ├── cadastro/page.tsx        # Cadastro (preservado + integração real)
│   │   └── esqueci-senha/page.tsx
│   ├── dashboard/                   # Área do profissional (protegida)
│   │   ├── layout.tsx               # DashboardLayout com AuthGuard
│   │   ├── page.tsx                 # Dashboard home (preservada + dados reais)
│   │   ├── agenda/page.tsx
│   │   ├── clientes/page.tsx
│   │   ├── servicos/page.tsx
│   │   ├── funcionarios/page.tsx
│   │   ├── financeiro/page.tsx
│   │   ├── relatorios/page.tsx
│   │   ├── configuracoes/page.tsx   # [NEW] Configurações da conta
│   │   └── empresa/page.tsx         # [NEW] Perfil da empresa
│   ├── agendar/                     # [NEW] Página pública de agendamento (cliente)
│   │   ├── [slug]/page.tsx          # Página da empresa (slug único)
│   │   └── [slug]/confirmar/page.tsx
│   └── api/                         # API Routes (Server-side)
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── cadastro/route.ts
│       │   ├── logout/route.ts
│       │   └── me/route.ts
│       ├── empresas/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── servicos/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── funcionarios/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── clientes/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── agendamentos/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── financeiro/
│       │   └── route.ts
│       ├── publico/                 # [NEW] APIs para página pública
│       │   └── [slug]/route.ts
│       └── health/route.ts
├── components/
│   ├── ui/                          # Primitivos (preservados)
│   ├── layout/                      # Layout (preservados)
│   ├── shared/                      # Compartilhados (preservados + novos)
│   └── forms/                       # [NEW] Formulários reutilizáveis
│       ├── appointment-form.tsx
│       ├── client-form.tsx
│       ├── service-form.tsx
│       ├── employee-form.tsx
│       └── transaction-form.tsx
├── lib/
│   ├── utils.ts                     # Utilitários (preservado)
│   ├── auth.ts                      # [NEW] Lógica de autenticação
│   ├── api.ts                       # [NEW] Fetch wrapper tipado
│   ├── validators.ts                # [NEW] Validações com Zod
│   └── constants.ts                 # [NEW] Constantes globais
├── db/
│   ├── schema.ts                    # [MODIFY] Schema Drizzle completo
│   ├── index.ts                     # Conexão DB (preservado)
│   ├── seed.ts                      # [NEW] Dados iniciais
│   └── migrations/                  # [NEW] Migrations geradas
├── hooks/
│   ├── use-sidebar.ts               # Preservado
│   ├── use-modal.ts                 # Preservado
│   ├── use-toast.ts                 # Preservado
│   ├── use-auth.ts                  # [NEW] Hook de autenticação
│   └── use-api.ts                   # [NEW] Hook para chamadas API
├── types/
│   └── index.ts                     # [MODIFY] Types atualizados
└── middleware.ts                    # [NEW] Middleware Next.js (proteção de rotas)
```

---

## Proposed Changes

### Fase 1 — Banco de Dados (Schema Drizzle)

#### [MODIFY] [schema.ts](file:///c:/Users/luzvi/OneDrive/Documentos/Projetos/Saas/src/db/schema.ts)

Criar o schema completo com as seguintes tabelas:

- **`users`** — Usuários do sistema (donos/admins/funcionários)
- **`companies`** — Empresas cadastradas (multi-tenant)
- **`employees`** — Funcionários vinculados a uma empresa
- **`clients`** — Clientes de cada empresa
- **`services`** — Serviços oferecidos
- **`employee_services`** — Relação N:N entre funcionário e serviço
- **`appointments`** — Agendamentos
- **`transactions`** — Movimentações financeiras
- **`working_hours`** — Horários de funcionamento por funcionário

Todas as tabelas terão:
- `id` UUID com `gen_random_uuid()`
- `created_at` / `updated_at` timestamps
- `company_id` como chave de isolamento multi-tenant

---

### Fase 2 — Autenticação e Segurança

#### [NEW] `src/lib/auth.ts`
- Hash de senhas com **bcrypt** (salt rounds = 12)
- Sessões via **cookies HTTP-only** com tokens JWT assinados (jose lib)
- Middleware de validação de sessão em todas as API routes protegidas

#### [NEW] `src/middleware.ts`
- Proteção de rotas `/dashboard/*` — redireciona para `/login` se não autenticado
- Rotas `/login` e `/cadastro` redirecionam para `/dashboard` se já autenticado
- Rate limiting básico por IP nas rotas de autenticação

#### [NEW] `src/lib/validators.ts`
- Schemas **Zod** para validação de todos os inputs:
  - `loginSchema`, `registerSchema`
  - `appointmentSchema`, `clientSchema`, `serviceSchema`
  - `transactionSchema`, `employeeSchema`

> [!IMPORTANT]
> **Medidas de Segurança Implementadas:**
> - Senhas hasheadas com bcrypt (nunca em plaintext)
> - Cookies HTTP-only, Secure, SameSite=Lax
> - Validação de input em TODAS as rotas da API (Zod)
> - Isolamento multi-tenant (toda query filtra por `company_id` da sessão)
> - CSRF protection via SameSite cookies
> - Rate limiting nas rotas de autenticação
> - Sanitização de dados antes de inserção no banco

---

### Fase 3 — API Routes (CRUD Completo)

Cada rota seguirá o padrão:
1. Validar sessão (middleware)
2. Validar body/params com Zod
3. Executar query Drizzle isolada por `company_id`
4. Retornar resposta tipada

#### Rotas implementadas:
- `POST /api/auth/login` — Login com email/senha
- `POST /api/auth/cadastro` — Registro de novo usuário + empresa
- `POST /api/auth/logout` — Limpar cookie de sessão
- `GET /api/auth/me` — Retorna dados do usuário logado
- `GET/POST /api/agendamentos` — Listar/Criar agendamentos
- `GET/PUT/DELETE /api/agendamentos/[id]` — CRUD individual
- `GET/POST /api/clientes` — Listar/Criar clientes
- `GET/PUT/DELETE /api/clientes/[id]`
- `GET/POST /api/servicos` — Listar/Criar serviços
- `GET/PUT/DELETE /api/servicos/[id]`
- `GET/POST /api/funcionarios` — Listar/Criar funcionários
- `GET/PUT/DELETE /api/funcionarios/[id]`
- `GET/POST /api/financeiro` — Listar/Criar transações
- `GET /api/publico/[slug]` — Dados públicos da empresa para agendamento

---

### Fase 4 — Frontend: Integração com Dados Reais

Substituir todos os dados hardcoded por chamadas à API real. Cada página do dashboard será conectada:

| Página | Ação |
|---|---|
| Dashboard | Carregar stats reais do banco |
| Agenda | CRUD de agendamentos com calendário funcional |
| Clientes | CRUD completo com busca e filtros |
| Serviços | CRUD com categorias |
| Funcionários | CRUD com vínculo de serviços |
| Financeiro | Registrar transações reais |
| Relatórios | Queries agregadas do banco |

#### [NEW] `src/hooks/use-api.ts`
Hook genérico para fetch com:
- Loading/error states
- Invalidação automática após mutations
- Tipagem forte via generics

#### [NEW] `src/hooks/use-auth.ts`
- Contexto de autenticação global
- Função `login()`, `logout()`, `register()`
- Estado `user` acessível em toda a aplicação

#### [NEW] `src/components/forms/*`
Formulários extraídos dos modais atuais para componentes reutilizáveis com validação Zod integrada.

---

### Fase 5 — Página Pública de Agendamento (Cliente Final)

#### [NEW] `src/app/agendar/[slug]/page.tsx`
Página pública acessível por qualquer cliente sem login. Exibe:
- Nome, logo e descrição da empresa
- Lista de serviços disponíveis com preço e duração
- Seleção de profissional
- Calendário com horários disponíveis (calculados com base em `working_hours` e agendamentos existentes)
- Formulário de dados do cliente (nome, telefone, email)
- Confirmação do agendamento

#### [NEW] `src/app/agendar/[slug]/confirmar/page.tsx`
Página de confirmação pós-agendamento com:
- Resumo do agendamento
- Opção de cancelar

---

### Fase 6 — Páginas Novas do Dashboard

#### [NEW] `src/app/dashboard/configuracoes/page.tsx`
- Alterar dados pessoais (nome, email, senha)
- Preferências de notificação
- Gerenciar plano/assinatura

#### [NEW] `src/app/dashboard/empresa/page.tsx`
- Editar dados da empresa (nome, CNPJ, endereço, telefone)
- Upload de logo
- Configurar slug da página pública
- Definir horários de funcionamento

---

## Open Questions

> [!IMPORTANT]
> **Banco de dados:** O projeto usa PostgreSQL. Você já tem um banco rodando localmente? Se não, posso configurar para funcionar sem banco real inicialmente (usando dados em memória) e depois conectar quando você tiver o PostgreSQL pronto.

> [!NOTE]
> **Notificações:** Deseja que eu implemente notificações por email/WhatsApp nesta fase, ou isso fica para uma versão futura?

> [!NOTE]
> **Pagamentos:** A parte de assinatura/cobrança dos planos (Stripe, etc.) deve ser implementada agora ou fica para depois?

---

## Verification Plan

### Automated Tests
```bash
npm run build    # Validar compilação TypeScript sem erros
npm run lint     # Verificar padrões de código
```

### Manual Verification
- Fluxo completo: Cadastro → Login → Dashboard → Criar Serviço → Criar Funcionário → Página Pública → Agendar → Ver no Dashboard
- Testar proteção de rotas (acessar `/dashboard` sem login deve redirecionar)
- Testar isolamento multi-tenant (empresa A não vê dados da empresa B)
