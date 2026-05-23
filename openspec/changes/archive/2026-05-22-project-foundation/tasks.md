## 1. Raiz do Monorepo

- [x] 1.1 Criar `package.json` na raiz com `workspaces: ["apps/*"]` e scripts `dev`, `lint` e `format`
- [x] 1.2 Criar `tsconfig.base.json` na raiz com configurações TypeScript compartilhadas (strict, target ES2022, moduleResolution bundler)
- [x] 1.3 Criar `.eslintrc.js` na raiz com regras compartilhadas para TypeScript
- [x] 1.4 Criar `.prettierrc` na raiz com configuração de formatação
- [x] 1.5 Criar `.gitignore` cobrindo `node_modules`, `.env`, `dist`, `.serverless`
- [x] 1.6 Criar `.env.example` com todas as variáveis necessárias documentadas (DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME)

## 2. Banco de Dados Local (Docker)

- [x] 2.1 Criar `docker-compose.yml` na raiz com serviço `mysql:8`, porta 3306 mapeada, variáveis de ambiente e volume para persistência
- [x] 2.2 Validar que `docker compose up -d` sobe o MySQL sem erros

## 3. Backend

- [x] 3.1 Criar `apps/backend/package.json` com dependências: `serverless`, `serverless-offline`, `drizzle-orm`, `mysql2`, `dotenv`; devDependencies: `typescript`, `@types/node`, `ts-node`
- [x] 3.2 Criar `apps/backend/tsconfig.json` estendendo `../../tsconfig.base.json`
- [x] 3.3 Criar `apps/backend/serverless.yml` com provider AWS/Node.js 22, plugin `serverless-offline` na porta 3001 e function `health`
- [x] 3.4 Criar `apps/backend/src/db.ts` com configuração do Drizzle ORM conectando ao MySQL via variáveis de ambiente
- [x] 3.5 Criar `apps/backend/src/handlers/health.ts` com handler `GET /health` retornando `{ ok: true }` com status 200
- [x] 3.6 Criar `apps/backend/.env` baseado no `.env.example` com valores para o MySQL local do Docker
- [x] 3.7 Validar que `npm run dev` no backend inicia `serverless offline` e responde `GET http://localhost:3001/health` com `{ ok: true }`
- [x] 3.8 Validar que a conexão com o MySQL é estabelecida na inicialização sem erros no log

## 4. Frontend

- [x] 4.1 Criar `apps/frontend` via `npm create vite@latest` com template `react-ts`
- [x] 4.2 Atualizar `apps/frontend/tsconfig.json` para estender `../../tsconfig.base.json`
- [x] 4.3 Instalar e configurar Tailwind CSS no frontend (`tailwind.config.js`, `postcss.config.js`, importar no `index.css`)
- [x] 4.4 Instalar shadcn/ui e executar `npx shadcn-ui@latest init` para configurar o tema base
- [x] 4.5 Atualizar `apps/frontend/src/App.tsx` para exibir uma página inicial simples com título "Todo List"
- [x] 4.6 Validar que `npm run dev` no frontend abre `http://localhost:5173` no browser com a página inicial visível

## 5. Validação Final

- [x] 5.1 Validar que `npm run dev` na raiz do monorepo sobe frontend e backend simultaneamente (usando `concurrently` ou scripts npm paralelos)
- [x] 5.2 Validar que `docker compose up -d` + `npm run dev` completa o ambiente local conforme descrito nas specs
