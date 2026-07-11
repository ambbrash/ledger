/* ================================================================
   data.js — single source of truth for all finance data
   Swap this file's read/write methods for API calls when ready
   ================================================================ */

const DB_KEY = 'homeledger_v1';

const CATEGORIES = [
  { id: 'credit_cards', label: 'Credit Cards',  color: '#5C8A6E', icon: '💳', isDebt: true },
  { id: 'fast_food',    label: 'Fast Food',      color: '#C4793A', icon: '🍔' },
  { id: 'fuel',         label: 'Fuel',           color: '#7A8FA8', icon: '⛽' },
  { id: 'auction',      label: 'Auction',        color: '#8E7A9E', icon: '🏷️' },
  { id: 'grocery',      label: 'Grocery',        color: '#6A9E6A', icon: '🛒' },
  { id: 'ebt',          label: 'EBT',            color: '#7EA87E', icon: '🟩' },
  { id: 'automotive',   label: 'Automotive',     color: '#8A7A6A', icon: '🚗' },
  { id: 'tools',        label: 'Tools',          color: '#9A8A5A', icon: '🔧' },
  { id: 'farm',         label: 'Farm',           color: '#8A9E6A', icon: '🌱' },
  { id: 'insurance',    label: 'Insurance',      color: '#6A8A9E', icon: '🛡️' },
  { id: 'fees',         label: 'Fees',           color: '#9E7A7A', icon: '📋' },
  { id: 'business',     label: 'Business',       color: '#7A6A9E', icon: '💼' },
  { id: 'bills',        label: 'Bills',          color: '#9E8A5A', icon: '📄' },
  { id: 'interest',     label: 'Interest',       color: '#B5654A', icon: '📈', isDebt: true },
  { id: 'phones',       label: 'Phones',         color: '#5A8A9E', icon: '📱' },
  { id: 'misc',         label: 'Misc',           color: '#8A8A8A', icon: '•' },
];

const INCOME_SOURCES = [
  { id: 'ebay',      label: 'eBay Sales' },
  { id: 'sales',     label: 'General Sales' },
  { id: 'job',       label: 'Job / Paycheck' },
  { id: 'dryout',    label: '4 Dry Out' },
  { id: 'notion',    label: 'Notion by Nature' },
  { id: 'misc',      label: 'Misc Income' },
  { id: 'other',     label: 'Other' },
];

const ACCOUNTS = [
  // pre-seeded with common types; user edits in settings
  { id: 'checking',    label: 'Checking',        type: 'bank' },
  { id: 'huntington',  label: 'Huntington Cash', type: 'bank' },
  { id: 'cc1',         label: 'Credit Card 1',   type: 'credit' },
  { id: 'cc2',         label: 'Credit Card 2',   type: 'credit' },
  { id: 'cc3',         label: 'Credit Card 3',   type: 'credit' },
  { id: 'cc4',         label: 'Credit Card 4',   type: 'credit' },
  { id: 'cc5',         label: 'Credit Card 5',   type: 'credit' },
  { id: 'cc6',         label: 'Credit Card 6',   type: 'credit' },
  { id: 'cc7',         label: 'Credit Card 7',   type: 'credit' },
  { id: 'cc8',         label: 'Credit Card 8',   type: 'credit' },
  { id: 'cc9',         label: 'Credit Card 9',   type: 'credit' },
  { id: 'standby',     label: 'Standby Cash',    type: 'credit' },
];

function uid() {
  return 'x' + Math.random().toString(36).slice(2,9) + Date.now().toString(36);
}

// ── Default state ──────────────────────────────────────────────
function defaultState() {
  return {
    transactions: [],   // { id, date, amount, type:'expense'|'income', category, account, note, receiptB64 }
    income: [],         // { id, date, amount, source, note }
    debts: [            // 10 accounts to pay off
      { id:'d1',  label:'Credit Card 1',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#5C8A6E', dueDay:1  },
      { id:'d2',  label:'Credit Card 2',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#C4793A', dueDay:1  },
      { id:'d3',  label:'Credit Card 3',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#7A8FA8', dueDay:1  },
      { id:'d4',  label:'Credit Card 4',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#8E7A9E', dueDay:1  },
      { id:'d5',  label:'Credit Card 5',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#6A9E6A', dueDay:1  },
      { id:'d6',  label:'Credit Card 6',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#7EA87E', dueDay:1  },
      { id:'d7',  label:'Credit Card 7',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#8A7A6A', dueDay:1  },
      { id:'d8',  label:'Credit Card 8',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#9A8A5A', dueDay:1  },
      { id:'d9',  label:'Credit Card 9',   balance:0, limit:0,    minPayment:0, apr:0,  color:'#6A8A9E', dueDay:1  },
      { id:'d10', label:'Standby Cash',    balance:0, limit:2500, minPayment:0, apr:0,  color:'#9E7A7A', dueDay:1  },
    ],
    recurring: [],      // { id, label, amount, dueDay, category, account, active }
    budgets: {},        // { [category_id]: monthlyBudget }
    accounts: ACCOUNTS.map(a => ({...a})),
    settings: {
      currency: 'USD',
      householdName: 'Our Finances',
    },
  };
}

// ── Read / Write ───────────────────────────────────────────────
function loadData() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    const base = defaultState();
    // merge top-level keys so new fields appear on upgrade
    return { ...base, ...parsed };
  } catch(e) {
    console.error('Failed to load finance data', e);
    return defaultState();
  }
}

function saveData(db) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch(e) {
    console.error('Failed to save finance data', e);
  }
}

// ── Helpers ────────────────────────────────────────────────────
function fmtMoney(n) {
  return '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
}

function fmtMoneyRaw(n) {
  // preserves sign
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits:2, maximumFractionDigits:2 });
}

function todayISO() {
  return new Date().toISOString().slice(0,10);
}

function monthKey(dateStr) {
  return dateStr.slice(0,7); // 'YYYY-MM'
}

function currentMonthKey() {
  return new Date().toISOString().slice(0,7);
}

function monthLabel(key) {
  const [y,m] = key.split('-');
  const d = new Date(+y, +m-1, 1);
  return d.toLocaleDateString('en-US', { month:'long', year:'numeric' });
}

function categoryById(id) {
  return CATEGORIES.find(c => c.id === id) || { id, label: id, color:'#8A8A8A', icon:'•' };
}

function getMonthTransactions(db, mk) {
  return db.transactions.filter(t => monthKey(t.date) === mk);
}

function getMonthIncome(db, mk) {
  return db.income.filter(i => monthKey(i.date) === mk);
}

function spendByCategory(transactions) {
  const map = {};
  transactions.forEach(t => {
    if (t.type === 'expense') {
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
  });
  return map;
}

function totalIncome(incomeList) {
  return incomeList.reduce((s,i) => s + i.amount, 0);
}

function totalExpenses(transactions) {
  return transactions.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
}

// Export / import
function exportData(db) {
  const blob = new Blob([JSON.stringify(db, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `homeledger-backup-${todayISO()}.json`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}
