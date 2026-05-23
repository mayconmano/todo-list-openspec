## 1. Pré-requisitos

- [ ] 1.1 Criar repositório no GitHub e fazer o primeiro push do projeto
- [ ] 1.2 Instalar AWS CDK globalmente: `npm install -g aws-cdk`
- [ ] 1.3 Executar `cdk bootstrap` na conta AWS para preparar o ambiente CDK

## 2. Infraestrutura CDK — Setup do projeto

- [x] 2.1 Criar diretório `infra/` na raiz do monorepo
- [x] 2.2 Inicializar projeto CDK TypeScript em `infra/`: `cdk init app --language typescript`
- [x] 2.3 Remover arquivos desnecessários gerados pelo `cdk init` (ex: testes de exemplo)
- [x] 2.4 Adicionar `infra` ao `tsconfig.base.json` ou garantir que `infra/tsconfig.json` esteja correto

## 3. Infraestrutura CDK — RdsStack

- [x] 3.1 Criar `infra/lib/rds-stack.ts` com instância RDS MySQL 8.0 (`db.t3.micro`, `publiclyAccessible: true`)
- [x] 3.2 Configurar security group do RDS para aceitar conexões na porta 3306 de qualquer origem (`0.0.0.0/0`)
- [x] 3.3 Exportar o endpoint do RDS como output do stack (`CfnOutput`)
- [x] 3.4 Registrar `RdsStack` no `infra/bin/app.ts`

## 4. Infraestrutura CDK — FrontendStack

- [x] 4.1 Criar `infra/lib/frontend-stack.ts` com bucket S3 para hospedagem estática
- [x] 4.2 Configurar distribuição CloudFront apontando para o bucket S3
- [x] 4.3 Adicionar comportamento de erro no CloudFront: retornar `index.html` para erros 403 e 404 (suporte a SPA)
- [x] 4.4 Exportar a URL do CloudFront como output do stack (`CfnOutput`)
- [x] 4.5 Registrar `FrontendStack` no `infra/bin/app.ts`

## 5. Infraestrutura CDK — IamStack

- [x] 5.1 Criar `infra/lib/iam-stack.ts` com IAM user `todo-list-cicd`
- [x] 5.2 Adicionar política inline com permissões mínimas: Lambda, API Gateway, CloudFormation, S3, CloudFront, IAM (roles para Lambda), logs
- [x] 5.3 Criar Access Key para o IAM user e exportar como output do stack (`CfnOutput`)
- [x] 5.4 Registrar `IamStack` no `infra/bin/app.ts`

## 6. Deploy da infraestrutura

- [ ] 6.1 Executar `cdk synth` em `infra/` e verificar que os três templates são gerados sem erros
- [ ] 6.2 Executar `cdk deploy --all` e confirmar criação dos recursos na AWS
- [ ] 6.3 Anotar os outputs: endpoint do RDS, URL do CloudFront, Access Key ID e Secret do IAM user

## 7. Backend — Configuração do stage prod

- [x] 7.1 Atualizar `apps/backend/serverless.yml`: adicionar configuração do stage `prod` com região `us-east-1`
- [x] 7.2 Configurar CORS no `serverless.yml` com `origin: '*'` para o primeiro deploy
- [x] 7.3 Verificar que todas as variáveis de ambiente (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`) estão mapeadas via `${env:*}` no `serverless.yml`
- [x] 7.4 Adicionar script de migração em `apps/backend/package.json`: `"migrate": "drizzle-kit migrate"`

## 8. Frontend — Variável de ambiente VITE_API_URL

- [x] 8.1 Localizar todos os lugares onde a URL da API está hardcoded no frontend
- [x] 8.2 Substituir por `import.meta.env.VITE_API_URL` com fallback para `http://localhost:3001`
- [x] 8.3 Criar `apps/frontend/.env.example` com `VITE_API_URL=https://sua-api.execute-api.us-east-1.amazonaws.com/prod`

## 9. GitHub Actions — Workflow do backend

- [x] 9.1 Criar `.github/workflows/backend.yml` com trigger em push na branch `main`
- [x] 9.2 Adicionar step de checkout e setup do Node.js 20
- [x] 9.3 Adicionar step `npm install` em `apps/backend/`
- [x] 9.4 Adicionar step de migração Drizzle: `npm run migrate` com variáveis de ambiente vindas dos GitHub Secrets
- [x] 9.5 Adicionar step de deploy: `npx serverless deploy --stage prod` com variáveis AWS e de banco via secrets
- [ ] 9.6 Anotar a URL da API Gateway gerada no output do deploy

## 10. GitHub Actions — Workflow do frontend

- [x] 10.1 Criar `.github/workflows/frontend.yml` com trigger em push na branch `main`
- [x] 10.2 Adicionar step de checkout e setup do Node.js 20
- [x] 10.3 Adicionar step `npm install` em `apps/frontend/`
- [x] 10.4 Adicionar step de build: `npm run build` com `VITE_API_URL` vindo do GitHub Secret
- [x] 10.5 Adicionar step de sync S3: `aws s3 sync dist/ s3://<bucket-name> --delete`
- [x] 10.6 Adicionar step de invalidação CloudFront: `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"`

## 11. Configuração dos GitHub Secrets

- [ ] 11.1 Adicionar secret `AWS_ACCESS_KEY_ID` com o valor do output da `IamStack`
- [ ] 11.2 Adicionar secret `AWS_SECRET_ACCESS_KEY` com o valor do output da `IamStack`
- [ ] 11.3 Adicionar secret `AWS_REGION` com valor `us-east-1`
- [ ] 11.4 Adicionar secret `DB_HOST` com o endpoint do RDS (output da `RdsStack`)
- [ ] 11.5 Adicionar secret `DB_PORT` com valor `3306`
- [ ] 11.6 Adicionar secret `DB_USER` com o usuário do RDS
- [ ] 11.7 Adicionar secret `DB_PASSWORD` com a senha do RDS
- [ ] 11.8 Adicionar secret `DB_NAME` com valor `todo_list`
- [ ] 11.9 Adicionar secret `JWT_SECRET` com valor seguro gerado aleatoriamente
- [ ] 11.10 Adicionar secret `VITE_API_URL` com a URL da API Gateway (obtida após primeiro deploy do backend)
- [ ] 11.11 Adicionar secret `S3_BUCKET_NAME` com o nome do bucket criado pela `FrontendStack`
- [ ] 11.12 Adicionar secret `CLOUDFRONT_DISTRIBUTION_ID` com o ID da distribuição CloudFront

## 12. Validação do pipeline

- [ ] 12.1 Fazer push na branch `main` e acompanhar execução dos workflows no GitHub Actions
- [ ] 12.2 Verificar que o workflow do backend conclui sem erros (migrações + deploy)
- [ ] 12.3 Verificar que o workflow do frontend conclui sem erros (build + S3 sync + CF invalidate)
- [ ] 12.4 Acessar a URL do CloudFront no browser e verificar que o frontend carrega
- [ ] 12.5 Fazer login e criar uma tarefa para validar integração frontend ↔ backend ↔ banco

## 13. Pós-deploy — Restringir CORS

- [ ] 13.1 Atualizar `apps/backend/serverless.yml`: substituir `origin: '*'` pela URL do CloudFront
- [ ] 13.2 Fazer push na `main` para acionar redeploy do backend com CORS restrito
- [ ] 13.3 Verificar que o frontend continua funcionando corretamente após a restrição de CORS
