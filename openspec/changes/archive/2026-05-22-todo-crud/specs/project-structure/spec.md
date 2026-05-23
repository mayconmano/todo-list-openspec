## MODIFIED Requirements

### Requirement: Frontend exibe página inicial

O sistema SHALL redirecionar automaticamente a rota raiz `/` para `/todos`, que é a página principal da aplicação. A rota `/todos` SHALL ser protegida e exigir autenticação.

#### Scenario: Acesso à rota raiz autenticado
- **WHEN** um usuário autenticado acessa `http://localhost:5173/`
- **THEN** o sistema SHALL redirecionar para `/todos` e exibir a lista de todos do usuário

#### Scenario: Acesso à rota raiz sem autenticação
- **WHEN** um usuário não autenticado acessa `http://localhost:5173/`
- **THEN** o sistema SHALL redirecionar para `/` que redireciona para `/todos` que por sua vez redireciona para `/login`

#### Scenario: Acesso direto a /todos sem autenticação
- **WHEN** um usuário não autenticado acessa `http://localhost:5173/todos`
- **THEN** o sistema SHALL redirecionar para `/login`
