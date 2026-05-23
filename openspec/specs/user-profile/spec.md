# Capability: user-profile

## Requirement: Usuário possui campos de perfil estendidos

O sistema SHALL armazenar os seguintes campos adicionais por usuário: `name` (VARCHAR 255, NOT NULL), `birth_date` (DATE, nullable) e `avatar_url` (VARCHAR 500, nullable). O campo `name` SHALL ser obrigatório no momento do registro.

### Scenario: Usuários existentes recebem name via backfill

- **WHEN** a migration é aplicada em um banco com usuários existentes
- **THEN** cada usuário existente SHALL receber `name` definido como o prefixo do seu email (parte antes do `@`)

### Scenario: Novo usuário criado com name obrigatório

- **WHEN** `POST /auth/register` é chamado sem o campo `name`
- **THEN** o sistema SHALL retornar HTTP 422 com `{ error: "Dados inválidos" }`

---

## Requirement: Usuário pode atualizar seu perfil

O sistema SHALL permitir que um usuário autenticado atualize `name`, `birth_date` e `avatar_url` via `PATCH /users/me`. O campo `email` SHALL ser ignorado mesmo que enviado. Campos omitidos na requisição SHALL permanecer inalterados.

### Scenario: Atualização parcial com nome

- **WHEN** um usuário autenticado faz `PATCH /users/me` com `{ "name": "João Silva" }`
- **THEN** o sistema SHALL retornar HTTP 200 com o perfil atualizado contendo o novo `name` e os demais campos inalterados

### Scenario: Atualização com todos os campos de perfil

- **WHEN** um usuário autenticado faz `PATCH /users/me` com `{ "name": "Maria Souza", "birth_date": "1990-03-15", "avatar_url": "https://example.com/foto.jpg" }`
- **THEN** o sistema SHALL retornar HTTP 200 com todos os campos atualizados

### Scenario: Tentativa de alterar email ignorada

- **WHEN** um usuário autenticado faz `PATCH /users/me` com `{ "email": "novo@email.com", "name": "Novo Nome" }`
- **THEN** o sistema SHALL atualizar apenas `name` e ignorar `email`

### Scenario: Envio de name vazio

- **WHEN** um usuário autenticado faz `PATCH /users/me` com `{ "name": "" }`
- **THEN** o sistema SHALL retornar HTTP 422 com `{ error: "Dados inválidos" }`

### Scenario: Requisição sem autenticação

- **WHEN** `PATCH /users/me` é chamado sem token JWT válido
- **THEN** o sistema SHALL retornar HTTP 401 com `{ error: "Não autorizado" }`

---

## Requirement: Página Minha Conta exibe e permite editar perfil

A página `/minha-conta` SHALL exibir um formulário com os campos `name`, `birth_date` e `avatar_url` pré-preenchidos com os valores atuais. O campo `email` SHALL ser exibido como somente leitura. Ao salvar, o sistema SHALL enviar `PATCH /users/me` e atualizar o `AuthContext` com os novos dados.

### Scenario: Exibição dos dados atuais

- **WHEN** o usuário autenticado acessa `/minha-conta`
- **THEN** o formulário SHALL exibir os valores atuais de `name`, `birth_date`, `avatar_url` e o `email` em modo somente leitura

### Scenario: Salvar alterações com sucesso

- **WHEN** o usuário altera o nome para "Ana Lima" e clica em salvar
- **THEN** o sistema SHALL enviar `PATCH /users/me`, exibir mensagem de sucesso e atualizar o nome exibido em toda a interface (incluindo saudação na Home)

### Scenario: Validação de name vazio no frontend

- **WHEN** o usuário apaga o nome e tenta salvar
- **THEN** o sistema SHALL exibir erro de validação no campo antes de submeter ao backend

### Scenario: Preview do avatar

- **WHEN** o usuário digita ou cola uma URL em `avatar_url`
- **THEN** o sistema SHALL exibir uma pré-visualização da imagem em tempo real

### Scenario: URL de avatar inválida ou inacessível

- **WHEN** a URL do avatar não carrega uma imagem válida
- **THEN** o sistema SHALL exibir um avatar placeholder no lugar da imagem quebrada
