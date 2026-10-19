/* Validador de Produto + Base China (app Compras).
   Carregado sob demanda por index.html (navegarPara) quando a pagina e val-*.
   Usa o `sb` global do index.html. Todo handler inline chama ModuloValidador.*,
   entao nao ha lista de export a manter. Tabelas: val_*, china_* (sql/2026-10-19_validador_base_china.sql). */
(function () {
'use strict';

const FLUXO = ['PAUTA', 'TRIADO', 'AMOSTRA', 'GO', 'COMPRADO', 'LANCADO'];
const ST = {
  PAUTA:    { label: 'Pauta',    cor: 'var(--text-muted)' },
  TRIADO:   { label: 'Triado',   cor: 'var(--blue-mid)' },
  AMOSTRA:  { label: 'Amostra',  cor: 'var(--blue-mid)' },
  GO:       { label: 'GO',       cor: 'var(--green)' },
  COMPRADO: { label: 'Comprado', cor: 'var(--green)' },
  LANCADO:  { label: 'Lançado',  cor: 'var(--green)' },
  NO_GO:    { label: 'NO-GO',    cor: 'var(--orange)' },
};
const PAGINAS_VAL = {
  'val-validador': 'Validador',
  'val-china': 'Base China',
  'val-painel': 'Painel',
};
const CAMPOS_CAND = ['nome', 'id_familia', 'canal_alvo', 'origem', 'link_referencia', 'preco_alvo_mkt', 'fob_usd', 'moq',
  'qtd_planejada', 'frete_cliente', 'id_china_fornecedor', 'id_china_produto', 'peso_kg', 'altura_cm', 'largura_cm',
  'comprimento_cm', 'volume_mercado', 'concorrentes_qtd', 'referencia_sga', 'observacoes'];
const CAMPOS_NUM = new Set(['id_familia', 'preco_alvo_mkt', 'fob_usd', 'moq', 'qtd_planejada', 'frete_cliente', 'id_china_fornecedor',
  'id_china_produto', 'peso_kg', 'altura_cm', 'largura_cm', 'comprimento_cm', 'volume_mercado', 'concorrentes_qtd']);

const S = {
  usuario: null, pagina: null, slot: null,
  familias: [], params: {}, cambio: null, viagens: [], forn: [],
  prods: [], view: 'lista', busca: '', fStatus: '', verNoGo: false,
  cand: null, aba: 'calc', hist: [],
  fornAll: [], pfAll: [], fBusca: '', fViagem: '', fComprou: '', fTag: '',
  fCur: null, pf: [], fAba: 'dados', fCand: [],
};

/* ---------- utilitarios ---------- */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = id => document.getElementById(id);
const brl = n => (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct = (n, d = 1) => (n == null || isNaN(n)) ? '—' : Number(n).toFixed(d).replace('.', ',') + '%';
const hoje = () => new Date().toLocaleDateString('sv');
const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const numIn = v => { if (v === '' || v == null) return null; const n = parseFloat(v); return isNaN(n) ? null : n; };
function numBR(v) {
  if (v == null) return null;
  let s = String(v).trim().replace(/[^\d.,-]/g, '');
  if (!s) return null;
  if (s.includes(',') && s.includes('.')) s = s.replace(/\./g, '').replace(',', '.');
  else s = s.replace(',', '.');
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}
function toast(msg, erro) {
  let t = $('val-toast');
  if (!t) {
    t = document.createElement('div'); t.id = 'val-toast';
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);color:var(--text-inverse);padding:12px 20px;border-radius:var(--radius-lg);font-size:13px;font-weight:600;z-index:999;box-shadow:var(--shadow-lg);max-width:90vw';
    document.body.appendChild(t);
  }
  t.textContent = msg; t.style.background = erro ? 'var(--red, var(--orange))' : 'var(--action-primary)'; t.style.display = 'block';
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.style.display = 'none'; }, erro ? 6000 : 3500);
}
function ocupado(on, rotulo) {
  S.salvando = on;
  document.querySelectorAll('#val-drawer button, #val-modal button').forEach(b => {
    if (on) { b.dataset.rot = b.textContent; b.disabled = true; }
    else { b.disabled = false; if (b.dataset.rot) { b.textContent = b.dataset.rot; delete b.dataset.rot; } }
  });
  if (on && rotulo) document.querySelectorAll('#val-drawer .btn-primary').forEach(b => { b.textContent = rotulo; });
}
const nomeUsuario = () => (S.usuario && S.usuario.nome) || 'desconhecido';
async function q(p) { const { data, error } = await p; if (error) throw error; return data; }
function msgErro(e) {
  if (e && e.code === '23505') return 'Já existe um registro com esse nome.';
  if (e && (e.code === '42P01' || e.code === 'PGRST205')) return 'As tabelas do Validador ainda não existem neste banco (migration pendente).';
  return (e && (e.message || e.details)) || 'Erro inesperado';
}
async function auditLog(acao, entidade, id, descricao, antes, depois) {
  try {
    await sb.from('comp_audit_log').insert({ usuario: nomeUsuario(), modulo: 'validador', acao, entidade, entidade_id: String(id || ''), descricao, antes: antes || null, depois: depois || null });
  } catch (e) { console.warn('auditLog falhou', e); }
}
const podeAdmin = () => !!(S.usuario && (S.usuario.admin || (S.usuario.admin_modulos || []).includes('validador') || (S.usuario.modulos || []).includes('validador_admin')));
const paramNum = (k, d) => { const n = parseFloat(S.params[k]); return isNaN(n) ? d : n; };
const familiaDe = id => S.familias.find(f => f.id === id);
const cambioAtual = () => (S.cambio != null ? S.cambio : paramNum('cambio_fallback', 5.4));

/* ---------- motor de calculo (funcoes puras de dados; so le S.familias/S.params) ---------- */
function metaDe(c) {
  const f = familiaDe(c.id_familia);
  if (f && f.meta_margem_pct != null) return Number(f.meta_margem_pct);
  return c.canal_alvo === 'stonni' ? paramNum('meta_margem_stonni', 30) : paramNum('meta_margem_marketplace', 40);
}
function calcular(c) {
  const falta = [];
  const fam = familiaDe(c.id_familia);
  const fob = Number(c.fob_usd), preco = Number(c.preco_alvo_mkt), cambio = Number(c.cambio_usado);
  if (!fam) falta.push('família');
  if (!(fob > 0)) falta.push('FOB');
  if (!(preco > 0)) falta.push('preço-alvo');
  if (!(cambio > 0)) falta.push('câmbio');
  if (falta.length) return { ok: false, falta };
  const taxa = paramNum('taxa_mkt_pct', 22), imposto = paramNum('imposto_venda_pct', 18);
  const frete = c.frete_cliente != null ? Number(c.frete_cliente) : paramNum('frete_cliente_padrao', 0);
  const fator = Number(fam.fator_nacionalizacao);
  const meta = metaDe(c);
  const landed = fob * cambio * fator;
  const receita = preco - preco * taxa / 100 - preco * imposto / 100 - frete;
  if (!(receita > 0)) return { ok: false, falta: [], msg: 'Taxa, imposto e frete consomem todo o preço-alvo.' };
  const margemPct = (receita - landed) / receita * 100;
  const go = margemPct >= meta;
  const k = 1 - taxa / 100 - imposto / 100;
  const m = meta / 100;
  const precoMin = k > 0 && m < 1 ? (landed / (1 - m) + frete) / k : null;
  const fobMax = receita * (1 - m) / (cambio * fator);
  const sc = pontuar(c, margemPct, meta);
  return { ok: true, landed, receita, margemPct, meta, go, taxa, imposto, frete, fator, cambio, precoMin, fobMax, score: sc.score, partes: sc.partes };
}
function pontuar(c, margemPct, meta) {
  const partes = [];
  // margem: abaixo da meta vale ate 60; da meta a meta+20pp sobe de 60 a 100
  let pm = 0;
  if (margemPct >= meta) pm = 60 + 40 * Math.min(1, (margemPct - meta) / 20);
  else if (margemPct > 0 && meta > 0) pm = 60 * margemPct / meta;
  partes.push({ nome: 'Margem', pts: pm, peso: paramNum('score_peso_margem', 50), usado: true });
  const vol = Number(c.volume_mercado);
  partes.push({ nome: 'Volume de mercado', pts: vol > 0 ? Math.min(100, Math.log10(vol) / 3 * 100) : 0, peso: paramNum('score_peso_volume', 20), usado: vol > 0 });
  const conc = c.concorrentes_qtd;
  const cn = Number(conc);
  partes.push({ nome: 'Concorrência', pts: conc == null || conc === '' ? 0 : (cn <= 3 ? 100 : cn >= 30 ? 0 : 100 * (30 - cn) / 27), peso: paramNum('score_peso_concorrencia', 15), usado: conc != null && conc !== '' });
  const subs = [];
  const peso = Number(c.peso_kg);
  if (peso > 0) subs.push(peso <= 1 ? 100 : peso >= 30 ? 0 : 100 * (30 - peso) / 29);
  const litros = Number(c.altura_cm) * Number(c.largura_cm) * Number(c.comprimento_cm) / 1000;
  if (litros > 0) subs.push(litros <= 10 ? 100 : litros >= 200 ? 0 : 100 * (200 - litros) / 190);
  partes.push({ nome: 'Logística', pts: subs.length ? subs.reduce((a, b) => a + b, 0) / subs.length : 0, peso: paramNum('score_peso_logistica', 15), usado: subs.length > 0 });
  const usados = partes.filter(p => p.usado && p.peso > 0);
  const somaPeso = usados.reduce((a, p) => a + p.peso, 0);
  const score = somaPeso > 0 ? usados.reduce((a, p) => a + p.pts * p.peso, 0) / somaPeso : 0;
  return { score: Math.round(score * 10) / 10, partes };
}

/* ---------- carga de dados ---------- */
async function carregarBase() {
  const [fam, par, cam, via, forn] = await Promise.all([
    q(sb.from('val_familias').select('*').order('nome')),
    q(sb.from('val_parametros').select('*')),
    q(sb.from('val_cambio').select('data,valor').order('data', { ascending: false }).limit(1)),
    q(sb.from('china_viagens').select('*').order('id', { ascending: false })),
    q(sb.from('china_fornecedores').select('id,empresa').order('empresa').range(0, 4999)),
  ]);
  S.familias = fam || [];
  S.params = {}; (par || []).forEach(p => { S.params[p.chave] = p.valor; });
  S.cambio = cam && cam[0] ? Number(cam[0].valor) : null;
  S.viagens = via || [];
  S.forn = forn || [];
}
async function carregarProds() {
  S.prods = (await q(sb.from('val_produtos').select('*').order('criado_em', { ascending: false }).range(0, 4999))) || [];
  atualizarBadge();
}
function atualizarBadge() {
  const n = S.prods.filter(p => p.status === 'TRIADO').length;
  const b = $('badge-val-triado');
  if (b) { b.textContent = n; b.style.display = n ? '' : 'none'; b.setAttribute('aria-label', n + ' candidatos aguardando decisão'); }
}

/* ---------- paginas ---------- */
function injetarCss() {
  if ($('val-css')) return;
  const s = document.createElement('style'); s.id = 'val-css';
  s.textContent = '.val-in{height:34px;border:1.5px solid var(--border);border-radius:var(--radius-md);padding:0 10px;font-size:13px;font-family:var(--font-ui);color:var(--text-primary);background:var(--surface2);outline:none;box-sizing:border-box;transition:border-color .15s}'
    + '.val-in:focus{border-color:var(--blue-mid)}textarea.val-in{height:80px;padding:8px}'
    + '#val-drawer button:disabled,#val-modal button:disabled{opacity:.55;cursor:wait}';
  document.head.appendChild(s);
}
function montarSlot(slot) {
  injetarCss();
  if (slot.querySelector('#val-pages')) return;
  const w = document.createElement('div'); w.id = 'val-pages';
  w.innerHTML = Object.keys(PAGINAS_VAL).map(k => `<div class="page-content" id="page-${k}"></div>`).join('');
  slot.innerHTML = ''; slot.appendChild(w);
  const ov = document.createElement('div'); ov.id = 'val-overlay'; ov.className = 'drawer-overlay'; ov.onclick = () => M.fecharDrawer();
  const dr = document.createElement('div'); dr.id = 'val-drawer'; dr.className = 'drawer';
  document.body.appendChild(ov); document.body.appendChild(dr);
}
function mostrarCarregando(id) { $('page-' + id).innerHTML = '<p style="color:var(--text-muted);padding:24px">Carregando…</p>'; }
function mostrarErro(id, e) {
  $('page-' + id).innerHTML = `<div style="padding:24px"><p style="color:var(--orange);font-weight:600">${esc(msgErro(e))}</p><button class="btn btn-primary" onclick="ModuloValidador.recarregar()">Tentar de novo</button></div>`;
  console.error(e);
}

async function showPage(paginaId, slot, usuario) {
  S.usuario = usuario; S.slot = slot; S.pagina = paginaId;
  montarSlot(slot);
  slot.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
  const alvo = $('page-' + paginaId); if (!alvo) return;
  alvo.classList.add('active');
  mostrarCarregando(paginaId);
  try {
    await carregarBase();
    if (paginaId === 'val-china') await carregarChina();
    else { await carregarProds(); }
    renderPagina();
  } catch (e) { mostrarErro(paginaId, e); }
}
function renderPagina() {
  if (S.pagina === 'val-validador') renderValidador();
  else if (S.pagina === 'val-china') renderChina();
  else if (S.pagina === 'val-painel') renderPainel();
}
async function recarregar() { if (S.slot) await showPage(S.pagina, S.slot, S.usuario); }

/* ---------- VALIDADOR: lista e esteira ---------- */
function filtrarProds() {
  const b = norm(S.busca);
  return S.prods.filter(p => {
    if (S.fStatus && p.status !== S.fStatus) return false;
    if (!b) return true;
    const f = familiaDe(p.id_familia);
    return norm(p.nome).includes(b) || norm(p.origem).includes(b) || norm(f && f.nome).includes(b);
  });
}
function chipStatus(s) { const x = ST[s] || { label: s, cor: 'var(--text-muted)' }; return `<span style="font-size:11px;font-weight:700;color:${x.cor}">${esc(x.label)}</span>`; }
function chipMargem(p) {
  if (p.margem_calc == null) return '<span style="color:var(--text-muted)">—</span>';
  const m = Number(p.margem_calc) * 100;
  const f = familiaDe(p.id_familia);
  const meta = metaDe({ id_familia: p.id_familia, canal_alvo: p.canal_alvo });
  return `<span style="font-weight:700;color:${m >= meta ? 'var(--green)' : 'var(--orange)'}">${pct(m)}</span>`;
}
function renderValidador() {
  const el = $('page-val-validador');
  const lista = filtrarProds();
  const opts = ['<option value="">Todos os status</option>'].concat(Object.keys(ST).map(k => `<option value="${k}" ${S.fStatus === k ? 'selected' : ''}>${ST[k].label}</option>`)).join('');
  let corpo;
  if (!S.prods.length) corpo = '<p style="color:var(--text-muted);padding:24px 0">Nenhum candidato ainda. Use “Novo candidato” ou valide um produto da Base China.</p>';
  else if (!lista.length) corpo = '<p style="color:var(--text-muted);padding:24px 0">Nenhum candidato com esse filtro.</p>';
  else corpo = S.view === 'lista' ? htmlLista(lista) : htmlEsteira(lista);
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
      <input type="text" class="search-input" id="val-busca" placeholder="Buscar candidato, família ou origem…" value="${esc(S.busca)}" oninput="ModuloValidador.setBusca(this.value)" style="width:280px" />
      <select class="filter-select" onchange="ModuloValidador.setFiltroStatus(this.value)">${opts}</select>
      <div class="toggle-group">
        <button class="toggle-btn ${S.view === 'lista' ? 'active' : ''}" onclick="ModuloValidador.setView('lista')">Lista</button>
        <button class="toggle-btn ${S.view === 'esteira' ? 'active' : ''}" onclick="ModuloValidador.setView('esteira')">Esteira</button>
      </div>
      <span style="margin-left:auto;display:flex;gap:8px;flex-wrap:wrap">
        ${podeAdmin() ? '<button class="btn" style="background:var(--surface2);border:1px solid var(--border)" onclick="ModuloValidador.abrirParametros()">Parâmetros</button>' : ''}
        <button class="btn btn-primary" onclick="ModuloValidador.novoCand()">Novo candidato</button>
      </span>
    </div>
    <div id="val-corpo">${corpo}</div>`;
  const busca = $('val-busca');
}
function htmlLista(lista) {
  const linhas = lista.map(p => {
    const f = familiaDe(p.id_familia);
    return `<tr style="cursor:pointer" onclick="ModuloValidador.abrirCand(${p.id})">
      <td><strong>${esc(p.nome)}</strong></td><td>${esc(f ? f.nome : '—')}</td>
      <td>${p.canal_alvo === 'stonni' ? 'Stonni' : 'Marketplace'}</td>
      <td class="right mono">${brl(p.preco_alvo_mkt)}</td><td class="right mono">${p.fob_usd != null ? 'US$ ' + Number(p.fob_usd).toFixed(2) : '—'}</td>
      <td class="right">${chipMargem(p)}</td><td class="right mono">${p.score != null ? Number(p.score).toFixed(0) : '—'}</td>
      <td>${chipStatus(p.status)}</td><td>${esc(p.origem || '')}</td></tr>`;
  }).join('');
  return `<div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Candidato</th><th>Família</th><th>Canal</th><th class="right">Preço-alvo</th><th class="right">FOB</th><th class="right">Margem</th><th class="right">Score</th><th>Status</th><th>Origem</th></tr></thead><tbody>${linhas}</tbody></table></div>`;
}
function htmlEsteira(lista) {
  const cols = S.verNoGo ? FLUXO.concat(['NO_GO']) : FLUXO;
  const nNo = lista.filter(p => p.status === 'NO_GO').length;
  const html = cols.map(st => {
    const itens = lista.filter(p => p.status === st).sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
    const cards = itens.map(p => {
      const f = familiaDe(p.id_familia);
      return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-md);padding:10px;margin-bottom:8px;cursor:pointer" onclick="ModuloValidador.abrirCand(${p.id})">
        <div style="font-size:12px;font-weight:700;margin-bottom:4px;line-height:1.3">${esc(p.nome)}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:6px">${esc(f ? f.nome : 'sem família')}</div>
        <div style="display:flex;justify-content:space-between;font-size:11px"><span>Margem ${chipMargem(p)}</span><span style="color:var(--text-muted)">Score ${p.score != null ? Number(p.score).toFixed(0) : '—'}</span></div></div>`;
    }).join('') || '<div style="font-size:11px;color:var(--text-muted)">—</div>';
    const x = ST[st];
    return `<div style="min-width:200px;flex:1;background:var(--surface2);border-radius:var(--radius);padding:12px;border:1px solid var(--border)">
      <div style="display:flex;justify-content:space-between;margin-bottom:10px"><span style="font-size:12px;font-weight:700;color:${x.cor}">${x.label}</span><span style="font-size:11px;font-weight:700;color:${x.cor}">${itens.length}</span></div>${cards}</div>`;
  }).join('');
  return `<div style="display:flex;gap:10px;overflow-x:auto;align-items:flex-start">${html}</div>
    <div style="margin-top:10px"><button class="toggle-btn ${S.verNoGo ? 'active' : ''}" onclick="ModuloValidador.toggleNoGo()">NO-GO (${nNo})</button></div>`;
}

/* ---------- DRAWER: candidato ---------- */
function candVazio() {
  return { id: null, nome: '', id_familia: S.familias.find(f => f.ativo) ? S.familias.find(f => f.ativo).id : null, canal_alvo: 'marketplace', status: 'PAUTA',
    cambio_usado: cambioAtual(), frete_cliente: null };
}
function novoCand() { S.cand = candVazio(); S.aba = 'calc'; S.hist = []; abrirDrawerCand(); }
async function abrirCand(id) {
  const p = S.prods.find(x => x.id === id); if (!p) return;
  S.cand = Object.assign({}, p); if (S.cand.cambio_usado == null) S.cand.cambio_usado = cambioAtual();
  S.aba = 'calc'; S.hist = [];
  abrirDrawerCand();
  try { S.hist = (await q(sb.from('val_historico').select('*').eq('id_val_produto', id).order('calculado_em', { ascending: false }).limit(50))) || []; } catch (e) { console.warn(e); }
  if (S.aba === 'hist') renderDrawerCand();
}
function abrirDrawerCand() { renderDrawerCand(); $('val-overlay').classList.add('open'); $('val-drawer').classList.add('open'); }
function fecharDrawer() { const o = $('val-overlay'), d = $('val-drawer'); o && o.classList.remove('open'); d && d.classList.remove('open'); }
function campo(label, html, span) { return `<label style="display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--text-muted);${span ? 'grid-column:1/-1' : ''}">${label}${html}</label>`; }
function inp(nome, tipo, extra) {
  const v = S.cand[nome];
  return `<input class="val-in" style="width:100%;height:34px" type="${tipo || 'text'}" ${tipo === 'number' ? 'step="any" min="0"' : ''} value="${esc(v == null ? '' : v)}" oninput="ModuloValidador.set('${nome}',this.value)" ${extra || ''} />`;
}
function renderDrawerCand() {
  const c = S.cand; const d = $('val-drawer');
  const abas = [['calc', 'Calculadora'], ['dados', 'Dados'], ['hist', 'Histórico']].map(([k, l]) =>
    `<div class="drawer-tab ${S.aba === k ? 'active' : ''}" onclick="ModuloValidador.setAba('${k}')">${l}</div>`).join('');
  let corpo = '';
  const grid = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;padding:20px';
  if (S.aba === 'calc') {
    const famOpts = S.familias.filter(f => f.ativo || f.id === c.id_familia).map(f => `<option value="${f.id}" ${f.id === c.id_familia ? 'selected' : ''}>${esc(f.nome)} (×${Number(f.fator_nacionalizacao).toFixed(2)})</option>`).join('');
    corpo = `<div style="${grid}">
      ${campo('Nome do produto *', inp('nome'), true)}
      ${campo('Família', `<select class="filter-select" style="width:100%;height:34px" onchange="ModuloValidador.set('id_familia',this.value)"><option value="">Selecione…</option>${famOpts}</select>`)}
      ${campo('Canal', `<select class="filter-select" style="width:100%;height:34px" onchange="ModuloValidador.set('canal_alvo',this.value)"><option value="marketplace" ${c.canal_alvo !== 'stonni' ? 'selected' : ''}>Marketplace (sem marca)</option><option value="stonni" ${c.canal_alvo === 'stonni' ? 'selected' : ''}>Stonni</option></select>`)}
      ${campo('Preço-alvo no marketplace (R$)', inp('preco_alvo_mkt', 'number'))}
      ${campo('FOB (US$/un)', inp('fob_usd', 'number'))}
      ${campo('Frete pago pela empresa (R$)', inp('frete_cliente', 'number', `placeholder="padrão: ${paramNum('frete_cliente_padrao', 0)}"`))}
      ${campo('Câmbio (R$/US$)', `<span style="display:flex;gap:6px"><input class="val-in" style="width:100%;height:34px" type="number" step="any" min="0" value="${esc(c.cambio_usado == null ? '' : c.cambio_usado)}" oninput="ModuloValidador.set('cambio_usado',this.value)" /><button class="btn" type="button" style="background:var(--surface2);border:1px solid var(--border)" onclick="ModuloValidador.cotacaoHoje()">Hoje</button></span>`)}
      ${campo('Qtd planejada', inp('qtd_planejada', 'number'))}
      ${campo('MOQ', inp('moq', 'number'))}
    </div>
    <div id="val-res" style="padding:0 20px 20px"></div>`;
  } else if (S.aba === 'dados') {
    const fOpts = S.forn.map(f => `<option value="${f.id}" ${f.id === c.id_china_fornecedor ? 'selected' : ''}>${esc(f.empresa)}</option>`).join('');
    corpo = `<div style="${grid}">
      ${campo('Fornecedor (Base China)', `<select class="filter-select" style="width:100%;height:34px" onchange="ModuloValidador.set('id_china_fornecedor',this.value)"><option value="">—</option>${fOpts}</select>`, true)}
      ${campo('Origem da ideia', inp('origem', 'text', 'placeholder="ex.: Nubimetrics, Canton, pedido do cliente"'), true)}
      ${campo('Link de referência', inp('link_referencia'), true)}
      ${campo('Peso (kg)', inp('peso_kg', 'number'))}${campo('Altura (cm)', inp('altura_cm', 'number'))}
      ${campo('Largura (cm)', inp('largura_cm', 'number'))}${campo('Comprimento (cm)', inp('comprimento_cm', 'number'))}
      ${campo('Vendas por mês no marketplace', inp('volume_mercado', 'number'))}${campo('Nº de vendedores concorrentes', inp('concorrentes_qtd', 'number'))}
      ${campo('Referência no SGA (quando cadastrar)', inp('referencia_sga'), true)}
      ${campo('Observações', `<textarea class="val-in" style="width:100%;height:80px;padding:8px" oninput="ModuloValidador.set('observacoes',this.value)">${esc(c.observacoes || '')}</textarea>`, true)}
    </div>`;
  } else {
    corpo = S.hist.length ? `<div style="padding:20px;overflow-x:auto"><table class="data-table"><thead><tr><th>Quando</th><th>Quem</th><th class="right">FOB</th><th class="right">Câmbio</th><th class="right">Landed</th><th class="right">Margem</th><th>Resultado</th></tr></thead><tbody>${S.hist.map(h =>
      `<tr><td>${new Date(h.calculado_em).toLocaleString('pt-BR')}</td><td>${esc(h.por || '')}</td><td class="right mono">US$ ${Number(h.fob_usd).toFixed(2)}</td><td class="right mono">${Number(h.cambio).toFixed(4)}</td><td class="right mono">${brl(h.custo_landed)}</td><td class="right mono">${pct(Number(h.margem_pct) * 100)}</td><td style="font-weight:700;color:${h.resultado === 'GO' ? 'var(--green)' : 'var(--orange)'}">${h.resultado === 'GO' ? 'GO' : 'NO-GO'}</td></tr>`).join('')}</tbody></table></div>`
      : '<p style="color:var(--text-muted);padding:20px">Nenhuma validação gravada para este candidato.</p>';
  }
  const idx = FLUXO.indexOf(c.status);
  const mover = c.id ? `<span style="display:flex;gap:6px;flex-wrap:wrap">
      ${idx > 0 ? `<button class="btn" style="background:var(--surface2);border:1px solid var(--border)" onclick="ModuloValidador.mover(-1)">◀ ${ST[FLUXO[idx - 1]].label}</button>` : ''}
      ${idx >= 0 && idx < FLUXO.length - 1 ? `<button class="btn" style="background:var(--surface2);border:1px solid var(--border)" onclick="ModuloValidador.mover(1)">${ST[FLUXO[idx + 1]].label} ▶</button>` : ''}
      ${c.status === 'NO_GO' ? '<button class="btn" style="background:var(--surface2);border:1px solid var(--border)" onclick="ModuloValidador.setStatus(\'PAUTA\')">Reabrir (Pauta)</button>' : '<button class="btn" style="background:var(--surface2);border:1px solid var(--border);color:var(--orange)" onclick="ModuloValidador.setStatus(\'NO_GO\')">Reprovar</button>'}
    </span>` : '';
  d.innerHTML = `
    <div class="drawer-header"><div><div style="font-size:16px;font-weight:700">${esc(c.nome || 'Novo candidato')}</div><div style="margin-top:4px">${chipStatus(c.status)}</div></div>
      <button class="btn" style="background:transparent" onclick="ModuloValidador.fecharDrawer()" aria-label="Fechar">✕</button></div>
    <div class="drawer-tabs">${abas}</div>
    <div class="drawer-body">${corpo}</div>
    <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap;align-items:center;justify-content:space-between">
      ${mover}
      <span style="display:flex;gap:8px;margin-left:auto"><button class="btn" style="background:var(--surface2);border:1px solid var(--border)" onclick="ModuloValidador.salvar('rascunho')">Salvar rascunho</button>
      <button class="btn btn-primary" onclick="ModuloValidador.salvar('validar')">Validar e salvar</button></span>
    </div>`;
  if (S.aba === 'calc') atualizarRes();
}
function atualizarRes() {
  const el = $('val-res'); if (!el) return;
  const r = calcular(S.cand);
  if (!r.ok) { el.innerHTML = `<div style="background:var(--surface2);border:1px dashed var(--border);border-radius:var(--radius);padding:14px;font-size:13px;color:var(--text-muted)">${r.msg ? esc(r.msg) : 'Preencha ' + esc(r.falta.join(', ')) + ' para calcular.'}</div>`; return; }
  const cor = r.go ? 'var(--green)' : 'var(--orange)';
  const linhas = [['Custo landed (FOB × câmbio × fator ' + r.fator.toFixed(2).replace('.', ',') + ')', brl(r.landed)],
    ['Receita líquida (preço − taxa ' + pct(r.taxa, 0) + ' − imposto ' + pct(r.imposto, 0) + ' − frete)', brl(r.receita)],
    ['Meta de margem', pct(r.meta, 0)],
    ['Preço mínimo para bater a meta', brl(r.precoMin)],
    ['FOB máximo para bater a meta', 'US$ ' + (r.fobMax > 0 ? r.fobMax.toFixed(2).replace('.', ',') : '0,00')]]
    .map(([a, b]) => `<tr><td style="padding:4px 0;color:var(--text-muted)">${a}</td><td style="text-align:right;font-family:var(--font-mono)">${b}</td></tr>`).join('');
  const partes = r.partes.map(p => `<tr><td style="padding:3px 0">${p.nome}</td><td style="text-align:right;font-family:var(--font-mono)">${p.usado ? p.pts.toFixed(0) + ' pts' : '<span style="color:var(--text-muted)">sem dado</span>'}</td><td style="text-align:right;color:var(--text-muted)">peso ${p.peso}</td></tr>`).join('');
  el.innerHTML = `<div style="background:var(--surface2);border:2px solid ${cor};border-radius:var(--radius);padding:14px">
    <div style="display:flex;align-items:baseline;gap:14px;flex-wrap:wrap"><span style="font-size:22px;font-weight:800;color:${cor}">${r.go ? 'GO' : 'NO-GO'}</span><span style="font-size:18px;font-weight:700;color:${cor}">${pct(r.margemPct)}</span><span style="font-size:13px;color:var(--text-muted)">Score ${r.score.toFixed(0)}/100</span></div>
    <table style="width:100%;font-size:12px;margin-top:10px;border-collapse:collapse">${linhas}</table>
    <div style="font-size:11px;font-weight:700;color:var(--text-muted);margin:12px 0 4px;text-transform:uppercase">Composição do score</div>
    <table style="width:100%;font-size:12px;border-collapse:collapse">${partes}</table></div>`;
}
function set(campoNome, valor) {
  const c = S.cand; if (!c) return;
  if (campoNome === 'cambio_usado') c.cambio_usado = numIn(valor);
  else if (CAMPOS_NUM.has(campoNome)) c[campoNome] = numIn(valor);
  else c[campoNome] = valor;
  if (campoNome === 'canal_alvo' || campoNome === 'id_familia' || S.aba === 'calc') atualizarRes();
}
function setAba(k) { S.aba = k; renderDrawerCand(); }
async function cotacaoHoje() {
  try {
    const r = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
    const j = await r.json();
    const v = Math.round(parseFloat(j.USDBRL.bid) * 10000) / 10000;
    if (!(v > 0)) throw new Error('cotação inválida');
    S.cand.cambio_usado = v; S.cambio = v;
    await q(sb.from('val_cambio').upsert({ data: hoje(), valor: v, origem: 'awesomeapi', criado_por: nomeUsuario() }, { onConflict: 'data' }));
    renderDrawerCand(); toast('Câmbio de hoje: R$ ' + v.toFixed(4).replace('.', ','));
  } catch (e) { console.warn(e); toast('Não consegui buscar a cotação. Digite o câmbio à mão.', true); }
}
async function salvar(modo) {
  if (S.salvando) return;
  const c = S.cand;
  if (!c.nome || !c.nome.trim()) { toast('Informe o nome do produto.', true); return; }
  const r = calcular(c);
  if (modo === 'validar' && !r.ok) { toast('Para validar, preencha ' + (r.falta && r.falta.length ? r.falta.join(', ') : 'os dados do cálculo') + '.', true); return; }
  const p = {};
  CAMPOS_CAND.forEach(k => { p[k] = c[k] === '' || c[k] === undefined ? null : c[k]; });
  p.nome = c.nome.trim();
  p.status = c.status; p.atualizado_em = new Date().toISOString();
  if (r.ok) { p.score = r.score; p.margem_calc = Math.round(r.margemPct * 100) / 10000; p.custo_landed_calc = Math.round(r.landed * 100) / 100; p.cambio_usado = r.cambio; p.fator_usado = r.fator; }
  if (modo === 'validar') {
    if (['PAUTA', 'TRIADO', 'NO_GO'].includes(c.status)) p.status = r.go ? (c.status === 'TRIADO' ? 'TRIADO' : 'TRIADO') : 'NO_GO';
  }
  ocupado(true, 'Salvando…');
  try {
    let id = c.id, antes = null;
    if (id) { antes = S.prods.find(x => x.id === id); await q(sb.from('val_produtos').update(p).eq('id', id).select('id').single()); }
    else { p.criado_por = nomeUsuario(); const novo = await q(sb.from('val_produtos').insert(p).select('id').single()); id = novo.id; }
    if (modo === 'validar') {
      await q(sb.from('val_historico').insert({ id_val_produto: id, por: nomeUsuario(), fob_usd: c.fob_usd, cambio: r.cambio, fator: r.fator, preco_alvo: c.preco_alvo_mkt,
        taxa_pct: r.taxa, imposto_pct: r.imposto, frete: r.frete, custo_landed: Math.round(r.landed * 100) / 100, receita_liquida: Math.round(r.receita * 100) / 100,
        margem_pct: Math.round(r.margemPct * 100) / 10000, score: r.score, resultado: r.go ? 'GO' : 'NO_GO' }));
    }
    auditLog(c.id ? 'UPDATE' : 'INSERT', 'val_produtos', id, (modo === 'validar' ? 'Validou ' : 'Salvou ') + p.nome + (modo === 'validar' ? (r.go ? ' (GO ' : ' (NO-GO ') + pct(r.margemPct) + ')' : ''),
      antes ? { status: antes.status, margem_calc: antes.margem_calc } : null, { status: p.status, margem_calc: p.margem_calc });
    await carregarProds();
    S.cand = Object.assign({}, S.prods.find(x => x.id === id));
    if (S.cand.cambio_usado == null) S.cand.cambio_usado = cambioAtual();
    try { S.hist = (await q(sb.from('val_historico').select('*').eq('id_val_produto', id).order('calculado_em', { ascending: false }).limit(50))) || []; } catch (e) { /* histórico é secundário */ }
    renderDrawerCand(); if (S.pagina === 'val-validador') renderValidador();
    toast(modo === 'validar' ? (r.go ? 'GO — margem ' + pct(r.margemPct) + '. Foi para a esteira.' : 'NO-GO — margem ' + pct(r.margemPct) + ' abaixo da meta.') : 'Rascunho salvo.');
  } catch (e) { ocupado(false); toast('Não salvou: ' + msgErro(e), true); console.error(e); }
  finally { if (S.salvando) ocupado(false); }
}
async function setStatus(novo) {
  const c = S.cand; if (!c || !c.id) return;
  try {
    await q(sb.from('val_produtos').update({ status: novo, atualizado_em: new Date().toISOString() }).eq('id', c.id).select('id').single());
    auditLog('UPDATE', 'val_produtos', c.id, `Moveu ${c.nome} de ${ST[c.status].label} para ${ST[novo].label}`, { status: c.status }, { status: novo });
    c.status = novo; await carregarProds(); renderDrawerCand();
    if (S.pagina === 'val-validador') renderValidador();
  } catch (e) { toast('Não moveu: ' + msgErro(e), true); }
}
function mover(dir) { const i = FLUXO.indexOf(S.cand.status); const n = FLUXO[i + dir]; if (n) setStatus(n); }
function setBusca(v) { S.busca = v; const el = $('val-corpo'); if (!el) return; const l = filtrarProds(); el.innerHTML = !S.prods.length ? el.innerHTML : (l.length ? (S.view === 'lista' ? htmlLista(l) : htmlEsteira(l)) : '<p style="color:var(--text-muted);padding:24px 0">Nenhum candidato com esse filtro.</p>'); }
function setFiltroStatus(v) { S.fStatus = v; renderValidador(); }
function setView(v) { S.view = v; renderValidador(); }
function toggleNoGo() { S.verNoGo = !S.verNoGo; renderValidador(); }

/* ---------- PARAMETROS (admin) ---------- */
function abrirParametros() {
  if (!podeAdmin()) { toast('Só quem administra o Validador altera os parâmetros.', true); return; }
  let m = $('val-modal');
  if (!m) { m = document.createElement('div'); m.id = 'val-modal'; m.style.cssText = 'position:fixed;inset:0;background:var(--scrim);z-index:400;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:30px 12px'; document.body.appendChild(m); }
  m.style.display = 'flex';
  const fam = S.familias.map(f => `<tr><td><input class="val-in" style="width:100%" id="vf-n-${f.id}" value="${esc(f.nome)}" /></td>
    <td><input class="val-in" style="width:90px" type="number" step="0.001" id="vf-f-${f.id}" value="${f.fator_nacionalizacao}" /></td>
    <td><input class="val-in" style="width:90px" type="number" step="0.1" id="vf-m-${f.id}" value="${f.meta_margem_pct == null ? '' : f.meta_margem_pct}" placeholder="canal" /></td>
    <td><input type="checkbox" id="vf-a-${f.id}" ${f.ativo ? 'checked' : ''} /></td>
    <td><button class="btn btn-primary" onclick="ModuloValidador.salvarFamilia(${f.id})">Salvar</button></td></tr>`).join('');
  const par = Object.keys(S.params).sort().map(k => `<tr><td style="font-family:var(--font-mono);font-size:12px">${esc(k)}</td>
    <td><input class="val-in" style="width:110px" id="vp-${esc(k)}" value="${esc(S.params[k])}" /></td>
    <td style="font-size:11px;color:var(--text-muted)">${esc((S.paramDesc && S.paramDesc[k]) || '')}</td>
    <td><button class="btn btn-primary" onclick="ModuloValidador.salvarParam('${esc(k)}')">Salvar</button></td></tr>`).join('');
  m.innerHTML = `<div style="background:var(--surface);border-radius:var(--radius-lg);padding:20px;width:880px;max-width:100%">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><h3 style="margin:0">Parâmetros do Validador</h3><button class="btn" style="background:transparent" onclick="ModuloValidador.fecharModal()">✕</button></div>
    <h4 style="margin:12px 0 6px">Famílias (fator de nacionalização = custo real ÷ FOB, já com o câmbio fora)</h4>
    <div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Família</th><th>Fator</th><th>Meta de margem %</th><th>Ativa</th><th></th></tr></thead><tbody>${fam}
      <tr><td><input class="val-in" style="width:100%" id="vf-n-novo" placeholder="Nova família" /></td><td><input class="val-in" style="width:90px" type="number" step="0.001" id="vf-f-novo" /></td><td><input class="val-in" style="width:90px" type="number" step="0.1" id="vf-m-novo" placeholder="canal" /></td><td></td><td><button class="btn btn-primary" onclick="ModuloValidador.salvarFamilia(0)">Adicionar</button></td></tr></tbody></table></div>
    <p style="font-size:11px;color:var(--text-muted)">Meta em branco = usa a meta do canal (marketplace ou Stonni) dos parâmetros abaixo. Recalibrar os fatores a cada 3 a 6 meses.</p>
    <h4 style="margin:16px 0 6px">Parâmetros gerais</h4>
    <div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Chave</th><th>Valor</th><th>Descrição</th><th></th></tr></thead><tbody>${par}</tbody></table></div></div>`;
  if (!S.paramDesc) {
    sb.from('val_parametros').select('chave,descricao').then(({ data }) => { S.paramDesc = {}; (data || []).forEach(p => { S.paramDesc[p.chave] = p.descricao; }); if ($('val-modal') && $('val-modal').style.display !== 'none') abrirParametros(); });
  }
}
function fecharModal() { const m = $('val-modal'); if (m) m.style.display = 'none'; }
async function salvarFamilia(id) {
  const k = id || 'novo';
  const nome = $('vf-n-' + k).value.trim(), fator = numIn($('vf-f-' + k).value), metaTxt = $('vf-m-' + k).value;
  if (!nome || !(fator > 0)) { toast('Informe o nome e um fator maior que zero.', true); return; }
  const row = { nome, fator_nacionalizacao: fator, meta_margem_pct: metaTxt === '' ? null : numIn(metaTxt), atualizado_em: new Date().toISOString(), atualizado_por: nomeUsuario() };
  try {
    if (id) { row.ativo = $('vf-a-' + id).checked; await q(sb.from('val_familias').update(row).eq('id', id).select('id').single()); }
    else await q(sb.from('val_familias').insert(row).select('id').single());
    auditLog(id ? 'UPDATE' : 'INSERT', 'val_familias', id, `${id ? 'Alterou' : 'Criou'} família ${nome} (fator ${fator})`, null, row);
    await carregarBase(); abrirParametros(); toast('Família salva.');
  } catch (e) { toast('Não salvou: ' + msgErro(e), true); }
}
async function salvarParam(chave) {
  const valor = $('vp-' + chave).value.trim();
  if (valor === '' || isNaN(parseFloat(valor))) { toast('Informe um número.', true); return; }
  try {
    await q(sb.from('val_parametros').update({ valor, atualizado_em: new Date().toISOString(), atualizado_por: nomeUsuario() }).eq('chave', chave).select('chave').single());
    auditLog('UPDATE', 'val_parametros', chave, `Alterou ${chave} de ${S.params[chave]} para ${valor}`, { valor: S.params[chave] }, { valor });
    S.params[chave] = valor; toast('Parâmetro salvo.');
  } catch (e) { toast('Não salvou: ' + msgErro(e), true); }
}

/* ---------- BASE CHINA ---------- */
async function carregarChina() {
  const [f, pf] = await Promise.all([
    q(sb.from('china_fornecedores').select('*').order('empresa').range(0, 4999)),
    q(sb.from('china_produtos_fornecedor').select('id,id_fornecedor').range(0, 19999)),
  ]);
  S.fornAll = f || []; S.pfAll = pf || [];
  S.forn = S.fornAll.map(x => ({ id: x.id, empresa: x.empresa }));
}
function filtrarForn() {
  const b = norm(S.fBusca);
  return S.fornAll.filter(f => {
    if (S.fViagem && String(f.id_viagem) !== S.fViagem) return false;
    if (S.fComprou === 'sim' && !f.ja_comprou) return false;
    if (S.fComprou === 'nao' && f.ja_comprou) return false;
    if (S.fTag && !(f.tags || []).map(norm).includes(norm(S.fTag))) return false;
    if (!b) return true;
    return [f.empresa, f.cidade, f.contato_pessoa, f.wechat, (f.tags || []).join(' ')].some(x => norm(x).includes(b));
  });
}
function renderChina() {
  const el = $('page-val-china');
  const tags = [...new Set(S.fornAll.flatMap(f => f.tags || []))].sort();
  const vOpts = '<option value="">Todas as viagens</option>' + S.viagens.map(v => `<option value="${v.id}" ${S.fViagem === String(v.id) ? 'selected' : ''}>${esc(v.nome)}</option>`).join('');
  const tOpts = '<option value="">Todas as categorias</option>' + tags.map(t => `<option value="${esc(t)}" ${S.fTag === t ? 'selected' : ''}>${esc(t)}</option>`).join('');
  el.innerHTML = `<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
    <input type="text" class="search-input" id="vc-busca" placeholder="Buscar empresa, contato, WeChat…" value="${esc(S.fBusca)}" oninput="ModuloValidador.setFBusca(this.value)" style="width:260px" />
    <select class="filter-select" onchange="ModuloValidador.setFiltroChina('fViagem',this.value)">${vOpts}</select>
    <select class="filter-select" onchange="ModuloValidador.setFiltroChina('fTag',this.value)">${tOpts}</select>
    <select class="filter-select" onchange="ModuloValidador.setFiltroChina('fComprou',this.value)"><option value="">Já comprei: todos</option><option value="sim" ${S.fComprou === 'sim' ? 'selected' : ''}>Já comprei</option><option value="nao" ${S.fComprou === 'nao' ? 'selected' : ''}>Nunca comprei</option></select>
    <span style="margin-left:auto;display:flex;gap:8px"><button class="btn" style="background:var(--surface2);border:1px solid var(--border)" onclick="ModuloValidador.abrirImportar()">Importar CSV</button>
    <button class="btn btn-primary" onclick="ModuloValidador.novoForn()">Novo fornecedor</button></span></div>
    <div id="vc-corpo">${htmlForn()}</div>`;
}
function htmlForn() {
  if (!S.fornAll.length) return '<p style="color:var(--text-muted);padding:24px 0">Nenhum fornecedor cadastrado. Cadastre um ou importe a planilha da viagem.</p>';
  const l = filtrarForn();
  if (!l.length) return '<p style="color:var(--text-muted);padding:24px 0">Nenhum fornecedor com esse filtro.</p>';
  const nProd = id => S.pfAll.filter(p => p.id_fornecedor === id).length;
  const linhas = l.map(f => { const v = S.viagens.find(x => x.id === f.id_viagem);
    return `<tr style="cursor:pointer" onclick="ModuloValidador.abrirForn(${f.id})"><td><strong>${esc(f.empresa)}</strong></td><td>${esc(f.cidade || '')}</td><td>${esc(f.contato_pessoa || '')}</td><td>${esc(f.wechat || '')}</td>
      <td>${esc(v ? v.nome : '')}</td><td class="right">${f.nota_confianca != null ? f.nota_confianca + '/5' : '—'}</td><td>${f.ja_comprou ? 'Sim' : 'Não'}</td><td class="right">${nProd(f.id)}</td><td>${esc((f.tags || []).join(', '))}</td></tr>`; }).join('');
  return `<div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Empresa</th><th>Cidade</th><th>Contato</th><th>WeChat</th><th>Viagem</th><th class="right">Confiança</th><th>Já comprei</th><th class="right">Produtos</th><th>Categorias</th></tr></thead><tbody>${linhas}</tbody></table></div>`;
}
function setFBusca(v) { S.fBusca = v; const el = $('vc-corpo'); if (el) el.innerHTML = htmlForn(); }
function setFiltroChina(k, v) { S[k] = v; renderChina(); }
function fornVazio() { const v = S.viagens[0]; return { id: null, empresa: '', ja_comprou: false, id_viagem: v ? v.id : null, tags: [] }; }
function novoForn() { S.fCur = fornVazio(); S.pf = []; S.fCand = []; S.fAba = 'dados'; abrirDrawerForn(); }
async function abrirForn(id) {
  const f = S.fornAll.find(x => x.id === id); if (!f) return;
  S.fCur = Object.assign({}, f); S.fAba = 'dados'; S.pf = []; S.fCand = [];
  abrirDrawerForn();
  try {
    S.pf = (await q(sb.from('china_produtos_fornecedor').select('*').eq('id_fornecedor', id).order('produto'))) || [];
    S.fCand = (await q(sb.from('val_produtos').select('id,nome,status,margem_calc').eq('id_china_fornecedor', id).order('criado_em', { ascending: false }))) || [];
  } catch (e) { console.warn(e); }
  renderDrawerForn();
}
function abrirDrawerForn() { renderDrawerForn(); $('val-overlay').classList.add('open'); $('val-drawer').classList.add('open'); }
function finp(nome, tipo, ph) { const v = S.fCur[nome]; return `<input class="val-in" style="width:100%;height:34px" type="${tipo || 'text'}" ${tipo === 'number' ? 'min="1" max="5" step="1"' : ''} value="${esc(v == null ? '' : v)}" ${ph ? `placeholder="${ph}"` : ''} oninput="ModuloValidador.setF('${nome}',this.value)" />`; }
function renderDrawerForn() {
  const f = S.fCur; const d = $('val-drawer');
  const abas = [['dados', 'Dados'], ['prod', `Produtos (${S.pf.length})`], ['cand', `Candidatos (${S.fCand.length})`]].map(([k, l]) => `<div class="drawer-tab ${S.fAba === k ? 'active' : ''}" onclick="ModuloValidador.setFAba('${k}')">${l}</div>`).join('');
  const grid = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;padding:20px';
  let corpo;
  if (S.fAba === 'dados') {
    const vOpts = '<option value="">—</option>' + S.viagens.map(v => `<option value="${v.id}" ${v.id === f.id_viagem ? 'selected' : ''}>${esc(v.nome)}</option>`).join('');
    corpo = `<div style="${grid}">${campo('Empresa *', finp('empresa'), true)}${campo('Cidade', finp('cidade'))}${campo('Pessoa de contato', finp('contato_pessoa'))}
      ${campo('WeChat', finp('wechat'))}${campo('Telefone', finp('telefone'))}${campo('E-mail', finp('email'))}${campo('Site / Alibaba', finp('site_alibaba'))}
      ${campo('Viagem', `<select class="filter-select" style="width:100%;height:34px" onchange="ModuloValidador.setF('id_viagem',this.value)">${vOpts}</select>`)}
      ${campo('Confiança (1 a 5)', finp('nota_confianca', 'number'))}
      ${campo('Categorias (separe por vírgula)', `<input class="val-in" style="width:100%;height:34px" value="${esc((f.tags || []).join(', '))}" oninput="ModuloValidador.setF('tags',this.value)" />`, true)}
      <label style="display:flex;gap:8px;align-items:center;font-size:13px"><input type="checkbox" ${f.ja_comprou ? 'checked' : ''} onchange="ModuloValidador.setF('ja_comprou',this.checked)" /> Já comprei deste fornecedor</label>
      ${campo('Código no SGA (se já cadastrado)', finp('id_fornecedor_sga', 'text'))}
      ${campo('Observação', `<textarea class="val-in" style="width:100%;height:80px;padding:8px" oninput="ModuloValidador.setF('observacao',this.value)">${esc(f.observacao || '')}</textarea>`, true)}</div>`;
  } else if (S.fAba === 'prod') {
    if (!f.id) corpo = '<p style="padding:20px;color:var(--text-muted)">Salve o fornecedor antes de cadastrar produtos.</p>';
    else {
      const linhas = S.pf.map(p => `<tr><td>${esc(p.produto)}</td><td>${esc(p.categoria || '')}</td><td class="right mono">${p.fob_usd != null ? 'US$ ' + Number(p.fob_usd).toFixed(2) : '—'}</td><td class="right">${p.moq != null ? p.moq : '—'}</td><td style="font-size:11px">${esc(p.specs || '')}</td>
        <td style="white-space:nowrap"><button class="btn btn-primary" onclick="ModuloValidador.validarProduto(${p.id})">Validar</button> <button class="btn" style="background:transparent;color:var(--orange)" onclick="ModuloValidador.excluirProduto(${p.id})" aria-label="Excluir">✕</button></td></tr>`).join('');
      corpo = `<div style="padding:20px;overflow-x:auto"><table class="data-table"><thead><tr><th>Produto</th><th>Categoria</th><th class="right">FOB</th><th class="right">MOQ</th><th>Specs</th><th></th></tr></thead><tbody>${linhas || '<tr><td colspan="6" style="color:var(--text-muted)">Nenhum produto ainda.</td></tr>'}
        <tr><td><input class="val-in" id="vpf-p" placeholder="Produto" style="min-width:150px;width:100%" /></td><td><input class="val-in" id="vpf-c" placeholder="Categoria" style="min-width:110px;width:100%" /></td><td><input class="val-in" id="vpf-f" type="number" step="any" min="0" placeholder="FOB" style="min-width:80px;width:80px" /></td><td><input class="val-in" id="vpf-m" type="number" min="0" placeholder="MOQ" style="min-width:70px;width:70px" /></td><td><input class="val-in" id="vpf-s" placeholder="Specs" style="min-width:120px;width:100%" /></td><td><button class="btn btn-primary" onclick="ModuloValidador.addProduto()">Adicionar</button></td></tr></tbody></table></div>`;
    }
  } else {
    corpo = S.fCand.length ? `<div style="padding:20px"><table class="data-table"><tbody>${S.fCand.map(c => `<tr style="cursor:pointer" onclick="ModuloValidador.abrirCandDeForn(${c.id})"><td>${esc(c.nome)}</td><td>${chipStatus(c.status)}</td><td class="right">${c.margem_calc != null ? pct(Number(c.margem_calc) * 100) : '—'}</td></tr>`).join('')}</tbody></table></div>` : '<p style="padding:20px;color:var(--text-muted)">Nenhum candidato gerado a partir deste fornecedor.</p>';
  }
  d.innerHTML = `<div class="drawer-header"><div><div style="font-size:16px;font-weight:700">${esc(f.empresa || 'Novo fornecedor')}</div></div><button class="btn" style="background:transparent" onclick="ModuloValidador.fecharDrawer()" aria-label="Fechar">✕</button></div>
    <div class="drawer-tabs">${abas}</div><div class="drawer-body">${corpo}</div>
    <div style="padding:12px 20px;border-top:1px solid var(--border);display:flex;justify-content:flex-end;gap:8px">${f.id ? '<button class="btn" style="background:var(--surface2);border:1px solid var(--border);color:var(--orange);margin-right:auto" onclick="ModuloValidador.excluirForn()">Excluir fornecedor</button>' : ''}<button class="btn btn-primary" onclick="ModuloValidador.salvarForn()">Salvar fornecedor</button></div>`;
}
function setF(k, v) {
  const f = S.fCur; if (!f) return;
  if (k === 'tags') f.tags = String(v).split(/[,;|]/).map(s => s.trim()).filter(Boolean);
  else if (k === 'id_viagem') f.id_viagem = v ? parseInt(v, 10) : null;
  else if (k === 'nota_confianca') { const n = parseInt(v, 10); f.nota_confianca = isNaN(n) ? null : Math.min(5, Math.max(1, n)); }
  else if (k === 'id_fornecedor_sga') { const n = parseInt(v, 10); f.id_fornecedor_sga = isNaN(n) ? null : n; }
  else f[k] = v;
}
function setFAba(k) { S.fAba = k; renderDrawerForn(); }
async function salvarForn() {
  if (S.salvando) return;
  const f = S.fCur;
  if (!f.empresa || !f.empresa.trim()) { toast('Informe o nome da empresa.', true); return; }
  const row = { empresa: f.empresa.trim(), cidade: f.cidade || null, contato_pessoa: f.contato_pessoa || null, wechat: f.wechat || null, email: f.email || null, telefone: f.telefone || null,
    site_alibaba: f.site_alibaba || null, id_viagem: f.id_viagem || null, nota_confianca: f.nota_confianca || null, ja_comprou: !!f.ja_comprou, id_fornecedor_sga: f.id_fornecedor_sga || null,
    tags: f.tags || [], observacao: f.observacao || null, atualizado_em: new Date().toISOString() };
  ocupado(true, 'Salvando…');
  try {
    let id = f.id;
    if (id) await q(sb.from('china_fornecedores').update(row).eq('id', id).select('id').single());
    else { row.criado_por = nomeUsuario(); id = (await q(sb.from('china_fornecedores').insert(row).select('id').single())).id; }
    auditLog(f.id ? 'UPDATE' : 'INSERT', 'china_fornecedores', id, (f.id ? 'Alterou ' : 'Cadastrou ') + row.empresa);
    await carregarChina(); S.fCur = Object.assign({}, S.fornAll.find(x => x.id === id));
    renderChina(); renderDrawerForn(); toast('Fornecedor salvo.');
  } catch (e) { ocupado(false); toast('Não salvou: ' + msgErro(e), true); }
  finally { if (S.salvando) ocupado(false); }
}
async function excluirForn() {
  const f = S.fCur; if (!f || !f.id) return;
  if (!confirm(`Excluir ${f.empresa} e os ${S.pf.length} produtos dele? Candidatos já criados ficam, sem o vínculo.`)) return;
  try {
    await q(sb.from('china_fornecedores').delete().eq('id', f.id).select('id'));
    auditLog('DELETE', 'china_fornecedores', f.id, 'Excluiu ' + f.empresa);
    fecharDrawer(); await carregarChina(); renderChina(); toast('Fornecedor excluído.');
  } catch (e) { toast('Não excluiu: ' + msgErro(e), true); }
}
async function addProduto() {
  const f = S.fCur; const nome = $('vpf-p').value.trim();
  if (!f.id || !nome) { toast('Informe o nome do produto.', true); return; }
  try {
    const row = { id_fornecedor: f.id, produto: nome, categoria: $('vpf-c').value.trim() || null, fob_usd: numIn($('vpf-f').value), moq: numIn($('vpf-m').value), specs: $('vpf-s').value.trim() || null };
    await q(sb.from('china_produtos_fornecedor').insert(row).select('id').single());
    auditLog('INSERT', 'china_produtos_fornecedor', f.id, `Adicionou ${nome} em ${f.empresa}`);
    await abrirForn(f.id); S.fAba = 'prod'; renderDrawerForn(); await carregarChina(); renderChina();
  } catch (e) { toast('Não salvou: ' + msgErro(e), true); }
}
async function excluirProduto(id) {
  if (!confirm('Excluir este produto do fornecedor?')) return;
  try { await q(sb.from('china_produtos_fornecedor').delete().eq('id', id).select('id')); S.pf = S.pf.filter(p => p.id !== id); renderDrawerForn(); await carregarChina(); renderChina(); }
  catch (e) { toast('Não excluiu: ' + msgErro(e), true); }
}
async function validarProduto(id) {
  if (S.salvando) return;
  const p = S.pf.find(x => x.id === id), f = S.fCur; if (!p) return;
  ocupado(true);
  try {
    const ja = await q(sb.from('val_produtos').select('id').eq('id_china_produto', p.id).limit(1));
    if (ja && ja.length) { ocupado(false); toast('Este produto já virou candidato. Abrindo o existente.'); abrirCandDeForn(ja[0].id); return; }
    const row = { nome: p.produto, fob_usd: p.fob_usd, moq: p.moq, id_china_fornecedor: f.id, id_china_produto: p.id, origem: 'Base China: ' + f.empresa, status: 'PAUTA', canal_alvo: 'marketplace', criado_por: nomeUsuario(),
      id_familia: S.familias.find(x => x.ativo) ? S.familias.find(x => x.ativo).id : null };
    const novo = await q(sb.from('val_produtos').insert(row).select('id').single());
    auditLog('INSERT', 'val_produtos', novo.id, `Criou candidato ${p.produto} a partir da Base China (${f.empresa})`);
    ocupado(false);
    await carregarProds(); toast('Candidato criado na Pauta. Preencha preço-alvo e família.');
    abrirCandDeForn(novo.id);
  } catch (e) { ocupado(false); toast('Não criou: ' + msgErro(e), true); }
}
async function abrirCandDeForn(id) {
  if (!S.prods.length || !S.prods.find(p => p.id === id)) await carregarProds();
  abrirCand(id);
}

/* ---------- importar CSV ---------- */
function abrirImportar() {
  let m = $('val-modal');
  if (!m) { m = document.createElement('div'); m.id = 'val-modal'; m.style.cssText = 'position:fixed;inset:0;background:var(--scrim);z-index:400;display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:30px 12px'; document.body.appendChild(m); }
  m.style.display = 'flex';
  const vOpts = S.viagens.map(v => `<option value="${v.id}">${esc(v.nome)}</option>`).join('');
  m.innerHTML = `<div style="background:var(--surface);border-radius:var(--radius-lg);padding:20px;width:560px;max-width:100%">
    <div style="display:flex;justify-content:space-between;align-items:center"><h3 style="margin:0">Importar planilha da viagem (CSV)</h3><button class="btn" style="background:transparent" onclick="ModuloValidador.fecharModal()">✕</button></div>
    <p style="font-size:12px;color:var(--text-muted)">Use o modelo TEMPLATE_CANTON.xlsx. Salve cada aba como CSV. Se o arquivo tiver a coluna <b>produto</b>, é a aba Produtos (a empresa precisa já existir); senão é a aba Fornecedores. Repetir a importação atualiza, não duplica.</p>
    <label style="font-size:12px;color:var(--text-muted)">Viagem dos fornecedores novos<br><select class="filter-select" id="vi-viagem" style="width:100%;height:34px">${vOpts}</select></label>
    <p><input type="file" id="vi-arq" accept=".csv,text/csv" /></p>
    <button class="btn btn-primary" onclick="ModuloValidador.importarCSV()">Importar</button><div id="vi-res" style="margin-top:12px;font-size:12px"></div></div>`;
}
function parseCSV(txt) {
  txt = txt.replace(/^﻿/, '');
  const primeira = txt.split(/\r?\n/, 1)[0];
  const sep = primeira.split(';').length > primeira.split(',').length ? ';' : ',';
  const linhas = []; let cur = [], cel = '', asp = false;
  for (let i = 0; i < txt.length; i++) {
    const ch = txt[i];
    if (asp) { if (ch === '"') { if (txt[i + 1] === '"') { cel += '"'; i++; } else asp = false; } else cel += ch; }
    else if (ch === '"') asp = true;
    else if (ch === sep) { cur.push(cel); cel = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && txt[i + 1] === '\n') i++; cur.push(cel); cel = ''; if (cur.some(x => x.trim() !== '')) linhas.push(cur); cur = []; }
    else cel += ch;
  }
  cur.push(cel); if (cur.some(x => x.trim() !== '')) linhas.push(cur);
  return linhas;
}
const SINON = { contato: 'contato_pessoa', contato_pessoa: 'contato_pessoa', 'e-mail': 'email', email: 'email', site: 'site_alibaba', site_alibaba: 'site_alibaba', nota: 'nota_1a5', nota_1a5: 'nota_1a5',
  observacoes: 'observacao', observacao: 'observacao', fob: 'fob_usd', fob_usd: 'fob_usd', especificacoes: 'specs', specs: 'specs' };
async function importarCSV() {
  const arq = $('vi-arq').files[0], out = $('vi-res');
  if (!arq) { out.textContent = 'Escolha o arquivo CSV.'; return; }
  out.textContent = 'Importando…';
  try {
    const linhas = parseCSV(await arq.text());
    if (linhas.length < 2) throw new Error('Arquivo sem linhas de dados.');
    const cab = linhas[0].map(h => { const n = norm(h).replace(/\s+/g, '_'); return SINON[n] || n; });
    const rows = linhas.slice(1).map(l => { const o = {}; cab.forEach((h, i) => { o[h] = (l[i] || '').trim(); }); return o; }).filter(o => o.empresa);
    const viagem = parseInt($('vi-viagem').value, 10) || null;
    const res = { novos: 0, atualizados: 0, ignorados: 0, avisos: [] };
    const existentes = await q(sb.from('china_fornecedores').select('id,empresa').range(0, 4999));
    const mapa = new Map((existentes || []).map(f => [norm(f.empresa), f.id]));
    if (cab.includes('produto')) {
      const pfEx = await q(sb.from('china_produtos_fornecedor').select('id,id_fornecedor,produto').range(0, 19999));
      const mapaP = new Map((pfEx || []).map(p => [p.id_fornecedor + '|' + norm(p.produto), p.id]));
      for (const r of rows) {
        const idf = mapa.get(norm(r.empresa));
        if (!idf || !r.produto) { res.ignorados++; if (!idf) res.avisos.push('Empresa não cadastrada: ' + r.empresa); continue; }
        const row = { id_fornecedor: idf, produto: r.produto, categoria: r.categoria || null, fob_usd: numBR(r.fob_usd), moq: numBR(r.moq), specs: r.specs || null };
        const ex = mapaP.get(idf + '|' + norm(r.produto));
        if (ex) { await q(sb.from('china_produtos_fornecedor').update(row).eq('id', ex).select('id')); res.atualizados++; }
        else { const n = await q(sb.from('china_produtos_fornecedor').insert(row).select('id').single()); mapaP.set(idf + '|' + norm(r.produto), n.id); res.novos++; }
      }
    } else {
      const vistos = new Map();
      rows.forEach(r => vistos.set(norm(r.empresa), r));
      for (const r of vistos.values()) {
        const row = { empresa: r.empresa };
        ['cidade', 'wechat', 'email', 'telefone', 'site_alibaba', 'observacao'].forEach(k => { if (r[k]) row[k] = r[k]; });
        if (r.contato_pessoa) row.contato_pessoa = r.contato_pessoa;
        const nota = Math.round(numBR(r.nota_1a5)); if (nota >= 1 && nota <= 5) row.nota_confianca = nota;
        if (r.tags) row.tags = r.tags.split(/[;,|]/).map(s => s.trim()).filter(Boolean);
        row.atualizado_em = new Date().toISOString();
        const ex = mapa.get(norm(r.empresa));
        if (ex) { await q(sb.from('china_fornecedores').update(row).eq('id', ex).select('id')); res.atualizados++; }
        else { row.id_viagem = viagem; row.criado_por = nomeUsuario(); await q(sb.from('china_fornecedores').insert(row).select('id').single()); res.novos++; }
      }
    }
    auditLog('IMPORT', 'china_fornecedores', '', `Importou CSV (${res.novos} novos, ${res.atualizados} atualizados, ${res.ignorados} ignorados)`);
    await carregarChina(); renderChina();
    out.innerHTML = `<b>${res.novos}</b> novos, <b>${res.atualizados}</b> atualizados, <b>${res.ignorados}</b> ignorados.` + (res.avisos.length ? '<br>' + [...new Set(res.avisos)].slice(0, 10).map(esc).join('<br>') : '');
  } catch (e) { out.innerHTML = '<span style="color:var(--orange)">Não importou: ' + esc(msgErro(e)) + '</span>'; console.error(e); }
}

/* ---------- PAINEL ---------- */
function renderPainel() {
  const el = $('page-val-painel');
  const P = S.prods;
  const ini = new Date(); ini.setDate(1); ini.setHours(0, 0, 0, 0);
  const doMes = P.filter(p => new Date(p.criado_em) >= ini).length;
  const aprov = P.filter(p => ['GO', 'COMPRADO', 'LANCADO'].includes(p.status));
  const reprov = P.filter(p => p.status === 'NO_GO');
  const decididos = aprov.length + reprov.length;
  const dias = [...aprov, ...reprov].map(p => (new Date(p.atualizado_em) - new Date(p.criado_em)) / 86400000);
  const medio = dias.length ? dias.reduce((a, b) => a + b, 0) / dias.length : null;
  const card = (t, v, s) => `<div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:14px;min-width:170px;flex:1"><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;font-weight:700">${t}</div><div style="font-size:24px;font-weight:800;margin:4px 0">${v}</div><div style="font-size:11px;color:var(--text-muted)">${s}</div></div>`;
  const porFam = S.familias.map(f => { const l = P.filter(p => p.id_familia === f.id); if (!l.length) return null;
    const a = l.filter(p => ['GO', 'COMPRADO', 'LANCADO'].includes(p.status)).length, r = l.filter(p => p.status === 'NO_GO').length;
    const ms = l.filter(p => p.margem_calc != null).map(p => Number(p.margem_calc) * 100);
    return `<tr><td>${esc(f.nome)}</td><td class="right">${l.length}</td><td class="right">${a + r ? pct(a / (a + r) * 100, 0) : '—'}</td><td class="right">${ms.length ? pct(ms.reduce((x, y) => x + y, 0) / ms.length) : '—'}</td></tr>`; }).filter(Boolean).join('');
  const cb = cambioAtual();
  const viram = reprov.map(p => { const r = calcular(Object.assign({}, p, { cambio_usado: cb })); return r.ok && r.go ? { p, r } : null; }).filter(Boolean);
  const bloco = viram.length ? `<div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Candidato</th><th class="right">Margem quando reprovou</th><th class="right">Margem com câmbio ${cb.toFixed(2).replace('.', ',')}</th></tr></thead><tbody>${viram.map(({ p, r }) =>
    `<tr style="cursor:pointer" onclick="ModuloValidador.abrirCandPainel(${p.id})"><td>${esc(p.nome)}</td><td class="right">${chipMargem(p)}</td><td class="right" style="color:var(--green);font-weight:700">${pct(r.margemPct)}</td></tr>`).join('')}</tbody></table></div>`
    : '<p style="color:var(--text-muted)">Nenhum reprovado voltaria a ser GO com o câmbio e os fatores de hoje.</p>';
  el.innerHTML = `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:20px">
    ${card('Entraram no mês', doMes, 'candidatos novos')}${card('Aprovados', decididos ? pct(aprov.length / decididos * 100, 0) : '—', `${aprov.length} de ${decididos} decididos`)}
    ${card('Tempo até decisão', medio != null ? medio.toFixed(1).replace('.', ',') + ' d' : '—', 'média (da entrada à última mudança)')}${card('Aguardando decisão', P.filter(p => p.status === 'TRIADO').length, 'triados')}</div>
    <h4>Por família</h4>${porFam ? `<div style="overflow-x:auto"><table class="data-table"><thead><tr><th>Família</th><th class="right">Candidatos</th><th class="right">% aprovado</th><th class="right">Margem média</th></tr></thead><tbody>${porFam}</tbody></table></div>` : '<p style="color:var(--text-muted)">Sem candidatos ainda.</p>'}
    <h4 style="margin-top:24px">Reprovados que virariam GO com o câmbio de hoje</h4>${bloco}`;
}
async function abrirCandPainel(id) { S.pagina = S.pagina; abrirCand(id); }

/* ---------- API publica ---------- */
const M = window.ModuloValidador = {
  showPage, recarregar, iniciarBadge: async function (usuario) {
    S.usuario = usuario;
    try { const { count } = await sb.from('val_produtos').select('id', { count: 'exact', head: true }).eq('status', 'TRIADO'); const b = $('badge-val-triado'); if (b) { b.textContent = count || 0; b.style.display = count ? '' : 'none'; } } catch (e) { /* tabelas ausentes: sem selo */ }
  },
  novoCand, abrirCand, fecharDrawer, set, setAba, cotacaoHoje, salvar, setStatus, mover, setBusca, setFiltroStatus, setView, toggleNoGo,
  abrirParametros, fecharModal, salvarFamilia, salvarParam,
  novoForn, abrirForn, setF, setFAba, salvarForn, excluirForn, addProduto, excluirProduto, validarProduto, abrirCandDeForn,
  setFBusca, setFiltroChina, abrirImportar, importarCSV, abrirCandPainel,
  _calcular: calcular, _S: S, _parseCSV: parseCSV, _numBR: numBR,
};
})();
