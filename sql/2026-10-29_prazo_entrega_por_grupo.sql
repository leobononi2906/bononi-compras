-- 2026-10-29 - Prazo de entrega por grupo de produto (pedido do Leo).
-- CRIA 1 tabela nova, vazia. NAO altera nem apaga nada que ja existe.
-- Grupo sem linha aqui = 15 dias (padrao aplicado no compras.js, leadDe).
-- Chave = nome do grupo como vem em comp_produtos_consolidado.grupo (texto, mesmo padrao do
-- comp_ignorados). Se o ERP renomear um grupo, a linha antiga fica orfa e o grupo volta a 15 dias.
-- Substitui, no filtro "Vai faltar", o prazo por fornecedor (comp_produto_lead), que nunca foi
-- ajustado por ninguem (100 dias China / 15 resto, automatico).

create table if not exists public.comp_prazo_grupo (
  grupo text primary key,
  prazo_dias integer not null check (prazo_dias between 1 and 365),
  atualizado_em timestamptz not null default now(),
  atualizado_por text
);

alter table public.comp_prazo_grupo enable row level security;
create policy comp_prazo_grupo_auth on public.comp_prazo_grupo
  for all to authenticated using (true) with check (true);

-- Volta (vale enquanto ninguem depender dos prazos digitados):
-- drop table public.comp_prazo_grupo;
