# AI Harness — Regras de Implementação

Estas regras se aplicam a toda implementação feita por IA neste projeto. Leia e siga antes de escrever qualquer código.

## OpenSpec primeiro

1. Nunca implementar comportamento novo sem uma spec correspondente em `openspec/specs/<capability>/spec.md`. Se não existe spec, crie ou peça para criar antes de codar.
2. Toda change deve ter `proposal.md`, `design.md` e `tasks.md` aprovados antes de qualquer implementação. Use `/opsx:propose` se não existe.

## Configuração e ambiente

3. Valores que variam por ambiente (URLs, origens CORS, secrets, credenciais) devem sempre vir de variáveis de ambiente. Nunca hardcode esses valores no código.
4. Toda env var nova deve ser adicionada ao `.env.example` com comentário explicando o valor esperado.

## Segurança

5. Nunca expor stack traces, mensagens de erro internas de SQL, ou detalhes de infraestrutura em respostas de API. Retorne mensagens genéricas para o usuário.
6. Todo endpoint que acessa ou modifica tarefas (todos) deve verificar que o recurso pertence ao usuário autenticado (`user_id === event.user.sub`). Nunca confiar só no ID da URL.

## Banco de dados

7. Toda mudança de schema do banco de dados requer um arquivo de migration Drizzle em `apps/backend/src/migrations/`. Nunca alterar o schema sem migration.

## Qualidade de código

8. Não use `any` em TypeScript sem um comentário explicando por que não é possível tipar corretamente.
9. Ao adicionar uma nova dependência npm, justifique a escolha no `design.md` da change (por que essa lib, alternativas consideradas).

## Revisão obrigatória

10. Antes de declarar qualquer implementação concluída, execute `/opsx:review` e verifique cada item do checklist. Não marque uma tarefa como feita se o checklist tiver itens pendentes.
