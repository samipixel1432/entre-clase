// Rutinas guiadas para actividades que necesitan una secuencia de pasos
// (entrenar, bailar, meditar, CAMBAS) en lugar de una sola instrucción.

export const gymExercises = {
  pierna: [{ name: "sentadillas", reps: "15" }, { name: "zancadas alternas", reps: "12 por pierna" }, { name: "puente de glúteo", reps: "15" }, { name: "sentadilla sumo", reps: "12" }, { name: "elevación de talones", reps: "20" }],
  brazo: [{ name: "flexiones de pecho", reps: "12" }, { name: "fondos de tríceps en banca", reps: "12" }, { name: "plancha con toque de hombro", reps: "20 toques" }, { name: "curl con mochila cargada", reps: "15 por brazo" }, { name: "flexiones diamante", reps: "10" }],
  espalda: [{ name: "superman", reps: "15" }, { name: "remo invertido en mesa", reps: "12" }, { name: "plancha lateral", reps: "20s por lado" }, { name: "buenos días con peso corporal", reps: "15" }, { name: "extensión de espalda baja", reps: "15" }],
  cardio: [{ name: "jumping jacks", reps: "40s" }, { name: "burpees", reps: "10" }, { name: "mountain climbers", reps: "40s" }, { name: "sprint en el sitio", reps: "30s" }, { name: "saltos de cuerda imaginaria", reps: "40s" }]
};
gymExercises.full = [gymExercises.pierna[0], gymExercises.brazo[0], gymExercises.cardio[1], gymExercises.espalda[2]];
export const gymFocusLabels = { pierna: "pierna", brazo: "brazo", espalda: "espalda", cardio: "cardio", full: "cuerpo completo" };
export const gymRoutineNames = { pierna: "Leg Day Exprés", brazo: "Upper Body Burner", espalda: "Espalda y Postura", cardio: "HIIT Cardio Circuit", full: "Full Body Express" };
const gymWarmups = {
  pierna: "sentadillas sin peso y balanceos de pierna al frente y al lado",
  brazo: "círculos de hombro y flexiones apoyando las rodillas",
  espalda: "gato-camello y rotaciones suaves de tronco",
  cardio: "jumping jacks suaves y trote en el sitio",
  full: "jumping jacks, sentadillas sin peso y círculos de hombro"
};

export function buildGymRoutine(preferences, minutes) {
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

export const danceStyles = {
  salsa: { label: "salsa caleña", tip: "practica el paso básico contra tiempo y los giros simples; en Cali cualquier tutorial de salsa te sirve para calentar." },
  urbano: { label: "urbano / reggaetón", tip: "sigue una coreografía corta de reggaetón o perreo básico, marcando bien el golpe de cadera." },
  bachata: { label: "bachata", tip: "repite el paso básico de bachata (4 tiempos con el toque de cadera) antes de meterle giros." },
  folclor: { label: "folclor colombiano", tip: "prueba unos pasos de cumbia o mapalé, típicos de las actividades de Artes Escénicas del CADI." },
  zumba: { label: "zumba / cardio dance", tip: "sigue una rutina de zumba de intensidad media-alta para subir el ritmo cardiaco." }
};

export function buildDanceRoutine(preferences, minutes) {
  const m = minutes || 20;
  const style = danceStyles[preferences.danceStyle] || danceStyles.salsa;
  const warmup = m <= 15 ? 2 : 4;
  const freeMinutes = Math.max(5, m - warmup - 8);
  const steps = [
    `Calentamiento (${warmup} min): rota tobillos, cadera y hombros al ritmo de la música.`,
    `Paso base (8 min): ${style.tip}`,
    `Coreografía libre (${freeMinutes} min): pon un tutorial corto de "${style.label} para principiantes" y repítelo 2-3 veces hasta que te salga natural.`
  ];
  return { summary: `Sesión de ${style.label} · ${m} min`, steps };
}

export function buildMindfulRoutine(preferences, minutes) {
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
export const cambasLabels = { matematicas: "Matemáticas", calculo: "Cálculo", algebra: "Álgebra lineal", estadistica: "Estadística" };

export function buildCambasRoutine(preferences) {
  const key = cambasTopics[preferences.cambasSubject] ? preferences.cambasSubject : "matematicas";
  const topic = cambasTopics[key];
  const steps = [
    `Repasa antes de llegar: ${topic.temas}.`,
    `Lleva contigo: ${topic.tarea}`,
    "En la sesión: explícale al monitor qué intentaste y en qué paso te trabaste, no pidas solo la respuesta final."
  ];
  return { summary: `Sesión de ${cambasLabels[key]} en CAMBAS`, steps, bring: topic.tarea };
}
