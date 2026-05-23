# Capability: password-change

## Requirement: Usuário pode alterar sua senha na página Minha Conta

O sistema SHALL permitir que um usuário autenticado troque sua senha fornecendo a senha atual, a nova senha e a confirmação da nova senha. A troca SHALL ser realizada via `PATCH /users/me/password`. A senha atual SHALL ser verificada antes de qualquer alteração.

### Scenario: Troca de senha bem-sucedida

- **WHEN** um usuário autenticado faz `PATCH /users/me/password` com `{ "current_password": "senhaAtual", "new_password": "novaSenha123" }` e a senha atual está correta
- **THEN** o sistema SHALL retornar HTTP 200 com `{ message: "Senha atualizada" }` e a nova senha SHALL ser armazenada como hash bcrypt

### Scenario: Senha atual incorreta

- **WHEN** um usuário autenticado faz `PATCH /users/me/password` com `current_password` incorreto
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Senha atual incorreta" }`

### Scenario: Nova senha muito curta

- **WHEN** um usuário autenticado faz `PATCH /users/me/password` com `new_password` de menos de 8 caracteres
- **THEN** o sistema SHALL retornar HTTP 422 com `{ error: "Dados inválidos" }`

### Scenario: Campos obrigatórios ausentes

- **WHEN** `PATCH /users/me/password` é chamado sem `current_password` ou sem `new_password`
- **THEN** o sistema SHALL retornar HTTP 422 com `{ error: "Dados inválidos" }`

### Scenario: Requisição sem autenticação

- **WHEN** `PATCH /users/me/password` é chamado sem token JWT válido
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Não autorizado" }`

---

## Requirement: Formulário de troca de senha na página Minha Conta

A página `/minha-conta` SHALL exibir uma seção separada para troca de senha com três campos: senha atual, nova senha e confirmação da nova senha. O formulário SHALL validar que nova senha e confirmação coincidem antes de submeter ao backend.

### Scenario: Senhas novas não coincidem

- **WHEN** o usuário preenche "nova senha" e "confirmar nova senha" com valores diferentes e tenta salvar
- **THEN** o sistema SHALL exibir erro de validação no campo de confirmação sem fazer requisição ao backend

### Scenario: Troca bem-sucedida no frontend

- **WHEN** o usuário preenche os três campos corretamente e submete
- **THEN** o sistema SHALL exibir mensagem de sucesso e limpar os campos do formulário de senha

### Scenario: Senha atual incorreta no frontend

- **WHEN** o backend retorna HTTP 401 para `PATCH /users/me/password`
- **THEN** o sistema SHALL exibir mensagem de erro "Senha atual incorreta" no campo correspondente
