;(function() {
'use strict';

(function() {
  if (document.getElementById('css-compras')) return;
  const style = document.createElement('style');
  style.id = 'css-compras';
  style.textContent = "\n\n\n* { box-sizing: border-box; margin: 0; padding: 0; }\n\n\n\n/* SIDEBAR */\n\n\n\n\n\n\n\n\n\n\n\n\n.sidebar-nav {\n  flex: 1;\n  padding: 16px 12px;\n  overflow-y: auto;\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n.nav-badge {\n  margin-left: auto;\n  background: var(--red);\n  color: #fff;\n  font-size: 10px;\n  font-weight: 700;\n  padding: 1px 6px;\n  border-radius: 10px;\n  min-width: 18px;\n  text-align: center;\n}\n\n.nav-badge.orange { background: var(--orange); }\n.nav-badge.blue { background: var(--blue-mid); }\n\n\n\n.last-update {\n  font-size: 11px;\n  color: rgba(255,255,255,0.3);\n  text-align: center;\n}\n\n/* MAIN */\n.main {\n  position: fixed;\n  left: 240px;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  flex-direction: column;\n  overflow-y: auto;\n}\n\n/* TOPBAR */\n\n\n\n\n\n\n\n\n\n\n.search-input {\n  height: 34px;\n  padding: 0 12px;\n  border: 1px solid var(--border);\n  border-radius: var(--radius-sm);\n  background: var(--surface2);\n  color: var(--text-primary);\n  font-family: 'DM Sans', sans-serif;\n  font-size: 13px;\n  width: 220px;\n  outline: none;\n  transition: border-color 0.15s;\n}\n\n.search-input:focus { border-color: var(--blue-mid); }\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* CONTENT */\n.content {\n  padding: 16px 20px 24px 20px;\n  flex: 1;\n}\n\n\n\n\n/* SECTION TITLE */\n\n\n\n/* CARDS */\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* SEM\u00c1FORO CARDS */\n.semaforo-card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  padding: 16px 20px;\n  box-shadow: var(--shadow-sm);\n  border-left: 4px solid transparent;\n  cursor: pointer;\n  transition: all 0.15s;\n}\n.semaforo-card:hover { box-shadow: var(--shadow-md); transform: translateY(-1px); }\n.semaforo-card.ruptura { border-left-color: var(--red); }\n.semaforo-card.critico { border-left-color: var(--orange); }\n.semaforo-card.baixo   { border-left-color: var(--yellow); }\n.semaforo-card.ok      { border-left-color: var(--green); }\n.semaforo-card.active  { background: var(--blue-pale); border-color: var(--blue-mid); }\n\n.semaforo-card \n.semaforo-card \n\n/* STATUS BADGE */\n\n\n\n\n\n\n\n\n\n\n/* TABLE CARD */\n.table-card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow-sm);\n  overflow: hidden;\n}\n\n.table-card-header {\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 12px;\n}\n\n.table-card-title {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/* TOGGLE BUTTONS */\n.toggle-group {\n  display: flex;\n  gap: 4px;\n}\n\n.toggle-btn {\n  padding: 4px 10px;\n  border-radius: 6px;\n  border: 1px solid var(--border);\n  background: transparent;\n  font-family: 'DM Sans', sans-serif;\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition: all 0.15s;\n  white-space: nowrap;\n}\n\n.toggle-btn.active {\n  background: var(--blue-dark);\n  border-color: var(--blue-dark);\n  color: #fff;\n}\n\n/* CHART CARD */\n.chart-card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  box-shadow: var(--shadow-sm);\n  overflow: hidden;\n}\n\n.chart-header {\n  padding: 14px 20px;\n  border-bottom: 1px solid var(--border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n}\n\n.chart-title {\n  font-size: 13px;\n  font-weight: 600;\n  color: var(--text-primary);\n}\n\n.chart-\n\n/* PAINEL LATERAL (drawer) */\n.drawer-overlay {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(15,29,53,0.4);\n  z-index: 200;\n}\n\n.drawer-overlay.open { display: block; }\n\n.drawer {\n  position: fixed;\n  top: 0;\n  right: -680px;\n  width: 680px;\n  height: 100vh;\n  background: var(--surface);\n  box-shadow: var(--shadow-lg);\n  z-index: 201;\n  display: flex;\n  flex-direction: column;\n  transition: right 0.3s cubic-bezier(0.4,0,0.2,1);\n  overflow: hidden;\n}\n\n.drawer.open { right: 0; }\n\n.drawer-header {\n  padding: 20px 24px;\n  border-bottom: 1px solid var(--border);\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  flex-shrink: 0;\n}\n\n.drawer-title {\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--text-primary);\n  line-height: 1.3;\n}\n\n.drawer-sub {\n  font-size: 12px;\n  color: var(--text-muted);\n  margin-top: 3px;\n}\n\n.drawer-close {\n  width: 32px; height: 32px;\n  border: none;\n  background: var(--surface2);\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 16px;\n  color: var(--text-muted);\n  display: flex; align-items: center; justify-content: center;\n  flex-shrink: 0;\n  margin-left: 12px;\n}\n\n.drawer-close:hover { background: var(--border); color: var(--text-primary); }\n\n.drawer-\n\n.drawer-tabs {\n  display: flex;\n  gap: 0;\n  border-bottom: 1px solid var(--border);\n  margin-bottom: 20px;\n}\n\n.drawer-tab {\n  padding: 10px 16px;\n  font-size: 13px;\n  font-weight: 500;\n  color: var(--text-muted);\n  cursor: pointer;\n  border-bottom: 2px solid transparent;\n  transition: all 0.15s;\n}\n\n.drawer-tab:hover { color: var(--text-primary); }\n.drawer-tab.active { color: var(--blue-mid); border-bottom-color: var(--blue-mid); }\n\n.drawer-tab-content { display: none; }\n.drawer-tab-content.active { display: block; }\n\n/* CARRINHO DE COMPRAS */\n.cart-panel {\n  position: fixed;\n  bottom: 0;\n  left: 240px;\n  right: 0;\n  background: var(--surface);\n  border-top: 2px solid var(--blue-mid);\n  z-index: 150;\n  transform: translateY(100%);\n  transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);\n  max-height: 420px;\n  display: flex;\n  flex-direction: column;\n}\n\n.cart-panel.open { transform: translateY(0); }\n\n.cart-header {\n  padding: 14px 20px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-bottom: 1px solid var(--border);\n  cursor: pointer;\n  flex-shrink: 0;\n}\n\n.cart-title {\n  font-size: 14px;\n  font-weight: 700;\n  color: var(--blue-dark);\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.cart-count {\n  background: var(--blue-mid);\n  color: #fff;\n  font-size: 11px;\n  font-weight: 700;\n  padding: 1px 7px;\n  border-radius: 10px;\n}\n\n.cart-\n\n.cart-footer {\n  padding: 14px 20px;\n  border-top: 1px solid var(--border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  flex-shrink: 0;\n}\n\n/* ESTOQUE VISUAL */\n.cobertura-bar {\n  height: 4px;\n  background: var(--border);\n  border-radius: 2px;\n  margin-top: 4px;\n  overflow: hidden;\n}\n\n.cobertura-fill {\n  height: 100%;\n  border-radius: 2px;\n  transition: width 0.3s;\n}\n\n/* LOADING */\n.loading-row td {\n  text-align: center;\n  padding: 32px;\n  color: var(--text-muted);\n  font-size: 13px;\n}\n\n/* CHAT IA */\n.chat-panel {\n  position: fixed;\n  top: 0; right: -440px; bottom: 0;\n  width: 440px;\n  background: var(--surface);\n  box-shadow: var(--shadow-lg);\n  z-index: 300;\n  display: flex;\n  flex-direction: column;\n  transition: right 0.3s cubic-bezier(0.4,0,0.2,1);\n  border-left: 1px solid var(--border);\n}\n.chat-panel.open { right: 0; }\n\n.chat-header {\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--border);\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  background: linear-gradient(135deg, #1A3A8F, #0077CC);\n  flex-shrink: 0;\n}\n\n.chat-header-title {\n  color: #fff;\n  font-size: 15px;\n  font-weight: 700;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n}\n\n.chat-header-sub {\n  color: rgba(255,255,255,0.6);\n  font-size: 11px;\n  margin-top: 2px;\n}\n\n.chat-messages {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.chat-msg {\n  max-width: 90%;\n  padding: 10px 14px;\n  border-radius: 12px;\n  font-size: 13px;\n  line-height: 1.5;\n}\n\n.chat-msg.user {\n  background: var(--blue-dark);\n  color: #fff;\n  align-self: flex-end;\n  border-bottom-right-radius: 4px;\n}\n\n.chat-msg.ai {\n  background: var(--surface2);\n  color: var(--text-primary);\n  align-self: flex-start;\n  border-bottom-left-radius: 4px;\n  border: 1px solid var(--border);\n}\n\n.chat-msg.ai strong { color: var(--blue-dark); }\n\n.chat-msg.loading {\n  background: var(--surface2);\n  color: var(--text-muted);\n  align-self: flex-start;\n  border: 1px solid var(--border);\n  font-style: italic;\n}\n\n.chat-suggestions {\n  padding: 8px 16px;\n  display: flex;\n  flex-wrap: wrap;\n  gap: 6px;\n  border-top: 1px solid var(--border);\n  flex-shrink: 0;\n}\n\n.chat-suggestion {\n  padding: 5px 10px;\n  background: var(--blue-pale);\n  color: var(--blue-mid);\n  border: 1px solid var(--blue-light);\n  border-radius: 16px;\n  font-size: 11.5px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.15s;\n  font-family: 'DM Sans', sans-serif;\n}\n.chat-suggestion:hover { background: #d0eaf8; }\n\n.chat-input-area {\n  padding: 12px 16px;\n  border-top: 1px solid var(--border);\n  display: flex;\n  gap: 8px;\n  flex-shrink: 0;\n}\n\n.chat-input {\n  flex: 1;\n  padding: 9px 14px;\n  border: 1px solid var(--border);\n  border-radius: 20px;\n  font-family: 'DM Sans', sans-serif;\n  font-size: 13px;\n  outline: none;\n  background: var(--surface2);\n  resize: none;\n  max-height: 80px;\n  min-height: 38px;\n}\n.chat-input:focus { border-color: var(--blue-mid); }\n\n.chat-send {\n  width: 38px; height: 38px;\n  border: none;\n  border-radius: 50%;\n  background: var(--blue-dark);\n  color: #fff;\n  font-size: 16px;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  transition: background 0.15s;\n}\n.chat-send:hover { background: var(--blue-mid); }\n.chat-send:disabled { background: var(--border); cursor: not-allowed; }\n\n.chat-overlay {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(15,29,53,0.3);\n  z-index: 299;\n}\n.chat-overlay.open { display: block; }\n\n\n\n\n\n\n@media (max-width: 768px) {\n  .chat-panel { width: 100%; right: -100%; }\n}\n\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(0,0,0,0.5);\n  z-index: 99;\n}\n\n.menu-toggle {\n  display: none;\n  background: none;\n  border: none;\n  font-size: 20px;\n  cursor: pointer;\n  padding: 4px 8px;\n  color: var(--text-primary);\n}\n\n@media (max-width: 768px) {\n  \n  .sidebar.open { left: 0; }\n  .sidebar-overlay.open { display: block; }\n  .main { left: 0; }\n  .cart-panel { left: 0; }\n  .menu-toggle { display: block; }\n  \n  .drawer { width: 100%; right: -100%; }\n}\n";
  style.textContent += '\n/* DRAWER_ZINDEX_FIX */\n#produto-drawer.drawer,\n#imp-drawer.drawer,\n#forn-drawer.drawer,\n.drawer.open {\n  z-index: 9999 !important;\n  pointer-events: auto !important;\n}\n.drawer-overlay.open {\n  z-index: 9998 !important;\n}\n#produto-drawer .drawer-tab,\n#imp-drawer .drawer-tab,\n#forn-drawer .drawer-tab {\n  pointer-events: auto !important;\n  cursor: pointer !important;\n}\n';
  document.head.appendChild(style);
})();

const PAGINAS_HTML = {
  'cmp-alertas': `<div class="page-content" id="page-cmp-alertas">

    <!-- KPI CARDS SEMÁFORO -->
    <div class="cards-grid cards-grid-4">
      <div class="semaforo-card ruptura" onclick="filtrarSituacao('RUPTURA', this)">
        <div class="card-label">🔴 Ruptura</div>
        <div class="card-value red" id="kpi-ruptura">—</div>
        <div class="card-sub">Estoque zerado com giro</div>
      </div>
      <div class="semaforo-card critico" onclick="filtrarSituacao('CRITICO', this)">
        <div class="card-label">🟠 Crítico</div>
        <div class="card-value orange" id="kpi-critico">—</div>
        <div class="card-sub">Cobertura &lt; lead time</div>
      </div>
      <div class="semaforo-card baixo" onclick="filtrarSituacao('BAIXO', this)">
        <div class="card-label">🟡 Baixo</div>
        <div class="card-value" style="color:var(--yellow)" id="kpi-baixo">—</div>
        <div class="card-sub">Cobertura &lt; 30 dias</div>
      </div>
      <div class="semaforo-card ok" onclick="filtrarSituacao('OK', this)">
        <div class="card-label">🟢 OK</div>
        <div class="card-value green" id="kpi-ok">—</div>
        <div class="card-sub">Estoque adequado</div>
      </div>
    </div>

    <!-- FILTROS INLINE -->
    <div style="display:flex;align-items:center;gap:8px;margin-top:16px;flex-wrap:wrap">
      <input type="text" id="busca-produto" class="search-input"
        placeholder="🔍 Buscar produto ou referência..."
        oninput="onSearch()" style="width:240px" />
      <select id="filtro-grupo" class="filter-select" onchange="onGrupoChange()">
        <option value="">Todos os grupos</option>
      </select>
      <select id="filtro-subgrupo" class="filter-select" onchange="onFilterChange()">
        <option value="">Todos os subgrupos</option>
      </select>
      <select id="filtro-fornecedor" class="filter-select" onchange="onFilterChange()">
        <option value="">Todos os fornecedores</option>
      </select>
      <select id="filtro-situacao" class="filter-select" onchange="onFilterChange()">
        <option value="">Todas as situações</option>
        <option value="RUPTURA">🔴 Ruptura</option>
        <option value="CRITICO">🟠 Crítico</option>
        <option value="BAIXO">🟡 Baixo</option>
        <option value="OK">🟢 OK</option>
        <option value="SEM_MOVIMENTO">⚪ Sem Movimento</option>
      </select>
      <button class="btn" onclick="abrirChat()"
        style="margin-left:auto;background:linear-gradient(135deg,#1A3A8F,#0077CC);color:#fff;height:34px;padding:0 14px;gap:6px">
        ✦ Assistente IA
      </button>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-top:14px">
      <div class="card">
        <div class="card-label">Itens no Pedido Atual</div>
        <div class="card-value blue" id="kpi-pedido-itens">0</div>
        <div class="card-sub" id="kpi-pedido-forn">0 fornecedores</div>
      </div>
      <div class="card">
        <div class="card-label">Valor Estimado</div>
        <div class="card-value" id="kpi-pedido-valor">R$ 0</div>
        <div class="card-sub">base último preço compra</div>
      </div>
      <div class="card" style="display:flex;align-items:center;justify-content:center;gap:12px;flex-direction:column">
        <button class="btn btn-primary" style="width:100%;justify-content:center" onclick="abrirCarrinho()">
          🛒 Ver Pedido em Andamento
        </button>
        <button class="btn btn-success" style="width:100%;justify-content:center" onclick="exportarPedido()">
          ↓ Exportar para Excel
        </button>
      </div>
    </div>

    <!-- TABELA PRINCIPAL -->
    <div class="section-title" style="margin-top:20px">
      Produtos — <span id="alertas-count">carregando...</span>
    </div>
    <div class="table-card">
      <div class="table-card-header">
        <div class="toggle-group">
          <button class="toggle-btn active" onclick="setOrdemAlertas('prioridade', this)">Prioridade</button>
          <button class="toggle-btn" onclick="setOrdemAlertas('cobertura', this)">Menor Cobertura</button>
          <button class="toggle-btn" onclick="setOrdemAlertas('abc', this)">Curva ABC</button>
          <button class="toggle-btn" onclick="setOrdemAlertas('qtd_sugerida', this)">Maior Sugestão</button>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:12px;color:var(--text-muted)" id="selected-count"></span>
          <button class="btn btn-outline" onclick="adicionarSelecionados()" id="btn-add-selected" style="display:none">
            + Adicionar Selecionados ao Pedido
          </button>
        </div>
      </div>
      <div style="overflow-x:auto;max-height:520px;overflow-y:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:32px"><input type="checkbox" id="check-all" onchange="toggleCheckAll(this)" /></th>
              <th onclick="setOrdemAlertas('nome',this)" style="cursor:pointer;user-select:none">Produto <span class="sort-icon">↕</span></th>
              <th>Grupo</th>
              <th class="right" onclick="setOrdemAlertas('estoque',this)" style="cursor:pointer;user-select:none">Estoque <span class="sort-icon">↕</span></th>
              <th class="right" onclick="setOrdemAlertas('cobertura',this)" style="cursor:pointer;user-select:none">Cobertura <span class="sort-icon">↕</span></th>
              <th class="right" onclick="setOrdemAlertas('qtd_sugerida',this)" style="cursor:pointer;user-select:none">Qtd Sugerida <span class="sort-icon">↕</span></th>
              <th class="right" onclick="setOrdemAlertas('pedido_aberto',this)" style="cursor:pointer;user-select:none">Ped. Aberto <span class="sort-icon">↕</span></th>
              <th onclick="setOrdemAlertas('prioridade',this)" style="cursor:pointer;user-select:none">Situação <span class="sort-icon">↕</span></th>
              <th onclick="setOrdemAlertas('abc',this)" style="cursor:pointer;user-select:none">ABC <span class="sort-icon">↕</span></th>
              <th>Fornecedor</th>
              <th style="width:48px"></th>
            </tr>
          </thead>
          <tbody id="alertas-body">
            <tr class="loading-row"><td colspan="11">Carregando dados...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <!-- OVERLAY + DRAWER PRODUTO -->
  <div class="drawer-overlay" id="drawer-overlay" onclick="fecharDrawer()"></div>
  <div class="drawer" id="produto-drawer">
    <div class="drawer-header">
      <div>
        <div class="drawer-title" id="drawer-produto-nome">—</div>
        <div class="drawer-sub" id="drawer-produto-ref">—</div>
      </div>
      <button class="drawer-close" onclick="fecharDrawer()">✕</button>
    </div>
    <div style="padding:0 24px;border-bottom:1px solid var(--border);flex-shrink:0">
      <div class="drawer-tabs" style="border:none;margin:0">
        <div class="drawer-tab active" onclick="switchDrawerTab('resumo',this)">📊 Resumo</div>
        <div class="drawer-tab" onclick="switchDrawerTab('historico',this)">📋 Histórico</div>
        <div class="drawer-tab" onclick="switchDrawerTab('fornecedores',this)">🏭 Fornecedores</div>
        <div class="drawer-tab" onclick="switchDrawerTab('estoque',this)">🏪 Estoque</div>
        <div class="drawer-tab" onclick="switchDrawerTab('pedido',this)">🛒 Pedido</div>
      </div>
    </div>
    <div style="flex:1;overflow-y:auto">

      <!-- TAB RESUMO (inclui giro) -->
      <div class="drawer-tab-content active" id="dtab-resumo" style="padding:16px 20px">

        <!-- Linha 1: situação atual -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px">
          <div class="card" style="padding:12px 14px">
            <div class="card-label">Estoque Total</div>
            <div class="card-value" id="dr-estoque-total" style="font-size:20px">—</div>
            <div class="card-sub" id="dr-estoque-sub"></div>
          </div>
          <div class="card" style="padding:12px 14px">
            <div class="card-label">Cobertura</div>
            <div class="card-value" id="dr-cobertura" style="font-size:20px">—</div>
            <div class="card-sub">dias de estoque</div>
          </div>
          <div class="card" style="padding:12px 14px">
            <div class="card-label">Qtd Sugerida</div>
            <div class="card-value blue" id="dr-sugerida" style="font-size:20px">—</div>
            <div class="card-sub">reposição sugerida</div>
          </div>
          <div class="card" style="padding:12px 14px">
            <div class="card-label">Lead Time</div>
            <div class="card-value" id="dr-lead-time" style="font-size:20px">—</div>
            <div class="card-sub" id="dr-lead-time-sub"></div>
          </div>
        </div>

        <!-- Linha 2: datas + pedido -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">
          <div class="card" style="padding:12px 14px">
            <div class="card-label">Consumo/dia</div>
            <div class="card-value" id="dr-consumo" style="font-size:18px">—</div>
          </div>
          <div class="card" style="padding:12px 14px">
            <div class="card-label">Pedido Aberto</div>
            <div class="card-value" id="dr-pedido-aberto" style="font-size:18px">—</div>
          </div>
          <div class="card" style="padding:12px 14px">
            <div class="card-label">Última Compra</div>
            <div class="card-value" id="dr-ultima-compra" style="font-size:14px">—</div>
          </div>
          <div class="card" style="padding:12px 14px">
            <div class="card-label">Última Venda</div>
            <div class="card-value" id="dr-ultima-venda" style="font-size:14px">—</div>
          </div>
        </div>

        <!-- Vendidos por período -->
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-muted);margin-bottom:8px">Vendido por período</div>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px">
          <div class="card" style="padding:12px 14px;border-left:3px solid var(--red)">
            <div class="card-label">30 dias</div>
            <div class="card-value" id="dr-vend-30" style="font-size:20px">—</div>
          </div>
          <div class="card" style="padding:12px 14px;border-left:3px solid var(--orange)">
            <div class="card-label">60 dias</div>
            <div class="card-value" id="dr-vend-60" style="font-size:20px">—</div>
          </div>
          <div class="card" style="padding:12px 14px;border-left:3px solid var(--blue-mid)">
            <div class="card-label">90 dias</div>
            <div class="card-value" id="dr-vend-90" style="font-size:20px">—</div>
          </div>
          <div class="card" style="padding:12px 14px;border-left:3px solid var(--green)">
            <div class="card-label">180 dias</div>
            <div class="card-value" id="dr-vend-180" style="font-size:20px">—</div>
          </div>
        </div>

        <!-- Gráfico mensal -->
        <div id="dtab-giro-inner">
          <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px">Carregando giro...</div>
        </div>

      </div><!-- /dtab-resumo -->
      <div class="drawer-tab-content" id="dtab-historico" style="padding:20px 24px">
        <div id="hist-alertas"></div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
          <div style="font-size:13px;font-weight:600">Movimentações</div>
          <div class="toggle-group">
            <button class="toggle-btn active" onclick="setHistFiltro('todos',this)">Todos</button>
            <button class="toggle-btn" onclick="setHistFiltro('entradas',this)">Entradas</button>
            <button class="toggle-btn" onclick="setHistFiltro('saidas',this)">Saídas</button>
          </div>
        </div>
        <div class="table-card"><div style="overflow-x:auto;max-height:420px;overflow-y:auto">
          <table class="data-table">
            <thead><tr><th>Data</th><th>Tipo</th><th>Origem</th><th>Empresa</th><th class="right">Qtd</th></tr></thead>
            <tbody id="dr-historico-body"><tr class="loading-row"><td colspan="5">Carregando...</td></tr></tbody>
          </table>
        </div></div>
      </div>
      <div class="drawer-tab-content" id="dtab-fornecedores" style="padding:20px 24px">
        <div id="dr-forn-container"><div style="text-align:center;padding:32px;color:var(--text-muted)">Carregando...</div></div>
      </div>
      <div class="drawer-tab-content" id="dtab-estoque" style="padding:20px 24px">
        <div class="table-card"><div style="overflow-x:auto;max-height:480px;overflow-y:auto">
          <table class="data-table">
            <thead><tr><th>Empresa</th><th>Centro</th><th class="right">Estoque</th><th class="right">Reserva</th><th>Status</th></tr></thead>
            <tbody id="dr-estoque-body"><tr class="loading-row"><td colspan="5">Carregando...</td></tr></tbody>
          </table>
        </div></div>
      </div>
      <div class="drawer-tab-content" id="dtab-pedido" style="padding:20px 24px">
        <div id="pedido-forn-list"><div style="text-align:center;padding:32px;color:var(--text-muted)">Carregando...</div></div>
      </div>
    </div>
  </div>

  <!-- CARRINHO -->
  <div class="cart-panel" id="cart-panel">
    <div class="cart-header" onclick="toggleCarrinho()">
      <div class="cart-title">🛒 Pedido em Andamento <span class="cart-count" id="cart-count">0</span></div>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:14px;font-weight:700;font-family:'DM Mono',monospace" id="cart-total-valor">R$ 0</span>
        <span id="cart-chevron" style="font-size:12px;color:var(--text-muted)">▲</span>
      </div>
    </div>
    <div id="cart-body" style="flex:1;overflow-y:auto">
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Fornecedor</th><th class="right">Sugerido</th><th class="right">Pedido</th><th class="right">Vl Unit</th><th class="right">Total</th><th></th></tr></thead>
          <tbody id="cart-items-body"></tbody>
        </table>
      </div>
    </div>
    <div class="cart-footer">
      <div style="font-size:13px;color:var(--text-muted)">Pedido de compras</div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-outline" onclick="exportarPedido()">↓ Exportar Excel</button>
        <button class="btn btn-primary" onclick="document.getElementById('cart-panel').classList.remove('open')">Fechar</button>
      </div>
    </div>
  </div>`,

  'cmp-totais': `<div class="page-content" id="page-cmp-totais">

    <div class="cards-grid cards-grid-4">
      <div class="card">
        <div class="card-label">Total SKUs Ativos</div>
        <div class="card-value blue" id="tot-skus">—</div>
        <div class="card-sub">produtos tipo V com estoque</div>
      </div>
      <div class="card">
        <div class="card-label">Valor em Estoque</div>
        <div class="card-value" id="tot-valor">—</div>
        <div class="card-sub">preço médio de compra</div>
      </div>
      <div class="card">
        <div class="card-label">Produtos Negativos</div>
        <div class="card-value orange" id="tot-negativos">—</div>
        <div class="card-sub">estoque abaixo de zero</div>
      </div>
      <div class="card">
        <div class="card-label">Sem Movimento 90d</div>
        <div class="card-value" style="color:var(--text-secondary)" id="tot-sem-mov">—</div>
        <div class="card-sub">sem saída recente</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:20px">
      <div class="table-card">
        <div class="table-card-header">
          <span class="table-card-title">Estoque por Grupo</span>
          <div class="toggle-group">
            <button class="toggle-btn active" onclick="setTotOrdem('valor', this)">Por Valor</button>
            <button class="toggle-btn" onclick="setTotOrdem('qtd', this)">Por SKUs</button>
          </div>
        </div>
        <div style="overflow-x:auto;max-height:400px;overflow-y:auto">
          <table class="data-table">
            <thead><tr>
              <th>Grupo</th>
              <th class="right">SKUs</th>
              <th class="right">Valor Estoque</th>
              <th class="right">Rupturas</th>
            </tr></thead>
            <tbody id="tot-grupos-body">
              <tr class="loading-row"><td colspan="4">Carregando...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div class="chart-card">
          <div class="chart-header"><span class="chart-title">Distribuição por Curva ABC</span></div>
          <div class="chart-body"><canvas id="chart-abc" height="180"></canvas></div>
        </div>
        <div class="chart-card" style="margin-top:14px">
          <div class="chart-header"><span class="chart-title">Situação do Estoque</span></div>
          <div class="chart-body"><canvas id="chart-situacao" height="180"></canvas></div>
        </div>
      </div>
    </div>

  </div>`,

  'cmp-balanco': `<div class="page-content" id="page-cmp-balanco">

    <!-- SESSÕES ATIVAS -->
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
      <div>
        <div style="font-size:15px;font-weight:600">Balanço Físico</div>
        <div style="font-size:12px;color:var(--text-muted);margin-top:2px">Contagem cega — o sistema não mostra o saldo até você finalizar</div>
      </div>
      <button class="btn btn-primary" onclick="novasSessao()">+ Nova Sessão de Contagem</button>
    </div>

    <div class="table-card">
      <div class="table-card-header">
        <span class="table-card-title">Sessões de Contagem</span>
      </div>
      <div style="overflow-x:auto">
        <table class="data-table">
          <thead><tr>
            <th>Sessão</th>
            <th>Empresa / Centro</th>
            <th class="right">Itens Contados</th>
            <th class="right">Divergências</th>
            <th>Status</th>
            <th class="right">Data</th>
            <th></th>
          </tr></thead>
          <tbody id="balanco-body">
            <tr class="loading-row"><td colspan="7">Carregando sessões...</td></tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>`,

  'cmp-importacao': `<div class="page-content" id="page-cmp-importacao">

    <!-- KPI cards -->
    <div class="cards-grid cards-grid-4">
      <div class="card">
        <div class="card-label">Em Produção</div>
        <div class="card-value blue" id="imp-kpi-producao">—</div>
        <div class="card-sub">processos ativos</div>
      </div>
      <div class="card">
        <div class="card-label">Em Transporte</div>
        <div class="card-value" id="imp-kpi-transporte">—</div>
        <div class="card-sub">a caminho</div>
      </div>
      <div class="card">
        <div class="card-label">A Pagar</div>
        <div class="card-value orange" id="imp-kpi-apagar">—</div>
        <div class="card-sub" id="imp-kpi-apagar-sub">—</div>
      </div>
      <div class="card">
        <div class="card-label">Chegada Próxima</div>
        <div class="card-value" style="font-size:16px" id="imp-kpi-proxima">—</div>
        <div class="card-sub" id="imp-kpi-proxima-forn">—</div>
      </div>
    </div>

    <!-- Kanban -->
    <div style="margin-top:20px;display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div style="font-size:13px;font-weight:600;color:var(--text-primary)">Processos de Importação</div>
      <div style="display:flex;gap:8px">
        <div class="toggle-group" id="imp-view-toggle">
          <button class="toggle-btn active" onclick="setImpView('kanban',this)">Kanban</button>
          <button class="toggle-btn" onclick="setImpView('lista',this)">Lista</button>
        </div>
        <button class="btn btn-primary" onclick="abrirModalNovoProcesso()">+ Novo Processo</button>
      </div>
    </div>

    <!-- KANBAN VIEW -->
    <div id="imp-kanban" style="display:flex;gap:12px;overflow-x:auto;padding-bottom:12px">
      <!-- colunas geradas dinamicamente -->
    </div>

    <!-- LISTA VIEW -->
    <div id="imp-lista" style="display:none">
      <div class="table-card">
        <div style="overflow-x:auto">
          <table class="data-table">
            <thead><tr>
              <th>Código</th>
              <th>Fornecedor</th>
              <th>Importadora</th>
              <th>Status</th>
              <th class="right">Pedidos</th>
              <th class="right">Chegada Prev.</th>
              <th class="right">Total USD</th>
              <th class="right">Pago BRL</th>
              <th class="right">A Pagar BRL</th>
              <th></th>
            </tr></thead>
            <tbody id="imp-lista-body">
              <tr class="loading-row"><td colspan="10">Carregando...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

  </div><!-- end page-importacao -->

  <!-- MODAL PROCESSO -->
  <div id="modal-processo-overlay" style="display:none;position:fixed;inset:0;background:rgba(15,29,53,0.5);z-index:400;align-items:flex-start;justify-content:center;padding-top:40px;overflow-y:auto">
    <div style="background:var(--surface);border-radius:var(--radius);width:min(700px,95vw);box-shadow:var(--shadow-lg);margin-bottom:40px">
      <div style="padding:18px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <div style="font-size:15px;font-weight:700" id="modal-processo-title">Novo Processo de Importação</div>
        <button onclick="fecharModalProcesso()" style="background:var(--surface2);border:none;border-radius:6px;width:30px;height:30px;cursor:pointer;font-size:16px">✕</button>
      </div>
      <div style="padding:20px 24px" id="modal-processo-body">
        <!-- conteúdo gerado dinamicamente -->
      </div>
    </div>
  </div>

  <!-- DRAWER DETALHE DO PROCESSO -->
  <div class="drawer-overlay" id="imp-drawer-overlay" onclick="fecharImpDrawer()"></div>
  <div class="drawer" id="imp-drawer" style="width:720px">
    <div class="drawer-header">
      <div>
        <div class="drawer-title" id="imp-drawer-titulo">—</div>
        <div class="drawer-sub" id="imp-drawer-sub">—</div>
      </div>
      <button class="drawer-close" onclick="fecharImpDrawer()">✕</button>
    </div>
    <div style="padding:0 24px;border-bottom:1px solid var(--border)">
      <div class="drawer-tabs" style="border:none;margin:0">
        <div class="drawer-tab active" onclick="switchImpTab('info',this)">Informações</div>
        <div class="drawer-tab" onclick="switchImpTab('pedidos',this)">Pedidos & Produtos</div>
        <div class="drawer-tab" onclick="switchImpTab('pagamentos',this)">Pagamentos</div>
      </div>
    </div>
    <div class="drawer-body">
      <div class="drawer-tab-content active" id="imptab-info"></div>
      <div class="drawer-tab-content" id="imptab-pedidos"></div>
      <div class="drawer-tab-content" id="imptab-pagamentos"></div>
    </div>
  </div>`,

  'cmp-fornecedores': `<div class="page-content" id="page-cmp-fornecedores">

    <div class="cards-grid cards-grid-3">
      <div class="card">
        <div class="card-label">Fornecedores Ativos</div>
        <div class="card-value blue" id="forn-total">—</div>
        <div class="card-sub">compramos nos últimos 12m</div>
      </div>
      <div class="card">
        <div class="card-label">Volume Total Comprado</div>
        <div class="card-value" id="forn-volume">—</div>
        <div class="card-sub">últimos 12 meses</div>
      </div>
      <div class="card">
        <div class="card-label">Lead Time Médio</div>
        <div class="card-value" id="forn-lead">—</div>
        <div class="card-sub">dias (apenas compras com recebimento)</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-top:20px">
      <div class="table-card">
        <div class="table-card-header">
          <span class="table-card-title">Ranking de Fornecedores</span>
          <div class="toggle-group">
            <button class="toggle-btn active" onclick="setFornOrdem('volume', this)">Volume R$</button>
            <button class="toggle-btn" onclick="setFornOrdem('compras', this)">Nº Compras</button>
            <button class="toggle-btn" onclick="setFornOrdem('produtos', this)">Nº Produtos</button>
            <button class="toggle-btn" onclick="setFornOrdem('lead', this)">Lead Time</button>
          </div>
        </div>
        <div style="overflow-x:auto;max-height:500px;overflow-y:auto">
          <table class="data-table">
            <thead><tr>
              <th>#</th>
              <th>Fornecedor</th>
              <th class="right">Volume 12m</th>
              <th class="right">Nº Compras</th>
              <th class="right">Produtos</th>
              <th class="right">Lead Pedido→NF</th>
              <th class="right">Última Compra</th>
            </tr></thead>
            <tbody id="forn-ranking-body">
              <tr class="loading-row"><td colspan="7">Carregando...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">Top 10 por Volume</span></div>
        <div class="chart-body"><canvas id="chart-forn-top10" height="340"></canvas></div>
      </div>
    </div>

  </div>

  <!-- DRAWER DETALHE FORNECEDOR -->
  <div class="drawer-overlay" id="forn-drawer-overlay" onclick="fecharFornDrawer()"></div>
  <div class="drawer" id="forn-drawer" style="width:720px">
    <div class="drawer-header">
      <div>
        <div class="drawer-title" id="forn-drawer-nome">—</div>
        <div class="drawer-sub" id="forn-drawer-sub">—</div>
      </div>
      <button class="drawer-close" onclick="fecharFornDrawer()">✕</button>
    </div>
    <div style="padding:0 24px;border-bottom:1px solid var(--border)">
      <div class="drawer-tabs" style="border:none;margin:0">
        <div class="drawer-tab active" onclick="switchFornTab('resumo',this)">Resumo</div>
        <div class="drawer-tab" onclick="switchFornTab('produtos',this)">Produtos</div>
        <div class="drawer-tab" onclick="switchFornTab('historico',this)">Histórico de Compras</div>
      </div>
    </div>
    <div class="drawer-body">
      <div class="drawer-tab-content active" id="forntab-resumo"></div>
      <div class="drawer-tab-content" id="forntab-produtos"></div>
      <div class="drawer-tab-content" id="forntab-historico"></div>
    </div>
  </div>`,

  'cmp-chat': `
  <!-- CHAT IA OVERLAY -->
  <div class="chat-overlay" id="chat-overlay" onclick="fecharChat()"></div>
  <div class="chat-panel" id="chat-panel">
    <div class="chat-header">
      <div>
        <div class="chat-header-title">✦ Assistente de Compras</div>
        <div class="chat-header-sub">Powered by Claude · Bononi Acessórios</div>
      </div>
      <button onclick="fecharChat()" style="background:rgba(255,255,255,0.15);border:none;border-radius:6px;width:28px;height:28px;color:#fff;cursor:pointer;font-size:14px">✕</button>
    </div>
    <div class="chat-messages" id="chat-messages">
      <div class="chat-msg ai">
        Olá! Sou o assistente de compras da Bononi. Posso te ajudar com:<br><br>
        • <strong>Pedidos por fornecedor</strong> — "Monta um pedido para a Rodoplast"<br>
        • <strong>Análise de produto</strong> — "Analisa o estoque de fechaduras"<br>
        • <strong>Situação geral</strong> — "Quais produtos estão em ruptura?"<br>
        • <strong>Sugestões</strong> — "O que preciso comprar urgente hoje?"
      </div>
    </div>
    <div class="chat-suggestions" id="chat-suggestions">
      <button class="chat-suggestion" onclick="enviarSugestao(this)">📦 O que preciso comprar urgente?</button>
      <button class="chat-suggestion" onclick="enviarSugestao(this)">🏆 Quais os maiores fornecedores?</button>
      <button class="chat-suggestion" onclick="enviarSugestao(this)">🔴 Produtos em ruptura curva A</button>
      <button class="chat-suggestion" onclick="enviarSugestao(this)">📋 Resumo da situação hoje</button>
    </div>
    <div id="chat-save-bar" style="display:none;padding:10px 16px;border-top:1px solid var(--border);background:var(--surface2);flex-shrink:0;gap:8px">
      <button onclick="salvarSugestaoCompraIA()" style="flex:1;padding:9px;background:var(--green);border:none;border-radius:8px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer">
        💾 Salvar Sugestão IA
      </button>
      <button onclick="abrirHistoricoSugestoes()" style="padding:9px 14px;background:var(--surface);border:1px solid var(--border);border-radius:8px;color:var(--text-secondary);font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer">
        📋 Histórico
      </button>
    </div>
    <div class="chat-input-area">
      <textarea class="chat-input" id="chat-input" placeholder="Digite sua pergunta..." rows="1"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();enviarChat()}"
        oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,80)+'px'"></textarea>
      <button class="chat-send" id="chat-send" onclick="enviarChat()">➤</button>
    </div>
  </div>

  <!-- TOAST -->
  <div id="toast" style="display:none;position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1A3A8F;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:999;box-shadow:var(--shadow-lg);white-space:nowrap"></div>

  <!-- MODAL HISTÓRICO SUGESTÕES -->
  <div id="modal-historico-overlay" style="display:none;position:fixed;inset:0;background:rgba(15,29,53,0.5);z-index:500;align-items:center;justify-content:center">
    <div style="background:var(--surface);border-radius:var(--radius);width:min(800px,95vw);max-height:85vh;display:flex;flex-direction:column;box-shadow:var(--shadow-lg)">
      <div style="padding:18px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0">
        <div style="font-size:15px;font-weight:700">📋 Histórico de Sugestões IA</div>
        <button onclick="fecharHistoricoSugestoes()" style="background:var(--surface2);border:none;border-radius:6px;width:30px;height:30px;cursor:pointer;font-size:16px">✕</button>
      </div>
      <div style="flex:1;overflow-y:auto;padding:16px 24px" id="historico-sugestoes-body">
        <div style="text-align:center;padding:32px;color:var(--text-muted)">Carregando...</div>
      </div>
    </div>
  </div>`,

};
// ══════════════════════════════════════════
let alertasData = [];
let alertasFiltrados = [];
let ordemAlertas = 'prioridade';
let ordemDir = 'desc';
let filtroSituacaoAtivo = '';
let cartItems = [];
let chartGiroMensal = null;
let chartABC = null;
let chartSituacao = null;
let chartFornTop10 = null;
let produtoAtual = null;

// ══════════════════════════════════════════
// UTILITÁRIOS
// ══════════════════════════════════════════
function fmt(v) {
  if (v === null || v === undefined || isNaN(v)) return '—';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(v);
}

function fmtQtd(v, dec = 0) {
  if (v === null || v === undefined || isNaN(v)) return '—';
  return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);
}

function fmtData(d) {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('pt-BR');
}

function badgeSituacao(s) {
  const map = {
    'RUPTURA': 'badge-ruptura',
    'CRITICO': 'badge-critico',
    'BAIXO': 'badge-baixo',
    'OK': 'badge-ok',
    'SEM_MOVIMENTO': 'badge-sem_mov'
  };
  const label = { 'RUPTURA': '🔴 Ruptura', 'CRITICO': '🟠 Crítico', 'BAIXO': '🟡 Baixo', 'OK': '🟢 OK', 'SEM_MOVIMENTO': '⚪ Sem Mov.' };
  return `<span class="badge ${map[s] || 'badge-sem_mov'}">${label[s] || s}</span>`;
}

function badgeABC(abc) {
  if (!abc) return '—';
  const cls = { A: 'badge-a', B: 'badge-b', C: 'badge-c' };
  return `<span class="badge ${cls[abc] || ''}">${abc}</span>`;
}

// ══════════════════════════════════════════
// NAVEGAÇÃO
// ══════════════════════════════════════════
const pageTitles = {
  alertas:      ['Alertas e Reposição',    'Compras · Estoque'],
  totais:       ['Totais de Estoque',       'Compras · Estoque'],
  balanco:      ['Balanço Físico',          'Compras · Contagem'],
  fornecedores: ['Ranking de Fornecedores', 'Compras · Fornecedores'],
  importacao:   ['Importação',              'Compras · Importação'],
};



// ══════════════════════════════════════════
// LOAD ALL
// ══════════════════════════════════════════
// Cache global de fornecedores por produto
let fornProdMap = {}; // { id_produto: [ {id_fornecedor, nome_fornecedor, preco_fornecedor, referencia_fornecedor} ] }

async function loadAll() {
  await loadAlertas(); // fornProdCache carrega sob demanda no drawer
  atualizarBadgeSidebar();
  renderAlertas(); // re-render com fornecedores carregados
}

async function loadFornProdCache() {
  try {
    const pages = await Promise.all(
      [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i =>
        sb.from('vw_fb_forn_prod')
          .select('id_produto,id_fornecedor,nome_fornecedor,preco_fornecedor,referencia_fornecedor')
          .range(i * 1000, i * 1000 + 999)
      )
    );
    fornProdMap = {};
    pages.flatMap(r => r.data || []).forEach(r => {
      if (!fornProdMap[r.id_produto]) fornProdMap[r.id_produto] = [];
      fornProdMap[r.id_produto].push(r);
    });
  } catch(e) { console.error('Erro ao carregar fornecedores:', e); }
}

// ══════════════════════════════════════════
// ALERTAS E REPOSIÇÃO
// ══════════════════════════════════════════
// alertasData = linhas brutas produto x empresa (para drawer detalhe)
// alertasConsolidado = view consolidada, 1 linha por produto
let alertasConsolidado = [];

async function loadAlertas() {
  document.getElementById('alertas-body').innerHTML = '<tr class="loading-row"><td colspan="11">Carregando dados...</td></tr>';

  try {
    // Supabase limita 1000 por request — buscar 8 páginas em paralelo (cobre até 8000 produtos)
    const pages = await Promise.all(
      [0,1,2,3,4,5,6,7].map(i =>
        sb.from('comp_produtos_consolidado')
          .select('*')
          .range(i * 1000, i * 1000 + 999)
      )
    );

    alertasConsolidado = pages.flatMap(r => r.data || []);
    popularFiltroGrupos();
    renderAlertas();
    atualizarKPIs();
    document.getElementById('last-update').textContent = 'Atualizado: ' + new Date().toLocaleTimeString('pt-BR');

  } catch (e) {
    console.error(e);
    document.getElementById('alertas-body').innerHTML =
      `<tr class="loading-row"><td colspan="11" style="color:var(--red)">Erro ao carregar dados. Verifique a conexão.</td></tr>`;
  }
}

function popularFiltroGrupos() {
  const grupos = [...new Set(alertasConsolidado.map(r => r.grupo).filter(Boolean))].sort();
  const sel = document.getElementById('filtro-grupo'); if (!sel) return;
  const val = sel.value;
  sel.innerHTML = '<option value="">Todos os grupos</option>' +
    grupos.map(g => `<option value="${g}" ${g === val ? 'selected' : ''}>${g}</option>`).join('');
  popularFiltroSubgrupos();
  popularFiltroFornecedores();
}

function popularFiltroSubgrupos(grupoFiltro) {
  const dados = grupoFiltro
    ? alertasConsolidado.filter(r => r.grupo === grupoFiltro)
    : alertasConsolidado;
  const subs = [...new Set(dados.map(r => r.subgrupo).filter(Boolean))].sort();
  const sel = document.getElementById('filtro-subgrupo');
  const val = sel.value;
  sel.innerHTML = '<option value="">Todos subgrupos</option>' +
    subs.map(s => `<option value="${s}" ${s === val ? 'selected' : ''}>${s}</option>`).join('');
}

function popularFiltroFornecedores() {
  // Pegar fornecedores dos produtos filtrados
  const prodIds = new Set(alertasConsolidado.map(r => r.id_produto));
  const fornSet = new Map();
  Object.entries(fornProdMap).forEach(([idProd, forns]) => {
    if (prodIds.has(parseInt(idProd))) {
      forns.forEach(f => fornSet.set(f.id_fornecedor, f.nome_fornecedor));
    }
  });
  const sorted = [...fornSet.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  const sel = document.getElementById('filtro-fornecedor');
  const val = sel.value;
  sel.innerHTML = '<option value="">Todos fornecedores</option>' +
    sorted.map(([id, nome]) => `<option value="${id}" ${String(id) === val ? 'selected' : ''}>${nome}</option>`).join('');
}

function onGrupoChange() {
  const grupo = document.getElementById('filtro-grupo')?.value || '';
  document.getElementById('filtro-subgrupo').value = '';
  popularFiltroSubgrupos(grupo);
  paginaAtual = 1;
  onFilterChange();
}

function atualizarKPIs() {
  const count = (sit) => alertasConsolidado.filter(r => r.situacao_estoque === sit).length;
  document.getElementById('kpi-ruptura')?.textContent  && (document.getElementById('kpi-ruptura').textContent = fmtQtd(count('RUPTURA')));
  document.getElementById('kpi-critico')?.textContent  && (document.getElementById('kpi-critico').textContent = fmtQtd(count('CRITICO')));
  document.getElementById('kpi-baixo')?.textContent    && (document.getElementById('kpi-baixo').textContent = fmtQtd(count('BAIXO')));
  document.getElementById('kpi-ok')?.textContent       && (document.getElementById('kpi-ok').textContent = fmtQtd(count('OK')));
  const badge = document.getElementById('badge-ruptura');
  if (badge) badge.textContent = count('RUPTURA');
}

function atualizarBadgeSidebar() {
  const rupturas = alertasConsolidado.filter(r => r.situacao_estoque === 'RUPTURA').length;
  const el = document.getElementById('badge-ruptura');
  if (el) el.textContent = rupturas;
}

function onFilterChange() {
  filtroSituacaoAtivo = document.getElementById('filtro-situacao')?.value || '';
  document.querySelectorAll('.semaforo-card').forEach(c => c.classList.remove('active'));
  paginaAtual = 1;
  renderAlertas();
}

function onSearch() { paginaAtual = 1; renderAlertas(); }

function filtrarSituacao(sit, card) {
  const isSame = filtroSituacaoAtivo === sit;
  filtroSituacaoAtivo = isSame ? '' : sit;
  document.getElementById('filtro-situacao').value = filtroSituacaoAtivo;
  document.querySelectorAll('.semaforo-card').forEach(c => c.classList.remove('active'));
  if (!isSame) card.classList.add('active');
  paginaAtual = 1;
  renderAlertas();
}

function setOrdemAlertas(ordem, btn) {
  // Toggle direção se mesma coluna
  if (ordemAlertas === ordem) {
    ordemDir = ordemDir === 'asc' ? 'desc' : 'asc';
  } else {
    ordemAlertas = ordem;
    // Direção padrão por coluna
    ordemDir = ['cobertura','estoque','pedido_aberto'].includes(ordem) ? 'asc' : 'desc';
  }
  // Atualizar ícones nos th
  document.querySelectorAll('#page-cmp-alertas .sort-icon').forEach(el => el.textContent = '↕');
  if (btn && btn.querySelector) {
    const icon = btn.querySelector ? btn.querySelector('.sort-icon') : null;
    if (icon) icon.textContent = ordemDir === 'asc' ? '↑' : '↓';
  } else if (btn && btn.tagName === 'TH') {
    const icon = btn.querySelector('.sort-icon');
    if (icon) icon.textContent = ordemDir === 'asc' ? '↑' : '↓';
  }
  // Compatibilidade com toggle-btn (botões acima da tabela)
  if (btn && btn.classList && btn.classList.contains('toggle-btn')) {
    btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  paginaAtual = 1;
  renderAlertas();
}

function renderAlertas() {
  const busca = (document.getElementById('busca-produto')?.value || '').toLowerCase();
  const grupo = document.getElementById('filtro-grupo')?.value || '';
  const subgrupo = document.getElementById('filtro-subgrupo')?.value || '';
  const fornId = document.getElementById('filtro-fornecedor')?.value || '';
  const sit = filtroSituacaoAtivo;

  let dados = [...alertasConsolidado];

  if (busca) dados = dados.filter(r =>
    (r.nome || '').toLowerCase().includes(busca) ||
    (r.referencia || '').toLowerCase().includes(busca)
  );
  if (grupo) dados = dados.filter(r => r.grupo === grupo);
  if (subgrupo) dados = dados.filter(r => r.subgrupo === subgrupo);
  if (fornId) dados = dados.filter(r =>
    (fornProdMap[r.id_produto] || []).some(f => String(f.id_fornecedor) === fornId)
  );
  if (sit) dados = dados.filter(r => r.situacao_estoque === sit);

  // Ordenação
  const prioMap = { RUPTURA: 1, CRITICO: 2, BAIXO: 3, OK: 4, SEM_MOVIMENTO: 5 };
  const abcMap  = { A: 1, B: 2, C: 3 };
  const dir = ordemDir === 'asc' ? 1 : -1;

  if (ordemAlertas === 'prioridade') {
    dados.sort((a, b) => {
      const pa = prioMap[a.situacao_estoque] || 9;
      const pb = prioMap[b.situacao_estoque] || 9;
      if (pa !== pb) return pa - pb;
      return (abcMap[a.curva_abc_qtd] || 9) - (abcMap[b.curva_abc_qtd] || 9);
    });
  } else if (ordemAlertas === 'cobertura') {
    dados.sort((a, b) => dir * ((a.cobertura_dias ?? 99999) - (b.cobertura_dias ?? 99999)));
  } else if (ordemAlertas === 'abc') {
    dados.sort((a, b) => dir * ((abcMap[a.curva_abc_qtd] || 9) - (abcMap[b.curva_abc_qtd] || 9)));
  } else if (ordemAlertas === 'qtd_sugerida') {
    dados.sort((a, b) => dir * ((b.qtd_sugerida || 0) - (a.qtd_sugerida || 0)) * -1);
    dados.sort((a, b) => dir * ((a.qtd_sugerida || 0) - (b.qtd_sugerida || 0)));
  } else if (ordemAlertas === 'estoque') {
    dados.sort((a, b) => dir * ((a.estoque_total || 0) - (b.estoque_total || 0)));
  } else if (ordemAlertas === 'pedido_aberto') {
    dados.sort((a, b) => dir * ((a.pedido_aberto_total || 0) - (b.pedido_aberto_total || 0)));
  } else if (ordemAlertas === 'nome') {
    dados.sort((a, b) => dir * (a.nome || '').localeCompare(b.nome || ''));
  }

  alertasFiltrados = dados;
  const total = dados.length;
  const porPagina = 50;
  const totalPaginas = Math.ceil(total / porPagina);
  if (paginaAtual > totalPaginas) paginaAtual = 1;
  const inicio = (paginaAtual - 1) * porPagina;
  const fim = Math.min(inicio + porPagina, total);
  const dadosPagina = dados.slice(inicio, fim);

  document.getElementById('alertas-count').textContent =
    `${total} produto${total !== 1 ? 's' : ''} · mostrando ${inicio + 1}–${fim}`;

  const tbody = document.getElementById('alertas-body');
  if (!dadosPagina.length) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="11">Nenhum produto encontrado</td></tr>';
    renderPaginacao(0, 0, 0);
    return;
  }

  tbody.innerHTML = dadosPagina.map(r => {
    const cobDias = r.cobertura_dias;
    const cobTxt = cobDias === null ? '∞' : (cobDias > 999 ? '999+' : fmtQtd(cobDias)) + 'd';
    const cobColor = cobDias === null ? 'var(--text-muted)' :
      cobDias < 15 ? 'var(--red)' : cobDias < 30 ? 'var(--orange)' : 'var(--green)';
    const noCarrinho = cartItems.some(c => c.id_produto === r.id_produto);

    return `<tr class="clickable" onclick="abrirProduto(${r.id_produto})" data-id="${r.id_produto}">
      <td onclick="event.stopPropagation()">
        <input type="checkbox" class="row-check" data-id="${r.id_produto}" onchange="onRowCheck()" />
      </td>
      <td style="font-weight:500;max-width:220px">
        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.nome || ''}">${r.nome || '—'}</div>
        <div style="font-size:11px;color:var(--text-muted)">${r.referencia || ''}</div>
      </td>
      <td style="color:var(--text-secondary);font-size:12px;white-space:nowrap">${r.subgrupo || r.grupo || '—'}</td>
      <td class="right mono" style="color:${(r.estoque_total || 0) < 0 ? 'var(--orange)' : ''}">
        ${fmtQtd(r.estoque_total, 0)}
      </td>
      <td class="right mono" style="color:${cobColor};font-weight:600">${cobTxt}</td>
      <td class="right mono" style="font-weight:600;color:var(--blue-mid)">${fmtQtd(r.qtd_sugerida, 0)}</td>
      <td class="right mono" style="color:var(--text-muted)">${fmtQtd(r.pedido_aberto_total, 0)}</td>
      <td>${badgeSituacao(r.situacao_estoque)}</td>
      <td>${badgeABC(r.curva_abc_qtd)}</td>
      <td style="font-size:12px;color:var(--text-secondary);max-width:160px">
        ${(fornProdMap[r.id_produto] || []).map(f =>
          `<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${f.nome_fornecedor}">${f.nome_fornecedor}</div>`
        ).join('') || '—'}
      </td>
      <td onclick="event.stopPropagation()">
        <button class="btn btn-outline" style="height:26px;padding:0 8px;font-size:11px"
          onclick="${noCarrinho ? `removerDoCarrinho(${r.id_produto})` : `adicionarAoCarrinho(${r.id_produto})`}"
          title="${noCarrinho ? 'Remover do pedido' : 'Adicionar ao pedido'}">
          ${noCarrinho ? '✓' : '+'}
        </button>
      </td>
    </tr>`;
  }).join('');

  renderPaginacao(paginaAtual, totalPaginas, total);
}

let paginaAtual = 1;

function renderPaginacao(pagina, totalPags, total) {
  let el = document.getElementById('alertas-paginacao');
  if (!el) {
    el = document.createElement('div');
    el.id = 'alertas-paginacao';
    el.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;padding:12px 16px;border-top:1px solid var(--border);background:var(--surface2)';
    document.querySelector('.table-card')?.appendChild(el);
  }
  if (totalPags <= 1) { el.innerHTML = ''; return; }

  const pages = [];
  // Sempre mostrar primeira, última e vizinhas da atual
  const range = new Set([1, totalPags, pagina - 1, pagina, pagina + 1].filter(p => p >= 1 && p <= totalPags));
  let last = 0;
  [...range].sort((a,b) => a-b).forEach(p => {
    if (last && p - last > 1) pages.push('...');
    pages.push(p);
    last = p;
  });

  el.innerHTML = `
    <button class="btn btn-outline" style="height:28px;font-size:12px" ${pagina === 1 ? 'disabled' : ''}
      onclick="irPagina(${pagina - 1})">← Anterior</button>
    ${pages.map(p => p === '...'
      ? `<span style="color:var(--text-muted);padding:0 4px">…</span>`
      : `<button class="btn ${p === pagina ? 'btn-primary' : 'btn-outline'}" style="height:28px;min-width:32px;font-size:12px"
          onclick="irPagina(${p})">${p}</button>`
    ).join('')}
    <button class="btn btn-outline" style="height:28px;font-size:12px" ${pagina === totalPags ? 'disabled' : ''}
      onclick="irPagina(${pagina + 1})">Próxima →</button>
    <span style="font-size:12px;color:var(--text-muted);margin-left:8px">${total} produtos</span>
  `;
}

function irPagina(p) {
  paginaAtual = p;
  renderAlertas();
  // Scroll para o topo da tabela
  document.querySelector('.table-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ══════════════════════════════════════════
// DRAWER — ANÁLISE DO PRODUTO
// ══════════════════════════════════════════
async function abrirProduto(idProduto) {
  const prod = alertasConsolidado.find(r => r.id_produto === idProduto);
  if (!prod) return;
  produtoAtual = prod;

  document.getElementById('drawer-produto-nome').textContent = prod.nome || '—';
  document.getElementById('drawer-produto-ref').textContent =
    `Ref: ${prod.referencia || '—'} · ${prod.grupo || ''} › ${prod.subgrupo || ''}`;

  // Ativar aba resumo
  const drawer = document.getElementById('produto-drawer');
  if (!drawer) return;
  drawer.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
  drawer.querySelectorAll('.drawer-tab-content').forEach(t => t.classList.remove('active'));
  drawer.querySelector('.drawer-tab[onclick*="resumo"]')?.classList.add('active');
  document.getElementById('dtab-resumo').classList.add('active');

  // Abrir drawer
  document.getElementById('produto-drawer').classList.add('open');
  document.getElementById('drawer-overlay').classList.add('open');

  // Carregar resumo e giro em paralelo
  loadDrawerResumo(prod);
  loadDrawerGiro(prod.id_produto);
}

function fecharDrawer() {
  document.getElementById('produto-drawer').classList.remove('open');
  document.getElementById('drawer-overlay').classList.remove('open');
}

function switchDrawerTab(tab, btn) {
  const drawer = document.getElementById('produto-drawer');
  if (!drawer) return;
  drawer.querySelectorAll('.drawer-tab').forEach(t => t.classList.remove('active'));
  drawer.querySelectorAll('.drawer-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById(`dtab-${tab}`);
  if (content) content.classList.add('active');
  if (tab === 'resumo'      && produtoAtual) { loadDrawerResumo(produtoAtual); loadDrawerGiro(produtoAtual.id_produto); }
  if (tab === 'historico'   && produtoAtual) loadDrawerHistorico(produtoAtual.id_produto);
  if (tab === 'fornecedores'&& produtoAtual) loadDrawerFornecedores(produtoAtual.id_produto);
  if (tab === 'estoque'     && produtoAtual) loadDrawerEstoque(produtoAtual.id_produto);
  if (tab === 'pedido'      && produtoAtual) loadDrawerPedido(produtoAtual);
}

async function loadDrawerResumo(prod) {
  // Cards linha 1 — dados locais (sem query)
  document.getElementById('dr-estoque-total').textContent = fmtQtd(prod.estoque_total, 0);
  document.getElementById('dr-estoque-sub').textContent = `Reserva: ${fmtQtd(prod.reserva_total, 0)}`;
  const cob = prod.cobertura_dias;
  document.getElementById('dr-cobertura').textContent = cob === null ? '∞' : cob >= 9999 ? '999+d' : fmtQtd(cob, 0) + 'd';
  document.getElementById('dr-consumo').textContent = fmtQtd(prod.consumo_diario_total, 2);
  document.getElementById('dr-sugerida').textContent = fmtQtd(prod.qtd_sugerida, 0);

  // Cards linha 2 — pedido aberto e datas (sem query)
  document.getElementById('dr-pedido-aberto').textContent = fmtQtd(prod.pedido_aberto_total, 0);
  document.getElementById('dr-ultima-compra').textContent = prod.dt_ultima_compra ? fmtData(prod.dt_ultima_compra) : '—';
  document.getElementById('dr-ultima-venda').textContent = prod.dt_ultima_venda ? fmtData(prod.dt_ultima_venda) : '—';
  document.getElementById('dr-lead-time').textContent = '...';
  document.getElementById('dr-lead-time-sub').textContent = 'calculando...';

  // Buscar lead time do fornecedor principal em paralelo
  try {
    // Pegar fornecedores do produto
    const fornIds = (fornProdMap[prod.id_produto] || []).map(f => f.id_fornecedor);
    if (fornIds.length > 0) {
      const { data: leads } = await sb
        .from('comp_lead_time_pedido')
        .select('id_fornecedor,nome_fornecedor,lead_pedido_medio,qtd_pares')
        .in('id_fornecedor', fornIds)
        .order('qtd_pares', { ascending: false })
        .range(0, 9);

      if (leads?.length) {
        // Média ponderada pelo qtd_pares
        const totalPares = leads.reduce((a, l) => a + (l.qtd_pares || 0), 0);
        const mediaPonderada = totalPares > 0
          ? Math.round(leads.reduce((a, l) => a + (l.lead_pedido_medio || 0) * (l.qtd_pares || 0), 0) / totalPares)
          : null;
        const melhor = leads[0];
        document.getElementById('dr-lead-time').textContent = mediaPonderada ? mediaPonderada + 'd' : '—';
        document.getElementById('dr-lead-time-sub').textContent = mediaPonderada
          ? `pedido→NF · ${leads.length} fornec.`
          : 'sem histórico';
      } else {
        document.getElementById('dr-lead-time').textContent = '—';
        document.getElementById('dr-lead-time-sub').textContent = 'sem histórico';
      }
    } else {
      document.getElementById('dr-lead-time').textContent = '—';
      document.getElementById('dr-lead-time-sub').textContent = 'sem fornecedor';
    }
  } catch(e) {
    document.getElementById('dr-lead-time').textContent = '—';
    document.getElementById('dr-lead-time-sub').textContent = 'erro';
  }
}

async function loadDrawerGiro(idProduto) {
  const container = document.getElementById('dtab-giro-inner');
  if (!container) return;
  container.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px">Carregando giro...</div>';

  try {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 11, 1);
    const inicioStr = inicio.toISOString().slice(0, 10);
    const inicio180 = new Date(hoje); inicio180.setDate(hoje.getDate() - 180);
    const inicio180Str = inicio180.toISOString().slice(0, 10);

    const [rVendas, rOs, rCompras] = await Promise.all([
      sb.from('vw_comercial_itens_faturados')
        .select('data_faturamento, qtd')
        .eq('id_produto', idProduto)
        .gte('data_faturamento', inicio180Str)
        .range(0, 9999),
      sb.from('vw_os_pecas_faturadas')
        .select('data_faturamento, qtd')
        .eq('id_produto', idProduto)
        .gte('data_faturamento', inicio180Str)
        .range(0, 9999),
      sb.from('vw_fb_historico_compras')
        .select('data_compra, qtd')
        .eq('id_produto', idProduto)
        .gte('data_compra', inicioStr)
        .range(0, 9999),
    ]);

    // Calcular vendidos por período
    const todasSaidas = [...(rVendas.data||[]), ...(rOs.data||[])];
    const vendidosPeriodo = (dias) => {
      const limite = new Date(hoje); limite.setDate(hoje.getDate() - dias);
      const limStr = limite.toISOString().slice(0,10);
      return todasSaidas.filter(r => r.data_faturamento >= limStr)
        .reduce((a, r) => a + Math.abs(parseFloat(r.qtd)||0), 0);
    };
    const v30 = vendidosPeriodo(30), v60 = vendidosPeriodo(60);
    const v90 = vendidosPeriodo(90), v180 = vendidosPeriodo(180);

    // Preencher cards
    const setCard = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = fmtQtd(val, 0); };
    setCard('dr-vend-30', v30); setCard('dr-vend-60', v60);
    setCard('dr-vend-90', v90); setCard('dr-vend-180', v180);

    // Montar meses para gráfico (12 meses)
    const meses = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      meses.push({
        label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`,
        saidas: 0, compras: 0
      });
    }

    todasSaidas.forEach(r => {
      const key = (r.data_faturamento||'').slice(0,7);
      const m = meses.find(m => m.key === key);
      if (m) m.saidas += Math.abs(parseFloat(r.qtd)||0);
    });
    (rCompras.data||[]).forEach(r => {
      const m = meses.find(m => m.key === (r.data_compra||'').slice(0,7));
      if (m) m.compras += Math.abs(r.qtd||0);
    });

    const media12 = meses.reduce((a,m)=>a+m.saidas,0)/12;
    const media6  = meses.slice(-6).reduce((a,m)=>a+m.saidas,0)/6;
    const media3  = meses.slice(-3).reduce((a,m)=>a+m.saidas,0)/3;
    const totalComprado = meses.reduce((a,m)=>a+m.compras,0);
    const mesesComVenda = meses.filter(m=>m.saidas>0).length;

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:14px">
        <div class="card" style="padding:12px 14px"><div class="card-label">Média 12m</div><div class="card-value" style="font-size:18px">${fmtQtd(media12,1)}</div><div class="card-sub">por mês</div></div>
        <div class="card" style="padding:12px 14px"><div class="card-label">Média 6m</div><div class="card-value" style="font-size:18px">${fmtQtd(media6,1)}</div><div class="card-sub">por mês</div></div>
        <div class="card" style="padding:12px 14px"><div class="card-label">Média 3m</div><div class="card-value" style="font-size:18px">${fmtQtd(media3,1)}</div><div class="card-sub">por mês</div></div>
        <div class="card" style="padding:12px 14px"><div class="card-label">Comprado 12m</div><div class="card-value blue" style="font-size:18px">${fmtQtd(totalComprado,0)}</div><div class="card-sub">${mesesComVenda}/12 meses c/ venda</div></div>
      </div>
      <div class="chart-card">
        <div class="chart-header"><span class="chart-title">Saídas vs Compras — 12 meses</span></div>
        <div class="chart-body"><canvas id="chart-giro-mensal" height="160"></canvas></div>
      </div>`;

    if (chartGiroMensal) chartGiroMensal.destroy();
    chartGiroMensal = new Chart(document.getElementById('chart-giro-mensal').getContext('2d'), {
      type: 'bar',
      data: {
        labels: meses.map(m => m.label),
        datasets: [
          { label: 'Saídas', data: meses.map(m => m.saidas), backgroundColor: '#1A3A8F', borderRadius: 3 },
          { label: 'Compras', data: meses.map(m => m.compras), backgroundColor: '#0F9D6E', borderRadius: 3 },
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { size: 11 } } } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { grid: { color: '#E2E8F2' }, ticks: { font: { size: 11 }, callback: v => fmtQtd(v,0) } }
        }
      }
    });
  } catch(e) {
    const c = document.getElementById('dtab-giro-inner');
    if (c) c.innerHTML = '<div style="text-align:center;padding:20px;color:var(--red)">Erro ao carregar giro</div>';
  }
}

// Estado do filtro de histórico
let histFiltro = 'todos';

function setHistFiltro(filtro, btn) {
  histFiltro = filtro;
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  if (produtoAtual) loadDrawerHistorico(produtoAtual.id_produto);
}

async function loadDrawerHistorico(idProduto) {
  const tbody = document.getElementById('dr-historico-body');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="5">Carregando...</td></tr>';

  const alertaContainer = document.getElementById('hist-alertas');
  if (alertaContainer) alertaContainer.innerHTML = '';

  try {
    // 4 fontes em paralelo:
    // 1. Vendas diretas (loja, online, distribuição)
    // 2. Peças de OS faturadas
    // 3. Entradas de compra
    // 4. Ajustes/transferências + OS abertas (alerta)
    const [rVendas, rOsPecas, rCompras, rMov, rOsBase] = await Promise.all([
      sb.from('vw_comercial_itens_faturados')
        .select('id_doc,tipo_saida,data_faturamento,empresa,qtd,vl_unit')
        .eq('id_produto', idProduto)
        .order('data_faturamento', { ascending: false })
        .range(0, 9999),
      sb.from('vw_os_pecas_faturadas')
        .select('id_os,data_faturamento,empresa,qtd,vl_unit')
        .eq('id_produto', idProduto)
        .order('data_faturamento', { ascending: false })
        .range(0, 9999),
      sb.from('vw_fb_historico_compras')
        .select('data_compra,nome_fornecedor,num_nf,qtd,vl_unit,valor_total,lead_time_dias')
        .eq('id_produto', idProduto)
        .order('data_compra', { ascending: false })
        .range(0, 99),
      sb.from('vw_fb_mov_estoque')
        .select('data_mov,tipo_mov,tipo_es,empresa,qtd,id_os,cancelada')
        .eq('id_produto', idProduto)
        .eq('cancelada', 'N')
        .in('tipo_mov', ['A', 'T', 'R'])
        .order('data_mov', { ascending: false })
        .range(0, 499),
      sb.from('vw_os_base')
        .select('id_os,status_os,tipo_os')
        .range(0, 9999),
    ]);

    const osMap = {};
    (rOsBase.data || []).forEach(o => { osMap[o.id_os] = o; });

    // ── Cards de alerta: OS não finalizadas ─────────
    const movAll = rMov.data || [];
    const osAbertas = movAll.filter(m =>
      m.id_os && m.tipo_es === 'S' && m.tipo_mov === 'R' &&
      osMap[m.id_os] && osMap[m.id_os].status_os !== 'F'
    );
    const qtdOsAbertas = osAbertas.reduce((a, m) => a + Math.abs(m.qtd || 0), 0);
    const qtdOsAbertasCount = new Set(osAbertas.map(m => m.id_os)).size;

    if (alertaContainer && qtdOsAbertas > 0) {
      alertaContainer.innerHTML = `
        <div style="display:flex;gap:10px;margin-bottom:14px">
          <div style="flex:1;background:var(--orange-bg);border:1px solid var(--orange);border-radius:var(--radius-sm);padding:10px 14px;display:flex;align-items:center;gap:10px">
            <span style="font-size:18px">⚠️</span>
            <div>
              <div style="font-size:11px;font-weight:600;color:var(--orange);text-transform:uppercase;letter-spacing:0.5px">OS não finalizadas</div>
              <div style="font-size:13px;font-weight:700;color:var(--text-primary)">${fmtQtd(qtdOsAbertas, 0)} peças em ${qtdOsAbertasCount} OS</div>
              <div style="font-size:11px;color:var(--text-muted)">saíram do estoque, OS ainda abertas</div>
            </div>
          </div>
        </div>`;
    }

    // ── Montar lista unificada ───────────────────────
    const itens = [];

    // Saídas de venda direta (loja, online, distribuição)
    (rVendas.data || []).forEach(r => {
      const tipo = (r.tipo_saida || '').trim();
      itens.push({
        data: r.data_faturamento,
        tipo_es: 'S',
        origem: tipo ? `${tipo} #${r.id_doc}` : `Venda #${r.id_doc}`,
        empresa: r.empresa,
        qtd: Math.abs(parseFloat(r.qtd) || 0),
        vl_unit: r.vl_unit,
      });
    });

    // Saídas de OS faturadas
    (rOsPecas.data || []).forEach(r => {
      const osInfo = osMap[r.id_os];
      itens.push({
        data: r.data_faturamento,
        tipo_es: 'S',
        origem: `OS #${r.id_os}${osInfo?.tipo_os ? ' · ' + osInfo.tipo_os : ''}`,
        empresa: r.empresa,
        qtd: Math.abs(parseFloat(r.qtd) || 0),
        vl_unit: r.vl_unit,
      });
    });

    // Entradas de compra
    (rCompras.data || []).forEach(r => {
      itens.push({
        data: r.data_compra,
        tipo_es: 'E',
        origem: `Compra${r.nome_fornecedor ? ' · ' + r.nome_fornecedor : ''}${r.num_nf ? ' NF ' + r.num_nf : ''}`,
        empresa: null,
        qtd: Math.abs(r.qtd || 0),
        vl_unit: r.vl_unit,
      });
    });

    // Ajustes e transferências
    movAll.filter(m => m.tipo_mov === 'A' || m.tipo_mov === 'T').forEach(r => {
      itens.push({
        data: r.data_mov,
        tipo_es: r.tipo_es,
        origem: r.tipo_mov === 'T' ? 'Transferência' : (r.tipo_es === 'E' ? 'Ajuste entrada' : 'Ajuste saída'),
        empresa: r.empresa,
        qtd: Math.abs(r.qtd || 0),
        vl_unit: null,
      });
    });

    // Ordenar por data desc
    itens.sort((a, b) => (b.data || '').localeCompare(a.data || ''));

    // Aplicar filtro toggle
    let dados = itens;
    if (histFiltro === 'entradas') dados = itens.filter(r => r.tipo_es === 'E');
    if (histFiltro === 'saidas')   dados = itens.filter(r => r.tipo_es === 'S');

    if (!dados.length) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="5">Sem movimentações</td></tr>';
      return;
    }

    tbody.innerHTML = dados.map(r => {
      const esColor = r.tipo_es === 'E' ? 'var(--green)' : 'var(--red)';
      const esLabel = r.tipo_es === 'E' ? '↓ Entrada' : '↑ Saída';
      const sinal   = r.tipo_es === 'E' ? '+' : '-';
      return `<tr>
        <td class="mono" style="color:var(--text-muted);white-space:nowrap">${fmtData(r.data)}</td>
        <td><span style="color:${esColor};font-weight:600;font-size:12px">${esLabel}</span></td>
        <td style="font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
            title="${r.origem}">${r.origem}</td>
        <td style="font-size:12px;color:var(--text-secondary)">${r.empresa || '—'}</td>
        <td class="right mono" style="color:${esColor};font-weight:600">
          ${sinal}${fmtQtd(r.qtd, 0)}
        </td>
      </tr>`;
    }).join('');

  } catch (e) {
    console.error(e);
    tbody.innerHTML = '<tr class="loading-row"><td colspan="5" style="color:var(--red)">Erro ao carregar</td></tr>';
  }
}

async function loadDrawerEstoque(idProduto) {
  const tbody = document.getElementById('dr-estoque-body');
  tbody.innerHTML = '<tr class="loading-row"><td colspan="5">Carregando...</td></tr>';

  try {
    const { data } = await sb
      .from('vw_fb_estoque_centro')
      .select('empresa,centro_estoque,estoque,preco_compra,centro_padrao,centro_situacao')
      .eq('id_produto', idProduto)
      .order('empresa')
      .range(0, 199);

    if (!data?.length) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="5">Sem dados de estoque</td></tr>';
      return;
    }

    tbody.innerHTML = data.map(r => {
      const est = r.estoque || 0;
      const cor = est < 0 ? 'var(--orange)' : est === 0 ? 'var(--text-muted)' : 'var(--text-primary)';
      return `<tr>
        <td style="font-weight:500">${r.empresa || '—'}</td>
        <td style="font-size:12px;color:var(--text-secondary)">${r.centro_estoque || '—'}</td>
        <td class="right mono" style="color:${cor};font-weight:600">${fmtQtd(est, 0)}</td>
        <td class="right mono" style="color:var(--text-muted)">—</td>
        <td>
          ${r.centro_situacao === 'A'
            ? '<span class="badge badge-ok">Ativo</span>'
            : '<span class="badge badge-sem_mov">Inativo</span>'}
        </td>
      </tr>`;
    }).join('');
  } catch (e) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="5" style="color:var(--red)">Erro ao carregar</td></tr>';
  }
}

async function loadDrawerFornecedores(idProduto) {
  const container = document.getElementById('dr-forn-container');
  container.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted)">Carregando...</div>';

  // Tipos de entrada que são compra real (excluindo devoluções, inventário, retornos, etc)
  const TIPOS_COMPRA = [
    'NF MOV EST SEM PRECO','NF MOV EST MUDA PREC','NF. MOV.EST.SEM PREC',
    'PED MOV EST SEM PREC','PED MOV EST MUDA PRE','PED SEM EST MUDA PRE',
    'COMPRA C/CUSTO','COMPRA C/CUSTO ','COMPRA S/CUSTO','COMPRA S/EST S/PRECO'
  ];

  try {
    const fornList = fornProdMap[idProduto] || [];
    if (!fornList.length) {
      container.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted)">Nenhum fornecedor cadastrado</div>';
      return;
    }

    // Buscar histórico de compras reais + lead time pedido→NF em paralelo
    const fornIds = fornList.map(f => f.id_fornecedor);
    const [rHist, rLeads] = await Promise.all([
      sb.from('vw_fb_historico_compras')
        .select('id_fornecedor,nome_fornecedor,data_compra,num_nf,qtd,vl_unit,valor_total,lead_time_dias,tipo_entrada,mov_estoque,empresa')
        .eq('id_produto', idProduto)
        .in('tipo_entrada', TIPOS_COMPRA)
        .order('data_compra', { ascending: false })
        .range(0, 499),
      sb.from('comp_lead_time_pedido')
        .select('id_fornecedor,lead_pedido_medio,lead_pedido_min,lead_pedido_max,qtd_pares')
        .in('id_fornecedor', fornIds),
    ]);

    // Indexar lead time pedido por fornecedor
    const leadPedidoMap = {};
    (rLeads.data || []).forEach(l => { leadPedidoMap[l.id_fornecedor] = l; });

    const hist = rHist.data || [];

    // Agrupar por fornecedor
    const histMap = {};
    (hist || []).forEach(h => {
      const id = h.id_fornecedor;
      if (!histMap[id]) histMap[id] = { compras: [], leads: [], ultima: null, ultimo_preco: null, qtd_12m: 0 };
      histMap[id].compras.push(h);
      if (h.lead_time_dias > 0) histMap[id].leads.push(h.lead_time_dias);
      if (!histMap[id].ultima || h.data_compra > histMap[id].ultima) {
        histMap[id].ultima = h.data_compra;
        // Último preço: priorizar mov_estoque=N (tem valor), fallback para qualquer com vl_unit > 0
        if (h.vl_unit > 0) histMap[id].ultimo_preco = h.vl_unit;
      }
      // Qtd compras últimos 12m
      const limite12m = new Date(); limite12m.setFullYear(limite12m.getFullYear() - 1);
      if (new Date(h.data_compra) >= limite12m) histMap[id].qtd_12m++;
    });

    // Renderizar cards por fornecedor
    const cards = fornList.map(f => {
      const hm = histMap[f.id_fornecedor] || { compras: [], leads: [], qtd_12m: 0 };
      const leadMed = hm.leads.length ? Math.round(hm.leads.reduce((a, v) => a + v, 0) / hm.leads.length) : null;
      const ultimoPreco = hm.ultimo_preco || f.preco_fornecedor;
      const fornId = f.id_fornecedor;
      // Lead time pedido→NF da view comp_lead_time_pedido (carregado depois)
      const leadPedido = leadPedidoMap[fornId];

      return `
      <div class="table-card" style="margin-bottom:12px">
        <!-- Header do fornecedor -->
        <div style="padding:14px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;background:var(--surface2);border-radius:var(--radius) var(--radius) 0 0"
             onclick="toggleFornHist(${fornId})">
          <div>
            <div style="font-weight:600;font-size:14px">${f.nome_fornecedor || '—'}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px">
              Ref forn: ${f.referencia_fornecedor || '—'}
            </div>
          </div>
          <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
            <div style="text-align:right">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Preço ref.</div>
              <div style="font-weight:600;font-family:'DM Mono',monospace;font-size:13px">${f.preco_fornecedor ? fmt(f.preco_fornecedor) : '—'}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Último preço real</div>
              <div style="font-weight:700;font-family:'DM Mono',monospace;font-size:13px;color:${ultimoPreco && ultimoPreco !== f.preco_fornecedor ? 'var(--orange)' : 'var(--text-primary)'}">${ultimoPreco ? fmt(ultimoPreco) : '—'}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Última compra</div>
              <div style="font-weight:600;font-size:13px">${hm.ultima ? fmtData(hm.ultima) : '—'}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Lead Pedido→NF</div>
              <div style="font-weight:700;font-size:14px;color:${leadPedido ? (leadPedido.lead_pedido_medio <= 7 ? 'var(--green)' : leadPedido.lead_pedido_medio <= 15 ? 'var(--orange)' : 'var(--red)') : 'var(--text-muted)'}">
                ${leadPedido ? leadPedido.lead_pedido_medio + 'd' : '—'}
              </div>
              <div style="font-size:10px;color:var(--text-muted)">${leadPedido ? `${leadPedido.lead_pedido_min}–${leadPedido.lead_pedido_max}d` : ''}</div>
            </div>
            <div style="text-align:right">
              <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px">Compras 12m</div>
              <div style="font-weight:700;font-size:14px;color:var(--blue-mid)">${hm.qtd_12m}</div>
            </div>
            <span style="color:var(--blue-mid);font-size:14px" id="forn-chev-${fornId}">▶</span>
          </div>
        </div>
        <!-- Histórico de compras (colapsado) -->
        <div id="forn-hist-${fornId}" style="display:none">
          ${hm.compras.length === 0
            ? '<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:13px">Sem histórico de compras reais</div>'
            : `<div style="overflow-x:auto;max-height:260px;overflow-y:auto">
                <table class="data-table">
                  <thead><tr>
                    <th>Data NF</th>
                    <th>NF</th>
                    <th>Empresa</th>
                    <th>Tipo</th>
                    <th class="right">Qtd</th>
                    <th class="right">Vl Unit</th>
                    <th class="right">Total</th>
                    <th class="right">Lead</th>
                  </tr></thead>
                  <tbody>
                    ${hm.compras.map(c => `<tr>
                      <td class="mono" style="color:var(--text-muted);white-space:nowrap">${fmtData(c.data_compra)}</td>
                      <td class="mono" style="color:var(--text-muted)">${c.num_nf || '—'}</td>
                      <td style="font-size:12px">${c.empresa || '—'}</td>
                      <td style="font-size:11px;color:var(--text-muted);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
                          title="${c.tipo_entrada}">${c.tipo_entrada}</td>
                      <td class="right mono">${fmtQtd(c.qtd, 0)}</td>
                      <td class="right mono" style="color:${c.vl_unit > 0 ? 'var(--text-primary)' : 'var(--text-muted)'}">${c.vl_unit > 0 ? fmt(c.vl_unit) : '—'}</td>
                      <td class="right mono" style="font-weight:600">${c.valor_total > 0 ? fmt(c.valor_total) : '—'}</td>
                      <td class="right mono" style="color:var(--text-muted)">${c.lead_time_dias > 0 ? c.lead_time_dias + 'd' : '—'}</td>
                    </tr>`).join('')}
                  </tbody>
                </table>
              </div>`
          }
        </div>
      </div>`;
    }).join('');

    container.innerHTML = cards || '<div style="text-align:center;padding:32px;color:var(--text-muted)">Nenhum fornecedor cadastrado</div>';

  } catch (e) {
    console.error(e);
    container.innerHTML = '<div style="text-align:center;padding:32px;color:var(--red)">Erro ao carregar</div>';
  }
}

function toggleFornHist(fornId) {
  const el = document.getElementById(`forn-hist-${fornId}`);
  const chev = document.getElementById(`forn-chev-${fornId}`);
  if (!el) return;
  const open = el.style.display !== 'none';
  el.style.display = open ? 'none' : 'block';
  if (chev) chev.textContent = open ? '▶' : '▼';
}

async function loadDrawerPedido(prod) {
  const container = document.getElementById('pedido-forn-list');
  container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted)">Carregando fornecedores...</div>';

  const fornData = fornProdMap[prod.id_produto] || [];

  if (!fornData.length) {
    container.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted)">Nenhum fornecedor cadastrado para este produto</div>';
    return;
  }

  const qtdSugerida = Math.max(0, Math.ceil(prod.qtd_sugerida || 0));

  container.innerHTML = fornData.map(f => {
    const cartItem = cartItems.find(c => c.id_produto === prod.id_produto && c.id_fornecedor === f.id_fornecedor);
    const qtdAtual = cartItem ? cartItem.qtd_pedido : qtdSugerida;
    const vlUnit = f.preco_fornecedor || 0;
    const total = qtdAtual * vlUnit;

    return `
    <div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:16px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px">
        <div>
          <div style="font-weight:600;font-size:14px">${f.nome_fornecedor}</div>
          <div style="font-size:12px;color:var(--text-muted)">Ref forn: ${f.referencia_fornecedor || '—'}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:12px;color:var(--text-muted)">Preço ref.</div>
          <div style="font-weight:700;font-family:'DM Mono',monospace">${vlUnit ? fmt(vlUnit) : '—'}</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:12px">
        <div style="flex:1">
          <label style="font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:4px">
            Quantidade
          </label>
          <input type="number" class="filter-select" style="width:120px;text-align:right"
            id="qtd-forn-${f.id_fornecedor}"
            value="${qtdAtual}"
            min="0"
            onchange="recalcTotal(${prod.id_produto}, ${f.id_fornecedor}, ${vlUnit})" />
        </div>
        <div style="flex:1">
          <div style="font-size:11px;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px">Total Est.</div>
          <div style="font-weight:700;font-family:'DM Mono',monospace;font-size:16px" id="total-forn-${f.id_fornecedor}">
            ${vlUnit ? fmt(total) : '—'}
          </div>
        </div>
        <div>
          <button class="btn ${cartItem ? 'btn-outline' : 'btn-success'}"
            id="btn-forn-${f.id_fornecedor}"
            onclick="toggleItemPedido(${prod.id_produto}, ${f.id_fornecedor}, '${f.nome_fornecedor}', ${vlUnit})">
            ${cartItem ? '✓ No Pedido' : '+ Adicionar ao Pedido'}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function recalcTotal(idProduto, idFornecedor, vlUnit) {
  const qtd = parseFloat(document.getElementById(`qtd-forn-${idFornecedor}`)?.value || 0);
  const total = qtd * vlUnit;
  const el = document.getElementById(`total-forn-${idFornecedor}`);
  if (el) el.textContent = vlUnit ? fmt(total) : '—';
}

// ══════════════════════════════════════════
// CARRINHO / PEDIDO
// ══════════════════════════════════════════
function toggleItemPedido(idProduto, idFornecedor, nomeFornecedor, vlUnit) {
  const prod = produtoAtual;
  if (!prod) return;

  const existing = cartItems.findIndex(c => c.id_produto === idProduto && c.id_fornecedor === idFornecedor);
  const qtd = parseFloat(document.getElementById(`qtd-forn-${idFornecedor}`)?.value || prod.qtd_sugerida || 0);

  if (existing >= 0) {
    cartItems.splice(existing, 1);
    const btn = document.getElementById(`btn-forn-${idFornecedor}`);
    if (btn) { btn.textContent = '+ Adicionar ao Pedido'; btn.className = 'btn btn-success'; }
  } else {
    cartItems.push({
      id_produto: idProduto,
      nome_produto: prod.nome,
      referencia: prod.referencia,
      id_fornecedor: idFornecedor,
      nome_fornecedor: nomeFornecedor,
      qtd_sugerida: prod.qtd_sugerida,
      qtd_pedido: qtd,
      vl_unit: vlUnit,
    });
    const btn = document.getElementById(`btn-forn-${idFornecedor}`);
    if (btn) { btn.textContent = '✓ No Pedido'; btn.className = 'btn btn-outline'; }
  }

  atualizarCarrinho();
  renderAlertas();
}

function adicionarAoCarrinho(idProduto) {
  const prod = alertasConsolidado.find(r => r.id_produto === idProduto);
  if (!prod) return;
  const already = cartItems.find(c => c.id_produto === idProduto);
  if (already) return;
  cartItems.push({
    id_produto: idProduto,
    nome_produto: prod.nome,
    referencia: prod.referencia,
    id_fornecedor: null,
    nome_fornecedor: prod.fornecedor_principal || 'A definir',
    qtd_sugerida: prod.qtd_sugerida,
    qtd_pedido: Math.max(0, Math.ceil(prod.qtd_sugerida || 0)),
    vl_unit: prod.preco_compra || 0,
  });
  atualizarCarrinho();
  renderAlertas();
}

function removerDoCarrinho(idProduto) {
  cartItems = cartItems.filter(c => c.id_produto !== idProduto);
  atualizarCarrinho();
  renderAlertas();
}

function atualizarCarrinho() {
  const count = cartItems.length;
  document.getElementById('cart-count').textContent = count;
  document.getElementById('kpi-pedido-itens').textContent = count;

  const total = cartItems.reduce((a, c) => a + (c.qtd_pedido * (c.vl_unit || 0)), 0);
  document.getElementById('cart-total-valor').textContent = fmt(total);
  document.getElementById('kpi-pedido-valor').textContent = fmt(total);

  const forn = new Set(cartItems.map(c => c.id_fornecedor).filter(Boolean)).size;
  document.getElementById('kpi-pedido-forn').textContent = `${forn} fornecedor${forn !== 1 ? 'es' : ''}`;

  // Mostrar painel se tiver itens
  if (count > 0) {
    document.getElementById('cart-panel').classList.add('open');
  } else {
    document.getElementById('cart-panel').classList.remove('open');
  }

  renderCarrinho();
}

function renderCarrinho() {
  const tbody = document.getElementById('cart-items-body');
  if (!cartItems.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:20px;color:var(--text-muted)">Nenhum item</td></tr>';
    return;
  }

  tbody.innerHTML = cartItems.map((c, i) => `<tr>
    <td style="font-weight:500;font-size:13px">${c.nome_produto || '—'}<br>
      <span style="font-size:11px;color:var(--text-muted)">${c.referencia || ''}</span>
    </td>
    <td style="font-size:12px;color:var(--text-secondary)">${c.nome_fornecedor || '—'}</td>
    <td class="right mono" style="color:var(--text-muted)">${fmtQtd(c.qtd_sugerida, 0)}</td>
    <td class="right">
      <input type="number" value="${c.qtd_pedido}" min="0"
        style="width:70px;height:28px;text-align:right;border:1px solid var(--border);border-radius:4px;font-family:'DM Mono',monospace;font-size:12px;padding:0 6px"
        onchange="atualizarQtdCart(${i}, this.value)" />
    </td>
    <td class="right mono">${c.vl_unit ? fmt(c.vl_unit) : '—'}</td>
    <td class="right mono" style="font-weight:600">${c.vl_unit ? fmt(c.qtd_pedido * c.vl_unit) : '—'}</td>
    <td>
      <button onclick="removerItemCart(${i})" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:16px;padding:0 4px">×</button>
    </td>
  </tr>`).join('');
}

function atualizarQtdCart(idx, val) {
  cartItems[idx].qtd_pedido = parseFloat(val) || 0;
  const total = cartItems.reduce((a, c) => a + (c.qtd_pedido * (c.vl_unit || 0)), 0);
  document.getElementById('cart-total-valor').textContent = fmt(total);
  document.getElementById('kpi-pedido-valor').textContent = fmt(total);
}

function removerItemCart(idx) {
  cartItems.splice(idx, 1);
  atualizarCarrinho();
  renderAlertas();
}

function abrirCarrinho() {
  document.getElementById('cart-panel').classList.add('open');
}

function toggleCarrinho() {
  const panel = document.getElementById('cart-panel');
  const body = document.getElementById('cart-body');
  const chev = document.getElementById('cart-chevron');
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : '';
  chev.textContent = isOpen ? '▼' : '▲';
}

function adicionarSelecionados() {
  document.querySelectorAll('.row-check:checked').forEach(cb => {
    const id = parseInt(cb.dataset.id);
    if (!cartItems.find(c => c.id_produto === id)) {
      adicionarAoCarrinho(id);
    }
  });
}

function toggleCheckAll(cb) {
  document.querySelectorAll('.row-check').forEach(c => c.checked = cb.checked);
  onRowCheck();
}

function onRowCheck() {
  const checked = document.querySelectorAll('.row-check:checked').length;
  const btn = document.getElementById('btn-add-selected');
  const span = document.getElementById('selected-count');
  if (checked > 0) {
    btn.style.display = '';
    span.textContent = `${checked} selecionado${checked !== 1 ? 's' : ''}`;
  } else {
    btn.style.display = 'none';
    span.textContent = '';
  }
}

// ══════════════════════════════════════════
// EXPORTAR EXCEL
// ══════════════════════════════════════════
function exportarPedido() {
  if (!cartItems.length) {
    alert('Nenhum item no pedido para exportar.');
    return;
  }

  // Montar CSV
  const header = ['Produto', 'Referência', 'Fornecedor', 'Qtd Sugerida', 'Qtd Pedido', 'Vl Unitário', 'Total Estimado'];
  const rows = cartItems.map(c => [
    c.nome_produto || '',
    c.referencia || '',
    c.nome_fornecedor || '',
    c.qtd_sugerida || 0,
    c.qtd_pedido || 0,
    (c.vl_unit || 0).toFixed(2).replace('.', ','),
    ((c.qtd_pedido || 0) * (c.vl_unit || 0)).toFixed(2).replace('.', ','),
  ]);

  const csv = [header, ...rows]
    .map(row => row.map(v => `"${v}"`).join(';'))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pedido_compra_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ══════════════════════════════════════════
// TOTAIS DE ESTOQUE
// ══════════════════════════════════════════
let totOrdem = 'valor';

async function loadTotais() {
  try {
    // Usar cache se já carregado, senão buscar direto da view consolidada
    let rows = alertasConsolidado.length > 0 ? alertasConsolidado : null;
    if (!rows) {
      const { data } = await sb
        .from('comp_produtos_consolidado')
        .select('grupo,id_produto,estoque_total,preco_compra,situacao_estoque,curva_abc_qtd')
        .range(0, 9999);
      rows = data || [];
    }

    const totalSkus = rows.length;
    const totalValor = rows.reduce((a, r) => a + (Math.max(0, r.estoque_total || 0) * (r.preco_compra || 0)), 0);
    const negativos = rows.filter(r => (r.estoque_total || 0) < 0).length;
    const semMov = rows.filter(r => r.situacao_estoque === 'SEM_MOVIMENTO').length;

    document.getElementById('tot-skus').textContent = fmtQtd(totalSkus);
    document.getElementById('tot-valor').textContent = fmt(totalValor);
    document.getElementById('tot-negativos').textContent = fmtQtd(negativos);
    document.getElementById('tot-sem-mov').textContent = fmtQtd(semMov);

    // Montar mapa grupo → subgrupo
    const grupoMap = {};
    rows.forEach(r => {
      const g = r.grupo || 'Sem Grupo';
      const sg = r.subgrupo || 'Sem Subgrupo';
      if (!grupoMap[g]) grupoMap[g] = { skus: new Set(), valor: 0, rupturas: 0, subgrupos: {} };
      grupoMap[g].skus.add(r.id_produto);
      grupoMap[g].valor += Math.max(0, r.estoque_total || 0) * (r.preco_compra || 0);
      if (r.situacao_estoque === 'RUPTURA') grupoMap[g].rupturas++;
      if (!grupoMap[g].subgrupos[sg]) grupoMap[g].subgrupos[sg] = { skus: new Set(), valor: 0, rupturas: 0 };
      grupoMap[g].subgrupos[sg].skus.add(r.id_produto);
      grupoMap[g].subgrupos[sg].valor += Math.max(0, r.estoque_total || 0) * (r.preco_compra || 0);
      if (r.situacao_estoque === 'RUPTURA') grupoMap[g].subgrupos[sg].rupturas++;
    });

    renderTotGrupos(grupoMap);

    // Gráfico ABC
    const abcCount = { A: 0, B: 0, C: 0, '—': 0 };
    rows.forEach(r => {
      const k = r.curva_abc_qtd || '—';
      abcCount[k] = (abcCount[k] || 0) + 1;
    });

    if (chartABC) chartABC.destroy();
    chartABC = new Chart(document.getElementById('chart-abc').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Curva A', 'Curva B', 'Curva C', 'Sem ABC'],
        datasets: [{
          data: [abcCount.A, abcCount.B, abcCount.C, abcCount['—']],
          backgroundColor: ['#7C3AED', '#0077CC', '#9AA5B8', '#E2E8F2'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } }
        }
      }
    });

    // Gráfico situação
    const sitCount = {};
    rows.forEach(r => { const s = r.situacao_estoque || 'SEM_MOVIMENTO'; sitCount[s] = (sitCount[s] || 0) + 1; });
    const sitLabels = ['RUPTURA', 'CRITICO', 'BAIXO', 'OK', 'SEM_MOVIMENTO'];
    const sitColors = ['#D93025', '#E07B00', '#B45309', '#0F9D6E', '#9AA5B8'];
    const sitNames = ['Ruptura', 'Crítico', 'Baixo', 'OK', 'Sem Movimento'];

    if (chartSituacao) chartSituacao.destroy();
    chartSituacao = new Chart(document.getElementById('chart-situacao').getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: sitNames,
        datasets: [{
          data: sitLabels.map(s => sitCount[s] || 0),
          backgroundColor: sitColors,
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { boxWidth: 10, font: { size: 11 } } }
        }
      }
    });

  } catch (e) {
    console.error(e);
  }
}

// Estado dos grupos expandidos
const gruposExpandidos = new Set();

function renderTotGrupos(grupoMap) {
  const sorted = Object.entries(grupoMap)
    .sort((a, b) => totOrdem === 'valor' ? b[1].valor - a[1].valor : b[1].skus.size - a[1].skus.size);

  const tbody = document.getElementById('tot-grupos-body');
  const rows = [];

  sorted.forEach(([grupo, v]) => {
    const expandido = gruposExpandidos.has(grupo);
    const temSubs = Object.keys(v.subgrupos).length > 1;
    rows.push(`
      <tr style="cursor:${temSubs ? 'pointer' : 'default'}" onclick="${temSubs ? "toggleGrupo('" + grupo.replace(/'/g, "\'") + "')" : ''}">
        <td style="font-weight:600">
          ${temSubs ? '<span style="color:var(--blue-mid);margin-right:6px;font-size:11px">' + (expandido ? '▼' : '▶') + '</span>' : '<span style="margin-right:18px"></span>'}
          ${grupo}
        </td>
        <td class="right mono">${fmtQtd(v.skus.size)}</td>
        <td class="right mono">${fmt(v.valor)}</td>
        <td class="right mono" style="color:${v.rupturas > 0 ? 'var(--red)' : 'var(--text-muted)'}">
          ${v.rupturas > 0 ? v.rupturas : '—'}
        </td>
      </tr>`);

    if (expandido && temSubs) {
      const subsSorted = Object.entries(v.subgrupos)
        .sort((a, b) => totOrdem === 'valor' ? b[1].valor - a[1].valor : b[1].skus.size - a[1].skus.size);
      subsSorted.forEach(([sg, sv]) => {
        rows.push(`
          <tr style="background:var(--surface2)">
            <td style="padding-left:36px;font-size:12px;color:var(--text-secondary)">└ ${sg}</td>
            <td class="right mono" style="font-size:12px;color:var(--text-secondary)">${fmtQtd(sv.skus.size)}</td>
            <td class="right mono" style="font-size:12px;color:var(--text-secondary)">${fmt(sv.valor)}</td>
            <td class="right mono" style="font-size:12px;color:${sv.rupturas > 0 ? 'var(--red)' : 'var(--text-muted)'}">
              ${sv.rupturas > 0 ? sv.rupturas : '—'}
            </td>
          </tr>`);
      });
    }
  });
  tbody.innerHTML = rows.join('');
}

function toggleGrupo(grupo) {
  if (gruposExpandidos.has(grupo)) gruposExpandidos.delete(grupo);
  else gruposExpandidos.add(grupo);
  loadTotais();
}

function setTotOrdem(ordem, btn) {
  totOrdem = ordem;
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadTotais();
}

// ══════════════════════════════════════════
// FORNECEDORES
// ══════════════════════════════════════════
let fornOrdem = 'volume';
let fornData = [];

async function loadFornecedores() {
  document.getElementById('forn-ranking-body').innerHTML =
    '<tr class="loading-row"><td colspan="7">Carregando...</td></tr>';

  try {
    const [rForn, rLead] = await Promise.all([
      sb.from('comp_lead_time_forn').select('*').range(0, 499),
      sb.from('comp_lead_time_pedido').select('id_fornecedor,lead_pedido_medio,lead_pedido_min,lead_pedido_max,qtd_pares,ultima_nf').range(0, 499),
    ]);

    // Mesclar lead time pedido nos dados do fornecedor
    const leadMap = {};
    (rLead.data || []).forEach(l => { leadMap[l.id_fornecedor] = l; });

    fornData = (rForn.data || []).map(f => ({
      ...f,
      ...leadMap[f.id_fornecedor],
    }));

    document.getElementById('forn-total').textContent = fmtQtd(fornData.length);
    const volTotal = fornData.reduce((a, r) => a + (r.valor_total_comprado || 0), 0);
    document.getElementById('forn-volume').textContent = fmt(volTotal);
    const leads = fornData.filter(r => r.lead_pedido_medio > 0).map(r => r.lead_pedido_medio);
    const leadMed = leads.length ? Math.round(leads.reduce((a, v) => a + v, 0) / leads.length) : 0;
    document.getElementById('forn-lead').textContent = leadMed ? leadMed + ' dias' : '—';

    renderFornecedores();
  } catch (e) {
    console.error(e);
  }
}

function renderFornecedores() {
  let dados = [...fornData];
  if (fornOrdem === 'volume') dados.sort((a, b) => (b.valor_total_comprado || 0) - (a.valor_total_comprado || 0));
  else if (fornOrdem === 'compras') dados.sort((a, b) => (b.qtd_compras || 0) - (a.qtd_compras || 0));
  else if (fornOrdem === 'produtos') dados.sort((a, b) => (b.qtd_produtos_comprados || 0) - (a.qtd_produtos_comprados || 0));
  else if (fornOrdem === 'lead') dados.sort((a, b) => (a.lead_pedido_medio || 999) - (b.lead_pedido_medio || 999));

  const tbody = document.getElementById('forn-ranking-body');
  tbody.innerHTML = dados.slice(0, 50).map((r, i) => {
    const lead = r.lead_pedido_medio;
    const leadColor = !lead ? 'var(--text-muted)' : lead <= 7 ? 'var(--green)' : lead <= 15 ? 'var(--orange)' : 'var(--red)';
    return `<tr class="clickable" onclick="abrirFornDrawer(${r.id_fornecedor})">
      <td class="mono" style="color:var(--text-muted);font-size:12px">${i + 1}º</td>
      <td style="font-weight:500">${r.nome_fornecedor || '—'}</td>
      <td class="right mono" style="font-weight:600">${fmt(r.valor_total_comprado)}</td>
      <td class="right mono">${fmtQtd(r.qtd_compras)}</td>
      <td class="right mono">${fmtQtd(r.qtd_produtos_comprados)}</td>
      <td class="right mono" style="color:${leadColor};font-weight:600">
        ${lead ? lead + 'd' : '—'}
        ${lead ? `<div style="font-size:10px;color:var(--text-muted)">${r.lead_pedido_min}–${r.lead_pedido_max}d</div>` : ''}
      </td>
      <td class="right mono" style="color:var(--text-muted)">${fmtData(r.ultima_nf || r.ultima_compra)}</td>
    </tr>`;
  }).join('');

  // Gráfico top 10
  const top10 = dados.slice(0, 10);
  if (chartFornTop10) chartFornTop10.destroy();
  const ctx = document.getElementById('chart-forn-top10');
  if (!ctx) return;
  chartFornTop10 = new Chart(ctx.getContext('2d'), {
    type: 'bar',
    data: {
      labels: top10.map(r => (r.nome_fornecedor || '').slice(0, 20)),
      datasets: [{
        label: 'Volume R$',
        data: top10.map(r => r.valor_total_comprado || 0),
        backgroundColor: '#1A3A8F',
        borderRadius: 4,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#E2E8F2' }, ticks: { font: { size: 10 }, callback: v => `R$${(v/1000).toFixed(0)}K` } },
        y: { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });
}

function setFornOrdem(ordem, btn) {
  fornOrdem = ordem;
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFornecedores();
}

// ══════════════════════════════════════════
// DRAWER DETALHE FORNECEDOR
// ══════════════════════════════════════════
let fornAtual = null;
const TIPOS_COMPRA_FORN = [
  'NF MOV EST SEM PRECO','NF MOV EST MUDA PREC','NF. MOV.EST.SEM PREC',
  'PED MOV EST SEM PREC','PED MOV EST MUDA PRE','PED SEM EST MUDA PRE',
  'COMPRA C/CUSTO','COMPRA C/CUSTO ','COMPRA S/CUSTO','COMPRA S/EST S/PRECO'
];

function abrirFornDrawer(idFornecedor) {
  const f = fornData.find(x => x.id_fornecedor === idFornecedor);
  if (!f) return;
  fornAtual = f;

  const lead = f.lead_pedido_medio;
  const leadColor = !lead ? 'var(--text-muted)' : lead <= 7 ? 'var(--green)' : lead <= 15 ? 'var(--orange)' : 'var(--red)';

  document.getElementById('forn-drawer-nome').textContent = f.nome_fornecedor || '—';
  document.getElementById('forn-drawer-sub').textContent =
    `${fmtQtd(f.qtd_compras)} compras · ${fmtQtd(f.qtd_produtos_comprados)} produtos · Volume: ${fmt(f.valor_total_comprado)}`;

  // Reset tabs
  document.querySelectorAll('#forn-drawer .drawer-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#forn-drawer .drawer-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('#forn-drawer .drawer-tab').classList.add('active');
  document.getElementById('forntab-resumo').classList.add('active');

  document.getElementById('forn-drawer').classList.add('open');
  document.getElementById('forn-drawer-overlay').classList.add('open');

  loadFornTabResumo(f);
}

function fecharFornDrawer() {
  document.getElementById('forn-drawer').classList.remove('open');
  document.getElementById('forn-drawer-overlay').classList.remove('open');
}

function switchFornTab(tab, btn) {
  document.querySelectorAll('#forn-drawer .drawer-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#forn-drawer .drawer-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`forntab-${tab}`).classList.add('active');
  if (tab === 'resumo') loadFornTabResumo(fornAtual);
  if (tab === 'produtos') loadFornTabProdutos(fornAtual);
  if (tab === 'historico') loadFornTabHistorico(fornAtual);
}

function loadFornTabResumo(f) {
  const lead = f.lead_pedido_medio;
  const leadColor = !lead ? 'var(--text-muted)' : lead <= 7 ? 'var(--green)' : lead <= 15 ? 'var(--orange)' : 'var(--red)';

  // Produtos em alerta deste fornecedor
  const prodsForn = Object.entries(fornProdMap)
    .filter(([idP, forns]) => forns.some(ff => ff.id_fornecedor === f.id_fornecedor))
    .map(([idP]) => alertasConsolidado.find(p => p.id_produto === parseInt(idP)))
    .filter(Boolean);

  const rupturas = prodsForn.filter(p => p.situacao_estoque === 'RUPTURA').length;
  const criticos = prodsForn.filter(p => p.situacao_estoque === 'CRITICO').length;
  const baixos   = prodsForn.filter(p => p.situacao_estoque === 'BAIXO').length;

  document.getElementById('forntab-resumo').innerHTML = `
    <div class="cards-grid cards-grid-4" style="margin-bottom:16px">
      <div class="card">
        <div class="card-label">Volume 12m</div>
        <div class="card-value" style="font-size:20px">${fmt(f.valor_total_comprado)}</div>
      </div>
      <div class="card">
        <div class="card-label">Nº Compras</div>
        <div class="card-value blue" style="font-size:20px">${fmtQtd(f.qtd_compras)}</div>
      </div>
      <div class="card">
        <div class="card-label">Lead Pedido→NF</div>
        <div class="card-value" style="font-size:20px;color:${leadColor}">${lead ? lead + 'd' : '—'}</div>
        <div class="card-sub">${lead ? `${f.lead_pedido_min}–${f.lead_pedido_max}d · ${f.qtd_pares} pedidos` : 'sem histórico'}</div>
      </div>
      <div class="card">
        <div class="card-label">Última NF</div>
        <div class="card-value" style="font-size:16px">${fmtData(f.ultima_nf || f.ultima_compra)}</div>
      </div>
    </div>

    <div class="cards-grid cards-grid-3" style="margin-bottom:16px">
      <div class="card" style="border-left:4px solid var(--red)">
        <div class="card-label">🔴 Em Ruptura</div>
        <div class="card-value red" style="font-size:22px">${rupturas}</div>
        <div class="card-sub">produtos cadastrados</div>
      </div>
      <div class="card" style="border-left:4px solid var(--orange)">
        <div class="card-label">🟠 Crítico</div>
        <div class="card-value orange" style="font-size:22px">${criticos}</div>
        <div class="card-sub">cobertura &lt; 15 dias</div>
      </div>
      <div class="card" style="border-left:4px solid var(--yellow)">
        <div class="card-label">🟡 Baixo</div>
        <div class="card-value" style="font-size:22px;color:var(--yellow)">${baixos}</div>
        <div class="card-sub">cobertura &lt; 30 dias</div>
      </div>
    </div>

    ${(rupturas + criticos + baixos) > 0 ? `
    <div style="font-size:13px;font-weight:600;margin-bottom:10px">Produtos que precisam de reposição</div>
    <div class="table-card">
      <div style="overflow-x:auto;max-height:260px;overflow-y:auto">
        <table class="data-table">
          <thead><tr><th>Produto</th><th>Ref.</th><th>Situação</th><th class="right">Estoque</th><th class="right">Cobertura</th><th class="right">Sugerido</th></tr></thead>
          <tbody>
            ${prodsForn
              .filter(p => ['RUPTURA','CRITICO','BAIXO'].includes(p.situacao_estoque))
              .sort((a,b) => ({RUPTURA:1,CRITICO:2,BAIXO:3}[a.situacao_estoque]||9) - ({RUPTURA:1,CRITICO:2,BAIXO:3}[b.situacao_estoque]||9))
              .map(p => `<tr>
                <td style="font-size:12px;font-weight:500;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.nome}</td>
                <td class="mono" style="color:var(--text-muted)">${p.referencia||'—'}</td>
                <td>${badgeSituacao(p.situacao_estoque)}</td>
                <td class="right mono" style="color:${p.estoque_total<0?'var(--orange)':''}">${fmtQtd(p.estoque_total,0)}</td>
                <td class="right mono" style="color:var(--red)">${p.cobertura_dias?Math.round(p.cobertura_dias)+'d':'—'}</td>
                <td class="right mono" style="font-weight:600;color:var(--blue-mid)">${fmtQtd(p.qtd_sugerida,0)}</td>
              </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>` : '<div style="text-align:center;padding:20px;color:var(--green);font-size:13px">✅ Nenhum produto em alerta para este fornecedor</div>'}`;
}

async function loadFornTabProdutos(f) {
  const el = document.getElementById('forntab-produtos');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted)">Carregando...</div>';

  try {
    const { data } = await sb
      .from('vw_fb_forn_prod')
      .select('id_produto,referencia_produto,nome_produto,preco_fornecedor,referencia_fornecedor')
      .eq('id_fornecedor', f.id_fornecedor)
      .order('nome_produto')
      .range(0, 499);

    if (!data?.length) {
      el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted)">Nenhum produto cadastrado</div>';
      return;
    }

    // Enriquecer com dados de estoque
    const idsProdutos = data.map(p => p.id_produto);
    const prodsConsolidados = alertasConsolidado.filter(p => idsProdutos.includes(p.id_produto));
    const prodMap = {};
    prodsConsolidados.forEach(p => { prodMap[p.id_produto] = p; });

    el.innerHTML = `
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:12px">${data.length} produto${data.length!==1?'s':''} cadastrados</div>
      <div class="table-card">
        <div style="overflow-x:auto;max-height:480px;overflow-y:auto">
          <table class="data-table">
            <thead><tr>
              <th>Produto</th>
              <th>Ref. Produto</th>
              <th>Ref. Forn.</th>
              <th class="right">Preço Ref.</th>
              <th class="right">Estoque</th>
              <th class="right">Cobertura</th>
              <th>Situação</th>
            </tr></thead>
            <tbody>
              ${data.map(p => {
                const c = prodMap[p.id_produto];
                return `<tr>
                  <td style="font-size:12px;font-weight:500;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.nome_produto||'—'}</td>
                  <td class="mono" style="color:var(--text-muted)">${p.referencia_produto||'—'}</td>
                  <td class="mono" style="color:var(--text-muted)">${p.referencia_fornecedor||'—'}</td>
                  <td class="right mono">${p.preco_fornecedor?fmt(p.preco_fornecedor):'—'}</td>
                  <td class="right mono" style="color:${c&&c.estoque_total<0?'var(--orange)':''}">${c?fmtQtd(c.estoque_total,0):'—'}</td>
                  <td class="right mono">${c&&c.cobertura_dias?Math.round(c.cobertura_dias)+'d':'—'}</td>
                  <td>${c?badgeSituacao(c.situacao_estoque):'—'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch(e) {
    el.innerHTML = '<div style="color:var(--red);padding:16px">Erro ao carregar</div>';
  }
}

async function loadFornTabHistorico(f) {
  const el = document.getElementById('forntab-historico');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted)">Carregando...</div>';

  try {
    const { data } = await sb
      .from('vw_fb_historico_compras')
      .select('data_compra,num_nf,nome_produto,referencia,qtd,vl_unit,valor_total,lead_time_dias,tipo_entrada,empresa')
      .eq('id_fornecedor', f.id_fornecedor)
      .in('tipo_entrada', TIPOS_COMPRA_FORN)
      .order('data_compra', { ascending: false })
      .range(0, 199);

    if (!data?.length) {
      el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted)">Sem histórico de compras</div>';
      return;
    }

    el.innerHTML = `
      <div class="table-card">
        <div style="overflow-x:auto;max-height:480px;overflow-y:auto">
          <table class="data-table">
            <thead><tr>
              <th>Data</th>
              <th>NF</th>
              <th>Produto</th>
              <th>Empresa</th>
              <th class="right">Qtd</th>
              <th class="right">Vl Unit</th>
              <th class="right">Total</th>
              <th class="right">Lead</th>
            </tr></thead>
            <tbody>
              ${data.map(r => `<tr>
                <td class="mono" style="color:var(--text-muted);white-space:nowrap">${fmtData(r.data_compra)}</td>
                <td class="mono" style="color:var(--text-muted)">${r.num_nf||'—'}</td>
                <td style="font-size:12px;max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${r.nome_produto||''}">${r.nome_produto||'—'}</td>
                <td style="font-size:12px;color:var(--text-secondary)">${r.empresa||'—'}</td>
                <td class="right mono">${fmtQtd(r.qtd,0)}</td>
                <td class="right mono" style="color:${r.vl_unit>0?'var(--text-primary)':'var(--text-muted)'}">${r.vl_unit>0?fmt(r.vl_unit):'—'}</td>
                <td class="right mono" style="font-weight:600">${r.valor_total>0?fmt(r.valor_total):'—'}</td>
                <td class="right mono" style="color:${r.lead_time_dias>0?'var(--text-primary)':'var(--text-muted)'}">${r.lead_time_dias>0?r.lead_time_dias+'d':'—'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  } catch(e) {
    el.innerHTML = '<div style="color:var(--red);padding:16px">Erro ao carregar</div>';
  }
}

// ══════════════════════════════════════════
// BALANÇO FÍSICO
// ══════════════════════════════════════════
async function loadBalanco() {
  const tbody = document.getElementById('balanco-body');
  try {
    const { data } = await sb
      .from('comp_balanco_contagem')
      .select('id_sessao,descricao_sessao,empresa,centro_estoque,finalizado,contado_em,id_produto')
      .order('contado_em', { ascending: false })
      .range(0, 99);

    if (!data?.length) {
      tbody.innerHTML = '<tr class="loading-row"><td colspan="7">Nenhuma sessão de balanço encontrada</td></tr>';
      return;
    }

    // Agrupar por sessão
    const sessaoMap = {};
    data.forEach(r => {
      const sid = r.id_sessao;
      if (!sessaoMap[sid]) sessaoMap[sid] = {
        descricao: r.descricao_sessao,
        empresa: r.empresa,
        centro: r.centro_estoque,
        finalizado: r.finalizado,
        data: r.contado_em,
        itens: 0,
        divergencias: 0
      };
      sessaoMap[sid].itens++;
    });

    tbody.innerHTML = Object.entries(sessaoMap).map(([sid, s]) => `<tr>
      <td style="font-weight:500">${s.descricao || sid.slice(0, 8) + '...'}</td>
      <td style="font-size:12px;color:var(--text-secondary)">${s.empresa || '—'} · ${s.centro || '—'}</td>
      <td class="right mono">${fmtQtd(s.itens)}</td>
      <td class="right mono" style="color:${s.divergencias > 0 ? 'var(--orange)' : 'var(--text-muted)'}">
        ${s.divergencias || '—'}
      </td>
      <td>
        <span class="badge ${s.finalizado ? 'badge-ok' : 'badge-baixo'}">
          ${s.finalizado ? 'Finalizado' : 'Em aberto'}
        </span>
      </td>
      <td class="right mono" style="color:var(--text-muted)">${fmtData(s.data)}</td>
      <td>
        <button class="btn btn-outline" style="height:26px;font-size:11px;padding:0 8px">
          ${s.finalizado ? 'Ver' : 'Continuar'}
        </button>
      </td>
    </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = '<tr class="loading-row"><td colspan="7" style="color:var(--red)">Erro ao carregar</td></tr>';
  }
}

function novasSessao() {
  alert('Funcionalidade em desenvolvimento. Em breve você poderá iniciar uma nova sessão de contagem.');
}

// ══════════════════════════════════════════
// IMPORTAÇÃO
// ══════════════════════════════════════════
let impProcessos = [];
let impViewAtual = 'kanban';
let impProcessoAtual = null;

const IMP_STATUS = {
  PROGRAMADA:    { label: 'Programada',    color: '#6366F1', bg: '#EEF2FF' },
  EM_PRODUCAO:   { label: 'Em Produção',   color: '#D97706', bg: '#FEF3C7' },
  EM_TRANSPORTE: { label: 'Em Transporte', color: '#0077CC', bg: '#E8F4FD' },
  DESEMBARACO:   { label: 'Desembaraço',   color: '#7C3AED', bg: '#F3E8FF' },
  CONCLUIDA:     { label: 'Concluída',     color: '#0F9D6E', bg: '#E8F8F3' },
  CANCELADA:     { label: 'Cancelada',     color: '#9AA5B8', bg: '#F0F3F8' },
};
const IMP_STATUS_ORDER = ['PROGRAMADA','EM_PRODUCAO','EM_TRANSPORTE','DESEMBARACO','CONCLUIDA'];
const IMP_TIPOS_PAG = {
  PAGAMENTO:        '💵 Pagamento Fornecedor',
  NACIONALIZACAO:   '🏭 Nacionalização',
  FRETE_MARITIMO:   '🚢 Frete Marítimo',
  FRETE_RODOVIARIO: '🚛 Frete Rodoviário',
  OUTROS:           '📦 Outros',
};

async function loadImportacao() {
  try {
    const { data, error } = await sb.from('vw_import_processos_resumo').select('*')
      .order('criado_em', { ascending: false }).range(0, 499);
    if (error) throw error;
    impProcessos = data || [];
    renderImportacao();
    atualizarKPIsImport();
  } catch(e) { console.error('Erro importações:', e); }
}

function atualizarKPIsImport() {
  const producao   = impProcessos.filter(p => p.status === 'EM_PRODUCAO').length;
  const transporte = impProcessos.filter(p => p.status === 'EM_TRANSPORTE').length;
  const ativos     = impProcessos.filter(p => !['CONCLUIDA','CANCELADA'].includes(p.status));
  const totalAPagar  = ativos.reduce((a, p) => a + (p.total_a_pagar_brl || 0), 0);
  const pagPendentes = ativos.reduce((a, p) => a + (p.pagamentos_pendentes || 0), 0);
  const el = id => document.getElementById(id);
  if (el('imp-kpi-producao'))   el('imp-kpi-producao').textContent = producao;
  if (el('imp-kpi-transporte')) el('imp-kpi-transporte').textContent = transporte;
  if (el('imp-kpi-apagar'))     el('imp-kpi-apagar').textContent = fmt(totalAPagar);
  if (el('imp-kpi-apagar-sub')) el('imp-kpi-apagar-sub').textContent = `${pagPendentes} pagamento${pagPendentes!==1?'s':''} pendente${pagPendentes!==1?'s':''}`;
  const proxima = ativos.filter(p => p.data_prev_chegada).sort((a,b) => a.data_prev_chegada.localeCompare(b.data_prev_chegada))[0];
  if (el('imp-kpi-proxima'))      el('imp-kpi-proxima').textContent = proxima ? fmtData(proxima.data_prev_chegada) : '—';
  if (el('imp-kpi-proxima-forn')) el('imp-kpi-proxima-forn').textContent = proxima?.nome_fornecedor || '—';
}

function setImpView(view, btn) {
  impViewAtual = view;
  btn.closest('.toggle-group').querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('imp-kanban').style.display = view === 'kanban' ? 'flex' : 'none';
  document.getElementById('imp-lista').style.display  = view === 'lista'  ? 'block' : 'none';
  if (view === 'lista') renderImpLista(); else renderImpKanban();
}

function renderImportacao() {
  if (impViewAtual === 'kanban') renderImpKanban(); else renderImpLista();
}

function renderImpKanban() {
  const kanban = document.getElementById('imp-kanban');
  if (!kanban) return;
  kanban.innerHTML = IMP_STATUS_ORDER.map(status => {
    const { label, color, bg } = IMP_STATUS[status];
    const procs = impProcessos.filter(p => p.status === status);
    const cards = procs.map(p => `
      <div onclick="abrirImpDrawer('${p.id}')"
        style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;cursor:pointer;transition:box-shadow 0.15s;margin-bottom:8px"
        onmouseover="this.style.boxShadow='var(--shadow-md)'" onmouseout="this.style.boxShadow='none'">
        <div style="font-size:12px;font-weight:700;margin-bottom:6px;line-height:1.3">${p.codigo}</div>
        ${p.nome_fornecedor ? `<div style="font-size:11px;color:${color};background:${bg};padding:2px 6px;border-radius:4px;display:inline-block;margin-bottom:6px">${p.nome_fornecedor}</div>` : ''}
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px">${p.data_prev_chegada ? '📅 '+fmtData(p.data_prev_chegada) : ''}</div>
        ${(p.pedidos||[]).length > 0 ? `<div style="font-size:11px;color:var(--text-secondary)">Ped: ${(p.pedidos||[]).join(', ')}</div>` : ''}
        <div style="display:flex;justify-content:space-between;margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
          ${p.total_a_pagar_brl > 0 ? `<span style="font-size:11px;color:var(--orange);font-weight:600">A pagar: ${fmt(p.total_a_pagar_brl)}</span>` : `<span style="font-size:11px;color:var(--green)">✓ Quitado</span>`}
          ${p.total_usd > 0 ? `<span style="font-size:11px;color:var(--text-muted)">US$ ${fmtQtd(p.total_usd,0)}</span>` : ''}
        </div>
      </div>`).join('');
    return `<div style="min-width:240px;flex:1;background:var(--surface2);border-radius:var(--radius);padding:12px;border:1px solid var(--border)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:12px;font-weight:700;color:${color}">${label}</div>
        <span style="background:${bg};color:${color};font-size:11px;font-weight:700;padding:2px 8px;border-radius:10px">${procs.length}</span>
      </div>
      ${cards || `<div style="text-align:center;padding:20px;color:var(--text-muted);font-size:12px">Nenhum processo</div>`}
      <button onclick="abrirModalNovoProcesso('${status}')"
        style="width:100%;margin-top:4px;padding:7px;background:transparent;border:1px dashed var(--border);border-radius:6px;color:var(--text-muted);font-size:12px;cursor:pointer;font-family:'DM Sans',sans-serif">+ Novo</button>
    </div>`;
  }).join('');
}

function renderImpLista() {
  const tbody = document.getElementById('imp-lista-body');
  if (!tbody) return;
  if (!impProcessos.length) { tbody.innerHTML='<tr class="loading-row"><td colspan="10">Nenhum processo cadastrado</td></tr>'; return; }
  tbody.innerHTML = impProcessos.map(p => {
    const {label,color,bg} = IMP_STATUS[p.status]||IMP_STATUS.PROGRAMADA;
    return `<tr class="clickable" onclick="abrirImpDrawer('${p.id}')">
      <td style="font-weight:600;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.codigo}</td>
      <td style="font-size:12px">${p.nome_fornecedor||'—'}</td>
      <td style="font-size:12px;color:var(--text-muted)">${p.importadora||'—'}</td>
      <td><span class="badge" style="color:${color};background:${bg}">${label}</span></td>
      <td class="right mono">${p.qtd_pedidos||0}</td>
      <td class="right mono" style="color:var(--text-muted)">${p.data_prev_chegada?fmtData(p.data_prev_chegada):'—'}</td>
      <td class="right mono">${p.total_usd?'US$ '+fmtQtd(p.total_usd,0):'—'}</td>
      <td class="right mono" style="color:var(--green)">${p.total_pago_brl?fmt(p.total_pago_brl):'—'}</td>
      <td class="right mono" style="color:${p.total_a_pagar_brl>0?'var(--orange)':'var(--text-muted)'}">
        ${p.total_a_pagar_brl>0?fmt(p.total_a_pagar_brl):'—'}</td>
      <td><button class="btn btn-outline" style="height:26px;font-size:11px" onclick="event.stopPropagation();abrirImpDrawer('${p.id}')">Ver</button></td>
    </tr>`;
  }).join('');
}

function abrirImpDrawer(id) {
  const p = impProcessos.find(x => x.id === id);
  if (!p) return;
  impProcessoAtual = p;
  document.getElementById('imp-drawer-titulo').textContent = p.codigo;
  document.getElementById('imp-drawer-sub').textContent = `${p.nome_fornecedor||'—'} · ${p.importadora||'—'} · ${IMP_STATUS[p.status]?.label||p.status}`;
  document.querySelectorAll('#imp-drawer .drawer-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#imp-drawer .drawer-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelector('#imp-drawer .drawer-tab').classList.add('active');
  document.getElementById('imptab-info').classList.add('active');
  document.getElementById('imp-drawer').classList.add('open');
  document.getElementById('imp-drawer-overlay').classList.add('open');
  loadImpTabInfo(p);
}

function fecharImpDrawer() {
  document.getElementById('imp-drawer').classList.remove('open');
  document.getElementById('imp-drawer-overlay').classList.remove('open');
}

function switchImpTab(tab, btn) {
  document.querySelectorAll('#imp-drawer .drawer-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#imp-drawer .drawer-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(`imptab-${tab}`).classList.add('active');
  const p = impProcessoAtual;
  if (tab === 'info') loadImpTabInfo(p);
  if (tab === 'pedidos') loadImpTabPedidos(p);
  if (tab === 'pagamentos') loadImpTabPagamentos(p);
}

function loadImpTabInfo(p) {
  const {label,color,bg} = IMP_STATUS[p.status]||{label:'—',color:'',bg:''};
  document.getElementById('imptab-info').innerHTML = `
    <div class="cards-grid cards-grid-2" style="margin-bottom:16px">
      <div class="card"><div class="card-label">Status</div>
        <div style="margin-top:8px"><span class="badge" style="color:${color};background:${bg};font-size:13px;padding:4px 12px">${label}</span></div></div>
      <div class="card"><div class="card-label">Importadora</div><div class="card-value" style="font-size:18px">${p.importadora||'—'}</div></div>
      <div class="card"><div class="card-label">Embarque</div><div class="card-value" style="font-size:18px">${p.data_embarque?fmtData(p.data_embarque):'—'}</div></div>
      <div class="card"><div class="card-label">Previsão Chegada</div><div class="card-value" style="font-size:18px;color:var(--blue-mid)">${p.data_prev_chegada?fmtData(p.data_prev_chegada):'—'}</div></div>
      <div class="card"><div class="card-label">Valor Total USD</div><div class="card-value" style="font-size:18px">${p.valor_total_usd?'US$ '+fmtQtd(p.valor_total_usd,2):'—'}</div></div>
      <div class="card"><div class="card-label">Valor Total BRL</div><div class="card-value" style="font-size:18px">${p.valor_total_brl?fmt(p.valor_total_brl):'—'}</div></div>
    </div>
    ${p.observacoes?`<div class="card" style="margin-bottom:16px"><div class="card-label">Observações</div><div style="margin-top:8px;font-size:13px;color:var(--text-secondary)">${p.observacoes}</div></div>`:''}
    <div style="display:flex;gap:8px">
      <select onchange="atualizarStatusProcesso('${p.id}',this.value)" class="filter-select" style="height:34px">
        ${IMP_STATUS_ORDER.map(s=>`<option value="${s}" ${s===p.status?'selected':''}>${IMP_STATUS[s].label}</option>`).join('')}
      </select>
      <button class="btn btn-outline" onclick="abrirModalNovoProcesso('${p.id}','editar')">✏️ Editar</button>
    </div>`;
}

async function loadImpTabPedidos(p) {
  const el = document.getElementById('imptab-pedidos');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted)">Carregando...</div>';
  try {
    const {data:pedidos} = await sb.from('import_pedidos').select('*').eq('processo_id',p.id).order('criado_em');
    const numPedidos = (pedidos||[]).map(x => x.numero_pedido);
    let produtosHtml = '';
    if (numPedidos.length > 0) {
      const {data:prods} = await sb.from('vw_fb_pedidos_compra')
        .select('id_pedido,id_produto,nome_produto,referencia,qtd_solicitada,nome_fornecedor')
        .in('id_pedido', numPedidos).range(0,999);
      if (prods?.length) produtosHtml = `<div class="table-card" style="margin-top:16px">
        <div class="table-card-header"><span class="table-card-title">Produtos dos Pedidos</span></div>
        <div style="overflow-x:auto;max-height:300px;overflow-y:auto"><table class="data-table">
          <thead><tr><th>Pedido</th><th>Ref.</th><th>Produto</th><th class="right">Qtd</th><th>Fornecedor</th></tr></thead>
          <tbody>${prods.map(r=>`<tr>
            <td class="mono" style="color:var(--blue-mid)">#${r.id_pedido}</td>
            <td class="mono" style="color:var(--text-muted)">${r.referencia||'—'}</td>
            <td style="font-size:12px">${r.nome_produto||'—'}</td>
            <td class="right mono">${fmtQtd(r.qtd_solicitada,0)}</td>
            <td style="font-size:12px;color:var(--text-secondary)">${r.nome_fornecedor||'—'}</td>
          </tr>`).join('')}</tbody>
        </table></div></div>`;
    }
    el.innerHTML = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <div style="font-size:13px;font-weight:600">Pedidos Vinculados</div>
      <button class="btn btn-primary" style="height:30px;font-size:12px" onclick="abrirModalAddPedido('${p.id}')">+ Vincular Pedido</button>
    </div>
    ${numPedidos.length===0?'<div style="text-align:center;padding:20px;color:var(--text-muted)">Nenhum pedido vinculado</div>':
      pedidos.map(ped=>`<div style="background:var(--surface2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:10px 14px;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between">
        <span style="font-weight:700;color:var(--blue-mid);font-family:'DM Mono',monospace">#${ped.id_pedido}</span>
        <button onclick="removerPedidoProcesso('${ped.id}')" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:14px">✕</button>
      </div>`).join('')}
    ${produtosHtml}`;
  } catch(e) { el.innerHTML='<div style="color:var(--red);padding:16px">Erro ao carregar</div>'; }
}

async function loadImpTabPagamentos(p) {
  const el = document.getElementById('imptab-pagamentos');
  el.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text-muted)">Carregando...</div>';
  try {
    const {data:pags} = await sb.from('import_pagamentos').select('*').eq('processo_id',p.id).order('data_vencimento');
    const totalPago   = (pags||[]).filter(x=>x.status==='PAGO').reduce((a,x)=>a+(x.valor_rateado_brl||x.valor_brl||0),0);
    const totalAPagar = (pags||[]).filter(x=>x.status==='A_PAGAR').reduce((a,x)=>a+(x.valor_rateado_brl||x.valor_brl||0),0);
    const totalUSD    = (pags||[]).reduce((a,x)=>a+(x.valor_usd||0),0);
    el.innerHTML = `
      <div class="cards-grid cards-grid-3" style="margin-bottom:16px">
        <div class="card"><div class="card-label">Pago</div><div class="card-value green" style="font-size:18px">${fmt(totalPago)}</div></div>
        <div class="card"><div class="card-label">A Pagar</div><div class="card-value orange" style="font-size:18px">${fmt(totalAPagar)}</div></div>
        <div class="card"><div class="card-label">Total USD</div><div class="card-value" style="font-size:18px">${totalUSD?'US$ '+fmtQtd(totalUSD,2):'—'}</div></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-size:13px;font-weight:600">Pagamentos</div>
        <button class="btn btn-primary" style="height:30px;font-size:12px" onclick="abrirModalAddPagamento('${p.id}')">+ Novo Pagamento</button>
      </div>
      ${!pags?.length?'<div style="text-align:center;padding:20px;color:var(--text-muted)">Nenhum pagamento registrado</div>':
        `<div class="table-card"><div style="overflow-x:auto"><table class="data-table">
          <thead><tr><th>Tipo</th><th>Destinatário</th><th>CP</th><th>Vencimento</th><th class="right">BRL</th><th class="right">USD</th><th class="right">Câmbio</th><th class="right">Rateado</th><th>Status</th><th></th></tr></thead>
          <tbody>${(pags||[]).map(pg=>`<tr>
            <td style="font-size:12px">${IMP_TIPOS_PAG[pg.tipo]||pg.tipo}</td>
            <td style="font-size:12px;font-weight:500">${pg.destinatario||'—'}</td>
            <td class="mono" style="color:var(--text-muted)">${pg.numero_cp||'—'}</td>
            <td class="mono" style="color:var(--text-muted)">${pg.data_vencimento?fmtData(pg.data_vencimento):'—'}</td>
            <td class="right mono">${pg.valor_brl?fmt(pg.valor_brl):'—'}</td>
            <td class="right mono" style="color:var(--text-muted)">${pg.valor_usd?'US$ '+fmtQtd(pg.valor_usd,2):'—'}</td>
            <td class="right mono" style="color:var(--text-muted)">${pg.cambio?'R$ '+fmtQtd(pg.cambio,2):'—'}</td>
            <td class="right mono" style="font-weight:600;color:${pg.valor_rateado_brl?'var(--blue-mid)':'var(--text-muted)'}">
              ${pg.valor_rateado_brl?fmt(pg.valor_rateado_brl):'—'}</td>
            <td><span class="badge ${pg.status==='PAGO'?'badge-ok':'badge-baixo'}">${pg.status==='PAGO'?'✓ Pago':'⏳ A Pagar'}</span></td>
            <td><button onclick="removerPagamento('${pg.id}')" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:14px">✕</button></td>
          </tr>`).join('')}</tbody>
        </table></div></div>`}`;
  } catch(e) { el.innerHTML='<div style="color:var(--red);padding:16px">Erro ao carregar</div>'; }
}

function abrirModalNovoProcesso(param='PROGRAMADA', modo='novo') {
  const overlay = document.getElementById('modal-processo-overlay');
  if (!overlay) return;

  // Modo edição: param é o id do processo
  let editando = null;
  let statusInicial = 'PROGRAMADA';

  if (modo === 'editar') {
    editando = impProcessos.find(x => x.id === param);
    if (!editando) { showToast('Processo não encontrado.','error'); return; }
    statusInicial = editando.status || 'PROGRAMADA';
  } else {
    // param pode ser um status string
    if (IMP_STATUS[param]) statusInicial = param;
  }

  const titulo = editando ? `Editar Processo — ${editando.codigo}` : 'Novo Processo de Importação';
  document.getElementById('modal-processo-title').textContent = titulo;

  document.getElementById('modal-processo-body').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">

      <div style="grid-column:1/-1">
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Código / Nome *</label>
        <input id="imp-f-codigo" class="filter-select" style="width:100%;height:36px" placeholder="Ex: WALTERY WAT 260203 AW - B ADV 2"
          value="${editando?.codigo||''}" />
      </div>

      <div style="grid-column:1/-1;position:relative">
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Fornecedor</label>
        <input id="imp-f-fornecedor-busca" class="filter-select" style="width:100%;height:36px"
          placeholder="Digite o nome do fornecedor..."
          oninput="buscarFornecedorImport(this.value)" autocomplete="off"
          value="${editando?.nome_fornecedor||''}" />
        <input type="hidden" id="imp-f-fornecedor-id" value="${editando?.id_fornecedor||''}" />
        <input type="hidden" id="imp-f-fornecedor-nome" value="${editando?.nome_fornecedor||''}" />
        <div id="imp-forn-suggestions" style="display:none;position:absolute;top:60px;left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-sm);max-height:180px;overflow-y:auto;z-index:500;box-shadow:var(--shadow-md)"></div>
      </div>

      <div>
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Importadora</label>
        <select id="imp-f-importadora" class="filter-select" style="width:100%;height:36px">
          <option value="">Selecione...</option>
          ${['Bononi SC','MLB PR','Battogo','Bononi PR'].map(o=>`<option ${editando?.importadora===o?'selected':''}>${o}</option>`).join('')}
        </select>
      </div>

      <div>
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Status</label>
        <select id="imp-f-status" class="filter-select" style="width:100%;height:36px">
          ${IMP_STATUS_ORDER.map(s=>`<option value="${s}" ${s===statusInicial?'selected':''}>${IMP_STATUS[s].label}</option>`).join('')}
        </select>
      </div>

      <div>
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Data Embarque</label>
        <input id="imp-f-embarque" type="date" class="filter-select" style="width:100%;height:36px"
          value="${editando?.data_embarque?.slice(0,10)||''}" />
      </div>

      <div>
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Previsão Chegada</label>
        <input id="imp-f-chegada" type="date" class="filter-select" style="width:100%;height:36px"
          value="${editando?.data_prev_chegada?.slice(0,10)||''}" />
      </div>

      <div>
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Valor USD</label>
        <input id="imp-f-usd" type="number" step="0.01" class="filter-select" style="width:100%;height:36px"
          placeholder="0,00" value="${editando?.valor_total_usd||''}" />
      </div>

      <div>
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Status Pagamento</label>
        <select id="imp-f-pgto" class="filter-select" style="width:100%;height:36px">
          <option value="NAO_PAGO" ${editando?.status_pgto==='NAO_PAGO'||!editando?'selected':''}>Não Pago</option>
          <option value="PARCIAL" ${editando?.status_pgto==='PARCIAL'?'selected':''}>Parcial</option>
          <option value="PAGO" ${editando?.status_pgto==='PAGO'?'selected':''}>Pago</option>
        </select>
      </div>

      <div style="grid-column:1/-1">
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Observações</label>
        <textarea id="imp-f-obs" class="filter-select" style="width:100%;height:60px;resize:vertical;padding:8px">${editando?.observacoes||''}</textarea>
      </div>

    </div>
    ${!editando ? '<div style="font-size:11px;color:var(--text-muted);margin-top:12px">💡 Pedidos de compra e pagamentos podem ser vinculados após a criação</div>' : ''}
    <div style="display:flex;gap:8px;margin-top:12px;justify-content:space-between;align-items:center">
      ${editando ? `<button class="btn" onclick="excluirProcesso('${editando.id}')"
        style="background:var(--red-bg);color:var(--red);border:1px solid var(--red);height:34px;padding:0 14px">
        🗑️ Excluir Processo
      </button>` : '<div></div>'}
      <div style="display:flex;gap:8px">
        <button class="btn btn-outline" onclick="fecharModalProcesso()">Cancelar</button>
        <button class="btn btn-primary" onclick="${editando ? `salvarEdicaoProcesso('${editando.id}')` : 'salvarNovoProcesso()'}">
          ${editando ? '💾 Salvar Alterações' : 'Criar Processo'}
        </button>
      </div>
    </div>`;
  overlay.style.display = 'flex';
}

function fecharModalProcesso() {
  const overlay = document.getElementById('modal-processo-overlay');
  if (overlay) overlay.style.display = 'none';
}

let _fornTimer = null;
async function buscarFornecedorImport(valor) {
  const sugg = document.getElementById('imp-forn-suggestions');
  if (!sugg) return;
  if (!valor || valor.length < 2) { sugg.style.display = 'none'; return; }
  clearTimeout(_fornTimer);
  _fornTimer = setTimeout(async () => {
    try {
      const { data } = await sb.from('vw_fb_forn_prod')
        .select('id_fornecedor,nome_fornecedor')
        .ilike('nome_fornecedor', `%${valor}%`)
        .range(0, 9)
        .order('nome_fornecedor');
      if (!data?.length) { sugg.style.display = 'none'; return; }
      // Deduplicar por id_fornecedor
      const uniq = [...new Map(data.map(d => [d.id_fornecedor, d])).values()];
      sugg.innerHTML = uniq.map(d => `
        <div onclick="selecionarFornecedorImport(${d.id_fornecedor}, '${d.nome_fornecedor.replace(/'/g,"\\'")}' )"
          style="padding:8px 12px;cursor:pointer;font-size:13px;border-bottom:1px solid var(--border)"
          onmouseover="this.style.background='var(--surface2)'" onmouseout="this.style.background=''">
          ${d.nome_fornecedor}
        </div>`).join('');
      sugg.style.display = 'block';
    } catch(e) { sugg.style.display = 'none'; }
  }, 300);
}

function selecionarFornecedorImport(id, nome) {
  document.getElementById('imp-f-fornecedor-busca').value = nome;
  document.getElementById('imp-f-fornecedor-id').value = id;
  document.getElementById('imp-f-fornecedor-nome').value = nome;
  document.getElementById('imp-forn-suggestions').style.display = 'none';
}

let _pedidoTimer = null;
async function previewPedidosImport(valor) {
  const preview = document.getElementById('imp-pedidos-preview');
  if (!preview || !valor.trim()) { if (preview) preview.innerHTML = ''; return; }
  const nums = valor.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
  if (!nums.length) return;
  clearTimeout(_pedidoTimer);
  _pedidoTimer = setTimeout(async () => {
    try {
      const { data } = await sb.from('vw_fb_pedidos_compra')
        .select('id_pedido,nome_produto,referencia,qtd_solicitada,nome_fornecedor')
        .in('id_pedido', nums)
        .range(0, 50);
      if (!data?.length) { preview.innerHTML = '<span style="color:var(--red)">Nenhum pedido encontrado</span>'; return; }
      const countPedidos = new Set(data.map(d => d.id_pedido)).size;
      preview.innerHTML = `<span style="color:var(--green)">✓ ${countPedidos} pedido${countPedidos>1?'s':''} encontrado${countPedidos>1?'s':''} · ${data.length} produto${data.length>1?'s':''}</span>`;
    } catch(e) {}
  }, 500);
}

async function salvarNovoProcesso() {
  const codigo = document.getElementById('imp-f-codigo')?.value?.trim();
  if (!codigo) { showToast('Informe o código.','error'); return; }
  const fornId   = document.getElementById('imp-f-fornecedor-id')?.value || null;
  const fornNome = document.getElementById('imp-f-fornecedor-nome')?.value ||
                   document.getElementById('imp-f-fornecedor-busca')?.value || null;
  try {
    const { error } = await sb.from('import_processos').insert({
      codigo,
      id_fornecedor:    fornId ? parseInt(fornId) : null,
      nome_fornecedor:  fornNome,
      importadora:      document.getElementById('imp-f-importadora')?.value || null,
      status:           document.getElementById('imp-f-status')?.value || 'PROGRAMADA',
      data_embarque:    document.getElementById('imp-f-embarque')?.value || null,
      data_prev_chegada: document.getElementById('imp-f-chegada')?.value || null,
      valor_total_usd:  parseFloat(document.getElementById('imp-f-usd')?.value) || null,
      status_pgto:      document.getElementById('imp-f-pgto')?.value || 'NAO_PAGO',
      observacoes:      document.getElementById('imp-f-obs')?.value || null,
      criado_por:       window.getUsuario?.()?.nome || 'Comprador',
    });
    if (error) throw error;
    showToast('✅ Processo criado!');
    fecharModalProcesso();
    await loadImportacao();
  } catch(e) { showToast('Erro: '+e.message,'error'); }
}

async function salvarEdicaoProcesso(id) {
  const codigo = document.getElementById('imp-f-codigo')?.value?.trim();
  if (!codigo) { showToast('Informe o código.','error'); return; }
  const fornId   = document.getElementById('imp-f-fornecedor-id')?.value || null;
  const fornNome = document.getElementById('imp-f-fornecedor-nome')?.value ||
                   document.getElementById('imp-f-fornecedor-busca')?.value || null;
  try {
    const { error } = await sb.from('import_processos').update({
      codigo,
      id_fornecedor:    fornId ? parseInt(fornId) : null,
      nome_fornecedor:  fornNome,
      importadora:      document.getElementById('imp-f-importadora')?.value || null,
      status:           document.getElementById('imp-f-status')?.value || 'PROGRAMADA',
      data_embarque:    document.getElementById('imp-f-embarque')?.value || null,
      data_prev_chegada: document.getElementById('imp-f-chegada')?.value || null,
      valor_total_usd:  parseFloat(document.getElementById('imp-f-usd')?.value) || null,
      status_pgto:      document.getElementById('imp-f-pgto')?.value || 'NAO_PAGO',
      observacoes:      document.getElementById('imp-f-obs')?.value || null,
      atualizado_em:    new Date().toISOString(),
    }).eq('id', id);
    if (error) throw error;
    showToast('✅ Processo atualizado!');
    fecharModalProcesso();
    await loadImportacao();
    // Atualizar drawer se estiver aberto
    if (impProcessoAtual?.id === id) {
      impProcessoAtual = impProcessos.find(x => x.id === id);
      if (impProcessoAtual) loadImpTabInfo(impProcessoAtual);
    }
  } catch(e) { showToast('Erro: '+e.message,'error'); }
}

async function excluirProcesso(id) {
  const proc = impProcessos.find(x => x.id === id);
  if (!confirm(`Excluir o processo "${proc?.codigo}"? Esta ação não pode ser desfeita.`)) return;
  try {
    // Remover pedidos e pagamentos vinculados primeiro
    await sb.from('import_pedidos').delete().eq('processo_id', id);
    await sb.from('import_pagamentos').delete().eq('processo_id', id);
    const { error } = await sb.from('import_processos').delete().eq('id', id);
    if (error) throw error;
    showToast('✅ Processo excluído!');
    fecharModalProcesso();
    fecharImpDrawer();
    await loadImportacao();
  } catch(e) { showToast('Erro ao excluir: '+e.message,'error'); }
}

async function atualizarStatusProcesso(id, novoStatus) {
  try {
    await sb.from('import_processos').update({status:novoStatus,atualizado_em:new Date().toISOString()}).eq('id',id);
    await loadImportacao();
    if (impProcessoAtual?.id===id) { impProcessoAtual=impProcessos.find(x=>x.id===id); loadImpTabInfo(impProcessoAtual); }
    showToast('Status atualizado!');
  } catch(e) { showToast('Erro.','error'); }
}

function abrirModalAddPedido(processoId) {
  document.getElementById('modal-processo-title').textContent = 'Vincular Pedido de Compra';
  document.getElementById('modal-processo-body').innerHTML = `
    <div>
      <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">
        Número do Pedido de Compra (ERP)
      </label>
      <div style="display:flex;gap:8px">
        <input id="ped-f-numero" type="text" class="filter-select" style="width:160px;height:36px"
          placeholder="Nº ou código" oninput="buscarPedidoERP(this.value,'${processoId}')" />
        <div id="ped-busca-status" style="flex:1;font-size:12px;color:var(--text-muted);padding:6px 10px;background:var(--surface2);border-radius:6px;display:flex;align-items:center">
          Digite o número do pedido
        </div>
      </div>
      <!-- Lista de seleção quando há duplicatas -->
      <div id="ped-selecao" style="display:none;margin-top:12px"></div>
      <!-- Preview dos produtos -->
      <div id="ped-preview" style="margin-top:12px"></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px;justify-content:flex-end">
      <button class="btn btn-outline" onclick="fecharModalProcesso()">Cancelar</button>
      <button class="btn btn-primary" id="ped-btn-salvar" onclick="salvarPedidoVinculado('${processoId}')" disabled>Vincular Pedido</button>
    </div>`;
  document.getElementById('modal-processo-overlay').style.display = 'flex';
}

let _pedTimer = null;
let _pedidoSelecionado = null;
async function buscarPedidoERP(valor, processoId) {
  const status = document.getElementById('ped-busca-status');
  const selecao = document.getElementById('ped-selecao');
  const preview = document.getElementById('ped-preview');
  const btnSalvar = document.getElementById('ped-btn-salvar');
  _pedidoSelecionado = null;
  if (btnSalvar) btnSalvar.disabled = true;
  if (!valor || valor.trim().length < 1) {
    if (status) status.innerHTML = 'Digite o número do pedido';
    if (selecao) selecao.style.display = 'none';
    if (preview) preview.innerHTML = '';
    return;
  }
  clearTimeout(_pedTimer);
  _pedTimer = setTimeout(async () => {
    if (status) status.innerHTML = '⏳ Buscando...';
    try {
      const valorNum = parseInt(valor.trim());
      const isNumerico = !isNaN(valorNum) && String(valorNum) === valor.trim();
      let query = sb
        .from('vw_fb_pedidos_compra')
        .select('id_pedido,id_produto,nome_produto,referencia,qtd_solicitada,nome_fornecedor,empresa,status_pedido')
        .range(0, 99);
      const { data } = isNumerico
        ? await query.eq('id_pedido', valorNum)
        : await query.ilike('referencia', `%${valor.trim()}%`);

      if (!data?.length) {
        if (status) status.innerHTML = '<span style="color:var(--red)">❌ Pedido não encontrado</span>';
        if (selecao) selecao.style.display = 'none';
        if (preview) preview.innerHTML = '';
        return;
      }

      if (!isNumerico) {
        // Busca por referência: agrupar por numero_pedido para seleção
        const pedidosMap = {};
        data.forEach(d => {
          const k = d.id_pedido;
          if (!pedidosMap[k]) pedidosMap[k] = { numero: k, empresa: d.empresa||'—', fornecedor: d.nome_fornecedor||'—', prods: [] };
          pedidosMap[k].prods.push(d);
        });
        const pedidosLista = Object.values(pedidosMap);
        if (pedidosLista.length === 1) {
          const ped = pedidosLista[0];
          _pedidoSelecionado = { numero: ped.numero, empresa: ped.empresa };
          if (btnSalvar) btnSalvar.disabled = false;
          if (status) status.innerHTML = `<span style="color:var(--green)">✓ Pedido #${ped.numero} · ${ped.empresa}</span>`;
          if (selecao) selecao.style.display = 'none';
          renderPreviewProdutos(ped.prods, preview);
        } else {
          if (status) status.innerHTML = `<span style="color:var(--orange)">⚠️ ${pedidosLista.length} pedidos encontrados — selecione:</span>`;
          selecao.style.display = 'block';
          selecao.innerHTML = pedidosLista.map(ped => `
            <div onclick="selecionarEmpresaPedido('${ped.numero}','${ped.empresa}',${JSON.stringify(ped.prods).replace(/'/g,"\\'")})"
              style="padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:6px;cursor:pointer;background:var(--surface2)"
              onmouseover="this.style.background='var(--blue-pale)'" onmouseout="this.style.background='var(--surface2)'">
              <div style="font-weight:600">#${ped.numero} — ${ped.empresa}</div>
              <div style="font-size:12px;color:var(--text-muted)">${ped.prods.length} produto${ped.prods.length>1?'s':''} · Forn: ${ped.fornecedor}</div>
            </div>`).join('');
          if (preview) preview.innerHTML = '';
        }
        return;
      }

      // Busca numérica: agrupar por empresa (para detectar duplicatas entre empresas)
      const empresas = [...new Set(data.map(d => d.empresa || '—'))];

      if (empresas.length === 1) {
        // Único — selecionar diretamente
        _pedidoSelecionado = { numero: parseInt(valor), empresa: empresas[0] };
        if (btnSalvar) btnSalvar.disabled = false;
        if (status) status.innerHTML = `<span style="color:var(--green)">✓ ${empresas[0]} · ${data.length} produto${data.length>1?'s':''}</span>`;
        if (selecao) selecao.style.display = 'none';
        renderPreviewProdutos(data, preview);
      } else {
        // Duplicatas — mostrar seleção por empresa
        if (status) status.innerHTML = `<span style="color:var(--orange)">⚠️ Pedido existe em ${empresas.length} empresas — selecione:</span>`;
        selecao.style.display = 'block';
        selecao.innerHTML = empresas.map(emp => {
          const prods = data.filter(d => (d.empresa||'—') === emp);
          return `<div onclick="selecionarEmpresaPedido('${valor}','${emp}',${JSON.stringify(prods).replace(/'/g,"\\'")})"
            style="padding:10px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:6px;cursor:pointer;background:var(--surface2)"
            onmouseover="this.style.background='var(--blue-pale)'" onmouseout="this.style.background='var(--surface2)'">
            <div style="font-weight:600">${emp}</div>
            <div style="font-size:12px;color:var(--text-muted)">${prods.length} produto${prods.length>1?'s':''} · Forn: ${prods[0]?.nome_fornecedor||'—'}</div>
          </div>`;
        }).join('');
        if (preview) preview.innerHTML = '';
      }
    } catch(e) {
      if (status) status.innerHTML = '<span style="color:var(--red)">Erro ao buscar</span>';
    }
  }, 500);
}

function selecionarEmpresaPedido(numero, empresa, prods) {
  _pedidoSelecionado = { numero: parseInt(numero), empresa };
  const btnSalvar = document.getElementById('ped-btn-salvar');
  if (btnSalvar) btnSalvar.disabled = false;
  const status = document.getElementById('ped-busca-status');
  if (status) status.innerHTML = `<span style="color:var(--green)">✓ ${empresa} selecionada</span>`;
  // Highlight selecionado
  document.querySelectorAll('#ped-selecao > div').forEach(d => {
    d.style.border = d.textContent.includes(empresa) ? '2px solid var(--blue-mid)' : '1px solid var(--border)';
    d.style.background = d.textContent.includes(empresa) ? 'var(--blue-pale)' : 'var(--surface2)';
  });
  renderPreviewProdutos(prods, document.getElementById('ped-preview'));
}

function renderPreviewProdutos(prods, container) {
  if (!container || !prods?.length) return;
  container.innerHTML = `
    <div style="font-size:12px;font-weight:600;color:var(--text-muted);margin-bottom:6px">PRODUTOS DO PEDIDO</div>
    <div class="table-card"><div style="overflow-x:auto;max-height:220px;overflow-y:auto">
      <table class="data-table">
        <thead><tr><th>Ref.</th><th>Produto</th><th class="right">Qtd</th><th>Fornecedor</th></tr></thead>
        <tbody>${prods.map(r=>`<tr>
          <td class="mono" style="color:var(--text-muted)">${r.referencia||'—'}</td>
          <td style="font-size:12px">${r.nome_produto||'—'}</td>
          <td class="right mono">${r.qtd_solicitada||0}</td>
          <td style="font-size:12px;color:var(--text-secondary)">${r.nome_fornecedor||'—'}</td>
        </tr>`).join('')}</tbody>
      </table>
    </div></div>`;
}

async function salvarPedidoVinculado(processoId) {
  if (!_pedidoSelecionado) return;
  try {
    const { error } = await sb.from('import_pedidos').insert({
      processo_id: processoId,
      numero_pedido: _pedidoSelecionado.numero,
      observacao: _pedidoSelecionado.empresa || null,
    });
    if (error) throw error;
    showToast('✅ Pedido vinculado!');
    fecharModalProcesso();
    await loadImportacao();
    impProcessoAtual = impProcessos.find(x => x.id === processoId);
    loadImpTabPedidos(impProcessoAtual);
  } catch(e) { showToast('Erro: '+e.message,'error'); }
}

async function removerPedidoProcesso(pedidoId) {
  if (!confirm('Remover este pedido?')) return;
  await sb.from('import_pedidos').delete().eq('id',pedidoId);
  const pid=impProcessoAtual?.id;
  await loadImportacao();
  if (pid) { impProcessoAtual=impProcessos.find(x=>x.id===pid); loadImpTabPedidos(impProcessoAtual); }
  showToast('Pedido removido.');
}

function abrirModalAddPagamento(processoId) {
  document.getElementById('modal-processo-title').textContent = 'Novo Pagamento';
  document.getElementById('modal-processo-body').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Tipo *</label>
        <select id="pag-f-tipo" class="filter-select" style="width:100%;height:36px">
          ${Object.entries(IMP_TIPOS_PAG).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
        </select></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Destinatário</label>
        <input id="pag-f-dest" class="filter-select" style="width:100%;height:36px" /></div>

      <!-- CP com lookup automático -->
      <div style="grid-column:1/-1">
        <label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">
          Nº CP (sistema) <span style="font-weight:400;color:var(--text-muted)">— vincula ao financeiro</span>
        </label>
        <div style="display:flex;gap:8px;align-items:center">
          <input id="pag-f-cp" type="text" class="filter-select" style="width:160px;height:36px" placeholder="Ex: 12345"
            oninput="buscarDadosCP(this.value)" />
          <div id="pag-cp-info" style="flex:1;font-size:12px;color:var(--text-muted);padding:6px 10px;background:var(--surface2);border-radius:6px;min-height:36px;display:flex;align-items:center">
            Digite o nº do CP para buscar dados do financeiro
          </div>
        </div>
      </div>

      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Status</label>
        <select id="pag-f-status" class="filter-select" style="width:100%;height:36px">
          <option value="A_PAGAR">⏳ A Pagar</option><option value="PAGO">✓ Pago</option>
        </select></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Vencimento</label>
        <input id="pag-f-venc" type="date" class="filter-select" style="width:100%;height:36px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Data Pagamento</label>
        <input id="pag-f-datapag" type="date" class="filter-select" style="width:100%;height:36px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">
        Valor BRL total do CP</label>
        <input id="pag-f-brl" type="number" step="0.01" class="filter-select" style="width:100%;height:36px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Valor USD</label>
        <input id="pag-f-usd" type="number" step="0.01" class="filter-select" style="width:100%;height:36px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Câmbio R$/US$</label>
        <input id="pag-f-cambio" type="number" step="0.0001" class="filter-select" style="width:100%;height:36px" /></div>
      <div><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">
        Rateado BRL <span style="font-weight:400">(se parcial)</span></label>
        <input id="pag-f-rateado" type="number" step="0.01" class="filter-select" style="width:100%;height:36px" /></div>
      <div style="grid-column:1/-1"><label style="font-size:12px;font-weight:600;color:var(--text-muted);display:block;margin-bottom:4px">Observações</label>
        <input id="pag-f-obs" class="filter-select" style="width:100%;height:36px" /></div>
    </div>
    <div style="display:flex;gap:8px;margin-top:16px;justify-content:flex-end">
      <button class="btn btn-outline" onclick="fecharModalProcesso()">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarPagamento('${processoId}')">Salvar</button>
    </div>`;
  document.getElementById('modal-processo-overlay').style.display = 'flex';
}

let _cpTimer = null;
let _cpSelecionado = null;
async function buscarDadosCP(valor) {
  const info = document.getElementById('pag-cp-info');
  if (!info) return;
  _cpSelecionado = null;
  if (!valor || valor.trim().length < 1) {
    info.innerHTML = 'Digite o nº do CP para buscar dados do financeiro';
    info.style.color = 'var(--text-muted)';
    return;
  }
  clearTimeout(_cpTimer);
  _cpTimer = setTimeout(async () => {
    info.innerHTML = '⏳ Buscando...';
    info.style.color = 'var(--text-muted)';
    try {
      // Tenta buscar por número se for numérico, senão busca por num_doc (código alfanumérico)
      const valorNum = parseInt(valor);
      const isNumerico = !isNaN(valorNum) && String(valorNum) === valor.trim();
      const query = sb
        .from('vw_fin_cp')
        .select('id,num_doc,historico,valor_total,dt_vencimento,dt_baixa,fl_pago,id_contato,chdados')
        .range(0, 19);
      const { data } = isNumerico
        ? await query.eq('chdados', valorNum)
        : await query.ilike('num_doc', `%${valor.trim()}%`);

      if (!data?.length) {
        info.innerHTML = '❌ CP não encontrado';
        info.style.color = 'var(--red)';
        return;
      }

      if (data.length === 1) {
        // Único — preencher automaticamente
        _cpSelecionado = data[0];
        preencherCamposCP(data[0]);
        renderInfoCP(data[0], info);
      } else {
        // Múltiplos — mostrar lista para escolher
        info.style.color = 'var(--text-primary)';
        info.innerHTML = `
          <div style="width:100%">
            <div style="font-size:11px;color:var(--orange);font-weight:600;margin-bottom:6px">
              ⚠️ ${data.length} títulos encontrados — selecione:
            </div>
            ${data.map((d,i) => `
              <div onclick="selecionarCP(${i})" data-cp-idx="${i}"
                style="padding:7px 10px;border:1px solid var(--border);border-radius:6px;margin-bottom:4px;cursor:pointer;background:var(--surface);font-size:12px"
                onmouseover="this.style.background='var(--blue-pale)'" onmouseout="this.style.background='var(--surface)'">
                <div style="display:flex;justify-content:space-between">
                  <span style="font-weight:600">${d.num_doc||'—'}</span>
                  <span style="color:${d.fl_pago?'var(--green)':'var(--orange)'};font-weight:600">${d.fl_pago?'✓ Pago':'⏳ A Pagar'}</span>
                </div>
                <div style="color:var(--text-muted)">${d.historico||'—'} · ${d.dt_vencimento?fmtData(d.dt_vencimento):'—'} · ${fmt(d.valor_total)}</div>
              </div>`).join('')}
          </div>`;
        // Guardar dados para acesso pelo índice
        window._cpListaTemp = data;
      }
    } catch(e) {
      info.innerHTML = '❌ Erro ao buscar CP';
      info.style.color = 'var(--red)';
    }
  }, 600);
}

function selecionarCP(idx) {
  const d = window._cpListaTemp?.[idx];
  if (!d) return;
  _cpSelecionado = d;
  preencherCamposCP(d);
  const info = document.getElementById('pag-cp-info');
  if (info) renderInfoCP(d, info);
  // Highlight selecionado
  document.querySelectorAll('[data-cp-idx]').forEach(el => {
    el.style.background = el.dataset.cpIdx === String(idx) ? 'var(--blue-pale)' : 'var(--surface)';
    el.style.border = el.dataset.cpIdx === String(idx) ? '2px solid var(--blue-mid)' : '1px solid var(--border)';
  });
}

function preencherCamposCP(d) {
  const venc  = document.getElementById('pag-f-venc');
  const brl   = document.getElementById('pag-f-brl');
  const sts   = document.getElementById('pag-f-status');
  const dest  = document.getElementById('pag-f-dest');
  const dtpag = document.getElementById('pag-f-datapag');
  if (venc  && d.dt_vencimento) venc.value  = d.dt_vencimento.slice(0,10);
  if (brl   && d.valor_total)   brl.value   = d.valor_total;
  if (sts   && d.fl_pago != null) sts.value = d.fl_pago ? 'PAGO' : 'A_PAGAR';
  if (dest  && !dest.value && d.historico) dest.value = d.historico.slice(0,60);
  if (dtpag && d.dt_baixa) dtpag.value = d.dt_baixa.slice(0,10);
}

function renderInfoCP(d, el) {
  el.style.color = 'var(--text-primary)';
  el.innerHTML = `
    <div style="display:flex;gap:16px;align-items:center;width:100%;flex-wrap:wrap">
      <div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Doc</div>
        <div style="font-weight:600">${d.num_doc||'—'}</div></div>
      <div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Histórico</div>
        <div style="font-weight:500;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.historico||'—'}</div></div>
      <div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Valor</div>
        <div style="font-weight:700">${fmt(d.valor_total)}</div></div>
      <div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase">Vencimento</div>
        <div>${d.dt_vencimento?fmtData(d.dt_vencimento):'—'}</div></div>
      <div><span style="color:${d.fl_pago?'var(--green)':'var(--orange)'};font-weight:600">${d.fl_pago?'✓ Pago':'⏳ A Pagar'}</span></div>
    </div>`;
}

async function salvarPagamento(processoId) {
  try {
    const {error} = await sb.from('import_pagamentos').insert({
      processo_id:processoId,
      tipo:document.getElementById('pag-f-tipo')?.value,
      destinatario:document.getElementById('pag-f-dest')?.value||null,
      numero_cp:document.getElementById('pag-f-cp')?.value?.trim()||null,
      status:document.getElementById('pag-f-status')?.value,
      data_vencimento:document.getElementById('pag-f-venc')?.value||null,
      data_pagamento:document.getElementById('pag-f-datapag')?.value||null,
      valor_brl:parseFloat(document.getElementById('pag-f-brl')?.value)||null,
      valor_usd:parseFloat(document.getElementById('pag-f-usd')?.value)||null,
      cambio:parseFloat(document.getElementById('pag-f-cambio')?.value)||null,
      valor_rateado_brl:parseFloat(document.getElementById('pag-f-rateado')?.value)||null,
      observacoes:document.getElementById('pag-f-obs')?.value||null,
    });
    if (error) throw error;
    showToast('✅ Pagamento salvo!');
    fecharModalProcesso();
    await loadImportacao();
    if (impProcessoAtual?.id===processoId) { impProcessoAtual=impProcessos.find(x=>x.id===processoId); loadImpTabPagamentos(impProcessoAtual); }
  } catch(e) { showToast('Erro: '+e.message,'error'); }
}

async function removerPagamento(pagId) {
  if (!confirm('Remover este pagamento?')) return;
  await sb.from('import_pagamentos').delete().eq('id',pagId);
  const pid=impProcessoAtual?.id;
  await loadImportacao();
  if (pid) { impProcessoAtual=impProcessos.find(x=>x.id===pid); loadImpTabPagamentos(impProcessoAtual); }
  showToast('Pagamento removido.');
}

// ══════════════════════════════════════════
// CHAT IA
// ══════════════════════════════════════════
let chatHistorico = [];
let ultimaRespostaIA = '';
let ultimaPergunta = '';
let itensSugeridosIA = [];
let fornecedorSugerido = '';

function abrirChat() {
  if (!document.getElementById('chat-panel')) {
    const tmp = document.createElement('div');
    tmp.innerHTML = PAGINAS_HTML['cmp-chat'];
    while (tmp.firstChild) document.body.appendChild(tmp.firstChild);
  }
  document.getElementById('chat-panel')?.classList.add('open');
  document.getElementById('chat-overlay')?.classList.add('open');
  setTimeout(() => document.getElementById('chat-input')?.focus(), 300);
}

function fecharChat() {
  document.getElementById('chat-panel')?.classList.remove('open');
  document.getElementById('chat-overlay')?.classList.remove('open');
}

function enviarSugestao(btn) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = btn.textContent.replace(/^[\p{Emoji}\s]+/u, '').trim();
    enviarChat();
  }
}

function adicionarMensagem(texto, tipo) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return null;
  const div = document.createElement('div');
  div.className = `chat-msg ${tipo}`;
  div.innerHTML = texto;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function montarContexto() {
  const rupturas = alertasConsolidado.filter(r => r.situacao_estoque === 'RUPTURA');
  const criticos = alertasConsolidado.filter(r => r.situacao_estoque === 'CRITICO');
  const baixos   = alertasConsolidado.filter(r => r.situacao_estoque === 'BAIXO');
  const rupturasA = rupturas.filter(r => r.curva_abc_qtd === 'A');
  const criticosA = criticos.filter(r => r.curva_abc_qtd === 'A');

  const urgentes = [...rupturas, ...criticos, ...baixos]
    .sort((a,b) => {
      const prio = {RUPTURA:1,CRITICO:2,BAIXO:3};
      const abc  = {A:1,B:2,C:3};
      if (prio[a.situacao_estoque] !== prio[b.situacao_estoque]) return prio[a.situacao_estoque]-prio[b.situacao_estoque];
      return (abc[a.curva_abc_qtd]||4)-(abc[b.curva_abc_qtd]||4);
    })
    .slice(0,20)
    .map(r => {
      const fornProd = (fornProdMap[r.id_produto]||[])[0];
      return `- ${r.nome} (Ref:${r.referencia}) | ${r.situacao_estoque} | ABC:${r.curva_abc_qtd||'—'} | Estoque:${r.estoque_total} | Cobertura:${r.cobertura_dias?Math.round(r.cobertura_dias)+'d':'∞'} | Consumo:${r.consumo_diario_total?r.consumo_diario_total.toFixed(2):0}/dia | Sugerido:${Math.round(r.qtd_sugerida||0)} | Fornec.:${fornProd?.nome_fornecedor||'—'}`;
    });

  const fornAlerta = {};
  [...rupturas,...criticos,...baixos].forEach(r => {
    (fornProdMap[r.id_produto]||[]).forEach(f => {
      fornAlerta[f.id_fornecedor] = { nome: f.nome_fornecedor, qtd: (fornAlerta[f.id_fornecedor]?.qtd||0)+1 };
    });
  });
  const topForn = Object.values(fornAlerta).sort((a,b)=>b.qtd-a.qtd).slice(0,10);

  return `Você é o assistente de compras da Bononi Acessórios, empresa do setor de acessórios automotivos.

SITUAÇÃO ATUAL DO ESTOQUE (dados em tempo real):
- Total de produtos: ${alertasConsolidado.length}
- Em RUPTURA: ${rupturas.length} (${rupturasA.length} curva A)
- CRÍTICO (<15 dias): ${criticos.length} (${criticosA.length} curva A)
- BAIXO (<30 dias): ${baixos.length}

TOP 20 PRODUTOS MAIS URGENTES:
${urgentes.join('\n')}

FORNECEDORES COM MAIS PRODUTOS EM ALERTA:
${topForn.map(f=>`- ${f.nome}: ${f.qtd} produtos em alerta`).join('\n')}

INSTRUÇÕES:
- Responda em português brasileiro, de forma direta e objetiva
- Use emojis para facilitar leitura (✅ ⚠️ 🔴 📦 etc)
- Quando sugerir pedidos, liste produto, quantidade sugerida e fornecedor
- Se perguntarem sobre um fornecedor específico, filtre os produtos dele
- Seja prático — o comprador precisa de ação, não de análise longa
- Valores monetários em R$ com separador de milhar`;
}

async function enviarChat() {
  const input = document.getElementById('chat-input');
  const texto = input?.value?.trim();
  if (!texto) return;

  const btn = document.getElementById('chat-send');
  if (input) { input.value = ''; input.style.height = 'auto'; }
  if (btn) btn.disabled = true;

  const sugg = document.getElementById('chat-suggestions');
  if (sugg) sugg.style.display = 'none';

  adicionarMensagem(texto, 'user');
  const loadingMsg = adicionarMensagem('✦ Analisando dados...', 'loading');
  chatHistorico.push({ role: 'user', content: texto });

  try {
    const response = await fetch(
      'https://vishxwdxqiygbxmtpfoy.supabase.co/functions/v1/chat-compras',
      { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ pergunta: texto }) }
    );
    const data = await response.json();
    console.log('RETORNO IA:', data);
    const resposta = data?.resposta || data?.content?.[0]?.text || JSON.stringify(data).substring(0,500);

    loadingMsg?.remove();
    const formatado = resposta.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
    adicionarMensagem(formatado, 'ai');
    chatHistorico.push({ role:'assistant', content: resposta });
    if (chatHistorico.length > 20) chatHistorico = chatHistorico.slice(-20);

    ultimaRespostaIA = resposta;
    ultimaPergunta = texto;
    const keywords = ['pedido','suger','comprar','repor','rupt','crít','quantidade','unidade'];
    if (keywords.some(k => resposta.toLowerCase().includes(k))) {
      const parsed = parsearRespostaIA(resposta, texto);
      itensSugeridosIA = parsed.itens;
      fornecedorSugerido = parsed.fornecedor;
      const saveBar = document.getElementById('chat-save-bar');
      if (saveBar) saveBar.style.display = 'flex';
    }
  } catch(e) {
    loadingMsg?.remove();
    adicionarMensagem('Erro ao conectar com a IA. Tente novamente.', 'loading');
    chatHistorico.pop();
  }

  if (btn) btn.disabled = false;
  document.getElementById('chat-input')?.focus();
}

function parsearRespostaIA(resposta, pergunta) {
  const itens = [];
  let fornecedor = '';
  const m = pergunta.match(/(?:para|do|da|fornecedor[:\s]+)\s+([A-ZÁÉÍÓÚÀÃÕÇÂÊÔ][A-Za-zÁÉÍÓÚÀÃÕÇÂÊÔáéíóúàãõçâêô\s&.,-]+?)(?:\s*[,.]|$)/i);
  if (m) fornecedor = m[1].trim();
  const upper = resposta.toUpperCase();
  alertasConsolidado.forEach(prod => {
    const ref  = (prod.referencia||'').toUpperCase();
    const nome = (prod.nome||'').toUpperCase();
    if ((ref && upper.includes(ref)) || (nome.length>6 && upper.includes(nome.substring(0,Math.min(nome.length,20))))) {
      let qtd = prod.qtd_sugerida || 0;
      const rg = new RegExp(`${ref}[^\\n]*(\\d+)\\s*(?:un|pç|peças?|unid)?`,'i');
      const mq = resposta.match(rg);
      if (mq) qtd = parseInt(mq[1]);
      const fp = (fornProdMap[prod.id_produto]||[])[0];
      itens.push({ id_produto:prod.id_produto, nome:prod.nome, referencia:prod.referencia, situacao:prod.situacao_estoque, abc:prod.curva_abc_qtd, estoque:prod.estoque_total, cobertura:prod.cobertura_dias, qtd_sugerida:Math.round(qtd), preco_unitario:prod.preco_compra||0, id_fornecedor:fp?.id_fornecedor||null, fornecedor:fp?.nome_fornecedor||fornecedor||'' });
      if (!fornecedor && fp) fornecedor = fp.nome_fornecedor;
    }
  });
  return { itens, fornecedor };
}

function showToast(msg, tipo='success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.background = tipo==='error' ? 'var(--red)' : '#1A3A8F';
  t.style.display = 'block';
  setTimeout(()=>{ t.style.display='none'; }, 4000);
}

async function salvarSugestaoCompraIA() {
  if (!ultimaRespostaIA) { showToast('Nenhuma resposta da IA para salvar.','error'); return; }
  try {
    const body = {
      fornecedor: fornecedorSugerido || 'Não identificado',
      pergunta: ultimaPergunta,
      resposta_ia: ultimaRespostaIA,
      usuario: 'Comprador',
      itens: itensSugeridosIA.map(i => ({
        id_produto:i.id_produto, id_fornecedor:i.id_fornecedor,
        produto_nome:i.nome, referencia:i.referencia, fornecedor_nome:i.fornecedor,
        situacao_estoque:i.situacao, curva_abc:i.abc, estoque_atual:i.estoque,
        cobertura_dias:i.cobertura, qtd_sugerida_ia:i.qtd_sugerida, qtd_confirmada:i.qtd_sugerida,
        preco_unitario:i.preco_unitario, valor_total_estimado:(i.qtd_sugerida||0)*(i.preco_unitario||0),
      }))
    };
    const r = await fetch('https://vishxwdxqiygbxmtpfoy.supabase.co/functions/v1/salvar-sugestao-compra-ia',
      { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    const data = await r.json();
    if (data.sucesso || data.numero_sugestao || data.id) {
      showToast(`✅ Sugestão ${data.numero_sugestao||''} salva!`);
      const sb2 = document.getElementById('chat-save-bar');
      if (sb2) sb2.style.display = 'none';
    } else {
      showToast('Erro: '+(data.erro||JSON.stringify(data)),'error');
    }
  } catch(e) { showToast('Erro de conexão.','error'); }
}

async function abrirHistoricoSugestoes() {
  const overlay = document.getElementById('modal-historico-overlay');
  if (!overlay) return;
  overlay.style.display = 'flex';
  const body = document.getElementById('historico-sugestoes-body');
  body.innerHTML = '<div style="text-align:center;padding:32px;color:var(--text-muted)">Carregando...</div>';
  try {
    const { data } = await sb.from('vw_compras_ia_sugestoes_resumo').select('*').order('criado_em',{ascending:false}).range(0,49);
    if (!data?.length) { body.innerHTML='<div style="text-align:center;padding:32px;color:var(--text-muted)">Nenhuma sugestão salva ainda</div>'; return; }
    const sBadge = s => {
      const m = {SUGERIDO:['#EEF2FF','#4F46E5','🤖 Sugerido'],EM_ANALISE:['var(--yellow-bg)','var(--yellow)','🔍 Em Análise'],APROVADO:['var(--green-bg)','var(--green)','✅ Aprovado'],REJEITADO:['var(--red-bg)','var(--red)','❌ Rejeitado']};
      const [bg,c,l] = m[s]||['var(--surface2)','var(--text-muted)',s];
      return `<span class="badge" style="background:${bg};color:${c}">${l}</span>`;
    };
    body.innerHTML = `<table class="data-table" style="width:100%"><thead><tr><th>Nº</th><th>Fornecedor</th><th>Status</th><th class="right">Itens</th><th class="right">Valor Est.</th><th>Por</th><th>Data</th></tr></thead><tbody>
      ${data.map(r=>`<tr>
        <td class="mono" style="font-weight:600;color:var(--blue-mid)">${r.numero_sugestao||'—'}</td>
        <td style="font-weight:500">${r.fornecedor_nome||'—'}</td>
        <td>${sBadge(r.status)}</td>
        <td class="right mono">${r.itens_calculado||r.total_itens||0}</td>
        <td class="right mono">${r.valor_calculado?fmt(r.valor_calculado):'—'}</td>
        <td style="font-size:12px;color:var(--text-muted)">${r.criado_por||'—'}</td>
        <td class="mono" style="font-size:12px;color:var(--text-muted)">${r.criado_em?new Date(r.criado_em).toLocaleDateString('pt-BR'):'—'}</td>
      </tr>`).join('')}
    </tbody></table>`;
  } catch(e) { body.innerHTML='<div style="color:var(--red);padding:16px">Erro ao carregar</div>'; }
}

function fecharHistoricoSugestoes() {
  const overlay = document.getElementById('modal-historico-overlay');
  if (overlay) overlay.style.display = 'none';
}

// ══════════════════════════════════════════
// MOBILE
// ══════════════════════════════════════════
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    document.querySelector('.sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('open');
  }
}


// ══════════════════════════════════════════
// INIT
// ══════════════════════════════════════════

let _container = null;
let _paginaAtiva = null;
let _iniciado = false;

const CMP_PAGE_LOADERS = {
  'cmp-alertas':      () => loadAll(),
  'cmp-totais':       () => loadTotais(),
  'cmp-balanco':      () => loadBalanco(),
  'cmp-importacao':   () => loadImportacao(),
  'cmp-fornecedores': () => loadFornecedores(),
};

// ══════════════════════════════════════════
// EXPOR FUNÇÕES GLOBAIS (onclick no HTML)
// ══════════════════════════════════════════
window.onGrupoChange          = onGrupoChange;
window.onFilterChange         = onFilterChange;
window.onSearch               = onSearch;
window.filtrarSituacao        = filtrarSituacao;
window.setOrdemAlertas        = setOrdemAlertas;
window.irPagina               = irPagina;
window.abrirProduto           = abrirProduto;
window.fecharDrawer           = fecharDrawer;
window.switchDrawerTab        = switchDrawerTab;
window.setHistFiltro          = setHistFiltro;
window.toggleFornHist         = toggleFornHist;
window.abrirCarrinho          = abrirCarrinho;
window.toggleCarrinho         = toggleCarrinho;
window.exportarPedido         = exportarPedido;
window.adicionarSelecionados  = adicionarSelecionados;
window.toggleCheckAll         = toggleCheckAll;
window.onRowCheck             = onRowCheck;
window.toggleGrupo            = toggleGrupo;
window.setTotOrdem            = setTotOrdem;
window.setFornOrdem           = setFornOrdem;
window.abrirFornDrawer        = abrirFornDrawer;
window.fecharFornDrawer       = fecharFornDrawer;
window.switchFornTab          = switchFornTab;
window.novasSessao            = novasSessao;
window.setImpView             = setImpView;
window.abrirImpDrawer         = abrirImpDrawer;
window.fecharImpDrawer        = fecharImpDrawer;
window.switchImpTab           = switchImpTab;
window.abrirModalNovoProcesso = abrirModalNovoProcesso;
window.fecharModalProcesso    = fecharModalProcesso;
window.salvarNovoProcesso     = salvarNovoProcesso;
window.salvarEdicaoProcesso   = salvarEdicaoProcesso;
window.excluirProcesso        = excluirProcesso;
window.atualizarStatusProcesso = atualizarStatusProcesso;
window.abrirModalAddPedido    = abrirModalAddPedido;
window.removerPedidoProcesso  = removerPedidoProcesso;
window.abrirModalAddPagamento = abrirModalAddPagamento;
window.salvarPagamento        = salvarPagamento;
window.removerPagamento       = removerPagamento;
window.buscarPedidoERP         = buscarPedidoERP;
window.selecionarEmpresaPedido = selecionarEmpresaPedido;
window.salvarPedidoVinculado   = salvarPedidoVinculado;
window.selecionarCP            = selecionarCP;
window.buscarFornecedorImport  = buscarFornecedorImport;
window.selecionarFornecedorImport = selecionarFornecedorImport;
window.previewPedidosImport    = previewPedidosImport;
window.buscarDadosCP           = buscarDadosCP;
window.abrirChat               = abrirChat;
window.fecharChat             = fecharChat;
window.showToast              = showToast;
window.toggleSidebar          = toggleSidebar;

window.ModuloCompras = {
  showPage(paginaId, container, usuario, filtros) {
    _container = container;
    _paginaAtiva = paginaId;
    if (!_iniciado) {
      const wrapper = document.createElement('div');
      wrapper.id = 'compras-pages';

      // IDs de elementos que devem ir pro body (position:fixed)
      const FIXED_IDS = [
        'chat-overlay','chat-panel','modal-historico-overlay',  // chat
        'drawer-overlay','produto-drawer',                      // drawer alertas
        'cart-panel',                                           // carrinho
        'toast',                                               // toast
      ];

      Object.entries(PAGINAS_HTML).forEach(([pid, html]) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        if (pid === 'cmp-chat') {
          // Chat inteiro vai pro body
          while (tmp.firstChild) document.body.appendChild(tmp.firstChild);
          return;
        }

        // Para as outras páginas: percorrer filhos
        // - o div.page-content vai pro wrapper
        // - elementos fixed (drawer, cart, modal, toast) vão pro body
        Array.from(tmp.children).forEach(child => {
          if (child.id && FIXED_IDS.includes(child.id)) {
            // Só injeta se ainda não existe no DOM
            if (!document.getElementById(child.id)) {
              document.body.appendChild(child);
            }
          } else {
            wrapper.appendChild(child);
          }
        });
      });

      container.innerHTML = '';
      container.appendChild(wrapper);
      _iniciado = true;
    }
    container.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    const target = container.querySelector('#page-' + paginaId);
    if (target) target.classList.add('active');
    const loader = CMP_PAGE_LOADERS[paginaId];
    if (loader) loader();
    window.setLastUpdate?.();
  },
  onFiltroChange({ pagina }) {
    // Filtros são individuais por tela — sem master filter
    // Apenas atualiza a página ativa se mudou
    if (pagina && pagina !== _paginaAtiva) {
      _paginaAtiva = pagina;
      const loader = CMP_PAGE_LOADERS[_paginaAtiva];
      if (loader) loader();
    }
    window.setLastUpdate?.();
  },
  destroy() { _iniciado = false; _container = null; }
};

// DRAWER_DELEGATED_CLICK_PATCH
document.addEventListener('click', function(ev) {
  const tabEl = ev.target.closest('#produto-drawer .drawer-tab');
  if (!tabEl) return;
  const onclick = tabEl.getAttribute('onclick') || '';
  const match = onclick.match(/switchDrawerTab\('([^']+)'/);
  if (!match) return;
  ev.preventDefault();
  ev.stopPropagation();
  switchDrawerTab(match[1], tabEl);
}, true);

// DRAWER_GLOBAL_EXPORTS_PATCH
// Inline onclick handlers need these functions on window scope.
Object.assign(window, {
  abrirProduto,
  fecharDrawer,
  switchDrawerTab,
  setHistFiltro,
  toggleCarrinho,
  adicionarAoCarrinho,
  removerDoCarrinho,
  exportarPedido,
  abrirFornDrawer,
  fecharFornDrawer,
  switchFornTab,
  setImpView,
  abrirImpDrawer,
  fecharImpDrawer,
  switchImpTab,
  abrirModalNovoProcesso,
  fecharModalProcesso,
  novasSessao
});

})();
