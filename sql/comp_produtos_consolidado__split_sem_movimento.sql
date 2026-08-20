-- Bononi Compras — split de SEM_MOVIMENTO em ESTOQUE_MORTO x SEM_GIRO
-- Decidido com o Leo em 19/08/2026 (re-split "Sem movimento", pendência registrada em 17/08).
--
-- Regra:
--   ESTOQUE_MORTO = sem saída em 90d E teve saldo > 0 de forma CONTÍNUA nos últimos 90 dias
--                   (nunca zerou/negativou no período reconstruído) — "tinha pra vender e não vendeu".
--   SEM_GIRO      = sem saída em 90d, mas o saldo reconstruído zerou/negativou em algum ponto
--                   dos últimos 90 dias (ficou sem estoque disponível parte do tempo) —
--                   não dá pra afirmar que "tinha e não vendeu".
--   Erro de contagem: descartado como bucket — decisão do Leo (19/08/2026).
--
-- Reconstrução de saldo: não existe histórico de saldo de estoque na base (comp_historico_m2
-- só tem consumo mensal + 1 snapshot de estoque, sem série temporal). Único jeito real de saber
-- saldo passado é reconstruir de trás pra frente a partir de vw_fb_mov_estoque (cobre 02/09/2025
-- em diante, ~11,5 meses — suficiente pra janela de 90d) usando estoque_total (hoje) como âncora:
--   saldo_apos_evento[i] = estoque_total - soma(delta dos eventos MAIS RECENTES que i)
-- onde delta = qtd se tipo_es='E' (entrada), -qtd se tipo_es='S' (saída).
--
-- min_saldo_3m = menor saldo do produto nos últimos 90 dias, considerando:
--   - o saldo "carregado" (saldo_apos do último evento ANTES da janela, ou estoque_total se não há
--     evento algum antes da janela — nesse caso o saldo não mudou, então não há evidência de zerar)
--   - o mínimo entre os eventos DENTRO da janela de 90d
-- Produto sem nenhuma movimentação nos últimos 90d = saldo ficou constante = não zerou (correto).
--
-- Rodar no Supabase (projeto vishxwdxqiygbxmtpfoy) com aprovação do Leo.

CREATE OR REPLACE VIEW comp_produtos_consolidado AS
 WITH estoque AS (
         SELECT d.id_produto, d.referencia, d.nome, d.grupo, d.subgrupo, d.curva_abc_qtd, d.curva_abc_valor,
            sum(d.estoque_fisico) AS estoque_total,
            sum(d.estoque_reserva) AS reserva_total,
            max(d.preco_compra) AS preco_compra,
            max(d.dt_ultima_compra) AS dt_ultima_compra,
            max(d.dt_ultima_venda) AS dt_ultima_venda
           FROM ( SELECT DISTINCT ON (vw_fb_produtos_compras.id_produto, vw_fb_produtos_compras.id_empresa)
                    vw_fb_produtos_compras.id_produto, vw_fb_produtos_compras.id_empresa,
                    vw_fb_produtos_compras.referencia, vw_fb_produtos_compras.nome,
                    vw_fb_produtos_compras.grupo, vw_fb_produtos_compras.subgrupo,
                    vw_fb_produtos_compras.curva_abc_qtd, vw_fb_produtos_compras.curva_abc_valor,
                    vw_fb_produtos_compras.estoque_fisico, vw_fb_produtos_compras.estoque_reserva,
                    vw_fb_produtos_compras.preco_compra, vw_fb_produtos_compras.dt_ultima_compra,
                    vw_fb_produtos_compras.dt_ultima_venda
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
         SELECT id_produto, data_mov, hora_mov, id,
            CASE WHEN tipo_es = 'E' THEN qtd ELSE -qtd END AS delta
           FROM vw_fb_mov_estoque
        ), saldo_apos AS (
         SELECT m.id_produto, m.data_mov,
            e.estoque_total - COALESCE(SUM(m.delta) OVER (
              PARTITION BY m.id_produto
              ORDER BY m.data_mov DESC, m.hora_mov DESC, m.id DESC
              ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING
            ), 0) AS saldo_apos_evento
           FROM mov m
           JOIN estoque e ON e.id_produto = m.id_produto
        ), carregado AS (
         SELECT DISTINCT ON (id_produto) id_produto, saldo_apos_evento AS saldo_carregado
           FROM saldo_apos
          WHERE data_mov <= CURRENT_DATE - 90
          ORDER BY id_produto, data_mov DESC
        ), janela AS (
         SELECT id_produto, MIN(saldo_apos_evento) AS min_no_periodo
           FROM saldo_apos
          WHERE data_mov >= CURRENT_DATE - 90
          GROUP BY id_produto
        ), continuidade AS (
         SELECT e.id_produto,
            LEAST(COALESCE(c.saldo_carregado, e.estoque_total), COALESCE(j.min_no_periodo, e.estoque_total)) AS min_saldo_3m
           FROM estoque e
           LEFT JOIN carregado c ON c.id_produto = e.id_produto
           LEFT JOIN janela j ON j.id_produto = e.id_produto
        ), calc AS (
         SELECT e.id_produto, e.referencia, e.nome, e.grupo, e.subgrupo, e.curva_abc_qtd, e.curva_abc_valor,
            e.estoque_total, e.reserva_total, e.preco_compra, e.dt_ultima_compra, e.dt_ultima_venda,
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
    (COALESCE(saida_365d_total, 0::double precision) > 0::double precision AND COALESCE(saida_365d_total, 0::double precision) <= 12::double precision) AS esporadico
   FROM calc;
