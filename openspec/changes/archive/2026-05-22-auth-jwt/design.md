## Context

O projeto possui backend Serverless (AWS Lambda) com Drizzle ORM + MySQL e frontend React com Vite. Não existe nenhum mecanismo de autenticação. As lambdas hoje são stateless e sem proteção. O frontend não tem roteamento configurado.

A autenticação precisa funcionar no modelo serverless: sem session server-side, sem middleware Express — cada lambda é independente. O JWT é a escolha natural para este modelo.

## Goals / Non-Goals

**Goals:**
- Registrar usuários com email e senha (bcrypt)
- Autenticar usuários e emitir JWT com expiração de 1 dia
- Expor endpoint `GET /auth/me` para o frontend validar a sessão atual
- Criar middleware `withAuth` reutilizável para proteger rotas futuras
- Configurar roteamento no frontend com rotas públicas e protegidas
- Gerenciar token no frontend via `AuthContext` + `localStorage`

**Non-Goals:**
- Refresh tokens
- Recuperação de senha
- Login social (OAuth)
- Logout com invalidação server-side
- Rate limiting nos endpoints de auth

## Decisions

### 1. JWT sem refresh token

**Decisão:** Access token único com expiração de 1 dia, sem refresh token.

**Alternativa considerada:** Access token curto (15min) + refresh token persistido no banco.

**Rationale:** Para um portfólio, a adição de refresh tokens aumenta significativamente a complexidade (tabela extra, endpoint `/auth/refresh`, lógica de rotação) sem benefício real de demonstração. A expiração de 1 dia equilibra segurança aceitável e simplicidade de implementação.

---

### 2. Token em localStorage

**Decisão:** Armazenar o JWT em `localStorage`.

**Alternativa considerada:** Cookie `httpOnly` com `SameSite=Strict`.

**Rationale:** Cookie httpOnly exige configuração de CORS mais cuidadosa entre domínios (especialmente com Serverless em API Gateway) e não é necessário para um portfólio. O risco de XSS é documentado e aceito neste contexto. Em produção real, httpOnly seria a escolha.

---

### 3. Middleware como higher-order function

**Decisão:** `withAuth` envolve o handler e injeta o usuário no evento:

```typescript
export const withAuth = (handler: AuthenticatedHandler) =>
  async (event: APIGatewayProxyEvent, context: Context) => {
    const user = verifyToken(event.headers.Authorization)
    return handler({ ...event, user }, context)
  }
```

**Alternativa considerada:** Authorizer Lambda do API Gateway.

**Rationale:** O Lambda Authorizer adiciona latência, custo e complexidade de configuração no `serverless.yml`. Para este projeto, o wrapper HOF é mais simples, testável e suficiente.

---

### 4. Schema do banco de dados

```sql
CREATE TABLE users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,  -- bcrypt hash
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

O `id` do usuário é embutido no payload do JWT (`sub: user.id`) para permitir que handlers protegidos identifiquem o usuário sem consulta extra ao banco.

---

### 5. Contrato de API

| Endpoint | Body | Resposta de sucesso | Erros |
|---|---|---|---|
| `POST /auth/register` | `{ email, password }` | `201 { token, user: { id, email } }` | `409` email em uso, `422` validação |
| `POST /auth/login` | `{ email, password }` | `200 { token, user: { id, email } }` | `401` credenciais inválidas |
| `GET /auth/me` | — (Bearer token) | `200 { id, email, created_at }` | `401` token inválido/ausente |

Erros retornam sempre `{ error: string }` sem expor detalhes internos.

---

### 6. Estrutura do frontend

```
src/
├── contexts/
│   └── AuthContext.tsx      # Provider com token/user/login/logout
├── hooks/
│   └── useAuth.ts           # Acesso ao AuthContext
├── lib/
│   └── api.ts               # fetch wrapper com Bearer token
├── components/
│   └── ProtectedRoute.tsx   # Redireciona para /login se não autenticado
└── pages/
    ├── LoginPage.tsx
    └── RegisterPage.tsx
```

React Router v6 configurado em `main.tsx` com rotas:
- `/login` — pública
- `/register` — pública
- `/` — protegida via `ProtectedRoute`

Formulários com React Hook Form + Zod. Componentes de UI com shadcn/ui (`Input`, `Button`, `Label`).

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| JWT em localStorage vulnerável a XSS | Aceito para portfólio; documentar como limitação conhecida |
| Token não pode ser revogado antes de expirar | Aceito; logout é apenas client-side (remove do localStorage) |
| `JWT_SECRET` fraco em desenvolvimento | `.env.example` documenta requisito de secret forte em produção |
| Email único não é case-insensitive por padrão no MySQL | Normalizar para lowercase antes de inserir e comparar |
