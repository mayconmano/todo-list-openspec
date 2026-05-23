## ADDED Requirements

### Requirement: Backend expõe estatísticas de tarefas da semana

O sistema SHALL implementar `GET /todos/stats` retornando a contagem de tarefas do usuário autenticado cuja `due_date` esteja na semana calendário atual (segunda-feira a domingo). Este requisito é especificado na capability `home-dashboard`.

#### Scenario: Stats retornadas corretamente

- **WHEN** um usuário autenticado faz `GET /todos/stats`
- **THEN** o sistema SHALL retornar HTTP 200 com `{ total: number, pending: number, completed: number }`

#### Scenario: Sem autenticação

- **WHEN** `GET /todos/stats` é chamado sem token JWT válido
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Não autorizado" }`

---

## MODIFIED Requirements

### Requirement: Frontend exibe página de gerenciamento de tarefas

O sistema SHALL exibir a página de tarefas na rota `/tarefas` (anteriormente `/todos`) dentro do `AppLayout` com sidebar. O header standalone da página SHALL ser removido, pois a navegação e o logout passam a ser responsabilidade da sidebar.

#### Scenario: Acesso à rota de tarefas

- **WHEN** o usuário autenticado acessa `/tarefas`
- **THEN** o sistema SHALL exibir a listagem de tarefas dentro do layout com sidebar, sem header próprio

#### Scenario: Redirecionamento de rota legada

- **WHEN** o usuário acessa `/todos`
- **THEN** o sistema SHALL redirecionar para `/tarefas`

#### Scenario: Animação de entrada de nova tarefa

- **WHEN** o usuário cria uma nova tarefa com sucesso
- **THEN** o novo item SHALL entrar na lista com animação de slide-down e fade-in

#### Scenario: Animação de saída ao deletar tarefa

- **WHEN** o usuário confirma a exclusão de uma tarefa
- **THEN** o item SHALL sair da lista com animação de fade-out e slide-up antes de ser removido do DOM

#### Scenario: Animação do checkbox ao completar tarefa

- **WHEN** o usuário clica no checkbox de uma tarefa para marcá-la como concluída
- **THEN** o checkbox SHALL animar com escala e preenchimento na cor `#e367e3`, e o texto da tarefa SHALL receber line-through com transição suave

#### Scenario: Hover em item da lista de tarefas

- **WHEN** o usuário passa o cursor sobre um item da lista
- **THEN** o item SHALL exibir destaque visual sutil com transição suave

#### Scenario: Filtros de status com estado ativo visual

- **WHEN** o usuário seleciona um filtro ("Todas", "Pendentes" ou "Concluídas")
- **THEN** o filtro ativo SHALL exibir estilo pill com borda, texto e fundo sutil na cor `#e367e3`, e os demais filtros SHALL permanecer sem destaque
