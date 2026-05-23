# Capability: cicd-pipeline

## Requirement: Deploy automatizado do backend ao push na main

O sistema SHALL executar automaticamente o deploy do backend na AWS ao receber um push na branch `main`, precedido obrigatoriamente por validação de qualidade (`npm run check`), validação de env vars obrigatórias e execução das migrações Drizzle.

### Scenario: Push na main com backend alterado

- **WHEN** um push é feito na branch `main`
- **THEN** o workflow `backend.yml` SHALL executar na ordem: `npm run check`, validação de env vars, migrações Drizzle e `serverless deploy --stage prod`

### Scenario: Migração falha antes do deploy

- **WHEN** o passo de migração Drizzle falha durante o workflow
- **THEN** o workflow SHALL ser interrompido antes do `serverless deploy` e o job SHALL ser marcado como falho

### Scenario: Credenciais AWS ausentes no repositório

- **WHEN** o workflow tenta autenticar na AWS sem os secrets `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` configurados
- **THEN** o workflow SHALL falhar com erro de autenticação indicando credenciais inválidas

---

## Requirement: Pipeline do backend valida qualidade antes de migrate e deploy

O sistema SHALL executar `npm run check` como etapa obrigatória no workflow do backend antes de rodar migrações ou deploy, interrompendo o pipeline se qualquer validação falhar.

### Scenario: Check passa e pipeline continua

- **WHEN** o workflow `backend.yml` é disparado e `npm run check` conclui sem erros
- **THEN** o pipeline SHALL prosseguir para a etapa de validação de env vars e em seguida para migrate e deploy

### Scenario: Check falha e pipeline é interrompido

- **WHEN** o workflow `backend.yml` é disparado e `npm run check` falha (lint, typecheck ou build)
- **THEN** o pipeline SHALL ser interrompido antes de rodar migrações e o job SHALL ser marcado como falho com o output do erro

---

## Requirement: Pipeline valida env vars obrigatórias antes de migrate

O sistema SHALL verificar a presença de todas as variáveis de ambiente obrigatórias do backend antes de executar migrações Drizzle, falhando com mensagem explícita se alguma estiver ausente.

### Scenario: Todas as env vars presentes

- **WHEN** o workflow executa a validação de env vars e todas as variáveis obrigatórias (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `CORS_ORIGIN`) estão definidas
- **THEN** a validação SHALL passar e o pipeline SHALL prosseguir para migrate

### Scenario: Env var obrigatória ausente

- **WHEN** o workflow executa a validação e uma ou mais variáveis obrigatórias não estão definidas nos secrets do repositório
- **THEN** o pipeline SHALL falhar antes de rodar migrate, exibindo quais variáveis estão ausentes

---

## Requirement: Deploy automatizado do frontend ao push na main

O sistema SHALL executar automaticamente o build e deploy do frontend ao receber um push na branch `main`, sincronizando os arquivos para o S3 e invalidando o cache do CloudFront.

### Scenario: Push na main com frontend alterado

- **WHEN** um push é feito na branch `main`
- **THEN** o workflow `frontend.yml` SHALL executar `vite build` com a variável `VITE_API_URL` configurada, sincronizar os arquivos para o bucket S3 e criar uma invalidação no CloudFront

### Scenario: Build do frontend falha

- **WHEN** o `vite build` falha (ex: erro de TypeScript ou dependência ausente)
- **THEN** o workflow SHALL ser interrompido antes do sync para o S3 e o job SHALL ser marcado como falho

### Scenario: Acesso ao frontend após deploy bem-sucedido

- **WHEN** o workflow `frontend.yml` conclui com sucesso
- **THEN** a URL do CloudFront SHALL servir a versão mais recente do frontend em no máximo 60 segundos após a invalidação

---

## Requirement: Variável de ambiente VITE_API_URL configurável em build

O sistema SHALL utilizar a variável de ambiente `VITE_API_URL` para definir a URL base da API no frontend, sem valores hardcoded no código.

### Scenario: Build com VITE_API_URL definida

- **WHEN** o `vite build` é executado com `VITE_API_URL=https://api-id.execute-api.us-east-1.amazonaws.com/prod`
- **THEN** o bundle gerado SHALL usar essa URL para todas as requisições à API

### Scenario: Build sem VITE_API_URL definida

- **WHEN** o `vite build` é executado sem a variável `VITE_API_URL`
- **THEN** o frontend SHALL usar uma URL padrão de fallback (ex: `http://localhost:3001`) ou o build SHALL falhar com mensagem clara sobre a variável ausente
