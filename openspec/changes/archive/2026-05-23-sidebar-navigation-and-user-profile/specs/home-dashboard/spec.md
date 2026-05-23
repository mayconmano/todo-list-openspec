## ADDED Requirements

### Requirement: Página Home exibe saudação personalizada

A página `/home` SHALL exibir uma saudação ao usuário autenticado utilizando seu nome completo (`name`). Se o usuário não tiver nome definido (campo vazio), a saudação SHALL utilizar o prefixo do email como fallback.

#### Scenario: Saudação com nome definido

- **WHEN** o usuário autenticado acessa `/home` e possui `name` preenchido
- **THEN** o sistema SHALL exibir "Olá, [nome]" onde `[nome]` é o nome completo do usuário

#### Scenario: Saudação com nome vazio (fallback)

- **WHEN** o usuário autenticado acessa `/home` e `name` está vazio
- **THEN** o sistema SHALL exibir "Olá, [prefixo-do-email]" onde o prefixo é a parte antes do `@`

---

### Requirement: Página Home exibe estatísticas de tarefas da semana

A página `/home` SHALL exibir três contadores de tarefas com `due_date` na semana calendário atual (segunda-feira a domingo): total, pendentes e concluídas. Os dados SHALL ser obtidos via `GET /todos/stats`.

#### Scenario: Exibição dos contadores da semana

- **WHEN** o usuário autenticado acessa `/home`
- **THEN** o sistema SHALL exibir três cards ou contadores com os valores `total`, `pending` e `completed` retornados pelo endpoint `GET /todos/stats`

#### Scenario: Estado de carregamento

- **WHEN** a requisição `GET /todos/stats` ainda está em andamento
- **THEN** o sistema SHALL exibir indicadores visuais de carregamento nos contadores

#### Scenario: Semana sem tarefas

- **WHEN** o usuário não possui tarefas com `due_date` na semana atual
- **THEN** os três contadores SHALL exibir `0`

---

### Requirement: Backend expõe endpoint de estatísticas semanais

O sistema SHALL implementar `GET /todos/stats` que retorna a contagem de tarefas do usuário autenticado com `due_date` entre a segunda-feira e o domingo da semana calendário atual.

#### Scenario: Requisição autenticada retorna stats corretas

- **WHEN** um usuário autenticado faz `GET /todos/stats`
- **THEN** o sistema SHALL retornar HTTP 200 com `{ total: number, pending: number, completed: number }` contando apenas tarefas do usuário com `due_date` na semana atual

#### Scenario: Isolamento por usuário

- **WHEN** dois usuários diferentes fazem `GET /todos/stats`
- **THEN** cada um SHALL receber contagens apenas de suas próprias tarefas

#### Scenario: Requisição sem autenticação

- **WHEN** `GET /todos/stats` é chamado sem token JWT válido
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Não autorizado" }`

#### Scenario: Cálculo da semana calendário

- **WHEN** `GET /todos/stats` é processado em qualquer dia da semana
- **THEN** o sistema SHALL calcular `weekStart` como segunda-feira da semana atual às 00:00:00 e `weekEnd` como domingo da semana atual às 23:59:59
