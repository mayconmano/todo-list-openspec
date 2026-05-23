# Capability: todo-management

## Requirement: Usuário pode criar um todo

O sistema SHALL permitir que um usuário autenticado crie um novo todo fornecendo título obrigatório e opcionalmente descrição e data de vencimento.

### Scenario: Criação bem-sucedida com título apenas

- **WHEN** um usuário autenticado envia `POST /todos` com `{ "title": "Comprar leite" }`
- **THEN** o sistema SHALL retornar HTTP 201 com o todo criado incluindo id, title, completed=false, created_at e user_id do usuário autenticado

### Scenario: Criação bem-sucedida com todos os campos

- **WHEN** um usuário autenticado envia `POST /todos` com `{ "title": "Comprar leite", "description": "Mercado perto de casa", "due_date": "2026-05-25" }`
- **THEN** o sistema SHALL retornar HTTP 201 com o todo criado contendo todos os campos fornecidos

### Scenario: Criação sem título

- **WHEN** um usuário autenticado envia `POST /todos` sem o campo `title` ou com `title` vazio
- **THEN** o sistema SHALL retornar HTTP 400 com mensagem de erro indicando que o título é obrigatório

### Scenario: Criação sem autenticação

- **WHEN** uma requisição `POST /todos` é feita sem token JWT válido
- **THEN** o sistema SHALL retornar HTTP 401

---

## Requirement: Usuário pode listar seus todos com paginação

O sistema SHALL retornar os todos do usuário autenticado em páginas de 20 itens, ordenados por `created_at` decrescente.

### Scenario: Listagem da primeira página

- **WHEN** um usuário autenticado envia `GET /todos?page=1&limit=20`
- **THEN** o sistema SHALL retornar `{ data: Todo[], total: number, page: number, totalPages: number }` com no máximo 20 todos pertencentes ao usuário

### Scenario: Listagem sem autenticação

- **WHEN** uma requisição `GET /todos` é feita sem token JWT válido
- **THEN** o sistema SHALL retornar HTTP 401

### Scenario: Usuário não vê todos de outros usuários

- **WHEN** um usuário autenticado lista seus todos
- **THEN** o sistema SHALL retornar apenas os todos cujo `user_id` corresponde ao usuário autenticado

---

## Requirement: Usuário pode filtrar todos por título

O sistema SHALL suportar filtragem dos todos por correspondência parcial e insensível a maiúsculas no campo `title`.

### Scenario: Filtro por título com correspondência

- **WHEN** um usuário autenticado envia `GET /todos?search=leite`
- **THEN** o sistema SHALL retornar apenas todos cujo `title` contém "leite" (case-insensitive)

### Scenario: Filtro por título sem correspondência

- **WHEN** um usuário autenticado envia `GET /todos?search=xyzabc`
- **THEN** o sistema SHALL retornar `{ data: [], total: 0, page: 1, totalPages: 0 }`

---

## Requirement: Usuário pode filtrar todos por status

O sistema SHALL suportar filtragem dos todos pelo status de conclusão: `all` (padrão), `pending` ou `completed`.

### Scenario: Filtro por pendentes

- **WHEN** um usuário autenticado envia `GET /todos?status=pending`
- **THEN** o sistema SHALL retornar apenas todos com `completed=false`

### Scenario: Filtro por concluídos

- **WHEN** um usuário autenticado envia `GET /todos?status=completed`
- **THEN** o sistema SHALL retornar apenas todos com `completed=true`

### Scenario: Filtro com status inválido

- **WHEN** um usuário autenticado envia `GET /todos?status=invalido`
- **THEN** o sistema SHALL retornar HTTP 400 com mensagem de erro

---

## Requirement: Usuário pode filtrar todos por data de vencimento

O sistema SHALL suportar filtragem por range de datas (`due_date_from`, `due_date_to`) e por preset semântico (`due_date_preset`).

### Scenario: Filtro por range de datas

- **WHEN** um usuário autenticado envia `GET /todos?due_date_from=2026-05-01&due_date_to=2026-05-31`
- **THEN** o sistema SHALL retornar apenas todos com `due_date` entre as datas fornecidas (inclusive)

### Scenario: Filtro por preset "sem prazo"

- **WHEN** um usuário autenticado envia `GET /todos?due_date_preset=no_due_date`
- **THEN** o sistema SHALL retornar apenas todos com `due_date` nulo

### Scenario: Filtros combinados

- **WHEN** um usuário autenticado envia `GET /todos?search=leite&status=pending&due_date_from=2026-05-01`
- **THEN** o sistema SHALL retornar todos que satisfazem todos os critérios simultaneamente

---

## Requirement: Usuário pode atualizar um todo

O sistema SHALL permitir que um usuário autenticado atualize qualquer combinação de `title`, `description`, `completed` e `due_date` de um todo que lhe pertença.

### Scenario: Atualização parcial bem-sucedida

- **WHEN** um usuário autenticado envia `PATCH /todos/{id}` com `{ "completed": true }`
- **THEN** o sistema SHALL retornar HTTP 200 com o todo atualizado e `updated_at` refletindo o momento da atualização

### Scenario: Toggle de conclusão

- **WHEN** um usuário autenticado envia `PATCH /todos/{id}` com `{ "completed": true }` em um todo pendente
- **THEN** o sistema SHALL retornar HTTP 200 com `completed=true`

### Scenario: Atualização de todo de outro usuário

- **WHEN** um usuário autenticado tenta atualizar um todo cujo `user_id` não é o seu
- **THEN** o sistema SHALL retornar HTTP 403

### Scenario: Atualização de todo inexistente

- **WHEN** um usuário autenticado tenta atualizar um todo com id que não existe
- **THEN** o sistema SHALL retornar HTTP 404

---

## Requirement: Usuário pode deletar um todo

O sistema SHALL permitir que um usuário autenticado delete um todo que lhe pertença.

### Scenario: Deleção bem-sucedida

- **WHEN** um usuário autenticado envia `DELETE /todos/{id}` de um todo que lhe pertence
- **THEN** o sistema SHALL retornar HTTP 204 sem corpo

### Scenario: Deleção de todo de outro usuário

- **WHEN** um usuário autenticado tenta deletar um todo cujo `user_id` não é o seu
- **THEN** o sistema SHALL retornar HTTP 403

### Scenario: Deleção de todo inexistente

- **WHEN** um usuário autenticado tenta deletar um todo com id que não existe
- **THEN** o sistema SHALL retornar HTTP 404

---

## Requirement: Frontend exibe lista de todos com scroll infinito

O sistema SHALL carregar os todos em páginas de 20 itens e carregar a próxima página automaticamente quando o usuário rolar até o final da lista.

### Scenario: Carregamento inicial

- **WHEN** o usuário acessa `/todos`
- **THEN** o sistema SHALL exibir os primeiros 20 todos do usuário

### Scenario: Carregamento de próxima página

- **WHEN** o usuário rola até o final da lista e há mais todos disponíveis
- **THEN** o sistema SHALL carregar automaticamente os próximos 20 todos e adicioná-los à lista

### Scenario: Fim da lista atingido

- **WHEN** o usuário rola até o final e não há mais páginas
- **THEN** o sistema SHALL não fazer novas requisições de paginação

---

## Requirement: Frontend permite edição inline de todos

O sistema SHALL permitir que o usuário edite `title`, `description` e `due_date` de um todo diretamente na lista, sem modal.

### Scenario: Entrada no modo de edição

- **WHEN** o usuário clica no botão de editar em um TodoItem
- **THEN** o item SHALL exibir campos de entrada preenchidos com os valores atuais de title, description e due_date

### Scenario: Salvamento de edição bem-sucedido

- **WHEN** o usuário altera os campos e clica em salvar
- **THEN** o sistema SHALL enviar `PATCH /todos/{id}` com os novos valores e atualizar o item na lista

### Scenario: Cancelamento de edição

- **WHEN** o usuário clica em cancelar durante a edição
- **THEN** o item SHALL retornar ao modo display sem alterações

---

## Requirement: Frontend aplica filtros de data com presets semânticos

O sistema SHALL oferecer presets semânticos de data (Hoje, Esta semana, Atrasados, Sem prazo) que preenchem automaticamente o range picker, e um range picker manual que pode sobrescrever o preset.

### Scenario: Seleção de preset "Hoje"

- **WHEN** o usuário seleciona o preset "Hoje"
- **THEN** o sistema SHALL filtrar todos com `due_date` igual à data atual

### Scenario: Seleção de preset "Atrasados"

- **WHEN** o usuário seleciona o preset "Atrasados"
- **THEN** o sistema SHALL filtrar todos com `due_date` anterior à data atual e `completed=false`

### Scenario: Override manual do range picker

- **WHEN** o usuário seleciona um preset e depois altera manualmente o campo "Até"
- **THEN** o sistema SHALL usar o valor manual e não o preset para o campo alterado

### Scenario: Limpeza de filtros

- **WHEN** o usuário seleciona o preset "Todos"
- **THEN** o sistema SHALL remover todos os filtros de data e recarregar a lista

---

## Requirement: Frontend exibe página de gerenciamento de tarefas

O sistema SHALL exibir a página de tarefas com header contendo logotipo, email do usuário, controle de tema e botão de logout. A listagem de tarefas SHALL apresentar animações de entrada e saída nos itens. O sistema SHALL utilizar checkbox customizado com animação de preenchimento e escala ao marcar/desmarcar uma tarefa.

### Scenario: Layout do header da página de tarefas

- **WHEN** o usuário acessa a página `/todos` autenticado
- **THEN** o header SHALL exibir o logotipo "✦ Todo" à esquerda, e à direita o email do usuário, o controle de alternância de tema e o botão "Sair"

### Scenario: Animação de entrada de nova tarefa

- **WHEN** o usuário cria uma nova tarefa com sucesso
- **THEN** o novo item SHALL entrar na lista com animação de slide-down e fade-in

### Scenario: Animação de saída ao deletar tarefa

- **WHEN** o usuário confirma a exclusão de uma tarefa
- **THEN** o item SHALL sair da lista com animação de fade-out e slide-up antes de ser removido do DOM

### Scenario: Animação do checkbox ao completar tarefa

- **WHEN** o usuário clica no checkbox de uma tarefa para marcá-la como concluída
- **THEN** o checkbox SHALL animar com escala e preenchimento na cor `#e367e3`, e o texto da tarefa SHALL receber line-through com transição suave

### Scenario: Hover em item da lista de tarefas

- **WHEN** o usuário passa o cursor sobre um item da lista
- **THEN** o item SHALL exibir destaque visual sutil (fundo levemente diferenciado) com transição suave

### Scenario: Filtros de status com estado ativo visual

- **WHEN** o usuário seleciona um filtro ("Todas", "Pendentes" ou "Concluídas")
- **THEN** o filtro ativo SHALL exibir estilo pill com borda, texto e fundo sutil na cor `#e367e3`, e os demais filtros SHALL permanecer sem destaque
