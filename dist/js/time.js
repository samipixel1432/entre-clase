// Formato de horas y duraciones en español.

export function formatClock(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? "p. m." : "a. m.";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  const hourLabel = `${hours} ${hours === 1 ? "hora" : "horas"}`;
  return rest ? `${hourLabel} ${rest} min` : hourLabel;
}

export function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}
