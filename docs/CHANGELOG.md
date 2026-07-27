# Changelog — Bononi Compras

Registro de mudanças, mais recente no topo. Datas em DD/MM/AAAA.

---

## 26/07/2026

### Adicionado — tela "🎯 Comprar Agora" (worklist priorizada)
- Nova tela (1º item do menu) no padrão de **gestão por exceção**: mostra **só o que precisa de decisão** (`qtd_sugerida > 0`, que já desconta estoque + pedido em aberto), **agrupado por fornecedor** com subtotal em R$, ordenado por urgência (situação → cobertura). Objetivo: substituir a agenda de papel da equipe.
- Como a sugestão já desconta pedido em aberto, **falso-alarme não aparece** (ex.: o CABO CAPO ref 000086, em ruptura mas com 1 já pedido, **não entra** na lista).
- Toggle "incluir itens esporádicos" (baixo giro). Clique na linha abre o produto.
- Construída seguindo a **skill bononi-padrao**: estados de loading/erro/vazio, null-safety (`Array.isArray`, `?? []`, `Number()||0`, `?.`), cores só por token, componentes do design system (card/table-card/badge), funções em `window.*`, e verificação final de integridade (`node --check` ok).
- ⚠️ Roda sobre os **números atuais da view** (meta de 45 dias fixa, sem estoque de segurança, demanda de calendário). Deixar os números corretos exige alterar a view `comp_produtos_consolidado` — **SQL a ser apresentado para aprovação** (regra: não altero banco sem OK).
- *Arquivos: compras.js (PAGINAS_HTML, CMP_PAGE_LOADERS, loadComprarAgora/renderComprarAgora), index.html (nav + rota).*

### Corrigido
- **Drawer "aparecendo na lateral".** O painel lateral (produto / importação / fornecedor) deixava um pedaço visível parado na direita, em todas as telas. Causa: os drawers de importação e fornecedor têm 720px de largura, mas a regra que os escondia usava um deslocamento de 680px → vazavam 40px. Trocado o método de esconder de `right:-680px` para `transform: translateX(100%)`, que esconde 100% fora da tela independente da largura. *(compras.js, CSS injetado — 1 regra)*

### Alterado — simplificação da tela de Alertas (1ª leva)
- **Situação deixou de estar duplicada.** Antes o filtro de situação existia em dois lugares: os cartões coloridos do semáforo (clicáveis) **e** um `<select>` "Todas as situações". Removido o `<select>`; a situação agora vive só no semáforo.
- **"Sem Movimento" virou o 5º cartão do semáforo** (⚪), então nenhum filtro foi perdido — todas as 5 situações ficam num lugar só, visual e consistente.
- **Corrigido comportamento:** antes, trocar de grupo/subgrupo **zerava** o filtro de situação (porque `onFilterChange` lia o select). Agora a situação escolhida **persiste** ao trocar outros filtros.
- **Foco na demanda (equipe não usa o "pedido/carrinho").** Removido o bloco "Pedido" do topo (cards "Itens no Pedido Atual" e "Valor Estimado" + botões Ver Pedido / Exportar). A tela ficou focada em *o que precisa comprar*. O código do carrinho continua no arquivo (dormente, fácil de restaurar) — só saiu da tela.
- **Tabela enxugada de 11 → 9 colunas:** removida a coluna "Grupo" (já há filtro de grupo/subgrupo) e a coluna "ABC" virou uma etiqueta discreta ao lado do nome do produto (não se perde a informação).
- **Ordenação unificada:** mantidos os botões de preset (Prioridade / Menor Cobertura / Curva ABC / Maior Sugestão) e removida a ordenação por clique nos cabeçalhos (eram duas formas de fazer a mesma coisa).
- *Arquivos: compras.js — template de `cmp-alertas`, `onFilterChange`, `filtrarSituacao`, `atualizarKPIs`, `renderAlertas`.*

### Documentação
- Criada a pasta `docs/` como base de conhecimento oficial, substituindo os contextos dispersos:
  - `GUIA-DE-USO.md` — guia da equipe, tela por tela.
  - `CONTEXTO-TECNICO.md` — arquitetura, tabelas, views, mapa do código.
  - `DIVIDA-TECNICA.md` — bugs, robustez, backlog de simplificação e pendências.
  - `README.md` — índice.
- Pasta local passou a ser um **clone real do GitHub** (antes só tinha um README de recado; código real estava desatualizado em cópias soltas).

### Pendente de publicação
- As mudanças acima estão no clone local, **aguardando revisão e OK do Leo** antes do push para produção. Sugerido: subir numa branch → testar no preview da Vercel → juntar na `main`.
