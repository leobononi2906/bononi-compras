-- 2026-10-06 - Impede dois processos de importacao com o mesmo codigo
-- (ignora maiuscula/minuscula e espacos nas pontas; codigo vazio/nulo fica livre).
-- Pre-voo em producao: 32 processos, 32 codigos distintos, 0 duplicatas.
-- Se houver duplicata na hora de aplicar, o CREATE falha sozinho e NAO apaga nada:
-- resolver as copias (filhos em import_pedidos/import_pagamentos/import_documentos) antes.
create unique index if not exists import_processos_codigo_uniq
  on public.import_processos (lower(trim(codigo)))
  where codigo is not null and trim(codigo) <> '';

-- Voltar:
-- drop index if exists public.import_processos_codigo_uniq;
