# Changelog — Bononi Compras

Registro de mudanças, mais recente no topo. Datas em DD/MM/AAAA.

---

## 17/08/2026 (2ª rodada) — estoque/pedido também estavam fanados (5×); status por checkbox; sazonalidade; fornecedor principal

Continuação da investigação do fan-out (ver seção abaixo). Depois de corrigir consumo/saída/compra, o Charles reportou que a **quantidade do pedido** também duplicava (print do app: pedido 2102 aparecendo 5×) — e junto o **estoque** também estava errado (print do ERP: `Estoque Produto` mostrando os mesmos campos repetidos).

**Achado — estoque estava 5× inflado no catálogo inteiro (o mais grave de todos):**
- `vw_fb_produtos_compras` devolvia **15 linhas** para um produto que só existe em **3 empresas** (5 cópias cada). Catálogo inteiro: view crua somava **3.544.005 un**, real (deduplicado por `produto+empresa`) = **708.801 un**.
- **Efeito perverso:** estoque inflado ⇒ o motor achava que tinha *mais* estoque do que existe ⇒ **sugeria comprar de menos** — o oposto do bug de consumo (que sugeria comprar demais). Os dois erros se mascaravam parcialmente.
- **Pedido de compra também 5×:** `vw_fb_pedidos_compra` devolvia 5 linhas por item de pedido (pedido 2102: real 100 un, view crua somava 500 un). Isso inflava o "pedido em aberto" e subtraía demais da sugestão.

**Views novas (produção):**
- `comp_pedidos_compra_limpo` — dedup por (`id_pedido`, `id_item_pedido`).
- `comp_produtos_consolidado` (recriada) — estoque agora deduplicado por `DISTINCT ON (id_produto, id_empresa)` antes de somar; pedido em aberto via `comp_pedidos_compra_limpo`.
- Frontend: aba Estoque do drawer deduplicada por (empresa, centro); todas as leituras de pedido apontam para a view limpa.

**Sugestão do catálogo — evolução conforme cada camada foi limpa (horizonte 45d):**
| Estado | Sugestão |
|---|--:|
| Tudo fanado (consumo 3× + estoque 5×) | ~R$ 377k |
| Só consumo limpo (estoque ainda 5×) | R$ 119k *(estoque fantasma segurava a compra)* |
| **Consumo + estoque + pedido limpos** | **R$ 264k** ✅ número real |

**Nova carga do ERP (mesmo dia, à tarde) corrigiu PARCIALMENTE na origem:** reconferimos e **estoque e pedido pararam de multiplicar** (fanado = limpo agora). Só a view de **saída/OS continua fanando** (piorou: 8× numa amostra). As views limpas do app permanecem — funcionam como blindagem permanente contra o fan-out voltar (já foi instável: 3×→4×→5×→8× em consultas seguidas do mesmo dia).

**UI — pedidos explícitos do Leo, entregues:**
- **Filtro de status por checkbox** (multi-seleção): Todos / 🔴 Ruptura / 🟠 Crítico / 🟡 Baixo / 🟢 OK / ⚪ Sem movimento — cada um com **tooltip explicando o critério** (equipe de Compras não é técnica, tudo precisa ser auto-explicativo). Unificado com os cards do semáforo (mesma fonte de estado, `filtroStatus`).
- **Horizonte "Comprar p/ X dias"** (já existia no topo) confirmado dinâmico: muda os dias → recalcula a Qtd Sugerida na hora (`sugeridaCalc`), sem precisar de F5.
- **Gráfico "Vendas por mês — comparando anos"** no drawer: barras por mês do ano, 1 cor por ano (nov/24→hoje, todo o histórico disponível), pra enxergar sazonalidade no olho. Hover mostra o número.
- **Tabela Saídas×Compras do drawer quebrada em 2 blocos de 6 meses** (empilhados) — não precisa mais rolar de lado.
- **Fornecedor principal marcável no app:** nova tabela `comp_fornecedor_principal` (id_produto, id_fornecedor, quem marcou). Na aba Fornecedores do drawer, clique na ⭐ ao lado do nome marca/desmarca (1 clique, com badge "PRINCIPAL"). Sem marcação → cai no 1º fornecedor externo (fallback). A tabela de Compras mostra o principal em 1º com ⭐; o pedido já usa o principal marcado ao incluir.
- **Código do fornecedor visível** junto do nome (filtro de fornecedor, chips, coluna da tabela, cabeçalho do card) — pedido do Charles: vários fornecedores com nome quase idêntico (ex. 4 "CONTINENTAL..." diferentes), o código é o que desambigua.
- Botão **🗑️ Cancelar** no carrinho (descarta o pedido em andamento sem salvar, com confirmação).

**Combinados/decisões do Leo (17/08):**
- "Quem comprou" (cliente) — **não vamos construir**, não é útil pro comprador.
- Peça cara/ABC — **tratar tudo igual** na sugestão (sem regra diferente por curva).
- Estoque negativo — mostrar **0 com "!"** em vez do número negativo (já implementado; tooltip explica que é erro de contagem herdado da migração).
- **Regra de ouro do projeto (guardada em memória):** equipe de Compras não é técnica → toda tela precisa ser **auto-explicativa e simples** (tooltip em tudo, sem jargão, erro de dado amigável).

**Pendente:**
- Re-split do "Sem movimento" (Estoque Parado × Morto × Erro de contagem) — **ficou pra conversar antes de construir**.
- TI: a view de saída/OS (`vw_os_pecas_faturadas` e a parte O.S. de `vw_comercial_itens_faturados`) **continua fanando na origem** — mandar reforçar o alerta, o fator só cresceu ao longo do dia.
- Ranking de Fornecedores (tela Totais) ainda lê `vw_fb_historico_compras` cru via `comp_lead_time_forn` — mesmo conserto, ainda não aplicado.

---

## 17/08/2026 — 🚨 Consumo/sugestão estava inflado ~3× (fan-out das views do ERP) — CORRIGIDO

**Descoberta (o Charles reportou dup na compra; investigando achamos algo bem maior):** as views de saída/compra do ERP fazem **fan-out de JOIN** — multiplicam linhas na consulta. Não é linha duplicada na tabela base (por isso "tirar duplicatas" na origem **não resolve**; é o JOIN da view). É **não-determinístico** (a mesma peça deu 8×, 3×, 4× em consultas seguidas).

**Impacto medido:** o consumo que alimenta a **sugestão de compra** vinha ~3× inflado. No catálogo: sugestão **antes R$ 376.992 / 18.036 un** → **depois R$ 118.824 / 5.823 un**. Ou seja, o sistema mandava comprar **~R$ 258 mil a mais** que a demanda real (mesmos itens, 3× a quantidade). Peça 016738: consumo/dia 0,40→**0,167**, saídas 12m 142→**66**, compras 12m 80→**40**.

**Chaves de dedup descobertas (a linha real):**
- `vw_os_pecas_faturadas` e `vw_comercial_itens_faturados`: dedup por **`id_item`** (o `id` é sequencial por linha de saída, NÃO deduplica). E a **O.S. sai do comercial** (já vem por os_pecas — senão conta 2×).
- `vw_fb_historico_compras`: dedup por **(`id_compra`, `id_item_compra`)**.

**Views novas/alteradas (produção):**
- `comp_consumo_limpo` (nova) — consumo deduplicado: M2 (histórico limpo, até out/25) + sistema nov/25+ deduplicado, O.S. só via os_pecas.
- `comp_produtos_consolidado` (alterada) — passou a ler `comp_consumo_limpo` no lugar de `vw_consumo_unificado`. **Frontend não mudou** (mesmas colunas). Motor de Alertas/sugestão.
- `comp_saidas_limpo` (nova) — saídas nível-linha deduplicadas, pro gráfico/cards do drawer.
- `comp_compras_hist_limpo` (nova) — `SELECT DISTINCT` de `vw_fb_historico_compras` por linha, pro drawer.

**Frontend:** `loadDrawerGiro` lê `comp_saidas_limpo` + `comp_compras_hist_limpo` (antes 3 views cruas, contava OS 2×). `loadDrawerHistorico` já tinha dedup em JS (commit anterior). Só precisa **F5**.

**De onde vem o "consumo" (pra o handoff):** saídas dos últimos 365/90 dias, costurando 2 épocas — **até out/25** vem da planilha mensal do ERP antigo (tabela `comp_historico_m2`, limpa) e **de nov/25 pra cá** vem ao vivo de *vendas faturadas* (`vw_comercial_itens_faturados`, loja/online/dist) + *peças de OS* (`vw_os_pecas_faturadas`). A inflação estava só na parte "ao vivo".

**Pendências:**
- **TI (origem):** corrigir o JOIN que multiplica em `vw_os_pecas_faturadas` e na parte O.S. da `vw_comercial_itens_faturados`, senão qualquer outro relatório que use elas direto continua inflado.
- **App:** o ranking de **Fornecedores** (Totais) usa `comp_lead_time_forn`, que soma `vw_fb_historico_compras` cru → provavelmente inflado; repontar pra `comp_compras_hist_limpo`.

---

## 16/08/2026 — Ajustes de Estoque abre focado em "Balanço" (o único ajuste financeiro real)

**Contexto (o PORQUÊ):** o Leo bateu o olho no painel e notou que o "líquido" de R$ 2,85 mi não fazia sentido como perda/ganho de estoque. Investigando os motivos reais (texto livre, muito sujo), descobrimos que a maioria dos "ajustes" **não representa perda/ganho financeiro** — é resíduo da **troca de RP** (migração) ou reclassificação.

**Decomposição dos ajustes (01/08/25 → 10/08/26, tipo `A`, sem venda/OS):**

| Categoria | Lçtos | Valor líq. | Gera financeiro? |
|---|--:|--:|:--:|
| Migração / estoque inicial | 37 | +R$ 3,83 mi | ❌ semeadura da migração |
| Transição de ERP | 34 | −R$ 0,35 mi | ❌ migração |
| Desmonte / kit / produção | 105 | +R$ 0,03 mi | ❌ transforma produto em peça (valor se conserva) |
| Transf. centro / garantia | 21 | +R$ 0,03 mi | ❌ muda de depósito |
| Correção cadastro / código invertido | 16 | −R$ 0,28 mi | ❌ entra ~2.238 / sai ~2.175 un, quase anula |
| Vínculo venda / OS / encomenda | 54 | +R$ 0,02 mi | ❌ financeiro é da venda/OS |
| Entrada de NF / compra | 19 | +R$ 0,01 mi | ❌ financeiro é a NF |
| **Balanço / contagem** | **64** | **−R$ 1,16 mi** | ✅ **perda/sobra real** |
| Acerto / ajuste real | 382 | −R$ 0,31 mi | ✅ acerto real |
| Outros / ilegível | 244 | +R$ 1,04 mi | ⚠️ garrancho (ex.: `AENKEAJ HSKAHG DKAL` = +R$ 784 mil, pela cara é estoque inicial) — **não dá pra classificar por regra** |

**Decisão do Leo:** seguir **só na parte de balanço**. A tela agora:
- **Abre já filtrada em "Balanço"** (`aj-motivo` default = `Balanço` em `loadAjustes`). O dropdown continua com todos os motivos pra investigar o resto.
- `categorizeMotivo` passou a classificar **"CONTAGEM"** como Balanço (além de `BALAN[CÇ]`).
- Texto de ajuda explica que migração/reclassificação/vínculo **não geram financeiro** e ficam de fora.

**Armadilha confirmada (não é bug):** um único lançamento de balanço pode ser gigante. Ex.: **GELADEIRA STONNI ST 30L (ref 011488)** teve **−1.141 un / −R$ 830 mil** numa só baixa (`AJUSTE REF.BALANCO DIA 30/05`, BONONI SC / EMP 8). É o balanço **acertando o estoque fantasma que a migração do RP deixou** — o sistema achava que tinha 1.141 geladeiras a mais do que existiam. O número é enorme porque a divergência era enorme. **Ver [CONTEXTO-TECNICO.md](CONTEXTO-TECNICO.md) §Armadilhas da tela de Ajustes.**

**Ainda pendente (TI):** o **% divergente correto** (contado ÷ saldo do sistema) exige replicar `TBL_BALANCO` + `TBL_ITENS_BALANCO` do Firebird (colunas `QTD_ANTIGA` × `QTD_CONTADA` × `QTD_LANCADA`). Hoje o ajuste só grava o item divergente, sem o denominador.

Commits: classificação/balanço default.

---

## 07/08/2026 — nova aba "Ajustes de Estoque"

- Nova tela **🩹 Ajustes de Estoque** (fonte `vw_fb_mov_estoque`, tipo `A`, sem vínculo de venda/OS): ~957 ajustes/12 meses.
- **KPIs**: valor que entrou / saiu / líquido, nº de ajustes e produtos.
- **Ranking de produtos ajustados** com **ordenação em todas as colunas** (Produto, Entrou, Saiu, Líquido, Nº) + toggle **Valor R$ / Quantidade**. Default = maior impacto no líquido. Cabeçalho fixo.
- **Por motivo** (categorizado: Balanço / Estoque inicial / Acerto / Código invertido / Transição de ERP / Outros) e **Por mês**.
- Filtros de **período, empresa e motivo**.
- **Pendências pra completar** (descobertas no schema Firebird `C:\CLAUDE\ERP FIREBIRD`): (1) **% divergente** exige replicar `TBL_BALANCO` + `TBL_ITENS_BALANCO` (têm `QTD_ANTIGA` × `QTD_CONTADA` × `QTD_LANCADA`); (2) **autor do ajuste** existe em `TBL_MOV_PROD.CHUSUARIO`, falta expor na view. Ambos dependem da TI.

---

## 07/08/2026 — ajustes finos (drawer, carrinho, pedidos, export .xls)

### Drawer do produto
- **Fornecedor sugerido** subiu para o **topo** do resumo e ficou **mais estreito** (`max-width:360px`).
- **Aba "Pedido" removida** do drawer.
- **Pedido de compra em aberto**: bloco novo com **nº do pedido · fornecedor · qtd · data · previsão** (fonte `vw_fb_pedidos_compra`, filtro `cancelado=N, gerou_nf=N, status=F` — mesmo do "a caminho").
- **Data da última compra** no card do fornecedor agora é a **daquele fornecedor** (consulta por produto+fornecedor), não a última compra global do produto.
- **Drawer alargado (680 → 820px)**: fornecedor e pedido em aberto ficam **lado a lado**; cards maiores; **Consumo/dia** ganhou a marca do período (**média 90 dias**); mais colunas visíveis no bloco Saídas × Compras.

### Tabela de Compras
- **Nome do produto ocupa a largura toda** (1ª linha); **código + etiquetas** (A / 📉) foram para a 2ª linha.
- **"Esporádico" removido** da tabela. *(definição: saída no ano ≤ 12 unidades — flag `esporadico` da view; segue disponível para o filtro do Comprar Agora.)*
- **Demanda reprimida** virou só o ícone **📉** (com tooltip) — não empurra mais o nome.

### Carrinho / Pedidos
- **"Pedido em Andamento" inicia recolhido** (só a barra do topo); expande ao clicar.
- Ao **Salvar**, o pedido **sai do carrinho** (fica guardado em Pedidos) e a lista recarrega.
- Aba **Pedidos**: "Abrir" abre um **drawer maior** (cabeçalho + itens) com **✏️ Continuar editando**; corrige o erro ao abrir outro pedido salvo (leitura não mexe no carrinho até confirmar).

### Export
- Download do pedido passou de `.txt` para **`.xls`** no layout do ERP: **sem cabeçalho, coluna A = código, coluna B = quantidade** (código preservado como texto p/ manter zeros à esquerda). Botão **"↓ .xls (ERP)"** no carrinho e no drawer do pedido; o CSV completo virou **"↓ Relatório"**.

---

## 06/08/2026 (2ª rodada) — Fornecedores real, drawer e persistência do carrinho

### Corrigido — Fornecedores só conta compra real; aba incorporada a "Totais de Estoque"
- **A aba não era real:** `comp_lead_time_forn` somava **toda** linha de `vw_fb_historico_compras` — remessa, retorno, conserto, devolução, inventário, estoque inicial e transferência entre unidades. Isso inflava o volume de **R$ 120 mi → R$ 10,9 mi** de compra real. View recriada com a whitelist de tipos de compra (mesma do drawer) — **aplicada em produção**.
- **Intergrupo fora do ranking** (Bononi/MLB e afins): filtrado no front por `IDS_INTERGRUPO_FORN`. Sobram **355 fornecedores externos · R$ 4,76 mi**.
- **A aba lateral "Fornecedores" saiu**; o conteúdo (KPIs + ranking clicável + top-10) foi **incorporado à página "Totais de Estoque"**. O drawer de detalhe do fornecedor continua (fica no DOM, aberto pela tabela em Totais).

### Adicionado — carrinho de pedido não se perde mais
- **Rascunho persiste em `localStorage`**: fechar/atualizar o navegador não perde o pedido — ele é **restaurado** ao reabrir (toast "Rascunho restaurado").
- **Aviso ao sair** (beforeunload) quando há pedido não salvo. Rótulo **"• não salvo"** (laranja) no rodapé do carrinho enquanto há alteração pendente; some ao salvar. **＋ Novo** pede confirmação se houver rascunho não salvo.

### Alterado — Pedidos e drawer
- **Data de criação** do pedido: lista agora mostra **data + hora** (e marca de última edição); ao editar, o rodapé do carrinho mostra `(criado dd/mm hh:mm)`. Corrigido `fmtData`, que quebrava com timestamp ("Invalid Date").
- **Colunas Pedir ↔ Fornecedor trocadas** na tabela de Compras (Pedir antes).
- **Drawer:** card "Fornecedor sugerido" mais estreito; mini-tabela mensal virou **horizontal** (meses nas colunas, linhas Saídas/Compras); drawer alargado 580 → **680px**.

---

## 06/08/2026 — reunião de melhorias na tela de Compras

### Adicionado — tela "📋 Pedidos de Compra" (persistência, Fase 1)
- **Pedido deixa de ser volátil.** O operador monta o carrinho e **Salva** (modal pede *empresa* — texto livre — e observação; o **responsável** vem sozinho do login). Fecha a página, não perde nada.
- Nova tela **Pedidos** no menu: lista todos com empresa, responsável, itens, valor, status (rascunho/finalizado) e data. **Abrir** recarrega os itens no carrinho para editar; **🗑** exclui rascunho. Salvar de novo num pedido aberto **atualiza** (não duplica). Rodapé do carrinho mostra "✏️ Editando pedido #X" e botão **＋ Novo**.
- **Banco (aplicado em produção):** tabelas `comp_pedidos` (empresa, criado_por, status, totais, datas) + `comp_pedido_itens` (produto, ref, qtd, preço, fornecedor, cascade). RLS off + grant anon/authenticated, padrão das demais `comp_`. Migration em `sql/comp_pedidos_fase1.sql`. **Falta Fase 2:** finalizar (travar) + imprimir + vincular o `.txt` ao finalizado.

### Adicionado — baixar pedido no layout de importação do ERP (.txt)
- Botão **"↓ .txt"** no carrinho gera uma linha por item `referencia;qtd` (a referência = "Código do Produto", ex.: `000003`), separador `;`, quantidade inteira — o layout que o ERP importa. O "↓ Excel" continua.

### Adicionado — pedido direto na linha (input + Incluir)
- Cada linha da tabela tem **campo de quantidade** (já vem com a sugestão) **+ botão Incluir** (Enter também inclui). Item já no pedido mostra **Atualizar / ✕**. Fim do "+ e pronto"; agora dá pra digitar a quantidade na hora.

### Adicionado — flag "📉 demanda reprimida"
- Etiqueta na lista (e aviso no drawer) para itens **zerados que venderam no último ano**, ou cujo ritmo de 365d supera bem o de 90d. Sinaliza que a **média recente está subestimada pela falta de estoque** — não confiar no número baixo. Pega ~1.133 itens. *(helper `demandaReprimida`, frontend, sem banco.)*

### Adicionado — bloco "Fornecedor sugerido" no drawer
- No Resumo, um bloco com **melhor fornecedor · preço · referência · data da última compra** + a **sugestão explicada** (`consumo/dia × 45 − estoque − a caminho = X`), para o comprador decidir de quem comprar sem trocar de aba.

### Adicionado — auditoria de valores na Importação
- Lançar/editar/excluir pagamento e quitar fornecedor passam a registrar **quem fez + data/hora + antes→depois** na tabela existente `comp_audit_log` (`modulo='importacao'`). O drawer de Importação ganhou um **`<details>` "🕓 Histórico de lançamentos"** acima da tabela de pagamentos, por processo. Registra daqui pra frente. Sem mudança de banco.

### Alterado — tela renomeada e navegação
- **"Alertas e Reposição" → "Compras"**. **"Comprar Agora" saiu do menu** (página mantida no código) para simplificar enquanto a equipe entende melhor o fluxo.

### Alterado — tabela: paginação, cabeçalho fixo e ordenação por coluna
- **Paginação corrigida** — o `renderPaginacao` fazia `querySelector('.table-card')` e pegava a **primeira** tabela do documento (não a de Compras), então os controles sumiam. Agora há container fixo próprio: ← Anterior / 1 2 3 … / Próxima →.
- **Cabeçalho fixo** (`sticky`) ao rolar a lista.
- **Ordenação clicando em cada coluna** (Produto, Estoque, Cobertura, Qtd Sugerida, Ped. Aberto, Situação, Fornecedor), com seta ↑/↓/↕. **Botões de cima removidos** (Prioridade/Menor Cobertura/Curva ABC/Maior Sugestão), redundantes com a ordenação nas colunas.

### Corrigido — card do semáforo que não desmarcava
- Clicar em Ruptura/Baixo filtrava, mas **não dava para desmarcar sem reiniciar**. Reescrito para o estado ser fonte única (`filtroSituacaoAtivo`) e o destaque sincronizar no render (`sincronizarSemaforo`).

### Corrigido — contador dos KPIs não batia com a tabela
- Os cards do semáforo contavam **todos** os produtos, ignorando o filtro de grupo/subgrupo/fornecedor/busca ativo (ex.: card OK=611 com a tabela mostrando 146 de AUTO ELETRICA). Agora os KPIs respeitam o **mesmo recorte** da tabela (helper `baseFiltradaAlertas`).

### Alterado — drawer: cobertura única (90d) e gráfico vira mini-tabela
- Removida a cobertura duplicada do topo do drawer; ficou só a **"Cobertura Estimada" com base 90 dias** (mesma fonte da lista).
- O gráfico de barras "Saídas vs Compras" (que a equipe não curtiu) virou uma **mini-tabela mensal** (Mês × Saídas × Compras + total) com números exatos.

### Nota técnica — o que NÃO mudou no backend (decisão da reunião)
- **Cobertura/semáforo continuam FÍSICOS.** Não consolidar estoque+comprado na cobertura; só a `qtd_sugerida` desconta o pedido em aberto (já era assim). A versão "demanda efetiva" foi descartada.
- **Lead time:** a régua "cobertura < lead time (piso 15d, fornecedor principal)" foi validada mas **move 0 itens hoje** (o `lead_time_medio` da base é ~15d para 3.429 de 3.455 produtos). SQL pronta e **não aplicada** em `sql/comp_produtos_consolidado__lead_time_e_demanda_efetiva.sql`, guardada para quando a base de lead melhorar.

## 28/07/2026

### Adicionado — tela "🧹 Estoque Parado" (worklist do que se livrar)
- Nova tela (espelho do Comprar Agora, mas do outro lado): lista o **estoque encalhado** — item **com estoque e sem giro** na janela escolhida — **priorizado por capital parado** (estoque × custo). Objetivo: liberar dinheiro preso em prateleira (devolução, liquidação, transferência entre empresas, baixa).
- **Ordenação por valor (R$ parado) ou por quantidade** (botões no topo). **Janela "sem venda há" configurável** na tela: **1 ano** (padrão) ou **90 dias** — usa `saida_365d`/`saida_90d` da view.
- **Desconsidera produtos ignorados** (Configurações). KPIs: capital parado, nº de itens, unidades encalhadas. Clique na linha abre o produto. Coluna de fornecedor (externo) para negociar devolução.
- Diagnóstico que motivou: ~R$ 3,16M em 3.468 SKUs parados (sem venda há 1+ ano com estoque); top 100 itens = 61% desse valor (dá pra atacar por worklist curta).
- *Arquivos: compras.js (PAGINAS_HTML, loader, loadEstoqueParado/renderEstoqueParado + helper `itemIgnorado`), index.html (nav + rota). `node --check` ok.*

### Alterado — Totais de Estoque desconsidera ignorados
- O Totais agora **exclui os produtos marcados como ignorados** (Configurações) dos números e gráficos, igual ao Alertas e ao Estoque Parado. *(compras.js — filtro `itemIgnorado` no `loadTotais`; de brinde, o fallback passou a trazer `subgrupo`.)*

## 28/07/2026 — parte da manhã

### Alterado — ABC por valor + etiqueta esporádico (P0.1 + P0.2)
- **View `comp_produtos_consolidado` (SQL aditivo aplicado em produção):** acrescentadas 3 colunas no fim — `saida_365d_total`, `consumo_diario_365d_total` e `esporadico` (flag de baixo giro: vende mas ≤12/ano). As 18 colunas antigas ficaram idênticas (não quebra nenhuma tela). *(migration `comp_produtos_consolidado_add_365d_esporadico`)*
- **Curva ABC agora é por VALOR, não por quantidade.** Alertas, gráfico de Totais e o payload da IA passaram de `curva_abc_qtd` → `curva_abc_valor`. Mata o "item de 3 vendas/ano vira A" (por quantidade a base poluída inflava a curva; por valor a distribuição fica Pareto real: A=127, B=282, C=2458).
- **Etiqueta "esporádico" no Alertas** (ao lado do nome), usando a flag real da view. A helper `comprarAgoraEsporadico` virou `itemEsporadico` (agora compartilhada entre Comprar Agora e Alertas); usa a flag `esporadico` da view com fallback pro proxy de 90 dias.
- Efeito: worklist do Comprar Agora fica mais limpa (~340 → 214 itens por decisão) e o ABC deixa de enganar. *(compras.js — trocas de campo + 1 etiqueta; `node --check` ok)*

### Alterado — Alertas não grita vermelho em item já pedido (P0.3)
- Quando um item está em **ruptura/crítico mas a reposição já foi pedida e cobre a falta** (`pedido_aberto > 0` e `qtd_sugerida = 0`), o Alertas mostra **"🚚 a caminho"** (azul) no lugar do badge vermelho de ação. Mata o alarme falso que afogava a equipe ("grita vermelho em item já resolvido").
- Nova helper `itemCoberto(r)`. Só afeta a exibição do Alertas — o semáforo/contagem continua refletindo a situação real do estoque. Impacto medido: **76** dos 520 itens vermelhos viram "a caminho".
- *(compras.js — 1 helper + 1 condição na célula de situação; `node --check` ok)*

### Corrigido — hambúrguer do tablet (P1.3)
- O botão de menu (☰) sumia entre **768 e 900px** (tablet): o CSS antigo injetado pelo `compras.js` só mostrava o botão até 768px, mas a sidebar do shell já vira off-canvas em 900px — ficava sem como abrir o menu. Adicionado override `@media (max-width:900px){ .menu-toggle{ display:block !important } }` (mesmo padrão dos outros overrides do arquivo, sem mexer no bloco de CSS legado). Validado ao vivo: o `!important` vence o `display:none` do CSS antigo.

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
