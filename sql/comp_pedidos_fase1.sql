-- Bononi Compras — Pedido de Compra persistente (Fase 1)  [APLICADO 06/08/2026]
-- Tabelas do cabeçalho + itens. RLS off (padrão das demais tabelas comp_/balanco_).
-- Fase 1 = salvar / listar / editar rascunho. Fase 2 (futuro): finalizar + imprimir.

CREATE TABLE IF NOT EXISTS public.comp_pedidos (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  empresa        text,                                -- texto livre (digitado no salvar)
  criado_por     text,                                -- nome do login
  criado_por_email text,
  status         text NOT NULL DEFAULT 'rascunho',    -- rascunho | finalizado
  observacao     text,
  total_itens    integer DEFAULT 0,
  total_valor    numeric DEFAULT 0,
  criado_em      timestamptz DEFAULT now(),
  atualizado_em  timestamptz DEFAULT now(),
  finalizado_em  timestamptz
);

CREATE TABLE IF NOT EXISTS public.comp_pedido_itens (
  id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pedido_id      bigint NOT NULL REFERENCES public.comp_pedidos(id) ON DELETE CASCADE,
  id_produto     integer,
  referencia     text,
  nome           text,
  qtd            numeric DEFAULT 0,
  preco_unit     numeric DEFAULT 0,
  id_fornecedor  integer,
  nome_fornecedor text
);

CREATE INDEX IF NOT EXISTS idx_comp_pedido_itens_pedido ON public.comp_pedido_itens(pedido_id);
CREATE INDEX IF NOT EXISTS idx_comp_pedidos_status ON public.comp_pedidos(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.comp_pedidos      TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comp_pedido_itens TO anon, authenticated;
