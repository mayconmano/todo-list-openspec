### Requirement: Aplicação utiliza sistema de tokens de cor com cor primária #e367e3

O sistema SHALL aplicar um design system coeso em toda a interface, utilizando `#e367e3` como cor primária tanto no modo claro quanto no modo escuro. Os tokens de cor SHALL ser definidos como CSS custom properties compatíveis com shadcn/ui.

#### Scenario: Cor primária aplicada em botões de ação

- **WHEN** o usuário visualiza qualquer botão de ação principal na interface
- **THEN** o botão SHALL exibir fundo na cor `#e367e3` com texto branco e transição de cor ao hover

#### Scenario: Cor primária aplicada em elementos de foco

- **WHEN** o usuário foca um campo de input via teclado ou clique
- **THEN** o campo SHALL exibir borda e anel de foco na cor `#e367e3`

#### Scenario: Cor primária aplicada em filtros ativos

- **WHEN** o usuário seleciona um filtro na lista de tarefas
- **THEN** o filtro ativo SHALL exibir borda, texto e fundo sutil na cor `#e367e3`

---

### Requirement: Aplicação utiliza tipografia Inter

O sistema SHALL carregar e aplicar a fonte Inter em toda a interface. A fonte SHALL ser carregada via Google Fonts e aplicada como fonte padrão do `body`.

#### Scenario: Fonte Inter carregada corretamente

- **WHEN** o usuário acessa qualquer página da aplicação
- **THEN** todo o texto SHALL ser renderizado com a fonte Inter

---

### Requirement: Usuário pode alternar entre modo claro e escuro

O sistema SHALL oferecer um controle de alternância de tema (light/dark) acessível em todas as telas autenticadas e nas telas de autenticação. A preferência do usuário SHALL ser persistida no `localStorage` e restaurada ao recarregar a página.

#### Scenario: Alternância para modo escuro

- **WHEN** o usuário aciona o botão de tema estando no modo claro
- **THEN** o sistema SHALL aplicar o modo escuro imediatamente em toda a interface e persistir a preferência em `localStorage`

#### Scenario: Alternância para modo claro

- **WHEN** o usuário aciona o botão de tema estando no modo escuro
- **THEN** o sistema SHALL aplicar o modo claro imediatamente em toda a interface e persistir a preferência em `localStorage`

#### Scenario: Preferência restaurada ao recarregar

- **WHEN** o usuário recarrega a página após ter selecionado um tema
- **THEN** o sistema SHALL aplicar o tema previamente selecionado sem flash visual (FOUC)

#### Scenario: Preferência do sistema usada como padrão

- **WHEN** o usuário acessa a aplicação pela primeira vez sem preferência salva
- **THEN** o sistema SHALL aplicar o tema conforme a preferência do sistema operacional (`prefers-color-scheme`)
