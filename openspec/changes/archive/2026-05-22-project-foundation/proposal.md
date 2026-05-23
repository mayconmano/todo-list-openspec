## Why

O projeto ainda não existe no disco. Para que qualquer funcionalidade possa ser desenvolvida, é necessário criar a estrutura base do monorepo com frontend e backend configurados, banco de dados local via Docker e ambiente de desenvolvimento funcional.

## What Changes

- Criação do monorepo com npm workspaces contendo dois apps: `frontend` e `backend`
- Configuração do `frontend` com React 18, Vite, TypeScript, Tailwind CSS e shadcn/ui
- Configuração do `backend` com Serverless Framework, Node.js 22, TypeScript e Drizzle ORM
- Criação do `docker-compose.yml` com MySQL 8 para uso local
- Configuração de variáveis de ambiente via `.env` com exemplo documentado em `.env.example`
- Endpoint de saúde `GET /health` no backend retornando `{ ok: true }`
- Página inicial no frontend exibindo "Hello World"
- Conexão do Drizzle ORM com o MySQL local (sem schema de domínio)
- Configuração de ESLint e Prettier compartilhados no monorepo

## Capabilities

### New Capabilities

- `project-structure`: Estrutura do monorepo, scripts de desenvolvimento e configuração de ambiente local

### Modified Capabilities

*(nenhuma — projeto novo)*

## Impact

- **Infraestrutura local**: requer Docker instalado na máquina para subir o MySQL
- **Backend**: cria o ponto de entrada do serviço Serverless com `serverless-offline`
- **Frontend**: cria o ponto de entrada React com Vite
- **Banco de dados**: instância MySQL 8 local via Docker, sem schema de domínio ainda
- **Fora do escopo**: GitHub Actions, deploy na AWS, autenticação JWT, qualquer feature de tarefas
