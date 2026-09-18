-- Campo livre para anotar o número/identificação do invoice do fornecedor
-- ligado ao pedido de peça da Garantia. Nullable, não quebra linha existente.
alter table prt_solicitacao_peca
  add column if not exists invoice text;
