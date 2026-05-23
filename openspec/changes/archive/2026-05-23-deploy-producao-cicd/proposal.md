## Why

A aplicação está funcional localmente, mas não possui processo de deploy automatizado nem infraestrutura de produção. Para validar o ciclo completo de desenvolvimento e entrega, é necessário criar a infraestrutura em nuvem e um pipeline de CI/CD que faça o deploy automaticamente a cada push na branch principal.

## What Changes

- **Novo diretório `infra/`**: projeto AWS CDK em TypeScript para provisionar toda a infraestrutura de produção como código
- **RDS MySQL**: banco de dados gerenciado na AWS, publicamente acessível (para este estágio de validação)
- **S3 + CloudFront**: hospedagem do frontend estático com distribuição de conteúdo
- **IAM User**: usuário com permissões mínimas para o GitHub Actions executar os deploys
- **`serverless.yml` atualizado**: configuração do stage `prod` com variáveis de ambiente vindas do CI/CD; CORS aberto (`*`) no primeiro deploy
- **Frontend atualizado**: URL da API via variável de ambiente `VITE_API_URL` em vez de valor fixo
- **`.github/workflows/backend.yml`**: pipeline de CI/CD do backend — executa migrações e faz deploy via Serverless Framework
- **`.github/workflows/frontend.yml`**: pipeline de CI/CD do frontend — build Vite, sync S3, invalidação CloudFront

## Capabilities

### New Capabilities

- `infrastructure-as-code`: Provisionamento da infraestrutura AWS de produção via CDK TypeScript (RDS, S3, CloudFront, IAM)
- `cicd-pipeline`: Workflows GitHub Actions para deploy automatizado de backend e frontend em produção

### Modified Capabilities

- `project-structure`: Adição do diretório `infra/` e dos arquivos `.github/workflows/` à estrutura do repositório

## Impact

- **Infraestrutura**: criação de recursos AWS com custo contínuo (RDS, CloudFront, S3)
- **Backend**: `serverless.yml` receberá configuração do stage `prod`; variáveis de ambiente deixam de ser locais e passam a vir do GitHub Secrets
- **Frontend**: `VITE_API_URL` precisa ser configurada em tempo de build; qualquer referência hardcoded à URL da API deve ser removida
- **Segurança**: RDS publicamente acessível é adequado para validação, mas deve ser revisado antes de uso com dados reais
- **Repositório**: o projeto precisa estar em um repositório GitHub para o GitHub Actions funcionar
- **Primeiro deploy**: fluxo manual — `cdk deploy` local para criar infra, capturar outputs, configurar GitHub Secrets, depois push ativa o CI/CD
