# Estado da arte em demanda e reposição — e o que fazer no Bononi Compras

**Data:** 26/07/2026
**Origem:** pesquisa multi-fonte (22 fontes, 106 afirmações extraídas, 17 confirmadas por verificação adversarial 3-0). A síntese automática foi interrompida por limite de sessão; este documento foi consolidado a partir das afirmações confirmadas + conhecimento consolidado da área. Onde a verificação não fechou, está sinalizado.

---

## 0. As duas dúvidas do Leo (o coração do problema)

### 0.1 "Um produto com 2 vendas em 6 meses está como curva A. Como?"

**Curva ABC mede IMPORTÂNCIA, não frequência.** O ABC clássico ordena os itens por **valor** (consumo × preço) e aplica Pareto: A ≈ top 80% do valor (~20% dos itens), B ≈ 15%, C ≈ 5%. Um item que vendeu só 2 vezes **pode** ser A se essas vendas forem de valor alto.

Mas há uma segunda causa, mais provável no nosso caso (o campo é `curva_abc_qtd` = ABC por **quantidade**): quando o catálogo tem **milhares de itens quase parados**, o "top 20% por quantidade" desce tanto que **2 vendas já entram em A**. O ABC está "certo" pela fórmula, mas **sem sentido**, porque a base de comparação está poluída por não-movimentados.

**Conclusão:** ABC sozinho não serve para decidir reposição. O padrão moderno é cruzar com **XYZ** (regularidade da demanda):
- **X** = demanda regular (fácil de prever)
- **Y** = demanda variável/sazonal
- **Z** = demanda errática/esporádica (o nosso "2 vendas em 6 meses")

O produto do exemplo é provavelmente **A-Z** (ou C-Z): pode importar em valor, mas é **imprevisível** — e itens Z **não** devem ser tratados como um giro constante. *(A matriz ABC-XYZ e as políticas por segmento são conhecimento consolidado do setor; a verificação automática dessas afirmações específicas foi interrompida pelo limite de sessão — fontes: eazystock.com, yvonnebadulescu.com.)*

**O que fazer:** (a) calcular ABC **por valor** e sobre uma janela adequada; (b) **excluir não-movimentados** da base do ranking; (c) adicionar a dimensão **XYZ** e mostrar as duas juntas (ex.: "A · esporádico"). Precisa auditar como a view calcula o ABC hoje para confirmar a causa — é um SELECT, dá para fazer.

### 0.2 "Comprei em janeiro, vendeu em fevereiro, zerei desde então. Dividir 6 meses pela quantidade dá ~1/mês — isso engana."

Engana mesmo, por **dois motivos distintos**:

**(a) Viés de disponibilidade — "não se vende o que não se tem".** Se o item ficou **sem estoque** em 4 dos 6 meses, dividir as vendas por 6 meses **subestima** a demanda real. O correto é medir a demanda **sobre o período em que o item esteve disponível** (dias com estoque), não sobre o calendário cheio.

> Isso é grave e contraintuitivo: o cálculo ingênuo **pune justamente os produtos que romperam** (os que mais interessam). Eles parecem "baixa demanda" → você compra pouco → rompe de novo. **Círculo vicioso de ruptura.**

**(b) Demanda intermitente/errática.** Uma venda e depois zero por meses é o caso clássico de **demanda intermitente**. Para esses itens, "média por mês" é um sinal ruim, e **"cobertura em dias" fica instável e enganosa**. O padrão é estimar **intervalo entre demandas** + **tamanho típico da demanda** (métodos **Croston / TSB**), em vez de uma média achatada. *(Verificação dessas afirmações específicas interrompida pelo limite; conhecimento consolidado do setor.)*

**O que fazer no app:**
- Calcular consumo/dia **sobre dias com estoque** (ou marcar explicitamente "esteve X% do período sem estoque").
- Sinalizar itens intermitentes (Z) e **não** confiar em "cobertura em dias" para eles — usar "última venda / frequência".
- Mostrar **demanda perdida estimada** (ruptura × dias sem estoque) como sinal de prioridade.

---

## 1. Fundamentos verificados (com fórmulas e fontes)

### 1.1 Ponto de pedido e estoque de segurança
- **Ponto de pedido (ROP):** `ROP = Estoque de Segurança + Demanda Média × Lead Time`. Dispara a compra quando a **posição de estoque** (em mãos − pendências + em trânsito) cruza o ROP. — *ism.ws, netsuite.com (3-0)*
- **Estoque total** = estoque de ciclo (o que se espera vender no período) **+** estoque de segurança (buffer contra demanda em excesso, atraso de fornecedor, erro de previsão, reposição fora de hora). — *netsuite.com (3-0)*
- **Estoque de segurança (fórmula simples):** `(Venda máx × Lead time máx) − (Venda média × Lead time médio)`. — *netsuite.com (3-0)*
- **Estoque de segurança (estatístico, só demanda varia):** `SS = Z × desvio-padrão da demanda no lead time`. — *netstock.com (3-0)*
- **Estoque de segurança (demanda E lead time variam, independentes):**
  `SS = Z × √[(LT_médio × σ_demanda²) + (demanda_média² × σ_leadtime²)]`
  Combina as duas incertezas; dá **menos** estoque do que somar as duas separadamente. — *MIT (King), ism.ws, supplyverde.com, abcsupplychain.com (3-0)*

### 1.2 Nível de serviço ↔ Z (fator de segurança)
Mapa padrão (distribuição normal): **90% → 1,28 · 95% → 1,65 · 97,5% → 1,96 · 98% → 2,05 · 99% → 2,33 · 99,9% → 3,09**.
Relação **não linear**: subir o nível de serviço exige estoque **desproporcionalmente** maior. Alvo típico: 90–98%. — *MIT (King), ism.ws, netstock.com, abcsupplychain.com (3-0)*

> Implicação prática: nível de serviço **não é um número só** para o catálogo inteiro. Itens A merecem 95–98%; itens C/Z merecem 85–90% (ou nem estoque de segurança). É assim que se corta capital parado sem aumentar ruptura no que importa.

### 1.3 Previsão de demanda
- Médias móveis e **suavização exponencial** (Holt-Winters p/ sazonalidade) são a base clássica.
- **Refutado (0-3):** a alegação de que "ARIMA supera Holt-Winters" de forma geral — não se sustenta; depende do caso. — *sciencedirect.com*
- Sistemas modernos usam **demand sensing / ML** (sinais em tempo real além do histórico). Fornecedores relatam ganhos, mas são números de marketing — tratar com ceticismo.

---

## 2. Como os melhores sistemas fazem (benchmark)

### 2.1 O conceito-chave: "Prioritized Ordering" (lista priorizada) — Lokad
Em vez de um alvo por SKU isolado (reorder point clássico), **todos os itens competem pelo mesmo orçamento**: gera-se **uma única lista ordenada** por retorno/urgência da próxima unidade a comprar. Depois de comprar 1 unidade de um item, a próxima unidade mais vantajosa costuma ser **de outro item**. — *lokad.com (3-0)*

> É a virada mental: o comprador não "analisa produto por produto"; ele **desce uma lista já priorizada**.

### 2.2 "Replenishment page" — Inventory Planner
Gera **recomendações de compra** (não pedidos manuais) a partir de previsão, lead time, dias de estoque e estoque em trânsito. Dispara um **alerta na "data de reposição"**: o dia em que o item **precisa** ser pedido para não perder venda — e prioriza por **risco de ruptura**. — *help.inventory-planner.com (3-0)*

### 2.3 Gestão por exceção
Os sistemas **mostram só o que precisa de ação** (action-driven / exception-based), em vez de despejar o catálogo inteiro. — *help.inventory-planner.com (3-0)*

---

## 3. UX — como evitar a sobrecarga (a dor da equipe)

Padrões recorrentes nas ferramentas de referência:
1. **Uma lista de ação priorizada** ("comprar agora"), ordenada por urgência/risco — não uma tabela gigante para filtrar.
2. **Gestão por exceção:** por padrão, só o que precisa de decisão hoje.
3. **Lista enxuta + detalhe no drawer:** a lista mostra os **poucos números da decisão**; o resto vai para o painel de detalhe. — *uitop.design*
4. **Agrupar por fornecedor:** para o comprador resolver um fornecedor de uma vez (bate com a importação/MOQ).
5. **Data-limite de pedido por item** ("peça até dd/mm ou rompe").

**Os poucos números que decidem uma compra** (o que deve dominar lista e drawer):
- Vai romper? **quando** (dias até ruptura, considerando trânsito).
- **Quanto** comprar (sugestão) e **até quando** pedir.
- De **quem** (fornecedor) e a que **custo/lead time**.
- Sinal de confiança: a demanda é **regular ou errática** (X/Z)?

Tudo além disso é contexto — pertence ao drawer, não à lista.

---

## 4. Recomendações priorizadas para o Bononi Compras

| # | Recomendação | Por quê | Esforço |
|---|---|---|---|
| 1 | **Corrigir o cálculo de demanda** para usar **dias com estoque** (não o calendário cheio) | Acaba com o círculo vicioso de ruptura (0.2a) | Médio (mexe na view) |
| 2 | **Uma tela "Comprar agora"** — lista priorizada por risco de ruptura, agrupável por fornecedor, com "pedir até" | Substitui as **agendas de papel** da equipe; foco em ação | Médio-alto |
| 3 | **ABC por valor + excluir não-movimentados + dimensão XYZ** | Corrige o "2 vendas = A" (0.1) | Médio |
| 4 | **Nível de serviço por segmento** (A: 95–98%, C/Z: 85–90% ou sem SS) | Corta capital parado sem aumentar ruptura no que importa | Baixo-médio |
| 5 | **Marcar itens intermitentes (Z)** e não confiar em "cobertura em dias" para eles | Evita decisão errada em item esporádico (0.2b) | Baixo |
| 6 | **Estoque em trânsito na conta** (importação) — posição de estoque = em mãos − pendências + em trânsito | Sem isso, recompra o que já está no navio | Médio |
| 7 | **Estoque de segurança para o lead time longo de importação** com a fórmula de dupla variabilidade (§1.1) | Importação tem alta variabilidade de lead time | Médio |

---

## 5. Fontes (confirmadas na verificação)
- Lokad — Prioritized Ordering: https://www.lokad.com/prioritized-ordering-definition/
- MIT (Peter King) — Safety Stock: https://web.mit.edu/2.810/www/files/readings/King_SafetyStock.pdf
- NetSuite — Safety Stock: https://www.netsuite.com/portal/resource/articles/inventory-management/safety-stock.shtml
- ISM — Safety Stock Formula: https://www.ism.ws/logistics/safety-stock-formula/
- Netstock — Safety Stock: https://www.netstock.com/blog/safety-stock-meaning-formula-how-to-calculate/
- Inventory Planner — Replenishment: https://help.inventory-planner.com/en/articles/589017-replenishment
- abcsupplychain / supplyverde — fórmulas de estoque de segurança
- ABC-XYZ (não verificado por limite): eazystock.com, yvonnebadulescu.com

> Observação de honestidade: 6 afirmações (ABC-XYZ, thresholds de CV, casamento de modelo por segmento, métodos intermitentes) **não puderam ser verificadas** porque a sessão bateu o limite — são conhecimento consolidado do setor, mas não passaram pela verificação adversarial desta rodada. Dá para revalidar depois das 21h.
