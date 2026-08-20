-- Bononi Compras — alteração ADITIVA da view comp_produtos_consolidado
-- Acrescenta 1 coluna no fim (não altera as colunas existentes → não quebra telas atuais):
--   fora_linha — 'S'/'N' (max() entre as empresas; se qualquer linha da empresa estiver
--                marcada fora de linha no Firebird, o produto consolidado também fica).
-- Uso: filtrar produto descontinuado fora da tela Compras (baseFiltradaAlertas, compras.js).
-- Rodar no Supabase (projeto vishxwdxqiygbxmtpfoy) com aprovação do Leo.

CREATE OR REPLACE VIEW comp_produtos_consolidado AS
 WITH estoque AS (
         SELECT d.id_produto, d.referencia, d.nome, d.grupo, d.subgrupo, d.curva_abc_qtd, d.curva_abc_valor,
            sum(d.estoque_fisico) AS estoque_total,
            sum(d.estoque_reserva) AS reserva_total,
            max(d.preco_compra) AS preco_compra,
            max(d.dt_ultima_compra) AS dt_ultima_compra,
            max(d.dt_ultima_venda) AS dt_ultima_venda,
            max(d.fora_linha) AS fora_linha
           FROM ( SELECT DISTINCT ON (vw_fb_produtos_compras.id_produto, vw_fb_produtos_compras.id_empresa)
                    vw_fb_produtos_compras.id_produto, vw_fb_produtos_compras.id_empresa,
                    vw_fb_produtos_compras.referencia, vw_fb_produtos_compras.nome,
                    vw_fb_produtos_compras.grupo, vw_fb_produtos_compras.subgrupo,
                    vw_fb_produtos_compras.curva_abc_qtd, vw_fb_produtos_compras.curva_abc_valor,
                    vw_fb_produtos_compras.estoque_fisico, vw_fb_produtos_compras.estoque_reserva,
                    vw_fb_produtos_compras.preco_compra, vw_fb_produtos_compras.dt_ultima_compra,
                    vw_fb_produtos_compras.dt_ultima_venda, vw_fb_produtos_compras.fora_linha
                   FROM vw_fb_produtos_compras
                  ORDER BY vw_fb_produtos_compras.id_produto, vw_fb_produtos_compras.id_empresa) d
          GROUP BY d.id_produto, d.referencia, d.nome, d.grupo, d.subgrupo, d.curva_abc_qtd, d.curva_abc_valor
        ), consumo_agg AS (
         SELECT comp_consumo_limpo.id_produto,
            sum(comp_consumo_limpo.saida_90d) AS saida_90d_total,
            sum(comp_consumo_limpo.consumo_diario_90d) AS consumo_diario_total,
            sum(comp_consumo_limpo.saida_365d) AS saida_365d_total,
            sum(comp_consumo_limpo.consumo_diario) AS consumo_diario_365d_total
           FROM comp_consumo_limpo
          GROUP BY comp_consumo_limpo.id_produto
        ), pedidos_grupo AS (
         SELECT comp_pedidos_compra_limpo.id_produto,
            sum(comp_pedidos_compra_limpo.qtd_solicitada) AS pedido_aberto_total
           FROM comp_pedidos_compra_limpo
          WHERE comp_pedidos_compra_limpo.pedido_cancelado = 'N'::bpchar AND comp_pedidos_compra_limpo.gerou_nf = 'N'::bpchar AND comp_pedidos_compra_limpo.status_pedido::text = 'F'::text
          GROUP BY comp_pedidos_compra_limpo.id_produto
        ), mov AS (
         SELECT vw_fb_mov_estoque.id_produto, vw_fb_mov_estoque.data_mov, vw_fb_mov_estoque.hora_mov, vw_fb_mov_estoque.id,
                CASE WHEN vw_fb_mov_estoque.tipo_es = 'E'::bpchar THEN vw_fb_mov_estoque.qtd ELSE - vw_fb_mov_estoque.qtd END AS delta
           FROM vw_fb_mov_estoque
        ), saldo_apos AS (
         SELECT m.id_produto, m.data_mov,
            e.estoque_total - COALESCE(sum(m.delta) OVER (
              PARTITION BY m.id_produto
              ORDER BY m.data_mov DESC, m.hora_mov DESC, m.id DESC
              ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
            ), 0::double precision) AS saldo_apos_evento
           FROM mov m
           JOIN estoque e ON e.id_produto = m.id_produto
        ), carregado AS (
         SELECT DISTINCT ON (saldo_apos.id_produto) saldo_apos.id_produto, saldo_apos.saldo_apos_evento AS saldo_carregado
           FROM saldo_apos
          WHERE saldo_apos.data_mov <= (CURRENT_DATE - 90)
          ORDER BY saldo_apos.id_produto, saldo_apos.data_mov DESC
        ), janela AS (
         SELECT saldo_apos.id_produto, min(saldo_apos.saldo_apos_evento) AS min_no_periodo
           FROM saldo_apos
          WHERE saldo_apos.data_mov >= (CURRENT_DATE - 90)
          GROUP BY saldo_apos.id_produto
        ), continuidade AS (
         SELECT e.id_produto,
            LEAST(COALESCE(c.saldo_carregado, e.estoque_total), COALESCE(j.min_no_periodo, e.estoque_total)) AS min_saldo_3m
           FROM estoque e
           LEFT JOIN carregado c ON c.id_produto = e.id_produto
           LEFT JOIN janela j ON j.id_produto = e.id_produto
        ), calc AS (
         SELECT e.id_produto, e.referencia, e.nome, e.grupo, e.subgrupo, e.curva_abc_qtd, e.curva_abc_valor,
            e.estoque_total, e.reserva_total, e.preco_compra, e.dt_ultima_compra, e.dt_ultima_venda, e.fora_linha,
            COALESCE(c.saida_90d_total, 0::double precision) AS saida_90d_total,
            COALESCE(c.consumo_diario_total, 0::double precision) AS consumo_diario_total,
            COALESCE(c.saida_365d_total, 0::double precision) AS saida_365d_total,
            COALESCE(c.consumo_diario_365d_total, 0::double precision) AS consumo_diario_365d_total,
            COALESCE(p.pedido_aberto_total, 0::double precision) AS pedido_aberto_total,
            cont.min_saldo_3m,
                CASE
                    WHEN COALESCE(c.saida_90d_total, 0::double precision) = 0::double precision THEN
                    CASE
                        WHEN e.estoque_total > 0::double precision THEN 9999::double precision
                        ELSE NULL::double precision
                    END
                    ELSE GREATEST(e.estoque_total, 0::double precision) / (COALESCE(c.saida_90d_total, 0::double precision) / 90.0::double precision)
                END AS cobertura_dias,
            GREATEST(0::double precision, COALESCE(c.consumo_diario_total, 0::double precision) * 45::double precision - GREATEST(e.estoque_total, 0::double precision) - COALESCE(p.pedido_aberto_total, 0::double precision)) AS qtd_sugerida
           FROM estoque e
             LEFT JOIN consumo_agg c ON c.id_produto = e.id_produto
             LEFT JOIN pedidos_grupo p ON p.id_produto = e.id_produto
             LEFT JOIN continuidade cont ON cont.id_produto = e.id_produto
        )
 SELECT id_produto, referencia, nome, grupo, subgrupo, curva_abc_qtd, curva_abc_valor,
    estoque_total, reserva_total, pedido_aberto_total, saida_90d_total, consumo_diario_total,
    preco_compra, dt_ultima_compra, dt_ultima_venda, cobertura_dias, qtd_sugerida,
        CASE
            WHEN consumo_diario_total = 0::double precision AND saida_90d_total = 0::double precision THEN
                CASE WHEN COALESCE(min_saldo_3m, 0::double precision) > 0::double precision
                     THEN 'ESTOQUE_MORTO'::text
                     ELSE 'SEM_GIRO'::text
                END
            WHEN estoque_total <= 0::double precision THEN 'RUPTURA'::text
            WHEN cobertura_dias < 15::double precision THEN 'CRITICO'::text
            WHEN cobertura_dias < 30::double precision THEN 'BAIXO'::text
            ELSE 'OK'::text
        END AS situacao_estoque,
    saida_365d_total, consumo_diario_365d_total,
    (COALESCE(saida_365d_total, 0::double precision) > 0::double precision AND COALESCE(saida_365d_total, 0::double precision) <= 12::double precision) AS esporadico,
    fora_linha
   FROM calc;
