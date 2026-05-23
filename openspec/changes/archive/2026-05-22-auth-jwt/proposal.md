## Why

O sistema não possui nenhum mecanismo de autenticação, o que impede que usuários criem contas e acessem apenas suas próprias tarefas. Para que o gerenciamento de tarefas multiusuário funcione, é necessário identificar quem é cada usuário e proteger os recursos por ele criados.

## What Changes

- Criação da tabela `users` no banco de dados com email, senha (bcrypt hash) e data de criação
- Novos endpoints REST: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- Geração de JWT com expiração de 1 dia ao registrar ou fazer login
- Middleware `withAuth` (higher-order function) para proteger rotas futuras no backend
- Nova variável de ambiente `JWT_SECRET` necessária no backend
- Dependências novas no backend: `bcryptjs`, `jsonwebtoken`
- No frontend: `AuthContext` + hook `useAuth` com token armazenado em `localStorage`
- Cliente HTTP centralizado que injeta o `Bearer token` automaticamente em todas as requisições
- Telas de login e registro com validação via Zod e componentes shadcn/ui
- `ProtectedRoute` wrapper que redireciona para `/login` se não autenticado
- React Router configurado com rotas `/login`, `/register` e `/` (protegida)
- Dependência nova no frontend: `react-router-dom`

## Capabilities

### New Capabilities

- `auth`: Registro de usuários, login com email e senha, emissão de JWT e proteção de rotas

### Modified Capabilities

*(nenhuma — funcionalidade nova)*

## Impact

- **Banco de dados**: nova tabela `users` (id, email, password, created_at)
- **Backend**: 3 novos handlers, 1 middleware reutilizável, `serverless.yml` atualizado, nova env var `JWT_SECRET`
- **Frontend**: estrutura de roteamento introduzida, autenticação gerenciada via contexto global, todas as chamadas à API passam pelo cliente centralizado
- **Fora do escopo**: recuperação de senha, troca de email, login social (OAuth), refresh tokens, logout com invalidação server-side
