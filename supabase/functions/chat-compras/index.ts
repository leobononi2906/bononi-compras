import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function norm(s: string) {
  return (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function detectarFornecedor(pergunta: string) {
  const p = norm(pergunta);
  const m = p.match(/(?:fornecedor|pedido|comprar|compra|da|do|para)\s+([a-z0-9\s\-\.]{3,40})/i);
  if (!m) return '';
  return m[1].replace(/(me|um|uma|sugestao|sugestão|pedido|compra|comprar|por favor|vc|voce|pode|dar|monta|monte)/g, '').trim();
}

function respostaFallback(pergunta: string, produtos: any[], forns: any[]) {
  const rupturas = produtos.filter((r:any) => r.situacao_estoque === 'RUPTURA');
  const criticos = produtos.filter((r:any) => r.situacao_estoque === 'CRITICO');
  const baixos = produtos.filter((r:any) => r.situacao_estoque === 'BAIXO');
  const prio: Record<string, number> = { RUPTURA: 1, CRITICO: 2, BAIXO: 3, OK: 4, SEM_MOVIMENTO: 5 };
  const abc: Record<string, number> = { A: 1, B: 2, C: 3 };

  const fornBusca = detectarFornecedor(pergunta);
  const pNorm = norm(pergunta);
  let idsFornecedor: Set<number> | null = null;
  let nomeFornecedor = '';

  if (fornBusca || pNorm.includes('rodoplast')) {
    const termo = pNorm.includes('rodoplast') ? 'rodoplast' : fornBusca;
    const matches = forns.filter((f:any) => norm(f.nome_fornecedor).includes(termo));
    idsFornecedor = new Set(matches.map((f:any) => Number(f.id_produto)));
    nomeFornecedor = matches[0]?.nome_fornecedor || termo;
  }

  let base = [...rupturas, ...criticos, ...baixos];
  if (idsFornecedor) base = base.filter((p:any) => idsFornecedor!.has(Number(p.id_produto)));

  const top = base
    .sort((a:any, b:any) => {
      const pa = prio[a.situacao_estoque] || 9;
      const pb = prio[b.situacao_estoque] || 9;
      if (pa !== pb) return pa - pb;
      const aa = abc[a.curva_abc_qtd] || 9;
      const ab = abc[b.curva_abc_qtd] || 9;
      if (aa !== ab) return aa - ab;
      return (b.qtd_sugerida || 0) - (a.qtd_sugerida || 0);
    })
    .slice(0, 15);

  if (!top.length) {
    return `Não encontrei produtos em ruptura/crítico/baixo${nomeFornecedor ? ' para ' + nomeFornecedor : ''}.\n\nResumo geral: ${rupturas.length} rupturas, ${criticos.length} críticos e ${baixos.length} baixos.`;
  }

  const linhas = top.map((r:any, i:number) => {
    const fornProduto = forns.filter((f:any) => Number(f.id_produto) === Number(r.id_produto));
    const fornecedor = nomeFornecedor || fornProduto[0]?.nome_fornecedor || 'A definir';
    const qtd = Math.max(0, Math.ceil(Number(r.qtd_sugerida || 0)));
    return `${i + 1}. ${r.nome || 'Produto sem nome'} | Ref: ${r.referencia || '-'} | ${r.situacao_estoque || '-'} | ABC: ${r.curva_abc_qtd || '-'} | Est: ${Math.round(Number(r.estoque_total || 0))} | Cobertura: ${r.cobertura_dias == null ? '-' : Math.round(Number(r.cobertura_dias)) + 'd'} | Comprar: ${qtd} | Forn: ${fornecedor}`;
  }).join('\n');

  return `📦 Sugestão de pedido${nomeFornecedor ? ' para ' + nomeFornecedor : ''}\n\nPriorizei ruptura, crítico, curva A/B e maior quantidade sugerida.\n\n${linhas}\n\nResumo geral: ${rupturas.length} rupturas, ${criticos.length} críticos e ${baixos.length} baixos.\n\nRecomendação: valide preço/embalagem mínima com o fornecedor antes de fechar o pedido.`;
}

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
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const pergunta = String(body?.pergunta || body?.message || '').trim();

    if (!pergunta) {
      return new Response(JSON.stringify({ sucesso: false, resposta: 'Digite uma pergunta para o assistente de compras.' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    const [prodResp, fornResp] = await Promise.all([
      supabase.from('comp_produtos_consolidado').select('*').limit(5000),
      supabase.from('vw_fb_forn_prod').select('id_produto,id_fornecedor,nome_fornecedor,preco_fornecedor,referencia_fornecedor').limit(20000),
    ]);

    const produtos = prodResp.data || [];
    const fornecedores = fornResp.data || [];

    const rupturas = produtos.filter((r:any) => r.situacao_estoque === 'RUPTURA');
    const criticos = produtos.filter((r:any) => r.situacao_estoque === 'CRITICO');
    const baixos = produtos.filter((r:any) => r.situacao_estoque === 'BAIXO');

    const fallback = respostaFallback(pergunta, produtos, fornecedores);

    const topUrgentes = [...rupturas, ...criticos, ...baixos]
      .slice(0, 40)
      .map((r:any) => ({
        id_produto: r.id_produto,
        nome: r.nome,
        referencia: r.referencia,
        situacao: r.situacao_estoque,
        estoque: r.estoque_total,
        cobertura: r.cobertura_dias,
        qtd_sugerida: r.qtd_sugerida,
        curva: r.curva_abc_qtd,
        fornecedores: fornecedores
          .filter((f:any) => Number(f.id_produto) === Number(r.id_produto))
          .slice(0, 3)
          .map((f:any) => f.nome_fornecedor)
      }));

    const contexto = `Você é o Comprador IA da Bononi Acessórios.\n\nResumo atual:\n- Produtos analisados: ${produtos.length}\n- Rupturas: ${rupturas.length}\n- Críticos: ${criticos.length}\n- Baixos: ${baixos.length}\n\nTop urgentes:\n${JSON.stringify(topUrgentes, null, 2)}\n\nRegras:\n- Responda em português brasileiro\n- Seja direto e operacional\n- Priorize RUPTURA, depois CRITICO, depois BAIXO\n- Priorize curva A antes de B e C\n- Para pedido, liste produto, referência, situação, estoque, cobertura, quantidade sugerida e fornecedor\n- Nunca invente dados\n- Quando não houver dados suficientes, diga claramente`;

    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) {
      return new Response(JSON.stringify({
        sucesso: false,
        resposta: 'A função está funcionando, mas falta configurar a variável OPENAI_API_KEY no Supabase. Enquanto isso, segue análise local:\n\n' + fallback,
        estatisticas: { produtos: produtos.length, rupturas: rupturas.length, criticos: criticos.length, baixos: baixos.length }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: contexto },
          { role: 'user', content: pergunta }
        ],
        temperature: 0.2,
        max_tokens: 1200
      })
    });

    const aiJson = await aiResp.json().catch(() => ({}));

    if (!aiResp.ok) {
      return new Response(JSON.stringify({
        sucesso: false,
        resposta: `A função conectou ao Supabase, mas a OpenAI retornou erro: ${aiJson?.error?.message || aiResp.status}.\n\nAnálise local:\n\n${fallback}`,
        erro_openai: aiJson?.error || aiJson,
        estatisticas: { produtos: produtos.length, rupturas: rupturas.length, criticos: criticos.length, baixos: baixos.length }
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const resposta = aiJson?.choices?.[0]?.message?.content || fallback;

    return new Response(JSON.stringify({
      sucesso: true,
      pergunta,
      resposta,
      estatisticas: { produtos: produtos.length, rupturas: rupturas.length, criticos: criticos.length, baixos: baixos.length }
    }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (e) {
    return new Response(JSON.stringify({ sucesso: false, resposta: 'Erro na função chat-compras: ' + String(e), erro: String(e) }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});