import { LOCATIONS, CATEGORIES, getLocation, coordinatesOf, CAMPUS_CENTER } from "./data/locations.js";
import { GOALS } from "./js/goals.js";
import { buildPlan } from "./js/planner.js";
import { formatClock, formatDuration, addMinutes } from "./js/time.js";
import { haversineMeters, formatDistance } from "./js/geo.js";
import { CampusMap, buildGoogleMapsUrl } from "./js/map.js";
import { saveFormState, loadFormState, pushRecentPlan, loadRecentPlans } from "./js/storage.js";

const state = { time: 120, goals: new Set(["comer", "estudiar"]), energy: "media", alternate: false, placeFilter: "todos", placeSort: "recomendado" };
const touchedSections = new Set();
let currentPlan = null;
let stepManualStatus = new Map();
let departureTimeout = null;
let planTimerInterval = null;
let statusInterval = null;

const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];

/* ---------------------------------------------------------------------- */
/* Selects de ubicación                                                    */
/* ---------------------------------------------------------------------- */
const locationSelect = $("#location");
const nextLocationSelect = $("#next-location");

function populateLocations() {
  const options = LOCATIONS.map(place => `<option value="${place.id}">${place.name}</option>`).join("");
  locationSelect.innerHTML = options;
  nextLocationSelect.innerHTML = options;
  locationSelect.value = "edificio-l";
  nextLocationSelect.value = "edificio-e";
}

/* ---------------------------------------------------------------------- */
/* Persistencia del formulario                                             */
/* ---------------------------------------------------------------------- */
function serializeFormState() {
  return {
    time: state.time,
    customTime: Number($("#custom-time").value) || 90,
    isCustomTime: $('[data-group="time"] [data-value="custom"]').classList.contains("selected"),
    origin: locationSelect.value,
    destination: nextLocationSelect.value,
    goals: [...state.goals],
    energy: state.energy,
    pace: $("#pace").value,
    budget: $("#budget").value,
    ambience: $("#ambience").value,
    accessible: $("#accessible").checked,
    note: $("#custom-note").value,
    gymFocus: $("#gym-focus").value,
    danceStyle: $("#dance-style").value,
    cambasSubject: $("#cambas-subject").value
  };
}

function persist() {
  saveFormState(serializeFormState());
}

function restoreFormState() {
  const saved = loadFormState();
  if (!saved) return;
  try {
    if (saved.isCustomTime) {
      selectGroupValue("time", "custom");
      $("#custom-time").value = saved.customTime;
      $("#custom-time-wrap").hidden = false;
      state.time = saved.customTime;
    } else if (saved.time) {
      selectGroupValue("time", String(saved.time));
    }
    if (saved.origin) locationSelect.value = saved.origin;
    if (saved.destination) nextLocationSelect.value = saved.destination;
    if (Array.isArray(saved.goals) && saved.goals.length) {
      state.goals = new Set(saved.goals.filter(g => GOALS[g]));
      if (!state.goals.size) state.goals = new Set(["comer", "estudiar"]);
    }
    $$('[data-multigroup="needs"] button').forEach(b => { const sel = state.goals.has(b.dataset.value); b.classList.toggle("selected", sel); b.setAttribute("aria-pressed", String(sel)); });
    if (saved.energy) selectGroupValue("energy", saved.energy);
    if (saved.pace) $("#pace").value = saved.pace;
    if (saved.budget) $("#budget").value = saved.budget;
    if (saved.ambience) $("#ambience").value = saved.ambience;
    if (saved.accessible) $("#accessible").checked = true;
    if (saved.note) $("#custom-note").value = saved.note;
    if (saved.gymFocus) $("#gym-focus").value = saved.gymFocus;
    if (saved.danceStyle) $("#dance-style").value = saved.danceStyle;
    if (saved.cambasSubject) $("#cambas-subject").value = saved.cambasSubject;
  } catch { /* estado guardado inválido: seguimos con los valores por defecto */ }
}

function selectGroupValue(group, value) {
  const container = $(`[data-group="${group}"]`);
  const button = container?.querySelector(`[data-value="${value}"]`);
  if (!button) return;
  container.querySelectorAll("button").forEach(item => { const sel = item === button; item.classList.toggle("selected", sel); item.setAttribute("aria-pressed", String(sel)); });
  state[group] = group === "time" ? (value === "custom" ? state.time : Number(value)) : value;
  if (group === "time" && value !== "custom") $("#custom-time-wrap").hidden = true;
}

/* ---------------------------------------------------------------------- */
/* Numeración dinámica de secciones (sin saltos) y progreso                */
/* ---------------------------------------------------------------------- */
function renumberSections() {
  const visible = $$("#planner-form > fieldset").filter(fs => !fs.hidden);
  visible.forEach((fs, index) => {
    const badge = fs.querySelector(":scope > legend > span");
    if (badge) badge.textContent = String(index + 1).padStart(2, "0");
  });
  updateProgress(visible.length);
}

function updateProgress(totalVisible) {
  const total = totalVisible ?? $$("#planner-form > fieldset").filter(fs => !fs.hidden).length;
  const touched = [...touchedSections].filter(id => {
    const fs = document.getElementById(id);
    return fs && !fs.hidden;
  }).length;
  const percent = total ? Math.round((touched / total) * 100) : 0;
  $("#form-progress-fill").style.width = `${percent}%`;
  $("#form-progress").setAttribute("aria-valuenow", String(percent));
  $("#form-progress-label").textContent = `${touched} de ${total} secciones exploradas`;
}

function markTouched(fieldsetId) {
  if (!touchedSections.has(fieldsetId)) { touchedSections.add(fieldsetId); updateProgress(); }
}

document.addEventListener("click", event => {
  const fs = event.target.closest("#planner-form fieldset[id]");
  if (fs) markTouched(fs.id);
});
$("#planner-form").addEventListener("input", event => {
  const fs = event.target.closest("fieldset[id]");
  if (fs) markTouched(fs.id);
});
$$("#planner-form > fieldset").forEach((fs, index) => { if (!fs.id) fs.id = `section-${index}`; });

/* ---------------------------------------------------------------------- */
/* Selección de tiempo / energía (exclusiva) y necesidades (múltiple)      */
/* ---------------------------------------------------------------------- */
const customTimeWrap = $("#custom-time-wrap");
const customTimeInput = $("#custom-time");

$$("[data-group]").forEach(group => group.addEventListener("click", event => {
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
  refreshValidation();
  persist();
}));

customTimeInput.addEventListener("input", () => {
  const raw = Number(customTimeInput.value);
  state.time = raw || 0;
  updateTimeWindow();
  refreshValidation();
  persist();
});

$('[data-multigroup="needs"]').addEventListener("click", event => {
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
  refreshValidation();
  persist();
});

function updateGoalCount() {
  const count = state.goals.size;
  $("#goal-count").textContent = `${count} ${count === 1 ? "seleccionada" : "seleccionadas"}`;
  updateDynamicSections();
}

function updateDynamicSections() {
  const showGym = state.goals.has("entrenar");
  const showDance = state.goals.has("bailar");
  const showCambas = state.goals.has("ayuda");
  const showAlarm = state.goals.has("descansar");
  $("#entrenar-detail").hidden = !showGym;
  $("#bailar-detail").hidden = !showDance;
  $("#cambas-detail").hidden = !showCambas;
  $("#descansar-detail").hidden = !showAlarm;
  if (!showAlarm) { $("#alarm-enabled").checked = false; cancelAlarm(); }
  $("#alarm-minutes-wrap").hidden = !(showAlarm && $("#alarm-enabled").checked);
  $("#activity-details").hidden = !(showGym || showDance || showCambas || showAlarm);
  renumberSections();
}

/* ---------------------------------------------------------------------- */
/* Alarma de descanso (se mantiene de la versión anterior)                 */
/* ---------------------------------------------------------------------- */
let alarmDeadline = null, alarmInterval = null, alarmBeepInterval = null, alarmAudioCtx = null;

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
function stopAlarmSound() { window.clearInterval(alarmBeepInterval); alarmBeepInterval = null; }
function cancelAlarm() {
  window.clearInterval(alarmInterval); stopAlarmSound();
  alarmInterval = null; alarmDeadline = null;
  const bar = $("#alarm-bar"); bar.hidden = true; bar.classList.remove("ringing");
}
function ringAlarm() {
  const bar = $("#alarm-bar");
  $("#alarm-status").textContent = "¡Hora de despertar! Termina tu descanso en Sala Boreal.";
  bar.classList.add("ringing");
  let count = 0;
  alarmBeepInterval = window.setInterval(() => { beepOnce(); count += 1; if (count >= 14) stopAlarmSound(); }, 700);
  if ("Notification" in window && Notification.permission === "granted") new Notification("Entre Clase", { body: "Se acabó tu descanso en Sala Boreal. ¡Hora de despertar!" });
}
function scheduleAlarm(minutes) {
  cancelAlarm();
  alarmDeadline = Date.now() + minutes * 60000;
  const bar = $("#alarm-bar"), status = $("#alarm-status");
  bar.hidden = false; bar.classList.remove("ringing");
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
$("#alarm-enabled").addEventListener("change", event => {
  ensureAudioContext();
  if (event.target.checked && "Notification" in window && Notification.permission === "default") Notification.requestPermission();
  if (!event.target.checked) cancelAlarm();
  $("#alarm-minutes-wrap").hidden = !event.target.checked;
});
$("#alarm-cancel").addEventListener("click", () => { cancelAlarm(); showToast("Alarma cancelada."); });

/* ---------------------------------------------------------------------- */
/* Alerta de salida hacia la próxima clase                                 */
/* ---------------------------------------------------------------------- */
function scheduleDepartureAlert(deadlineTime, destinationName) {
  if (departureTimeout) window.clearTimeout(departureTimeout);
  const alertAt = addMinutes(deadlineTime, -5).getTime();
  const delay = alertAt - Date.now();
  const bar = $("#departure-bar");
  if (delay <= 0) { bar.hidden = true; return; }
  bar.hidden = true;
  departureTimeout = window.setTimeout(() => {
    $("#departure-status").textContent = `Sal ya hacia ${destinationName} para llegar a tiempo.`;
    bar.hidden = false;
    if ("Notification" in window && Notification.permission === "granted") new Notification("Entre Clase", { body: `Sal ya hacia ${destinationName} para llegar a tiempo.` });
  }, Math.min(delay, 2147483647));
}
$("#departure-dismiss").addEventListener("click", () => { $("#departure-bar").hidden = true; });

/* ---------------------------------------------------------------------- */
/* Validación del formulario                                               */
/* ---------------------------------------------------------------------- */
function getValidationError() {
  const isCustom = $('[data-group="time"] [data-value="custom"]').classList.contains("selected");
  if (isCustom) {
    const raw = Number(customTimeInput.value);
    if (!raw || raw < 30 || raw > 480) return "Indica un tiempo personalizado entre 30 y 480 minutos.";
  } else if (!state.time) {
    return "Elige cuánto tiempo tienes disponible.";
  }
  if (!state.goals.size) return "Elige al menos una actividad.";
  if (!locationSelect.value) return "Selecciona el lugar donde estás ahora.";
  if (!nextLocationSelect.value) return "Selecciona dónde es tu próxima clase.";
  return null;
}

function refreshValidation() {
  const error = getValidationError();
  const submit = $("#plan-submit");
  const message = $("#form-validation-message");
  submit.disabled = Boolean(error);
  submit.setAttribute("aria-disabled", String(Boolean(error)));
  message.hidden = !error;
  message.textContent = error || "";
  updateSelectionSummary();
  return !error;
}

function updateSelectionSummary() {
  const originName = getLocation(locationSelect.value)?.name || "?";
  const destName = getLocation(nextLocationSelect.value)?.name || "?";
  const goalLabels = [...state.goals].map(g => GOALS[g]?.label).filter(Boolean).join(", ");
  const isCustom = $('[data-group="time"] [data-value="custom"]').classList.contains("selected");
  const timeLabel = isCustom ? `${customTimeInput.value || 0} min` : formatDuration(state.time);
  $("#selection-summary").textContent = `Resumen: ${timeLabel} · ${originName} → ${destName} · ${goalLabels || "sin actividades"} · energía ${state.energy}`;
}

/* ---------------------------------------------------------------------- */
/* Construcción de preferencias y envío del formulario                     */
/* ---------------------------------------------------------------------- */
function getPreferences() {
  return {
    pace: $("#pace").value,
    budget: $("#budget").value,
    ambience: $("#ambience").value,
    accessible: $("#accessible").checked,
    note: $("#custom-note").value.trim(),
    energy: state.energy,
    alternate: state.alternate,
    gymFocus: $("#gym-focus").value,
    danceStyle: $("#dance-style").value,
    cambasSubject: $("#cambas-subject").value,
    alarmEnabled: $("#alarm-enabled").checked,
    alarmMinutes: Math.min(180, Math.max(5, Number($("#alarm-minutes").value) || 20))
  };
}

function updateTimeWindow() {
  $("#clock-end").textContent = state.time ? `+ ${formatDuration(state.time)}` : "";
}

const campusMap = new CampusMap(document.getElementById("campus-map"));

async function generatePlan(shouldScroll = true) {
  if (!refreshValidation()) { $("#planner-form").reportValidity?.(); return; }
  $("#result-empty").hidden = true;
  $("#result-content").hidden = true;
  $("#result-loading").hidden = false;
  const messages = ["Organizando tus actividades…", "Calculando tus recorridos…", "Ajustando horarios…"];
  let i = 0;
  $("#loading-message").textContent = messages[0];
  const rotate = window.setInterval(() => { i = (i + 1) % messages.length; $("#loading-message").textContent = messages[i]; }, 260);
  await new Promise(resolve => window.setTimeout(resolve, 620));
  window.clearInterval(rotate);

  const preferences = getPreferences();
  const plan = buildPlan({
    originId: locationSelect.value,
    destinationId: nextLocationSelect.value,
    requestedMinutes: state.time,
    chosenKeys: [...state.goals],
    preferences,
    now: new Date()
  });
  currentPlan = plan;
  stepManualStatus = new Map();

  $("#result-loading").hidden = true;
  $("#result-content").hidden = false;
  $("#result-empty").hidden = true;
  $("#result-actions").hidden = false;
  $("#result-eyebrow").textContent = "Recomendado para ti";

  renderPlan(plan);

  if (shouldScroll) $("#resultado").scrollIntoView({ behavior: "smooth", block: "start" });

  const restIncluded = plan.steps.some(s => s.activities?.some(a => a.goalKey === "descansar"));
  if (restIncluded && preferences.alarmEnabled) { scheduleAlarm(preferences.alarmMinutes); showToast(`Alarma puesta para dentro de ${preferences.alarmMinutes} min.`); }
  else cancelAlarm();

  scheduleDepartureAlert(plan.meta.deadlineTime, plan.meta.destination?.name || "tu próxima clase");
  startStatusLoop();
  startPlanTimer();
}

/* ---------------------------------------------------------------------- */
/* Render del resultado                                                    */
/* ---------------------------------------------------------------------- */
function renderPlan(plan) {
  const { meta, summary, steps, recommendations, route } = plan;
  $("#result-title").textContent = `Tu plan personalizado para ${formatDuration(meta.requestedMinutes)}`;
  $("#plan-headline").textContent = meta.headline;
  $("#stat-total-time").textContent = `${meta.realTotalMinutes} min`;
  $("#stat-start-time").textContent = formatClock(meta.startTime);
  $("#stat-deadline-time").textContent = formatClock(meta.deadlineTime);
  $("#stat-origin").textContent = meta.origin?.name || "?";
  $("#stat-destination").textContent = meta.destination?.name || "?";
  $("#stat-activity-count").textContent = String(meta.goalsCount);
  $("#stat-energy").textContent = meta.energy;
  $("#stat-budget").textContent = meta.budget === "cero" ? "Sin gastar" : meta.budget === "bajo" ? "Hasta $15.000" : "Flexible";

  const warningsBox = $("#plan-warnings");
  if (meta.warnings.length) { warningsBox.hidden = false; warningsBox.innerHTML = meta.warnings.map(w => `<p>⚠️ ${w}</p>`).join(""); }
  else warningsBox.hidden = true;

  const activePlaceNames = steps.filter(s => s.type === "activity").map(s => s.locationName);
  $("#plan-name").textContent = activePlaceNames.join(" + ");
  const firstGoalKey = steps.find(s => s.type === "activity")?.activities?.[0]?.goalKey;
  $("#summary-icon").textContent = firstGoalKey ? GOALS[firstGoalKey].icon : "✦";
  $("#plan-profile").innerHTML = `<span>${meta.pace}</span><span>${meta.budget === "cero" ? "sin gastar" : meta.budget === "bajo" ? "presupuesto bajo" : "presupuesto flexible"}</span><span>${meta.ambience.replace("-", " ")}</span>${meta.accessible ? "<span>ruta accesible</span>" : ""}`;

  $("#tile-activity-time").textContent = `${summary.activityMinutes} min`;
  $("#tile-walk-time").textContent = `${summary.walkMinutes} min`;
  $("#tile-margin").textContent = `${summary.marginMinutes} min`;
  $("#tile-distance").textContent = formatDistance(summary.totalDistanceMeters);
  $("#tile-exigencia").textContent = summary.exigencia;
  const totalForBar = Math.max(1, summary.activityMinutes + summary.walkMinutes + summary.marginMinutes);
  $("#seg-activity").style.width = `${(summary.activityMinutes / totalForBar) * 100}%`;
  $("#seg-walk").style.width = `${(summary.walkMinutes / totalForBar) * 100}%`;
  $("#seg-margin").style.width = `${(summary.marginMinutes / totalForBar) * 100}%`;

  renderTimeline(steps);
  renderMapAndRoute(plan);
  renderRecommendations(recommendations);
  renderHistoryList();
}

function stepStatusFor(step, index) {
  if (stepManualStatus.get(index)) return stepManualStatus.get(index);
  const now = new Date();
  if (now >= step.endTime) return "completado";
  if (now >= step.startTime) return "en-curso";
  return "pendiente";
}

function renderTimeline(steps) {
  const timeline = $("#timeline");
  timeline.replaceChildren();
  steps.forEach((step, index) => {
    const li = document.createElement("li");
    li.className = `timeline-step timeline-${step.type}`;
    li.dataset.index = String(index);

    const when = document.createElement("div");
    when.className = "step-when";
    const time = document.createElement("time");
    time.textContent = `${formatClock(step.startTime)} – ${formatClock(step.endTime)}`;
    const durationBadge = document.createElement("span");
    durationBadge.className = "step-duration";
    durationBadge.textContent = formatDuration(step.minutes);
    when.append(time, durationBadge);

    const detail = document.createElement("div");
    detail.className = "step-detail";

    const statusChip = document.createElement("span");
    const status = stepStatusFor(step, index);
    statusChip.className = `status-chip status-${status}`;
    statusChip.textContent = status === "completado" ? "Completado" : status === "en-curso" ? "En curso" : "Pendiente";

    if (step.type === "transfer") {
      const title = document.createElement("strong");
      title.textContent = step.label;
      const sub = document.createElement("p");
      sub.textContent = `Caminata estimada: ${step.minutes} min (${formatDistance(step.distanceMeters)}) desde ${step.from}.`;
      detail.append(statusChip, title, sub);
    } else if (step.type === "arrival") {
      const title = document.createElement("strong");
      title.textContent = `Llega a ${step.locationName}`;
      const sub = document.createElement("p");
      sub.textContent = step.action;
      const meta = document.createElement("p");
      meta.className = "step-meta";
      meta.textContent = `Caminata: ${step.walkMinutes} min · Margen de seguridad: ${step.marginMinutes} min`;
      detail.append(statusChip, title, sub, meta);
      if (!step.verified) detail.append(unverifiedTag());
    } else {
      const title = document.createElement("strong");
      title.textContent = step.locationName;
      detail.append(statusChip, title);
      if (!step.verified) detail.append(unverifiedTag());
      step.activities.forEach(activity => {
        const block = document.createElement("div");
        block.className = "activity-block";
        const label = document.createElement("p");
        label.className = "activity-label";
        label.innerHTML = `<span aria-hidden="true">${activity.icon}</span> ${activity.label} <span class="priority-badge priority-${activity.priority}">${activity.priority}</span>`;
        block.append(label);
        if (typeof activity.action === "string") {
          const p = document.createElement("p");
          p.textContent = activity.action;
          block.append(p);
        } else {
          const p = document.createElement("p");
          p.className = "routine-summary";
          p.textContent = activity.action.summary;
          const list = document.createElement("ol");
          list.className = "routine-steps";
          activity.action.steps.forEach(s => { const li2 = document.createElement("li"); li2.textContent = s; list.append(li2); });
          block.append(p, list);
        }
        const reason = document.createElement("p");
        reason.className = "step-reason";
        reason.textContent = `Por qué aquí: ${activity.reason}`;
        const bring = document.createElement("p");
        bring.className = "step-bring";
        bring.textContent = `Lleva contigo: ${activity.bring}`;
        block.append(reason, bring);
        detail.append(block);
      });
      const mapBtn = document.createElement("button");
      mapBtn.type = "button";
      mapBtn.className = "map-link-btn";
      mapBtn.textContent = "Ver en el mapa ↗";
      mapBtn.addEventListener("click", () => focusMapStep(step));
      const doneBtn = document.createElement("button");
      doneBtn.type = "button";
      doneBtn.className = "step-done-btn";
      doneBtn.textContent = status === "completado" ? "Marcar como pendiente" : "Marcar como completado";
      doneBtn.addEventListener("click", () => {
        stepManualStatus.set(index, status === "completado" ? "pendiente" : "completado");
        renderTimeline(currentPlan.steps);
      });
      const stepActions = document.createElement("div");
      stepActions.className = "step-actions";
      stepActions.append(mapBtn, doneBtn);
      detail.append(stepActions);
    }

    li.append(when, detail);
    timeline.append(li);
  });
}

function unverifiedTag() {
  const span = document.createElement("span");
  span.className = "unverified-tag";
  span.textContent = "Información por verificar";
  return span;
}

function focusMapStep(step) {
  if (!currentPlan) return;
  const mapPoints = buildMapPoints(currentPlan);
  const idx = mapPoints.findIndex(p => Math.abs(p.lat - step.coords.lat) < 1e-7 && Math.abs(p.lng - step.coords.lng) < 1e-7);
  if (idx >= 0) campusMap.focus(idx);
  $("#mapa").scrollIntoView({ behavior: "smooth", block: "center" });
}

function buildMapPoints(plan) {
  const points = [{ ...plan.route.originCoords, label: plan.meta.origin?.name || "Origen", kind: "origin" }];
  plan.steps.filter(s => s.type === "activity").forEach(s => points.push({ lat: s.coords.lat, lng: s.coords.lng, verified: s.verified, label: s.locationName, kind: "stop" }));
  points.push({ ...plan.route.destinationCoords, label: plan.meta.destination?.name || "Destino", kind: "destination" });
  return points;
}

function renderMapAndRoute(plan) {
  $("#map-title").textContent = plan.meta.routeTitle;
  $("#walk-time").textContent = plan.meta.accessible ? "Ruta accesible" : "Modo caminando";

  const points = buildMapPoints(plan);
  const rendered = campusMap.render(points);
  $("#map-fallback").hidden = rendered;

  const googleUrl = buildGoogleMapsUrl({ originCoords: plan.route.originCoords, destinationCoords: plan.route.destinationCoords, stopsCoords: plan.route.stops });
  $("#google-route").href = googleUrl;

  const dl = $("#route-details");
  dl.replaceChildren();
  const rows = [
    ["Salida exacta", plan.meta.origin?.name || "?"],
    ["Paradas", plan.steps.filter(s => s.type === "activity").map(s => s.locationName).join(" → ") || "Directo"],
    ["Llegada exacta", plan.meta.destination?.name || "?"],
    ["Distancia estimada", formatDistance(plan.summary.totalDistanceMeters)],
    ["Tiempo caminando", `${plan.summary.walkMinutes} min`],
    ["Hora recomendada de salida", formatClock(plan.meta.startTime)]
  ];
  rows.forEach(([label, value]) => {
    const div = document.createElement("div");
    div.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
    dl.append(div);
  });
  if (!plan.route.allVerified) {
    const note = document.createElement("p");
    note.className = "route-note";
    note.textContent = "Algunas paradas aún no tienen coordenada confirmada; el mapa usa un punto institucional de referencia para ellas.";
    dl.after(note);
  }

  const directions = plan.steps.filter(s => s.type !== "activity" || true);
  const lines = [];
  let stepCount = 1;
  plan.steps.forEach(step => {
    if (step.type === "transfer") lines.push(`${stepCount++}. ${step.label}, unos ${step.minutes} min caminando.`);
    else if (step.type === "activity") lines.push(`${stepCount++}. Llega a ${step.locationName}.`);
    else lines.push(`${stepCount++}. Termina en ${step.locationName} con ${step.marginMinutes} min de margen.`);
  });
  $("#directions").replaceChildren(...lines.map(text => { const p = document.createElement("p"); p.textContent = text; return p; }));
}

function renderRecommendations(list) {
  $("#recommendations-list").innerHTML = list.map(tip => `<li>${tip}</li>`).join("");
}

function renderHistoryList() {
  const history = loadRecentPlans();
  const card = $("#history-card");
  if (!history.length) { card.hidden = true; return; }
  card.hidden = false;
  $("#history-list").innerHTML = history.map(h => `<li><strong>${h.name}</strong><span>${h.when}</span></li>`).join("");
}

function startStatusLoop() {
  if (statusInterval) window.clearInterval(statusInterval);
  statusInterval = window.setInterval(() => { if (currentPlan) renderTimeline(currentPlan.steps); }, 30000);
}

function startPlanTimer() {
  if (planTimerInterval) window.clearInterval(planTimerInterval);
  const box = $("#plan-timer"), text = $("#plan-timer-text");
  const tick = () => {
    if (!currentPlan) return;
    const remaining = Math.round((currentPlan.meta.deadlineTime.getTime() - Date.now()) / 60000);
    if (remaining <= 0) { text.textContent = "Deberías estar llegando a tu próxima clase."; box.hidden = false; return; }
    box.hidden = false;
    text.textContent = `Te quedan ${remaining} min antes de tu próxima clase.`;
  };
  tick();
  planTimerInterval = window.setInterval(tick, 30000);
}

/* ---------------------------------------------------------------------- */
/* Acciones del plan: alternar, editar, guardar, compartir, copiar, imprimir*/
/* ---------------------------------------------------------------------- */
$("#planner-form").addEventListener("submit", event => { event.preventDefault(); state.alternate = false; generatePlan(); persist(); });

$("#alternate-plan").addEventListener("click", () => {
  const previousName = $("#plan-name").textContent;
  state.alternate = !state.alternate;
  generatePlan(false);
  window.setTimeout(() => {
    const changed = $("#plan-name").textContent !== previousName;
    showToast(changed ? "Cambiamos algunos lugares del recorrido." : "No hay otra opción disponible para estas actividades.");
  }, 650);
});

$("#edit-plan").addEventListener("click", () => $("#planner-form").scrollIntoView({ behavior: "smooth", block: "start" }));

$("#action-save").addEventListener("click", () => {
  if (!currentPlan) return;
  pushRecentPlan({ name: $("#plan-name").textContent, when: new Date().toLocaleString("es-CO", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "short" }) });
  renderHistoryList();
  showToast("Plan guardado en tu historial.");
});

function planSummaryText() {
  if (!currentPlan) return "";
  const lines = [`Entre Clase · ${currentPlan.meta.routeTitle}`, currentPlan.meta.headline, ""];
  currentPlan.steps.forEach(step => {
    if (step.type === "transfer") lines.push(`${formatClock(step.startTime)} – ${step.label} (${step.minutes} min)`);
    else if (step.type === "activity") lines.push(`${formatClock(step.startTime)}–${formatClock(step.endTime)} · ${step.locationName}: ${step.activities.map(a => a.label).join(" + ")}`);
    else lines.push(`${formatClock(step.startTime)}–${formatClock(step.endTime)} · Llegada a ${step.locationName}`);
  });
  return lines.join("\n");
}

$("#action-share").addEventListener("click", async () => {
  const text = planSummaryText();
  if (!text) return;
  if (navigator.share) { try { await navigator.share({ title: "Mi plan en Entre Clase", text }); } catch { /* el usuario canceló */ } }
  else { await copyToClipboard(text); showToast("Tu navegador no soporta compartir directo: copiamos el resumen."); }
});

async function copyToClipboard(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

$("#action-copy").addEventListener("click", async () => {
  const ok = await copyToClipboard(planSummaryText());
  showToast(ok ? "Resumen copiado al portapapeles." : "No pudimos copiar automáticamente; selecciona el texto manualmente.");
});

$("#action-print").addEventListener("click", () => window.print());

$("#route-toggle").addEventListener("click", event => {
  const directions = $("#directions");
  directions.hidden = !directions.hidden;
  event.currentTarget.firstChild.textContent = directions.hidden ? "Ver indicaciones paso a paso " : "Ocultar indicaciones ";
});

/* ---------------------------------------------------------------------- */
/* Guía y accesos rápidos                                                  */
/* ---------------------------------------------------------------------- */
const guide = $("#guide-dialog");
$("#open-guide").addEventListener("click", () => guide.showModal());
$("#close-guide").addEventListener("click", () => guide.close());
$("#start-planning").addEventListener("click", () => { guide.close(); $("#planner-form").scrollIntoView({ behavior: "smooth" }); });
$("#plan-cambas").addEventListener("click", () => {
  if (!state.goals.has("ayuda") && state.goals.size < 4) state.goals.add("ayuda");
  $$('[data-multigroup="needs"] button').forEach(button => { const selected = state.goals.has(button.dataset.value); button.classList.toggle("selected", selected); button.setAttribute("aria-pressed", String(selected)); });
  updateGoalCount();
  $("#planner-form").scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("Añadimos CAMBAS a tus objetivos.");
});

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ---------------------------------------------------------------------- */
/* Directorio de lugares                                                   */
/* ---------------------------------------------------------------------- */
function populateCategoryFilters() {
  const row = $("#place-filters");
  CATEGORIES.forEach(cat => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.filter = cat.id;
    button.textContent = `${cat.icon} ${cat.label}`;
    row.append(button);
  });
}

function distanceFromOrigin(place) {
  if (!place.coordinates) return null;
  const origin = coordinatesOf(locationSelect.value);
  if (!origin.verified) return null;
  return haversineMeters(origin, place.coordinates);
}

function sortPlaces(list) {
  const sorted = [...list];
  if (state.placeSort === "cercania") {
    sorted.sort((a, b) => {
      const da = distanceFromOrigin(a); const db = distanceFromOrigin(b);
      if (da === null && db === null) return 0;
      if (da === null) return 1;
      if (db === null) return -1;
      return da - db;
    });
  } else if (state.placeSort === "categoria") {
    sorted.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  } else if (state.placeSort === "nombre") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}

function mapsSearchUrl(place) {
  if (place.coordinates) return `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, Universidad Icesi, Cali, Colombia`)}`;
}

function renderDirectory() {
  const query = $("#place-search").value.trim().toLocaleLowerCase("es");
  const visible = sortPlaces(LOCATIONS.filter(place => {
    const matchesFilter = state.placeFilter === "todos" || place.category === state.placeFilter;
    return matchesFilter && `${place.name} ${place.description}`.toLocaleLowerCase("es").includes(query);
  }));
  const grid = $("#place-grid");
  grid.replaceChildren();
  if (!visible.length) {
    const empty = document.createElement("p");
    empty.className = "empty-directory";
    empty.textContent = "No encontramos una ubicación con esos filtros.";
    grid.append(empty);
  } else visible.forEach(place => {
    const article = document.createElement("article");
    article.className = "place-card";
    const catInfo = CATEGORIES.find(c => c.id === place.category);
    const type = document.createElement("span"); type.className = "place-type"; type.textContent = catInfo ? catInfo.label.toUpperCase() : place.category.toUpperCase();
    const title = document.createElement("h3"); title.textContent = place.name;
    const text = document.createElement("p"); text.textContent = place.description;

    const badges = document.createElement("div");
    badges.className = "place-badges";
    if (!place.coordinates) { const b = document.createElement("span"); b.className = "unverified-tag"; b.textContent = "Información por verificar"; badges.append(b); }
    const accessBadge = document.createElement("span");
    accessBadge.className = "access-badge";
    accessBadge.textContent = place.accessible === true ? "♿ Accesible confirmado" : "Accesibilidad: no confirmada";
    badges.append(accessBadge);
    const dist = distanceFromOrigin(place);
    if (dist !== null) { const d = document.createElement("span"); d.className = "distance-badge"; d.textContent = `📍 ${formatDistance(Math.round(dist * 1.35))}`; badges.append(d); }
    if (place.openingHours) { const h = document.createElement("span"); h.className = "hours-badge"; h.textContent = place.openingHours; badges.append(h); }

    const actions = document.createElement("div");
    actions.className = "place-actions";
    const addBtn = document.createElement("button");
    addBtn.type = "button"; addBtn.className = "place-add-btn"; addBtn.textContent = "Agregar a mi plan";
    addBtn.addEventListener("click", () => {
      nextLocationSelect.value = place.id;
      refreshValidation();
      persist();
      $("#planner-form").scrollIntoView({ behavior: "smooth", block: "center" });
      showToast(`${place.name} quedó como tu destino final.`);
    });
    const viewBtn = document.createElement("a");
    viewBtn.className = "map-link"; viewBtn.href = mapsSearchUrl(place); viewBtn.target = "_blank"; viewBtn.rel = "noreferrer"; viewBtn.textContent = "Ver ubicación ↗";
    actions.append(addBtn, viewBtn);

    article.append(type, title, text, badges, actions);
    grid.append(article);
  });
  $("#place-count").textContent = `${visible.length} de ${LOCATIONS.length} ubicaciones`;
}

$("#place-search").addEventListener("input", renderDirectory);
$("#place-sort").addEventListener("change", event => { state.placeSort = event.target.value; renderDirectory(); });
$("#place-filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  state.placeFilter = button.dataset.filter;
  $$("#place-filters button").forEach(item => item.classList.toggle("active", item === button));
  renderDirectory();
});
locationSelect.addEventListener("change", () => { renderDirectory(); refreshValidation(); persist(); });
nextLocationSelect.addEventListener("change", () => { refreshValidation(); persist(); });
$$("#planner-form select, #planner-form input").forEach(el => el.addEventListener("change", () => { refreshValidation(); persist(); }));

/* ---------------------------------------------------------------------- */
/* WebMCP: expone el planificador a agentes/asistentes                     */
/* ---------------------------------------------------------------------- */
function selectGoals(goals) {
  if (!Array.isArray(goals) || !goals.length || goals.length > 4 || goals.some(goal => !GOALS[goal])) throw new Error("Elige entre una y cuatro actividades válidas");
  state.goals = new Set(goals);
  $$('[data-multigroup="needs"] button').forEach(button => { const selected = state.goals.has(button.dataset.value); button.classList.toggle("selected", selected); button.setAttribute("aria-pressed", String(selected)); });
  updateGoalCount();
}

function registerWebMCP() {
  const context = document.modelContext;
  if (!context?.registerTool) return;
  const locationIds = LOCATIONS.map(p => p.id);
  context.registerTool({
    name: "create_campus_plan",
    title: "Crear plan personalizado entre clases",
    description: "Combina hasta cuatro actividades, origen, destino y preferencias; actualiza el plan visible, los horarios y la ruta con coordenadas reales.",
    inputSchema: { type: "object", properties: { time: { type: "integer", minimum: 30, maximum: 480 }, origin: { type: "string", enum: locationIds }, destination: { type: "string", enum: locationIds }, goals: { type: "array", minItems: 1, maxItems: 4, uniqueItems: true, items: { type: "string", enum: Object.keys(GOALS) } }, energy: { type: "string", enum: ["baja", "media", "alta"] }, pace: { type: "string", enum: ["tranquilo", "equilibrado", "intenso"] }, budget: { type: "string", enum: ["cero", "bajo", "flexible"] }, ambience: { type: "string", enum: ["silencio", "indiferente", "aire-libre", "grupo"] }, accessible: { type: "boolean" } }, required: ["time", "origin", "destination", "goals", "energy", "pace", "budget", "ambience", "accessible"], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    async execute(input) {
      const isPreset = [30, 60, 120, 180].includes(input.time);
      if (isPreset) selectGroupValue("time", String(input.time));
      else { selectGroupValue("time", "custom"); $("#custom-time").value = input.time; $("#custom-time-wrap").hidden = false; state.time = input.time; }
      selectGroupValue("energy", input.energy);
      selectGoals(input.goals);
      locationSelect.value = input.origin;
      nextLocationSelect.value = input.destination;
      $("#pace").value = input.pace;
      $("#budget").value = input.budget;
      $("#ambience").value = input.ambience;
      $("#accessible").checked = input.accessible;
      updateTimeWindow();
      refreshValidation();
      await generatePlan(false);
      return { origin: input.origin, destination: input.destination, plan: currentPlan.steps.map(({ index, type, locationName, minutes }) => ({ index, type, locationName, minutes })), totalMinutes: currentPlan.meta.realTotalMinutes };
    }
  });
  context.registerTool({
    name: "search_campus_places",
    title: "Buscar lugares del campus",
    description: "Busca edificios, servicios y espacios de bienestar en el directorio de Icesi, con coordenadas cuando están verificadas.",
    inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute({ query }) {
      const q = query.trim().toLocaleLowerCase("es");
      return LOCATIONS.filter(place => `${place.name} ${place.description}`.toLocaleLowerCase("es").includes(q)).slice(0, 10)
        .map(p => ({ id: p.id, name: p.name, category: p.category, description: p.description, coordinates: p.coordinates }));
    }
  });
  context.registerTool({
    name: "read_current_campus_plan",
    title: "Leer plan actual",
    description: "Devuelve las preferencias y los pasos del plan visible actualmente, incluyendo horarios y coordenadas.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute() {
      if (!currentPlan) return { plan: null };
      return { meta: { ...currentPlan.meta, origin: currentPlan.meta.origin?.id, destination: currentPlan.meta.destination?.id }, steps: currentPlan.steps.map(({ index, type, locationId, minutes }) => ({ index, type, locationId, minutes })) };
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Inicialización                                                           */
/* ---------------------------------------------------------------------- */
populateLocations();
populateCategoryFilters();
restoreFormState();
updateTimeWindow();
renumberSections();
updateGoalCount();
refreshValidation();
renderDirectory();
renderHistoryList();
registerWebMCP();
