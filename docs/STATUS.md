# STATUS — Bononi Compras

> Atualizado: 2026-08-29

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
Telas: **Compras** (ex-"Alertas e Reposição": semáforo agora com 6 situações — Ruptura/Crítico/Baixo/OK/⚫Estoque Morto/⚪Sem Giro —, ordenação por coluna, cabeçalho fixo, badge "🚚 a caminho", "📉 demanda reprimida", **filtro "🔴 Vai faltar (prazo do fornecedor)"** — ver abaixo), **Comprar Agora** (worklist por fornecedor — fora do menu, página viva no código), **Estoque Parado** (encalhe por capital parado), **Totais de Estoque** (incorporou KPIs+ranking de Fornecedores), **📋 Pedidos** (persistente: `comp_pedidos`+`comp_pedido_itens`, carrinho salva em localStorage), **🔄 Movimentações de Estoque** (ex-"Ajustes de Estoque" — conferência estilo relatório do ERP: entradas/saídas por categoria, período e empresa configuráveis, drill-down por produto, saldo Principal/Garantia/Consolidado), **Importação** (com histórico auditado via `comp_audit_log`).

### 🔴 Vai faltar (prazo do fornecedor) — filtro lead-aware DENTRO da Compras (29/08/2026)
> **30/08:** virou **filtro na própria tela Compras** (liga/desliga na barra de filtros), NÃO uma aba separada — Leo: "muita aba confunde o usuário". A aba `cmp-faltar` foi removida.

Liga/desliga que mostra só o que **não chega a tempo pelo prazo de entrega do fornecedor**, não um horizonte fixo. Régua: `(estoque + a caminho) ÷ consumo-dia < lead time do fornecedor` → não chega a tempo. **China/importado ≈ 100 dias**, auto-detectado do cadastro (`vw_fb_contatos.uf='EX'`). Com o filtro ON: ordena por urgência (déficit) e a **Qtd Sugerida usa o prazo real de cada fornecedor** (desliga o horizonte fixo do topo). Selo **🌏 Nd** nos importados fica visível sempre. Semáforo/KPIs seguem no recorte cheio (não são afetados pelo filtro).
- **Lead time:** o do ERP é inerte (~15d p/ tudo), então criamos `comp_fornecedor_lead` (id_fornecedor, origem NACIONAL/IMPORTADO, lead_time_dias, `manual`). **Auto-semeada** do cadastro: UF='EX' → IMPORTADO 100d; resto → NACIONAL 15d. Comprador ajusta/força depois (override manual não é sobrescrito). Semeado: 11 importados + 1132 nacionais.
- **Lead por produto** (`comp_produto_lead`): usa o fornecedor **principal** se marcado (⭐); senão o **fornecedor de quem mais se compra** aquele produto (histórico 12m); senão menor lead; senão 15d. Assim China só "pesa" se é de lá que se compra de fato.
- **Worklist** (`comp_vai_faltar`): produto c/ giro, não fora-de-linha, cob_efetiva < lead. Hoje: 465 total → **132 fundamentais** (333 esporádicos), 6 China, ~R$353k sugeridos.

Regras que o Leo fixou:
- **Cobertura/semáforo = FÍSICOS** (não consolidar estoque+comprado). `qtd_sugerida` subtrai pedido aberto e usa horizonte **configurável** no topo (`consumo/dia × dias − estoque − pedido_aberto`; abre em 45d).
- **ABC exibida por `curva_abc_valor`** (o `curva_abc_qtd` cru do ERP mente).
- **Export do pedido = .xls layout ERP:** coluna A = código do produto (texto, zeros à esquerda), coluna B = qtd, sem cabeçalho.
- **Estoque negativo (erro de contagem) exibe "0 !"** em vez do número negativo, com tooltip explicando — nunca mostrar o negativo cru pro comprador.
- **Fornecedor principal é marcação manual** (⭐ na aba Fornecedores do drawer, `comp_fornecedor_principal`) — sem marcação, cai no 1º fornecedor externo.
- **Equipe de Compras não é técnica** — toda tela precisa ser auto-explicativa (tooltip em tudo, sem jargão). Ver memória `compras-ux-equipe-simples`.
- **"Quem comprou" (cliente) não é útil** pro comprador — decidido não construir. Sugestão trata ABC/curva "tudo igual" (sem regra diferente pra peça cara).

## Pendências / próximos passos
- [x] **Re-split do "Sem movimento"** — feito 20/08/2026: virou `ESTOQUE_MORTO` (sem saída 90d e saldo reconstruído > 0 o período todo — tinha pra vender e não vendeu) × `SEM_GIRO` (sem saída 90d, mas ficou sem estoque em algum momento — sem evidência de perda de venda). "Erro de contagem" descartado como bucket (decisão do Leo). Reconstrução de saldo histórico via `vw_fb_mov_estoque` (só existe a partir de 02/09/2025 — não dá pra ir muito além de ~90d pra trás). Ver `sql/comp_produtos_consolidado__split_sem_movimento.sql`.
- [x] **Fan-out do ERP RESOLVIDO na origem (verificado 29/08).** As `vw_fb_*` e as faturadas viraram **tabelas materializadas pelo replicador**, já dedupadas: `vw_fb_historico_compras` 16.923 linhas = 16.923 distintas (por `id_item_compra`); `vw_comercial_itens_faturados` 37.437 = 37.437 (por `id_doc,id_item`); `vw_os_pecas_faturadas` 44.655 = 44.655 (por `id_os,id_item`). A camada defensiva `comp_*_limpo` (DISTINCT) virou redundante — dá pra confiar nas fontes. **Faturamento vivo agora vai até jul/2025** (comercial) e nov/2025 (O.S.) → a planilha manual `comp_historico_m2` (nov/24–out/25) é ponte legada quase vencida; migrar consumo p/ datas reais destrava o fix de stockout.
- [ ] **Ranking de Fornecedores** (tela Totais) ainda lê `vw_fb_historico_compras` cru via `comp_lead_time_forn` — repontar pra `comp_compras_hist_limpo` (mesmo conserto já aplicado no resto do app).
- [ ] **Cotação/RFQ entre Sugestão e Pedido** — decidido construir no **ERP** (não aqui): fornecedor sai da sugestão, cota antes de virar pedido. Backend já existe; front feito, aguardando deploy. Ver memória `erp-compras-cotacao-fluxo`.
- [ ] **Pedido Fase 2:** finalizar (trava) + imprimir + anexar arquivo.
- [ ] **Fix stockout de verdade:** consumo por dias **com** estoque (reconstruir de `vw_fb_mov_estoque`) — hoje a média de calendário subestima quem rompeu.
- [ ] **Lead time real / estoque de segurança** — SQL pronta (`sql/comp_produtos_consolidado__lead_time_e_demanda_efetiva.sql`) mas **não aplicada**: a base de lead ainda é inerte (~15d p/ quase tudo), moveria 0 itens. Depende da TI melhorar a base.

## Dívidas e armadilhas conhecidas
- **🚨 Fan-out nas views do ERP (Firebird replicado) — a armadilha mais cara já encontrada.** Várias views (`vw_comercial_itens_faturados`, `vw_os_pecas_faturadas`, `vw_fb_historico_compras`, `vw_fb_pedidos_compra`, `vw_fb_produtos_compras`) já multiplicaram linhas por JOIN, de forma **não-determinística** (fator mudou 3×→4×→5×→8× no mesmo dia). Chegou a inflar a sugestão de compra em ~3× (consumo) e a subestimar em 5× o estoque, ao mesmo tempo — os dois erros se mascaravam. **Toda leitura nova dessas views precisa deduplicar** pela chave de linha real (nunca o `id` sequencial — ex.: `id_item`, `id_item_pedido`, `(id_produto,id_empresa)`). Use as views `comp_*_limpo` já existentes; não leia as `vw_fb_*`/`vw_*` cruas direto no frontend sem checar fan-out antes. Detalhe completo: `CONTEXTO-TECNICO.md` §9/§10 e `CHANGELOG.md` (17/08/2026).
- **CSS de shell antigo injetado** por `compras.js` (linha ~8) por cima do `index.html` atual → regras conflitantes, raiz de bugs de layout. Limpar **gradual** (não refazer o monolito de uma vez).
- **Cache-bust só no js, não no index:** aba aberta durante deploy roda shell velho + js novo → tela em branco ("Comprar Agora não aparece"). Corrige com **Ctrl+Shift+R**. Considerar versionar o index.
- **Falsos fornecedores** no ranking (notas de retorno / empresas do grupo). Existe `IDS_INTERGRUPO_FORN`; falta levantar os ids dos falsos.
- Monolito grande — quebra gradual ao mexer.

## Dev-log
- 2026-08-30 — **"Vai Faltar" virou FILTRO na tela Compras** (removida a aba separada — "muita aba confunde"). Liga/desliga usa o lead real por produto (comp_produto_lead); selo 🌏 nos importados; Qtd Sugerida lead-aware no modo ON (commit fed2fda).
- 2026-08-29 — **Tela "🔴 Vai Faltar" (lead-aware)** + backend `comp_fornecedor_lead`/`comp_produto_lead`/`comp_vai_faltar` (commit e079e82). **Auditoria de fontes:** fan-out do ERP confirmado RESOLVIDO na origem (tabelas materializadas dedupadas); faturamento vivo alcança jul/2025 → planilha `comp_historico_m2` vira legado. Lead time da China (100d) auto do cadastro UF='EX'.
- 2026-08-20 — **Split Estoque Morto × Sem Giro** (view `comp_produtos_consolidado`, ver pendência acima). **"Ajustes de Estoque" virou "Movimentações de Estoque"** — tela de conferência que reproduz o relatório de movimentação do ERP (entradas/saídas por categoria, por empresa×produto, período configurável), lendo `comp_estoque_mov` (view nova, sem fan-out, sem dupla contagem — Venda/O.S. só de `vw_fb_saidas_estoque`) + `vw_fb_estoque_centro` (saldo atual, tabela Principal/Garantia/Consolidado). Modelagem de dados de outra sessão (cérebro/dashboards); front construído aqui. `categorizeMotivo`/`vw_fb_mov_estoque` filtrado por `motivo` texto-livre **saiu de uso nessa tela** (ficou só documentado como histórico em CONTEXTO-TECNICO.md §9).
- 2026-08-17 — 🚨 Fan-out do ERP inflando consumo (~3×), depois estoque e pedido (~5×) — descoberto e corrigido (views `comp_consumo_limpo`, `comp_saidas_limpo`, `comp_compras_hist_limpo`, `comp_pedidos_compra_limpo`; `comp_produtos_consolidado` recriada 2×). Sugestão do catálogo: R$377k (fanado) → R$264k (real). Nova carga do ERP corrigiu estoque/pedido na origem à tarde; saída/OS continua fanando. Junto: filtro de status por checkbox c/ tooltip, gráfico "vendas por mês comparando anos" (sazonalidade), tabela de giro em 2 linhas, fornecedor principal marcável (⭐), código do fornecedor visível, botão cancelar pedido, histórico sem duplicar, "Ajustes de Estoque" focado em Balanço.
- 2026-08-07 — Ajustes finos (commit 37baedc): drawer com fornecedor sugerido no topo + bloco de pedido aberto (`vw_fb_pedidos_compra`), carrinho recolhido, salvar tira do carrinho. Export .xls padronizado.
- 2026-08-06 — Pedido persistente Fase 1 (`comp_pedidos`), auditoria da Importação (`comp_audit_log`), Fornecedores recriado company-safe e incorporado em Totais (commit 7371cca / 0df2132).
- 2026-07-28 — Tela "Estoque Parado" (commit 338dace); hambúrguer tablet corrigido; todos os P0 concluídos.
- 2026-07-26/27 — Clone virou real; SQL 365d/esporádico aplicada; ABC por valor; badge "a caminho".
