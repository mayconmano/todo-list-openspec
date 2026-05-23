## 1. Alinhamento de versão do Node

- [x] 1.1 Atualizar `openspec/config.yaml`: alterar `Node.js 22` para `Node.js 20` no campo de contexto do backend

## 2. Scripts de qualidade no backend

- [x] 2.1 Adicionar script `typecheck` em `apps/backend/package.json`: `"typecheck": "tsc --noEmit"`
- [x] 2.2 Adicionar script `test` em `apps/backend/package.json`: `"test": "echo \"No tests yet\" && exit 0"`

## 3. Comando central `npm run check`

- [x] 3.1 Adicionar script `check` em `package.json` (raiz): `"check": "npm run lint && npm -w apps/backend run typecheck && npm -w apps/frontend run build && npm -w apps/backend run test"`
- [x] 3.2 Verificar que `npm run check` executa sem erros na raiz do projeto

## 4. CORS via variável de ambiente

- [x] 4.1 Atualizar `apps/backend/src/lib/response.ts`: substituir `'*'` por `process.env.CORS_ORIGIN ?? '*'` no objeto `CORS_HEADERS`
- [x] 4.2 Atualizar `apps/backend/serverless.yml`: substituir `cors: true` por objeto cors com `origin: '${env:CORS_ORIGIN, "*"}'` em cada função que tenha `cors: true`
- [x] 4.3 Adicionar `CORS_ORIGIN` ao provider `environment` no `serverless.yml`: `CORS_ORIGIN: ${env:CORS_ORIGIN, '*'}`
- [x] 4.4 Adicionar `CORS_ORIGIN=` ao arquivo `.env.example` com comentário indicando o domínio do CloudFront em produção

## 5. Validação de env vars no CI

- [x] 5.1 Criar script `apps/backend/scripts/validate-env.js`: verificar que `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET` e `CORS_ORIGIN` estão definidos, saindo com código 1 e mensagem explícita se algum faltar
- [x] 5.2 Atualizar `.github/workflows/backend.yml`: adicionar step `Run check` executando `npm run check` na raiz, antes do step de migrate
- [x] 5.3 Atualizar `.github/workflows/backend.yml`: adicionar step `Validate env vars` executando `node apps/backend/scripts/validate-env.js` após o check e antes do migrate; incluir todas as env vars obrigatórias no step
- [x] 5.4 Adicionar `CORS_ORIGIN` às env vars do step `Run Drizzle migrations` e do step `Deploy to AWS` no `backend.yml`

## 6. Regras da IA

- [x] 6.1 Criar diretório `.claude/rules/` se não existir
- [x] 6.2 Criar `.claude/rules/ai-harness.md` com as seguintes regras: (1) nunca implementar comportamento novo sem spec em `openspec/specs/`; (2) toda change deve ter proposal, design e tasks antes de código; (3) valores que variam por ambiente sempre via env var; (4) nunca expor stack trace ou erro SQL em respostas de API; (5) endpoints de todos/mutations devem verificar ownership do usuário autenticado; (6) toda mudança de schema requer migration Drizzle; (7) `any` em TypeScript só com justificativa explícita; (8) nova dependência npm requer justificativa na proposal; (9) executar `/opsx:review` antes de declarar implementação concluída

## 7. Comando `/opsx:review`

- [x] 7.1 Criar `.claude/commands/opsx/review.md`: checklist de auto-revisão que a IA deve executar após implementar — verificar conformidade com spec, ausência de valores hardcoded, presença de migrations para mudanças de schema, ownership em endpoints de todo, env vars novas documentadas no `.env.example`, e resultado de `npm run check`

## 8. Template de PR

- [x] 8.1 Criar `.github/pull_request_template.md` com seções: descrição da mudança, referência à change do OpenSpec, checklist de conformidade (spec atendida, sem hardcode, migrations presentes se necessário, ownership verificado, env vars documentadas, `npm run check` passando), e campo de observações

## 9. Validação final

- [x] 9.1 Executar `npm run check` na raiz e confirmar que passa sem erros
- [x] 9.2 Verificar que `apps/backend/src/lib/response.ts` não contém mais o valor `'*'` hardcoded
- [x] 9.3 Verificar que `openspec/config.yaml` declara Node.js 20
- [x] 9.4 Verificar que `apps/backend/scripts/validate-env.js` existe e testa cada env var obrigatória
- [x] 9.5 Verificar que `.github/workflows/backend.yml` tem os steps `Run check` e `Validate env vars` antes do `Run Drizzle migrations`
