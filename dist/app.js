const state = { time: 120, goals: new Set(["comer", "estudiar"]), energy: "media", alternate: false, placeFilter: "todos" };

const campusPlaces = [
  { name: "Edificio A · Tecnoquímicas", short: "Edificio A", category: "academico", icon: "A", text: "Facultad de Negocios: laboratorio financiero y Marketing Zone." },
  { name: "Edificio B", short: "Edificio B", category: "academico", icon: "B", text: "Pregrados, posgrados, departamentos y centros de investigación de Negocios." },
  { name: "Edificio C · Mayagüez", short: "Edificio C", category: "academico", icon: "C", text: "Salas de cómputo, INNLAB, DDB Lab, HUB y espacios de posgrado." },
  { name: "Edificio D", short: "Edificio D", category: "academico", icon: "D", text: "Salones de clase y espacios de conexión académica." },
  { name: "Edificio E", short: "Edificio E", category: "academico", icon: "E", text: "33 salones, auditorio, sala de audiencias y aulas grupales." },
  { name: "Edificio F", short: "Edificio F", category: "academico", icon: "F", text: "Edificio académico con punto de impresión en el primer piso." },
  { name: "Edificio G", short: "Edificio G", category: "academico", icon: "G", text: "Espacios académicos y punto de impresión en el primer piso." },
  { name: "Edificio H · Taller de Diseño", short: "Taller de Diseño", category: "academico", icon: "H", text: "Talleres y espacios para procesos de diseño y creación." },
  { name: "Edificio J", short: "Edificio J", category: "servicio", icon: "J", text: "Planta física, servicios generales, compras y mantenimiento." },
  { name: "Edificio K", short: "Edificio K", category: "servicio", icon: "K", text: "Planeación académica y gestión de reservas de espacios." },
  { name: "Edificio L", short: "Edificio L", category: "academico", icon: "L", text: "Laboratorios de ciencias, salud, química, biología e ingeniería." },
  { name: "Edificio M", short: "Edificio M", category: "academico", icon: "M", text: "Espacios académicos, aulas y punto de impresión." },
  { name: "Edificio N · CADI", short: "Edificio N / CADI", category: "bienestar", icon: "N", text: "Centro Artístico y Deportivo, piscina y actividades de bienestar." },
  { name: "Biblioteca", short: "Biblioteca", category: "academico", icon: "⌁", text: "Lectura, estudio individual y grupal, recursos e impresión." },
  { name: "Cafetería Principal", short: "Cafetería Principal", category: "servicio", icon: "☕", text: "Comidas, bebidas y pausas entre clases." },
  { name: "Bienestar Universitario", short: "Bienestar Universitario", category: "bienestar", icon: "♥", text: "Servicios y acompañamiento para la vida universitaria." },
  { name: "Auditorios", short: "Auditorios", category: "academico", icon: "◉", text: "Charlas, eventos académicos y actividades institucionales." },
  { name: "CIDEIM", short: "CIDEIM", category: "academico", icon: "⌬", text: "Investigación científica y laboratorios especializados." },
  { name: "Bioterio", short: "Bioterio", category: "academico", icon: "◌", text: "Instalación de apoyo para investigación en ciencias de la vida." },
  { name: "Laboratorio de Ingeniería y Planta Piloto", short: "Planta Piloto", category: "academico", icon: "⚙", text: "Prácticas, prototipado y procesos experimentales de ingeniería." },
  { name: "Consultorio Jurídico", short: "Consultorio Jurídico", category: "servicio", icon: "§", text: "Atención y práctica jurídica de la Universidad." },
  { name: "Gimnasio", short: "Gimnasio / CADI", category: "bienestar", icon: "↗", text: "Entrenamiento, actividad física y pausas activas." },
  { name: "Casa Rocha", short: "Casa Rocha", category: "servicio", icon: "⌂", text: "Ubicación institucional identificada en el plano del campus." },
  { name: "Casa Orejuela", short: "Casa Orejuela", category: "servicio", icon: "⌂", text: "Ubicación institucional identificada en el plano del campus." },
  { name: "Casa Malla", short: "Casa Malla", category: "servicio", icon: "⌂", text: "Ubicación institucional identificada en el plano del campus." },
  { name: "Porterías 1, 2 y 4", short: "Portería 1", category: "servicio", icon: "⌖", text: "Entradas, orientación y control de acceso al campus." },
  { name: "Plazoleta y canchas", short: "Plazoleta", category: "bienestar", icon: "◎", text: "Encuentro, descanso, caminata y actividades deportivas al aire libre." },
  { name: "CAMBAS · Salón 101A", short: "CAMBAS 101A", category: "academico", icon: "✦", text: "Apoyo de monitores en matemáticas y estadística." },
  { name: "Sala Boreal", short: "Sala Boreal", category: "bienestar", icon: "☁", text: "Descanso y recuperación de energía entre clases." }
];

function buildGymRoutine(preferences, minutes) {
  const m = minutes || 20;
  if (preferences.energy === "baja") return `Rutina suave (~${m} min): movilidad articular, 2 rondas de 12 sentadillas sin peso, plancha 2x20s y estiramiento final.`;
  if (m <= 15) return `Rutina exprés (${m} min): 3 rondas seguidas de 12 sentadillas + 10 flexiones + 20s de plancha, sin descanso entre ejercicios.`;
  if (m <= 25) return `Rutina media (${m} min): calentamiento 3 min, 3 rondas de 15 sentadillas, 12 flexiones, 15 zancadas por pierna y 30s de plancha, cierra con 3 min de estiramiento.`;
  return `Rutina completa (${m} min): calentamiento 5 min, 4 rondas de 15 sentadillas, 12 flexiones, 20 zancadas por pierna y 40s de plancha, cierra con 5 min de estiramiento.`;
}

function buildDanceRoutine(preferences, minutes) {
  const m = minutes || 20;
  const style = preferences.energy === "alta" ? "reggaetón o salsa" : preferences.energy === "baja" ? "estiramiento con música suave" : "pop comercial";
  return `Baila ${style} durante ${m} min: busca un tutorial corto (“${style} básico para principiantes”) y repite la coreografía 2-3 veces para soltarte.`;
}

function buildMindfulRoutine(preferences, minutes) {
  const m = minutes || 15;
  return `Respira en ciclos de 4-7-8 durante 3 min y usa el resto de los ${m} min para escribir 3 cosas por las que sientes gratitud o simplemente descansar la mente sin el celular.`;
}

const goalCatalog = {
  comer: { icon: "🥪", label: "Comer", minutes: 25, pick: p => p.budget === "cero" ? "Plazoleta" : "Cafetería Principal", action: p => p.budget === "cero" ? "Come lo que llevaste y toma agua." : "Haz una pausa para comer sin afán." },
  estudiar: { icon: "📚", label: "Estudiar", minutes: 35, pick: p => p.ambience === "grupo" ? "Edificio E" : "Biblioteca", action: p => p.ambience === "grupo" ? "Avanza con tu equipo en un aula grupal." : "Trabaja una tarea concreta con foco." },
  descansar: { icon: "☁️", label: "Descansar", minutes: 20, pick: p => p.ambience === "aire-libre" ? "Plazoleta" : "Sala Boreal", action: () => "Baja el ritmo y recupera energía." },
  ayuda: { icon: "✦", label: "Pedir ayuda", minutes: 35, pick: () => "CAMBAS 101A", action: () => "Lleva una duda concreta a los monitores." },
  entrenar: { icon: "↗", label: "Entrenar", minutes: 35, pick: () => "Gimnasio / CADI", action: (p, minutes) => buildGymRoutine(p, minutes) },
  bailar: { icon: "💃", label: "Bailar", minutes: 30, pick: p => p.ambience === "aire-libre" ? "Plazoleta" : "Sala Boreal", action: (p, minutes) => buildDanceRoutine(p, minutes) },
  meditar: { icon: "🧘", label: "Meditar", minutes: 20, pick: () => "Sala Boreal", action: (p, minutes) => buildMindfulRoutine(p, minutes) },
  crear: { icon: "🎨", label: "Crear", minutes: 30, pick: () => "Taller de Diseño", action: () => "Dibuja, escribe o experimenta libremente con lo que tengas a mano." },
  socializar: { icon: "☺", label: "Ver amigos", minutes: 25, pick: p => p.ambience === "aire-libre" ? "Plazoleta" : "Cafetería Principal", action: () => "Conversa y desconéctate un momento." },
  imprimir: { icon: "▤", label: "Imprimir", minutes: 15, pick: p => p.alternate ? "Edificio C" : "Biblioteca", action: () => "Imprime y revisa lo necesario para tu clase." },
  diligencia: { icon: "✓", label: "Hacer una vuelta", minutes: 20, pick: p => p.alternate ? "Edificio K" : "Edificio B", action: () => "Resuelve tu trámite o consulta pendiente." }
};

const allLocationNames = campusPlaces.map(place => place.short);
const locationSelect = document.querySelector("#location");
const nextLocationSelect = document.querySelector("#next-location");

function populateLocations() {
  const options = allLocationNames.map(name => `<option value="${name}">${name}</option>`).join("");
  locationSelect.innerHTML = options;
  nextLocationSelect.innerHTML = options;
  locationSelect.value = "Edificio L";
  nextLocationSelect.value = "Edificio E";
}

function mapsSearchUrl(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, Universidad Icesi, Cali, Colombia`)}`;
}

function renderDirectory() {
  const query = document.querySelector("#place-search").value.trim().toLocaleLowerCase("es");
  const visible = campusPlaces.filter(place => {
    const matchesFilter = state.placeFilter === "todos" || place.category === state.placeFilter;
    return matchesFilter && `${place.name} ${place.text}`.toLocaleLowerCase("es").includes(query);
  });
  const grid = document.querySelector("#place-grid");
  grid.replaceChildren();
  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty-directory";
    empty.textContent = "No encontramos una ubicación con esos filtros.";
    grid.append(empty);
  } else visible.forEach(place => {
    const article = document.createElement("article");
    article.className = "place-card";
    const type = document.createElement("span"); type.className = "place-type"; type.textContent = place.category.toUpperCase();
    const icon = document.createElement("span"); icon.className = "place-icon"; icon.setAttribute("aria-hidden", "true"); icon.textContent = place.icon;
    const title = document.createElement("h3"); title.textContent = place.name;
    const text = document.createElement("p"); text.textContent = place.text;
    const link = document.createElement("a"); link.className = "map-link"; link.href = mapsSearchUrl(place.short); link.target = "_blank"; link.rel = "noreferrer"; link.textContent = "Buscar en Maps ↗";
    article.append(type, icon, title, text, link); grid.append(article);
  });
  document.querySelector("#place-count").textContent = `${visible.length} de ${campusPlaces.length} ubicaciones`;
}

populateLocations();
renderDirectory();
document.querySelector("#place-search").addEventListener("input", renderDirectory);
document.querySelector("#place-filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  state.placeFilter = button.dataset.filter;
  document.querySelectorAll("#place-filters button").forEach(item => item.classList.toggle("active", item === button));
  renderDirectory();
});

const customTimeWrap = document.querySelector("#custom-time-wrap");
const customTimeInput = document.querySelector("#custom-time");

document.querySelectorAll("[data-group]").forEach(group => group.addEventListener("click", event => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;
  group.querySelectorAll("button").forEach(item => item.classList.remove("selected"));
  button.classList.add("selected");
  if (group.dataset.group === "time" && button.dataset.value === "custom") {
    customTimeWrap.hidden = false;
    state.time = Number(customTimeInput.value) || 90;
    customTimeInput.focus();
  } else {
    if (group.dataset.group === "time") customTimeWrap.hidden = true;
    state[group.dataset.group] = group.dataset.group === "time" ? Number(button.dataset.value) : button.dataset.value;
  }
  if (group.dataset.group === "time") updateTimeWindow();
}));

customTimeInput.addEventListener("input", () => {
  const minutes = Math.min(480, Math.max(15, Number(customTimeInput.value) || 15));
  state.time = minutes;
  updateTimeWindow();
});

document.querySelector("[data-multigroup='needs']").addEventListener("click", event => {
  const button = event.target.closest("button[data-value]");
  if (!button) return;
  const value = button.dataset.value;
  if (state.goals.has(value)) {
    if (state.goals.size === 1) return showToast("Elige por lo menos una actividad.");
    state.goals.delete(value);
  } else {
    if (state.goals.size === 4) return showToast("Puedes combinar hasta cuatro actividades.");
    state.goals.add(value);
  }
  const selected = state.goals.has(value);
  button.classList.toggle("selected", selected);
  button.setAttribute("aria-pressed", String(selected));
  updateGoalCount();
});

function updateGoalCount() {
  const count = state.goals.size;
  document.querySelector("#goal-count").textContent = `${count} ${count === 1 ? "seleccionada" : "seleccionadas"}`;
}

function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourLabel = `${hours} ${hours === 1 ? "hora" : "horas"}`;
  return rest ? `${hourLabel} ${rest} min` : hourLabel;
}

function updateTimeWindow() {
  document.querySelector("#clock-end").textContent = `+ ${formatDuration(state.time)}`;
}

function getPreferences() {
  return {
    pace: document.querySelector("#pace").value,
    budget: document.querySelector("#budget").value,
    ambience: document.querySelector("#ambience").value,
    accessible: document.querySelector("#accessible").checked,
    note: document.querySelector("#custom-note").value.trim(),
    energy: state.energy,
    alternate: state.alternate
  };
}

function buildPlan() {
  const preferences = getPreferences();
  const origin = locationSelect.value;
  const destination = nextLocationSelect.value;
  const buffer = preferences.accessible ? 18 : state.time >= 120 ? 15 : 10;
  const transferPerStop = preferences.pace === "tranquilo" ? 6 : 5;
  const maxActivities = state.time <= 30 ? 1 : state.time <= 60 ? 2 : state.time <= 120 ? 3 : 4;
  const chosenGoals = [...state.goals].slice(0, maxActivities);
  const usable = Math.max(15, state.time - buffer - Math.max(0, chosenGoals.length - 1) * transferPerStop);
  const desired = chosenGoals.reduce((sum, key) => sum + goalCatalog[key].minutes, 0);
  const paceFactor = preferences.pace === "intenso" ? 1.08 : preferences.pace === "tranquilo" ? .9 : 1;
  const allocations = chosenGoals.map(key => Math.max(10, Math.round((goalCatalog[key].minutes / desired) * usable * paceFactor / 5) * 5));
  let allocated = allocations.reduce((a, b) => a + b, 0);
  while (allocated > usable) { const index = allocations.indexOf(Math.max(...allocations)); if (allocations[index] <= 10) break; allocations[index] -= 5; allocated -= 5; }
  if (allocated < usable) allocations[0] += usable - allocated;
  const items = [];
  chosenGoals.forEach((key, index) => {
    const goal = goalCatalog[key];
    items.push({ minutes: allocations[index], place: goal.pick(preferences), action: goal.action(preferences, allocations[index]), goal: key });
    if (index < chosenGoals.length - 1) items.push({ minutes: transferPerStop, place: "Traslado", action: "Camina al siguiente punto del plan.", goal: "move" });
  });
  items.push({ minutes: buffer, place: destination, action: preferences.accessible ? "Llega por una ruta accesible y con margen." : "Llega con tiempo a tu siguiente clase.", goal: "return" });
  const activityPlaces = items.filter(item => !["move", "return"].includes(item.goal)).map(item => item.place);
  const omitted = state.goals.size - chosenGoals.length;
  const reason = [`${chosenGoals.length} ${chosenGoals.length === 1 ? "actividad" : "actividades"} organizadas a ritmo ${preferences.pace}.`, preferences.note ? `También tuvimos en cuenta: “${preferences.note}”.` : "", omitted ? `${omitted} actividad quedó para otro hueco por falta de tiempo.` : ""].filter(Boolean).join(" ");
  return { origin, destination, buffer, items, omitted, preferences, name: activityPlaces.join(" + "), reason, icon: goalCatalog[chosenGoals[0]].icon };
}

function renderTimeline(items) {
  const timeline = document.querySelector("#timeline"); timeline.replaceChildren();
  items.forEach(item => {
    const li = document.createElement("li"); const time = document.createElement("time"); time.textContent = `${item.minutes} min`;
    const detail = document.createElement("div"); const strong = document.createElement("strong"); strong.textContent = item.place;
    const paragraph = document.createElement("p"); paragraph.textContent = item.action;
    detail.append(strong, paragraph); li.append(time, detail); timeline.append(li);
  });
}

function updateMaps(plan) {
  const stops = plan.items.filter(item => !["move", "return"].includes(item.goal)).map(item => item.place);
  document.querySelector("#google-map").src = `https://www.google.com/maps?q=${encodeURIComponent(`${stops[0] || plan.destination}, Universidad Icesi, Cali, Colombia`)}&output=embed`;
  const params = new URLSearchParams({ api: "1", origin: `${plan.origin}, Universidad Icesi, Cali, Colombia`, destination: `${plan.destination}, Universidad Icesi, Cali, Colombia`, travelmode: "walking" });
  if (stops.length) params.set("waypoints", stops.map(stop => `${stop}, Universidad Icesi, Cali, Colombia`).join("|"));
  document.querySelector("#google-route").href = `https://www.google.com/maps/dir/?${params}`;
  const directions = [...stops.map((stop, index) => `${index + 1}. Ve desde ${index ? stops[index - 1] : plan.origin} hasta ${stop}.`), `${stops.length + 1}. Termina en ${plan.destination} con ${plan.buffer} minutos de margen.`];
  document.querySelector("#directions").replaceChildren(...directions.map(text => { const p = document.createElement("p"); p.textContent = text; return p; }));
}

function renderPlan(shouldScroll = true) {
  const plan = buildPlan();
  const durationLabel = formatDuration(state.time);
  document.querySelector("#result-title").textContent = `Tu plan personalizado para ${durationLabel}`;
  document.querySelector("#plan-name").textContent = plan.name;
  document.querySelector("#plan-reason").textContent = plan.reason;
  document.querySelector("#summary-icon").textContent = plan.icon;
  document.querySelector("#total-time").textContent = `${state.time} min en total`;
  document.querySelector("#return-buffer").textContent = `Termina en ${plan.destination}`;
  document.querySelector("#map-title").textContent = `${plan.origin} → ${plan.destination}`;
  document.querySelector("#walk-time").textContent = plan.preferences.accessible ? "Ruta accesible" : "Modo caminando";
  document.querySelector("#plan-profile").innerHTML = `<span>${plan.preferences.pace}</span><span>${plan.preferences.budget === "cero" ? "sin gastar" : plan.preferences.budget === "bajo" ? "presupuesto bajo" : "presupuesto flexible"}</span><span>${plan.preferences.ambience.replace("-", " ")}</span>${plan.preferences.accessible ? "<span>ruta accesible</span>" : ""}`;
  renderTimeline(plan.items); updateMaps(plan);
  if (plan.omitted) showToast("Ajustamos el número de actividades al tiempo disponible.");
  if (shouldScroll) document.querySelector("#resultado").scrollIntoView({ behavior: "smooth", block: "start" });
  return { duration_minutes: state.time, origin: plan.origin, destination: plan.destination, goals: [...state.goals], preferences: plan.preferences, plan: plan.items.map(({ minutes, place }) => ({ minutes, place })) };
}

document.querySelector("#planner-form").addEventListener("submit", event => { event.preventDefault(); state.alternate = false; renderPlan(); });
document.querySelector("#alternate-plan").addEventListener("click", () => { state.alternate = !state.alternate; renderPlan(false); showToast(state.alternate ? "Cambiamos algunos lugares del recorrido." : "Volvimos al plan principal."); });
document.querySelector("#route-toggle").addEventListener("click", event => { const directions = document.querySelector("#directions"); directions.hidden = !directions.hidden; event.currentTarget.firstChild.textContent = directions.hidden ? "Ver indicaciones paso a paso " : "Ocultar indicaciones "; });

const guide = document.querySelector("#guide-dialog");
document.querySelector("#open-guide").addEventListener("click", () => guide.showModal());
document.querySelector("#close-guide").addEventListener("click", () => guide.close());
document.querySelector("#start-planning").addEventListener("click", () => { guide.close(); document.querySelector("#planner-form").scrollIntoView({ behavior: "smooth" }); });
document.querySelector("#plan-cambas").addEventListener("click", () => {
  if (!state.goals.has("ayuda") && state.goals.size < 4) state.goals.add("ayuda");
  document.querySelectorAll("[data-multigroup='needs'] button").forEach(button => { const selected = state.goals.has(button.dataset.value); button.classList.toggle("selected", selected); button.setAttribute("aria-pressed", String(selected)); });
  updateGoalCount(); document.querySelector("#planner-form").scrollIntoView({ behavior: "smooth", block: "center" }); showToast("Añadimos CAMBAS a tus objetivos.");
});

function showToast(message) { const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show"); window.clearTimeout(showToast.timeout); showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2800); }

function selectSingle(group, value) {
  const container = document.querySelector(`[data-group="${group}"]`); const button = container?.querySelector(`[data-value="${value}"]`);
  if (!button) throw new Error(`Valor inválido para ${group}`);
  container.querySelectorAll("button").forEach(item => item.classList.toggle("selected", item === button)); state[group] = group === "time" ? Number(value) : value;
}

function selectGoals(goals) {
  if (!Array.isArray(goals) || !goals.length || goals.length > 4 || goals.some(goal => !goalCatalog[goal])) throw new Error("Elige entre una y cuatro actividades válidas");
  state.goals = new Set(goals);
  document.querySelectorAll("[data-multigroup='needs'] button").forEach(button => { const selected = state.goals.has(button.dataset.value); button.classList.toggle("selected", selected); button.setAttribute("aria-pressed", String(selected)); }); updateGoalCount();
}

function registerWebMCP() {
  const context = document.modelContext; if (!context?.registerTool) return;
  context.registerTool({ name: "create_campus_plan", title: "Crear plan personalizado entre clases", description: "Combina hasta cuatro actividades, origen, destino y preferencias; actualiza el plan visible y la ruta de Google Maps.", inputSchema: { type: "object", properties: { time: { type: "integer", enum: [30,60,120,180] }, origin: { type: "string", enum: allLocationNames }, destination: { type: "string", enum: allLocationNames }, goals: { type: "array", minItems: 1, maxItems: 4, uniqueItems: true, items: { type: "string", enum: Object.keys(goalCatalog) } }, energy: { type: "string", enum: ["baja","media","alta"] }, pace: { type: "string", enum: ["tranquilo","equilibrado","intenso"] }, budget: { type: "string", enum: ["cero","bajo","flexible"] }, ambience: { type: "string", enum: ["silencio","indiferente","aire-libre","grupo"] }, accessible: { type: "boolean" } }, required: ["time","origin","destination","goals","energy","pace","budget","ambience","accessible"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { selectSingle("time", String(input.time)); selectSingle("energy", input.energy); selectGoals(input.goals); locationSelect.value = input.origin; nextLocationSelect.value = input.destination; document.querySelector("#pace").value = input.pace; document.querySelector("#budget").value = input.budget; document.querySelector("#ambience").value = input.ambience; document.querySelector("#accessible").checked = input.accessible; updateTimeWindow(); return renderPlan(false); } });
  context.registerTool({ name: "search_campus_places", title: "Buscar lugares del campus", description: "Busca edificios, servicios y espacios de bienestar en el directorio de Icesi incluido en la app.", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute({query}) { const q = query.trim().toLocaleLowerCase("es"); return campusPlaces.filter(place => `${place.name} ${place.text}`.toLocaleLowerCase("es").includes(q)).slice(0,10); } });
  context.registerTool({ name: "read_current_campus_plan", title: "Leer plan actual", description: "Devuelve las preferencias y los pasos del plan visible actualmente.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute() { return renderPlan(false); } });
}

updateGoalCount(); renderPlan(false); registerWebMCP();
