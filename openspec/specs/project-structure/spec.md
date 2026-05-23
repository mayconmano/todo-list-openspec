# Capability: project-structure

## Requirement: Ambiente de desenvolvimento local inicializável

O sistema SHALL permitir que um desenvolvedor inicialize o ambiente de desenvolvimento local com um único comando após clonar o repositório e configurar as variáveis de ambiente.

### Scenario: Inicialização bem-sucedida do ambiente local

- **WHEN** o desenvolvedor executa `docker compose up -d` e depois `npm run dev` na raiz do monorepo
- **THEN** o MySQL deve estar acessível na porta 3306, o backend deve responder na porta 3001 e o frontend deve estar acessível no browser na porta 5173

### Scenario: Variáveis de ambiente não configuradas

- **WHEN** o desenvolvedor tenta iniciar o backend sem o arquivo `.env` configurado
- **THEN** o processo deve falhar com uma mensagem de erro clara indicando qual variável está ausente

---

## Requirement: Backend responde ao endpoint de saúde

O sistema SHALL expor um endpoint `GET /health` no backend que confirme que o serviço está operacional.

### Scenario: Requisição ao endpoint de saúde com serviço no ar

- **WHEN** uma requisição `GET /health` é feita ao backend
- **THEN** o sistema SHALL retornar HTTP 200 com corpo `{ "ok": true }`

### Scenario: Requisição ao endpoint de saúde sem autenticação

- **WHEN** uma requisição `GET /health` é feita sem nenhum token de autenticação
- **THEN** o sistema SHALL retornar HTTP 200 normalmente, pois este endpoint é público

---

## Requirement: Frontend exibe página inicial

O sistema SHALL redirecionar automaticamente a rota raiz `/` para `/todos`, que é a página principal da aplicação. A rota `/todos` SHALL ser protegida e exigir autenticação.

### Scenario: Acesso à rota raiz autenticado

- **WHEN** um usuário autenticado acessa `http://localhost:5173/`
- **THEN** o sistema SHALL redirecionar para `/todos` e exibir a lista de todos do usuário

### Scenario: Acesso à rota raiz sem autenticação

- **WHEN** um usuário não autenticado acessa `http://localhost:5173/`
- **THEN** o sistema SHALL redirecionar para `/` que redireciona para `/todos` que por sua vez redireciona para `/login`

### Scenario: Acesso direto a /todos sem autenticação

- **WHEN** um usuário não autenticado acessa `http://localhost:5173/todos`
- **THEN** o sistema SHALL redirecionar para `/login`

---

## Requirement: Conexão com o banco de dados validada

O sistema SHALL validar que o Drizzle ORM consegue conectar ao MySQL local durante a inicialização do backend.

### Scenario: Backend inicia com banco de dados disponível

- **WHEN** o backend é iniciado com o MySQL rodando via Docker
- **THEN** a conexão com o banco deve ser estabelecida sem erros e o backend deve estar pronto para receber requisições

### Scenario: Backend inicia sem banco de dados disponível

- **WHEN** o backend é iniciado sem o MySQL rodando
- **THEN** o sistema SHALL falhar na inicialização com uma mensagem de erro indicando falha de conexão com o banco
