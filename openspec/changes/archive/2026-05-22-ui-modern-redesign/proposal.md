## Why

A interface atual do aplicativo utiliza o tema padrão do shadcn/ui sem identidade visual própria, resultando em uma experiência genérica e pouco atrativa. Esta mudança introduz um design system coeso com cor primária `#e367e3`, tipografia Inter e suporte a modo claro/escuro, elevando a qualidade percebida do produto.

## What Changes

- Substituir os tokens de cor do CSS pelo novo design system com `#e367e3` como cor primária
- Importar e aplicar a fonte Inter em toda a aplicação
- Criar componente `ThemeToggle` para alternar entre modo claro e escuro
- Criar componente `Checkbox` customizado com animações (fill + scale)
- Adicionar animações de entrada/saída nos itens da lista de tarefas
- Redesenhar `LoginPage` e `RegisterPage` com layout clean e acentuação na cor primária
- Redesenhar `TodosPage` com header contendo toggle de tema, email do usuário e botão de logout
- Atualizar `TodoFilters` para usar pills com estado ativo na cor primária
- Atualizar `TodoItem` com checkbox customizado, hover com deslocamento sutil e ações acessíveis
- Atualizar `CreateTodoForm` com layout integrado ao estilo visual

## Capabilities

### New Capabilities

- `ui-theme`: Sistema de tokens de cor (light/dark), tipografia Inter e componente ThemeToggle com persistência via localStorage

### Modified Capabilities

- `auth`: As telas de login e registro ganham novo layout visual — sem alteração nos requisitos funcionais de autenticação
- `todo-management`: A listagem, criação, edição e exclusão de tarefas ganham novo layout visual — sem alteração nos requisitos de negócio

## Impact

- **Frontend**: Todos os componentes visuais são afetados; nenhuma alteração de API ou contrato de dados
- **Dependências**: Adição de `framer-motion` para animações de lista
- **Sem impacto**: Backend, autenticação JWT, estrutura de rotas, lógica de negócio
