## Why

A aplicação atual possui apenas uma página autenticada com layout minimalista (header + lista de tarefas), sem navegação estruturada. Para evoluir para um produto completo, é necessário introduzir um layout com sidebar, novas seções (Home e Minha Conta) e enriquecer o perfil do usuário com campos como nome, foto, data de nascimento e a possibilidade de alterar senha.

## What Changes

- **Nova estrutura de layout**: sidebar colapsável (icon-only quando recolhida) envolvendo todas as rotas autenticadas
- **Nova rota `/home`**: dashboard de boas-vindas com saudação ao usuário e estatísticas de tarefas da semana atual (total / pendentes / concluídas)
- **Nova rota `/minha-conta`**: página de edição de perfil (nome, data de nascimento, avatar_url) e troca de senha (exige senha atual)
- **Rota `/tarefas`**: página atual de tarefas (`/todos`) movida para esta rota
- **Novos campos no usuário**: `name` (NOT NULL), `birth_date` (NULL), `avatar_url` (NULL)
- **Registro atualizado**: campo `name` obrigatório no formulário e no endpoint `/auth/register`
- **Novo endpoint** `GET /todos/stats`: retorna `{ total, pending, completed }` de tarefas com `due_date` na semana calendário atual (segunda a domingo)
- **Novo endpoint** `PATCH /users/me`: atualiza `name`, `birth_date` e `avatar_url`
- **Novo endpoint** `PATCH /users/me/password`: troca senha exigindo senha atual

**Fora do escopo:**
- Upload de imagem para storage (S3); `avatar_url` é uma URL digitada pelo usuário
- Recuperação de senha via email
- Notificações ou alertas de tarefas
- Configurações além de perfil e senha

## Capabilities

### New Capabilities

- `sidebar-navigation`: Sidebar colapsável com navegação entre Home, Tarefas e Minha Conta — layout base de todas as rotas autenticadas
- `home-dashboard`: Página Home com saudação personalizada e estatísticas de tarefas da semana atual
- `user-profile`: Campos de perfil do usuário (nome, data de nascimento, avatar_url) e edição via "Minha Conta"
- `password-change`: Fluxo de troca de senha autenticada, exigindo a senha atual

### Modified Capabilities

- `auth`: Campo `name` se torna obrigatório no registro; resposta de login/register e endpoint `/auth/me` passam a incluir `name`, `birth_date` e `avatar_url`
- `todo-management`: Adição do endpoint `GET /todos/stats` para estatísticas semanais

## Impact

**Backend:**
- Migration de schema: 3 arquivos SQL encadeados para adicionar `name`, `birth_date` e `avatar_url` à tabela `users` com backfill seguro para usuários existentes
- 3 novos handlers: `todos/stats`, `users/update-profile`, `users/change-password`
- 2 novas funções no `serverless.yml`
- Handler de registro atualizado para aceitar e persistir `name`

**Frontend:**
- Novo componente `AppLayout` com `Sidebar` colapsável (React Router `<Outlet>`)
- `App.tsx` reestruturado com rotas aninhadas sob `AppLayout`
- Nova página `HomePage` com hook `useTodoStats`
- Nova página `AccountPage` com formulários de perfil e senha
- `AuthContext` expandido: tipo `User` inclui `name`, `birth_date`, `avatar_url`
- Página de registro com campo `name`
- Redirecionamento padrão `/` → `/home`
