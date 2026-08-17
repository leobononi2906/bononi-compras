# Contexto Técnico — Bononi Compras

**Atualizado:** 16/08/2026
**Substitui:** todos os contextos de compras dispersos em outras sessões.
**Base:** commit `794c7e4` (`main`) + mapeamento completo do `compras.js`.
**Status:** produção, uso diário.

- **Repo:** github.com/leobononi2906/bononi-compras
- **Deploy:** https://bononi-compras.vercel.app — auto-deploy a cada push na `main`
- **Supabase:** `vishxwdxqiygbxmtpfoy` (sa-east-1)
- **Stack:** HTML + JS puro — `index.html` (shell) + `compras.js` (~3.612 linhas)

---

## 1. Como o módulo é montado (arquitetura de carregamento)

1. `index.html` é o **shell**: login (Supabase Auth), sidebar, topbar, todo o CSS do layout, e os helpers globais (`window.sb`, `fmt`, `fmtFull`, `getNomeEmpresa`, etc.).
2. Na 1ª navegação, o shell injeta `compras.js` dinamicamente (`<script src="compras.js?v=...">`, index.html:439-444) e chama `window.ModuloCompras.showPage()`.
3. `showPage()` (compras.js:3541-3568) roda **uma vez** (`_iniciado`): instancia os templates de `PAGINAS_HTML` e distribui os elementos:
   - IDs em `FIXED_IDS` (compras.js:3548) → movidos para `document.body`.
   - Todo o resto → dentro de `<div id="compras-pages">`, que fica em `#content-area`.

> **`FIXED_IDS`** = `chat-overlay, chat-panel, modal-historico-overlay, drawer-overlay, produto-drawer, cart-panel, toast`.
> **Não estão na lista** (e por isso vivem dentro de `#compras-pages`): `imp-drawer`, `forn-drawer`, seus overlays e `modal-processo-overlay`. Isso tem consequência de layout — ver [DIVIDA-TECNICA.md](DIVIDA-TECNICA.md).

---

## 2. Mapa do código (`compras.js`, por faixa de linha)

| Faixa | Seção |
|---|---|
| 1-12 | IIFE que injeta o CSS (linha 8) + 3 remendos de CSS (z-index / modais) |
| 15-280 | `PAGINAS_HTML` — templates das 6 páginas + chat |
| 282-291 | Constantes — `IDS_INTERGRUPO_FORN` |
| 293-308 | Variáveis globais (alertas, carrinho, charts) |
| 310-339 | Utilitários — `fmt`, `fmtQtd`, `fmtData`, `badgeSituacao`, `badgeABC` |
| 341-379 | `loadAll` / cache de fornecedores |
| 381-648 | **Alertas** — load, filtros, render, paginação |
| 650-737 | **Drawer de produto** — abrir/fechar/abas/resumo |
| 739-886 | `loadDrawerGiro` (12 meses + gráfico) |
| 888-1039 | `loadDrawerFornecedores` |
| 1040-1177 | Abas do drawer: histórico / estoque / pedido |
| 1179-1267 | **Carrinho** — add/remover/render/exportar CSV |
| 1270-1360 | **Totais de estoque** |
| 1362-1424 | **Fornecedores** — ranking |
| 1426-1516 | Drawer de fornecedor |
| 1517-1970 | **Balanço** — sessões, contagem cega, modais, CSV |
| 1972-2046 | **Importação** — load, KPIs, views, `IMP_STATUS` |
| 2048-2302 | Importação: produtos / kanban / lista + saves inline |
| 2304-2333 | Drawer de importação |
| 2335-2532 | Abas imp: info / pagamentos |
| 2533-2660 | Modais de processo (novo / editar / excluir / status) |
| 2661-2797 | Modal de vincular pedido ERP |
| 2798-2931 | **Pagamentos** — add/editar/remover |
| 2932-3024 | **Documentos** — upload/remover (Storage) |
| 3026-3149 | **Chat IA** |
| 3151-3157 | Mobile (`toggleSidebar`) |
| 3159-3173 | Init do módulo (`CMP_PAGE_LOADERS`) |
| 3175-3220 | **Auditoria** (`auditLog`) + captura global de erros |
| 3222-3437 | **Configurações** — ignorados + logs |
| 3439-3574 | Exports `window.*` + `ModuloCompras.showPage` |
| 3576-3612 | Patches finais (clique delegado + exports duplicados) |

---

## 3. As 6 telas (+ chat)

| ID | Tela | Funções-chave (linha) |
|---|---|---|
| `cmp-alertas` | Alertas e Reposição | `loadAlertas` (384), `renderAlertas` (565), `atualizarKPIs` (520) |
| `cmp-totais` | Totais de Estoque **(+ Fornecedores incorporado)** | `loadTotais` (1274, chama `loadFornecedores`), `renderTotGrupos` (1327), `renderFornecedores` |
| `cmp-balanco` | Balanço Físico | `loadBalanco` (1522), `abrirSessaoContagem` (1767), `renderContagem` (1799) |
| `cmp-importacao` | Importação | `loadImportacao` (2002), `renderImpKanban` (2169), `renderImpLista` (2217) |
| `cmp-fornecedores` | *(incorporado em Totais — só o `forn-drawer` no DOM)* | `loadFornecedores`, `abrirFornDrawer` |
| `cmp-config` | Configurações | `loadConfiguracoes` (3229), `cfgBuscarProdutos` (3250), `loadCfgLogs` (3374) |
| `cmp-chat` | Assistente IA | `abrirChat` (3026), `enviarChat` (3058) |

### Detalhes que já custaram tempo
- **Alertas — carregamento:** 12 páginas paralelas de 1.000 registros (`range(i*1000, ...)`) → até 12.000 produtos. Catálogo ~10.150 ativos. `alertasConsolidado[]` é a base em memória de todas as buscas.
- **Situações do semáforo:** Ruptura (zerado com giro), Crítico (cobertura < lead time), Baixo (cobertura < 30d), OK, Sem movimento (sem saída em 365d).
- **Lead time:** campo `lead_time_dias` da `vw_fb_historico_compras` vem **sempre zero** (o Firebird lança pedido e NF no mesmo dia; não há vínculo pedido↔NF). Pendência de TI.
- **Importação — TRANSFERIDO pode vir negativo** no banco → sempre usar `Math.abs()` ao acumular.
- **Importação — fornecedor no drawer:** busca por `id_pedido` direto na `vw_fb_pedidos_compra` (o join por produto retornava vazio). Fallback em 3 níveis.
- **Câmbio (pagamentos):** `Math.abs(BRL) / Math.abs(USD)`, 4 casas, só exibe quando há os dois.

---

## 4. Tabelas próprias (prefixo do módulo)

| Tabela | Uso |
|---|---|
| `comp_ignorados` | Produtos/grupos/subgrupos escondidos dos alertas (~1.444 itens) |
| `comp_audit_log` | Auditoria de ações (prev. chegada, obs, ignorados, pagamentos) |
| `comp_custo_snapshot_mensal` | Custo unitário congelado por competência (pg_cron dia 1, 00h05). Uso futuro: CMV/DRE do financeiro |
| `import_processos` | Processo de importação (codigo, status, importadora, datas, obs, total_usd) |
| `import_pedidos` | Pedidos vinculados ao processo |
| `import_pagamentos` | Pagamentos (tipo, valor_brl, valor_usd, status, numero_cp) |
| `import_documentos` | Anexos (Supabase Storage) |
| `balanco_sessoes` / `balanco_sessao_filtros` / `balanco_itens` | Balanço físico |
| `app_logs` | Erros JS (legado; migrar p/ `comp_logs` no futuro) |

**Tipos de pagamento da importação:**
```
IMP_TIPOS_PAG   = PAGAMENTO, NACIONALIZACAO, FRETE_MARITIMO, FRETE_RODOVIARIO, OUTROS, RECEBIDO, TRANSFERIDO
IMP_TIPOS_SOMA  = { RECEBIDO }     // soma no BRL e no USD
IMP_TIPOS_DEDUZ = { TRANSFERIDO }  // deduz do BRL e do USD (valor pode vir negativo → Math.abs)
```
Fórmula do resumo: `subtotal = normais + RECEBIDO − TRANSFERIDO` → `+10% custas` → `TOTAL BRL`.

---

## 5. Views do Firebird (SOMENTE LEITURA — nunca alterar)

| View | Uso |
|---|---|
| `vw_fb_produtos_compras` | Base de produto (estoque, preço, giro, fornecedor) |
| `vw_fb_historico_compras` | Histórico de entradas (`lead_time_dias` sempre 0) |
| `vw_fb_pedidos_compra` | Pedidos de compra |
| `vw_fb_mov_estoque` | Movimentações de O.S. |
| `vw_giro_saidas_unificado` | Saídas M2 (nov/24–out/25) + Firebird (nov/25→hoje) |
| `comp_produtos_consolidado` | View **nossa** (não-Firebird, pode evoluir) — motor de Alertas/Comprar Agora. Colunas: estoque/reserva/pedido em aberto, saída e consumo 90d **e 365d**, cobertura, `qtd_sugerida` (meta 45d − estoque − pedido), `situacao_estoque`, `curva_abc_qtd`/`curva_abc_valor` e flag `esporadico` (vende ≤12/ano). Aditivo de 28/07: +`saida_365d_total`, +`consumo_diario_365d_total`, +`esporadico`. Frontend: helpers `itemEsporadico` e `itemCoberto`. |

**Empresas na `vw_fb_produtos_compras`:** BATTOGO, BONONI PR, BONONI SC, BONONI UMUARAMA, MLB PR, MLB SC, MLB SP, OPERADOR LOGISTICO, SANTA TEREZA, TRUCKPREST.

---

## 6. Regras inegociáveis do projeto

- ❌ Views `vw_*` são **somente leitura** — jamais alterar.
- ✅ `MIN(id) GROUP BY chave` antes de agregar (deduplicação).
- ✅ `.range(0, 9999)` em toda query de listagem.
- ✅ Toda função usada em `onclick` inline precisa estar em `window.*`.
- ✅ `fetch()` direto / evitar `confirm()`/`prompt()` nativos (Safari iOS).
- ✅ Antes de qualquer INSERT/UPDATE/DELETE/CREATE: mostrar o que será feito e aguardar OK. Leituras (SELECT) livres.
- ✅ Cada sessão mexe **só** no app de Compras — não tocar financeiro, cobrança, etc.
- ✅ Views para mais de um app → prefixo `geral_`.

---

## 7. Autenticação

Login via Supabase Auth + `user_metadata`. Acesso ao módulo: `admin === true` **ou** `modulos` inclui `"compras"`.
- Admin (Leo): id `a9618f1c-7c51-41ee-aa92-ce8dd4003e91`, `leonardo@bononiacessorios.com.br`.

---

## 8. Pendências abertas

Ver [DIVIDA-TECNICA.md](DIVIDA-TECNICA.md) — layout, robustez, simplificação de UX e pendências de negócio consolidadas.

---

## 9. Armadilhas da tela de Ajustes de Estoque (`cmp-ajustes`)

**Atualizado 16/08/2026.** Fonte: `vw_fb_mov_estoque` (origem Firebird `TBL_MOV_PROD` + `TBL_ITENS_MOV_PROD`). Filtro fixo da tela: `tipo_mov='A'` (Ajuste), `cancelada='N'`, sem vínculo `id_venda/id_os/id_consumo`.

### Por que abre filtrada em "Balanço"
O `motivo` do ajuste é **texto livre e muito sujo** (não há campo de "tipo de operação" limpo como o `tipo_entrada` dos fornecedores). Ao agregar todos os ajustes, o número não representa perda/ganho real: **~R$ 3,8 mi é só estoque inicial da migração do RP**, mais reclassificações (desmonte de kit, transferência de centro, correção de código) e movimentos cujo financeiro pertence a uma venda/OS/NF. **Só "Balanço" e "Acerto" são ajuste financeiro real.** Por isso `loadAjustes` seta `aj-motivo = 'Balanço'` por padrão (o dropdown mantém os outros pra investigação).

### `categorizeMotivo(m)` — regras (ordem importa!)
Classifica por regex sobre o motivo em MAIÚSCULAS, **na ordem**:
1. `BALAN[CÇ]` ou `CONTAGEM` → **Balanço** (checado 1º de propósito: "AJUSTE REF.BALANCO" tem "AJUSTE" mas deve cair em Balanço, não em Acerto).
2. `INICIAL|INICIA|...` → Estoque inicial.
3. `INVERTID|CÓDIGO` → Código invertido.
4. `TRANSI|INTEGRA|MIGRA|M2|RP` → Transição de ERP.
5. `ACERTO|AJUSTE|CORRE|CONFER|SOBRA|FALTA` → Acerto/ajuste.
6. resto → Outros/não classificado.

O balde **"Outros/não classificado"** guarda ~R$ 1 mi de motivos ilegíveis (ex.: `AENKEAJ HSKAHG DKAL` = +R$ 784 mil, que pela cara é estoque inicial digitado errado). **Não dá pra classificar por regra** — precisa de revisão manual no ERP ou de um campo de tipo limpo.

### Um único lançamento de balanço pode ser gigante (não é bug)
Ex. real: **GELADEIRA STONNI ST 30L (ref 011488)** → uma baixa de **−1.141 un / −R$ 830 mil** (01/06/26, `AJUSTE REF.BALANCO DIA 30/05`, BONONI SC / EMP 8). É o balanço **acertando estoque fantasma da migração do RP** (o sistema tinha 1.141 geladeiras a mais que o físico). O ranking mostra isso corretamente; o valor é grande porque a divergência era grande.

### Pendências de dado (dependem da TI — ver memória `erp-firebird-schema-local`)
- **% divergente correto** (quanto do contado bateu com o sistema): exige replicar `TBL_BALANCO` + `TBL_ITENS_BALANCO` do Firebird → colunas **`QTD_ANTIGA` (saldo sistema) × `QTD_CONTADA` × `QTD_LANCADA` (ajuste efetivado)**. Hoje o ajuste no Supabase só tem o item divergente, **sem o denominador** (total contado), então o % não é calculável.
- **Autor do ajuste**: existe em `TBL_MOV_PROD.CHUSUARIO`, mas **não está exposto** em `vw_fb_mov_estoque`. Pedir à TI incluir.
