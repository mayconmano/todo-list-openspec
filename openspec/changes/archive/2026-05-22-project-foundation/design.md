## Context

Projeto novo, sem nenhum código existente. A stack foi definida previamente: monorepo com npm workspaces, frontend React/Vite e backend Serverless Framework/Node.js, MySQL via Docker para ambiente local. O objetivo desta mudança é criar a fundação que todas as features futuras vão construir em cima.

## Goals / Non-Goals

**Goals:**
- Monorepo funcional com `npm run dev` subindo frontend e backend simultaneamente
- MySQL local rodando via Docker com conexão validada pelo Drizzle
- Frontend acessível no browser com página inicial
- Backend respondendo `GET /health` com `{ ok: true }`
- Configuração de TypeScript, ESLint e Prettier consistente entre os dois apps
- `.env.example` documentando todas as variáveis necessárias

**Non-Goals:**
- Deploy em produção (AWS S3, CloudFront, Lambda)
- GitHub Actions / CI/CD
- Schema de banco de dados de domínio (tabelas de tarefas, usuários)
- Autenticação JWT
- Qualquer feature de negócio

## Decisions

### 1. Monorepo com npm workspaces (sem Turborepo/Nx)

**Escolha:** npm workspaces nativo, sem ferramenta de build adicional.

**Alternativas consideradas:**
- Turborepo: útil para cache de builds e pipelines complexos, mas overhead desnecessário agora
- Nx: muito opinativo e pesado para um projeto deste tamanho
- Dois repos separados: descartado — dificulta compartilhamento de tipos e aumenta contexto de desenvolvimento

**Rationale:** npm workspaces resolve o problema imediato (referências locais entre packages) com zero dependência extra. Pode-se adicionar Turborepo depois se o tempo de build se tornar um problema.

### 2. Estrutura de pastas

```
todo-list/
├── apps/
│   ├── frontend/          # React + Vite
│   └── backend/           # Serverless + Node.js
├── docker-compose.yml
├── .env.example
├── .eslintrc.js           # config compartilhada
├── .prettierrc
├── tsconfig.base.json     # config TS base
└── package.json           # root com workspaces
```

Cada app tem seu próprio `package.json`, `tsconfig.json` (extends base) e scripts.

### 3. MySQL via Docker (padrão recomendado, não obrigatório)

**Escolha:** `docker-compose.yml` com imagem `mysql:8` como abordagem padrão.

**Alternativas consideradas:**
- MySQL instalado diretamente: não reproduzível entre máquinas, conflitos de versão — mas válido para quem já tem MySQL local (ver abaixo)
- PlanetScale/Turso: lock-in de infraestrutura desnecessário para desenvolvimento

**Rationale:** Docker garante ambiente idêntico em qualquer máquina. Um único `docker compose up -d` sobe o banco sem configuração manual.

**Desenvolvedores com MySQL local:** quem já possui MySQL instalado pode pular o Docker e apontar o `.env` diretamente para a instância local (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). O backend conecta exclusivamente via variáveis de ambiente, sem dependência do Docker em si.

### 4. serverless-offline para desenvolvimento local

**Escolha:** plugin `serverless-offline` para emular Lambda localmente.

**Rationale:** Mantém paridade com o ambiente de produção (Serverless Framework) sem precisar fazer deploy a cada mudança. O handler responde em `http://localhost:3001`.

### 5. Drizzle ORM com conexão validada, sem schema de domínio

**Escolha:** Drizzle configurado e conexão testada, mas sem criar tabelas de domínio.

**Rationale:** Valida que a conexão funciona (banco acessível, credenciais corretas) sem amarrar esta mudança a decisões de schema que serão feitas nas features de negócio.

## Risks / Trade-offs

- **Conflito de porta 3306** → Desenvolvedor com MySQL local já rodando na porta 3306 verá falha ao executar `docker compose up -d`. Mitigação: pular o Docker e configurar o `.env` diretamente para a instância local (conforme decisão 3).
- **npm workspaces + serverless-offline** → Pode haver conflitos de resolução de módulos. Mitigação: cada app mantém suas próprias dependências; compartilhar apenas `devDependencies` de tooling no root.
- **Variáveis de ambiente em `.env`** → Arquivo `.env` não deve ser commitado. Mitigação: adicionar `.env` ao `.gitignore` e documentar todas as variáveis em `.env.example`.

## Contrato de API

### `GET /health`

**Resposta 200:**
```json
{ "ok": true }
```

Sem autenticação. Sem parâmetros. Usado apenas para validar que o servidor está no ar.
