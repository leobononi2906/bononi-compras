# Changelog — Bononi Compras

Registro de mudanças, mais recente no topo. Datas em DD/MM/AAAA.

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
