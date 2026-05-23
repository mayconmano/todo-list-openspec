## Context

A aplicação possui backend (Serverless Framework + Lambda + MySQL) e frontend (React + Vite) funcionando localmente, mas sem infraestrutura de produção nem pipeline de entrega automatizado. O objetivo é provisionar toda a infraestrutura necessária via código e criar workflows de CI/CD que realizem o deploy automaticamente a cada push na branch `main`.

## Goals / Non-Goals

**Goals:**
- Provisionar RDS MySQL, S3, CloudFront e IAM via AWS CDK TypeScript
- Criar GitHub Actions para deploy automatizado de backend e frontend
- Executar migrações Drizzle como parte do pipeline de backend
- Manter infraestrutura e código de aplicação separados (diretório `infra/`)

**Non-Goals:**
- Domínio customizado (será usada a URL gerada pelo CloudFront/API Gateway)
- Ambientes de staging ou homologação
- Monitoramento, alertas ou observabilidade
- Restringir CORS ao CloudFront no primeiro deploy (será feito em etapa posterior)
- Colocar Lambda em VPC privada (avaliação futura)

## Decisions

### 1. AWS CDK em vez de `serverless.yml resources:` ou Terraform

**Decisão:** usar AWS CDK com TypeScript no diretório `infra/`.

**Alternativas consideradas:**
- `resources:` no `serverless.yml`: suporta CloudFormation puro, que é muito verboso para RDS + CloudFront + IAM. Misturaria infra com funções no mesmo arquivo, dificultando manutenção.
- Terraform: padrão da indústria, mas adiciona HCL como nova linguagem ao projeto. Para o escopo atual, o CDK oferece as mesmas capacidades com TypeScript já conhecido pela equipe.

**Rationale:** CDK usa TypeScript nativo (mesma linguagem de todo o projeto), tem abstrações de alto nível (L2 constructs) que simplificam muito a configuração de RDS e CloudFront, e permite separar infra de aplicação de forma clara.

### 2. RDS publicamente acessível

**Decisão:** RDS com `publiclyAccessible: true` e security group aberto na porta 3306.

**Alternativas consideradas:**
- Lambda em VPC com RDS privado: mais seguro, mas adiciona complexidade (subnets, NAT Gateway) e aumenta cold start das Lambdas significativamente.

**Rationale:** para validar o pipeline de CI/CD, a simplicidade tem prioridade. O RDS público é adequado para este estágio; a migração para VPC pode ser feita como evolução futura sem alterar a lógica da aplicação.

### 3. Segredos no GitHub Actions Secrets

**Decisão:** credenciais AWS, variáveis de banco e JWT_SECRET armazenados como GitHub Actions Secrets, passados como variáveis de ambiente no `serverless deploy`.

**Alternativas consideradas:**
- AWS SSM Parameter Store: mais seguro e AWS-native, mas exige configuração adicional e permissão de leitura do SSM no IAM da Lambda.

**Rationale:** para validação do CI/CD, GitHub Secrets é suficiente, simples e sem custo. O SSM pode ser adotado como melhoria futura.

### 4. Migrações Drizzle no workflow do backend

**Decisão:** o workflow `backend.yml` executa `drizzle-kit migrate` antes do `serverless deploy`, conectando diretamente ao RDS via variáveis de ambiente do GitHub Secrets.

**Alternativas consideradas:**
- Lambda handler específico para migrations invocado no deploy: funciona com RDS privado, mas adiciona complexidade desnecessária agora.
- Migrações manuais locais: foge do objetivo de CI/CD totalmente automatizado.

**Rationale:** com RDS publicamente acessível, o runner do GitHub Actions consegue conectar diretamente. É a abordagem mais simples para o escopo atual.

### 5. Stacks CDK separadas por responsabilidade

**Decisão:** três stacks CDK independentes: `RdsStack`, `FrontendStack`, `IamStack`.

**Rationale:** stacks separadas permitem deploy e destruição independentes. Se o frontend precisar ser recriado, não afeta o banco. A `IamStack` pode ser deployada uma única vez e raramente alterada.

### 6. CORS aberto no primeiro deploy

**Decisão:** `serverless.yml` configura CORS com `origin: '*'` inicialmente. Após obter a URL do CloudFront, o valor deve ser atualizado e o backend redeployado.

**Rationale:** a URL do CloudFront só é conhecida após o deploy do `FrontendStack`. Tentar configurar CORS antes cria dependência circular. A restrição de CORS é feita em passo posterior documentado nas tasks.

## Risks / Trade-offs

| Risco | Mitigação |
|---|---|
| RDS público exposto na internet | Aceitável para validação. Migrar para VPC antes de uso com dados reais. |
| Custo contínuo do RDS mesmo sem uso | Usar instância `db.t3.micro` (mínima). Destruir com `cdk destroy` ao pausar. |
| GitHub Secrets com credenciais AWS de longa duração | Usar IAM user com permissões mínimas. Avaliar OIDC para GitHub Actions no futuro. |
| Migrações rodam antes do deploy — falha parcial deixa schema em estado inconsistente | Drizzle migrations são incrementais. Revisar scripts antes de executar em prod. |
| CORS aberto durante o período entre o primeiro e o segundo deploy | Janela curta de tempo; o deploy de restrição deve ser feito logo após obter a URL do CloudFront. |

## Migration Plan

1. Instalar e configurar AWS CDK localmente (`npm install -g aws-cdk` + `cdk bootstrap`)
2. Executar `cdk deploy --all` na pasta `infra/` para provisionar toda a infraestrutura
3. Capturar os outputs: RDS endpoint, CloudFront URL, IAM Access Key e Secret
4. Criar repositório GitHub e configurar os secrets
5. Fazer push da branch `main` para acionar os workflows pela primeira vez
6. Verificar logs do GitHub Actions; checar endpoint da API e frontend no browser
7. Atualizar CORS no `serverless.yml` com a URL do CloudFront e fazer redeploy do backend

**Rollback:** `cdk destroy --all` remove toda a infraestrutura. O código da aplicação não é afetado.

## Open Questions

- Qual região AWS usar? (padrão do `serverless.yml` é `us-east-1`)
- O IAM user do GitHub Actions deve ter permissão de `cdk deploy` também, ou apenas deploy de aplicação?
