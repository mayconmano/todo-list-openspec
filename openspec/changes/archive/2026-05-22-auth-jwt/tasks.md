## 1. Banco de Dados

- [x] 1.1 Criar `apps/backend/src/schema/users.ts` com a tabela `users` via Drizzle (id, email, password, created_at)
- [x] 1.2 Executar `docker compose up -d` e validar que o MySQL está acessível na porta 3306
- [x] 1.3 Criar e executar migration para criar a tabela `users` no banco local (via Drizzle Kit ou SQL direto)
- [x] 1.4 Validar que a tabela `users` foi criada corretamente no banco

## 2. Backend — Dependências e Configuração

- [x] 2.1 Instalar `bcryptjs` e `jsonwebtoken` no `apps/backend`
- [x] 2.2 Instalar `@types/bcryptjs` e `@types/jsonwebtoken` como devDependencies
- [x] 2.3 Adicionar `JWT_SECRET` ao `apps/backend/.env` e ao `.env.example` na raiz
- [x] 2.4 Atualizar `apps/backend/src/db.ts` para exportar o schema `users` junto com a instância `db`

## 3. Backend — Middleware de Autenticação

- [x] 3.1 Criar `apps/backend/src/lib/jwt.ts` com funções `signToken(payload)` e `verifyToken(token)` usando `jsonwebtoken` e `JWT_SECRET`
- [x] 3.2 Criar `apps/backend/src/middleware/withAuth.ts` com a HOF `withAuth` que extrai e valida o Bearer token do header `Authorization` e injeta `user` no evento, retornando 401 se inválido

## 4. Backend — Handlers de Auth

- [x] 4.1 Criar `apps/backend/src/handlers/auth/register.ts` com validação de email e senha (mínimo 8 caracteres), normalização do email para lowercase, verificação de email único, hash bcrypt e retorno `201 { token, user }`
- [x] 4.2 Criar `apps/backend/src/handlers/auth/login.ts` com verificação de email (normalizado) e senha via bcrypt, retorno `200 { token, user }` ou `401 { error }` sem distinguir email de senha
- [x] 4.3 Criar `apps/backend/src/handlers/auth/me.ts` protegido com `withAuth`, retornando `200 { id, email, created_at }` do usuário autenticado
- [x] 4.4 Atualizar `apps/backend/serverless.yml` adicionando as functions `register` (`POST /auth/register`), `login` (`POST /auth/login`) e `me` (`GET /auth/me`)

## 5. Backend — Validação Manual

- [x] 5.1 Iniciar o backend com `npm run dev` e validar `POST /auth/register` com dados válidos retorna 201 com token
- [x] 5.2 Validar `POST /auth/register` com email duplicado retorna 409
- [x] 5.3 Validar `POST /auth/login` com credenciais corretas retorna 200 com token
- [x] 5.4 Validar `POST /auth/login` com senha errada retorna 401 sem vazar informação
- [x] 5.5 Validar `GET /auth/me` com token válido retorna dados do usuário
- [x] 5.6 Validar `GET /auth/me` sem token retorna 401

## 6. Frontend — Dependências e Roteamento

- [x] 6.1 Instalar `react-router-dom` no `apps/frontend`
- [x] 6.2 Configurar React Router em `apps/frontend/src/main.tsx` com `BrowserRouter` e rotas `/`, `/login`, `/register`

## 7. Frontend — AuthContext e API Client

- [x] 7.1 Criar `apps/frontend/src/contexts/AuthContext.tsx` com `AuthProvider` gerenciando `token` (localStorage) e `user`, expondo funções `login(token, user)` e `logout()`
- [x] 7.2 Criar `apps/frontend/src/hooks/useAuth.ts` que consome o `AuthContext`
- [x] 7.3 Criar `apps/frontend/src/lib/api.ts` com função `apiFetch(path, options)` que injeta `Authorization: Bearer <token>` automaticamente quando houver token no contexto

## 8. Frontend — Componentes

- [x] 8.1 Criar `apps/frontend/src/components/ProtectedRoute.tsx` que redireciona para `/login` se não houver usuário autenticado no contexto
- [x] 8.2 Instalar componentes shadcn/ui necessários: `input`, `button`, `label`, `card` (se ainda não disponíveis)

## 9. Frontend — Páginas

- [x] 9.1 Criar `apps/frontend/src/pages/LoginPage.tsx` com formulário (email + senha) usando React Hook Form + Zod, chamando `POST /auth/login` via `apiFetch` e tratando erro com mensagem visível
- [x] 9.2 Criar `apps/frontend/src/pages/RegisterPage.tsx` com formulário (email + senha + confirmação) usando React Hook Form + Zod, validando que senhas coincidem antes de submeter, chamando `POST /auth/register` e tratando erro de email duplicado
- [x] 9.3 Adicionar link "Não tem conta? Registre-se" na `LoginPage` e "Já tem conta? Faça login" na `RegisterPage`
- [x] 9.4 Atualizar `apps/frontend/src/App.tsx` para proteger a rota `/` com `ProtectedRoute` e adicionar botão de logout que chama `logout()` do `useAuth`
- [x] 9.5 Envolver a aplicação com `AuthProvider` em `main.tsx`

## 10. Frontend — Validação Manual

- [x] 10.1 Validar que acessar `/` sem autenticação redireciona para `/login`
- [x] 10.2 Validar que o formulário de registro exibe erro quando senhas não coincidem (sem chamar a API)
- [x] 10.3 Validar que o registro bem-sucedido redireciona para `/` com o usuário autenticado
- [x] 10.4 Validar que o login bem-sucedido redireciona para `/` e token está salvo no localStorage
- [x] 10.5 Validar que credenciais inválidas exibem mensagem de erro sem redirecionar
- [x] 10.6 Validar que o logout remove o token e redireciona para `/login`
- [x] 10.7 Validar que recarregar a página mantém a sessão (token persiste no localStorage)
