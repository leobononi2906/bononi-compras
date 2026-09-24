# STATUS — Bononi Compras

> Atualizado: 2026-09-24

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
