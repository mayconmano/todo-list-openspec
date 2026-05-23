## Why

A aplicação já possui autenticação funcional, mas não tem nenhuma funcionalidade de tarefas — o núcleo do produto. Esta mudança entrega o CRUD completo de todos com filtros e scroll infinito, tornando a aplicação utilizável pela primeira vez.

## What Changes

- Criação da tabela `todos` no banco com os campos: id, user_id, title, description, completed, due_date, created_at, updated_at
- Migration para criar a tabela no banco local
- Endpoints REST para listar, criar, atualizar e deletar todos, todos protegidos por JWT e escopados por usuário
- Listagem com paginação (scroll infinito) e filtros por título, status e data
- Frontend com TanStack Query gerenciando cache e sincronização
- Página `/todos` como homepage da aplicação (rota `/` redireciona para `/todos`)
- TodoItem com modo de edição inline (title, description, due_date)
- Filtro de data com presets semânticos (Hoje, Esta semana, Atrasados, Sem prazo) e range picker complementar

## Capabilities

### New Capabilities

- `todo-management`: CRUD de tarefas com filtros por título, status e data, paginação via scroll infinito, edição inline e toggle de conclusão

### Modified Capabilities

- `project-structure`: Roteamento atualizado (/ → /todos), QueryClientProvider adicionado, apiFetch atualizado para ler token do localStorage

## Impact

- **Banco de dados**: nova tabela `todos` com FK para `users`
- **Backend**: 4 novos handlers, novas rotas no `serverless.yml`
- **Frontend**: nova dependência `@tanstack/react-query`; `apiFetch` alterado (leitura de token do localStorage); `main.tsx` atualizado com `QueryClientProvider`; roteamento atualizado
- **Autenticação**: todos os endpoints de todos exigem token JWT válido; usuários só acessam seus próprios todos
- **Fora do escopo**: drag-and-drop, subtarefas, tags, notificações, paginação manual, deploy
