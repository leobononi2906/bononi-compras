# Plano de Ação — Bononi Compras

**Consolidado em:** 26/07/2026
**O que é:** o mapa único de tudo que já fizemos e tudo que falta. Documenta as decisões da sessão de 26/07. Complementa (não substitui) os docs de detalhe: [CONTEXTO-TECNICO](CONTEXTO-TECNICO.md), [DIVIDA-TECNICA](DIVIDA-TECNICA.md), [PESQUISA-DEMANDA-E-REPOSICAO](PESQUISA-DEMANDA-E-REPOSICAO.md), [GUIA-DE-USO](GUIA-DE-USO.md), [CHANGELOG](CHANGELOG.md).

---

## 1. Contexto e objetivo

O app existe para responder: **"o que precisamos comprar agora, quanto e de quem?"** — foco em **demanda/reposição**.

Problema real levantado pelo Leo:
- A **equipe de compras usa o ERP direto** (dados mais pobres), **não este app**. Processo atual ruim: agendam em **papel** quando ligar pro fornecedor.
- O app tem **excesso de informação** e **alarmes falsos** (grita vermelho em item já resolvido).
- Os **sinais de demanda e ABC enganam** (ver §3).

Meta: tornar o app **mais fácil e confiável** que o ERP, pra equipe migrar — começando por uma tela de **prioridade** clara.

---

## 2. Onde estamos (feito na sessão de 26/07/2026)

| Entrega | Status |
|---|---|
| Pasta oficial virou clone real do GitHub; docs em `docs/` | ✅ |
| **Fix do drawer "na lateral"** (`transform: translateX(100%)`) | ✅ local |
| **Alertas simplificada**: situação unificada no semáforo (5º card "Sem Movimento"), sem `select` redundante, persiste ao trocar filtro; tabela 11→9 colunas (Grupo fora, ABC vira etiqueta); ordenação unificada; foco em demanda (bloco "Pedido" removido) | ✅ local |
| **Tela "🎯 Comprar Agora"** (worklist priorizada por fornecedor, gestão por exceção) | ✅ local |
| Pesquisa do estado da arte (17 afirmações verificadas) | ✅ ver doc |
| Diagnóstico do produto ref 000086 | ✅ ver §3 |
| SQL aditivo da view (365d + flag esporádico) | ✅ **aplicado em produção 28/07** |
| ABC por valor + etiqueta esporádico na exibição (P0.2) | ✅ **em produção 28/07** |
| "🚚 a caminho" no Alertas p/ item já pedido (P0.3) | ✅ **em produção 28/07** |

> Tudo em **branch local**, **sem push** (produção intacta). Publicar = push da branch → preview Vercel → merge na `main` após OK.

---

## 3. Diagnóstico central — o produto ref 000086 (CABO CAPO MB 1618/1935)

Venda real: **3 unidades no ano** (1 empresa 1 + 2 empresa 2). O que a tela mostra e por quê:

| Campo | Valor | Causa (view `comp_produtos_consolidado`) |
|---|---|---|
| ABC | **A** | `curva_abc_qtd` vem **cru do ERP** (por quantidade). Por **valor** é **C**. Base poluída por não-movimentados → 3 vendas/ano caem em "A". |
| Qtd Sugerida | **0** | `GREATEST(0, consumo_diário×45 − estoque − pedido_aberto)` = `0,011×45 − 0 − 1` = negativo → 0. Já tem 1 pedido. |
| Ruptura | 🔴 | Estoque 0 com giro. **Alarme falso de ação** (1 já vindo). |
| Cobertura | 0d | Sem sentido para item esporádico. |

**Os 3 defeitos da lógica de demanda (na view, que é nossa):**
1. **Meta de 45 dias fixa** — ignora lead time (fatal na importação).
2. **Sem estoque de segurança** — garante ruptura entre pedidos.
3. **Demanda = saídas/calendário** — subestima quem ficou sem estoque ("não se vende o que não se tem") → **círculo vicioso de ruptura**.

Detalhe conceitual completo em [PESQUISA-DEMANDA-E-REPOSICAO §0](PESQUISA-DEMANDA-E-REPOSICAO.md).

---

## 4. Backlog priorizado

### P0 — Fundamentos (fazem os números pararem de enganar)
| # | Item | Depende de | Obs |
|---|---|---|---|
| P0.1 | ✅ **FEITO 28/07** — SQL aditivo aplicado em produção: expõe `saida_365d_total`, `consumo_diario_365d_total`, flag `esporadico`. Não quebrou nada (aditivo). | — | Frontend usa a flag real automaticamente (fallback já existia). |
| P0.2 | ✅ **FEITO 28/07** — exibição por `curva_abc_valor` (Alertas + gráfico Totais + payload IA) e etiqueta esporádico no Alertas. | P0.1 | Corrigiu o "2 vendas = A" (ABC virou Pareto real 127/282/2458). |
| P0.3 | ✅ **FEITO 28/07** — Alertas mostra "🚚 a caminho" (azul) em vez de vermelho quando `pedido_aberto > 0` e `qtd_sugerida = 0`. Helper `itemCoberto`. | — | Matou o ruído (76 dos 520 vermelhos viram "a caminho"). Semáforo/contagem inalterados. |

### P1 — Ação e usabilidade
| # | Item | Depende de |
|---|---|---|
| P1.1 | **Comprar Agora** — refinar com "pedir até (data)" e agrupamento por fornecedor com ações | lead time (P2.1) |
| P1.2 | **Simplificar o Drawer** — decisão no topo, 3-4 números essenciais, resto recolhido | — |
| P1.3 | ✅ **FEITO 28/07** — hambúrguer visível até 900px (override `.menu-toggle` no CSS injetado). | — |
| P1.4 | Definir se **"Comprar Agora" vira a tela inicial** (landing) da equipe | decisão do Leo |
| P1.5 | ✅ **FEITO 28/07** — nova tela **🧹 Estoque Parado** (encalhe priorizado por capital parado; ordena por valor/qtd; janela "sem venda" configurável; desconsidera ignorados). Totais tb passou a desconsiderar ignorados. | — |
| P1.6 | **Unificar Totais de Estoque + Fornecedores** numa aba só (reduzir abas / simplificar) | — |
| P1.7 | **Filtrar "falsos fornecedores"** no ranking: notas de retorno (ex.: Unisa açúcar) e empresas do grupo não são fornecedores reais | levantar os ids/nomes |

### P2 — Qualidade do cálculo (precisa de dados novos)
| # | Item | Depende de |
|---|---|---|
| P2.1 | **Lead time real** — pedir à TI `id_pedido` na `vw_fb_historico_compras`, ou definir lead time padrão por fornecedor/importação | TI |
| P2.2 | **Demanda sobre dias com estoque** (corrige viés de disponibilidade) | histórico de saldo (não disponível hoje) |
| P2.3 | **Meta por lead time + estoque de segurança** (fórmula da pesquisa §1.1) e **nível de serviço por segmento** (A: 95–98%; C/Z: 85–90%) | P2.1 |
| P2.4 | **Estoque em trânsito na posição** (importação): posição = em mãos − reservas + em trânsito | — |
| P2.5 | **XYZ real** (coeficiente de variação) — precisa de demanda mensal em buckets | fonte mensal |

### P3 — Dívida e robustez (ver [DIVIDA-TECNICA](DIVIDA-TECNICA.md))
- Error/empty states faltantes em `loadTotais`, `loadFornecedores`, `loadImportacao`.
- Limpeza gradual do CSS órfão do shell antigo (cart-panel 240px, `.main`, etc.).
- Remover controles de carrinho remanescentes em Alertas (caixa de seleção, ➕) se confirmarmos que pedido não é usado.
- `app_logs` → `comp_logs`.

---

## 5. SQL pendente

### 5.1 Aditivo (PRONTO — rodar quando a permissão for liberada)
Não quebra nada: mantém as 18 colunas atuais e **acrescenta** 3 no fim (`saida_365d_total`, `consumo_diario_365d_total`, `esporadico`). O SQL completo está versionado em [`../sql/comp_produtos_consolidado__add_365d_esporadico.sql`](../sql/comp_produtos_consolidado__add_365d_esporadico.sql).
Regra `esporadico`: `saida_365d_total > 0 AND <= 12` (vende, mas ≤ ~1/mês no ano). Heurística ajustável — XYZ real (CV) fica para P2.5.

### 5.2 Reforma da fórmula (PROPOSTA — NÃO rodar ainda)
Trocar a meta de 45 dias por `consumo × (lead_time + ciclo) + estoque_segurança`, com nível de serviço por segmento. **Bloqueado por dados** (lead time P2.1, dias-com-estoque P2.2) e por ser mudança de comportamento em produção. Só depois de P2.1/P2.2 e com OK.

---

## 6. Próximo projeto — quebrar o monolito + página melhorada

Hoje o app é **`index.html` + `compras.js` (~3.700 linhas)**. Um erro de sintaxe em qualquer linha derruba a tela inteira, e um bug vaza entre telas. O padrão Bononi (skill `bononi-padrao §5.0`) manda **dividir por responsabilidade** e isolar falhas.

### Arquitetura alvo (HTML/JS puro, sem framework novo)
```
index.html      ← shell: login, sidebar, topbar, CSS, ordem dos <script>
core.js         ← globais (sb, usuário), helpers (fmt, fmtQtd, badges), bononiLog
comprar.js      ← tela Comprar Agora
alertas.js      ← tela Alertas
drawer.js       ← drawer de produto
importacao.js   ← Importação (kanban/pagamentos/docs)
balanco.js      ← Balanço físico
fornecedores.js ← Fornecedores
config.js       ← Configurações
```
- Cada `<script>` é interpretado de forma independente: erro em `importacao.js` **não** impede `comprar.js` de carregar.
- Toda `load*()` dentro de `try/catch` com Error State **na área da tela** (isolamento de falha).
- **Regra de ouro:** quebrar **gradualmente**, um pedaço por vez, só ao mexer no trecho por outro motivo — não refazer tudo de uma vez (refactor grande de código que funciona cria bug novo).

### "Página melhorada"
A tela **Comprar Agora** já nasce nesse espírito (gestão por exceção, poucos números, agrupada por fornecedor). O próximo projeto a consolida como **a página principal** da equipe, com a lógica de demanda corrigida (P2) por trás.

### Ordem sugerida da quebra
1. Extrair `core.js` (globais + helpers + CSS do shell — resolve de vez a dívida de CSS injetado).
2. Extrair `comprar.js` e `drawer.js` (as telas que vamos evoluir).
3. Extrair as demais conforme formos mexendo nelas.

---

## 7. Dependências externas
- **TI / ERP:** incluir `id_pedido` na `vw_fb_historico_compras` (vínculo pedido↔NF) para lead time real. Sem isso, lead time fica em default por fornecedor.

---

## 8. Como publicar (combinado)
Nada vai pra `main` sem OK do Leo. Fluxo: branch → **push** → preview automático da Vercel → testar → **merge na main** (aí sim vai pra produção/equipe). O SQL de produção (§5) roda no Supabase à parte, com OK.
