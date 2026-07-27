-- Bononi Compras — alteração ADITIVA da view comp_produtos_consolidado
-- Acrescenta 3 colunas no fim (não altera as 18 existentes → não quebra telas atuais):
--   saida_365d_total          — saídas nos últimos 365 dias (soma das empresas)
--   consumo_diario_365d_total — consumo diário base 365d
--   esporadico                — flag de baixo giro (vende, mas <= 12/ano ~ <= 1/mês)
-- Rodar no Supabase (projeto vishxwdxqiygbxmtpfoy) com aprovação do Leo.
-- Ver PLANO-DE-ACAO.md §5.1.

CREATE OR REPLACE VIEW comp_produtos_consolidado AS
 WITH estoque AS (
         SELECT vw_fb_produtos_compras.id_produto,
            vw_fb_produtos_compras.referencia,
            vw_fb_produtos_compras.nome,
            vw_fb_produtos_compras.grupo,
            vw_fb_produtos_compras.subgrupo,
            vw_fb_produtos_compras.curva_abc_qtd,
            vw_fb_produtos_compras.curva_abc_valor,
            sum(vw_fb_produtos_compras.estoque_fisico) AS estoque_total,
            sum(vw_fb_produtos_compras.estoque_reserva) AS reserva_total,
            max(vw_fb_produtos_compras.preco_compra) AS preco_compra,
            max(vw_fb_produtos_compras.dt_ultima_compra) AS dt_ultima_compra,
            max(vw_fb_produtos_compras.dt_ultima_venda) AS dt_ultima_venda
           FROM vw_fb_produtos_compras
          GROUP BY vw_fb_produtos_compras.id_produto, vw_fb_produtos_compras.referencia, vw_fb_produtos_compras.nome, vw_fb_produtos_compras.grupo, vw_fb_produtos_compras.subgrupo, vw_fb_produtos_compras.curva_abc_qtd, vw_fb_produtos_compras.curva_abc_valor
        ), consumo_agg AS (
         SELECT vw_consumo_unificado.id_produto,
            sum(vw_consumo_unificado.saida_90d) AS saida_90d_total,
            sum(vw_consumo_unificado.consumo_diario_90d) AS consumo_diario_total,
            sum(vw_consumo_unificado.saida_365d) AS saida_365d_total,
            sum(vw_consumo_unificado.consumo_diario) AS consumo_diario_365d_total
           FROM vw_consumo_unificado
          GROUP BY vw_consumo_unificado.id_produto
        ), pedidos_grupo AS (
         SELECT vw_fb_pedidos_compra.id_produto,
            sum(vw_fb_pedidos_compra.qtd_solicitada) AS pedido_aberto_total
           FROM vw_fb_pedidos_compra
          WHERE ((vw_fb_pedidos_compra.pedido_cancelado = 'N'::bpchar) AND (vw_fb_pedidos_compra.gerou_nf = 'N'::bpchar) AND ((vw_fb_pedidos_compra.status_pedido)::text = 'F'::text))
          GROUP BY vw_fb_pedidos_compra.id_produto
        ), calc AS (
         SELECT e.id_produto, e.referencia, e.nome, e.grupo, e.subgrupo, e.curva_abc_qtd, e.curva_abc_valor,
            e.estoque_total, e.reserva_total, e.preco_compra, e.dt_ultima_compra, e.dt_ultima_venda,
            COALESCE(c.saida_90d_total, (0)::double precision) AS saida_90d_total,
            COALESCE(c.consumo_diario_total, (0)::double precision) AS consumo_diario_total,
            COALESCE(c.saida_365d_total, (0)::double precision) AS saida_365d_total,
            COALESCE(c.consumo_diario_365d_total, (0)::double precision) AS consumo_diario_365d_total,
            COALESCE(p.pedido_aberto_total, (0)::double precision) AS pedido_aberto_total,
                CASE
                    WHEN (COALESCE(c.saida_90d_total, (0)::double precision) = (0)::double precision) THEN
                    CASE
                        WHEN (e.estoque_total > (0)::double precision) THEN (9999)::double precision
                        ELSE NULL::double precision
                    END
                    ELSE (GREATEST(e.estoque_total, (0)::double precision) / (COALESCE(c.saida_90d_total, (0)::double precision) / (90.0)::double precision))
                END AS cobertura_dias,
            GREATEST((0)::double precision, (((COALESCE(c.consumo_diario_total, (0)::double precision) * (45)::double precision) - GREATEST(e.estoque_total, (0)::double precision)) - COALESCE(p.pedido_aberto_total, (0)::double precision))) AS qtd_sugerida
           FROM ((estoque e
             LEFT JOIN consumo_agg c ON ((c.id_produto = e.id_produto)))
             LEFT JOIN pedidos_grupo p ON ((p.id_produto = e.id_produto)))
        )
 SELECT id_produto,
    referencia,
    nome,
    grupo,
    subgrupo,
    curva_abc_qtd,
    curva_abc_valor,
    estoque_total,
    reserva_total,
    pedido_aberto_total,
    saida_90d_total,
    consumo_diario_total,
    preco_compra,
    dt_ultima_compra,
    dt_ultima_venda,
    cobertura_dias,
    qtd_sugerida,
        CASE
            WHEN ((consumo_diario_total = (0)::double precision) AND (saida_90d_total = (0)::double precision)) THEN 'SEM_MOVIMENTO'::text
            WHEN (estoque_total <= (0)::double precision) THEN 'RUPTURA'::text
            WHEN (cobertura_dias < (15)::double precision) THEN 'CRITICO'::text
            WHEN (cobertura_dias < (30)::double precision) THEN 'BAIXO'::text
            ELSE 'OK'::text
        END AS situacao_estoque,
    saida_365d_total,
    consumo_diario_365d_total,
    (COALESCE(saida_365d_total, (0)::double precision) > (0)::double precision AND COALESCE(saida_365d_total, (0)::double precision) <= (12)::double precision) AS esporadico
   FROM calc;
