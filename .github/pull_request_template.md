## Descrição

<!-- O que esta mudança faz? Por que é necessária? -->

## Change OpenSpec

<!-- Nome da change implementada (ex: openspec/changes/add-auth) -->
Change: `openspec/changes/`

## Checklist

- [ ] A implementação atende todos os requisitos da spec (`openspec/changes/.../specs/`)
- [ ] Nenhum valor de configuração está hardcoded (URLs, origins, secrets)
- [ ] Toda env var nova está no `.env.example`
- [ ] Se houve mudança de schema, existe migration Drizzle correspondente
- [ ] Endpoints de tarefas verificam ownership do usuário autenticado
- [ ] `npm run check` passa sem erros

## Observações

<!-- Decisões tomadas, trade-offs, pontos de atenção para o revisor -->
