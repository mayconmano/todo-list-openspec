# Capability: cicd-pipeline

## Requirement: Deploy automatizado do backend ao push na main

O sistema SHALL executar automaticamente o deploy do backend na AWS ao receber um push na branch `main`, incluindo a execução das migrações Drizzle antes do deploy das funções Lambda.

### Scenario: Push na main com backend alterado

- **WHEN** um push é feito na branch `main`
- **THEN** o workflow `backend.yml` SHALL executar as migrações Drizzle no RDS de produção e em seguida fazer o `serverless deploy --stage prod` com sucesso

### Scenario: Migração falha antes do deploy

- **WHEN** o passo de migração Drizzle falha durante o workflow
- **THEN** o workflow SHALL ser interrompido antes do `serverless deploy` e o job SHALL ser marcado como falho

### Scenario: Credenciais AWS ausentes no repositório

- **WHEN** o workflow tenta autenticar na AWS sem os secrets `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY` configurados
- **THEN** o workflow SHALL falhar com erro de autenticação indicando credenciais inválidas

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
