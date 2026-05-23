## ADDED Requirements

### Requirement: Comando check valida qualidade antes de qualquer operação de deploy

O sistema SHALL disponibilizar um comando `npm run check` na raiz do monorepo que execute lint, typecheck do backend, build do frontend e testes, falhando com código de saída não-zero se qualquer etapa falhar.

#### Scenario: Todos os checks passam

- **WHEN** `npm run check` é executado com código válido sem erros de lint, tipo ou build
- **THEN** o comando SHALL concluir com código de saída 0 e exibir o resultado de cada etapa

#### Scenario: Lint falha

- **WHEN** `npm run check` é executado e o eslint encontra violações
- **THEN** o comando SHALL falhar com código de saída não-zero e exibir os erros de lint antes de interromper a execução

#### Scenario: Build do frontend falha

- **WHEN** `npm run check` é executado e o `tsc -b && vite build` encontra erros de tipo ou bundler
- **THEN** o comando SHALL falhar com código de saída não-zero e exibir os erros de build

#### Scenario: Typecheck do backend falha

- **WHEN** `npm run check` é executado e o `tsc --noEmit` do backend encontra erros de tipo
- **THEN** o comando SHALL falhar com código de saída não-zero e exibir os erros de tipo

---

### Requirement: CORS configurável por variável de ambiente

O sistema SHALL utilizar a variável de ambiente `CORS_ORIGIN` para definir a origem permitida nas respostas do backend, sem valor hardcoded no código.

#### Scenario: Deploy em produção com CORS_ORIGIN definida

- **WHEN** o backend é deployado com `CORS_ORIGIN=https://meu-dominio.cloudfront.net`
- **THEN** todas as respostas da API SHALL incluir o header `Access-Control-Allow-Origin: https://meu-dominio.cloudfront.net`

#### Scenario: Execução local sem CORS_ORIGIN definida

- **WHEN** o backend é executado localmente sem a variável `CORS_ORIGIN`
- **THEN** as respostas da API SHALL incluir o header `Access-Control-Allow-Origin: *` como fallback

---

### Requirement: Regras de implementação para IA documentadas e acessíveis

O sistema SHALL manter um arquivo `.claude/rules/ai-harness.md` com regras explícitas que a IA deve seguir ao implementar mudanças, incluindo requisitos sobre OpenSpec, configuração, segurança e qualidade de código.

#### Scenario: IA implementa mudança seguindo as regras

- **WHEN** a IA recebe uma tarefa de implementação
- **THEN** a IA SHALL ler e aplicar as regras em `.claude/rules/ai-harness.md` antes de escrever código

#### Scenario: Regras cobrem configurações de ambiente

- **WHEN** uma regra proíbe valores hardcoded de configuração
- **THEN** a IA SHALL usar variáveis de ambiente para qualquer valor que varie entre ambientes (URLs, origins, secrets)

---

### Requirement: Comando de auto-revisão disponível para a IA

O sistema SHALL disponibilizar o comando `/opsx:review` em `.claude/commands/opsx/review.md` que instrui a IA a executar um checklist de auto-revisão sobre a implementação antes de declarar conclusão.

#### Scenario: IA executa revisão após implementação

- **WHEN** a IA executa `/opsx:review` após implementar uma tarefa
- **THEN** a IA SHALL verificar conformidade com spec, ausência de valores hardcoded, presença de migrations se necessário, ownership em endpoints de todo, env vars documentadas e resultado do `npm run check`

#### Scenario: Revisão identifica problema

- **WHEN** o checklist de revisão identifica um item não atendido
- **THEN** a IA SHALL corrigir o problema antes de declarar a implementação concluída

---

### Requirement: Template de PR padroniza revisão humana

O sistema SHALL disponibilizar um arquivo `.github/pull_request_template.md` com checklist de revisão para PRs, cobrindo conformidade com OpenSpec, qualidade técnica e testes.

#### Scenario: PR criado no GitHub

- **WHEN** um pull request é aberto no repositório
- **THEN** o GitHub SHALL pré-preencher a descrição do PR com o template definido em `.github/pull_request_template.md`
