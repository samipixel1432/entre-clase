// Utilidades geográficas. Las distancias se calculan con la fórmula del
// haversine sobre coordenadas reales (ver data/locations.js) y se corrigen
// con un factor de ruta, porque una línea recta siempre es más corta que un
// camino peatonal real entre dos puntos de un campus.

const EARTH_RADIUS_M = 6371000;
const WALK_SPEED_MPS = 1.2; // paso tranquilo de estudiante con mochila
const ROUTE_FACTOR = 1.35; // compensa que no se camina en línea recta

export function haversineMeters(a, b) {
  const toRad = deg => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function walkingMinutes(a, b) {
  const meters = haversineMeters(a, b) * ROUTE_FACTOR;
  return Math.max(1, Math.round(meters / WALK_SPEED_MPS / 60));
}

export function walkingMeters(a, b) {
  return Math.round(haversineMeters(a, b) * ROUTE_FACTOR);
}

export function formatDistance(meters) {
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// Ordena paradas intermedias por cercanía (vecino más próximo) para evitar
// recorridos de ida y vuelta: siempre empieza en el origen y siempre termina
// justo antes del destino final.
export function orderByProximity(origin, stops, destination) {
  const remaining = [...stops];
  const ordered = [];
  let current = origin;
  while (remaining.length) {
    let bestIndex = 0;
    let bestDist = Infinity;
    remaining.forEach((stop, index) => {
      const d = haversineMeters(current, stop.coords);
      if (d < bestDist) { bestDist = d; bestIndex = index; }
    });
    const [next] = remaining.splice(bestIndex, 1);
    ordered.push(next);
    current = next.coords;
  }
  return ordered;
}
