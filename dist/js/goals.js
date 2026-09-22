import { buildGymRoutine, buildDanceRoutine, buildMindfulRoutine, buildCambasRoutine, gymExercises, danceStyles, cambasLabels } from "./routines.js";

// Alterna entre dos ubicaciones posibles según una condición y el flag
// `alternate` (usado por "Ver otra opción"), de forma que el botón siempre
// tenga un efecto real cuando existen dos opciones válidas para una meta.
function altPick(condition, primary, secondary, alternate) {
  return condition !== alternate ? primary : secondary;
}

function hasUrgentNote(preferences) {
  return /parcial|examen|quiz|evalua/i.test(preferences.note || "");
}

export const GOALS = {
  comer: {
    icon: "🥪", label: "Comer", minutes: 25, priorityBase: "media",
    place: p => altPick(p.budget === "cero", "plazoleta", "cafeteria-principal", p.alternate),
    reason: p => p.budget === "cero" ? "Es un espacio abierto y gratuito, ideal si trajiste tu propia comida." : "Tiene variedad de comida rápida a poca distancia de tu recorrido.",
    action: p => p.budget === "cero" ? "Come lo que llevaste y toma agua." : "Haz una pausa para comer sin afán.",
    bring: p => p.budget === "cero" ? "Tu lonchera o snack y una botella de agua." : "Efectivo o tarjeta (aprox. $10.000–$15.000).",
    priority: () => "media"
  },
  estudiar: {
    icon: "📚", label: "Estudiar", minutes: 35, priorityBase: "media",
    place: p => altPick(p.ambience === "grupo", "edificio-e", "biblioteca", p.alternate),
    reason: p => p.ambience === "grupo" ? "Tiene aulas grupales para avanzar con tu equipo sin molestar a otros." : "Es el lugar más silencioso del campus para concentrarte.",
    action: p => p.ambience === "grupo" ? "Avanza con tu equipo en un aula grupal." : "Trabaja una tarea concreta con foco.",
    bring: () => "Tu computador o cuadernos y los materiales del curso.",
    priority: p => hasUrgentNote(p) ? "alta" : "media"
  },
  descansar: {
    icon: "☁️", label: "Descansar", minutes: 20, priorityBase: "baja",
    place: p => altPick(p.ambience === "aire-libre", "plazoleta", "sala-boreal", p.alternate),
    reason: p => p.ambience === "aire-libre" ? "Aire libre y espacio verde para desconectar unos minutos." : "Un espacio pensado para bajar revoluciones entre clases.",
    action: (p, minutes) => p.alarmEnabled ? `Recuéstate o cierra los ojos; programamos tu alarma para que suene en ${p.alarmMinutes} min.` : "Baja el ritmo y recupera energía.",
    bring: () => "Audífonos si quieres poner música suave.",
    priority: () => "baja"
  },
  ayuda: {
    icon: "✦", label: "Pedir ayuda", minutes: 35, priorityBase: "alta",
    place: () => "cambas",
    reason: () => "CAMBAS tiene monitores especializados en matemáticas y estadística.",
    action: p => buildCambasRoutine(p),
    bring: p => buildCambasRoutine(p).bring,
    priority: p => hasUrgentNote(p) ? "alta" : "media"
  },
  entrenar: {
    icon: "↗", label: "Entrenar", minutes: 35, priorityBase: "media",
    place: () => "cadi",
    reason: () => "Es el gimnasio del campus, con implementos y espacio para entrenar.",
    action: (p, minutes) => buildGymRoutine(p, minutes),
    bring: () => "Ropa y zapatos deportivos, y una toalla pequeña.",
    priority: () => "media",
    focusOptions: Object.keys(gymExercises)
  },
  bailar: {
    icon: "💃", label: "Bailar", minutes: 30, priorityBase: "baja",
    place: p => altPick(p.ambience === "aire-libre", "plazoleta", "sala-boreal", p.alternate),
    reason: () => "Espacio con lugar suficiente para moverte sin tropezar con nadie.",
    action: (p, minutes) => buildDanceRoutine(p, minutes),
    bring: () => "Ropa cómoda y audífonos o parlante pequeño.",
    priority: () => "baja",
    styleOptions: Object.keys(danceStyles)
  },
  meditar: {
    icon: "🧘", label: "Meditar", minutes: 20, priorityBase: "baja",
    place: () => "sala-boreal",
    reason: () => "Es un espacio tranquilo pensado para desconectar entre clases.",
    action: (p, minutes) => buildMindfulRoutine(p, minutes),
    bring: () => "Audífonos si prefieres una guía de audio.",
    priority: () => "baja"
  },
  crear: {
    icon: "🎨", label: "Crear", minutes: 30, priorityBase: "baja",
    place: () => "edificio-h-taller",
    reason: () => "El Taller de Diseño tiene mesas y espacio libre para prototipar.",
    action: () => "Dibuja, escribe o experimenta libremente con lo que tengas a mano.",
    bring: () => "Tus materiales de trabajo (cuaderno, tableta, herramientas).",
    priority: () => "baja"
  },
  socializar: {
    icon: "☺", label: "Ver amigos", minutes: 25, priorityBase: "baja",
    place: p => altPick(p.ambience === "aire-libre", "plazoleta", "cafeteria-principal", p.alternate),
    reason: () => "Es un punto de encuentro natural entre clases.",
    action: () => "Conversa y desconéctate un momento.",
    bring: () => "Nada especial: solo tu tiempo.",
    priority: () => "baja"
  },
  imprimir: {
    icon: "▤", label: "Imprimir", minutes: 15, priorityBase: "alta",
    place: p => p.alternate ? "edificio-c" : "biblioteca",
    reason: p => p.alternate ? "Edificio C tiene salas de cómputo con impresoras cerca de tu recorrido." : "La Biblioteca tiene el punto de impresión más completo del campus.",
    action: () => "Imprime y revisa lo necesario para tu clase.",
    bring: () => "Tu documento listo (USB o correo) y saldo de impresión si lo necesitas.",
    priority: () => "alta"
  },
  diligencia: {
    icon: "✓", label: "Hacer una vuelta", minutes: 20, priorityBase: "media",
    place: p => p.alternate ? "edificio-k" : "edificio-b",
    reason: p => p.alternate ? "Edificio K concentra planeación académica y reserva de espacios." : "Edificio B tiene admisiones, registro y trámites de programa.",
    action: () => "Resuelve tu trámite o consulta pendiente.",
    bring: () => "Tu carné y los documentos de tu trámite.",
    priority: () => "media"
  }
};

export function goalPlace(key, preferences) {
  return GOALS[key].place(preferences);
}
