## 1. Migrations de banco de dados

- [x] 1.1 Criar `apps/backend/src/migrations/0003_add_user_name_nullable.sql` com `ALTER TABLE users ADD COLUMN name VARCHAR(255) NULL`
- [x] 1.2 Criar `apps/backend/src/migrations/0004_backfill_user_name.sql` com `UPDATE users SET name = SUBSTRING_INDEX(email, '@', 1) WHERE name IS NULL`
- [x] 1.3 Criar `apps/backend/src/migrations/0005_user_profile_fields.sql` com `ALTER TABLE users MODIFY COLUMN name VARCHAR(255) NOT NULL, ADD COLUMN birth_date DATE NULL, ADD COLUMN avatar_url VARCHAR(500) NULL`
- [x] 1.4 Executar `npm run migrate` no backend e confirmar que as 3 migrations foram aplicadas sem erros

## 2. Schema Drizzle e tipos compartilhados

- [x] 2.1 Atualizar `apps/backend/src/schema/users.ts` adicionando os campos `name`, `birth_date` e `avatar_url` com os tipos e constraints corretos
- [x] 2.2 Verificar que o tipo inferido pelo Drizzle reflete os novos campos antes de prosseguir com os handlers

## 3. Backend — Endpoint de registro atualizado

- [x] 3.1 Atualizar `apps/backend/src/handlers/auth/register.ts` para aceitar e validar o campo `name` (obrigatório, string não vazia)
- [x] 3.2 Persistir `name` no `INSERT` de novo usuário
- [x] 3.3 Atualizar a resposta de registro para incluir `{ id, email, name, birth_date, avatar_url }` no objeto `user`
- [x] 3.4 Validar manualmente: registro sem `name` retorna HTTP 422; registro com `name` retorna HTTP 201 com `user.name` correto

## 4. Backend — Endpoints de login e me atualizados

- [x] 4.1 Atualizar `apps/backend/src/handlers/auth/login.ts` para incluir `name`, `birth_date` e `avatar_url` na resposta `user`
- [x] 4.2 Atualizar `apps/backend/src/handlers/auth/me.ts` para selecionar e retornar `name`, `birth_date` e `avatar_url`
- [x] 4.3 Validar manualmente: `POST /auth/login` e `GET /auth/me` retornam os novos campos

## 5. Backend — Endpoint de atualização de perfil

- [x] 5.1 Criar `apps/backend/src/handlers/users/update-profile.ts` com handler `PATCH /users/me` que aceita `name`, `birth_date`, `avatar_url` e ignora `email`
- [x] 5.2 Validar que `name` não pode ser string vazia (retornar HTTP 422 se vazio)
- [x] 5.3 Aplicar `withAuth` e garantir que o `user_id` vem do token, não do body
- [x] 5.4 Registrar a função `updateProfile` no `serverless.yml` com rota `PATCH /users/me` e CORS
- [x] 5.5 Validar manualmente: PATCH com `name` válido retorna HTTP 200 com perfil atualizado; PATCH com `name` vazio retorna HTTP 422

## 6. Backend — Endpoint de troca de senha

- [x] 6.1 Criar `apps/backend/src/handlers/users/change-password.ts` com handler `PATCH /users/me/password` que recebe `current_password` e `new_password`
- [x] 6.2 Verificar `current_password` com `bcrypt.compare`; retornar HTTP 401 se incorreto
- [x] 6.3 Validar `new_password` mínimo 8 caracteres; retornar HTTP 422 se inválido
- [x] 6.4 Persistir hash da nova senha com `bcrypt.hash`
- [x] 6.5 Registrar a função `changePassword` no `serverless.yml` com rota `PATCH /users/me/password` e CORS
- [x] 6.6 Validar manualmente: troca com senha atual correta retorna HTTP 200; senha atual errada retorna HTTP 401

## 7. Backend — Endpoint de estatísticas de tarefas

- [x] 7.1 Criar `apps/backend/src/handlers/todos/stats.ts` com handler `GET /todos/stats`
- [x] 7.2 Calcular `weekStart` (segunda-feira 00:00:00) e `weekEnd` (domingo 23:59:59) da semana atual em UTC
- [x] 7.3 Executar query SQL com `COUNT(*)`, `SUM(CASE WHEN completed = 0 ...)` e `SUM(CASE WHEN completed = 1 ...)` filtrada por `user_id` e `due_date BETWEEN weekStart AND weekEnd`
- [x] 7.4 Retornar `{ total, pending, completed }` com HTTP 200
- [x] 7.5 Aplicar `withAuth` e garantir isolamento por `user_id`
- [x] 7.6 Registrar a função `todoStats` no `serverless.yml` com rota `GET /todos/stats` e CORS
- [x] 7.7 Validar manualmente: stats retornam apenas tarefas do usuário autenticado com due_date na semana atual

## 8. Frontend — AuthContext e tipos

- [x] 8.1 Expandir interface `User` em `apps/frontend/src/contexts/AuthContext.tsx` para incluir `name: string`, `birth_date: string | null`, `avatar_url: string | null`
- [x] 8.2 Expor método `updateUser(partial: Partial<User>)` no contexto para atualizar o estado e `localStorage` após edição de perfil
- [x] 8.3 Garantir que `loadInitialState` lê e popula os novos campos do `localStorage`

## 9. Frontend — Reestruturação de rotas e AppLayout

- [x] 9.1 Criar `apps/frontend/src/components/layout/AppLayout.tsx` com `<Outlet />` e importação da `Sidebar`
- [x] 9.2 Criar `apps/frontend/src/components/layout/Sidebar.tsx` com itens Home, Tarefas, Minha Conta, botão colapsar e botão Sair
- [x] 9.3 Implementar lógica de colapso (estado `collapsed` em `useState` + persistência em `localStorage` com chave `sidebar_collapsed`)
- [x] 9.4 Implementar estado ativo nos itens de navegação usando `useLocation` ou `NavLink` do React Router
- [x] 9.5 Implementar comportamento mobile: sidebar oculta por padrão em < 768px, overlay com backdrop ao abrir
- [x] 9.6 Reestruturar `apps/frontend/src/App.tsx` com rotas aninhadas sob `<ProtectedRoute><AppLayout /></ProtectedRoute>`
- [x] 9.7 Adicionar redirecionamento de `/todos` para `/tarefas` e de `/` para `/home`
- [x] 9.8 Remover o header standalone de `TodosPage` (navegação e logout agora ficam na sidebar)

## 10. Frontend — Página Home

- [x] 10.1 Criar `apps/frontend/src/hooks/useTodoStats.ts` com `useQuery` para `GET /todos/stats`
- [x] 10.2 Criar `apps/frontend/src/pages/HomePage.tsx` com saudação "Olá, [nome]" (fallback para prefixo do email)
- [x] 10.3 Exibir os três contadores (total / pendentes / concluídas) consumindo `useTodoStats`
- [x] 10.4 Exibir skeleton/loading enquanto os dados carregam

## 11. Frontend — Página Minha Conta

- [x] 11.1 Criar `apps/frontend/src/pages/AccountPage.tsx` com duas seções: "Dados pessoais" e "Segurança"
- [x] 11.2 Implementar formulário de perfil com React Hook Form + Zod validando `name` (obrigatório), `birth_date` (opcional, formato data) e `avatar_url` (opcional, string)
- [x] 11.3 Pré-preencher o formulário com os dados atuais do `AuthContext`
- [x] 11.4 Exibir campo `email` como somente leitura
- [x] 11.5 Implementar preview da imagem de avatar em tempo real ao digitar `avatar_url`, com fallback de placeholder em `onError`
- [x] 11.6 Ao salvar perfil com sucesso: chamar `PATCH /users/me`, atualizar o `AuthContext` via `updateUser` e exibir mensagem de sucesso
- [x] 11.7 Implementar formulário de troca de senha com campos: senha atual, nova senha, confirmar nova senha (React Hook Form + Zod)
- [x] 11.8 Validar no frontend que nova senha e confirmação coincidem antes de submeter
- [x] 11.9 Ao salvar senha com sucesso: exibir mensagem de sucesso e limpar os campos; ao receber HTTP 401, exibir "Senha atual incorreta"

## 12. Frontend — Página de Registro atualizada

- [x] 12.1 Adicionar campo "Nome completo" obrigatório ao formulário de `RegisterPage`
- [x] 12.2 Atualizar o schema Zod da página de registro para incluir `name` (string não vazia)
- [x] 12.3 Enviar `name` no body do `POST /auth/register`
- [x] 12.4 Após registro bem-sucedido, redirecionar para `/home` (em vez de `/`)

## 13. Validação final

- [x] 13.1 Verificar fluxo completo: registro com nome → login → Home com saudação e stats → Tarefas → Minha Conta (editar perfil + trocar senha)
- [x] 13.2 Verificar colapso/expansão da sidebar e persistência ao recarregar
- [x] 13.3 Verificar comportamento mobile da sidebar (overlay com backdrop)
- [x] 13.4 Verificar que usuários existentes (com name backfilled) têm experiência funcional
- [x] 13.5 Verificar que a rota `/todos` redireciona para `/tarefas`
- [x] 13.6 Executar `/opsx:review` e verificar cada item do checklist antes de declarar concluído
