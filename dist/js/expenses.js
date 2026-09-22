// Lógica de control de gastos de un plan. Todo aquí es puro (no toca el
// DOM) para poder probarlo y reutilizarlo desde app.js sin duplicar cálculos.

export const EXPENSE_CATEGORIES = [
  { id: "comida", label: "Comida", icon: "🥪" },
  { id: "bebidas", label: "Bebidas", icon: "☕" },
  { id: "transporte", label: "Transporte", icon: "🚌" },
  { id: "impresiones", label: "Impresiones", icon: "🖨" },
  { id: "materiales", label: "Materiales académicos", icon: "📚" },
  { id: "bienestar", label: "Bienestar", icon: "☁️" },
  { id: "deporte", label: "Deporte", icon: "🏃" },
  { id: "compras", label: "Compras", icon: "🛍" },
  { id: "otros", label: "Otros", icon: "•" }
];

// Sugerencia de categoría cuando el gasto se registra desde una actividad
// puntual del plan. `null` = esa actividad normalmente no genera gasto.
export const GOAL_EXPENSE_CATEGORY = {
  comer: "comida",
  imprimir: "impresiones",
  entrenar: "deporte",
  bailar: "bienestar",
  socializar: "comida",
  crear: "materiales",
  diligencia: "otros",
  descansar: null,
  meditar: null,
  ayuda: null
};

export function categoryInfo(id) {
  return EXPENSE_CATEGORIES.find(c => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

export function formatCOP(amount) {
  const value = Math.round(Math.abs(amount || 0));
  const grouped = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${amount < 0 ? "-" : ""}$${grouped}`;
}

export function parseCOPInput(text) {
  const digits = String(text || "").replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function createExpense({ amount, concept, category, place, time, note, goalKey }) {
  return {
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    amount: Math.round(amount),
    concept: concept.trim(),
    category,
    place: place.trim(),
    time,
    note: (note || "").trim(),
    goalKey: goalKey || null,
    createdAt: new Date().toISOString()
  };
}

export function validateExpenseInput({ amount, concept, category, place }) {
  if (!amount || Number.isNaN(amount) || amount <= 0) return "Ingresa un valor mayor a cero.";
  if (!concept || !concept.trim()) return "Escribe en qué gastaste el dinero.";
  if (!category) return "Elige una categoría.";
  if (!place || !place.trim()) return "Indica el lugar donde hiciste el gasto.";
  return null;
}

export function totalSpent(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function budgetStatus(budget, expenses) {
  const spent = totalSpent(expenses);
  if (!budget || budget.noLimit || budget.amount == null) {
    return { hasLimit: false, spent, budget: null, available: null, savings: 0, excess: 0, percentUsed: null };
  }
  const available = budget.amount - spent;
  const savings = available >= 0 ? available : 0;
  const excess = available < 0 ? Math.abs(available) : 0;
  const percentUsed = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  return { hasLimit: true, spent, budget: budget.amount, available, savings, excess, percentUsed };
}

export function progressState(percentUsed) {
  if (percentUsed === null) return "sin-limite";
  if (percentUsed > 100) return "rojo";
  if (percentUsed >= 85) return "naranja";
  if (percentUsed >= 60) return "amarillo";
  return "verde";
}

export function progressMessage(status) {
  if (!status.hasLimit) return `Llevas gastado ${formatCOP(status.spent)} en este plan.`;
  if (status.excess > 0) return `Superaste tu presupuesto por ${formatCOP(status.excess)}.`;
  if (status.percentUsed >= 85) return `Estás muy cerca de tu límite: te quedan ${formatCOP(status.available)}.`;
  if (status.percentUsed >= 60) return `Ya utilizaste el ${Math.round(status.percentUsed)}% de tu presupuesto.`;
  return `Vas bien: todavía tienes ${formatCOP(status.available)} disponibles.`;
}

export function categoryBreakdown(expenses) {
  const total = totalSpent(expenses);
  if (!total) return [];
  const byCategory = new Map();
  expenses.forEach(e => byCategory.set(e.category, (byCategory.get(e.category) || 0) + e.amount));
  return [...byCategory.entries()]
    .map(([category, amount]) => ({ category, amount, percent: (amount / total) * 100, info: categoryInfo(category) }))
    .sort((a, b) => b.amount - a.amount);
}

export function realtimeRecommendations(status, expenses) {
  const tips = [];
  const breakdown = categoryBreakdown(expenses);
  if (status.hasLimit && status.excess > 0) {
    tips.push("Ya superaste el valor que planeabas gastar. Puedes continuar registrando movimientos.");
  } else if (status.hasLimit && status.available > 0) {
    tips.push(`Te quedan ${formatCOP(status.available)} para completar tu plan.`);
    if (expenses.length) tips.push(`Si evitas otro gasto de más de ${formatCOP(status.available)}, terminarás dentro de tu presupuesto.`);
  }
  if (breakdown.length) tips.push(`La mayor parte de tus gastos corresponde a ${breakdown[0].info.label.toLowerCase()}.`);
  return tips.slice(0, 3);
}

export function finalSummary(session) {
  const expenses = session.expenses;
  const status = budgetStatus(session.budget, expenses);
  const breakdown = categoryBreakdown(expenses);
  const highest = expenses.reduce((max, e) => (e.amount > (max?.amount || 0) ? e : max), null);
  const average = expenses.length ? totalSpent(expenses) / expenses.length : 0;
  let recommendation;
  if (!expenses.length) recommendation = "No registraste gastos durante este plan.";
  else if (status.hasLimit && status.excess > 0) recommendation = `Superaste tu presupuesto por ${formatCOP(status.excess)}. Tu resumen queda guardado igual.`;
  else if (status.hasLimit && status.savings > 0) recommendation = "Completaste tus actividades gastando menos de lo planeado.";
  else recommendation = `La mayor parte de tus gastos corresponde a ${breakdown[0]?.info.label.toLowerCase() || "varias categorías"}.`;
  return {
    budget: status.hasLimit ? status.budget : null,
    hasLimit: status.hasLimit,
    totalSpent: status.spent,
    savings: status.hasLimit ? status.savings : null,
    excess: status.hasLimit ? status.excess : null,
    count: expenses.length,
    topCategory: breakdown[0]?.info.label || null,
    highestExpense: highest,
    average,
    breakdown,
    recommendation
  };
}
