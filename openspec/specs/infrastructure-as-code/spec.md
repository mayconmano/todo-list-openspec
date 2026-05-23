# Capability: infrastructure-as-code

## Requirement: Infraestrutura provisionável via CDK

O sistema SHALL disponibilizar um projeto AWS CDK em TypeScript no diretório `infra/` capaz de provisionar toda a infraestrutura de produção com um único comando `cdk deploy --all`.

### Scenario: Deploy bem-sucedido da infraestrutura

- **WHEN** o desenvolvedor executa `cdk deploy --all` na pasta `infra/` com AWS CLI configurado
- **THEN** o CDK SHALL criar os recursos AWS definidos nas stacks e exibir os outputs (RDS endpoint, CloudFront URL, IAM credentials) ao final

### Scenario: Deploy sem AWS CLI configurado

- **WHEN** o desenvolvedor executa `cdk deploy --all` sem credenciais AWS válidas
- **THEN** o CDK SHALL falhar com mensagem de erro indicando ausência de credenciais

---

## Requirement: Banco de dados RDS MySQL provisionado

O sistema SHALL provisionar uma instância RDS MySQL 8.0 na AWS com acesso público habilitado, para permitir conexão direta pelo backend Lambda e pelo pipeline de CI/CD.

### Scenario: Instância RDS criada com sucesso

- **WHEN** o `cdk deploy` da `RdsStack` é executado com sucesso
- **THEN** SHALL existir uma instância RDS MySQL 8.0 acessível publicamente na porta 3306, com o endpoint disponível como output do stack

### Scenario: Conexão ao RDS com credenciais corretas

- **WHEN** um cliente MySQL tenta conectar ao endpoint RDS com usuário e senha corretos
- **THEN** a conexão SHALL ser estabelecida com sucesso

### Scenario: Conexão ao RDS com credenciais incorretas

- **WHEN** um cliente MySQL tenta conectar ao endpoint RDS com senha errada
- **THEN** a conexão SHALL ser recusada com erro de autenticação

---

## Requirement: Hospedagem do frontend via S3 e CloudFront

O sistema SHALL provisionar um bucket S3 para armazenar os arquivos estáticos do frontend e uma distribuição CloudFront como ponto de entrada público, com suporte a SPA (redirecionamento de 404 para index.html).

### Scenario: Frontend acessível via URL do CloudFront

- **WHEN** o `cdk deploy` da `FrontendStack` é executado e os arquivos do build são sincronizados para o S3
- **THEN** a URL do CloudFront SHALL servir a aplicação React corretamente

### Scenario: Rota SPA acessada diretamente

- **WHEN** o usuário acessa uma rota como `<cloudfront-url>/todos` diretamente no browser
- **THEN** o CloudFront SHALL retornar `index.html` para que o React Router processe a rota no cliente

---

## Requirement: IAM user com permissões mínimas para CI/CD

O sistema SHALL provisionar um IAM user com permissões suficientes para que o GitHub Actions execute o deploy do backend (Serverless Framework) e do frontend (S3 + CloudFront), sem permissões administrativas.

### Scenario: IAM user criado com access key disponível

- **WHEN** o `cdk deploy` da `IamStack` é executado com sucesso
- **THEN** SHALL existir um IAM user com access key ID e secret disponíveis como output do stack para configuração no GitHub Secrets

### Scenario: Deploy de backend com IAM user do CI/CD

- **WHEN** o GitHub Actions usa as credenciais do IAM user para executar `serverless deploy`
- **THEN** o deploy SHALL completar com sucesso sem erro de permissão
