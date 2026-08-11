# STATUS — Bononi Compras

> Atualizado: 2026-08-11

## O que é
App de **reposição/compras** por gestão de exceção: dá pra equipe uma worklist priorizada (o que comprar, de quem, quanto) em cima do mesmo estoque/giro do ERP. Substitui a agenda em papel + o uso do ERP cru (dados mais pobres).

## Onde está
- **Clone real (git):** `C:\CLAUDE\Projetos GitHub\bononi-compras` (remote `leobononi2906/bononi-compras`, branch `main`). Virou clone real em 26/07/2026 (antes era README stub).
  ⚠️ Cópias soltas em `Documents/hub/compras` e `Downloads` estão **DESATUALIZADAS** — nunca editar lá.
- **Deploy:** https://bononi-compras.vercel.app · **push na `main` = produção** (equipe usa no dia a dia).
- **Supabase:** `vishxwdxqiygbxmtpfoy` (schema `public`, tabelas/views prefixo `comp_*`).
- **Código:** `index.html` + `compras.js` (monolito grande). Doc mestre: `docs/PLANO-DE-ACAO.md` (backlog P0/P1/P2).

## Stack
HTML/JS puro + Supabase. Sem build. `compras.js` tem cache-bust (`?v=Date.now()`); `index.html` **não** — ver armadilha abaixo.

## Estado atual (produção)
Telas: **Compras** (ex-"Alertas e Reposição": semáforo/cobertura físicos, ordenação por coluna, cabeçalho fixo, badge "🚚 a caminho", "📉 demanda reprimida"), **Comprar Agora** (worklist por fornecedor — fora do menu, página viva no código), **Estoque Parado** (encalhe por capital parado), **Totais de Estoque** (incorporou KPIs+ranking de Fornecedores), **📋 Pedidos** (persistente: `comp_pedidos`+`comp_pedido_itens`, carrinho salva em localStorage), **Importação** (com histórico auditado via `comp_audit_log`).

Regras que o Leo fixou:
- **Cobertura/semáforo = FÍSICOS** (não consolidar estoque+comprado). Só `qtd_sugerida` já subtrai pedido aberto (`consumo×45 − estoque − pedido_aberto`).
- **ABC exibida por `curva_abc_valor`** (o `curva_abc_qtd` cru do ERP mente).
- **Export do pedido = .xls layout ERP:** coluna A = código do produto (texto, zeros à esquerda), coluna B = qtd, sem cabeçalho.

## Pendências / próximos passos
- [ ] **Cotação/RFQ entre Sugestão e Pedido** — decidido construir no **ERP** (não aqui): fornecedor sai da sugestão, cota antes de virar pedido. Backend já existe; front feito, aguardando deploy. Ver memória `erp-compras-cotacao-fluxo`.
- [ ] **Pedido Fase 2:** finalizar (trava) + imprimir + anexar arquivo.
- [ ] **Fix stockout de verdade:** consumo por dias **com** estoque (reconstruir de `vw_fb_mov_estoque`) — hoje a média de calendário subestima quem rompeu.
- [ ] **Lead time real / estoque de segurança** — SQL pronta (`sql/comp_produtos_consolidado__lead_time_e_demanda_efetiva.sql`) mas **não aplicada**: a base de lead ainda é inerte (~15d p/ quase tudo), moveria 0 itens. Depende da TI melhorar a base.
- [ ] Simplificar UX (equipe acha "excesso de informação").

## Dívidas e armadilhas conhecidas
- **CSS de shell antigo injetado** por `compras.js` (linha ~8) por cima do `index.html` atual → regras conflitantes, raiz de bugs de layout. Limpar **gradual** (não refazer o monolito de uma vez).
- **Cache-bust só no js, não no index:** aba aberta durante deploy roda shell velho + js novo → tela em branco ("Comprar Agora não aparece"). Corrige com **Ctrl+Shift+R**. Considerar versionar o index.
- **Falsos fornecedores** no ranking (notas de retorno / empresas do grupo). Existe `IDS_INTERGRUPO_FORN`; falta levantar os ids dos falsos.
- Monolito grande — quebra gradual ao mexer.

## Dev-log
- 2026-08-07 — Ajustes finos (commit 37baedc): drawer com fornecedor sugerido no topo + bloco de pedido aberto (`vw_fb_pedidos_compra`), carrinho recolhido, salvar tira do carrinho. Export .xls padronizado.
- 2026-08-06 — Pedido persistente Fase 1 (`comp_pedidos`), auditoria da Importação (`comp_audit_log`), Fornecedores recriado company-safe e incorporado em Totais (commit 7371cca / 0df2132).
- 2026-07-28 — Tela "Estoque Parado" (commit 338dace); hambúrguer tablet corrigido; todos os P0 concluídos.
- 2026-07-26/27 — Clone virou real; SQL 365d/esporádico aplicada; ABC por valor; badge "a caminho".
