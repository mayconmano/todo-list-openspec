## ADDED Requirements

### Requirement: Diretório de infraestrutura como código presente no repositório

O repositório SHALL conter um diretório `infra/` na raiz com um projeto AWS CDK válido em TypeScript, incluindo `cdk.json` e as stacks de infraestrutura.

#### Scenario: Projeto CDK inicializável após clone

- **WHEN** o desenvolvedor executa `npm install` dentro de `infra/` após clonar o repositório
- **THEN** todas as dependências CDK SHALL ser instaladas sem erros e o comando `cdk synth` SHALL gerar os templates CloudFormation com sucesso

---

### Requirement: Workflows de CI/CD presentes no repositório

O repositório SHALL conter os arquivos `.github/workflows/backend.yml` e `.github/workflows/frontend.yml` que definem os pipelines de deploy automatizado.

#### Scenario: Repositório clonado contém os workflows

- **WHEN** o desenvolvedor lista os arquivos em `.github/workflows/`
- **THEN** SHALL existir `backend.yml` e `frontend.yml` com as definições dos pipelines de CI/CD
