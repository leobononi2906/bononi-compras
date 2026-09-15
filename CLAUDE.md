# Compras (bononi-compras) — guia do projeto

> **Estado atual, pendências e dev-log: `docs/STATUS.md`.** Este arquivo é só o que é estável.
> Contexto do grupo e regras de banco: skill `bononi-contexto`. Rodar local: `rodar-app`.
> Publicar: `publicar-e-conferir`. Registrar o que foi feito: `registrar-status`.

## O que é

App de **reposição/compras por gestão de exceção**: entrega à equipe uma worklist priorizada — o
que comprar, de quem, quanto — em cima do mesmo estoque e giro do ERP. Substitui a agenda em papel
e o uso do ERP cru.

## Onde está

- **Clone nesta máquina (`ecommerce06`):** `C:\Aplicações da bononi\bononi-compras`.
  ⚠️ Cópias soltas em `Documents/hub/compras` e `Downloads` estão desatualizadas — nunca editar lá.
- **Remote:** `leobononi2906/bononi-compras`, branch `main`. **Push na `main` = produção**, e a
  equipe usa no dia a dia.
- **Deploy:** https://bononi-compras.vercel.app
- **Supabase:** `vishxwdxqiygbxmtpfoy`, prefixo `comp_`.
- **Local:** `preview_start { name: "compras" }` → porta 5287 (banco de teste, faixa laranja).

## Stack

HTML + JS puro, sem build: `index.html` + `compras.js` + `ds/bononi-ds.css`. Design system
aplicado em 14/09/2026 — receituário em `docs/2026-09-14-design-system.md`.

## Armadilhas deste repo

- **`compras.js` é uma IIFE com lista de export no fim.** Função chamada por `onclick` que não
  estiver nessa lista é `ReferenceError` mudo: a tela abre e o botão não faz nada. Cada app do
  grupo torna função global de um jeito diferente — aqui é este.
- **`vw_fb_forn_prod` é o vínculo produto↔fornecedor, não o cadastro.** O cadastro é
  `vw_fb_contatos`, e ele **não** traz a classificação Cliente/Fornecedor. Confundir os dois dá
  contagem errada de fornecedor.
- **`--radius-sm` significa coisas diferentes** no CSS antigo deste app (8px) e no design system
  (3px). Ao mexer na ponte de variáveis, compare a lista de nomes do `:root` com a dos tokens
  **antes** de escrever — nome que colide vira `--x: var(--x)`, CSS inválido descartado calado.
- **Chart.js não entende `var()`.** Passar token para o gráfico não dá erro: ele descarta e desenha
  transparente. A paleta precisa resolver o token em runtime com `getComputedStyle`.
- **Rótulo que alimenta `<option>` e é gravado no banco fica só com texto** — aqui `IMP_TIPOS_PAG`
  vai para `comp_audit_log.descricao`, e ícone ali vira lixo persistido.
- Regra de CSS que precise vencer estilo legado injetado por JS ganha por **especificidade**
  (`input.search-input`), não por ordem: o bloco injetado é anexado depois.
