## MODIFIED Requirements

### Requirement: Usuário pode se registrar com email e senha

O sistema SHALL permitir que um novo usuário crie uma conta fornecendo nome completo, email e senha. O email SHALL ser único no sistema e normalizado para letras minúsculas. A senha SHALL ser armazenada como hash bcrypt. O `name` SHALL ser obrigatório e armazenado na tabela `users`.

#### Scenario: Registro bem-sucedido

- **WHEN** uma requisição `POST /auth/register` é feita com `{ name, email, password }` válidos e o email não existe
- **THEN** o sistema SHALL retornar HTTP 201 com `{ token, user: { id, email, name, birth_date, avatar_url } }` onde `token` é um JWT válido com expiração de 1 dia

#### Scenario: Registro sem nome

- **WHEN** uma requisição `POST /auth/register` é feita sem o campo `name` ou com `name` vazio
- **THEN** o sistema SHALL retornar HTTP 422 com `{ error: "Dados inválidos" }`

#### Scenario: Email já cadastrado

- **WHEN** uma requisição `POST /auth/register` é feita com um email já existente
- **THEN** o sistema SHALL retornar HTTP 409 com `{ error: "Email já cadastrado" }`

#### Scenario: Email inválido

- **WHEN** uma requisição `POST /auth/register` é feita com email em formato inválido
- **THEN** o sistema SHALL retornar HTTP 422 com `{ error: "Dados inválidos" }`

#### Scenario: Senha ausente ou muito curta

- **WHEN** uma requisição `POST /auth/register` é feita sem senha ou com senha de menos de 8 caracteres
- **THEN** o sistema SHALL retornar HTTP 422 com `{ error: "Dados inválidos" }`

---

### Requirement: Usuário pode fazer login com email e senha

O sistema SHALL autenticar um usuário existente verificando o email e a senha fornecidos contra o hash armazenado.

#### Scenario: Login bem-sucedido

- **WHEN** uma requisição `POST /auth/login` é feita com email e senha corretos
- **THEN** o sistema SHALL retornar HTTP 200 com `{ token, user: { id, email, name, birth_date, avatar_url } }` onde `token` é um JWT válido com expiração de 1 dia

#### Scenario: Email não cadastrado

- **WHEN** uma requisição `POST /auth/login` é feita com email que não existe no sistema
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Credenciais inválidas" }` sem indicar se o problema é o email ou a senha

#### Scenario: Senha incorreta

- **WHEN** uma requisição `POST /auth/login` é feita com email existente e senha errada
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Credenciais inválidas" }` sem indicar se o problema é o email ou a senha

---

### Requirement: Usuário autenticado pode consultar seus dados

O sistema SHALL permitir que um usuário com token válido recupere seus dados completos de perfil.

#### Scenario: Token válido

- **WHEN** uma requisição `GET /auth/me` é feita com header `Authorization: Bearer <token>` válido
- **THEN** o sistema SHALL retornar HTTP 200 com `{ id, email, name, birth_date, avatar_url, created_at }` do usuário correspondente ao token

#### Scenario: Token ausente

- **WHEN** uma requisição `GET /auth/me` é feita sem header de autorização
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Não autorizado" }`

#### Scenario: Token inválido ou expirado

- **WHEN** uma requisição `GET /auth/me` é feita com token malformado ou expirado
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Não autorizado" }`

---

### Requirement: Frontend exibe tela de registro

O sistema SHALL exibir uma tela de registro com o mesmo padrão visual da tela de login, incluindo o logotipo "✦ Todo", formulário com campos de nome completo, email, senha e confirmação de senha, botão de ação na cor primária `#e367e3` e link para login.

#### Scenario: Registro bem-sucedido no frontend

- **WHEN** o usuário preenche nome, email, senha e confirmação de senha válidos e submete o formulário de registro
- **THEN** o sistema SHALL criar a conta, armazenar o token e redirecionar para `/home`

#### Scenario: Campo nome ausente no frontend

- **WHEN** o usuário deixa o campo "Nome completo" em branco e tenta submeter
- **THEN** o sistema SHALL exibir erro de validação no campo `name` sem submeter ao backend

#### Scenario: Senhas não coincidem

- **WHEN** o usuário preenche senha e confirmação de senha com valores diferentes
- **THEN** o sistema SHALL exibir erro de validação antes de submeter ao backend

#### Scenario: Email já em uso

- **WHEN** o usuário tenta registrar com um email já cadastrado
- **THEN** o sistema SHALL exibir uma mensagem de erro clara informando que o email já está em uso

#### Scenario: Layout visual da tela de registro

- **WHEN** o usuário acessa a tela de registro
- **THEN** a tela SHALL exibir o logotipo "✦ Todo", card centralizado com campos de nome, email, senha e confirmação, botão "Criar conta" com fundo `#e367e3` e controle de tema no canto da tela
