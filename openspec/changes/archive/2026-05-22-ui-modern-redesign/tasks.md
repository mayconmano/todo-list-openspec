## 1. Dependências e Configuração Base

- [x] 1.1 Instalar `framer-motion` no `apps/frontend` (`npm install framer-motion`)
- [x] 1.2 Adicionar import da fonte Inter via Google Fonts no `apps/frontend/index.html` (tag `<link>` no `<head>`)
- [x] 1.3 Adicionar script anti-FOUC no `<head>` do `index.html` para aplicar classe `dark` antes do React montar

## 2. Design System — Tokens de Cor e Tipografia

- [x] 2.1 Atualizar `apps/frontend/src/index.css`: definir tokens `:root` com `#e367e3` como `--primary` (HSL `300 73% 65%`) e paleta light mode completa
- [x] 2.2 Atualizar `apps/frontend/src/index.css`: definir tokens `.dark` com fundo `#0a0a0f`, superfície `#13131a`, bordas e cores de texto do dark mode
- [x] 2.3 Atualizar `apps/frontend/src/index.css`: aplicar `font-family: 'Inter', sans-serif` no `body`

## 3. Componente ThemeToggle

- [x] 3.1 Criar `apps/frontend/src/contexts/ThemeContext.tsx` com `ThemeProvider`, hook `useTheme` e lógica de persistência no `localStorage`
- [x] 3.2 Criar `apps/frontend/src/components/ui/ThemeToggle.tsx` com botão circular (ícone ☀/◑) e animação de rotação 180° na transição
- [x] 3.3 Envolver o app com `ThemeProvider` em `apps/frontend/src/main.tsx`

## 4. Componente Checkbox Customizado

- [x] 4.1 Criar `apps/frontend/src/components/ui/Checkbox.tsx` usando `motion.div` do framer-motion com animação de fill e scale ao marcar/desmarcar
- [x] 4.2 Estilizar Checkbox: idle com borda `#e8e8f0` (light) / `#1e1e2a` (dark), hover com borda `#e367e3`, checked com fundo `#e367e3` e ícone de check branco

## 5. Atualização dos Componentes shadcn/ui Base

- [x] 5.1 Atualizar `apps/frontend/src/components/ui/button.tsx`: ajustar variante `default` para usar `bg-primary` com hover `opacity-90` e transição de cor
- [x] 5.2 Atualizar `apps/frontend/src/components/ui/input.tsx`: ajustar `focus-visible:ring` para usar `--ring` da cor primária e `border-primary` no focus
- [x] 5.3 Atualizar `apps/frontend/src/components/ui/card.tsx`: ajustar borda para usar `border` sutil compatível com ambos os modos

## 6. Páginas de Autenticação

- [x] 6.1 Atualizar `apps/frontend/src/pages/LoginPage.tsx`: redesenhar layout com card centralizado, logotipo "✦ Todo", subtítulo em muted, link "Registre-se →" na cor primária e `ThemeToggle` flutuante no canto superior direito
- [x] 6.2 Atualizar `apps/frontend/src/pages/RegisterPage.tsx`: aplicar mesmo padrão visual da LoginPage com campo de confirmação de senha e botão "Criar conta"

## 7. Componente TodoFilters

- [x] 7.1 Atualizar `apps/frontend/src/components/todos/TodoFilters.tsx`: substituir estilo atual por pills com transição de cor — ativo: borda + texto + fundo sutil `#e367e3`; inativo: ghost com texto muted

## 8. Componente CreateTodoForm

- [x] 8.1 Atualizar `apps/frontend/src/components/todos/CreateTodoForm.tsx`: layout de linha com input e botão "+ Add" lado a lado, botão na cor primária

## 9. Componente TodoItem

- [x] 9.1 Atualizar `apps/frontend/src/components/todos/TodoItem.tsx`: substituir `<input type="checkbox">` nativo pelo componente `Checkbox` customizado
- [x] 9.2 Adicionar hover no item: `translateX(2px)` e fundo sutil com `transition-all duration-150`
- [x] 9.3 Substituir emojis ✏️/🗑️ por ícones SVG (lápis e lixeira) estilizados com `text-muted-foreground` e hover na cor primária

## 10. Componente TodoList com Animações

- [x] 10.1 Atualizar `apps/frontend/src/components/todos/TodoList.tsx`: envolver lista com `AnimatePresence` do framer-motion
- [x] 10.2 Envolver cada `TodoItem` com `motion.div` com `initial={{ opacity: 0, y: -8 }}`, `animate={{ opacity: 1, y: 0 }}` e `exit={{ opacity: 0, y: -8 }}`

## 11. Página TodosPage — Header

- [x] 11.1 Atualizar `apps/frontend/src/pages/TodosPage.tsx`: redesenhar header com logotipo "✦ Todo" à esquerda e grupo à direita com email do usuário (muted), `ThemeToggle` e botão "Sair" (variante outline)
- [x] 11.2 Adicionar linha divisória (`border-b`) abaixo do header

## 12. Validação Manual

- [x] 12.1 Verificar modo claro: login, registro e lista de tarefas com cor primária aplicada corretamente
- [x] 12.2 Verificar modo escuro: alternar tema e confirmar que todos os elementos respondem ao toggle sem FOUC
- [x] 12.3 Verificar animações: criar tarefa (slide-in), deletar tarefa (slide-out), marcar como concluída (checkbox animado)
- [x] 12.4 Verificar responsividade em tela estreita (mobile ~375px)
