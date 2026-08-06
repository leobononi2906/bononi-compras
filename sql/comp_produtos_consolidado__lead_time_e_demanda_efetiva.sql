-- Bononi Compras — alteração da view comp_produtos_consolidado
-- Reunião 06/08/2026 (Leo). NÃO aplicar sem o "go" do Leo (view de PRODUÇÃO).
--
-- ESCOPO (revisado): SOMENTE lead time. NÃO consolida estoque+comprado na
--   cobertura nem no semáforo (Leo recuou nessa parte). A cobertura continua
--   FÍSICA. A sugestão (qtd_sugerida) já subtrai o pedido em aberto — inalterado.
--
-- O que muda:
--  1) LEAD TIME por produto = lead do FORNECEDOR PRINCIPAL (maior volume comprado
--     no histórico), com PISO de 15 dias; acima disso usa a média
--     (comp_lead_time_forn.lead_time_medio).
--  2) CRÍTICO passa a ser de fato "cobertura < lead time" (antes era fixo < 15).
--     Como o piso é 15, itens com lead 15 mantêm o comportamento atual;
--     itens com fornecedor mais lento disparam Crítico mais cedo (mais prazo pra reagir).
--
-- Coluna NOVA acrescentada no fim (aditivo, não quebra telas atuais):
--  lead_time_efetivo  — lead do fornecedor principal, piso 15d (usado no Crítico)

CREATE OR REPLACE VIEW comp_produtos_consolidado AS
 WITH estoque AS (
         SELECT p.id_produto, p.referencia, p.nome, p.grupo, p.subgrupo,
            p.curva_abc_qtd, p.curva_abc_valor,
            sum(p.estoque_fisico)   AS estoque_total,
            sum(p.estoque_reserva)  AS reserva_total,
            max(p.preco_compra)     AS preco_compra,
            max(p.dt_ultima_compra) AS dt_ultima_compra,
            max(p.dt_ultima_venda)  AS dt_ultima_venda
           FROM vw_fb_produtos_compras p
          GROUP BY p.id_produto, p.referencia, p.nome, p.grupo, p.subgrupo, p.curva_abc_qtd, p.curva_abc_valor
        ), consumo_agg AS (
         SELECT c.id_produto,
            sum(c.saida_90d)          AS saida_90d_total,
            sum(c.consumo_diario_90d) AS consumo_diario_total,
            sum(c.saida_365d)         AS saida_365d_total,
            sum(c.consumo_diario)     AS consumo_diario_365d_total
           FROM vw_consumo_unificado c
          GROUP BY c.id_produto
        ), pedidos_grupo AS (
         SELECT pc.id_produto,
            sum(pc.qtd_solicitada) AS pedido_aberto_total
           FROM vw_fb_pedidos_compra pc
          WHERE pc.pedido_cancelado = 'N'::bpchar AND pc.gerou_nf = 'N'::bpchar AND (pc.status_pedido)::text = 'F'::text
          GROUP BY pc.id_produto
        ),
        -- Fornecedor principal do produto = maior volume comprado no histórico
        hist_forn AS (
         SELECT h.id_produto, h.id_fornecedor, sum(h.qtd) AS qtd_tot
           FROM vw_fb_historico_compras h
          WHERE h.qtd > 0
          GROUP BY h.id_produto, h.id_fornecedor
        ),
        principal AS (
         SELECT DISTINCT ON (hf.id_produto) hf.id_produto, hf.id_fornecedor
           FROM hist_forn hf
          ORDER BY hf.id_produto, hf.qtd_tot DESC
        ),
        lead_prod AS (
         SELECT pr.id_produto,
            GREATEST(15::numeric, COALESCE(lf.lead_time_medio, 15)::numeric)::double precision AS lead_time_efetivo
           FROM principal pr
           LEFT JOIN comp_lead_time_forn lf ON lf.id_fornecedor = pr.id_fornecedor
        ), calc AS (
         SELECT e.id_produto, e.referencia, e.nome, e.grupo, e.subgrupo, e.curva_abc_qtd, e.curva_abc_valor,
            e.estoque_total, e.reserva_total, e.preco_compra, e.dt_ultima_compra, e.dt_ultima_venda,
            COALESCE(c.saida_90d_total, 0::double precision)          AS saida_90d_total,
            COALESCE(c.consumo_diario_total, 0::double precision)     AS consumo_diario_total,
            COALESCE(c.saida_365d_total, 0::double precision)         AS saida_365d_total,
            COALESCE(c.consumo_diario_365d_total, 0::double precision) AS consumo_diario_365d_total,
            COALESCE(p.pedido_aberto_total, 0::double precision)      AS pedido_aberto_total,
            COALESCE(lp.lead_time_efetivo, 15::double precision)      AS lead_time_efetivo,
            -- cobertura FÍSICA (só estoque) — inalterada
                CASE
                    WHEN COALESCE(c.saida_90d_total, 0::double precision) = 0::double precision
                        THEN CASE WHEN e.estoque_total > 0::double precision THEN 9999::double precision ELSE NULL::double precision END
                    ELSE GREATEST(e.estoque_total, 0::double precision) / (COALESCE(c.saida_90d_total, 0::double precision) / 90.0::double precision)
                END AS cobertura_dias,
            -- sugestão: alvo 45d menos físico menos em aberto (inalterado)
            GREATEST(0::double precision, ((COALESCE(c.consumo_diario_total, 0::double precision) * 45::double precision) - GREATEST(e.estoque_total, 0::double precision)) - COALESCE(p.pedido_aberto_total, 0::double precision)) AS qtd_sugerida
           FROM estoque e
             LEFT JOIN consumo_agg   c  ON c.id_produto  = e.id_produto
             LEFT JOIN pedidos_grupo p  ON p.id_produto  = e.id_produto
             LEFT JOIN lead_prod     lp ON lp.id_produto = e.id_produto
        )
 SELECT id_produto, referencia, nome, grupo, subgrupo, curva_abc_qtd, curva_abc_valor,
    estoque_total, reserva_total, pedido_aberto_total, saida_90d_total, consumo_diario_total,
    preco_compra, dt_ultima_compra, dt_ultima_venda,
    cobertura_dias, qtd_sugerida,
        CASE
            WHEN (consumo_diario_total = 0::double precision AND saida_90d_total = 0::double precision) THEN 'SEM_MOVIMENTO'::text
            WHEN estoque_total <= 0::double precision THEN 'RUPTURA'::text
            WHEN cobertura_dias < lead_time_efetivo THEN 'CRITICO'::text
            WHEN cobertura_dias < 30::double precision THEN 'BAIXO'::text
            ELSE 'OK'::text
        END AS situacao_estoque,
    saida_365d_total, consumo_diario_365d_total,
    (COALESCE(saida_365d_total, 0::double precision) > 0::double precision AND COALESCE(saida_365d_total, 0::double precision) <= 12::double precision) AS esporadico,
    -- NOVA coluna (aditiva)
    lead_time_efetivo
   FROM calc;
