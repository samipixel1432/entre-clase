// Persistencia local. Todo el acceso a localStorage está protegido con
// try/catch porque puede fallar (modo privado, almacenamiento bloqueado).

const STATE_KEY = "entre-clase:form-state";
const HISTORY_KEY = "entre-clase:recent-plans";
const HISTORY_LIMIT = 5;

export function saveFormState(state) {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch { /* almacenamiento no disponible */ }
}

export function loadFormState() {
  try {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearFormState() {
  try { localStorage.removeItem(STATE_KEY); } catch { /* no-op */ }
}

export function pushRecentPlan(entry) {
  try {
    const list = loadRecentPlans();
    list.unshift(entry);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_LIMIT)));
  } catch { /* almacenamiento no disponible */ }
}

export function loadRecentPlans() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
