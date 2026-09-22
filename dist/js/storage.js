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

/* ---------------------------------------------------------------------- */
/* Sesión de plan activo (recorrido + gastos)                              */
/*                                                                          */
/* Solo existe una sesión "actual" a la vez. Guarda los datos de entrada   */
/* del plan (para poder reconstruirlo con exactitud tras recargar la       */
/* página) junto con su presupuesto y su lista de gastos, que nunca se     */
/* mezclan con los de otro plan porque viven bajo el mismo `id`.           */
/* ---------------------------------------------------------------------- */
const SESSION_KEY = "entre-clase:plan-session";

export function saveSession(session) {
  try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); } catch { /* almacenamiento no disponible */ }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch { /* no-op */ }
}

export function createSessionId() {
  return `plan_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}
