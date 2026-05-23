## 1. Banco de Dados

- [x] 1.1 Criar `apps/backend/src/schema/todos.ts` com a tabela `todos` via Drizzle (id, user_id, title, description, completed, due_date, created_at, updated_at)
- [x] 1.2 Criar e executar migration para criar a tabela `todos` no banco local
- [x] 1.3 Validar que a tabela `todos` foi criada corretamente no banco com todos os campos e FK para `users`

## 2. Backend — Handlers

- [x] 2.1 Criar `apps/backend/src/handlers/todos/list.ts` com `GET /todos` suportando query params: `page`, `limit`, `search` (LIKE %title%), `status` (all/pending/completed), `due_date_from`, `due_date_to`, `due_date_preset` (no_due_date); retornar `{ data, total, page, totalPages }`
- [x] 2.2 Criar `apps/backend/src/handlers/todos/create.ts` com `POST /todos` validando `title` obrigatório, retornando `201 { todo }` ou `400` se title vazio
- [x] 2.3 Criar `apps/backend/src/handlers/todos/update.ts` com `PATCH /todos/{id}` aceitando qualquer combinação de `title`, `description`, `completed`, `due_date`; retornar `403` se o todo não pertence ao usuário, `404` se não encontrado
- [x] 2.4 Criar `apps/backend/src/handlers/todos/delete.ts` com `DELETE /todos/{id}` retornando `204`; retornar `403` se o todo não pertence ao usuário, `404` se não encontrado
- [x] 2.5 Atualizar `apps/backend/serverless.yml` adicionando as 4 functions: `listTodos` (GET /todos), `createTodo` (POST /todos), `updateTodo` (PATCH /todos/{id}), `deleteTodo` (DELETE /todos/{id})
- [x] 2.6 Garantir que todos os handlers de todos usam `withAuth` e filtram por `user_id` do token

## 3. Backend — Validação Manual

- [x] 3.1 Iniciar o backend e validar `POST /todos` com `{ "title": "Teste" }` retorna `201` com o todo criado
- [x] 3.2 Validar `POST /todos` sem `title` retorna `400`
- [x] 3.3 Validar `GET /todos` retorna apenas todos do usuário autenticado com estrutura `{ data, total, page, totalPages }`
- [x] 3.4 Validar `GET /todos?status=pending` retorna apenas todos não concluídos
- [x] 3.5 Validar `GET /todos?search=teste` retorna apenas todos com "teste" no título
- [x] 3.6 Validar `PATCH /todos/{id}` com `{ "completed": true }` atualiza o todo corretamente
- [x] 3.7 Validar `PATCH /todos/{id}` de um todo de outro usuário retorna `403`
- [x] 3.8 Validar `DELETE /todos/{id}` retorna `204` e remove o todo
- [x] 3.9 Validar `DELETE /todos/{id}` de um todo de outro usuário retorna `403`

## 4. Frontend — Dependências e Configuração

- [x] 4.1 Instalar `@tanstack/react-query` no `apps/frontend`
- [x] 4.2 Atualizar `apps/frontend/src/main.tsx` adicionando `QueryClientProvider` (com `QueryClient` configurado com `retry: false`) envolvendo a aplicação, fora do `AuthProvider`
- [x] 4.3 Atualizar `apps/frontend/src/lib/api.ts` para ler o token diretamente de `localStorage.getItem('token')` em vez do `AuthContext`

## 5. Frontend — Roteamento

- [x] 5.1 Atualizar `apps/frontend/src/App.tsx` adicionando a rota `/todos` protegida por `ProtectedRoute` renderizando `TodosPage`
- [x] 5.2 Atualizar a rota `/` em `App.tsx` para renderizar `<Navigate to="/todos" replace />`

## 6. Frontend — Hooks TanStack Query

- [x] 6.1 Criar `apps/frontend/src/hooks/useTodos.ts` com `useInfiniteQuery` usando `queryKey: ['todos', filters]`, buscando `GET /todos?page&limit=20&...filters`, com `getNextPageParam` baseado em `page` e `totalPages`
- [x] 6.2 Criar `apps/frontend/src/hooks/useCreateTodo.ts` com `useMutation` para `POST /todos`, chamando `invalidateQueries({ queryKey: ['todos'] })` on success
- [x] 6.3 Criar `apps/frontend/src/hooks/useUpdateTodo.ts` com `useMutation` para `PATCH /todos/{id}`, chamando `invalidateQueries({ queryKey: ['todos'] })` on success
- [x] 6.4 Criar `apps/frontend/src/hooks/useDeleteTodo.ts` com `useMutation` para `DELETE /todos/{id}`, chamando `invalidateQueries({ queryKey: ['todos'] })` on success

## 7. Frontend — Componentes de Filtro

- [x] 7.1 Criar `apps/frontend/src/components/todos/TodoFilters.tsx` com: input de busca (debounce 400ms via `useState` + `useEffect`), `Select` de status (Todos/Pendentes/Concluídos), select de preset de data (Todos/Hoje/Esta semana/Atrasados/Sem prazo) e dois `<input type="date">` para range (De / Até); preset semântico preenche o range, campos manuais sobrescrevem; mudança em qualquer filtro emite novo objeto `filters` para o pai

## 8. Frontend — Componente CreateTodoForm

- [x] 8.1 Criar `apps/frontend/src/components/todos/CreateTodoForm.tsx` com React Hook Form + Zod: campo `title` obrigatório (string não vazia), campo `description` opcional, campo `due_date` opcional (date input); ao submeter chama `useCreateTodo`, limpa o formulário on success, exibe erro em caso de falha

## 9. Frontend — Componente TodoItem

- [x] 9.1 Criar `apps/frontend/src/components/todos/TodoItem.tsx` com dois modos:
  - **Modo display**: checkbox de toggle (chama `useUpdateTodo` com `completed` invertido), título, description (se preenchida), due_date formatada (se preenchida), botão ✏️ (entra em edição), botão 🗑️ (chama `useDeleteTodo` com confirmação)
  - **Modo edição**: input para `title`, textarea para `description`, `<input type="date">` para `due_date`, botão salvar (chama `useUpdateTodo` e volta ao display), botão cancelar (volta ao display sem salvar)

## 10. Frontend — Componente TodoList com Scroll Infinito

- [x] 10.1 Criar `apps/frontend/src/components/todos/TodoList.tsx` que recebe os dados do `useInfiniteQuery` e renderiza a lista de `TodoItem`; adicionar elemento sentinel `<div ref={sentinelRef} />` ao final da lista; usar `IntersectionObserver` para chamar `fetchNextPage()` quando o sentinel ficar visível e `hasNextPage` for true; exibir indicador de carregamento durante `isFetchingNextPage`

## 11. Frontend — Página TodosPage

- [x] 11.1 Criar `apps/frontend/src/pages/TodosPage.tsx` compondo: `CreateTodoForm`, `TodoFilters` (com estado local de filtros), `TodoList` (recebendo dados do `useTodos(filters)`); incluir botão de logout no topo usando `useAuth`

## 12. Frontend — Validação Manual

- [x] 12.1 Validar que acessar `/` redireciona para `/todos`
- [x] 12.2 Validar que acessar `/todos` sem autenticação redireciona para `/login`
- [x] 12.3 Validar que o formulário de criação exibe erro ao submeter com título vazio (sem chamar a API)
- [x] 12.4 Validar que criar um todo adiciona-o no topo da lista imediatamente após invalidação
- [x] 12.5 Validar que o toggle de completed atualiza visualmente o item sem recarregar a página toda
- [x] 12.6 Validar que o modo de edição inline exibe os valores atuais e salva corretamente
- [x] 12.7 Validar que cancelar a edição descarta as alterações
- [x] 12.8 Validar que deletar um todo remove-o da lista após confirmação
- [x] 12.9 Validar que o filtro por título aplica debounce (não dispara a cada tecla) e atualiza a lista
- [x] 12.10 Validar que o filtro por status "Pendentes" oculta todos concluídos
- [x] 12.11 Validar que o preset "Hoje" filtra apenas todos com due_date no dia atual
- [x] 12.12 Validar que o preset "Atrasados" filtra todos com due_date passada e não concluídos
- [x] 12.13 Validar que o range picker manual sobrescreve o preset ao alterar uma das datas
- [x] 12.14 Validar que o scroll infinito carrega a próxima página ao rolar até o final da lista (criar mais de 20 todos para testar)
- [x] 12.15 Validar que o logout remove o token, redireciona para `/login` e limpa o cache do TanStack Query
