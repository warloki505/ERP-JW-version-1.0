/* =====================================================
   ERP DASHBOARD FINANCEIRO — VERSÃO COMPLETA
   Funcionalidades: CRUD completo, navegação de meses,
   validações, toast notifications, modal de edição
   ===================================================== */

// ===============================
// CONSTANTES E CONFIGURAÇÃO
// ===============================
const USER_KEY = "gf_erp_user";
const LOGGED_KEY = "gf_erp_logged";

// ===============================
// GUARDA DE LOGIN
// ===============================
if (localStorage.getItem(LOGGED_KEY) !== "true") {
  window.location.href = "index.html";
}

// ===============================
// CONTROLE DE MÊS ATIVO
// ===============================
let activeMonth = getMonthId(new Date());

function getMonthId(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function getMonthLabel(monthId) {
  const [year, month] = monthId.split('-');
  const date = new Date(year, month - 1);
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

function getTxKey() {
  return `gf_erp_tx_${activeMonth}`;
}

// ===============================
// LISTAS DE CATEGORIAS E BANCOS
// ===============================

// POUPANÇA
const POUPANCA_CATEGORIAS = [
  "Reserva",
  "Investimento",
  "Aplicação"
];

const POUPANCA_BANCOS = [
  "Itaú",
  "Mercado Pago",
  "Nubank",
  "Clear"
];

// RECEITA
const RECEITA_CATEGORIAS = [
  "Salário",
  "Renda Extra",
  "Reembolso",
  "Rendimentos",
  "Serviços"
];

const RECEITA_BANCOS = [
  "Cartão",
  "Itaú",
  "Mercado Pago",
  "Nubank",
  "Clear"
];

// DESPESAS
const DESPESAS_ESSENCIAIS = [
  "ALIMENTAÇÃO ESSENCIAL",
  "ASSINATURAS ESSENCIAIS",
  "BEM-ESTAR ESSENCIAL",
  "COMUNICAÇÃO",
  "CUIDADO PESSOAL",
  "EDUCAÇÃO",
  "IMPOSTOS E TRIBUTOS",
  "SAÚDE",
  "TRANSPORTE",
  "MORADIA E SERVIÇOS ESSENCIAIS"
];

const DESPESAS_LIVRES = [
  "LAZER E ENTRETENIMENTO",
  "ALIMENTAÇÃO FORA",
  "VESTUÁRIO",
  "VIAGENS E PASSEIOS",
  "MIMOS E EXTRAS"
];

const DESPESA_BANCOS = [
  "Cartão",
  "Itaú",
  "Mercado Pago",
  "Nubank",
  "Clear"
];

// ===============================
// HELPERS GERAIS
// ===============================
const $ = (id) => document.getElementById(id);

function brl(v) {
  return (Number(v) || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function setOptions(select, list) {
  select.innerHTML = `<option value="">Selecione</option>`;
  list.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
}

// ===============================
// TOAST NOTIFICATIONS
// ===============================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===============================
// ELEMENTOS DOM
// ===============================
const kpiRenda = $("kpiRenda");
const kpiPoupanca = $("kpiPoupanca");
const kpiEssenciais = $("kpiEssenciais");
const kpiLivres = $("kpiLivres");
const kpiSaldo = $("kpiSaldoDistribuir");
const tbody = $("txTbody");

const formPoupanca = $("formPoupanca");
const formReceita = $("formReceita");
const formDespesa = $("formDespesa");

const despesaSubtipo = $("despesaSubtipo");
const despesaCategoria = $("despesaCategoria");

const logoutBtn = $("logoutBtn");
const btnPerfil = $("btnPerfil");
const btnHistorico = $("btnHistorico");
const btnLimparMes = $("btnLimparMes");

const monthLabel = $("monthLabel");
const btnPrevMonth = $("btnPrevMonth");
const btnCurrentMonth = $("btnCurrentMonth");
const btnNextMonth = $("btnNextMonth");

// Verificar se elementos críticos existem
if (!formReceita || !formPoupanca || !formDespesa) {
  console.error('ERRO: Elementos do formulário não encontrados! Verifique os IDs no HTML.');
}

// ===============================
// CATEGORIA DINÂMICA (DESPESA)
// ===============================
// Será inicializado no DOMContentLoaded

// ===============================
// PERSISTÊNCIA DE DADOS
// ===============================
function loadTx() {
  const key = getTxKey();
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveTx(list) {
  const key = getTxKey();
  localStorage.setItem(key, JSON.stringify(list));
}

let tx = loadTx();

// ===============================
// CÁLCULO DE RESUMO
// ===============================
function calcularResumo(list) {
  let renda = 0;
  let poupanca = 0;
  let essenciais = 0;
  let livres = 0;

  list.forEach((t) => {
    const v = Number(t.valor) || 0;

    if (t.tipo === "receita") renda += v;
    if (t.tipo === "poupanca") poupanca += v;
    if (t.tipo === "despesa" && t.subtipo === "essencial") essenciais += v;
    if (t.tipo === "despesa" && t.subtipo === "livre") livres += v;
  });

  return {
    renda,
    poupanca,
    essenciais,
    livres,
    saldo: renda - poupanca - essenciais - livres
  };
}

// ===============================
// RENDERIZAÇÃO
// ===============================
function render() {
  // Atualizar label do mês
  monthLabel.textContent = getMonthLabel(activeMonth);
  
  // Calcular resumo
  const r = calcularResumo(tx);

  // Atualizar KPIs
  kpiRenda.textContent = brl(r.renda);
  kpiPoupanca.textContent = brl(r.poupanca);
  kpiEssenciais.textContent = brl(r.essenciais);
  kpiLivres.textContent = brl(r.livres);
  kpiSaldo.textContent = brl(r.saldo);

  // Aplicar cor ao saldo
  if (r.saldo < 0) {
    kpiSaldo.style.color = '#ef4444';
  } else if (r.saldo > 0) {
    kpiSaldo.style.color = '#10b981';
  } else {
    kpiSaldo.style.color = '';
  }

  // Renderizar tabela
  tbody.innerHTML = "";

  if (tx.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 40px;">
          <span class="text-muted">Nenhum lançamento neste mês</span>
        </td>
      </tr>
    `;
    return;
  }

  // Ordenar por data (mais recente primeiro)
  tx
    .slice()
    .sort((a, b) => b.data.localeCompare(a.data))
    .forEach((t) => {
      const tr = document.createElement("tr");
      
      // Badge de tipo
      let badgeClass = 'badge-receita';
      let badgeText = 'RECEITA';
      
      if (t.tipo === 'poupanca') {
        badgeClass = 'badge-poupanca';
        badgeText = 'POUPANÇA';
      } else if (t.tipo === 'despesa') {
        badgeClass = 'badge-despesa';
        badgeText = t.subtipo === 'essencial' ? 'DESP. ESSENCIAL' : 'DESP. LIVRE';
      }
      
      tr.innerHTML = `
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
        <td>${new Date(t.data + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
        <td style="font-weight: 600;">${brl(t.valor)}</td>
        <td>${t.categoria}</td>
        <td>${t.banco}</td>
        <td class="text-muted">${t.descricao || '-'}</td>
        <td class="td-actions">
          <button class="btn-mini btn-edit" data-id="${t.id}">✏️ Editar</button>
          <button class="btn-mini btn-del" data-id="${t.id}">🗑️</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
}

// ===============================
// ADICIONAR LANÇAMENTO
// ===============================
function addTx(data) {
  tx.push({ id: uid(), ...data });
  saveTx(tx);
  render();
}

// ===============================
// VALIDAÇÃO DE VALOR
// ===============================
function validarValor(valor, tipo) {
  const v = parseFloat(valor);
  
  if (isNaN(v) || v <= 0) {
    showToast("Valor deve ser maior que zero!", "error");
    return false;
  }
  
  return true;
}

// ===============================
// HANDLERS DE FORMULÁRIO
// ===============================

// POUPANÇA
formPoupanca.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  
  if (!validarValor(f.valor.value, 'poupanca')) return;

  addTx({
    tipo: "poupanca",
    data: f.data.value,
    valor: f.valor.value,
    categoria: f.categoria.value,
    banco: f.banco.value,
    descricao: $('poupancaDescricao').value.trim()
  });

  f.reset();
  setOptions($("poupancaCategoria"), POUPANCA_CATEGORIAS);
  setOptions($("poupancaBanco"), POUPANCA_BANCOS);
  
  showToast("✓ Poupança adicionada com sucesso!", "success");
});

// RECEITA
formReceita.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  
  if (!validarValor(f.valor.value, 'receita')) return;

  addTx({
    tipo: "receita",
    data: f.data.value,
    valor: f.valor.value,
    categoria: f.categoria.value,
    banco: f.banco.value,
    descricao: $('receitaDescricao').value.trim()
  });

  f.reset();
  setOptions($("receitaCategoria"), RECEITA_CATEGORIAS);
  setOptions($("receitaBanco"), RECEITA_BANCOS);
  
  showToast("✓ Receita adicionada com sucesso!", "success");
});

// DESPESA
formDespesa.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  
  if (!validarValor(f.valor.value, 'despesa')) return;

  addTx({
    tipo: "despesa",
    subtipo: despesaSubtipo.value,
    data: f.data.value,
    valor: f.valor.value,
    categoria: despesaCategoria.value,
    banco: $('despesaBanco').value,
    descricao: $('despesaDescricao').value.trim()
  });

  f.reset();
  despesaSubtipo.value = '';
  despesaCategoria.innerHTML = `<option value="">Selecione tipo primeiro</option>`;
  setOptions($("despesaBanco"), DESPESA_BANCOS);
  
  showToast("✓ Despesa adicionada com sucesso!", "success");
});

// ===============================
// EDITAR LANÇAMENTO
// ===============================
let editingId = null;

function openEditModal(id) {
  const item = tx.find(t => t.id === id);
  if (!item) return;
  
  editingId = id;
  
  // Preencher campos
  $('editId').value = id;
  $('editData').value = item.data;
  $('editValor').value = item.valor;
  $('editDescricao').value = item.descricao || '';
  
  // Preencher categorias baseado no tipo
  if (item.tipo === 'receita') {
    setOptions($('editCategoria'), RECEITA_CATEGORIAS);
    setOptions($('editBanco'), RECEITA_BANCOS);
  } else if (item.tipo === 'poupanca') {
    setOptions($('editCategoria'), POUPANCA_CATEGORIAS);
    setOptions($('editBanco'), POUPANCA_BANCOS);
  } else if (item.tipo === 'despesa') {
    if (item.subtipo === 'essencial') {
      setOptions($('editCategoria'), DESPESAS_ESSENCIAIS);
    } else {
      setOptions($('editCategoria'), DESPESAS_LIVRES);
    }
    setOptions($('editBanco'), DESPESA_BANCOS);
  }
  
  $('editCategoria').value = item.categoria;
  $('editBanco').value = item.banco;
  
  // Mostrar modal
  $('modalEdit').style.display = 'flex';
  $('modalEdit').classList.remove('hidden');
}

function closeEditModal() {
  $('modalEdit').style.display = 'none';
  $('modalEdit').classList.add('hidden');
  editingId = null;
}

function saveEdit() {
  if (!editingId) return;
  
  const item = tx.find(t => t.id === editingId);
  if (!item) return;
  
  const valor = $('editValor').value;
  if (!validarValor(valor, item.tipo)) return;
  
  // Atualizar item
  item.data = $('editData').value;
  item.valor = valor;
  item.categoria = $('editCategoria').value;
  item.banco = $('editBanco').value;
  item.descricao = $('editDescricao').value.trim();
  
  saveTx(tx);
  render();
  closeEditModal();
  
  showToast("✓ Lançamento atualizado!", "success");
}

// ===============================
// REMOVER LANÇAMENTO
// ===============================
function deleteTx(id) {
  if (!confirm("⚠️ Confirmar exclusão deste lançamento?")) return;
  
  tx = tx.filter((t) => t.id !== id);
  saveTx(tx);
  render();
  
  showToast("✓ Lançamento removido!", "info");
}

// ===============================
// EVENT DELEGATION (TABELA)
// ===============================
tbody.addEventListener("click", (e) => {
  const target = e.target;
  
  if (target.classList.contains("btn-del") || target.closest('.btn-del')) {
    const btn = target.classList.contains("btn-del") ? target : target.closest('.btn-del');
    const id = btn.dataset.id;
    deleteTx(id);
  }
  
  if (target.classList.contains("btn-edit") || target.closest('.btn-edit')) {
    const btn = target.classList.contains("btn-edit") ? target : target.closest('.btn-edit');
    const id = btn.dataset.id;
    openEditModal(id);
  }
});

// ===============================
// NAVEGAÇÃO DE MESES
// ===============================
btnPrevMonth.addEventListener('click', () => {
  const [year, month] = activeMonth.split('-').map(Number);
  const newDate = new Date(year, month - 2); // -2 porque month já está 1-based
  activeMonth = getMonthId(newDate);
  tx = loadTx();
  render();
});

btnNextMonth.addEventListener('click', () => {
  const [year, month] = activeMonth.split('-').map(Number);
  const newDate = new Date(year, month); // month sem ajuste vai para próximo
  activeMonth = getMonthId(newDate);
  tx = loadTx();
  render();
});

btnCurrentMonth.addEventListener('click', () => {
  activeMonth = getMonthId(new Date());
  tx = loadTx();
  render();
});

// ===============================
// LIMPAR MÊS
// ===============================
btnLimparMes.addEventListener('click', () => {
  if (!confirm(`⚠️ ATENÇÃO!\n\nIsso vai apagar TODOS os lançamentos de ${getMonthLabel(activeMonth)}.\n\nEsta ação não pode ser desfeita. Confirmar?`)) {
    return;
  }
  
  tx = [];
  saveTx(tx);
  render();
  
  showToast("✓ Todos os dados do mês foram removidos!", "info");
});

// ===============================
// PERFIL E HISTÓRICO
// ===============================
btnPerfil.addEventListener('click', () => {
  window.location.href = 'perfil.html';
});

btnHistorico.addEventListener('click', () => {
  window.location.href = 'historico.html';
});

// ===============================
// LOGOUT
// ===============================
logoutBtn.addEventListener("click", () => {
  if (confirm("Deseja realmente sair?")) {
    localStorage.setItem(LOGGED_KEY, "false");
    window.location.href = "index.html";
  }
});

// ===============================
// NOME DO USUÁRIO
// ===============================
const userName = $('userName');
const user = JSON.parse(localStorage.getItem(USER_KEY) || 'null');
if (user && user.nome) {
  userName.textContent = `Olá, ${user.nome.split(' ')[0]}`;
}

// ===============================
// DEFINIR DATA PADRÃO (HOJE)
// ===============================
function setDefaultDates() {
  const today = new Date().toISOString().split('T')[0];
  $('receitaData').value = today;
  $('poupancaData').value = today;
  $('despesaData').value = today;
}

// ===============================
// INICIALIZAÇÃO
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // INICIALIZAR SELECTS
  // ===============================
  setOptions($("poupancaCategoria"), POUPANCA_CATEGORIAS);
  setOptions($("poupancaBanco"), POUPANCA_BANCOS);
  setOptions($("receitaCategoria"), RECEITA_CATEGORIAS);
  setOptions($("receitaBanco"), RECEITA_BANCOS);
  setOptions($("despesaBanco"), DESPESA_BANCOS);
  
  despesaCategoria.innerHTML = `<option value="">Selecione tipo primeiro</option>`;
  
  // ===============================
  // CATEGORIA DINÂMICA (DESPESA)
  // ===============================
  despesaSubtipo.addEventListener("change", () => {
    if (despesaSubtipo.value === "essencial") {
      setOptions(despesaCategoria, DESPESAS_ESSENCIAIS);
    } else if (despesaSubtipo.value === "livre") {
      setOptions(despesaCategoria, DESPESAS_LIVRES);
    } else {
      despesaCategoria.innerHTML = `<option value="">Selecione tipo primeiro</option>`;
    }
  });
  
  // ===============================
  // DEFINIR DATAS PADRÃO E RENDERIZAR
  // ===============================
  setDefaultDates();
  render();
  
  // Adicionar animação de entrada aos cards
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.4s ease-out';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 50);
  });
});

// ===============================
// FECHAR MODAL AO CLICAR FORA
// ===============================
$('modalEdit').addEventListener('click', (e) => {
  if (e.target === $('modalEdit')) {
    closeEditModal();
  }
});

// ===============================
// ATALHOS DE TECLADO
// ===============================
document.addEventListener('keydown', (e) => {
  // ESC fecha modal
  if (e.key === 'Escape' && !$('modalEdit').classList.contains('hidden')) {
    closeEditModal();
  }
});
