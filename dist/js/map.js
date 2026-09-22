// Integración de mapa. Usa Leaflet + OpenStreetMap (sin necesidad de una
// llave de API, así que no hay nada que exponer en el frontend) para el mapa
// interactivo con marcadores numerados, y construye el enlace de Google Maps
// usando SIEMPRE coordenadas, nunca nombres sueltos de edificios.

export function buildGoogleMapsUrl({ originCoords, destinationCoords, stopsCoords }) {
  const toParam = c => `${c.lat},${c.lng}`;
  const params = new URLSearchParams({
    api: "1",
    origin: toParam(originCoords),
    destination: toParam(destinationCoords),
    travelmode: "walking"
  });
  if (stopsCoords.length) params.set("waypoints", stopsCoords.map(toParam).join("|"));
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export class CampusMap {
  constructor(container) {
    this.container = container;
    this.map = null;
    this.markers = [];
    this.line = null;
  }

  ensureMap(center) {
    if (this.map || typeof L === "undefined") return;
    this.map = L.map(this.container, { scrollWheelZoom: false }).setView([center.lat, center.lng], 17);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  render(points) {
    // points: [{ lat, lng, label, verified, kind: "origin"|"stop"|"destination" }]
    if (typeof L === "undefined") return false;
    this.ensureMap(points[0]);
    this.markers.forEach(m => m.remove());
    if (this.line) this.line.remove();
    this.markers = points.map((point, index) => {
      const isEndpoint = point.kind === "origin" || point.kind === "destination";
      const color = point.kind === "origin" ? "#00795f" : point.kind === "destination" ? "#062d4d" : "#13a27c";
      const dashed = point.verified === false;
      const icon = L.divIcon({
        className: "map-pin-icon",
        html: `<span class="map-pin-badge" style="background:${color};${dashed ? "border:2px dashed #f3b23c;" : ""}">${isEndpoint ? (point.kind === "origin" ? "A" : "B") : index}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      const marker = L.marker([point.lat, point.lng], { icon }).addTo(this.map);
      marker.bindPopup(`<strong>${point.label}</strong>${point.verified === false ? "<br><em>Ubicación aproximada</em>" : ""}`);
      return marker;
    });
    const latlngs = points.map(p => [p.lat, p.lng]);
    this.line = L.polyline(latlngs, { color: "#00795f", weight: 4, opacity: 0.8, dashArray: "1,8", lineCap: "round" }).addTo(this.map);
    const bounds = L.latLngBounds(latlngs);
    this.map.fitBounds(bounds, { padding: [36, 36] });
    return true;
  }

  focus(index) {
    if (!this.map || !this.markers[index]) return;
    const marker = this.markers[index];
    this.map.panTo(marker.getLatLng());
    marker.openPopup();
    const el = marker.getElement();
    if (el) {
      el.classList.add("map-pin-focus");
      window.setTimeout(() => el.classList.remove("map-pin-focus"), 1200);
    }
  }

  invalidateSize() {
    if (this.map) this.map.invalidateSize();
  }
}
