# FlowBook - Task List

## Fase 1 - Fundacao
- `[x]` Instalar dependencias (bcrypt, jose, zod)
- `[x]` Criar schema completo do banco (Drizzle)
- `[x]` Criar lib/constants.ts
- `[x]` Criar lib/validators.ts (schemas Zod)
- `[x]` Criar lib/auth.ts (JWT + bcrypt)
- `[x]` Criar lib/api.ts (fetch wrapper)

## Fase 2 - Seguranca e Middleware
- `[x]` Criar middleware.ts (protecao de rotas)
- `[x]` Criar hooks/use-auth.tsx
- `[x]` Criar hooks/use-api.ts

## Fase 3 - API Routes
- `[x]` Auth routes (login, cadastro, logout, me)
- `[x]` Empresas routes
- `[x]` Servicos routes
- `[x]` Funcionarios routes
- `[x]` Clientes routes
- `[x]` Agendamentos routes
- `[x]` Financeiro routes
- `[x]` Publico routes (para pagina de agendamento)

## Fase 4 - Forms Reutilizaveis
- `[x]` appointment-form.tsx
- `[x]` client-form.tsx
- `[x]` service-form.tsx
- `[x]` employee-form.tsx
- `[x]` transaction-form.tsx

## Fase 5 - Integracao Frontend (Dashboard)
- `[x]` Integrar Dashboard home com API
- `[x]` Integrar Agenda com API
- `[x]` Integrar Clientes com API
- `[x]` Integrar Servicos com API
- `[x]` Integrar Funcionarios com API
- `[x]` Integrar Financeiro com API
- `[x]` Integrar Relatorios com API

## Fase 6 - Novas Paginas
- `[x]` Pagina publica de agendamento (`/agendar/[slug]`)
- `[x]` Pagina de confirmacao de agendamento
- `[x]` Pagina de configuracoes do dashboard
- `[x]` Pagina de perfil da empresa
- `[x]` Landing page reestruturada (route group)
- `[x]` Termos de uso e Politica de privacidade

## Fase 7 - Verificacao
- `[x]` Build sem erros
- `[x]` Rotas protegidas funcionando
