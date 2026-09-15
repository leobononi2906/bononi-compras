# Bononi Compras

App de **reposição e compras por gestão de exceção**: entrega à equipe uma
worklist priorizada — o que comprar, de quem e quanto — em cima do mesmo
estoque e giro do ERP. Substitui a agenda em papel e o uso do ERP cru.

- **Deploy:** https://bononi-compras.vercel.app — **push na `main` é produção**,
  a equipe usa no dia a dia.
- **Supabase:** `vishxwdxqiygbxmtpfoy` (sa-east-1).
- **Stack:** HTML + JS puro, sem build — `index.html` (shell) + `compras.js`.

## Telas

Compras (reposição por semáforo) · Pedidos · **Peças da Garantia** · Estoque
Parado · Totais de Estoque · Movimentações de Estoque · Balanço Físico ·
Importação · Configurações.

**Peças da Garantia** (14/09/2026) é a ponta de um ciclo que começa em outro app:
a Garantia, no **Assistência Stonni**, registra a peça que faltou no estoque;
aqui ela é comprada, com o pagamento e o **prazo de entrega** informados; a
Garantia lê o prazo e passa ao cliente.

## Antes de mexer

**`compras.js` inteiro é um IIFE.** Nada existe no escopo global a menos que
esteja na lista de `window.X = X` perto do fim do arquivo. Tela nova sem esses
exports monta perfeitamente e **nenhum botão funciona** — `onclick` roda no
global e lá não há nada com aquele nome. Não dá erro visível.

> Conferir com `typeof window.nome` no navegador. O arquivo carregar não é prova.

A equipe de compras **não é técnica**: toda tela precisa ser auto-explicativa,
com tooltip no que não for óbvio e sem jargão.

## Documentação

Tudo em [`docs/`](docs/) — comece pelo [`docs/README.md`](docs/README.md), que é
o índice. O mapa mestre do backlog é o `docs/PLANO-DE-ACAO.md`; o estado atual em
produção é o `docs/STATUS.md`.

> As cópias soltas em `Documents/hub/compras` e `Downloads` estão
> **desatualizadas** — nunca editar lá.
