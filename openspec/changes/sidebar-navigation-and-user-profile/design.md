## Context

O app possui uma única rota autenticada (`/todos`) com layout linear (header + conteúdo). Não existe camada de navegação estruturada. O `AuthContext` armazena apenas `{ id, email }`. A tabela `users` no MySQL não tem campos de perfil além de `email` e `password`.

O backend roda como funções Lambda individualmente roteadas via Serverless Framework. As migrations são arquivos SQL executados em ordem por um script Node.js que usa `mysql2/promise`.

## Goals / Non-Goals

**Goals:**
- Introduzir um layout de shell com sidebar colapsável envolvendo todas as rotas autenticadas
- Criar as rotas `/home`, `/tarefas` e `/minha-conta` dentro desse layout
- Expandir o schema `users` com `name`, `birth_date`, `avatar_url` via migrations seguras
- Adicionar endpoints para estatísticas semanais (`GET /todos/stats`), atualização de perfil (`PATCH /users/me`) e troca de senha (`PATCH /users/me/password`)
- Manter o `AuthContext` como fonte de verdade do usuário logado, agora com os campos novos

**Non-Goals:**
- Upload de arquivo para imagem de perfil (S3 / presigned URL)
- Recuperação de senha via e-mail
- Paginação ou histórico de alterações de perfil
- Testes automatizados (não há cobertura de testes no projeto)

## Decisions

### 1. Layout: AppLayout com React Router Outlet

**Decisão:** Criar um componente `AppLayout` que renderiza a sidebar e um `<Outlet />` do React Router v6. As rotas autenticadas são aninhadas sob `AppLayout` em `App.tsx`.

```
<Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
  <Route path="/home"        element={<HomePage />} />
  <Route path="/tarefas"     element={<TodosPage />} />
  <Route path="/minha-conta" element={<AccountPage />} />
</Route>
```

**Alternativa considerada:** Layout via `context` ou HOC. Descartada — o padrão `Outlet` do React Router é a solução idiomática para layouts aninhados e evita prop drilling.

---

### 2. Sidebar: estado local + localStorage

**Decisão:** O estado colapsado/expandido da sidebar fica em `useState` com persistência em `localStorage` (chave `sidebar_collapsed`). Sem Zustand para esse estado.

**Alternativa considerada:** Zustand store global. Descartada — o estado da sidebar não é compartilhado com outros componentes, então um estado local com persistência manual é suficiente e mais simples.

**Comportamento mobile:** Em viewport < 768px, a sidebar fica oculta por padrão e abre como overlay com backdrop. Um botão hambúrguer no topo aciona a abertura.

---

### 3. Migration de `name`: 3 arquivos encadeados

**Decisão:** A adição do campo `name NOT NULL` a uma tabela com dados existentes exige uma sequência segura:

```
0003_add_user_name_nullable.sql
  → ALTER TABLE users ADD COLUMN name VARCHAR(255) NULL;

0004_backfill_user_name.sql
  → UPDATE users SET name = SUBSTRING_INDEX(email, '@', 1) WHERE name IS NULL;

0005_user_profile_fields.sql
  → ALTER TABLE users MODIFY COLUMN name VARCHAR(255) NOT NULL;
     ALTER TABLE users ADD COLUMN birth_date DATE NULL;
     ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500) NULL;
```

O arquivo 0005 usa múltiplas instruções DDL. O runner atual (`connection.execute`) não suporta múltiplas instruções por padrão no mysql2. Solução: o arquivo 0005 será um ALTER TABLE com múltiplas cláusulas numa única instrução:

```sql
ALTER TABLE users
  MODIFY COLUMN name VARCHAR(255) NOT NULL,
  ADD COLUMN birth_date DATE NULL,
  ADD COLUMN avatar_url VARCHAR(500) NULL;
```

Isso é uma única instrução DDL, suportada pelo mysql2.

**Alternativa considerada:** Um único arquivo com `DEFAULT ''`. Descartada — deixa usuários existentes com nome vazio, o que gera má experiência na saudação da Home.

---

### 4. Endpoint de stats: query SQL direta, sem reusar `useTodos`

**Decisão:** `GET /todos/stats` executa uma query SQL com `SUM(CASE WHEN ...)` para calcular total, pendentes e concluídas em uma única roundtrip:

```sql
SELECT
  COUNT(*)                                          AS total,
  SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END)   AS pending,
  SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END)   AS completed
FROM todos
WHERE user_id = :userId
  AND due_date BETWEEN :weekStart AND :weekEnd
```

`weekStart` = segunda-feira da semana atual (00:00:00), `weekEnd` = domingo da semana atual (23:59:59), calculados no handler com base em `new Date()`.

**Alternativa considerada:** Reusar o endpoint de listagem com filtro de semana e contar no cliente. Descartada — com paginação de 20 itens, a contagem seria incorreta para usuários com muitas tarefas.

---

### 5. Atualização de perfil: PATCH /users/me

**Contrato:**
```
PATCH /users/me
Authorization: Bearer <token>
Body: { name?, birth_date?, avatar_url? }

200: { id, email, name, birth_date, avatar_url, created_at }
422: { error: "Dados inválidos" }
```

Campos omitidos não são alterados (PATCH parcial). O campo `email` é ignorado mesmo se enviado.

---

### 6. Troca de senha: PATCH /users/me/password

**Contrato:**
```
PATCH /users/me/password
Authorization: Bearer <token>
Body: { current_password, new_password }

200: { message: "Senha atualizada" }
401: { error: "Senha atual incorreta" }
422: { error: "Dados inválidos" }  (new_password < 8 chars)
```

O handler verifica `current_password` com `bcrypt.compare` antes de fazer o hash da nova senha.

---

### 7. AuthContext: sincronização pós-login e pós-update

**Decisão:** O tipo `User` no `AuthContext` é expandido para:
```ts
interface User {
  id: number;
  email: string;
  name: string;
  birth_date: string | null;
  avatar_url: string | null;
}
```

O `login()` já recebe o objeto `user` completo do backend (que passará a retornar os campos novos). A página `AccountPage` chama `updateUser(partial)` exposto pelo contexto para atualizar o estado em memória e no `localStorage` após salvar no backend.

---

### 8. Dependências novas

Nenhuma dependência nova é introduzida:
- Sidebar colapsável: CSS + Tailwind puro (sem biblioteca de UI adicional)
- Ícones: a lib de ícones utilizada pelo projeto (verificar se já existe `lucide-react` — se sim, usar; se não, instalar)

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| Migration 0004 (UPDATE) falha silenciosamente no runner | Verificar manualmente após apply; o runner registra em `__migrations` apenas se não lançar exceção |
| Usuário existente com `name` backfilled como prefixo do email pode ter nome pouco apresentável | UI da Home mostra fallback gracioso; usuário pode corrigir em "Minha Conta" imediatamente |
| `avatar_url` aceita qualquer string — imagem pode não carregar | Frontend usa `onError` na `<img>` para exibir avatar placeholder |
| Stats de semana calculadas no servidor com `new Date()` sem timezone | Para o escopo atual (app pessoal), UTC é aceitável; pode ser refinado com timezone do usuário depois |
| Sidebar overlay no mobile requer gerenciamento de foco/acessibilidade | MVP sem foco trap; pode ser adicionado posteriormente |
