import { getLocation, coordinatesOf, CAMPUS_CENTER } from "../data/locations.js";
import { haversineMeters, walkingMinutes, walkingMeters, orderByProximity } from "./geo.js";
import { formatClock, formatDuration, addMinutes } from "./time.js";
import { GOALS } from "./goals.js";

const PRIORITY_RANK = { baja: 0, media: 1, alta: 2 };
const MIN_MARGIN = 5;
const MAX_MARGIN = 15;

function marginFor(requestedMinutes, accessible) {
  let margin = accessible ? 14 : 10;
  if (requestedMinutes <= 45) margin = Math.min(margin, 8);
  return Math.max(MIN_MARGIN, Math.min(MAX_MARGIN, margin));
}

function maxActivitiesFor(minutes) {
  return minutes <= 30 ? 1 : minutes <= 60 ? 2 : minutes <= 120 ? 3 : 4;
}

// Agrupa metas que resuelven al mismo lugar en una sola parada, para nunca
// recomendar el mismo sitio dos veces en la misma línea de tiempo.
function groupByLocation(goalKeys, preferences) {
  const groups = [];
  const indexByLocation = new Map();
  goalKeys.forEach(key => {
    const locationId = GOALS[key].place(preferences);
    if (indexByLocation.has(locationId)) {
      groups[indexByLocation.get(locationId)].goalKeys.push(key);
    } else {
      indexByLocation.set(locationId, groups.length);
      groups.push({ locationId, goalKeys: [key] });
    }
  });
  return groups.map(group => {
    const weight = group.goalKeys.reduce((sum, key) => sum + GOALS[key].minutes, 0);
    const priority = group.goalKeys.reduce((max, key) => {
      const rank = PRIORITY_RANK[GOALS[key].priority(preferences)] ?? 1;
      return Math.max(max, rank);
    }, 0);
    const location = getLocation(group.locationId);
    const coords = coordinatesOf(group.locationId);
    return { ...group, weight, priority, location, coords };
  });
}

function buildActivityDetail(key, preferences, minutes) {
  const goal = GOALS[key];
  const action = goal.action(preferences, minutes);
  return {
    goalKey: key,
    icon: goal.icon,
    label: goal.label,
    minutes,
    reason: goal.reason(preferences),
    bring: goal.bring(preferences),
    priority: goal.priority(preferences),
    action
  };
}

function exigenciaLevel(activityCount, totalDistanceMeters, pace) {
  let score = activityCount + totalDistanceMeters / 250;
  if (pace === "intenso") score += 1.5;
  if (pace === "tranquilo") score -= 1;
  if (score <= 2) return "Ligero";
  if (score <= 4.5) return "Moderado";
  return "Exigente";
}

function buildRecommendations(preferences, chosenKeys, warnings, context) {
  const tips = [];
  if (preferences.energy === "baja") tips.push("Tu energía está baja: dejamos menos desplazamientos y priorizamos actividades tranquilas.");
  if (preferences.energy === "alta") tips.push("Con energía alta puedes aprovechar mejor este tiempo: no dudes en caminar más rápido entre paradas.");
  if (preferences.pace === "tranquilo") tips.push("Elegiste ritmo tranquilo: dejamos márgenes amplios, así que no necesitas correr entre actividades.");
  if (preferences.pace === "intenso") tips.push("Con ritmo intenso aprovechamos cada minuto disponible sin poner en riesgo tu puntualidad.");
  if (preferences.budget === "cero") tips.push("Como tu presupuesto es cero, solo incluimos opciones gratuitas del campus.");
  if (preferences.ambience === "silencio") tips.push("Priorizamos la Biblioteca y espacios silenciosos para que puedas concentrarte.");
  if (preferences.ambience === "grupo") tips.push("Buscamos espacios donde puedas conversar o trabajar en equipo sin molestar a otros.");
  if (preferences.accessible) tips.push("Ajustamos la ruta para evitar escaleras; si un tramo no está confirmado como accesible, te lo indicamos en el mapa.");
  if (/parcial|examen|quiz|evalua/i.test(preferences.note || "")) tips.push("Detectamos que mencionas un parcial: priorizamos estudio o CAMBAS y les dimos más tiempo.");
  if (chosenKeys.includes("imprimir")) tips.push("Lleva tu documento listo en USB o por correo para no perder tiempo buscándolo al llegar al punto de impresión.");
  if (warnings.length) tips.push(...warnings);

  const fallbackPool = [
    `En total vas a caminar unos ${context.totalWalkMeters} m: unos zapatos cómodos ayudan.`,
    `Sal con un par de minutos de margen antes de las ${formatClock(context.deadlineTime)}: los pasillos suelen llenarse justo antes de cada hora.`,
    "Guarda este plan antes de salir; podrás retomarlo si recargas la página.",
    `Pon una alarma o recordatorio para salir hacia ${context.destinationName} a tiempo.`,
    "Si algo cambia, usa «Ver otra opción» para recalcular tu plan con las mismas preferencias."
  ];
  let i = 0;
  while (tips.length < 3 && i < fallbackPool.length) { tips.push(fallbackPool[i]); i += 1; }
  return tips.slice(0, 5);
}

export function buildPlan({ originId, destinationId, requestedMinutes, chosenKeys, preferences, now = new Date() }) {
  const origin = getLocation(originId);
  const destination = getLocation(destinationId);
  const originCoords = coordinatesOf(originId);
  const destinationCoords = coordinatesOf(destinationId);

  const margin = marginFor(requestedMinutes, preferences.accessible);
  let groups = groupByLocation(chosenKeys, preferences);
  const omittedGoalKeys = [];
  const warnings = [];

  function computeTransfers(orderedGroups) {
    let cursor = originCoords;
    const legs = [];
    orderedGroups.forEach(group => {
      const minutes = walkingMinutes(cursor, group.coords);
      const meters = walkingMeters(cursor, group.coords);
      legs.push({ minutes, meters });
      cursor = group.coords;
    });
    const finalLeg = { minutes: walkingMinutes(cursor, destinationCoords), meters: walkingMeters(cursor, destinationCoords) };
    return { legs, finalLeg, totalMinutes: legs.reduce((s, l) => s + l.minutes, 0) + finalLeg.minutes };
  }

  let ordered = orderByProximity(originCoords, groups, destinationCoords);
  let transfers = computeTransfers(ordered);
  let usable = requestedMinutes - margin - transfers.totalMinutes;

  // Si no alcanza el tiempo ni para un mínimo razonable por parada, quitamos
  // primero las actividades de menor prioridad (nunca las urgentes).
  while (ordered.length > 1 && usable < ordered.length * 10) {
    let dropIndex = 0;
    ordered.forEach((group, index) => { if (group.priority < ordered[dropIndex].priority) dropIndex = index; });
    const dropped = ordered.splice(dropIndex, 1)[0];
    omittedGoalKeys.push(...dropped.goalKeys);
    ordered = orderByProximity(originCoords, ordered, destinationCoords);
    transfers = computeTransfers(ordered);
    usable = requestedMinutes - margin - transfers.totalMinutes;
  }

  if (usable < 10) warnings.push(`Este hueco queda muy ajustado para caminar hasta ${destination ? destination.name : "tu destino"}. Si puedes, elige menos actividades o un tiempo mayor.`);
  usable = Math.max(0, usable);

  const totalWeight = ordered.reduce((s, g) => s + g.weight, 0) || 1;
  const paceFactor = preferences.pace === "intenso" ? 1.08 : preferences.pace === "tranquilo" ? 0.9 : 1;
  const allocations = ordered.map(g => Math.max(10, Math.round((g.weight / totalWeight) * usable * paceFactor / 5) * 5));
  let allocated = allocations.reduce((a, b) => a + b, 0);
  while (allocated > usable && allocations.some(a => a > 10)) {
    const index = allocations.indexOf(Math.max(...allocations));
    allocations[index] -= 5;
    allocated -= 5;
  }
  if (allocated < usable && allocations.length) allocations[0] += usable - allocated;
  else if (!allocations.length) usable = 0;

  // --- Construcción de la línea de tiempo con horas reales ---
  let clock = now;
  const steps = [];
  let stepNumber = 1;
  let totalWalkMeters = 0;

  ordered.forEach((group, index) => {
    const leg = transfers.legs[index];
    totalWalkMeters += leg.meters;
    if (leg.minutes > 0) {
      const from = index === 0 ? (origin ? origin.name : "tu ubicación") : ordered[index - 1].location?.name;
      const start = clock;
      clock = addMinutes(clock, leg.minutes);
      steps.push({
        index: stepNumber++, type: "transfer",
        label: `Camina hacia ${group.location ? group.location.name : "tu siguiente parada"}`,
        from, minutes: leg.minutes, distanceMeters: leg.meters,
        startTime: start, endTime: clock,
        coords: group.coords
      });
    }
    const minutes = allocations[index];
    const start = clock;
    clock = addMinutes(clock, minutes);
    const activities = group.goalKeys.map(key => buildActivityDetail(key, preferences, minutes));
    steps.push({
      index: stepNumber++, type: "activity",
      locationId: group.locationId,
      locationName: group.location ? group.location.name : "Ubicación por confirmar",
      coords: group.coords,
      verified: group.coords.verified,
      minutes, startTime: start, endTime: clock,
      priority: Object.keys(PRIORITY_RANK)[group.priority],
      activities
    });
  });

  // Tramo final hacia el destino (siempre el último paso).
  totalWalkMeters += transfers.finalLeg.meters;
  const finalStart = clock;
  clock = addMinutes(clock, transfers.finalLeg.minutes + margin);
  steps.push({
    index: stepNumber++, type: "arrival",
    locationId: destinationId,
    locationName: destination ? destination.name : "tu destino",
    coords: destinationCoords,
    verified: destinationCoords.verified,
    walkMinutes: transfers.finalLeg.minutes,
    marginMinutes: margin,
    minutes: transfers.finalLeg.minutes + margin,
    startTime: finalStart, endTime: clock,
    action: preferences.accessible ? "Llega por una ruta accesible y con margen antes de tu clase." : "Llega con tiempo antes de tu siguiente clase."
  });

  const activityMinutes = allocations.reduce((a, b) => a + b, 0);
  const realTotalMinutes = activityMinutes + transfers.totalMinutes + margin;
  const chosenGoalKeys = ordered.flatMap(g => g.goalKeys);

  if (omittedGoalKeys.length) {
    const label = omittedGoalKeys.length === 1 ? GOALS[omittedGoalKeys[0]].label : `${omittedGoalKeys.length} actividades`;
    warnings.unshift(`${label} ${omittedGoalKeys.length === 1 ? "quedó" : "quedaron"} para tu próximo tiempo libre: no alcanzaba el tiempo disponible.`);
  }

  const recommendations = buildRecommendations(preferences, chosenGoalKeys, warnings.slice(omittedGoalKeys.length ? 1 : 0), {
    totalWalkMeters: Math.round(totalWalkMeters),
    deadlineTime: addMinutes(now, requestedMinutes),
    destinationName: destination ? destination.name : "tu destino"
  });

  const stopNames = ordered.map(g => g.location ? g.location.name : "?");
  const routeTitle = [origin ? origin.name : "?", ...stopNames, destination ? destination.name : "?"].join(" → ");

  const paceLabel = { tranquilo: "tranquilo", equilibrado: "equilibrado", intenso: "intenso" }[preferences.pace] || preferences.pace;
  const activityWord = chosenGoalKeys.length === 1 ? "actividad" : "actividades";
  const headline = `Organizamos un plan ${paceLabel} de ${formatDuration(requestedMinutes)} para que puedas ${ordered.map(g => g.goalKeys.map(k => GOALS[k].label.toLowerCase()).join(" y ")).join(", ")} y llegar con tiempo a ${destination ? destination.name : "tu destino"}. Dejamos un margen de seguridad de ${margin} min antes de tu clase.`;

  return {
    meta: {
      startTime: now,
      endTime: clock,
      deadlineTime: addMinutes(now, requestedMinutes),
      requestedMinutes,
      realTotalMinutes,
      origin, destination,
      originCoords, destinationCoords,
      goalsCount: chosenGoalKeys.length,
      energy: preferences.energy, pace: preferences.pace, budget: preferences.budget,
      ambience: preferences.ambience, accessible: preferences.accessible,
      headline,
      omittedCount: omittedGoalKeys.length,
      warnings,
      routeTitle,
      activityWord
    },
    steps,
    summary: {
      activityMinutes,
      walkMinutes: transfers.totalMinutes,
      marginMinutes: margin,
      totalDistanceMeters: totalWalkMeters,
      exigencia: exigenciaLevel(chosenGoalKeys.length, totalWalkMeters, preferences.pace)
    },
    recommendations,
    route: {
      originCoords, destinationCoords,
      stops: ordered.map(g => g.coords),
      allVerified: originCoords.verified && destinationCoords.verified && ordered.every(g => g.coords.verified)
    }
  };
}

export { marginFor, maxActivitiesFor, formatClock, formatDuration };
