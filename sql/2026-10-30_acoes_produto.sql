-- 2026-10-30 - Historico de acoes por produto (pedido de melhoria 28, Lucas - Compras).
-- Ex.: produto 10018/8 vende 50/mes, mas no mes passado vendeu 500 por uma acao do atacado.
-- A acao fica gravada no produto e aparece na ficha (aba "Acoes" e marca no mes do giro),
-- para o comprador nao repor como se a venda extra fosse demanda normal.
-- CRIA 1 tabela nova, vazia. NAO altera nem apaga nada que ja existe. Nao mexe no SGA nem no Bling.
-- aplicada em produção em 2026-10-30 (RLS ligado, 1 policy authenticated, 0 linhas).
-- id_produto = mesmo id de comp_produtos_consolidado (integer, sem FK: a materialized view nao aceita).

create table if not exists public.comp_produto_acoes (
  id bigint generated always as identity primary key,
  id_produto integer not null,
  data_inicio date not null,
  data_fim date,
  descricao text not null check (length(trim(descricao)) > 0),
  qtd_extra numeric check (qtd_extra is null or qtd_extra >= 0),
  criado_em timestamptz not null default now(),
  criado_por text,
  check (data_fim is null or data_fim >= data_inicio)
);

create index if not exists comp_produto_acoes_produto_idx on public.comp_produto_acoes (id_produto, data_inicio desc);

alter table public.comp_produto_acoes enable row level security;
create policy comp_produto_acoes_auth on public.comp_produto_acoes
  for all to authenticated using (true) with check (true);

-- Volta (vale enquanto ninguem depender das acoes digitadas):
-- drop table public.comp_produto_acoes;
