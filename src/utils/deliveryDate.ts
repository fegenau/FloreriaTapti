// Días mínimos de preparación para despacho normal
export const MIN_DELIVERY_DAYS = 1;

export const DELIVERY_DATE_MESSAGE_PREFIX = "Necesitamos 24 horas de preparación.";

// Fecha mínima de despacho (YYYY-MM-DD) calculada en hora de Chile,
// para que cliente y servidor coincidan sin importar la zona del dispositivo.
export function getMinDeliveryDate(): string {
  const todayChile = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Santiago",
  });
  const [y, m, d] = todayChile.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + MIN_DELIVERY_DAYS));
  return date.toISOString().slice(0, 10);
}

// Las fechas YYYY-MM-DD se comparan correctamente como string
export function isValidDeliveryDate(value: string | null | undefined): boolean {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return value >= getMinDeliveryDate();
}

export function formatDeliveryDate(value: string): string {
  const [y, m, d] = value.split("-");
  return `${d}-${m}-${y}`;
}
