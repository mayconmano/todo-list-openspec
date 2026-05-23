## MODIFIED Requirements

### Requirement: Frontend exibe página de gerenciamento de tarefas

O sistema SHALL exibir a página de tarefas com header contendo logotipo, email do usuário, controle de tema e botão de logout. A listagem de tarefas SHALL apresentar animações de entrada e saída nos itens. O sistema SHALL utilizar checkbox customizado com animação de preenchimento e escala ao marcar/desmarcar uma tarefa.

#### Scenario: Layout do header da página de tarefas

- **WHEN** o usuário acessa a página `/todos` autenticado
- **THEN** o header SHALL exibir o logotipo "✦ Todo" à esquerda, e à direita o email do usuário, o controle de alternância de tema e o botão "Sair"

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
- **THEN** o item SHALL exibir destaque visual sutil (fundo levemente diferenciado) com transição suave

#### Scenario: Filtros de status com estado ativo visual

- **WHEN** o usuário seleciona um filtro ("Todas", "Pendentes" ou "Concluídas")
- **THEN** o filtro ativo SHALL exibir estilo pill com borda, texto e fundo sutil na cor `#e367e3`, e os demais filtros SHALL permanecer sem destaque
