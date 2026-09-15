# Documentação — Bononi Compras

Base de conhecimento do módulo de Compras do Grupo Bononi Acessórios.
Esta pasta **substitui** todos os contextos de compras dispersos em outras sessões/arquivos.

| Arquivo | Para quê serve | Público |
|---|---|---|
| [PLANO-DE-ACAO.md](PLANO-DE-ACAO.md) | **Mapa mestre**: o que já foi feito e o backlog priorizado de tudo que falta | Leo / dev |
| [GUIA-DE-USO.md](GUIA-DE-USO.md) | Como usar o sistema no dia a dia, tela por tela | **Equipe de compras** |
| [CONTEXTO-TECNICO.md](CONTEXTO-TECNICO.md) | Arquitetura, tabelas, views, mapa do código | Dev / Leo |
| [DIVIDA-TECNICA.md](DIVIDA-TECNICA.md) | Bugs conhecidos, layout, backlog de simplificação | Dev / Leo |
| [PESQUISA-DEMANDA-E-REPOSICAO.md](PESQUISA-DEMANDA-E-REPOSICAO.md) | Estado da arte de demanda/reposição + por que a demanda/ABC de hoje engana + recomendações | Leo / produto |
| [CHANGELOG.md](CHANGELOG.md) | Registro de tudo que muda, por data | Todos |
| [STATUS.md](STATUS.md) | Estado atual em produção, tela por tela, por data | Leo / dev |
| [2026-09-14-design-system.md](2026-09-14-design-system.md) | Aplicação do design system da marca | Dev |
| [2026-09-14-fornecedor-importacao.md](2026-09-14-fornecedor-importacao.md) | Fornecedor no card de importação | Dev |

## Fatos rápidos

- **Repo:** github.com/leobononi2906/bononi-compras
- **Deploy:** https://bononi-compras.vercel.app — **auto-deploy a cada push na `main`** (vai direto pra produção)
- **Supabase:** `vishxwdxqiygbxmtpfoy` (sa-east-1)
- **Stack:** HTML + JS puro, dois arquivos — `index.html` (shell, ~740 linhas) + `compras.js` (~5.400 linhas)

## A armadilha que custou um dia (15/09/2026)

**`compras.js` inteiro é um IIFE** — `;(function(){ 'use strict'; … })()`. Nada
existe no escopo global a menos que esteja na lista de `window.X = X` perto do
fim do arquivo.

Uma tela nova subiu sem esses exports: a fila montava certinho (o loader é
chamado de dentro do módulo) e **todo `onclick` era um `ReferenceError` mudo** —
filtros, botões, salvar. Um dia inteiro no ar assim, sem erro visível.

> **Antes de publicar tela nova:** listar os `onclick="nome("` dela e conferir um
> a um que `nome` está exportado. No navegador, `typeof window.nome` é a prova —
> o arquivo carregar não é.

Duas irmãs dessa, no mesmo repo:
- **`index.html` não tem cache-bust** (o `compras.js` tem, via `?v=Date.now()`).
- **Datas por recorte de texto**, nunca `new Date('2026-09-14')` — vira
  meia-noite UTC e aparece como 13/09 no fuso de Brasília.

## Como trabalhar aqui (fluxo combinado)

1. Editar código/docs **neste clone** (`Projetos GitHub/bononi-compras`).
2. Mostrar a mudança e testar **antes** de publicar.
3. Publicar só depois do OK. Ideal: subir numa **branch** primeiro → a Vercel gera uma URL de preview → testar lá → só então juntar na `main` (produção).

> As cópias antigas em `Documents/hub/compras` e `Downloads` estão **desatualizadas** — ignorar.
