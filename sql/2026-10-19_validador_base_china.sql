-- 2026-10-19 - Validador de Produto + Base China (app Compras, fase 1).
-- CRIA 8 tabelas novas (val_* e china_*) e semeia parametros, 3 familias e 1 viagem.
-- NAO altera nem apaga nada que ja existe. Pre-voo em producao: nenhuma tabela val_/china_ existia.
-- Acesso ao modulo e filtrado na aplicacao (user_metadata.modulos); aqui so exigimos sessao
-- autenticada, mesmo padrao do pmkt_* (bononi-precifica-marketplace 0001).
-- Sem begin/commit: o arquivo roda como uma transacao so (sql.py), serve para --ensaio e --escrever.

create table if not exists public.val_parametros (
  chave text primary key,
  valor text not null,
  descricao text,
  atualizado_em timestamptz not null default now(),
  atualizado_por text
);

create table if not exists public.val_familias (
  id bigint generated always as identity primary key,
  nome text not null,
  fator_nacionalizacao numeric(6,3) not null check (fator_nacionalizacao > 0),
  meta_margem_pct numeric(5,2),            -- null = usa a meta do canal em val_parametros
  ativo boolean not null default true,
  atualizado_em timestamptz not null default now(),
  atualizado_por text
);
create unique index if not exists val_familias_nome_uniq on public.val_familias (lower(trim(nome)));

create table if not exists public.val_cambio (
  data date primary key,
  valor numeric(8,4) not null check (valor > 0),
  origem text not null default 'manual' check (origem in ('manual','awesomeapi')),
  criado_por text,
  criado_em timestamptz not null default now()
);

create table if not exists public.china_viagens (
  id bigint generated always as identity primary key,
  nome text not null,
  data_ini date,
  data_fim date,
  criado_em timestamptz not null default now()
);

create table if not exists public.china_fornecedores (
  id bigint generated always as identity primary key,
  empresa text not null,
  cidade text,
  contato_pessoa text,
  wechat text,
  email text,
  telefone text,
  site_alibaba text,
  id_viagem bigint references public.china_viagens(id) on delete set null,
  nota_confianca int check (nota_confianca between 1 and 5),
  ja_comprou boolean not null default false,
  id_fornecedor_sga int,                   -- vinculo opcional com vw_fb_contatos (cadastro do SGA)
  tags text[] not null default '{}',
  observacao text,
  criado_por text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create unique index if not exists china_fornecedores_empresa_uniq on public.china_fornecedores (lower(trim(empresa)));

create table if not exists public.china_produtos_fornecedor (
  id bigint generated always as identity primary key,
  id_fornecedor bigint not null references public.china_fornecedores(id) on delete cascade,
  produto text not null,
  categoria text,
  fob_usd numeric(12,2),
  moq int,
  specs text,
  foto_url text,
  criado_em timestamptz not null default now()
);
create unique index if not exists china_prod_forn_uniq on public.china_produtos_fornecedor (id_fornecedor, lower(trim(produto)));

create table if not exists public.val_produtos (
  id bigint generated always as identity primary key,
  nome text not null,
  id_familia bigint references public.val_familias(id),
  canal_alvo text not null default 'marketplace' check (canal_alvo in ('marketplace','stonni')),
  origem text,
  link_referencia text,
  preco_alvo_mkt numeric(12,2),
  fob_usd numeric(12,2),
  moq int,
  qtd_planejada int,
  frete_cliente numeric(12,2),             -- frete pago pela empresa na venda (null = padrao em val_parametros)
  id_china_fornecedor bigint references public.china_fornecedores(id) on delete set null,
  id_china_produto bigint references public.china_produtos_fornecedor(id) on delete set null,
  peso_kg numeric(8,3),
  altura_cm numeric(8,1),
  largura_cm numeric(8,1),
  comprimento_cm numeric(8,1),
  volume_mercado int,                      -- vendas/mes observadas (digitado na fase 1)
  concorrentes_qtd int,
  status text not null default 'PAUTA' check (status in ('PAUTA','TRIADO','AMOSTRA','GO','COMPRADO','LANCADO','NO_GO')),
  score numeric(5,1),
  margem_calc numeric(7,4),
  custo_landed_calc numeric(12,2),
  cambio_usado numeric(8,4),
  fator_usado numeric(6,3),
  referencia_sga text,                     -- preenchido ao "graduar" para o cadastro do SGA
  id_import_processo text,                 -- fase 3: vinculo com import_processos
  observacoes text,
  criado_por text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists val_produtos_status_idx on public.val_produtos (status);

create table if not exists public.val_historico (
  id bigint generated always as identity primary key,
  id_val_produto bigint not null references public.val_produtos(id) on delete cascade,
  calculado_em timestamptz not null default now(),
  por text,
  fob_usd numeric(12,2),
  cambio numeric(8,4),
  fator numeric(6,3),
  preco_alvo numeric(12,2),
  taxa_pct numeric(5,2),
  imposto_pct numeric(5,2),
  frete numeric(12,2),
  custo_landed numeric(12,2),
  receita_liquida numeric(12,2),
  margem_pct numeric(7,4),
  score numeric(5,1),
  resultado text not null check (resultado in ('GO','NO_GO'))
);
create index if not exists val_historico_prod_idx on public.val_historico (id_val_produto, calculado_em desc);

alter table public.val_parametros enable row level security;
alter table public.val_familias enable row level security;
alter table public.val_cambio enable row level security;
alter table public.china_viagens enable row level security;
alter table public.china_fornecedores enable row level security;
alter table public.china_produtos_fornecedor enable row level security;
alter table public.val_produtos enable row level security;
alter table public.val_historico enable row level security;

create policy val_parametros_auth on public.val_parametros for all to authenticated using (true) with check (true);
create policy val_familias_auth on public.val_familias for all to authenticated using (true) with check (true);
create policy val_cambio_auth on public.val_cambio for all to authenticated using (true) with check (true);
create policy china_viagens_auth on public.china_viagens for all to authenticated using (true) with check (true);
create policy china_fornecedores_auth on public.china_fornecedores for all to authenticated using (true) with check (true);
create policy china_produtos_fornecedor_auth on public.china_produtos_fornecedor for all to authenticated using (true) with check (true);
create policy val_produtos_auth on public.val_produtos for all to authenticated using (true) with check (true);
create policy val_historico_auth on public.val_historico for all to authenticated using (true) with check (true);

-- Seed. Taxa e imposto: Mercado Livre classico, marca "outras" (white-label), lidos de
-- pmkt_regras_canal em 19/10/2026 (comissao 12% + custo operacional 10% = 22%; imposto 18%).
-- Sao pontos de partida editaveis na tela de Parametros, nao constantes de codigo.
insert into public.val_parametros (chave, valor, descricao) values
  ('score_peso_margem',       '50',  'Peso da margem no score (0-100). Os 4 pesos sao renormalizados.'),
  ('score_peso_volume',       '20',  'Peso do volume de mercado no score.'),
  ('score_peso_concorrencia', '15',  'Peso da concorrencia no score.'),
  ('score_peso_logistica',    '15',  'Peso da logistica (peso e volume) no score.'),
  ('meta_margem_marketplace', '40',  'Meta de margem de contribuicao (%) para marketplace sem marca (plano do Leo).'),
  ('meta_margem_stonni',      '30',  'Meta de margem de contribuicao (%) para a marca Stonni (plano do Leo).'),
  ('taxa_mkt_pct',            '22',  'Taxa do marketplace (%): ML classico, marca outras = comissao 12 + custo operacional 10 (pmkt_regras_canal, 19/10/2026).'),
  ('imposto_venda_pct',       '18',  'Imposto sobre a venda (%): ML marca outras (pmkt_regras_canal, 19/10/2026).'),
  ('frete_cliente_padrao',    '0',   'Frete pago pela empresa na venda (R$), usado quando o candidato nao informa.'),
  ('cambio_fallback',         '5.40','Cambio usado quando nao ha cotacao gravada em val_cambio.')
on conflict (chave) do nothing;

insert into public.val_familias (nome, fator_nacionalizacao) values
  ('Ar Condicionado', 1.810),
  ('Geladeira', 1.800),
  ('Gerador', 1.520)
on conflict do nothing;

insert into public.china_viagens (nome, data_ini, data_fim)
select 'Canton Out/2026', null, null
where not exists (select 1 from public.china_viagens where nome = 'Canton Out/2026');

-- Voltar (nada existia antes; apaga so o que este arquivo criou):
-- drop table if exists public.val_historico, public.val_produtos, public.china_produtos_fornecedor,
--   public.china_fornecedores, public.china_viagens, public.val_cambio, public.val_familias, public.val_parametros;
