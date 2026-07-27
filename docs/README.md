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

## Fatos rápidos

- **Repo:** github.com/leobononi2906/bononi-compras
- **Deploy:** https://bononi-compras.vercel.app — **auto-deploy a cada push na `main`** (vai direto pra produção)
- **Supabase:** `vishxwdxqiygbxmtpfoy` (sa-east-1)
- **Stack:** HTML + JS puro, dois arquivos — `index.html` (shell) + `compras.js` (~3.600 linhas)

## Como trabalhar aqui (fluxo combinado)

1. Editar código/docs **neste clone** (`Projetos GitHub/bononi-compras`).
2. Mostrar a mudança e testar **antes** de publicar.
3. Publicar só depois do OK. Ideal: subir numa **branch** primeiro → a Vercel gera uma URL de preview → testar lá → só então juntar na `main` (produção).

> As cópias antigas em `Documents/hub/compras` e `Downloads` estão **desatualizadas** — ignorar.
