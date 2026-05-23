## Por que

O projeto não tem nenhum mecanismo que garanta que implementações feitas por IA sigam o OpenSpec, passem por validações técnicas antes de chegar em produção, ou sejam revisadas de forma consistente. Isso cria risco de código fora da spec, variáveis de ambiente hardcoded, versões de Node inconsistentes entre ambientes, e deploys com erros de tipo ou lint.

## O que muda

- **Novo script `npm run check`** na raiz: orquestra lint, typecheck do backend, build do frontend e testes — falha se qualquer etapa falhar
- **Gate de validação no CI** (GitHub Actions): executa `npm run check` e valida env vars obrigatórias antes de rodar migration ou deploy
- **Regras explícitas para IA** em `.claude/rules/ai-harness.md`: define o que a IA deve e não deve fazer ao implementar mudanças neste projeto
- **Comando `/opsx:review`** em `.claude/commands/opsx/review.md`: checklist de auto-revisão que a IA executa antes de declarar implementação concluída
- **Template de PR** em `.github/pull_request_template.md`: padroniza o que um humano deve revisar antes de aprovar
- **Alinhamento de versão do Node**: `openspec/config.yaml` corrigido de Node 22 para Node 20, consistente com `serverless.yml` e GitHub Actions
- **CORS via env var**: `response.ts` e `serverless.yml` passam a ler `CORS_ORIGIN` do ambiente em vez de hardcodar `*`
- **Validação de env vars no CI**: script que verifica presença de todos os secrets obrigatórios antes de executar migration ou deploy
- **Base para testes**: scripts `test` adicionados em backend (placeholder) e referenciados no `check`

## Capacidades

### Novas capacidades

- `ai-harness`: Conjunto de regras, comandos e validações que constraingem e auditam implementações feitas por IA, garantindo conformidade com o OpenSpec e qualidade técnica mínima

### Capacidades modificadas

- `cicd-pipeline`: O pipeline passa a ter um gate de validação (check + env vars) antes de migration/deploy, e o CORS deixa de ser hardcoded

## Impacto

- **`package.json` (raiz)**: novo script `check`
- **`apps/backend/package.json`**: novos scripts `typecheck` e `test`
- **`apps/frontend/package.json`**: sem mudança (build já inclui tsc)
- **`.github/workflows/backend.yml`**: adição de steps de check e validação de env vars antes do migrate
- **`apps/backend/src/lib/response.ts`**: `CORS_ORIGIN` lida de `process.env.CORS_ORIGIN`
- **`apps/backend/serverless.yml`**: cors config atualizado para usar `CORS_ORIGIN`; env var `CORS_ORIGIN` adicionada ao provider
- **`.env.example`**: adição de `CORS_ORIGIN`
- **`openspec/config.yaml`**: correção de Node 22 → Node 20
- **`.claude/rules/ai-harness.md`**: arquivo novo
- **`.claude/commands/opsx/review.md`**: arquivo novo
- **`.github/pull_request_template.md`**: arquivo novo

**Sem impacto em**: schema do banco, autenticação, lógica de negócio, frontend além do typecheck já existente.
