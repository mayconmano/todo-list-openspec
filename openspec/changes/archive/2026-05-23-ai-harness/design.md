## Contexto

O projeto usa IA (Claude Code) para implementar mudanças guiadas pelo OpenSpec. Atualmente não existe nenhuma barreira técnica ou estrutural que impeça a IA de:

- Hardcodar valores de configuração
- Pular validação de tipos antes de deploy
- Ignorar specs existentes ao implementar
- Fazer deploy com erros de lint ou build
- Declarar implementação concluída sem auto-revisão

O pipeline de CI vai direto de `install → migrate → deploy` sem nenhum gate de qualidade. O CORS está hardcoded como `*` em `response.ts` e a versão do Node no `openspec/config.yaml` diverge da usada na infra real (20).

## Goals / Non-Goals

**Goals:**

- Criar um gate técnico no CI que bloqueie deploy se lint, typecheck ou build falhar
- Criar documentação estruturada de regras para a IA seguir ao implementar
- Padronizar revisão de PR com template
- Tornar CORS configurável por ambiente
- Validar env vars obrigatórias no CI antes de migrate/deploy
- Alinhar versão do Node entre todos os arquivos de configuração

**Non-Goals:**

- Cobertura de testes automatizados (base apenas)
- Refatoração de arquitetura do backend ou frontend
- Criação de funcionalidades de produto
- Validação de env vars em runtime (dentro do Lambda)

## Decisões

### 1. `npm run check` como orquestrador central

O script `check` na raiz do monorepo orquestra os checks de todas as apps na ordem correta:

```
npm run check
├── npm run lint           → eslint em todo o projeto
├── npm -w apps/backend run typecheck   → tsc --noEmit
├── npm -w apps/frontend run build      → tsc -b && vite build
└── npm -w apps/backend run test        → placeholder (jest --passWithNoTests)
```

**Por que lint falha o check:** Lint é a única barreira contra padrões proibidos (ex: `any` explícito, imports incorretos). Se lint for aviso, a IA pode ignorar.

**Por que frontend usa `build` em vez de só `typecheck`:** O script `build` do frontend já inclui `tsc -b` e ainda valida que o bundler Vite consegue processar todos os módulos. Um `typecheck` separado seria redundante.

**Por que backend usa `typecheck` em vez de `build`:** O backend não tem um passo de build isolado — esbuild só roda durante `serverless deploy`. `tsc --noEmit` é o equivalente viável.

**Alternativa considerada:** Rodar os checks em paralelo com `concurrently`. Descartado porque a ordem sequencial torna o output mais legível e facilita identificar qual step falhou.

### 2. Gate de validação no CI antes de migrate/deploy

O workflow `backend.yml` ganha dois steps antes do migrate:

```
install → check → validate-env → migrate → deploy
```

O step `validate-env` roda um script Node simples que verifica se todas as env vars obrigatórias estão presentes, falhando com mensagem explícita se alguma faltar.

**Por que não validar em runtime (no Lambda):** Lambdas são invocados sob demanda — não existe um "boot" único para interceptar antes de qualquer request. Uma validação no handler teria custo em cada cold start e chegaria tarde demais (o deploy já teria ocorrido). Validar no CI é mais cedo, mais barato e mais seguro.

**Alternativa considerada:** Usar `envalid` ou `zod` para validação de env em runtime. Descartado pelo argumento acima — o problema é pré-deploy, não pós-deploy.

### 3. CORS via env var `CORS_ORIGIN`

Dois lugares controlam CORS atualmente:

- `serverless.yml` → `cors: true` (gera endpoint OPTIONS automaticamente)
- `response.ts` → `CORS_HEADERS` com `'*'` hardcoded (headers nas respostas reais)

Ambos serão atualizados para ler `CORS_ORIGIN`:

- `serverless.yml`: `cors: { origin: '${env:CORS_ORIGIN, "*"}' }`
- `response.ts`: `process.env.CORS_ORIGIN ?? '*'`

Em produção, `CORS_ORIGIN` recebe o domínio do CloudFront via GitHub Secrets. Em desenvolvimento local, a ausência da variável faz o fallback para `*`, mantendo o comportamento atual.

**Por que manter os dois em vez de centralizar em um só:** O `cors: true` do Serverless cria e gerencia o endpoint OPTIONS (preflight). Removê-lo exigiria implementar um handler OPTIONS manual em cada função. O `response.ts` controla os headers das respostas reais (não-OPTIONS). São responsabilidades distintas.

### 4. Regras da IA em `.claude/rules/ai-harness.md`

As regras são declarativas e versionadas junto com o código. A IA carrega e respeita esse arquivo ao implementar. As regras iniciais cobrem:

- OpenSpec como pré-requisito de qualquer implementação
- Proibição de valores hardcoded de configuração
- Obrigatoriedade de migration para mudanças de schema
- Proteção de ownership em endpoints de todo
- Proibição de `any` sem justificativa
- Justificativa obrigatória para nova dependência npm
- Uso obrigatório de `/opsx:review` antes de declarar implementação concluída

**Por que `.claude/rules/` em vez de `CLAUDE.md`:** O arquivo `CLAUDE.md` é para contexto geral do projeto. Rules em arquivos separados permitem granularidade — é possível ter regras por domínio e evoluir cada uma independentemente.

### 5. Comando `/opsx:review` como auto-checklist

Um arquivo markdown em `.claude/commands/opsx/review.md` que instrui a IA a executar um checklist de revisão sobre a própria implementação antes de declarar conclusão. O checklist verifica:

- Conformidade com spec
- Ausência de valores hardcoded
- Presença de migrations quando necessário
- Ownership verificado em endpoints de todo
- Env vars documentadas no `.env.example`
- `npm run check` passando

**Por que um comando separado em vez de regra no ai-harness.md:** O `/opsx:review` é uma ação executável (a IA deve fazer algo), não uma regra declarativa. Separar os dois conceitos torna cada arquivo mais coeso.

## Riscos / Trade-offs

**[Risco] `npm run check` muito lento pode desincentivar uso local** → Mitigação: os steps são sequenciais mas rápidos para este monorepo de tamanho atual. Se crescer, adicionar `--parallel` depois.

**[Risco] `CORS_ORIGIN` ausente em ambiente local quebra a app** → Mitigação: fallback explícito para `'*'` quando `process.env.CORS_ORIGIN` não está definido.

**[Risco] Regras da IA podem ficar desatualizadas com a evolução do projeto** → Mitigação: o usuário adiciona regras conforme identifica padrões problemáticos. As regras são versionadas no git, então o histórico fica rastreável.

**[Risco] Template de PR pode ser ignorado** → Mitigação: é uma convenção, não uma barreira técnica. O CI não bloqueia PR sem o template preenchido — mas o `/opsx:review` reforça o hábito via IA.

**[Trade-off] Placeholder de teste não agrega valor imediato** → Aceito conscientemente. Cria a estrutura (`jest --passWithNoTests`) para que futuros testes entrem no `check` sem mudar a arquitetura do pipeline.
