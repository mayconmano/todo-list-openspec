Execute o checklist de revisão abaixo sobre a implementação atual antes de declarar conclusão. Para cada item, verifique ativamente (leia os arquivos relevantes, execute comandos) — não assuma que está correto.

## Checklist de Revisão

### 1. Conformidade com spec
- [ ] A implementação atende todos os requisitos listados na spec da change (`openspec/changes/<change>/specs/`)
- [ ] Nenhum comportamento foi implementado além do que está na spec

### 2. Configuração e hardcode
- [ ] Nenhum valor de configuração está hardcoded (URLs, origins, secrets, credenciais)
- [ ] Toda env var nova está no `.env.example` com comentário explicativo

### 3. Banco de dados
- [ ] Se houve mudança de schema, existe um arquivo de migration em `apps/backend/src/migrations/`

### 4. Segurança e ownership
- [ ] Endpoints que acessam ou modificam tarefas verificam que `user_id === event.user.sub`
- [ ] Respostas de erro não expõem stack traces ou detalhes internos

### 5. Qualidade
- [ ] `npm run check` passa sem erros (execute e confirme o código de saída)

## Como usar

Para cada item não atendido: corrija antes de continuar. Após corrigir todos, declare a implementação concluída e marque as tarefas como `[x]` no `tasks.md`.
