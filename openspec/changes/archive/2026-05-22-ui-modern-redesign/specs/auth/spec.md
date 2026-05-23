## MODIFIED Requirements

### Requirement: Frontend exibe tela de login

O sistema SHALL exibir uma tela de login centralizada com layout clean quando o usuário não estiver autenticado. A tela SHALL incluir o logotipo "✦ Todo", subtítulo descritivo, formulário com campos de email e senha, botão de ação na cor primária `#e367e3`, link para registro e controle de alternância de tema.

#### Scenario: Acesso a rota protegida sem autenticação

- **WHEN** o usuário acessa uma URL protegida sem estar autenticado
- **THEN** o sistema SHALL redirecionar para `/login` automaticamente

#### Scenario: Login bem-sucedido no frontend

- **WHEN** o usuário preenche email e senha válidos e submete o formulário de login
- **THEN** o sistema SHALL armazenar o token em `localStorage`, atualizar o estado de autenticação e redirecionar para `/`

#### Scenario: Credenciais inválidas no frontend

- **WHEN** o usuário submete o formulário de login com credenciais incorretas
- **THEN** o sistema SHALL exibir uma mensagem de erro visível sem redirecionar

#### Scenario: Layout visual da tela de login

- **WHEN** o usuário acessa a tela de login
- **THEN** a tela SHALL exibir o logotipo "✦ Todo", card centralizado com campos de email e senha, botão "Entrar" com fundo `#e367e3` e controle de tema no canto da tela

---

### Requirement: Frontend exibe tela de registro

O sistema SHALL exibir uma tela de registro com o mesmo padrão visual da tela de login, incluindo o logotipo "✦ Todo", formulário com campos de email, senha e confirmação de senha, botão de ação na cor primária `#e367e3` e link para login.

#### Scenario: Registro bem-sucedido no frontend

- **WHEN** o usuário preenche email, senha e confirmação de senha válidos e submete o formulário de registro
- **THEN** o sistema SHALL criar a conta, armazenar o token e redirecionar para `/`

#### Scenario: Senhas não coincidem

- **WHEN** o usuário preenche senha e confirmação de senha com valores diferentes
- **THEN** o sistema SHALL exibir erro de validação antes de submeter ao backend

#### Scenario: Email já em uso

- **WHEN** o usuário tenta registrar com um email já cadastrado
- **THEN** o sistema SHALL exibir uma mensagem de erro clara informando que o email já está em uso

#### Scenario: Layout visual da tela de registro

- **WHEN** o usuário acessa a tela de registro
- **THEN** a tela SHALL exibir o logotipo "✦ Todo", card centralizado com campos de email, senha e confirmação, botão "Criar conta" com fundo `#e367e3` e controle de tema no canto da tela
