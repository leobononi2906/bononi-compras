# Guia de Uso — Bononi Compras

Guia prático para a equipe. Linguagem direta, sem termos técnicos.
Se algo aqui não bater com a tela, avise — a tela é que manda, o guia a gente corrige.

---

## O essencial em 1 minuto

O sistema de Compras serve para responder **uma pergunta central**:
> "O que eu preciso comprar agora, e de quem?"

Tudo gira em torno disso. As outras telas são apoio.

- **Entrou pra trabalhar?** Comece por **🎯 Comprar Agora** — a lista pronta do que precisa comprar hoje, já agrupada por fornecedor. Quer investigar um item específico ou ver tudo? → **Alertas e Reposição**.
- **Quer ver o quadro geral do estoque?** → Totais de Estoque.
- **Contagem no depósito?** → Balanço Físico.
- **Acompanhar mercadoria vindo de fora?** → Importação.
- **Ver com quem a gente mais compra?** → Fornecedores.
- **Esconder produto que não interessa nos alertas?** → Configurações.

---

## 1. 🎯 Comprar Agora — *comece por aqui*

A lista de trabalho do dia: **só o que precisa de decisão agora**. O sistema já tira do caminho o que está tranquilo e o que já foi pedido — o que sobra é o que você precisa resolver.

- **Agrupado por fornecedor**, com o valor estimado de cada bloco, ordenado pela urgência. A ideia é você bater o olho e já saber pra quem ligar.
- **Não aparece o que já está resolvido:** item cuja reposição já foi pedida (e o pedido cobre a necessidade) **não entra** — some o alarme falso.
- **Itens esporádicos** (baixo giro, vende pouco no ano) ficam ocultos por padrão. Tem um marcador **"incluir itens esporádicos"** se você quiser vê-los.
- Clique na linha para abrir o produto (mesmo painel do Alertas).

> Os três números no topo: quantos itens comprar, valor estimado e quantos fornecedores acionar.

---

## 2. Alertas e Reposição — *investigar e ver tudo*

É aqui que você vê **todos** os produtos (não só os urgentes) e investiga item por item.

### O semáforo (os cartões coloridos no topo)
Cada cor é uma situação. Clique no cartão para filtrar só aquela cor:

| Cor | Significa | O que fazer |
|---|---|---|
| 🔴 **Ruptura** | Acabou o estoque de um item que vende | **Comprar já** |
| 🟠 **Crítico** | Vai acabar antes da mercadoria nova chegar | Comprar com prioridade |
| 🟡 **Baixo** | Cobertura curta (menos de ~30 dias) | Programar compra |
| 🟢 **OK** | Estoque saudável | Nada por enquanto |
| ⚪ **Sem movimento** | Não vendeu no último ano | Avaliar (parado) |

### Marcadores ao lado do produto
- **🚚 a caminho** (no lugar do vermelho): o item estava em ruptura/crítico, **mas a reposição já foi pedida e cobre a falta** — não precisa de ação, é só esperar chegar. Some o susto à toa.
- **etiqueta "esporádico"**: item de baixo giro (vende, mas pouco no ano). Sinaliza que a "ruptura" dele nem sempre é urgente.
- **A, B ou C** (curva ABC): agora calculada **por valor de venda**, não por quantidade — o "A" passou a ser de fato o item que mais pesa em dinheiro (antes um item de 2-3 vendas no ano aparecia como A sem ser).

### Como achar um produto
- **Digitou algo na busca?** O sistema mostra **todos** os produtos que batem com o texto, mesmo os que estão OK. Serve pra consultar qualquer item.
- **Filtros** (grupo, subgrupo, fornecedor): vão estreitando a lista. Dá pra combinar.

### Abrir um produto (o painel lateral)
Clique na linha do produto → abre um painel na direita com 5 abas:
- **Resumo** — o retrato do item: estoque, quantos dias de cobertura, quanto sugere comprar, último preço, margem.
- **Histórico** — as compras que já foram feitas desse item.
- **Estoque** — quanto tem em cada empresa.
- **Fornecedores** — de quem já compramos esse item.
- **Pedido** — pedidos em aberto desse item.

> Para fechar o painel: clique no ✕ ou clique na área escurecida ao lado.

### Montar um pedido
Dentro do produto dá pra adicionar ao **carrinho**. O carrinho fica numa barra embaixo. Quando terminar, dá pra **exportar em Excel** para enviar ao fornecedor.

---

## 3. Totais de Estoque

Visão de cima do estoque inteiro: quanto vale, dividido por grupo, por situação e pela **curva ABC** (A = os itens mais importantes, C = os menos). A curva ABC agora é **por valor de venda** — o gráfico reflete de fato onde está o dinheiro. Boa para reunião e para enxergar concentração.

---

## 4. Balanço Físico — *contagem no depósito*

Serve para conferir se o que o sistema diz bate com a prateleira. É **contagem cega**: você conta sem ver o saldo do sistema, para não "viciar" o número.

Fluxo:
1. **Criar uma sessão** de contagem (pode filtrar por grupo/empresa para contar só um pedaço).
2. **Contar** item por item, digitando o que achou na prateleira.
3. **Encerrar** — o sistema compara com o saldo congelado no início e mostra as diferenças.

---

## 5. Importação — *mercadoria vindo de fora*

Acompanha cada processo de importação como um quadro (kanban). Cada cartão é um processo e caminha pelas etapas:

**Em trânsito → Desembaraço → Nacionalizado → Em distribuição → Concluída**

- Os cartões vêm ordenados pela **previsão de chegada** (o que chega antes fica no topo).
- **Concluídos ficam escondidos** por padrão — tem um botão "Concluídos" no topo para mostrar/esconder.
- **Previsão de chegada:** clique na data no cartão para editar ali mesmo (salva sozinho).
- Abrindo um processo, você tem 3 abas: **Info** (fornecedor, datas, observações), **Pagamentos** e **Documentos** (anexos).

### Pagamentos — como o total é calculado
O resumo financeiro soma os pagamentos normais, ajusta com o que foi **recebido** e **transferido**, e acrescenta **10% de custas financeiras**. A coluna **Câmbio** mostra o valor em reais dividido pelo valor em dólar de cada linha.

---

## 6. Fornecedores

Ranking de com quem a gente mais compra. Abre um painel com o detalhe e o histórico de cada fornecedor. Bom para negociar e para enxergar dependência.

---

## 7. Configurações

- **Ignorar Produtos:** tem item que nunca vai ser reposto por aqui e só polui os alertas? Marque para **ignorar**. Ele some da tela de Alertas. Pode ignorar um produto, um subgrupo inteiro ou um grupo inteiro.
- **Ignorados:** a lista do que está escondido — dá pra remover e trazer de volta.
- **Logs:** histórico de quem mexeu no quê (auditoria) e erros do sistema. Uso mais técnico.

---

## Dúvidas comuns

**"Sumiu um produto da lista de alertas."**
Provavelmente ele está OK (sem necessidade de compra) ou foi marcado como **ignorado** em Configurações. Digite o nome na busca para vê-lo de qualquer forma.

**"O painel lateral fica travado/aparecendo na tela."**
Era um bug de layout — corrigido. Se acontecer de novo, avise.

**"Não consigo abrir o menu no tablet/celular."**
Corrigido em 27/07 — o botão de menu (☰) agora aparece em qualquer tamanho de tela (antes sumia numa faixa de largura de tablet). Se ainda não aparecer, dê um **Ctrl+Shift+R**.

---

*Dúvida que não está aqui? Anota e manda — a gente adiciona neste guia.*
