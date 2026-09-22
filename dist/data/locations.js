// Catálogo único de ubicaciones del campus de la Universidad Icesi.
//
// `coordinates.verified` indica si el punto fue confirmado contra una fuente
// real (OpenStreetMap, api.openstreetmap.org, IDs citados en `source`).
// Cuando no hay coordenada confirmada, `coordinates` es `null`: el resto de
// la app debe usar CAMPUS_CENTER como referencia temporal y jamás inventar
// una latitud/longitud. No se completan campos desconocidos (`openingHours`,
// `accessible`) con información supuesta.

export const CAMPUS_CENTER = {
  lat: 3.3408806,
  lng: -76.5291786,
  source: "Nominatim OSM relation 6784907 (Universidad Icesi)"
};

export const CATEGORIES = [
  { id: "estudio", label: "Estudio", icon: "📚" },
  { id: "alimentacion", label: "Alimentación", icon: "🥪" },
  { id: "bienestar", label: "Bienestar", icon: "☁️" },
  { id: "deporte", label: "Deporte", icon: "🏃" },
  { id: "servicios", label: "Servicios", icon: "🛎" },
  { id: "apoyo-academico", label: "Apoyo académico", icon: "✦" }
];

export const LOCATIONS = [
  {
    id: "edificio-a",
    name: "Edificio A · Tecnoquímicas",
    officialName: "Edificio A",
    category: "servicios",
    description: "Apoyo financiero, contabilidad, MBA y Marketing Zone.",
    coordinates: { lat: 3.3421298, lng: -76.5303004, verified: true },
    entrance: null,
    accessible: null,
    services: ["Apoyo financiero", "Contabilidad", "MBA", "Marketing Zone"],
    openingHours: null,
    source: "OpenStreetMap way/294891930"
  },
  {
    id: "edificio-b",
    name: "Edificio B",
    officialName: "Edificio B",
    category: "estudio",
    description: "Pregrados, posgrados, departamentos y centros de investigación de Negocios.",
    coordinates: { lat: 3.3416956, lng: -76.5303470, verified: true },
    entrance: null,
    accessible: null,
    services: ["Admisiones y registro", "Facultad de economía y negocios"],
    openingHours: null,
    source: "OpenStreetMap way/294891931"
  },
  {
    id: "edificio-c",
    name: "Edificio C · Mayagüez",
    officialName: "Edificio C",
    category: "estudio",
    description: "Centro de Desarrollo del Espíritu Empresarial, Start-Up Café, salas de cómputo y apoyo de inglés.",
    coordinates: { lat: 3.3411191, lng: -76.5302091, verified: true },
    entrance: null,
    accessible: null,
    services: ["CDEE", "Start-Up Café", "Salas de cómputo", "Apoyo de inglés"],
    openingHours: null,
    source: "OpenStreetMap way/294891926"
  },
  {
    id: "edificio-d",
    name: "Edificio D",
    officialName: "Edificio D",
    category: "servicios",
    description: "Tienda Icesi, Auditorio Varela y laboratorio de ciencias cognitiva.",
    coordinates: { lat: 3.3408661, lng: -76.5302952, verified: true },
    entrance: null,
    accessible: null,
    services: ["Tienda Icesi", "Auditorio Varela", "Laboratorio ciencias cognitiva"],
    openingHours: null,
    source: "OpenStreetMap way/674169515"
  },
  {
    id: "edificio-e",
    name: "Edificio E",
    officialName: "Edificio E",
    category: "estudio",
    description: "33 salones, auditorio, sala de audiencias y aulas grupales.",
    coordinates: { lat: 3.3406062, lng: -76.5305588, verified: true },
    entrance: null,
    accessible: null,
    services: ["Salones", "Auditorio", "Sala de audiencias", "Aulas grupales"],
    openingHours: null,
    source: "OpenStreetMap way/843345445"
  },
  {
    id: "edificio-f",
    name: "Edificio F",
    officialName: "Edificio F",
    category: "estudio",
    description: "Salones de diseño y un punto para imprimir en el primer piso.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: ["Salones de diseño", "Punto de impresión"],
    openingHours: null,
    source: null
  },
  {
    id: "edificio-g",
    name: "Edificio G",
    officialName: "Edificio G",
    category: "estudio",
    description: "Coliseo 2, laboratorio de innovación y un punto para imprimir en el primer piso.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: ["Coliseo 2", "Laboratorio de innovación", "Punto de impresión"],
    openingHours: null,
    source: null
  },
  {
    id: "edificio-h-taller",
    name: "Edificio H · Taller de Diseño",
    officialName: "Taller de Diseño",
    category: "estudio",
    description: "Talleres y espacios para crear, diseñar y prototipar.",
    coordinates: { lat: 3.3407142, lng: -76.5293892, verified: true },
    entrance: null,
    accessible: null,
    services: ["Taller de diseño industrial", "Prototipado"],
    openingHours: null,
    source: "OpenStreetMap way/294891959"
  },
  {
    id: "edificio-j",
    name: "Edificio J",
    officialName: "Edificio J",
    category: "servicios",
    description: "Planta física, servicios generales, compras y mantenimiento.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: ["Planta física", "Mantenimiento"],
    openingHours: null,
    source: null
  },
  {
    id: "edificio-k",
    name: "Edificio K",
    officialName: "Edificio K",
    category: "servicios",
    description: "Trámites y vueltas académicas, planeación y reservas de espacios.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: ["Programación académica y registro", "Reserva de espacios"],
    openingHours: null,
    source: null
  },
  {
    id: "edificio-l",
    name: "Edificio L",
    officialName: "Edificio L",
    category: "estudio",
    description: "Laboratorios de ciencias, salud, química, biología e ingeniería.",
    coordinates: { lat: 3.3412776, lng: -76.5294413, verified: true },
    entrance: null,
    accessible: null,
    services: ["Laboratorios de ciencias", "Laboratorios de salud"],
    openingHours: null,
    source: "OpenStreetMap way/294891928"
  },
  {
    id: "edificio-m",
    name: "Edificio M",
    officialName: "Edificio M",
    category: "estudio",
    description: "Estudios de grabación, laboratorios de redes, software e instrumentos musicales.",
    coordinates: { lat: 3.3424451, lng: -76.5303347, verified: true },
    entrance: null,
    accessible: null,
    services: ["Estudio de grabación", "Laboratorio de redes", "Laboratorio HCI"],
    openingHours: null,
    source: "OpenStreetMap way/294891934"
  },
  {
    id: "edificio-n-planta-piloto",
    name: "Edificio N · Planta Piloto",
    officialName: "Edificio N",
    category: "estudio",
    description: "Laboratorios de bioprocesos, química, automatización, fluidos y planta piloto de ingeniería.",
    coordinates: { lat: 3.33965934, lng: -76.52881212, verified: true },
    entrance: null,
    accessible: null,
    services: ["Planta piloto", "Laboratorio de bioprocesos", "Laboratorio de fluidos"],
    openingHours: null,
    source: "OpenStreetMap node/843345441"
  },
  {
    id: "biblioteca",
    name: "Biblioteca",
    officialName: "Biblioteca Icesi",
    category: "estudio",
    description: "Un lugar para estudiar solo o en grupo, y para imprimir tus documentos.",
    coordinates: { lat: 3.3417892, lng: -76.5300524, verified: true },
    entrance: null,
    accessible: null,
    services: ["Estudio individual", "Estudio grupal", "Impresión", "Préstamo de libros"],
    openingHours: null,
    source: "OpenStreetMap way/294891927"
  },
  {
    id: "cafeteria-principal",
    name: "Cafetería Principal",
    officialName: "Cafetería Central",
    category: "alimentacion",
    description: "Comidas, bebidas y un lugar para comer entre clases.",
    coordinates: { lat: 3.3421008, lng: -76.5296134, verified: true },
    entrance: null,
    accessible: null,
    services: ["Comidas", "Bebidas", "Snacks"],
    openingHours: null,
    source: "OpenStreetMap node/6313601671"
  },
  {
    id: "bienestar-universitario",
    name: "Bienestar Universitario",
    officialName: "Edificio Bienestar Estudiantil",
    category: "bienestar",
    description: "Servicios y acompañamiento para la vida universitaria.",
    coordinates: { lat: 3.3406584, lng: -76.5299107, verified: true },
    entrance: null,
    accessible: null,
    services: ["Acompañamiento psicológico", "Objetos perdidos"],
    openingHours: null,
    source: "OpenStreetMap way/294891939"
  },
  {
    id: "auditorios",
    name: "Auditorios",
    officialName: "Auditorios Icesi",
    category: "servicios",
    description: "Charlas y eventos institucionales en los auditorios Manuelita, Sidoc y Valle del Lili.",
    coordinates: { lat: 3.3425525, lng: -76.5297296, verified: true },
    entrance: null,
    accessible: null,
    services: ["Auditorio Manuelita", "Auditorio Sidoc", "Auditorio Valle del Lili"],
    openingHours: null,
    source: "OpenStreetMap node/6313635525"
  },
  {
    id: "cideim",
    name: "CIDEIM",
    officialName: "CIDEIM",
    category: "estudio",
    description: "Investigación científica y laboratorios especializados.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: ["Investigación científica"],
    openingHours: null,
    source: null
  },
  {
    id: "bioterio",
    name: "Bioterio",
    officialName: "Bioterio",
    category: "estudio",
    description: "Instalación de apoyo para investigación en ciencias de la vida.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: ["Apoyo a investigación"],
    openingHours: null,
    source: null
  },
  {
    id: "consultorio-juridico",
    name: "Consultorio Jurídico",
    officialName: "Consultorio Jurídico",
    category: "apoyo-academico",
    description: "Atención y práctica jurídica de la Universidad.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: ["Asesoría jurídica"],
    openingHours: null,
    source: null
  },
  {
    id: "cadi",
    name: "CADI",
    officialName: "Gimnasio Icesi (CADI)",
    category: "deporte",
    description: "Centro Artístico y Deportivo: un lugar para entrenar, nadar y cuidar tu bienestar.",
    coordinates: { lat: 3.3422755, lng: -76.5283462, verified: true },
    entrance: null,
    accessible: null,
    services: ["Gimnasio", "Piscina"],
    openingHours: null,
    source: "OpenStreetMap node/6313628404"
  },
  {
    id: "casa-rocha",
    name: "Casa Rocha",
    officialName: "Casa Rocha",
    category: "servicios",
    description: "Ubicación institucional identificada en el plano del campus.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: [],
    openingHours: null,
    source: null
  },
  {
    id: "casa-orejuela",
    name: "Casa Orejuela",
    officialName: "Casa Orejuela",
    category: "servicios",
    description: "Ubicación institucional identificada en el plano del campus.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: [],
    openingHours: null,
    source: null
  },
  {
    id: "casa-malla",
    name: "Casa Malla",
    officialName: "Casa Malla",
    category: "servicios",
    description: "Ubicación institucional identificada en el plano del campus.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: [],
    openingHours: null,
    source: null
  },
  {
    id: "casa-sae",
    name: "Casa SAE",
    officialName: "Casa SAE",
    category: "servicios",
    description: "Ubicación institucional confirmada en el mapa del campus.",
    coordinates: { lat: 3.3422848, lng: -76.5285619, verified: true },
    entrance: null,
    accessible: null,
    services: [],
    openingHours: null,
    source: "OpenStreetMap way/843345443"
  },
  {
    id: "porterias",
    name: "Porterías 1, 2 y 4",
    officialName: "Porterías",
    category: "servicios",
    description: "Entradas, orientación y control de acceso al campus.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: ["Control de acceso"],
    openingHours: null,
    source: null
  },
  {
    id: "plazoleta",
    name: "Plazoleta y canchas",
    officialName: "La Plazoleta",
    category: "bienestar",
    description: "Encuentro con amigos, descanso, caminata y deporte al aire libre.",
    coordinates: { lat: 3.3409718, lng: -76.5297268, verified: true },
    entrance: null,
    accessible: null,
    services: ["Zonas verdes", "Canchas"],
    openingHours: null,
    source: "OpenStreetMap node/6313628409"
  },
  {
    id: "cambas",
    name: "CAMBAS · Salón 101A",
    officialName: "CAMBAS",
    category: "apoyo-academico",
    description: "Pide ayuda a los monitores en matemáticas y estadística.",
    coordinates: { lat: 3.3421298, lng: -76.5303004, verified: true },
    entrance: null,
    accessible: null,
    services: ["Monitores de matemáticas", "Monitores de estadística", "Préstamo de calculadoras"],
    openingHours: "Lunes a viernes · 9:00 a. m. – 6:00 p. m.",
    source: "Salón 101A confirmado dentro de Edificio A (icesi.edu.co/centros-academicos/cambas + OpenStreetMap way/294891930)"
  },
  {
    id: "sala-boreal",
    name: "Sala Boreal",
    officialName: "Sala Boreal",
    category: "bienestar",
    description: "Un espacio para descansar, meditar o bailar y recuperar energía entre clases.",
    coordinates: null,
    entrance: null,
    accessible: null,
    services: [],
    openingHours: null,
    source: null
  }
];

export const LOCATIONS_BY_ID = new Map(LOCATIONS.map(place => [place.id, place]));

export function getLocation(id) {
  return LOCATIONS_BY_ID.get(id) || null;
}

export function findByName(name) {
  return LOCATIONS.find(place => place.name === name) || null;
}

export function coordinatesOf(idOrName) {
  const place = LOCATIONS_BY_ID.get(idOrName) || findByName(idOrName);
  if (place && place.coordinates) return { lat: place.coordinates.lat, lng: place.coordinates.lng, verified: true };
  return { lat: CAMPUS_CENTER.lat, lng: CAMPUS_CENTER.lng, verified: false };
}
