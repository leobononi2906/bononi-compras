# Importação — o card "Fornecedor" não mostrava o fornecedor (14/09/2026)

## O sintoma
Processo **ZHONGSHAN – ZM 26088301215** aparecia com o card **FORNECEDOR** escrito
"Nenhum pedido vinculado", mesmo com o fornecedor cadastrado no SGA
(código **89577**, ZHONGSHAN ZHIDING ELECTRIC APPLIANCE, Classificação ✔ Fornecedor, Ativo).

## Eram dois bugs somados

### 1. O card só sabia ler fornecedor de pedido vinculado
Em `loadImpTabInfo`, o fallback para `p.nome_fornecedor` (o fornecedor gravado no próprio
processo) vivia **dentro** do ramo `if (numPedidos.length > 0)`. Processo sem pedido caía no
`else`, que só escrevia o texto e deixava `fornPedido = null`. Havia ainda um
`else if (p.nome_fornecedor)` **inalcançável** — encadeado depois de um
`else if (numPedidos.length > 0)` que, dentro daquele bloco, é sempre verdadeiro.

Não era só o ZHONGSHAN: dos 27 processos, **6 não têm pedido vinculado e 5 deles tinham o
nome do fornecedor gravado no banco sem aparecer na tela** (ZHEJIANG, BOWENTE, 875278950366,
Waltery WAT 260203, FOSHAN).

**Conserto:** o fallback saiu para depois do `try`, valendo para os dois casos (sem pedido, ou
pedido sem fornecedor), e usa `p.id_fornecedor` no "Cód.". O `else if` morto foi removido.
O texto de vazio virou "Não informado — edite o processo para definir o fornecedor" (o antigo
descrevia pedido, não fornecedor).

### 2. O autocomplete buscava na fonte errada
`buscarFornecedorImport` procurava em **`vw_fb_forn_prod`**, que é o **vínculo
produto↔fornecedor** (a aba de fornecedores dentro do cadastro do produto) — não o cadastro de
fornecedores. Fornecedor recém-cadastrado, sem compra e sem produto amarrado, tem **0 linhas**
ali. Resultado: digitar "ZHONGSHAN" não sugeria nada, não dava para selecionar, e o processo
salvava com `id_fornecedor` e `nome_fornecedor` nulos. FOSHAN/WALTERY/UNIONTECH funcionavam
porque já têm histórico.

**Conserto:** busca nas duas fontes em paralelo. `vw_fb_forn_prod` primeiro (os já conhecidos),
e `vw_fb_contatos` (o cadastro do SGA, só `situacao='A'`) completa o que faltou. Os ids são o
**mesmo espaço** (`id_contato == id_fornecedor` — conferido: 38287 = FOSHAN nos dois), então dá
para cruzar sem risco de gravar id errado.

> ⚠️ A replicação **não traz a classificação** Cliente/Fornecedor/Funcionário que existe na tela
> do SGA. Por isso quem aparece só pelo cadastro leva o selo **"cadastro"** com tooltip pedindo
> conferência. O conserto limpo seria o replicador trazer essa classificação e aí filtrar de
> verdade — fica como próximo passo.

## Teste
Local (`serve-staging.py`, porta 5287) contra o banco de teste, com schema e seed novos em
`.claude/staging-sql/16_comp_importacao.sql` e `17_comp_importacao_seed.sql`. Três casos:

| Caso | Antes | Depois |
|---|---|---|
| Sem pedido, COM fornecedor gravado | "Nenhum pedido vinculado" | `FOSHAN SHUNDE ARIER APPLIANCE CO. LTD · Cód. 38287` |
| Sem pedido e SEM fornecedor (ZHONGSHAN) | "Nenhum pedido vinculado" | "Não informado — edite o processo…" |
| COM pedido vinculado (regressão) | fornecedor do pedido | `NINGBO WALTERY INTERNATIONAL TRADE CO · Cód. 40835` + tabela de produtos |

Autocomplete: "ZHONGSHAN" → 1 sugestão (id 89577, selo "cadastro"); "WALTERY" → NINGBO WALTERY
sem selo (fonte primária intacta); selecionar grava `id=89577` e o nome nos campos ocultos.

## Fica pendente (não é código, é cadastro)
- **O ZHONGSHAN está com UMUARAMA/PR, não `EX`.** O lead time detecta importado por
  `vw_fb_contatos.uf='EX'` → 100 dias; com PR ele entra como nacional de 15 dias e a Qtd
  Sugerida / filtro "🔴 Vai faltar" subestimam. Corrigir no SGA.
  Mesmo problema em WUXI HUIZHONG (82286) e QINDAO ZHONGCHENG (78551/78552, duplicado), com `uf` nulo.
- **Vincular o ZHONGSHAN aos produtos** que ele fornece no SGA. Sem isso ele continua fora da
  coluna Fornecedor da tela Compras, do agrupamento do Comprar Agora e da aba Fornecedores do
  drawer — todas leem só `vw_fb_forn_prod`.
