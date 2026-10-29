# STATUS — Bononi Compras

> Atualizado: 2026-10-29

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

## 29/10/2026 — Filtro de origem (nacionais × importados) na tela Compras

Pedido do Leo: seletor **Nacionais e importados / Só nacionais / Só importados** ao lado de "Todos
subgrupos". Recorta a tabela e os cards do semáforo, como os outros filtros (`baseFiltradaAlertas`).
- **Origem do produto:** `comp_produto_lead.origem` (fornecedor principal marcado → o mais comprado →
  o de menor prazo; origem cadastrada em `comp_fornecedor_lead`). Sem fornecedor = nacional. A view
  volta a ser lida no front, só para isso (`loadOrigemProdutos`); se falhar, o seletor desliga e avisa.
- **STONNI AR CONDICIONADO, STONNI DIVERSOS e STONNI GELADEIRAS são sempre importados** (Leo,
  29/10), seja qual for o fornecedor (`GRUPOS_IMPORTADOS` / `origemDe`): pelo fornecedor, só 247 dos
  759 produtos desses grupos davam importado — 273 tinham fornecedor nacional e 239 nenhum.
  `RP AR G2 CONDIC.STONNI S2` (33 produtos, 15 importados pelo fornecedor) **não** entrou: não citado.
- Fora desses grupos, só **11 fornecedores** estão marcados IMPORTADO em `comp_fornecedor_lead`.
- **Provado:** sintaxe; banco de teste 12 nacionais + 5 importados = 17, e STONNI AR CONDICIONADO
  com "Só nacionais" = 0. Não visto em produção com login.

## 29/10/2026 — Card "Pedido de compra em aberto" com a previsão da Importação

Pedido do Gustavo (print da Geladeira ST 30L): as datas do card no drawer do produto não batiam com a
Importação. O card usava `data_prev_recebimento` do pedido no SGA, que não acompanha o ajuste da
"Previsão chegada" do processo. Agora, se o pedido está em `import_pedidos`, vale
`import_processos.data_prev_chegada` e o card mostra o código do processo (com a letra A–E) no lugar do
nome do fornecedor, que vem cortado do SGA ("…TECHNOLOGY C"). Pedidos em ordem de chegada; sem vínculo,
fica como antes (`loadDrawerPedidoAberto`). Provado: os 5 pedidos (2646–2652) em produção batem com
os processos QXBO 261009 A–E; não visto na tela com login.

## 29/10/2026 — Prazo de entrega por grupo de produto (Configurações)

Pedido do Leo: o prazo de entrega (lead time) passa a ser **por grupo de produto**, digitado em
**Configurações → Prazo de entrega**. Grupo sem prazo = **15 dias**.
- **Banco:** tabela nova `comp_prazo_grupo` (grupo, prazo_dias 1–365, quem/quando), RLS só
  `authenticated` (`sql/2026-10-29_prazo_entrega_por_grupo.sql`, **aplicada em produção 29/10**, vazia).
  Chave = nome do grupo (`comp_produtos_consolidado.grupo`), mesmo padrão do `comp_ignorados`: se o
  ERP renomear o grupo, o prazo antigo aparece marcado "grupo não existe mais" e o grupo volta a 15.
- **Onde vale:** filtro **Vai faltar** da tela Compras (o que não chega a tempo) e a Qtd Sugerida nesse
  modo (`leadDe`). O semáforo (Crítico = cobertura < 15 dias) é da view no banco e **não mudou**.
- **Saiu:** o prazo por fornecedor (`comp_produto_lead`: 100 dias China / 15 resto, automático e nunca
  ajustado). A view continua no banco, sem uso no front. Efeito imediato: os ~280 produtos de
  fornecedor importado (139 STONNI AR CONDICIONADO, 61 STONNI DIVERSOS, 47 STONNI GELADEIRAS, 15 RP AR
  G2…) caem de 100 para 15 dias **até alguém preencher o prazo desses grupos**.
- Toda alteração vai para o histórico (`comp_audit_log`, módulo configuracoes).
- **Provado:** sintaxe, exports dos `onclick`, regra em Node (grupo com prazo, sem prazo, sem grupo),
  gravação/atualização como `authenticated` e leitura `anon` = 0 (SQL com rollback). **Não provado na
  tela com login.**
- **Publicado 29/10** (commit `6b7e392`, OK do Leo); produção já serve o código novo. Prazos dos grupos
  STONNI ainda **não preenchidos** — pendente o Leo/equipe digitar.

## 28/10/2026 — Chat de IA só com login (`63cdb86`)

As Edge Functions `chat-compras` (pergunta à IA sobre compras) e `salvar-sugestao-compra-ia` estavam publicadas fora de repo e aceitavam qualquer chamador, sem login: qualquer um com a URL usava a IA (custo) e lia/gravava sugestões de compra. Agora estão versionadas em `supabase/functions/` e só aceitam quem entrou com o módulo `compras` (admin global, ou `compras` em `modulos`/`admin_modulos` do `app_metadata`). O `compras.js` manda o token da sessão (`cabecalhoFuncaoIA()`). Ordem: push do front primeiro, depois publicar as duas com `--no-verify-jwt`. Auditoria: `bononi-hub/docs/2026-10-27-edge-functions-fora-de-repo.md`.

## 19/10/2026 — Ruptura sem os esporádicos (card e selo), NÃO publicado

Pergunta do Gustavo: "esse número de ruptura está correto?". **Estava certo pela regra, mas a regra
enganava.** Os seis cards da tela (248 · 12 · 24 · 1.843 · 1.651 · 2.472) batem com o banco: é a view
materializada `comp_produtos_consolidado` (atualizada todo minuto 50) menos fora de linha e menos o que a
equipe ignorou em Configurações. Dos 248 em ruptura, todos seguem sem estoque ao vivo (243 zerados, 5
negativos) e 225 têm saída real em 90 dias. Mas **201 eram esporádicos** (1 a 12 unidades no ano) e 190
venderam 3 unidades ou menos em 90 dias; 23 têm venda faturada sem nenhum movimento de estoque (itens como
"FRETE", "EMPILHADEIRA", "CALCO TRILHO SOFA CAMA", que não são estocados); 9 têm saldo na Truckprest (de
propósito fora desde 09/10).
- **Mudança** (`compras.js`): interruptor **"Mostrar esporádicos"**, desligado por padrão, ao lado de "Mostrar
  fora de linha". Desligado, os esporádicos saem de **Ruptura, Crítico e Baixo** (cards, tabela e selo do
  menu). Estoque morto, Sem giro e OK **não mudam**: quem vendeu 2 no ano e nada em 90 dias é estoque parado.
  Função `esporadicoEmCompra`. Com a base de produção, Ruptura passa de 248 para **47** e Baixo de 24 para
  19; Crítico fica em 12.
- **Provado:** regra em Node (um caso por situação, inclusive o proxy quando a view não traz a flag) e os
  números acima por SQL em produção; tela abre sem erro e o interruptor aparece. **Não provado na tela com
  dado real:** o banco de teste só tem 2 produtos por card, sem esporádicos.
- **Aberto:** os 23 sem controle de estoque continuam contando como ruptura quando vendem; marcá-los como "sem
  controle" é decisão de quem manda no processo.

## 19/10/2026 — Validador de Produto + Base China (fase 1, NÃO publicado)

Grupo novo **Novos Produtos** no menu (Validador, Base China, Painel), pedido do Leo
(`PLANO_VALIDADOR_PRODUTO.md`). Mora aqui, e não no ERP novo, porque o ERP é ambiente de testes
e o `import_processos` e o kanban de importação existem só neste app. Detalhe, fórmula e score em
`docs/2026-10-19-validador-base-china.md`.
- **Código:** `validador.js` (arquivo próprio, carregado só nas páginas `val-*`; tudo pelo objeto
  `ModuloValidador`, sem lista de export) + 4 pontos em `index.html` (grupo do menu, slot, páginas,
  acesso). `compras.js` não foi tocado.
- **Banco:** `sql/2026-10-19_validador_base_china.sql` (8 tabelas `val_*`/`china_*`, RLS, seed). Ensaiado
  em produção com rollback e **aplicada em produção em 19/10/2026** após "pode aplicar" do Leo. Conferido
  depois: 8 tabelas, RLS e 8 policies, 10 parâmetros, 3 famílias, viagem Canton, 0 candidatos; a chave
  `anon` lê 0 linhas. Volta = bloco `drop table` no fim do arquivo (vale enquanto não houver dado real).
- **Acesso:** módulo novo `validador` no Hub (quem é admin do módulo no Hub, `admin_modulos`, edita fatores e parâmetros). Quem só
  tem `validador` vê apenas Novos Produtos. Falta o cartão no repo `bononi-hub`.
- **Manual na fase 1:** fator de nacionalização por família, volume de mercado, nº de concorrentes,
  FOB, preço-alvo. Câmbio: botão "Hoje" busca no AwesomeAPI, ou digita. Fatores do plano (1,81 / 1,80 /
  1,52) **não têm lastro nos dados do repo**: `import_*` não guarda FOB por item nem NCM.
- **Provado no staging (porta 5287, banco de teste):** migration aplicada pelo Leo no editor SQL
  (o CLI daqui não alcança o staging por IPv6). Candidato validado NO-GO (margem 15,7%) e depois GO
  (57,9%, vai a Triado), histórico com as duas linhas, mover na esteira, F5 mantém tela e dado,
  importação de CSV (2 fornecedores e 3 produtos, repetir atualiza sem duplicar, empresa inexistente
  vira aviso), "Validar" a partir da Base China (segunda vez abre o existente), Painel, Parâmetros
  (gravar e restaurar), celular 375 px sem rolagem lateral. Motor e CSV também em Node.
  **Não provado:** acesso de quem tem só `validador` (sem usuário assim no teste); nada disso em produção.
- **Taxa e imposto de partida** (22% e 18%, do Precifica Marketplace) somam 40% de custo sobre a
  venda: a meta de 40% de margem do plano só fecha com FOB bem baixo. O exemplo do plano (18% e 10%)
  não bate com esses dados. Decisão do Leo: manter, ou ajustar meta/taxas na tela Parâmetros.
- **Pendências:** publicar Compras e Hub (um push por repo; o front ainda não está no ar); cartão do
  Validador no Hub (feito no `index.html` do `bononi-hub`, sem commit); dar `validador` ao Jonathan e
  ao Leo; fase 2 (API do Mercado Livre, NCM), fase 3 (card GO cria `import_processos`).

## 09/10/2026 — Duplicar processo de importação

Processos do mesmo fornecedor se repetem (mesma importadora, valores e parcelas); antes era tudo
redigitado. Botão **Duplicar** na aba Informações do drawer, ao lado de "Editar"
(`abrirModalDuplicarProcesso` / `salvarDuplicacaoProcesso`, exportadas por `window.*`).
- A pessoa troca **nome, embarque, previsão de chegada e a data de cada pagamento**; o resto é
  copiado igual (fornecedor, importadora, status, valor USD, observações, **pagamentos** e
  **pedidos vinculados**). Documentos não entram.
- Pagamentos copiados entram todos como **A Pagar**; processo novo nasce com `status_pgto NAO_PAGO`
  e `quitado_fornecedor false`. Depois de criar, o drawer abre no processo novo para conferência.
- Nome igual ao original ou a outro processo é barrado na tela (o staging não tem o índice
  `import_processos_codigo_uniq`; em produção o 23505 também cobre). Se um insert filho falhar,
  apaga o que já entrou — não fica cópia pela metade.
- Histórico do processo novo registra "Duplicou processo" (`comp_audit_log`, ação `duplicar_processo`).
- Conferido no banco de teste (porta 5287): 2 pagamentos (1 pago) copiados com datas novas, ambos
  A Pagar, resumo financeiro igual; nome repetido barrado. Cópia de pedidos não exercitada (staging
  sem processo com pedido).

## 06/10/2026 — Processo em dobro e rascunho do carrinho (`6c4ea07`, `7374bbb`, `1dcf660`)

Processo de importação criado em dobro (Jhonatan, 09:53 e 09:54).
- **Trava de clique duplo:** `salvarNovoProcesso` e `salvarEdicaoProcesso` usam o flag
  `_salvandoProcesso` e desabilitam o botão do modal enquanto gravam; o `finally` sempre libera.
- **Código único:** índice `import_processos_codigo_uniq` em `lower(trim(codigo))` (ignora nulo
  e vazio), aplicado em produção em 06/10 (`sql/import_processos__codigo_unico.sql`; volta =
  `drop index`). Na aplicação havia 32 processos e 32 códigos distintos. Erro 23505 vira o aviso
  "Já existe um processo com esse código."
- **Rascunho do carrinho** (`compras_cart_draft_v1`): apagado no `sair()` e, via
  `onAuthStateChange`, no `SIGNED_OUT` (sessão expirada). Decisão do usuário: rascunho não
  sobrevive à saída.

Conferido no `compras.js` publicado; telas não abertas com login.

## 06/10/2026 — Situações de estoque explicadas nos cards (commit 5e5f120)

Pedido do Gustavo ("o que significa ruptura?"). Os 6 cards do topo de Compras ganharam apelido
no título (Ruptura · em falta, Crítico · vai faltar, Baixo · acabando, OK · tranquilo, Estoque
Morto · parado, Sem Giro · sem venda), frase de ação embaixo do número e explicação no `title`
(passar o mouse). O selo da coluna Situação (`badgeSituacao`) também ganhou `title`. Só texto:
regra de classificação, filtros e números iguais. Conferido no `compras.js` publicado (texto novo
presente, antigo ausente); tela não aberta com login.

## 02/10/2026 — Busca nos processos de Importação

Pedido do Gustavo. Caixa de busca ao lado de "Processos de Importação", filtrando Kanban e
Lista enquanto digita: casa código do processo, fornecedor, importadora, nº de pedido,
observações (onde ficam as linhas de produto do card) e status — sem acento/caixa, todos os
termos precisam bater. Com busca, a coluna Concluída aparece sozinha se houver resultado nela.
Na sub-aba Produtos a caixa some (ela já tem busca própria). Filtro só em memória
(`impProcessosFiltrados`), sem consulta nova. Não conferido com login real.

## 01/10/2026 — Busca por invoice/fornecedor em Peças da Garantia

Pedido de melhoria #9 (Leonardo Vieira Bononi). Campo de busca na tela *Peças da
Garantia*: casa invoice, fornecedor, código/nome da peça, nº do pedido de compra e
código do processo — dentro do filtro ativo (Em aberto/Recebidas/Todas). A peça não
guarda fornecedor: vem de `import_processos.nome_fornecedor` pelo nº do pedido
(`import_pedidos`), então peça sem nº de pedido não acha por fornecedor. Fornecedor e
invoice passaram a aparecer na coluna "Pedido de compra".

## 28/09/2026 — Tela Compras lenta: carga pela metade e fim do travamento por tecla (`9ec9c3b`)

Medido com dados de produção. **Carga** 5,6–9,7 s → 2,7–4,8 s: novo `buscarTudoParalelo`
(conta com `head` e pede todas as páginas juntas; qualquer resposta fora do esperado cai no
`buscarTudo` sequencial). O maior gargalo era `comp_produto_lead` em 8 idas de 1.000 **em fila**.
A lista (`comp_produtos_consolidado`) vinha em 12 páginas fixas **sem `.order()`** — teto calado
de 12.000 (10.322 hoje) e podia repetir/pular produto; agora ordenada por `id_produto`.
**Por tecla/clique:** o filtro dos 1.799 ignorados era `.find` por produto, 371 ms × 2 por render;
virou `Set` (`setsIgnorados`, ~1 ms). **Menu:** voltar para Compras reaproveita os dados por
5 min; o botão de atualizar do topo zera a validade. Cuidado: rodadas seguidas de teste de carga
em produção levaram o banco a statement timeout (500) por alguns minutos — medir pouco.

## 24/09/2026 — Botão "Produto manual" do carrinho não fazia nada (`501fb2c`)

`abrirModalItemManual`, `fecharModalItemManual` e `adicionarItemManual` (recurso de 01/09)
nunca entraram no `Object.assign(window, …)` do IIFE — o `onclick` dava `ReferenceError` mudo
e o botão parecia morto. Incluídas na lista de export. Achado do pente fino de 24/09.

## 18/09/2026 — App parava de lembrar a tela do usuário

`iniciarApp()` sempre reabria em **Compras** (`cmp-alertas`), mesmo que o
usuário estivesse em outra aba, toda vez que a página recarregava. Agora a
última página visitada é salva em `localStorage` (`cmp-ultima-pagina`) e o
app reabre nela. Commit `a4c477a`.

## 18/09/2026 — Campo Invoice no atender peça da Garantia

Coluna `prt_solicitacao_peca.invoice` (text, nullable) nova em produção. Campo
livre no modal *Atender*, junto de "Número do pedido de compra" e "Recado para
a Garantia" — pra anotar o invoice do fornecedor. Commit `a8040a3`.

## 15/09/2026 — Foto da peça na fila da Garantia

O código que chega aqui muitas vezes **não existe no catálogo nem no ERP** —
peça que falta é peça sem cadastro. A Garantia passou a anexar até 3 fotos ao
pedido (`prt_solicitacao_peca.fotos`, jsonb), e este app **lê**: ícone de imagem
na fila e miniaturas no *Atender*.

Bucket **privado** `assist-pecas-fotos` (não é o `assist-parceiros-docs`, que
guarda NFS-e e comprovante das autorizadas — leitura dele aqui entregaria isso
tudo junto). Link assinado de 1 h por `createSignedUrls`, uma chamada para todas
as fotos, disparada **depois** que o modal já está na tela.

Nada a preencher deste lado: a foto é só leitura aqui.

## 14–15/09/2026 — Tela nova: **Peças da Garantia** (`cmp-solicitacoes`)

Fila das peças que a Garantia (app **Assistência Stonni**) registrou como em
falta. Entre *Pedidos* e *Estoque Parado* no menu. Tabela `prt_solicitacao_peca`
(RLS ligada, policy só para `authenticated` — este app entra logado, então passa).

**O ciclo, em três mãos:** a Garantia registra a peça → o Compras compra, marca
**quando pagou** e informa o **prazo de entrega** → a Garantia lê e passa ao
cliente. Antes isso era WhatsApp nos dois sentidos, sem registro.

- Em **Atender**: situação, *Pago em*, *Prazo de entrega*, número do pedido de
  compra e um recado de volta.
- **O prazo digitado vence o do processo de importação.** Nasceu ao contrário —
  a data viria sempre de `import_processos` — e um dia de uso desmentiu:
  das 25 previsões de processo, **15 já estavam vencidas**, **nenhum processo tem
  `data_chegada_real`**, e peça que falta é compra rápida que muitas vezes nem
  entra em processo. O processo virou complemento, com link "usar como prazo".
- **Previsão vencida sai em laranja**, escrita "· vencida". Do lado de lá a
  Garantia promete a data a um cliente.

**Duas armadilhas que custaram um dia:**

1. **Este arquivo inteiro é um IIFE** — `;(function(){ 'use strict'; … })()`.
   Nada existe no escopo global a menos que esteja na lista de `window.X = X`
   perto do fim. As funções da tela não foram exportadas: a fila montava
   certinho (o loader é chamado de dentro do módulo) e **todo `onclick` era um
   ReferenceError mudo** — filtros, Atender, Salvar. Um dia no ar assim.
   → **Antes de subir tela nova: listar os `onclick="nome("` e conferir um a um
   que `nome` está exportado. `typeof window.nome` no navegador é a prova.**
2. **`numero_pedido` é INTEGER** (é o tipo de `import_pedidos.numero_pedido`).
   Nasceu `text` e o JOIN da previsão nunca resolveria — a tela mostraria o
   número e nunca a data, sem erro nenhum.

Datas renderizadas **por recorte de texto**, nunca `new Date('2026-09-14')`, que
vira meia-noite UTC e aparece como 13/09 no fuso de Brasília.

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
- **`window.fmtDate` (`index.html:629`) erra o dia em data pura, e hoje não tem nenhum uso no repo.** `new Date('2026-09-15')` é meia-noite **UTC**; em UTC−3 volta um dia (`14/09/2026`), e na virada de ano volta o ano. Foi o que quebrou o drawer de Movimentações em silêncio até 16/09/2026. O formatador correto do app é `fmtData()` (`compras.js:590`), que trata data pura e devolve `—` para inválida — **use sempre ele**. O global ficou de pé só porque `index.html` estava com alteração de outra sessão em curso; remover quando aquela entrar. Enquanto existir, é convite a repetir o bug.
- **Falsos fornecedores** no ranking (notas de retorno / empresas do grupo). Existe `IDS_INTERGRUPO_FORN`; falta levantar os ids dos falsos.
- Monolito grande — quebra gradual ao mexer.

## Documentação

Os arquivos já citados acima em contexto (`CONTEXTO-TECNICO.md`, `CHANGELOG.md`,
`DIVIDA-TECNICA.md`, `PLANO-DE-ACAO.md`, `2026-09-14-design-system.md`,
`2026-09-14-fornecedor-importacao.md`) continuam valendo. Os três que faltavam no índice:

| Arquivo | Conteúdo | Quando abrir |
|---|---|---|
| `docs/README.md` | índice da pasta. Declara que ela **substitui** os contextos de compras dispersos em outras sessões e arquivos | ao chegar no repo, para não caçar contexto fora daqui |
| `docs/GUIA-DE-USO.md` | guia prático para a **equipe**, em linguagem direta, sem termo técnico | antes de mudar rótulo, fluxo de tela ou mensagem que o comprador lê — e para atualizar depois, porque a tela é que manda |
| `docs/PESQUISA-DEMANDA-E-REPOSICAO.md` (26/07) | estado da arte em demanda e reposição, com 17 afirmações confirmadas por verificação adversarial, e o que disso cabe aqui | antes de mexer na regra de sugestão de compra, ponto de pedido ou lead time. ⚠️ A síntese foi interrompida por limite de sessão; o que não fechou está sinalizado no próprio texto |

## Dev-log
- 2026-10-27 — **Senha a cada 90 dias e sem repetir as últimas 5 (`geral-central.js` v21, `?v=` subido).** Cópia verbatim do `bononi-hub/ds/geral-central.js`: a troca forçada agora pergunta ao banco se a senha venceu (RPC `geral_senha_status`) e grava pela `geral_trocar_senha`, que recusa as últimas 5 senhas e menos de 8 caracteres (migrations 0069/0070 do `bononi-hub`, aplicadas em 27/10). Antes lia `user_metadata.senha_alterada_em`, que ninguém tinha — nunca bloqueou ninguém. Ninguém vence antes de 25/01/2027. Provado no navegador no Hub (mesmo arquivo, RPC simulada); detalhe no dev-log do Hub de 27/10.
- 2026-10-20 — **Impressão sempre clara: o tema escuro vale só na tela.** Verificação de impressão (PDF real do Chrome, escuro × claro) mostrou que o bloco de impressão do kit devolvia ao claro só poucas variáveis: `--text-action`, `--text-accent`, as de status e as bordas saíam com o valor escuro, e Ctrl+P no modo escuro imprimia títulos e números em cinza-claro. O bloco escuro do CSS de tema (`ds/bononi-dark.css`) agora fica dentro de `@media screen`, sem lista de reset: no papel tudo é o claro. O cache-buster do CSS de tema subiu para `?v=20261020c`. Conferido com mídia de impressão emulada: nenhuma variável de texto ou borda difere entre escuro e claro, e a tela escura e a clara seguem como antes. PDF real nas 13 telas: idêntico nos dois temas (antes, as 13 saíam com títulos e números mais claros). Telas que exigem login não foram impressas em PDF (só o teste de variáveis, que vale para o app inteiro).
- 2026-10-20 — **Tema escuro (claro / escuro / automático) no Compras (d4df0cb + correção de texto e gráficos no commit seguinte).** Pedido do dono: todas as aplicações com tema escuro, sem bugar. Botão de tema na barra lateral; o automático segue o aparelho, a escolha fica no navegador e é aplicada antes da página pintar. Paleta em `ds/bononi-dark.css`, tema em `ds/bononi-tema.js` (também troca o logotipo).
  - `--blue-dark` e `--blue-mid` valem a tinta do DS e serviam de fundo e de texto. Os 36 usos como texto viraram `--text-action` (tinta no claro, claro no escuro); sem isso o título da página e o número do primeiro cartão ficavam quase invisíveis.
  - Os 3 gráficos (Curva ABC, Situação do Estoque, Top 10 fornecedores) fixam a cor na criação: `compras.js` limpa o cache do `cssVar`, acerta texto/grade do Chart e redesenha ao trocar o tema. A fatia de estoque morto e a barra de volume usavam tinta e passaram a `--text-action`.
  - Conferido no Compras local (banco de teste): Compras, Totais de Estoque com os 3 gráficos, ciclo claro/escuro/automático com gráficos recriados, console sem erro novo. Não percorri Pedidos, Balanço, Importação nem o Validador no escuro.
- 2026-10-09 — **Estoque da Truckprest (id_empresa=1) fora das somas.** Pedido de melhoria #11 (Leonardo). Migration `sql/2026-10-09_estoque_sem_truckprest.sql` (volta: `_volta.sql`), **aplicada em produção em 09/10**: `comp_produtos_consolidado_src` passa a somar só `id_empresa <> 1`, o que alcança a lista do Compras e o `bling_produtos_sync` (estoque enviado ao Bling/E-commerce: 189.239 → 186.539 un.; estoque total do grupo 197.693 → 194.988; 4 produtos só da Truckprest saem da lista). No `compras.js`, o saldo por centro (gaveta do produto e tabela de saldo) também exclui a Truckprest. **Fora de propósito:** lista de contagem do balanço (linha ~3338) e `comp_produtos_resumo` (por empresa, não lida). O Atacado (`com_stonni`) não lê estoque no código. O efeito no Bling só aparece quando o sync rodar.
- 2026-10-07 — (`2a8ba2d`, publicado) **Sino e botões do geral-central não saem mais na impressão** (`geral-central.js` v16, `?v=17`). O módulo põe sino de Pendências, "Sugerir melhoria", cartão de treinamento e avisos em `position:fixed` sem regra de impressão, e o sino saiu no romaneio impresso da Expedição (06/10). Agora um `@media print` esconde tudo isso. Só a cópia de `ds/geral-central.js` e o `?v=` do `index.html` mudaram; este app imprime em janela própria, então não era afetado, e a cópia só mantém o arquivo igual ao do Hub (original em `bononi-hub/ds/`) (`2a8ba2d`).
- 2026-10-05 — (`de28292`, publicado) **Link no aviso do Painel Dev aparece como link.** O estilo base do app zera cor e sublinhado do `<a>`, então o link escrito no aviso (`<a href="https://...">`) já funcionava mas saía igual ao resto do texto e ninguém via que dava para clicar. Caso que revelou: o aviso das notas paradas há 24h na Expedição, com "abrir as notas paradas".
  - `geral-central.js` recopiado do `bononi-hub` (mesma v15, só a linha do link em `escHtmlSimples` muda: vermelho `#c11f25`, sublinhado, negrito). `?v=16` no `index.html`.
  - Conferido no ar: o `geral-central.js` publicado já traz o estilo novo. Não visto na tela (o aviso só aparece com login).
- 2026-10-02 — **Busca nos processos de Importação.** Caixa no cabeçalho filtra Kanban e Lista (código, fornecedor, importadora, pedido, observações, status); detalhe na seção de 02/10 acima. Commit c9c0841 subiu sem `window.renderImportacao` (IIFE): o `oninput` dava ReferenceError mudo e a busca não filtrava nada — export adicionado no commit seguinte.
- 2026-10-01 — **Caminho dentro do app (geral-central v15).** Cada sessão passa a gravar qual app e qual tela abriu (RPC `geral_registrar_navegacao`, migration 0031 do `bononi-hub`), e a tela "Acessos fora do horário" do painel-dev mostra o caminho. Pedido do Gustavo depois de não dar para saber em qual app o Henrique Trombini entrou em 05/09 10:55. Gancho em `navegarPara(paginaId)`. Commit 33484a2.
- 2026-09-28 — **Sino de pendências + selos no menu.** "Peças da Garantia" ganhou selo (`prt_solicitacao_peca` aberta), que acompanha a releitura do sino (`gc:pendencias`). O `#badge-ruptura` que `atualizarBadgeSidebar()` escrevia nunca existiu no HTML: agora existe, no item Compras, com o total real (sem filtro da tela e sem os ignorados). `?abrir=cmp-solicitacoes` (sino do grupo, `geral-central.js` v14) abre a página em "Em aberto"; `loadSolicitacoes` só aceita a leitura mais recente (duas corriam juntas e a de filtro velho sobrescrevia). `geral-central.js?v=14`. Não testado com login real.
- 2026-09-28 — **Auto-login em ambiente de TESTE.** `iniciarApp()` tenta a Edge Function
  `auto-login-teste` (do `bononi-hub`, publicada só no projeto de teste) antes de mostrar login,
  só quando `SUPA_URL` já é a de teste (via `serve-staging.py`). Em produção não muda nada. Mesmo
  padrão em mais 6 apps do grupo (dev-log do `bononi-hub`, 28/09).
- 2026-09-28 — **Sair limpa a página guardada.** `sair()` passou a limpar `cmp-ultima-pagina`: o próximo usuário no mesmo navegador não herda a página do anterior. **Decisão em aberto para o dono:** o rascunho do carrinho (`compras_cart_draft_v1`) continua sobrevivendo ao Sair, e quem entra depois vê o pedido do anterior. Skill `manter-tela-ao-atualizar`.
- 2026-09-24 — (`bdbd6fb`) **`geral-central.js` v10: aviso de prazo de treinamento fora do app.** Cartão no canto inferior esquerdo quando há grupo de treinamento vencendo em até 3 dias ou vencido; `?v=` 9 → 10. Detalhe no dev-log do `bononi-hub`.
- 2026-09-24 — **Correção do FAB "Sugerir melhoria": z-index:150 não era baixo o suficiente.** A
  correção anterior (mesmo dia, `z-index:9997` → `150`) partiu do que resolvia no `com_stonni`
  (drawer com `z-index:200/201`), mas testando ao vivo no `bononi-exped` e no `bononi-cobranca`
  (que usam escala Tailwind `z-20`/`z-30`/`z-50` para nav/drawer/painel) o FAB continuava por
  cima — `150 > 50`. Baixado de novo, agora para `z-index:10`, valor seguro em todos os apps que
  usam este arquivo (abaixo até do menor caso encontrado, `z-20`). `?v=` bumpado de 8 pra 9.
- 2026-09-24 — **FAB "Sugerir melhoria" não fica mais em cima de drawer/modal aberto.** `.gc-fab-wrap` (`ds/geral-central.js`) tinha `z-index:9997`, acima de qualquer drawer/modal/painel lateral do app — risco de tampar um botão de ação no canto inferior direito quando algum estivesse aberto (bug confirmado assim no `com_stonni`, no `bononi-exped` e no `bononi-cobranca`). Baixado para `z-index:150` por precaução, mesma correção aplicada em todos os apps que usam este arquivo. `?v=` bumpado de 7 pra 8 no `index.html`.
- 2026-09-24 — `geral-central.js` v7: aviso aceita HTML simples. Mensagem do aviso passa por
  `escHtmlSimples` (escapa tudo e libera só `<b>`, `<i>`, `<u>`, `<br>`, `<a href="https://...">`)
  em vez de `esc` puro. Mudança no original `bononi-hub/ds/geral-central.js`, replicada verbatim
  aqui, `?v=` bumpado de 6 pra 7 no `index.html`.
- 2026-09-23 — **`geral-central.js` v2: botão vira ícone com tooltip, formulário estruturado.**
  Antes era uma pílula de texto fixa; agora é um ícone circular pequeno, com "Sugerir melhoria"
  só no hover. Formulário diferencia "não funcionou" (3 perguntas) de "ideia de melhoria", e
  captura a tela sozinho. Depende da migration `0008` (`tipo`/`tela` em `geral_pedidos_melhoria`).
- 2026-09-23 — **Piloto do `geral-central.js` (Painel de Desenvolvimento).** Botão flutuante
  "Sugerir melhoria" no canto inferior direito, chamado logo após o login em `iniciarApp()`.
  Testado local: FAB monta, modal abre, envio trata sucesso/erro. Original em
  `bononi-hub/ds/geral-central.js` — mudança futura precisa ser feita lá e recopiada aqui.
- 2026-09-17 — **Item ativo da sidebar estava com o texto em cinza, sobra do azul da versão
  antiga.** O `--blue-light` já tinha virado `var(--bnn-gray-600)` numa migração anterior (nem
  azul, nem o vermelho que o DS pede para o único destaque por tela), e o item ativo não tinha
  régua nenhuma — só um fundo mais claro. Ficou igual ao padrão de Expedição/Frete/Cobrança:
  régua de 3px em `var(--bnn-red-400)` na esquerda, texto em `var(--text-inverse)` (branco).
  Token `--blue-light` (agora sem nenhum uso) removido. Não conferido em operação — a tela
  fica atrás do login.
- 2026-09-17 — **A marca passou a aparecer na aba do navegador.** Não tinha favicon nenhum.
  Adicionado `assets/favicon-32.png` e `assets/favicon-64.png`, gerados do símbolo isolado
  (`mark-bononi.png`), na aba junto com o logo que já existia na tela de login. Conferido no
  navegador: as duas tags resolvem com 200.
- 2026-09-16 — **Três telas mostravam número menor que a realidade por causa do `.range(0, 9999)`, e uma paginação à mão repetia/pulava linha.** Não era paginação, era teto: passando de 10.000 linhas o PostgREST corta, responde **200** e não avisa — o número na tela fica menor, sempre para menos, sem erro nenhum. Medido contra produção, já estava cortando em três lugares: `vw_os_base` **17.898** linhas (recebia 9.999), `vw_fb_produtos_compras` com localização **17.485** (recebia 9.999) e `comp_produtos_consolidado` **10.311** (recebia 9.999). Os efeitos: O.S. que caía fora do mapa era contada como "não encontrada" e sumia do total de O.S. abertas; o filtro de localização do balanço descartava 43% dos produtos em silêncio; e os totais por grupo/subgrupo e a curva ABC ignoravam 312 produtos.
  - **A paginação à mão do `loadFornProdCache` era o caso pior.** Ela já paginava `vw_fb_forn_prod` (16.983 linhas) de 1.000 em 1.000, mas **sem `.order()`** — e sem ordem garantida o Postgres pode devolver uma linha em duas páginas e nenhuma vez uma terceira. Isso é pior que truncar, porque a contagem fecha e o erro não aparece. Além disso avançava por `página × 1.000` em vez de pelo que a resposta trouxe, então um teto por requisição menor que 1.000 faria a busca parar achando que acabou.
  - **O que entrou:** helper `buscarTudo()` no topo do `compras.js`, copiado do `bononiecommerce/src/lib/query.ts`. Página de **5.000** (medido: 1.000 → 14.450 ms, 5.000 → 5.462 ms; paginar re-executa a consulta a cada página, então página pequena é cara), avanço pelo que a resposta trouxe, e teto de sanidade de 50 requisições. Toda consulta paginada leva `.order()` por chave estável — `id` onde existe, `id_produto` em `comp_produtos_consolidado` (verificado único: 10.311 linhas para 10.311 produtos).
  - **`.range(0, 99999)` era o mesmo bug disfarçado.** O servidor mede **10.000 por requisição** de qualquer jeito (medido em produção: pedir 200.000 devolve 10.000), então o número grande só fazia parecer que havia folga. Onde a tabela é pequena (`comp_fornecedor_principal`, 30 linhas) o `.range()` saiu; onde é grande, virou `buscarTudo()`.
  - **Provado pelo número:** cada consulta corrigida foi conferida contra `count(*)` de produção — 17.898 = 17.898, 10.311 = 10.311, 17.485 = 17.485, 16.983 = 16.983. Custo: 3 a 4 requisições, ~2 s.
  - **Retry para o 57014, que a paginação tornou mais provável.** As views do ERP (`vw_fb_*`, `vw_os_*`) estouram o `statement_timeout` de 8 s na chamada com cache frio e respondem na segunda. Onde havia 1 requisição agora há 3 ou 4, ou seja 3 ou 4 chances de pegar a chamada fria, e sem retry uma delas derrubaria a busca inteira. O `buscarTudo()` repete por página em `57014`/`57P01`/`08006` e erro de rede (400 ms, 1.200 ms). Erro de schema/sintaxe não repete: só atrasaria a mensagem.
  - **Pendência:** `vw_os_base` é carregada inteira (17.898 linhas) para consultar as poucas O.S. (<499) que aparecem nos movimentos do produto. O formato certo é buscar os movimentos primeiro e pedir só esses ids com `.in('id_os', ...)`. Ficou fora agora para não mexer no `Promise.all` junto com a correção do teto.
  - ⚠️ **Este arquivo apontava o clone real em `C:\CLAUDE\Projetos GitHub\bononi-compras`, que não existe mais.** O clone real é `C:\Aplicações da bononi\bononi-compras` (tem `.git`, remote `leobononi2906/bononi-compras`). Corrigir a seção "Onde está".
- 2026-09-16 — **`ds/geral-acesso.js` atualizado para a v2, e o `?v=` subiu junto.** A v2 deixou o leitor portátil entre os DS (ver o dev-log do Hub). O `?v=1` virou `?v=2` **porque o arquivo mudou**: reusar um `?v=` já servido com outro conteúdo entrega o módulo velho sem erro nenhum, e é o tipo de bug que não se acha olhando o código.
- 2026-09-16 — **O drawer de Movimentações mostrava todas as datas um dia atrasadas.** Chegou reportado como outra coisa — `ReferenceError` derrubando a renderização do drawer —, e essa parte não se confirmou: `fmtDate` **existe**, é global de `index.html:629` (`window.fmtDate`), e identificador que resolve como propriedade do `window` não lança sob `'use strict'` (o que o strict muda é a **atribuição** a não declarado; a leitura de não declarado lança nos dois modos). Conferido no app rodando: `typeof fmtDate === 'function'` e a guarda resolve sem throw. O defeito real é outro e é silencioso: `window.fmtDate` faz `new Date('2026-09-15')`, que o JS lê como **meia-noite UTC**; em `America/Sao_Paulo` (UTC−3) isso volta um dia — a linha exibia **14/09/2026**. E `data_mov` de `comp_estoque_mov` é data pura `YYYY-MM-DD` (é comparada como string em `.gte`/`.lte` e no `localeCompare` do sort), então **toda** linha do drawer errava a data, e a virada de ano errava o ano (`2026-01-01` → `31/12/2025`). O app já tinha o formatador certo: `fmtData()` (`compras.js:590`), que acrescenta `T00:00:00` para data pura justamente por isso, e que as outras ~20 telas já usavam — o drawer era o **único** ponto do arquivo alcançando o global de `index.html`. Trocado por `fmtData(r.data_mov)`, que ainda devolve `—` para data inválida onde o outro escrevia `Invalid Date` na célula. **Fora de escopo, de propósito:** `window.fmtDate` continua em `index.html:629` e agora não tem nenhum uso no repo — está anotado em "Dívidas" em vez de removido, porque `index.html` tem alteração de outra sessão em curso no mesmo arquivo. ⚠️ **O lint não serve de prova aqui:** `npx oxlint --deny no-undef` acusa `fmtDate`, mas acusa 722 no-undef no arquivo, incluindo `fetch`, `alert`, `URL`, `location`, `Chart` e o próprio `SUPA_URL` — sem o env de browser configurado, global de `index.html` é sempre falso positivo, e `fmtDate` era da mesma classe que os globais que já se sabia whitelistar.
- 2026-09-16 — **`.vercelignore`: `docs/` e `sql/` estavam públicos.** A Vercel serve o repo inteiro, não só o que o app carrega — `docs/DIVIDA-TECNICA.md`, `sql/comp_pedidos_fase1.sql` e `CLAUDE.md` respondiam **200** em `bononi-compras.vercel.app`. Não é vazamento de credencial (a chave anon já sai no `index.html` por design); o que ficava exposto era o schema e as notas internas. Fechado com `.vercelignore`. **`index.html`, `compras.js`, `ds/` e `assets/` ficaram de fora da lista** — `ds/geral-acesso.js` entra por script tag, e tirá-lo do deploy quebraria a aba Acessos em silêncio. Conferido que nenhum app busca `docs/` ou `sql/` em runtime. Não apaga nada do git.
- 2026-09-16 — **Configurações ganhou a aba "Acessos": quem tem acesso ao Compras, e por qual papel.** (`3e28d09`) Só leitura, de propósito — quem **muda** acesso muda no Hub, que é onde o CRUD de permissão mora. Duplicar esse CRUD por app seriam 11 telas para auditar e 11 lugares para introduzir furo. O que a aba responde é a pergunta que sempre vem depois: *"quem liberou isso pro fulano?"*. Mostra pessoa, hierarquia (ou a etiqueta `manual`, para quem ainda tem acesso marcado à mão), o que ela pode fazer **aqui** (incluir/editar/excluir/aprovar/exportar) e o último acesso. **Quem vê:** admin global e admin de Compras — e quem decide é a RPC `geral_quem_tem_acesso`, pelo **JWT**, não este app. Implementação: `ds/geral-acesso.js`, cópia verbatim de `bononi-hub/ds/` (mesmo padrão do `bononi-ds.css`; ao trocar, trocar lá e recopiar, subindo o `?v=`). **O arquivo fica mudo** — não desenha nada e não quebra o app — se não houver sessão, se a RPC recusar, ou se a migration `0003_geral_hierarquias` ainda não estiver no banco; foi assim de propósito, para poder publicar antes de aplicar a migration. Este é o app de referência da implantação; os outros 10 ainda não têm. Contexto completo: `bononi-hub/docs/2026-09-16-hierarquias-de-acesso.md`. **Conferido no ar:** `ds/geral-acesso.js?v=1` servido em 200 (8.749 bytes) e `index.html` de 53.023 para 53.230 bytes. Enquanto a migration não estiver em produção, a aba mostra a explicação em vez do painel — é a degradação desenhada. Entrou no mesmo commit, de carona, a troca de `fmtDate` por `fmtData` no drawer de movimentações: `fmtData` trata `'YYYY-MM-DD'` sem o desvio de fuso que a outra tinha.
- 2026-09-14 — **Importação: a observação de cada pagamento agora aparece na própria tabela** (pedido do Leo). Antes só existia dentro do modal que o lápis abre. Entrou como **sub-linha de largura total** colada na linha do pagamento, não como coluna: é texto livre de tamanho variável e numa coluna espremeria os números, que precisam continuar alinhados. Pagamento sem observação não ganha espaço nenhum. A query já trazia o campo (`select('*')`), então não houve mudança de backend. Junto veio um `escHtml()` no módulo — a observação é texto digitado indo pra `innerHTML`, e sem escape um `<` na anotação quebraria o HTML da tela; testado com `<img src=x onerror=...>`, que renderiza como texto. De passagem, o cabeçalho da tabela saiu de 10.5px para 11px, o piso do DS.
- 2026-09-14 — **CSS de shell antigo removido do `compras.js`** (9,6 KB, 55 seletores, 32 colidindo). Ele era anexado ao `<head>` DEPOIS do `<style>` do `index.html`, então vencia todo empate — na prática o app era estilizado por ele e 32 regras do index nunca valiam. O exclusivo e usado (`.chat-*`, `.toggle-*`, `.drawer-title/-sub/-close`, `.content`) foi absorvido pelo index; `.main` e `.nav-badge*` eram código morto. Saíram os 3 remendos junto: o `z-index:9999` do drawer (a pilha do index já é coerente: drawer 300 > overlay 299 < modal 400), o breakpoint 768 do hambúrguer (o do index já é 900) e o z-index dos modais (já é inline). Efeitos visíveis: carrinho deixou de ficar desalinhado e os **6 cards do semáforo ficaram consistentes** — a regra injetada era anterior ao split de 6 situações e só dava borda a 4. ⚠️ O esconderijo do drawer teve de virar `transform: translateX(100%)` no index: os drawers têm largura própria maior (820/760/720px) e qualquer `right` negativo fixo faz o mais largo vazar pra tela — é a correção de 26/07, que voltaria a quebrar sem isso. Detalhe: `docs/DIVIDA-TECNICA.md` §1.
- 2026-09-14 — **Design system da marca aplicado** (3º app do grupo, depois de exped e hub). Escopo: paleta, tipografia e ícones; layout e composição das telas não mudaram, backend não foi tocado. `:root` virou ponte pros tokens do DS — o que fez os ~930 `style` inline e o CSS injetado herdarem a paleta sem reescrita. Azul de ação virou tinta. **3 nomes colidiam com o DS** (`--text-muted`, `--radius-sm`, `--sidebar-w`) e uma ponte `--x: var(--x)` é auto-referência que o CSS descarta calado — saíram da ponte. As 6 situações do semáforo viraram badge com ponto, com 6 tokens distinguíveis da rampa base. **Chart.js não entende `var()`** (desenha em canvas): as 4 paletas de gráfico resolvem token em runtime via `cssVar()`. Emoji → Lucide por CSS mask (77 viraram ícone, 112 saíram); ordenação e chevron viraram CSS. Junto: `.last-update` era branco sobre branco, o "check" do multiselect era mojibake, e saíram 3 gradientes. Detalhe: `docs/2026-09-14-design-system.md`.
- 2026-09-14 — **Importação: card "Fornecedor" consertado (2 bugs).** (1) o fallback para o fornecedor gravado no processo só existia dentro do ramo "tem pedido vinculado", então os 6 processos sem pedido mostravam "Nenhum pedido vinculado" — em 5 deles o nome já estava no banco; junto, removido um `else if` inalcançável. (2) o autocomplete buscava em `vw_fb_forn_prod` (vínculo produto↔fornecedor) em vez do cadastro, então fornecedor recém-criado no SGA não aparecia e o processo salvava nulo — foi o caso do ZHONGSHAN (89577). Agora busca nas duas fontes, com selo "cadastro" em quem só existe em `vw_fb_contatos`. Testado no local contra o staging (`.claude/staging-sql/16` e `17`). Detalhe: `docs/2026-09-14-fornecedor-importacao.md`.
- 2026-09-04 — **Movimentações: categoria "🔄 Transferência de unidade"** (entrada+saída), separada de Compra/Venda (commit 7261d10). Na view `comp_estoque_mov`: **saída** = tipo_saida 8 `TRANSF. VEND INTERGR` + 14 `TRANSFERENCIA FILIAL`; **entrada** = `comp_compras_hist_limpo` com `id_fornecedor` ∈ empresas do grupo (lista IDS_INTERGRUPO_FORN) E `tipo_entrada` de mov. de estoque (`NF MOV EST…`/`TRANSF. UNIDADE`/`PED MOV EST…`). Saíram de Compra (−~32 mil un.) e Venda (−~32 mil un.) pra não contar 2×. Descoberta: a entrada de transferência quase nunca vem "TRANSF. UNIDADE" (só 203) — o grosso é "NF MOV EST SEM PRECO" (3.359) com fornecedor do grupo; os 2 lados casam ~4,1 mil mov/~32 mil un. Front: checkbox/coluna nova; ao isolar, esconde produto sem transferência e KPIs somam só o visível. ⚠️ filtro por NOME pega falso positivo (ORI TRUCK/TOP TRUCK são externos) — usar ids do grupo.
- 2026-08-30 — **"Vai Faltar" virou FILTRO na tela Compras** (removida a aba separada — "muita aba confunde"). Liga/desliga usa o lead real por produto (comp_produto_lead); selo 🌏 nos importados; Qtd Sugerida lead-aware no modo ON (commit fed2fda).
- 2026-08-29 — **Tela "🔴 Vai Faltar" (lead-aware)** + backend `comp_fornecedor_lead`/`comp_produto_lead`/`comp_vai_faltar` (commit e079e82). **Auditoria de fontes:** fan-out do ERP confirmado RESOLVIDO na origem (tabelas materializadas dedupadas); faturamento vivo alcança jul/2025 → planilha `comp_historico_m2` vira legado. Lead time da China (100d) auto do cadastro UF='EX'.
- 2026-08-20 — **Split Estoque Morto × Sem Giro** (view `comp_produtos_consolidado`, ver pendência acima). **"Ajustes de Estoque" virou "Movimentações de Estoque"** — tela de conferência que reproduz o relatório de movimentação do ERP (entradas/saídas por categoria, por empresa×produto, período configurável), lendo `comp_estoque_mov` (view nova, sem fan-out, sem dupla contagem — Venda/O.S. só de `vw_fb_saidas_estoque`) + `vw_fb_estoque_centro` (saldo atual, tabela Principal/Garantia/Consolidado). Modelagem de dados de outra sessão (cérebro/dashboards); front construído aqui. `categorizeMotivo`/`vw_fb_mov_estoque` filtrado por `motivo` texto-livre **saiu de uso nessa tela** (ficou só documentado como histórico em CONTEXTO-TECNICO.md §9).
- 2026-08-17 — 🚨 Fan-out do ERP inflando consumo (~3×), depois estoque e pedido (~5×) — descoberto e corrigido (views `comp_consumo_limpo`, `comp_saidas_limpo`, `comp_compras_hist_limpo`, `comp_pedidos_compra_limpo`; `comp_produtos_consolidado` recriada 2×). Sugestão do catálogo: R$377k (fanado) → R$264k (real). Nova carga do ERP corrigiu estoque/pedido na origem à tarde; saída/OS continua fanando. Junto: filtro de status por checkbox c/ tooltip, gráfico "vendas por mês comparando anos" (sazonalidade), tabela de giro em 2 linhas, fornecedor principal marcável (⭐), código do fornecedor visível, botão cancelar pedido, histórico sem duplicar, "Ajustes de Estoque" focado em Balanço.
- 2026-08-07 — Ajustes finos (commit 37baedc): drawer com fornecedor sugerido no topo + bloco de pedido aberto (`vw_fb_pedidos_compra`), carrinho recolhido, salvar tira do carrinho. Export .xls padronizado.
- 2026-08-06 — Pedido persistente Fase 1 (`comp_pedidos`), auditoria da Importação (`comp_audit_log`), Fornecedores recriado company-safe e incorporado em Totais (commit 7371cca / 0df2132).
- 2026-07-28 — Tela "Estoque Parado" (commit 338dace); hambúrguer tablet corrigido; todos os P0 concluídos.
- 2026-07-26/27 — Clone virou real; SQL 365d/esporádico aplicada; ABC por valor; badge "a caminho".
