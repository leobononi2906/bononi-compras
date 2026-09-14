# Design system da marca aplicado ao Compras (14/09/2026)

Terceiro app do grupo a receber o "Bononi Acessórios Design System", depois do
`bononi-exped` (Tailwind, 11/09) e do `bononi-hub` (HTML puro, 14/09). O Compras é o
mesmo caso do Hub — `index.html` + `compras.js`, sem build — então a receita dele foi
seguida de perto.

**Escopo decidido com o Leo:** paleta, tipografia e ícones. **Layout e composição das telas
não mudaram** — nada de SectionHeader, abas novas ou paginação recomposta. Nenhuma query,
RPC, tabela ou Edge Function foi tocada: é mudança só de camada visual, e é isso que torna
`git revert` uma saída segura, porque não há estado de banco pra desfazer junto.

## O que entrou

| | |
|---|---|
| `ds/bononi-ds.css` | Tokens do DS, cópia byte a byte da do Hub. **Não editar à mão** — regenera do pacote. |
| `assets/logo-bononi*.png` | Assinatura da marca (mesmos bytes do Hub e do exped). |
| Fontes | Archivo (título) · Barlow (interface) · IBM Plex Mono (número), por `<link>` com `preconnect`. Saíram DM Sans e DM Mono. |

O `<link>` do DS leva cache-buster (`?v=20260914a`). Sem build, é o que garante que a troca
chega em quem já visitou — o `index.html` não tem cache-buster próprio, só o `compras.js`.

## A ponte de variáveis

O `:root` antigo virou uma ponte: cada nome da versão azul aponta pro token do DS. É o que
faz os ~930 `style` inline e os 9,6 KB de CSS que o `compras.js` injeta herdarem a paleta
**sem reescrever um por um** — aquele bloco consome 19 desses nomes e não declara nenhum.

O azul de ação virou **tinta** (`--action-primary`, #14161a). O vermelho da marca fica
reservado pro acento, no máximo um por tela.

### ⚠️ Três nomes colidiam com o DS

Armadilha que o Hub não teve (lá os nomes velhos eram `--blue`, `--muted`, `--dim`). Aqui,
uma linha de ponte `--x: var(--x)` é **auto-referência: CSS inválido, descartado em
silêncio**. Os três saíram da ponte:

| Nome | App antes | DS | O que foi feito |
|---|---|---|---|
| `--text-muted` | `#9AA5B8` (2,6:1 — reprova no próprio DS) | `#6b7382` (5,1:1) | linha apagada; vale o do DS |
| `--radius-sm` | 8px | 3px (chip) | linha apagada; os 33 usos, todos de controle, foram pro `--radius-md` (5px) |
| `--sidebar-w` | 228px | 232px | linha apagada; o `left:240px` hardcoded do CSS injetado virou `var(--sidebar-w)` |

O antídoto do `base.css` vem colado na ponte, como no Hub: ele estiliza todo `<a>` como link
vermelho sublinhado, e os 10 `<a>` do Compras são todos item de navegação da sidebar.

## Cor que carrega informação

A regra ao consolidar: **onde a cor é a informação, puxar da rampa base, não do alias
semântico** — senão dois valores distintos caem no mesmo token e a distinção morre. As seis
situações de estoque, que precisavam continuar distinguíveis:

| Situação | Token | Por quê |
|---|---|---|
| Ruptura | `--bnn-red-700` | o DS só tem um âmbar, então ruptura e crítico |
| Crítico | `--bnn-red-500` | se separam por profundidade de vermelho |
| Baixo | `--bnn-amber-500` | |
| OK | `--bnn-green-500` | |
| Estoque morto | `--bnn-ink-900` | dinheiro parado |
| Sem giro | `--bnn-gray-500`, **ponto vazado** | o par morto × sem giro é o mais caro de errar |

O rótulo sempre acompanha — estado nunca é comunicado só por cor. O `--purple`, que não
existe no DS, saiu para `--bnn-blue-500` (curva ABC, etiqueta de tipo).

### 🚨 Chart.js não entende `var()`

Gráfico desenha em **canvas**. Passar `var(--bnn-red-700)` pro Chart.js **não dá erro**: ele
descarta e desenha transparente. As 4 paletas (sazonalidade, curva ABC, situação, ranking de
fornecedores) resolvem o token em tempo de execução, pelo helper `cssVar()` no topo do
`compras.js`. Quem mexer em cor de gráfico depois precisa lembrar disso.

## Emoji → ícones

Lucide pintado como CSS mask, herdando `currentColor`, com `MutationObserver` hidratando
`[data-ic]` — as telas são montadas por `innerHTML` em dezenas de pontos, e sem o observer
seria preciso lembrar de hidratar em cada um. Trocar de set depois = mudar só a constante
`LUCIDE`. **77 viraram ícone, 112 saíram** (texto puro ou sem substituto).

**A decisão que evita a classe de bug mais chata aqui:** o ícone entra sempre na forma HTML
literal `<i class="ic ic-sm" data-ic="nome"></i>`, nunca como `${ic(...)}`. Ela não precisa
de interpolação, então funciona igual dentro de crase, de aspas simples e de HTML estático,
e só usa aspas duplas — nunca termina a string que a contém. A primeira tentativa usou
`${ic(...)}` e quebrou o arquivo em 36 pontos, porque `${}` só interpola em crase e a aspas
interna do próprio helper fechava a string. Foi preciso restaurar do git e refazer.

Casos que não viraram ícone, de propósito:

- **As 6 situações do semáforo** viraram o **ponto do badge** (`::before`), que é a forma que o
  DS pede: *"Badge sempre traz o texto do estado, e o dot é reforço, não a informação"*. Seis
  ícones circulares a 14px seriam indistinguíveis entre si.
- **`IMP_TIPOS_PAG` e `acaoLabel`** ficaram só com texto. A mesma string vira `<option>` (que
  não renderiza markup) **e** é gravada em `comp_audit_log.descricao` no Supabase. Ícone ali
  viraria lixo no banco.
- **Setas `→ ← ↔` em prosa** ficaram: são tipografia, não ícone, e o DS permite.
- **Ordenação de coluna** virou triângulo em CSS, lido do `data-sort` do `<th>`. Antes era
  `↕/↑/↓` escrito por `textContent`, que não aceita markup — a troca de mecanismo eliminou 4
  dos sites sem HTML de graça.
- **Chevrons** viraram um glifo só, girado por classe. **Atenção:** as três telas discordavam
  da convenção (o carrinho usava `▼` fechado / `▲` aberto, o inverso das outras duas). Ficou
  a convenção da maioria: fechado aponta pra direita.
- **Lupa dos campos de busca** voltou como `background-image` no próprio campo — era emoji
  dentro do `placeholder`, que não aceita markup. A regra usa `input.search-input` **de
  propósito**: o CSS injetado pelo `compras.js` é anexado depois e redeclara `.search-input`
  com o atalho `background:`, que zeraria a lupa. Vence por especificidade, não por ordem.

## Consertos que vieram junto

- **`.last-update` era branco sobre branco.** O CSS injetado o pintava com
  `rgba(255,255,255,0.3)` e o elemento vive na topbar branca — o "Atualizado HH:MM" estava
  invisível. Conserto de cor, entrou na varredura.
- **O par do multiselect nunca foi um check.** `'\xe2\x9c\x93'` são os bytes UTF-8 do ✓
  escapados numa string JS — o JS lê como um `â` mais dois caracteres de controle invisíveis.
  Virou `square-check` / `square`.
- **`filter: grayscale(1)` na estrela não fazia nada** depois da migração: ícone mascarado é
  um retângulo pintado com `currentColor`, não tem cor pra dessaturar. A diferença
  ligado/desligado passou a ser a própria cor (âmbar × cinza apagado).
- **3 gradientes removidos** — o DS proíbe em sistema interno. Dois já tinham virado
  tinta-para-tinta pela ponte, invisíveis; saíram de vez.

## Verificação

Banco de teste estendido antes de tocar no app (`.claude/staging-sql/18_comp_telas.sql` e
`19_comp_telas_seed.sql`): dos 31 objetos que o app lê, 11 existiam e **20 foram criados**, e o
`comp_produtos_consolidado` ganhou as 15 colunas que faltavam — ele já existia como stub de 7
colunas do Portal, então foi `ALTER`, nunca `DROP`. Seed cobre as 6 situações do semáforo,
pedido com itens, estoque parado, movimentações, balanço e logs.

Checagens que passaram: `node --check`; **zero hex** fora do `ds/`; zero raio literal; zero
fonte literal; zero alpha concatenado em hex; todo `var()` resolve (`--ic` e `--ic-busca` são
definidos pelo JS em runtime, por isso não aparecem no CSS). As 9 telas e os drawers
renderizam com todos os ícones hidratados e sem `${` ou `var(--` vazando como texto.

A auditoria do diff linha a linha — a que o Hub registra como a que pega o que grep nenhum
pega — achou **um** caso real: os gradientes. Os demais alertas eram falso-positivo do
alinhamento do diff.

## ⚠️ Regressão que escapou — botões só-ícone ficaram vazios

Achada pelo Leo na aba Pagamentos da Importação, no mesmo dia: o lápis de editar
sumiu (e com ele o acesso à observação do pagamento, que só existe dentro do modal
que o lápis abre).

**Causa:** o script de migração decidia por **linha inteira** se o contexto aceitava
HTML, procurando `showToast(` / `.textContent` / `placeholder=` / `<option`. Várias
linhas deste app são templates de 200+ caracteres que misturam os dois contextos —
basta um `placeholder=` em qualquer ponto da linha para que TODOS os emoji dela
fossem apagados em vez de virar ícone, inclusive os que estavam em HTML legítimo.

**Quatro botões só-ícone ficaram sem conteúdo:** editar e remover pagamento
(`loadImpTabPagamentos`), enviar do chat, e remover documento anexado. Mais o
`↓ Relatório` do rodapé do carrinho, que ficou com a seta crua.

**Como achar de novo, se acontecer:** o sinal preciso é elemento só-ícone que ficou
vazio —

```bash
grep -oE '<(button|span|a|summary)[^>]*title="[^"]*"[^>]*>\s*</(button|span|a|summary)>' compras.js
grep -oE '<button[^>]*onclick="[^"]*"[^>]*>\s*</button>' compras.js
```

Os dois têm de dar zero. A auditoria completa (comparar cada linha com emoji da
versão anterior contra a contagem de `data-ic` na atual) separa remoção intencional
de perda real, mas exige olhar caso a caso: placeholder, semáforo e setas de
ordenação saem de propósito.

**A lição para o próximo app:** decidir contexto por linha não serve em arquivo com
template literal longo. O certo é decidir por **ocorrência**, olhando o que cerca
aquele emoji — ou, mais barato, rodar o grep de elemento vazio logo depois.

## Pendências

- **O CSS de shell antigo injetado pelo `compras.js` (L4–13, 9,6 KB) continua lá**, com 32
  classes colidindo com o `index.html`. A ponte cobre a cor dele, então o DS chegou junto —
  mas a dívida de layout segue (o carrinho ainda fica 12px desalinhado, por `left:240px`
  hardcoded). Está em `DIVIDA-TECNICA.md`.
- **Archivo/Barlow/IBM Plex Mono e o Lucide são substitutos** do pacote, servidos por Google
  Fonts e unpkg com versão fixada. Fonte licenciada e SVG da marca são pendências do DS.
- **Só existe logotipo PNG** — serrilha em tela grande.
- **Emoji antigo continua em `comp_audit_log.descricao`** nas linhas já gravadas. O painel de
  histórico vai mostrar linhas antigas com emoji e novas sem. Não é bug, mas parece um; limpar
  seria `UPDATE` em produção, que passa por revisão antes.
