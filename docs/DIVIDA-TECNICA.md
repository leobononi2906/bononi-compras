# Dívida Técnica & Backlog — Bononi Compras

Consolidado em 26/07/2026 a partir de um mapeamento completo do `compras.js`.
Prioridades: 🔴 alta · 🟠 média · 🟡 baixa.

---

## 0. Atualização 06/08/2026 (reunião de melhorias)

### ✅ Corrigido
- **Paginação do Alertas/Compras invisível** — `renderPaginacao` usava `querySelector('.table-card')` (primeira do documento, não a certa). Agora container fixo `#alertas-paginacao` no HTML + fallback com escopo `#page-cmp-alertas`.
- **Card do semáforo não desmarcava** — estado virou fonte única + `sincronizarSemaforo` no render.
- **Contador dos KPIs ignorava filtros** — passou a usar `baseFiltradaAlertas` (mesmo recorte da tabela).
- **Fornecedores contava operação sem financeiro** — `comp_lead_time_forn` somava toda linha de `vw_fb_historico_compras` (remessa/retorno/conserto/devolução/inventário/estoque inicial/transferência), inflando R$120mi→R$10,9mi. View recriada com whitelist de tipos de compra (aplicada em produção). Intergrupo filtrado no front (`IDS_INTERGRUPO_FORN`) → 355 fornec. · R$4,76mi.
- **`fmtData` quebrava com timestamp** ("Invalid Date" na data do pedido) — agora aceita `YYYY-MM-DD` e ISO; novo `fmtDataHora`.

### ✅ Feito nesta rodada (frontend)
- **Aba "Fornecedores" incorporada em "Totais de Estoque"** — nav lateral removida; KPIs+ranking+top-10 movidos p/ a página de Totais (`loadTotais` chama `loadFornecedores`); `cmp-fornecedores` reduzida ao drawer no DOM.
- **Carrinho de pedido persiste** em `localStorage` (sobrevive a refresh/fechar navegador) + aviso `beforeunload` + rótulo "não salvo". Pedido mostra data/hora de criação/edição. Colunas Pedir↔Fornecedor trocadas. Drawer: mini-tabela horizontal, card fornecedor estreito, largura 680px.

### 🟠 Backlog novo (pendente de go)
| Item | Contexto |
|---|---|
| **Pedido de Compra — Fase 2** | Falta finalizar (travar edição) + imprimir (layout limpo) + vincular o `.txt` ao pedido finalizado. Fase 1 (salvar/listar/editar rascunho) já em produção (`comp_pedidos`/`comp_pedido_itens`) |
| **Fix stockout de verdade** | A média por dia de calendário pune item que ficou zerado. Solução correta: consumo por **dias COM estoque** (reconstruir de `vw_fb_mov_estoque`). Hoje só sinalizamos com o flag "demanda reprimida" |
| **Lead time inerte** | SQL "cobertura < lead (piso 15, fornecedor principal)" pronta mas não aplicada — move 0 itens (base de lead ~15d p/ quase tudo). Reaplicar quando a base de lead melhorar. Arquivo `sql/comp_produtos_consolidado__lead_time_e_demanda_efetiva.sql` |
| **Auditoria da Importação só daqui pra frente** | `comp_audit_log` passou a registrar lançamentos de valor; lançamentos antigos não têm histórico |

---

## 1. Layout / CSS — a raiz de vários problemas

**Diagnóstico central:** o `compras.js` injeta, na linha 8, um bloco **inteiro** de CSS que foi escrito para um **shell antigo** (app single-file). Esse CSS foi colado no `index.html` atual, que já tem o seu próprio layout (flex, sidebar 228px). Resultado: regras duplicadas e conflitantes. Como o CSS do `compras.js` é anexado **depois**, ele vence o do `index.html` em empates de especificidade.

### ✅ Corrigido em 26/07/2026 — Drawer "aparecendo na lateral"
- **Causa:** `#imp-drawer` e `#forn-drawer` têm `width:720px` inline (compras.js:170 e :180), mas a regra `.drawer` fechada usava `right:-680px` → **vazavam 40px** para dentro da tela. Como não estão em `FIXED_IDS`, vivem em `#compras-pages` e apareciam em **todas** as páginas; o remendo `DRAWER_ZINDEX_FIX` ainda os colocava por cima de tudo (`z-index:9999`). O `#produto-drawer` escapava por coincidência (680 = 680).
- **Correção:** trocado o esconderijo de `right:-680px` para `transform: translateX(100%)` (+ `max-width:95vw`). Agora qualquer drawer some 100% fora da tela, independente da largura. Mudança de 1 regra CSS.

### 🟠 Pendentes (mesma raiz — não mexidos ainda)
| Item | Onde | Efeito |
|---|---|---|
| **Hambúrguer some entre 768–900px** | media query injetada usa breakpoint 768; o shell usa 900. Entre 769–900 a sidebar já é off-canvas mas o botão `☰` some | Em tablet, o usuário **não consegue abrir o menu**. É provavelmente parte da "dificuldade" da equipe |
| Carrinho desalinhado 12px | `.cart-panel { left:240px }` injetado vs sidebar real de 228px | Barra do carrinho sai do lugar |
| Regras órfãs/mortas | `.main{left:240px}`, `.content`, `.sidebar.open{left:0}` no CSS injetado | Não fazem efeito, mas confundem quem lê o código |
| `z-index` do drawer fechado | remendo aplica `9999` a `#imp-drawer.drawer` mesmo fechado | Inofensivo após a correção do drawer, mas convém restringir a `.open` |

> **Recomendação de fundo:** remover cirurgicamente do CSS injetado (compras.js:8) as regras de *layout do shell antigo* (`.main`, `.cart-panel left:240`, a `.drawer` duplicada — já feito em parte, `.menu-toggle`+media 768), mantendo as regras de *componente* que o `index.html` não define (chat, drawer-tabs, semáforo, toggles). **Quebra gradual**, um pedaço por vez, só quando já estivermos ali por outro motivo.

---

## 2. Robustez (padrão Bononi: try/catch + error/empty/loading state em toda `load*`)

| Função | Falta |
|---|---|
| `loadTotais` (1274) | 🟠 Sem error state na UI (só `console.error`); sem empty state — KPIs ficam "—" em silêncio |
| `loadFornecedores` (1368) | 🟠 Sem error state; **sem empty state** → a linha "Carregando..." fica presa se falhar/vier vazio |
| `loadImportacao` (2002) | 🟠 Sem error state global na UI |
| `loadAll` (350) | 🟠 `sb.from('comp_ignorados')` sem try/catch |
| `loadConfiguracoes` (3230) | 🟠 `await sb.from(...)` sem try/catch → lança se falhar |

**Padrão-ouro no próprio arquivo:** `loadBalanco` (1522) e `loadAlertas` (384) — copiar a estrutura deles (try/catch + skeleton + error state + empty state).

**Exports:** ✅ todos os ~110 handlers `onclick` inline estão exportados em `window.*`. Observação: os exports estão **triplicados** (3442-3539, 3587, 3591-3611) — dá para consolidar num bloco só, sem pressa.

---

## 3. Simplificação de UX ("excesso de informação") — a pedido da equipe

Telas ordenadas da mais densa para a mais leve. **Isto é backlog para decidir com o Leo/equipe**, não mexer sozinho.

### 🔴 `cmp-alertas` — a mais sobrecarregada (alvo nº 1)
- **7 KPIs de uma vez** (4 semáforo-cards + 3 cards de pedido).
- **~5 filtros na mesma barra**, com a **situação duplicada** (os 4 cartões clicáveis do semáforo **e** um `<select>` de situação fazem a mesma coisa).
- **Tabela de 11 colunas** + 4 botões de ordenação + ordenação por clique em 7 cabeçalhos.
- Drawer com 5 abas; a aba Resumo tem **8 mini-cards**.
- **Ideias de simplificação:** remover o `<select>` de situação (redundante com o semáforo); esconder colunas secundárias atrás de um "ver mais"/densidade; reduzir a aba Resumo aos 3-4 números que a equipe realmente usa.

### 🟠 `cmp-importacao`
- 4 KPIs + **3 modos de visualização** (Kanban / Lista / Produtos) para a mesma informação; Lista com tabela de 10 colunas.
- **Ideia:** definir 1 visão padrão (provavelmente Kanban) e tratar Lista/Produtos como avançado.

### 🟡 `cmp-fornecedores`, `cmp-config`
- Densidade média-alta, aceitável. Ranking mostra 50 linhas; Logs tem 3 filtros.

> **Antes de redesenhar:** confirmar com a equipe **o que** confunde (coluna demais? filtro demais? termo técnico?). A hipótese mais forte pelos números é **cmp-alertas** (redundância situação + 11 colunas) e o **hambúrguer sumido no tablet** (item 1).

---

## 4. Pendências de negócio (herdadas)

| Item | Prio | Observação |
|---|---|---|
| Lead time real | 🔴 | Firebird não vincula pedido↔NF; `lead_time_dias` sempre 0. Pedir à TI incluir `id_pedido` na `vw_fb_historico_compras` |
| CMV congelado no financeiro | 🔴 | `comp_custo_snapshot_mensal` já populado; financeiro deve consumir por competência |
| Balanço — filtro de empresa no modal | 🟠 | Vinha vazio (dependia de `alertasConsolidado`); carregar empresas direto do banco ao abrir o modal |
| Balanço — tag de estoque na impressão | 🟠 | Badge de saldo/"sem estoque" no relatório |
| Balanço — mobile na contagem | 🟠 | Tela de contagem adaptada para toque |
| Balanço — localização do produto | 🟡 | Exibir `localizacao` na contagem |
| `app_logs` → `comp_logs` | 🟡 | Migrar para o padrão de prefixo do módulo |

---

## 5. Sugestão de ordem de ataque

1. ✅ Drawer na lateral — **feito**.
2. Hambúrguer no tablet (768–900px) — pequeno, alto impacto na "dificuldade" da equipe.
3. Simplificar `cmp-alertas` (tirar situação duplicada é o ganho mais barato).
4. Error/empty states faltantes (`loadFornecedores`, `loadTotais`, `loadImportacao`).
5. Limpeza gradual do CSS órfão do shell antigo.
