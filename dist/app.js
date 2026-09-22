const state = { time: 120, goals: new Set(["comer", "estudiar"]), energy: "media", alternate: false, placeFilter: "todos" };

const campusPlaces = [
  { name: "Edificio A · Tecnoquímicas", short: "Edificio A", category: "academico", icon: "A", text: "Apoyo financiero, contabilidad, MBA y Marketing Zone." },
  { name: "Edificio B", short: "Edificio B", category: "academico", icon: "B", text: "Pregrados, posgrados, departamentos y centros de investigación de Negocios." },
  { name: "Edificio C · Mayagüez", short: "Edificio C", category: "academico", icon: "C", text: "Centro de Desarrollo del Espíritu Empresarial, Start-Up Café, salas de cómputo y apoyo de inglés." },
  { name: "Edificio D", short: "Edificio D", category: "academico", icon: "D", text: "Tienda Icesi, Auditorio Varela y laboratorio de ciencias cognitiva." },
  { name: "Edificio E", short: "Edificio E", category: "academico", icon: "E", text: "33 salones, auditorio, sala de audiencias y aulas grupales." },
  { name: "Edificio F", short: "Edificio F", category: "academico", icon: "F", text: "Salones de diseño y un punto para imprimir en el primer piso." },
  { name: "Edificio G", short: "Edificio G", category: "academico", icon: "G", text: "Coliseo 2, laboratorio de innovación y un punto para imprimir en el primer piso." },
  { name: "Edificio H · Taller de Diseño", short: "Taller de Diseño", category: "academico", icon: "H", text: "Talleres y espacios para crear, diseñar y prototipar." },
  { name: "Edificio J", short: "Edificio J", category: "servicio", icon: "J", text: "Planta física, servicios generales, compras y mantenimiento." },
  { name: "Edificio K", short: "Edificio K", category: "servicio", icon: "K", text: "Trámites y vueltas académicas, planeación y reservas de espacios." },
  { name: "Edificio L", short: "Edificio L", category: "academico", icon: "L", text: "Laboratorios de ciencias, salud, química, biología e ingeniería." },
  { name: "Edificio M", short: "Edificio M", category: "academico", icon: "M", text: "Estudios de grabación, laboratorios de redes, software e instrumentos musicales." },
  { name: "Edificio N · Planta Piloto", short: "Edificio N", category: "academico", icon: "N", text: "Laboratorios de bioprocesos, química, automatización, fluidos y planta piloto de ingeniería." },
  { name: "Biblioteca", short: "Biblioteca", category: "academico", icon: "⌁", text: "Un lugar para estudiar solo o en grupo, y para imprimir tus documentos." },
  { name: "Cafetería Principal", short: "Cafetería Principal", category: "servicio", icon: "☕", text: "Comidas, bebidas y un lugar para comer entre clases." },
  { name: "Bienestar Universitario", short: "Bienestar Universitario", category: "bienestar", icon: "♥", text: "Servicios y acompañamiento para la vida universitaria, en Edificio G e I." },
  { name: "Auditorios", short: "Auditorios", category: "academico", icon: "◉", text: "Charlas, eventos académicos y actividades institucionales." },
  { name: "CIDEIM", short: "CIDEIM", category: "academico", icon: "⌬", text: "Investigación científica y laboratorios especializados." },
  { name: "Bioterio", short: "Bioterio", category: "academico", icon: "◌", text: "Instalación de apoyo para investigación en ciencias de la vida." },
  { name: "Consultorio Jurídico", short: "Consultorio Jurídico", category: "servicio", icon: "§", text: "Atención y práctica jurídica de la Universidad." },
  { name: "CADI", short: "Gimnasio / CADI", category: "bienestar", icon: "↗", text: "Centro Artístico y Deportivo: un lugar para entrenar, nadar y cuidar tu bienestar." },
  { name: "Casa Rocha", short: "Casa Rocha", category: "servicio", icon: "⌂", text: "Ubicación institucional identificada en el plano del campus." },
  { name: "Casa Orejuela", short: "Casa Orejuela", category: "servicio", icon: "⌂", text: "Ubicación institucional identificada en el plano del campus." },
  { name: "Casa Malla", short: "Casa Malla", category: "servicio", icon: "⌂", text: "Ubicación institucional identificada en el plano del campus." },
  { name: "Porterías 1, 2 y 4", short: "Portería 1", category: "servicio", icon: "⌖", text: "Entradas, orientación y control de acceso al campus." },
  { name: "Plazoleta y canchas", short: "Plazoleta", category: "bienestar", icon: "◎", text: "Encuentro con amigos, descanso, caminata y deporte al aire libre." },
  { name: "CAMBAS · Salón 101A", short: "CAMBAS 101A", category: "academico", icon: "✦", text: "Pide ayuda a los monitores en matemáticas y estadística." },
  { name: "Sala Boreal", short: "Sala Boreal", category: "bienestar", icon: "☁", text: "Un espacio para descansar, meditar o bailar y recuperar energía entre clases." }
];

const gymExercises = {
  pierna: [{ name: "sentadillas", reps: "15" }, { name: "zancadas alternas", reps: "12 por pierna" }, { name: "puente de glúteo", reps: "15" }, { name: "sentadilla sumo", reps: "12" }, { name: "elevación de talones", reps: "20" }],
  brazo: [{ name: "flexiones de pecho", reps: "12" }, { name: "fondos de tríceps en banca", reps: "12" }, { name: "plancha con toque de hombro", reps: "20 toques" }, { name: "curl con mochila cargada", reps: "15 por brazo" }, { name: "flexiones diamante", reps: "10" }],
  espalda: [{ name: "superman", reps: "15" }, { name: "remo invertido en mesa", reps: "12" }, { name: "plancha lateral", reps: "20s por lado" }, { name: "buenos días con peso corporal", reps: "15" }, { name: "extensión de espalda baja", reps: "15" }],
  cardio: [{ name: "jumping jacks", reps: "40s" }, { name: "burpees", reps: "10" }, { name: "mountain climbers", reps: "40s" }, { name: "sprint en el sitio", reps: "30s" }, { name: "saltos de cuerda imaginaria", reps: "40s" }]
};
gymExercises.full = [gymExercises.pierna[0], gymExercises.brazo[0], gymExercises.cardio[1], gymExercises.espalda[2]];
const gymFocusLabels = { pierna: "pierna", brazo: "brazo", espalda: "espalda", cardio: "cardio", full: "cuerpo completo" };
const gymRoutineNames = { pierna: "Leg Day Exprés", brazo: "Upper Body Burner", espalda: "Espalda y Postura", cardio: "HIIT Cardio Circuit", full: "Full Body Express" };
const gymWarmups = {
  pierna: "sentadillas sin peso y balanceos de pierna al frente y al lado",
  brazo: "círculos de hombro y flexiones apoyando las rodillas",
  espalda: "gato-camello y rotaciones suaves de tronco",
  cardio: "jumping jacks suaves y trote en el sitio",
  full: "jumping jacks, sentadillas sin peso y círculos de hombro"
};

function buildGymRoutine(preferences, minutes) {
  const m = minutes || 20;
  const focus = gymExercises[preferences.gymFocus] ? preferences.gymFocus : "full";
  const pool = gymExercises[focus];
  const warmup = m <= 15 ? 2 : m <= 30 ? 4 : 5;
  const cooldown = m <= 15 ? 2 : 4;
  const workMinutes = Math.max(5, m - warmup - cooldown);
  const setMinutes = preferences.energy === "baja" ? 1.4 : 1.1;
  const sets = Math.max(2, Math.min(5, Math.round(workMinutes / (pool.length * setMinutes))));
  const restSeconds = preferences.energy === "baja" ? 45 : preferences.energy === "alta" ? 20 : 30;
  const steps = [
    `Calentamiento (${warmup} min): movilidad articular, ${gymWarmups[focus]}.`,
    ...pool.map(ex => `${ex.name[0].toUpperCase()}${ex.name.slice(1)} — ${sets}x${ex.reps} · descanso ${restSeconds}s`),
    `Cierre (${cooldown} min): estiramiento de ${gymFocusLabels[focus]} sosteniendo cada posición 20-30s.`
  ];
  return { summary: `${gymRoutineNames[focus]} · Enfoque ${gymFocusLabels[focus]} · ${m} min`, steps };
}

const danceStyles = {
  salsa: { label: "salsa caleña", tip: "practica el paso básico contra tiempo y los giros simples; en Cali cualquier tutorial de salsa te sirve para calentar." },
  urbano: { label: "urbano / reggaetón", tip: "sigue una coreografía corta de reggaetón o perreo básico, marcando bien el golpe de cadera." },
  bachata: { label: "bachata", tip: "repite el paso básico de bachata (4 tiempos con el toque de cadera) antes de meterle giros." },
  folclor: { label: "folclor colombiano", tip: "prueba unos pasos de cumbia o mapalé, típicos de las actividades de Artes Escénicas del CADI." },
  zumba: { label: "zumba / cardio dance", tip: "sigue una rutina de zumba de intensidad media-alta para subir el ritmo cardiaco." }
};

function buildDanceRoutine(preferences, minutes) {
  const m = minutes || 20;
  const style = danceStyles[preferences.danceStyle] || danceStyles.salsa;
  const warmup = m <= 15 ? 2 : 4;
  const freeMinutes = Math.max(5, m - warmup - 8);
  const steps = [
    `Calentamiento (${warmup} min): rota tobillos, cadera y hombros al ritmo de la música.`,
    `Paso base (8 min): ${style.tip}`,
    `Coreografía libre (${freeMinutes} min): pon un tutorial corto de “${style.label} para principiantes” y repítelo 2-3 veces hasta que te salga natural.`
  ];
  return { summary: `Sesión de ${style.label} · ${m} min`, steps };
}

function buildMindfulRoutine(preferences, minutes) {
  const m = minutes || 15;
  const bodyScan = Math.max(3, m - 8);
  const steps = [
    "Postura: siéntate cómodo con la espalda recta y el celular en silencio.",
    "Respiración 4-7-8 (3 min): inhala 4s, sostén 7s, exhala 8s. Repite 5 veces.",
    `Escaneo corporal (${bodyScan} min): recorre tu cuerpo de pies a cabeza soltando la tensión en cada zona.`,
    "Cierre (2 min): escribe o piensa en 3 cosas por las que sientes gratitud hoy."
  ];
  return { summary: `Mindfulness guiado · ${m} min`, steps };
}

const cambasTopics = {
  matematicas: { temas: "operaciones con fracciones, ecuaciones lineales y sistemas 2x2", tarea: "trae dos ejercicios que no te hayan salido junto con el procedimiento que intentaste." },
  calculo: { temas: "límites, derivadas y la regla de la cadena", tarea: "anota el ejercicio de derivación o integración que quieres repasar." },
  algebra: { temas: "vectores, matrices y sistemas de ecuaciones", tarea: "lleva el ejercicio de álgebra lineal donde te quedaste trabado." },
  estadistica: { temas: "medidas de tendencia central, varianza y distribución normal", tarea: "trae el punto del taller o la base de datos donde te trabaste." }
};
const cambasLabels = { matematicas: "Matemáticas", calculo: "Cálculo", algebra: "Álgebra lineal", estadistica: "Estadística" };

function buildCambasRoutine(preferences) {
  const key = cambasTopics[preferences.cambasSubject] ? preferences.cambasSubject : "matematicas";
  const topic = cambasTopics[key];
  const steps = [
    `Repasa antes de llegar: ${topic.temas}.`,
    `Lleva contigo: ${topic.tarea}`,
    "En la sesión: explícale al monitor qué intentaste y en qué paso te trabaste, no pidas solo la respuesta final."
  ];
  return { summary: `Sesión de ${cambasLabels[key]} en CAMBAS`, steps };
}

function altPick(condition, primary, secondary, alternate) {
  return condition !== alternate ? primary : secondary;
}

const goalCatalog = {
  comer: { icon: "🥪", label: "Comer", minutes: 25, pick: p => altPick(p.budget === "cero", "Plazoleta", "Cafetería Principal", p.alternate), action: p => p.budget === "cero" ? "Come lo que llevaste y toma agua." : "Haz una pausa para comer sin afán." },
  estudiar: { icon: "📚", label: "Estudiar", minutes: 35, pick: p => altPick(p.ambience === "grupo", "Edificio E", "Biblioteca", p.alternate), action: p => p.ambience === "grupo" ? "Avanza con tu equipo en un aula grupal." : "Trabaja una tarea concreta con foco." },
  descansar: { icon: "☁️", label: "Descansar", minutes: 20, pick: p => altPick(p.ambience === "aire-libre", "Plazoleta", "Sala Boreal", p.alternate), action: (p, minutes) => p.alarmEnabled ? `Recuéstate o cierra los ojos; programamos tu alarma para que suene en ${p.alarmMinutes} min.` : "Baja el ritmo y recupera energía." },
  ayuda: { icon: "✦", label: "Pedir ayuda", minutes: 35, pick: () => "CAMBAS 101A", action: p => buildCambasRoutine(p) },
  entrenar: { icon: "↗", label: "Entrenar", minutes: 35, pick: () => "Gimnasio / CADI", action: (p, minutes) => buildGymRoutine(p, minutes) },
  bailar: { icon: "💃", label: "Bailar", minutes: 30, pick: p => altPick(p.ambience === "aire-libre", "Plazoleta", "Sala Boreal", p.alternate), action: (p, minutes) => buildDanceRoutine(p, minutes) },
  meditar: { icon: "🧘", label: "Meditar", minutes: 20, pick: () => "Sala Boreal", action: (p, minutes) => buildMindfulRoutine(p, minutes) },
  crear: { icon: "🎨", label: "Crear", minutes: 30, pick: () => "Taller de Diseño", action: () => "Dibuja, escribe o experimenta libremente con lo que tengas a mano." },
  socializar: { icon: "☺", label: "Ver amigos", minutes: 25, pick: p => altPick(p.ambience === "aire-libre", "Plazoleta", "Cafetería Principal", p.alternate), action: () => "Conversa y desconéctate un momento." },
  imprimir: { icon: "▤", label: "Imprimir", minutes: 15, pick: p => p.alternate ? "Edificio C" : "Biblioteca", action: () => "Imprime y revisa lo necesario para tu clase." },
  diligencia: { icon: "✓", label: "Hacer una vuelta", minutes: 20, pick: p => p.alternate ? "Edificio K" : "Edificio B", action: () => "Resuelve tu trámite o consulta pendiente." }
};

let alarmDeadline = null;
let alarmInterval = null;
let alarmBeepInterval = null;
let alarmAudioCtx = null;

function ensureAudioContext() {
  if (!alarmAudioCtx) alarmAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (alarmAudioCtx.state === "suspended") alarmAudioCtx.resume();
  return alarmAudioCtx;
}

function beepOnce() {
  const ctx = ensureAudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.frequency.value = 880;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
  oscillator.start();
  oscillator.stop(ctx.currentTime + 0.4);
}

function stopAlarmSound() {
  window.clearInterval(alarmBeepInterval);
  alarmBeepInterval = null;
}

function cancelAlarm() {
  window.clearInterval(alarmInterval);
  stopAlarmSound();
  alarmInterval = null;
  alarmDeadline = null;
  const bar = document.querySelector("#alarm-bar");
  bar.hidden = true;
  bar.classList.remove("ringing");
}

function ringAlarm() {
  const bar = document.querySelector("#alarm-bar");
  document.querySelector("#alarm-status").textContent = "¡Hora de despertar! Termina tu descanso en Sala Boreal.";
  bar.classList.add("ringing");
  let count = 0;
  alarmBeepInterval = window.setInterval(() => { beepOnce(); count += 1; if (count >= 14) stopAlarmSound(); }, 700);
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Entre Clase", { body: "Se acabó tu descanso en Sala Boreal. ¡Hora de despertar!" });
  }
}

function scheduleAlarm(minutes) {
  cancelAlarm();
  alarmDeadline = Date.now() + minutes * 60000;
  const bar = document.querySelector("#alarm-bar");
  const status = document.querySelector("#alarm-status");
  bar.hidden = false;
  bar.classList.remove("ringing");
  const tick = () => {
    const remaining = Math.max(0, Math.round((alarmDeadline - Date.now()) / 1000));
    const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
    const ss = String(remaining % 60).padStart(2, "0");
    status.textContent = remaining > 0 ? `Alarma para Sala Boreal en ${mm}:${ss}` : "¡Hora de despertar!";
    if (remaining <= 0) { window.clearInterval(alarmInterval); alarmInterval = null; ringAlarm(); }
  };
  tick();
  alarmInterval = window.setInterval(tick, 1000);
}

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
  group.querySelectorAll("button").forEach(item => { item.classList.remove("selected"); item.setAttribute("aria-pressed", "false"); });
  button.classList.add("selected");
  button.setAttribute("aria-pressed", "true");
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
  const minutes = Math.min(480, Math.max(30, Number(customTimeInput.value) || 30));
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

document.querySelector("#alarm-enabled").addEventListener("change", event => {
  ensureAudioContext();
  if (event.target.checked && "Notification" in window && Notification.permission === "default") Notification.requestPermission();
  if (!event.target.checked) cancelAlarm();
  document.querySelector("#alarm-minutes-wrap").hidden = !event.target.checked;
});

document.querySelector("#alarm-cancel").addEventListener("click", () => { cancelAlarm(); showToast("Alarma cancelada."); });

function updateGoalCount() {
  const count = state.goals.size;
  document.querySelector("#goal-count").textContent = `${count} ${count === 1 ? "seleccionada" : "seleccionadas"}`;
  updateDynamicSections();
}

function updateDynamicSections() {
  const showGym = state.goals.has("entrenar");
  const showDance = state.goals.has("bailar");
  const showCambas = state.goals.has("ayuda");
  const showAlarm = state.goals.has("descansar");
  document.querySelector("#entrenar-detail").hidden = !showGym;
  document.querySelector("#bailar-detail").hidden = !showDance;
  document.querySelector("#cambas-detail").hidden = !showCambas;
  document.querySelector("#descansar-detail").hidden = !showAlarm;
  if (!showAlarm) {
    document.querySelector("#alarm-enabled").checked = false;
    cancelAlarm();
  }
  document.querySelector("#alarm-minutes-wrap").hidden = !(showAlarm && document.querySelector("#alarm-enabled").checked);
  document.querySelector("#activity-details").hidden = !(showGym || showDance || showCambas || showAlarm);
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
    alternate: state.alternate,
    gymFocus: document.querySelector("#gym-focus").value,
    danceStyle: document.querySelector("#dance-style").value,
    cambasSubject: document.querySelector("#cambas-subject").value,
    alarmEnabled: document.querySelector("#alarm-enabled").checked,
    alarmMinutes: Math.min(180, Math.max(5, Number(document.querySelector("#alarm-minutes").value) || 20))
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
  const activityLabel = chosenGoals.length === 1 ? "actividad organizada" : "actividades organizadas";
  const reason = [`${chosenGoals.length} ${activityLabel} a ritmo ${preferences.pace}.`, preferences.note ? `También tuvimos en cuenta: “${preferences.note}”.` : "", omitted ? `${omitted} actividad quedó para otro hueco por falta de tiempo.` : ""].filter(Boolean).join(" ");
  return { origin, destination, buffer, items, omitted, preferences, name: activityPlaces.join(" + "), reason, icon: goalCatalog[chosenGoals[0]].icon };
}

function renderTimeline(items) {
  const timeline = document.querySelector("#timeline"); timeline.replaceChildren();
  items.forEach(item => {
    const li = document.createElement("li"); const time = document.createElement("time"); time.textContent = `${item.minutes} min`;
    const detail = document.createElement("div"); const strong = document.createElement("strong"); strong.textContent = item.place;
    detail.append(strong);
    if (typeof item.action === "string") {
      const paragraph = document.createElement("p"); paragraph.textContent = item.action;
      detail.append(paragraph);
    } else {
      const summary = document.createElement("p"); summary.className = "routine-summary"; summary.textContent = item.action.summary;
      const list = document.createElement("ol"); list.className = "routine-steps";
      item.action.steps.forEach(step => { const stepItem = document.createElement("li"); stepItem.textContent = step; list.append(stepItem); });
      detail.append(summary, list);
    }
    li.append(time, detail); timeline.append(li);
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
  const realTotal = plan.items.reduce((sum, item) => sum + item.minutes, 0);
  document.querySelector("#total-time").textContent = `${realTotal} min en total`;
  document.querySelector("#return-buffer").textContent = `Termina en ${plan.destination}`;
  document.querySelector("#map-title").textContent = `${plan.origin} → ${plan.destination}`;
  document.querySelector("#walk-time").textContent = plan.preferences.accessible ? "Ruta accesible" : "Modo caminando";
  document.querySelector("#plan-profile").innerHTML = `<span>${plan.preferences.pace}</span><span>${plan.preferences.budget === "cero" ? "sin gastar" : plan.preferences.budget === "bajo" ? "presupuesto bajo" : "presupuesto flexible"}</span><span>${plan.preferences.ambience.replace("-", " ")}</span>${plan.preferences.accessible ? "<span>ruta accesible</span>" : ""}`;
  renderTimeline(plan.items); updateMaps(plan);
  if (plan.omitted) showToast("Ajustamos el número de actividades al tiempo disponible.");
  if (shouldScroll) document.querySelector("#resultado").scrollIntoView({ behavior: "smooth", block: "start" });
  return { duration_minutes: state.time, origin: plan.origin, destination: plan.destination, goals: [...state.goals], preferences: plan.preferences, plan: plan.items.map(({ minutes, place, goal }) => ({ minutes, place, goal })) };
}

document.querySelector("#planner-form").addEventListener("submit", event => {
  event.preventDefault();
  state.alternate = false;
  const summary = renderPlan();
  const restIncluded = summary.plan.some(item => item.goal === "descansar");
  if (restIncluded && summary.preferences.alarmEnabled) { scheduleAlarm(summary.preferences.alarmMinutes); showToast(`Alarma puesta para dentro de ${summary.preferences.alarmMinutes} min.`); }
  else cancelAlarm();
});
document.querySelector("#alternate-plan").addEventListener("click", () => {
  const previousName = document.querySelector("#plan-name").textContent;
  state.alternate = !state.alternate;
  renderPlan(false);
  const changed = document.querySelector("#plan-name").textContent !== previousName;
  showToast(changed ? "Cambiamos algunos lugares del recorrido." : "No hay otra opción disponible para estas actividades.");
});
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
  container.querySelectorAll("button").forEach(item => { const isSelected = item === button; item.classList.toggle("selected", isSelected); item.setAttribute("aria-pressed", String(isSelected)); }); state[group] = group === "time" ? Number(value) : value;
}

function selectGoals(goals) {
  if (!Array.isArray(goals) || !goals.length || goals.length > 4 || goals.some(goal => !goalCatalog[goal])) throw new Error("Elige entre una y cuatro actividades válidas");
  state.goals = new Set(goals);
  document.querySelectorAll("[data-multigroup='needs'] button").forEach(button => { const selected = state.goals.has(button.dataset.value); button.classList.toggle("selected", selected); button.setAttribute("aria-pressed", String(selected)); }); updateGoalCount();
}

function registerWebMCP() {
  const context = document.modelContext; if (!context?.registerTool) return;
  context.registerTool({ name: "create_campus_plan", title: "Crear plan personalizado entre clases", description: "Combina hasta cuatro actividades, origen, destino y preferencias; actualiza el plan visible y la ruta de Google Maps.", inputSchema: { type: "object", properties: { time: { type: "integer", enum: [30,60,120,180] }, origin: { type: "string", enum: allLocationNames }, destination: { type: "string", enum: allLocationNames }, goals: { type: "array", minItems: 1, maxItems: 4, uniqueItems: true, items: { type: "string", enum: Object.keys(goalCatalog) } }, energy: { type: "string", enum: ["baja","media","alta"] }, pace: { type: "string", enum: ["tranquilo","equilibrado","intenso"] }, budget: { type: "string", enum: ["cero","bajo","flexible"] }, ambience: { type: "string", enum: ["silencio","indiferente","aire-libre","grupo"] }, accessible: { type: "boolean" }, gymFocus: { type: "string", enum: Object.keys(gymExercises) }, danceStyle: { type: "string", enum: Object.keys(danceStyles) }, cambasSubject: { type: "string", enum: Object.keys(cambasTopics) }, alarmMinutes: { type: "integer", minimum: 5, maximum: 180 } }, required: ["time","origin","destination","goals","energy","pace","budget","ambience","accessible"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { selectSingle("time", String(input.time)); selectSingle("energy", input.energy); selectGoals(input.goals); locationSelect.value = input.origin; nextLocationSelect.value = input.destination; document.querySelector("#pace").value = input.pace; document.querySelector("#budget").value = input.budget; document.querySelector("#ambience").value = input.ambience; document.querySelector("#accessible").checked = input.accessible; if (input.gymFocus) document.querySelector("#gym-focus").value = input.gymFocus; if (input.danceStyle) document.querySelector("#dance-style").value = input.danceStyle; if (input.cambasSubject) document.querySelector("#cambas-subject").value = input.cambasSubject; if (input.alarmMinutes) { document.querySelector("#alarm-minutes").value = input.alarmMinutes; document.querySelector("#alarm-enabled").checked = true; } updateTimeWindow(); const summary = renderPlan(false); if (document.querySelector("#alarm-enabled").checked && summary.plan.some(item => item.goal === "descansar")) scheduleAlarm(summary.preferences.alarmMinutes); return summary; } });
  context.registerTool({ name: "search_campus_places", title: "Buscar lugares del campus", description: "Busca edificios, servicios y espacios de bienestar en el directorio de Icesi incluido en la app.", inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute({query}) { const q = query.trim().toLocaleLowerCase("es"); return campusPlaces.filter(place => `${place.name} ${place.text}`.toLocaleLowerCase("es").includes(q)).slice(0,10); } });
  context.registerTool({ name: "read_current_campus_plan", title: "Leer plan actual", description: "Devuelve las preferencias y los pasos del plan visible actualmente.", inputSchema: { type: "object", properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute() { return renderPlan(false); } });
}

updateGoalCount(); renderPlan(false); registerWebMCP();
