## Context

O frontend usa shadcn/ui com o tema padrão (tons de azul/cinza), fonte do sistema e sem suporte a modo escuro. O resultado é uma interface funcional mas sem identidade visual. A proposta é introduzir um design system coeso centrado na cor `#e367e3` (magenta/fúcsia), tipografia Inter e alternância entre modo claro e escuro.

Stack atual do frontend: React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui (tokens via CSS custom properties em `index.css`).

## Goals / Non-Goals

**Goals:**
- Substituir tokens de cor do shadcn por novo design system com `#e367e3` como primary
- Adicionar fonte Inter via Google Fonts
- Implementar alternância light/dark com persistência em `localStorage`
- Criar `ThemeToggle` e `Checkbox` como novos componentes reutilizáveis
- Adicionar animações de lista (entrada/saída) via `framer-motion`
- Adicionar micro-interações CSS (hover, focus, transições de cor)
- Redesenhar todas as páginas existentes com o novo visual

**Non-Goals:**
- Nenhuma alteração no backend, API ou banco de dados
- Nenhuma alteração nas rotas ou lógica de autenticação
- Nenhuma nova funcionalidade de negócio
- Suporte a temas customizáveis pelo usuário além de light/dark

## Decisions

### 1. Tokens de cor via CSS custom properties (não via `tailwind.config.js`)

shadcn/ui já utiliza CSS custom properties em `index.css` para todos os tokens. Manter essa abordagem é o caminho natural — basta redefinir os valores de `:root` e `.dark`. Não é necessário alterar `tailwind.config.js`.

**Alternativa considerada**: definir cores diretamente no `tailwind.config.js`. Descartada por quebrar a integração com os componentes shadcn que leem as CSS vars.

**Token `--primary` para `#e367e3`**: Em HSL fica `300 73% 65%`. Dark mode usa o mesmo valor — a cor é vibrante o suficiente para funcionar nos dois modos.

### 2. `framer-motion` para animações de lista, CSS para micro-interações

Animações de entrada/saída de itens da lista (`AnimatePresence` + `motion.div`) exigem controle preciso do ciclo de vida do DOM, o que CSS puro não oferece. `framer-motion` resolve isso com `AnimatePresence`.

Micro-interações (hover, focus, transições de cor, escala do checkbox) são implementadas via `transition-*` do Tailwind — sem custo de bundle adicional.

**Alternativa considerada**: CSS `@keyframes` + `animation` para tudo. Descartada porque não há como animar saída de elementos do DOM sem JavaScript.

### 3. Persistência de tema via `localStorage` com fallback para `prefers-color-scheme`

Ordem de prioridade ao carregar o app:
1. Valor em `localStorage` (escolha explícita do usuário)
2. `window.matchMedia('(prefers-color-scheme: dark)')` (preferência do sistema)
3. Fallback: light

A classe `dark` é aplicada no elemento `<html>` via script inline no `index.html` antes do React renderizar, evitando flash de tema errado (FOUC).

**Alternativa considerada**: Context + state apenas. Descartada por causar FOUC no carregamento inicial.

### 4. `ThemeContext` simples com hook `useTheme`

Um contexto React leve com `theme` (estado) e `toggleTheme` (ação). Não é necessário Zustand para isso — o estado de tema é global mas simples. O hook `useTheme` encapsula o consumo do contexto.

### 5. Checkbox customizado em vez do shadcn `Checkbox`

O componente `Checkbox` do shadcn/ui usa Radix UI e tem animações limitadas. Para a animação de fill + scale desejada, é mais simples criar um componente React puro usando `motion.div` do framer-motion, com `checked` controlado pelo pai.

**Alternativa considerada**: Estilizar o `Checkbox` do Radix. Descartada pela dificuldade em controlar animações de fill no elemento nativo.

## Risks / Trade-offs

- **Bundle size do framer-motion** (~40KB gzipped) → Aceitável para o escopo do projeto; alternativa seria `@formkit/auto-animate` (~2KB) se o peso for problema futuro.
- **FOUC no tema** → Mitigado com script inline no `<head>` do `index.html` que aplica a classe `dark` antes do React montar.
- **Consistência visual** → Todos os 11 arquivos devem ser atualizados de forma coesa. Risco de inconsistência durante implementação parcial → mitigado pela ordem das tasks (tokens primeiro, componentes depois, páginas por último).
