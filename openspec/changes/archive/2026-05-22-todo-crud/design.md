## Context

A aplicação possui fundação (monorepo, Docker, Drizzle, Serverless) e autenticação JWT funcionais. O próximo passo é o núcleo do produto: o CRUD de todos. O `apiFetch` atual lê o token via `AuthContext` — isso impossibilita seu uso fora de componentes React (ex: callbacks de TanStack Query). A rota raiz `/` atualmente renderiza a homepage diretamente; com a introdução de `/todos`, precisa redirecionar.

## Goals / Non-Goals

**Goals:**
- Tabela `todos` com todos os campos de domínio necessários
- 4 endpoints REST escopados por usuário e protegidos por JWT
- Listagem com paginação offset-based e filtros server-side
- Frontend com TanStack Query (cache, sync, scroll infinito)
- Edição inline de todos sem modal
- Filtro de data com presets semânticos + range picker complementar

**Non-Goals:**
- Paginação cursor-based
- Ordenação manual (drag-and-drop)
- Subtarefas, tags ou categorias
- Notificações de vencimento
- Otimistic updates (usar invalidação simples)

## Decisions

### 1. Paginação offset-based (page + limit) em vez de cursor-based

A listagem de todos por usuário raramente terá milhares de itens. Paginação offset é mais simples de implementar, mais fácil de combinar com filtros dinâmicos e suficiente para o volume esperado.

**Alternativa considerada**: cursor-based (keyset pagination) — mais eficiente em tabelas grandes, mas adiciona complexidade desnecessária neste momento.

### 2. Token lido do localStorage em `apiFetch`, não do AuthContext

TanStack Query executa `queryFn` fora do ciclo de render React, onde hooks não podem ser chamados. Ler o token direto de `localStorage` (onde o `AuthContext` já persiste) elimina a dependência circular sem alterar o comportamento de autenticação.

**Alternativa considerada**: passar o token como parâmetro para cada query — verboso e propenso a erros de omissão.

### 3. Filtros server-side, não client-side

Com scroll infinito, o cliente não possui todos os dados carregados. Filtrar no servidor é a única abordagem correta. O `useInfiniteQuery` inclui os filtros ativos na `queryKey`, garantindo que qualquer mudança de filtro limpa o cache e refaz a busca da página 1.

### 4. Invalidação simples após mutações, sem otimistic updates

Otimistic updates exigem rollback em caso de erro e lógica de reconciliação com dados paginados — complexidade desproporcional ao ganho de UX neste momento. Invalidar e refazer a query é simples, correto e suficientemente rápido.

### 5. Presets semânticos de data traduzidos no frontend para range de datas

Os presets (Hoje, Esta semana, Atrasados, Sem prazo) são convertidos em `due_date_from`/`due_date_to` no frontend antes de enviar à API. O backend recebe apenas o range final — sem lógica de preset no servidor, mais simples e testável. Exceção: `Sem prazo` envia `due_date_preset=no_due_date` pois não há range equivalente.

**Alternativa considerada**: backend interpreta o preset — acoplamento desnecessário entre UI e API.

### 6. Edição inline sem modal

O TodoItem alterna entre modo display e modo edição sem abrir modal. Mantém o contexto visual da lista, evita sobreposição de estado e é mais natural em listas densas.

### Schema da tabela `todos`

```sql
CREATE TABLE todos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  due_date    DATE,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_todos_user_id (user_id)
);
```

### Contrato da API

| Método | Rota            | Body / Query                                                                                  | Resposta                              |
|--------|-----------------|-----------------------------------------------------------------------------------------------|---------------------------------------|
| GET    | /todos          | `?page=1&limit=20&search=&status=all\|pending\|completed&due_date_from=&due_date_to=&due_date_preset=no_due_date` | `{ data: Todo[], total: number, page: number, totalPages: number }` |
| POST   | /todos          | `{ title, description?, due_date? }`                                                          | `201 { todo: Todo }`                  |
| PATCH  | /todos/{id}     | `{ title?, description?, completed?, due_date? }`                                             | `200 { todo: Todo }`                  |
| DELETE | /todos/{id}     | —                                                                                             | `204`                                 |

Todos os endpoints exigem `Authorization: Bearer <token>`. Retornam `401` sem token, `403` se o todo não pertence ao usuário, `404` se não encontrado.

### Estrutura de componentes frontend

```
TodosPage
  ├─ CreateTodoForm     (title req, description opt, due_date opt)
  ├─ TodoFilters        (search debounced 400ms, select status, filtro data)
  └─ TodoList           (useInfiniteQuery + IntersectionObserver)
       └─ TodoItem      (modo display ↔ modo edição inline)
```

## Risks / Trade-offs

- **Filtros + scroll infinito**: mudar qualquer filtro reinicia a paginação (página 1). Comportamento correto mas pode surpreender o usuário se ele estiver na página 5 e alterar o search. Mitigação: UX clara (filtros no topo, lista reseta visivelmente).
- **`updated_at` ON UPDATE**: comportamento do MySQL pode variar em certas versões. Mitigação: usar MySQL 8 conforme já definido no docker-compose.
- **apiFetch sem token**: se o localStorage não tiver token (sessão expirada), a API retorna 401. O `AuthContext` já trata logout nesse caso, mas o TanStack Query pode tentar refazer queries automaticamente. Mitigação: configurar `retry: false` nas queries autenticadas.
