import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// 28/10/2026: só quem entrou no Compras (admin global, ou `compras` em modulos/admin_modulos do
// app_metadata). Antes qualquer um com a URL usava a IA (custo) e lia/gravava sugestões de compra.
async function chamadaAutorizada(req: Request): Promise<boolean> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (!token) return false;
  const r = await fetch(`${Deno.env.get("SUPABASE_URL")}/auth/v1/user`, {
    headers: { apikey: Deno.env.get("SUPABASE_ANON_KEY") ?? "", Authorization: `Bearer ${token}` },
  }).catch(() => null);
  if (!r || !r.ok) return false;
  const m = ((await r.json().catch(() => null)) as { app_metadata?: Record<string, unknown> } | null)?.app_metadata ?? {};
  const lista = (v: unknown) => (Array.isArray(v) ? (v as string[]) : []);
  return m.admin === true || lista(m.modulos).includes("compras") || lista(m.admin_modulos).includes("compras");
}

Deno.serve(async (req: Request) => {
  if (req.method !== "OPTIONS" && !(await chamadaAutorizada(req))) {
    return new Response(JSON.stringify({ erro: "não autorizado" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const fornecedor = body?.fornecedor || 'FORNECEDOR NÃO IDENTIFICADO';
    const pergunta = body?.pergunta || '';
    const respostaIA = body?.resposta_ia || '';
    const itens = Array.isArray(body?.itens) ? body.itens : [];
    const usuario = body?.usuario || 'dashboard';

    if (!itens.length) {
      return new Response(JSON.stringify({
        sucesso: false,
        erro: 'Nenhum item enviado para sugestão.'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const valorTotal = itens.reduce((acc:any, item:any) => {
      const qtd = Number(item.qtd_confirmada || item.qtd_sugerida || 0);
      const preco = Number(item.preco_unitario || item.preco || 0);
      return acc + (qtd * preco);
    }, 0);

    const { data: sugestao, error: erroSugestao } = await supabase
      .from('compras_ia_sugestoes')
      .insert({
        fornecedor_nome: fornecedor,
        pergunta_usuario: pergunta,
        resposta_ia: respostaIA,
        criado_por: usuario,
        total_itens: itens.length,
        valor_total_estimado: valorTotal,
        status: 'SUGERIDO',
        origem: 'IA_COMPRAS'
      })
      .select()
      .single();

    if (erroSugestao) {
      throw erroSugestao;
    }

    const itensInsert = itens.map((item:any) => ({
      sugestao_id: sugestao.id,
      id_produto: item.id_produto || null,
      id_fornecedor: item.id_fornecedor || null,
      produto_nome: item.nome || item.produto || item.produto_nome,
      referencia: item.referencia || null,
      fornecedor_nome: fornecedor,
      situacao_estoque: item.situacao || item.situacao_estoque || null,
      curva_abc: item.abc || item.curva_abc || null,
      estoque_atual: Number(item.estoque || item.estoque_atual || 0),
      cobertura_dias: Number(item.cobertura || item.cobertura_dias || 0),
      consumo_diario: Number(item.consumo_diario || 0),
      pedido_aberto: Number(item.pedido_aberto || 0),
      qtd_sugerida_ia: Number(item.qtd_sugerida || 0),
      qtd_confirmada: Number(item.qtd_confirmada || item.qtd_sugerida || 0),
      preco_unitario: Number(item.preco_unitario || item.preco || 0),
      motivo_sugestao: item.motivo || 'Sugestão automática IA'
    }));

    const { error: erroItens } = await supabase
      .from('compras_ia_sugestao_itens')
      .insert(itensInsert);

    if (erroItens) {
      throw erroItens;
    }

    return new Response(JSON.stringify({
      sucesso: true,
      mensagem: 'Sugestão salva com sucesso.',
      sugestao_id: sugestao.id,
      numero_sugestao: sugestao.numero_sugestao,
      total_itens: itens.length,
      valor_total_estimado: valorTotal
    }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({
      sucesso: false,
      erro: String(e)
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});