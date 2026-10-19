# Validador de Produto + Base China (fase 1)

Origem: `PLANO_VALIDADOR_PRODUTO.md` (Leo). Decisões de 19/10/2026: mora no app Compras; acesso por
módulo novo `validador` no Hub.

## Fórmula

```
custo_landed = FOB_US$ × câmbio × fator_da_família
receita_liq  = preço_alvo − preço×taxa_mkt% − preço×imposto% − frete
margem       = (receita_liq − custo_landed) / receita_liq
GO           = margem ≥ meta (da família; senão a do canal)
```

Também mostra o **preço mínimo** e o **FOB máximo** que batem a meta (a margem dá exatamente a meta
quando se usa um deles). Metas de partida: marketplace 40%, Stonni 30%.

## Score (0 a 100)

Média ponderada de quatro notas. Critério sem dado sai da conta e os pesos restantes são
renormalizados (candidato sem volume de mercado não é punido).

| Critério | Peso | Nota 100 | Nota 0 |
|---|---:|---|---|
| Margem | 50 | meta + 20 pontos | margem zero (abaixo da meta vale até 60) |
| Volume de mercado | 20 | 1.000 vendas/mês | sem vendas |
| Concorrência | 15 | até 3 vendedores | 30 ou mais |
| Logística | 15 | até 1 kg e 10 litros | 30 kg e 200 litros |

Pesos, taxa, imposto, metas e frete padrão ficam em `val_parametros`; fatores e meta por família em
`val_familias` (tela Parâmetros, só admin do Validador).

## De onde vêm os números de partida

- Taxa 22% (comissão 12 + custo operacional 10) e imposto 18%: Mercado Livre clássico, marca "outras",
  lidos de `pmkt_regras_canal` em 19/10/2026. Editáveis.
- Fatores 1,81 / 1,80 / 1,52: médias da tabela do plano. **Sem lastro nos dados do repo**: `import_pagamentos`
  só permite um fator aproximado por processo. Para calibrar por família seria preciso FOB e NCM por item
  (`import_itens`, fase 3).

## Fluxo

Pauta → Triado → Amostra → GO → Comprado → Lançado (+ NO-GO). "Validar e salvar" calcula, grava em
`val_historico` e move PAUTA→TRIADO (GO) ou →NO-GO. Da amostra em diante o movimento é manual (decisão
humana). Toda validação, inclusive NO-GO, fica no histórico; o Painel lista reprovados que virariam GO
com o câmbio de hoje.

## Base China

Fornecedores, produtos por fornecedor e viagens. "Validar" num produto cria o candidato já preenchido.
Importação por CSV (`docs/TEMPLATE_CANTON.xlsx`, salvar cada aba como CSV); repetir atualiza, não duplica.

## Limites da fase 1

Volume e concorrência são digitados (API do Mercado Livre é fase 2, exige app e token). "Graduar" para o
cadastro do SGA é manual: o campo `referencia_sga` guarda o código depois. Fase 3: card GO cria
`import_processos`.
