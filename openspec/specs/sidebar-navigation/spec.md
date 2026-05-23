# Capability: sidebar-navigation

## Requirement: Layout base com sidebar envolve todas as rotas autenticadas

O sistema SHALL exibir um componente `AppLayout` com sidebar e área de conteúdo principal para todas as rotas autenticadas. O `AppLayout` SHALL utilizar `<Outlet>` do React Router para renderizar a página ativa.

### Scenario: Acesso a rota autenticada exibe layout com sidebar

- **WHEN** o usuário autenticado acessa qualquer rota protegida (`/home`, `/tarefas`, `/minha-conta`)
- **THEN** o sistema SHALL exibir a sidebar à esquerda e o conteúdo da rota ativa à direita

### Scenario: Acesso a rota pública não exibe sidebar

- **WHEN** o usuário acessa `/login` ou `/register`
- **THEN** o sistema SHALL exibir a página sem a sidebar

---

## Requirement: Sidebar exibe itens de navegação

A sidebar SHALL conter os seguintes itens de navegação em ordem: Home, Tarefas, Minha Conta. Cada item SHALL possuir ícone e rótulo de texto. O item correspondente à rota ativa SHALL ter estilo visual destacado.

### Scenario: Item ativo destacado

- **WHEN** o usuário está na rota `/home`
- **THEN** o item "Home" SHALL exibir estado ativo (fundo e cor diferenciados) e os demais items SHALL permanecer sem destaque

### Scenario: Navegação por clique

- **WHEN** o usuário clica em "Tarefas" na sidebar
- **THEN** o sistema SHALL navegar para `/tarefas` sem recarregar a página

---

## Requirement: Sidebar pode ser colapsada para modo icon-only

O sistema SHALL permitir que o usuário collapse a sidebar para um modo reduzido que exibe apenas ícones (~60px de largura), ocultando os rótulos de texto. O estado SHALL ser persistido em `localStorage` sob a chave `sidebar_collapsed`.

### Scenario: Colapsar sidebar

- **WHEN** o usuário clica no botão de colapsar/expandir
- **THEN** a sidebar SHALL reduzir para ~60px exibindo apenas ícones, e o estado SHALL ser salvo em `localStorage`

### Scenario: Expandir sidebar colapsada

- **WHEN** a sidebar está no estado colapsado e o usuário clica no botão de expandir
- **THEN** a sidebar SHALL retornar à largura completa (~240px) exibindo ícones e rótulos

### Scenario: Estado preservado ao recarregar a página

- **WHEN** o usuário recarrega a página
- **THEN** a sidebar SHALL ser renderizada no estado (colapsado ou expandido) salvo em `localStorage`

---

## Requirement: Sidebar comporta-se como overlay em dispositivos móveis

Em viewport com largura inferior a 768px, a sidebar SHALL ficar oculta por padrão. Um botão hambúrguer SHALL ser exibido no topo do conteúdo para abrir a sidebar como overlay com backdrop semitransparente.

### Scenario: Sidebar oculta em mobile por padrão

- **WHEN** o usuário acessa o app em viewport < 768px
- **THEN** a sidebar SHALL estar oculta e o conteúdo SHALL ocupar a largura total

### Scenario: Abrir sidebar em mobile

- **WHEN** o usuário clica no botão hambúrguer em viewport < 768px
- **THEN** a sidebar SHALL deslizar sobre o conteúdo com backdrop semitransparente

### Scenario: Fechar sidebar mobile ao navegar

- **WHEN** o usuário clica em um item de navegação com a sidebar overlay aberta
- **THEN** a sidebar SHALL fechar automaticamente e a navegação SHALL ocorrer normalmente

---

## Requirement: Sidebar exibe ação de logout

A sidebar SHALL conter um botão ou link de "Sair" que encerra a sessão do usuário.

### Scenario: Logout pela sidebar

- **WHEN** o usuário clica em "Sair" na sidebar
- **THEN** o sistema SHALL remover o token do `localStorage`, limpar o estado de autenticação e redirecionar para `/login`
